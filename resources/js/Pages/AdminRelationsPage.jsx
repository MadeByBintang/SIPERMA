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
import { Input } from "../Components/ui/input";
import { Label } from "../Components/ui/label";
import { Badge } from "../Components/ui/badge";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../Components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../Components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../Components/ui/select";
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
} from "../Components/ui/AlertDialog";
import { useIsMobile } from "../Components/ui/UseMobile";

const RelationType = "student-lecturer" | "student-student";
const ActivityType = "Internship" | "Thesis" | "Competition" | "all";
const RelationStatus = "approved" | "pending" | "completed" | "rejected";


export default function AdminRelationsPage({studentStudentRelations, studentLecturerRelations}) {
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
                .includes(searchQuery.toLowerCase()) ||
            relation.department
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

        return matchesTab && matchesSearch;
    });

    const filteredSSRelations = studentStudentRelations.filter((relation) => {
        const matchesTab =
            currentTab === "all" || relation.activityType === currentTab;
        const matchesSearch =
            relation.student1Name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            relation.student1Nim.includes(searchQuery) ||
            relation.student2Name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            relation.student2Nim.includes(searchQuery) ||
            relation.activityTitle
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            relation.department
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

        return matchesTab && matchesSearch;
    });

    // Get statistics based on relation type
    const getSLStats = () => ({
        total: studentLecturerRelations.length,
        Internship: studentLecturerRelations.filter((r) => r.activityType === "Internship")
            .length,
        Thesis: studentLecturerRelations.filter(
            (r) => r.activityType === "Thesis"
        ).length,
        Competition: studentLecturerRelations.filter(
            (r) => r.activityType === "Competition"
        ).length,
        approved: studentLecturerRelations.filter((r) => r.status === "approved")
            .length,
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
        Internship: studentStudentRelations.filter((r) => r.activityType === "Internship")
            .length,
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
        rejected: studentStudentRelations.filter(
            (r) => r.status === "rejected"
        ).length,
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
                className: "bg-purple-50 text-purple-700 border-purple-300",
                icon: Briefcase,
            },
            Thesis: {
                label: "Thesis",
                className: "bg-indigo-50 text-indigo-700 border-indigo-300",
                icon: GraduationCap,
            },
            Competition: {
                label: "Competition",
                className: "bg-amber-50 text-amber-700 border-amber-300",
                icon: Award,
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

    // Render form fields for student-lecturer
    const renderSLFormFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="studentName">Student Name</Label>
                    <Input
                        id="studentName"
                        placeholder="Enter student name"
                        value={formData.studentName || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                studentName: e.target.value,
                            })
                        }
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="studentNim">Student NIM</Label>
                    <Input
                        id="studentNim"
                        placeholder="e.g., 2021001234"
                        value={formData.studentNim || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                studentNim: e.target.value,
                            })
                        }
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="lecturerName">Lecturer Name</Label>
                    <Input
                        id="lecturerName"
                        placeholder="Enter lecturer name"
                        value={formData.lecturerName || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                lecturerName: e.target.value,
                            })
                        }
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lecturerNip">Lecturer NIP</Label>
                    <Input
                        id="lecturerNip"
                        placeholder="e.g., 198501012010011001"
                        value={formData.lecturerNip || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                lecturerNip: e.target.value,
                            })
                        }
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="activityTitle">Activity Title</Label>
                <Input
                    id="activityTitle"
                    placeholder="Enter activity/project title"
                    value={formData.activityTitle || ""}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            activityTitle: e.target.value,
                        })
                    }
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="activityType">Activity Type</Label>
                    <Select
                        value={formData.activityType || ""}
                        onValueChange={(value) =>
                            setFormData({ ...formData, activityType: value })
                        }
                    >
                        <SelectTrigger id="activityType">
                            <SelectValue placeholder="Select activity type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Internship">
                                Internship (Internship)
                            </SelectItem>
                            <SelectItem value="Thesis">Thesis</SelectItem>
                            <SelectItem value="Competition">
                                Competition
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                        value={formData.department || ""}
                        onValueChange={(value) =>
                            setFormData({ ...formData, department: value })
                        }
                    >
                        <SelectTrigger id="department">
                            <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Computer Science">
                                Computer Science
                            </SelectItem>
                            <SelectItem value="Information Systems">
                                Information Systems
                            </SelectItem>
                            <SelectItem value="Software Engineering">
                                Software Engineering
                            </SelectItem>
                            <SelectItem value="Information Technology">
                                Information Technology
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                        value={formData.status || ""}
                        onValueChange={(value) =>
                            setFormData({ ...formData, status: value })
                        }
                    >
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="rejected">
                                Terminated
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                startDate: e.target.value,
                            })
                        }
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate || ""}
                    onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                    }
                />
            </div>
        </>
    );

    // Render form fields for student-student
    const renderSSFormFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="student1Name">Student 1 Name</Label>
                    <Input
                        id="student1Name"
                        placeholder="Enter student name"
                        value={formData.student1Name || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                student1Name: e.target.value,
                            })
                        }
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="student1Nim">Student 1 NIM</Label>
                    <Input
                        id="student1Nim"
                        placeholder="e.g., 2021001234"
                        value={formData.student1Nim || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                student1Nim: e.target.value,
                            })
                        }
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="student2Name">Student 2 Name</Label>
                    <Input
                        id="student2Name"
                        placeholder="Enter student name"
                        value={formData.student2Name || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                student2Name: e.target.value,
                            })
                        }
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="student2Nim">Student 2 NIM</Label>
                    <Input
                        id="student2Nim"
                        placeholder="e.g., 2021005678"
                        value={formData.student2Nim || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                student2Nim: e.target.value,
                            })
                        }
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="role1">Student 1 Role</Label>
                    <Input
                        id="role1"
                        placeholder="e.g., Team Lead"
                        value={formData.role1 || ""}
                        onChange={(e) =>
                            setFormData({ ...formData, role1: e.target.value })
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="role2">Student 2 Role</Label>
                    <Input
                        id="role2"
                        placeholder="e.g., Developer"
                        value={formData.role2 || ""}
                        onChange={(e) =>
                            setFormData({ ...formData, role2: e.target.value })
                        }
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="activityTitle">Activity Title</Label>
                <Input
                    id="activityTitle"
                    placeholder="Enter activity/project title"
                    value={formData.activityTitle || ""}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            activityTitle: e.target.value,
                        })
                    }
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="activityType">Activity Type</Label>
                    <Select
                        value={formData.activityType || ""}
                        onValueChange={(value) =>
                            setFormData({ ...formData, activityType: value })
                        }
                    >
                        <SelectTrigger id="activityType">
                            <SelectValue placeholder="Select activity type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Internship">
                                Internship (Internship)
                            </SelectItem>
                            <SelectItem value="Thesis">Thesis</SelectItem>
                            <SelectItem value="Competition">
                                Competition
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                        value={formData.department || ""}
                        onValueChange={(value) =>
                            setFormData({ ...formData, department: value })
                        }
                    >
                        <SelectTrigger id="department">
                            <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Computer Science">
                                Computer Science
                            </SelectItem>
                            <SelectItem value="Information Systems">
                                Information Systems
                            </SelectItem>
                            <SelectItem value="Software Engineering">
                                Software Engineering
                            </SelectItem>
                            <SelectItem value="Information Technology">
                                Information Technology
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                        value={formData.status || ""}
                        onValueChange={(value) =>
                            setFormData({ ...formData, status: value })
                        }
                    >
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="rejected">
                                Terminated
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                startDate: e.target.value,
                            })
                        }
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate || ""}
                    onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                    }
                />
            </div>
        </>
    );

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
                                        {stats.active}
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
                                                <span>Internship ({stats.Internship})</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Thesis">
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="w-4 h-4" />
                                                <span>
                                                    Thesis ({stats.Thesis})
                                                </span>
                                            </div>
                                        </SelectItem>
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
                                <TabsList className="grid w-full grid-cols-4 mb-6">
                                    <TabsTrigger value="all" className="gap-2">
                                        <LinkIcon className="w-4 h-4" />
                                        All ({stats.total})
                                    </TabsTrigger>
                                    <TabsTrigger value="Internship" className="gap-2">
                                        <Briefcase className="w-4 h-4" />
                                        Internship ({stats.Internship})
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="Thesis"
                                        className="gap-2"
                                    >
                                        <GraduationCap className="w-4 h-4" />
                                        Thesis ({stats.Thesis})
                                    </TabsTrigger>
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
                                                            Department
                                                        </TableHead>
                                                        <TableHead>
                                                            Status
                                                        </TableHead>
                                                        <TableHead className="text-right">
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
                                                                            <UserCheck className="w-4 h-4 text-muted-foreground shrink-0" />
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
                                                                            <p className="text-sm line-clamp-2">
                                                                                {
                                                                                    relation.activityTitle
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {
                                                                            relation.department
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {getStatusBadge(
                                                                            relation.status
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center justify-end gap-2">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleViewDetails(
                                                                                        relation
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Eye className="w-4 h-4" />
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleEdit(
                                                                                        relation
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Edit className="w-4 h-4" />
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleDelete(
                                                                                        relation
                                                                                    )
                                                                                }
                                                                                className="text-destructive hover:text-destructive"
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
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
                                                            Student 1
                                                        </TableHead>
                                                        <TableHead>
                                                            Student 2
                                                        </TableHead>
                                                        <TableHead className="min-w-[250px]">
                                                            Activity
                                                        </TableHead>
                                                        <TableHead>
                                                            Department
                                                        </TableHead>
                                                        <TableHead>
                                                            Status
                                                        </TableHead>
                                                        <TableHead className="text-right">
                                                            Actions
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredSSRelations.length >
                                                    0 ? (
                                                        filteredSSRelations.map(
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
                                                                                    {relation.student1Name
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
                                                                                        relation.student1Name
                                                                                    }
                                                                                </p>
                                                                                <p className="text-xs text-muted-foreground">
                                                                                    {
                                                                                        relation.student1Nim
                                                                                    }
                                                                                </p>
                                                                                {relation.role1 && (
                                                                                    <p className="text-xs text-blue-600">
                                                                                        {
                                                                                            relation.role1
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                                                <span className="text-xs text-primary">
                                                                                    {relation.student2Name
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
                                                                                        relation.student2Name
                                                                                    }
                                                                                </p>
                                                                                <p className="text-xs text-muted-foreground">
                                                                                    {
                                                                                        relation.student2Nim
                                                                                    }
                                                                                </p>
                                                                                {relation.role2 && (
                                                                                    <p className="text-xs text-blue-600">
                                                                                        {
                                                                                            relation.role2
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="space-y-1">
                                                                            {getActivityBadge(
                                                                                relation.activityType
                                                                            )}
                                                                            <p className="text-sm line-clamp-2">
                                                                                {
                                                                                    relation.activityTitle
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {
                                                                            relation.department
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {getStatusBadge(
                                                                            relation.status
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center justify-end gap-2">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleViewDetails(
                                                                                        relation
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Eye className="w-4 h-4" />
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleEdit(
                                                                                        relation
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Edit className="w-4 h-4" />
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleDelete(
                                                                                        relation
                                                                                    )
                                                                                }
                                                                                className="text-destructive hover:text-destructive"
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
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
                                                    <UserCheck className="w-5 h-5 text-muted-foreground" />
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
                                                    Department
                                                </Label>
                                                <p className="mt-1">
                                                    {
                                                        selectedSLRelation.department
                                                    }
                                                </p>
                                            </div>

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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <Label className="text-muted-foreground">
                                                    Student 1
                                                </Label>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                        <span className="text-sm text-primary">
                                                            {selectedSSRelation.student1Name
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
                                                                selectedSSRelation.student1Name
                                                            }
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {
                                                                selectedSSRelation.student1Nim
                                                            }
                                                        </p>
                                                        {selectedSSRelation.role1 && (
                                                            <p className="text-sm text-blue-600">
                                                                {
                                                                    selectedSSRelation.role1
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <Label className="text-muted-foreground">
                                                    Department
                                                </Label>
                                                <p className="mt-1">
                                                    {
                                                        selectedSSRelation.department
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <Label className="text-muted-foreground">
                                                    Student 2
                                                </Label>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                        <span className="text-sm text-primary">
                                                            {selectedSSRelation.student2Name
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
                                                                selectedSSRelation.student2Name
                                                            }
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {
                                                                selectedSSRelation.student2Nim
                                                            }
                                                        </p>
                                                        {selectedSSRelation.role2 && (
                                                            <p className="text-sm text-blue-600">
                                                                {
                                                                    selectedSSRelation.role2
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <Label className="text-muted-foreground">
                                                    Duration
                                                </Label>
                                                <p className="text-sm mt-1">
                                                    {
                                                        selectedSSRelation.startDate
                                                    }{" "}
                                                    -{" "}
                                                    {selectedSSRelation.endDate ||
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
