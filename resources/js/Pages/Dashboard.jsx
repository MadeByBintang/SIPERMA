import React from "react";
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, GitBranch, Clock } from "lucide-react";
import MainLayout from "@/Layouts/MainLayout";

export default function Dashboard({ auth }) {
    const userRole = auth?.user?.role_name || "student"; // sesuaikan nama kolom role kamu

    const stats = [
        {
            title: "Total Students",
            value: "1,234",
            icon: Users,
            color: "bg-blue-500",
        },
        {
            title: "Total Lecturers",
            value: "89",
            icon: UserCheck,
            color: "bg-green-500",
        },
        {
            title: "Active Relations",
            value: "456",
            icon: GitBranch,
            color: "bg-purple-500",
        },
        {
            title: "Pending Matches",
            value: "23",
            icon: Clock,
            color: "bg-orange-500",
        },
    ];

    const recentActivities = [
        {
            id: 1,
            text: "New student registered: Ahmad Rizki",
            time: "2 hours ago",
        },
        {
            id: 2,
            text: "Supervisor assigned: Dr. Sarah → Budi Santoso",
            time: "5 hours ago",
        },
        {
            id: 3,
            text: "Profile updated: Prof. Ahmad",
            time: "1 day ago",
        },
        {
            id: 4,
            text: "New match request submitted",
            time: "2 days ago",
        },
        {
            id: 5,
            text: "Report generated: Monthly Summary",
            time: "3 days ago",
        },
    ];

    return (
        <MainLayout>
            <Head title="Dashboard" />

            <div className="space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => {
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

                {/* Recent Activities */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                                >
                                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                                    <div className="flex-1">
                                        <p className="text-sm">
                                            {activity.text}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                {userRole === "mahasiswa" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>My Supervisor</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p>Dr. Sarah Wijaya, M.Kom</p>
                                    <p className="text-sm text-muted-foreground">
                                        Machine Learning & AI
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Assigned: September 2024
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recommended Teammates</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Based on your interests in Machine Learning,
                                    we found 12 potential teammates.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {userRole === "dosen" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>My Supervised Students</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center pb-3 border-b border-border">
                                    <div>
                                        <p>Ahmad Rizki</p>
                                        <p className="text-sm text-muted-foreground">
                                            NIM: 2021001
                                        </p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        Active
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-border">
                                    <div>
                                        <p>Siti Nurhaliza</p>
                                        <p className="text-sm text-muted-foreground">
                                            NIM: 2021023
                                        </p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        Active
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p>Budi Santoso</p>
                                        <p className="text-sm text-muted-foreground">
                                            NIM: 2021045
                                        </p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        Active
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </MainLayout>
    );
}
