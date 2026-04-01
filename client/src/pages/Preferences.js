import React, { useState, useEffect } from 'react';
import Sidebar from '../layout/user/Sidebar';
import Toggle from '../components/Form/Toggle';
import Formselect from '../components/Form/Formselect';
import { getPreferences, updatePreferences } from '../features/preferences/services/preferencesService';
// ── NEW ───────────────────────────────────────────────────────────────────────
import { useTheme } from '../context/ThemeContext';

const Preferences = () => {
  // ── NEW ─────────────────────────────────────────────────────────────────────
  const { theme, toggleTheme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications:   false,
    pushNotifications:  true,
    policyRenewals:     true,
    claimUpdates:       true,
    promotionalEmails:  false,
    weeklyDigest:       true,
    twoFactorAuth:      true,
    biometricLogin:     false,
    sessionTimeout:     '30',
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const data = await getPreferences();
      if (data) {
        setPreferences({
          emailNotifications: data.email_notifications ?? true,
          smsNotifications:   data.sms_notifications   ?? false,
          pushNotifications:  data.push_notifications  ?? true,
          policyRenewals:     data.policy_renewals      ?? true,
          claimUpdates:       data.claim_updates        ?? true,
          promotionalEmails:  data.promotional_emails   ?? false,
          weeklyDigest:       data.weekly_digest        ?? true,
          twoFactorAuth:      data.two_factor_auth      ?? true,
          biometricLogin:     data.biometric_login      ?? false,
          sessionTimeout:     data.session_timeout      || '30',
        });
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChange = (e) => {
    const { name, checked } = e.target;
    setPreferences(prev => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      setSaving(true);
      await updatePreferences({
        email_notifications: preferences.emailNotifications,
        sms_notifications:   preferences.smsNotifications,
        push_notifications:  preferences.pushNotifications,
        policy_renewals:     preferences.policyRenewals,
        claim_updates:       preferences.claimUpdates,
        promotional_emails:  preferences.promotionalEmails,
        weekly_digest:       preferences.weeklyDigest,
        two_factor_auth:     preferences.twoFactorAuth,
        biometric_login:     preferences.biometricLogin,
        session_timeout:     preferences.sessionTimeout,
        theme:               theme, // ── NEW: persist current theme ───────────
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  const sessionTimeoutOptions = [
    { value: '15',  label: '15 minutes' },
    { value: '30',  label: '30 minutes' },
    { value: '60',  label: '1 hour'     },
    { value: '120', label: '2 hours'    },
    { value: '240', label: '4 hours'    },
  ];

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading preferences...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">

          {/* Header — unchanged */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Preferences</h1>
            <p className="text-gray-600">Customize your experience and notifications</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              Preferences updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* ── NEW: Appearance Section ───────────────────────────────── */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">🎨</span>
                <h2 className="text-xl font-bold text-gray-900">Appearance</h2>
              </div>
              <p className="text-sm text-gray-500 mb-5">
                Choose how BimaVerse looks. Changes apply instantly.
              </p>

              <div className="flex gap-4">
                {/* Light */}
                <button
                  type="button"
                  onClick={() => toggleTheme('light')}
                  className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    theme === 'light'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="w-full h-20 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex">
                    <div className="w-8 h-full bg-white border-r border-gray-200" />
                    <div className="flex-1 p-2 flex flex-col gap-1">
                      <div className="h-2 w-3/4 bg-gray-300 rounded" />
                      <div className="h-2 w-1/2 bg-gray-200 rounded" />
                      <div className="h-6 w-full bg-white rounded mt-1 border border-gray-200" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>☀️</span>
                    <span className={`text-sm font-semibold ${theme === 'light' ? 'text-blue-600' : 'text-gray-700'}`}>
                      Light
                    </span>
                    {theme === 'light' && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                        Active
                      </span>
                    )}
                  </div>
                </button>

                {/* Dark */}
                <button
                  type="button"
                  onClick={() => toggleTheme('dark')}
                  className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    theme === 'dark'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="w-full h-20 rounded-lg bg-gray-900 border border-gray-700 overflow-hidden flex">
                    <div className="w-8 h-full bg-gray-800 border-r border-gray-700" />
                    <div className="flex-1 p-2 flex flex-col gap-1">
                      <div className="h-2 w-3/4 bg-gray-600 rounded" />
                      <div className="h-2 w-1/2 bg-gray-700 rounded" />
                      <div className="h-6 w-full bg-gray-800 rounded mt-1 border border-gray-700" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🌙</span>
                    <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-blue-600' : 'text-gray-700'}`}>
                      Dark
                    </span>
                    {theme === 'dark' && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                        Active
                      </span>
                    )}
                  </div>
                </button>
              </div>
            </div>
            {/* ── END NEW ───────────────────────────────────────────────── */}

            {/* Notification Channels — unchanged */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-2xl">🔔</span>
                <h2 className="text-xl font-bold text-gray-900">Notification Channels</h2>
              </div>
              <div className="space-y-0">
                <Toggle label="Email Notifications" description="Receive updates via email"       name="emailNotifications" checked={preferences.emailNotifications} onChange={handleToggleChange} />
                <Toggle label="SMS Notifications"   description="Receive text message alerts"     name="smsNotifications"   checked={preferences.smsNotifications}   onChange={handleToggleChange} />
                <Toggle label="Push Notifications"  description="Get browser notifications"       name="pushNotifications"  checked={preferences.pushNotifications}  onChange={handleToggleChange} />
              </div>
            </div>

            {/* Email Preferences — unchanged */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-2xl">✉️</span>
                <h2 className="text-xl font-bold text-gray-900">Email Preferences</h2>
              </div>
              <div className="space-y-0">
                <Toggle label="Policy Renewals"    description="Reminders about upcoming renewals"  name="policyRenewals"    checked={preferences.policyRenewals}    onChange={handleToggleChange} />
                <Toggle label="Claim Updates"      description="Status changes on your claims"      name="claimUpdates"      checked={preferences.claimUpdates}      onChange={handleToggleChange} />
                <Toggle label="Promotional Emails" description="Special offers and new products"    name="promotionalEmails" checked={preferences.promotionalEmails}  onChange={handleToggleChange} />
                <Toggle label="Weekly Digest"      description="Summary of your account activity"   name="weeklyDigest"      checked={preferences.weeklyDigest}      onChange={handleToggleChange} />
              </div>
            </div>

            {/* Security Settings — unchanged */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-2xl">🛡️</span>
                <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
              </div>
              <div className="space-y-0 mb-6">
                <Toggle label="Two-Factor Authentication" description="Add an extra layer of security" name="twoFactorAuth"  checked={preferences.twoFactorAuth}  onChange={handleToggleChange} />
                <Toggle label="Biometric Login"           description="Use fingerprint or face ID"     name="biometricLogin" checked={preferences.biometricLogin} onChange={handleToggleChange} />
              </div>
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Session Timeout
                </label>
                <Formselect
                  name="sessionTimeout"
                  value={preferences.sessionTimeout}
                  onChange={handleSelectChange}
                  options={sessionTimeoutOptions}
                  className="max-w-xs"
                />
              </div>
            </div>

            {/* Save Button — unchanged */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <span>💾</span>
                <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Preferences;