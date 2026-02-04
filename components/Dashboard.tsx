
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
  ChevronRight,
  Lightbulb,
  Loader2
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
import { useTranslation } from 'react-i18next';
import { Bill, Page, BusinessInsight } from '../types';
// Fixed: Removed non-existent export 'generateStorytellingAudio' from the service import
import { getLocalizedInsights } from '../services/geminiService';

const Dashboard: React.FC<{ bills: Bill[], onNavigate: (page: Page) => void }> = ({ bills, onNavigate }) => {
  const { t, i18n } = useTranslation();
  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  useEffect(() => {
    if (bills.length > 0) {
      loadInsights();
    }
  }, [bills, i18n.language]);

  const loadInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const data = await getLocalizedInsights(bills, i18n.language);
      setInsights(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const grandTotalSales = bills.reduce((acc, b) => acc + b.grandTotal, 0);

  // Calculate item stats (highest sold and lowest stock)
  const itemStats = bills.reduce((acc, bill) => {
    bill.items.forEach(item => {
      const itemName = item.description || item.name || 'Unknown Item';
      if (!acc[itemName]) {
        acc[itemName] = {
          totalQuantity: 0,
          totalRevenue: 0,
          // Mock stock data - in real app this would come from inventory system
          stock: Math.floor(Math.random() * 100) + 10 // Random stock between 10-110
        };
      }
      acc[itemName].totalQuantity += item.quantity;
      acc[itemName].totalRevenue += (item.totalPrice || item.total || 0);
    });
    return acc;
  }, {} as Record<string, { totalQuantity: number; totalRevenue: number; stock: number }>);

  const itemEntries = Object.entries(itemStats).map(([name, stats]) => ({
    name,
    totalQuantity: stats.totalQuantity,
    totalRevenue: stats.totalRevenue,
    stock: stats.stock
  }));

  const highestSoldItem = itemEntries.sort((a, b) => b.totalQuantity - a.totalQuantity)[0];
  const lowestStockItem = itemEntries.sort((a, b) => a.stock - b.stock)[0];

  const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
    <div className="tap-effect glass-card p-7 group hover:scale-[1.02] cursor-pointer">
      <div className="flex justify-between items-start mb-5">
        <div className={`p-4 rounded-[20px] ${color} bg-opacity-20 flex items-center justify-center`}>
          <Icon className={color.replace('bg-', 'text-')} size={26} />
        </div>
        <button className="text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white transition-colors">
          <MoreHorizontal size={22} />
        </button>
      </div>
      <h3 className="text-slate-500 dark:text-white/50 text-sm font-bold uppercase tracking-wider">{title}</h3>
      <div className="flex items-end gap-3 mt-2">
        <span className="text-3xl font-bold text-slate-800 dark:text-white/90 tracking-tighter">{value}</span>
        <span className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-1 flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-full">
          <ArrowUpRight size={14} className="mr-0.5" /> {sub}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white/90 tracking-tight">{t('dashboard.title')}</h1>
          <p className="text-slate-500 dark:text-white/50 mt-1.5 text-lg">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => onNavigate(Page.Process)}
            className="gem-button flex items-center gap-2.5 px-7 py-4"
          >
            <Package size={20} />
            {t('dashboard.processBatch')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={t('dashboard.stats.processed')} value={bills.length} sub="+8%" icon={CheckCircle2} color="bg-blue-500" />
        <StatCard title={t('dashboard.stats.sales')} value={`₹${grandTotalSales.toLocaleString('en-IN')}`} sub="+22%" icon={TrendingUp} color="bg-emerald-500" />
        <StatCard
          title={t('dashboard.stats.highestSold')}
          value={highestSoldItem ? highestSoldItem.name.substring(0, 12) + (highestSoldItem.name.length > 12 ? '...' : '') : 'N/A'}
          sub={highestSoldItem ? `${highestSoldItem.totalQuantity} units` : '0 units'}
          icon={TrendingUp}
          color="bg-purple-500"
        />
        <StatCard
          title={t('dashboard.stats.lowestStock')}
          value={lowestStockItem ? lowestStockItem.name.substring(0, 12) + (lowestStockItem.name.length > 12 ? '...' : '') : 'N/A'}
          sub={lowestStockItem ? `${lowestStockItem.stock} left` : '0 left'}
          icon={Package}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-9">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white/90 tracking-tight">{t('dashboard.revenueDynamics')}</h2>
              <div className="p-1.5 bg-slate-100 dark:bg-white/5 rounded-2xl flex gap-1.5 border border-slate-200 dark:border-white/10">
                <button className="tap-effect px-5 py-2 rounded-xl text-xs font-bold bg-blue-500 shadow-lg text-white">LIVE</button>
                <button className="tap-effect px-5 py-2 rounded-xl text-xs font-bold text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white/70">7D</button>
              </div>
            </div>
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { name: t('dashboard.days.mon'), sales: 4000 },
                  { name: t('dashboard.days.tue'), sales: 3000 },
                  { name: t('dashboard.days.wed'), sales: 6000 },
                  { name: t('dashboard.days.thu'), sales: 4780 },
                  { name: t('dashboard.days.fri'), sales: 5890 },
                  { name: t('dashboard.days.sat'), sales: 8390 },
                  { name: t('dashboard.days.sun'), sales: 7490 },
                ]}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100,116,139,0.2)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(100,116,139,0.8)', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(100,116,139,0.8)', fontSize: 12 }} />
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
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white/90 tracking-tight">{t('dashboard.aiInsights')}</h2>
              </div>
              {isLoadingInsights && <Loader2 size={20} className="animate-spin text-slate-400 dark:text-white/30" />}
            </div>

            <div className="flex-1 space-y-6">
              {insights.map((insight, idx) => (
                <div key={idx} className="tap-effect p-5 rounded-[24px] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-widest ${insight.type === 'TREND' ? 'text-blue-500 dark:text-blue-400' : 'text-emerald-500 dark:text-emerald-400'
                      }`}>
                      {insight.type}
                    </span>
                    <ChevronRight size={16} className="text-slate-300 dark:text-white/20 group-hover:text-slate-500 dark:group-hover:text-white/50" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white/90 mb-1">{insight.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-white/40 leading-relaxed">{insight.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
