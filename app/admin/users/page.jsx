"use client";

import { useState } from 'react';
import { Search, ChevronDown, MoreHorizontal } from 'lucide-react';

const MOCK_USERS = [
    {
        id: 1,
        name: "Chimwemwe Banda",
        email: "cbanda@school.mw",
        school: "St. Patrick's Secondary",
        level: "Senior Secondary",
        form: "Form 3",
        district: "Blantyre",
        downloads: 14,
        lastActive: "Today",
        initials: "CB",
        avatarBg: "bg-emerald-700"
    },
    {
        id: 2,
        name: "Takondwa Phiri",
        email: "tphiri@gmail.com",
        school: "Kamuzu Academy",
        level: "Senior Secondary",
        form: "Form 4",
        district: "Kasungu",
        downloads: 22,
        lastActive: "Yesterday",
        initials: "TP",
        avatarBg: "bg-green-700"
    },
    {
        id: 3,
        name: "Madalitso Chirwa",
        email: "mchirwa@mail.mw",
        school: "Chichiri Secondary",
        level: "Junior Secondary",
        form: "Form 2",
        district: "Blantyre",
        downloads: 7,
        lastActive: "2 days ago",
        initials: "MC",
        avatarBg: "bg-emerald-800"
    },
    {
        id: 4,
        name: "Kondwani Mwale",
        email: "kmwale@school.mw",
        school: "Zomba Catholic",
        level: "Junior Secondary",
        form: "Form 1",
        district: "Zomba",
        downloads: 4,
        lastActive: "3 days ago",
        initials: "KM",
        avatarBg: "bg-green-800"
    },
    {
        id: 5,
        name: "Tiwonge Nkhata",
        email: "tnkhata@gmail.com",
        school: "Mzuzu Primary",
        level: "Primary",
        form: "Standard 7",
        district: "Mzuzu",
        downloads: 9,
        lastActive: "Today",
        initials: "TN",
        avatarBg: "bg-emerald-600"
    },
    {
        id: 6,
        name: "Ayamike Gondwe",
        email: "agondwe@mail.mw",
        school: "Lilongwe Girls",
        level: "Senior Secondary",
        form: "Form 3",
        district: "Lilongwe",
        downloads: 31,
        lastActive: "1 week ago",
        initials: "AG",
        avatarBg: "bg-emerald-900"
    },
    {
        id: 7,
        name: "Mphatso Tembo",
        email: "mtembo@school.mw",
        school: "Dedza Secondary",
        level: "Senior Secondary",
        form: "Form 4",
        district: "Dedza",
        downloads: 19,
        lastActive: "Today",
        initials: "MT",
        avatarBg: "bg-green-900"
    },
    {
        id: 8,
        name: "Lusungu Mkandawire",
        email: "lmkand@gmail.com",
        school: "Henry Henderson",
        level: "Junior Secondary",
        form: "Form 2",
        district: "Blantyre",
        downloads: 11,
        lastActive: "4 days ago",
        initials: "LM",
        avatarBg: "bg-emerald-700"
    }
];

