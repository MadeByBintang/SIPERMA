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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Components/ui/tabs";
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
} from "lucide-react";
import { Alert, AlertDescription } from "../Components/ui/alert";
import { Separator } from "../Components/ui/separator";

const ActivityType = "PKL" | "Thesis" | "Competition";
const ApplicationStatus = "pending" | "approved" | "rejected";
const ApplicationType = "submission" | "invitation";

const Application = [
    {
        id: 'number',
        activityType: 'ActivityType',
        activityName: 'string',
        applicationType: 'ApplicationType',
        submittedDate: 'string',
        status: 'ApplicationStatus',
        description: 'string',
        supervisorName: 'string',
        supervisorEmail: 'string',
        companyName: 'string',
        teamLeader: 'string',
        teamMembers: 'string',
        proposalDocument: 'string',
        responseDate: 'string',
        responseNotes: 'string',
        invitedBy: 'string',
    },
];

export default function ApplicationStatusPage() {
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
    const [invitationResponse, setInvitationResponse] = useState (null);
    const [activeTab, setActiveTab] = useState("all");

    const applications = [
        {
            id: 1,
            activityType: "PKL",
            activityName: "Internship at Tech Startup Indonesia",
            applicationType: "submission",
            submittedDate: "2024-10-15",
            status: "pending",
            description:
                "I would like to request your supervision for my PKL at Tech Startup Indonesia. The internship focuses on developing a mobile application using React Native and Node.js.",
            supervisorName: "Dr. Sarah Wijaya, M.Kom",
            supervisorEmail: "sarah.wijaya@university.edu",
            companyName: "Tech Startup Indonesia",
            proposalDocument: "PKL_Proposal.pdf",
        },
        {
            id: 2,
            activityType: "Thesis",
            activityName: "Deep Learning for Indonesian Sentiment Analysis",
            applicationType: "submission",
            submittedDate: "2024-10-18",
            status: "approved",
            description:
                "Research on sentiment analysis for Indonesian text using deep learning approaches with BERT model.",
            supervisorName: "Dr. Sarah Wijaya, M.Kom",
            supervisorEmail: "sarah.wijaya@university.edu",
            proposalDocument: "Thesis_Proposal.pdf",
            responseDate: "2024-10-20",
            responseNotes:
                "Excellent proposal with clear research methodology. Approved for thesis supervision. Please schedule a meeting to discuss the research timeline.",
        },
        {
            id: 3,
            activityType: "Competition",
            activityName: "National AI Innovation Hackathon 2024",
            applicationType: "invitation",
            submittedDate: "2024-10-22",
            status: "pending",
            description:
                "You have been invited by Budi Santoso to join the team for National AI Innovation Hackathon 2024. The competition focuses on healthcare AI solutions.",
            supervisorName: "Dr. Sarah Wijaya, M.Kom",
            supervisorEmail: "sarah.wijaya@university.edu",
            invitedBy: "Budi Santoso",
            teamLeader: "Budi Santoso",
            teamMembers: ["Dewi Lestari", "Eko Prasetyo"],
        },
        {
            id: 4,
            activityType: "PKL",
            activityName: "Backend Development Internship",
            applicationType: "submission",
            submittedDate: "2024-09-10",
            status: "rejected",
            description:
                "Internship focusing on backend development with Go and microservices architecture.",
            supervisorName: "Prof. Ahmad Suryanto, Ph.D",
            supervisorEmail: "ahmad.suryanto@university.edu",
            companyName: "Cloud Solutions Inc",
            proposalDocument: "PKL_Proposal_Backend.pdf",
            responseDate: "2024-09-15",
            responseNotes:
                "Unfortunately, I am currently at maximum capacity for PKL supervision. I recommend contacting Dr. Rudi Hartono who has expertise in backend development and microservices.",
        },
        {
            id: 5,
            activityType: "Competition",
            activityName: "Web Design Competition 2024",
            applicationType: "invitation",
            submittedDate: "2024-09-05",
            status: "approved",
            description:
                "Invitation to join UI/UX design competition focusing on accessible web design.",
            supervisorName: "Dr. Rina Kusuma, M.T",
            supervisorEmail: "rina.kusuma@university.edu",
            invitedBy: "Indah Sari",
            teamLeader: "Indah Sari",
            teamMembers: ["Joko Susilo", "Karina Dewi"],
            responseDate: "2024-09-06",
            responseNotes:
                "Accepted the team invitation. Looking forward to working together!",
        },
        {
            id: 6,
            activityType: "PKL",
            activityName: "Data Science Internship",
            applicationType: "invitation",
            submittedDate: "2024-10-25",
            status: "pending",
            description:
                "You have been invited to join the data science internship team at Analytics Corp. The project involves customer behavior analysis and predictive modeling.",
            supervisorName: "Prof. Ahmad Suryanto, Ph.D",
            supervisorEmail: "ahmad.suryanto@university.edu",
            invitedBy: "Siti Nurhaliza",
            teamLeader: "Siti Nurhaliza",
            teamMembers: ["Farhan Abdullah"],
            companyName: "Analytics Corp",
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "approved":
                return "bg-green-100 text-green-700";
            case "rejected":
                return "bg-red-100 text-red-700";
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case "PKL":
                return <BookOpen className="w-4 h-4" />;
            case "Thesis":
                return <FileText className="w-4 h-4" />;
            case "Competition":
                return <Award className="w-4 h-4" />;
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
        }
    };

    const handleViewDetails = (application) => {
        setSelectedApplication(application);
        setIsDialogOpen(true);
    };

    const handleRespondToInvitation = (application, response) => {
        if (!["accept", "decline"].includes(response)) {
            console.error("Invalid response value");
            return;
        }

        setSelectedApplication(application);
        setInvitationResponse(response);
        setIsResponseDialogOpen(true);
    };

    const handleSubmitResponse = () => {
        console.log(
            `${invitationResponse} invitation ${selectedApplication?.id}`
        );
        setIsResponseDialogOpen(false);
        setSelectedApplication(null);
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
    const pendingInvitations = applications.filter(
        (a) => a.applicationType === "invitation" && a.status === "pending"
    );

    const filteredApplications =
        activeTab === "all"
            ? applications
            : activeTab === "pending"
            ? pendingApplications
            : activeTab === "approved"
            ? approvedApplications
            : rejectedApplications;

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
                                <div
                                    className={`p-2 rounded-lg mt-1 ${
                                        application.activityType === "PKL"
                                            ? "bg-blue-100"
                                            : application.activityType ===
                                              "Thesis"
                                            ? "bg-green-100"
                                            : "bg-orange-100"
                                    }`}
                                >
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
                                                className="gap-1"
                                            >
                                                <UserPlus className="w-3 h-3" />
                                                Team Invitation
                                            </Badge>
                                        )}
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
                                            {isInvitation
                                                ? `Invited by: ${application.invitedBy}`
                                                : `Supervisor: ${application.supervisorName}`}
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
                                        <CheckCircle2 className="w-3 h-3" />
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
                                        <XCircle className="w-3 h-3" />
                                        Decline
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
                                        {applications.length}
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
                    <Alert className="border-primary">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            You have {pendingInvitations.length} pending team{" "}
                            {pendingInvitations.length === 1
                                ? "invitation"
                                : "invitations"}{" "}
                            that{" "}
                            {pendingInvitations.length === 1
                                ? "requires"
                                : "require"}{" "}
                            your response.
                        </AlertDescription>
                    </Alert>
                )}

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
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Desktop: Tabs */}
                            <TabsList className="hidden md:grid w-full grid-cols-4">
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
                            <DialogDescription>
                                {selectedApplication?.applicationType ===
                                "invitation"
                                    ? "Team invitation details"
                                    : "Submission details"}
                            </DialogDescription>
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
                                            {selectedApplication.applicationType ===
                                            "invitation"
                                                ? "Invited On"
                                                : "Submitted On"}
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
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">
                                                Application Type
                                            </p>
                                            <Badge variant="outline">
                                                {selectedApplication.applicationType ===
                                                "invitation"
                                                    ? "Team Invitation"
                                                    : "Supervision Request"}
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

                                {/* Team Information (for invitations) */}
                                {selectedApplication.applicationType ===
                                    "invitation" && (
                                    <>
                                        <Separator />
                                        <div className="space-y-3">
                                            <h4 className="flex items-center gap-2">
                                                <UserPlus className="w-4 h-4" />
                                                Team Information
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {selectedApplication.invitedBy && (
                                                    <div className="space-y-1">
                                                        <p className="text-sm text-muted-foreground">
                                                            Invited By
                                                        </p>
                                                        <p>
                                                            {
                                                                selectedApplication.invitedBy
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                                {selectedApplication.teamLeader && (
                                                    <div className="space-y-1">
                                                        <p className="text-sm text-muted-foreground">
                                                            Team Leader
                                                        </p>
                                                        <p>
                                                            {
                                                                selectedApplication.teamLeader
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                                {selectedApplication.teamMembers && (
                                                    <div className="space-y-1 col-span-2">
                                                        <p className="text-sm text-muted-foreground">
                                                            Current Team Members
                                                        </p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {selectedApplication.teamMembers.map(
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
                                                                        {member}
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

                                {/* Action Buttons for Pending Invitations */}
                                {selectedApplication.status === "pending" &&
                                    selectedApplication.applicationType ===
                                        "invitation" && (
                                        <>
                                            <Separator />
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <Button
                                                    className="flex-1 gap-2 bg-green-600 text-white hover:bg-green-700"
                                                    onClick={() => {
                                                        setIsDialogOpen(false);
                                                        handleRespondToInvitation(
                                                            selectedApplication,
                                                            "accept"
                                                        );
                                                    }}
                                                >
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Accept Invitation
                                                </Button>
                                                <Button
                                                    className="flex-1 gap-2 bg-red-600 text-white hover:bg-red-700"
                                                    onClick={() => {
                                                        setIsDialogOpen(false);
                                                        handleRespondToInvitation(
                                                            selectedApplication,
                                                            "decline"
                                                        );
                                                    }}
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    Decline Invitation
                                                </Button>
                                            </div>
                                        </>
                                    )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Invitation Response Dialog */}
                <Dialog
                    open={isResponseDialogOpen}
                    onOpenChange={setIsResponseDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {invitationResponse === "accept"
                                    ? "Accept Team Invitation"
                                    : "Decline Team Invitation"}
                            </DialogTitle>
                            <DialogDescription>
                                {invitationResponse === "accept"
                                    ? "Confirm that you want to join this team"
                                    : "Are you sure you want to decline this invitation?"}
                            </DialogDescription>
                        </DialogHeader>

                        {selectedApplication && (
                            <div className="space-y-4">
                                <div className="p-3 bg-accent rounded-lg">
                                    <p className="text-sm">
                                        {selectedApplication.activityName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Team Leader:{" "}
                                        {selectedApplication.teamLeader}
                                    </p>
                                </div>

                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        {invitationResponse === "accept"
                                            ? "By accepting this invitation, you will be added to the team and the supervisor will be notified."
                                            : "The team leader will be notified of your decision."}
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsResponseDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant={
                                    invitationResponse === "accept"
                                        ? "default"
                                        : "destructive"
                                }
                                onClick={handleSubmitResponse}
                            >
                                {invitationResponse === "accept"
                                    ? "Confirm Accept"
                                    : "Confirm Decline"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
}
