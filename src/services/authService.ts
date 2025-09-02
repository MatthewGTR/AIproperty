import { User, PendingRegistration, CreditTransaction } from '../types/User';

// Mock database - in real app, this would be a proper database
let users: User[] = [
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@aiproperty.com',
    userType: 'admin',
    status: 'approved',
    credits: 0,
    registrationDate: '2025-01-01'
  }
];

let pendingRegistrations: PendingRegistration[] = [];
let creditTransactions: CreditTransaction[] = [];

export const authService = {
  // User Authentication
  login: async (email: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> => {
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    if (user.status === 'pending') {
      return { success: false, message: 'Your account is pending admin approval' };
    }
    
    if (user.status === 'rejected') {
      return { success: false, message: 'Your account has been rejected' };
    }
    
    if (user.status === 'suspended') {
      return { success: false, message: 'Your account has been suspended' };
    }
    
    return { success: true, user };
  },

  // User Registration
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    userType: 'buyer' | 'seller' | 'agent';
    phone?: string;
    company?: string;
    licenseNumber?: string;
  }): Promise<{ success: boolean; message: string }> => {
    // Check if user already exists
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: 'Email already registered' };
    }

    if (userData.userType === 'buyer') {
      // Buyers get immediate approval
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        userType: userData.userType,
        status: 'approved',
        credits: 0,
        registrationDate: new Date().toISOString(),
        phone: userData.phone
      };
      
      users.push(newUser);
      return { success: true, message: 'Account created successfully!' };
    } else {
      // Agents and sellers need admin approval
      const pendingReg: PendingRegistration = {
        id: `pending_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        userType: userData.userType as 'agent' | 'seller',
        company: userData.company,
        licenseNumber: userData.licenseNumber,
        registrationDate: new Date().toISOString()
      };
      
      pendingRegistrations.push(pendingReg);
      return { 
        success: true, 
        message: 'Registration submitted! Your account will be reviewed by an admin within 24-48 hours.' 
      };
    }
  },

  // Get current user
  getCurrentUser: (userId: string): User | null => {
    return users.find(u => u.id === userId) || null;
  },

  // Admin Functions
  getPendingRegistrations: (): PendingRegistration[] => {
    return pendingRegistrations;
  },

  approveRegistration: (registrationId: string, adminId: string): { success: boolean; message: string } => {
    const pendingIndex = pendingRegistrations.findIndex(p => p.id === registrationId);
    
    if (pendingIndex === -1) {
      return { success: false, message: 'Registration not found' };
    }
    
    const pending = pendingRegistrations[pendingIndex];
    
    // Create approved user
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: pending.name,
      email: pending.email,
      userType: pending.userType,
      status: 'approved',
      credits: pending.userType === 'agent' ? 10 : 0, // Give agents 10 free credits
      registrationDate: pending.registrationDate,
      approvedBy: adminId,
      approvedDate: new Date().toISOString(),
      phone: pending.phone,
      company: pending.company,
      licenseNumber: pending.licenseNumber
    };
    
    users.push(newUser);
    pendingRegistrations.splice(pendingIndex, 1);
    
    // Record credit transaction if agent
    if (pending.userType === 'agent') {
      const transaction: CreditTransaction = {
        id: `tx_${Date.now()}`,
        userId: newUser.id,
        type: 'addition',
        amount: 10,
        reason: 'Welcome bonus for new agent',
        timestamp: new Date().toISOString(),
        adminId
      };
      creditTransactions.push(transaction);
    }
    
    return { success: true, message: 'Registration approved successfully' };
  },

  rejectRegistration: (registrationId: string, adminId: string): { success: boolean; message: string } => {
    const pendingIndex = pendingRegistrations.findIndex(p => p.id === registrationId);
    
    if (pendingIndex === -1) {
      return { success: false, message: 'Registration not found' };
    }
    
    pendingRegistrations.splice(pendingIndex, 1);
    return { success: true, message: 'Registration rejected' };
  },

  // Credit Management
  addCredits: (userId: string, amount: number, reason: string, adminId: string): { success: boolean; message: string } => {
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    user.credits += amount;
    
    const transaction: CreditTransaction = {
      id: `tx_${Date.now()}`,
      userId,
      type: 'addition',
      amount,
      reason,
      timestamp: new Date().toISOString(),
      adminId
    };
    
    creditTransactions.push(transaction);
    
    return { success: true, message: `${amount} credits added successfully` };
  },

  deductCredits: (userId: string, amount: number, reason: string, propertyId?: string): { success: boolean; message: string } => {
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    if (user.credits < amount) {
      return { success: false, message: 'Insufficient credits' };
    }
    
    user.credits -= amount;
    
    const transaction: CreditTransaction = {
      id: `tx_${Date.now()}`,
      userId,
      type: 'deduction',
      amount,
      reason,
      timestamp: new Date().toISOString(),
      propertyId
    };
    
    creditTransactions.push(transaction);
    
    return { success: true, message: `${amount} credits deducted` };
  },

  getUserCredits: (userId: string): number => {
    const user = users.find(u => u.id === userId);
    return user?.credits || 0;
  },

  getCreditTransactions: (userId?: string): CreditTransaction[] => {
    if (userId) {
      return creditTransactions.filter(t => t.userId === userId);
    }
    return creditTransactions;
  },

  // Admin user management
  getAllUsers: (): User[] => {
    return users;
  },

  updateUserStatus: (userId: string, status: User['status'], adminId: string): { success: boolean; message: string } => {
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    user.status = status;
    
    return { success: true, message: `User status updated to ${status}` };
  }
};