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
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Download,
    FileText,
    BarChart3,
    Users,
    TrendingUp,
    Calendar,
    Briefcase,
    GraduationCap,
    Award,
    UserCheck,
    Activity,
    FileSpreadsheet,
    FileBarChart,
} from "lucide-react";
import { toast } from "sonner";

const reportTemplates = [
    {
        id: "projects-semester",
        name: "Projects per Semester",
        description:
            "Overview of all projects (PKL, Thesis, Competition) organized by semester",
        icon: Briefcase,
        type: "projects",
    },
    {
        id: "supervisors-load",
        name: "Supervisor Workload",
        description:
            "Number of students supervised per lecturer with distribution analysis",
        icon: UserCheck,
        type: "supervisors",
    },
    {
        id: "student-engagement",
        name: "Student Engagement Level",
        description:
            "Activity participation rates and engagement metrics by student",
        icon: TrendingUp,
        type: "engagement",
    },
    {
        id: "department-statistics",
        name: "Department Statistics",
        description:
            "Comparative analysis of activities across departments",
        icon: BarChart3,
        type: "department",
    },
    {
        id: "project-timeline",
        name: "Project Timeline Analysis",
        description: "Project completion rates and timeline adherence",
        icon: Calendar,
        type: "timeline",
    },
    {
        id: "activity-types",
        name: "Activity Type Distribution",
        description: "Breakdown of PKL, Thesis, and Competition activities",
        icon: Activity,
        type: "projects",
    },
];

// Default stats jika data kosong (fallback)
const defaultStats = {
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalSupervisors: 0,
    avgStudentsPerSupervisor: 0,
    engagementRate: 0,
    departments: 0,
};

// TERIMA PROPS DARI CONTROLLER
export default function SystemReportsPage({ stats = defaultStats }) {
    const [selectedReport, setSelectedReport] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("2024-1");
    const [selectedDepartment, setSelectedDepartment] = useState("all");
    const [exportFormat, setExportFormat] = useState("pdf");

    const semesterOptions = [
        { value: "2024-1", label: "Semester 1 - 2024/2025" },
        { value: "2023-2", label: "Semester 2 - 2023/2024" },
        { value: "2023-1", label: "Semester 1 - 2023/2024" },
        { value: "2022-2", label: "Semester 2 - 2022/2023" },
        { value: "2022-1", label: "Semester 1 - 2022/2023" },
    ];

    const departmentOptions = [
        { value: "all", label: "All Departments" },
        { value: "cs", label: "Computer Science" },
        { value: "is", label: "Information Systems" },
        { value: "se", label: "Software Engineering" },
        { value: "it", label: "Information Technology" },
    ];

    const handleGenerateReport = () => {
        if (!selectedReport) {
            toast.error("Please select a report template");
            return;
        }

        const template = reportTemplates.find((t) => t.id === selectedReport);
        toast.success(`Generating ${template?.name}...`, {
            description: `Format: ${exportFormat.toUpperCase()} | Semester: ${selectedSemester}`,
        });

        // Simulasi proses download (Nantinya bisa diganti window.open ke route export)
        setTimeout(() => {
            toast.success("Report generated successfully!", {
                description: "Your download will start shortly.",
            });
        }, 1500);
    };

    const handleQuickExport = (reportId) => {
        const template = reportTemplates.find((t) => t.id === reportId);
        toast.success(`Exporting ${template?.name}...`);

        setTimeout(() => {
            toast.success("Export completed!");
        }, 1000);
    };

    return (
        <MainLayout>
            <Head title="System Reports" />
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1>System Reports</h1>
                    <p className="text-sm text-muted-foreground">
                        Generate and export comprehensive activity reports based on real-time data
                    </p>
                </div>

                {/* Quick Stats - DATA DARI DATABASE */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
                                        {stats.totalProjects}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {stats.activeProjects} active
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Supervisors
                            </CardTitle>
                            <UserCheck className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {stats.totalSupervisors}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Avg {stats.avgStudentsPerSupervisor}{" "}
                                    students/supervisor
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Engagement Rate
                            </CardTitle>
                            <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {stats.engagementRate}%
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Student participation
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Departments
                            </CardTitle>
                            <BarChart3 className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {stats.departments}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Active programs
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Report Generator */}
                <Card>
                    <CardHeader>
                        <CardTitle>Generate Custom Report</CardTitle>
                        <CardDescription>
                            Select parameters and export format to generate a
                            custom report
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="report-template">
                                    Report Template
                                </Label>
                                <Select
                                    value={selectedReport}
                                    onValueChange={setSelectedReport}
                                >
                                    <SelectTrigger id="report-template">
                                        <SelectValue placeholder="Select a report template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {reportTemplates.map((template) => {
                                            const Icon = template.icon;
                                            return (
                                                <SelectItem
                                                    key={template.id}
                                                    value={template.id}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Icon className="w-4 h-4" />
                                                        {template.name}
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                                {selectedReport && (
                                    <p className="text-xs text-muted-foreground">
                                        {
                                            reportTemplates.find(
                                                (t) => t.id === selectedReport
                                            )?.description
                                        }
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="semester">
                                    Academic Semester
                                </Label>
                                <Select
                                    value={selectedSemester}
                                    onValueChange={setSelectedSemester}
                                >
                                    <SelectTrigger id="semester">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {semesterOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="department">
                                    Department Filter
                                </Label>
                                <Select
                                    value={selectedDepartment}
                                    onValueChange={setSelectedDepartment}
                                >
                                    <SelectTrigger id="department">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departmentOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="format">Export Format</Label>
                                <Select
                                    value={exportFormat}
                                    onValueChange={setExportFormat}
                                >
                                    <SelectTrigger id="format">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pdf">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
                                                PDF Document
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="excel">
                                            <div className="flex items-center gap-2">
                                                <FileSpreadsheet className="w-4 h-4" />
                                                Excel Spreadsheet
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="csv">
                                            <div className="flex items-center gap-2">
                                                <FileBarChart className="w-4 h-4" />
                                                CSV File
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                onClick={handleGenerateReport}
                                className="gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Generate Report
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Reports */}
                <div>
                    <h2 className="mb-4">Quick Report Templates</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {reportTemplates.map((template) => {
                            const Icon = template.icon;
                            return (
                                <Card
                                    key={template.id}
                                    className="hover:border-primary transition-colors"
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                <Icon className="w-5 h-5 text-primary" />
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {template.type}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-base">
                                            {template.name}
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            {template.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full gap-2"
                                            onClick={() =>
                                                handleQuickExport(template.id)
                                            }
                                        >
                                            <Download className="w-3 h-3" />
                                            Quick Export
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}