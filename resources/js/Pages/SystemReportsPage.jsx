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
    Check,
    Activity,
    FileSpreadsheet,
    FileBarChart,
} from "lucide-react";
import { toast } from "sonner";

// Default stats jika data kosong (fallback)
const defaultStats = {
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalSupervisors: 0,
    avgStudentsPerSupervisor: 0,
};

export default function SystemReportsPage({ stats = defaultStats }) {
    const handleGenerateReport = () => {
        toast.success("Generating report...");

        // Buka export PDF di tab baru
        window.open("/admin/reports/export-pdf", "_blank");
    };

    return (
        <MainLayout>
            <Head title="System Reports" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1>System Reports</h1>
                        <p className="text-sm text-muted-foreground">
                            Export comprehensive activity reports based on
                            real-time data
                        </p>
                    </div>

                    <Button onClick={handleGenerateReport} className="gap-2">
                        <Download className="w-4 h-4" />
                        Export PDF
                    </Button>
                </div>

                {/* Quick Stats - DATA DARI DATABASE */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                                Completed Projects
                            </CardTitle>
                            <Check className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {stats.completedProjects}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {stats.completedProjects} completed
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
                </div>
            </div>
        </MainLayout>
    );
}
