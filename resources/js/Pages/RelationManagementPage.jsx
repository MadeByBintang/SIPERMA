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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../Components/ui/table";
import { Badge } from "../Components/ui/badge";
import {
    Download,
    Users,
    BookOpen,
    Eye,
    Calendar,
    User,
    Info,
    Clock,
    ThumbsUp,
} from "lucide-react";
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
} from "../Components/ui/dialog";
import { Separator } from "../Components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "../Components/ui/alert";

const RelationType = "student-student" | "student-lecturer";

export default function RelationManagementPage({
    studentStudentRelations,
    studentLecturerRelations,
}) {
    const [filterStatus, setFilterStatus] = useState("all");
    const [relationType, setRelationType] = useState("student-student");
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

    const getStatusColor = (status) => {
        switch (status) {
            case "on progress":
                return "bg-blue-100 text-blue-700";
            case "completed":
                return "bg-green-100 text-green-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "on progress":
                return <Clock className="w-4 h-4" />;
            case "completed":
                return <ThumbsUp className="w-4 h-4" />;
        }
    };

    const handleViewDetails = (relation) => {
        setSelectedDetail(relation);
        setIsDetailDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDetailDialogOpen(false);
        setSelectedDetail(null);
    };

    // Filter relations based on status only
    const filteredRelations =
        relationType === "student-student"
            ? studentStudentRelations.filter((relation) => {
                  const matchesStatus =
                      filterStatus === "all" ||
                      relation.status.toLowerCase().replace(" ", "-") ===
                          filterStatus;

                  return matchesStatus;
              })
            : studentLecturerRelations.filter((relation) => {
                  const matchesStatus =
                      filterStatus === "all" ||
                      relation.status.toLowerCase().replace(" ", "-") ===
                          filterStatus;

                  return matchesStatus;
              });

    return (
        <MainLayout>
            <Head title="Relation Management" />
            <div className="space-y-6">
                {/* Info Alert */}
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>System-Managed Relations</AlertTitle>
                    <AlertDescription>
                        All relations displayed here are automatically managed
                        by the system based on registrations and approvals.
                        Relations cannot be manually edited or deleted as they
                        are linked to the database records.
                    </AlertDescription>
                </Alert>

                {/* Filters Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Relation Management</CardTitle>
                        <CardDescription>
                            View and track student relationships including PKL,
                            competitions, and thesis supervisions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                            <div className="flex flex-col md:flex-row gap-4">
                                <Select
                                    value={relationType}
                                    onValueChange={(value) =>
                                        setRelationType(value)
                                    }
                                >
                                    <SelectTrigger className="w-full md:w-64">
                                        <SelectValue placeholder="Select relation type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="student-student">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                Student-Student Relations
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="student-lecturer">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="w-4 h-4" />
                                                Student-Lecturer Relations
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filterStatus}
                                    onValueChange={setFilterStatus}
                                >
                                    <SelectTrigger className="w-full md:w-48">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Status
                                        </SelectItem>
                                        {relationType === "student-student" ? (
                                            <>
                                                <SelectItem value="on-progress">
                                                    Approved
                                                </SelectItem>
                                                <SelectItem value="completed">
                                                    Completed
                                                </SelectItem>
                                            </>
                                        ) : (
                                            <>
                                                <SelectItem value="on-progress">
                                                    Approved
                                                </SelectItem>
                                                <SelectItem value="completed">
                                                    Completed
                                                </SelectItem>
                                            </>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Relations Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {relationType === "student-student"
                                ? "Student-Student Relations (PKL & Competitions)"
                                : "Student-Lecturer Relations (Thesis)"}
                        </CardTitle>
                        <CardDescription>
                            {filteredRelations.length}{" "}
                            {filteredRelations.length === 1
                                ? "relation"
                                : "relations"}{" "}
                            found
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table className="w-full text-center">
                                <TableHeader className="[&>tr>th]:text-center">
                                    <TableRow>
                                        {relationType === "student-student" ? (
                                            <>
                                                <TableHead>
                                                    Activity Type
                                                </TableHead>
                                                <TableHead>
                                                    Activity Name
                                                </TableHead>
                                                <TableHead>
                                                    Team Members
                                                </TableHead>
                                                <TableHead>
                                                    Supervisor
                                                </TableHead>
                                                <TableHead>Period</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </>
                                        ) : (
                                            <>
                                                <TableHead>Student</TableHead>
                                                <TableHead>
                                                    Thesis Title
                                                </TableHead>
                                                <TableHead>
                                                    Supervisor
                                                </TableHead>
                                                <TableHead>
                                                    Research Area
                                                </TableHead>
                                                <TableHead>Period</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </>
                                        )}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRelations.length > 0 ? (
                                        filteredRelations.map((relation) => (
                                            <TableRow key={relation.id}>
                                                {relationType ===
                                                "student-student" ? (
                                                    <>
                                                        <TableCell>
                                                            <Badge variant="outline">
                                                                {
                                                                    relation.activityType
                                                                }
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <p className="max-w-xs">
                                                                {
                                                                    relation.activityName
                                                                }
                                                            </p>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div>
                                                                <p>
                                                                    {
                                                                        relation
                                                                            .teamMembers
                                                                            .length
                                                                    }{" "}
                                                                    Members
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Leader:{" "}
                                                                    {
                                                                        relation
                                                                            .teamMembers[0]
                                                                            .name
                                                                    }
                                                                </p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div>
                                                                <p>
                                                                    {
                                                                        relation.supervisorName
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {
                                                                        relation.supervisorNIP
                                                                    }
                                                                </p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-sm">
                                                                <p>
                                                                    {new Date(
                                                                        relation.startDate
                                                                    ).toLocaleDateString(
                                                                        "en-US",
                                                                        {
                                                                            month: "short",
                                                                            year: "numeric",
                                                                        }
                                                                    )}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    to{" "}
                                                                    {new Date(
                                                                        relation.endDate
                                                                    ).toLocaleDateString(
                                                                        "en-US",
                                                                        {
                                                                            month: "short",
                                                                            year: "numeric",
                                                                        }
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                className={getStatusColor(
                                                                    relation.status
                                                                )}
                                                            >
                                                                {getStatusIcon(
                                                                    relation.status
                                                                )}
                                                                {relation.status
                                                                    .split(" ")
                                                                    .map(
                                                                        (
                                                                            word
                                                                        ) =>
                                                                            word
                                                                                .charAt(
                                                                                    0
                                                                                )
                                                                                .toUpperCase() +
                                                                            word.slice(
                                                                                1
                                                                            )
                                                                    )
                                                                    .join(" ")}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="gap-2"
                                                                onClick={() =>
                                                                    handleViewDetails(
                                                                        relation
                                                                    )
                                                                }
                                                            >
                                                                <Eye className="w-3 h-3" />
                                                                View Details
                                                            </Button>
                                                        </TableCell>
                                                    </>
                                                ) : (
                                                    <>
                                                        <TableCell>
                                                            <div>
                                                                <p>
                                                                    {
                                                                        relation.studentName
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {
                                                                        relation.studentNIM
                                                                    }
                                                                </p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <p className="max-w-md line-clamp-2">
                                                                {
                                                                    relation.thesisTitle
                                                                }
                                                            </p>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div>
                                                                <p>
                                                                    {
                                                                        relation.supervisorName
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {
                                                                        relation.supervisorNIP
                                                                    }
                                                                </p>
                                                                {relation.coSupervisorName && (
                                                                    <p className="text-xs text-muted-foreground mt-1">
                                                                        Co:{" "}
                                                                        {
                                                                            relation.coSupervisorName
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="secondary">
                                                                {
                                                                    relation.researchArea
                                                                }
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-sm">
                                                                <p>
                                                                    {new Date(
                                                                        relation.startDate
                                                                    ).toLocaleDateString(
                                                                        "en-US",
                                                                        {
                                                                            month: "short",
                                                                            year: "numeric",
                                                                        }
                                                                    )}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    to{" "}
                                                                    {new Date(
                                                                        relation.endDate
                                                                    ).toLocaleDateString(
                                                                        "en-US",
                                                                        {
                                                                            month: "short",
                                                                            year: "numeric",
                                                                        }
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                className={getStatusColor(
                                                                    relation.status
                                                                )}
                                                            >
                                                                {getStatusIcon(
                                                                    relation.status
                                                                )}
                                                                {relation.status
                                                                    .split(" ")
                                                                    .map(
                                                                        (
                                                                            word
                                                                        ) =>
                                                                            word
                                                                                .charAt(
                                                                                    0
                                                                                )
                                                                                .toUpperCase() +
                                                                            word.slice(
                                                                                1
                                                                            )
                                                                    )
                                                                    .join(" ")}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="gap-2"
                                                                onClick={() =>
                                                                    handleViewDetails(
                                                                        relation
                                                                    )
                                                                }
                                                            >
                                                                <Eye className="w-3 h-3" />
                                                                View Details
                                                            </Button>
                                                        </TableCell>
                                                    </>
                                                )}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="text-center py-8 text-muted-foreground"
                                            >
                                                No relations found matching your
                                                criteria
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Detail Dialog */}
                <Dialog
                    open={isDetailDialogOpen}
                    onOpenChange={setIsDetailDialogOpen}
                >
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {relationType === "student-student"
                                    ? "Team Activity Details"
                                    : "Thesis Details"}
                            </DialogTitle>
                            <DialogDescription>
                                Detailed information about this{" "}
                                {relationType === "student-student"
                                    ? "team activity"
                                    : "thesis supervision"}
                            </DialogDescription>
                        </DialogHeader>

                        {selectedDetail && (
                            <div className="space-y-6">
                                {relationType === "student-student" ? (
                                    <>
                                        {/* Activity Information */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="flex items-center gap-2">
                                                    <Users className="w-4 h-4" />
                                                    Activity Information
                                                </h4>
                                                <Badge
                                                    variant="outline"
                                                    className="text-base px-3 py-1"
                                                >
                                                    {
                                                        selectedDetail.activityType
                                                    }
                                                </Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1 col-span-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        Activity Name
                                                    </p>
                                                    <p>
                                                        {
                                                            selectedDetail.activityName
                                                        }
                                                    </p>
                                                </div>
                                                <div className="space-y-1 col-span-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        Description
                                                    </p>
                                                    <p className="text-sm">
                                                        {
                                                            selectedDetail.description
                                                        }
                                                    </p>
                                                </div>
                                                {selectedDetail.location && (
                                                    <div className="space-y-1 col-span-2">
                                                        <p className="text-sm text-muted-foreground">
                                                            Location
                                                        </p>
                                                        <p className="text-sm">
                                                            {
                                                                selectedDetail.location
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        Start Date
                                                    </p>
                                                    <p className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(
                                                            selectedDetail.startDate
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            }
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        End Date
                                                    </p>
                                                    <p className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(
                                                            selectedDetail.endDate
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            }
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        Status
                                                    </p>
                                                    <Badge
                                                        className={getStatusColor(
                                                            selectedDetail.status
                                                        )}
                                                    >
                                                        {getStatusIcon(
                                                            selectedDetail.status
                                                        )}
                                                        {selectedDetail.status
                                                            .split(" ")
                                                            .map(
                                                                (word) =>
                                                                    word
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase() +
                                                                    word.slice(
                                                                        1
                                                                    )
                                                            )
                                                            .join(" ")}{" "}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Team Members */}
                                        <div className="space-y-4">
                                            <h4 className="flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                Team Members (
                                                {
                                                    selectedDetail.teamMembers
                                                        .length
                                                }
                                                )
                                            </h4>
                                            <div className="space-y-3">
                                                {selectedDetail.teamMembers.map(
                                                    (member, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between p-3 bg-accent rounded-lg"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                                    <User className="w-5 h-5 text-primary" />
                                                                </div>
                                                                <div>
                                                                    <p>
                                                                        {
                                                                            member.name
                                                                        }
                                                                    </p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        NIM:{" "}
                                                                        {
                                                                            member.nim
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Badge variant="secondary">
                                                                {member.role}
                                                            </Badge>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Supervisor */}
                                        <div className="space-y-4">
                                            <h4 className="flex items-center gap-2">
                                                <BookOpen className="w-4 h-4" />
                                                Supervisor
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        Name
                                                    </p>
                                                    <p>
                                                        {
                                                            selectedDetail.supervisorName
                                                        }
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        NIP
                                                    </p>
                                                    <p>
                                                        {
                                                            selectedDetail.supervisorNIP
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Thesis Information */}
                                        <div className="space-y-4">
                                            <h4 className="flex items-center gap-2">
                                                <BookOpen className="w-4 h-4" />
                                                Thesis Information
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1 col-span-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        Thesis Title
                                                    </p>
                                                    <p>
                                                        {
                                                            selectedDetail.thesisTitle
                                                        }
                                                    </p>
                                                </div>
                                                <div className="space-y-1 col-span-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        Research Area
                                                    </p>
                                                    <Badge variant="secondary">
                                                        {
                                                            selectedDetail.researchArea
                                                        }
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1 col-span-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        Description
                                                    </p>
                                                    <p className="text-sm">
                                                        {
                                                            selectedDetail.description
                                                        }
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        Start Date
                                                    </p>
                                                    <p className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(
                                                            selectedDetail.startDate
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            }
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        End Date
                                                    </p>
                                                    <p className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(
                                                            selectedDetail.endDate
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            }
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        Status
                                                    </p>
                                                    <Badge
                                                        className={getStatusColor(
                                                            selectedDetail.status
                                                        )}
                                                    >
                                                        {getStatusIcon(
                                                            selectedDetail.status
                                                        )}
                                                        {selectedDetail.status
                                                            .split(" ")
                                                            .map(
                                                                (word) =>
                                                                    word
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase() +
                                                                    word.slice(
                                                                        1
                                                                    )
                                                            )
                                                            .join(" ")}{" "}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Student Information */}
                                        <div className="space-y-4">
                                            <h4 className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                Student
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        Name
                                                    </p>
                                                    <p>
                                                        {
                                                            selectedDetail.studentName
                                                        }
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        NIM
                                                    </p>
                                                    <p>
                                                        {
                                                            selectedDetail.studentNIM
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Supervisors */}
                                        <div className="space-y-4">
                                            <h4 className="flex items-center gap-2">
                                                <BookOpen className="w-4 h-4" />
                                                Supervision
                                            </h4>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <p className="text-sm text-muted-foreground">
                                                            Main Supervisor
                                                        </p>
                                                        <p>
                                                            {
                                                                selectedDetail.supervisorName
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm text-muted-foreground">
                                                            NIP
                                                        </p>
                                                        <p>
                                                            {
                                                                selectedDetail.supervisorNIP
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                {selectedDetail.coSupervisorName && (
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1">
                                                            <p className="text-sm text-muted-foreground">
                                                                Co-Supervisor
                                                            </p>
                                                            <p>
                                                                {
                                                                    selectedDetail.coSupervisorName
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-sm text-muted-foreground">
                                                                NIP
                                                            </p>
                                                            <p>
                                                                {
                                                                    selectedDetail.coSupervisorNIP
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Action Buttons */}
                                <div className="flex justify-end pt-4">
                                    <Button onClick={handleCloseDialog}>
                                        Close
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
}
