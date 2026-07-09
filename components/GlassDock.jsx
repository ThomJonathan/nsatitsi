"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function GlassDock({ items = [] }) {
    const pathname = usePathname();

    return (
        <nav
            aria-label="Quick navigation"
            className="w-full border-t border-black/5 bg-white/95 px-3 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md"
        >
            <ul className="flex items-center justify-around">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = (() => {
                        if (pathname === item.href) return true;
                        const isBaseRoute = item.href === '/admin' || item.href === '/student';
                        if (isBaseRoute) return pathname === item.href;
                        return item.href !== '/' && pathname.startsWith(item.href + '/');
                    })();

                    return (
                        <li key={item.href} className="flex-1">
                            <Link
                                href={item.href}
                                aria-current={isActive ? 'page' : undefined}
                                className={`flex flex-col items-center gap-1.5 py-1 transition ${
                                    isActive
                                        ? 'text-[#1B4D2E]'
                                        : 'text-[#8a8a80] hover:text-[#161613]'
                                }`}
                            >
                                {Icon ? <Icon className="h-6 w-6" strokeWidth={2} /> : null}
                                <span className="text-[12px] leading-none font-semibold">{item.title}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
