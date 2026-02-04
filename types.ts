export enum Page {
  Dashboard = 'dashboard',
  Process = 'process',
  History = 'history',
  Analytics = 'analytics',
  Settings = 'settings',
}

export interface Bill {
  id: string;
  billNumber: string;
  vendorName: string;
  date: string;
  totalAmount: number;
  taxAmount: number;
  items: BillItem[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  grandTotal?: number;
  overallConfidence?: number;
  recommendedStatus?: 'PENDING' | 'VERIFIED' | 'FLAGGED';
  status?: 'PENDING' | 'VERIFIED' | 'FLAGGED';
}

export interface BillItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  name?: string;
  price?: number;
  total?: number;
  confidence?: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  storeName: string;
  storeType: string;
  storePhone: string;
  storeAddress: string;
  first_name?: string;
  last_name?: string;
  store_name?: string;
  store_type?: string;
  store_phone?: string;
  store_address?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface BusinessInsight {
  type: 'TREND' | 'ALERT' | 'RECOMMENDATION';
  title: string;
  content: string;
  impact: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
}

export interface Agent {
  agentName: string;
  verdict: 'OK' | 'WARNING' | 'CRITICAL';
  reasoning: string;
}
