import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/Components/ui/dialog";
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
    UserPlus,
} from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Separator } from "@/Components/ui/separator";
import { toast } from "sonner";

// TERIMA PROPS DARI CONTROLLER
export default function ApplicationStatusPage({ applications = [] }) {
    // State Data
    const [localApplications, setLocalApplications] = useState(applications);

    // Sinkronisasi jika props berubah
    useEffect(() => {
        setLocalApplications(applications);
    }, [applications]);

    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
    const [invitationResponse, setInvitationResponse] = useState(null);
    const [activeTab, setActiveTab] = useState("all");

    // --- HELPERS ---
    const getStatusColor = (status) => {
        switch (status) {
            case "approved":
                return "bg-green-100 text-green-700 border-green-200";
            case "rejected":
                return "bg-red-100 text-red-700 border-red-200";
            case "pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getActivityIcon = (type) => {
        const t = type ? type.toLowerCase() : "";
        if (t.includes("pkl")) return <BookOpen className="w-4 h-4" />;
        if (t.includes("thesis")) return <FileText className="w-4 h-4" />;
        if (t.includes("competition")) return <Award className="w-4 h-4" />;
        return <FileText className="w-4 h-4" />;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "approved":
                return <CheckCircle2 className="w-4 h-4" />;
            case "rejected":
                return <XCircle className="w-4 h-4" />;
            case "pending":
                return <Clock className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    // --- HANDLERS ---

    const handleViewDetails = (application) => {
        setSelectedApplication(application);
        setIsDialogOpen(true);
    };

    const handleRespondToInvitation = (application, response) => {
        if (!["accept", "decline"].includes(response)) return;
        setSelectedApplication(application);
        setInvitationResponse(response);
        setIsResponseDialogOpen(true);
    };

    const handleSubmitResponse = () => {
        if (!selectedApplication) return;

        router.post(
            route("application.respond", selectedApplication.id),
            {
                response: invitationResponse, // 'accept' or 'decline'
            },
            {
                onSuccess: () => {
                    toast.success(
                        invitationResponse === "accept"
                            ? "Invitation Accepted"
                            : "Invitation Declined"
                    );
                    setIsResponseDialogOpen(false);
                    setSelectedApplication(null);
                },
                onError: () => toast.error("Failed to process request"),
            }
        );
    };

    // --- FILTERING ---
    const pendingApplications = localApplications.filter(
        (a) => a.status === "pending"
    );
    const approvedApplications = localApplications.filter(
        (a) => a.status === "approved"
    );
    const rejectedApplications = localApplications.filter(
        (a) => a.status === "rejected"
    );

    // Filter khusus untuk notifikasi alert (Hanya Undangan Tim yang Pending)
    const pendingInvitations = localApplications.filter(
        (a) => a.applicationType === "invitation" && a.status === "pending"
    );

    const filteredApplications =
        activeTab === "all"
            ? localApplications
            : activeTab === "pending"
            ? pendingApplications
            : activeTab === "approved"
            ? approvedApplications
            : rejectedApplications;

    // --- RENDERER ---
    const renderApplicationCard = (application) => {
        const isInvitation = application.applicationType === "invitation";
        const isPending = application.status === "pending";

        return (
            <Card
                key={application.id}
                className={isPending && isInvitation ? "border-primary" : ""}
            >
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                                <div className="p-2 rounded-lg mt-1 bg-gray-100">
                                    {getActivityIcon(application.activityType)}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-start gap-2 flex-wrap">
                                        <Badge variant="outline">
                                            {application.activityType}
                                        </Badge>
                                        {isInvitation && (
                                            <Badge
                                                variant="outline"
                                                className="gap-1 bg-blue-50 text-blue-700 border-blue-200"
                                            >
                                                <UserPlus className="w-3 h-3" />{" "}
                                                Team Invitation
                                            </Badge>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {application.activityName}
                                        </p>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {application.description}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            {isInvitation
                                                ? `Invited by: ${application.invitedBy}`
                                                : `Supervisor: ${application.supervisorName}`}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {application.submittedDate}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Badge
                                className={`gap-1 capitalize ${getStatusColor(
                                    application.status
                                )}`}
                            >
                                {getStatusIcon(application.status)}
                                {application.status}
                            </Badge>
                        </div>

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

                            {/* Action Buttons for Pending Invitations */}
                            {isPending && isInvitation && (
                                <>
                                    <Button
                                        size="sm"
                                        className="gap-1 sm:gap-2 flex-1 sm:flex-initial bg-green-600 text-white hover:bg-green-700"
                                        onClick={() =>
                                            handleRespondToInvitation(
                                                application,
                                                "accept"
                                            )
                                        }
                                    >
                                        <CheckCircle2 className="w-3 h-3" />{" "}
                                        Accept
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="gap-1 sm:gap-2 flex-1 sm:flex-initial bg-red-600 text-white hover:bg-red-700"
                                        onClick={() =>
                                            handleRespondToInvitation(
                                                application,
                                                "decline"
                                            )
                                        }
                                    >
                                        <XCircle className="w-3 h-3" /> Decline
                                    </Button>
                                </>
                            )}
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
                    <Card>
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
                                        {localApplications.length}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    All submissions & invitations
                                </p>
                            </div>
                        </CardContent>
                    </Card>
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
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
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
                            <CardTitle className="text-sm">
                                Pending Invitations
                            </CardTitle>
                            <UserPlus className="w-4 h-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {pendingInvitations.length}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Requires your action
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Alert for pending invitations */}
                {pendingInvitations.length > 0 && (
                    <Alert className="border-primary bg-blue-50">
                        <AlertCircle className="h-4 w-4 text-primary" />
                        <AlertDescription className="text-primary">
                            You have {pendingInvitations.length} pending team
                            invitation(s) that require your response.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Main List with Tabs */}
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
                            {/* Mobile Dropdown */}
                            <div className="md:hidden mb-4">
                                <Select
                                    value={activeTab}
                                    onValueChange={setActiveTab}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Filter" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All ({localApplications.length})
                                        </SelectItem>
                                        <SelectItem value="pending">
                                            Pending (
                                            {pendingApplications.length})
                                        </SelectItem>
                                        <SelectItem value="approved">
                                            Approved (
                                            {approvedApplications.length})
                                        </SelectItem>
                                        <SelectItem value="rejected">
                                            Rejected (
                                            {rejectedApplications.length})
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Desktop Tabs */}
                            <TabsList className="hidden md:grid w-full grid-cols-4">
                                <TabsTrigger value="all">
                                    All ({localApplications.length})
                                </TabsTrigger>
                                <TabsTrigger value="pending">
                                    Pending ({pendingApplications.length})
                                </TabsTrigger>
                                <TabsTrigger value="approved">
                                    Approved ({approvedApplications.length})
                                </TabsTrigger>
                                <TabsTrigger value="rejected">
                                    Rejected ({rejectedApplications.length})
                                </TabsTrigger>
                            </TabsList>

                            <div className="mt-6 space-y-4">
                                {filteredApplications.length > 0 ? (
                                    filteredApplications.map((app) =>
                                        renderApplicationCard(app)
                                    )
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground border rounded-lg bg-gray-50">
                                        <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>No applications found.</p>
                                    </div>
                                )}
                            </div>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Application Status Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Application Details</DialogTitle>
                            <DialogDescription>
                                {selectedApplication?.applicationType ===
                                "invitation"
                                    ? "Team Invitation"
                                    : "Submission Details"}
                            </DialogDescription>
                        </DialogHeader>

                        {selectedApplication && (
                            <div className="space-y-6">
                                {/* Status & Submitted Date */}
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
                                            Submitted Date
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

                                {/* Supervision Information */}
                                <div className="space-y-3">
                                    <h4 className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Supervisor Information
                                    </h4>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">
                                                Name
                                            </p>
                                            <p className="font-medium">
                                                {
                                                    selectedApplication.supervisorName
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">
                                                Email
                                            </p>
                                            <p>
                                                {
                                                    selectedApplication.supervisorEmail
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Activity Information */}
                                <div className="space-y-3">
                                    <h4 className="flex items-center gap-2">
                                        {getActivityIcon(
                                            selectedApplication.activityType
                                        )}
                                        Activity Information
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">
                                                Activity Type
                                            </p>
                                            <Badge variant="outline">
                                                {
                                                    selectedApplication.activityType
                                                }
                                            </Badge>
                                        </div>
                                        <div className="space-y-1 col-span-2">
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

                                {/* Description */}
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Description
                                    </p>
                                    <p className="text-sm bg-muted p-3 rounded-md">
                                        {selectedApplication.description}
                                    </p>
                                </div>

                                {/* Optional Notes */}
                                {selectedApplication.notes && (
                                    <>
                                        <Separator />
                                        <div className="space-y-3">
                                            <h4>Review Notes</h4>
                                            <div className="p-3 bg-muted rounded-md">
                                                <p className="text-sm">
                                                    {selectedApplication.notes}
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
}
