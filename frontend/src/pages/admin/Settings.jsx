import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Percent, DollarSign, Calendar, Tag, Loader2 } from 'lucide-react';
import { createSettings, getSettings, updateSettings } from '../../api/dashboardApi';
import toast from 'react-hot-toast';


export default function SettingsData() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    deliveryFee: 0,
    taxRate: 0,
    promos: []
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getSettings();
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await updateSettings(settings);
      toast.success('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addPromo = () => {
    setSettings({
      ...settings,
      promos: [
        ...settings.promos,
        {
          code: '',
          type: 'percentage',
          value: 0,
          expiresAt: '',
          isActive: true
        }
      ]
    });
  };

  const removePromo = (index) => {
    const newPromos = settings.promos.filter((_, i) => i !== index);
    setSettings({ ...settings, promos: newPromos });
  };

  const updatePromo = (index, field, value) => {
    const newPromos = [...settings.promos];
    newPromos[index] = { ...newPromos[index], [field]: value };
    setSettings({ ...settings, promos: newPromos });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your store settings and promotional codes</p>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-6">General Settings</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Delivery Fee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Fee ($)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                step="0.01"
                value={settings.deliveryFee}
                onChange={(e) => setSettings({ ...settings, deliveryFee: parseFloat(e.target.value) || 0 })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Tax Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Rate (%)
            </label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                step="0.01"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Promotional Codes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800">Promotional Codes</h2>
          <button
            onClick={addPromo}
            className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Promo</span>
          </button>
        </div>

        {settings.promos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Tag className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No promotional codes yet. Click "Add Promo" to create one.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {settings.promos.map((promo, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Promo Code */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Code
                    </label>
                    <input
                      type="text"
                      value={promo.code}
                      onChange={(e) => updatePromo(index, 'code', e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                      placeholder="PROMO20"
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Type
                    </label>
                    <select
                      value={promo.type}
                      onChange={(e) => updatePromo(index, 'type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed</option>
                    </select>
                  </div>

                  {/* Value */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Value
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={promo.value}
                      onChange={(e) => updatePromo(index, 'value', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                      placeholder="0"
                    />
                  </div>

                  {/* Expires At */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Expires At
                    </label>
                    <input
                      type="date"
                      value={promo.expiresAt ? new Date(promo.expiresAt).toISOString().split('T')[0] : ''}
                      onChange={(e) => updatePromo(index, 'expiresAt', e.target.value ? new Date(e.target.value).toISOString() : '')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-end space-x-2">
                    <button
                      onClick={() => updatePromo(index, 'isActive', !promo.isActive)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        promo.isActive
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {promo.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => removePromo(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}