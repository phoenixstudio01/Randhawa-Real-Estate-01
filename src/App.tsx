import React, { useEffect } from 'react';
import { BusinessProvider, useBusiness } from './context/BusinessContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { NotificationToast } from './components/NotificationToast';

// Public Pages
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminPropertiesPage } from './pages/admin/AdminPropertiesPage';
import { AdminPropertyFormPage } from './pages/admin/AdminPropertyFormPage';
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

const AppRouter: React.FC = () => {
  const { currentRoute, isAuthenticated, isAdminAuthenticated, isLoading, navigateTo } = useBusiness();
  const authenticated = Boolean(isAuthenticated || isAdminAuthenticated);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentRoute]);

  // Route matching logic
  const renderRoute = () => {
    // 1. Admin Login
    if (currentRoute === '/admin/login') {
      if (authenticated) {
        // If already logged in, redirect to admin dashboard
        return <AdminDashboardPage />;
      }
      return <AdminLoginPage />;
    }

    // 2. Protected Admin Routes (Requirement #19: Protected routes)
    if (currentRoute.startsWith('/admin')) {
      if (!authenticated && !isLoading) {
        return <AdminLoginPage />;
      }

      if (currentRoute === '/admin' || currentRoute === '/admin/dashboard') {
        return <AdminDashboardPage />;
      }

      if (currentRoute === '/admin/properties') {
        return <AdminPropertiesPage />;
      }

      if (currentRoute === '/admin/properties/new') {
        return <AdminPropertyFormPage />;
      }

      // Check edit property route: /admin/properties/:id/edit
      const editMatch = currentRoute.match(/^\/admin\/properties\/([^/]+)\/edit$/);
      if (editMatch) {
        const propertyId = editMatch[1];
        return <AdminPropertyFormPage propertyId={propertyId} />;
      }

      if (currentRoute === '/admin/enquiries') {
        return <AdminEnquiriesPage />;
      }

      if (currentRoute === '/admin/settings') {
        return <AdminSettingsPage />;
      }

      // Default admin fallback
      return <AdminDashboardPage />;
    }

    // 3. Public Routes
    let pageContent: React.ReactNode = null;

    if (currentRoute === '/' || currentRoute === '') {
      pageContent = <HomePage />;
    } else if (currentRoute === '/properties') {
      pageContent = <PropertiesPage />;
    } else if (currentRoute.startsWith('/properties/')) {
      const slug = currentRoute.replace('/properties/', '').trim();
      pageContent = <PropertyDetailPage slug={slug} />;
    } else if (currentRoute === '/about') {
      pageContent = <AboutPage />;
    } else if (currentRoute === '/contact') {
      pageContent = <ContactPage />;
    } else {
      pageContent = <HomePage />;
    }

    return (
      <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-[#1F2421]">
        <Navbar />
        <main className="flex-grow">{pageContent}</main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    );
  };

  return (
    <>
      {renderRoute()}
      <NotificationToast />
    </>
  );
};

export default function App() {
  return (
    <BusinessProvider>
      <AppRouter />
    </BusinessProvider>
  );
}
