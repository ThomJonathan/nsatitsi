"use client";

import { User, Shield, Bell, Lock, LogOut, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();

    const userData = {
        name: "Chimwemwe Banda",
        email: "chimwemwe@school.mw",
        form: "Form 3 · Senior Secondary",
        school: "St. Patrick's Secondary School",
        district: "Blantyre",
        phone: "+265 999 111 222",
        gender: "Male",
        initials: "CB"
    };

    const handleSignOut = () => {
        router.push('/login');
    };

    return (
        <div className="px-4 md:px-10 py-5 md:py-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-[#161613] mb-6">My Profile</h1>

            {/* Profile Card */}
            <div className="bg-white rounded-3xl border border-black/5 p-6 md:p-8 shadow-sm mb-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-[#1B4D2E] text-white flex items-center justify-center text-2xl font-bold shrink-0">
                        {userData.initials}
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-[#161613]">{userData.name}</h2>
                        <p className="text-[#9a9a90] text-sm mb-2">{userData.email}</p>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#1B4D2E] text-white text-xs font-medium">
                            {userData.form}
                        </span>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <InfoField label="School" value={userData.school} />
                    <InfoField label="District" value={userData.district} />
                    <InfoField label="Phone" value={userData.phone} />
                    <InfoField label="Gender" value={userData.gender} />
                </div>

                <button className="w-full py-3 px-4 border border-black/10 rounded-2xl text-sm font-medium text-[#4b4b43] hover:bg-black/5 transition-colors">
                    Edit Profile
                </button>
            </div>

            {/* Settings Actions */}
            <div className="bg-white rounded-3xl border border-black/5 overflow-hidden shadow-sm">
                <ActionItem icon={Lock} label="Change Password" />
                <ActionItem icon={Bell} label="Notifications" />
                <ActionItem icon={Shield} label="Privacy & Security" />
                <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-4 px-6 py-4 hover:bg-red-50 transition-colors group border-t border-black/5"
                >
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                        <LogOut className="w-5 h-5" />
                    </div>
                    <span className="flex-1 text-left text-sm font-semibold text-red-600">Sign Out</span>
                </button>
            </div>
        </div>
    );
}

function InfoField({ label, value }) {
    return (
        <div className="bg-[#f1f3f1] p-4 rounded-2xl">
            <p className="text-[10px] uppercase tracking-wider font-bold text-[#9a9a90] mb-1">{label}</p>
            <p className="text-[#161613] font-medium">{value}</p>
        </div>
    );
}

function ActionItem({ icon: Icon, label }) {
    return (
        <button className="w-full flex items-center gap-4 px-6 py-4 hover:bg-black/5 transition-colors group border-b border-black/5 last:border-b-0">
            <div className="w-10 h-10 rounded-xl bg-black/5 text-[#4b4b43] flex items-center justify-center shrink-0 group-hover:bg-black/10 transition-colors">
                <Icon className="w-5 h-5" />
            </div>
            <span className="flex-1 text-left text-sm font-semibold text-[#161613]">{label}</span>
            <ChevronRight className="w-5 h-5 text-[#9a9a90]" />
        </button>
    );
}
