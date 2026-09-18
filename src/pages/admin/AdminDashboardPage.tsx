import React from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import {
  Building2,
  CheckCircle2,
  Inbox,
  PlusCircle,
  Settings,
  ArrowRight,
  ExternalLink,
  Clock,
  Phone,
  MessageCircle,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { properties, publishedProperties, enquiries, settings, navigateTo } = useBusiness();

  // Basic dashboard statistics (Requirement #20)
  const totalProperties = properties.length;
  const totalPublished = publishedProperties.length;
  const totalEnquiries = enquiries.length;
  const recentEnquiries = enquiries.slice(0, 5);

  return (
    <AdminLayout
      title="Dashboard"
      subtitle={`Live control center for ${settings.business_name}`}
      actionButton={
        <button
          onClick={() => navigateTo('/admin/properties/new')}
          className="inline-flex items-center gap-2 bg-[#1B4332] hover:bg-[#143628] text-white px-4 py-2.5 rounded-sm text-sm font-semibold transition-all shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Property</span>
        </button>
      }
    >
      <div className="space-y-8">
        {/* Top 3 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Total Properties */}
          <div className="bg-[#FFFFFF] border border-[#E5E0D5] p-6 rounded-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#718096]">
                Total Properties
              </span>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-[#1F2421] mt-1">
                {totalProperties}
              </div>
              <span className="text-xs text-[#64748B] mt-1 block">
                Residential &amp; Commercial
              </span>
            </div>
            <div className="w-12 h-12 rounded-sm bg-[#FAF8F5] border border-[#E5E0D5] flex items-center justify-center text-[#1B4332]">
              <Building2 className="w-6 h-6" />
            </div>
          </div>

          {/* Published Properties */}
          <div className="bg-[#FFFFFF] border border-[#E5E0D5] p-6 rounded-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#718096]">
                Published Online
              </span>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-[#2D6A4F] mt-1">
                {totalPublished}
              </div>
              <span className="text-xs text-[#64748B] mt-1 block">
                Visible to public visitors
              </span>
            </div>
            <div className="w-12 h-12 rounded-sm bg-[#F0FDF4] border border-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          {/* Total Enquiries */}
          <div className="bg-[#FFFFFF] border border-[#E5E0D5] p-6 rounded-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#718096]">
                Client Enquiries
              </span>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-[#1F2421] mt-1">
                {totalEnquiries}
              </div>
              <span className="text-xs text-[#64748B] mt-1 block">
                {enquiries.filter(e => e.status === 'New').length} new unhandled
              </span>
            </div>
            <div className="w-12 h-12 rounded-sm bg-[#FAF8F5] border border-[#E5E0D5] flex items-center justify-center text-[#2563EB]">
              <Inbox className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="bg-[#FFFFFF] border border-[#E5E0D5] p-6 rounded-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#1F2421]">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigateTo('/admin/properties/new')}
              className="flex items-center gap-3 p-4 bg-[#FAF8F5] hover:bg-[#F2EFE9] border border-[#E5E0D5] rounded-sm text-left transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-sm bg-[#1B4332] text-white flex items-center justify-center shrink-0">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-sm font-semibold text-[#1F2421] block group-hover:text-[#1B4332]">
                  Add Property
                </span>
                <span className="text-xs text-[#718096]">Create new listing</span>
              </div>
            </button>

            <button
              onClick={() => navigateTo('/admin/properties')}
              className="flex items-center gap-3 p-4 bg-[#FAF8F5] hover:bg-[#F2EFE9] border border-[#E5E0D5] rounded-sm text-left transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-sm bg-[#2D6A4F] text-white flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-sm font-semibold text-[#1F2421] block group-hover:text-[#1B4332]">
                  Manage Properties
                </span>
                <span className="text-xs text-[#718096]">Edit, publish &amp; status</span>
              </div>
            </button>

            <button
              onClick={() => navigateTo('/admin/enquiries')}
              className="flex items-center gap-3 p-4 bg-[#FAF8F5] hover:bg-[#F2EFE9] border border-[#E5E0D5] rounded-sm text-left transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-sm bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                <Inbox className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-sm font-semibold text-[#1F2421] block group-hover:text-[#1B4332]">
                  View Enquiries
                </span>
                <span className="text-xs text-[#718096]">Call &amp; WhatsApp leads</span>
              </div>
            </button>

            <button
              onClick={() => navigateTo('/admin/settings')}
              className="flex items-center gap-3 p-4 bg-[#FAF8F5] hover:bg-[#F2EFE9] border border-[#E5E0D5] rounded-sm text-left transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-sm bg-[#475569] text-white flex items-center justify-center shrink-0">
                <Settings className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-sm font-semibold text-[#1F2421] block group-hover:text-[#1B4332]">
                  Business Settings
                </span>
                <span className="text-xs text-[#718096]">Change company name</span>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Enquiries Table / Card list */}
        <div className="bg-[#FFFFFF] border border-[#E5E0D5] rounded-sm overflow-hidden">
          <div className="p-6 border-b border-[#E5E0D5] flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1F2421]">
                Recent Enquiries
              </h3>
              <p className="text-xs text-[#64748B]">Latest inquiries received from website visitors</p>
            </div>
            <button
              onClick={() => navigateTo('/admin/enquiries')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B4332] hover:underline cursor-pointer"
            >
              <span>View All ({enquiries.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentEnquiries.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#718096]">
              No customer enquiries recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-[#F0ECE1]">
              {recentEnquiries.map((enq) => {
                const statusBadge = {
                  New: 'bg-[#DCFCE7] text-[#166534]',
                  Contacted: 'bg-[#DBEAFE] text-[#1E40AF]',
                  Closed: 'bg-[#F1F5F9] text-[#475569]',
                }[enq.status];

                const formattedDate = new Date(enq.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={enq.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#1F2421]">
                          {enq.name}
                        </span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-xs ${statusBadge}`}>
                          {enq.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#475569] line-clamp-1">
                        {enq.property_name ? `Re: ${enq.property_name} — ` : ''}
                        &ldquo;{enq.message}&rdquo;
                      </p>
                      <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {enq.phone}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formattedDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => navigateTo('/admin/enquiries')}
                        className="text-xs font-semibold text-[#1B4332] hover:bg-[#EAE5DC] px-3 py-1.5 rounded-sm border border-[#CBD5E1] transition-colors cursor-pointer"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
