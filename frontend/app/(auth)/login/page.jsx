"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, setAuthToken, saveUser } from "../../../lib/api";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [stats, setStats] = useState({ materials: 0, students: 0 });
    const router = useRouter();

    useEffect(() => {
        // Fetch public stats for landing page
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/v1/stats");
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            }
        };

        fetchStats();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }
        setLoading(true);
        try {
            const res = await apiFetch("/api/v1/auth/login", {
                method: "POST",
                body: JSON.stringify({ identifier: email, password }),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.detail || "Login failed");
            }
            const data = await res.json();
            // store token and user
            setAuthToken(data.access_token);
            saveUser(data.user);
            // redirect to student dashboard
            router.push("/student");
        } catch (err) {
            setError(err.message || "Login failed");
            setLoading(false);
        }
    };

    return (
        <div className="login-root">
            {/* Left panel — decorative brand side */}
            <aside className="brand-panel">
                <div className="brand-inner">
                    <div className="brand-badge">Academic Resource Sharing Platform</div>
                    <h1 className="brand-headline">
                        Share.<br />Learn.<br />Grow.
                    </h1>
                    <p className="brand-sub">
                        Access thousands of academic resources shared by students and
                        educators across Malawi and beyond.
                    </p>
                    <div className="brand-stats">
                         <div className="stat">
                             <span className="stat-num">{stats.materials.toLocaleString()}</span>
                             <span className="stat-label">Resources</span>
                         </div>
                         <div className="stat-divider" />
                         <div className="stat">
                             <span className="stat-num">{stats.students.toLocaleString()}</span>
                             <span className="stat-label">Students</span>
                         </div>
                     </div>
                </div>
                <div className="brand-video-wrap">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="brand-video"
                    >
                        <source src="/background-video.mp4" type="video/mp4" />
                    </video>
                    <div className="brand-video-overlay" />
                </div>
            </aside>

            {/* Right panel — login form */}
            <main className="form-panel">
                <div className="form-container">
                    {/* Logo Icon */}
                    <div className="logo-wrap">
                        <div className="brand-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 10L12 5L2 10L12 15L22 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M6 12V17C6 17 9 19 12 19C15 19 18 17 18 17V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>


                    <div className="form-header">
                        <h2 className="form-title">Welcome back</h2>
                        <p className="form-subtitle">Sign in to your Nsatitsi account</p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                        {error && (
                            <div className="error-banner" role="alert">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                                    <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                {error}
                            </div>
                        )}

                        <div className="field">
                            <label htmlFor="email" className="field-label">Email address</label>
                            <div className="input-wrap">
                                <svg className="input-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.5 5.5A1.5 1.5 0 014 4h12a1.5 1.5 0 011.5 1.5v9A1.5 1.5 0 0116 16H4a1.5 1.5 0 01-1.5-1.5v-9z" stroke="currentColor" strokeWidth="1.4"/>
                                    <path d="M2.5 6l7.5 5 7.5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                                </svg>
                                <input
                                    id="email"
                                    type="email"
                                    className="field-input"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="field">
                            <div className="field-label-row">
                                <label htmlFor="password" className="field-label">Password</label>
                                <a href="/forgot-password" className="forgot-link">Forgot password?</a>
                            </div>
                            <div className="input-wrap">
                                <svg className="input-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="3" y="9" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                                    <path d="M6.5 9V6.5a3.5 3.5 0 017 0V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                                </svg>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="field-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-pw"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.4"/>
                                            <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
                                            <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.4"/>
                                            <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="remember-row">
                            <label className="remember-label">
                                <input type="checkbox" className="remember-check" />
                                <span>Remember me</span>
                            </label>
                        </div>

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? (
                                <span className="btn-loading">
                  <svg className="spinner" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5"/>
                    <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                  Signing in…
                </span>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>

                    <p className="signup-prompt">
                        Don&apos;t have an account?{" "}
                        <a href="/register" className="signup-link">Create one — it&apos;s free</a>
                    </p>

                    <div className="divider">
                        <span>or continue with</span>
                    </div>

                    <div className="social-row">
                        <button type="button" className="social-btn">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Google
                        </button>
                        <button type="button" className="social-btn">
                            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                            </svg>
                            GitHub
                        </button>
                    </div>
                </div>
            </main>

            <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          display: flex;
          min-height: 100vh;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background: #f5f6f7;
        }

        /* ── Brand panel ── */
        .brand-panel {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42%;
          background: linear-gradient(155deg, #1B4D2E 0%, #0f2d1a 100%);
          overflow: hidden;
          padding: 3rem 3.5rem;
        }

        .brand-inner {
          position: relative;
          z-index: 2;
          color: #fff;
          max-width: 340px;
        }

        .brand-badge {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 100px;
          padding: 0.3rem 0.85rem;
          margin-bottom: 2rem;
        }

        .brand-headline {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: clamp(2.4rem, 3.5vw, 3.2rem);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 1.25rem;
          letter-spacing: -0.01em;
        }

        .brand-sub {
          font-size: 0.95rem;
          line-height: 1.65;
          color: rgba(255,255,255,0.72);
          margin-bottom: 2.5rem;
        }

        .brand-stats {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.12);
        }

        .stat { display: flex; flex-direction: column; gap: 0.2rem; }
        .stat-num {
          font-family: 'Georgia', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
        }
        .stat-label {
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }
        .stat-divider {
          width: 1px;
          height: 32px;
          background: rgba(255,255,255,0.15);
        }

        .brand-video-wrap {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }
        .brand-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .brand-video-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(155deg, rgba(27,77,46,0.85) 0%, rgba(15,45,26,0.9) 100%);
        }

        /* ── Form panel ── */
        .form-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1.5rem;
          background: #f5f6f7;
          overflow-y: auto;
        }

        .form-container {
          width: 100%;
          max-width: 420px;
          background: #fff;
          border-radius: 16px;
          padding: 2.75rem 2.5rem 2.25rem;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04);
        }

        .logo-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 0.75rem;
        }

        .brand-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: #1B4D2E;
          color: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(27, 77, 46, 0.2);
        }
        .brand-icon svg {
          width: 32px;
          height: 32px;
        }

        .mobile-intro {
          display: none;
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .mobile-intro p {
          font-size: 0.95rem;
          color: #1B4D2E;
          font-weight: 500;
          line-height: 1.4;
        }

        .form-header { text-align: center; margin-bottom: 1.75rem; }
        .form-title {
          font-family: 'Georgia', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #0f1a12;
          margin-bottom: 0.35rem;
        }
        .form-subtitle {
          font-size: 0.88rem;
          color: #6b7280;
        }

        /* Error */
        .error-banner {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.84rem;
          color: #b91c1c;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 0.65rem 0.9rem;
          margin-bottom: 1.25rem;
        }

        /* Fields */
        .field { margin-bottom: 1.1rem; }
        .field-label {
          display: block;
          font-size: 0.82rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.45rem;
          letter-spacing: 0.01em;
        }
        .field-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.45rem;
        }
        .forgot-link {
          font-size: 0.78rem;
          color: #1B4D2E;
          text-decoration: none;
          font-weight: 500;
        }
        .forgot-link:hover { text-decoration: underline; }

        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 0.85rem;
          width: 17px;
          height: 17px;
          color: #9ca3af;
          pointer-events: none;
          flex-shrink: 0;
        }
        .field-input {
          width: 100%;
          height: 44px;
          padding: 0 2.75rem 0 2.65rem;
          font-size: 0.9rem;
          color: #111827;
          background: #f9fafb;
          border: 1.5px solid #e5e7eb;
          border-radius: 9px;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .field-input::placeholder { color: #b0b8c4; }
        .field-input:focus {
          border-color: #1B4D2E;
          box-shadow: 0 0 0 3px rgba(27,77,46,0.1);
          background: #fff;
        }

        .toggle-pw {
          position: absolute;
          right: 0.75rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          color: #9ca3af;
        }
        .toggle-pw svg { width: 18px; height: 18px; }
        .toggle-pw:hover { color: #4b5563; }

        /* Remember */
        .remember-row { margin-bottom: 1.5rem; }
        .remember-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.83rem;
          color: #4b5563;
          cursor: pointer;
          user-select: none;
        }
        .remember-check {
          width: 15px;
          height: 15px;
          accent-color: #1B4D2E;
          cursor: pointer;
        }

        /* Submit */
        .submit-btn {
          width: 100%;
          height: 46px;
          background: #1B4D2E;
          color: #fff;
          font-size: 0.93rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          border: none;
          border-radius: 9px;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
          box-shadow: 0 2px 8px rgba(27,77,46,0.25);
        }
        .submit-btn:hover:not(:disabled) {
          background: #163d24;
          box-shadow: 0 4px 16px rgba(27,77,46,0.3);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(1px); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .btn-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
        }
        .spinner {
          width: 18px;
          height: 18px;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Sign up */
        .signup-prompt {
          text-align: center;
          font-size: 0.84rem;
          color: #6b7280;
          margin-top: 1.25rem;
        }
        .signup-link {
          color: #1B4D2E;
          font-weight: 600;
          text-decoration: none;
        }
        .signup-link:hover { text-decoration: underline; }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 1.4rem 0 1.1rem;
          font-size: 0.78rem;
          color: #9ca3af;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }

        /* Social */
        .social-row { display: flex; gap: 0.75rem; }
        .social-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          height: 42px;
          background: #fff;
          border: 1.5px solid #e5e7eb;
          border-radius: 9px;
          font-size: 0.85rem;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }
        .social-btn svg { width: 18px; height: 18px; flex-shrink: 0; }
        .social-btn:hover { background: #f9fafb; border-color: #d1d5db; }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .brand-panel { display: none; }
          .form-panel { background: #fff; padding: 1.5rem 1rem; }
          .form-container {
            box-shadow: none;
            padding: 1.5rem 0;
            max-width: 400px;
            backdrop-filter: none;
            background: #fff;
          }
          .mobile-intro {
            display: block;
          }
        }

        @media (max-width: 480px) {
          .form-container { 
            padding: 2rem 1.5rem;
            border-radius: 20px;
          }
          .form-title { font-size: 1.4rem; }
          .social-row { 
            flex-direction: row;
            justify-content: center;
            gap: 0.6rem;
          }
          .social-btn {
            flex: 0 0 auto;
            width: 44px;
            height: 44px;
            padding: 0;
            font-size: 0;
          }
          .social-btn svg { width: 20px; height: 20px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .spinner { animation: none; }
        }
      `}</style>
        </div>
    );
}