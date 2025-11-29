import { useState } from "react";
import { Head } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { Badge } from "../Components/ui/badge";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../Components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../Components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "../Components/ui/dialog";
import {
    CheckCircle2,
    XCircle,
    Clock,
    BookOpen,
    FileText,
    Award,
    Calendar,
    User,
    AlertCircle,
    Eye,
    Mail,
    UserPlus,
    ThumbsUp,
    Briefcase,
    GraduationCap,
    Trophy,
} from "lucide-react";
import { Alert, AlertDescription } from "../Components/ui/alert";
import { Separator } from "../Components/ui/separator";

export default function ApplicationStatusPage({ applications }) {
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("all");

    const handleViewDetails = (application) => {
        setSelectedApplication(application);
        setIsDialogOpen(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "approved":
                return "bg-blue-100 text-blue-700";
            case "rejected":
                return "bg-red-100 text-red-700";
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            case "completed":
                return "bg-green-100 text-green-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case "Internship":
                return <Briefcase className="w-4 h-4" />;
            case "Thesis":
                return <GraduationCap className="w-4 h-4" />;
            case "Competition":
                return <Trophy className="w-4 h-4" />;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "approved":
                return <CheckCircle2 className="w-4 h-4" />;
            case "rejected":
                return <XCircle className="w-4 h-4" />;
            case "pending":
                return <Clock className="w-4 h-4" />;
            case "completed":
                return <ThumbsUp className="w-4 h-4" />;
        }
    };

    const getActivityTypeColor = (type) => {
        switch (type) {
            case "Internship":
                return "bg-blue-100";
            case "Thesis":
                return "bg-green-100";
            case "Competition":
                return "bg-yellow-100";
        }
    };

    const pendingApplications = applications.filter(
        (a) => a.status === "pending"
    );
    const approvedApplications = applications.filter(
        (a) => a.status === "approved"
    );
    const rejectedApplications = applications.filter(
        (a) => a.status === "rejected"
    );
    const completedApplications = applications.filter(
        (a) => a.status === "completed"
    );

    const filteredApplications =
        activeTab === "all"
            ? applications
            : activeTab === "pending"
            ? pendingApplications
            : activeTab === "approved"
            ? approvedApplications
            : activeTab === "rejected"
            ? rejectedApplications
            : activeTab === "completed"
            ? completedApplications
            : applications; // fallback

    const renderApplicationCard = (application) => {
        return (
            <Card key={application.id}>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-start gap-2 flex-wrap">
                                        <Badge
                                            variant="outline"
                                            className={`gap-1 ${getActivityTypeColor(
                                                application.activityType
                                            )}`}
                                        >
                                            {getActivityIcon(
                                                application.activityType
                                            )}
                                            {application.activityType}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p>{application.activityName}</p>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {application.description}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            Supervisor:{" "}
                                            {application.supervisorName}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(
                                                application.submittedDate
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Badge
                                className={`gap-1 ${getStatusColor(
                                    application.status
                                )}`}
                            >
                                {getStatusIcon(application.status)}
                                {application.status.charAt(0).toUpperCase() +
                                    application.status.slice(1)}
                            </Badge>
                        </div>

                        {application.responseNotes && (
                            <div className="p-3 bg-muted rounded-md">
                                <p className="text-sm text-muted-foreground mb-1">
                                    Response from supervisor:
                                </p>
                                <p className="text-sm">
                                    {application.responseNotes}
                                </p>
                                {application.responseDate && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Responded on{" "}
                                        {new Date(
                                            application.responseDate
                                        ).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </p>
                                )}
                            </div>
                        )}
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1 sm:gap-2 flex-1 sm:flex-initial"
                                onClick={() => handleViewDetails(application)}
                            >
                                <Eye className="w-3 h-3" />
                                <span className="hidden sm:inline">
                                    View Details
                                </span>
                                <span className="sm:hidden">View</span>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <MainLayout>
            <Head title="Application Status" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1>Application Status</h1>
                        <p className="text-sm text-muted-foreground">
                            Track your submissions and respond to team
                            invitations
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {/* <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Total Applications
                            </CardTitle>
                            <FileText className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {applications.length}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    All submissions & invitations
                                </p>
                            </div>
                        </CardContent>
                    </Card> */}

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">Pending</CardTitle>
                            <Clock className="w-4 h-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {pendingApplications.length}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Awaiting response
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">Approved</CardTitle>
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {approvedApplications.length}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Accepted applications
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">Rejected</CardTitle>
                            <XCircle className="w-4 h-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {rejectedApplications.length}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Rejected applications
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">Completed</CardTitle>
                            <ThumbsUp className="w-4 h-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {completedApplications.length}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Completed applications
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Applications List with Tabs */}
                <Card>
                    <CardHeader>
                        <CardTitle>My Applications & Invitations</CardTitle>
                        <CardDescription>
                            View all your PKL, Thesis, and Competition
                            submissions and team invitations
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            {/* Mobile: Dropdown */}
                            <div className="md:hidden">
                                <Select
                                    value={activeTab}
                                    onValueChange={setActiveTab}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Filter applications" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All ({applications.length})
                                        </SelectItem>
                                        <SelectItem value="pending">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                Pending (
                                                {pendingApplications.length})
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="approved">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Approved (
                                                {approvedApplications.length})
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="rejected">
                                            <div className="flex items-center gap-2">
                                                <XCircle className="w-4 h-4" />
                                                Rejected (
                                                {rejectedApplications.length})
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="completed">
                                            <div className="flex items-center gap-2">
                                                <ThumbsUp className="w-4 h-4" />
                                                Completed (
                                                {completedApplications.length})
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Desktop: Tabs */}
                            <TabsList className="hidden md:grid w-full grid-cols-5">
                                <TabsTrigger value="all">
                                    All ({applications.length})
                                </TabsTrigger>
                                <TabsTrigger value="pending" className="gap-2">
                                    <Clock className="w-4 h-4" />
                                    Pending ({pendingApplications.length})
                                </TabsTrigger>
                                <TabsTrigger value="approved" className="gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Approved ({approvedApplications.length})
                                </TabsTrigger>
                                <TabsTrigger value="rejected" className="gap-2">
                                    <XCircle className="w-4 h-4" />
                                    Rejected ({rejectedApplications.length})
                                </TabsTrigger>
                                <TabsTrigger
                                    value="completed"
                                    className="gap-2"
                                >
                                    <ThumbsUp className="w-4 h-4" />
                                    Completed ({completedApplications.length})
                                </TabsTrigger>
                            </TabsList>

                            <div className="mt-6 space-y-4">
                                {filteredApplications.length > 0 ? (
                                    filteredApplications.map((app) =>
                                        renderApplicationCard(app)
                                    )
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>No applications found</p>
                                    </div>
                                )}
                            </div>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* View Details Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-full md:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Application Details</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>

                        {selectedApplication && (
                            <div className="space-y-6">
                                {/* Status Badge */}
                                <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Application Status
                                        </p>
                                        <Badge
                                            className={`gap-1 mt-1 ${getStatusColor(
                                                selectedApplication.status
                                            )}`}
                                        >
                                            {getStatusIcon(
                                                selectedApplication.status
                                            )}
                                            {selectedApplication.status
                                                .charAt(0)
                                                .toUpperCase() +
                                                selectedApplication.status.slice(
                                                    1
                                                )}
                                        </Badge>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">
                                            {"Submitted On"}
                                        </p>
                                        <p className="text-sm">
                                            {new Date(
                                                selectedApplication.submittedDate
                                            ).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                {/* Activity Information */}
                                <div className="space-y-3">
                                    <h4 className="flex items-center gap-2">
                                        <div
                                            className={`p-2 rounded-lg ${getActivityTypeColor(
                                                selectedApplication.activityType
                                            )}`}
                                        >
                                            {getActivityIcon(
                                                selectedApplication.activityType
                                            )}
                                        </div>
                                        Activity Information
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">
                                                Activity Type
                                            </p>
                                            <Badge
                                                variant="outline"
                                                className={`gap-1 ${getActivityTypeColor(
                                                    selectedApplication.activityType
                                                )}`}
                                            >
                                                {getActivityIcon(
                                                    selectedApplication.activityType
                                                )}
                                                {
                                                    selectedApplication.activityType
                                                }
                                            </Badge>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">
                                                Activity Name
                                            </p>
                                            <p>
                                                {
                                                    selectedApplication.activityName
                                                }
                                            </p>
                                        </div>
                                        {selectedApplication.companyName && (
                                            <div className="space-y-1 col-span-2">
                                                <p className="text-sm text-muted-foreground">
                                                    Company/Organization
                                                </p>
                                                <p>
                                                    {
                                                        selectedApplication.companyName
                                                    }
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                {/* Supervisor Information */}
                                <div className="space-y-3">
                                    <h4 className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Supervisor Information
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1 col-span-full">
                                            <p className="text-sm text-muted-foreground">
                                                Name
                                            </p>
                                            <p>
                                                {
                                                    selectedApplication.supervisorName
                                                }
                                            </p>
                                        </div>
                                        <div className="space-y-1 col-span-2">
                                            <p className="text-sm text-muted-foreground">
                                                Email
                                            </p>
                                            <p className="flex items-center gap-1 text-sm">
                                                <Mail className="w-3 h-3" />
                                                {
                                                    selectedApplication.supervisorEmail
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {selectedApplication.teamMembers?.length >
                                    0 && (
                                    <>
                                        <Separator />
                                        <div className="space-y-3">
                                            <h4 className="flex items-center gap-2">
                                                <UserPlus className="w-4 h-4" />
                                                Team Information
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {selectedApplication.teamMembers && (
                                                    <div className="space-y-1 col-span-2">
                                                        <p className="text-sm text-muted-foreground">
                                                            Current Team Members
                                                        </p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {selectedApplication.teamMembers?.map(
                                                                (
                                                                    member,
                                                                    idx
                                                                ) => (
                                                                    <Badge
                                                                        key={
                                                                            idx
                                                                        }
                                                                        variant="secondary"
                                                                    >
                                                                        {
                                                                            member.member_name
                                                                        }
                                                                    </Badge>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}

                                <Separator />

                                {/* Description */}
                                <div className="space-y-3">
                                    <h4>Description</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedApplication.description}
                                    </p>
                                </div>

                                {/* Document */}
                                {selectedApplication.proposalDocument && (
                                    <>
                                        <Separator />
                                        <div className="space-y-3">
                                            <h4>Attached Document</h4>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-2"
                                            >
                                                <FileText className="w-3 h-3" />
                                                {
                                                    selectedApplication.proposalDocument
                                                }
                                            </Button>
                                        </div>
                                    </>
                                )}

                                {/* Response Notes */}
                                {selectedApplication.responseNotes && (
                                    <>
                                        <Separator />
                                        <div className="space-y-3">
                                            <h4>Response from Supervisor</h4>
                                            <div className="p-3 bg-muted rounded-md">
                                                <p className="text-sm">
                                                    {
                                                        selectedApplication.responseNotes
                                                    }
                                                </p>
                                                {selectedApplication.responseDate && (
                                                    <p className="text-xs text-muted-foreground mt-2">
                                                        Responded on{" "}
                                                        {new Date(
                                                            selectedApplication.responseDate
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month: "long",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            }
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
}
