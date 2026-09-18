import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import {
  deleteProperty,
  duplicateProperty,
  togglePropertyPublish,
  setPropertyAvailability,
} from '../../services/dataService';
import { AvailabilityStatus, Property } from '../../types';
import {
  PlusCircle,
  Edit2,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  MapPin,
  Check,
} from 'lucide-react';

export const AdminPropertiesPage: React.FC = () => {
  const { properties, refreshData, navigateTo, showNotification } = useBusiness();
  const [filterPurpose, setFilterPurpose] = useState<string>('All');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const filtered = properties.filter((p) => {
    if (filterPurpose === 'All') return true;
    if (filterPurpose === 'Published') return p.published;
    if (filterPurpose === 'Draft') return !p.published;
    return p.purpose === filterPurpose;
  });

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      setActionLoadingId(id);
      try {
        await deleteProperty(id);
        showNotification('success', `Property "${name}" deleted.`);
        await refreshData();
      } catch (err) {
        showNotification('error', 'Failed to delete property.');
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  const handleDuplicate = async (id: string) => {
    setActionLoadingId(id);
    try {
      const copy = await duplicateProperty(id);
      if (copy) {
        showNotification('success', `Duplicated as "${copy.name}". Created as draft.`);
        await refreshData();
      }
    } catch (err) {
      showNotification('error', 'Failed to duplicate property.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean, name: string) => {
    setActionLoadingId(id);
    try {
      await togglePropertyPublish(id);
      showNotification(
        'success',
        `"${name}" is now ${!currentStatus ? 'Published Online' : 'Unpublished (Draft)'}.`
      );
      await refreshData();
    } catch (err) {
      showNotification('error', 'Failed to change publish status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAvailabilityChange = async (id: string, status: AvailabilityStatus) => {
    setActionLoadingId(id);
    try {
      await setPropertyAvailability(id, status);
      showNotification('success', `Status updated to ${status}.`);
      await refreshData();
    } catch (err) {
      showNotification('error', 'Failed to update availability.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <AdminLayout
      title="Property Inventory"
      subtitle={`Manage all ${properties.length} residential and commercial property listings`}
      actionButton={
        <button
          id="admin-add-property-btn"
          onClick={() => navigateTo('/admin/properties/new')}
          className="inline-flex items-center gap-2 bg-[#1B4332] hover:bg-[#143628] text-white px-4 py-2.5 rounded-sm text-sm font-semibold transition-all shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Property</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Simple Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FFFFFF] border border-[#E5E0D5] p-4 rounded-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider mr-2">
              Filter:
            </span>
            {['All', 'Buy', 'Rent', 'Published', 'Draft'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterPurpose(f)}
                className={`px-3 py-1.5 rounded-sm text-xs font-medium cursor-pointer transition-colors ${
                  filterPurpose === f
                    ? 'bg-[#1B4332] text-white'
                    : 'bg-[#FAF8F5] text-[#475569] hover:bg-[#EFECE6]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#718096]">
            Showing <strong>{filtered.length}</strong> of {properties.length} properties
          </div>
        </div>

        {/* Properties List / Cards */}
        {filtered.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#E5E0D5] p-12 text-center rounded-sm">
            <p className="text-sm text-[#718096]">No properties match your filter selection.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((property) => {
              const mainImage =
                property.images.find((i) => i.is_featured)?.image_url ||
                property.images[0]?.image_url ||
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80';

              const isLoadingThis = actionLoadingId === property.id;

              return (
                <div
                  key={property.id}
                  id={`admin-property-item-${property.id}`}
                  className="bg-[#FFFFFF] border border-[#E5E0D5] rounded-sm p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-all hover:border-[#CBD5E1]"
                >
                  {/* Left info & thumb */}
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    <img
                      src={mainImage}
                      alt={property.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-sm object-cover shrink-0 bg-[#EFECE6] border border-[#E5E0D5]"
                    />
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs ${
                            property.published
                              ? 'bg-[#DCFCE7] text-[#166534]'
                              : 'bg-[#F1F5F9] text-[#475569]'
                          }`}
                        >
                          {property.published ? 'Published' : 'Draft'}
                        </span>
                        <span className="text-[10px] uppercase font-semibold bg-[#EFECE6] text-[#4A5568] px-2 py-0.5 rounded-xs">
                          {property.purpose === 'Buy' ? 'For Sale' : 'For Rent'}
                        </span>
                        <span className="text-[10px] uppercase font-semibold bg-[#EFECE6] text-[#4A5568] px-2 py-0.5 rounded-xs">
                          {property.property_type}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base sm:text-lg text-[#1F2421] truncate">
                        {property.name}
                      </h3>

                      <div className="flex items-center gap-1 text-xs text-[#64748B]">
                        <MapPin className="w-3.5 h-3.5 text-[#1B4332] shrink-0" />
                        <span className="truncate">{property.location}</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs pt-1">
                        <span className="font-serif font-bold text-sm text-[#1B4332]">
                          {property.price_display}
                        </span>
                        <span>&bull;</span>
                        <span className="text-[#64748B]">
                          {property.bhk ? `${property.bhk} • ` : ''}
                          {property.area_sqft} sq.ft.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions Toolbar */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#F0ECE1] shrink-0">
                    {/* Availability Status Dropdown */}
                    <div className="flex flex-col">
                      <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">
                        Availability
                      </label>
                      <select
                        value={property.availability_status}
                        onChange={(e) =>
                          handleAvailabilityChange(property.id, e.target.value as AvailabilityStatus)
                        }
                        disabled={isLoadingThis}
                        className="text-xs bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm px-2.5 py-1.5 text-[#1F2421] font-medium focus:outline-none focus:border-[#1B4332] cursor-pointer"
                      >
                        <option value="Available">Available</option>
                        <option value="Sold">Sold</option>
                        <option value="Rented">Rented</option>
                        <option value="Under Offer">Under Offer</option>
                      </select>
                    </div>

                    {/* Publish / Unpublish Toggle */}
                    <button
                      onClick={() =>
                        handleTogglePublish(property.id, property.published, property.name)
                      }
                      disabled={isLoadingThis}
                      title={property.published ? 'Unpublish to draft' : 'Publish online'}
                      className={`px-3 py-1.5 rounded-sm text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer mt-3.5 ${
                        property.published
                          ? 'border-[#86EFAC] bg-[#F0FDF4] text-[#166534] hover:bg-[#DCFCE7]'
                          : 'border-[#CBD5E1] bg-[#FAF8F5] text-[#475569] hover:bg-[#EFECE6]'
                      }`}
                    >
                      {property.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{property.published ? 'Live' : 'Draft'}</span>
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => navigateTo(`/admin/properties/${property.id}/edit`)}
                      title="Edit property details"
                      className="px-3 py-1.5 rounded-sm text-xs font-medium bg-[#FAF8F5] hover:bg-[#EFECE6] border border-[#CBD5E1] text-[#1F2421] flex items-center gap-1.5 transition-colors cursor-pointer mt-3.5"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#1B4332]" />
                      <span>Edit</span>
                    </button>

                    {/* Duplicate Button */}
                    <button
                      onClick={() => handleDuplicate(property.id)}
                      disabled={isLoadingThis}
                      title="Duplicate property"
                      className="p-1.5 rounded-sm bg-[#FAF8F5] hover:bg-[#EFECE6] border border-[#CBD5E1] text-[#475569] transition-colors cursor-pointer mt-3.5"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* View Live (if published) */}
                    <button
                      onClick={() => navigateTo(`/properties/${property.slug}`)}
                      title="View public page"
                      className="p-1.5 rounded-sm bg-[#FAF8F5] hover:bg-[#EFECE6] border border-[#CBD5E1] text-[#2D6A4F] transition-colors cursor-pointer mt-3.5"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(property.id, property.name)}
                      disabled={isLoadingThis}
                      title="Delete property"
                      className="p-1.5 rounded-sm bg-[#FAF8F5] hover:bg-[#FEE2E2] border border-[#CBD5E1] text-[#DC2626] transition-colors cursor-pointer mt-3.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
