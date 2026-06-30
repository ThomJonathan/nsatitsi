"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function GlassDock({ items = [] }) {
    const pathname = usePathname();

    return (
        <nav
            aria-label="Quick navigation"
            className="w-full border-t border-black/5 bg-white px-3 py-2 shadow-sm"
        >
            <ul className="flex items-center justify-around">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        pathname === item.href ||
                        (item.href !== '/' && pathname.startsWith(item.href + '/'));

                    return (
                        <li key={item.href} className="flex-1">
                            <Link
                                href={item.href}
                                aria-current={isActive ? 'page' : undefined}
                                className={`flex flex-col items-center gap-1 py-1 transition ${
                                    isActive
                                        ? 'text-[#1B4D2E]'
                                        : 'text-[#9a9a90] hover:text-[#161613]'
                                }`}
                            >
                                {Icon ? <Icon className="h-5 w-5" strokeWidth={2} /> : null}
                                <span className="text-[11px] leading-none">{item.title}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

