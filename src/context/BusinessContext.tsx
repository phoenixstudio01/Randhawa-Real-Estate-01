import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BusinessSettings, Property, Enquiry } from '../types';
import {
  getBusinessSettings,
  updateBusinessSettings,
  getProperties,
  getEnquiries,
  getAdminSession,
  getAdminAccount,
  updateAdminCredentials,
  AdminAccountInfo,
  adminLogin,
  adminLogout,
  adminForgotPassword,
  subscribeToDataChanges,
  AdminSession,
} from '../services/dataService';
import { initialBusinessSettings } from '../data/initialData';

interface NotificationState {
  type: 'success' | 'error' | 'info';
  message: string;
}

interface BusinessContextType {
  settings: BusinessSettings;
  updateSettings: (updates: Partial<BusinessSettings>) => Promise<boolean>;
  properties: Property[];
  publishedProperties: Property[];
  refreshData: () => Promise<void>;
  enquiries: Enquiry[];
  adminSession: AdminSession | null;
  adminAccount: AdminAccountInfo;
  isAdminAuthenticated: boolean;
  isAuthenticated: boolean;
  login: (email: string, pass: string, remember?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  changeAdminCredentials: (currentPassword: string, newEmail: string, newPassword?: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  currentRoute: string;
  navigateTo: (path: string) => void;
  notification: NotificationState | null;
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
  clearNotification: () => void;
  isLoading: boolean;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<BusinessSettings>(initialBusinessSettings);
  const [properties, setProperties] = useState<Property[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [adminSession, setAdminSession] = useState<AdminSession | null>(getAdminSession());
  const [adminAccount, setAdminAccount] = useState<AdminAccountInfo>(getAdminAccount());
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Parse path from location or default to '/'
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const p = window.location.pathname;
    return p.length > 0 ? p : '/';
  });

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const clearNotification = () => setNotification(null);

  const navigateTo = (path: string) => {
    if (path !== currentRoute) {
      window.history.pushState({}, '', path);
      setCurrentRoute(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Sync with browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const loadAll = async () => {
    try {
      const [s, p, e] = await Promise.all([
        getBusinessSettings(),
        getProperties(),
        getEnquiries(),
      ]);
      setSettings(s);
      setProperties(p);
      setEnquiries(e);
      setAdminSession(getAdminSession());
      setAdminAccount(getAdminAccount());
    } catch (err) {
      console.error('Error loading data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();

    // Subscribe to multi-tab or local data service updates
    const unsubscribe = subscribeToDataChanges(() => {
      loadAll();
    });

    return () => unsubscribe();
  }, []);

  // Synchronize document title with dynamic business name
  useEffect(() => {
    if (settings.business_name) {
      document.title = `${settings.business_name} | ${settings.tagline || 'Find a Place That Feels Like Home'}`;
    }
  }, [settings.business_name, settings.tagline]);

  const handleUpdateSettings = async (updates: Partial<BusinessSettings>): Promise<boolean> => {
    try {
      const updated = await updateBusinessSettings(updates);
      setSettings(updated);
      showNotification('success', 'Business settings saved successfully. Updated globally across website.');
      return true;
    } catch (e) {
      showNotification('error', 'Failed to update business settings.');
      return false;
    }
  };

  const handleLogin = async (email: string, pass: string, remember = true) => {
    const res = await adminLogin(email, pass, remember);
    if (res.success) {
      setAdminSession(getAdminSession());
      showNotification('success', 'Welcome to the Admin Portal.');
    }
    return res;
  };

  const handleLogout = async () => {
    await adminLogout();
    setAdminSession(null);
    showNotification('info', 'Logged out of admin panel.');
    navigateTo('/');
  };

  const handleForgotPassword = async (email: string) => {
    return await adminForgotPassword(email);
  };

  const handleChangeAdminCredentials = async (currentPassword: string, newEmail: string, newPassword?: string) => {
    const res = await updateAdminCredentials(currentPassword, newEmail, newPassword);
    if (res.success) {
      setAdminAccount(getAdminAccount());
      setAdminSession(getAdminSession());
      showNotification('success', 'Admin security credentials updated successfully.');
    }
    return res;
  };

  const publishedProperties = properties.filter(p => p.published);

  return (
    <BusinessContext.Provider
      value={{
        settings,
        updateSettings: handleUpdateSettings,
        properties,
        publishedProperties,
        refreshData: loadAll,
        enquiries,
        adminSession,
        adminAccount,
        isAdminAuthenticated: Boolean(adminSession?.authenticated),
        isAuthenticated: Boolean(adminSession?.authenticated),
        login: handleLogin,
        logout: handleLogout,
        changeAdminCredentials: handleChangeAdminCredentials,
        forgotPassword: handleForgotPassword,
        currentRoute,
        navigateTo,
        notification,
        showNotification,
        clearNotification,
        isLoading,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}
