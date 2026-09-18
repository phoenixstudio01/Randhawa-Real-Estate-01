import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { Menu, X, ArrowRight, ShieldCheck, Home } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { settings, currentRoute, navigateTo, isAdminAuthenticated } = useBusiness();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Properties', path: '/properties' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNav = (path: string) => {
    navigateTo(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') return currentRoute === '/';
    return currentRoute.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E7E2D8] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Business Logo & Name (One single source of truth from settings) */}
          <div
            id="navbar-brand-logo"
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-sm bg-[#1B4332] flex items-center justify-center text-[#FAF8F5] shadow-sm group-hover:bg-[#143628] transition-colors">
              <span className="font-brand font-bold text-lg tracking-wider">
                {settings.business_name ? settings.business_name.charAt(0).toUpperCase() : 'R'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl sm:text-2xl text-[#1F2421] tracking-tight group-hover:text-[#1B4332] transition-colors line-clamp-1">
                {settings.business_name}
              </span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#6B7280] font-medium hidden sm:block">
                Residential &amp; Commercial
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <button
                  key={link.path}
                  id={`nav-link-${link.label.toLowerCase()}`}
                  onClick={() => handleNav(link.path)}
                  className={`text-sm font-medium transition-colors cursor-pointer py-1 relative ${
                    active
                      ? 'text-[#1B4332] font-semibold'
                      : 'text-[#4A5568] hover:text-[#1F2421]'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1B4332] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              id="nav-cta-properties"
              onClick={() => handleNav('/properties')}
              className="inline-flex items-center justify-center gap-2 bg-[#1B4332] hover:bg-[#143628] text-[#FAF8F5] text-sm font-medium px-5 py-2.5 rounded-sm transition-all shadow-sm hover:shadow active:scale-[0.98] cursor-pointer"
            >
              <span>View Properties</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Admin Access Link */}
            <button
              id="nav-admin-portal-link"
              onClick={() => handleNav(isAdminAuthenticated ? '/admin' : '/admin/login')}
              title={isAdminAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
              className="p-2 text-[#718096] hover:text-[#1B4332] hover:bg-[#EFECE6] rounded-sm transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-sm text-[#1F2421] hover:bg-[#EFECE6] focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E7E2D8] bg-[#FAF8F5] px-4 pt-2 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2 pt-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`text-left px-3 py-2.5 rounded-sm text-base font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#EAE5DC] text-[#1B4332] font-semibold'
                      : 'text-[#4A5568] hover:bg-[#F2EFE9] hover:text-[#1F2421]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#E7E2D8] flex flex-col gap-2">
            <button
              onClick={() => handleNav('/properties')}
              className="w-full flex items-center justify-center gap-2 bg-[#1B4332] text-[#FAF8F5] py-3 rounded-sm text-sm font-medium shadow-sm cursor-pointer"
            >
              <span>View Properties</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleNav(isAdminAuthenticated ? '/admin' : '/admin/login')}
              className="w-full flex items-center justify-center gap-2 border border-[#CBD5E1] text-[#4A5568] py-2.5 rounded-sm text-sm font-medium hover:bg-[#EFECE6] cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#1B4332]" />
              <span>{isAdminAuthenticated ? 'Admin Panel' : 'Admin Login'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
