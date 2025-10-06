export interface Customer {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  phone?: string;
  total_orders: number;
  total_spent: number;
  status: string;
  join_date: string;
  last_order?: string;
}
