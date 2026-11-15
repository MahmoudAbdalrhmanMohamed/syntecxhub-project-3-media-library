export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
  timestamp: string;
}

export interface ApiErrorPayload {
  success: false;
  statusCode: number;
  error: string;
  message: string | string[];
  path?: string;
  timestamp?: string;
}

export type UserRole = 'admin' | 'manager' | 'editor' | 'viewer';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface UserRecord {
  _id: string;
  id?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  jobTitle: string;
  lastActiveAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserFormPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  department?: string;
  jobTitle?: string;
}

export type ProductStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'archived';

export interface ProductRecord {
  _id: string;
  id?: string;
  name: string;
  sku: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stockQuantity: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormPayload {
  name: string;
  sku: string;
  price: number;
  description: string;
  category: string;
  image?: string;
  stockQuantity: number;
  status?: ProductStatus;
}

export interface UploadRecord {
  _id: string;
  id?: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  filePath: string;
  publicUrl: string;
  altText?: string;
  uploadDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardSummary {
  totalUsers: number;
  activeUsers: number;
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalInventoryValue: number;
  totalUploadedFiles: number;
  totalStorageBytes: number;
}

export interface CategoryDistribution {
  category: string;
  count: number;
  inventoryValue: number;
}

export interface RoleDistribution {
  role: UserRole;
  count: number;
}

export interface UploadTypeDistribution {
  mimeType: string;
  count: number;
  bytes: number;
}

export interface DashboardStatsPayload {
  summary: DashboardSummary;
  distributions: {
    productsByCategory: CategoryDistribution[];
    usersByRole: RoleDistribution[];
    uploadsByType: UploadTypeDistribution[];
  };
  recent: {
    users: UserRecord[];
    products: ProductRecord[];
    uploads: UploadRecord[];
  };
}

export interface ActivityEvent {
  id: string;
  type: 'user_registered' | 'product_updated' | 'file_uploaded';
  title: string;
  subtitle: string;
  timestamp: string;
  actor: string;
}

export interface DashboardActivityPayload {
  events: ActivityEvent[];
  totalEvents: number;
}
