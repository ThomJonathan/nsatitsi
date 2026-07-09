"use client";

import { Download, Users, Package, TrendingUp, FileText, BookOpen, DownloadCloud } from 'lucide-react';

const STATS = [
    {
        title: "Total Downloads",
        value: "18,420",
        subtitle: "All time",
        icon: Download,
        color: "text-blue-600",
        bg: "bg-blue-50"
    },
    {
        title: "Registered Students",
        value: "4,218",
        subtitle: "+127 this month",
        icon: Users,
        color: "text-emerald-600",
        bg: "bg-emerald-50"
    },
    {
        title: "Materials Hosted",
        value: "1,840",
        subtitle: "Books + Papers",
        icon: Package,
        color: "text-orange-600",
        bg: "bg-orange-50"
    },
    {
        title: "Avg. Downloads / User",
        value: "4.4",
        subtitle: "Per active user",
        icon: TrendingUp,
        color: "text-purple-600",
        bg: "bg-purple-50"
    }
];

const TOP_MATERIALS = [
    {
        id: 1,
        title: "MANEB MSCE Biology 2022",
        category: "Biology · Form 4",
        downloads: "3,210",
        progress: 95,
        type: "paper"
    },
    {
        id: 2,
        title: "MANEB MSCE Mathematics Paper 1 — 2023",
        category: "Mathematics · Form 4",
        downloads: "2,840",
        progress: 85,
        type: "paper"
    },
    {
        id: 3,
        title: "Mathematics for Senior Secondary — Form 3",
        category: "Mathematics · Form 3",
        downloads: "1,920",
        progress: 65,
        type: "book"
    },
    {
        id: 4,
        title: "Biology Form 3 Textbook",
        category: "Biology · Form 3",
        downloads: "1,540",
        progress: 55,
        type: "book"
    },
    {
        id: 5,
        title: "English Grammar Essentials",
        category: "English · Form 1-4",
        downloads: "1,200",
        progress: 45,
        type: "book"
    }
];

export default function AnalyticsPage() {
    return (
        <div className="px-4 md:px-10 py-5 md:py-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#161613]">Analytics & Reports</h1>
                    <p className="text-[#9a9a90] text-sm">Platform-wide usage statistics</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-black/10 rounded-xl text-sm font-semibold text-[#161613] hover:bg-black/5 transition-colors shadow-sm self-start md:self-auto">
                    <DownloadCloud className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {STATS.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
                        <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#161613]">{stat.value}</h3>
                        <p className="text-sm font-semibold text-[#4b4b43] mt-1">{stat.title}</p>
                        <p className="text-xs text-[#9a9a90] mt-1">{stat.subtitle}</p>
                    </div>
                ))}
            </div>

            {/* Content Section */}
            <div className="space-y-8">
                {/* Top Materials */}
                <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-black/5">
                        <h2 className="font-bold text-[#161613]">Top Downloaded Materials</h2>
                    </div>
                    <div className="divide-y divide-black/5">
                        {TOP_MATERIALS.map((item, index) => (
                            <div key={item.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-black/5 transition-colors">
                                <div className="flex items-center gap-4 flex-1">
                                    <span className="text-sm font-bold text-[#9a9a90] w-4">{index + 1}</span>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.type === 'paper' ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600'}`}>
                                        {item.type === 'paper' ? <FileText className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-[#161613] truncate">{item.title}</h4>
                                        <p className="text-[11px] text-[#9a9a90]">{item.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 sm:w-64">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-[11px] font-bold text-[#161613]">{item.downloads}</span>
                                            <span className="text-[10px] text-[#9a9a90]">downloads</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-[#1B4D2E] rounded-full transition-all duration-1000" 
                                                style={{ width: `${item.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Additional Insights (Placeholder since no graphs) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#f1f3f1] p-6 rounded-3xl border border-black/5">
                        <h3 className="font-bold text-[#161613] mb-2">Subject Performance</h3>
                        <p className="text-sm text-[#4b4b43] mb-4">Mathematics and Biology remain the most active subjects this month, accounting for 45% of total downloads.</p>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Mathematics</span>
                                <span className="text-sm font-bold text-[#1B4D2E]">4,230</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Biology</span>
                                <span className="text-sm font-bold text-[#1B4D2E]">3,840</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">English</span>
                                <span className="text-sm font-bold text-[#1B4D2E]">2,910</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#1B4D2E] p-6 rounded-3xl text-white">
                        <h3 className="font-bold mb-2">Quick Tip</h3>
                        <p className="text-sm text-white/80 leading-relaxed">
                            To increase student engagement, consider uploading more Form 4 Past Papers. We&#39;ve noticed a 20% spike in activity for these materials during exam seasons.
                        </p>
                        <button className="mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-sm font-semibold border border-white/20">
                            Upload Materials
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
