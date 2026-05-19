import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/helpers'
import { createClient } from '@/lib/supabase/server'
import { generateDashboardStats } from '@/lib/mock-data'

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      
      const supabase = await createClient()

      // Aggregate counts from the database
      const [
        { count: totalLeads },
        { count: hotLeads },
        { count: warmLeads },
        { count: coldLeads },
        { count: dealsInPipeline },
        { count: meetingsScheduled },
      ] = await Promise.all([
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('score_label', 'Hot'),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('score_label', 'Warm'),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('score_label', 'Cold'),
        supabase.from('leads').select('*', { count: 'exact', head: true }).in('status', ['Negotiating', 'Under Contract']),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'Meeting'),
      ])

      // Leads contacted today
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const { count: leadsContactedToday } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .gte('last_contact_date', today.toISOString())

      // Pipeline value — sum estimated_value of deals in pipeline
      const { data: pipelineData } = await supabase
        .from('leads')
        .select('property:properties(estimated_value)')
        .in('status', ['Negotiating', 'Under Contract'])

      const pipelineValue = (pipelineData || []).reduce(
        (sum: number, lead: { property: { estimated_value?: number } | null }) =>
          sum + ((lead.property as { estimated_value?: number } | null)?.estimated_value || 0),
        0
      )

      // Conversion rate
      const { count: closedCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Closed')

      const total = totalLeads || 1
      const conversionRate = parseFloat((((closedCount || 0) / total) * 100).toFixed(1))

      // Response rate
      const { count: contactedCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .not('last_contact_date', 'is', null)

      const { count: respondedCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Responded')

      const avgResponseRate = contactedCount
        ? parseFloat((((respondedCount || 0) / contactedCount) * 100).toFixed(1))
        : 0

      return NextResponse.json({
        data: {
          totalLeads: totalLeads || 0,
          hotLeads: hotLeads || 0,
          warmLeads: warmLeads || 0,
          coldLeads: coldLeads || 0,
          leadsContactedToday: leadsContactedToday || 0,
          meetingsScheduled: meetingsScheduled || 0,
          dealsInPipeline: dealsInPipeline || 0,
          pipelineValue,
          conversionRate,
          avgResponseRate,
        },
      })
    }

    // Mock fallback
    return NextResponse.json({ data: generateDashboardStats() })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
