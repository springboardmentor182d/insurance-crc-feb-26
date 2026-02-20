import React, { useState, useEffect } from 'react';
import Sidebar from '../layout/user/Sidebar';
import Toggle from '../components/Form/Toggle';
import Formselect from '../components/Form/Formselect';
import { getPreferences, updatePreferences } from '../features/preferences/services/preferencesService';

const Preferences = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [preferences, setPreferences] = useState({
    // Notification Channels
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    
    // Email Preferences
    policyRenewals: true,
    claimUpdates: true,
    promotionalEmails: false,
    weeklyDigest: true,
    
    // Security Settings
    twoFactorAuth: true,
    biometricLogin: false,
    sessionTimeout: '30',
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
          smsNotifications: data.sms_notifications ?? false,
          pushNotifications: data.push_notifications ?? true,
          policyRenewals: data.policy_renewals ?? true,
          claimUpdates: data.claim_updates ?? true,
          promotionalEmails: data.promotional_emails ?? false,
          weeklyDigest: data.weekly_digest ?? true,
          twoFactorAuth: data.two_factor_auth ?? true,
          biometricLogin: data.biometric_login ?? false,
          sessionTimeout: data.session_timeout || '30',
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
    setPreferences(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      setSaving(true);
      const payload = {
        email_notifications: preferences.emailNotifications,
        sms_notifications: preferences.smsNotifications,
        push_notifications: preferences.pushNotifications,
        policy_renewals: preferences.policyRenewals,
        claim_updates: preferences.claimUpdates,
        promotional_emails: preferences.promotionalEmails,
        weekly_digest: preferences.weeklyDigest,
        two_factor_auth: preferences.twoFactorAuth,
        biometric_login: preferences.biometricLogin,
        session_timeout: preferences.sessionTimeout,
      };

      await updatePreferences(payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  const sessionTimeoutOptions = [
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 hour' },
    { value: '120', label: '2 hours' },
    { value: '240', label: '4 hours' },
  ];

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
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
          {/* Header */}
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
            {/* Notification Channels Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-2xl">🔔</span>
                <h2 className="text-xl font-bold text-gray-900">Notification Channels</h2>
              </div>
              
              <div className="space-y-0">
                <Toggle
                  label="Email Notifications"
                  description="Receive updates via email"
                  name="emailNotifications"
                  checked={preferences.emailNotifications}
                  onChange={handleToggleChange}
                />
                <Toggle
                  label="SMS Notifications"
                  description="Receive text message alerts"
                  name="smsNotifications"
                  checked={preferences.smsNotifications}
                  onChange={handleToggleChange}
                />
                <Toggle
                  label="Push Notifications"
                  description="Get browser notifications"
                  name="pushNotifications"
                  checked={preferences.pushNotifications}
                  onChange={handleToggleChange}
                />
              </div>
            </div>

            {/* Email Preferences Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-2xl">✉️</span>
                <h2 className="text-xl font-bold text-gray-900">Email Preferences</h2>
              </div>
              
              <div className="space-y-0">
                <Toggle
                  label="Policy Renewals"
                  description="Reminders about upcoming renewals"
                  name="policyRenewals"
                  checked={preferences.policyRenewals}
                  onChange={handleToggleChange}
                />
                <Toggle
                  label="Claim Updates"
                  description="Status changes on your claims"
                  name="claimUpdates"
                  checked={preferences.claimUpdates}
                  onChange={handleToggleChange}
                />
                <Toggle
                  label="Promotional Emails"
                  description="Special offers and new products"
                  name="promotionalEmails"
                  checked={preferences.promotionalEmails}
                  onChange={handleToggleChange}
                />
                <Toggle
                  label="Weekly Digest"
                  description="Summary of your account activity"
                  name="weeklyDigest"
                  checked={preferences.weeklyDigest}
                  onChange={handleToggleChange}
                />
              </div>
            </div>

            {/* Security Settings Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-2xl">🛡️</span>
                <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
              </div>
              
              <div className="space-y-0 mb-6">
                <Toggle
                  label="Two-Factor Authentication"
                  description="Add an extra layer of security"
                  name="twoFactorAuth"
                  checked={preferences.twoFactorAuth}
                  onChange={handleToggleChange}
                />
                <Toggle
                  label="Biometric Login"
                  description="Use fingerprint or face ID"
                  name="biometricLogin"
                  checked={preferences.biometricLogin}
                  onChange={handleToggleChange}
                />
              </div>

              {/* Session Timeout Dropdown */}
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

            {/* Save Button */}
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
