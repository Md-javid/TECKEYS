import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { ArrowLeft, Loader2, AlertCircle, Building2, User } from 'lucide-react';

interface RegisterProps {
    onRegisterSuccess: () => void;
    onSwitchToLogin: () => void;
    onBack: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onSwitchToLogin, onBack }) => {
    const [step, setStep] = useState(1); // 1: Personal, 2: Store
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
        store_name: '',
        store_type: 'retail',
        phone: '',
        address: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (error) setError('');
    }, [formData]);

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1) {
            if (formData.password !== formData.password2) {
                setError('Passwords do not match');
                return;
            }
            if (!formData.first_name || !formData.last_name || !formData.email || !formData.username || !formData.password) {
                setError('Please fill in all required fields');
                return;
            }
            setStep(2);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.register(formData);
            localStorage.setItem('access_token', response.data.tokens.access);
            localStorage.setItem('refresh_token', response.data.tokens.refresh);
            onRegisterSuccess();
        } catch (err: any) {
            const errorData = err.response?.data;
            if (errorData) {
                // Format Django errors nicely
                const errorMessages = Object.entries(errorData)
                    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value[0] : value}`)
                    .join(', ');
                setError(errorMessages);
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[100px] animate-blob" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px] animate-blob animation-delay-2000" />
            </div>

            <div className="w-full max-w-xl animate-fade-in-up">
                <button
                    onClick={step === 1 ? onBack : () => setStep(1)}
                    className="mb-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    {step === 1 ? 'Back to Home' : 'Back to Personal Info'}
                </button>

                <div className="glass-card p-8 md:p-10 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-white/50">Join BillAgent Pro in seconds</p>

                        <div className="flex items-center justify-center gap-2 mt-6">
                            <div className={`h-2 w-16 rounded-full transition-all duration-300 ${step === 1 ? 'bg-blue-500' : 'bg-white/20'}`} />
                            <div className={`h-2 w-16 rounded-full transition-all duration-300 ${step === 2 ? 'bg-blue-500' : 'bg-white/20'}`} />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start gap-3 animate-shake">
                            <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
                            <p className="text-sm text-red-200">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleNextStep} className="space-y-4">
                        {step === 1 ? (
                            <div className="space-y-4 animate-fade-in">
                                <div className="flex item-center mb-2 gap-2 text-blue-400 text-sm font-semibold uppercase tracking-wider">
                                    <User size={16} /> Personal Information
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-1.5 ml-1">First Name</label>
                                        <input
                                            type="text"
                                            value={formData.first_name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                                            required
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-1.5 ml-1">Last Name</label>
                                        <input
                                            type="text"
                                            value={formData.last_name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                                            required
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-1.5 ml-1">Username</label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        placeholder="johndoe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-1.5 ml-1">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-1.5 ml-1">Password</label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                            required
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-1.5 ml-1">Confirm</label>
                                        <input
                                            type="password"
                                            value={formData.password2}
                                            onChange={(e) => setFormData(prev => ({ ...prev, password2: e.target.value }))}
                                            required
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-fade-in">
                                <div className="flex item-center mb-2 gap-2 text-blue-400 text-sm font-semibold uppercase tracking-wider">
                                    <Building2 size={16} /> Store Details
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-1.5 ml-1">Store Name</label>
                                    <input
                                        type="text"
                                        value={formData.store_name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, store_name: e.target.value }))}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        placeholder="My Awesome Store"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-1.5 ml-1">Store Type</label>
                                    <select
                                        value={formData.store_type}
                                        onChange={(e) => setFormData(prev => ({ ...prev, store_type: e.target.value }))}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all [&>option]:text-black"
                                    >
                                        <option value="retail">Retail Store</option>
                                        <option value="restaurant">Restaurant</option>
                                        <option value="grocery">Grocery Store</option>
                                        <option value="pharmacy">Pharmacy</option>
                                        <option value="electronics">Electronics Store</option>
                                        <option value="clothing">Clothing Store</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-1.5 ml-1">Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-1.5 ml-1">Address</label>
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all min-h-[80px]"
                                        placeholder="Store address..."
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (step === 1 ? 'Next Step' : 'Create Account')}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-white/40 text-sm">
                            Already have an account?{' '}
                            <button
                                onClick={onSwitchToLogin}
                                className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline underline-offset-4"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
