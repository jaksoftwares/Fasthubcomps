'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Search, Phone, Mail, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { RepairsAPI } from '@/lib/services/repairs';

const RepairRequestsTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await RepairsAPI.getAll();
        setRequests(data);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch repair requests');
        toast.error(err?.message || 'Failed to fetch repair requests');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Map backend repair request data to frontend format
  const mappedRequests = Array.isArray(requests)
    ? requests.map(request => ({
        id: request.id ?? request.request_id ?? '',
        customerName: request.customer_name || request.customerName || '',
        customerEmail: request.customer_email || request.customerEmail || '',
        customerPhone: request.customer_phone || request.customerPhone || '',
        deviceType: request.device_type || request.deviceType || '',
        deviceBrand: request.device_brand || request.deviceBrand || '',
        deviceModel: request.device_model || request.deviceModel || '',
        issueDescription: request.issue_description || request.issueDescription || '',
        urgency: request.urgency || 'normal',
        estimatedCost: request.estimated_cost || request.estimatedCost || null,
        status: request.status || 'pending',
        submittedAt: request.submitted_at || request.submittedAt || '',
      }))
    : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'diagnosed':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-purple-100 text-purple-800';
      case 'in_progress':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      await RepairsAPI.update(requestId, { status: newStatus });
      setRequests(requests.map(request =>
        request.id === requestId ? { ...request, status: newStatus, updated_at: new Date().toISOString() } : request
      ));
      toast.success('Repair request status updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredRequests = mappedRequests.filter(request => {
    const matchesSearch =
      (typeof request.id === 'string' && request.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof request.customerName === 'string' && request.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof request.deviceBrand === 'string' && request.deviceBrand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (typeof request.deviceModel === 'string' && request.deviceModel.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="loader"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <CardTitle>All Repair Requests ({requests.length})</CardTitle>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="diagnosed">Diagnosed</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Request ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Device</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Issue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Urgency</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Estimate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-blue-600">{request.id}</td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{request.customerName}</div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="h-3 w-3" />
                        <span>{request.customerEmail}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="h-3 w-3" />
                        <span>{request.customerPhone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{request.deviceBrand} {request.deviceModel}</div>
                      <div className="text-sm text-gray-600">{request.deviceType}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-600 truncate" title={request.issueDescription}>
                        {request.issueDescription}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={getUrgencyColor(request.urgency)}>
                      {request.urgency.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Select
                      value={request.status}
                      onValueChange={(value) => updateRequestStatus(request.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.replace('_', ' ')}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="diagnosed">Diagnosed</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-3 px-4">
                    {request.estimatedCost ? (
                      <span className="font-medium">{formatCurrency(request.estimatedCost)}</span>
                    ) : (
                      <span className="text-gray-400">Pending</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(request.submittedAt)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RepairRequestsTable;