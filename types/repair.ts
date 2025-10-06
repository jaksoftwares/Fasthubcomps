export interface RepairRequest {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  device_type: string;
  device_brand?: string;
  device_model?: string;
  issue_description: string;
  urgency: "low" | "normal" | "high" | "urgent";
  estimated_cost?: number;
  status: "submitted" | "in_progress" | "completed" | "cancelled";
  submitted_at: string;
  updated_at: string;
  notes?: string;
  technician_notes?: string;
}
