import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand and Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-tr from-cyan-600 to-emerald-400 p-[1px]">
              <div className="w-full h-full bg-slate-950 rounded flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>
            </div>
            <span className="font-bold tracking-tight text-white">AquaPulse AI</span>
          </div>
          <span className="hidden sm:inline text-slate-600">·</span>
          <span>© 2026 AquaPulse Systems, Inc. Precision Aquaculture & Biosecurity.</span>
        </div>

        {/* Links adhering to single-line text and zero-pill rules */}
        <div className="flex items-center gap-6">
          <a href="#top" className="hover:text-white transition-colors">
            Back to Top ↑
          </a>
          <span className="text-slate-700">·</span>
          <span className="hover:text-white cursor-pointer transition-colors">
            Telemetry Protocol Documentation
          </span>
          <span className="text-slate-700">·</span>
          <span className="hover:text-white cursor-pointer transition-colors">
            NIST Sensor Calibrations
          </span>
          <span className="text-slate-700">·</span>
          <span className="text-emerald-400">ISO-14001 Audited</span>
        </div>

      </div>
    </footer>
  );
};
