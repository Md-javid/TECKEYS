
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Package, 
  ArrowUpRight,
  MoreHorizontal,
  Zap,
  Leaf,
  Sparkles,
  Volume2,
  ChevronRight,
  Lightbulb,
  MessageSquareQuote,
  Loader2,
  PlayCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { Bill, Page, BusinessInsight } from '../types';
// Fixed: Removed non-existent export 'generateStorytellingAudio' from the service import
import { generateBusinessInsights } from '../services/geminiService';

const Dashboard: React.FC<{ bills: Bill[], onNavigate: (page: Page) => void }> = ({ bills, onNavigate }) => {
  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isStoryMode, setIsStoryMode] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (bills.length > 0) {
      loadInsights();
    }
  }, [bills]);

  const loadInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const data = await generateBusinessInsights(bills);
      setInsights(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const handleStoryNarrate = async () => {
    if (!insights.length) return;
    setIsPlayingAudio(true);
    try {
      const storyText = insights.map(i => `${i.title}. ${i.content}`).join(' ');
      const utterance = new SpeechSynthesisUtterance(storyText);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
      utterance.onend = () => setIsPlayingAudio(false);
    } catch (e) {
      setIsPlayingAudio(false);
    }
  };

  const grandTotalSales = bills.reduce((acc, b) => acc + b.grandTotal, 0);

  const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
    <div className="tap-effect glass-card p-7 group hover:scale-[1.02] cursor-pointer">
      <div className="flex justify-between items-start mb-5">
        <div className={`p-4 rounded-[20px] ${color} bg-opacity-20 flex items-center justify-center`}>
          <Icon className={color.replace('bg-', 'text-')} size={26} />
        </div>
        <button className="text-white/30 hover:text-white transition-colors">
          <MoreHorizontal size={22} />
        </button>
      </div>
      <h3 className="text-white/50 text-sm font-bold uppercase tracking-wider">{title}</h3>
      <div className="flex items-end gap-3 mt-2">
        <span className="text-3xl font-bold text-white/90 tracking-tighter">{value}</span>
        <span className="text-emerald-400 text-sm font-semibold mb-1 flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-full">
          <ArrowUpRight size={14} className="mr-0.5" /> {sub}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white/90 tracking-tight">Business Hub</h1>
          <p className="text-white/50 mt-1.5 text-lg">Neural retail intelligence (INR)</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsStoryMode(!isStoryMode)}
            className={`tap-effect flex items-center gap-2.5 px-7 py-4 rounded-[24px] font-bold transition-all duration-500 border ${
              isStoryMode 
              ? 'bg-indigo-600 text-white border-indigo-400/30 shadow-lg shadow-indigo-500/30' 
              : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
            }`}
          >
            <MessageSquareQuote size={20} />
            Voice Agent
          </button>
          <button 
            onClick={() => onNavigate(Page.Process)}
            className="gem-button flex items-center gap-2.5 px-7 py-4"
          >
            <Package size={20} />
            Process Batch
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Processed" value={bills.length} sub="+8%" icon={CheckCircle2} color="bg-blue-500" />
        <StatCard title="Sales (INR)" value={`₹${grandTotalSales.toLocaleString('en-IN')}`} sub="+22%" icon={TrendingUp} color="bg-emerald-500" />
        <StatCard title="Paper Saved" value={`${(bills.length * 0.2).toFixed(1)}kg`} sub="+100%" icon={Leaf} color="bg-teal-500" />
        <StatCard title="Neural Confidence" value="97.4%" sub="+2%" icon={Zap} color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-9">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-bold text-white/90 tracking-tight">Revenue Dynamics</h2>
              <div className="p-1.5 bg-white/5 rounded-2xl flex gap-1.5 border border-white/10">
                <button className="tap-effect px-5 py-2 rounded-xl text-xs font-bold bg-white/10 shadow-lg text-white">LIVE</button>
                <button className="tap-effect px-5 py-2 rounded-xl text-xs font-bold text-white/40 hover:text-white/70">7D</button>
              </div>
            </div>
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { name: 'Mon', sales: 4000 }, { name: 'Tue', sales: 3000 }, { name: 'Wed', sales: 6000 },
                  { name: 'Thu', sales: 4780 }, { name: 'Fri', sales: 5890 }, { name: 'Sat', sales: 8390 },
                  { name: 'Sun', sales: 7490 },
                ]}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', backdropFilter: 'blur(16px)' }}
                    itemStyle={{ color: '#3b82f6' }}
                    formatter={(val) => `₹${val}`}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSales)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-9 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Sparkles className="text-amber-400" size={26} />
                <h2 className="text-2xl font-bold text-white/90 tracking-tight">AI Insights</h2>
              </div>
              {isLoadingInsights && <Loader2 size={20} className="animate-spin text-white/30" />}
            </div>
            
            <div className="flex-1 space-y-6">
              {insights.map((insight, idx) => (
                <div key={idx} className="tap-effect p-5 rounded-[24px] bg-white/5 border border-white/10 hover:border-white/20 cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-widest ${
                      insight.type === 'TREND' ? 'text-blue-400' : 'text-emerald-400'
                    }`}>
                      {insight.type}
                    </span>
                    <ChevronRight size={16} className="text-white/20 group-hover:text-white/50" />
                  </div>
                  <h3 className="text-sm font-bold text-white/90 mb-1">{insight.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{insight.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-9 bg-teal-500/5 border-teal-500/20">
            <div className="flex items-center gap-3 mb-6">
              <Leaf className="text-teal-400" size={24} />
              <h2 className="text-lg font-bold text-white">Sustainability Agent</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-sm">CO2 Avoided</span>
                <span className="text-teal-400 font-bold">~{(bills.length * 1.4).toFixed(1)}kg</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 w-[65%]" />
              </div>
              <p className="text-xs text-white/30 italic">"By digitizing these bills, you've saved the equivalent of 3 mature banyan tree seedlings."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
