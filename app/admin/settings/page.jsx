"use client";

import { useState } from 'react';
import { 
    Settings, 
    Globe, 
    Shield, 
    Bell, 
    Database, 
    Users, 
    Save, 
    AlertTriangle,
    CheckCircle2,
    Monitor,
    Lock
} from 'lucide-react';

function SectionHeader({ icon: Icon, title, description }) {
    return (
        <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#1B4D2E]/5 text-[#1B4D2E] flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h2 className="text-lg font-bold text-[#161613]">{title}</h2>
                <p className="text-sm text-[#9a9a90]">{description}</p>
            </div>
        </div>
    );
}

export default function AdminSettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate save
        setTimeout(() => {
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }, 1000);
    };

    return (
        <div className="px-4 md:px-10 py-5 md:py-8 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#161613]">Settings</h1>
                    <p className="text-[#9a9a90] text-sm">Manage your platform configuration and preferences</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1B4D2E] rounded-xl text-sm font-semibold text-white hover:bg-[#1B4D2E]/90 transition-all shadow-sm disabled:opacity-70"
                >
                    {isSaving ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {saveSuccess ? "Settings Saved" : "Save Changes"}
                </button>
            </div>

            <div className="space-y-6">
                {/* General Settings */}
                <div className="bg-white rounded-3xl border border-black/5 p-6 md:p-8 shadow-sm">
                    <SectionHeader 
                        icon={Globe} 
                        title="General Platform" 
                        description="Basic settings for your digital library application" 
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#4b4b43] ml-1">Platform Name</label>
                            <input 
                                type="text" 
                                defaultValue="Nsatitsi Digital Library"
                                className="w-full px-4 py-3 bg-black/5 border border-transparent focus:border-[#1B4D2E]/20 focus:bg-white rounded-2xl text-sm transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#4b4b43] ml-1">Contact Email</label>
                            <input 
                                type="email" 
                                defaultValue="admin@nsatitsi.mw"
                                className="w-full px-4 py-3 bg-black/5 border border-transparent focus:border-[#1B4D2E]/20 focus:bg-white rounded-2xl text-sm transition-all outline-none"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-4 pt-2">
                            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                                    <div>
                                        <p className="text-sm font-bold text-orange-900">Maintenance Mode</p>
                                        <p className="text-xs text-orange-700">Prevent students from accessing the platform</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-orange-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User & Enrollment Settings */}
                <div className="bg-white rounded-3xl border border-black/5 p-6 md:p-8 shadow-sm">
                    <SectionHeader 
                        icon={Users} 
                        title="Students & Access" 
                        description="Manage how students register and interact with content" 
                    />
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="text-sm font-bold text-[#161613]">Automatic Student Approval</p>
                                <p className="text-xs text-[#9a9a90]">New accounts are active immediately after registration</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-black/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B4D2E]"></div>
                            </label>
                        </div>
                        <div className="border-t border-black/5 my-2"></div>
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="text-sm font-bold text-[#161613]">Download Restrictions</p>
                                <p className="text-xs text-[#9a9a90]">Limit number of downloads per student per day</p>
                            </div>
                            <select className="bg-black/5 border-none rounded-xl text-xs font-bold px-3 py-2 outline-none">
                                <option>Unlimited</option>
                                <option>10 per day</option>
                                <option>50 per day</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Integration & Storage */}
                <div className="bg-white rounded-3xl border border-black/5 p-6 md:p-8 shadow-sm">
                    <SectionHeader 
                        icon={Database} 
                        title="Storage & Integration" 
                        description="External services and file hosting configuration" 
                    />
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 mb-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-bold text-blue-900">Mega.nz Storage Connected</p>
                                <p className="text-xs text-blue-700">Current usage: 4.2GB / 50GB (8.4%)</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#4b4b43] ml-1">Mega.nz Email</label>
                            <input 
                                type="text" 
                                readOnly
                                value="storage@nsatitsi.mw"
                                className="w-full px-4 py-3 bg-black/5 border border-transparent rounded-2xl text-sm text-[#9a9a90]"
                            />
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-3xl border border-black/5 p-6 md:p-8 shadow-sm">
                    <SectionHeader 
                        icon={Shield} 
                        title="Security & Admin" 
                        description="Secure your administrative access" 
                    />
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 p-4 bg-[#f8f9f8] hover:bg-black/5 border border-black/5 rounded-2xl transition-colors">
                                <Lock className="w-4 h-4 text-[#1B4D2E]" />
                                <span className="text-sm font-bold">Change Password</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 p-4 bg-[#f8f9f8] hover:bg-black/5 border border-black/5 rounded-2xl transition-colors">
                                <Monitor className="w-4 h-4 text-[#1B4D2E]" />
                                <span className="text-sm font-bold">Session Logs</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-12 p-6 md:p-8 bg-red-50 rounded-3xl border border-red-100">
                <h3 className="text-red-900 font-bold mb-2">Danger Zone</h3>
                <p className="text-red-700 text-sm mb-6">Irreversible actions that affect the entire platform data.</p>
                <div className="flex flex-wrap gap-4">
                    <button className="px-5 py-2.5 bg-white border border-red-200 text-red-600 text-sm font-bold rounded-xl hover:bg-red-50 transition-colors">
                        Clear System Cache
                    </button>
                    <button className="px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-colors shadow-sm shadow-red-200">
                        Reset All Statistics
                    </button>
                </div>
            </div>
        </div>
    );
}
