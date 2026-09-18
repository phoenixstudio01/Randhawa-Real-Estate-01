import React, { useState, useEffect } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import {
  createProperty,
  updateProperty,
  generateSlug,
} from '../../services/dataService';
import {
  Property,
  PropertyPurpose,
  PropertyCategory,
  AvailabilityStatus,
  PropertyImage,
} from '../../types';
import {
  ArrowLeft,
  Save,
  Upload,
  Trash2,
  Star,
  ChevronUp,
  ChevronDown,
  Plus,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

interface AdminPropertyFormPageProps {
  propertyId?: string; // If undefined, we are adding new
}

export const AdminPropertyFormPage: React.FC<AdminPropertyFormPageProps> = ({ propertyId }) => {
  const { properties, refreshData, navigateTo, showNotification } = useBusiness();

  const isEditing = Boolean(propertyId);
  const existing = properties.find((p) => p.id === propertyId);

  // Form states
  const [name, setName] = useState(existing?.name || '');
  const [slug, setSlug] = useState(existing?.slug || '');
  const [location, setLocation] = useState(existing?.location || '');
  const [price, setPrice] = useState<number>(existing?.price || 10000000);
  const [priceDisplay, setPriceDisplay] = useState(existing?.price_display || '₹1.00 Cr');
  const [purpose, setPurpose] = useState<PropertyPurpose>(existing?.purpose || 'Buy');
  const [category, setCategory] = useState<PropertyCategory>(existing?.category || 'Residential');
  const [propertyType, setPropertyType] = useState(existing?.property_type || 'Apartment');
  const [bhk, setBhk] = useState(existing?.bhk || '3 BHK');
  const [areaSqft, setAreaSqft] = useState<number>(existing?.area_sqft || 1500);
  const [description, setDescription] = useState(existing?.description || '');
  const [features, setFeatures] = useState<string[]>(
    existing?.features || ['Modular kitchen', 'Spacious living room', 'Covered parking', 'Security']
  );
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>(
    existing?.availability_status || 'Available'
  );
  const [published, setPublished] = useState<boolean>(existing ? existing.published : true);
  const [images, setImages] = useState<PropertyImage[]>(
    existing?.images || [
      {
        id: `img-${Date.now()}-1`,
        property_id: propertyId || 'temp',
        image_url:
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        is_featured: true,
        sort_order: 1,
      },
    ]
  );

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Auto-generate slug when name changes if adding or not manually touched
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing || slug === '') {
      setSlug(generateSlug(val, properties, propertyId));
    }
  };

  // Helper to quickly format Indian currency display
  const handlePriceChange = (val: number) => {
    setPrice(val);
    if (purpose === 'Rent') {
      setPriceDisplay(`₹${val.toLocaleString('en-IN')}/month`);
    } else {
      if (val >= 10000000) {
        setPriceDisplay(`₹${(val / 10000000).toFixed(2)} Cr`);
      } else if (val >= 100000) {
        setPriceDisplay(`₹${(val / 100000).toFixed(0)} Lakh`);
      } else {
        setPriceDisplay(`₹${val.toLocaleString('en-IN')}`);
      }
    }
  };

  const handleAddFeature = () => {
    if (newFeatureInput.trim()) {
      setFeatures([...features, newFeatureInput.trim()]);
      setNewFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // Image upload handling (supports File upload + URL direct addition)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File, idx) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newImg: PropertyImage = {
            id: `img-${Date.now()}-${idx}`,
            property_id: propertyId || 'temp',
            image_url: event.target.result as string,
            is_featured: images.length === 0,
            sort_order: images.length + 1,
          };
          setImages((prev) => [...prev, newImg]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      const newImg: PropertyImage = {
        id: `img-${Date.now()}`,
        property_id: propertyId || 'temp',
        image_url: imageUrlInput.trim(),
        is_featured: images.length === 0,
        sort_order: images.length + 1,
      };
      setImages([...images, newImg]);
      setImageUrlInput('');
    }
  };

  const handleSetFeatured = (index: number) => {
    setImages(
      images.map((img, i) => ({
        ...img,
        is_featured: i === index,
      }))
    );
  };

  const handleDeleteImage = (index: number) => {
    const next = images.filter((_, i) => i !== index);
    // If we removed the featured one, make the first one featured
    if (next.length > 0 && !next.some((img) => img.is_featured)) {
      next[0].is_featured = true;
    }
    setImages(next);
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;

    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    // update sort order
    copy.forEach((img, i) => (img.sort_order = i + 1));
    setImages(copy);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim() || !description.trim()) {
      showNotification('error', 'Please fill in Property Name, Location, and Description.');
      return;
    }

    if (images.length === 0) {
      showNotification('error', 'Please add at least one property image.');
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing && propertyId) {
        await updateProperty(propertyId, {
          name: name.trim(),
          slug: slug.trim() || generateSlug(name, properties, propertyId),
          location: location.trim(),
          price: Number(price),
          price_display: priceDisplay.trim(),
          purpose,
          category,
          property_type: propertyType,
          bhk: category === 'Residential' ? bhk : undefined,
          area_sqft: Number(areaSqft),
          description: description.trim(),
          features,
          availability_status: availabilityStatus,
          published,
          images,
        });
        showNotification('success', `Property "${name}" updated successfully.`);
      } else {
        await createProperty({
          name: name.trim(),
          slug: slug.trim() || generateSlug(name, properties),
          location: location.trim(),
          price: Number(price),
          price_display: priceDisplay.trim(),
          purpose,
          category,
          property_type: propertyType,
          bhk: category === 'Residential' ? bhk : undefined,
          area_sqft: Number(areaSqft),
          description: description.trim(),
          features,
          availability_status: availabilityStatus,
          published,
          images,
        });
        showNotification('success', `Property "${name}" created successfully.`);
      }

      await refreshData();
      navigateTo('/admin/properties');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save property.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout
      title={isEditing ? `Edit: ${existing?.name || 'Property'}` : 'Add New Property'}
      subtitle="Configure property specifications, images, and publishing status"
      actionButton={
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigateTo('/admin/properties')}
            className="px-4 py-2 border border-[#CBD5E1] rounded-sm text-xs font-semibold text-[#475569] hover:bg-[#FAF8F5] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-[#1B4332] hover:bg-[#143628] disabled:opacity-50 text-white px-5 py-2 rounded-sm text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Property'}</span>
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
        {/* Basic Info Box */}
        <div className="bg-[#FFFFFF] border border-[#E5E0D5] p-6 sm:p-8 rounded-sm space-y-6">
          <h3 className="font-serif text-lg font-bold text-[#1F2421]">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Property Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Skyline Heights"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                URL Slug (Auto-generated) *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="skyline-heights"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm font-mono text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
              />
              <span className="text-[11px] text-[#94A3B8] mt-1 block">
                Public URL: /properties/{slug || '...'}
              </span>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Location *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Sector 67, Gurgaon"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Category Specs */}
        <div className="bg-[#FFFFFF] border border-[#E5E0D5] p-6 sm:p-8 rounded-sm space-y-6">
          <h3 className="font-serif text-lg font-bold text-[#1F2421]">
            Pricing &amp; Type
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Purpose (Buy / Rent)
              </label>
              <select
                value={purpose}
                onChange={(e) => {
                  const p = e.target.value as PropertyPurpose;
                  setPurpose(p);
                  if (p === 'Rent' && !priceDisplay.includes('/month')) {
                    setPriceDisplay('₹45,000/month');
                  } else if (p === 'Buy' && priceDisplay.includes('/month')) {
                    setPriceDisplay('₹1.25 Cr');
                  }
                }}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
              >
                <option value="Buy">Buy (For Sale)</option>
                <option value="Rent">Rent (For Lease)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Property Type
              </label>
              <input
                type="text"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                placeholder="Apartment, Villa, Commercial Office, Builder Floor..."
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Price Display Label *
              </label>
              <input
                type="text"
                required
                value={priceDisplay}
                onChange={(e) => setPriceDisplay(e.target.value)}
                placeholder="e.g. ₹1.25 Cr or ₹42,000/month"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm font-semibold text-[#1B4332] focus:outline-none focus:border-[#1B4332]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Numeric Price Value (₹)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => handlePriceChange(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Super Area (Sq. Ft.)
              </label>
              <input
                type="number"
                value={areaSqft}
                onChange={(e) => setAreaSqft(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
              />
            </div>

            {category === 'Residential' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  Bedrooms (BHK)
                </label>
                <select
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
                >
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="4 BHK">4 BHK</option>
                  <option value="5+ BHK">5+ BHK</option>
                  <option value="Studio">Studio</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Availability Status
              </label>
              <select
                value={availabilityStatus}
                onChange={(e) => setAvailabilityStatus(e.target.value as AvailabilityStatus)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
              >
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Rented">Rented</option>
                <option value="Under Offer">Under Offer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Publishing Status
              </label>
              <select
                value={published ? 'true' : 'false'}
                onChange={(e) => setPublished(e.target.value === 'true')}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
              >
                <option value="true">Published Online (Live)</option>
                <option value="false">Save as Draft (Hidden)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description & Features */}
        <div className="bg-[#FFFFFF] border border-[#E5E0D5] p-6 sm:p-8 rounded-sm space-y-6">
          <h3 className="font-serif text-lg font-bold text-[#1F2421]">
            Description &amp; Highlights
          </h3>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
              Property Description *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the architectural highlights, room layout, community amenities, and surrounding neighborhood..."
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-2">
              Features &amp; Amenities
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newFeatureInput}
                onChange={(e) => setNewFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="e.g. Modular kitchen, Balcony, Power backup..."
                className="flex-1 px-3.5 py-2 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 bg-[#1B4332] hover:bg-[#143628] text-white rounded-sm text-xs font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {features.map((feature, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 bg-[#FAF8F5] border border-[#CBD5E1] px-3 py-1 rounded-sm text-xs text-[#334155]"
                >
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-[#94A3B8] hover:text-[#DC2626] cursor-pointer"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Image Management (Requirement #23) */}
        <div className="bg-[#FFFFFF] border border-[#E5E0D5] p-6 sm:p-8 rounded-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1F2421]">
                Image Management
              </h3>
              <p className="text-xs text-[#64748B]">
                Upload photos, set the featured cover photo, or reorder gallery images.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#1B4332]">
              {images.length} {images.length === 1 ? 'image' : 'images'}
            </span>
          </div>

          {/* Add Image Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#FAF8F5] border border-[#E7E2D8] rounded-sm">
            {/* File Uploader */}
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                Upload from Device
              </label>
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-[#CBD5E1] hover:border-[#1B4332] p-3 rounded-sm bg-[#FFFFFF] cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-[#1B4332]" />
                <span className="text-xs font-medium text-[#475569]">Select Image Files</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Direct URL Input */}
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                Or Add Image by URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3 py-2 bg-[#FFFFFF] border border-[#CBD5E1] rounded-sm text-xs text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3.5 py-2 bg-[#FAF8F5] border border-[#CBD5E1] hover:bg-[#EFECE6] text-xs font-semibold text-[#1F2421] rounded-sm cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Image List */}
          {images.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-[#CBD5E1] rounded-sm">
              <ImageIcon className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
              <p className="text-xs text-[#64748B]">No images uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <div
                  key={img.id || idx}
                  className={`relative bg-[#FFFFFF] border rounded-sm p-2 flex flex-col justify-between ${
                    img.is_featured ? 'border-[#1B4332] ring-1 ring-[#1B4332]' : 'border-[#E5E0D5]'
                  }`}
                >
                  <div className="relative h-40 w-full bg-[#EFECE6] rounded-xs overflow-hidden mb-2">
                    <img
                      src={img.image_url}
                      alt={`Gallery item ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {img.is_featured && (
                      <span className="absolute top-2 left-2 bg-[#1B4332] text-white text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#F0ECE1]">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveImage(idx, 'up')}
                        disabled={idx === 0}
                        title="Move left"
                        className="p-1 rounded-xs hover:bg-[#EFECE6] disabled:opacity-30 text-[#475569] cursor-pointer"
                      >
                        <ChevronUp className="w-4 h-4 rotate-[-90deg]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveImage(idx, 'down')}
                        disabled={idx === images.length - 1}
                        title="Move right"
                        className="p-1 rounded-xs hover:bg-[#EFECE6] disabled:opacity-30 text-[#475569] cursor-pointer"
                      >
                        <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {!img.is_featured && (
                        <button
                          type="button"
                          onClick={() => handleSetFeatured(idx)}
                          className="text-[11px] text-[#2D6A4F] hover:underline font-medium cursor-pointer"
                        >
                          Make Cover
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(idx)}
                        className="p-1 text-[#DC2626] hover:bg-[#FEE2E2] rounded-xs cursor-pointer"
                        title="Delete image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D5]">
          <button
            type="button"
            onClick={() => navigateTo('/admin/properties')}
            className="px-6 py-2.5 border border-[#CBD5E1] rounded-sm text-sm font-semibold text-[#475569] hover:bg-[#FAF8F5] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-[#1B4332] hover:bg-[#143628] disabled:opacity-50 text-white px-7 py-2.5 rounded-sm text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Property'}</span>
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};
