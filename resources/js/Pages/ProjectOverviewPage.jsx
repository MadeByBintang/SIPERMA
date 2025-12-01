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
import { Textarea } from "@/Components/ui/textarea";
import { Progress } from "@/Components/ui/progress";
import {
    Search,
    Edit,
    Eye,
    Briefcase,
    GraduationCap,
    Award,
    FileText,
    Users,
    UserCheck,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    TrendingUp,
    Calendar,
} from "lucide-react";
import { toast } from "sonner";

const ProjectType = "Internship" | "Thesis" | "Competition" | "all";
const ProjectStatus =
    "pending" | "approved" | "completed" | "terminated" | "rejected";

export default function ProjectOverviewPage({ all_projects }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentTab, setCurrentTab] = useState("all");
    const [selectedProject, setSelectedProject] = useState(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [formData, setFormData] = useState({});

    // Mock project data
    const [projects, setProjects] = useState(all_projects || []);

    // Filter projects based on tab and search
    const filteredProjects = projects.filter((project) => {
        const matchesTab = currentTab === "all" || project.type === currentTab;
        const matchesSearch =
            (project?.title ?? "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            project.supervisor
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            project.teamMembers.some((member) =>
                member.toLowerCase().includes(searchQuery.toLowerCase())
            );

        return matchesTab && matchesSearch;
    });

    // Get statistics
    const stats = {
        total: projects.length,
        Internship: projects.filter((p) => p.type === "Internship").length,
        Thesis: projects.filter((p) => p.type === "Thesis").length,
        Competition: projects.filter((p) => p.type === "Competition").length,
        approved: projects.filter((p) => p.status === "approved").length,
        completed: projects.filter((p) => p.status === "completed").length,
        pending: projects.filter((p) => p.status === "pending").length,
        rejected: projects.filter((p) => p.status === "rejected").length,
    };

    // Handle view details
    const handleViewDetails = (project) => {
        setSelectedProject(project);
        setIsDetailDialogOpen(true);
    };

    // Handle edit project

    // Get status badge
    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: {
                label: "Pending",
                className: "bg-orange-50 text-orange-700 border-orange-300",
                icon: Clock,
            },
            approved: {
                label: "Ongoing",
                className: "bg-blue-50 text-blue-700 border-blue-300",
                icon: TrendingUp,
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
            cancelled: {
                label: "Cancelled",
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

    // Get type badge
    const getTypeBadge = (type) => {
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

        const config = typeConfig[type] || {
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

    return (
        <MainLayout>
            <Head title="Project Overview" />
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1>Project Overview</h1>
                    <p className="text-sm text-muted-foreground">
                        Monitor and manage all academic activities and projects
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Internship Projects
                            </CardTitle>
                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {stats.Internship}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Field internships
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">Thesis</CardTitle>
                            <GraduationCap className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {stats.Thesis}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Research projects
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Competitions
                            </CardTitle>
                            <Award className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {stats.Competition}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Active Competitions
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Total Projects
                            </CardTitle>
                            <FileText className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {stats.total}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    All activities
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Status Overview */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <Card className="bg-blue-50 border-blue-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm text-blue-900">
                                Ongoing
                            </CardTitle>
                            <TrendingUp className="w-4 h-4 text-blue-700" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl text-blue-900">
                                {stats.approved}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-green-50 border-green-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm text-green-900">
                                Completed
                            </CardTitle>
                            <CheckCircle2 className="w-4 h-4 text-green-700" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl text-green-900">
                                {stats.completed}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-orange-50 border-orange-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm text-orange-900">
                                Pending
                            </CardTitle>
                            <Clock className="w-4 h-4 text-orange-700" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl text-orange-900">
                                {stats.pending}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-red-50 border-red-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm text-red-900">
                                Rejected
                            </CardTitle>
                            <XCircle className="w-4 h-4 text-red-700" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl text-red-900">
                                {stats.rejected}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Project List */}
                <Card>
                    <CardHeader>
                        <div className="flex items-start md:items-center justify-between gap-4 flex-col md:flex-row">
                            <div>
                                <CardTitle>All Projects</CardTitle>
                                <CardDescription>
                                    Manage and monitor all academic activities
                                </CardDescription>
                            </div>
                            <div className="w-full md:w-auto">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search projects..."
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
                        <Tabs
                            value={currentTab}
                            onValueChange={(value) => setCurrentTab(value)}
                            className="w-full"
                        >
                            {/* Mobile Dropdown */}
                            <div className="lg:hidden mb-6">
                                <Select
                                    value={currentTab}
                                    onValueChange={(value) =>
                                        setCurrentTab(value)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select project type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
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

                            {/* Desktop Tabs */}
                            <TabsList className="hidden lg:grid w-full grid-cols-4 mb-6">
                                <TabsTrigger value="all" className="gap-2">
                                    <FileText className="w-4 h-4" />
                                    All ({stats.total})
                                </TabsTrigger>
                                <TabsTrigger
                                    value="Internship"
                                    className="gap-2"
                                >
                                    <Briefcase className="w-4 h-4" />
                                    Internship ({stats.Internship})
                                </TabsTrigger>
                                <TabsTrigger value="Thesis" className="gap-2">
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

                            <TabsContent
                                value={currentTab}
                                className="space-y-4"
                            >
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="min-w-[100px]">
                                                        Project
                                                    </TableHead>
                                                    <TableHead className="min-w-[150px]">
                                                        Team Members
                                                    </TableHead>
                                                    <TableHead>
                                                        Supervisor
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
                                                {filteredProjects.length > 0 ? (
                                                    filteredProjects.map(
                                                        (project) => (
                                                            <TableRow
                                                                key={project.id}
                                                            >
                                                                <TableCell>
                                                                    <div className="space-y-1">
                                                                        <div className="flex items-center gap-2">
                                                                            {getTypeBadge(
                                                                                project.type
                                                                            )}
                                                                        </div>
                                                                        <p className="break-words whitespace-normal">
                                                                            {
                                                                                project.title
                                                                            }
                                                                        </p>
                                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                            <Calendar className="w-3 h-3" />
                                                                            {new Date(
                                                                                project.startDate
                                                                            ).toLocaleDateString(
                                                                                "en-US",
                                                                                {
                                                                                    year: "numeric",
                                                                                    month: "short",
                                                                                    day: "numeric",
                                                                                }
                                                                            )}
                                                                            {project.endDate &&
                                                                                ` - ${new Date(
                                                                                    project.endDate
                                                                                ).toLocaleDateString(
                                                                                    "en-US",
                                                                                    {
                                                                                        year: "numeric",
                                                                                        month: "short",
                                                                                        day: "numeric",
                                                                                    }
                                                                                )}`}
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="py-5">
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                                                                        {project.teamMembers
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
                                                                    {project
                                                                        .teamMembers
                                                                        .length >
                                                                        4 && (
                                                                        <div className="text-xs text-muted-foreground mt-2">
                                                                            +
                                                                            {project
                                                                                .teamMembers
                                                                                .length -
                                                                                4}{" "}
                                                                            more
                                                                            members
                                                                        </div>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-start gap-2 max-w-[200px]">
                                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                                            <span className="text-xs text-primary">
                                                                                {project.supervisor
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
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="text-sm break-words whitespace-normal">
                                                                                {
                                                                                    project.supervisor
                                                                                }
                                                                            </p>
                                                                            <p className="text-xs text-muted-foreground">
                                                                                {
                                                                                    project.supervisorNip
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {getStatusBadge(
                                                                        project.status
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center justify-center gap-2">
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                handleViewDetails(
                                                                                    project
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
                                                            No projects found
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Project Detail Dialog */}
                <Dialog
                    open={isDetailDialogOpen}
                    onOpenChange={setIsDetailDialogOpen}
                >
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Project Details</DialogTitle>
                            <DialogDescription>
                                Complete information about the project
                            </DialogDescription>
                        </DialogHeader>
                        {selectedProject && (
                            <div className="space-y-6 py-4">
                                {/* Title and Type */}
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2 flex-wrap">
                                        {getTypeBadge(selectedProject.type)}
                                        {getStatusBadge(selectedProject.status)}
                                    </div>
                                    <h3 className="text-lg">
                                        {selectedProject.title}
                                    </h3>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedProject.description}
                                    </p>
                                </div>

                                {/* Grid Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <Label className="text-muted-foreground">
                                                Supervisor
                                            </Label>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                    <span className="text-sm text-primary">
                                                        {selectedProject.supervisor
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")
                                                            .substring(0, 2)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm">
                                                        {
                                                            selectedProject.supervisor
                                                        }
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {
                                                            selectedProject.supervisorNip
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
                                            <p className="text-sm mt-2">
                                                {new Date(
                                                    selectedProject.startDate
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                                {" - "}
                                                {selectedProject.endDate
                                                    ? new Date(
                                                          selectedProject.endDate
                                                      ).toLocaleDateString(
                                                          "en-US",
                                                          {
                                                              year: "numeric",
                                                              month: "short",
                                                              day: "numeric",
                                                          }
                                                      )
                                                    : "Ongoing"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Team Members */}
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">
                                        Team Members (
                                        {selectedProject.teamMembers.length ??
                                            0}
                                        )
                                    </Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                        {selectedProject.teamMembers.map(
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
                                                                    (n) => n[0]
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
                            </div>
                        )}
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDetailDialogOpen(false)}
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
