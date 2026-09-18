import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { ShieldCheck, Lock, Mail, ArrowRight, KeyRound, ArrowLeft } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { settings, login, forgotPassword, navigateTo, showNotification } = useBusiness();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showNotification('error', 'Please enter your admin email and password.');
      return;
    }
    setIsLoading(true);

    try {
      const res = await login(email, password, rememberMe);
      if (res.success) {
        navigateTo('/admin');
      } else {
        showNotification('error', res.error || 'Invalid credentials.');
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Login error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      showNotification('error', 'Please enter your account email.');
      return;
    }

    const res = await forgotPassword(forgotEmail.trim());
    setForgotStatus(res.message);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Return to website link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <button
          onClick={() => navigateTo('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B4332] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to public website</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-sm bg-[#1B4332] text-white shadow-sm mb-2 font-serif font-bold text-xl">
            {settings.business_name ? settings.business_name.charAt(0).toUpperCase() : 'R'}
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#1F2421] tracking-tight">
            Admin Sign In
          </h2>
          <p className="text-sm text-[#64748B]">
            Secure portal access for{' '}
            <span className="font-semibold text-[#1F2421]">{settings.business_name}</span>
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#FFFFFF] border border-[#E7E2D8] py-8 px-6 sm:px-10 rounded-sm shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
                  placeholder="admin@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotStatus(null);
                    setShowForgotModal(true);
                  }}
                  className="text-xs text-[#2D6A4F] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#1B4332] rounded-xs border-[#CBD5E1] focus:ring-[#1B4332]"
                />
                <span className="text-xs text-[#475569]">Remember session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#1B4332] hover:bg-[#143628] disabled:opacity-50 text-white py-3 rounded-sm text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-[0.98]"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In to Admin'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#F0ECE1] flex items-center justify-center gap-2 text-xs text-[#64748B]">
            <ShieldCheck className="w-4 h-4 text-[#1B4332]" />
            <span>Authorized Management Access Only</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] max-w-md w-full p-6 sm:p-8 rounded-sm shadow-xl border border-[#E7E2D8] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-[#FAF8F5] border border-[#E7E2D8] flex items-center justify-center text-[#1B4332]">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1F2421]">Reset Admin Password</h3>
                <p className="text-xs text-[#64748B]">Instructions will be dispatched to your registered address.</p>
              </div>
            </div>

            {forgotStatus ? (
              <div className="p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-sm text-xs text-[#166534] space-y-3">
                <p>{forgotStatus}</p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full bg-[#16A34A] text-white py-2 rounded-sm font-medium hover:bg-[#15803D] cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1">
                    Your Registered Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#CBD5E1] rounded-sm text-sm text-[#1F2421] focus:outline-none focus:border-[#1B4332]"
                    placeholder="Enter registered email"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 border border-[#CBD5E1] rounded-sm text-xs font-medium text-[#475569] hover:bg-[#FAF8F5] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1B4332] text-white rounded-sm text-xs font-semibold hover:bg-[#143628] cursor-pointer"
                  >
                    Send Reset Instructions
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
