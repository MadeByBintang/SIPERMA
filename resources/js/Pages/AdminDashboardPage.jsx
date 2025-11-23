import { useState } from "react";
import { Head, Link } from "@inertiajs/react"; // Gabungkan import
import MainLayout from "@/Layouts/MainLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card"; // Pastikan path import benar
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    Users,
    UserCheck,
    Briefcase,
    CheckCircle2,
    Clock,
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

// 1. TERIMA PROPS DARI CONTROLLER DISINI
export default function AdminDashboardPage({ systemStats, notifications }) { 
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

    // HAPUS BAGIAN "const systemStats = { ... }" YANG HARDCODED
    // HAPUS BAGIAN "const notifications = [ ... ]" YANG HARDCODED
    
    // Catatan: Karena di controller kamu mengirim 'notifications' => [], 
    // maka list notifikasi akan kosong sampai kamu memperbaiki query notifikasi di Controller.

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

    return (
        <MainLayout>
            <Head title="Admin Dashboard" />
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1>Admin Dashboard</h1>
                    <p className="text-sm text-muted-foreground">
                        System overview and management center
                    </p>
                </div>

                {/* System Statistics - MENGGUNAKAN DATA ASLI DARI DATABASE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {/* Total Students */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">Total Students</CardTitle>
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
                            <CardTitle className="text-sm">Total Lecturers</CardTitle>
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
                            <CardTitle className="text-sm">Active Projects</CardTitle>
                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    {/* MENGHITUNG TOTAL DARI DATA DATABASE */}
                                    <span className="text-3xl">
                                        {(systemStats.activeProjects?.pkl || 0) +
                                            (systemStats.activeProjects?.thesis || 0) +
                                            (systemStats.activeProjects?.competition || 0)}
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
                            <CardTitle className="text-sm">Pending Approvals</CardTitle>
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
                                <ProjectProgressItem 
                                    label="PKL (Internship)" 
                                    count={systemStats.activeProjects?.pkl || 0} 
                                    total={(systemStats.activeProjects?.pkl || 0) + (systemStats.activeProjects?.thesis || 0) + (systemStats.activeProjects?.competition || 0)}
                                    color="bg-blue-500"
                                />
                                
                                {/* Thesis */}
                                <ProjectProgressItem 
                                    label="Thesis" 
                                    count={systemStats.activeProjects?.thesis || 0} 
                                    total={(systemStats.activeProjects?.pkl || 0) + (systemStats.activeProjects?.thesis || 0) + (systemStats.activeProjects?.competition || 0)}
                                    color="bg-green-500"
                                />

                                {/* Competition */}
                                <ProjectProgressItem 
                                    label="Competition" 
                                    count={systemStats.activeProjects?.competition || 0} 
                                    total={(systemStats.activeProjects?.pkl || 0) + (systemStats.activeProjects?.thesis || 0) + (systemStats.activeProjects?.competition || 0)}
                                    color="bg-orange-500"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Guidance Approval Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Guidance Approval Status</CardTitle>
                            <CardDescription>Overview of lecturer guidance requests</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <StatusCard 
                                    icon={Clock} 
                                    title="Pending Approvals" 
                                    subtitle="Awaiting response" 
                                    count={systemStats.pendingApprovals} 
                                    theme="orange" 
                                />
                                <StatusCard 
                                    icon={CheckCircle2} 
                                    title="Approved Guidance" 
                                    subtitle="Successfully matched" 
                                    count={systemStats.approvedGuidance} 
                                    theme="green" 
                                />
                                <StatusCard 
                                    icon={AlertCircle} 
                                    title="Rejected Requests" 
                                    subtitle="Declined by lecturers" 
                                    count={systemStats.rejectedGuidance} 
                                    theme="red" 
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* System Notifications */}
                {/* LOGIKA UNTUK MENANGANI ARRAY KOSONG DARI CONTROLLER */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>System Notifications</CardTitle>
                                <CardDescription>
                                    Recent activities and pending actions
                                </CardDescription>
                            </div>
                            <Badge variant="outline" className="gap-2">
                                <Bell className="w-3 h-3" />
                                {notifications.length > 0 ? notifications.filter((n) => n.status === "pending").length : 0} pending
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {notifications.length === 0 ? (
                                <p className="text-center text-sm text-muted-foreground py-4">No new notifications.</p>
                            ) : (
                                notifications.map((notification, index) => (
                                    <div key={notification.id}>
                                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                                            {/* ... (Isi notifikasi sama seperti sebelumnya) ... */}
                                            {/* Kode notifikasi bisa Anda copy paste dari yang lama, tapi pastikan struktur datanya sesuai */}
                                            <p>Notification Item (Perlu penyesuaian data DB)</p>
                                        </div>
                                        {index < notifications.length - 1 && (
                                            <Separator className="my-2" />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions tetap sama, hanya Link href yang perlu dipastikan benar */}
                <Card>
                     <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                     </CardHeader>
                     <CardContent>
                        {/* ... Tombol-tombol Quick Actions ... */}
                        <p className="text-sm text-muted-foreground">Menu navigasi (sudah benar)</p>
                     </CardContent>
                </Card>
                
            </div>
        </MainLayout>
    );
}

// Komponen Helper Kecil untuk kebersihan kode
function ProjectProgressItem({ label, count, total, color }) {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${color}`} />
                    <span className="text-sm">{label}</span>
                </div>
                <span className="text-sm">{count} projects</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
                <div
                    className={`${color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

function StatusCard({ icon: Icon, title, subtitle, count, theme }) {
    const colors = {
        orange: { bg: "bg-orange-50", border: "border-orange-200", iconBg: "bg-orange-100", iconColor: "text-orange-700", textColor: "text-orange-700" },
        green: { bg: "bg-green-50", border: "border-green-200", iconBg: "bg-green-100", iconColor: "text-green-700", textColor: "text-green-700" },
        red: { bg: "bg-red-50", border: "border-red-200", iconBg: "bg-red-100", iconColor: "text-red-700", textColor: "text-red-700" },
    };
    const c = colors[theme];

    return (
        <div className={`flex items-center justify-between p-3 ${c.bg} rounded-lg border ${c.border}`}>
            <div className="flex items-center gap-3">
                <div className={`p-2 ${c.iconBg} rounded-lg`}>
                    <Icon className={`w-4 h-4 ${c.iconColor}`} />
                </div>
                <div>
                    <p className="text-sm">{title}</p>
                    <p className="text-xs text-muted-foreground">{subtitle}</p>
                </div>
            </div>
            <span className={`text-2xl ${c.textColor}`}>{count}</span>
        </div>
    );
}