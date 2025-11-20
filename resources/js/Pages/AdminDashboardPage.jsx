import { useState } from "react";
import { Head } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "../Components/ui/card";
import { Badge } from "../Components/ui/badge";
import { Button } from "../Components/ui/button";
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
import { Separator } from "../Components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../Components/ui/dialog";

const Notification = [
    {
        id: "number",
        type: "string",
        title: "string",
        description: "string",
        timestamp: "string",
        status: "string",
        details: {
            studentName: "string",
            studentNim: "string",
            lecturerName: "string",
            lecturerNip: "string",
            activityType: "string",
            projectTitle: "string",
            teamName: "string",
            teamMembers: "string",
            requestDate: "string",
        },
    },
];

export default function AdminDashboardPage({ onNavigate }) {
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    // Mock data for system overview
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

    // Mock data for recent notifications
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
                projectTitle:
                    "Enterprise Resource Planning Implementation at PT Teknologi Maju",
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
                projectTitle:
                    "Deep Learning Approach for Indonesian Sentiment Analysis",
                requestDate: "October 26, 2024 at 06:15 AM",
            },
        },
        {
            id: 3,
            type: "guidance-request",
            title: "New Thesis Guidance Request",
            description:
                "Siti Aminah requested guidance from Prof. Dr. Budi Hartono",
            timestamp: "5 hours ago",
            status: "pending",
            details: {
                studentName: "Siti Aminah",
                studentNim: "2021005678",
                lecturerName: "Prof. Dr. Budi Hartono, M.Kom.",
                lecturerNip: "198703152012012002",
                activityType: "Thesis",
                projectTitle: "Blockchain-based Supply Chain Management System",
                requestDate: "October 26, 2024 at 04:45 AM",
            },
        },
        {
            id: 4,
            type: "team-approval",
            title: "Competition Team Pending",
            description:
                'Team "IoT Innovators" needs approval from Dr. Rina Kusuma',
            timestamp: "1 day ago",
            status: "pending",
            details: {
                teamName: "IoT Innovators",
                teamMembers: ["Dewi Lestari", "Hendra Wijaya", "Rina Marlina"],
                lecturerName: "Dr. Rina Kusuma, M.T.",
                lecturerNip: "199001202015011003",
                activityType: "Competition",
                projectTitle:
                    "Smart Agriculture IoT System - National Innovation Competition 2024",
                requestDate: "October 25, 2024 at 02:30 PM",
            },
        },
        {
            id: 5,
            type: "guidance-approved",
            title: "Guidance Request Approved",
            description: "Dr. Ahmad Fauzi approved guidance for Hendra Wijaya",
            timestamp: "1 day ago",
            status: "approved",
            details: {
                studentName: "Hendra Wijaya",
                studentNim: "2021009876",
                lecturerName: "Dr. Ahmad Fauzi, M.Kom.",
                lecturerNip: "198805102013012004",
                activityType: "Competition",
                projectTitle: "Smart Agriculture IoT System",
                requestDate: "October 25, 2024 at 11:00 AM",
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

    const handleQuickAction = (page) => {
        if (onNavigate) {
            onNavigate(page);
        }
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

                {/* System Statistics */}
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
                                    <span className="text-3xl">
                                        {systemStats.activeProjects.pkl +
                                            systemStats.activeProjects.thesis +
                                            systemStats.activeProjects
                                                .competition}
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
                                            {systemStats.activeProjects.pkl}{" "}
                                            projects
                                        </span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{
                                                width: `${
                                                    (systemStats.activeProjects
                                                        .pkl /
                                                        (systemStats
                                                            .activeProjects
                                                            .pkl +
                                                            systemStats
                                                                .activeProjects
                                                                .thesis +
                                                            systemStats
                                                                .activeProjects
                                                                .competition)) *
                                                    100
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
                                            {systemStats.activeProjects.thesis}{" "}
                                            projects
                                        </span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{
                                                width: `${
                                                    (systemStats.activeProjects
                                                        .thesis /
                                                        (systemStats
                                                            .activeProjects
                                                            .pkl +
                                                            systemStats
                                                                .activeProjects
                                                                .thesis +
                                                            systemStats
                                                                .activeProjects
                                                                .competition)) *
                                                    100
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
                                            {
                                                systemStats.activeProjects
                                                    .competition
                                            }{" "}
                                            projects
                                        </span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className="bg-orange-500 h-2 rounded-full"
                                            style={{
                                                width: `${
                                                    (systemStats.activeProjects
                                                        .competition /
                                                        (systemStats
                                                            .activeProjects
                                                            .pkl +
                                                            systemStats
                                                                .activeProjects
                                                                .thesis +
                                                            systemStats
                                                                .activeProjects
                                                                .competition)) *
                                                    100
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
                        <div className="space-y-3">
                            {notifications.map((notification, index) => (
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
                                        {notification.status === "pending" && (
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
                            ))}
                        </div>
                        <div className="mt-4">
                            <Button variant="outline" className="w-full">
                                View All Notifications
                            </Button>
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
                            <Link href="/admin/users" className="block w-full">
                                <Button
                                    variant="outline"
                                    className="gap-2 justify-start w-full"
                                >
                                    <Users className="w-4 h-4" />
                                    Manage Users
                                </Button>
                            </Link>

                            <Link
                                href="/admin/projects"
                                className="block w-full"
                            >
                                <Button
                                    variant="outline"
                                    className="gap-2 justify-start w-full"
                                >
                                    <Briefcase className="w-4 h-4" />
                                    View All Projects
                                </Button>
                            </Link>

                            <Link
                                href="/admin/relations"
                                className="block w-full"
                            >
                                <Button
                                    variant="outline"
                                    className="gap-2 justify-start w-full"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Review Relations
                                </Button>
                            </Link>

                            <Link
                                href="/admin/reports"
                                className="block w-full"
                            >
                                <Button
                                    variant="outline"
                                    className="gap-2 justify-start w-full"
                                >
                                    <TrendingUp className="w-4 h-4" />
                                    System Reports
                                </Button>
                            </Link>
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