export default function UsersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [levelFilter, setLevelFilter] = useState("All Levels");
    const [districtFilter, setDistrictFilter] = useState("All Districts");

    const filteredUsers = MOCK_USERS.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             user.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLevel = levelFilter === "All Levels" || user.level === levelFilter;
        const matchesDistrict = districtFilter === "All Districts" || user.district === districtFilter;
        return matchesSearch && matchesLevel && matchesDistrict;
    });

    return (
        <div className="px-4 md:px-10 py-5 md:py-8">
            {/* Breadcrumb + Search Bar (Header style from image) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#9a9a90]">Admin</span>
                    <span className="text-[#9a9a90]">/</span>
                    <span className="font-medium text-[#161613]">Users</span>
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a9a90]" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-[#f1f3f1] border-none rounded-2xl pl-11 pr-4 py-2.5 text-sm placeholder:text-[#9a9a90] text-[#161613] focus:outline-none focus:ring-2 focus:ring-[#1B4D2E]/20 transition-all"
                    />
                </div>
            </div>

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#161613]">Student Users</h1>
                <p className="text-[#9a9a90] text-sm mt-1">{filteredUsers.length} of {MOCK_USERS.length} registered students</p>
            </div>

            {/* Filters Section */}
            <div className="bg-[#f1f3f1]/50 border border-black/5 rounded-3xl p-4 md:p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                    <div className="md:col-span-6">
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-[#9a9a90] mb-2 px-1">Search</label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a9a90]" />
                            <input
                                type="text"
                                placeholder="Name or school..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-black/5 rounded-2xl pl-11 pr-4 py-3 text-sm placeholder:text-[#9a9a90] text-[#161613] focus:outline-none focus:ring-2 focus:ring-[#1B4D2E]/20 transition-all"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-[#9a9a90] mb-2 px-1">Level</label>
                        <div className="relative">
                            <select 
                                value={levelFilter}
                                onChange={(e) => setLevelFilter(e.target.value)}
                                className="w-full appearance-none bg-white border border-black/5 rounded-2xl px-4 py-3 text-sm text-[#161613] focus:outline-none focus:ring-2 focus:ring-[#1B4D2E]/20 transition-all pr-10 cursor-pointer"
                            >
                                <option>All Levels</option>
                                <option>Primary</option>
                                <option>Junior Secondary</option>
                                <option>Senior Secondary</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a9a90] pointer-events-none" />
                        </div>
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-[#9a9a90] mb-2 px-1">District</label>
                        <div className="relative">
                            <select 
                                value={districtFilter}
                                onChange={(e) => setDistrictFilter(e.target.value)}
                                className="w-full appearance-none bg-white border border-black/5 rounded-2xl px-4 py-3 text-sm text-[#161613] focus:outline-none focus:ring-2 focus:ring-[#1B4D2E]/20 transition-all pr-10 cursor-pointer"
                            >
                                <option>All Districts</option>
                                <option>Blantyre</option>
                                <option>Lilongwe</option>
                                <option>Mzuzu</option>
                                <option>Zomba</option>
                                <option>Kasungu</option>
                                <option>Dedza</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a9a90] pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-black/5 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-black/5">
                                <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-bold text-[#9a9a90]">Student</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-bold text-[#9a9a90] hidden md:table-cell">School</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-bold text-[#9a9a90] hidden md:table-cell">Level</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-bold text-[#9a9a90] hidden md:table-cell">District</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-bold text-[#9a9a90]">Downloads</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-bold text-[#9a9a90]">Last Active</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-[#f8f9f8] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full ${user.avatarBg} text-white flex items-center justify-center text-xs font-bold shrink-0`}>
                                                    {user.initials}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-[#161613] truncate">{user.name}</p>
                                                    <p className="text-[11px] text-[#9a9a90] truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <p className="text-sm text-[#161613]">{user.school}</p>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <div className="space-y-1">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${getLevelColor(user.level)}`}>
                                                    {user.level}
                                                </span>
                                                <p className="text-[10px] text-[#9a9a90] ml-1">{user.form}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#161613] hidden md:table-cell">{user.district}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-[#161613]">{user.downloads}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm ${user.lastActive === 'Today' ? 'text-green-600 font-medium' : 'text-[#9a9a90]'}`}>
                                                {user.lastActive}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center text-[#9a9a90]">
                                        No students found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function getLevelColor(level) {
    switch (level) {
        case 'Senior Secondary':
            return 'bg-green-50 text-green-700 border border-green-100';
        case 'Junior Secondary':
            return 'bg-blue-50 text-blue-700 border border-blue-100';
        case 'Primary':
            return 'bg-orange-50 text-orange-700 border border-orange-100';
        default:
            return 'bg-gray-50 text-gray-700 border border-gray-100';
    }
}
