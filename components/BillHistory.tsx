
import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  FileSpreadsheet,
  Filter,
  Download,
  MoreVertical,
  Calendar,
  Eye,
  Trash2,
  FileText,
  ExternalLink,
  Printer,
  FileDown,
  X
} from 'lucide-react';
import { Bill } from '../types';

const BillHistory: React.FC<{ bills: Bill[] }> = ({ bills }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [previewBill, setPreviewBill] = useState<Bill | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && !(event.target as Element).closest('.relative')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const printBill = (bill: Bill) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const billHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bill - ${bill.billNumber || bill.id}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            padding: 40px; 
            background: white;
            color: #000;
          }
          .bill-container { 
            max-width: 800px; 
            margin: 0 auto; 
            border: 2px solid #2563eb;
            border-radius: 12px;
            overflow: hidden;
          }
          .bill-header { 
            background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
            color: white; 
            padding: 30px; 
            text-align: center;
          }
          .bill-header h1 { 
            font-size: 32px; 
            font-weight: bold; 
            margin-bottom: 8px;
          }
          .bill-header p { 
            font-size: 14px; 
            opacity: 0.9;
          }
          .bill-info { 
            padding: 30px; 
            background: #f8fafc;
            border-bottom: 2px solid #e2e8f0;
          }
          .info-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 20px;
          }
          .info-item { 
            display: flex; 
            flex-direction: column;
          }
          .info-label { 
            font-size: 11px; 
            text-transform: uppercase; 
            color: #64748b; 
            font-weight: 600; 
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }
          .info-value { 
            font-size: 16px; 
            font-weight: 600; 
            color: #0f172a;
          }
          .items-section { 
            padding: 30px;
          }
          .items-title { 
            font-size: 18px; 
            font-weight: bold; 
            margin-bottom: 20px;
            color: #0f172a;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 10px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse;
          }
          thead { 
            background: #f1f5f9;
          }
          th { 
            padding: 12px; 
            text-align: left; 
            font-size: 11px; 
            text-transform: uppercase; 
            color: #64748b; 
            font-weight: 700;
            letter-spacing: 0.5px;
          }
          td { 
            padding: 14px 12px; 
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
            color: #334155;
          }
          tbody tr:hover { 
            background: #f8fafc;
          }
          .text-right { 
            text-align: right;
          }
          .total-section { 
            padding: 30px; 
            background: #f8fafc;
            border-top: 2px solid #e2e8f0;
          }
          .total-row { 
            display: flex; 
            justify-content: space-between; 
            padding: 10px 0;
            font-size: 15px;
          }
          .total-row.grand { 
            border-top: 2px solid #2563eb; 
            margin-top: 10px; 
            padding-top: 15px;
            font-size: 20px;
            font-weight: bold;
            color: #2563eb;
          }
          .footer { 
            padding: 20px 30px; 
            text-align: center; 
            background: #f1f5f9;
            font-size: 12px;
            color: #64748b;
          }
          .confidence-badge {
            display: inline-block;
            padding: 4px 12px;
            background: #dbeafe;
            color: #2563eb;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
          }
          @media print {
            body { padding: 0; }
            .bill-container { border: none; }
          }
        </style>
      </head>
      <body>
        <div class="bill-container">
          <div class="bill-header">
            <h1>BillAgent Pro</h1>
            <p>Digitalized Bill Document</p>
          </div>
          
          <div class="bill-info">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Bill Number</span>
                <span class="info-value">${bill.billNumber || bill.id}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Date</span>
                <span class="info-value">${bill.date}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Vendor Name</span>
                <span class="info-value">${bill.vendorName || 'General Store'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">AI Confidence</span>
                <span class="info-value">
                  <span class="confidence-badge">${bill.overallConfidence || 95}% Match</span>
                </span>
              </div>
            </div>
          </div>

          <div class="items-section">
            <div class="items-title">Items</div>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th class="text-right">Quantity</th>
                  <th class="text-right">Unit Price (₹)</th>
                  <th class="text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${bill.items.map(item => `
                  <tr>
                    <td>${item.description || item.name || 'Item'}</td>
                    <td class="text-right">${item.quantity}</td>
                    <td class="text-right">₹${(item.unitPrice || item.price || 0).toFixed(2)}</td>
                    <td class="text-right">₹${(item.totalPrice || item.total || 0).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="total-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>₹${(bill.totalAmount || 0).toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Tax Amount:</span>
              <span>₹${(bill.taxAmount || 0).toFixed(2)}</span>
            </div>
            <div class="total-row grand">
              <span>Grand Total:</span>
              <span>₹${(bill.grandTotal || bill.totalAmount || 0).toFixed(2)}</span>
            </div>
          </div>

          <div class="footer">
            <p>This is a digitalized version of the original bill, processed by BillAgent Pro AI</p>
            <p>Generated on ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(billHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const downloadBillAsPDF = async (bill: Bill) => {
    // Create a temporary container for the bill
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = '800px';
    tempContainer.style.background = 'white';

    tempContainer.innerHTML = `
      <div style="font-family: 'Segoe UI', sans-serif; padding: 40px; background: white; color: #000;">
        <div style="max-width: 800px; margin: 0 auto; border: 2px solid #2563eb; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 8px;">BillAgent Pro</h1>
            <p style="font-size: 14px; opacity: 0.9;">Digitalized Bill Document</p>
          </div>
          
          <div style="padding: 30px; background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <span style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">Bill Number</span>
                <span style="font-size: 16px; font-weight: 600; color: #0f172a;">${bill.billNumber || bill.id}</span>
              </div>
              <div>
                <span style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">Date</span>
                <span style="font-size: 16px; font-weight: 600; color: #0f172a;">${bill.date}</span>
              </div>
              <div>
                <span style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">Vendor Name</span>
                <span style="font-size: 16px; font-weight: 600; color: #0f172a;">${bill.vendorName || 'General Store'}</span>
              </div>
              <div>
                <span style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">AI Confidence</span>
                <span style="display: inline-block; padding: 4px 12px; background: #dbeafe; color: #2563eb; border-radius: 6px; font-size: 12px; font-weight: 600;">${bill.overallConfidence || 95}% Match</span>
              </div>
            </div>
          </div>

          <div style="padding: 30px;">
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Items</div>
            <table style="width: 100%; border-collapse: collapse;">
              <thead style="background: #f1f5f9;">
                <tr>
                  <th style="padding: 12px; text-align: left; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700;">Description</th>
                  <th style="padding: 12px; text-align: right; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700;">Quantity</th>
                  <th style="padding: 12px; text-align: right; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700;">Unit Price (₹)</th>
                  <th style="padding: 12px; text-align: right; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700;">Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${bill.items.map(item => `
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 14px 12px; font-size: 14px; color: #334155;">${item.description || item.name || 'Item'}</td>
                    <td style="padding: 14px 12px; text-align: right; font-size: 14px; color: #334155;">${item.quantity}</td>
                    <td style="padding: 14px 12px; text-align: right; font-size: 14px; color: #334155;">₹${(item.unitPrice || item.price || 0).toFixed(2)}</td>
                    <td style="padding: 14px 12px; text-align: right; font-size: 14px; color: #334155;">₹${(item.totalPrice || item.total || 0).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div style="padding: 30px; background: #f8fafc; border-top: 2px solid #e2e8f0;">
            <div style="display: flex; justify-content: space-between; padding: 10px 0; font-size: 15px;">
              <span>Subtotal:</span>
              <span>₹${(bill.totalAmount || 0).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0; font-size: 15px;">
              <span>Tax Amount:</span>
              <span>₹${(bill.taxAmount || 0).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-top: 2px solid #2563eb; margin-top: 10px; padding-top: 15px; font-size: 20px; font-weight: bold; color: #2563eb;">
              <span>Grand Total:</span>
              <span>₹${(bill.grandTotal || bill.totalAmount || 0).toFixed(2)}</span>
            </div>
          </div>

          <div style="padding: 20px 30px; text-align: center; background: #f1f5f9; font-size: 12px; color: #64748b;">
            <p>This is a digitalized version of the original bill, processed by BillAgent Pro AI</p>
            <p>Generated on ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(tempContainer);

    try {
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Bill_${bill.billNumber || bill.id}_${new Date().toISOString().split('T')[0]}.pdf`);

      setOpenDropdown(null);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      document.body.removeChild(tempContainer);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Bill History</h1>
          <p className="text-slate-500 dark:text-white/40">Neural records for store ledger (INR)</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportToSheets}
            className="tap-effect flex items-center gap-2.5 px-6 py-3 bg-emerald-100 dark:bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20 rounded-2xl font-bold hover:bg-emerald-200 dark:hover:bg-emerald-600/20"
          >
            <FileSpreadsheet size={18} /> Neural Export
          </button>
          <button className="tap-effect flex items-center gap-2 px-5 py-3 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/60 rounded-2xl border border-slate-300 dark:border-white/10">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Printing Preview Container */}
      <div className="glass-card p-8">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Printer className="text-white" size={32} />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Print & Download Bills</h2>
            <p className="text-slate-600 dark:text-white/60 mb-4">
              Generate professional, digitalized versions of your bills. Download as PDF or print directly with our AI-enhanced formatting.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                <FileDown className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-1">Download as PDF</h3>
                  <p className="text-xs text-slate-600 dark:text-white/60">
                    Save bills as high-quality PDF files for sharing with vendors or customers
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20">
                <Printer className="text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-1">Print as Bill</h3>
                  <p className="text-xs text-slate-600 dark:text-white/60">
                    Print professional bills directly or save as PDF using your browser's print dialog
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <p className="text-xs text-slate-600 dark:text-white/60">
                <span className="font-bold text-slate-800 dark:text-white">💡 Tip:</span> Click the download button in the actions column of any bill to access printing and PDF options.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-visible">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-8 py-6">Identity</th>
                <th className="px-8 py-6">Vendor</th>
                <th className="px-8 py-6">Timestamp</th>
                <th className="px-8 py-6">Aggregate (INR)</th>
                <th className="px-8 py-6">Neural Match</th>
                <th className="px-8 py-6 text-center">Verdict</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {bills.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-32 text-center text-slate-400 dark:text-white/20">
                    <div className="flex flex-col items-center">
                      <FileText size={56} className="mb-6 opacity-30" />
                      <p className="text-lg font-medium">Neural vault is currently empty</p>
                    </div>
                  </td>
                </tr>
              ) : (
                bills.map((bill) => (
                  <tr key={bill.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 group-hover:scale-105 transition-transform">
                          <img src={bill.imageUrl} className="w-full h-full object-cover" alt="Bill" />
                        </div>
                        <span className="text-sm font-bold text-slate-800 dark:text-white tracking-tight">{bill.id}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-semibold text-slate-600 dark:text-white/80">{bill.vendorName || 'General Store'}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-white/40">
                        <Calendar size={14} /> {bill.date}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-slate-800 dark:text-white">₹{bill.grandTotal.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="w-24 space-y-2">
                        <div className="h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${bill.overallConfidence}%` }} />
                        </div>
                        <p className="text-[10px] font-bold text-blue-500 dark:text-blue-400">{bill.overallConfidence}%</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase border ${bill.status === 'VERIFIED' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-400/20' : 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-400/20'
                        }`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="relative">
                          <button
                            onClick={() => setOpenDropdown(openDropdown === bill.id ? null : bill.id)}
                            className="tap-effect p-2.5 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-500/20 rounded-xl border border-blue-300 dark:border-blue-500/20 transition-all"
                            title="Download Options"
                          >
                            <Download size={16} />
                          </button>

                          {/* Dropdown Menu */}
                          {openDropdown === bill.id && (
                            <div className="absolute right-0 mt-2 w-56 rounded-xl p-2 shadow-2xl z-50 animate-fade-in bg-white dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/10">
                              <button
                                onClick={() => downloadBillAsPDF(bill)}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 dark:text-white/80 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all text-left"
                              >
                                <FileDown size={18} className="text-blue-500" />
                                <div>
                                  <p className="font-semibold text-sm">Download as PDF</p>
                                  <p className="text-xs text-slate-500 dark:text-white/40">Save as PDF file</p>
                                </div>
                              </button>
                              <button
                                onClick={() => {
                                  printBill(bill);
                                  setOpenDropdown(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 dark:text-white/80 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all text-left"
                              >
                                <Printer size={18} className="text-purple-500" />
                                <div>
                                  <p className="font-semibold text-sm">Print as Bill</p>
                                  <p className="text-xs text-slate-500 dark:text-white/40">Open print dialog</p>
                                </div>
                              </button>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => setPreviewBill(bill)}
                          className="tap-effect p-2.5 bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/40 hover:text-blue-500 dark:hover:text-white rounded-xl"
                          title="Preview Digital Bill"
                        >
                          <ExternalLink size={16} />
                        </button>
                        <button className="tap-effect p-2.5 bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/40 hover:text-rose-500 dark:hover:text-rose-400 rounded-xl">
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

      {/* Preview Modal */}
      {previewBill && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setPreviewBill(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl m-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Digital Bill Preview</h2>
                <p className="text-sm text-slate-500 dark:text-white/50">Bill #{previewBill.billNumber || previewBill.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    downloadBillAsPDF(previewBill);
                    setPreviewBill(null);
                  }}
                  className="tap-effect flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-500/20 transition-all"
                >
                  <FileDown size={16} />
                  <span className="text-sm font-semibold">Download PDF</span>
                </button>
                <button
                  onClick={() => {
                    printBill(previewBill);
                  }}
                  className="tap-effect flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-500/20 transition-all"
                >
                  <Printer size={16} />
                  <span className="text-sm font-semibold">Print</span>
                </button>
                <button
                  onClick={() => setPreviewBill(null)}
                  className="tap-effect p-2 text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Bill Preview Content */}
            <div className="p-8">
              <div className="max-w-3xl mx-auto border-2 border-blue-500 rounded-2xl overflow-hidden shadow-xl">
                {/* Bill Header */}
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8 text-center">
                  <h1 className="text-4xl font-bold mb-2">BillAgent Pro</h1>
                  <p className="text-sm opacity-90">Digitalized Bill Document</p>
                </div>

                {/* Bill Info */}
                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-b-2 border-slate-200 dark:border-white/10">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs uppercase text-slate-500 dark:text-white/40 font-semibold mb-1">Bill Number</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-white">{previewBill.billNumber || previewBill.id}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500 dark:text-white/40 font-semibold mb-1">Date</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-white">{previewBill.date}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500 dark:text-white/40 font-semibold mb-1">Vendor Name</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-white">{previewBill.vendorName || 'General Store'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-500 dark:text-white/40 font-semibold mb-1">AI Confidence</p>
                      <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-bold">
                        {previewBill.overallConfidence || 95}% Match
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="p-8">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b-2 border-slate-200 dark:border-white/10">Items</h3>
                  <table className="w-full">
                    <thead className="bg-slate-100 dark:bg-slate-800/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 dark:text-white/40 font-bold">Description</th>
                        <th className="px-4 py-3 text-right text-xs uppercase text-slate-500 dark:text-white/40 font-bold">Qty</th>
                        <th className="px-4 py-3 text-right text-xs uppercase text-slate-500 dark:text-white/40 font-bold">Unit Price</th>
                        <th className="px-4 py-3 text-right text-xs uppercase text-slate-500 dark:text-white/40 font-bold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewBill.items.map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-200 dark:border-white/10">
                          <td className="px-4 py-3 text-sm text-slate-700 dark:text-white/80">{item.description || item.name || 'Item'}</td>
                          <td className="px-4 py-3 text-sm text-right text-slate-700 dark:text-white/80">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-right text-slate-700 dark:text-white/80">₹{(item.unitPrice || item.price || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-right text-slate-700 dark:text-white/80">₹{(item.totalPrice || item.total || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t-2 border-slate-200 dark:border-white/10">
                  <div className="space-y-3">
                    <div className="flex justify-between text-base">
                      <span className="text-slate-600 dark:text-white/60">Subtotal:</span>
                      <span className="font-semibold text-slate-800 dark:text-white">₹{(previewBill.totalAmount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-slate-600 dark:text-white/60">Tax Amount:</span>
                      <span className="font-semibold text-slate-800 dark:text-white">₹{(previewBill.taxAmount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-3 border-t-2 border-blue-500 text-blue-600 dark:text-blue-400">
                      <span>Grand Total:</span>
                      <span>₹{(previewBill.grandTotal || previewBill.totalAmount || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-100 dark:bg-slate-800/50 text-center text-xs text-slate-500 dark:text-white/40">
                  <p>This is a digitalized version of the original bill, processed by BillAgent Pro AI</p>
                  <p className="mt-1">Generated on {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillHistory;
