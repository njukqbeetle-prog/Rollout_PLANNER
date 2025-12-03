import React, { forwardRef, useState, useMemo } from 'react';
import { WeekTable } from './WeekTable';
import { WeekData } from '../types';
import { Activity, Share2, Globe, Search, X, Shield } from 'lucide-react';

interface RolloutPlanProps {
  companyName: string;
  projectName: string;
  weeks: WeekData[];
  dateRanges: Record<number, string>;
  onDateRangeChange: (weekNumber: number, value: string) => void;
  logo: string;
  showCompanyName: boolean;
}

export const RolloutPlan = forwardRef<HTMLDivElement, RolloutPlanProps>(({ 
  companyName, 
  projectName, 
  weeks,
  dateRanges,
  onDateRangeChange,
  logo,
  showCompanyName
}, ref) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWeeks = useMemo(() => {
    if (!searchTerm.trim()) return weeks;
    const term = searchTerm.toLowerCase();
    return weeks.filter(week => {
      const dateRange = dateRanges[week.weekNumber] || '';
      return (
        week.title.toLowerCase().includes(term) ||
        week.rows.some(r => r.activity.toLowerCase().includes(term)) ||
        week.legends.some(l => l.label.toLowerCase().includes(term)) ||
        dateRange.toLowerCase().includes(term)
      );
    });
  }, [weeks, searchTerm, dateRanges]);

  return (
    <div ref={ref} className="bg-white p-8 md:p-12 max-w-5xl mx-auto shadow-2xl min-h-screen print:shadow-none print:p-0 font-sans">
      
      {/* Search Filter - Hidden in Print/PDF */}
      <div 
        className="mb-8 no-print flex justify-end print:hidden"
        data-html2canvas-ignore="true"
      >
        <div className="relative w-full max-w-md group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-cyan-600 transition-colors" />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition duration-150 ease-in-out shadow-sm text-slate-700"
                placeholder="Filter by activity, branch, or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
                <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
            )}
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="mb-6 flex flex-col items-center gap-2">
          {/* Dynamic Company Logo */}
          <img 
            src={logo} 
            alt={companyName} 
            className="h-24 w-auto object-contain"
            crossOrigin="anonymous"
          />
          
          {/* Optional Company Name Text */}
          {showCompanyName && (
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight uppercase mt-2">
                  {companyName}
              </h1>
          )}
        </div>

        {/* Document Title - Strictly matching PDF Format */}
        <div className="text-center space-y-2 uppercase text-slate-900">
            <h1 className="text-2xl md:text-3xl font-normal tracking-wide">
                {projectName}
            </h1>
            <h2 className="text-xl md:text-2xl font-normal tracking-widest">
                ROLLOUT PLAN
            </h2>
        </div>
      </div>

      {/* Schedule Content */}
      <div className="space-y-12 min-h-[200px]">
        {filteredWeeks.length > 0 ? (
            filteredWeeks.map((week) => (
              <WeekTable 
                key={week.weekNumber} 
                week={week} 
                dateRange={dateRanges[week.weekNumber] || ''}
                onDateRangeChange={(val) => onDateRangeChange(week.weekNumber, val)}
              />
            ))
        ) : (
            <div className="text-center py-16 text-slate-500 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                <Search className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p className="text-lg font-medium text-slate-600">No matching weeks found.</p>
                <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-4 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                    Clear Search
                </button>
            </div>
        )}
      </div>

      {/* Footer / Branding */}
      <div className="mt-12 pt-8 border-t border-slate-300 print-break-inside-avoid">
        
        {/* Disclaimers */}
        <div className="mb-8 text-center space-y-2">
            <p className="text-sm text-cyan-800 italic font-bold">
                NB: Above dates are tentative and are subject to change in unavoidable circumstances
            </p>
            <div className="block">
              <p className="text-sm text-slate-800 font-semibold underline decoration-slate-400 underline-offset-4">
                  We are looking forward to a very successful queue management systems implementation
              </p>
            </div>
        </div>

        {/* Footer Info */}
        <div className="flex flex-col items-center text-xs text-slate-500 gap-1 mb-6 border-t border-slate-200 pt-4 w-3/4 mx-auto">
            <p>6th Floor, Allianz Plaza, 96 Riverside Drive, Nairobi, Kenya | www.riana.co</p>
        </div>

        {/* Partner Logos/Footer Brands */}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-90 scale-90">
             <div className="flex items-center gap-1 font-bold text-red-500 text-sm">
                <Activity className="w-4 h-4" />
                <span>AfyaServe</span>
             </div>
             <div className="flex items-center gap-1 font-bold text-blue-500 text-sm">
                <div className="w-5 h-5 bg-blue-500 text-white flex items-center justify-center rounded-sm text-xs">Q</div>
                <span>Q-SYS</span>
             </div>
             <div className="flex items-center gap-1 font-bold text-green-600 text-sm">
                <Shield className="w-4 h-4" />
                <span>SecuViz</span>
             </div>
             <div className="flex items-center gap-1 font-bold text-cyan-700 text-sm">
                <Globe className="w-4 h-4" />
                <span>TIDANCE</span>
             </div>
             <div className="flex items-center gap-1 font-bold text-indigo-700 text-sm">
                <Share2 className="w-4 h-4" />
                <span>USS</span>
             </div>
        </div>
      </div>
    </div>
  );
});

RolloutPlan.displayName = 'RolloutPlan';