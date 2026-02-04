import React, { useState, useEffect } from 'react';
import { 
  User, Store, Bell, Shield, Palette, Save, AlertCircle, Check, 
  Mail, Phone, MapPin, Building2, Tag, Edit2, X, Moon, Sun, Volume2, VolumeX, Languages
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { authAPI } from '../services/api';
import { languages } from '../services/i18n';

interface SettingsFormData {
  first_name: string;
  last_name: string;
  email: string;
  store_name: string;
  store_type: string;
  store_phone: string;
  store_address: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  billReminders: boolean;
  weeklyReports: boolean;
  soundEnabled: boolean;
}

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<'profile' | 'store' | 'notifications' | 'appearance'>('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [formData, setFormData] = useState<SettingsFormData>({
    first_name: '',
    last_name: '',
    email: '',
    store_name: '',
    store_type: '',
    store_phone: '',
    store_address: '',
  });
  
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    billReminders: true,
    weeklyReports: false,
    soundEnabled: true,
  });

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadUserData();
    loadSettings();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      if (response.data) {
        setFormData({
          first_name: response.data.first_name || '',
          last_name: response.data.last_name || '',
          email: response.data.email || '',
          store_name: response.data.store_name || '',
          store_type: response.data.store_type || '',
          store_phone: response.data.store_phone || '',
          store_address: response.data.store_address || '',
        });
      }
    } catch (error) {
      showMessage('error', 'Failed to load user data');
    }
  };

  const loadSettings = () => {
    const savedTheme = (localStorage.getItem('billagent_theme') as 'dark' | 'light') || 'dark';
    setTheme(savedTheme);
    
    const savedNotifications = localStorage.getItem('billagent_notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (key: keyof NotificationSettings) => {
    const newNotifications = { ...notifications, [key]: !notifications[key] };
    setNotifications(newNotifications);
    localStorage.setItem('billagent_notifications', JSON.stringify(newNotifications));
    showMessage('success', 'Notification settings updated');
  };

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    localStorage.setItem('billagent_theme', newTheme);
    document.documentElement.className = newTheme;
    showMessage('success', t('settings.messages.themeUpdated'));
  };

  const handleLanguageChange = async (langCode: string) => {
    try {
      await i18n.changeLanguage(langCode);
      setCurrentLanguage(langCode);
      localStorage.setItem('billagent_language', langCode);
      showMessage('success', t('settings.messages.languageUpdated'));
    } catch (error) {
      showMessage('error', t('settings.messages.updateFailed'));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
      });
      showMessage('success', 'Profile updated successfully!');
      setIsEditingProfile(false);
      await loadUserData();
    } catch (error) {
      showMessage('error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.updateProfile({
        store_name: formData.store_name,
        store_type: formData.store_type,
        store_phone: formData.store_phone,
        store_address: formData.store_address,
      });
      showMessage('success', 'Store information updated successfully!');
      await loadUserData();
    } catch (error) {
      showMessage('error', 'Failed to update store information');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: t('settings.tabs.profile'), icon: User },
    { id: 'store', label: t('settings.tabs.store'), icon: Store },
    { id: 'notifications', label: t('settings.tabs.notifications'), icon: Bell },
    { id: 'appearance', label: t('settings.tabs.appearance'), icon: Palette },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t('settings.title')}</h1>
        <p className="text-slate-600 dark:text-white/60">Manage your account preferences and configurations</p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`mb-6 p-4 rounded-2xl border flex items-start gap-3 animate-fade-in ${
          message.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
        }`}>
          {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="glass-card p-2 rounded-2xl space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Personal Information</h2>
                {!isEditingProfile ? (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all"
                  >
                    <Edit2 size={16} />
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/80 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-white/80 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      disabled={!isEditingProfile}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-white/80 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      disabled={!isEditingProfile}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-white/80 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-white/40 mt-1">Email cannot be changed</p>
                </div>

                {isEditingProfile && (
                  <div className="flex gap-3 justify-end pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/30"
                    >
                      <Save size={18} />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Store Tab */}
          {activeTab === 'store' && (
            <div className="glass-card p-6 rounded-2xl">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Store Information</h2>
              
              <form onSubmit={handleStoreSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-white/80 mb-2">
                      <Building2 size={16} className="inline mr-2" />
                      Store Name
                    </label>
                    <input
                      type="text"
                      name="store_name"
                      value={formData.store_name}
                      onChange={handleChange}
                      placeholder="Enter store name"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-white/80 mb-2">
                      <Tag size={16} className="inline mr-2" />
                      Store Type
                    </label>
                    <input
                      type="text"
                      name="store_type"
                      value={formData.store_type}
                      onChange={handleChange}
                      placeholder="e.g., Retail, Grocery"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-white/80 mb-2">
                    <Phone size={16} className="inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="store_phone"
                    value={formData.store_phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-white/80 mb-2">
                    <MapPin size={16} className="inline mr-2" />
                    Store Address
                  </label>
                  <textarea
                    name="store_address"
                    value={formData.store_address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter complete address"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/30"
                  >
                    <Save size={18} />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="glass-card p-6 rounded-2xl">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Notification Preferences</h2>
              
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                  { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' },
                  { key: 'billReminders', label: 'Bill Reminders', desc: 'Reminders for pending bills' },
                  { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Weekly analytics summary' },
                  { key: 'soundEnabled', label: 'Sound Effects', desc: 'Enable notification sounds' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{item.label}</p>
                      <p className="text-sm text-slate-600 dark:text-white/60">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle(item.key as keyof NotificationSettings)}
                      className={`relative w-12 h-6 rounded-full transition-all ${
                        notifications[item.key as keyof NotificationSettings]
                          ? 'bg-blue-600'
                          : 'bg-slate-300 dark:bg-white/20'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          notifications[item.key as keyof NotificationSettings] ? 'translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="glass-card p-6 rounded-2xl">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">{t('settings.appearance.title')}</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-4">{t('settings.appearance.theme')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleThemeChange('dark')}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        theme === 'dark'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-200 dark:border-white/10 hover:border-blue-400'
                      }`}
                    >
                      <Moon size={32} className="mx-auto mb-3 text-slate-900 dark:text-white" />
                      <p className="font-medium text-slate-900 dark:text-white">{t('settings.appearance.darkMode')}</p>
                      <p className="text-sm text-slate-600 dark:text-white/60 mt-1">Easy on the eyes</p>
                    </button>
                    <button
                      onClick={() => handleThemeChange('light')}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        theme === 'light'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-200 dark:border-white/10 hover:border-blue-400'
                      }`}
                    >
                      <Sun size={32} className="mx-auto mb-3 text-slate-900 dark:text-white" />
                      <p className="font-medium text-slate-900 dark:text-white">{t('settings.appearance.lightMode')}</p>
                      <p className="text-sm text-slate-600 dark:text-white/60 mt-1">Bright and clear</p>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-4">{t('settings.appearance.language')}</h3>
                  <p className="text-sm text-slate-600 dark:text-white/60 mb-4">{t('settings.appearance.selectLanguage')}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(languages).map(([code, { name, flag, dir }]) => (
                      <button
                        key={code}
                        onClick={() => handleLanguageChange(code)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          currentLanguage === code
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-slate-200 dark:border-white/10 hover:border-blue-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{flag}</span>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{name}</p>
                            <p className="text-xs text-slate-600 dark:text-white/60">{code.toUpperCase()}</p>
                          </div>
                          {currentLanguage === code && (
                            <Check size={20} className="ml-auto text-blue-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Tip:</strong> You can also toggle theme using the button in the top navigation bar. Language changes are powered by Google Gemini AI for natural translations.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
