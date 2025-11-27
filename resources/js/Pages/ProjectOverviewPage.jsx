import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react"; // Import Router
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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/Components/ui/tabs";
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
// import { Progress } from "@/Components/ui/progress";
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

// 1. TERIMA PROPS 'projects' DARI CONTROLLER
export default function ProjectOverviewPage({ projects = [] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentTab, setCurrentTab] = useState("all");
    
    // State data lokal (opsional, tapi baik untuk search/filter instan)
    const [localProjects, setLocalProjects] = useState(projects);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Update state jika data dari database berubah (misal setelah save)
    useEffect(() => {
        setLocalProjects(projects);
    }, [projects]);

    const [selectedProject, setSelectedProject] = useState(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [formData, setFormData] = useState({});

    // 2. FILTERING DATA DARI DATABASE
    const filteredProjects = localProjects.filter((project) => {
        const matchesTab = currentTab === "all" || project.type === currentTab;
        
        // Defensive check: pastikan properti ada sebelum di-lowercase
        const title = project.title ? project.title.toLowerCase() : "";
        const supervisor = project.supervisor ? project.supervisor.toLowerCase() : "";
        const department = project.department ? project.department.toLowerCase() : "";
        const query = searchQuery.toLowerCase();

        const matchesSearch =
            title.includes(query) ||
            supervisor.includes(query) ||
            department.includes(query) ||
            (project.teamMembers && project.teamMembers.some((member) =>
                member.toLowerCase().includes(query)
            ));

        return matchesTab && matchesSearch;
    });

    // 3. CALCULATE STATISTICS DARI DATA DATABASE
    const stats = {
        total: localProjects.length,
        pkl: localProjects.filter((p) => p.type === "pkl").length,
        thesis: localProjects.filter((p) => p.type === "thesis").length,
        competition: localProjects.filter((p) => p.type === "competition").length,
        ongoing: localProjects.filter((p) => p.status === "ongoing").length,
        completed: localProjects.filter((p) => p.status === "completed").length,
        pending: localProjects.filter((p) => p.status === "pending").length,
        cancelled: localProjects.filter((p) => p.status === "cancelled").length,
    };

    // Handle view details
    const handleViewDetails = (project) => {
        setSelectedProject(project);
        setIsDetailDialogOpen(true);
    };

    // Handle edit project
    const handleEditProject = (project) => {
        setSelectedProject(project);
        setFormData({
            title: project.title || "",
            description: project.description || "",
            // progress: project.progress || 0,
            status: project.status || "pending",
            startDate: project.startDate || "",
            endDate: project.endDate || "",
            // Note: Team members & Type usually read-only in overview edit
            teamMembers: project.teamMembers ? project.teamMembers.join(", ") : "", 
            type: project.type
        });
        setIsEditDialogOpen(true);
    };

    // 4. HANDLE SAVE CHANGES KE DATABASE (PUT REQUEST)
    const handleSaveChanges = () => {
        if (!selectedProject) return;

        // Menggunakan router.put untuk kirim data ke controller update
        router.put(route('admin.projects.update', selectedProject.id), formData, {
            onSuccess: () => {
                toast.success("Project updated successfully");
                setIsEditDialogOpen(false);
                setSelectedProject(null);
                setFormData({});
            },
            onError: () => {
                toast.error("Failed to update project");
            }
        });
    };

    // Get status badge
    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { label: "Pending", className: "bg-orange-50 text-orange-700 border-orange-300", icon: Clock },
            ongoing: { label: "Ongoing", className: "bg-blue-50 text-blue-700 border-blue-300", icon: TrendingUp },
            completed: { label: "Completed", className: "bg-green-50 text-green-700 border-green-300", icon: CheckCircle2 },
            cancelled: { label: "Cancelled", className: "bg-red-50 text-red-700 border-red-300", icon: XCircle },
        };

        // Fallback jika status dari DB tidak standar
        const config = statusConfig[status] || statusConfig.pending;
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
            pkl: { label: "PKL", className: "bg-purple-50 text-purple-700 border-purple-300", icon: Briefcase },
            thesis: { label: "Thesis", className: "bg-indigo-50 text-indigo-700 border-indigo-300", icon: GraduationCap },
            competition: { label: "Competition", className: "bg-amber-50 text-amber-700 border-amber-300", icon: Award },
        };
        const config = typeConfig[type] || { label: type, className: "bg-gray-50", icon: FileText };
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
                            <CardTitle className="text-sm">PKL Projects</CardTitle>
                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">{stats.pkl}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">Field internships</p>
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
                                    <span className="text-3xl">{stats.thesis}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">Research projects</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">Competitions</CardTitle>
                            <Award className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">{stats.competition}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">Active competitions</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">Total Projects</CardTitle>
                            <FileText className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">{stats.total}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">All activities</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Status Overview */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <Card className="bg-blue-50 border-blue-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm text-blue-900">Ongoing</CardTitle>
                            <TrendingUp className="w-4 h-4 text-blue-700" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl text-blue-900">{stats.ongoing}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-green-50 border-green-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm text-green-900">Completed</CardTitle>
                            <CheckCircle2 className="w-4 h-4 text-green-700" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl text-green-900">{stats.completed}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-orange-50 border-orange-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm text-orange-900">Pending</CardTitle>
                            <Clock className="w-4 h-4 text-orange-700" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl text-orange-900">{stats.pending}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-red-50 border-red-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm text-red-900">Cancelled</CardTitle>
                            <XCircle className="w-4 h-4 text-red-700" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl text-red-900">{stats.cancelled}</div>
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
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 w-full md:w-[300px]"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                            {/* Mobile Dropdown */}
                            <div className="lg:hidden mb-6">
                                <Select value={currentTab} onValueChange={setCurrentTab}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select project type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All ({stats.total})</SelectItem>
                                        <SelectItem value="pkl">PKL ({stats.pkl})</SelectItem>
                                        <SelectItem value="thesis">Thesis ({stats.thesis})</SelectItem>
                                        <SelectItem value="competition">Competition ({stats.competition})</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Desktop Tabs */}
                            <TabsList className="hidden lg:grid w-full grid-cols-4 mb-6">
                                <TabsTrigger value="all" className="gap-2">
                                    <FileText className="w-4 h-4" /> All ({stats.total})
                                </TabsTrigger>
                                <TabsTrigger value="pkl" className="gap-2">
                                    <Briefcase className="w-4 h-4" /> PKL ({stats.pkl})
                                </TabsTrigger>
                                <TabsTrigger value="thesis" className="gap-2">
                                    <GraduationCap className="w-4 h-4" /> Thesis ({stats.thesis})
                                </TabsTrigger>
                                <TabsTrigger value="competition" className="gap-2">
                                    <Award className="w-4 h-4" /> Competition ({stats.competition})
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value={currentTab} className="space-y-4">
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="min-w-[300px]">Project</TableHead>
                                                    <TableHead>Team Members</TableHead>
                                                    <TableHead>Supervisor</TableHead>
                                                    {/* <TableHead>Progress</TableHead> */}
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredProjects.length > 0 ? (
                                                    filteredProjects.map((project) => (
                                                        <TableRow key={project.id}>
                                                            <TableCell>
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2">
                                                                        {getTypeBadge(project.type)}
                                                                    </div>
                                                                    <p className="line-clamp-2">{project.title}</p>
                                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                        <Calendar className="w-3 h-3" />
                                                                        {project.startDate ? new Date(project.startDate).toLocaleDateString() : '-'}
                                                                        {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString()}`}
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                                                                    <div className="space-y-1">
                                                                        {project.teamMembers && project.teamMembers.slice(0, 2).map((member, idx) => (
                                                                            <div key={idx} className="text-sm">{member}</div>
                                                                        ))}
                                                                        {project.teamMembers && project.teamMembers.length > 2 && (
                                                                            <div className="text-xs text-muted-foreground">+{project.teamMembers.length - 2} more</div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
                                                                    <UserCheck className="w-4 h-4 text-muted-foreground shrink-0" />
                                                                    <span className="text-sm">{project.supervisor}</span>
                                                                </div>
                                                            </TableCell>
                                                            {/* <TableCell>
                                                                <div className="space-y-2 min-w-[120px]">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-sm">{project.progress}%</span>
                                                                    </div>
                                                                    <Progress value={project.progress} className="h-2" />
                                                                </div>
                                                            </TableCell> */}
                                                            <TableCell>
                                                                {getStatusBadge(project.status)}
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center justify-end gap-2">
                                                                   {/* ... Tombol View & Edit tetap ada ... */}
        
                                                            {/* TAMBAHKAN TOMBOL DELETE INI */}
                                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteProject(project)}>
                                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(project)}>
                                                                        <Eye className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button variant="ghost" size="sm" onClick={() => handleEditProject(project)}>
                                                                        <Edit className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
                <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Project Details</DialogTitle>
                            <DialogDescription>Complete information about the project</DialogDescription>
                        </DialogHeader>
                        {selectedProject && (
                            <div className="space-y-6 py-4">
                                <div className="space-y-2">
                                    <div className="flex items-start gap-2 flex-wrap">
                                        {getTypeBadge(selectedProject.type)}
                                        {getStatusBadge(selectedProject.status)}
                                    </div>
                                    <h3 className="text-lg font-semibold">{selectedProject.title}</h3>
                                </div>

                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Department</Label>
                                        <p className="text-sm">{selectedProject.department}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Supervisor</Label>
                                        <div className="flex items-center gap-2">
                                            <UserCheck className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm">{selectedProject.supervisor}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Start Date</Label>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm">
                                                {selectedProject.startDate ? new Date(selectedProject.startDate).toLocaleDateString() : '-'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>End Date</Label>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm">
                                                {selectedProject.endDate ? new Date(selectedProject.endDate).toLocaleDateString() : '-'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Team Members ({selectedProject.teamMembers ? selectedProject.teamMembers.length : 0})</Label>
                                    <div className="space-y-2">
                                        {selectedProject.teamMembers && selectedProject.teamMembers.map((member, idx) => (
                                            <div key={idx} className="flex items-center gap-2 p-2 bg-accent rounded-lg">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                    <span className="text-xs text-primary">
                                                        {member.split(" ").map(n => n[0]).join("").substring(0, 2)}
                                                    </span>
                                                </div>
                                                <span className="text-sm">{member}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label>Progress</Label>
                                        <span className="text-sm">{selectedProject.progress}%</span>
                                    </div>
                                    <Progress value={selectedProject.progress} className="h-3" />
                                </div> */}
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>Close</Button>
                            <Button onClick={() => { setIsDetailDialogOpen(false); handleEditProject(selectedProject); }}>Edit Project</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Project Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Project</DialogTitle>
                            <DialogDescription>Update project information</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Project Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title || ""}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    rows={4}
                                    value={formData.description || ""}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                             {/* Note: Type is usually read-only when editing existing project */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={formData.status || "pending"}
                                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                                    >
                                        <SelectTrigger id="status"><SelectValue placeholder="Select status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="ongoing">Ongoing</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={formData.startDate || ""}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={formData.endDate || ""}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            {/* <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="progress">Progress</Label>
                                    <span className="text-sm text-muted-foreground">{formData.progress || 0}%</span>
                                </div>
                                <Input
                                    id="progress"
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="5"
                                    value={formData.progress || 0}
                                    onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                                    className="cursor-pointer"
                                />
                            </div> */}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSaveChanges}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </MainLayout>
    );
}