import AdminLayout from '@/components/admin/AdminLayout';
import { getSupabaseServerClient } from '@/lib/supabaseClient';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export const revalidate = 60;

async function getAdminDashboardStats() {
  const supabase = getSupabaseServerClient();

  // Fetch all data needed for accurate statistics
  const [products, customers, orders, payments, ordersDetail, customersDetail] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('customers').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id,created_at', { count: 'exact' }),
    supabase.from('payments').select('amount,status'),
    supabase.from('orders').select('*'),
    supabase.from('customers').select('*'),
  ]);

  const totalRevenue = payments.data?.filter((p: any) => p.status === 'success')
    .reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;

  // Calculate actual trends based on current month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);

  // Count new customers this month
  const newCustomersThisMonth = (customersDetail.data || []).filter((c: any) => {
    const createdDate = new Date(c.created_at);
    return createdDate >= firstDayOfMonth && createdDate <= now;
  }).length;

  // Count new orders this month
  const newOrdersThisMonth = (ordersDetail.data || []).filter((o: any) => {
    const createdDate = new Date(o.created_at);
    return createdDate >= firstDayOfMonth && createdDate <= now;
    
  }).length;

  // Calculate fulfilled orders
  const fulfilledOrders = (ordersDetail.data || []).filter((o: any) => 
    o.status === 'completed' || o.status === 'shipped'
  ).length;

  const totalOrders = orders.count || 0;
  const totalProducts = products.count || 0;
  const totalCustomers = customers.count || 0;
  const fulfillmentRate = totalOrders > 0 ? Math.round((fulfilledOrders / totalOrders) * 100) : 0;

  return {
    totalProducts,
    totalCustomers,
    totalOrders,
    totalRevenue,
    newCustomersThisMonth,
    newOrdersThisMonth,
    fulfillmentRate,
    fulfilledOrders,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  const formattedRevenue = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(stats.totalRevenue);

  return (
    <AdminLayout>
      <AdminDashboardClient stats={stats} formattedRevenue={formattedRevenue} />
    </AdminLayout>
  );
}