import React, { useState, useMemo } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyPurpose } from '../types';

export const PropertiesPage: React.FC = () => {
  const { publishedProperties, settings } = useBusiness();
  const [activeTab, setActiveTab] = useState<'All' | PropertyPurpose>('All');

  const filteredProperties = useMemo(() => {
    if (activeTab === 'All') return publishedProperties;
    return publishedProperties.filter(p => p.purpose === activeTab);
  }, [publishedProperties, activeTab]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2D6A4F]">
            Delhi-NCR Portfolio
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2421] mt-2 tracking-tight">
            Properties for Sale &amp; Rent
          </h1>
          <p className="text-base text-[#5B635E] mt-3">
            Explore curated residential apartments, independent villas, builder floors, and prime commercial spaces with {settings.business_name}.
          </p>
        </div>

        {/* Basic Category Navigation Tabs (All / Buy / Rent) */}
        <div className="flex items-center gap-2 mb-10 border-b border-[#E7E2D8] pb-4">
          {(['All', 'Buy', 'Rent'] as const).map((tab) => {
            const count =
              tab === 'All'
                ? publishedProperties.length
                : publishedProperties.filter(p => p.purpose === tab).length;

            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                id={`property-tab-${tab.toLowerCase()}`}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-sm text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#1B4332] text-[#FAF8F5] shadow-xs'
                    : 'bg-[#FFFFFF] border border-[#E7E2D8] text-[#4A5568] hover:bg-[#F4F1EA] hover:text-[#1F2421]'
                }`}
              >
                <span>{tab === 'All' ? 'All Properties' : tab === 'Buy' ? 'For Sale' : 'For Rent'}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-[#2D6A4F] text-[#FAF8F5]' : 'bg-[#EFECE6] text-[#718096]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Properties Grid: 3 columns desktop, 2 columns tablet, 1 column mobile */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-20 bg-[#FFFFFF] border border-[#E7E2D8] rounded-sm p-8">
            <h3 className="font-serif text-lg font-bold text-[#1F2421] mb-2">No properties found</h3>
            <p className="text-sm text-[#718096]">
              There are currently no published properties matching the selected category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
