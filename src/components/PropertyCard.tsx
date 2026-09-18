import React from 'react';
import { Property } from '../types';
import { useBusiness } from '../context/BusinessContext';
import { MapPin, Maximize2, BedDouble, ArrowUpRight, Tag } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { navigateTo } = useBusiness();

  // Find featured image or fallback to first image or placeholder
  const mainImage =
    property.images.find(img => img.is_featured)?.image_url ||
    property.images[0]?.image_url ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

  const handleClick = () => {
    navigateTo(`/properties/${property.slug}`);
  };

  return (
    <article
      id={`property-card-${property.id}`}
      onClick={handleClick}
      className="group bg-[#FFFFFF] border border-[#E7E2D8] rounded-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md hover:border-[#D5CEBF] cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative w-full h-56 sm:h-60 overflow-hidden bg-[#EFECE6]">
        <img
          src={mainImage}
          alt={property.name}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Purpose Badge (Buy / Rent) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase rounded-sm shadow-xs ${
              property.purpose === 'Rent'
                ? 'bg-[#1B4332] text-[#FAF8F5]'
                : 'bg-[#212529] text-[#FAF8F5]'
            }`}
          >
            {property.purpose === 'Rent' ? 'For Rent' : 'For Sale'}
          </span>
          {property.availability_status !== 'Available' && (
            <span className="px-2 py-1 text-[11px] font-medium tracking-wide uppercase bg-[#C59B27] text-white rounded-sm shadow-xs">
              {property.availability_status}
            </span>
          )}
        </div>

        {/* Property Type Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-black/60 backdrop-blur-xs text-[#FAF8F5] text-xs font-medium px-2.5 py-1 rounded-sm">
            {property.property_type}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Price */}
          <div className="flex items-baseline justify-between mb-2">
            <span className="font-serif text-2xl font-bold text-[#1B4332] tracking-tight">
              {property.price_display}
            </span>
            <span className="text-xs font-medium text-[#718096] uppercase tracking-wider">
              {property.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg font-bold text-[#1F2421] group-hover:text-[#1B4332] transition-colors line-clamp-1 mb-1.5">
            {property.name}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] mb-4">
            <MapPin className="w-3.5 h-3.5 text-[#1B4332] shrink-0" />
            <span className="line-clamp-1">{property.location}</span>
          </div>
        </div>

        {/* Specs and CTA Footer */}
        <div className="pt-4 border-t border-[#F0ECE1] flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-[#475569]">
            {property.bhk && (
              <div className="flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5 text-[#64748B]" />
                <span>{property.bhk}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-[#64748B]" />
              <span>{property.area_sqft.toLocaleString()} sq.ft.</span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1B4332] group-hover:underline">
            View Property
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
};
