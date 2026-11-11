import React, { useState } from 'react';
import { AlertNotification } from '../types/telemetry';
import { sound } from '../utils/audio';

interface AlertCenterProps {
  alerts: AlertNotification[];
  onDismissAlert: (id: string) => void;
  onClearAll: () => void;
  onTakeAction: (id: string, actionName: string) => void;
}

export const AlertCenter: React.FC<AlertCenterProps> = ({
  alerts,
  onDismissAlert,
  onClearAll,
  onTakeAction,
}) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'nominal'>('all');

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'all') return true;
    return a.severity === filter;
  });

  const unreadCount = alerts.filter(a => !a.isRead).length;

  return (
    <div className="glass-panel rounded-2xl p-6 space-y-4">
      
      {/* Header and Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Pond Telemetry Alert Center
              </h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold">
                  {unreadCount} Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Autonomous safety alarms, threshold infractions, and automated motor triggers.
            </p>
          </div>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-white/10 self-start sm:self-auto">
          {(['all', 'critical', 'warning', 'nominal'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => {
                sound.playClick();
                setFilter(sev);
              }}
              className={`px-3 py-1 text-xs font-medium rounded-lg capitalize whitespace-nowrap shrink-0 transition-all ${
                filter === sev
                  ? 'bg-white text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
          {alerts.length > 0 && (
            <button
              onClick={() => {
                sound.playClick();
                onClearAll();
              }}
              className="text-[11px] text-slate-400 hover:text-rose-400 px-2 py-1 ml-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-2.5">
        {filteredAlerts.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No {filter !== 'all' ? filter : ''} telemetry alerts currently logged.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 border ${
                alert.severity === 'critical'
                  ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                  : alert.severity === 'warning'
                  ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                  : 'bg-slate-900/50 border-white/5 text-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {alert.severity === 'critical' ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block animate-ping" />
                  ) : alert.severity === 'warning' ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 block" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">
                      {alert.title}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-300">
                      [{alert.pondName}]
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {alert.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {alert.description}
                  </p>
                  {alert.actionTaken && (
                    <span className="text-[11px] font-mono text-emerald-400 block">
                      ✓ Countermeasure applied: {alert.actionTaken}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {!alert.actionTaken && (
                  <button
                    onClick={() => {
                      sound.playChime('success');
                      onTakeAction(alert.id, 'Automated Aerator Boost Dispatched');
                    }}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors whitespace-nowrap"
                  >
                    Execute Mitigation
                  </button>
                )}

                <button
                  onClick={() => {
                    sound.playClick();
                    onDismissAlert(alert.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                  title="Archive Notification"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
