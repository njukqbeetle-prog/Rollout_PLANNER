import React, { useState, useRef, useMemo } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Loader2, Printer, AlertTriangle, X, Check } from 'lucide-react';
import { RolloutPlan } from './components/RolloutPlan';
import { InputForm } from './components/InputForm';
import { generateSchedule } from './utils/scheduleGenerator';
import { DEFAULT_CONFIG, DEFAULT_LOGO } from './constants';

export default function App() {
  const [numBranches, setNumBranches] = useState<number>(DEFAULT_CONFIG.numBranches);
  const [companyName, setCompanyName] = useState<string>(DEFAULT_CONFIG.companyName);
  const [projectName, setProjectName] = useState<string>(DEFAULT_CONFIG.projectName);
  const [dateRanges, setDateRanges] = useState<Record<number, string>>({});
  const [logo, setLogo] = useState<string>(DEFAULT_LOGO);
  const [showCompanyName, setShowCompanyName] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Confirmation State
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState<'print' | 'download' | null>(null);

  const printRef = useRef<HTMLDivElement>(null);

  const weeks = useMemo(() => generateSchedule(numBranches), [numBranches]);

  const handleDateRangeChange = (weekNumber: number, value: string) => {
    setDateRanges(prev => ({
      ...prev,
      [weekNumber]: value
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setLogo(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogo = () => {
    setLogo(DEFAULT_LOGO);
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    
    setIsGenerating(true);
    try {
      // Wait for any re-renders
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(printRef.current, {
        scale: 2, // 2x scale for sharper text
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        // Ensure we capture the whole scroll height
        windowWidth: printRef.current.scrollWidth,
        windowHeight: printRef.current.scrollHeight
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add subsequent pages if content overflows
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight; // Negative offset to show next part of image
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      pdf.save(`${companyName.replace(/[^a-z0-9]/gi, '_')}_Rollout_Plan.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please use the Print option as an alternative.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Confirmation Logic
  const initiateAction = (action: 'print' | 'download') => {
    setPendingAction(action);
    setShowConfirm(true);
  };

  const confirmAction = () => {
    setShowConfirm(false);
    if (pendingAction === 'print') {
      handlePrint();
    } else if (pendingAction === 'download') {
      handleDownloadPDF();
    }
    setPendingAction(null);
  };

  const cancelAction = () => {
    setShowConfirm(false);
    setPendingAction(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans relative">
        {/* Controls - Hidden in print */}
        <div className="max-w-5xl mx-auto mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">QMS Rollout Generator</h1>
                <p className="text-slate-500 text-sm">Configure your rollout plan below</p>
            </div>
            <div className="flex flex-wrap gap-3">
                 <button
                    onClick={() => initiateAction('print')}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors font-medium border border-slate-300 shadow-sm"
                 >
                    <Printer className="w-4 h-4" />
                    Print / Save PDF
                 </button>
                 <button
                    onClick={() => initiateAction('download')}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                 >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Download className="w-4 h-4" />
                            Download PDF
                        </>
                    )}
                 </button>
            </div>
        </div>

        {/* Input Form - Hidden in print */}
        <div className="max-w-5xl mx-auto no-print">
            <InputForm 
                numBranches={numBranches} 
                setNumBranches={setNumBranches}
                companyName={companyName}
                setCompanyName={setCompanyName}
                projectName={projectName}
                setProjectName={setProjectName}
                onLogoUpload={handleLogoUpload}
                onResetLogo={handleResetLogo}
                showCompanyName={showCompanyName}
                setShowCompanyName={setShowCompanyName}
            />
        </div>

        {/* Preview Area */}
        <div className="overflow-auto pb-10">
            <RolloutPlan 
                ref={printRef}
                companyName={companyName} 
                projectName={projectName}
                weeks={weeks} 
                dateRanges={dateRanges}
                onDateRangeChange={handleDateRangeChange}
                logo={logo}
                showCompanyName={showCompanyName}
            />
        </div>
        
        <div className="text-center text-slate-400 text-xs py-4 no-print">
            &copy; {new Date().getFullYear()} Rollout Planner System
        </div>

        {/* Confirmation Modal */}
        {showConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm no-print">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Confirm Action</h3>
                                <p className="text-slate-500 text-sm">Are you ready to {pendingAction === 'print' ? 'print' : 'download'} the rollout plan?</p>
                            </div>
                        </div>
                        <p className="text-slate-600 text-sm mb-6 bg-slate-50 p-3 rounded border border-slate-100">
                            Please ensure all configuration details, date ranges, and branch numbers are correct before proceeding.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button 
                                onClick={cancelAction}
                                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                            <button 
                                onClick={confirmAction}
                                className="px-4 py-2 bg-cyan-600 text-white font-medium hover:bg-cyan-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
                            >
                                <Check className="w-4 h-4" />
                                Yes, {pendingAction === 'print' ? 'Print' : 'Download'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}