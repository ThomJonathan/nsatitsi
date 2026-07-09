"use client";

import { useState } from 'react';
import { Search, FileText, BookOpen } from 'lucide-react';

const MOCK_DOWNLOADS = [
    {
        id: 1,
        name: "MANEB MSCE Mathematics 2023",
        subject: "Mathematics",
        size: "2.4 MB",
        date: "Today",
        type: "paper",
        iconColor: "bg-amber-50 text-amber-600"
    },
    {
        id: 2,
        name: "Mathematics for Senior Secondary",
        subject: "Mathematics",
        size: "14.2 MB",
        date: "Yesterday",
        type: "book",
        iconColor: "bg-indigo-50 text-indigo-600"
    },
    {
        id: 3,
        name: "Biology Form 3 Textbook",
        subject: "Biology",
        size: "9.8 MB",
        date: "Mon 23 Jun",
        type: "book",
        iconColor: "bg-purple-50 text-purple-600"
    }
];

export default function DownloadsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredDownloads = MOCK_DOWNLOADS.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="px-4 md:px-10 py-5 md:py-8 max-w-5xl mx-auto">
            {/* Search Bar - Matching the image's layout */}
            <div className="relative mb-10 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a9a90]" />
                <input
                    type="text"
                    placeholder="Search books, past papers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#f1f3f1] border-none rounded-2xl pl-11 pr-4 py-3 text-sm placeholder:text-[#9a9a90] text-[#161613] focus:outline-none focus:ring-2 focus:ring-[#1B4D2E]/20 transition-all"
                />
            </div>

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#161613]">Downloads</h1>
                <p className="text-[#9a9a90] text-sm mt-1">Materials saved for offline access</p>
            </div>

            {/* Downloads List */}
            <div className="space-y-4">
                {filteredDownloads.length > 0 ? (
                    filteredDownloads.map((item) => {
                        const Icon = item.type === 'paper' ? FileText : BookOpen;
                        return (
                            <div
                                key={item.id}
                                className="group flex items-center justify-between bg-white border border-black/5 rounded-2xl p-3 md:p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                                    <div className={`flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl md:rounded-2xl ${item.iconColor}`}>
                                        <Icon className="h-4 w-4 md:h-5 md:h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-sm md:text-[15px] font-bold text-[#161613] truncate">
                                            {item.name}
                                        </h3>
                                        <p className="text-[10px] md:text-xs text-[#9a9a90] mt-0.5">
                                            {item.subject} · {item.size}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-[10px] md:text-xs text-[#9a9a90] font-medium whitespace-nowrap ml-3 md:ml-4">
                                    {item.date}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-20 bg-white border border-dashed border-black/10 rounded-2xl">
                        <p className="text-[#9a9a90]">No materials found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
