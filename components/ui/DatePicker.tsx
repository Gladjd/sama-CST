'use client';

import React from 'react';
import { Calendar, Clock, X } from 'lucide-react';

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  enableTime?: boolean;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  enableTime = false,
  placeholder,
  required = false,
  className = '',
}) => {
  const setNow = () => {
    const now = new Date();
    if (enableTime) {
      const formatted = now.toISOString().slice(0, 16).replace('T', ' ');
      onChange(formatted);
    } else {
      const formatted = now.toISOString().slice(0, 10);
      onChange(formatted);
    }
  };

  const clear = () => {
    onChange('');
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        <div className="absolute left-3 text-slate-400 pointer-events-none">
          {enableTime ? <Clock className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
        </div>
        <input
          type={enableTime ? 'datetime-local' : 'date'}
          value={enableTime && value ? value.replace(' ', 'T') : value}
          onChange={(e) => {
            const val = e.target.value;
            onChange(enableTime ? val.replace('T', ' ') : val);
          }}
          required={required}
          className="w-full pl-9 pr-20 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-ts-blue/30 focus:border-ts-blue transition-all"
          placeholder={placeholder}
        />
        <div className="absolute right-1.5 flex items-center gap-1">
          <button
            type="button"
            onClick={setNow}
            title={enableTime ? 'Maintenant' : "Aujourd'hui"}
            className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 hover:bg-ts-blue hover:text-white text-slate-600 rounded transition-colors"
          >
            {enableTime ? '🕒 Now' : '📅 Today'}
          </button>
          {value && (
            <button
              type="button"
              onClick={clear}
              title="Effacer"
              className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
