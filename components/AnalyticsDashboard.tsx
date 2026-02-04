import React, { useEffect, useState } from 'react';
import { analyticsAPI } from '../services/api';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, FileText, Calendar, ShoppingBag, Percent, Activity, AlertCircle, RefreshCw } from 'lucide-react';

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#06b6d4', '#8b5cf6'];

export const AnalyticsDashboard: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [weeklyData, setWeeklyData] = useState<any>(null);
    const [monthlyData, setMonthlyData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        setLoading(true);
        setError(null);
        try {
            const [dashboard, weekly, monthly] = await Promise.all([
                analyticsAPI.getDashboard(),
                analyticsAPI.getWeekly(),
                analyticsAPI.getMonthly(),
            ]);

            setDashboardData(dashboard.data);
            setWeeklyData(weekly.data);
            setMonthlyData(monthly.data);
        } catch (error: any) {
            console.error('Failed to load analytics:', error);
            setError(error?.response?.data?.detail || error?.message || 'Failed to load analytics data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-white/60">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center glass-card p-8 rounded-2xl max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Failed to Load Analytics</h2>
                    <p className="text-slate-600 dark:text-white/60 mb-6">{error}</p>
                    <button 
                        onClick={loadAnalytics}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center gap-2 mx-auto transition-all"
                    >
                        <RefreshCw size={18} /> Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Prepare data for charts
    const categoryData = monthlyData?.category_breakdown
        ? Object.entries(monthlyData.category_breakdown).map(([name, value]) => ({
            name,
            value: Number(value),
        }))
        : [];

    const vendorData = monthlyData?.top_vendors?.slice(0, 6) || [];

    // Mock trend data (replace with real API data if available)
    const trendData = [
        { month: 'Jan', revenue: 4200, bills: 12, avgBill: 350 },
        { month: 'Feb', revenue: 3800, bills: 10, avgBill: 380 },
        { month: 'Mar', revenue: 5100, bills: 15, avgBill: 340 },
        { month: 'Apr', revenue: 4600, bills: 13, avgBill: 354 },
        { month: 'May', revenue: 5800, bills: 18, avgBill: 322 },
        { month: 'Jun', revenue: 6200, bills: 20, avgBill: 310 },
    ];

    // Performance metrics for radar chart
    const performanceData = [
        { metric: 'Revenue', value: 85 },
        { metric: 'Bills', value: 70 },
        { metric: 'Accuracy', value: 95 },
        { metric: 'Processing', value: 88 },
        { metric: 'Growth', value: 75 },
    ];

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Analytics Dashboard</h1>
                <p className="text-slate-600 dark:text-white/60">Comprehensive insights into your billing data</p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                            <DollarSign className="text-white" size={24} />
                        </div>
                        {monthlyData?.growth_percentage !== undefined && (
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${monthlyData.growth_percentage >= 0
                                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                }`}>
                                {monthlyData.growth_percentage >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                {Math.abs(monthlyData.growth_percentage).toFixed(1)}%
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-white/60 mb-1">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        ₹{Number(dashboardData?.current_month?.total_amount || 0).toFixed(2)}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-white/40 mt-2">This month</p>
                </div>

                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                            <FileText className="text-white" size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-white/60 mb-1">Bills Processed</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {dashboardData?.current_month?.total_bills || 0}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-white/40 mt-2">This month</p>
                </div>

                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                            <Calendar className="text-white" size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-white/60 mb-1">Last 7 Days</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        ₹{Number(dashboardData?.last_7_days?.total_amount || 0).toFixed(2)}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-white/40 mt-2">
                        {dashboardData?.last_7_days?.total_bills || 0} bills
                    </p>
                </div>

                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                            <Activity className="text-white" size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-white/60 mb-1">Average Bill</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        ₹{Number(monthlyData?.average_bill_amount || 0).toFixed(2)}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-white/40 mt-2">This month</p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend Chart */}
                <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                            <YAxis stroke="rgba(255,255,255,0.5)" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px'
                                }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Breakdown Pie Chart */}
                <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Spending by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData.length > 0 ? categoryData : [{ name: 'No Data', value: 1 }]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => categoryData.length > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : 'No data yet'}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Vendors Bar Chart */}
                <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top Vendors</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={vendorData.length > 0 ? vendorData : [{ vendor_name: 'No Data', total: 0 }]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="vendor_name" stroke="rgba(255,255,255,0.5)" />
                            <YAxis stroke="rgba(255,255,255,0.5)" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px'
                                }}
                            />
                            <Bar dataKey="total" fill="#ec4899" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Bills Count Trend */}
                <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Bills Processed Over Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                            <YAxis stroke="rgba(255,255,255,0.5)" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px'
                                }}
                            />
                            <Line type="monotone" dataKey="bills" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Performance Radar Chart */}
                <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Performance Metrics</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={performanceData}>
                            <PolarGrid stroke="rgba(255,255,255,0.1)" />
                            <PolarAngleAxis dataKey="metric" stroke="rgba(255,255,255,0.5)" />
                            <PolarRadiusAxis stroke="rgba(255,255,255,0.3)" />
                            <Radar name="Performance" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px'
                                }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Average Bill Trend */}
                <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Average Bill Amount</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                            <YAxis stroke="rgba(255,255,255,0.5)" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px'
                                }}
                            />
                            <Area type="monotone" dataKey="avgBill" stroke="#f59e0b" fillOpacity={1} fill="url(#colorAvg)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Weekly Summary Card */}
            {weeklyData && (
                <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">This Week's Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-600/10 border border-violet-500/20">
                            <p className="text-sm text-slate-600 dark:text-white/60 mb-1">Total Bills</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{weeklyData.total_bills}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500/10 to-rose-600/10 border border-pink-500/20">
                            <p className="text-sm text-slate-600 dark:text-white/60 mb-1">Total Amount</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{Number(weeklyData.total_amount || 0).toFixed(2)}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20">
                            <p className="text-sm text-slate-600 dark:text-white/60 mb-1">Total Tax</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{Number(weeklyData.total_tax || 0).toFixed(2)}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20">
                            <p className="text-sm text-slate-600 dark:text-white/60 mb-1">Average Bill</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{Number(weeklyData.average_bill_amount || 0).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
