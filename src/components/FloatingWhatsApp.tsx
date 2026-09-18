import React from 'react';
import { useBusiness } from '../context/BusinessContext';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  propertyContext?: {
    name: string;
    location: string;
  };
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ propertyContext }) => {
  const { settings } = useBusiness();

  const handleOpenWhatsApp = () => {
    const rawNumber = settings.whatsapp ? settings.whatsapp.replace(/\D/g, '') : '919000000000';
    let message = `Hi, I am interested in exploring properties with ${settings.business_name}. Please share more details.`;

    if (propertyContext) {
      message = `Hi, I am interested in ${propertyContext.name} in ${propertyContext.location}. Please share more details.`;
    }

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${rawNumber}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <button
        id="floating-whatsapp-btn"
        onClick={handleOpenWhatsApp}
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer"
        aria-label="Chat with us on WhatsApp"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        {/* Subtle tooltip on hover */}
        <span className="hidden sm:group-hover:flex absolute right-16 top-1/2 -translate-y-1/2 bg-[#191D1A] text-[#FAF8F5] text-xs font-medium px-3 py-1.5 rounded-sm whitespace-nowrap shadow-md pointer-events-none transition-opacity">
          Chat on WhatsApp
        </span>
      </button>
    </div>
  );
};
