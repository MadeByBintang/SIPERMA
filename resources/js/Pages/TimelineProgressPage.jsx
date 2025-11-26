import { useState, usePage } from "react";
import { Head } from "@inertiajs/react";
import MainLayout from "../Layouts/MainLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { Badge } from "../Components/ui/badge";
import { Progress } from "../Components/ui/progress";
import { Separator } from "../Components/ui/separator";
import {
    BookOpen,
    Award,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    User,
    AlertCircle,
    ChevronRight,
    Plus,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "../Components/ui/dialog";
import { Textarea } from "../Components/ui/textarea";
import { Label } from "../Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../Components/ui/select";

export default function TimelineProgressPage({
    user,
    supervisions
}) {
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [selectedTimelineItem, setSelectedTimelineItem] = useState(null);
    const [updateNote, setUpdateNote] = useState("");
    const [updateStatus, setUpdateStatus] = useState ("");

    const userRole = user?.role?.role_name;

    const studentActivities = supervisions?.map(sv => ({
        activityType: sv.activityType,
        activityName: sv.activityName,
        lecturerName: sv.lecturerName,
        startDate: sv.startDate,
        endDate: sv.endDate,
        status: sv.status,
        timeline: sv.activityLogs?.map(log => ({
            id: log.id,
            description: log.description,
            dueDate: log.log_date,
        })) ?? []
    })) ?? [];

    const supervisedStudents = supervisions?.map(sv => ({
        id: sv.id,
        studentName: sv.individualStudentName,
        studentNIM: sv.individualStudentNim,
        activityType: sv.activityType,
        activityName: sv.activityName,
        status: sv.status,
        lastUpdate: sv.lastUpdate,
        isTeam:sv.isTeam,
        teamName:sv.teamName,
        teamMembers:sv.teamMembers,
        timeline: sv.activityLogs?.map(log => ({
            id: log.id,
            description: log.description,
            dueDate: log.log_date,
        })) ?? []
    })) ?? [];




    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-700";
            case "on progress":
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getActivityStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-700";
            case "on progress":
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case "PKL":
                return <BookOpen className="w-5 h-5" />;
            case "Tugas Akhir":
                return <FileText className="w-5 h-5" />;
            case "Lomba":
                return <Award className="w-5 h-5" />;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "completed":
                return <CheckCircle2 className="w-4 h-4 text-green-600" />;
            case "on progress":
                return <Clock className="w-4 h-4 text-blue-600" />;
            default:
                return <Clock className="w-4 h-4 text-gray-400" />;
        }
    };

    const handleViewDetails = (activity) => {
        setSelectedActivity(activity);
        setIsDialogOpen(true);
    };

    const handleViewStudentProgress = (student) => {
        setSelectedStudent(student);
        setIsDialogOpen(true);
    };



    const handleUpdateProgress = (item) => {
        setSelectedTimelineItem(item);
        setUpdateNote(item.notes || "");
        setUpdateStatus(item.status);
        setIsUpdateDialogOpen(true);
    };

    const handleSaveUpdate = () => {
        // Save update logic would go here
        console.log("Saving update:", { updateNote, updateStatus });
        setIsUpdateDialogOpen(false);
        setSelectedTimelineItem(null);
        setUpdateNote("");
    };

    // Render student view
    const renderStudentView = () => {
        const pklActivities = studentActivities.filter(
            (a) => a.activityType === "PKL"
        );
        const thesisActivities = studentActivities.filter(
            (a) => a.activityType === "Tugas Akhir"
        );
        const competitionActivities = studentActivities.filter(
            (a) => a.activityType === "Lomba"
        );

        const renderActivityCard = (activities, type, emptyMessage) => {
            return (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`p-2 rounded-lg ${
                                        type === "PKL"
                                            ? "bg-blue-100"
                                            : type === "Tugas Akhir"
                                            ? "bg-green-100"
                                            : "bg-orange-100"
                                    }`}
                                >
                                    {getActivityIcon(type)}
                                </div>
                                <div>
                                    <CardTitle>{type} Progress</CardTitle>
                                    <CardDescription>
                                        {activities.length}{" "}
                                        {activities.length === 1
                                            ? "activity"
                                            : "activities"}
                                    </CardDescription>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {activities.length > 0 ? (
                            <div className="space-y-4">
                                {activities.map((activity, index) => (
                                    <div key={index} className="space-y-3">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className="line-clamp-1">
                                                            {
                                                                activity.activityName
                                                            }
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Supervisor:{" "}
                                                            {
                                                                activity.supervisor
                                                            }
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        className={getActivityStatusColor(
                                                            activity.status
                                                        )}
                                                    >
                                                        {activity.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(
                                                        activity.startDate
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        }
                                                    )}{" "}
                                                    -{" "}
                                                    {new Date(
                                                        activity.endDate
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full gap-2"
                                            onClick={() =>
                                                handleViewDetails(activity)
                                            }
                                        >
                                            View Timeline{" "}
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                        {index < activities.length - 1 && (
                                            <Separator className="mt-4" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>{emptyMessage}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            );
        };

        return (
            <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Active Activities
                            </CardTitle>
                            <Clock className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {
                                            studentActivities.filter(
                                                (a) =>
                                                    a.status ===
                                                        "In Progress" ||
                                                    a.status === "On Progress"
                                            ).length
                                        }
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Currently in progress
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">Completed</CardTitle>
                            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {
                                            studentActivities.filter(
                                                (a) => a.status === "Completed"
                                            ).length
                                        }
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Successfully finished
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Average Progress
                            </CardTitle>
                            <FileText className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {Math.round(
                                            studentActivities.reduce(
                                                (sum, a) =>
                                                    sum + a.overallProgress,
                                                0
                                            ) / studentActivities.length
                                        )}
                                        %
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Across all activities
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Activity Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {renderActivityCard(
                        pklActivities,
                        "PKL",
                        "No PKL activities yet"
                    )}
                    {renderActivityCard(
                        thesisActivities,
                        "Thesis",
                        "No thesis activities yet"
                    )}
                    {renderActivityCard(
                        competitionActivities,
                        "Competition",
                        "No competition activities yet"
                    )}
                </div>
            </div>
        );
    };

    // Render lecturer view
    const renderLecturerView = () => {
        const pklStudents = supervisedStudents.filter(
            (s) => s.activityType === "PKL"
        );
        const thesisStudents = supervisedStudents.filter(
            (s) => s.activityType === "Tugas Akhir"
        );
        const competitionStudents = supervisedStudents.filter(
            (s) => s.activityType === "Lomba"
        );

        return (
            <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Total Students
                            </CardTitle>
                            <User className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {
                                            new Set(
                                                supervisedStudents.map(
                                                    (s) => s.studentNIM
                                                )
                                            ).size
                                        }
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Under supervision
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                PKL Students
                            </CardTitle>
                            <BookOpen className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {pklStudents.length}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Internship supervision
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Thesis Students
                            </CardTitle>
                            <FileText className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {thesisStudents.length}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Thesis supervision
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Competition
                            </CardTitle>
                            <Award className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {competitionStudents.length}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Competition coaching
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Student Progress List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Student Progress Overview</CardTitle>
                        <CardDescription>
                            Monitor the progress of all students under your
                            supervision
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {supervisedStudents.map((student) => (
                                <div
                                    key={student.id}
                                    className="p-4 border rounded-lg space-y-3"
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`p-2 rounded-lg mt-1 ${
                                                student.activityType === "PKL"
                                                    ? "bg-blue-100"
                                                    : student.activityType ===
                                                      "Tugas Akhir"
                                                    ? "bg-green-100"
                                                    : "bg-orange-100"
                                            }`}
                                        >
                                            {getActivityIcon(
                                                student.activityType
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            {/* Desktop and Landscape: Original layout */}
                                            <div className="hidden md:block landscape:block portrait:hidden">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <p>
                                                                {
                                                                    student.studentName
                                                                }
                                                            </p>
                                                            <Badge variant="outline">
                                                                {
                                                                    student.studentNIM
                                                                }
                                                            </Badge>
                                                            <Badge
                                                                variant="outline"
                                                                className="gap-1"
                                                            >
                                                                {getActivityIcon(
                                                                    student.activityType
                                                                )}
                                                                {
                                                                    student.activityType
                                                                }
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground line-clamp-1">
                                                            {
                                                                student.activityName
                                                            }
                                                        </p>

                                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            Last updated:{" "}
                                                            {new Date(
                                                                student.lastUpdate
                                                            ).toLocaleDateString(
                                                                "en-US",
                                                                {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                }
                                                            )}
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        className={getActivityStatusColor(
                                                            student.status
                                                        )}
                                                    >
                                                        {student.status}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Mobile Portrait: Two-row layout */}
                                            <div className="md:hidden landscape:hidden portrait:block">
                                                {/* First row: Name only */}
                                                <p className="mb-2">
                                                    {student.studentName}
                                                </p>

                                                {/* Second row: NIM, Activity Type, and Status */}
                                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline">
                                                            {student.studentNIM}
                                                        </Badge>
                                                        <Badge
                                                            variant="outline"
                                                            className="gap-1"
                                                        >
                                                            {getActivityIcon(
                                                                student.activityType
                                                            )}
                                                            {
                                                                student.activityType
                                                            }
                                                        </Badge>
                                                    </div>
                                                    <Badge
                                                        className={getActivityStatusColor(
                                                            student.status
                                                        )}
                                                    >
                                                        {student.status}
                                                    </Badge>
                                                </div>

                                                {/* Additional info */}
                                                <p className="text-sm text-muted-foreground line-clamp-1 mt-2">
                                                    {student.activityName}
                                                </p>

                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    Last updated:{" "}
                                                    {new Date(
                                                        student.lastUpdate
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full gap-2"
                                        onClick={() =>
                                            handleViewStudentProgress(student)
                                        }
                                    >
                                        View Progress Details{" "}
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    return (
        <MainLayout>
            <Head title="Timeline & Progress" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1>Timeline & Progress</h1>
                        <p className="text-sm text-muted-foreground">
                            {userRole === "mahasiswa"
                                ? "Track and manage your activity progress"
                                : "Monitor student progress across all activities"}
                        </p>
                    </div>
                </div>

                {userRole === "mahasiswa"
                    ? renderStudentView()
                    : renderLecturerView()}

                {/* Timeline Detail Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {userRole === "mahasiswa"
                                    ? "Activity Timeline"
                                    : "Student Progress Timeline"}
                            </DialogTitle>
                            <DialogDescription>
                                {userRole === "mahasiswa" && selectedActivity
                                    ? `${selectedActivity.activityType}: ${selectedActivity.activityName}`
                                    : selectedStudent
                                    ? `${selectedStudent.studentName} - ${selectedStudent.activityName}`
                                    : ""}
                            </DialogDescription>
                        </DialogHeader>

                        {userRole === "mahasiswa" && selectedActivity && (
                            <div className="space-y-6">
                                {/* Activity Info */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-accent rounded-lg">
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            Supervisor
                                        </p>
                                        <p className="text-sm">
                                            {selectedActivity.supervisor}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            Status
                                        </p>
                                        <Badge
                                            className={getActivityStatusColor(
                                                selectedActivity.status
                                            )}
                                        >
                                            {selectedActivity.status}
                                        </Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            Duration
                                        </p>
                                        <p className="text-sm">
                                            {new Date(
                                                selectedActivity.startDate
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}{" "}
                                            -{" "}
                                            {new Date(
                                                selectedActivity.endDate
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    {/* <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            Overall Progress
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Progress
                                                value={
                                                    selectedActivity.overallProgress
                                                }
                                                className="h-2 flex-1"
                                            />
                                            <span className="text-sm">
                                                {
                                                    selectedActivity.overallProgress
                                                }
                                                %
                                            </span>
                                        </div>
                                    </div> */}
                                </div>

                                <Separator />

                                {/* Timeline */}
                                <div className="space-y-4">
                                    <h4>Timeline Milestones</h4>
                                    <div className="space-y-4">
                                        {selectedActivity.timeline.map(
                                            (item, index) => (
                                                <div
                                                    key={item.id}
                                                    className="flex gap-4"
                                                >
                                                    <div className="flex flex-col items-center">
                                                        <div
                                                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                                item.status ===
                                                                "completed"
                                                                    ? "bg-green-100"
                                                                    : item.status ===
                                                                      "on progress"
                                                                    ? "bg-blue-100"
                                                                    : "bg-gray-100"
                                                            }`}
                                                        >
                                                            {getStatusIcon(
                                                                item.status
                                                            )}
                                                        </div>
                                                        {index <
                                                            selectedActivity
                                                                .timeline
                                                                .length -
                                                                1 && (
                                                            <div
                                                                className={`w-0.5 h-full min-h-16 ${
                                                                    item.status ===
                                                                    "completed"
                                                                        ? "bg-green-300"
                                                                        : "bg-gray-200"
                                                                }`}
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 pb-8">
                                                        <div className="p-4 border rounded-lg space-y-3">
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div className="flex-1">
                                                                    <p>
                                                                        {
                                                                            item.title
                                                                        }
                                                                    </p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {
                                                                            item.description
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <Badge
                                                                    className={getStatusColor(
                                                                        item.status
                                                                    )}
                                                                >
                                                                    {
                                                                        item.status
                                                                    }
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    Due:{" "}
                                                                    {new Date(
                                                                        item.dueDate
                                                                    ).toLocaleDateString(
                                                                        "en-US",
                                                                        {
                                                                            month: "short",
                                                                            day: "numeric",
                                                                            year: "numeric",
                                                                        }
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {item.progress >
                                                                0 && (
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center justify-between text-sm">
                                                                        <span className="text-muted-foreground">
                                                                            Progress
                                                                        </span>
                                                                        <span>
                                                                            {
                                                                                item.progress
                                                                            }
                                                                            %
                                                                        </span>
                                                                    </div>
                                                                    <Progress
                                                                        value={
                                                                            item.progress
                                                                        }
                                                                        className="h-1.5"
                                                                    />
                                                                </div>
                                                            )}
                                                            {item.notes && (
                                                                <div className="p-3 bg-muted rounded-md">
                                                                    <p className="text-sm text-muted-foreground">
                                                                        Notes:
                                                                    </p>
                                                                    <p className="text-sm">
                                                                        {
                                                                            item.notes
                                                                        }
                                                                    </p>
                                                                </div>
                                                            )}
                                                            {userRole ===
                                                                "mahasiswa" && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="gap-2"
                                                                    onClick={() =>
                                                                        handleUpdateProgress(
                                                                            item
                                                                        )
                                                                    }
                                                                >
                                                                    <Plus className="w-3 h-3" />
                                                                    Update
                                                                    Progress
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}


                        {userRole === "dosen" && selectedStudent && (
                            <div className="space-y-6">
                                {/* Student Info */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-accent rounded-lg">
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            {selectedStudent.isTeam ? "Team" : "Student"}
                                        </p>

                                        {/* Judul utama */}
                                        <p className="text-sm">
                                            {selectedStudent.isTeam ? selectedStudent.teamName : selectedStudent.studentName}
                                        </p>

                                        {/* Jika tim, tampilkan informasi setiap member */}
                                        {selectedStudent.isTeam ? (
                                            <div className="space-y-1">
                                                <p className="text-sm text-muted-foreground">
                                                    Members
                                                </p>
                                                {selectedStudent.teamMembers?.map((m, idx) => (
                                                    <div key={idx}>
                                                        <p className="text-sm">
                                                            {m.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {m.nim}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-muted-foreground">
                                                {selectedStudent.studentNIM}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            Activity Type
                                        </p>
                                        <Badge
                                            variant="outline"
                                            className="gap-1"
                                        >
                                            {getActivityIcon(
                                                selectedStudent.activityType
                                            )}
                                            {selectedStudent.activityType}
                                        </Badge>
                                    </div>

                                    {/* <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            Overall Progress
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Progress
                                                value={
                                                    selectedStudent.overallProgress
                                                }
                                                className="h-2 flex-1"
                                            />
                                            <span className="text-sm">
                                                {
                                                    selectedStudent.overallProgress
                                                }
                                                %
                                            </span>
                                        </div>
                                    </div> */}
                                </div>

                                <Separator />

                                {/* Timeline */}
                                <div className="space-y-4">
                                    <h4>Progress Timeline</h4>
                                    <div className="space-y-4">
                                        {selectedStudent.timeline.map(
                                            (item, index) => (
                                                <div
                                                    key={item.id}
                                                    className="gap-4"
                                                >
                                                    <div className="flex-1 pb-2">
                                                        <div className="p-4 border rounded-lg space-y-3">
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div className="flex-1">
                                                                    <p className="text text-muted-foreground">
                                                                        {
                                                                            item.description
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    At:{" "}
                                                                    {new Date(
                                                                        item.dueDate
                                                                    ).toLocaleDateString(
                                                                        "en-US",
                                                                        {
                                                                            month: "short",
                                                                            day: "numeric",
                                                                            year: "numeric",
                                                                        }
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end">
                            <Button onClick={() => setIsDialogOpen(false)}>
                                Close
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Update Progress Dialog (Student only) */}
                <Dialog
                    open={isUpdateDialogOpen}
                    onOpenChange={setIsUpdateDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Update Progress</DialogTitle>
                            <DialogDescription>
                                {selectedTimelineItem?.title}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={updateStatus}
                                    onValueChange={setUpdateStatus}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">
                                            Pending
                                        </SelectItem>
                                        <SelectItem value="on progress">
                                            On Progress
                                        </SelectItem>
                                        <SelectItem value="completed">
                                            Completed
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Progress Notes</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Add notes about your progress..."
                                    value={updateNote}
                                    onChange={(e) =>
                                        setUpdateNote(e.target.value)
                                    }
                                    rows={4}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsUpdateDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={handleSaveUpdate}>
                                    Save Update
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
}
