import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import {
  LayoutDashboard,
  Building2,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  PlusCircle,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { resetDemoData } from '../../services/dataService';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  subtitle,
  actionButton,
}) => {
  const { settings, currentRoute, navigateTo, logout, refreshData, showNotification } = useBusiness();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Properties', path: '/admin/properties', icon: Building2 },
    { label: 'Enquiries', path: '/admin/enquiries', icon: Inbox },
    { label: 'Business Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleNav = (path: string) => {
    navigateTo(path);
    setMobileNavOpen(false);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all property and demo settings back to default initial state?')) {
      resetDemoData();
      refreshData();
      showNotification('info', 'Demo data restored to default initial state.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] flex flex-col md:flex-row text-[#1F2421]">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#1F2421] text-white px-4 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-[#2D6A4F] flex items-center justify-center text-white font-serif font-bold text-sm">
            {settings.business_name ? settings.business_name.charAt(0).toUpperCase() : 'R'}
          </div>
          <div>
            <span className="font-serif font-bold text-sm tracking-tight block text-white truncate max-w-[170px]">
              {settings.business_name}
            </span>
            <span className="text-[10px] text-[#A0AEC0] uppercase tracking-wider block">
              Admin Panel
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-1.5 rounded-sm hover:bg-white/10 text-white cursor-pointer"
            aria-label="Toggle admin navigation"
          >
            {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Desktop Sidebar / Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1F2421] text-[#E5E7EB] flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Box */}
          <div className="p-6 border-b border-[#2C332E]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-[#2D6A4F] flex items-center justify-center text-white font-brand font-bold text-base">
                {settings.business_name ? settings.business_name.charAt(0).toUpperCase() : 'R'}
              </div>
              <div className="overflow-hidden">
                <h2 className="font-serif font-bold text-base text-white tracking-tight truncate">
                  {settings.business_name}
                </h2>
                <span className="text-[11px] text-[#52B788] font-medium tracking-wide">
                  Basic Admin &bull; ₹14,999
                </span>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5" aria-label="Admin Navigation">
            {navItems.map((item) => {
              const isActive =
                item.path === '/admin'
                  ? currentRoute === '/admin'
                  : currentRoute.startsWith(item.path);

              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-sm font-medium transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#2D6A4F] text-[#FAF8F5] shadow-xs'
                      : 'text-[#9CA3AF] hover:bg-[#282F2A] hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#6B7280]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#2C332E] space-y-2">
          {/* Return to Public Website */}
          <button
            onClick={() => navigateTo('/')}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#9CA3AF] hover:text-white hover:bg-[#282F2A] rounded-sm transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-[#52B788]" />
            <span>View Public Website</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={handleResetData}
            title="Restore original 10 properties and default business settings"
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#9CA3AF] hover:text-[#C59B27] hover:bg-[#282F2A] rounded-sm transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#C59B27]" />
            <span>Reset Demo Data</span>
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#EF4444] hover:bg-red-950/30 rounded-sm transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile navigation drawer */}
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      {/* Main Admin Content Container */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <div className="bg-[#FAF8F5] border-b border-[#E5E0D5] px-4 sm:px-8 py-5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F2421] tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            {actionButton && <div className="shrink-0">{actionButton}</div>}
          </div>
        </div>

        {/* Body View */}
        <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};
