"use client";
import { useState } from "react";
import UploadMaterialModal from "@/components/uploadMaterial";

export default function AdminMaterialsPage() {
    const [modalOpen, setModalOpen] = useState(false);

    const handleUploaded = (result) => {
        // result = { success, key, category, name }
        console.log("Uploaded:", result);
        // e.g. refresh your materials list here
    };

    return (
        <div className="upload-page">
            <button
                onClick={() => setModalOpen(true)}
                className="upload-card-trigger"
            >
                <span className="upload-icon">+</span>
                <span className="upload-text-wrap">
                    <span className="upload-title">Upload New Material</span>
                    <span className="upload-subtitle">Add textbooks, past papers, and answer sheets</span>
                </span>
            </button>

            <UploadMaterialModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onUploaded={handleUploaded}
            />

            <style>{`
                .upload-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    background: #f5f6f7;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                }

                .upload-card-trigger {
                    width: 100%;
                    max-width: 460px;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    text-align: left;
                    background: #fff;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 16px;
                    padding: 1.25rem 1.2rem;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
                    transition: border-color 0.15s, box-shadow 0.15s, transform 0.1s;
                }

                .upload-card-trigger:hover {
                    border-color: #1B4D2E;
                    box-shadow: 0 8px 26px rgba(27, 77, 46, 0.14);
                }

                .upload-card-trigger:active {
                    transform: translateY(1px);
                }

                .upload-icon {
                    width: 42px;
                    height: 42px;
                    flex-shrink: 0;
                    border-radius: 12px;
                    background: #1B4D2E;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                    font-weight: 700;
                    line-height: 1;
                }

                .upload-text-wrap {
                    display: flex;
                    flex-direction: column;
                    gap: 0.2rem;
                }

                .upload-title {
                    color: #0f1a12;
                    font-size: 1rem;
                    font-weight: 700;
                }

                .upload-subtitle {
                    color: #6b7280;
                    font-size: 0.85rem;
                    line-height: 1.4;
                }
            `}</style>
        </div>
    );
}