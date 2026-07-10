"use client";

import { useEffect, useState } from 'react';
import { Search, Download, Bookmark, BookOpen, FileText, Bell, ChevronRight } from 'lucide-react';
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
    { value: "french", label: "French", emoji: "🇫🇷", code: "FR", color: "bg-indigo-100 text-indigo-700" },
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

const BOOKMARKS_STORAGE_KEY = 'nsatitsi:bookmarks';

// Format bytes into a short human-readable size (e.g. 2.4 MB)
function formatFileSize(bytes) {
    if (bytes === null || bytes === undefined || Number.isNaN(bytes)) return '';
    if (bytes === 0) return '0 KB';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, i);
    return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export default function StudentHome({ name = 'Thandizo', form = 'Form 3', school = 'Kamuzu Academy' }) {
    const router = useRouter();
    const [materials, setMaterials] = useState([]);
    const [loadingMaterials, setLoadingMaterials] = useState(true);
    const [materialsError, setMaterialsError] = useState('');
    const [downloadProgress, setDownloadProgress] = useState(null);
    const [bookmarks, setBookmarks] = useState(() => {
        try {
            const saved = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
            return saved ? new Set(JSON.parse(saved)) : new Set();
        } catch {
            return new Set();
        }
    });

    // NEW: State for subject view toggle
    const [showAllSubjects, setShowAllSubjects] = useState(false);
    const [visibleSubjectCount, setVisibleSubjectCount] = useState(3);

    // Responsive visible count: number of subjects before "View all"
    useEffect(() => {
        const updateVisibleCount = () => {
            const width = window.innerWidth;
            let count;
            if (width >= 1280) count = 7;      // xl: grid-cols-8 → 7 subjects + toggle
            else if (width >= 1024) count = 6; // lg: grid-cols-7 → 6 subjects + toggle
            else if (width >= 768) count = 5;  // md: grid-cols-6 → 5 subjects + toggle
            else if (width >= 640) count = 4;  // sm: grid-cols-5 → 4 subjects + toggle
            else count = 3;                    // mobile: grid-cols-4 → 3 subjects + toggle
            setVisibleSubjectCount(count);
        };

        updateVisibleCount();
        window.addEventListener('resize', updateVisibleCount);
        return () => window.removeEventListener('resize', updateVisibleCount);
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Mwadzuka bwanji?';
        if (hour < 18) return 'Mwaswera bwanji?';
        return 'Madzuro abwino';
    };

    const isPrimary = form.toLowerCase().includes('standard');
    const subjects = isPrimary ? PRIMARY_SUBJECTS : SECONDARY_SUBJECTS;
    const levelLabel = isPrimary ? 'Primary School' : (form.includes('1') || form.includes('2') ? 'Junior Secondary' : 'Senior Secondary');

    // Determine which subjects to display
    const displayedSubjects = showAllSubjects ? subjects : subjects.slice(0, visibleSubjectCount);
    const showToggle = subjects.length > visibleSubjectCount;

    const toggleBookmark = (key) => {
        setBookmarks((prev) => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            try {
                localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify([...next]));
            } catch {
                // ignore storage errors (e.g. private browsing)
            }
            return next;
        });
    };

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
        <div className="min-w-0 w-full max-w-7xl mx-auto px-4 md:px-10 py-5 md:py-8 overflow-x-hidden">
            {/* Sticky header */}
            <div className="min-w-0 sticky top-0 bg-white/95 backdrop-blur-sm z-20 pb-5 -mx-4 md:-mx-10 px-4 md:px-10 mb-5 md:mb-8 border-b border-black/5 md:border-none">
                {/* Greeting + bell */}
                <div className="flex items-start justify-between mb-5 gap-4 min-w-0">
                    <div className="min-w-0 flex-1">
                        <p className="text-[#9a9a90] text-xs md:text-sm truncate">{getGreeting()}</p>
                        <h1 className="text-2xl md:text-3xl font-bold text-[#161613] flex items-center gap-2 min-w-0">
                            <span className="truncate">{name}</span> <span className="shrink-0">👋</span>
                        </h1>
                        <p className="text-[#6b6b63] text-xs md:text-sm mt-1 truncate">
                            {form} · {school}
                        </p>
                    </div>
                    <button
                        className="hidden md:flex shrink-0 relative w-10 h-10 rounded-full bg-white border border-black/5 items-center justify-center"
                        aria-label="Notifications"
                    >
                        <Bell className="w-5 h-5 text-[#4b4b43]" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-green-500" />
                    </button>
                </div>

                {/* Search */}
                <div className="relative min-w-0 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4b4b43]" />
                    <input
                        type="text"
                        placeholder="Search books, past papers, subjects..."
                        className="w-full min-w-0 bg-white border border-black/15 rounded-2xl pl-11 pr-4 py-2.5 md:py-3.5 text-sm placeholder:text-[#6b6b63] text-[#161613] focus:outline-none focus:ring-2 focus:ring-[#1B4D2E]/30"
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-4 mb-6 w-full min-w-0">
                <StatCard icon={FileText} value={materials.length} label="Materials" iconBg="bg-blue-50" iconColor="text-blue-600" />
                <StatCard icon={Bookmark} value={bookmarks.size} label="Bookmarks" iconBg="bg-green-50" iconColor="text-green-700" />
                <StatCard icon={BookOpen} value={9} label="Subjects" iconBg="bg-purple-50" iconColor="text-purple-600" />
            </div>

            {/* Browse by subject */}
            <div className="flex items-center justify-between mb-4 md:mb-3 w-full min-w-0">
                <div className="min-w-0">
                    <h2 className="text-xs md:text-sm font-bold tracking-wide text-[#161613] uppercase">
                        Browse by Subject
                    </h2>
                    <p className="text-xs text-[#9a9a90] mt-1">
                        {levelLabel}
                    </p>
                </div>
            </div>

            {/* Subject grid with toggle */}
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-2 md:gap-3 mb-8 w-full min-w-0">
                {displayedSubjects.map((s) => (
                    <button
                        key={s.value}
                        onClick={() => router.push(`/student/materials/${s.value.toLowerCase()}`)}
                        className="group bg-white border border-black/10 rounded-xl px-2 md:px-3 py-3 flex flex-col items-center justify-center gap-1.5 min-w-0 transition-all hover:border-[#1B4D2E]/30 hover:shadow-sm active:scale-95"
                    >
                        <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-[10px] md:text-xs font-bold leading-none transition-transform group-hover:scale-110 ${s.color}`}>
                            {s.code}
                        </div>
                        <p className="text-[10px] md:text-xs font-semibold text-[#161613] leading-tight text-center line-clamp-2">
                            {s.label}
                        </p>
                    </button>
                ))}

                {showToggle && (
                    <button
                        onClick={() => setShowAllSubjects(!showAllSubjects)}
                        className="group bg-[#1B4D2E]/5 border border-[#1B4D2E]/15 rounded-xl px-2 md:px-3 py-3 flex flex-col items-center justify-center gap-1.5 min-w-0 transition-all hover:bg-[#1B4D2E]/10 hover:border-[#1B4D2E]/30 active:scale-95"
                    >
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center bg-white transition-transform group-hover:scale-110">
                            <ChevronRight
                                className={`w-3.5 h-3.5 md:w-4 md:h-4 text-[#1B4D2E] transition-transform duration-200 ${
                                    showAllSubjects ? 'rotate-90' : ''
                                }`}
                            />
                        </div>
                        <p className="text-[10px] md:text-xs font-semibold text-[#1B4D2E] leading-tight text-center">
                            {showAllSubjects ? 'View less' : 'View all'}
                        </p>
                    </button>
                )}
            </div>

            {/* Latest materials */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 w-full min-w-0">
                <h2 className="text-xs md:text-sm font-bold tracking-wide text-[#161613] uppercase">Latest Materials</h2>
                <span className="text-xs md:text-sm text-[#9a9a90]">
                    {loadingMaterials ? 'Loading from Mega...' : `${materials.length} available`}
                </span>
            </div>
            {materialsError ? (
                <div className="mb-8 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 w-full">
                    {materialsError}
                </div>
            ) : null}

            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 mb-8 w-full min-w-0">
                {loadingMaterials ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="rounded-2xl bg-white p-3 w-full min-w-0 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-[10px] bg-black/5 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="h-3.5 w-3/4 rounded bg-black/5" />
                                <div className="mt-2 h-3 w-1/2 rounded bg-black/5" />
                            </div>
                        </div>
                    ))
                ) : recentMaterials.length > 0 ? (
                    recentMaterials.map((material) => {
                        const isPastPaper = ['pastpapers', 'answersheets'].includes(material.category);
                        const Icon = isPastPaper ? FileText : BookOpen;
                        const isBookmarked = bookmarks.has(material.key);
                        const sizeLabel = formatFileSize(material.size ?? material.sizeBytes);
                        const dateLabel = material.lastModified
                            ? new Date(material.lastModified).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                            : 'Recently added';
                        const metaParts = [material.categoryLabel || 'Material', sizeLabel, dateLabel].filter(Boolean);

                        return (
                            <div
                                key={material.key}
                                onClick={() => router.push(`/student/materials/preview/${material.key}`)}
                                className="cursor-pointer rounded-2xl bg-white p-3 shadow-sm transition hover:shadow-md w-full min-w-0 flex items-center gap-3"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#EAF3DE]">
                                    <Icon className="h-5 w-5 text-[#3B6D11]" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-[#17301A]">{material.name}</p>
                                    <p className="truncate text-xs text-[#6B6F63]">{metaParts.join(' · ')}</p>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                        type="button"
                                        aria-label={isBookmarked ? `Remove ${material.name} from bookmarks` : `Bookmark ${material.name}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleBookmark(material.key);
                                        }}
                                        className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-black/10 active:scale-95 transition-transform"
                                    >
                                        <Bookmark
                                            className={`h-4 w-4 ${isBookmarked ? 'text-[#1B4D2E]' : 'text-[#9a9a90]'}`}
                                            fill={isBookmarked ? '#1B4D2E' : 'none'}
                                        />
                                    </button>

                                    {downloadProgress?.key === material.key ? (
                                        <div className="flex h-[34px] w-[34px] items-center justify-center">
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
                                    ) : (
                                        <button
                                            type="button"
                                            aria-label={`Download ${material.name}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDownload(material);
                                            }}
                                            className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#1B4D2E] active:scale-95 transition-transform"
                                        >
                                            <Download className="h-4 w-4 text-[#EAF3DE]" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="rounded-2xl border border-dashed border-black/10 bg-white px-4 py-8 text-center text-sm text-[#6b6b63] sm:col-span-2 lg:col-span-3">
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
        <div className="bg-white border border-black/15 rounded-2xl px-2 py-1.5 md:px-4 md:py-3 flex flex-col gap-0.5 md:gap-1.5 w-full h-full justify-center min-w-0">
            <span className={`w-5 h-5 md:w-8 md:h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
                <Icon className={`w-2.5 h-2.5 md:w-4 md:h-4 ${iconColor}`} />
            </span>
            <div className="min-w-0">
                <p className="text-sm md:text-2xl font-bold text-[#161613] truncate leading-none">{value}</p>
                <p className="text-[8px] md:text-xs text-[#9a9a90] mt-0.5 truncate">{label}</p>
            </div>
        </div>
    );
}