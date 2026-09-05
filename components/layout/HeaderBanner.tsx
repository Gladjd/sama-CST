import React from 'react';

interface HeaderBannerProps {
  badgeText: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  badgeText,
  title,
  description,
  actions,
}) => {
  return (
    <div className="card-ts bg-gradient-to-r from-ts-navy via-slate-900 to-ts-blue text-white p-6 mb-6 shadow-ts-md">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-ts-green/20 border border-ts-green/40 rounded-full text-[11px] font-bold text-lime-300 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ts-green animate-pulse"></span>
            {badgeText}
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">{title}</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">{description}</p>
        </div>
        {actions && <div className="shrink-0 flex items-center gap-2.5">{actions}</div>}
      </div>
    </div>
  );
};
