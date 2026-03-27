/**
 * PAYMENT DOMAIN TYPES
 * Payment, wallet, and transaction type definitions
 * Used across: All personas
 */

import { Database } from "../database.types";

// ============================================================
// DATABASE TYPES (from Supabase)
// ============================================================

export type PaymentRow = Database["public"]["Tables"]["payments"]["Row"];
export type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"];
export type PaymentUpdate = Database["public"]["Tables"]["payments"]["Update"];

export type WalletTransactionRow =
  Database["public"]["Tables"]["wallet_transactions"]["Row"];
export type UserWalletRow = Database["public"]["Tables"]["user_wallets"]["Row"];

// ============================================================
// PAYMENT TYPES
// ============================================================

/**
 * Complete Payment
 */
export interface Payment {
  id: string;
  tenant_id: string | null;
  property_id: string | null;
  tenancy_id: string | null;
  amount: number;
  status: PaymentStatus;
  payment_method: string | null;
  reference: string | null;
  paid_at: string | null;
  created_at: string;

  // Enhanced fields (from migration)
  payment_gateway: string | null;
  transaction_fee: number;
  currency: string;
  refunded: boolean;
  refund_amount: number | null;
  refund_reason: string | null;
  refunded_at: string | null;
}

/**
 * Payment with relations
 */
export interface PaymentWithRelations extends Payment {
  property?: {
    id: string;
    title: string;
    location: string;
  };
  tenant?: {
    id: string;
    full_name: string;
    phone_number: string | null;
  };
}

// ============================================================
// PAYMENT ENUMS
// ============================================================

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export type PaymentMethod =
  | "card"
  | "bank_transfer"
  | "wallet"
  | "paystack"
  | "flutterwave"
  | "cash";

export type PaymentGateway = "paystack" | "flutterwave" | "stripe";

// ============================================================
// PAYMENT CREATION
// ============================================================

export interface PaymentRequest {
  amount: number;
  property_id?: string;
  tenancy_id?: string;
  payment_method: PaymentMethod;
  payment_gateway?: PaymentGateway;
  reference?: string;
}

export interface PaymentVerification {
  reference: string;
  payment_gateway: PaymentGateway;
}

// ============================================================
// WALLET TYPES
// ============================================================

/**
 * User Wallet
 */
export interface UserWallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  pin_hash: string | null;
  pin_enabled: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Wallet Transaction
 */
export interface WalletTransaction {
  id: string;
  user_id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  currency: string;
  balance_before: number;
  balance_after: number;
  related_id: string | null;
  related_type: string | null;
  description: string;
  reference: string | null;
  status: TransactionStatus;
  created_at: string;
  completed_at: string | null;
}

export type TransactionType = "credit" | "debit";

export type TransactionCategory =
  | "rent_payment"
  | "service_payment"
  | "refund"
  | "withdrawal"
  | "deposit"
  | "commission"
  | "bonus"
  | "penalty";

export type TransactionStatus = "pending" | "completed" | "failed" | "reversed";

// ============================================================
// WALLET OPERATIONS
// ============================================================

export interface WalletDeposit {
  amount: number;
  payment_method: PaymentMethod;
  payment_gateway?: PaymentGateway;
}

export interface WalletWithdrawal {
  amount: number;
  bank_account: BankAccount;
}

export interface WalletTransfer {
  amount: number;
  recipient_id: string;
  description: string;
}

export interface BankAccount {
  account_number: string;
  account_name: string;
  bank_name: string;
  bank_code: string;
}

// ============================================================
// PAYMENT STATISTICS
// ============================================================

export interface PaymentStats {
  total_payments: number;
  successful_payments: number;
  failed_payments: number;
  total_amount: number;
  total_fees: number;
  total_refunds: number;
  success_rate: number;
}

export interface PaymentsByMonth {
  month: string; // YYYY-MM
  total_payments: number;
  total_amount: number;
  average_amount: number;
}

export interface WalletStats {
  current_balance: number;
  total_credits: number;
  total_debits: number;
  transaction_count: number;
}

// ============================================================
// PAYMENT FILTERS & QUERIES
// ============================================================

export interface PaymentFilters {
  status?: PaymentStatus[];
  payment_method?: PaymentMethod[];
  date_from?: string;
  date_to?: string;
  min_amount?: number;
  max_amount?: number;
  property_id?: string;
  tenant_id?: string;
}

export interface WalletTransactionFilters {
  type?: TransactionType[];
  category?: TransactionCategory[];
  status?: TransactionStatus[];
  date_from?: string;
  date_to?: string;
}

export interface PaymentQuery {
  filters?: PaymentFilters;
  sort?: {
    field: "created_at" | "amount" | "status";
    direction: "asc" | "desc";
  };
  limit?: number;
  offset?: number;
}

// ============================================================
// REFUND TYPES
// ============================================================

export interface RefundRequest {
  payment_id: string;
  amount: number;
  reason: string;
}

export interface RefundStatus {
  payment_id: string;
  refunded: boolean;
  refund_amount: number | null;
  refund_reason: string | null;
  refunded_at: string | null;
}

// ============================================================
// PAYMENT NOTIFICATIONS
// ============================================================

export interface PaymentNotification {
  payment_id: string;
  type:
    | "payment_initiated"
    | "payment_successful"
    | "payment_failed"
    | "refund_processed";
  recipient_id: string;
  message: string;
}
