import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { submitEnquiry } from '../services/dataService';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Send,
  CheckCircle,
  Clock,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, showNotification, refreshData } = useBusiness();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      showNotification('error', 'Please provide your name, phone number, and message.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitEnquiry({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || 'Not specified',
        message: message.trim(),
        property_id: null,
        property_name: 'General Consultation Inquiry',
      });

      setIsSuccess(true);
      showNotification('success', 'Thank you! Your enquiry has been received.');
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
      await refreshData();
    } catch (err) {
      showNotification('error', 'Failed to send enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const cleanNumber = settings.whatsapp.replace(/\D/g, '');
    const text = encodeURIComponent(`Hi ${settings.business_name}, I would like to get in touch regarding properties in Delhi-NCR.`);
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2D6A4F]">
            Get In Touch
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2421] mt-2 tracking-tight">
            Let&apos;s Find the Right Property for You.
          </h1>
          <p className="text-base text-[#5B635E] mt-3">
            Whether you are planning to purchase, lease, or list a property with {settings.business_name}, our consultants are ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Cards & Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FFFFFF] border border-[#E7E2D8] p-8 rounded-sm space-y-6">
              <h3 className="font-serif text-xl font-bold text-[#1F2421]">
                Office &amp; Contact Details
              </h3>

              <div className="space-y-5 text-sm text-[#475569]">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-sm bg-[#FAF8F5] border border-[#E7E2D8] text-[#1B4332] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase text-[#718096] block">Location</span>
                    <span className="font-medium text-[#1F2421]">{settings.location}</span>
                    <p className="text-xs text-[#64748B] mt-0.5">Delhi-NCR, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-sm bg-[#FAF8F5] border border-[#E7E2D8] text-[#1B4332] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase text-[#718096] block">Direct Phone</span>
                    <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="font-medium text-[#1F2421] hover:text-[#1B4332]">
                      {settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-sm bg-[#FAF8F5] border border-[#E7E2D8] text-[#25D366] flex items-center justify-center shrink-0 mt-0.5">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase text-[#718096] block">WhatsApp Support</span>
                    <button
                      onClick={handleWhatsApp}
                      className="font-medium text-[#1F2421] hover:text-[#25D366] cursor-pointer text-left"
                    >
                      {settings.whatsapp}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-sm bg-[#FAF8F5] border border-[#E7E2D8] text-[#1B4332] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase text-[#718096] block">Email</span>
                    <a href={`mailto:${settings.email}`} className="font-medium text-[#1F2421] hover:text-[#1B4332]">
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-sm bg-[#FAF8F5] border border-[#E7E2D8] text-[#1B4332] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase text-[#718096] block">Working Hours</span>
                    <span className="text-xs text-[#475569]">Monday – Saturday: 9:30 AM – 7:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F0ECE1]">
                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-3 rounded-sm text-sm font-semibold transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Start a WhatsApp Conversation</span>
                </button>
              </div>
            </div>

            {/* Google Maps Embed / Map Box */}
            <div className="bg-[#FFFFFF] border border-[#E7E2D8] rounded-sm overflow-hidden p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-[#718096]">
                <span className="font-semibold uppercase tracking-wider text-[#1F2421]">Advisory Location</span>
                <span>{settings.location}</span>
              </div>
              <div className="w-full h-52 bg-[#EFECE6] rounded-sm overflow-hidden relative border border-[#E7E2D8]">
                <iframe
                  title="Delhi NCR Location Map"
                  src="https://maps.google.com/maps?q=Gurgaon%20Sector%2067%20Haryana%20India&t=&z=12&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 grayscale-[40%] contrast-[110%]"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Enquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#FFFFFF] border border-[#E7E2D8] p-8 sm:p-10 rounded-sm shadow-xs">
              <h3 className="font-serif text-2xl font-bold text-[#1F2421] mb-2">
                Send Enquiry
              </h3>
              <p className="text-sm text-[#64748B] mb-8">
                Fill in the details below and an experienced property advisor will contact you shortly.
              </p>

              {isSuccess ? (
                <div className="p-8 bg-[#F0FDF4] border border-[#BBF7D0] rounded-sm text-center space-y-4">
                  <CheckCircle className="w-12 h-12 text-[#16A34A] mx-auto" />
                  <h4 className="font-serif text-xl font-bold text-[#166534]">
                    Thank you! Your enquiry has been received.
                  </h4>
                  <p className="text-sm text-[#15803D] max-w-md mx-auto">
                    We will review your requirements and reach out via phone or email to schedule an in-depth consultation.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="inline-block mt-4 bg-[#16A34A] text-white px-6 py-2.5 rounded-sm text-sm font-semibold hover:bg-[#15803D] transition-colors cursor-pointer"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-2">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vikram Sharma"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-2">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="vikram@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-2">
                      Your Message or Requirements *
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Please let us know your preferred location, budget range, BHK or commercial requirements..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1B4332] hover:bg-[#143628] disabled:opacity-50 text-white px-8 py-3.5 rounded-sm text-sm font-semibold transition-all shadow-sm cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Sending Enquiry...' : 'Send Enquiry'}</span>
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
