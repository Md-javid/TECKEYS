import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

interface LoginProps {
    onLoginSuccess: () => void;
    onSwitchToRegister: () => void;
    onBack: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToRegister, onBack }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Clear error only when user starts typing again
    useEffect(() => {
        if (error) setError('');
    }, [formData.username, formData.password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.login(formData);
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            onLoginSuccess();
        } catch (err: any) {
            console.error("Login error:", err);
            // Ensure error persists and is readable
            const errorMsg = err.response?.data?.detail || 'Invalid username or password. Please try again.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[100px] animate-blob" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[100px] animate-blob animation-delay-2000" />
            </div>

            <div className="w-full max-w-md animate-fade-in-up">
                <button
                    onClick={onBack}
                    className="mb-6 flex items-center gap-2 text-slate-500 dark:text-white/60 hover:text-slate-700 dark:hover:text-white transition-colors group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>

                <div className="glass-card p-8 md:p-10 backdrop-blur-xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Welcome Back</h1>
                        <p className="text-slate-500 dark:text-white/50">Enter your credentials to access your workspace</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/20 rounded-xl p-4 mb-6 flex items-start gap-3 animate-shake">
                            <AlertCircle className="text-red-500 dark:text-red-400 shrink-0 mt-0.5" size={18} />
                            <p className="text-sm text-red-600 dark:text-red-200">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-white/80 mb-1.5 ml-1">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={formData.username}
                                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                                required
                                className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                                placeholder="Enter your username"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5 ml-1">
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-white/80">Password</label>
                                <button type="button" className="text-xs text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors">Forgot password?</button>
                            </div>
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                required
                                className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 dark:text-white/40 text-sm">
                            Don't have an account?{' '}
                            <button
                                onClick={onSwitchToRegister}
                                className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-medium transition-colors hover:underline underline-offset-4"
                            >
                                Create Account
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
