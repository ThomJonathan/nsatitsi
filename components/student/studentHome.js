"use client";

import { useEffect, useState } from 'react';
import { Search, Download, Bookmark, BookOpen, FileText, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PRIMARY_SUBJECTS = [
    { value: "english", label: "English", emoji: "📖", code: "EN", color: "bg-blue-100 text-blue-700" },
    { value: "chichewa", label: "Chichewa", emoji: "🇲🇼", code: "CH", color: "bg-red-100 text-red-700" },
    { value: "mathematics", label: "Mathematics", emoji: "🔢", code: "MA", color: "bg-green-100 text-green-700" },
    { value: "social-environmental-studies", label: "Social and Environmental Studies", emoji: "🌐", code: "SES", color: "bg-purple-100 text-purple-700" },
    { value: "science-technology", label: "Science and Technology", emoji: "🔬", code: "ST", color: "bg-yellow-100 text-yellow-700" },
    { value: "life-skills", label: "Life Skills", emoji: "💻", code: "LS", color: "bg-pink-100 text-pink-700" },
    { value: "agriculture", label: "Agriculture", emoji: "🐗", code: "AG", color: "bg-orange-100 text-orange-700" },
    { value: "bible-knowledge", label: "Bible Knowledge", emoji: "✍️", code: "BK", color: "bg-indigo-100 text-indigo-700" },
    { value: "religious-studies", label: "Religious Studies", emoji: "🕌", code: "RS", color: "bg-cyan-100 text-cyan-700" },
];

const SECONDARY_SUBJECTS = [
    { value: "english", label: "English", emoji: "📖", code: "EN", color: "bg-blue-100 text-blue-700" },
    { value: "mathematics", label: "Mathematics", emoji: "🔢", code: "MA", color: "bg-green-100 text-green-700" },
    { value: "additional-mathematics", label: "Additional Mathematics", emoji: "🔢", code: "AM", color: "bg-emerald-100 text-emerald-700" },
    {value: "french",label: "French",emoji: "🇫🇷",code: "FR",color: "bg-indigo-100 text-indigo-700"},
    { value: "chichewa", label: "Chichewa", emoji: "🇲🇼", code: "CH", color: "bg-red-100 text-red-700" },
    { value: "biology", label: "Biology", emoji: "🧬", code: "BI", color: "bg-lime-100 text-lime-700" },
    { value: "chemistry", label: "Chemistry", emoji: "🧪", code: "CHE", color: "bg-teal-100 text-teal-700" },
    { value: "physics", label: "Physics", emoji: "⚡", code: "PH", color: "bg-sky-100 text-sky-700" },
    { value: "history", label: "History", emoji: "📜", code: "HI", color: "bg-amber-100 text-amber-700" },
    { value: "geography", label: "Geography", emoji: "🌍", code: "GE", color: "bg-orange-100 text-orange-700" },
    { value: "agriculture", label: "Agriculture", emoji: "🐗", code: "AG", color: "bg-orange-100 text-orange-700" },
    { value: "social-studies", label: "Social Studies", emoji: "👦", code: "SS", color: "bg-violet-100 text-violet-700" },
    { value: "life-skills", label: "Life Skills", emoji: "💻", code: "LS", color: "bg-pink-100 text-pink-700" },
    { value: "computer-studies", label: "Computer Studies", emoji: "🔨", code: "CS", color: "bg-slate-100 text-slate-700" },
    { value: "home-economics", label: "Home Economics", emoji: "💸", code: "HE", color: "bg-rose-100 text-rose-700" },
    { value: "business-studies", label: "Business Studies", emoji: "💼", code: "BS", color: "bg-indigo-100 text-indigo-700" },
];

export default function StudentHome({ name = 'Thandizo', form = 'Form 3', school = 'Kamuzu Academy' }) {
    const router = useRouter();
    const [materials, setMaterials] = useState([]);
    const [loadingMaterials, setLoadingMaterials] = useState(true);
    const [materialsError, setMaterialsError] = useState('');
    const [downloadProgress, setDownloadProgress] = useState(null);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Mwadzuka bwanji?';
        if (hour < 18) return 'Mwaswera bwanji?';
        return 'Madzuro abwino';
    };

    const isPrimary = form.toLowerCase().includes('standard');
    const subjects = isPrimary ? PRIMARY_SUBJECTS : SECONDARY_SUBJECTS;
    const levelLabel = isPrimary ? 'Primary School' : (form.includes('1') || form.includes('2') ? 'Junior Secondary' : 'Senior Secondary');

    useEffect(() => {
        let cancelled = false;

        const loadMaterials = async () => {
            setLoadingMaterials(true);
            setMaterialsError('');

            try {
                const res = await fetch('/api/files');
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Failed to load materials');
                }

                if (!cancelled) {
                    setMaterials(data.files || []);
                }
            } catch (err) {
                if (!cancelled) {
                    setMaterialsError(err.message || 'Failed to load materials');
                    setMaterials([]);
                }
            } finally {
                if (!cancelled) {
                    setLoadingMaterials(false);
                }
            }
        };

        loadMaterials();

        return () => {
            cancelled = true;
        };
    }, []);

    const recentMaterials = materials.slice(0, 6);

    const handleDownload = async (material) => {
        setDownloadProgress({ key: material.key, percent: 0 });

        try {
            const res = await fetch(`/api/download?key=${encodeURIComponent(material.key)}`);
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Could not fetch file');
            }

            const contentLength = res.headers.get('Content-Length');
            const total = contentLength ? parseInt(contentLength, 10) : 0;
            const reader = res.body.getReader();
            const chunks = [];
            let received = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                chunks.push(value);
                received += value.length;

                if (total > 0) {
                    setDownloadProgress({ key: material.key, percent: Math.round((received / total) * 100) });
                }
            }

            if (total <= 0) {
                setDownloadProgress({ key: material.key, percent: 100 });
            }

            const blob = new Blob(chunks);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = material.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            alert(err.message);
        } finally {
            setDownloadProgress(null);
        }
    };

    return (
        <div className="px-4 md:px-10 py-5 md:py-8 max-w-6xl">
            {/* Sticky header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-20 pb-5 -mx-4 md:-mx-10 px-4 md:px-10 mb-2">
                {/* Greeting + bell (bell here is desktop-only; mobile bell lives in MobileHeader) */}
                <div className="flex items-start justify-between mb-5">
                    <div>
                        <p className="text-[#9a9a90] text-xs md:text-sm">{getGreeting()}</p>
                        <h1 className="text-lg md:text-2xl font-bold text-[#161613] flex items-center gap-2">
                            {name} <span>👋</span>
                        </h1>
                        <p className="text-[#6b6b63] text-xs md:text-sm mt-1">
                            {form} · {school}
                        </p>
                    </div>
                    <button className="hidden md:flex relative w-10 h-10 rounded-full bg-white border border-black/5 items-center justify-center" aria-label="Notifications">
                        <Bell className="w-5 h-5 text-[#4b4b43]" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-green-500" />
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4b4b43]" />
                    <input
                        type="text"
                        placeholder="Search books, past papers, subjects..."
                        className="w-full bg-white border border-black/15 rounded-2xl pl-11 pr-4 py-2 md:py-3.5 text-sm placeholder:text-[#6b6b63] text-[#161613] focus:outline-none focus:ring-2 focus:ring-[#1B4D2E]/30"
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-7">
                <StatCard icon={FileText} value={materials.length} label="Materials" iconBg="bg-blue-50" iconColor="text-blue-600" />
                <StatCard icon={Bookmark} value={2} label="Bookmarks" iconBg="bg-green-50" iconColor="text-green-700" />
                <StatCard icon={BookOpen} value={9} label="Subjects" iconBg="bg-purple-50" iconColor="text-purple-600" />
            </div>

            {/* Browse by subject */}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold tracking-wide text-[#161613]">BROWSE BY SUBJECT</h2>
                <span className="text-xs md:text-sm text-[#9a9a90]">{levelLabel}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {subjects.map((s) => (
                    <button
                        key={s.value}
                        onClick={() => router.push(`/student/materials/${s.value.toLowerCase()}`)}
                        className="flex items-center gap-2 md:gap-3 bg-white border border-black/15 rounded-2xl px-3 md:px-4 py-3 md:py-3.5 hover:border-[#1B4D2E]/30 hover:shadow-sm transition-all text-left"
                    >
                        <span className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold shrink-0 ${s.color}`}>
                            {s.code}
                        </span>
                        <span className="text-xs md:text-[15px] font-medium text-[#161613] truncate">{s.label}</span>
                    </button>
                ))}
            </div>

            {/* Latest materials */}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold tracking-wide text-[#161613]">LATEST MATERIALS</h2>
                <span className="text-xs md:text-sm text-[#9a9a90]">
                    {loadingMaterials ? 'Loading from Mega...' : `${materials.length} available`}
                </span>
            </div>
            {materialsError ? (
                <div className="mb-8 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {materialsError}
                </div>
            ) : null}
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 mb-8">
                {loadingMaterials ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="rounded-2xl border border-black/10 bg-white p-4">
                            <div className="h-4 w-3/4 rounded bg-black/5" />
                            <div className="mt-3 h-3 w-1/2 rounded bg-black/5" />
                            <div className="mt-6 h-9 rounded-xl bg-black/5" />
                        </div>
                    ))
                ) : recentMaterials.length > 0 ? (
                    recentMaterials.map((material) => {
                        const isPastPaper = ['pastpapers', 'answersheets'].includes(material.category);
                        const Icon = isPastPaper ? FileText : BookOpen;

                        return (
                            <div
                                key={material.key}
                                onClick={() => router.push(`/student/materials/preview/${material.key}`)}
                                className="cursor-pointer rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:border-[#1B4D2E]/25 hover:shadow-md"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
                                        <Icon className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-[#161613]">{material.name}</p>
                                        <p className="mt-1 text-xs text-[#6b6b63]">
                                            {material.categoryLabel || 'Academic Material'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between gap-3">
                                    <span className="text-xs text-[#9a9a90]">
                                        {material.lastModified ? new Date(material.lastModified).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        }) : 'Recently added'}
                                    </span>
                                    {downloadProgress?.key === material.key ? (
                                        <div className="flex items-center gap-2 rounded-full bg-[#1B4D2E]/5 px-3 py-2">
                                            <div className="relative h-5 w-5">
                                                <svg viewBox="0 0 36 36" className="h-5 w-5 -rotate-90">
                                                    <circle cx="18" cy="18" r="16" className="fill-none stroke-black/10" strokeWidth="3" />
                                                    <circle
                                                        cx="18"
                                                        cy="18"
                                                        r="16"
                                                        className="fill-none stroke-[#1B4D2E]"
                                                        strokeWidth="3"
                                                        strokeDasharray={`${2 * Math.PI * 16}`}
                                                        strokeDashoffset={`${2 * Math.PI * 16 * (1 - downloadProgress.percent / 100)}`}
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                            </div>
                                            <span className="text-xs font-semibold text-[#1B4D2E]">
                                                {downloadProgress.percent}%
                                            </span>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDownload(material);
                                            }}
                                            className="inline-flex items-center gap-1.5 rounded-full bg-[#1B4D2E] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#163d24]"
                                        >
                                            <Download className="h-3.5 w-3.5" />
                                            Download
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="rounded-2xl border border-dashed border-black/10 bg-white px-4 py-8 text-center text-sm text-[#6b6b63] md:col-span-2 xl:col-span-3">
                        No materials found in Mega storage yet.
                    </div>
                )}
            </div>

            <div className="pb-6" />
        </div>
    );
}

function StatCard({ icon: Icon, value, label, iconBg, iconColor }) {
    return (
        <div className="bg-white border border-black/15 rounded-lg px-2 py-2 md:px-5 md:py-5 flex flex-col gap-0.5 md:gap-2">
            <span className={`w-5 h-5 md:w-9 md:h-9 rounded-full flex items-center justify-center ${iconBg}`}>
                <Icon className={`w-2.5 h-2.5 md:w-4 h-4 ${iconColor}`} />
            </span>
            <div>
                <p className="text-[11px] md:text-2xl font-bold text-[#161613]">{value}</p>
                <p className="text-[9px] md:text-sm text-[#9a9a90] leading-tight">{label}</p>
            </div>
        </div>
    );
}