import React from 'react';
import { useBusiness } from '../context/BusinessContext';
import { PropertyCard } from '../components/PropertyCard';
import { demoTestimonials, valueProps, servicesList } from '../data/initialData';
import {
  ArrowRight,
  MessageSquare,
  Building2,
  CheckCircle,
  Compass,
  FileText,
  HeartHandshake,
  Key,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { settings, publishedProperties, navigateTo } = useBusiness();

  // Take first 4 published properties for the featured section
  const featuredProperties = publishedProperties.slice(0, 4);

  const handleWhatsApp = () => {
    const cleanNumber = settings.whatsapp.replace(/\D/g, '');
    const text = encodeURIComponent(`Hi, I am interested in exploring properties with ${settings.business_name}.`);
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  const featureIcons = [Building2, Compass, FileText, HeartHandshake];

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      {/* 1. HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-[#1F2421] text-[#FAF8F5]">
        {/* Background Image with subtle overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
            alt="Luxury Architectural Residence"
            className="w-full h-full object-cover object-center opacity-30 scale-105 transform motion-safe:transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#171B18]/95 via-[#1F2421]/80 to-[#171B18]/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 flex flex-col justify-center">
          <div className="max-w-3xl space-y-6">
            {/* Tagline / Subtitle */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#FAF8F5]/10 backdrop-blur-xs border border-[#FAF8F5]/15 text-[#E7E2D8] text-xs font-medium tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#52B788]" />
              <span>Delhi-NCR Property Advisory</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAF8F5] leading-[1.15]">
              Find a Place That Feels Like Home.
            </h1>

            {/* Dynamic Supporting Text with Business Name */}
            <p className="text-lg sm:text-xl text-[#D1D5DB] leading-relaxed max-w-2xl font-normal">
              Explore thoughtfully selected homes and commercial spaces with{' '}
              <span className="text-[#FAF8F5] font-semibold">{settings.business_name}</span>.
            </p>

            {/* Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                id="hero-cta-explore"
                onClick={() => navigateTo('/properties')}
                className="inline-flex items-center justify-center gap-2.5 bg-[#2D6A4F] hover:bg-[#1B4332] text-[#FAF8F5] px-7 py-3.5 rounded-sm text-base font-semibold transition-all shadow-md active:scale-[0.98] cursor-pointer"
              >
                <span>Explore Properties</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="hero-cta-whatsapp"
                onClick={handleWhatsApp}
                className="inline-flex items-center justify-center gap-2.5 bg-[#FAF8F5]/15 hover:bg-[#FAF8F5]/25 text-[#FAF8F5] border border-[#FAF8F5]/30 px-7 py-3.5 rounded-sm text-base font-medium transition-all backdrop-blur-xs cursor-pointer"
              >
                <MessageSquare className="w-5 h-5 text-[#52B788]" />
                <span>WhatsApp Us</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-10 border-t border-white/10 grid grid-cols-3 gap-4 sm:gap-8 text-xs sm:text-sm text-[#E2E8F0] font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#52B788] shrink-0" />
                <span>Residential Properties</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#52B788] shrink-0" />
                <span>Commercial Spaces</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#52B788] shrink-0" />
                <span>Buy &bull; Sell &bull; Rent</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED PROPERTIES SECTION */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2D6A4F]">
              Handpicked Portfolio
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F2421] mt-2">
              Featured Properties
            </h2>
          </div>
          <button
            onClick={() => navigateTo('/properties')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B4332] hover:text-[#2D6A4F] cursor-pointer group"
          >
            <span>View All Properties ({publishedProperties.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {featuredProperties.length === 0 ? (
          <div className="p-12 text-center bg-[#FFFFFF] border border-[#E7E2D8] rounded-sm">
            <p className="text-[#64748B] text-sm">No featured properties published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* 3. WHY CHOOSE SECTION */}
      <section className="py-20 bg-[#F4F1EA] border-y border-[#E7E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2D6A4F]">
              Our Guiding Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F2421] mt-2">
              Why {settings.business_name}
            </h2>
            <p className="text-sm sm:text-base text-[#525955] mt-3">
              We focus on thoughtful discovery, verified market knowledge, and client-first guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop, idx) => {
              const Icon = featureIcons[idx % featureIcons.length];
              return (
                <div
                  key={prop.title}
                  className="bg-[#FFFFFF] p-8 border border-[#E5E0D5] rounded-sm transition-all duration-200 hover:shadow-xs hover:border-[#D5CEBF] flex flex-col"
                >
                  <div className="w-12 h-12 rounded-sm bg-[#FAF8F5] border border-[#E5E0D5] text-[#1B4332] flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#1F2421] mb-2">
                    {prop.title}
                  </h3>
                  <p className="text-sm text-[#5B635E] leading-relaxed">
                    {prop.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. SERVICES SECTION */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2D6A4F]">
            What We Do
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F2421] mt-2">
            Real Estate Services
          </h2>
          <p className="text-sm sm:text-base text-[#525955] mt-3">
            Tailored assistance for buyers, sellers, and tenants across Delhi-NCR.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {servicesList.map((service) => (
            <div
              key={service.title}
              className="bg-[#FFFFFF] border border-[#E7E2D8] p-8 rounded-sm flex flex-col justify-between hover:border-[#CBD5E1] transition-all"
            >
              <div>
                <div className="w-10 h-10 rounded-sm bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center mb-6">
                  <Key className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#1F2421] mb-3">
                  {service.title}
                </h3>
                <p className="text-sm text-[#5B635E] leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>
              <button
                onClick={() => {
                  if (service.purpose === 'Contact') {
                    navigateTo('/contact');
                  } else {
                    navigateTo('/properties');
                  }
                }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B4332] hover:text-[#2D6A4F] pt-4 border-t border-[#F0ECE1] cursor-pointer group"
              >
                <span>{service.cta}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section className="py-20 bg-[#F4F1EA] border-t border-[#E7E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2D6A4F]">
              Client Experiences
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F2421] mt-2">
              What Clients Say
            </h2>
            <p className="text-xs text-[#718096] mt-2 uppercase tracking-wider">
              Demonstration Feedback
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {demoTestimonials.map((t) => (
              <div
                key={t.id}
                className="bg-[#FFFFFF] p-8 border border-[#E7E2D8] rounded-sm flex flex-col justify-between"
              >
                <div className="mb-6">
                  <div className="flex gap-1 text-[#C59B27] mb-4">
                    {'★'.repeat(5)}
                  </div>
                  <p className="text-sm text-[#374151] italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-[#F0ECE1]">
                  <h4 className="font-serif font-bold text-sm text-[#1F2421]">
                    {t.author}
                  </h4>
                  <p className="text-xs text-[#6B7280]">
                    {t.location} &bull; {t.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA SECTION */}
      <section className="py-20 bg-[#1F2421] text-[#FAF8F5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FAF8F5]">
            Looking for the Right Property?
          </h2>
          <p className="text-[#D1D5DB] text-base sm:text-lg max-w-2xl mx-auto">
            Connect with our team to explore premium residential homes and commercial investments suited to your plans.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigateTo('/properties')}
              className="inline-flex items-center gap-2 bg-[#FAF8F5] text-[#1F2421] hover:bg-[#EAE5DC] px-8 py-3.5 rounded-sm text-sm font-semibold transition-colors cursor-pointer"
            >
              <span>Browse Properties</span>
              <ArrowRight className="w-4 h-4 text-[#1B4332]" />
            </button>
            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-2 bg-[#2D6A4F] hover:bg-[#1B4332] text-[#FAF8F5] px-8 py-3.5 rounded-sm text-sm font-semibold transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#52B788]" />
              <span>WhatsApp Us</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
