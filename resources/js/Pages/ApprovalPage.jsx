import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react"; // Tambahkan router
import MainLayout from "@/Layouts/MainLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/Components/ui/dialog";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
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
    ThumbsUp,
} from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Separator } from "@/Components/ui/separator";
import { toast } from "sonner";

// 1. TERIMA DATA DARI CONTROLLER
export default function ApprovalPage({ approvalRequests = [] }) {
    const [localRequests, setLocalRequests] = useState(approvalRequests);

    // Sinkronisasi state jika props berubah
    useEffect(() => {
        setLocalRequests(approvalRequests);
    }, [approvalRequests]);

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
    const [actionType, setActionType] = useState("approve");
    const [responseNote, setResponseNote] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    // --- HELPERS ---
    const getStatusColor = (status) => {
        switch (status) {
            case "approved":
                return "bg-blue-100 text-blue-700 border-blue-200"; // Ubah ke biru
            case "completed":
                return "bg-green-100 text-green-700 border-green-200"; // Tambahkan ini
            case "rejected":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "approved":
                return <CheckCircle2 className="w-4 h-4" />; // Tetap CheckCircle
            case "completed":
                return <ThumbsUp className="w-4 h-4" />; // Tambahkan ini
            case "rejected":
                return <XCircle className="w-4 h-4" />;
            case "pending":
                return <Clock className="w-4 h-4" />;
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case "PKL":
                return <BookOpen className="w-4 h-4" />;
            case "Tugas Akhir":
                return <FileText className="w-4 h-4" />;
            case "Lomba":
                return <Award className="w-4 h-4" />;
        }
    };

    // --- HANDLERS ---

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

    // 2. LOGIKA SUBMIT KE DATABASE
    const handleSubmitAction = () => {
        if (!selectedRequest) return;

        router.put(
            route("approval.update", selectedRequest.id),
            {
                action: actionType, // 'approve' atau 'reject'
                notes: responseNote,
            },
            {
                onSuccess: () => {
                    toast.success(`Request ${actionType}d successfully`);
                    setIsActionDialogOpen(false);
                    setIsDialogOpen(false);
                    setSelectedRequest(null);
                    setResponseNote("");
                },
                onError: () => toast.error("Failed to process request"),
            }
        );
    };

    // --- FILTERING ---
    const pendingRequests = localRequests.filter((r) => r.status === "pending");
    const approvedRequests = localRequests.filter(
        (r) => r.status === "approved"
    );
    const completedRequests = localRequests.filter(
        (r) => r.status === "completed"
    ); // TAMBAHKAN INI
    const rejectedRequests = localRequests.filter(
        (r) => r.status === "rejected"
    );

    const getFilteredRequests = () => {
        switch (activeTab) {
            case "pending":
                return { requests: pendingRequests, showActions: true };
            case "approved":
                return { requests: approvedRequests, showActions: false };
            case "completed": // TAMBAHKAN INI
                return { requests: completedRequests, showActions: false };
            case "rejected":
                return { requests: rejectedRequests, showActions: false };
            default:
                return { requests: localRequests, showActions: false };
        }
    };

    const { requests: displayedRequests, showActions: showTabActions } =
        getFilteredRequests();

    // --- RENDER TABLE ---
    const renderRequestsTable = (requests, showActions) => {
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
                            {/* <TableHead>Type</TableHead> */}
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
                                    <div>
                                        <p className="font-medium">
                                            {request.individualStudentName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {request.individualStudentNim}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-start gap-2">
                                        <div className="mt-1 text-muted-foreground">
                                            {getActivityIcon(
                                                request.activityType
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="line-clamp-1 font-medium">
                                                {request.activityName}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {request.activityType}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                {/* <TableCell>
                                    <Badge variant="outline" className="capitalize">
                                        {request.requestType}
                                    </Badge>
                                </TableCell> */}
                                <TableCell>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Calendar className="w-3 h-3" />
                                        {request.submittedDate}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={`gap-1 capitalize ${getStatusColor(
                                            request.status
                                        )}`}
                                        variant="outline"
                                    >
                                        {getStatusIcon(request.status)}
                                        {request.status
                                            .charAt(0)
                                            .toUpperCase() +
                                            request.status.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1 md:gap-2 flex-wrap">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleViewDetails(request)
                                            }
                                        >
                                            <Eye className="w-3 h-3 md:mr-1" />
                                            <span className="hidden md:inline">
                                                View
                                            </span>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    };

    return (
        <MainLayout>
            <Head title="Approval Center" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1>Approval Center</h1>
                        <p className="text-sm text-muted-foreground">
                            Review and manage student requests for supervision
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Pending Requests
                            </CardTitle>
                            <Clock className="w-4 h-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y     -1">
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
                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
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
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">Completed</CardTitle>
                            <ThumbsUp className="w-4 h-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {completedRequests.length}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Finished activities
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
                            You have {pendingRequests.length} pending request(s)
                            that require your attention.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Requests Table with Tabs */}
                <Card>
                    <CardHeader>
                        <CardTitle>Requests List</CardTitle>
                        <CardDescription>
                            Manage all student requests for PKL, Thesis, and
                            Competition activities
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
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All ({approvalRequests.length})
                                        </SelectItem>
                                        <SelectItem value="pending">
                                            Pending ({pendingRequests.length})
                                        </SelectItem>
                                        <SelectItem value="approved">
                                            Approved ({approvedRequests.length})
                                        </SelectItem>
                                        <SelectItem value="rejected">
                                            Rejected ({rejectedRequests.length})
                                        </SelectItem>
                                        <SelectItem value="completed">
                                            Completed (
                                            {completedRequests.length})
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Desktop Tabs */}
                            <TabsList className="hidden md:grid w-full grid-cols-5 mb-6">
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
                                <TabsTrigger
                                    value="completed"
                                    className="gap-2"
                                >
                                    <ThumbsUp className="w-4 h-4" />
                                    Completed ({completedRequests.length})
                                </TabsTrigger>
                            </TabsList>

                            {/* Content */}
                            <TabsContent value="all">
                                {renderRequestsTable(approvalRequests, false)}
                            </TabsContent>
                            <TabsContent value="pending">
                                {renderRequestsTable(pendingRequests, true)}
                            </TabsContent>
                            <TabsContent value="approved">
                                {renderRequestsTable(approvedRequests, false)}
                            </TabsContent>
                            <TabsContent value="rejected">
                                {renderRequestsTable(rejectedRequests, false)}
                            </TabsContent>
                            <TabsContent value="completed">
                                {renderRequestsTable(completedRequests, false)}
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
                                Review complete information
                            </DialogDescription>
                        </DialogHeader>

                        {selectedRequest && (
                            <div className="space-y-6">
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

                                <div className="space-y-3">
                                    <h4 className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Student Information
                                    </h4>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">
                                                Student Name
                                            </p>
                                            <p className="font-medium">
                                                {
                                                    selectedRequest.individualStudentName
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">
                                                NIM
                                            </p>
                                            <p>
                                                {
                                                    selectedRequest.individualStudentNim
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">
                                                Email
                                            </p>
                                            <p>
                                                {
                                                    selectedRequest.individualStudentEmail
                                                }
                                            </p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-muted-foreground">
                                                Interest Area
                                            </p>
                                            <p>
                                                {
                                                    selectedRequest.individualStudentFocus
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

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

                                        {selectedRequest.teamName && (
                                            <div className="space-y-1">
                                                <p className="text-sm text-muted-foreground">
                                                    Team Name
                                                </p>
                                                <p>
                                                    {selectedRequest.teamName}
                                                </p>
                                            </div>
                                        )}

                                        {selectedRequest.teamMembers &&
                                            selectedRequest.teamMembers.length >
                                                0 && (
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
                                                                    {
                                                                        member.name
                                                                    }
                                                                </Badge>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Description
                                    </p>
                                    <p className="text-sm bg-muted p-3 rounded-md">
                                        {selectedRequest.activityDescription}
                                    </p>
                                </div>

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

                                {/* Tombol Aksi di dalam Detail */}
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
                                    ? "Add notes (optional)"
                                    : "Please provide a reason for rejection *"}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-2">
                            <div className="p-3 bg-muted rounded-lg text-sm">
                                <p className="font-medium">
                                    {selectedRequest?.studentName}
                                </p>
                                <p className="text-muted-foreground">
                                    {selectedRequest?.activityName}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    placeholder={
                                        actionType === "approve"
                                            ? "Notes..."
                                            : "Reason for rejection..."
                                    }
                                    value={responseNote}
                                    onChange={(e) =>
                                        setResponseNote(e.target.value)
                                    }
                                />
                            </div>
                        </div>

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
                                className={
                                    actionType === "approve"
                                        ? "bg-green-600 hover:bg-green-700"
                                        : ""
                                }
                                onClick={handleSubmitAction}
                                disabled={
                                    actionType === "reject" &&
                                    !responseNote.trim()
                                }
                            >
                                Confirm{" "}
                                {actionType === "approve"
                                    ? "Approval"
                                    : "Rejection"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
}
