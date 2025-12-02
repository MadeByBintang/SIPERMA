import { useState } from "react";
import { Head } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
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
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Search,
    Eye,
    Edit,
    Trash2,
    Plus,
    GitBranch,
    Users,
    UserCheck,
    GraduationCap,
    Briefcase,
    Award,
    CheckCircle2,
    Clock,
    XCircle,
    AlertCircle,
    Trophy,
    Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";
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
import { useIsMobile } from "@/Components/ui/UseMobile";

const RelationType = "student-lecturer" | "student-student";
const ActivityType = "Internship" | "Thesis" | "Competition" | "all";
const RelationStatus = "approved" | "pending" | "completed" | "rejected";

export default function AdminRelationsPage({
    studentStudentRelations,
    studentLecturerRelations,
}) {
    const isMobile = useIsMobile();
    const [relationType, setRelationType] = useState("student-lecturer");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentTab, setCurrentTab] = useState("all");
    const [selectedSLRelation, setSelectedSLRelation] = useState(null);
    const [selectedSSRelation, setSelectedSSRelation] = useState(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [formData, setFormData] = useState({});

    // Filter relations based on type
    const filteredSLRelations = studentLecturerRelations.filter((relation) => {
        const matchesTab =
            currentTab === "all" || relation.activityType === currentTab;
        const matchesSearch =
            relation.studentName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            relation.studentNim.includes(searchQuery) ||
            relation.lecturerName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            relation.lecturerNip.includes(searchQuery) ||
            relation.activityTitle
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

        return matchesTab && matchesSearch;
    });

    const filteredSSRelations = studentStudentRelations.filter((relation) => {
        const matchesTab =
            currentTab === "all" || relation.activityType === currentTab;
        const matchesSearch =
            relation.activityTitle
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

        return matchesTab && matchesSearch;
    });

    // Get statistics based on relation type
    const getSLStats = () => ({
        total: studentLecturerRelations.length,
        Internship: studentLecturerRelations.filter(
            (r) => r.activityType === "Internship"
        ).length,
        Thesis: studentLecturerRelations.filter(
            (r) => r.activityType === "Thesis"
        ).length,
        Competition: studentLecturerRelations.filter(
            (r) => r.activityType === "Competition"
        ).length,
        approved: studentLecturerRelations.filter(
            (r) => r.status === "approved"
        ).length,
        pending: studentLecturerRelations.filter((r) => r.status === "pending")
            .length,
        completed: studentLecturerRelations.filter(
            (r) => r.status === "completed"
        ).length,
        rejected: studentLecturerRelations.filter(
            (r) => r.status === "rejected"
        ).length,
        uniqueLecturers: new Set(
            studentLecturerRelations.map((r) => r.lecturerId)
        ).size,
    });

    const getSSStats = () => ({
        total: studentStudentRelations.length,
        Internship: studentStudentRelations.filter(
            (r) => r.activityType === "Internship"
        ).length,
        Thesis: studentStudentRelations.filter(
            (r) => r.activityType === "Thesis"
        ).length,
        Competition: studentStudentRelations.filter(
            (r) => r.activityType === "Competition"
        ).length,
        approved: studentStudentRelations.filter((r) => r.status === "approved")
            .length,
        pending: studentStudentRelations.filter((r) => r.status === "pending")
            .length,
        completed: studentStudentRelations.filter(
            (r) => r.status === "completed"
        ).length,
        rejected: studentStudentRelations.filter((r) => r.status === "rejected")
            .length,
        uniqueTeams: studentStudentRelations.length,
    });

    const stats =
        relationType === "student-lecturer" ? getSLStats() : getSSStats();

    // Handle view details
    const handleViewDetails = (relation) => {
        if (relationType === "student-lecturer") {
            setSelectedSLRelation(relation);
        } else {
            setSelectedSSRelation(relation);
        }
        setIsDetailDialogOpen(true);
    };

    // Get status badge
    const getStatusBadge = (status) => {
        const statusConfig = {
            approved: {
                label: "Approved",
                className: "bg-blue-50 text-blue-700 border-blue-300",
                icon: CheckCircle2,
            },
            pending: {
                label: "Pending",
                className: "bg-orange-50 text-orange-700 border-orange-300",
                icon: Clock,
            },
            completed: {
                label: "Completed",
                className: "bg-green-50 text-green-700 border-green-300",
                icon: CheckCircle2,
            },
            rejected: {
                label: "Rejected",
                className: "bg-red-50 text-red-700 border-red-300",
                icon: XCircle,
            },
        };

        const config = statusConfig[status] || {
            label: "Unknown",
            className: "bg-gray-50 text-gray-700 border-gray-300",
            icon: AlertCircle, // Use AlertCircle for unhandled cases
        };
        const Icon = config.icon;

        return (
            <Badge variant="outline" className={`${config.className} gap-1`}>
                <Icon className="w-3 h-3" />
                {config.label}
            </Badge>
        );
    };

    // Get activity badge
    const getActivityBadge = (type) => {
        const typeConfig = {
            Internship: {
                label: "Internship",
                className: "bg-blue-100",
                icon: Briefcase,
            },
            Thesis: {
                label: "Thesis",
                className: "bg-green-100",
                icon: GraduationCap,
            },
            Competition: {
                label: "Competition",
                className: "bg-yellow-100",
                icon: Trophy,
            },
        };

        const config = typeConfig[type];
        const Icon = config.icon;

        return (
            <Badge variant="outline" className={`${config.className} gap-1`}>
                <Icon className="w-3 h-3" />
                {config.label}
            </Badge>
        );
    };


    return (
        <MainLayout>
            <Head title="Relations Management" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start md:items-center justify-between gap-4 flex-col md:flex-row">
                    <div className="flex-1">
                        <h1>Relations Management</h1>
                        <p className="text-sm text-muted-foreground">
                            Student-lecturer supervision and student
                            collaboration mapping
                        </p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex-1 md:flex-initial md:w-[280px]">
                            <Select
                                value={relationType}
                                onValueChange={(value) =>
                                    setRelationType(value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="student-lecturer">
                                        <div className="flex items-center gap-2">
                                            <UserCheck className="w-4 h-4" />
                                            <span>
                                                Student-Lecturer Relations
                                            </span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="student-student">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            <span>
                                                Student-Student Relations
                                            </span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Total Relations
                            </CardTitle>
                            <GitBranch className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {stats.total}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {relationType === "student-lecturer"
                                        ? "Active mappings"
                                        : "Team collaborations"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                {relationType === "student-lecturer"
                                    ? "Active Supervisors"
                                    : "Active Teams"}
                            </CardTitle>
                            {relationType === "student-lecturer" ? (
                                <UserCheck className="w-4 h-4 text-muted-foreground" />
                            ) : (
                                <Users className="w-4 h-4 text-muted-foreground" />
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {relationType === "student-lecturer"
                                            ? stats.uniqueLecturers
                                            : stats.uniqueTeams}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {relationType === "student-lecturer"
                                        ? "Lecturers involved"
                                        : "Total teams"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Active Relations
                            </CardTitle>
                            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {stats.approved}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Currently ongoing
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
                                        {stats.completed}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Finished projects
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Relations List */}
                <Card>
                    <CardHeader>
                        <div className="flex items-start md:items-center justify-between gap-4 flex-col md:flex-row">
                            <div>
                                <CardTitle>
                                    {relationType === "student-lecturer"
                                        ? "Student-Lecturer Relations"
                                        : "Student-Student Relations"}
                                </CardTitle>
                                <CardDescription>
                                    {relationType === "student-lecturer"
                                        ? "View and manage supervision relationships"
                                        : "View and manage student team collaborations"}
                                </CardDescription>
                            </div>
                            <div className="w-full md:w-auto">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search relations..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="pl-9 w-full md:w-[300px]"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Mobile: Dropdown */}
                        {isMobile && (
                            <div className="mb-6">
                                <Select
                                    value={currentTab}
                                    onValueChange={(value) =>
                                        setCurrentTab(value)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            <div className="flex items-center gap-2">
                                                <LinkIcon className="w-4 h-4" />
                                                <span>All ({stats.total})</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Internship">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4" />
                                                <span>
                                                    Internship (
                                                    {stats.Internship})
                                                </span>
                                            </div>
                                        </SelectItem>
                                        {relationType ===
                                            "student-lecturer" && (
                                            <SelectItem value="Thesis">
                                                <div className="flex items-center gap-2">
                                                    <GraduationCap className="w-4 h-4" />
                                                    <span>
                                                        Thesis ({stats.Thesis})
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        )}
                                        <SelectItem value="Competition">
                                            <div className="flex items-center gap-2">
                                                <Award className="w-4 h-4" />
                                                <span>
                                                    Competition (
                                                    {stats.Competition})
                                                </span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Desktop: Tabs */}
                        <Tabs
                            value={currentTab}
                            onValueChange={(value) => setCurrentTab(value)}
                            className="w-full"
                        >
                            {!isMobile && (
                                <TabsList
                                    className={`grid w-full mb-6 ${
                                        relationType === "student-lecturer"
                                            ? "grid-cols-4"
                                            : "grid-cols-3"
                                    }`}
                                >
                                    <TabsTrigger value="all" className="gap-2">
                                        <LinkIcon className="w-4 h-4" />
                                        All ({stats.total})
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="Internship"
                                        className="gap-2"
                                    >
                                        <Briefcase className="w-4 h-4" />
                                        Internship ({stats.Internship})
                                    </TabsTrigger>
                                    {relationType === "student-lecturer" && (
                                        <TabsTrigger
                                            value="Thesis"
                                            className="gap-2"
                                        >
                                            <GraduationCap className="w-4 h-4" />
                                            Thesis ({stats.Thesis})
                                        </TabsTrigger>
                                    )}
                                    <TabsTrigger
                                        value="Competition"
                                        className="gap-2"
                                    >
                                        <Award className="w-4 h-4" />
                                        Competition ({stats.Competition})
                                    </TabsTrigger>
                                </TabsList>
                            )}

                            <TabsContent
                                value={currentTab}
                                className="space-y-4"
                            >
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="overflow-x-auto">
                                        {relationType === "student-lecturer" ? (
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Student
                                                        </TableHead>
                                                        <TableHead>
                                                            Lecturer
                                                        </TableHead>
                                                        <TableHead className="min-w-[250px]">
                                                            Activity
                                                        </TableHead>
                                                        <TableHead>
                                                            Status
                                                        </TableHead>
                                                        <TableHead className="text-center">
                                                            Actions
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredSLRelations.length >
                                                    0 ? (
                                                        filteredSLRelations.map(
                                                            (relation) => (
                                                                <TableRow
                                                                    key={
                                                                        relation.id
                                                                    }
                                                                >
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                                                <span className="text-xs text-primary">
                                                                                    {relation.studentName
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
                                                                            <div>
                                                                                <p className="line-clamp-1">
                                                                                    {
                                                                                        relation.studentName
                                                                                    }
                                                                                </p>
                                                                                <p className="text-xs text-muted-foreground">
                                                                                    {
                                                                                        relation.studentNim
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                                                <span className="text-xs text-primary">
                                                                                    {relation.lecturerName
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
                                                                            <div>
                                                                                <p className="line-clamp-1">
                                                                                    {
                                                                                        relation.lecturerName
                                                                                    }
                                                                                </p>
                                                                                <p className="text-xs text-muted-foreground">
                                                                                    {
                                                                                        relation.lecturerNip
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="space-y-1">
                                                                            {getActivityBadge(
                                                                                relation.activityType
                                                                            )}
                                                                            <p className="break-words whitespace-normal">
                                                                                {
                                                                                    relation.activityTitle
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {getStatusBadge(
                                                                            relation.status
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center justify-center gap-1 md:gap-2 flex-wrap">
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleViewDetails(
                                                                                        relation
                                                                                    )
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
                                                            )
                                                        )
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell
                                                                colSpan={6}
                                                                className="text-center py-8 text-muted-foreground"
                                                            >
                                                                No relations
                                                                found
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        ) : (
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Team Members
                                                        </TableHead>
                                                        <TableHead>
                                                            Lecturer
                                                        </TableHead>
                                                        <TableHead className="min-w-[250px]">
                                                            Activity
                                                        </TableHead>
                                                        <TableHead>
                                                            Status
                                                        </TableHead>
                                                        <TableHead className="text-center">
                                                            Actions
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredSSRelations.length >
                                                    0 ? (
                                                        filteredSSRelations.map(
                                                            (
                                                                relation // Ganti { dengan (
                                                            ) => (
                                                                <TableRow
                                                                    key={
                                                                        relation.id
                                                                    }
                                                                >
                                                                    <TableCell className="py-5">
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                                                                            {relation.teamMembers
                                                                                .slice(
                                                                                    0,
                                                                                    4
                                                                                )
                                                                                .map(
                                                                                    (
                                                                                        member,
                                                                                        idx
                                                                                    ) => (
                                                                                        <div
                                                                                            key={
                                                                                                idx
                                                                                            }
                                                                                            className="flex items-center gap-3"
                                                                                        >
                                                                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                                                                <span className="text-sm text-primary font-medium">
                                                                                                    {member.name
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
                                                                                            <div className="min-w-0 flex-1">
                                                                                                <p className="text-sm break-words whitespace-normal">
                                                                                                    {
                                                                                                        member.name
                                                                                                    }
                                                                                                </p>
                                                                                                <p className="text-xs text-muted-foreground">
                                                                                                    {
                                                                                                        member.nim
                                                                                                    }
                                                                                                </p>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                        </div>
                                                                        {relation
                                                                            .teamMembers
                                                                            .length >
                                                                            4 && (
                                                                            <div className="text-xs text-muted-foreground mt-2">
                                                                                +{" "}
                                                                                {relation
                                                                                    .teamMembers
                                                                                    .length -
                                                                                    4}{" "}
                                                                                more
                                                                                members
                                                                            </div>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                                                <span className="text-xs text-primary">
                                                                                    {relation.lecturerName
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
                                                                            <div>
                                                                                <p className="line-clamp-1">
                                                                                    {
                                                                                        relation.lecturerName
                                                                                    }
                                                                                </p>
                                                                                <p className="text-xs text-muted-foreground">
                                                                                    {
                                                                                        relation.lecturerNip
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="space-y-1">
                                                                            {getActivityBadge(
                                                                                relation.activityType
                                                                            )}
                                                                            <p className="text-sm break-words whitespace-normal">
                                                                                {
                                                                                    relation.activityTitle
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {getStatusBadge(
                                                                            relation.status
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center justify-center gap-1 md:gap-2 flex-wrap">
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleViewDetails(
                                                                                        relation
                                                                                    )
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
                                                            )
                                                        ) // Ganti } dengan )
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell
                                                                colSpan={5}
                                                                className="text-center py-8 text-muted-foreground"
                                                            >
                                                                No relations
                                                                found
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Detail Dialog - Student-Lecturer */}
                {relationType === "student-lecturer" && (
                    <Dialog
                        open={isDetailDialogOpen}
                        onOpenChange={setIsDetailDialogOpen}
                    >
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>
                                    Student-Lecturer Relation Details
                                </DialogTitle>
                                <DialogDescription>
                                    Complete information about the supervision
                                    relationship
                                </DialogDescription>
                            </DialogHeader>
                            {selectedSLRelation && (
                                <div className="space-y-6 py-4">
                                    <div className="flex items-start gap-2 flex-wrap">
                                        {getActivityBadge(
                                            selectedSLRelation.activityType
                                        )}
                                        {getStatusBadge(
                                            selectedSLRelation.status
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <Label className="text-muted-foreground">
                                                    Student
                                                </Label>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                        <span className="text-sm text-primary">
                                                            {selectedSLRelation.studentName
                                                                .split(" ")
                                                                .map(
                                                                    (n) => n[0]
                                                                )
                                                                .join("")
                                                                .substring(
                                                                    0,
                                                                    2
                                                                )}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p>
                                                            {
                                                                selectedSLRelation.studentName
                                                            }
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {
                                                                selectedSLRelation.studentNim
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <Label className="text-muted-foreground">
                                                    Supervisor
                                                </Label>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                        <span className="text-sm text-primary">
                                                            {selectedSLRelation.lecturerName
                                                                .split(" ")
                                                                .map(
                                                                    (n) => n[0]
                                                                )
                                                                .join("")
                                                                .substring(
                                                                    0,
                                                                    2
                                                                )}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p>
                                                            {
                                                                selectedSLRelation.lecturerName
                                                            }
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {
                                                                selectedSLRelation.lecturerNip
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <Label className="text-muted-foreground">
                                                    Duration
                                                </Label>
                                                <p className="text-sm mt-1">
                                                    {
                                                        selectedSLRelation.startDate
                                                    }{" "}
                                                    -{" "}
                                                    {selectedSLRelation.endDate ||
                                                        "Ongoing"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-muted-foreground">
                                            Activity Title
                                        </Label>
                                        <p className="mt-1">
                                            {selectedSLRelation.activityTitle}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                )}

                {/* Detail Dialog - Student-Student */}
                {relationType === "student-student" && (
                    <Dialog
                        open={isDetailDialogOpen}
                        onOpenChange={setIsDetailDialogOpen}
                    >
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>
                                    Student-Student Relation Details
                                </DialogTitle>
                                <DialogDescription>
                                    Complete information about the team
                                    collaboration
                                </DialogDescription>
                            </DialogHeader>
                            {selectedSSRelation && (
                                <div className="space-y-6 py-4">
                                    <div className="flex items-start gap-2 flex-wrap">
                                        {getActivityBadge(
                                            selectedSSRelation.activityType
                                        )}
                                        {getStatusBadge(
                                            selectedSSRelation.status
                                        )}
                                    </div>

                                    <div>
                                        <Label className="text-muted-foreground mb-3 block">
                                            Team Members
                                        </Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedSSRelation.teamMembers.map(
                                                (member, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center gap-3 p-3 border rounded-lg"
                                                    >
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                            <span className="text-sm text-primary font-medium">
                                                                {member.name
                                                                    .split(" ")
                                                                    .map(
                                                                        (n) =>
                                                                            n[0]
                                                                    )
                                                                    .join("")
                                                                    .substring(
                                                                        0,
                                                                        2
                                                                    )}
                                                            </span>
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm break-words whitespace-normal">
                                                                {member.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {member.nim}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-muted-foreground">
                                                Duration
                                            </Label>
                                            <p className="text-sm mt-1">
                                                {selectedSSRelation.startDate} -{" "}
                                                {selectedSSRelation.endDate ||
                                                    "Ongoing"}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-muted-foreground">
                                            Activity Title
                                        </Label>
                                        <p className="mt-1">
                                            {selectedSSRelation.activityTitle}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </MainLayout>
    );
}
