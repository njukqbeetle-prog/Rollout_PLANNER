import React, { useState } from 'react';
import { WeekData } from '../types';

interface WeekTableProps {
  week: WeekData;
  dateRange: string;
  onDateRangeChange: (val: string) => void;
}

export const WeekTable: React.FC<WeekTableProps> = ({ week, dateRange, onDateRangeChange }) => {
  const [hiddenColors, setHiddenColors] = useState<string[]>([]);

  const toggleColor = (color: string) => {
    setHiddenColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color) 
        : [...prev, color]
    );
  };

  return (
    <div className="mb-8 break-inside-avoid print-break-inside-avoid">
      {/* Title */}
      <div className="text-center mb-2">
        <h3 className="font-bold text-lg underline decoration-1 underline-offset-4 text-slate-900 uppercase">
            {week.title}
        </h3>
        <input
            type="text"
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            placeholder="[Enter Date Range]"
            className="mt-1 text-center w-full max-w-md mx-auto block bg-transparent border-none hover:bg-slate-50 focus:bg-slate-50 focus:outline-none text-slate-600 text-sm font-medium placeholder-slate-300 transition-colors print:placeholder-transparent"
        />
      </div>

      {/* Table */}
      <div className="border border-black mb-4">
        {/* Header */}
        <div className="grid grid-cols-7 border-b border-black bg-black text-white font-bold text-sm">
          <div className="p-2 border-r border-slate-600 flex items-center justify-start uppercase tracking-wider">ACTIVITY</div>
          {[1, 2, 3, 4, 5, 6].map(day => (
            <div key={day} className="p-2 border-l border-slate-600 text-center uppercase tracking-wider">
              Day {day}
            </div>
          ))}
        </div>

        {/* Rows */}
        {week.rows.map((row, rIdx) => (
          <div key={rIdx} className="grid grid-cols-7 border-b border-black last:border-b-0 min-h-[40px]">
            {/* Activity Column */}
            <div className="p-2 border-r border-black text-sm font-medium flex items-center bg-white text-black leading-tight">
              {row.activity}
            </div>
            {/* Days Columns */}
            {row.cells.map((cell, cIdx) => {
               const isHidden = cell && hiddenColors.includes(cell.backgroundColor);
               return (
                <div 
                    key={cIdx} 
                    className="border-l border-black relative transition-all duration-300"
                    style={{ 
                        backgroundColor: (cell && !isHidden) ? cell.backgroundColor : '#FFFFFF',
                    }}
                >
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* PDF Style Legend (Vertical List) */}
      <div className="flex flex-col gap-1 pl-1">
        {week.legends.map((legend, idx) => {
            const isHidden = hiddenColors.includes(legend.color);
            return (
                <div 
                    key={idx}
                    onClick={() => toggleColor(legend.color)}
                    className="flex items-center gap-3 cursor-pointer group select-none"
                    title="Click to toggle visibility"
                >
                    {/* Colored Box */}
                    <div 
                        className={`w-6 h-4 border border-black shadow-sm flex-shrink-0 transition-opacity ${isHidden ? 'opacity-20' : 'opacity-100'}`}
                        style={{ backgroundColor: legend.color }}
                    ></div>
                    {/* Label */}
                    <span className={`text-sm text-slate-800 transition-all ${isHidden ? 'opacity-40 line-through decoration-slate-400' : 'opacity-100'}`}>
                        {legend.label}
                    </span>
                </div>
            );
        })}
      </div>
    </div>
  );
};