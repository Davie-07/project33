import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const generateMemberId = (email, phone) => {
  const emailHash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const phoneHash = phone.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const combined = (emailHash + phoneHash) % 100000;
  return String(combined).padStart(5, '0');
};

const useStore = create(
  persist(
    (set, get) => ({
      // Auth state
      currentUser: null,
      users: [],
      messages: [],
      announcements: [],
      pendingChanges: [],
      
      // Auth actions
      register: (userData) => {
        const memberId = generateMemberId(userData.email, userData.phone);
        const newUser = {
          ...userData,
          id: Date.now().toString(),
          memberId,
          role: userData.email === 'admin@next4us.com' ? 'admin' : 'member',
          createdAt: new Date().toISOString(),
          emailVerified: false
        };
        
        set((state) => ({
          users: [...state.users, newUser]
        }));
        
        return newUser;
      },
      
      login: (email, password) => {
        const user = get().users.find(u => u.email === email && u.password === password);
        if (user) {
          set({ currentUser: user });
          return { success: true, user };
        }
        return { success: false, error: 'Invalid credentials' };
      },
      
      logout: () => {
        set({ currentUser: null });
      },
      
      skipVerification: () => {
        set((state) => ({
          currentUser: state.currentUser ? { ...state.currentUser, emailVerified: 'skipped' } : null
        }));
      },
      
      // Password reset
      findUserByEmailAndPhone: (email, phone) => {
        return get().users.find(u => u.email === email && u.phone === phone);
      },
      
      resetPassword: (userId, newPassword) => {
        set((state) => ({
          users: state.users.map(u => 
            u.id === userId ? { ...u, password: newPassword } : u
          )
        }));
      },
      
      // Messages
      sendMessage: (message) => {
        const newMessage = {
          id: Date.now().toString(),
          senderId: get().currentUser?.id,
          senderEmail: get().currentUser?.email,
          senderPhone: get().currentUser?.phone,
          content: message,
          timestamp: new Date().toISOString(),
          read: false
        };
        
        set((state) => ({
          messages: [...state.messages, newMessage]
        }));
      },
      
      replyToMessage: (messageId, reply) => {
        set((state) => ({
          messages: state.messages.map(m => 
            m.id === messageId ? { ...m, reply, repliedAt: new Date().toISOString() } : m
          )
        }));
      },
      
      deleteMessage: (messageId) => {
        set((state) => ({
          messages: state.messages.filter(m => m.id !== messageId)
        }));
      },
      
      // Admin actions
      updateMember: (userId, updates) => {
        const pendingChange = {
          id: Date.now().toString(),
          userId,
          updates,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        
        set((state) => ({
          pendingChanges: [...state.pendingChanges, pendingChange]
        }));
        
        return pendingChange.id;
      },
      
      acceptChange: (changeId) => {
        const change = get().pendingChanges.find(c => c.id === changeId);
        if (change) {
          set((state) => ({
            users: state.users.map(u => 
              u.id === change.userId ? { ...u, ...change.updates } : u
            ),
            pendingChanges: state.pendingChanges.filter(c => c.id !== changeId),
            currentUser: state.currentUser?.id === change.userId 
              ? { ...state.currentUser, ...change.updates }
              : state.currentUser
          }));
          return { success: true, message: 'Change was successful' };
        }
        return { success: false, message: 'Change not found' };
      },
      
      declineChange: (changeId) => {
        set((state) => ({
          pendingChanges: state.pendingChanges.filter(c => c.id !== changeId)
        }));
        return { success: true, message: 'Change declined by the user' };
      },
      
      deleteMember: (userId) => {
        set((state) => ({
          users: state.users.filter(u => u.id !== userId)
        }));
      },
      
      // Announcements
      createAnnouncement: (announcement) => {
        const newAnnouncement = {
          id: Date.now().toString(),
          ...announcement,
          createdAt: new Date().toISOString(),
          createdBy: get().currentUser?.id
        };
        
        set((state) => ({
          announcements: [...state.announcements, newAnnouncement]
        }));
      },
      
      deleteAnnouncement: (announcementId) => {
        set((state) => ({
          announcements: state.announcements.filter(a => a.id !== announcementId)
        }));
      },
      
      // Get announcements for current user
      getUserAnnouncements: () => {
        const user = get().currentUser;
        if (!user) return [];
        
        return get().announcements.filter(a => {
          // Check if announcement has expired
          if (a.expiryDate && new Date(a.expiryDate) < new Date()) {
            return false;
          }
          
          // Check if announcement is for all or specific users
          if (a.targetAudience === 'all') return true;
          if (a.targetMembers?.includes(user.id)) return true;
          
          return false;
        });
      }
    }),
    {
      name: 'next4us-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useStore;
