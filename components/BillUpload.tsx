
import React, { useState, useRef } from 'react';
import {
  FileUp,
  Loader2,
  CheckCircle,
  X,
  Scan,
  ShieldCheck,
  Zap,
  MessageSquare,
  AlertTriangle,
  Save,
  Trash2,
  Cpu,
  BrainCircuit,
  Calculator
} from 'lucide-react';
import { processBillImage } from '../services/geminiService';
import { Bill, BillItem, AgentReport } from '../types';

const SUGGESTIONS = ["Inventory Restock", "Utility Bill", "Office Maintenance", "Bulk Raw Materials", "Tech Equipment"];

const BillUpload: React.FC<{ onComplete: (bill: Bill) => void }> = ({ onComplete }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'upload' | 'context' | 'analyzing' | 'review'>('upload');
  const [userContext, setUserContext] = useState("");
  const [extractedData, setExtractedData] = useState<Partial<Bill> | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setStep('context');
      };
      reader.readAsDataURL(selected);
    }
  };

  const startProcessing = async () => {
    if (!preview) return;
    setIsProcessing(true);
    setStep('analyzing');
    try {
      const result = await processBillImage(preview, userContext);
      setExtractedData(result);
      setStep('review');
    } catch (error) {
      alert("Agentic Layer Error: AI agents disconnected.");
      setStep('upload');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleItemChange = (index: number, field: keyof BillItem, value: any) => {
    if (!extractedData || !extractedData.items) return;
    const newItems = [...extractedData.items];
    const item = { ...newItems[index], [field]: value, isEdited: true };

    // Auto-recalculate line total if qty or price changes
    if (field === 'quantity' || field === 'price') {
      item.total = (item.quantity || 0) * (item.price || 0);
    }

    newItems[index] = item;

    const newGrandTotal = newItems.reduce((acc, i) => acc + (i.total || 0), 0);
    setExtractedData({ ...extractedData, items: newItems, grandTotal: newGrandTotal });
  };

  const removeItem = (index: number) => {
    if (!extractedData || !extractedData.items) return;
    const newItems = extractedData.items.filter((_, i) => i !== index);
    const newGrandTotal = newItems.reduce((acc, i) => acc + (i.total || 0), 0);
    setExtractedData({ ...extractedData, items: newItems, grandTotal: newGrandTotal });
  };

  const confirmBill = () => {
    if (!extractedData || !preview) return;
    const finalBill: Bill = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      date: extractedData.date || new Date().toISOString().split('T')[0],
      imageUrl: preview,
      items: extractedData.items as BillItem[],
      grandTotal: extractedData.grandTotal || 0,
      status: 'VERIFIED',
      overallConfidence: extractedData.overallConfidence || 100,
      agents: extractedData.agents as AgentReport[],
      vendorName: extractedData.vendorName || 'Manual Entry',
      userContext: userContext
    };
    onComplete(finalBill);
    setStep('upload');
    setPreview(null);
    setUserContext("");
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in zoom-in-95 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-extrabold text-white tracking-tighter italic">Digitize <span className="text-blue-500">Asset</span></h1>
          <p className="text-white/40 text-lg mt-2">Agentic Reasoning • Gemini 3 • INR (₹)</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center gap-2">
            <BrainCircuit size={18} className="text-blue-400" />
            <span className="text-xs font-bold text-white/60">4 Agents Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <div className="glass-card sticky top-32 overflow-hidden bg-black/40">
            {preview ? (
              <div className="relative aspect-[3/4] flex items-center justify-center group">
                <img src={preview} alt="Capture" className="max-h-full object-contain" />
                {step === 'analyzing' && (
                  <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-xl flex flex-col items-center justify-center animate-pulse">
                    <div className="relative">
                      <Scan className="text-blue-400 animate-bounce" size={64} />
                      <div className="absolute -top-4 -right-4 w-6 h-6 bg-emerald-500 rounded-full animate-ping" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mt-8 tracking-tighter">Running Multi-Agent Scan</h3>
                    <div className="flex gap-2 mt-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                )}
                {step !== 'analyzing' && (
                  <button onClick={() => { setPreview(null); setStep('upload'); }} className="tap-effect absolute top-6 right-6 p-4 bg-white/10 rounded-2xl border border-white/20 text-white">
                    <X size={24} />
                  </button>
                )}
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="tap-effect aspect-[3/4] flex flex-col items-center justify-center p-12 border-4 border-dashed border-white/5 cursor-pointer hover:bg-blue-600/5 transition-all group m-4 rounded-[32px]"
              >
                <div className="w-24 h-24 bg-blue-600/10 rounded-[36px] flex items-center justify-center mb-8 text-blue-500 group-hover:scale-110 transition-transform duration-500">
                  <FileUp size={48} />
                </div>
                <h3 className="text-3xl font-bold text-white/90 mb-3 tracking-tight">Upload Bill Image</h3>
                <p className="text-white/30 text-center text-lg mb-10">Capture or drop your receipts here</p>
                <button className="gem-button px-12 py-5 text-lg">Select Store File</button>
              </div>
            )}
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          {step === 'context' && (
            <div className="glass-card p-12 animate-in slide-in-from-right-12">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-blue-500/10 rounded-3xl">
                  <MessageSquare className="text-blue-400" size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Context Selection</h2>
                  <p className="text-white/40">Assist the Learning Agent in categorization</p>
                </div>
              </div>

              <div className="space-y-10">
                <textarea
                  value={userContext}
                  onChange={(e) => setUserContext(e.target.value)}
                  placeholder="e.g. Bulk purchase of organic lentils for the main store..."
                  className="w-full bg-white/5 border border-white/10 rounded-[32px] p-8 min-h-[180px] outline-none focus:ring-4 focus:ring-blue-500/20 text-white text-xl transition-all"
                />

                <div className="flex flex-wrap gap-3">
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => setUserContext(s)}
                      className={`tap-effect px-6 py-4 rounded-2xl text-sm font-bold border transition-all ${userContext === s ? 'bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-500/30' : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70'
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <button onClick={startProcessing} className="gem-button w-full py-6 flex items-center justify-center gap-4 text-2xl">
                  Analyze Neural Scan <Zap fill="white" size={24} />
                </button>
              </div>
            </div>
          )}

          {step === 'review' && extractedData && (
            <div className="space-y-8 animate-in slide-in-from-right-12">
              <div className="glass-card p-10">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl">
                      <ShieldCheck className="text-emerald-400" size={30} />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Review The Things</h2>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">OCR Confidence</span>
                    <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <div className="h-full bg-blue-500" style={{ width: `${extractedData.overallConfidence}%` }} />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 scroll-thin">
                  {extractedData.items?.map((item: any, i: number) => (
                    <div key={i} className={`p-8 rounded-[36px] border transition-all group ${item.confidence < 80 ? 'bg-amber-500/5 border-amber-500/20' : 'bg-white/5 border-white/10'
                      }`}>
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-full">
                          <label className="text-[10px] text-white/30 font-bold uppercase tracking-widest block mb-2">Item Description</label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemChange(i, 'name', e.target.value)}
                            className="bg-transparent text-xl font-bold text-white border-b border-transparent focus:border-blue-500 outline-none w-full"
                          />
                        </div>
                        <button onClick={() => removeItem(i)} className="tap-effect p-3 text-white/10 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-8">
                        <div>
                          <label className="text-[10px] text-white/30 font-bold uppercase tracking-widest block mb-1">Quantity</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(i, 'quantity', parseFloat(e.target.value))}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] text-white/30 font-bold uppercase tracking-widest block mb-1">Unit Price (₹)</label>
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => handleItemChange(i, 'price', parseFloat(e.target.value))}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold outline-none"
                          />
                        </div>
                        <div className="text-right">
                          <label className="text-[10px] text-white/30 font-bold uppercase tracking-widest block mb-1">Total</label>
                          <p className="text-2xl font-black text-blue-400">₹{item.total.toLocaleString('en-IN')}</p>
                          {item.confidence < 85 && (
                            <span className="text-[9px] text-amber-400 font-bold italic flex items-center justify-end gap-1 mt-1">
                              <AlertTriangle size={10} /> Low Confidence Result
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-12 border-t border-white/10 space-y-10">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-white/40 font-bold text-xs uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        <Calculator size={14} className="text-blue-400" /> Neural Calculated Aggregate
                      </h3>
                      <p className="text-white/20 text-xs italic">Corrected by Error Agent Logic</p>
                    </div>
                    <div className="text-right">
                      <span className="text-5xl font-black text-white tracking-tighter">₹{extractedData.grandTotal?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button onClick={confirmBill} className="gem-button w-full py-7 flex items-center justify-center gap-4 text-2xl">
                    Finalize Neural Records <Save size={28} />
                  </button>
                </div>
              </div>

              {/* Multi-Agent Report Cards */}
              <div className="grid grid-cols-2 gap-4">
                {extractedData.agents?.map((agent, i) => (
                  <div key={i} className={`p-6 rounded-[28px] border flex flex-col justify-between ${agent.verdict === 'OK' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-amber-500/5 border-amber-500/10'
                    }`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{agent.agentName}</span>
                      <div className={`w-3 h-3 rounded-full ${agent.verdict === 'OK' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]'}`} />
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed font-medium">"{agent.reasoning}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillUpload;
