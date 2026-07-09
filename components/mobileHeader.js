"use client";

import { Bell, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MobileHeader({ initials = 'TB', hasNotification = false }) {
    const router = useRouter();

    const handleLogout = () => {
        // Add logout logic here if needed
        router.push('/login');
    };

    return (
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-black/5 sticky top-0 z-40">
            <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#1B4D2E] text-white">
                    <span className="text-sm font-bold">N</span>
                </div>
                <span className="font-bold text-[#161613]">Nsatitsi</span>
            </div>
            <div className="flex items-center gap-3">
                <button className="relative" aria-label="Notifications">
                    <Bell className="w-5 h-5 text-[#4b4b43]" />
                    {hasNotification && (
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500" />
                    )}
                </button>
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 text-xs font-bold flex items-center justify-center">
                    {initials}
                </div>
                <button 
                    onClick={handleLogout}
                    className="p-1.5 text-[#4b4b43] hover:text-[#b91c1c] transition"
                    aria-label="Logout"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}