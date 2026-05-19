import { getOpenRouterClient, getModel, isAIConfigured } from '@/lib/ai/openrouter'
import {
  buildListingPitchPrompt,
  type ListingPitchParams,
} from '@/lib/ai/prompts/listing-pitch'

function generateMockPitch(params: ListingPitchParams) {
  const { property, owner, language, style, market } = params
  const suggestedPrice = Math.round(property.estimatedValue * 1.04)
  const domMap = { FL: 28, PR: 35, DR: 42 }
  const projectedDOM = domMap[market]

  if (language === 'es') {
    const headlines: Record<string, string> = {
      'market-expert': `${owner.name}, su propiedad en ${property.address} esta en un momento ideal de mercado`,
      'data-driven': `Analisis de valor: ${property.address} supera el promedio del mercado en un 8%`,
      'relationship-first': `${owner.name}, me encantaria ayudarle a maximizar el valor de su propiedad`,
    }
    return {
      headline: headlines[style],
      valueProposition: `El mercado de ${market === 'DR' ? 'Republica Dominicana' : market === 'PR' ? 'Puerto Rico' : 'Sur de Florida'} muestra fuerte demanda para propiedades de tipo ${property.propertyType}. Con ${owner.ownershipTenure} anos de propiedad, su posicion de equidad es solida para capitalizar.`,
      marketAnalysis: `El inventario actual esta en minimos historicos con una tasa de absorcion de 2.1 meses. Propiedades similares se venden en un promedio de ${projectedDOM} dias con un precio por pie cuadrado 12% superior al ano anterior.`,
      suggestedListPrice: suggestedPrice,
      projectedDOM,
      callToAction: `Me gustaria presentarle un analisis completo del mercado. Tengo disponibilidad esta semana para una reunion de 20 minutos, presencial o virtual.`,
    }
  }

  const headlines: Record<string, string> = {
    'market-expert': `${owner.name}, your property at ${property.address} is perfectly positioned in today's market`,
    'data-driven': `Value analysis: ${property.address} outperforms the market average by 8%`,
    'relationship-first': `${owner.name}, I'd love to help you maximize your property's potential`,
  }

  return {
    headline: headlines[style],
    valueProposition: `The ${market === 'DR' ? 'Dominican Republic' : market === 'PR' ? 'Puerto Rico' : 'South Florida'} market is showing strong demand for ${property.propertyType} properties. With ${owner.ownershipTenure} years of ownership, your equity position is strong to capitalize on current conditions.`,
    marketAnalysis: `Current inventory is at historic lows with an absorption rate of 2.1 months. Similar properties are selling in an average of ${projectedDOM} days with price per square foot up 12% year-over-year.`,
    suggestedListPrice: suggestedPrice,
    projectedDOM,
    callToAction: `I'd like to present you with a complete market analysis. I have availability this week for a 20-minute meeting, in person or virtual.`,
  }
}

export async function POST(request: Request) {
  let params: ListingPitchParams

  try {
    params = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!params.property || !params.owner) {
    return Response.json(
      { error: 'property and owner are required' },
      { status: 400 }
    )
  }

  // Defaults
  params.language = params.language || 'en'
  params.style = params.style || 'market-expert'
  params.market = params.market || 'FL'

  if (!isAIConfigured()) {
    return Response.json({
      pitch: generateMockPitch(params),
      source: 'mock',
    })
  }

  try {
    const messages = buildListingPitchPrompt(params)

    const completion = await getOpenRouterClient().chat.completions.create({
      model: getModel('pitch'),
      messages,
      max_tokens: 1500,
      temperature: 0.7,
    })

    const raw = completion.choices[0]?.message?.content || ''

    let pitch: unknown
    try {
      // Extract JSON from potential markdown code fences
      const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, raw]
      pitch = JSON.parse(jsonMatch[1]!.trim())
    } catch {
      // If JSON parsing fails, return raw text as a fallback
      pitch = {
        headline: 'Generated pitch',
        valueProposition: raw,
        marketAnalysis: '',
        suggestedListPrice: Math.round(params.property.estimatedValue * 1.04),
        projectedDOM: 30,
        callToAction: '',
      }
    }

    return Response.json({
      pitch,
      source: 'ai',
      model: getModel('pitch'),
      usage: completion.usage,
    })
  } catch (err) {
    // Fall back to mock on AI error
    const message = err instanceof Error ? err.message : 'AI request failed'
    return Response.json({
      pitch: generateMockPitch(params),
      source: 'mock',
      error: message,
    })
  }
}
