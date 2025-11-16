import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
    CheckCircle2,
    XCircle,
    Clock,
    User,
    BookOpen,
    FileText,
    Award,
    Calendar,
    Mail,
    AlertCircle,
    Eye,
} from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";

// Komponen ini bisa langsung dipanggil dari Laravel route seperti:
// return Inertia::render('ApprovalPage', ['user' => Auth::user()]);
export default function ApprovalPage({ auth }) {
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
    const [actionType, setActionType] = useState("approve");
    const [responseNote, setResponseNote] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    const approvalRequests = [
        {
            id: 1,
            studentName: "Ahmad Rizki Pratama",
            studentNIM: "2021001234",
            studentEmail: "ahmad.rizki@university.edu",
            activityType: "PKL",
            activityName: "Internship at Tech Startup Indonesia",
            requestType: "supervision",
            submittedDate: "2024-10-15",
            status: "pending",
            description:
                "I would like to request your supervision for my PKL at Tech Startup Indonesia. The internship focuses on developing a mobile application using React Native and Node.js, which aligns with your expertise in software engineering and mobile development.",
            studentGPA: 3.85,
            studentInterest: "Machine Learning & Mobile Development",
            companyName: "Tech Startup Indonesia",
            proposalDocument: "PKL_Proposal_Ahmad.pdf",
        },
        {
            id: 2,
            studentName: "Siti Nurhaliza",
            studentNIM: "2021002345",
            studentEmail: "siti.nur@university.edu",
            activityType: "Thesis",
            activityName: "Deep Learning for Indonesian Sentiment Analysis",
            requestType: "supervision",
            submittedDate: "2024-10-18",
            status: "pending",
            description:
                "I am interested in conducting research on sentiment analysis for Indonesian text using deep learning approaches. I believe your expertise in AI and NLP would be invaluable for this research.",
            studentGPA: 3.75,
            studentInterest: "Data Science & NLP",
            proposalDocument: "Thesis_Proposal_Siti.pdf",
        },
        {
            id: 3,
            studentName: "Budi Santoso",
            studentNIM: "2021003456",
            studentEmail: "budi.santoso@university.edu",
            activityType: "Competition",
            activityName: "National AI Innovation Hackathon 2024",
            requestType: "supervision",
            submittedDate: "2024-10-20",
            status: "pending",
            description:
                "Our team is participating in the National AI Innovation Hackathon focusing on healthcare AI solutions. We would be honored to have you as our advisor for this competition.",
            teamLeader: "Budi Santoso",
            teamMembers: ["Dewi Lestari", "Eko Prasetyo", "Fitri Rahmawati"],
            proposalDocument: "Competition_Proposal_Team.pdf",
        },
        {
            id: 4,
            studentName: "Dewi Lestari",
            studentNIM: "2021004567",
            studentEmail: "dewi.lestari@university.edu",
            activityType: "PKL",
            activityName: "Software Development Internship",
            requestType: "team-invitation",
            submittedDate: "2024-10-22",
            status: "pending",
            description:
                "I have been invited by Ahmad Rizki Pratama to join his PKL team at Tech Startup Indonesia. This is a confirmation request for joining the team under your supervision.",
            companyName: "Tech Startup Indonesia",
            teamLeader: "Ahmad Rizki Pratama",
        },
        {
            id: 5,
            studentName: "Farhan Abdullah",
            studentNIM: "2021006789",
            studentEmail: "farhan.abdullah@university.edu",
            activityType: "Thesis",
            activityName: "Real-time Object Detection for Autonomous Vehicles",
            requestType: "supervision",
            submittedDate: "2024-09-15",
            status: "approved",
            description:
                "Research on implementing YOLO algorithm for real-time object detection in autonomous vehicle systems.",
            studentGPA: 3.92,
            studentInterest: "Computer Vision & AI",
            proposalDocument: "Thesis_Proposal_Farhan.pdf",
            notes: "Excellent proposal with clear research methodology. Approved for thesis supervision.",
        },
        {
            id: 6,
            studentName: "Gita Permata",
            studentNIM: "2021007890",
            studentEmail: "gita.permata@university.edu",
            activityType: "Thesis",
            activityName: "Cloud-based Microservices Architecture",
            requestType: "supervision",
            submittedDate: "2024-09-20",
            status: "approved",
            description:
                "Designing and implementing a scalable microservices architecture for e-learning platforms using cloud technologies.",
            studentGPA: 3.78,
            studentInterest: "Cloud Computing & Software Architecture",
            proposalDocument: "Thesis_Proposal_Gita.pdf",
            notes: "Good research topic with practical implementation. Approved.",
        },
        {
            id: 7,
            studentName: "Hendra Wijaya",
            studentNIM: "2021008901",
            studentEmail: "hendra.wijaya@university.edu",
            activityType: "PKL",
            activityName: "Data Analytics Internship",
            requestType: "supervision",
            submittedDate: "2024-08-10",
            status: "rejected",
            description:
                "Internship at a marketing analytics company focusing on customer behavior analysis.",
            companyName: "Marketing Analytics Corp",
            notes: "This internship does not align with my supervision capacity. Suggested to contact Prof. Ahmad Suryanto for data analytics supervision.",
        },
        {
            id: 8,
            studentName: "Indah Sari",
            studentNIM: "2021009012",
            studentEmail: "indah.sari@university.edu",
            activityType: "Competition",
            activityName: "Web Development Championship",
            requestType: "supervision",
            submittedDate: "2024-09-25",
            status: "rejected",
            description:
                "Competing in web development championship, focusing on full-stack development.",
            teamLeader: "Indah Sari",
            teamMembers: ["Joko Susilo", "Karina Dewi"],
            notes: "Currently at maximum capacity for competition supervision. Suggested to contact Dr. Rudi Hartono.",
        },
    ];

    const getStatusColor = (status) =>
        ({
            approved: "bg-green-100 text-green-700",
            rejected: "bg-red-100 text-red-700",
            pending: "bg-yellow-100 text-yellow-700",
        }[status] || "bg-gray-100 text-gray-700");

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

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setIsDialogOpen(true);
    };

    const handleApproveClick = (request) => {
        setSelectedRequest(request);
        setActionType("approve");
        setResponseNote("");
        setIsActionDialogOpen(true);
    };

    const handleRejectClick = (request) => {
        setSelectedRequest(request);
        setActionType("reject");
        setResponseNote("");
        setIsActionDialogOpen(true);
    };

    const handleSubmitAction = () => {
        console.log(
            `${actionType} request ${selectedRequest?.id}:`,
            responseNote
        );
        setIsActionDialogOpen(false);
        setSelectedRequest(null);
        setResponseNote("");
    };

    const pendingRequests = approvalRequests.filter(
        (r) => r.status === "pending"
    );
    const approvedRequests = approvalRequests.filter(
        (r) => r.status === "approved"
    );
    const rejectedRequests = approvalRequests.filter(
        (r) => r.status === "rejected"
    );

    const getFilteredRequests = () => {
        switch (activeTab) {
            case "pending":
                return { requests: pendingRequests, showActions: true };
            case "approved":
                return { requests: approvedRequests, showActions: false };
            case "rejected":
                return { requests: rejectedRequests, showActions: false };
            default:
                return { requests: approvalRequests, showActions: false };
        }
    };

    const renderRequestsTable = (requests, showActions = false) => {
        if (requests.length === 0) {
            return (
                <div className="text-center py-12 text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No requests found</p>
                </div>
            );
        }

        return (
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Activity</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((request) => (
                            <TableRow key={request.id}>
                                <TableCell>
                                    <p>{request.studentName}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {request.studentNIM}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-start gap-2">
                                        {getActivityIcon(request.activityType)}
                                        <div>
                                            <p className="line-clamp-1">
                                                {request.activityName}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {request.activityType}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">
                                        {request.requestType === "supervision"
                                            ? "Supervision"
                                            : "Team Join"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(
                                            request.submittedDate
                                        ).toLocaleDateString("en-US")}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={`gap-1 ${getStatusColor(
                                            request.status
                                        )}`}
                                    >
                                        {getStatusIcon(request.status)}
                                        {request.status
                                            .charAt(0)
                                            .toUpperCase() +
                                            request.status.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handleViewDetails(request)
                                        }
                                    >
                                        <Eye className="w-3 h-3 mr-1" /> View
                                    </Button>
                                    {showActions && (
                                        <>
                                            <Button
                                                variant="default"
                                                size="sm"
                                                onClick={() =>
                                                    handleApproveClick(request)
                                                }
                                            >
                                                <CheckCircle2 className="w-3 h-3 mr-1" />{" "}
                                                Approve
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    handleRejectClick(request)
                                                }
                                            >
                                                <XCircle className="w-3 h-3 mr-1" />{" "}
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    };

    return (
        <>
            <Head title="Approval Page" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">
                            Approval Center
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Review and manage student supervision and team
                            requests
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Pending Requests
                            </CardTitle>
                            <Clock className="w-4 h-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {pendingRequests.length}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Awaiting your review
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
                                        {approvedRequests.length}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Accepted requests
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
                                        {rejectedRequests.length}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Declined requests
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Alert for pending requests */}
                {pendingRequests.length > 0 && (
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            You have {pendingRequests.length} pending{" "}
                            {pendingRequests.length === 1
                                ? "request"
                                : "requests"}{" "}
                            that{" "}
                            {pendingRequests.length === 1
                                ? "requires"
                                : "require"}{" "}
                            your attention.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Requests Table with Tabs */}
                <Card>
                    <CardHeader>
                        <CardTitle>Supervision & Team Requests</CardTitle>
                        <CardDescription>
                            Manage all student requests for PKL, Thesis, and
                            Competition activities
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
                                        <SelectValue placeholder="Filter requests" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All ({approvalRequests.length})
                                        </SelectItem>
                                        <SelectItem value="pending">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                Pending (
                                                {pendingRequests.length})
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="approved">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Approved (
                                                {approvedRequests.length})
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="rejected">
                                            <div className="flex items-center gap-2">
                                                <XCircle className="w-4 h-4" />
                                                Rejected (
                                                {rejectedRequests.length})
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Desktop: Tabs */}
                            <TabsList className="hidden md:grid w-full grid-cols-4">
                                <TabsTrigger value="all">
                                    All ({approvalRequests.length})
                                </TabsTrigger>
                                <TabsTrigger value="pending" className="gap-2">
                                    <Clock className="w-4 h-4" />
                                    Pending ({pendingRequests.length})
                                </TabsTrigger>
                                <TabsTrigger value="approved" className="gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Approved ({approvedRequests.length})
                                </TabsTrigger>
                                <TabsTrigger value="rejected" className="gap-2">
                                    <XCircle className="w-4 h-4" />
                                    Rejected ({rejectedRequests.length})
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="all" className="mt-6">
                                {renderRequestsTable(approvalRequests, false)}
                            </TabsContent>
                            <TabsContent value="pending" className="mt-6">
                                {renderRequestsTable(pendingRequests, true)}
                            </TabsContent>
                            <TabsContent value="approved" className="mt-6">
                                {renderRequestsTable(approvedRequests)}
                            </TabsContent>
                            <TabsContent value="rejected" className="mt-6">
                                {renderRequestsTable(rejectedRequests)}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* View Details Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-full md:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Request Details</DialogTitle>
                            <DialogDescription>
                                Review the complete information for this request
                            </DialogDescription>
                        </DialogHeader>

                        {selectedRequest && (
                            <div className="space-y-6">
                                {/* Status Badge */}
                                <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Request Status
                                        </p>
                                        <Badge
                                            className={`gap-1 mt-1 ${getStatusColor(
                                                selectedRequest.status
                                            )}`}
                                        >
                                            {getStatusIcon(
                                                selectedRequest.status
                                            )}
                                            {selectedRequest.status
                                                .charAt(0)
                                                .toUpperCase() +
                                                selectedRequest.status.slice(1)}
                                        </Badge>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">
                                            Submitted Date
                                        </p>
                                        <p className="text-sm">
                                            {new Date(
                                                selectedRequest.submittedDate
                                            ).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                {/* Student Information */}
                                <div className="space-y-3">
                                    <h4 className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Student Information
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">
                                                Name
                                            </p>
                                            <p>{selectedRequest.studentName}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">
                                                NIM
                                            </p>
                                            <p>{selectedRequest.studentNIM}</p>
                                        </div>
                                        <div className="space-y-1 col-span-2">
                                            <p className="text-sm text-muted-foreground">
                                                Email
                                            </p>
                                            <p className="flex items-center gap-1 text-sm">
                                                <Mail className="w-3 h-3" />
                                                {selectedRequest.studentEmail}
                                            </p>
                                        </div>
                                        {selectedRequest.studentGPA && (
                                            <div className="space-y-1">
                                                <p className="text-sm text-muted-foreground">
                                                    GPA
                                                </p>
                                                <Badge variant="secondary">
                                                    {selectedRequest.studentGPA}
                                                </Badge>
                                            </div>
                                        )}
                                        {selectedRequest.studentInterest && (
                                            <div className="space-y-1">
                                                <p className="text-sm text-muted-foreground">
                                                    Interest Area
                                                </p>
                                                <Badge>
                                                    {
                                                        selectedRequest.studentInterest
                                                    }
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                {/* Activity Information */}
                                <div className="space-y-3">
                                    <h4 className="flex items-center gap-2">
                                        {getActivityIcon(
                                            selectedRequest.activityType
                                        )}
                                        Activity Information
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">
                                                Activity Type
                                            </p>
                                            <Badge variant="outline">
                                                {selectedRequest.activityType}
                                            </Badge>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">
                                                Request Type
                                            </p>
                                            <Badge variant="outline">
                                                {selectedRequest.requestType ===
                                                "supervision"
                                                    ? "Supervision Request"
                                                    : "Team Join Request"}
                                            </Badge>
                                        </div>
                                        <div className="space-y-1 col-span-2">
                                            <p className="text-sm text-muted-foreground">
                                                Activity Name
                                            </p>
                                            <p>
                                                {selectedRequest.activityName}
                                            </p>
                                        </div>
                                        {selectedRequest.companyName && (
                                            <div className="space-y-1 col-span-2">
                                                <p className="text-sm text-muted-foreground">
                                                    Company/Organization
                                                </p>
                                                <p>
                                                    {
                                                        selectedRequest.companyName
                                                    }
                                                </p>
                                            </div>
                                        )}
                                        {selectedRequest.teamLeader && (
                                            <div className="space-y-1">
                                                <p className="text-sm text-muted-foreground">
                                                    Team Leader
                                                </p>
                                                <p>
                                                    {selectedRequest.teamLeader}
                                                </p>
                                            </div>
                                        )}
                                        {selectedRequest.teamMembers && (
                                            <div className="space-y-1 col-span-2">
                                                <p className="text-sm text-muted-foreground">
                                                    Team Members
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                    {selectedRequest.teamMembers.map(
                                                        (member, idx) => (
                                                            <Badge
                                                                key={idx}
                                                                variant="secondary"
                                                            >
                                                                {member}
                                                            </Badge>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {selectedRequest.proposalDocument && (
                                            <div className="space-y-1 col-span-2">
                                                <p className="text-sm text-muted-foreground">
                                                    Proposal Document
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-2"
                                                >
                                                    <FileText className="w-3 h-3" />
                                                    {
                                                        selectedRequest.proposalDocument
                                                    }
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                {/* Description */}
                                <div className="space-y-3">
                                    <h4>Request Description</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedRequest.description}
                                    </p>
                                </div>

                                {/* Notes (for approved/rejected) */}
                                {selectedRequest.notes && (
                                    <>
                                        <Separator />
                                        <div className="space-y-3">
                                            <h4>Review Notes</h4>
                                            <div className="p-3 bg-muted rounded-md">
                                                <p className="text-sm">
                                                    {selectedRequest.notes}
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Action Buttons */}
                                {selectedRequest.status === "pending" && (
                                    <>
                                        <Separator />
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <Button
                                                className="flex-1 gap-2"
                                                onClick={() => {
                                                    setIsDialogOpen(false);
                                                    handleApproveClick(
                                                        selectedRequest
                                                    );
                                                }}
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                Approve Request
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                className="flex-1 gap-2"
                                                onClick={() => {
                                                    setIsDialogOpen(false);
                                                    handleRejectClick(
                                                        selectedRequest
                                                    );
                                                }}
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Reject Request
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Action Dialog (Approve/Reject) */}
                <Dialog
                    open={isActionDialogOpen}
                    onOpenChange={setIsActionDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {actionType === "approve"
                                    ? "Approve Request"
                                    : "Reject Request"}
                            </DialogTitle>
                            <DialogDescription>
                                {actionType === "approve"
                                    ? "Add notes about this approval (optional)"
                                    : "Please provide a reason for rejection"}
                            </DialogDescription>
                        </DialogHeader>

                        {selectedRequest && (
                            <div className="space-y-4">
                                <div className="p-3 bg-accent rounded-lg">
                                    <p className="text-sm">
                                        {selectedRequest.studentName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {selectedRequest.activityName}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">
                                        {actionType === "approve"
                                            ? "Approval Notes (Optional)"
                                            : "Rejection Reason *"}
                                    </Label>
                                    <Textarea
                                        id="notes"
                                        placeholder={
                                            actionType === "approve"
                                                ? "Add any notes or conditions for this approval..."
                                                : "Please explain why this request is being rejected..."
                                        }
                                        value={responseNote}
                                        onChange={(e) =>
                                            setResponseNote(e.target.value)
                                        }
                                        rows={4}
                                    />
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsActionDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant={
                                    actionType === "approve"
                                        ? "default"
                                        : "destructive"
                                }
                                onClick={handleSubmitAction}
                                disabled={
                                    actionType === "reject" &&
                                    !responseNote.trim()
                                }
                            >
                                {actionType === "approve"
                                    ? "Confirm Approval"
                                    : "Confirm Rejection"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
