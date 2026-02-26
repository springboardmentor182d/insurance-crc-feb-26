import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../layout/Sidebar';
import { Navbar } from '../layout/Navbar';
import {
    User,
    Bell,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Palette,
    Save,
    Edit2,
    Shield,
    Globe,

    MessageSquare,
    Smartphone,
    Eye,
    EyeOff,
    CheckCircle,

} from 'lucide-react';

export default function Settings() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [saved, setSaved] = useState(false);

    /* ================= PROFILE STATE ================= */

    const sampleUser = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        dob: '1990-05-15',
        address: '123 Main Street, New York, NY 10001',
        occupation: 'Software Engineer',
    };

    const [profile, setProfile] = useState(sampleUser);

    useEffect(() => {
        // Later connect backend
        setProfile(sampleUser);
    }, []);

    const initials = profile.name
        ? profile.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
        : 'U';

    /* ================= PREFERENCES STATE ================= */

    const [emailNotify, setEmailNotify] = useState(true);
    const [smsNotify, setSmsNotify] = useState(true);
    const [theme, setTheme] = useState('light');

    const saveAll = () => {
        console.log(profile, { emailNotify, smsNotify, theme });
        setIsEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    // Success message
    const [saveMessage, setSaveMessage] = useState(false);

    // Notification Preferences
    const [emailNotifications, setEmailNotifications] = useState({
        policyUpdates: true,
        claimStatus: true,
        paymentReminders: true,
        recommendations: false,
        marketing: false,
        newsletter: true,
    });

    const [smsNotifications, setSmsNotifications] = useState({
        claimApproval: true,
        paymentDue: true,
        emergencyAlerts: true,
        policyExpiry: true,
    });

    const [pushNotifications, setPushNotifications] = useState({
        enabled: true,
        claimUpdates: true,
        messages: true,
        promotions: false,
    });

    // Privacy Settings
    const [privacySettings, setPrivacySettings] = useState({
        profileVisibility: 'private',
        shareDataWithPartners: false,
        allowAnalytics: true,
        showOnlineStatus: false,
    });

    // Display Preferences
    const [displayPreferences, setDisplayPreferences] = useState({
        language: 'English',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        currency: 'USD',
        theme: 'light',
    });

    // Insurance Preferences
    const [insurancePreferences, setInsurancePreferences] = useState({
        interestedPolicies: ['Health', 'Auto', 'Life'],
        autoRenewal: true,
        paperlessBilling: true,
        preferredPaymentMethod: 'credit_card',
    });

    const policyTypes = ['Health', 'Auto', 'Home', 'Life', 'Travel', 'Business'];

    const handleSavePreferences = () => {
        setSaveMessage(true);
        setTimeout(() => setSaveMessage(false), 3000);
    };
    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeItem="Profile"
                userType="user"
            />

            <div className="lg:ml-64">
                <Navbar
                    setSidebarOpen={setSidebarOpen}
                    title="Profile"
                    userName={profile.name}
                    onLogout={() => navigate('/login')}
                />

                <main className="max-w-5xl mx-auto p-6 space-y-8">

                    {/* ================= TABS ================= */}
                    <div className="flex bg-white rounded-xl p-1 shadow">
                        {['profile', 'preferences'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2 rounded-lg font-medium transition ${activeTab === tab
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-600'
                                    }`}
                            >
                                {tab === 'profile' ? 'Profile' : 'Preferences'}
                            </button>
                        ))}
                    </div>

                    {saved && (
                        <div className="bg-green-100 text-green-800 p-3 rounded-lg">
                            Saved successfully!
                        </div>
                    )}

                    {/* ================= PROFILE ================= */}
                    {activeTab === 'profile' && (
                        <>
                            {/* Header Card */}
                            <div className="bg-white rounded-2xl shadow p-8 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                                        {initials}
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-bold">{profile.name}</h2>
                                        <p className="text-gray-600">{profile.email}</p>
                                        <p className="text-sm text-gray-500">
                                            {profile.occupation}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg flex items-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </button>
                            </div>

                            {/* Personal Info */}
                            <div className="bg-white p-8 rounded-2xl shadow space-y-6">
                                <h3 className="text-xl font-semibold">
                                    Personal Information
                                </h3>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <InputField
                                        label="Full Name"
                                        icon={<User />}
                                        value={profile.name}
                                        disabled={!isEditing}
                                        onChange={e =>
                                            setProfile({ ...profile, name: e.target.value })
                                        }
                                    />

                                    <InputField
                                        label="Email"
                                        icon={<Mail />}
                                        value={profile.email}
                                        disabled={!isEditing}
                                        onChange={e =>
                                            setProfile({ ...profile, email: e.target.value })
                                        }
                                    />

                                    <InputField
                                        label="Phone"
                                        icon={<Phone />}
                                        value={profile.phone}
                                        disabled={!isEditing}
                                        onChange={e =>
                                            setProfile({ ...profile, phone: e.target.value })
                                        }
                                    />

                                    <InputField
                                        label="Date of Birth"
                                        type="date"
                                        icon={<Calendar />}
                                        value={profile.dob}
                                        disabled={!isEditing}
                                        onChange={e =>
                                            setProfile({ ...profile, dob: e.target.value })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Address
                                    </label>
                                    <textarea
                                        disabled={!isEditing}
                                        value={profile.address}
                                        onChange={e =>
                                            setProfile({ ...profile, address: e.target.value })
                                        }
                                        className="w-full p-4 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                {isEditing && (
                                    <button
                                        onClick={saveAll}
                                        className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                    {/* ================= PREFERENCES ================= */}
                    {activeTab === 'preferences' && (
                        <div className="space-y-6">

                            {saveMessage && (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <p className="text-green-800 font-medium">
                                        Preferences saved successfully!
                                    </p>
                                </div>
                            )}

                            {/* Notification Preferences */}
                            <div className="bg-white p-6 rounded-2xl shadow">
                                <div className="flex items-center gap-3 mb-6">
                                    <Bell className="w-6 h-6 text-purple-600" />
                                    <h2 className="text-xl font-bold">Notification Preferences</h2>
                                </div>

                                {Object.entries(emailNotifications).map(([key, value]) => (
                                    <label key={key} className="flex justify-between mb-3">
                                        <span>
                                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={value}
                                            onChange={(e) =>
                                                setEmailNotifications({
                                                    ...emailNotifications,
                                                    [key]: e.target.checked,
                                                })
                                            }
                                        />
                                    </label>
                                ))}
                            </div>

                            {/* Privacy Settings */}
                            {/* ================= Privacy & Security ================= */}
                            <div className="bg-white p-6 rounded-2xl shadow space-y-6">

                                {/* Header */}
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Privacy & Security
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            Control your data and privacy settings
                                        </p>
                                    </div>
                                </div>

                                {/* Profile Visibility */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Profile Visibility
                                    </label>
                                    <select
                                        value={privacySettings.profileVisibility}
                                        onChange={(e) =>
                                            setPrivacySettings({
                                                ...privacySettings,
                                                profileVisibility: e.target.value,
                                            })
                                        }
                                        className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                        <option value="contacts">Contacts Only</option>
                                    </select>
                                </div>

                                {/* Share Data */}
                                <label className="flex items-start justify-between gap-4 cursor-pointer">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Share Data with Partners
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Allow us to share anonymized data with insurance partners
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={privacySettings.shareDataWithPartners}
                                        onChange={(e) =>
                                            setPrivacySettings({
                                                ...privacySettings,
                                                shareDataWithPartners: e.target.checked,
                                            })
                                        }
                                        className="w-5 h-5 mt-1 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                </label>

                                {/* Allow Analytics */}
                                <label className="flex items-start justify-between gap-4 cursor-pointer">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Allow Analytics
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Help us improve by collecting usage analytics
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={privacySettings.allowAnalytics}
                                        onChange={(e) =>
                                            setPrivacySettings({
                                                ...privacySettings,
                                                allowAnalytics: e.target.checked,
                                            })
                                        }
                                        className="w-5 h-5 mt-1 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                </label>

                                {/* Show Online Status */}
                                <label className="flex items-start justify-between gap-4 cursor-pointer">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Show Online Status
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Let others see when you're online
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={privacySettings.showOnlineStatus}
                                        onChange={(e) =>
                                            setPrivacySettings({
                                                ...privacySettings,
                                                showOnlineStatus: e.target.checked,
                                            })
                                        }
                                        className="w-5 h-5 mt-1 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                </label>

                            </div>
                            {/* Theme Selection */}
                            <div className="bg-white p-6 rounded-2xl shadow">
                                <div className="flex items-center gap-3 mb-6">
                                    <Palette className="w-6 h-6 text-green-600" />
                                    <h2 className="text-xl font-bold">Theme</h2>
                                </div>

                                <div className="flex gap-4">
                                    {['light', 'dark', 'auto'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() =>
                                                setDisplayPreferences({
                                                    ...displayPreferences,
                                                    theme: t,
                                                })
                                            }
                                            className={`px-6 py-2 rounded-lg border ${displayPreferences.theme === t
                                                ? 'bg-purple-600 text-white'
                                                : ''
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleSavePreferences}
                                className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium flex items-center justify-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                Save All Preferences
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

/* ================= REUSABLE INPUT ================= */

function InputField({ label, icon, value, onChange, disabled, type = 'text' }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-2">{label}</label>
            <div className="flex items-center border rounded-lg bg-gray-50 px-4">
                <span className="text-gray-400 mr-2">{icon}</span>
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className="w-full h-12 bg-transparent focus:outline-none"
                />
            </div>
        </div>
    );
}