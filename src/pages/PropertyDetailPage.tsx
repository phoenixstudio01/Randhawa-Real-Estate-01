import React, { useState, useMemo } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { submitEnquiry } from '../services/dataService';
import {
  MapPin,
  BedDouble,
  Maximize2,
  Building,
  Phone,
  MessageCircle,
  CheckCircle,
  ArrowLeft,
  Calendar,
  Send,
  ShieldCheck,
  Tag,
} from 'lucide-react';

interface PropertyDetailPageProps {
  slug: string;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({ slug }) => {
  const { properties, settings, navigateTo, showNotification, refreshData, isAdminAuthenticated } = useBusiness();

  // Find property by slug (public visitors can only view published properties)
  const property = useMemo(() => {
    const found = properties.find(p => p.slug === slug);
    if (!found) return null;
    if (!found.published && !isAdminAuthenticated) {
      return null;
    }
    return found;
  }, [properties, slug, isAdminAuthenticated]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Form state
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!property) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 bg-[#FAF8F5]">
        <h2 className="font-serif text-2xl font-bold text-[#1F2421] mb-2">Property Not Found</h2>
        <p className="text-sm text-[#718096] mb-6">
          The property you are looking for does not exist or may have been unlisted.
        </p>
        <button
          onClick={() => navigateTo('/properties')}
          className="inline-flex items-center gap-2 bg-[#1B4332] text-white px-5 py-2.5 rounded-sm text-sm font-medium hover:bg-[#143628] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Properties</span>
        </button>
      </div>
    );
  }

  const images = property.images && property.images.length > 0
    ? property.images
    : [
        {
          id: 'default-img',
          property_id: property.id,
          image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          is_featured: true,
          sort_order: 1,
        },
      ];

  const currentImageUrl = images[selectedImageIndex]?.image_url || images[0]?.image_url;

  // Dynamic WhatsApp pre-filled message according to Requirement #15:
  // “Hi, I am interested in Skyline Heights in Sector 67, Gurgaon. Please share more details.”
  const handleWhatsAppEnquiry = () => {
    const rawNumber = settings.whatsapp.replace(/\D/g, '');
    const text = encodeURIComponent(
      `Hi, I am interested in ${property.name} in ${property.location}. Please share more details.`
    );
    window.open(`https://wa.me/${rawNumber}?text=${text}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${settings.phone.replace(/\s+/g, '')}`;
  };

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) {
      showNotification('error', 'Please provide your name and contact phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitEnquiry({
        name: formName.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim() || 'Not specified',
        message: formMessage.trim() || `Interested in ${property.name} (${property.location})`,
        property_id: property.id,
        property_name: property.name,
      });

