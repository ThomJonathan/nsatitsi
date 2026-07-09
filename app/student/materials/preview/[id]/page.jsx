"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Download, Bookmark, BookOpen, Eye, FileText } from 'lucide-react';

export default function MaterialPreviewPage({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const [material, setMaterial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloadProgress, setDownloadProgress] = useState(null);

    useEffect(() => {
        const fetchMaterial = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/files');
                const data = await res.json();
                const found = data.files.find(f => f.key === id);
                setMaterial(found);
            } catch (err) {
                console.error("Failed to fetch material:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMaterial();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-[#6b6b63]">Loading material details...</div>
            </div>
        );
    }

    if (!material) {
        return (
            <div className="px-4 py-12 text-center">
                <h2 className="text-xl font-bold text-[#161613]">Material not found</h2>
                <button 
                    onClick={() => router.back()}
                    className="mt-4 text-[#1B4D2E] font-medium"
                >
                    Go back
                </button>
            </div>
        );
    }

    const isPastPaper = ['pastpapers', 'answersheets'].includes(material.category);

    const handleDownload = async () => {
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
        <div className="px-4 md:px-10 py-6 max-w-4xl mx-auto">
            <button 
                onClick={() => router.back()}
                className="flex items-center gap-1 text-[#6b6b63] hover:text-[#161613] transition-colors mb-6 group"
            >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-sm font-medium">Back</span>
            </button>

            <div className="bg-[#f0f7ff] rounded-3xl p-10 flex flex-col items-center justify-center mb-8">
                <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-sm mb-4">
                    {isPastPaper ? (
                        <FileText className="w-10 h-10 text-blue-600" />
                    ) : (
                        <BookOpen className="w-10 h-10 text-blue-600" />
                    )}
                </div>
                <p className="text-blue-600 font-bold text-xs tracking-widest uppercase">
                    {isPastPaper ? 'PAST PAPER' : 'TEXTBOOK / NOTES'}
                </p>
            </div>

            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[#161613] mb-4">{material.name}</h1>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#6b6b63] mb-6">
                    <span className="font-medium">{material.categoryLabel || 'Academic Material'}</span>
                    <span>MANEB</span>
                </div>
                <div className="flex items-center gap-6 text-[#9a9a90] text-sm">
                    <span className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        <span className="font-semibold text-[#161613]">2,890</span> downloads
                    </span>
                    <span className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span className="font-semibold text-[#161613]">4,624</span> views
                    </span>
                </div>
            </div>

            <div className="bg-[#f9fafb] border-2 border-dashed border-black/10 rounded-3xl p-12 flex flex-col items-center justify-center mb-8">
                <FileText className="w-12 h-12 text-[#9a9a90] mb-4" />
                <p className="font-bold text-[#161613] text-lg">Document preview</p>
                <p className="text-[#9a9a90] text-sm mb-6">PDF · Est. 24 pages</p>
                <button className="flex items-center gap-2 text-[#1B4D2E] font-bold text-sm hover:underline">
                    <Eye className="w-4 h-4" />
                    Quick preview
                </button>
            </div>

            <div className="flex items-center gap-4">
                {downloadProgress?.key === material.key ? (
                    <div className="flex-1 rounded-2xl border border-black/10 bg-white py-4 px-4 font-bold flex items-center justify-center gap-3">
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
                        <span className="text-sm text-[#161613]">{downloadProgress.percent}%</span>
                    </div>
                ) : (
                    <button
                        onClick={handleDownload}
                        className="flex-1 bg-[#1B4D2E] text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-[#163d24] transition-colors shadow-lg shadow-green-900/10"
                    >
                        <Download className="w-5 h-5" />
                        Download
                    </button>
                )}
                <button className="p-4 border border-black/10 rounded-2xl hover:bg-black/[0.02] transition-colors group">
                    <Bookmark className="w-6 h-6 text-[#6b6b63] group-hover:text-[#161613]" />
                </button>
            </div>
        </div>
    );
}
