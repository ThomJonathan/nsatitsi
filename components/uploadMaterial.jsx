"use client";

import { useState } from "react";

const STEPS = ["Type", "Level & Class", "Subject", "Details", "Upload"];

const TYPES = [
    {
        value: "textbook",
        label: "Textbook",
        description: "PDF or Word document",
        category: "books",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 5.5C4 4.67 4.67 4 5.5 4H11V20H5.5C4.67 20 4 19.33 4 18.5V5.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                <path d="M20 5.5C20 4.67 19.33 4 18.5 4H13V20H18.5C19.33 20 20 19.33 20 18.5V5.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
            </svg>
        ),
    },
    {
        value: "pastpaper",
        label: "Past Paper",
        description: "Exam paper + optional marking scheme",
        category: "pastpapers",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 2.5H14.5L18 6V19.5C18 20.6 17.1 21.5 16 21.5H7C5.9 21.5 5 20.6 5 19.5V4.5C5 3.4 5.9 2.5 7 2.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                <path d="M14 2.5V6.5H18" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                <path d="M8.5 12H14.5M8.5 15H14.5M8.5 9H11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
        ),
    },
];

const LEVELS = [
    { value: "primary", label: "Primary", range: "Std 1\u20138", classes: ["Std 5", "Std 6", "Std 7", "Std 8"] },
    { value: "junior", label: "Junior Sec.", range: "Form 1\u20132", classes: ["Form 1", "Form 2"] },
    { value: "senior", label: "Senior Sec.", range: "Form 3\u20134", classes: ["Form 3", "Form 4"] },
];

const PRIMARY_SUBJECTS = [
    { value: "english", label: "English", emoji: "\uD83D\uDCD6" },
    {value:"chichewa", label: "Chichewa", emoji: "\uD83D\uDC41"},
    { value: "mathematics", label: "Mathematics", emoji: "\uD83D\uDD22" },
    { value: "social-environmental-studies", label: "Social and Environmental Studies", emoji: "\uD83C\uDF10" },
    { value: "science-technology", label: "Science and Technology", emoji: "\uD83D\uDD2C" },
    { value: "life-skills", label: "Life Skills", emoji: "\uD83D\uDCBB" },
    { value: "agriculture", label: "Agriculture", emoji: "\uD83D\uDC17" },
    { value: "bible-knowledge", label: "Bible Knowledge", emoji: "\u270D\uFE0F" },
    { value: "religious-studies", label: "Religious Studies", emoji: "\uD83D\uDD4F" },
];

const SECONDARY_SUBJECTS = [
    { value: "english", label: "English", emoji: "\uD83D\uDCD6" },
    {value:"chichewa", label: "Chichewa", emoji: "\uD83D\uDC41"},
    { value: "mathematics", label: "Mathematics", emoji: "\uD83D\uDD22" },
    {value:"french", label: "French", emoji: "\uD83C\uDDE9\uD83C\uDDF3"},
    {value: "additional-mathematics", label: "Additional Mathematics", emoji: "\uD83D\uDD23"},
    { value: "biology", label: "Biology", emoji: "\uD83E\uDDEC" },
    { value: "chemistry", label: "Chemistry", emoji: "\u2697\uFE0F" },
    { value: "physics", label: "Physics", emoji: "\u26A1" },
    { value: "history", label: "History", emoji: "\uD83D\uDCDC" },
    { value: "geography", label: "Geography", emoji: "\uD83C\uDF0D" },
    { value: "agriculture", label: "Agriculture", emoji: "\uD83D\uDC17" },
    { value: "social-studies", label: "Social Studies", emoji: "\uD83D\uDC66" },
    { value: "life-skills", label: "Life Skills", emoji: "\uD83D\uDCBB" },
    { value: "computer-studies", label: "Computer Studies", emoji: "\uD83D\uDD28" },
    { value: "home-economics", label: "Home Economics", emoji: "\uD83D\uDCB8" },
    { value: "business-studies", label: "Business Studies", emoji: "\uD83D\uDCBC" },
];

const getSubjectOptions = (level) => (level === "primary" ? PRIMARY_SUBJECTS : SECONDARY_SUBJECTS);

const initialState = {
    type: null,
    level: null,
    className: null,
    subject: null,
    title: "",
    author: "",
    file: null,
};

