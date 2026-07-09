"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function Sidebar({
    items = [],
    activeTitle,
    badge,
    level,
    stats,
    footerItem,
}) {
const pathname = usePathname();
const router = useRouter();

const handleLogout = () => {
    // Add logout logic here if needed
    router.push('/login');
    };

    const isActiveItem = (item) => {
        if (activeTitle) {
            return item.title === activeTitle;
        }

        if (pathname === item.href) return true;

        // If item.href is a base path (like /admin or /student), don't allow partial matches
        // unless they are explicitly marked as active via activeTitle
        const isBaseRoute = item.href === '/admin' || item.href === '/student';
        if (isBaseRoute) return pathname === item.href;

        return (
            item.href !== '/' && pathname.startsWith(item.href + '/')
        );
    };

    return (
        <aside className="hidden md:flex md:w-80 md:flex-col md:justify-between md:px-6 md:py-8 border-r border-white/10 bg-gradient-to-b from-[#1B4D2E] via-[#184427] to-[#143821] text-white md:fixed md:top-0 md:bottom-0 md:left-0 z-30 shadow-[0_0_40px_rgba(27,77,46,0.18)]">
            <div className="space-y-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12 text-white ring-1 ring-white/15">
                            <span className="text-sm font-bold">N</span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">
                                Nsatitsi
                            </p>
                            <p className="text-xs text-white/70">
                                Academic resource hub
                            </p>
                        </div>
                    </div>

                    {badge ? (
                        <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[0.7rem] font-semibold tracking-[0.18em] text-white/85">
                            {badge}
                        </span>
                    ) : null}

                    {level ? (
                        <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm text-white px-4 py-3 text-sm shadow-sm">
                            <p className="text-[0.72rem] uppercase tracking-[0.18em] text-white/60">
                                Student level
                            </p>
                            <p className="mt-1 font-medium">{level}</p>
                        </div>
                    ) : null}
                </div>

                {stats?.length ? (
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm px-4 py-3 shadow-sm"
                            >
                                <p className="text-xs text-white/65">
                                    {stat.label}
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-white">
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : null}

                <nav aria-label="Primary navigation">
                    <ul className="space-y-2">
                        {items.map((item) => {
                            const Icon = item.icon;
                            const active = isActiveItem(item);

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        aria-current={active ? 'page' : undefined}
                                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${active ? 'bg-white text-[#1B4D2E] shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                                    >
                                        {Icon ? <Icon className="h-4.5 w-4.5 shrink-0" /> : null}
                                        <span>{item.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>

            {footerItem ? (
                <div className="pt-6 space-y-2">
                    <Link
                        href={footerItem.href}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium transition text-white/80 hover:bg-white/15 hover:text-white"
                    >
                        {footerItem.icon ? <footerItem.icon className="h-4.5 w-4.5 shrink-0" /> : null}
                        <span>{footerItem.title}</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium transition text-white/80 hover:bg-[#fee2e2] hover:text-[#991b1b] hover:border-[#fecaca]"
                    >
                        <LogOut className="h-4.5 w-4.5 shrink-0" />
                        <span>Logout</span>
                    </button>
                </div>
            ) : (
                <div className="pt-6">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium transition text-white/80 hover:bg-[#fee2e2] hover:text-[#991b1b] hover:border-[#fecaca]"
                    >
                        <LogOut className="h-4.5 w-4.5 shrink-0" />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </aside>
    );
}