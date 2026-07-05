"use client";

import { useState } from 'react';
import { Plus, FileText, BookOpen, ChevronRight, Users, Package, Download, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import UploadMaterialModal from '@/components/uploadMaterial';

const stats = [
    {
        label: 'Total Students',
        value: '4,218',
        change: '+127 this month',
        icon: Users,
        iconBg: 'bg-[#f0f4ff]',
        iconColor: 'text-blue-600',
        trend: 'up',
    },
    {
        label: 'Materials Hosted',
        value: '1,840',
        change: '+36 this month',
        icon: Package,
        iconBg: 'bg-[#f5f0ff]',
        iconColor: 'text-purple-600',
        trend: 'up',
    },
    {
        label: 'Downloads Today',
        value: '324',
        change: '+24% vs yesterday',
        icon: Download,
        iconBg: 'bg-green-50',
        iconColor: 'text-[#1B4D2E]',
        trend: 'up',
    },
    {
        label: 'Active This Week',
        value: '1,107',
        change: '-3% vs last week',
        icon: Activity,
        iconBg: 'bg-[#fff7ed]',
        iconColor: 'text-orange-600',
        trend: 'down',
    },
];

const recentUploads = [
    {
        title: 'MANEB MSCE Mathematics Paper 1 — 2023',
        meta: 'Mathematics · Form 4 · 2.4 MB',
        date: '10 Jun 2025',
        icon: FileText,
        iconBg: 'bg-[#fffbeb]',
        iconColor: 'text-[#f59e0b]',
    },
    {
        title: 'Mathematics for Senior Secondary — Form 3',
        meta: 'Mathematics · Form 3 · 14.2 MB',
        date: '8 Jun 2025',
        icon: BookOpen,
        iconBg: 'bg-[#f5f3ff]',
        iconColor: 'text-[#8b5cf6]',
    },
    {
        title: 'Biology Form 3 Textbook',
        meta: 'Biology · Form 3 · 9.8 MB',
        date: '5 Jun 2025',
        icon: BookOpen,
        iconBg: 'bg-[#f5f3ff]',
        iconColor: 'text-[#8b5cf6]',
    },
    {
        title: 'MANEB MSCE Biology 2022',
        meta: 'Biology · Form 4 · 1.8 MB',
        date: '3 Jun 2025',
        icon: FileText,
        iconBg: 'bg-[#fffbeb]',
        iconColor: 'text-[#f59e0b]',
    },
];

const newRegistrations = [
    {
        name: 'Chimwemwe Banda',
        meta: 'St. Patrick\'s Secondary · Form 3 · Blantyre',
        date: '12 Jun 2025',
        initials: 'CB',
        active: true,
    },
    {
        name: 'Takondwa Phiri',
        meta: 'Kamuzu Academy · Form 4 · Kasungu',
        date: '8 Jun 2025',
        initials: 'TP',
    },
    {
        name: 'Madalitso Chirwa',
        meta: 'Chichiri Secondary · Form 2 · Blantyre',
        date: '3 Jun 2025',
        initials: 'MC',
    },
    {
        name: 'Kondwani Mwale',
        meta: 'Zomba Catholic · Form 1 · Zomba',
        date: '1 Jun 2025',
        initials: 'KM',
    },
];

export default function AdminHome() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="px-4 md:px-10 py-5 md:py-8 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#161613]">Overview</h1>
                    <p className="text-[#9a9a90] mt-1">Thursday, 26 June 2025</p>
                </div>
            </div>

            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                    <AdminStatCard key={stat.label} {...stat} />
                ))}
            </div>

            <div className="mb-8">
                <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="w-full bg-white border border-black/10 rounded-[2rem] p-8 md:p-12 flex flex-col items-center justify-center gap-6 group hover:border-green-600/30 hover:shadow-xl hover:shadow-green-900/[0.02] transition-all"
                >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Plus className="w-8 h-8 md:w-10 md:h-10 text-[#1B4D2E]" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#161613]">Upload Material</h2>
                        <p className="text-[#9a9a90] mt-2 text-sm md:text-base max-w-sm">
                            Add new past papers, textbooks, or study guides to the library for students to access.
                        </p>
                    </div>
                </button>
            </div>

            <UploadMaterialModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onUploaded={() => {
                    // Hook point: refresh recent uploads when backend list API is connected.
                }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section className="bg-white border border-black/10 rounded-3xl overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-black/5">
                        <h2 className="text-lg font-bold text-[#161613]">Recent Uploads</h2>
                        <a href="#" className="flex items-center gap-1 text-sm font-medium text-[#1B4D2E] hover:opacity-80">
                            View all <ChevronRight className="w-4 h-4" />
                        </a>
                    </div>
                    <div className="divide-y divide-black/5">
                        {recentUploads.map((upload, i) => (
                            <div key={i} className="flex items-center gap-4 p-5 hover:bg-black/[0.01] transition-colors">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${upload.iconBg}`}>
                                    <upload.icon className={`w-5 h-5 ${upload.iconColor}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-[#161613] text-sm md:text-base truncate">{upload.title}</p>
                                    <p className="text-xs text-[#9a9a90] mt-0.5">{upload.meta}</p>
                                </div>
                                <div className="text-xs text-[#9a9a90] shrink-0 font-medium">
                                    {upload.date}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-white border border-black/10 rounded-3xl overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-black/5">
                        <h2 className="text-lg font-bold text-[#161613]">New Registrations</h2>
                        <a href="#" className="flex items-center gap-1 text-sm font-medium text-[#1B4D2E] hover:opacity-80">
                            View all <ChevronRight className="w-4 h-4" />
                        </a>
                    </div>
                    <div className="divide-y divide-black/5">
                        {newRegistrations.map((reg, i) => (
                            <div key={i} className="flex items-center gap-4 p-5 hover:bg-black/[0.01] transition-colors">
                                <div className="w-10 h-10 rounded-full bg-[#1B4D2E] flex items-center justify-center shrink-0 text-white text-xs font-bold">
                                    {reg.initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-[#161613] text-sm md:text-base truncate">{reg.name}</p>
                                    <p className="text-xs text-[#9a9a90] mt-0.5">{reg.meta}</p>
                                </div>
                                <div className={`text-xs shrink-0 font-medium ${reg.active ? 'text-[#1B4D2E]' : 'text-[#9a9a90]'}`}>
                                    {reg.date}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

function AdminStatCard({ label, value, change, icon: Icon, iconBg, iconColor, trend }) {
    const isUp = trend === 'up';
    return (
        <div className="bg-white border border-black/10 rounded-3xl p-6 flex flex-col justify-between h-full">
            <div className="flex items-start justify-between mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div className="flex items-center gap-0.5">
                    {isUp ? (
                        <>
                            <ArrowUpRight className="w-4 h-4 text-[#1B4D2E]" />
                            <ArrowUpRight className="w-4 h-4 text-[#1B4D2E] -ml-2" />
                        </>
                    ) : (
                        <>
                            <ArrowDownRight className="w-4 h-4 text-red-600" />
                            <ArrowDownRight className="w-4 h-4 text-red-600 -ml-2" />
                        </>
                    )}
                </div>
            </div>
            <div>
                <p className="text-3xl font-bold text-[#161613]">{value}</p>
                <p className="text-sm font-semibold text-[#161613] mt-1">{label}</p>
                <p className="text-xs text-[#9a9a90] mt-1">{change}</p>
            </div>
        </div>
    );
}
