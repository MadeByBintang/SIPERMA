import { useState } from "react";
import { Head } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "../ui/dialog";
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
import { Alert, AlertDescription } from "../ui/alert";
import { Separator } from "../ui/separator";

export default function ApplicationStatusPage() {
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
    const [invitationResponse, setInvitationResponse] = useState("accept");
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
            <Card key={application.id}>
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

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1 flex-1"
                                onClick={() => handleViewDetails(application)}
                            >
                                <Eye className="w-3 h-3" /> View
                            </Button>
                            {isPending && isInvitation && (
                                <>
                                    <Button
                                        size="sm"
                                        className="gap-1 flex-1 bg-green-600 text-white hover:bg-green-700"
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
                                        className="gap-1 flex-1 bg-red-600 text-white hover:bg-red-700"
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
        <>
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

                {/* List aplikasi */}
                <Card>
                    <CardHeader>
                        <CardTitle>My Applications</CardTitle>
                        <CardDescription>
                            All PKL, Thesis, and Competitions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="w-full grid grid-cols-4">
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="pending">
                                    Pending
                                </TabsTrigger>
                                <TabsTrigger value="approved">
                                    Approved
                                </TabsTrigger>
                                <TabsTrigger value="rejected">
                                    Rejected
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

                {/* Dialog Detail */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Application Details</DialogTitle>
                            <DialogDescription>
                                {selectedApplication?.activityName}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button onClick={() => setIsDialogOpen(false)}>
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Dialog Respon */}
                <Dialog
                    open={isResponseDialogOpen}
                    onOpenChange={setIsResponseDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {invitationResponse === "accept"
                                    ? "Accept Invitation"
                                    : "Decline Invitation"}
                            </DialogTitle>
                        </DialogHeader>
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
                                Confirm
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
