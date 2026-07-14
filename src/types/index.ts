import { Database } from './database';

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Insert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Update<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

export interface LandingPageComponent {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type: 'banner' | 'video' | 'text' | 'button' | 'testimonial' | 'faq' | 'guarantee' | 'countdown' | 'offer' | 'gallery' | 'form' | 'progress_bar';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any>;
  animation?: {
    type: 'fadeIn' | 'zoom' | 'slide' | 'bounce' | 'pulse' | 'typewriter';
    delay?: number;
    duration?: number;
  };
  visibility?: {
    afterSeconds?: number;
    afterScrollPercent?: number;
    atSection?: number;
  };
}

export interface PageSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  maxWidth: string;
  showCountdown: boolean;
  countdownDate: string;
  checkoutUrl: string;
  whatsappNumber: string;
  whatsappMessage: string;
  thankYouPageUrl: string;
}

export interface TrialStatus {
  isActive: boolean;
  daysRemaining: number;
  expiresAt: string;
  isExpired: boolean;
}

export interface ButtonConfig {
  id: string;
  text: string;
  style: 'primary' | 'accent' | 'outline' | 'whatsapp' | 'custom';
  action: 'checkout' | 'whatsapp' | 'scroll' | 'link' | 'form';
  url?: string;
  sectionId?: string;
  visibility?: {
    afterSeconds?: number;
    afterScrollPercent?: number;
    atSection?: number;
  };
}
