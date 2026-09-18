import React from 'react';
import { useBusiness } from '../context/BusinessContext';
import { ArrowRight, ShieldCheck, MapPin, Compass, Building2, Users } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings, navigateTo } = useBusiness();

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2D6A4F]">
            About The Advisory
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1F2421] tracking-tight">
            {settings.business_name}
          </h1>
          <p className="text-lg text-[#525955] font-normal">
            &ldquo;{settings.tagline || 'Find a Place That Feels Like Home.'}&rdquo;
          </p>
        </div>

        {/* Hero narrative block */}
        <div className="bg-[#FFFFFF] border border-[#E7E2D8] p-8 sm:p-12 rounded-sm space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F2421]">
            Dedicated to Delhi-NCR Real Estate
          </h2>
          <div className="space-y-4 text-base text-[#4A5568] leading-relaxed">
            <p>
              At <strong className="text-[#1F2421]">{settings.business_name}</strong>, we believe choosing a property is not simply a financial transaction—it is about securing a home where life unfolds or acquiring a commercial workspace where enterprise flourishes.
            </p>
            <p>
              Operating across prime corridors in Gurgaon, Noida, and New Delhi, our focus is grounded in deep local market insight, verified documentation, and transparent representation. We bridge the gap between discerning buyers, tenants, and developers without confusion or high-pressure tactics.
            </p>
          </div>

          <div className="pt-6 border-t border-[#F0ECE1] grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-[#2D6A4F] shrink-0 mt-1" />
              <div>
                <h4 className="font-serif font-bold text-sm text-[#1F2421]">Residential &amp; Commercial</h4>
                <p className="text-xs text-[#718096] mt-0.5">Apartments, villas, builder floors, and premium office assets.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#2D6A4F] shrink-0 mt-1" />
              <div>
                <h4 className="font-serif font-bold text-sm text-[#1F2421]">Regional Mastery</h4>
                <p className="text-xs text-[#718096] mt-0.5">Focused specifically on growth hubs in Delhi-NCR, India.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#2D6A4F] shrink-0 mt-1" />
              <div>
                <h4 className="font-serif font-bold text-sm text-[#1F2421]">Transparent Process</h4>
                <p className="text-xs text-[#718096] mt-0.5">Direct communication, clear advisory, and verified inventory.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Guiding values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FFFFFF] border border-[#E7E2D8] p-8 rounded-sm">
            <h3 className="font-serif text-lg font-bold text-[#1F2421] mb-2">
              Curated Discovery
            </h3>
            <p className="text-sm text-[#5B635E] leading-relaxed">
              We vet every residential and commercial listing to ensure sensible floor plans, legitimate registry credentials, and high-demand locations.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E7E2D8] p-8 rounded-sm">
            <h3 className="font-serif text-lg font-bold text-[#1F2421] mb-2">
              End-to-End Support
            </h3>
            <p className="text-sm text-[#5B635E] leading-relaxed">
              From your initial inquiry through site walkthroughs, lease agreements, and closing formalities, our team stands alongside you.
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E7E2D8] p-8 rounded-sm">
            <h3 className="font-serif text-lg font-bold text-[#1F2421] mb-2">
              Long-Term Partnership
            </h3>
            <p className="text-sm text-[#5B635E] leading-relaxed">
              We prioritize enduring relationships over quick deals, providing honest counsel on whether a property represents genuine long-term value.
            </p>
          </div>
        </div>

        {/* CTA banner */}
        <div className="bg-[#1F2421] text-white p-8 sm:p-12 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl font-bold text-white">
              Ready to find your next property?
            </h3>
            <p className="text-sm text-[#CBD5E1] mt-1">
              Browse our portfolio or get in touch directly with our consultants.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigateTo('/properties')}
              className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-6 py-3 rounded-sm text-sm font-semibold transition-colors cursor-pointer"
            >
              Explore Portfolio
            </button>
            <button
              onClick={() => navigateTo('/contact')}
              className="border border-white/30 hover:bg-white/10 text-white px-6 py-3 rounded-sm text-sm font-medium transition-colors cursor-pointer"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