      setSubmitSuccess(true);
      showNotification('success', 'Enquiry sent! Our property advisor will get in touch shortly.');
      setFormName('');
      setFormPhone('');
      setFormEmail('');
      setFormMessage('');
      await refreshData();
    } catch (err) {
      showNotification('error', 'Failed to submit enquiry. Please try again or WhatsApp us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigateTo('/properties')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B4332] hover:text-[#2D6A4F] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Properties</span>
          </button>
          <div className="text-xs text-[#718096]">
            {property.purpose === 'Buy' ? 'For Sale' : 'For Rent'} &bull; {property.property_type}
          </div>
        </div>

        {/* Title & Top Metadata */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#E7E2D8]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-sm ${
                  property.purpose === 'Rent'
                    ? 'bg-[#1B4332] text-[#FAF8F5]'
                    : 'bg-[#212529] text-[#FAF8F5]'
                }`}
              >
                {property.purpose === 'Rent' ? 'For Rent' : 'For Sale'}
              </span>
              <span className="bg-[#EAE5DC] text-[#4A5568] px-2.5 py-1 rounded-sm text-xs font-medium">
                {property.property_type}
              </span>
              <span className="bg-[#EAE5DC] text-[#4A5568] px-2.5 py-1 rounded-sm text-xs font-medium">
                {property.category}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2421] tracking-tight">
              {property.name}
            </h1>
            <div className="flex items-center gap-1.5 text-sm text-[#64748B] mt-2">
              <MapPin className="w-4 h-4 text-[#1B4332]" />
              <span>{property.location}</span>
            </div>
          </div>

          <div className="flex flex-col lg:items-end">
            <span className="text-xs text-[#718096] uppercase font-medium tracking-wider">
              Offering Price
            </span>
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#1B4332]">
              {property.price_display}
            </span>
          </div>
        </div>

        {/* Main Layout: Gallery & Details + Side Contact Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left / Main Column (Gallery + Specs + Description + Features) */}
          <div className="lg:col-span-2 space-y-10">
            {/* Gallery Section */}
            <div className="space-y-4">
              {/* Primary Large Image */}
              <div className="relative w-full h-80 sm:h-[480px] bg-[#EFECE6] rounded-sm overflow-hidden border border-[#E7E2D8]">
                <img
                  src={currentImageUrl}
                  alt={`${property.name} - View ${selectedImageIndex + 1}`}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />
                {property.availability_status !== 'Available' && (
                  <div className="absolute top-4 left-4 bg-[#C59B27] text-white text-xs font-bold px-3 py-1.5 uppercase tracking-wider rounded-sm shadow-md">
                    {property.availability_status}
                  </div>
                )}
              </div>

              {/* Thumbnails row if more than 1 image */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-24 h-18 sm:w-28 sm:h-20 shrink-0 rounded-sm overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImageIndex === idx
                          ? 'border-[#1B4332] shadow-sm scale-95'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.image_url}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Key Specs Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#FFFFFF] border border-[#E7E2D8] p-6 rounded-sm">
              <div className="flex flex-col">
                <span className="text-xs text-[#718096] uppercase font-medium">Type</span>
                <span className="font-serif text-base font-bold text-[#1F2421] mt-0.5">
                  {property.property_type}
                </span>
              </div>

              {property.bhk && (
                <div className="flex flex-col">
                  <span className="text-xs text-[#718096] uppercase font-medium">Bedrooms</span>
                  <span className="font-serif text-base font-bold text-[#1F2421] mt-0.5">
                    {property.bhk}
                  </span>
                </div>
              )}

              <div className="flex flex-col">
                <span className="text-xs text-[#718096] uppercase font-medium">Super Area</span>
                <span className="font-serif text-base font-bold text-[#1F2421] mt-0.5">
                  {property.area_sqft.toLocaleString()} sq.ft.
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-[#718096] uppercase font-medium">Availability</span>
                <span className="font-serif text-base font-bold text-[#1B4332] mt-0.5">
                  {property.availability_status}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#FFFFFF] border border-[#E7E2D8] p-8 rounded-sm space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#1F2421]">
                About This Property
              </h2>
              <p className="text-base text-[#475569] leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Features & Amenities */}
            {property.features && property.features.length > 0 && (
              <div className="bg-[#FFFFFF] border border-[#E7E2D8] p-8 rounded-sm space-y-6">
                <h2 className="font-serif text-2xl font-bold text-[#1F2421]">
                  Features &amp; Highlights
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-[#FAF8F5] border border-[#EFECE6] rounded-sm text-sm text-[#334155]"
                    >
                      <CheckCircle className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Dynamic Contact & Enquiry Box */}
          <div className="space-y-6">
            <div className="bg-[#FFFFFF] border border-[#E7E2D8] p-6 sm:p-8 rounded-sm shadow-xs sticky top-28 space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2D6A4F]">
                  Immediate Enquiry
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1F2421] mt-1">
                  Connect with Agent
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  Verified property representation by {settings.business_name}.
                </p>
              </div>

              {/* Direct Instant Action Buttons */}
              <div className="space-y-3">
                {/* Enquire on WhatsApp with Dynamic Pre-filled message */}
                <button
                  id="property-whatsapp-cta"
                  onClick={handleWhatsAppEnquiry}
                  className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 px-4 rounded-sm text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enquire on WhatsApp</span>
                </button>

                {/* Call Now */}
                <button
                  id="property-call-cta"
                  onClick={handleCall}
                  className="w-full flex items-center justify-center gap-2.5 border border-[#1B4332] text-[#1B4332] hover:bg-[#1B4332] hover:text-[#FAF8F5] py-3.5 px-4 rounded-sm text-sm font-semibold transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Now: {settings.phone}</span>
                </button>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#E7E2D8]"></div>
                <span className="flex-shrink mx-4 text-xs uppercase text-[#94A3B8] font-medium tracking-wider">
                  or submit enquiry
                </span>
                <div className="flex-grow border-t border-[#E7E2D8]"></div>
              </div>

              {/* Inline Enquiry Form */}
              {submitSuccess ? (
                <div className="p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-sm text-center space-y-2">
                  <CheckCircle className="w-6 h-6 text-[#16A34A] mx-auto" />
                  <h4 className="font-serif font-bold text-sm text-[#166534]">Enquiry Received!</h4>
                  <p className="text-xs text-[#15803D]">
                    Our advisory team will reach out to you within business hours.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="text-xs text-[#166534] underline font-medium mt-2 cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitEnquiry} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formName}
                      onChange={e => setFormName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formPhone}
                      onChange={e => setFormPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={formEmail}
                      onChange={e => setFormEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#475569] mb-1">
                      Message
                    </label>
                    <textarea
                      rows={3}
                      placeholder={`I would like to schedule a site visit or ask about ${property.name}...`}
                      value={formMessage}
                      onChange={e => setFormMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-[#1B4332] hover:bg-[#143628] disabled:opacity-50 text-white py-3 rounded-sm text-sm font-semibold transition-all cursor-pointer shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Sending...' : 'Send Enquiry'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
