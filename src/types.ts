export type TransactionType = 'receita' | 'despesa';

export type PaymentMethod = 'pix' | 'boleto' | 'transferencia' | 'debito' | 'dinheiro' | 'cartao';

export type TransactionStatus = 'pago' | 'pendente' | 'agendado';

export type UserRole = 'sindico' | 'conselho' | 'condomino';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  recipientOrUnit: string;
  status: TransactionStatus;
  notes?: string;
  receiptName?: string;
  receiptUrl?: string;
  verifiedByCouncil: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  cryptoHash: string; // SHA-256 integrity hash
  createdAt: string;
  updatedAt: string;
}

export interface CondoUnit {
  id: string;
  unitNumber: string; // e.g. "101", "102"
  block: string;      // e.g. "Bloco A", "Bloco B"
  residentName: string;
  monthlyFee: number;
  status: 'adimplente' | 'pendente' | 'atrasado';
  lastPaymentDate?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  aptUnit?: string;
  photoUrl?: string;
}

export interface PushNotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  type: 'receita' | 'despesa' | 'sync' | 'audit' | 'system';
  read: boolean;
}

export interface GoogleSheetsSyncConfig {
  spreadsheetId: string | null;
  spreadsheetUrl: string | null;
  spreadsheetTitle: string;
  lastSyncedAt: string | null;
  autoSync: boolean;
  status: 'idle' | 'syncing' | 'success' | 'error';
  errorMessage?: string;
}

export interface MonthlyBalance {
  month: string;      // e.g. "Jan", "Fev"
  monthKey: string;   // e.g. "2026-01"
  income: number;
  expense: number;
  balance: number;
}
