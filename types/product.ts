export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  subcategory: string;
  brand: string;
  model: string;
  price: number;
  originalPrice?: number;
  costPrice: number;
  stock: number;
  minStock: number;
  sku: string;
  barcode?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  images: string[];
  specifications: ProductSpecification[];
  features: string[];
  tags: ProductTag[];
  status: 'active' | 'inactive' | 'out_of_stock' | 'discontinued';
  visibility: 'public' | 'private' | 'hidden';
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  rating: number;
  reviewCount: number;
  totalSales: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface ProductSpecification {
  name: string;
  value: string;
  group?: string;
}

export interface ProductTag {
  id: string;
  name: string;
  type: 'featured' | 'top_sales' | 'best_deals' | 'new' | 'popular' | 'sale';
  color: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  subcategories?: Category[];
  isActive: boolean;
  sortOrder: number;
}

export interface RepairRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deviceType: string;
  deviceBrand: string;
  deviceModel: string;
  issueDescription: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  estimatedCost?: number;
  status: 'pending' | 'diagnosed' | 'approved' | 'in_progress' | 'completed' | 'cancelled' | 'delivered';
  submittedAt: string;
  updatedAt: string;
  completedAt?: string;
  notes?: string;
  technicianNotes?: string;
  images?: string[];
}

