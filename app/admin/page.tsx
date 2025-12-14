import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabaseClient';

export const revalidate = 60;

async function getAdminDashboardStats() {
  const supabase = getSupabaseServerClient();

  const [products, customers, orders, payments] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('customers').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }),
    supabase.from('payments').select('amount,status'),
  ]);

  const totalRevenue = payments.data?.filter((p: any) => p.status === 'success')
    .reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;

  return {
    totalProducts: products.count || 0,
    totalCustomers: customers.count || 0,
    totalOrders: orders.count || 0,
    totalRevenue,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Key store metrics based on live data.</p>
            </div>
          </header>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-md border bg-white p-4">
              <p className="text-xs font-medium text-gray-500">Total Products</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
            </div>
            <div className="rounded-md border bg-white p-4">
              <p className="text-xs font-medium text-gray-500">Total Orders</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
            </div>
            <div className="rounded-md border bg-white p-4">
              <p className="text-xs font-medium text-gray-500">Total Customers</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{stats.totalCustomers}</p>
            </div>
            <div className="rounded-md border bg-white p-4">
              <p className="text-xs font-medium text-gray-500">Total Revenue</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {new Intl.NumberFormat('en-KE', {
                  style: 'currency',
                  currency: 'KES',
                  minimumFractionDigits: 0,
                }).format(stats.totalRevenue)}
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/admin/products" className="rounded-md border bg-white p-4 hover:border-gray-400 transition-colors">
              <h2 className="text-sm font-semibold text-gray-900">Products</h2>
              <p className="mt-1 text-sm text-gray-600">Manage product catalog, pricing, and availability.</p>
            </Link>
            <Link href="/admin/orders" className="rounded-md border bg-white p-4 hover:border-gray-400 transition-colors">
              <h2 className="text-sm font-semibold text-gray-900">Orders</h2>
              <p className="mt-1 text-sm text-gray-600">Review and update customer orders.</p>
            </Link>
            <Link href="/admin/customers" className="rounded-md border bg-white p-4 hover:border-gray-400 transition-colors">
              <h2 className="text-sm font-semibold text-gray-900">Users</h2>
              <p className="mt-1 text-sm text-gray-600">View customers and admin users.</p>
            </Link>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}