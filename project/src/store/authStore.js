import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

// Mock user data for demonstration
const mockUsers = [
  {
    id: 1,
    email: 'admin@municipality.gov.za',
    password: 'admin123',
    name: 'System Administrator',
    role: 'admin',
    department: 'IT Department',
    municipality: 'City of Cape Town'
  },
  {
    id: 2,
    email: 'auditor@municipality.gov.za',
    password: 'auditor123',
    name: 'Chief Auditor',
    role: 'auditor',
    department: 'Internal Audit',
    municipality: 'City of Cape Town'
  },
  {
    id: 3,
    email: 'manager@municipality.gov.za',
    password: 'manager123',
    name: 'Finance Manager',
    role: 'manager',
    department: 'Finance Department',
    municipality: 'City of Cape Town'
  },
  {
    id: 4,
    email: 'clerk@municipality.gov.za',
    password: 'clerk123',
    name: 'Finance Clerk',
    role: 'clerk',
    department: 'Finance Department',
    municipality: 'City of Cape Town'
  }
];

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = mockUsers.find(
          u => u.email === email && u.password === password
        );
        
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({ 
            user: userWithoutPassword, 
            isAuthenticated: true, 
            isLoading: false 
          });
          toast.success(`Welcome back, ${user.name}!`);
          return { success: true };
        } else {
          set({ isLoading: false });
          toast.error('Invalid email or password');
          return { success: false, error: 'Invalid credentials' };
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
        toast.success('Logged out successfully');
      },

      updateProfile: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          set({ user: updatedUser });
          toast.success('Profile updated successfully');
        }
      },

      // Get user permissions based on role
      hasPermission: (permission) => {
        const user = get().user;
        if (!user) return false;

        const permissions = {
          admin: ['read', 'write', 'delete', 'manage_users', 'system_settings'],
          auditor: ['read', 'write', 'audit_reports', 'compliance_review'],
          manager: ['read', 'write', 'approve_budgets', 'manage_department'],
          clerk: ['read', 'write_limited', 'data_entry']
        };

        return permissions[user.role]?.includes(permission) || false;
      }
    }),
    {
      name: 'sams-auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);