-- =============================================================================
-- ATLAS Platform - Initial Database Schema
-- =============================================================================
-- Migration: 001_initial_schema
-- Description: Creates all core tables, RLS policies, indexes, and triggers
-- =============================================================================

-- ---------------------------------------------------------------------------
-- profiles (extends Supabase auth.users)
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  role text default 'user' check (role in ('admin','user','team_lead','enterprise')),
  plan text default 'free' check (plan in ('free','starter','pro','pro_cre','team','enterprise')),
  company text,
  avatar_url text,
  license_fl text,
  license_pr text,
  license_dr text,
  preferred_language text default 'en',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- properties
-- ---------------------------------------------------------------------------
create table properties (
  id uuid primary key default gen_random_uuid(),
  address text not null,
  city text not null,
  state text,
  zip text,
  country text default 'US' check (country in ('US','DO','PR')),
  property_type text not null,
  bedrooms int,
  bathrooms int,
  sqft int,
  lot_size int,
  year_built int,
  estimated_value numeric,
  last_sale_price numeric,
  last_sale_date date,
  tax_assessed_value numeric,
  monthly_rent numeric,
  occupancy_status text,
  lat numeric,
  lng numeric,
  image_url text,
  zoning text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- owners
-- ---------------------------------------------------------------------------
create table owners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  entity_type text not null check (entity_type in ('Individual','LLC','Corporation','Trust','Partnership')),
  email text,
  phone text,
  mailing_address text,
  portfolio_size int default 0,
  total_equity numeric default 0,
  ownership_tenure int default 0,
  out_of_state boolean default false,
  beneficial_owner text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- property_owners (junction)
-- ---------------------------------------------------------------------------
create table property_owners (
  property_id uuid references properties on delete cascade,
  owner_id uuid references owners on delete cascade,
  primary key (property_id, owner_id)
);

-- ---------------------------------------------------------------------------
-- leads
-- ---------------------------------------------------------------------------
create table leads (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties,
  owner_id uuid references owners,
  lead_type text default 'seller' check (lead_type in ('seller','buyer','tenant')),
  score int,
  score_label text check (score_label in ('Hot','Warm','Cold')),
  status text default 'New',
  assigned_to uuid references profiles,
  source text,
  last_contact_date timestamptz,
  next_follow_up timestamptz,
  notes jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- signals
-- ---------------------------------------------------------------------------
create table signals (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads on delete set null,
  property_id uuid references properties,
  owner_id uuid references owners,
  type text not null check (type in ('distress','life-event','financial','behavioral','market')),
  label text not null,
  description text,
  severity text check (severity in ('high','medium','low')),
  urgency text check (urgency in ('imminent','near-term','medium-term')),
  market text check (market in ('FL','PR','DR')),
  source_registry text,
  first_detected timestamptz default now(),
  contacted_by_count int default 0,
  is_first_to_see boolean default true,
  property_value numeric,
  property_type text,
  score int,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- buyer_profiles
-- ---------------------------------------------------------------------------
create table buyer_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  company text,
  buyer_type text check (buyer_type in ('individual','investor','corporation','reit','1031-exchange','first-time')),
  budget_min numeric,
  budget_max numeric,
  property_types jsonb default '[]',
  preferred_markets jsonb default '[]',
  pre_approval_status text default 'none',
  pre_approval_amount numeric,
  lender text,
  timeline text,
  investment_criteria jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- buyer_leads
-- ---------------------------------------------------------------------------
create table buyer_leads (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid references buyer_profiles on delete cascade,
  qualification_stage text default 'new',
  matched_properties jsonb default '[]',
  source text,
  assigned_to uuid references profiles,
  notes jsonb default '[]',
  last_contact_date timestamptz,
  next_follow_up timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- tenant_profiles
-- ---------------------------------------------------------------------------
create table tenant_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  company text,
  tenant_type text,
  min_sqft int,
  max_sqft int,
  preferred_layout text,
  lease_budget_min numeric,
  lease_budget_max numeric,
  preferred_term text,
  move_in_date date,
  industry text,
  employee_count int,
  preferred_markets jsonb default '[]',
  special_requirements jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- tenant_leads
-- ---------------------------------------------------------------------------
create table tenant_leads (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenant_profiles on delete cascade,
  lease_stage text default 'new',
  matched_spaces jsonb default '[]',
  source text,
  assigned_to uuid references profiles,
  notes jsonb default '[]',
  last_contact_date timestamptz,
  next_follow_up timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- agent_profiles
-- ---------------------------------------------------------------------------
create table agent_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles,
  name text not null,
  email text,
  phone text,
  brokerage text,
  license_number text,
  license_state text check (license_state in ('FL','PR','DR')),
  specialty text check (specialty in ('residential','commercial','both')),
  territories jsonb default '[]',
  deals_closed_ltm int default 0,
  avg_days_on_market int default 0,
  total_volume_ltm numeric default 0,
  rating numeric default 0,
  avatar text,
  co_listing_available boolean default false,
  referral_fee_percent numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- co_listing_proposals
-- ---------------------------------------------------------------------------
create table co_listing_proposals (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties,
  property_address text,
  proposing_agent_id uuid references agent_profiles,
  receiving_agent_id uuid references agent_profiles,
  commission_split text,
  territory text,
  terms text,
  status text default 'pending' check (status in ('pending','accepted','rejected','expired')),
  created_at timestamptz default now(),
  expires_at timestamptz
);

-- ---------------------------------------------------------------------------
-- territories
-- ---------------------------------------------------------------------------
create table territories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  market text not null check (market in ('FL','PR','DR')),
  region text,
  signal_count int default 0,
  active_leads int default 0,
  hot_leads int default 0,
  agents_active int default 0,
  competition_level text default 'low' check (competition_level in ('low','medium','high')),
  assigned_to uuid references profiles,
  last_activity timestamptz default now(),
  boundaries jsonb,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- outreach_campaigns
-- ---------------------------------------------------------------------------
create table outreach_campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles,
  name text not null,
  type text not null check (type in ('email','sms','voice','direct-mail','linkedin')),
  status text default 'draft' check (status in ('draft','active','paused','completed')),
  lead_type text,
  total_recipients int default 0,
  sent int default 0,
  opened int default 0,
  replied int default 0,
  meetings int default 0,
  template_subject text,
  template_body text,
  language text default 'en',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- voice_calls
-- ---------------------------------------------------------------------------
create table voice_calls (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles,
  lead_id uuid references leads,
  lead_name text,
  phone text,
  duration int default 0,
  status text,
  sentiment text,
  outcome text,
  transcript text,
  recording_url text,
  twilio_sid text,
  called_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- ai_conversations
-- ---------------------------------------------------------------------------
create table ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles,
  title text,
  messages jsonb default '[]',
  context jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- listing_pitches
-- ---------------------------------------------------------------------------
create table listing_pitches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles,
  property_id uuid references properties,
  language text default 'en',
  style text,
  content jsonb,
  generated_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- data_pipelines
-- ---------------------------------------------------------------------------
create table data_pipelines (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source text not null,
  type text not null,
  market text,
  status text default 'scheduled',
  last_run timestamptz,
  next_run timestamptz,
  records_processed int default 0,
  records_failed int default 0,
  avg_duration text,
  schedule text,
  config jsonb,
  created_at timestamptz default now()
);


-- ===========================================================================
-- ROW LEVEL SECURITY
-- ===========================================================================

alter table profiles enable row level security;
alter table leads enable row level security;
alter table buyer_leads enable row level security;
alter table tenant_leads enable row level security;
alter table voice_calls enable row level security;
alter table ai_conversations enable row level security;
alter table listing_pitches enable row level security;
alter table outreach_campaigns enable row level security;

-- profiles
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- leads
create policy "Users can view assigned leads"
  on leads for select
  using (
    assigned_to = auth.uid()
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Users can insert leads"
  on leads for insert
  with check (true);

create policy "Users can update leads"
  on leads for update
  using (
    assigned_to = auth.uid()
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- buyer_leads
create policy "Users can view assigned buyer leads"
  on buyer_leads for select
  using (
    assigned_to = auth.uid()
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Users can insert buyer leads"
  on buyer_leads for insert
  with check (true);

create policy "Users can update buyer leads"
  on buyer_leads for update
  using (
    assigned_to = auth.uid()
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- tenant_leads
create policy "Users can view assigned tenant leads"
  on tenant_leads for select
  using (
    assigned_to = auth.uid()
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Users can insert tenant leads"
  on tenant_leads for insert
  with check (true);

create policy "Users can update tenant leads"
  on tenant_leads for update
  using (
    assigned_to = auth.uid()
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- voice_calls
create policy "Users can view own voice calls"
  on voice_calls for select
  using (user_id = auth.uid());

create policy "Users can insert voice calls"
  on voice_calls for insert
  with check (user_id = auth.uid());

-- ai_conversations
create policy "Users can view own conversations"
  on ai_conversations for select
  using (user_id = auth.uid());

create policy "Users can insert conversations"
  on ai_conversations for insert
  with check (user_id = auth.uid());

create policy "Users can update own conversations"
  on ai_conversations for update
  using (user_id = auth.uid());

-- listing_pitches
create policy "Users can view own pitches"
  on listing_pitches for select
  using (user_id = auth.uid());

create policy "Users can insert pitches"
  on listing_pitches for insert
  with check (user_id = auth.uid());

-- outreach_campaigns
create policy "Users can view own campaigns"
  on outreach_campaigns for select
  using (user_id = auth.uid());

create policy "Users can insert campaigns"
  on outreach_campaigns for insert
  with check (user_id = auth.uid());

create policy "Users can update own campaigns"
  on outreach_campaigns for update
  using (user_id = auth.uid());


-- ===========================================================================
-- INDEXES
-- ===========================================================================

create index idx_leads_assigned on leads(assigned_to);
create index idx_leads_status on leads(status);
create index idx_leads_type on leads(lead_type);
create index idx_signals_market on signals(market);
create index idx_signals_urgency on signals(urgency);
create index idx_signals_first_detected on signals(first_detected desc);
create index idx_properties_country on properties(country);
create index idx_properties_type on properties(property_type);
create index idx_territories_market on territories(market);
create index idx_buyer_leads_stage on buyer_leads(qualification_stage);
create index idx_tenant_leads_stage on tenant_leads(lease_stage);


-- ===========================================================================
-- FUNCTIONS & TRIGGERS
-- ===========================================================================

-- Auto-create profile row when a new user signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Auto-update updated_at timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on profiles for each row execute function update_updated_at();
create trigger set_updated_at before update on properties for each row execute function update_updated_at();
create trigger set_updated_at before update on owners for each row execute function update_updated_at();
create trigger set_updated_at before update on leads for each row execute function update_updated_at();
create trigger set_updated_at before update on buyer_profiles for each row execute function update_updated_at();
create trigger set_updated_at before update on buyer_leads for each row execute function update_updated_at();
create trigger set_updated_at before update on tenant_profiles for each row execute function update_updated_at();
create trigger set_updated_at before update on tenant_leads for each row execute function update_updated_at();
create trigger set_updated_at before update on agent_profiles for each row execute function update_updated_at();
create trigger set_updated_at before update on outreach_campaigns for each row execute function update_updated_at();
create trigger set_updated_at before update on ai_conversations for each row execute function update_updated_at();
