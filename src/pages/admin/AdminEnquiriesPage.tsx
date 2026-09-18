import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { updateEnquiryStatus, deleteEnquiry } from '../../services/dataService';
import { EnquiryStatus } from '../../types';
import {
  Phone,
  MessageCircle,
  Mail,
  Trash2,
  Calendar,
  User,
  Building,
  CheckCircle,
  Clock,
} from 'lucide-react';

export const AdminEnquiriesPage: React.FC = () => {
  const { enquiries, refreshData, showNotification } = useBusiness();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const filteredEnquiries = enquiries.filter((e) => {
    if (filterStatus === 'All') return true;
    return e.status === filterStatus;
  });

  const handleStatusChange = async (id: string, newStatus: EnquiryStatus) => {
    setActionLoadingId(id);
    try {
      await updateEnquiryStatus(id, newStatus);
      showNotification('success', `Status updated to ${newStatus}.`);
      await refreshData();
    } catch (err) {
      showNotification('error', 'Failed to update enquiry status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete enquiry from "${name}"?`)) {
      setActionLoadingId(id);
      try {
        await deleteEnquiry(id);
        showNotification('success', 'Enquiry deleted.');
        await refreshData();
      } catch (err) {
        showNotification('error', 'Failed to delete enquiry.');
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  const handleWhatsAppLead = (phone: string, name: string, propertyName?: string | null) => {
    const cleanNumber = phone.replace(/\D/g, '');
    const greeting = `Hello ${name}, thank you for reaching out to us regarding ${
      propertyName ? propertyName : 'property investments in Delhi-NCR'
    }. How can we assist you today?`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(greeting)}`, '_blank');
  };

  return (
    <AdminLayout
      title="Client Enquiries"
      subtitle="Track, follow up, and update lead communications"
    >
      <div className="space-y-6">
        {/* Filter and stats row */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FFFFFF] border border-[#E5E0D5] p-4 rounded-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#718096] mr-2">
              Status:
            </span>
            {['All', 'New', 'Contacted', 'Closed'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-sm text-xs font-medium cursor-pointer transition-colors ${
                  filterStatus === s
                    ? 'bg-[#1B4332] text-white'
                    : 'bg-[#FAF8F5] text-[#475569] hover:bg-[#EFECE6]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#718096]">
            Showing <strong>{filteredEnquiries.length}</strong> of {enquiries.length} total enquiries
          </div>
        </div>

        {/* Enquiries List */}
        {filteredEnquiries.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#E5E0D5] p-12 text-center rounded-sm">
            <p className="text-sm text-[#718096]">No enquiries found matching this status.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEnquiries.map((enq) => {
              const formattedDate = new Date(enq.created_at).toLocaleDateString('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const isActing = actionLoadingId === enq.id;

              return (
                <div
                  key={enq.id}
                  id={`admin-enquiry-${enq.id}`}
                  className="bg-[#FFFFFF] border border-[#E5E0D5] rounded-sm p-5 sm:p-6 transition-all hover:border-[#CBD5E1] space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-serif font-bold text-lg text-[#1F2421]">
                          {enq.name}
                        </h3>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-xs uppercase tracking-wider ${
                            enq.status === 'New'
                              ? 'bg-[#DCFCE7] text-[#166534]'
                              : enq.status === 'Contacted'
                              ? 'bg-[#DBEAFE] text-[#1E40AF]'
                              : 'bg-[#F1F5F9] text-[#475569]'
                          }`}
                        >
                          {enq.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>

                    {/* Status Changer & Delete */}
                    <div className="flex items-center gap-2.5">
                      <select
                        value={enq.status}
                        disabled={isActing}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                        className="text-xs bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm px-3 py-1.5 text-[#1F2421] font-medium focus:outline-none focus:border-[#1B4332] cursor-pointer"
                      >
                        <option value="New">Status: New</option>
                        <option value="Contacted">Status: Contacted</option>
                        <option value="Closed">Status: Closed</option>
                      </select>

                      <button
                        onClick={() => handleDelete(enq.id, enq.name)}
                        disabled={isActing}
                        title="Delete Enquiry"
                        className="p-1.5 rounded-sm bg-[#FAF8F5] hover:bg-[#FEE2E2] border border-[#CBD5E1] text-[#DC2626] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Interested Property */}
                  {enq.property_name && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF8F5] border border-[#E7E2D8] rounded-sm text-xs font-medium text-[#1B4332]">
                      <Building className="w-3.5 h-3.5" />
                      <span>Interested in: {enq.property_name}</span>
                    </div>
                  )}

                  {/* Client Message */}
                  <div className="bg-[#FAF8F5] border border-[#EFECE6] p-4 rounded-sm">
                    <p className="text-sm text-[#334155] whitespace-pre-wrap leading-relaxed">
                      {enq.message}
                    </p>
                  </div>

                  {/* Quick Action Links (Requirement #24: Call, WhatsApp, Email) */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    {/* Call CTA */}
                    <a
                      href={`tel:${enq.phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-1.5 bg-[#FAF8F5] hover:bg-[#EFECE6] border border-[#CBD5E1] text-[#1F2421] px-3.5 py-1.5 rounded-sm text-xs font-medium transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#1B4332]" />
                      <span>Call: {enq.phone}</span>
                    </a>

                    {/* WhatsApp CTA */}
                    <button
                      onClick={() => handleWhatsAppLead(enq.phone, enq.name, enq.property_name)}
                      className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-1.5 rounded-sm text-xs font-medium transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat on WhatsApp</span>
                    </button>

                    {/* Email CTA */}
                    {enq.email && enq.email !== 'Not specified' && (
                      <a
                        href={`mailto:${enq.email}?subject=${encodeURIComponent(
                          `Regarding your property enquiry on ${enq.property_name || 'properties'}`
                        )}`}
                        className="inline-flex items-center gap-1.5 bg-[#FAF8F5] hover:bg-[#EFECE6] border border-[#CBD5E1] text-[#475569] px-3.5 py-1.5 rounded-sm text-xs font-medium transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email: {enq.email}</span>
                      </a>
                    )}
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
