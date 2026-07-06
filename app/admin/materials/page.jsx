"use client";

import { useState, useEffect, useMemo } from "react";
import UploadMaterialModal from "../../../components/uploadMaterial";

function DocumentThumbnail({ category }) {
    const iconInfo = CATEGORY_ICON[category] || CATEGORY_ICON.books;

    return (
        <div className="mlib-icon" style={{ background: iconInfo.bg, color: iconInfo.color }}>
            {iconInfo.emoji}
        </div>
    );
}

const CATEGORY_OPTIONS = [
    { value: "", label: "All Types" },
    { value: "books", label: "Textbooks" },
    { value: "pastpapers", label: "Past Papers" },
    { value: "answersheets", label: "Answer Sheets" },
];

const CATEGORY_ICON = {
    books: { bg: "#ede9fe", color: "#6d28d9", emoji: "\uD83D\uDCD8" },
    pastpapers: { bg: "#fef3c7", color: "#b45309", emoji: "\uD83D\uDCC4" },
    answersheets: { bg: "#dbeafe", color: "#1d4ed8", emoji: "\u2705" },
};

function formatSize(bytes) {
    if (!bytes && bytes !== 0) return "\u2014";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr) {
    if (!dateStr) return "\u2014";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function MaterialsLibraryPage() {
    const [files, setFiles] = useState(null);
    const [error, setError] = useState("");
    const [category, setCategory] = useState("");
    const [search, setSearch] = useState("");
    const [uploadOpen, setUploadOpen] = useState(false);
    const [deletingKey, setDeletingKey] = useState(null);
    const [downloadProgress, setDownloadProgress] = useState(null); // { key, percent } | null

    const fetchFiles = async (cat) => {
        setError("");
        try {
            const res = await fetch(`/api/files?category=${cat}`);
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Failed to load materials");
                setFiles([]);
                return;
            }
            setFiles(data.files || []);
        } catch (err) {
            setError(err.message);
            setFiles([]);
        }
    };

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const res = await fetch(`/api/files?category=${category}`);
                const data = await res.json();
                if (!cancelled) {
                    if (!res.ok) {
                        setError(data.error || "Failed to load materials");
                        setFiles([]);
                    } else {
                        setFiles(data.files || []);
                    }
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message);
                    setFiles([]);
                }
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [category]);

    const handleDelete = async (key) => {
        if (!confirm("Delete this material? This can't be undone.")) return;
        setDeletingKey(key);
        try {
            const res = await fetch("/api/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key }),
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.error || "Delete failed");
                return;
            }
            setFiles((prev) => prev.filter((f) => f.key !== key));
        } catch (err) {
            alert(err.message);
        } finally {
            setDeletingKey(null);
        }
    };

    const handleDownload = async (key, fileName) => {
        setDownloadProgress({ key, percent: 0 });
        try {
            const res = await fetch(`/api/download?key=${encodeURIComponent(key)}`);
            if (!res.ok) {
                const data = await res.json();
                alert(data.error || "Could not fetch file");
                setDownloadProgress(null);
                return;
            }

            const contentLength = res.headers.get("Content-Length");
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
                    const percent = Math.round((received / total) * 100);
                    setDownloadProgress({ key, percent });
                }
            }

            const blob = new Blob(chunks);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
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

    const visibleFiles = useMemo(() => {
        if (files === null) return [];
        if (!search.trim()) return files;
        const q = search.trim().toLowerCase();
        return files.filter((f) => f.name.toLowerCase().includes(q));
    }, [files, search]);

    return (
        <div className="mlib-root">
            <header className="mlib-topbar">
                <div className="mlib-breadcrumb">Admin <span>&rsaquo;</span> Materials</div>
                <div className="mlib-search-wrap">
                    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mlib-search-icon">
                        <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M17 17L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <input
                        className="mlib-search-input"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </header>

            <div className="mlib-body">
                <div className="mlib-header-row">
                    <div>
                        <h1 className="mlib-title">Materials Library</h1>
                        <p className="mlib-subtitle">
                            {files === null ? "Loading…" : `${visibleFiles.length} of ${files.length} total materials`}
                        </p>
                    </div>
                    <button className="mlib-upload-btn" onClick={() => setUploadOpen(true)}>
                        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 3.5V12.5M3.5 8H12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                        Upload New
                    </button>
                </div>

                <div className="mlib-filter-card">
                    <div className="mlib-filter-label">
                        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 3H14L9.5 8.5V13L6.5 11.5V8.5L2 3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                        </svg>
                        FILTER MATERIALS
                    </div>
                    <div className="mlib-filter-row">
                        <div className="mlib-filter-field">
                            <label>Type</label>
                            <select
                                value={category}
                                onChange={(e) => {
                                    setFiles(null);
                                    setCategory(e.target.value);
                                }}
                            >
                                {CATEGORY_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {error && <div className="mlib-error">{error}</div>}

                <div className="mlib-table-card">
                    <div className="mlib-table-head">
                        <span className="col-material">MATERIAL</span>
                        <span className="col-size">SIZE</span>
                        <span className="col-uploaded">UPLOADED</span>
                        <span className="col-actions"></span>
                    </div>

                    {files === null ? (
                        <div className="mlib-empty mlib-loading">
                            <div className="dot-spinner" role="status" aria-label="Loading materials">
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                                <div className="dot-spinner__dot"></div>
                            </div>
                            <div className="mlib-loading-text">Loading materials…</div>
                        </div>
                    ) : visibleFiles.length === 0 ? (
                        <div className="mlib-empty">
                            {files.length === 0
                                ? "No materials uploaded yet. Click \u201cUpload New\u201d to add one."
                                : "No materials match your search."}
                        </div>
                    ) : (
                        visibleFiles.map((f) => {
                            return (
                                <div className="mlib-row" key={f.key}>
                                    <div className="col-material">
                                        <DocumentThumbnail category={f.category} />
                                        <div>
                                            <div className="mlib-name" title={f.name}>{f.name}</div>
                                            <div className="mlib-badges">
                                                <span className="mlib-badge ext">{f.ext}</span>
                                                <span className="mlib-badge cat">{f.categoryLabel}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-size">{formatSize(f.size)}</div>
                                    <div className="col-uploaded">{formatDate(f.lastModified)}</div>
                                    <div className="col-actions">
                                        {downloadProgress?.key === f.key ? (
                                            <div className="mlib-download-progress" aria-label={`Downloading ${downloadProgress.percent}%`}>
                                                <svg viewBox="0 0 36 36" className="mlib-progress-ring">
                                                    <circle cx="18" cy="18" r="16" className="mlib-progress-bg" />
                                                    <circle
                                                        cx="18" cy="18" r="16"
                                                        className="mlib-progress-fg"
                                                        strokeDasharray={`${2 * Math.PI * 16}`}
                                                        strokeDashoffset={`${2 * Math.PI * 16 * (1 - downloadProgress.percent / 100)}`}
                                                    />
                                                </svg>
                                                <span className="mlib-progress-text">{downloadProgress.percent}%</span>
                                            </div>
                                        ) : (
                                            <button className="mlib-action-btn" onClick={() => handleDownload(f.key, f.name)} aria-label="Download">
                                                <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9 2.5V11.5M9 11.5L5.5 8M9 11.5L12.5 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M3 14.5H15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                                                </svg>
                                            </button>
                                        )}
                                        <button
                                            className="mlib-action-btn danger"
                                            onClick={() => handleDelete(f.key)}
                                            disabled={deletingKey === f.key}
                                            aria-label="Delete"
                                        >
                                            <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3.5 5H14.5M7 5V3.5C7 3 7.4 2.5 8 2.5H10C10.6 2.5 11 3 11 3.5V5M7.5 8V12.5M10.5 8V12.5M4.5 5L5 14C5 14.6 5.5 15 6 15H12C12.5 15 13 14.6 13 14L13.5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <UploadMaterialModal
                open={uploadOpen}
                onClose={() => setUploadOpen(false)}
                onUploaded={() => fetchFiles(category)}
            />

            <style>{`
                * { box-sizing: border-box; }

                .mlib-root {
                    min-height: 100vh;
                    background: #f5f6f7;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                }

                .mlib-topbar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem 2rem;
                    background: #fff;
                    border-bottom: 1px solid #e5e7eb;
                }
                .mlib-breadcrumb {
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #111827;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }
                .mlib-breadcrumb span { color: #9ca3af; }
                .mlib-search-wrap {
                    position: relative;
                    width: 320px;
                }
                .mlib-search-icon {
                    position: absolute;
                    left: 0.85rem;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 16px;
                    height: 16px;
                    color: #9ca3af;
                }
                .mlib-search-input {
                    width: 100%;
                    height: 40px;
                    padding: 0 0.85rem 0 2.4rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 10px;
                    background: #f9fafb;
                    font-size: 0.88rem;
                    outline: none;
                }
                .mlib-search-input:focus { border-color: #1B4D2E; background: #fff; }

                .mlib-body { padding: 2rem; max-width: 1200px; margin: 0 auto; }

                .mlib-header-row {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                .mlib-title {
                    font-family: Georgia, serif;
                    font-size: 1.9rem;
                    font-weight: 700;
                    color: #0f1a12;
                }
                .mlib-subtitle { font-size: 0.9rem; color: #6b7280; margin-top: 0.2rem; }

                .mlib-upload-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: #1B4D2E;
                    color: #fff;
                    border: none;
                    border-radius: 999px;
                    padding: 0.75rem 1.4rem;
                    font-size: 0.9rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: background 0.15s;
                }
                .mlib-upload-btn:hover { background: #163d24; }
                .mlib-upload-btn svg { width: 15px; height: 15px; }

                .mlib-filter-card {
                    background: #fff;
                    border: 1px solid #e5e7eb;
                    border-radius: 14px;
                    padding: 1.25rem 1.5rem;
                    margin-bottom: 1.25rem;
                }
                .mlib-filter-label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.72rem;
                    font-weight: 700;
                    letter-spacing: 0.06em;
                    color: #6b7280;
                    margin-bottom: 0.9rem;
                }
                .mlib-filter-label svg { width: 14px; height: 14px; }
                .mlib-filter-row { display: flex; gap: 1.25rem; flex-wrap: wrap; }
                .mlib-filter-field { display: flex; flex-direction: column; gap: 0.4rem; min-width: 200px; }
                .mlib-filter-field label { font-size: 0.82rem; color: #374151; font-weight: 500; }
                .mlib-filter-field select {
                    height: 42px;
                    padding: 0 0.85rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 9px;
                    background: #f9fafb;
                    font-size: 0.88rem;
                    color: #111827;
                    cursor: pointer;
                }

                .mlib-error {
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    color: #b91c1c;
                    padding: 0.75rem 1rem;
                    border-radius: 10px;
                    font-size: 0.85rem;
                    margin-bottom: 1.25rem;
                }

                .mlib-table-card {
                    background: #fff;
                    border: 1px solid #e5e7eb;
                    border-radius: 14px;
                    overflow: hidden;
                }
                .mlib-table-head, .mlib-row {
                    display: grid;
                    grid-template-columns: 1fr 110px 140px 90px;
                    align-items: center;
                    padding: 1rem 1.5rem;
                    gap: 1rem;
                }
                .mlib-table-head {
                    background: #f3f7f4;
                    font-size: 0.7rem;
                    font-weight: 700;
                    letter-spacing: 0.06em;
                    color: #6b7280;
                }
                .mlib-row { border-top: 1px solid #f1f2f4; }
                .mlib-row:hover { background: #fafbfa; }

                .col-material { display: flex; align-items: center; gap: 0.85rem; min-width: 0; }
                .mlib-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.05rem;
                    flex-shrink: 0;
                }
                .mlib-name {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #111827;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 320px;
                }
                .mlib-badges { display: flex; gap: 0.4rem; margin-top: 0.3rem; }
                .mlib-badge {
                    font-size: 0.68rem;
                    font-weight: 700;
                    padding: 0.12rem 0.5rem;
                    border-radius: 5px;
                }
                .mlib-badge.ext { background: #fee2e2; color: #b91c1c; }
                .mlib-badge.cat { background: #e5ece7; color: #385444; }

                .col-size, .col-uploaded { font-size: 0.85rem; color: #4b5563; }
                .col-actions { display: flex; gap: 0.4rem; justify-content: flex-end; align-items: center; }
                .mlib-action-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    border: none;
                    background: #f3f4f6;
                    color: #4b5563;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.15s, color 0.15s;
                }
                .mlib-action-btn svg { width: 15px; height: 15px; }
                .mlib-action-btn:hover { background: #e5e7eb; }
                .mlib-action-btn.danger:hover { background: #fef2f2; color: #b91c1c; }
                .mlib-action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                .mlib-download-progress {
                    position: relative;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .mlib-progress-ring { width: 32px; height: 32px; transform: rotate(-90deg); }
                .mlib-progress-bg { fill: none; stroke: #e5e7eb; stroke-width: 3; }
                .mlib-progress-fg {
                    fill: none;
                    stroke: #1B4D2E;
                    stroke-width: 3;
                    stroke-linecap: round;
                    transition: stroke-dashoffset 0.15s ease;
                }
                .mlib-progress-text {
                    position: absolute;
                    font-size: 0.55rem;
                    font-weight: 700;
                    color: #1B4D2E;
                }

                .mlib-empty {
                    padding: 3rem 1.5rem;
                    text-align: center;
                    color: #9ca3af;
                    font-size: 0.9rem;
                }

                .mlib-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                    min-height: 220px;
                }

                .mlib-loading-text {
                    font-size: 0.88rem;
                    font-weight: 600;
                    color: #6b7280;
                }

                .dot-spinner {
                    --uib-size: 2.8rem;
                    --uib-speed: .9s;
                    --uib-color: #183153;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    height: var(--uib-size);
                    width: var(--uib-size);
                }

                .dot-spinner__dot {
                    position: absolute;
                    top: 0;
                    left: 0;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    height: 100%;
                    width: 100%;
                }

                .dot-spinner__dot::before {
                    content: '';
                    height: 20%;
                    width: 20%;
                    border-radius: 50%;
                    background-color: var(--uib-color);
                    transform: scale(0);
                    opacity: 0.5;
                    animation: pulse0112 calc(var(--uib-speed) * 1.111) ease-in-out infinite;
                    box-shadow: 0 0 20px rgba(18, 31, 53, 0.3);
                }

                .dot-spinner__dot:nth-child(2) { transform: rotate(45deg); }
                .dot-spinner__dot:nth-child(2)::before { animation-delay: calc(var(--uib-speed) * -0.875); }
                .dot-spinner__dot:nth-child(3) { transform: rotate(90deg); }
                .dot-spinner__dot:nth-child(3)::before { animation-delay: calc(var(--uib-speed) * -0.75); }
                .dot-spinner__dot:nth-child(4) { transform: rotate(135deg); }
                .dot-spinner__dot:nth-child(4)::before { animation-delay: calc(var(--uib-speed) * -0.625); }
                .dot-spinner__dot:nth-child(5) { transform: rotate(180deg); }
                .dot-spinner__dot:nth-child(5)::before { animation-delay: calc(var(--uib-speed) * -0.5); }
                .dot-spinner__dot:nth-child(6) { transform: rotate(225deg); }
                .dot-spinner__dot:nth-child(6)::before { animation-delay: calc(var(--uib-speed) * -0.375); }
                .dot-spinner__dot:nth-child(7) { transform: rotate(270deg); }
                .dot-spinner__dot:nth-child(7)::before { animation-delay: calc(var(--uib-speed) * -0.25); }
                .dot-spinner__dot:nth-child(8) { transform: rotate(315deg); }
                .dot-spinner__dot:nth-child(8)::before { animation-delay: calc(var(--uib-speed) * -0.125); }

                @keyframes pulse0112 {
                    0%, 100% {
                        transform: scale(0);
                        opacity: 0.5;
                    }

                    50% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                @media (max-width: 720px) {
                    .mlib-table-head { display: none; }
                    .mlib-row {
                        grid-template-columns: 1fr;
                        gap: 0.65rem;
                        align-items: flex-start;
                        padding: 1.25rem 1rem;
                    }
                    .col-material,
                    .col-size,
                    .col-uploaded,
                    .col-actions {
                        width: 100%;
                    }
                    .col-material {
                        align-items: flex-start;
                    }
                    .col-actions {
                        justify-content: flex-start;
                        margin-top: 0.25rem;
                    }
                    .col-size, .col-uploaded {
                        font-size: 0.8rem;
                        color: #9ca3af;
                    }
                    .mlib-name {
                        max-width: 100%;
                        white-space: normal;
                        overflow: visible;
                        text-overflow: initial;
                        word-break: break-word;
                    }
                    .mlib-badges {
                        flex-wrap: wrap;
                    }
                    .mlib-search-wrap { width: 180px; }
                }
            `}</style>
        </div>
    );
}