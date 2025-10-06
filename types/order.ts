export interface OrderProduct {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer_id: string;
  products: OrderProduct[];
  total: number;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  payment_method?: string;
  date: string;
  shipping_address?: Record<string, any>;
  created_at: string;
}
