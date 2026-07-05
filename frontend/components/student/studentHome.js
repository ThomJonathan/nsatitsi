"use client";

import { Search, Download, Bookmark, BookOpen, FileText, Bell } from 'lucide-react';

const subjects = [
    { code: 'MA', name: 'Mathematics', color: 'bg-blue-50 text-blue-600' },
    { code: 'EN', name: 'English', color: 'bg-purple-50 text-purple-600' },
    { code: 'BI', name: 'Biology', color: 'bg-green-50 text-green-700' },
    { code: 'CH', name: 'Chemistry', color: 'bg-orange-50 text-orange-600' },
    { code: 'PH', name: 'Physics', color: 'bg-sky-50 text-sky-600' },
    { code: 'HI', name: 'History', color: 'bg-amber-50 text-amber-600' },
    { code: 'GE', name: 'Geography', color: 'bg-emerald-50 text-emerald-600' },
    { code: 'AG', name: 'Agriculture', color: 'bg-lime-50 text-lime-700' },
    { code: 'BS', name: 'Business Studies', color: 'bg-violet-50 text-violet-600' },
];

const trending = [
    {
        title: 'Mathematics MSCE 2023 Past Paper',
        meta: 'Mathematics · Form 4 · 2023',
        tag: 'Answers',
        downloads: 3241,
        icon: FileText,
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
    },
    {
        title: 'Biology Form 4 Textbook',
        meta: 'Biology · Form 4',
        downloads: 2108,
        bookmarked: true,
        icon: BookOpen,
        iconBg: 'bg-green-50',
        iconColor: 'text-green-700',
    },
    {
        title: 'English Language MSCE 2022',
        meta: 'English · Form 4 · 2022',
        tag: 'Answers',
        downloads: 1987,
        icon: FileText,
        iconBg: 'bg-purple-50',
        iconColor: 'text-purple-600',
    },
];

export default function StudentHome({ name = 'Thandizo', form = 'Form 3', school = 'Kamuzu Academy' }) {
    return (
        <div className="px-4 md:px-10 py-5 md:py-8 max-w-6xl">
            {/* Greeting + bell (bell here is desktop-only; mobile bell lives in MobileHeader) */}
            <div className="flex items-start justify-between mb-5">
                <div>
                    <p className="text-[#9a9a90] text-sm md:text-base">Good morning,</p>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#161613] flex items-center gap-2">
                        {name} <span>👋</span>
                    </h1>
                    <p className="text-[#6b6b63] text-sm md:text-base mt-1">
                        {form} · {school}
                    </p>
                </div>
                <button className="hidden md:flex relative w-10 h-10 rounded-full bg-white border border-black/5 items-center justify-center" aria-label="Notifications">
                    <Bell className="w-5 h-5 text-[#4b4b43]" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-green-500" />
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-5">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4b4b43]" />
                <input
                    type="text"
                    placeholder="Search books, past papers, subjects..."
                    className="w-full bg-white border border-black/15 rounded-2xl pl-11 pr-4 py-3.5 text-sm placeholder:text-[#6b6b63] text-[#161613] focus:outline-none focus:ring-2 focus:ring-[#1B4D2E]/30"
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-7">
                <StatCard icon={Download} value={24} label="Downloads" iconBg="bg-blue-50" iconColor="text-blue-600" />
                <StatCard icon={Bookmark} value={2} label="Bookmarks" iconBg="bg-green-50" iconColor="text-green-700" />
                <StatCard icon={BookOpen} value={9} label="Subjects" iconBg="bg-purple-50" iconColor="text-purple-600" />
            </div>

            {/* Browse by subject */}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold tracking-wide text-[#161613]">BROWSE BY SUBJECT</h2>
                <span className="text-xs md:text-sm text-[#9a9a90]">Senior Secondary</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {subjects.map((s) => (
                    <button
                        key={s.code}
                        className="flex items-center gap-2 md:gap-3 bg-white border border-black/15 rounded-2xl px-3 md:px-4 py-3 md:py-3.5 hover:border-[#1B4D2E]/30 hover:shadow-sm transition-all text-left"
                    >
                        <span className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold shrink-0 ${s.color}`}>
                            {s.code}
                        </span>
                        <span className="text-xs md:text-[15px] font-medium text-[#161613] truncate">{s.name}</span>
                    </button>
                ))}
            </div>

            {/* Trending */}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold tracking-wide text-[#161613]">TRENDING</h2>
                <a href="#" className="text-sm font-medium text-[#1B4D2E]">See all</a>
            </div>
            <div className="flex flex-col gap-3 pb-6">
                {trending.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.title} className="flex items-center gap-3 md:gap-4 bg-white border border-black/15 rounded-2xl px-3 md:px-4 py-3 md:py-4">
                            <span className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                                <Icon className={`w-4 h-4 md:w-5 md:h-5 ${item.iconColor}`} />
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-[#161613] text-sm md:text-base truncate">{item.title}</p>
                                <p className="text-[11px] md:text-sm text-[#9a9a90] mt-0.5 flex items-center gap-2 flex-wrap">
                                    {item.meta}
                                    {item.tag && (
                                        <span className="text-[#1B4D2E] bg-green-50 px-2 py-0.5 rounded-full text-[10px] md:text-[11px] font-medium">
                                            {item.tag}
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="hidden sm:flex items-center gap-3 shrink-0 text-[#9a9a90]">
                                <Bookmark className={`w-4 h-4 ${item.bookmarked ? 'fill-[#1B4D2E] text-[#1B4D2E]' : ''}`} />
                                <span className="flex items-center gap-1 text-xs md:text-sm">
                                    <Download className="w-3.5 h-3.5" />
                                    {item.downloads.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, value, label, iconBg, iconColor }) {
    return (
        <div className="bg-white border border-black/15 rounded-2xl px-2 py-3 md:px-5 md:py-5 flex flex-col gap-1.5 md:gap-2">
            <span className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center ${iconBg}`}>
                <Icon className={`w-3.5 h-3.5 md:w-4 h-4 ${iconColor}`} />
            </span>
            <div>
                <p className="text-lg md:text-2xl font-bold text-[#161613]">{value}</p>
                <p className="text-[10px] md:text-sm text-[#9a9a90] leading-tight">{label}</p>
            </div>
        </div>
    );
}