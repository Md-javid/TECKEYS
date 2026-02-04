
import React from 'react';
import {
  FileSpreadsheet,
  Filter,
  Download,
  MoreVertical,
  Calendar,
  Eye,
  Trash2,
  FileText,
  ExternalLink
} from 'lucide-react';
import { Bill } from '../types';

const BillHistory: React.FC<{ bills: Bill[] }> = ({ bills }) => {
  const exportToSheets = () => {
    if (bills.length === 0) return;

    // Create CSV content
    const headers = ["ID", "Vendor", "Date", "Items Count", "Total (INR)", "Confidence", "Status"];
    const rows = bills.map(b => [
      b.id,
      b.vendorName || "Unknown",
      b.date,
      b.items.length,
      b.grandTotal,
      b.overallConfidence + "%",
      b.status
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `BillAgent_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Bill History</h1>
          <p className="text-white/40">Neural records for store ledger (INR)</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportToSheets}
            className="tap-effect flex items-center gap-2.5 px-6 py-3 bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 rounded-2xl font-bold hover:bg-emerald-600/20"
          >
            <FileSpreadsheet size={18} /> Neural Export
          </button>
          <button className="tap-effect flex items-center gap-2 px-5 py-3 bg-white/5 text-white/60 rounded-2xl border border-white/10">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="glass-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-white/40 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-8 py-6">Identity</th>
                <th className="px-8 py-6">Vendor</th>
                <th className="px-8 py-6">Timestamp</th>
                <th className="px-8 py-6">Aggregate (INR)</th>
                <th className="px-8 py-6">Neural Match</th>
                <th className="px-8 py-6 text-center">Verdict</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bills.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-32 text-center text-white/20">
                    <div className="flex flex-col items-center">
                      <FileText size={56} className="mb-6 opacity-10" />
                      <p className="text-lg font-medium">Neural vault is currently empty</p>
                    </div>
                  </td>
                </tr>
              ) : (
                bills.map((bill) => (
                  <tr key={bill.id} className="group hover:bg-white/5 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-xl overflow-hidden border border-white/10 group-hover:scale-105 transition-transform">
                          <img src={bill.imageUrl} className="w-full h-full object-cover" alt="Bill" />
                        </div>
                        <span className="text-sm font-bold text-white tracking-tight">{bill.id}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-semibold text-white/80">{bill.vendorName || 'General Store'}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <Calendar size={14} /> {bill.date}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-white">₹{bill.grandTotal.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="w-24 space-y-2">
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${bill.overallConfidence}%` }} />
                        </div>
                        <p className="text-[10px] font-bold text-blue-400">{bill.overallConfidence}%</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase border ${bill.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20' : 'bg-amber-500/10 text-amber-400 border-amber-400/20'
                        }`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="tap-effect p-2.5 bg-white/5 text-white/40 hover:text-white rounded-xl">
                          <ExternalLink size={16} />
                        </button>
                        <button className="tap-effect p-2.5 bg-white/5 text-white/40 hover:text-rose-400 rounded-xl">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillHistory;
