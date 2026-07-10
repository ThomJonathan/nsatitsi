'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const GlassDock = React.forwardRef(function GlassDock(
    { items = [], className, dockClassName, ...props },
    ref
) {
    const pathname = usePathname();

    const isActiveItem = (item) => {
        if (!item.href) return false;
        if (pathname === item.href) return true;
        const isBaseRoute = item.href === '/admin' || item.href === '/student';
        if (isBaseRoute) return pathname === item.href;
        return item.href !== '/' && pathname.startsWith(item.href + '/');
    };

    return (
        <div ref={ref} className={cn('w-full flex justify-center px-6 pb-4', className)} {...props}>
            <nav
                aria-label="Quick navigation"
                className={cn(
                    'flex items-center justify-center gap-2 bg-[#22281F] rounded-full px-3 py-1.5 shadow-lg',
                    dockClassName
                )}
            >
                {items.map((item) => {
                    const Icon = item.icon;
                    const active = isActiveItem(item);

                    const content = (
                        <div
                            className={cn(
                                'flex flex-col items-center gap-0.5 px-3.5 py-1 rounded-full transition',
                                active ? 'bg-[#1B4D2E] text-white' : 'text-[#9CA3AF] hover:text-white'
                            )}
                        >
                            {Icon ? <Icon className="h-4 w-4" strokeWidth={1.5} /> : null}
                            <span className="text-[9px] leading-none font-medium">{item.title}</span>
                        </div>
                    );

                    if (item.href) {
                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                aria-current={active ? 'page' : undefined}
                            >
                                {content}
                            </Link>
                        );
                    }

                    return (
                        <button
                            key={item.title}
                            type="button"
                            onClick={item.onClick}
                        >
                            {content}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
});

GlassDock.displayName = 'GlassDock';
export default GlassDock;