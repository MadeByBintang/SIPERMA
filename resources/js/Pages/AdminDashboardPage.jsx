import { useState } from "react";
import { Head, router } from "@inertiajs/react"; // Gabungkan import
import MainLayout from "@/Layouts/MainLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/Components/ui/card"; // Pastikan path import benar
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    Users,
    Download,
    UserCheck,
    Briefcase,
    CheckCircle2,
    Clock,
    Check,
    AlertCircle,
    TrendingUp,
    FileText,
    Bell,
} from "lucide-react";
import { Separator } from "@/Components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";

import { toast } from "sonner";

// 1. TERIMA PROPS DARI CONTROLLER DISINI
export default function AdminDashboardPage({ systemStats, stats }) {
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

    const handleGenerateReport = () => {
        toast.success("Generating report...");

        // Buka export PDF di tab baru
        window.open("/admin/reports/export-pdf", "_blank");
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case "guidance-request":
                return <FileText className="w-4 h-4" />;
            case "team-approval":
                return <Users className="w-4 h-4" />;
            case "guidance-approved":
                return <CheckCircle2 className="w-4 h-4" />;
            default:
                return <Bell className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-orange-100 text-orange-700 border-orange-300";
            case "approved":
                return "bg-green-100 text-green-700 border-green-300";
            default:
                return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };

    const handleViewNotification = (notification) => {
        setSelectedNotification(notification);
        setIsDetailDialogOpen(true);
    };

    const handleQuickAction = (page) => {
        router.visit(`/admin/${page}`);
    };

    return (
        <MainLayout>
            <Head title="Admin Dashboard" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 mb-4">
                    {/* Header Kiri */}
                    <div>
                        <h1>Admin Dashboard</h1>
                        <p className="text-sm text-muted-foreground">
                            System overview and management center
                        </p>
                    </div>

                    {/* Tombol Export Kanan */}
                    <Button
                        onClick={handleGenerateReport}
                        className="gap-2 shrink-0"
                    >
                        <Download className="w-4 h-4" />
                        Export PDF
                    </Button>
                </div>
                {/* System Statistics - MENGGUNAKAN DATA ASLI DARI DATABASE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {/* Total Students */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Total Students
                            </CardTitle>
                            <Users className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {systemStats.totalStudents}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Registered in system
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Lecturers */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Total Lecturers
                            </CardTitle>
                            <UserCheck className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {systemStats.totalLecturers}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Active lecturers
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Projects */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Active Projects
                            </CardTitle>
                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    {/* MENGHITUNG TOTAL DARI DATA DATABASE */}
                                    <span className="text-3xl">
                                        {(systemStats.activeProjects?.pkl ||
                                            0) +
                                            (systemStats.activeProjects
                                                ?.thesis || 0) +
                                            (systemStats.activeProjects
                                                ?.competition || 0)}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    PKL · Thesis · Competition
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pending Approvals */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Pending Approvals
                            </CardTitle>
                            <Clock className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {systemStats.pendingApprovals}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Awaiting lecturer response
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Total Projects
                            </CardTitle>
                            <FileText className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {stats.totalProjects}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {stats.activeProjects} active
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Completed Projects
                            </CardTitle>
                            <Check className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {stats.completedProjects}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {stats.completedProjects} completed
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Statistics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {/* Active Projects Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Projects by Type</CardTitle>
                            <CardDescription>
                                Current distribution of ongoing activities
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* PKL */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                            <span className="text-sm">
                                                PKL (Internship)
                                            </span>
                                        </div>
                                        <span className="text-sm">
                                            {systemStats.activeProjects?.pkl ||
                                                0}{" "}
                                            projects
                                        </span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{
                                                width: `${
                                                    (systemStats.activeProjects
                                                        ?.pkl || 0) +
                                                    (systemStats.activeProjects
                                                        ?.thesis || 0) +
                                                    (systemStats.activeProjects
                                                        ?.competition || 0)
                                                }%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Thesis */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            <span className="text-sm">
                                                Thesis
                                            </span>
                                        </div>
                                        <span className="text-sm">
                                            {systemStats.activeProjects
                                                ?.thesis || 0}{" "}
                                            projects
                                        </span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{
                                                width: `${
                                                    (systemStats.activeProjects
                                                        ?.pkl || 0) +
                                                    (systemStats.activeProjects
                                                        ?.thesis || 0) +
                                                    (systemStats.activeProjects
                                                        ?.competition || 0)
                                                }%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Competition */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                                            <span className="text-sm">
                                                Competition
                                            </span>
                                        </div>
                                        <span className="text-sm">
                                            {systemStats.activeProjects
                                                ?.competition || 0}{" "}
                                            projects
                                        </span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className="bg-orange-500 h-2 rounded-full"
                                            style={{
                                                width: `${
                                                    (systemStats.activeProjects
                                                        ?.pkl || 0) +
                                                    (systemStats.activeProjects
                                                        ?.thesis || 0) +
                                                    (systemStats.activeProjects
                                                        ?.competition || 0)
                                                }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Guidance Approval Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Guidance Approval Status</CardTitle>
                            <CardDescription>
                                Overview of lecturer guidance requests
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Pending */}
                                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                            <Clock className="w-4 h-4 text-orange-700" />
                                        </div>
                                        <div>
                                            <p className="text-sm">
                                                Pending Approvals
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Awaiting response
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-2xl text-orange-700">
                                        {systemStats.pendingApprovals}
                                    </span>
                                </div>

                                {/* Approved */}
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <CheckCircle2 className="w-4 h-4 text-green-700" />
                                        </div>
                                        <div>
                                            <p className="text-sm">
                                                Approved Guidance
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Successfully matched
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-2xl text-green-700">
                                        {systemStats.approvedGuidance}
                                    </span>
                                </div>

                                {/* Rejected */}
                                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-100 rounded-lg">
                                            <AlertCircle className="w-4 h-4 text-red-700" />
                                        </div>
                                        <div>
                                            <p className="text-sm">
                                                Rejected Requests
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Declined by lecturers
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-2xl text-red-700">
                                        {systemStats.rejectedGuidance}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Common administrative tasks
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <Button
                                variant="outline"
                                className="gap-2 justify-start"
                                onClick={() => handleQuickAction("users")}
                            >
                                <Users className="w-4 h-4" />
                                Manage Users
                            </Button>
                            <Button
                                variant="outline"
                                className="gap-2 justify-start"
                                onClick={() => handleQuickAction("projects")}
                            >
                                <Briefcase className="w-4 h-4" />
                                View All Projects
                            </Button>
                            <Button
                                variant="outline"
                                className="gap-2 justify-start"
                                onClick={() => handleQuickAction("relations")}
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Review Relations
                            </Button>
                            <Button
                                variant="outline"
                                className="gap-2 justify-start"
                                onClick={() => handleQuickAction("reports")}
                            >
                                <TrendingUp className="w-4 h-4" />
                                System Reports
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
