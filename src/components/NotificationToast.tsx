import React from 'react';
import { useBusiness } from '../context/BusinessContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notification, clearNotification } = useBusiness();

  if (!notification) return null;

  const bgStyles = {
    success: 'bg-[#1B4332] text-[#FAF8F5] border-[#2D6A4F]',
    error: 'bg-[#991B1B] text-[#FEF2F2] border-[#DC2626]',
    info: 'bg-[#1E293B] text-[#F8FAFC] border-[#334155]',
  }[notification.type];

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  }[notification.type];

  return (
    <div className="fixed top-24 right-4 sm:right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-200">
      <div className={`flex items-start gap-3 p-4 rounded-sm border shadow-xl ${bgStyles}`}>
        <Icon className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="flex-1 text-sm font-medium leading-snug">
          {notification.message}
        </div>
        <button
          onClick={clearNotification}
          className="p-1 hover:opacity-80 transition-opacity cursor-pointer"
          aria-label="Dismiss message"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
