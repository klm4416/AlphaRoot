export interface User {
  id: number;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface Industry {
  id: number;
  name: string;
  code: string;
  description?: string;
}

export interface Stock {
  id: number;
  ticker: string;
  name: string;
  marketCap?: number;
  dividendYield?: number;
  currentPrice?: number;
  industry: Industry;
  createdAt: string;
  updatedAt: string;
}

export interface Financial {
  id: number;
  stockId: number;
  year: number;
  quarter?: number;
  revenue?: number;
  netIncome?: number;
  totalAssets?: number;
  totalDebt?: number;
  equity?: number;
  peRatio?: number;
  pbRatio?: number;
  createdAt: string;
}

export interface Disclosure {
  id: number;
  stockId: number;
  title: string;
  content?: string;
  disclosureDate: string;
  disclosureType?: string;
  createdAt: string;
}

export interface Preference {
  id: number;
  userId: number;
  riskTolerance: 'low' | 'medium' | 'high';
  investmentGoal: 'income' | 'growth' | 'balanced';
  investmentHorizon: 'short' | 'medium' | 'long';
  dividendPreference: boolean;
  growthPreference: boolean;
  valuePreference: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Recommendation {
  id: number;
  userId: number;
  stock: Stock;
  reason?: string;
  confidenceScore?: number;
  recommendationType: 'buy' | 'hold' | 'sell';
  targetPrice?: number;
  createdAt: string;
  isAccepted?: boolean | null;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
} 