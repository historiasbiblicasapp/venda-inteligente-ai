export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          subscription_status: 'inactive' | 'active' | 'cancelled' | 'expired';
          subscription_plan: 'starter' | 'profissional' | 'enterprise' | null;
          subscription_started_at: string | null;
          subscription_expires_at: string | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_status?: 'inactive' | 'active' | 'cancelled' | 'expired';
          subscription_plan?: 'starter' | 'profissional' | 'enterprise' | null;
          subscription_started_at?: string | null;
          subscription_expires_at?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_status?: 'inactive' | 'active' | 'cancelled' | 'expired';
          subscription_plan?: 'starter' | 'profissional' | 'enterprise' | null;
          subscription_started_at?: string | null;
          subscription_expires_at?: string | null;
          is_admin?: boolean;
          updated_at?: string;
        };
      };
      landing_pages: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          slug: string;
          description: string | null;
          components: Json;
          settings: Json;
          status: 'draft' | 'published' | 'archived';
          custom_domain: string | null;
          meta_pixel_id: string | null;
          tiktok_pixel_id: string | null;
          ga4_measurement_id: string | null;
          gtm_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          slug: string;
          description?: string | null;
          components?: Json;
          settings?: Json;
          status?: 'draft' | 'published' | 'archived';
          custom_domain?: string | null;
          meta_pixel_id?: string | null;
          tiktok_pixel_id?: string | null;
          ga4_measurement_id?: string | null;
          gtm_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          components?: Json;
          settings?: Json;
          status?: 'draft' | 'published' | 'archived';
          custom_domain?: string | null;
          meta_pixel_id?: string | null;
          tiktok_pixel_id?: string | null;
          ga4_measurement_id?: string | null;
          gtm_id?: string | null;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          user_id: string;
          landing_page_id: string | null;
          name: string;
          email: string;
          phone: string | null;
          source: string | null;
          status: 'new' | 'contacted' | 'converted' | 'lost';
          tags: string[] | null;
          custom_data: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          landing_page_id?: string | null;
          name: string;
          email: string;
          phone?: string | null;
          source?: string | null;
          status?: 'new' | 'contacted' | 'converted' | 'lost';
          tags?: string[] | null;
          custom_data?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          landing_page_id?: string | null;
          name?: string;
          email?: string;
          phone?: string | null;
          source?: string | null;
          status?: 'new' | 'contacted' | 'converted' | 'lost';
          tags?: string[] | null;
          custom_data?: Json | null;
          updated_at?: string;
        };
      };
      sales: {
        Row: {
          id: string;
          user_id: string;
          lead_id: string | null;
          landing_page_id: string | null;
          product_name: string;
          amount: number;
          currency: string;
          platform: 'kiwify' | 'hotmart' | 'eduzz' | 'monetizze' | 'mercadopago' | 'stripe' | 'paypal' | 'other';
          status: 'pending' | 'confirmed' | 'refunded' | 'cancelled';
          transaction_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lead_id?: string | null;
          landing_page_id?: string | null;
          product_name: string;
          amount: number;
          currency?: string;
          platform: 'kiwify' | 'hotmart' | 'eduzz' | 'monetizze' | 'mercadopago' | 'stripe' | 'paypal' | 'other';
          status?: 'pending' | 'confirmed' | 'refunded' | 'cancelled';
          transaction_id?: string | null;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          lead_id?: string | null;
          landing_page_id?: string | null;
          product_name?: string;
          amount?: number;
          currency?: string;
          platform?: 'kiwify' | 'hotmart' | 'eduzz' | 'monetizze' | 'mercadopago' | 'stripe' | 'paypal' | 'other';
          status?: 'pending' | 'confirmed' | 'refunded' | 'cancelled';
          transaction_id?: string | null;
        };
      };
      campaigns: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          platform: 'facebook' | 'instagram' | 'tiktok' | 'kwai' | 'google';
          status: 'draft' | 'active' | 'paused' | 'ended';
          budget: number | null;
          landing_page_id: string | null;
          ad_content: Json | null;
          targeting: Json | null;
          metrics: Json | null;
          start_date: string | null;
          end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          platform: 'facebook' | 'instagram' | 'tiktok' | 'kwai' | 'google';
          status?: 'draft' | 'active' | 'paused' | 'ended';
          budget?: number | null;
          landing_page_id?: string | null;
          ad_content?: Json | null;
          targeting?: Json | null;
          metrics?: Json | null;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          name?: string;
          platform?: 'facebook' | 'instagram' | 'tiktok' | 'kwai' | 'google';
          status?: 'draft' | 'active' | 'paused' | 'ended';
          budget?: number | null;
          landing_page_id?: string | null;
          ad_content?: Json | null;
          targeting?: Json | null;
          metrics?: Json | null;
          start_date?: string | null;
          end_date?: string | null;
          updated_at?: string;
        };
      };
      page_analytics: {
        Row: {
          id: string;
          landing_page_id: string;
          visitor_ip: string | null;
          visitor_id: string;
          page_variant: 'a' | 'b' | null;
          event_type: 'visit' | 'click' | 'form_submit' | 'purchase' | 'scroll';
          event_data: Json | null;
          referrer: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          user_agent: string | null;
          country: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          landing_page_id: string;
          visitor_ip?: string | null;
          visitor_id: string;
          page_variant?: 'a' | 'b' | null;
          event_type: 'visit' | 'click' | 'form_submit' | 'purchase' | 'scroll';
          event_data?: Json | null;
          referrer?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          user_agent?: string | null;
          country?: string | null;
          created_at?: string;
        };
        Update: {
          landing_page_id?: string;
          visitor_ip?: string | null;
          visitor_id?: string;
          page_variant?: 'a' | 'b' | null;
          event_type?: 'visit' | 'click' | 'form_submit' | 'purchase' | 'scroll';
          event_data?: Json | null;
          referrer?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          user_agent?: string | null;
          country?: string | null;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Insert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Update<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
