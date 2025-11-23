import React from "react";
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, GitBranch, Clock } from "lucide-react";
import MainLayout from "@/Layouts/MainLayout";

export default function Dashboard({ auth, stats, activities }) {
    const userRole = auth?.user?.role_name || "student";

    // 1. DEFENSIVE CODING: Cek jika data stats belum ada (biar gak blank)
    if (!stats) {
        return <div className="p-10 text-center">Loading data... (Pastikan Controller sudah diperbaiki)</div>;
    }

    // 2. UBAH DATA DATABASE JADI FORMAT KARTU UI
    const statCards = [
        {
            title: "Total Students",
            value: stats.total_students, 
            icon: Users,
            color: "bg-blue-500",
        },
        {
            title: "Total Lecturers",
            value: stats.total_lecturers, 
            icon: UserCheck,
            color: "bg-green-500",
        },
        {
            title: "Active Relations",
            value: stats.active_relations, 
            icon: GitBranch,
            color: "bg-purple-500",
        },
        {
            title: "Pending Matches",
            value: stats.pending_matches, 
            icon: Clock,
            color: "bg-orange-500",
        },
    ];

    return (
        <MainLayout>
            <Head title="Dashboard" />

            <div className="space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* PERBAIKAN DISINI: Gunakan statCards.map, BUKAN stats.map */}
                    {statCards.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.title}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm text-muted-foreground">
                                        {stat.title}
                                    </CardTitle>
                                    <div
                                        className={`${stat.color} w-8 h-8 rounded-lg flex items-center justify-center`}
                                    >
                                        <Icon className="w-4 h-4 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Recent Activities */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* PERBAIKAN DISINI: Gunakan activities (dari DB), BUKAN recentActivities */}
                            {(!activities || activities.length === 0) ? (
                                <p className="text-sm text-muted-foreground">No recent activities found.</p>
                            ) : (
                                activities.map((activity, index) => (
                                    <div
                                        key={activity.id || index}
                                        className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                                    >
                                        <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                                        <div className="flex-1">
                                            {/* Sesuaikan nama kolom DB, biasanya activity_name atau title */}
                                            <p className="text-sm font-medium">
                                                {activity.activity_name || "Activity Log"}
                                            </p>
                                            
                                            {/* Tampilkan Tipe jika ada */}
                                            {activity.activity_type && (
                                                <p className="text-xs text-muted-foreground">
                                                    {activity.activity_type.type_name}
                                                </p>
                                            )}

                                            <p className="text-xs text-muted-foreground mt-1">
                                                {/* Format Tanggal */}
                                                {new Date(activity.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                
                {userRole === "Mahasiswa" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>My Supervisor</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {/* Mengakses data dosen pembimbing secara aman dengan tanda tanya (?) */}
                                    <p className="font-medium">
                                        {auth.user.student?.teamMembers?.[0]?.team?.activity?.supervision?.lecturer?.user?.name || "Not Assigned Yet"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Status: {auth.user.status || "Active"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {userRole === "Dosen" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>My Supervised Students</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Check Relations menu for details.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </MainLayout>
    );
}