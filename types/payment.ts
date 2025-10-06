export interface Payment {
  id: string;
  order_id?: string;
  method: "M-Pesa" | "Card" | "COD";
  amount: number;
  status: "pending" | "success" | "failed";
  transaction_id?: string;
  phone_number?: string;
  created_at: string;
  updated_at: string;
}
