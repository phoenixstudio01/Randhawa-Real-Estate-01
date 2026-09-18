import React, { useState, useEffect } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { updateBusinessSettings, resetDemoData } from '../../services/dataService';
import {
  Save,
  RotateCcw,
  Building2,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Sparkles,
  KeyRound,
  ShieldCheck,
  Lock,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { settings, adminAccount, changeAdminCredentials, refreshData, showNotification } = useBusiness();

  const [businessName, setBusinessName] = useState(settings.business_name);
  const [tagline, setTagline] = useState(settings.tagline);
  const [phone, setPhone] = useState(settings.phone);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp);
  const [email, setEmail] = useState(settings.email);
  const [location, setLocation] = useState(settings.location);
  const [isSaving, setIsSaving] = useState(false);

  // Security & Admin Credentials state
  const [currentPassword, setCurrentPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState(adminAccount?.email || 'admin@randhawarealestate.com');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isUpdatingCreds, setIsUpdatingCreds] = useState(false);

  useEffect(() => {
    if (adminAccount?.email) {
      setAdminEmail(adminAccount.email);
    }
  }, [adminAccount?.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      showNotification('error', 'Business Name is required.');
      return;
    }

    setIsSaving(true);
    try {
      await updateBusinessSettings({
        business_name: businessName.trim(),
        tagline: tagline.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim(),
        location: location.trim(),
      });

      await refreshData();
      showNotification(
        'success',
        `Settings updated! Business name is now "${businessName.trim()}" across the entire website.`
      );
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showNotification('error', 'Please enter your current password to authorize this update.');
      return;
    }
    if (!adminEmail.trim() || !adminEmail.includes('@') || !adminEmail.includes('.')) {
      showNotification('error', 'Please enter a valid admin email address.');
      return;
    }
    if (newPassword && newPassword.length < 6) {
      showNotification('error', 'New password must be at least 6 characters long.');
      return;
    }
    if (newPassword && newPassword !== confirmNewPassword) {
      showNotification('error', 'New password and confirmation do not match.');
      return;
    }

    setIsUpdatingCreds(true);
    try {
      const res = await changeAdminCredentials(
        currentPassword,
        adminEmail.trim(),
        newPassword.trim() || undefined
      );

      if (res.success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        showNotification(
          'success',
          'Admin security credentials updated successfully. Please use your new details for future sign-ins.'
        );
      } else {
        showNotification('error', res.error || 'Failed to update admin credentials.');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'An error occurred updating credentials.');
    } finally {
      setIsUpdatingCreds(false);
    }
  };

  const handleResetToDefault = () => {
    if (
      window.confirm(
        'Reset business name and all properties back to original "Randhawa Real Estate" defaults?'
      )
    ) {
      resetDemoData();
      refreshData();
      setBusinessName('Randhawa Real Estate');
      setTagline('Find a Place That Feels Like Home.');
      setPhone('+91 90000 00000');
      setWhatsapp('+91 90000 00000');
      setEmail('hello@randhawarealestate.demo');
      setLocation('Gurgaon, Haryana');
      showNotification('info', 'Demo properties and settings reset successfully.');
    }
  };

  return (
    <AdminLayout
      title="Business & Security Settings"
      subtitle="Single source of truth for your brand identity, public contact info, and admin security credentials"
      actionButton={
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#CBD5E1] rounded-sm text-xs font-medium text-[#475569] hover:bg-[#FAF8F5] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Reset Demo</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-[#1B4332] hover:bg-[#143628] disabled:opacity-50 text-white px-5 py-2 rounded-sm text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      }
    >
      <div className="space-y-8 max-w-4xl">
        {/* Dynamic Name Explanation Banner */}
        <div className="bg-[#FFFFFF] border border-[#2D6A4F]/30 p-5 rounded-sm flex items-start gap-3.5 shadow-xs">
          <Sparkles className="w-5 h-5 text-[#2D6A4F] shrink-0 mt-0.5" />
          <div className="text-xs text-[#475569] space-y-1">
            <span className="font-semibold text-[#1F2421] text-sm block">
              Global Single Source of Truth
            </span>
            <p>
              Changing the business name here (e.g. from <em>&ldquo;{settings.business_name}&rdquo;</em> to{' '}
              <em>&ldquo;ABC Properties&rdquo;</em>) immediately updates the navigation header, website footer,
              hero banner, page title, property inquiry WhatsApp templates, and copyright across the entire platform.
            </p>
          </div>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="bg-[#FFFFFF] border border-[#E5E0D5] p-6 sm:p-8 rounded-sm space-y-6">
          <h3 className="font-serif text-lg font-bold text-[#1F2421]">
            Company Identity &amp; Contact Information
          </h3>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Business Name (Global) *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Randhawa Real Estate"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm font-semibold text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Brand Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Find a Place That Feels Like Home."
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  Direct Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 90000 00000"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  WhatsApp Contact Number *
                </label>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+91 90000 00000"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  Support Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hello@randhawarealestate.demo"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  Primary Location / Region *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Gurgaon, Haryana"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F0ECE1] flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 bg-[#1B4332] hover:bg-[#143628] disabled:opacity-50 text-white px-6 py-2.5 rounded-sm text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>

        {/* Dedicated Admin Security & Credentials Management */}
        <form onSubmit={handleCredentialsSubmit} className="bg-[#FFFFFF] border border-[#E5E0D5] p-6 sm:p-8 rounded-sm space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#1B4332]" />
                <h3 className="font-serif text-lg font-bold text-[#1F2421]">
                  Admin Account &amp; Security Credentials
                </h3>
              </div>
              <p className="text-xs text-[#64748B] mt-1">
                Change your administrator login email and password. These credentials are used to access this management portal.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-[#1B4332] bg-[#FAF8F5] px-2.5 py-1 border border-[#E5E0D5] rounded-xs">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Encrypted Storage</span>
            </div>
          </div>

          <div className="space-y-5 pt-1">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Current Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@randhawarealestate.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm font-medium text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
                />
              </div>
              <span className="text-[11px] text-[#64748B] mt-1 block">
                Update this to your preferred administrative email address.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  New Password (Optional)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Leave blank to keep current"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
                    autoComplete="new-password"
                  />
                </div>
                <span className="text-[11px] text-[#64748B] mt-1 block">
                  Minimum 6 characters.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-[#E5E0D5] rounded-sm space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F2421]">
                Authorization: Enter Current Password *
              </label>
              <div className="relative max-w-md">
                <KeyRound className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password to authorize changes"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#FFFFFF] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
                  autoComplete="current-password"
                />
              </div>
              <p className="text-[11px] text-[#64748B]">
                Your current password is required before updating security details.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F0ECE1] flex justify-end">
            <button
              type="submit"
              disabled={isUpdatingCreds}
              className="inline-flex items-center gap-2 bg-[#1B4332] hover:bg-[#143628] disabled:opacity-50 text-white px-6 py-2.5 rounded-sm text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isUpdatingCreds ? 'Updating Credentials...' : 'Update Admin Credentials'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