export default function UploadMaterialModal({ open, onClose, onUploaded }) {
    const [step, setStep] = useState(0);
    const [data, setData] = useState(initialState);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [dragActive, setDragActive] = useState(false);

    if (!open) return null;

    const reset = () => {
        setStep(0);
        setData(initialState);
        setError("");
        setUploading(false);
    };

    const handleClose = () => {
        reset();
        onClose?.();
    };

    const update = (patch) => setData((prev) => ({ ...prev, ...patch }));

    const canContinue = () => {
        switch (step) {
            case 0:
                return !!data.type;
            case 1:
                return !!data.level && !!data.className;
            case 2:
                return !!data.subject;
            case 3:
                return data.title.trim().length > 0;
            case 4:
                return !!data.file;
            default:
                return false;
        }
    };

    const goNext = () => {
        if (!canContinue()) return;
        if (step < STEPS.length - 1) setStep(step + 1);
    };

    const goBack = () => {
        setError("");
        if (step > 0) setStep(step - 1);
    };

    const handleFile = (file) => {
        if (!file) return;
        update({ file });
    };

    const handleUpload = async () => {
        if (!canContinue()) return;
        setUploading(true);
        setError("");

        try {
            const typeInfo = TYPES.find((t) => t.value === data.type);
            const formData = new FormData();
            formData.append("file", data.file);
            formData.append("category", typeInfo.category);
            formData.append("title", data.title.trim());
            formData.append("author", data.author.trim());
            formData.append("level", data.level);
            formData.append("className", data.className);
            formData.append("subject", data.subject);

            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const result = await res.json();

            if (!res.ok) {
                setError(result.error || "Upload failed");
                return;
            }

            onUploaded?.(result);
            handleClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const selectedType = TYPES.find((t) => t.value === data.type);
    const selectedLevel = LEVELS.find((l) => l.value === data.level);
    const subjectOptions = getSubjectOptions(data.level);
    const selectedSubject = subjectOptions.find((s) => s.value === data.subject);

    return (
        <div className="umm-overlay" onMouseDown={handleClose}>
            <div className="umm-modal" onMouseDown={(e) => e.stopPropagation()}>
                <div className="umm-header">
                    <h2 className="umm-title">Upload New Material</h2>
                    <button className="umm-close" onClick={handleClose} aria-label="Close">
                        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>

                <div className="umm-steps">
                    {STEPS.map((label, i) => (
                        <div className="umm-step-wrap" key={label}>
                            <div className={`umm-step ${i < step ? "done" : i === step ? "active" : ""}`}>
                                <span className="umm-step-dot">
                                    {i < step ? (
                                        <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    ) : (
                                        i + 1
                                    )}
                                </span>
                                <span className="umm-step-label">{label}</span>
                            </div>
                            {i < STEPS.length - 1 && <span className="umm-step-line" />}
                        </div>
                    ))}
                </div>

                <div className="umm-divider" />

                <div className="umm-body">
                    {step === 0 && (
                        <>
                            <p className="umm-prompt">What type of material are you uploading?</p>
                            <div className="umm-type-grid">
                                {TYPES.map((t) => (
                                    <button
                                        key={t.value}
                                        type="button"
                                        className={`umm-type-card ${data.type === t.value ? "selected" : ""}`}
                                        onClick={() => update({ type: t.value })}
                                    >
                                        <span className={`umm-type-icon icon-${t.value}`}>{t.icon}</span>
                                        <span className="umm-type-label">{t.label}</span>
                                        <span className="umm-type-desc">{t.description}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {step === 1 && (
                        <>
                            <p className="umm-prompt">Who is this material intended for?</p>
                            <h3 className="umm-section-label">Education Level</h3>
                            <div className="umm-level-grid">
                                {LEVELS.map((l) => (
                                    <button
                                        key={l.value}
                                        type="button"
                                        className={`umm-level-card ${data.level === l.value ? "selected" : ""}`}
                                        onClick={() => update({ level: l.value, className: null, subject: null })}
                                    >
                                        <span className="umm-level-label">{l.label}</span>
                                        <span className="umm-level-range">{l.range}</span>
                                    </button>
                                ))}
                            </div>

                            {data.level && (
                                <div className="umm-field">
                                    <label className="umm-label">
                                        Class <span className="umm-required">*</span>
                                    </label>
                                    <select
                                        className="umm-select"
                                        value={data.className || ""}
                                        onChange={(e) => update({ className: e.target.value })}
                                    >
                                        <option value="" disabled>Select class</option>
                                        {selectedLevel?.classes.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <p className="umm-prompt">
                                Select a {selectedLevel?.value === "primary" ? "primary" : "secondary"} subject for this material
                            </p>
                            <h3 className="umm-section-label">
                                {selectedLevel?.label} Subjects
                            </h3>
                            <div className="umm-subject-grid">
                                {subjectOptions.map((s) => (
                                    <button
                                        key={s.value}
                                        type="button"
                                        className={`umm-subject-card ${data.subject === s.value ? "selected" : ""}`}
                                        onClick={() => update({ subject: s.value })}
                                    >
                                        <span className="umm-subject-emoji">{s.emoji}</span>
                                        <span>{s.label}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <p className="umm-prompt">Fill in the material details</p>
                            <div className="umm-field">
                                <label className="umm-label">
                                    Title <span className="umm-required">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="umm-input"
                                    placeholder="e.g. Mathematics for Senior Secondary"
                                    value={data.title}
                                    onChange={(e) => update({ title: e.target.value })}
                                />
                            </div>
                            <div className="umm-field">
                                <label className="umm-label">Author (optional)</label>
                                <input
                                    type="text"
                                    className="umm-input"
                                    placeholder="e.g. Ministry of Education, Malawi"
                                    value={data.author}
                                    onChange={(e) => update({ author: e.target.value })}
                                />
                            </div>
                        </>
                    )}

                    {step === 4 && (
                        <>
                            <p className="umm-prompt">Upload the document file</p>
                            <label
                                className={`umm-dropzone ${dragActive ? "drag" : ""} ${data.file ? "filled" : ""}`}
                                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                                onDragLeave={() => setDragActive(false)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setDragActive(false);
                                    handleFile(e.dataTransfer.files?.[0]);
                                }}
                            >
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="umm-file-input"
                                    onChange={(e) => handleFile(e.target.files?.[0])}
                                />
                                {data.file ? (
                                    <>
                                        <span className="umm-drop-icon done">
                                            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4 10L8 14L16 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </span>
                                        <span className="umm-drop-name">{data.file.name}</span>
                                        <span className="umm-drop-sub">
                                            {(data.file.size / (1024 * 1024)).toFixed(1)} MB &middot; Click to change
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="umm-drop-icon">
                                            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5 17.5V15.83C5 14.83 5.8 14 6.83 14H13.17C14.2 14 15 14.83 15 15.83V17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                                <path d="M10 2.5V12M10 2.5L7 5.5M10 2.5L13 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </span>
                                        <span className="umm-drop-name">Drop file here or click to browse</span>
                                        <span className="umm-drop-sub">PDF, DOC, DOCX &middot; up to 50 MB</span>
                                    </>
                                )}
                            </label>

                            <div className="umm-summary">
                                <span className="umm-summary-heading">Summary</span>
                                <div className="umm-summary-row">
                                    <span>Title</span>
                                    <span>{data.title || "\u2014"}</span>
                                </div>
                                <div className="umm-summary-row">
                                    <span>Type</span>
                                    <span>{selectedType?.label || "\u2014"}</span>
                                </div>
                                <div className="umm-summary-row">
                                    <span>Level</span>
                                    <span>{selectedLevel?.label || "\u2014"}</span>
                                </div>
                                <div className="umm-summary-row">
                                    <span>Class</span>
                                    <span>{data.className || "\u2014"}</span>
                                </div>
                                <div className="umm-summary-row">
                                    <span>Subject</span>
                                    <span>{selectedSubject?.label || "\u2014"}</span>
                                </div>
                            </div>

                            {error && <div className="umm-error">{error}</div>}
                        </>
                    )}
                </div>

                <div className="umm-footer">
                    {step > 0 ? (
                        <button type="button" className="umm-btn-back" onClick={goBack} disabled={uploading}>
                            Back
                        </button>
                    ) : (
                        <span />
                    )}

                    {step < STEPS.length - 1 ? (
                        <button
                            type="button"
                            className="umm-btn-primary"
                            onClick={goNext}
                            disabled={!canContinue()}
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="umm-btn-primary"
                            onClick={handleUpload}
                            disabled={!canContinue() || uploading}
                        >
                            {uploading ? (
                                "Uploading\u2026"
                            ) : (
                                <>
                                    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="umm-btn-icon">
                                        <path d="M5 17.5V15.83C5 14.83 5.8 14 6.83 14H13.17C14.2 14 15 14.83 15 15.83V17.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                                        <path d="M10 2.5V12M10 2.5L7 5.5M10 2.5L13 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Upload Material
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            <style>{`
                * { box-sizing: border-box; }

                .umm-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 1000;
                    background: rgba(15, 26, 18, 0.45);
                    backdrop-filter: blur(2px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1.5rem;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                }

                .umm-modal {
                    width: 100%;
                    max-width: 560px;
                    max-height: 88vh;
                    overflow-y: auto;
                    background: #fff;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(15, 26, 18, 0.25);
                    animation: umm-pop 0.18s ease-out;
                }

                @keyframes umm-pop {
                    from { opacity: 0; transform: translateY(8px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }

                .umm-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1.75rem 1.75rem 1.25rem;
                }
                .umm-title {
                    font-family: Georgia, 'Times New Roman', serif;
                    font-size: 1.35rem;
                    font-weight: 700;
                    color: #0f1a12;
                }
                .umm-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #9ca3af;
                    padding: 0.25rem;
                    display: flex;
                    border-radius: 6px;
                    transition: color 0.15s, background 0.15s;
                }
                .umm-close:hover { color: #374151; background: #f3f4f6; }
                .umm-close svg { width: 18px; height: 18px; }

                .umm-steps {
                    display: flex;
                    align-items: center;
                    padding: 0 1.75rem;
                    overflow-x: auto;
                }
                .umm-step-wrap {
                    display: flex;
                    align-items: center;
                    flex: none;
                }
                .umm-step {
                    display: flex;
                    align-items: center;
                    gap: 0.45rem;
                    white-space: nowrap;
                }
                .umm-step-dot {
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.72rem;
                    font-weight: 700;
                    background: #e5e7eb;
                    color: #9ca3af;
                    flex-shrink: 0;
                }
                .umm-step-dot svg { width: 11px; height: 11px; }
                .umm-step.active .umm-step-dot {
                    background: #1B4D2E;
                    color: #fff;
                    box-shadow: 0 0 0 3px rgba(27,77,46,0.15);
                }
                .umm-step.done .umm-step-dot { background: #1B4D2E; color: #fff; }
                .umm-step-label {
                    font-size: 0.8rem;
                    font-weight: 500;
                    color: #9ca3af;
                }
                .umm-step.active .umm-step-label,
                .umm-step.done .umm-step-label { color: #111827; }
                .umm-step-line {
                    width: 20px;
                    height: 1px;
                    background: #e5e7eb;
                    margin: 0 0.5rem;
                    flex-shrink: 0;
                }

                .umm-divider {
                    height: 1px;
                    background: #eceef0;
                    margin: 1.25rem 0 0;
                }

                .umm-body {
                    padding: 1.5rem 1.75rem;
                    min-height: 260px;
                }

                .umm-prompt {
                    font-size: 0.92rem;
                    color: #6b7280;
                    margin-bottom: 1.25rem;
                }

                .umm-section-label {
                    font-size: 0.88rem;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 0.75rem;
                }

                /* Type step */
                .umm-type-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                .umm-type-card {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 0.6rem;
                    padding: 1.5rem 1.25rem;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 14px;
                    background: #fff;
                    cursor: pointer;
                    text-align: left;
                    transition: border-color 0.15s, background 0.15s;
                }
                .umm-type-card:hover { border-color: #c7d2cc; }
                .umm-type-card.selected { border-color: #1B4D2E; background: #f3f7f4; }
                .umm-type-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .umm-type-icon svg { width: 22px; height: 22px; }
                .icon-textbook { background: #ede9fe; color: #6d28d9; }
                .icon-pastpaper { background: #fef3c7; color: #b45309; }
                .umm-type-label { font-size: 1rem; font-weight: 700; color: #0f1a12; }
                .umm-type-desc { font-size: 0.8rem; color: #6b7280; line-height: 1.4; }

                /* Level step */
                .umm-level-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                }
                .umm-level-card {
                    padding: 1.1rem 0.5rem;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 12px;
                    background: #fff;
                    cursor: pointer;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    transition: border-color 0.15s, background 0.15s;
                }
                .umm-level-card:hover { border-color: #c7d2cc; }
                .umm-level-card.selected { border-color: #1B4D2E; background: #f3f7f4; }
                .umm-level-label { font-size: 0.9rem; font-weight: 700; color: #0f1a12; }
                .umm-level-card.selected .umm-level-label { color: #1B4D2E; }
                .umm-level-range { font-size: 0.75rem; color: #9ca3af; }

                /* Subject step */
                .umm-subject-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.75rem;
                }
                .umm-subject-card {
                    display: flex;
                    align-items: center;
                    gap: 0.65rem;
                    padding: 0.85rem 1rem;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 12px;
                    background: #fff;
                    cursor: pointer;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #111827;
                    text-align: left;
                    transition: border-color 0.15s, background 0.15s;
                }
                .umm-subject-card:hover { border-color: #c7d2cc; }
                .umm-subject-card.selected { border-color: #1B4D2E; background: #f3f7f4; }
                .umm-subject-emoji { font-size: 1.15rem; }

                /* Fields */
                .umm-field { margin-bottom: 1.1rem; }
                .umm-label {
                    display: block;
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 0.5rem;
                }
                .umm-required { color: #dc2626; }
                .umm-input, .umm-select {
                    width: 100%;
                    height: 46px;
                    padding: 0 0.9rem;
                    font-size: 0.9rem;
                    color: #111827;
                    background: #f9fafb;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 10px;
                    outline: none;
                    transition: border-color 0.15s, box-shadow 0.15s;
                }
                .umm-input::placeholder { color: #b0b8c4; }
                .umm-input:focus, .umm-select:focus {
                    border-color: #1B4D2E;
                    box-shadow: 0 0 0 3px rgba(27,77,46,0.1);
                    background: #fff;
                }
                .umm-select { cursor: pointer; }

                /* Dropzone */
                .umm-dropzone {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 0.35rem;
                    padding: 2.5rem 1.5rem;
                    border: 1.5px dashed #a7c4ae;
                    border-radius: 14px;
                    background: #f3f7f4;
                    cursor: pointer;
                    text-align: center;
                    transition: border-color 0.15s, background 0.15s;
                }
                .umm-dropzone:hover, .umm-dropzone.drag { border-color: #1B4D2E; background: #ecf3ee; }
                .umm-dropzone.filled { border-style: dashed; border-color: #1B4D2E; }
                .umm-file-input {
                    position: absolute;
                    inset: 0;
                    opacity: 0;
                    cursor: pointer;
                }
                .umm-drop-icon {
                    width: 46px;
                    height: 46px;
                    border-radius: 12px;
                    background: #e5ece7;
                    color: #4b5f52;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 0.3rem;
                }
                .umm-drop-icon svg { width: 22px; height: 22px; }
                .umm-drop-icon.done { background: #dcfce7; color: #16803d; }
                .umm-drop-name { font-size: 0.92rem; font-weight: 700; color: #0f1a12; }
                .umm-drop-sub { font-size: 0.78rem; color: #8a9690; }

                /* Summary */
                .umm-summary {
                    margin-top: 1.25rem;
                    background: #f3f7f4;
                    border-radius: 12px;
                    padding: 1rem 1.1rem;
                }
                .umm-summary-heading {
                    display: block;
                    font-size: 0.68rem;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: #7c8b81;
                    margin-bottom: 0.6rem;
                }
                .umm-summary-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.85rem;
                    padding: 0.3rem 0;
                    color: #374151;
                }
                .umm-summary-row span:first-child { color: #6b7280; }
                .umm-summary-row span:last-child { font-weight: 600; color: #0f1a12; text-transform: capitalize; }

                .umm-error {
                    margin-top: 1rem;
                    padding: 0.65rem 0.9rem;
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    color: #b91c1c;
                    border-radius: 8px;
                    font-size: 0.83rem;
                }

                .umm-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.85rem;
                    padding: 1.25rem 1.75rem 1.75rem;
                }
                .umm-btn-back, .umm-btn-primary {
                    height: 46px;
                    border-radius: 10px;
                    font-size: 0.9rem;
                    font-weight: 700;
                    cursor: pointer;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    transition: background 0.15s, opacity 0.15s;
                }
                .umm-btn-back {
                    padding: 0 1.4rem;
                    background: #fff;
                    color: #374151;
                    border: 1.5px solid #e5e7eb;
                }
                .umm-btn-back:hover { background: #f9fafb; }
                .umm-btn-primary {
                    flex: 1;
                    background: #1B4D2E;
                    color: #fff;
                }
                .umm-btn-primary:hover:not(:disabled) { background: #163d24; }
                .umm-btn-primary:disabled { background: #a7c4ae; cursor: not-allowed; }
                .umm-btn-icon { width: 17px; height: 17px; }

                @media (max-width: 520px) {
                    .umm-type-grid { grid-template-columns: 1fr; }
                    .umm-level-grid { grid-template-columns: 1fr; }
                    .umm-subject-grid { grid-template-columns: 1fr; }
                    .umm-body { padding: 1.25rem; }
                    .umm-header { padding: 1.5rem 1.25rem 1rem; }
                    .umm-steps { padding: 0 1.25rem; }
                    .umm-footer { padding: 1rem 1.25rem 1.5rem; }
                }
            `}</style>
        </div>
    );
}