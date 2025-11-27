import { useState } from "react";
import { Head, router } from "@inertiajs/react"; // Gabungkan import
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

                {/* System Notifications */}
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
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <p className="text-center text-sm text-muted-foreground py-4">
                                    No new notifications.
                                </p>
                            ) : (
                                notifications.map((notification, index) => (
                                    <div key={notification.id}>
                                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                                            <div
                                                className={`p-2 rounded-lg ${
                                                    notification.status ===
                                                    "pending"
                                                        ? "bg-orange-100"
                                                        : "bg-green-100"
                                                }`}
                                            >
                                                {getNotificationIcon(
                                                    notification.type
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <p className="line-clamp-1">
                                                        {notification.title}
                                                    </p>
                                                    <Badge
                                                        variant="outline"
                                                        className={`${getStatusColor(
                                                            notification.status
                                                        )} text-xs shrink-0`}
                                                    >
                                                        {notification.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-1 mb-1">
                                                    {notification.description}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {notification.timestamp}
                                                </p>
                                            </div>
                                            {notification.status ===
                                                "pending" && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="shrink-0"
                                                    onClick={() =>
                                                        handleViewNotification(
                                                            notification
                                                        )
                                                    }
                                                >
                                                    View
                                                </Button>
                                            )}
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

                {/* Notification Detail Dialog */}
                <Dialog
                    open={isDetailDialogOpen}
                    onOpenChange={setIsDetailDialogOpen}
                >
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Notification Details</DialogTitle>
                            <DialogDescription>
                                Complete information about this notification
                            </DialogDescription>
                        </DialogHeader>
                        {selectedNotification && (
                            <div className="space-y-6 py-4">
                                {/* Notification Header */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`p-2 rounded-lg ${
                                                selectedNotification.status ===
                                                "pending"
                                                    ? "bg-orange-100"
                                                    : "bg-green-100"
                                            }`}
                                        >
                                            {getNotificationIcon(
                                                selectedNotification.type
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg">
                                                {selectedNotification.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedNotification.timestamp}
                                            </p>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={getStatusColor(
                                                selectedNotification.status
                                            )}
                                        >
                                            {selectedNotification.status}
                                        </Badge>
                                    </div>
                                </div>

                                <Separator />

                                {/* Details Grid */}
                                {selectedNotification.details && (
                                    <div className="space-y-4">
                                        {selectedNotification.type ===
                                            "guidance-request" && (
                                            <>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <p className="text-sm text-muted-foreground">
                                                            Student
                                                        </p>
                                                        <div>
                                                            <p>
                                                                {
                                                                    selectedNotification
                                                                        .details
                                                                        .studentName
                                                                }
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {
                                                                    selectedNotification
                                                                        .details
                                                                        .studentNim
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <p className="text-sm text-muted-foreground">
                                                            Requested Supervisor
                                                        </p>
                                                        <div>
                                                            <p>
                                                                {
                                                                    selectedNotification
                                                                        .details
                                                                        .lecturerName
                                                                }
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {
                                                                    selectedNotification
                                                                        .details
                                                                        .lecturerNip
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <p className="text-sm text-muted-foreground">
                                                            Activity Type
                                                        </p>
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-blue-50 text-blue-700 border-blue-300"
                                                        >
                                                            {
                                                                selectedNotification
                                                                    .details
                                                                    .activityType
                                                            }
                                                        </Badge>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <p className="text-sm text-muted-foreground">
                                                            Request Date
                                                        </p>
                                                        <p className="text-sm">
                                                            {
                                                                selectedNotification
                                                                    .details
                                                                    .requestDate
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        Project Title
                                                    </p>
                                                    <p>
                                                        {
                                                            selectedNotification
                                                                .details
                                                                .projectTitle
                                                        }
                                                    </p>
                                                </div>
                                            </>
                                        )}

                                        {selectedNotification.type ===
                                            "team-approval" && (
                                            <>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <p className="text-sm text-muted-foreground">
                                                            Team Name
                                                        </p>
                                                        <p>
                                                            {
                                                                selectedNotification
                                                                    .details
                                                                    .teamName
                                                            }
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <p className="text-sm text-muted-foreground">
                                                            Activity Type
                                                        </p>
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-blue-50 text-blue-700 border-blue-300"
                                                        >
                                                            {
                                                                selectedNotification
                                                                    .details
                                                                    .activityType
                                                            }
                                                        </Badge>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <p className="text-sm text-muted-foreground">
                                                            Supervisor
                                                        </p>
                                                        <div>
                                                            <p>
                                                                {
                                                                    selectedNotification
                                                                        .details
                                                                        .lecturerName
                                                                }
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {
                                                                    selectedNotification
                                                                        .details
                                                                        .lecturerNip
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <p className="text-sm text-muted-foreground">
                                                            Request Date
                                                        </p>
                                                        <p className="text-sm">
                                                            {
                                                                selectedNotification
                                                                    .details
                                                                    .requestDate
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        Team Members (
                                                        {
                                                            selectedNotification
                                                                .details
                                                                .teamMembers
                                                                ?.length
                                                        }
                                                        )
                                                    </p>
                                                    <div className="space-y-2">
                                                        {selectedNotification.details.teamMembers?.map(
                                                            (member, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="flex items-center gap-2 p-2 bg-accent rounded-lg"
                                                                >
                                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                                        <span className="text-xs text-primary">
                                                                            {member
                                                                                .split(
                                                                                    " "
                                                                                )
                                                                                .map(
                                                                                    (
                                                                                        n
                                                                                    ) =>
                                                                                        n[0]
                                                                                )
                                                                                .join(
                                                                                    ""
                                                                                )
                                                                                .substring(
                                                                                    0,
                                                                                    2
                                                                                )}
                                                                        </span>
                                                                    </div>
                                                                    <span className="text-sm">
                                                                        {member}
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        Project Title
                                                    </p>
                                                    <p>
                                                        {
                                                            selectedNotification
                                                                .details
                                                                .projectTitle
                                                        }
                                                    </p>
                                                </div>
                                            </>
                                        )}

                                        {selectedNotification.type ===
                                            "guidance-approved" && (
                                            <>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <p className="text-sm text-muted-foreground">
                                                            Student
                                                        </p>
                                                        <div>
                                                            <p>
                                                                {
                                                                    selectedNotification
                                                                        .details
                                                                        .studentName
                                                                }
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {
                                                                    selectedNotification
                                                                        .details
                                                                        .studentNim
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <p className="text-sm text-muted-foreground">
                                                            Supervisor
                                                        </p>
                                                        <div>
                                                            <p>
                                                                {
                                                                    selectedNotification
                                                                        .details
                                                                        .lecturerName
                                                                }
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {
                                                                    selectedNotification
                                                                        .details
                                                                        .lecturerNip
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <p className="text-sm text-muted-foreground">
                                                            Activity Type
                                                        </p>
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-green-50 text-green-700 border-green-300"
                                                        >
                                                            {
                                                                selectedNotification
                                                                    .details
                                                                    .activityType
                                                            }
                                                        </Badge>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <p className="text-sm text-muted-foreground">
                                                            Approval Date
                                                        </p>
                                                        <p className="text-sm">
                                                            {
                                                                selectedNotification
                                                                    .details
                                                                    .requestDate
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        Project Title
                                                    </p>
                                                    <p>
                                                        {
                                                            selectedNotification
                                                                .details
                                                                .projectTitle
                                                        }
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDetailDialogOpen(false)}
                            >
                                Close
                            </Button>
                            {selectedNotification?.status === "pending" && (
                                <Button
                                    onClick={() =>
                                        handleQuickAction("approvals")
                                    }
                                >
                                    Go to Relations Management
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
}
