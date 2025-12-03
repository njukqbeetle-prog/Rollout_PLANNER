
import React, { useRef } from 'react';
import { Settings, Users, Building, FileText, Image as ImageIcon, Upload, RotateCcw, Briefcase } from 'lucide-react';

interface InputFormProps {
  numBranches: number;
  setNumBranches: (n: number) => void;
  companyName: string;
  setCompanyName: (s: string) => void;
  clientName: string;
  setClientName: (s: string) => void;
  projectName: string;
  setProjectName: (s: string) => void;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetLogo: () => void;
  showCompanyName: boolean;
  setShowCompanyName: (b: boolean) => void;
}

export const InputForm: React.FC<InputFormProps> = ({
  numBranches,
  setNumBranches,
  companyName,
  setCompanyName,
  clientName,
  setClientName,
  projectName,
  setProjectName,
  onLogoUpload,
  onResetLogo,
  showCompanyName,
  setShowCompanyName,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 mb-8 no-print">
      <div className="flex items-center gap-2 mb-4 text-slate-800">
        <Settings className="w-5 h-5 text-cyan-600" />
        <h2 className="text-xl font-bold">Plan Configuration</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Name & Visibility */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Building className="w-4 h-4" />
            Vendor Name (Top Logo Text)
          </label>
          <div className="space-y-2">
            <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                placeholder="e.g. RIANA GROUP"
            />
            <div className="flex items-center gap-2">
                <input 
                    type="checkbox" 
                    id="showName" 
                    checked={showCompanyName}
                    onChange={(e) => setShowCompanyName(e.target.checked)}
                    className="w-4 h-4 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500 cursor-pointer"
                />
                <label htmlFor="showName" className="text-sm text-slate-600 cursor-pointer select-none">
                    Display name text in header?
                </label>
            </div>
          </div>
        </div>

        {/* Client Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Client Name
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
            placeholder="e.g. COOPERATIVE BANK"
          />
        </div>

        {/* Project Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Project Name (Header)
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
            placeholder="e.g. QMS INSTALLATION"
          />
        </div>

        {/* Number of Branches */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Number of Clients/Branches
          </label>
          <input
            type="number"
            min={1}
            max={50}
            value={numBranches}
            onChange={(e) => setNumBranches(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
          />
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Company Logo
          </label>
          <div className="flex gap-2">
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600 text-sm font-medium transition-colors"
            >
                <Upload className="w-4 h-4" />
                Upload Logo
            </button>
            <button 
                onClick={onResetLogo}
                className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-red-500 transition-colors"
                title="Reset to default logo"
            >
                <RotateCcw className="w-4 h-4" />
            </button>
            <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={onLogoUpload}
                className="hidden"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">Recommended: Transparent PNG or JPG</p>
        </div>
      </div>
    </div>
  );
};
