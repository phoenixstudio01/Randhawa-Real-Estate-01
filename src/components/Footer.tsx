import React from 'react';
import { useBusiness } from '../context/BusinessContext';
import { MapPin, Phone, Mail, MessageSquare, Shield, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, navigateTo } = useBusiness();

  const currentYear = new Date().getFullYear();

  const handleWhatsAppClick = () => {
    const cleanNumber = settings.whatsapp.replace(/\D/g, '');
    const text = encodeURIComponent(`Hi, I would like to enquire about properties with ${settings.business_name}.`);
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  return (
    <footer className="bg-[#191D1A] text-[#E5E7EB] pt-16 pb-12 border-t border-[#262C27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#2C332E]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-[#2D6A4F] flex items-center justify-center text-[#FAF8F5] font-brand font-bold text-lg">
                {settings.business_name ? settings.business_name.charAt(0).toUpperCase() : 'R'}
              </div>
              <span className="font-serif text-2xl font-bold text-[#F4F1EA] tracking-tight">
                {settings.business_name}
              </span>
            </div>
            <p className="text-[#9CA3AF] text-sm leading-relaxed max-w-sm">
              {settings.tagline || 'Find a Place That Feels Like Home.'} Thoughtfully curated residential and commercial property opportunities across Delhi-NCR.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleWhatsAppClick}
                className="inline-flex items-center gap-2 bg-[#2D6A4F] hover:bg-[#40916C] text-[#FAF8F5] text-xs font-medium px-4 py-2 rounded-sm transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Us</span>
              </button>
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 bg-[#262C27] hover:bg-[#323A34] text-[#E5E7EB] text-xs font-medium px-4 py-2 rounded-sm transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#52B788]" />
                <span>{settings.phone}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#D8D2C6]">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-[#9CA3AF]">
              <li>
                <button
                  onClick={() => navigateTo('/')}
                  className="hover:text-[#FAF8F5] transition-colors cursor-pointer text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/properties')}
                  className="hover:text-[#FAF8F5] transition-colors cursor-pointer text-left"
                >
                  All Properties
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/about')}
                  className="hover:text-[#FAF8F5] transition-colors cursor-pointer text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/contact')}
                  className="hover:text-[#FAF8F5] transition-colors cursor-pointer text-left"
                >
                  Contact &amp; Enquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#D8D2C6]">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm text-[#9CA3AF]">
              <li>
                <button
                  onClick={() => navigateTo('/properties')}
                  className="hover:text-[#FAF8F5] transition-colors cursor-pointer text-left"
                >
                  Buy a Property
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/properties')}
                  className="hover:text-[#FAF8F5] transition-colors cursor-pointer text-left"
                >
                  Rent a Property
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/contact')}
                  className="hover:text-[#FAF8F5] transition-colors cursor-pointer text-left"
                >
                  Sell Your Property
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/contact')}
                  className="hover:text-[#FAF8F5] transition-colors cursor-pointer text-left"
                >
                  Commercial Advisory
                </button>
              </li>
            </ul>
          </div>

          {/* Office Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#D8D2C6]">
              Office
            </h4>
            <div className="space-y-3 text-sm text-[#9CA3AF]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#52B788] shrink-0 mt-0.5" />
                <span>{settings.location}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#52B788] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors truncate">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#52B788] shrink-0" />
                <span>{settings.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280]">
          <p>
            &copy; {currentYear} {settings.business_name}. All rights reserved. Demo package representation.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[#4B5563]">Delhi-NCR, India</span>
            <span className="text-[#374151]">&bull;</span>
            <button
              onClick={() => navigateTo('/admin')}
              className="text-[#9CA3AF] hover:text-[#52B788] inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Shield className="w-3 h-3" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
