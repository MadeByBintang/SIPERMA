import { useState } from "react";
import { Head, router } from "@inertiajs/react";
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
import { Progress } from "@/Components/ui/progress";
import { Separator } from "@/Components/ui/separator";
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
    ThumbsUp,
    Briefcase,
    GraduationCap,
    Trophy,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/AlertDialog";
import { toast } from "sonner";

export default function TimelineProgressPage({ user, supervisions }) {
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);

    // selectedTimelineItem tidak lagi dibutuhkan karena kita mengupdate activity secara keseluruhan
    // const [selectedTimelineItem, setSelectedTimelineItem] = useState(null);

    const [updateNote, setUpdateNote] = useState("");
    const [updateStatus, setUpdateStatus] = useState("");

    const userRole = user?.role?.role_name;

    const studentActivities =
        supervisions?.map((sv) => ({
            id: sv.id,
            activityType: sv.activityType,
            activityName: sv.activityName,
            supervisor: sv.supervisor,
            lecturerName: sv.lecturerName,
            startDate: sv.startDate,
            endDate: sv.endDate,
            status: sv.status,
            timeline:
                sv.timeline?.map((log) => ({
                    id: log.id,
                    activity_id: log.activity_id,
                    description: log.description,
                    dueDate: log.log_date,
                })) ?? [],
        })) ?? [];

    const supervisedStudents =
        supervisions?.map((sv) => ({
            id: sv.id,
            studentName: sv.individualStudentName,
            studentNIM: sv.individualStudentNim,
            activityType: sv.activityType,
            activityName: sv.activityName,
            status: sv.status,
            lastUpdate: sv.lastUpdate,
            isTeam: sv.isTeam,
            teamName: sv.teamName,
            teamMembers: sv.teamMembers,
            timeline:
                sv.activityLogs?.map((log) => ({
                    id: log.id,
                    activity_id: log.activity_id,
                    description: log.description,
                    dueDate: log.log_date,
                })) ?? [],
        })) ?? [];

    const getActivityStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-700";
            case "approved":
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case "Internship":
                return <Briefcase className="w-5 h-5" />;
            case "Thesis":
                return <GraduationCap className="w-5 h-5" />;
            case "Competition":
                return <Trophy className="w-5 h-5" />;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "completed":
                return <ThumbsUp className="w-4 h-4" />;
            case "approved":
                return <CheckCircle2 className="w-4 h-4" />;
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

    // Tambahkan di bagian state
    const [noteError, setNoteError] = useState("");

    // Fungsi validasi
    const validateNote = (text) => {
        // Regex: hanya huruf (A-Z, a-z), angka (0-9), spasi, titik, koma
        const allowedCharsRegex = /^[A-Za-z0-9\s]*$/; // Hanya huruf, angka, dan spasi

        // Hitung jumlah kata
        const wordCount = text
            .trim()
            .split(/\s+/)
            .filter((word) => word.length > 0).length;

        if (!allowedCharsRegex.test(text)) {
            setNoteError(
                "Only letters (A-Z), numbers (0-9), spaces, and basic punctuation allowed"
            );
            return false;
        }

        if (wordCount > 50) {
            setNoteError(`Word limit exceeded (${wordCount}/50 words)`);
            return false;
        }

        setNoteError("");
        return true;
    };

    const handleViewDetails = (activity) => {
        setSelectedActivity(activity);
        setSelectedStudent(null);
        setIsDialogOpen(true);
    };

    const handleViewStudentProgress = (student) => {
        setSelectedStudent(student);
        setSelectedActivity(null);
        setIsDialogOpen(true);
    };

    const handleUpdateProgress = (activity) => {
        if (!activity) return;

        setUpdateNote("");
        setUpdateStatus(activity.status || "on progress");

        setIsDialogOpen(false);
        setIsUpdateDialogOpen(true);
    };

    const handleSaveUpdate = () => {
        // Validasi sebelum submit
        if (!validateNote(updateNote) || updateNote.trim() === "") {
            toast.error("Please provide valid progress notes");
            return;
        }

        const activityId = selectedActivity?.timeline?.[0]?.activity_id;

        const data = {
            activity_id: activityId,
            log_date: new Date().toISOString().slice(0, 10),
            description: updateNote,
        };

        router.post(route(`timeline.updatelog`), data, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({
                    only: ["supervisions"],
                    onFinish: () => {
                        const updated = supervisions.find(
                            (sv) => sv.id === selectedActivity.id
                        );

                        if (updated) {
                            setSelectedActivity(updated);
                        }

                        setIsUpdateDialogOpen(false);
                        setIsDialogOpen(false);
                        setUpdateNote(""); // Reset
                        setNoteError(""); // Reset error

                        toast("Log progres berhasil ditambahkan!");
                    },
                });
            },
        });
    };

    const handleCompleteActivity = () => {
        const activityToComplete = selectedStudent;
        if (!activityToComplete || activityToComplete.status === "completed")
            return;

        router.patch(
            route(
                "timeline.complete",
                activityToComplete?.timeline?.[0]?.activity_id
            ),
            { status: "completed" },
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload({
                        only: ["supervisions"],
                        onFinish: () => {
                            const updated = supervisions.find(
                                (sv) => sv.id === selectedStudent.id
                            );

                            if (updated) setSelectedStudent(updated);
                        },
                    });
                },
                onError: (errors) => {
                    console.error("Error completing activity:", errors);
                    alert(
                        "Failed to mark activity as completed. Check console for details."
                    );
                },
                onFinish: () => {
                    setIsDialogOpen(false);
                },
            }
        );
    };

    const renderLecturerActionButtons = () => {
        if (!selectedStudent) return null;

        const isCompleted = selectedStudent.status === "completed";

        return (
            <>
                {/* TOMBOL UNTUK MEMBUKA DIALOG */}
                {!isCompleted && (
                    <Button
                        variant="default"
                        onClick={() => setIsCompleteDialogOpen(true)}
                        className="bg-green-600 hover:bg-green-700 gap-2"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        Mark as Completed
                    </Button>
                )}

                {/* ALERT DIALOG */}
                <AlertDialog
                    open={isCompleteDialogOpen}
                    onOpenChange={setIsCompleteDialogOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Mark Activity as Completed?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to mark activity "
                                <span className="font-semibold">
                                    {selectedStudent?.activityName}
                                </span>
                                " as completed?
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>

                            <AlertDialogAction
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                    handleCompleteActivity();
                                    setIsCompleteDialogOpen(false);
                                }}
                            >
                                Mark Completed
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </>
        );
    };

    // Render student view
    const renderStudentView = () => {
        const InternshipActivities = studentActivities.filter(
            (a) => a.activityType === "Internship"
        );
        const thesisActivities = studentActivities.filter(
            (a) => a.activityType === "Thesis"
        );
        const competitionActivities = studentActivities.filter(
            (a) => a.activityType === "Competition"
        );

        const renderActivityCard = (activities, type, emptyMessage) => {
            return (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`p-2 rounded-lg ${
                                        type === "Internship"
                                            ? "bg-blue-100"
                                            : type === "Thesis"
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
                                                    <div className="flex-1 min-w-0 max-w-md">
                                                        {" "}
                                                        {/* Tambahkan min-w-0 dan max-w */}
                                                        <p className="font-medium break-words whitespace-normal">
                                                            {" "}
                                                            {/* Tambah break-words & whitespace-normal */}
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
                                                        {getStatusIcon(
                                                            activity.status
                                                        )}
                                                        {activity.status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            activity.status.slice(
                                                                1
                                                            )}
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
                                                    {activity.endDate
                                                        ? new Date(
                                                              activity.endDate
                                                          ).toLocaleDateString(
                                                              "en-US",
                                                              {
                                                                  month: "short",
                                                                  day: "numeric",
                                                                  year: "numeric",
                                                              }
                                                          )
                                                        : "Present"}
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
                                                    a.status === "completed" ||
                                                    a.status === "approved"
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
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {
                                            studentActivities.filter(
                                                (a) => a.status === "completed"
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
                                On Progress
                            </CardTitle>
                            <ThumbsUp className="w-4 h-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {
                                            studentActivities.filter(
                                                (a) => a.status === "approved"
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
                </div>

                {/* Activity Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {renderActivityCard(
                        InternshipActivities,
                        "Internship",
                        "No Internship activities yet"
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
        const InternshipStudents = supervisedStudents.filter(
            (s) => s.activityType === "Internship"
        );
        const thesisStudents = supervisedStudents.filter(
            (s) => s.activityType === "Thesis"
        );
        const competitionStudents = supervisedStudents.filter(
            (s) => s.activityType === "Competition"
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
                                Internship Students
                            </CardTitle>
                            <BookOpen className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {InternshipStudents.length}
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
                                                student.activityType ===
                                                "Internship"
                                                    ? "bg-blue-100"
                                                    : student.activityType ===
                                                      "Thesis"
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
                                                                className={`gap-1 ${getActivityTypeColor(
                                                                    student.activityType
                                                                )}`}
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
                                                        {getStatusIcon(
                                                            student.status
                                                        )}
                                                        {student.status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            student.status.slice(
                                                                1
                                                            )}
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
                                                        {getStatusIcon(
                                                            student.status
                                                        )}
                                                        {student.status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            student.status.slice(
                                                                1
                                                            )}
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
                                            {getStatusIcon(
                                                selectedActivity.status
                                            )}
                                            {selectedActivity.status
                                                .charAt(0)
                                                .toUpperCase() +
                                                selectedActivity.status.slice(
                                                    1
                                                )}
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
                                </div>

                                <Separator />

                                {/* Timeline */}
                                <div className="space-y-4">
                                    <div className="space-y-4">
                                        {selectedActivity.timeline.map(
                                            (item, index) => (
                                                <div
                                                    key={item.id}
                                                    className="flex gap-4"
                                                >
                                                    <div className="flex-1 pb-8">
                                                        <div className="p-4 border rounded-lg space-y-3">
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div className="flex-1">
                                                                    <p className="text-sm text-muted-foreground">
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

                        {userRole === "dosen" && selectedStudent && (
                            <div className="space-y-6">
                                {/* Student Info */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-accent rounded-lg">
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            {selectedStudent.isTeam
                                                ? "Team"
                                                : "Student"}
                                        </p>

                                        {/* Judul utama */}
                                        <p className="text-sm">
                                            {selectedStudent.isTeam
                                                ? selectedStudent.teamName
                                                : selectedStudent.studentName}
                                        </p>

                                        {/* Jika tim, tampilkan informasi setiap member */}
                                        {selectedStudent.isTeam ? (
                                            <div className="space-y-1">
                                                <p className="text-sm text-muted-foreground">
                                                    Members
                                                </p>
                                                {selectedStudent.teamMembers?.map(
                                                    (m, idx) => (
                                                        <div key={idx}>
                                                            <p className="text-sm">
                                                                {m.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {m.nim}
                                                            </p>
                                                        </div>
                                                    )
                                                )}
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
                                            className={`gap-1 ${getActivityTypeColor(
                                                selectedStudent.activityType
                                            )}`}
                                        >
                                            {getActivityIcon(
                                                selectedStudent.activityType
                                            )}
                                            {selectedStudent.activityType}
                                        </Badge>
                                    </div>
                                </div>

                                <Separator />

                                {/* Timeline */}
                                <div className="space-y-4">
                                    <h4>Progress Timeline</h4>
                                    <div className="space-y-4">
                                        {selectedStudent?.timeline?.map(
                                            (item) => (
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

                        <div className="flex justify-end gap-2">
                            {/* TOMBOL UPDATE PROGRESS — hanya untuk mahasiswa dan jika belum completed */}
                            {userRole === "mahasiswa" &&
                                selectedActivity?.status !== "completed" && (
                                    <Button
                                        variant="default"
                                        className="gap-2"
                                        onClick={() =>
                                            handleUpdateProgress(
                                                selectedActivity
                                            )
                                        }
                                    >
                                        <Plus className="w-4 h-4" />
                                        Update Progress
                                    </Button>
                                )}

                            {/* TOMBOL DOSEN — render hanya jika belum completed */}
                            {userRole === "dosen" &&
                                selectedStudent &&
                                selectedStudent.status !== "completed" &&
                                renderLecturerActionButtons()}

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
                            <DialogTitle>Add New Progress Log</DialogTitle>
                            <DialogDescription>
                                Activity: {selectedActivity?.activityName}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="notes">Progress Notes</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Add notes about your progress (max 50 words)..."
                                    value={updateNote}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        setUpdateNote(newValue);
                                        validateNote(newValue);
                                    }}
                                    rows={4}
                                    className={
                                        noteError ? "border-red-500" : ""
                                    }
                                />
                                {/* Tampilkan error message */}
                                {noteError && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {noteError}
                                    </p>
                                )}

                                {/* Tampilkan word counter */}
                                <p className="text-xs text-muted-foreground mt-1">
                                    {
                                        updateNote
                                            .trim()
                                            .split(/\s+/)
                                            .filter((w) => w.length > 0).length
                                    }
                                    /50 words
                                </p>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsUpdateDialogOpen(false);
                                        setIsDialogOpen(true);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={handleSaveUpdate}>
                                    Save Log
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
}
