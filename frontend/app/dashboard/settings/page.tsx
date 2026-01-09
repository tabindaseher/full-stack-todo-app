'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Button from '@/components/ui/Button';

const SettingsPage = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });

  const [theme, setTheme] = useState('light');

  const handleNotificationChange = (type: string) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type as keyof typeof prev]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

        <div className="space-y-8">
          {/* Notifications Settings */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <button
                  onClick={() => handleNotificationChange('email')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    notifications.email ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.email ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">Push Notifications</h3>
                  <p className="text-sm text-gray-600">Receive push notifications on your device</p>
                </div>
                <button
                  onClick={() => handleNotificationChange('push')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    notifications.push ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.push ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">SMS Notifications</h3>
                  <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                </div>
                <button
                  onClick={() => handleNotificationChange('sms')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    notifications.sms ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.sms ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Appearance</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Theme</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex-1 rounded-xl border-2 p-4 text-center transition-colors ${
                      theme === 'light'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-200'
                    }`}
                  >
                    <div className="mx-auto h-8 w-8 rounded-full bg-white border border-gray-300 mb-2"></div>
                    <span className="text-sm font-medium">Light</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 rounded-xl border-2 p-4 text-center transition-colors ${
                      theme === 'dark'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-200'
                    }`}
                  >
                    <div className="mx-auto h-8 w-8 rounded-full bg-gray-800 mb-2"></div>
                    <span className="text-sm font-medium">Dark</span>
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={`flex-1 rounded-xl border-2 p-4 text-center transition-colors ${
                      theme === 'system'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-200'
                    }`}
                  >
                    <div className="mx-auto h-8 w-8 rounded-full bg-gradient-to-r from-gray-600 to-gray-400 mb-2"></div>
                    <span className="text-sm font-medium">System</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Data Settings */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Data & Privacy</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl">
                Export Data
              </Button>
              <Button variant="outline" className="w-full justify-start border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl">
                Download Backup
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 rounded-xl">
                Delete All Data
              </Button>
            </div>
          </div>

          <div className="pt-4">
            <Button className="bg-purple-500 hover:bg-purple-600 text-white rounded-xl">
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;