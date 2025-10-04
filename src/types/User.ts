export interface User {
  id: string;
  name: string;
  email: string;
  userType: 'buyer' | 'seller' | 'agent' | 'admin';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  credits: number;
  registrationDate: string;
  approvedBy?: string;
  approvedDate?: string;
  phone?: string;
  company?: string;
  licenseNumber?: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: 'deduction' | 'addition';
  amount: number;
  reason: string;
  timestamp: string;
  adminId?: string;
  propertyId?: string;
}

export interface PendingRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: 'agent' | 'seller';
  company?: string;
  licenseNumber?: string;
  registrationDate: string;
  documents?: string[];
}