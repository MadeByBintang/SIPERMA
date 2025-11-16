import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "../Components/ui/card";
import { Badge } from "../Components/ui/badge";
import { Button } from "../Components/ui/button";
import { Separator } from "../Components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../Components/ui/dialog";
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

export default function AdminDashboardPage() {
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

    const systemStats = {
        totalStudents: 1247,
        totalLecturers: 87,
        activeProjects: {
            pkl: 45,
            thesis: 89,
            competition: 23,
        },
        pendingApprovals: 12,
        approvedGuidance: 134,
        rejectedGuidance: 8,
    };

    const notifications = [
        {
            id: 1,
            type: "guidance-request",
            title: "New PKL Guidance Request",
            description:
                "Ahmad Rizki Pratama requested guidance from Dr. Sarah Wijaya",
            timestamp: "2 hours ago",
            status: "pending",
            details: {
                studentName: "Ahmad Rizki Pratama",
                studentNim: "2021001234",
                lecturerName: "Dr. Sarah Wijaya, M.T.",
                lecturerNip: "198501012010011001",
                activityType: "PKL",
                projectTitle: "ERP Implementation at PT Teknologi Maju",
                requestDate: "October 26, 2024 at 07:30 AM",
            },
        },
        {
            id: 2,
            type: "team-approval",
            title: "Unapproved Team Formation",
            description:
                'Team "AI Research Group" waiting for lecturer approval',
            timestamp: "3 hours ago",
            status: "pending",
            details: {
                teamName: "AI Research Group",
                teamMembers: [
                    "Ahmad Rizki Pratama",
                    "Siti Aminah",
                    "Budi Santoso",
                ],
                lecturerName: "Dr. Sarah Wijaya, M.T.",
                lecturerNip: "198501012010011001",
                activityType: "Thesis",
                projectTitle: "Deep Learning for Sentiment Analysis",
                requestDate: "October 26, 2024 at 06:15 AM",
            },
        },
    ];

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
        <div className="space-y-6">
            <Head title="Admin Dashboard" />

            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                    System overview and management center
                </p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm">
                            Total Students
                        </CardTitle>
                        <Users className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            <span className="text-3xl">
                                {systemStats.totalStudents}
                            </span>
                            <p className="text-xs text-muted-foreground">
                                Registered in system
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm">
                            Total Lecturers
                        </CardTitle>
                        <UserCheck className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            <span className="text-3xl">
                                {systemStats.totalLecturers}
                            </span>
                            <p className="text-xs text-muted-foreground">
                                Active lecturers
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm">
                            Active Projects
                        </CardTitle>
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <span className="text-3xl">
                            {systemStats.activeProjects.pkl +
                                systemStats.activeProjects.thesis +
                                systemStats.activeProjects.competition}
                        </span>
                        <p className="text-xs text-muted-foreground">
                            PKL · Thesis · Competition
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm">
                            Pending Approvals
                        </CardTitle>
                        <Clock className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <span className="text-3xl">
                            {systemStats.pendingApprovals}
                        </span>
                        <p className="text-xs text-muted-foreground">
                            Awaiting lecturer response
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Notifications */}
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
                            {
                                notifications.filter(
                                    (n) => n.status === "pending"
                                ).length
                            }{" "}
                            pending
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className="p-3 flex items-start gap-3 hover:bg-accent rounded-lg transition"
                        >
                            <div
                                className={`p-2 rounded-lg ${
                                    notification.status === "pending"
                                        ? "bg-orange-100"
                                        : "bg-green-100"
                                }`}
                            >
                                {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium">
                                        {notification.title}
                                    </p>
                                    <Badge
                                        variant="outline"
                                        className={getStatusColor(
                                            notification.status
                                        )}
                                    >
                                        {notification.status}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {notification.description}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {notification.timestamp}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    handleViewNotification(notification)
                                }
                            >
                                View
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>

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
                        <Link href={route("admin.users")}>
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-2"
                            >
                                <Users className="w-4 h-4" /> Manage Users
                            </Button>
                        </Link>
                        <Link href={route("admin.projects")}>
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-2"
                            >
                                <Briefcase className="w-4 h-4" /> View All
                                Projects
                            </Button>
                        </Link>
                        <Link href={route("admin.approvals")}>
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-2"
                            >
                                <CheckCircle2 className="w-4 h-4" /> Review
                                Relations
                            </Button>
                        </Link>
                        <Link href={route("admin.reports")}>
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-2"
                            >
                                <TrendingUp className="w-4 h-4" /> System
                                Reports
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Detail Dialog */}
            <Dialog
                open={isDetailDialogOpen}
                onOpenChange={setIsDetailDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Notification Details</DialogTitle>
                    </DialogHeader>
                    {selectedNotification && (
                        <div className="py-4 space-y-3">
                            <p className="font-medium">
                                {selectedNotification.title}
                            </p>
                            <p className="text-sm">
                                {selectedNotification.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {selectedNotification.timestamp}
                            </p>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDetailDialogOpen(false)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
