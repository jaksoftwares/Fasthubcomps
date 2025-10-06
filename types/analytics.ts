export interface SalesTrend {
  day: string;
  total_sales: number;
}

export interface TopProduct {
  product_name: string;
  total_sold: number;
}

export interface CustomerMetrics {
  total_customers: number;
  total_revenue: number;
  avg_customer_value: number;
}
