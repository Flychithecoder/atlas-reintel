// ---------------------------------------------------------------------------
// Email template types
// ---------------------------------------------------------------------------

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

type Language = 'en' | 'es'

// ---------------------------------------------------------------------------
// Shared layout wrapper
// ---------------------------------------------------------------------------

function wrapLayout(body: string, preheader: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ATLAS</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; color: #18181b; }
    .preheader { display: none !important; max-height: 0; overflow: hidden; mso-hide: all; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background-color: #2563eb; padding: 24px 32px; }
    .header-logo { color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 2px; text-decoration: none; }
    .content { padding: 32px; }
    .content h1 { font-size: 22px; margin: 0 0 16px; color: #18181b; }
    .content p { font-size: 15px; line-height: 1.6; margin: 0 0 16px; color: #3f3f46; }
    .cta-btn { display: inline-block; padding: 12px 28px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; }
    .footer { padding: 24px 32px; background-color: #f4f4f5; text-align: center; font-size: 12px; color: #71717a; }
    .footer a { color: #71717a; text-decoration: underline; }
    .divider { border: none; border-top: 1px solid #e4e4e7; margin: 24px 0; }
    .highlight { background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 16px; margin: 16px 0; border-radius: 0 6px 6px 0; }
    .highlight p { margin: 0; color: #1e40af; }
  </style>
</head>
<body>
  <span class="preheader">${preheader}</span>
  <div class="container">
    <div class="header">
      <a href="#" class="header-logo">ATLAS</a>
    </div>
    <div class="content">
      ${body}
    </div>
    <div class="footer">
      <p>ATLAS Real Estate Intelligence</p>
      <p style="margin-top:8px;">
        <a href="{{{unsubscribe_url}}}">Unsubscribe</a> | <a href="{{{preferences_url}}}">Manage Preferences</a>
      </p>
      <p style="margin-top:8px;">&copy; ${new Date().getFullYear()} ATLAS. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`
}

// ---------------------------------------------------------------------------
// 1. Seller Outreach
// ---------------------------------------------------------------------------

export interface SellerOutreachParams {
  ownerName: string
  propertyAddress: string
  estimatedValue: number
  marketTrend: string
  agentName: string
  agentPhone: string
  ctaUrl: string
}

export function sellerOutreachTemplate(
  params: SellerOutreachParams,
  language: Language = 'en'
): EmailTemplate {
  const {
    ownerName,
    propertyAddress,
    estimatedValue,
    marketTrend,
    agentName,
    agentPhone,
    ctaUrl,
  } = params

  const valueFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(estimatedValue)

  if (language === 'es') {
    const subject = `${ownerName}, oportunidad de mercado para ${propertyAddress}`
    const html = wrapLayout(
      `<h1>Hola ${ownerName},</h1>
       <p>Le contactamos porque hemos identificado actividad significativa en el mercado alrededor de su propiedad en <strong>${propertyAddress}</strong>.</p>
       <div class="highlight"><p>Valor estimado actual: <strong>${valueFormatted}</strong></p></div>
       <p>Tendencia del mercado: ${marketTrend}</p>
       <p>Nuestro equipo de inteligencia de datos ha detectado indicadores que sugieren que este puede ser un momento oportuno para explorar sus opciones.</p>
       <p style="text-align:center;margin:32px 0;">
         <a href="${ctaUrl}" class="cta-btn">Ver Analisis de Mercado</a>
       </p>
       <hr class="divider" />
       <p>Atentamente,<br/><strong>${agentName}</strong><br/>${agentPhone}</p>`,
      `Oportunidad de mercado para su propiedad en ${propertyAddress}`
    )
    const text = `Hola ${ownerName},\n\nLe contactamos porque hemos identificado actividad significativa en el mercado alrededor de su propiedad en ${propertyAddress}.\n\nValor estimado actual: ${valueFormatted}\nTendencia del mercado: ${marketTrend}\n\nVer analisis: ${ctaUrl}\n\nAtentamente,\n${agentName}\n${agentPhone}`
    return { subject, html, text }
  }

  const subject = `${ownerName}, market opportunity for ${propertyAddress}`
  const html = wrapLayout(
    `<h1>Hello ${ownerName},</h1>
     <p>We're reaching out because our data intelligence platform has identified significant market activity around your property at <strong>${propertyAddress}</strong>.</p>
     <div class="highlight"><p>Current estimated value: <strong>${valueFormatted}</strong></p></div>
     <p>Market trend: ${marketTrend}</p>
     <p>Our team has detected indicators that suggest this may be an opportune time to explore your options. We'd love to share a complimentary market analysis with you.</p>
     <p style="text-align:center;margin:32px 0;">
       <a href="${ctaUrl}" class="cta-btn">View Market Analysis</a>
     </p>
     <hr class="divider" />
     <p>Best regards,<br/><strong>${agentName}</strong><br/>${agentPhone}</p>`,
    `Market opportunity for your property at ${propertyAddress}`
  )
  const text = `Hello ${ownerName},\n\nWe're reaching out because our data intelligence platform has identified significant market activity around your property at ${propertyAddress}.\n\nCurrent estimated value: ${valueFormatted}\nMarket trend: ${marketTrend}\n\nView analysis: ${ctaUrl}\n\nBest regards,\n${agentName}\n${agentPhone}`
  return { subject, html, text }
}

// ---------------------------------------------------------------------------
// 2. Buyer Match
// ---------------------------------------------------------------------------

export interface BuyerMatchParams {
  buyerName: string
  propertyAddress: string
  propertyType: string
  price: number
  sqft: number
  matchScore: number
  ctaUrl: string
}

export function buyerMatchTemplate(
  params: BuyerMatchParams,
  language: Language = 'en'
): EmailTemplate {
  const {
    buyerName,
    propertyAddress,
    propertyType,
    price,
    sqft,
    matchScore,
    ctaUrl,
  } = params

  const priceFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
  const sqftFormatted = new Intl.NumberFormat('en-US').format(sqft)

  if (language === 'es') {
    const subject = `Nueva propiedad compatible: ${propertyAddress}`
    const html = wrapLayout(
      `<h1>Hola ${buyerName},</h1>
       <p>Hemos encontrado una propiedad que coincide con sus criterios de busqueda.</p>
       <div class="highlight">
         <p><strong>${propertyAddress}</strong></p>
         <p>Tipo: ${propertyType} | Precio: ${priceFormatted} | ${sqftFormatted} sq ft</p>
         <p>Puntuacion de compatibilidad: <strong>${matchScore}%</strong></p>
       </div>
       <p style="text-align:center;margin:32px 0;">
         <a href="${ctaUrl}" class="cta-btn">Ver Propiedad</a>
       </p>`,
      `Nueva propiedad compatible encontrada: ${propertyAddress}`
    )
    const text = `Hola ${buyerName},\n\nHemos encontrado una propiedad que coincide con sus criterios.\n\n${propertyAddress}\nTipo: ${propertyType} | Precio: ${priceFormatted} | ${sqftFormatted} sq ft\nCompatibilidad: ${matchScore}%\n\nVer propiedad: ${ctaUrl}`
    return { subject, html, text }
  }

  const subject = `New property match: ${propertyAddress}`
  const html = wrapLayout(
    `<h1>Hi ${buyerName},</h1>
     <p>We've found a property that matches your search criteria.</p>
     <div class="highlight">
       <p><strong>${propertyAddress}</strong></p>
       <p>Type: ${propertyType} | Price: ${priceFormatted} | ${sqftFormatted} sq ft</p>
       <p>Match score: <strong>${matchScore}%</strong></p>
     </div>
     <p style="text-align:center;margin:32px 0;">
       <a href="${ctaUrl}" class="cta-btn">View Property</a>
     </p>`,
    `New property match found: ${propertyAddress}`
  )
  const text = `Hi ${buyerName},\n\nWe've found a property that matches your search criteria.\n\n${propertyAddress}\nType: ${propertyType} | Price: ${priceFormatted} | ${sqftFormatted} sq ft\nMatch score: ${matchScore}%\n\nView property: ${ctaUrl}`
  return { subject, html, text }
}

// ---------------------------------------------------------------------------
// 3. Tenant Space Available
// ---------------------------------------------------------------------------

export interface TenantSpaceParams {
  tenantName: string
  spaceAddress: string
  spaceType: string
  sqft: number
  monthlyRent: number
  availableDate: string
  ctaUrl: string
}

export function tenantSpaceTemplate(
  params: TenantSpaceParams,
  language: Language = 'en'
): EmailTemplate {
  const {
    tenantName,
    spaceAddress,
    spaceType,
    sqft,
    monthlyRent,
    availableDate,
    ctaUrl,
  } = params

  const rentFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(monthlyRent)
  const sqftFormatted = new Intl.NumberFormat('en-US').format(sqft)

  if (language === 'es') {
    const subject = `Espacio disponible: ${spaceAddress}`
    const html = wrapLayout(
      `<h1>Hola ${tenantName},</h1>
       <p>Un nuevo espacio que coincide con sus requisitos esta disponible.</p>
       <div class="highlight">
         <p><strong>${spaceAddress}</strong></p>
         <p>Tipo: ${spaceType} | ${sqftFormatted} sq ft | ${rentFormatted}/mes</p>
         <p>Disponible: ${availableDate}</p>
       </div>
       <p style="text-align:center;margin:32px 0;">
         <a href="${ctaUrl}" class="cta-btn">Ver Espacio</a>
       </p>`,
      `Espacio disponible en ${spaceAddress}`
    )
    const text = `Hola ${tenantName},\n\nNuevo espacio disponible:\n${spaceAddress}\nTipo: ${spaceType} | ${sqftFormatted} sq ft | ${rentFormatted}/mes\nDisponible: ${availableDate}\n\nVer espacio: ${ctaUrl}`
    return { subject, html, text }
  }

  const subject = `Space available: ${spaceAddress}`
  const html = wrapLayout(
    `<h1>Hi ${tenantName},</h1>
     <p>A new space matching your requirements is available.</p>
     <div class="highlight">
       <p><strong>${spaceAddress}</strong></p>
       <p>Type: ${spaceType} | ${sqftFormatted} sq ft | ${rentFormatted}/mo</p>
       <p>Available: ${availableDate}</p>
     </div>
     <p style="text-align:center;margin:32px 0;">
       <a href="${ctaUrl}" class="cta-btn">View Space</a>
     </p>`,
    `Space available at ${spaceAddress}`
  )
  const text = `Hi ${tenantName},\n\nNew space available:\n${spaceAddress}\nType: ${spaceType} | ${sqftFormatted} sq ft | ${rentFormatted}/mo\nAvailable: ${availableDate}\n\nView space: ${ctaUrl}`
  return { subject, html, text }
}

// ---------------------------------------------------------------------------
// 4. Listing Pitch Email
// ---------------------------------------------------------------------------

export interface ListingPitchParams {
  ownerName: string
  propertyAddress: string
  headline: string
  valueProposition: string
  suggestedListPrice: number
  projectedDOM: number
  agentName: string
  agentPhone: string
  ctaUrl: string
}

export function listingPitchTemplate(
  params: ListingPitchParams,
  language: Language = 'en'
): EmailTemplate {
  const {
    ownerName,
    propertyAddress,
    headline,
    valueProposition,
    suggestedListPrice,
    projectedDOM,
    agentName,
    agentPhone,
    ctaUrl,
  } = params

  const priceFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(suggestedListPrice)

  if (language === 'es') {
    const subject = `Propuesta de listado: ${propertyAddress}`
    const html = wrapLayout(
      `<h1>${headline}</h1>
       <p>Estimado/a ${ownerName},</p>
       <p>${valueProposition}</p>
       <div class="highlight">
         <p>Precio sugerido de lista: <strong>${priceFormatted}</strong></p>
         <p>Dias proyectados en el mercado: <strong>${projectedDOM}</strong></p>
       </div>
       <p style="text-align:center;margin:32px 0;">
         <a href="${ctaUrl}" class="cta-btn">Ver Propuesta Completa</a>
       </p>
       <hr class="divider" />
       <p>Atentamente,<br/><strong>${agentName}</strong><br/>${agentPhone}</p>`,
      `Propuesta de listado para ${propertyAddress}`
    )
    const text = `${headline}\n\nEstimado/a ${ownerName},\n\n${valueProposition}\n\nPrecio sugerido: ${priceFormatted}\nDias proyectados: ${projectedDOM}\n\nVer propuesta: ${ctaUrl}\n\nAtentamente,\n${agentName}\n${agentPhone}`
    return { subject, html, text }
  }

  const subject = `Listing proposal: ${propertyAddress}`
  const html = wrapLayout(
    `<h1>${headline}</h1>
     <p>Dear ${ownerName},</p>
     <p>${valueProposition}</p>
     <div class="highlight">
       <p>Suggested list price: <strong>${priceFormatted}</strong></p>
       <p>Projected days on market: <strong>${projectedDOM}</strong></p>
     </div>
     <p style="text-align:center;margin:32px 0;">
       <a href="${ctaUrl}" class="cta-btn">View Full Proposal</a>
     </p>
     <hr class="divider" />
     <p>Best regards,<br/><strong>${agentName}</strong><br/>${agentPhone}</p>`,
    `Listing proposal for ${propertyAddress}`
  )
  const text = `${headline}\n\nDear ${ownerName},\n\n${valueProposition}\n\nSuggested list price: ${priceFormatted}\nProjected days on market: ${projectedDOM}\n\nView proposal: ${ctaUrl}\n\nBest regards,\n${agentName}\n${agentPhone}`
  return { subject, html, text }
}

// ---------------------------------------------------------------------------
// 5. Follow-Up
// ---------------------------------------------------------------------------

export interface FollowUpParams {
  recipientName: string
  subject: string
  body: string
  ctaText?: string
  ctaUrl?: string
  senderName: string
  senderPhone?: string
}

export function followUpTemplate(
  params: FollowUpParams,
  language: Language = 'en'
): EmailTemplate {
  const {
    recipientName,
    subject,
    body,
    ctaText,
    ctaUrl,
    senderName,
    senderPhone,
  } = params

  const greeting = language === 'es' ? 'Hola' : 'Hi'
  const signOff = language === 'es' ? 'Atentamente' : 'Best regards'

  const ctaBlock =
    ctaText && ctaUrl
      ? `<p style="text-align:center;margin:32px 0;">
           <a href="${ctaUrl}" class="cta-btn">${ctaText}</a>
         </p>`
      : ''

  const html = wrapLayout(
    `<h1>${greeting} ${recipientName},</h1>
     <p>${body.replace(/\n/g, '</p><p>')}</p>
     ${ctaBlock}
     <hr class="divider" />
     <p>${signOff},<br/><strong>${senderName}</strong>${senderPhone ? `<br/>${senderPhone}` : ''}</p>`,
    subject
  )

  const text = `${greeting} ${recipientName},\n\n${body}${ctaUrl ? `\n\n${ctaText}: ${ctaUrl}` : ''}\n\n${signOff},\n${senderName}${senderPhone ? `\n${senderPhone}` : ''}`

  return { subject, html, text }
}

// ---------------------------------------------------------------------------
// Template resolver — maps template name to builder
// ---------------------------------------------------------------------------

export type TemplateName =
  | 'seller-outreach'
  | 'buyer-match'
  | 'tenant-space'
  | 'listing-pitch'
  | 'follow-up'

export function resolveTemplate(
  name: TemplateName,
  params: Record<string, unknown>,
  language: Language = 'en'
): EmailTemplate | null {
  switch (name) {
    case 'seller-outreach':
      return sellerOutreachTemplate(
        params as unknown as SellerOutreachParams,
        language
      )
    case 'buyer-match':
      return buyerMatchTemplate(
        params as unknown as BuyerMatchParams,
        language
      )
    case 'tenant-space':
      return tenantSpaceTemplate(
        params as unknown as TenantSpaceParams,
        language
      )
    case 'listing-pitch':
      return listingPitchTemplate(
        params as unknown as ListingPitchParams,
        language
      )
    case 'follow-up':
      return followUpTemplate(params as unknown as FollowUpParams, language)
    default:
      return null
  }
}
