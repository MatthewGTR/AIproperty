import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type CreditTransaction = Database['public']['Tables']['credit_transactions']['Row'];

export const authService = {
  // Sign up with Supabase Auth
  async signUp(userData: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    user_type: 'buyer' | 'seller' | 'agent';
    company?: string;
    license_number?: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
            phone: userData.phone,
            user_type: userData.user_type,
            company: userData.company,
            license_number: userData.license_number
          }
        }
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (userData.user_type === 'buyer') {
        return { success: true, message: 'Account created successfully!' };
      } else {
        return { 
          success: true, 
          message: 'Registration submitted! Your account will be reviewed by an admin within 24-48 hours.' 
        };
      }
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  // Sign in with Supabase Auth
  async signIn(email: string, password: string): Promise<{ success: boolean; user?: Profile; message?: string }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          if (profile.status === 'pending') {
            return { success: false, message: 'Your account is pending admin approval' };
          }
          if (profile.status === 'rejected') {
            return { success: false, message: 'Your account has been rejected' };
          }
          if (profile.status === 'suspended') {
            return { success: false, message: 'Your account has been suspended' };
          }
          
          return { success: true, user: profile };
        }
      }

      return { success: false, message: 'User profile not found' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  },

  // Get current user session
  async getCurrentUser(): Promise<Profile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        return profile;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Legacy register method for compatibility
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    userType: 'buyer' | 'seller' | 'agent';
    phone?: string;
    company?: string;
    licenseNumber?: string;
  }): Promise<{ success: boolean; message: string }> => {
    return authService.signUp({
      email: userData.email,
      password: userData.password,
      full_name: userData.name,
      phone: userData.phone,
      user_type: userData.userType,
      company: userData.company,
      license_number: userData.licenseNumber
    });
  },

  // Legacy login method for compatibility
  login: async (email: string, password: string): Promise<{ success: boolean; user?: any; message?: string }> => {
    const result = await authService.signIn(email, password);
    if (result.success && result.user) {
      return {
        success: true,
        user: {
          id: result.user.id,
          name: result.user.full_name,
          email: result.user.email,
          userType: result.user.user_type,
          credits: result.user.credits
        }
      };
    }
    return { success: result.success, message: result.message };
  },

  // Admin Functions
  async getPendingRegistrations(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending registrations:', error);
      return [];
    }

    return data || [];
  },

  async approveRegistration(registrationId: string, adminId: string): Promise<{ success: boolean; message: string }> {
    try {
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', registrationId)
        .single();

      if (fetchError || !profile) {
        return { success: false, message: 'Registration not found' };
      }

      // Update profile status
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          status: 'approved',
          approved_by: adminId,
          approved_at: new Date().toISOString(),
          credits: profile.user_type === 'agent' ? 10 : 0
        })
        .eq('id', registrationId);

      if (updateError) {
        throw updateError;
      }

      // Add welcome credits for agents
      if (profile.user_type === 'agent') {
        await supabase
          .from('credit_transactions')
          .insert({
            user_id: registrationId,
            transaction_type: 'addition',
            amount: 10,
            reason: 'Welcome bonus for new agent',
            admin_id: adminId
          });
      }

      return { success: true, message: 'Registration approved successfully' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  async rejectRegistration(registrationId: string, adminId: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          status: 'rejected',
          approved_by: adminId,
          approved_at: new Date().toISOString()
        })
        .eq('id', registrationId);

      if (error) throw error;
      return { success: true, message: 'Registration rejected' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  // Credit Management
  async addCredits(userId: string, amount: number, reason: string, adminId: string): Promise<{ success: boolean; message: string }> {
    try {
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', userId)
        .single();

      if (fetchError || !profile) {
        return { success: false, message: 'User not found' };
      }

      // Update credits
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ credits: profile.credits + amount })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Record transaction
      await supabase
        .from('credit_transactions')
        .insert({
          user_id: userId,
          transaction_type: 'addition',
          amount,
          reason,
          admin_id: adminId
        });

      return { success: true, message: `${amount} credits added successfully` };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  async deductCredits(userId: string, amount: number, reason: string, propertyId?: string): Promise<{ success: boolean; message: string }> {
    try {
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', userId)
        .single();

      if (fetchError || !profile) {
        return { success: false, message: 'User not found' };
      }

      if (profile.credits < amount) {
        return { success: false, message: 'Insufficient credits' };
      }

      // Update credits
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ credits: profile.credits - amount })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Record transaction
      await supabase
        .from('credit_transactions')
        .insert({
          user_id: userId,
          transaction_type: 'deduction',
          amount,
          reason,
          property_id: propertyId
        });

      return { success: true, message: `${amount} credits deducted` };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  async getUserCredits(userId: string): Promise<number> {
    const { data } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();
    
    return data?.credits || 0;
  },

  async getCreditTransactions(userId?: string): Promise<CreditTransaction[]> {
    let query = supabase
      .from('credit_transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }

    return data || [];
  },

  // Admin user management
  async getAllUsers(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }

    return data || [];
  },

  async updateUserStatus(userId: string, status: Profile['status'], adminId: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          status,
          approved_by: adminId,
          approved_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      return { success: true, message: `User status updated to ${status}` };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  // AI Context Management
  async saveUserAIContext(userId: string, context: UserProfile): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ai_context: context as any })
        .eq('id', userId);

      if (error) {
        console.error('Error saving AI context:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error saving AI context:', error);
      return false;
    }
  },

  async getUserAIContext(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('ai_context')
        .eq('id', userId)
        .single();

      if (error || !data?.ai_context) {
        return null;
      }

      return data.ai_context as UserProfile;
    } catch (error) {
      console.error('Error getting AI context:', error);
      return null;
    }
  }
};