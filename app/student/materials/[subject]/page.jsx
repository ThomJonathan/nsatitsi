"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, BookOpen, FileText, Bookmark, Download, Search } from 'lucide-react';

export default function SubjectMaterialsPage({ params }) {
    const { subject } = use(params);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('books');
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchMaterials = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/files');
                const data = await res.json();
                const subjectName = subject.toLowerCase();
                const filtered = data.files.filter(f => 
                    f.name.toLowerCase().includes(subjectName)
                );
                setMaterials(filtered);
            } catch (err) {
                console.error("Failed to fetch materials:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMaterials();
    }, [subject]);

    const filteredMaterials = materials.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;

        if (activeTab === 'books') {
            return m.category === 'books' || m.category === 'notes' || !['pastpapers', 'answersheets'].includes(m.category);
        } else {
            return m.category === 'pastpapers' || m.category === 'answersheets';
        }
    });

    const displayName = subject.charAt(0).toUpperCase() + subject.slice(1);

    return (
        <div className="px-4 md:px-10 py-6 max-w-5xl mx-auto">
            <button 
                onClick={() => router.back()}
                className="flex items-center gap-1 text-[#6b6b63] hover:text-[#161613] transition-colors mb-6 group"
            >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-sm font-medium">Back</span>
            </button>

            <div className="bg-[#f0f7ff] rounded-3xl p-6 md:p-8 flex items-center gap-4 md:gap-6 mb-8">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                    <span className="text-blue-600 font-bold text-lg md:text-xl">
                        {subject.substring(0, 2).toUpperCase()}
                    </span>
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#161613]">{displayName}</h1>
                    <p className="text-[#6b6b63] text-sm md:text-base mt-0.5">Academic Material</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <div className="flex w-full sm:w-fit bg-[#f5f6f7] p-1 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('books')}
                        className={`flex flex-1 sm:flex-none items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            activeTab === 'books' 
                            ? 'bg-white text-[#161613] shadow-sm' 
                            : 'text-[#6b6b63] hover:text-[#161613]'
                        }`}
                    >
                        <BookOpen className="w-4 h-4" />
                        Books & Notes
                    </button>
                    <button
                        onClick={() => setActiveTab('pastpapers')}
                        className={`flex flex-1 sm:flex-none items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            activeTab === 'pastpapers' 
                            ? 'bg-white text-[#161613] shadow-sm' 
                            : 'text-[#6b6b63] hover:text-[#161613]'
                        }`}
                    >
                        <FileText className="w-4 h-4" />
                        Past Papers
                    </button>
                </div>

                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a9a90]" />
                    <input 
                        type="text"
                        placeholder={`Search ${activeTab === 'books' ? 'books or notes' : 'past papers'}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-white border border-black/10 shadow-sm focus:bg-white focus:ring-2 focus:ring-[#1B4D2E]/20 focus:border-[#1B4D2E]/30 rounded-2xl text-sm transition-all outline-none text-[#161613] placeholder:text-[#9a9a90]"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="py-12 text-center text-[#6b6b63]">Loading materials...</div>
                ) : filteredMaterials.length > 0 ? (
                    filteredMaterials.map((m) => (
                        <div 
                            key={m.key} 
                            onClick={() => router.push(`/student/materials/preview/${m.key}`)}
                            className="flex items-center gap-4 bg-white border border-black/10 rounded-3xl p-4 md:p-5 hover:border-[#1B4D2E]/30 hover:shadow-md transition-all cursor-pointer group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                                {activeTab === 'books' ? (
                                    <BookOpen className="w-5 h-5 text-blue-600" />
                                ) : (
                                    <FileText className="w-5 h-5 text-blue-600" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-[#161613] text-base md:text-lg truncate group-hover:text-[#1B4D2E] transition-colors">
                                    {m.name}
                                </h3>
                                <p className="text-[#9a9a90] text-xs md:text-sm mt-0.5">
                                    {displayName}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0 text-[#9a9a90]">
                                <button className="p-2 hover:bg-black/[0.03] rounded-full transition-colors">
                                    <Bookmark className="w-5 h-5" />
                                </button>
                                <span className="flex items-center gap-1.5 text-sm font-medium">
                                    <Download className="w-4 h-4" />
                                    2,890
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-12 text-center bg-white border border-dashed border-black/15 rounded-3xl">
                        <p className="text-[#6b6b63]">
                            {searchQuery 
                                ? `No results found for "${searchQuery}"` 
                                : `No ${activeTab === 'books' ? 'books or notes' : 'past papers'} found for this subject.`
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
