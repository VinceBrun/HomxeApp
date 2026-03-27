/**
 * API TYPES
 * API response and request type definitions
 * Used across: All API calls, Supabase queries
 */

// ============================================================
// GENERIC API RESPONSES
// ============================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  success: boolean;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
  error: ApiError | null;
  success: boolean;
}

/**
 * API Error
 */
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  statusCode?: number;
}

// ============================================================
// PAGINATION
// ============================================================

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

// ============================================================
// QUERY TYPES
// ============================================================

export interface BaseQuery {
  sort?: SortOptions;
  pagination?: PaginationParams;
}

export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}

export interface SearchQuery extends BaseQuery {
  query: string;
  fields?: string[];
}

// ============================================================
// UPLOAD TYPES
// ============================================================

export interface FileUpload {
  file: File | Blob;
  filename: string;
  bucket: "avatars" | "properties" | "documents" | "services";
  folder?: string;
}

export interface UploadResponse {
  url: string;
  path: string;
  publicUrl: string;
}

export interface MultipleUploadResponse {
  uploads: UploadResponse[];
  failed: {
    filename: string;
    error: string;
  }[];
}

// ============================================================
// BULK OPERATIONS
// ============================================================

export interface BulkOperationResult<T> {
  successful: T[];
  failed: {
    item: Partial<T>;
    error: string;
  }[];
  summary: {
    total: number;
    succeeded: number;
    failed: number;
  };
}

// ============================================================
// VALIDATION
// ============================================================

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResponse {
  valid: boolean;
  errors: ValidationError[];
}

// ============================================================
// SUPABASE SPECIFIC
// ============================================================

export interface SupabaseError {
  message: string;
  details: string | null;
  hint: string | null;
  code: string;
}

export interface SupabaseResponse<T> {
  data: T | null;
  error: SupabaseError | null;
  count?: number | null;
  status: number;
  statusText: string;
}

// ============================================================
// REAL-TIME UPDATES
// ============================================================

export type RealtimeEvent = "INSERT" | "UPDATE" | "DELETE";

export interface RealtimePayload<T> {
  eventType: RealtimeEvent;
  new: T | null;
  old: T | null;
  table: string;
  schema: string;
  commit_timestamp: string;
}

// ============================================================
// NOTIFICATION TYPES
// ============================================================

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  related_id: string | null;
  related_type: string | null;
  action_url: string | null;
  read: boolean;
  read_at: string | null;
  created_at: string;
}

export type NotificationType =
  | "booking"
  | "payment"
  | "message"
  | "review"
  | "job_request"
  | "job_update"
  | "property_update"
  | "system"
  | "marketing";

export interface NotificationPreferences {
  push_enabled: boolean;
  email_enabled: boolean;
  sms_enabled: boolean;
  types: {
    [K in NotificationType]: boolean;
  };
}

// ============================================================
// ANALYTICS TYPES
// ============================================================

export interface AnalyticsEvent {
  event_name: string;
  properties: Record<string, any>;
  user_id?: string;
  timestamp: string;
}

export interface AnalyticsMetric {
  name: string;
  value: number;
  change?: number;
  changePercent?: number;
}

// ============================================================
// HEALTH CHECK
// ============================================================

export interface HealthCheck {
  status: "healthy" | "degraded" | "down";
  timestamp: string;
  services: {
    database: ServiceStatus;
    storage: ServiceStatus;
    auth: ServiceStatus;
  };
}

export interface ServiceStatus {
  status: "up" | "down";
  responseTime?: number;
  message?: string;
}
