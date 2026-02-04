import React from 'react';
import { ArrowRight, Zap, Shield, BarChart3, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
    onGetStarted: () => void;
    onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
    return (
        <div className="relative min-h-screen flex flex-col overflow-hidden">
            {/* Background with animated gradient mesh */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/20 rounded-full blur-[120px] animate-blob" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
                <div className="absolute top-[40%] left-[30%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-blob animation-delay-4000" />

                {/* Abstract "Video Glance" Lines */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]"></div>
            </div>

            {/* Navbar */}
            <nav className="relative z-10 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Zap className="text-white fill-white" size={20} />
                    </div>
                    <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 dark:from-white to-slate-600 dark:to-white/70">
                        BillAgent<span className="text-blue-500">.</span>
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={onLogin}
                        className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-white/80 hover:text-slate-800 dark:hover:text-white transition-colors"
                    >
                        Log in
                    </button>
                    <button
                        onClick={onGetStarted}
                        className="group px-5 py-2.5 bg-blue-600 dark:bg-white text-white dark:text-black rounded-full text-sm font-semibold hover:bg-blue-700 dark:hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                    >
                        Get Started <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
                <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-white/5 border border-blue-200 dark:border-white/10 text-sm font-medium text-blue-600 dark:text-blue-400 backdrop-blur-sm mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Now with Advanced AI Bill Processing
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-800 dark:text-white leading-[1.1]">
                        Transform Your Billing <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
                            Into Intelligence
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 dark:text-white/60 max-w-2xl mx-auto leading-relaxed">
                        Stop manual data entry. Upload your bills and let our AI agents extract, analyze, and organize your financial data instantly.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <button
                            onClick={onGetStarted}
                            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-semibold text-lg transition-all shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:shadow-[0_0_60px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2"
                        >
                            Start for free
                            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                                <ArrowRight size={12} />
                            </div>
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-white rounded-2xl font-semibold text-lg transition-all backdrop-blur-sm">
                            Watch Demo
                        </button>
                    </div>

                    {/* Feature Grid / Glass Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
                        <div className="p-6 rounded-3xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md hover:bg-slate-50 dark:hover:bg-white/10 transition-colors group shadow-lg dark:shadow-none">
                            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Instant OCR</h3>
                            <p className="text-slate-500 dark:text-white/50">Upload any bill format and extract data in seconds with 99% accuracy.</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md hover:bg-slate-50 dark:hover:bg-white/10 transition-colors group shadow-lg dark:shadow-none">
                            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-500 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                                <BarChart3 size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Smart Analytics</h3>
                            <p className="text-slate-500 dark:text-white/50">Visualize spending patterns and get AI-driven cost saving suggestions.</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md hover:bg-slate-50 dark:hover:bg-white/10 transition-colors group shadow-lg dark:shadow-none">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Bank Assessment</h3>
                            <p className="text-slate-500 dark:text-white/50">Enterprise-grade security ensures your financial data is always protected.</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer minimal */}
            <footer className="relative z-10 py-6 text-center text-slate-500 dark:text-white/30 text-sm">
                <p>© 2026 BillAgent Pro. All rights reserved.</p>
            </footer>
        </div>
    );
};
