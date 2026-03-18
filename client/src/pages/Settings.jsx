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
    DollarSign,

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



    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        dob: '',
        address: '',
        occupation: ''
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const detectTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        setDisplayPreferences((prev) => ({
            ...prev,
            timezone: detectTimezone || "UTC"
        }));
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/users/profile");
                const data = await response.json();

                setProfile({
                    name: data.name,
                    email: data.email || '',
                    phone: data.phone || '',
                    dob: data.dob || '',
                    address: data.address || '',
                    occupation: data.occupation || ''
                });

                if (data.preferences) {

                    // Notifications
                    if (data.preferences.notifications) {
                        setEmailNotifications(
                            data.preferences.notifications.email || emailNotifications
                        );

                        setSmsNotifications(
                            data.preferences.notifications.sms || smsNotifications
                        );

                        setPushNotifications(
                            data.preferences.notifications.push || pushNotifications
                        );
                    }

                    // Privacy
                    if (data.preferences.privacy) {
                        setPrivacySettings(data.preferences.privacy);
                    }

                    // Display
                    if (data.preferences.display) {
                        setDisplayPreferences(data.preferences.display);
                    }

                    if (data.preferences.insurance) {
                        setInsurancePreferences(data.preferences.insurance);
                    }
                }

            } catch (error) {
                console.error("Error loading profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);
    const initials = profile.name
        ? profile.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
        : 'U';

    /* ================= PREFERENCES STATE ================= */
    // ================= SAVE PROFILE =================

    const saveAll = async () => {
        try {
            await fetch("http://127.0.0.1:8000/users", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: profile.name,
                    phone: profile.phone,
                    address: profile.address,
                    occupation: profile.occupation,
                    dob: profile.dob
                })
            });
            // Apply theme after saving


            setIsEditing(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);

        } catch (error) {
            console.error("Error saving profile:", error);
        }
    };

    // ================= SUCCESS MESSAGE =================

    const [saveMessage, setSaveMessage] = useState(false);

    // ================= NOTIFICATION PREFERENCES =================

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

    // ================= PRIVACY =================

    const [privacySettings, setPrivacySettings] = useState({
        profileVisibility: 'private',
        shareDataWithPartners: false,
        allowAnalytics: true,
        showOnlineStatus: false,
    });

    // ================= DISPLAY =================

    const [displayPreferences, setDisplayPreferences] = useState({
        language: 'English',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        currency: 'USD',
        theme: 'light',

    });

    // ================= INSURANCE =================

    const [insurancePreferences, setInsurancePreferences] = useState({
        interestedPolicies: ['Health', 'Auto', 'Home', 'Life', 'Travel', 'Business'],
        autoRenewal: true,
        paperlessBilling: true,
        preferredPaymentMethod: 'credit_card',

        coverageAmount: '',
        premiumAmount: ''
    });

    // ================= SAVE PREFERENCES =================

    const handleSavePreferences = async () => {
        try {
            await fetch("http://127.0.0.1:8000/users/preferences", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    notifications: {
                        email: emailNotifications,
                        sms: smsNotifications,
                        push: pushNotifications
                    },
                    privacy: privacySettings,
                    display: displayPreferences,
                    insurance: insurancePreferences
                })
            });

            // save locally
            localStorage.setItem("appLanguage", displayPreferences.language);
            localStorage.setItem("appTheme", displayPreferences.theme);

            // apply theme
            document.documentElement.classList.remove("light", "dark");
            document.documentElement.classList.add(displayPreferences.theme);

            // apply language attribute
            document.documentElement.lang = displayPreferences.language;

            setSaveMessage(true);

        } catch (error) {
            console.error("Error saving preferences:", error);
        }
    };
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg font-medium">Loading profile...</p>
            </div>
        );
    }
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

                    {activeTab === 'preferences' && (
                        <div className="space-y-10">

                            {/* Page Header */}
                            <div className="flex items-center gap-3">
                                <Palette className="w-8 h-8 text-purple-600" />
                                <div>
                                    <h1 className="text-2xl font-bold">Preferences</h1>
                                    <p className="text-gray-600">
                                        Manage your account preferences and settings
                                    </p>
                                </div>
                            </div>

                            {saveMessage && (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <p className="text-green-800 font-medium">
                                        Preferences saved successfully!
                                    </p>
                                </div>
                            )}

                            {/* ================= NOTIFICATION PREFERENCES ================= */}
                            <div className="bg-white p-6 rounded-2xl shadow space-y-8">

                                <div className="flex items-center gap-3">
                                    <Bell className="w-6 h-6 text-indigo-600" />
                                    <div>
                                        <h2 className="text-xl font-bold">Notification Preferences</h2>
                                        <p className="text-gray-600 text-sm">
                                            Choose how you want to be notified
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Mail className="w-5 h-5 text-pink-500" />
                                        <h3 className="font-semibold">Email Notifications</h3>
                                    </div>

                                    {Object.entries(emailNotifications).map(([key, value]) => (
                                        <label key={key} className="flex justify-between items-center mb-2">
                                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                            <input
                                                type="checkbox"
                                                checked={value}
                                                onChange={(e) =>
                                                    setEmailNotifications({
                                                        ...emailNotifications,
                                                        [key]: e.target.checked
                                                    })
                                                }
                                            />
                                        </label>
                                    ))}
                                </div>

                                {/* SMS */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Smartphone className="w-5 h-5 text-blue-500" />
                                        <h3 className="font-semibold">SMS Notifications</h3>
                                    </div>

                                    {Object.entries(smsNotifications).map(([key, value]) => (
                                        <label key={key} className="flex justify-between items-center mb-2">
                                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                            <input
                                                type="checkbox"
                                                checked={value}
                                                onChange={(e) =>
                                                    setSmsNotifications({
                                                        ...smsNotifications,
                                                        [key]: e.target.checked
                                                    })
                                                }
                                            />
                                        </label>
                                    ))}
                                </div>

                                {/* Push */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <MessageSquare className="w-5 h-5 text-green-500" />
                                        <h3 className="font-semibold">Push Notifications</h3>
                                    </div>

                                    {Object.entries(pushNotifications).map(([key, value]) => (
                                        <label key={key} className="flex justify-between items-center mb-2">
                                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                            <input
                                                type="checkbox"
                                                checked={value}
                                                onChange={(e) =>
                                                    setPushNotifications({
                                                        ...pushNotifications,
                                                        [key]: e.target.checked
                                                    })
                                                }
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* ================= PRIVACY ================= */}
                            <div className="bg-white p-6 rounded-2xl shadow space-y-6">

                                <div className="flex items-center gap-3">
                                    <Shield className="w-6 h-6 text-red-500" />
                                    <div>
                                        <h2 className="text-xl font-bold">Privacy & Security</h2>
                                        <p className="text-gray-600 text-sm">
                                            Control your data and privacy settings
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium flex items-center gap-2">
                                        <Eye className="w-4 h-4 text-gray-500" />
                                        Profile Visibility
                                    </label>

                                    <select
                                        value={privacySettings.profileVisibility}
                                        onChange={(e) =>
                                            setPrivacySettings({
                                                ...privacySettings,
                                                profileVisibility: e.target.value
                                            })
                                        }
                                        className="w-full border rounded-lg px-4 py-2"
                                    >
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                        <option value="contacts">Contacts Only</option>
                                    </select>
                                </div>

                                {["shareDataWithPartners", "allowAnalytics", "showOnlineStatus"].map((key) => (
                                    <label key={key} className="flex justify-between items-center">
                                        <span className="capitalize flex items-center gap-2">
                                            <EyeOff className="w-4 h-4 text-gray-400" />
                                            {key.replace(/([A-Z])/g, ' $1')}
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={privacySettings[key]}
                                            onChange={(e) =>
                                                setPrivacySettings({
                                                    ...privacySettings,
                                                    [key]: e.target.checked
                                                })
                                            }
                                        />
                                    </label>
                                ))}
                            </div>

                            {/* ================= DISPLAY ================= */}
                            <div className="bg-white p-6 rounded-2xl shadow space-y-6">

                                <div className="flex items-center gap-3">
                                    <Globe className="w-6 h-6 text-teal-600" />
                                    <div>
                                        <h2 className="text-xl font-bold">Display Preferences</h2>
                                        <p className="text-gray-600 text-sm">
                                            Customize how information is displayed
                                        </p>
                                    </div>
                                </div>


                                {/* Language */}
                                <div>
                                    <label className="block mb-2 font-medium flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-blue-500" />
                                        Language
                                    </label>

                                    <select
                                        value={displayPreferences.language}
                                        onChange={(e) =>
                                            setDisplayPreferences({
                                                ...displayPreferences,
                                                language: e.target.value
                                            })
                                        }
                                        className="w-full border rounded-lg px-4 py-2"
                                    >
                                        <option value="en">English</option>
                                        <option value="hi">Hindi</option>
                                        <option value="te">Telugu</option>
                                    </select>
                                </div>

                                {/* Timezone */}
                                <div>
                                    <label className="block mb-2 font-medium flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-green-500" />
                                        Timezone
                                    </label>

                                    <select
                                        value={displayPreferences.timezone}
                                        onChange={(e) =>
                                            setDisplayPreferences({
                                                ...displayPreferences,
                                                timezone: e.target.value
                                            })
                                        }
                                        className="w-full border rounded-lg px-4 py-2"
                                    >
                                        <option value="Asia/Kolkata">India (IST)</option>
                                        <option value="UTC">UTC</option>
                                        <option value="Asia/Dubai">Dubai</option>
                                        <option value="Asia/Singapore">Singapore</option>
                                        <option value="Europe/London">London</option>
                                        <option value="America/New_York">New York</option>
                                        <option value="America/Los_Angeles">Los Angeles</option>
                                        <option value="Australia/Sydney">Sydney</option>
                                    </select>
                                </div>
                                {/* Date Format */}
                                <div>
                                    <label className="block mb-2 font-medium flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-purple-500" />
                                        Date Format
                                    </label>

                                    <select
                                        value={displayPreferences.dateFormat}
                                        onChange={(e) =>
                                            setDisplayPreferences({
                                                ...displayPreferences,
                                                dateFormat: e.target.value
                                            })
                                        }
                                        className="w-full border rounded-lg px-4 py-2"
                                    >
                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                    </select>
                                </div>
                                {/* Currency */}
                                <div>
                                    <label className="block mb-2 font-medium flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-yellow-500" />
                                        Currency
                                    </label>

                                    <select
                                        value={displayPreferences.currency}
                                        onChange={(e) =>
                                            setDisplayPreferences({
                                                ...displayPreferences,
                                                currency: e.target.value
                                            })
                                        }
                                        className="w-full border rounded-lg px-4 py-2"
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="INR">INR (₹)</option>
                                        <option value="EUR">EUR (€)</option>
                                    </select>
                                </div>


                                <div>
                                    <label className="block mb-2 font-medium">Theme</label>
                                    <div className="flex gap-4">
                                        {['light', 'dark', 'auto'].map(t => (
                                            <button
                                                key={t}
                                                onClick={() =>
                                                    setDisplayPreferences({
                                                        ...displayPreferences,
                                                        theme: t
                                                    })
                                                }
                                                className={`px-4 py-2 rounded-lg border ${displayPreferences.theme === t
                                                    ? 'bg-purple-600 text-white'
                                                    : ''
                                                    }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {/* ================= INSURANCE PREFERENCES ================= */}
                            < div className="bg-white p-6 rounded-2xl shadow space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold">Insurance Preferences</h2>
                                    <p className="text-gray-600 text-sm">
                                        Manage your insurance-related preferences
                                    </p>
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">
                                        Policy Types You're Interested In
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Health', 'Auto', 'Home', 'Life', 'Travel', 'Business'].map(type => (
                                            <label key={type} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={insurancePreferences.interestedPolicies.includes(type)}
                                                    onChange={(e) => {
                                                        const updated = e.target.checked
                                                            ? [...insurancePreferences.interestedPolicies, type]
                                                            : insurancePreferences.interestedPolicies.filter(t => t !== type);

                                                        setInsurancePreferences({
                                                            ...insurancePreferences,
                                                            interestedPolicies: updated
                                                        });
                                                    }}
                                                />
                                                {type}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {["autoRenewal", "paperlessBilling"].map((key) => (
                                    <label key={key} className="flex justify-between">
                                        <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                                        <input
                                            type="checkbox"
                                            checked={insurancePreferences[key]}
                                            onChange={(e) =>
                                                setInsurancePreferences({
                                                    ...insurancePreferences,
                                                    [key]: e.target.checked
                                                })
                                            }
                                        />
                                    </label>
                                ))}

                                <div>
                                    <label className="block mb-2 font-medium">
                                        Preferred Payment Method
                                    </label>
                                    <select
                                        value={insurancePreferences.preferredPaymentMethod}
                                        onChange={(e) =>
                                            setInsurancePreferences({
                                                ...insurancePreferences,
                                                preferredPaymentMethod: e.target.value
                                            })
                                        }
                                        className="w-full border rounded-lg px-4 py-2"
                                    >
                                        <option value="credit_card">Credit Card</option>
                                        <option value="debit_card">Debit Card</option>
                                        <option value="upi">UPI</option>
                                    </select>
                                </div>

                                {/* Coverage Amount */}
                                <div>
                                    <label className="block mb-2 font-medium">
                                        Coverage Amount
                                    </label>

                                    <select
                                        value={insurancePreferences.coverageAmount}
                                        onChange={(e) =>
                                            setInsurancePreferences({
                                                ...insurancePreferences,
                                                coverageAmount: e.target.value
                                            })
                                        }
                                        className="w-full border rounded-lg px-4 py-2"
                                    >
                                        <option value="">Select Coverage</option>
                                        <option value="100000">1 Lakh</option>
                                        <option value="300000">3 Lakhs</option>
                                        <option value="500000">5 Lakhs</option>
                                        <option value="1000000">10 Lakhs</option>
                                    </select>
                                </div>
                                {/* Premium Amount */}
                                {/* Premium Amount */}
                                <div>
                                    <label className="block mb-2 font-medium">
                                        Premium Amount
                                    </label>

                                    <select
                                        value={insurancePreferences.premiumAmount}
                                        onChange={(e) =>
                                            setInsurancePreferences({
                                                ...insurancePreferences,
                                                premiumAmount: e.target.value
                                            })
                                        }
                                        className="w-full border rounded-lg px-4 py-2"
                                    >
                                        <option value="">Select Premium</option>
                                        <option value="5000">₹5,000 / year</option>
                                        <option value="10000">₹10,000 / year</option>
                                        <option value="20000">₹20,000 / year</option>
                                        <option value="50000">₹50,000 / year</option>
                                    </select>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={handleSavePreferences}
                                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl py-3 font-medium"
                                >
                                    Save All Preferences
                                </button>

                                <button
                                    onClick={() => window.location.reload()}
                                    className="flex-1 border rounded-xl py-3 font-medium"
                                >
                                    Cancel
                                </button>
                            </div>

                        </div>
                    )
                    }
                </main >
            </div >
        </div >
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