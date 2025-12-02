import React from "react";
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, GitBranch, Clock, XCircle, ThumbsUp, CheckCircle2 } from "lucide-react";
import MainLayout from "@/Layouts/MainLayout";

export default function Dashboard({ auth, stats, activities }) {
    const userRole = auth?.user?.role_name || "mahasiswa";

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

    const getStatusColor = (status) => {
        switch (status) {
            case "approved":
                return "bg-blue-100 text-blue-700 border-blue-200"; // Ubah ke biru
            case "completed":
                return "bg-green-100 text-green-700 border-green-200"; // Tambahkan ini
            case "rejected":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "approved":
                return <CheckCircle2 className="w-4 h-4" />; // Tetap CheckCircle
            case "completed":
                return <ThumbsUp className="w-4 h-4" />; // Tambahkan ini
            case "rejected":
                return <XCircle className="w-4 h-4" />;
            case "pending":
                return <Clock className="w-4 h-4" />;
        }
    };

    const formatStatus = (status) => {
        switch (status) {
            case "pending":
                return "Pending";
            case "approved":
                return "Approved";
            case "rejected":
                return "Rejected";
            case "completed":
                return "Completed";
            default:
                return status;
        }
    };

    const StatusBadge = ({ status }) => {
        const colorClasses = getStatusColor(status);
        const Icon = getStatusIcon(status);
        const text = formatStatus(status);

        return (
            <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border ${colorClasses}`}
            >
                {Icon}
                {text}
            </span>
        );
    };

    const formatDate = (dateString) => {
        // ... (fungsi formatDate yang sudah ada)
        if (!dateString) return 'Date not available';
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <MainLayout>
            <Head title="Dashboard" />

            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                                    <div className="text-2xl">{stat.value}</div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {!activities || activities.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No recent activities found.
                                </p>
                            ) : (
                                activities.map((activity, index) => (
                                    <div
                                        key={activity.id || index}
                                        className="flex items-start justify-between gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                                    >
                                        {/* LEFT SECTION (Activity Details) */}
                                        <div className="flex items-start gap-4">
                                            <div className="flex-1">
                                                {userRole === "dosen" ? (
                                                    <>
                                                        Supervision request
                                                        from:{" "}
                                                        <span className="font-semibold">
                                                            {
                                                                activity.leader_name
                                                            }
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        Your supervisor:{" "}
                                                        <span className="font-semibold">
                                                            {
                                                                activity.lecturer_name
                                                            }
                                                        </span>
                                                    </>
                                                )}

                                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
                                                    Project:{" "}
                                                    {activity.activity_title}
                                                </p>

                                                {/* 3. Time/Date (assigned_date) at the bottom */}
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Submitted:{" "}
                                                    {formatDate(
                                                        activity.assigned_at
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-1 flex-shrink-0">
                                            <StatusBadge
                                                status={activity.status}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
