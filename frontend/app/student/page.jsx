"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StudentHome from '../../components/student/studentHome';
import { apiFetch } from '../../lib/api';

export default function StudentDashboardPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = typeof window !== "undefined" ? localStorage.getItem('nsatitsi_token') : null;
                if (!token) {
                    router.push('/login');
                    return;
                }

                const res = await apiFetch('/api/v1/users/me');
                if (!res.ok) {
                    router.push('/login');
                    return;
                }
                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error("Failed to fetch user:", err);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <StudentHome
            name={user.full_name || 'Student'}
            form={user.school_class || 'Form 1'}
            school={user.school_name || 'School'}
        />
    );
}