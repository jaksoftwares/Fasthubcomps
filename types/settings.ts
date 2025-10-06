export interface Settings {
  id: string;
  site_name: string;
  logo_url?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: Record<string, any>;
  currency: string;
  tax_rate: number;
  maintenance_mode: boolean;
  created_at: string;
  updated_at: string;
}
