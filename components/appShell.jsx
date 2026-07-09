"use client";

import Sidebar from './sideBar';
import GlassDock from './GlassDock';
import MobileHeader from './mobileHeader';
import {
    LayoutGrid, Package, Users, BarChart3, Settings,
    Home, Download, Bookmark, User,
} from 'lucide-react';

const adminNav = [
    { title: 'Dashboard', icon: LayoutGrid, href: '/admin' },
    { title: 'Materials', icon: Package, href: '/admin/materials' },
    { title: 'Users', icon: Users, href: '/admin/users' },
    { title: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
];

const studentNav = [
    { title: 'Home', icon: Home, href: '/student' },
    { title: 'Download', icon: Download, href: '/student/downloads' },
    { title: 'Bookmarks', icon: Bookmark, href: '/student/bookmarks' },
    { title: 'Profile', icon: User, href: '/student/profile' },
];

export default function AppShell({
                                     children,
                                     variant,
                                     activeTitle,
                                     level = 'Form 3 — Senior Secondary',
                                     stats = [
                                         { label: 'Users', value: '4.2K' },
                                         { label: 'Materials', value: '1.8K' },
                                     ],
                                 }) {
    const isAdmin = variant === 'admin';
    const items = isAdmin ? adminNav : studentNav;

    return (
        <div className={cnBg(isAdmin)}>
            <Sidebar
                variant={variant}
                items={items}
                activeTitle={activeTitle}
                badge={isAdmin ? 'ADMIN' : undefined}
                level={!isAdmin ? level : undefined}
                stats={isAdmin ? stats : undefined}
                footerItem={isAdmin ? { title: 'Settings', icon: Settings, href: '/admin/settings' } : undefined}
            />

            <div className="flex-1 flex flex-col md:pl-80">
                <MobileHeader initials="TB" hasNotification />
                <main className="flex-1 pb-28 md:pb-8">{children}</main>
            </div>

            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
                <GlassDock items={items} />
            </div>
        </div>
    );
}

function cnBg(isAdmin) {
    return `flex min-h-screen ${isAdmin ? 'bg-[#f8f9f8]' : 'bg-white'}`;
}