"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({
    items = [],
    activeTitle,
    variant = 'student',
    badge,
    level,
    stats,
    footerItem,
}) {
    const pathname = usePathname();
    const isAdmin = variant === 'admin';

    const isActiveItem = (item) => {
        if (activeTitle) {
            return item.title === activeTitle;
        }

        return (
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href + '/'))
        );
    };

    return (
        <aside className="hidden md:flex md:w-80 md:flex-col md:justify-between md:px-6 md:py-8 border-r border-black/5 bg-white text-[#161613]">
            <div className="space-y-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1B4D2E] text-white">
                            <span className="text-sm font-bold">N</span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[#161613]">
                                Nsatitsi
                            </p>
                            <p className="text-xs text-[#6b6b63]">
                                Academic resource hub
                            </p>
                        </div>
                    </div>

                    {badge ? (
                        <span className="inline-flex rounded-full border border-black/10 bg-black/5 px-3 py-1 text-[0.7rem] font-semibold tracking-[0.18em] text-[#161613]/75">
                            {badge}
                        </span>
                    ) : null}

                    {level ? (
                        <div className="rounded-2xl border border-black/5 bg-black/[0.03] text-[#4c4c44] px-4 py-3 text-sm">
                            <p className="text-[0.72rem] uppercase tracking-[0.18em] opacity-70">
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
                                className="rounded-2xl border border-black/5 bg-black/[0.03] px-4 py-3"
                            >
                                <p className="text-xs text-[#6b6b63]">
                                    {stat.label}
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-[#161613]">
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
                                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${active ? 'bg-[#1B4D2E] text-white' : 'text-[#4b4b43] hover:bg-black/[0.04] hover:text-[#161613]'}`}
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
                <div className="pt-6">
                    <Link
                        href={footerItem.href}
                        className="flex items-center gap-3 rounded-2xl border border-black/5 bg-black/[0.03] px-4 py-3 text-sm font-medium transition text-[#4b4b43] hover:bg-black/[0.05] hover:text-[#161613]"
                    >
                        {footerItem.icon ? <footerItem.icon className="h-4.5 w-4.5 shrink-0" /> : null}
                        <span>{footerItem.title}</span>
                    </Link>
                </div>
            ) : null}
        </aside>
    );
}