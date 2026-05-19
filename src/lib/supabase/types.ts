export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string | null
          role: 'admin' | 'user' | 'team_lead' | 'enterprise'
          plan: 'free' | 'starter' | 'pro' | 'pro_cre' | 'team' | 'enterprise'
          company: string | null
          avatar_url: string | null
          license_fl: string | null
          license_pr: string | null
          license_dr: string | null
          preferred_language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          role?: 'admin' | 'user' | 'team_lead' | 'enterprise'
          plan?: 'free' | 'starter' | 'pro' | 'pro_cre' | 'team' | 'enterprise'
          company?: string | null
          avatar_url?: string | null
          license_fl?: string | null
          license_pr?: string | null
          license_dr?: string | null
          preferred_language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          role?: 'admin' | 'user' | 'team_lead' | 'enterprise'
          plan?: 'free' | 'starter' | 'pro' | 'pro_cre' | 'team' | 'enterprise'
          company?: string | null
          avatar_url?: string | null
          license_fl?: string | null
          license_pr?: string | null
          license_dr?: string | null
          preferred_language?: string
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          address: string
          city: string
          state: string | null
          zip: string | null
          country: 'US' | 'DO' | 'PR'
          property_type: string
          bedrooms: number | null
          bathrooms: number | null
          sqft: number | null
          lot_size: number | null
          year_built: number | null
          estimated_value: number | null
          last_sale_price: number | null
          last_sale_date: string | null
          tax_assessed_value: number | null
          monthly_rent: number | null
          occupancy_status: string | null
          lat: number | null
          lng: number | null
          image_url: string | null
          zoning: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          address: string
          city: string
          state?: string | null
          zip?: string | null
          country?: 'US' | 'DO' | 'PR'
          property_type: string
          bedrooms?: number | null
          bathrooms?: number | null
          sqft?: number | null
          lot_size?: number | null
          year_built?: number | null
          estimated_value?: number | null
          last_sale_price?: number | null
          last_sale_date?: string | null
          tax_assessed_value?: number | null
          monthly_rent?: number | null
          occupancy_status?: string | null
          lat?: number | null
          lng?: number | null
          image_url?: string | null
          zoning?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          address?: string
          city?: string
          state?: string | null
          zip?: string | null
          country?: 'US' | 'DO' | 'PR'
          property_type?: string
          bedrooms?: number | null
          bathrooms?: number | null
          sqft?: number | null
          lot_size?: number | null
          year_built?: number | null
          estimated_value?: number | null
          last_sale_price?: number | null
          last_sale_date?: string | null
          tax_assessed_value?: number | null
          monthly_rent?: number | null
          occupancy_status?: string | null
          lat?: number | null
          lng?: number | null
          image_url?: string | null
          zoning?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      owners: {
        Row: {
          id: string
          name: string
          entity_type: 'Individual' | 'LLC' | 'Corporation' | 'Trust' | 'Partnership'
          email: string | null
          phone: string | null
          mailing_address: string | null
          portfolio_size: number
          total_equity: number
          ownership_tenure: number
          out_of_state: boolean
          beneficial_owner: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          entity_type: 'Individual' | 'LLC' | 'Corporation' | 'Trust' | 'Partnership'
          email?: string | null
          phone?: string | null
          mailing_address?: string | null
          portfolio_size?: number
          total_equity?: number
          ownership_tenure?: number
          out_of_state?: boolean
          beneficial_owner?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          entity_type?: 'Individual' | 'LLC' | 'Corporation' | 'Trust' | 'Partnership'
          email?: string | null
          phone?: string | null
          mailing_address?: string | null
          portfolio_size?: number
          total_equity?: number
          ownership_tenure?: number
          out_of_state?: boolean
          beneficial_owner?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      property_owners: {
        Row: {
          property_id: string
          owner_id: string
        }
        Insert: {
          property_id: string
          owner_id: string
        }
        Update: {
          property_id?: string
          owner_id?: string
        }
      }
      leads: {
        Row: {
          id: string
          property_id: string | null
          owner_id: string | null
          lead_type: 'seller' | 'buyer' | 'tenant'
          score: number | null
          score_label: 'Hot' | 'Warm' | 'Cold' | null
          status: string
          assigned_to: string | null
          source: string | null
          last_contact_date: string | null
          next_follow_up: string | null
          notes: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id?: string | null
          owner_id?: string | null
          lead_type?: 'seller' | 'buyer' | 'tenant'
          score?: number | null
          score_label?: 'Hot' | 'Warm' | 'Cold' | null
          status?: string
          assigned_to?: string | null
          source?: string | null
          last_contact_date?: string | null
          next_follow_up?: string | null
          notes?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string | null
          owner_id?: string | null
          lead_type?: 'seller' | 'buyer' | 'tenant'
          score?: number | null
          score_label?: 'Hot' | 'Warm' | 'Cold' | null
          status?: string
          assigned_to?: string | null
          source?: string | null
          last_contact_date?: string | null
          next_follow_up?: string | null
          notes?: Json
          created_at?: string
          updated_at?: string
        }
      }
      signals: {
        Row: {
          id: string
          lead_id: string | null
          property_id: string | null
          owner_id: string | null
          type: 'distress' | 'life-event' | 'financial' | 'behavioral' | 'market'
          label: string
          description: string | null
          severity: 'high' | 'medium' | 'low' | null
          urgency: 'imminent' | 'near-term' | 'medium-term' | null
          market: 'FL' | 'PR' | 'DR' | null
          source_registry: string | null
          first_detected: string
          contacted_by_count: number
          is_first_to_see: boolean
          property_value: number | null
          property_type: string | null
          score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          lead_id?: string | null
          property_id?: string | null
          owner_id?: string | null
          type: 'distress' | 'life-event' | 'financial' | 'behavioral' | 'market'
          label: string
          description?: string | null
          severity?: 'high' | 'medium' | 'low' | null
          urgency?: 'imminent' | 'near-term' | 'medium-term' | null
          market?: 'FL' | 'PR' | 'DR' | null
          source_registry?: string | null
          first_detected?: string
          contacted_by_count?: number
          is_first_to_see?: boolean
          property_value?: number | null
          property_type?: string | null
          score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string | null
          property_id?: string | null
          owner_id?: string | null
          type?: 'distress' | 'life-event' | 'financial' | 'behavioral' | 'market'
          label?: string
          description?: string | null
          severity?: 'high' | 'medium' | 'low' | null
          urgency?: 'imminent' | 'near-term' | 'medium-term' | null
          market?: 'FL' | 'PR' | 'DR' | null
          source_registry?: string | null
          first_detected?: string
          contacted_by_count?: number
          is_first_to_see?: boolean
          property_value?: number | null
          property_type?: string | null
          score?: number | null
          created_at?: string
        }
      }
      buyer_profiles: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          company: string | null
          buyer_type: 'individual' | 'investor' | 'corporation' | 'reit' | '1031-exchange' | 'first-time' | null
          budget_min: number | null
          budget_max: number | null
          property_types: Json
          preferred_markets: Json
          pre_approval_status: string
          pre_approval_amount: number | null
          lender: string | null
          timeline: string | null
          investment_criteria: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          company?: string | null
          buyer_type?: 'individual' | 'investor' | 'corporation' | 'reit' | '1031-exchange' | 'first-time' | null
          budget_min?: number | null
          budget_max?: number | null
          property_types?: Json
          preferred_markets?: Json
          pre_approval_status?: string
          pre_approval_amount?: number | null
          lender?: string | null
          timeline?: string | null
          investment_criteria?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          company?: string | null
          buyer_type?: 'individual' | 'investor' | 'corporation' | 'reit' | '1031-exchange' | 'first-time' | null
          budget_min?: number | null
          budget_max?: number | null
          property_types?: Json
          preferred_markets?: Json
          pre_approval_status?: string
          pre_approval_amount?: number | null
          lender?: string | null
          timeline?: string | null
          investment_criteria?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      buyer_leads: {
        Row: {
          id: string
          buyer_id: string | null
          qualification_stage: string
          matched_properties: Json
          source: string | null
          assigned_to: string | null
          notes: Json
          last_contact_date: string | null
          next_follow_up: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          buyer_id?: string | null
          qualification_stage?: string
          matched_properties?: Json
          source?: string | null
          assigned_to?: string | null
          notes?: Json
          last_contact_date?: string | null
          next_follow_up?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          buyer_id?: string | null
          qualification_stage?: string
          matched_properties?: Json
          source?: string | null
          assigned_to?: string | null
          notes?: Json
          last_contact_date?: string | null
          next_follow_up?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tenant_profiles: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          company: string | null
          tenant_type: string | null
          min_sqft: number | null
          max_sqft: number | null
          preferred_layout: string | null
          lease_budget_min: number | null
          lease_budget_max: number | null
          preferred_term: string | null
          move_in_date: string | null
          industry: string | null
          employee_count: number | null
          preferred_markets: Json
          special_requirements: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          company?: string | null
          tenant_type?: string | null
          min_sqft?: number | null
          max_sqft?: number | null
          preferred_layout?: string | null
          lease_budget_min?: number | null
          lease_budget_max?: number | null
          preferred_term?: string | null
          move_in_date?: string | null
          industry?: string | null
          employee_count?: number | null
          preferred_markets?: Json
          special_requirements?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          company?: string | null
          tenant_type?: string | null
          min_sqft?: number | null
          max_sqft?: number | null
          preferred_layout?: string | null
          lease_budget_min?: number | null
          lease_budget_max?: number | null
          preferred_term?: string | null
          move_in_date?: string | null
          industry?: string | null
          employee_count?: number | null
          preferred_markets?: Json
          special_requirements?: Json
          created_at?: string
          updated_at?: string
        }
      }
      tenant_leads: {
        Row: {
          id: string
          tenant_id: string | null
          lease_stage: string
          matched_spaces: Json
          source: string | null
          assigned_to: string | null
          notes: Json
          last_contact_date: string | null
          next_follow_up: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id?: string | null
          lease_stage?: string
          matched_spaces?: Json
          source?: string | null
          assigned_to?: string | null
          notes?: Json
          last_contact_date?: string | null
          next_follow_up?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string | null
          lease_stage?: string
          matched_spaces?: Json
          source?: string | null
          assigned_to?: string | null
          notes?: Json
          last_contact_date?: string | null
          next_follow_up?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      agent_profiles: {
        Row: {
          id: string
          user_id: string | null
          name: string
          email: string | null
          phone: string | null
          brokerage: string | null
          license_number: string | null
          license_state: 'FL' | 'PR' | 'DR' | null
          specialty: 'residential' | 'commercial' | 'both' | null
          territories: Json
          deals_closed_ltm: number
          avg_days_on_market: number
          total_volume_ltm: number
          rating: number
          avatar: string | null
          co_listing_available: boolean
          referral_fee_percent: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          email?: string | null
          phone?: string | null
          brokerage?: string | null
          license_number?: string | null
          license_state?: 'FL' | 'PR' | 'DR' | null
          specialty?: 'residential' | 'commercial' | 'both' | null
          territories?: Json
          deals_closed_ltm?: number
          avg_days_on_market?: number
          total_volume_ltm?: number
          rating?: number
          avatar?: string | null
          co_listing_available?: boolean
          referral_fee_percent?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          email?: string | null
          phone?: string | null
          brokerage?: string | null
          license_number?: string | null
          license_state?: 'FL' | 'PR' | 'DR' | null
          specialty?: 'residential' | 'commercial' | 'both' | null
          territories?: Json
          deals_closed_ltm?: number
          avg_days_on_market?: number
          total_volume_ltm?: number
          rating?: number
          avatar?: string | null
          co_listing_available?: boolean
          referral_fee_percent?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      co_listing_proposals: {
        Row: {
          id: string
          property_id: string | null
          property_address: string | null
          proposing_agent_id: string | null
          receiving_agent_id: string | null
          commission_split: string | null
          territory: string | null
          terms: string | null
          status: 'pending' | 'accepted' | 'rejected' | 'expired'
          created_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          property_id?: string | null
          property_address?: string | null
          proposing_agent_id?: string | null
          receiving_agent_id?: string | null
          commission_split?: string | null
          territory?: string | null
          terms?: string | null
          status?: 'pending' | 'accepted' | 'rejected' | 'expired'
          created_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          property_id?: string | null
          property_address?: string | null
          proposing_agent_id?: string | null
          receiving_agent_id?: string | null
          commission_split?: string | null
          territory?: string | null
          terms?: string | null
          status?: 'pending' | 'accepted' | 'rejected' | 'expired'
          created_at?: string
          expires_at?: string | null
        }
      }
      territories: {
        Row: {
          id: string
          name: string
          market: 'FL' | 'PR' | 'DR'
          region: string | null
          signal_count: number
          active_leads: number
          hot_leads: number
          agents_active: number
          competition_level: 'low' | 'medium' | 'high'
          assigned_to: string | null
          last_activity: string
          boundaries: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          market: 'FL' | 'PR' | 'DR'
          region?: string | null
          signal_count?: number
          active_leads?: number
          hot_leads?: number
          agents_active?: number
          competition_level?: 'low' | 'medium' | 'high'
          assigned_to?: string | null
          last_activity?: string
          boundaries?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          market?: 'FL' | 'PR' | 'DR'
          region?: string | null
          signal_count?: number
          active_leads?: number
          hot_leads?: number
          agents_active?: number
          competition_level?: 'low' | 'medium' | 'high'
          assigned_to?: string | null
          last_activity?: string
          boundaries?: Json | null
          created_at?: string
        }
      }
      outreach_campaigns: {
        Row: {
          id: string
          user_id: string | null
          name: string
          type: 'email' | 'sms' | 'voice' | 'direct-mail' | 'linkedin'
          status: 'draft' | 'active' | 'paused' | 'completed'
          lead_type: string | null
          total_recipients: number
          sent: number
          opened: number
          replied: number
          meetings: number
          template_subject: string | null
          template_body: string | null
          language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          type: 'email' | 'sms' | 'voice' | 'direct-mail' | 'linkedin'
          status?: 'draft' | 'active' | 'paused' | 'completed'
          lead_type?: string | null
          total_recipients?: number
          sent?: number
          opened?: number
          replied?: number
          meetings?: number
          template_subject?: string | null
          template_body?: string | null
          language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          type?: 'email' | 'sms' | 'voice' | 'direct-mail' | 'linkedin'
          status?: 'draft' | 'active' | 'paused' | 'completed'
          lead_type?: string | null
          total_recipients?: number
          sent?: number
          opened?: number
          replied?: number
          meetings?: number
          template_subject?: string | null
          template_body?: string | null
          language?: string
          created_at?: string
          updated_at?: string
        }
      }
      voice_calls: {
        Row: {
          id: string
          user_id: string | null
          lead_id: string | null
          lead_name: string | null
          phone: string | null
          duration: number
          status: string | null
          sentiment: string | null
          outcome: string | null
          transcript: string | null
          recording_url: string | null
          twilio_sid: string | null
          called_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          lead_id?: string | null
          lead_name?: string | null
          phone?: string | null
          duration?: number
          status?: string | null
          sentiment?: string | null
          outcome?: string | null
          transcript?: string | null
          recording_url?: string | null
          twilio_sid?: string | null
          called_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          lead_id?: string | null
          lead_name?: string | null
          phone?: string | null
          duration?: number
          status?: string | null
          sentiment?: string | null
          outcome?: string | null
          transcript?: string | null
          recording_url?: string | null
          twilio_sid?: string | null
          called_at?: string
        }
      }
      ai_conversations: {
        Row: {
          id: string
          user_id: string | null
          title: string | null
          messages: Json
          context: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title?: string | null
          messages?: Json
          context?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string | null
          messages?: Json
          context?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      listing_pitches: {
        Row: {
          id: string
          user_id: string | null
          property_id: string | null
          language: string
          style: string | null
          content: Json | null
          generated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          property_id?: string | null
          language?: string
          style?: string | null
          content?: Json | null
          generated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          property_id?: string | null
          language?: string
          style?: string | null
          content?: Json | null
          generated_at?: string
        }
      }
      data_pipelines: {
        Row: {
          id: string
          name: string
          source: string
          type: string
          market: string | null
          status: string
          last_run: string | null
          next_run: string | null
          records_processed: number
          records_failed: number
          avg_duration: string | null
          schedule: string | null
          config: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          source: string
          type: string
          market?: string | null
          status?: string
          last_run?: string | null
          next_run?: string | null
          records_processed?: number
          records_failed?: number
          avg_duration?: string | null
          schedule?: string | null
          config?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          source?: string
          type?: string
          market?: string | null
          status?: string
          last_run?: string | null
          next_run?: string | null
          records_processed?: number
          records_failed?: number
          avg_duration?: string | null
          schedule?: string | null
          config?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience aliases
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
