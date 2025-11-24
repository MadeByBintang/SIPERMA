import { useState, useMemo } from "react";
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    FileText,
    Users,
    TrendingUp,
    Calendar,
    Briefcase,
    GraduationCap,
    Award,
    FileSpreadsheet,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from "recharts";
import { useIsMobile } from "@/Components/ui/UseMobile";
import { toast } from "sonner";

// TERIMA PROPS userRole DARI CONTROLLER
export default function ReportPage({ activities = [], stats = {}, userRole }) {
    const [activityType, setActivityType] = useState("all");
    const [dateRange, setDateRange] = useState("year");
    const [statusFilter, setStatusFilter] = useState("all");
    const [exportFormat, setExportFormat] = useState("pdf");
    const isMobile = useIsMobile();

    // Responsive chart dimensions
    const chartHeight = isMobile ? 200 : 300;
    const pieChartRadius = isMobile ? 60 : 100;

    // --- LOGIC JUDUL HALAMAN DINAMIS BERDASARKAN ROLE ---
    const getPageHeader = () => {
        if (userRole === "student") {
            return {
                title: "My Activity Reports",
                desc: "Summary of your personal academic activities and progress",
            };
        }
        if (userRole === "lecturer") {
            return {
                title: "Supervision Reports",
                desc: "Overview of students under your supervision",
            };
        }
        return {
            title: "All Activity Reports",
            desc: "Comprehensive summary of all student activities",
        }; // Admin
    };

    const headerInfo = getPageHeader();

    // 2. FILTER DATA (Client Side)
    const filteredActivities = activities.filter((activity) => {
        const matchesType =
            activityType === "all" ||
            activity.activityType.toLowerCase() === activityType;

        const matchesStatus =
            statusFilter === "all" ||
            activity.status.toLowerCase().replace(" ", "-") === statusFilter;

        return matchesType && matchesStatus;
    });

    // 3. HITUNG STATISTIK GRAFIK

    // Distribusi Tipe Aktivitas
    const activityDistribution = useMemo(() => {
        const counts = { PKL: 0, Thesis: 0, Competition: 0 };
        activities.forEach((a) => {
            if (counts[a.activityType] !== undefined) counts[a.activityType]++;
        });
        return [
            { name: "PKL", value: counts.PKL, color: "#1E88E5" },
            { name: "Thesis", value: counts.Thesis, color: "#10b981" },
            {
                name: "Competition",
                value: counts.Competition,
                color: "#f59e0b",
            },
        ];
    }, [activities]);

    // Distribusi Status
    const statusDistribution = useMemo(() => {
        const counts = {
            Completed: 0,
            "In Progress": 0,
            Proposal: 0,
            Revision: 0,
        };
        activities.forEach((a) => {
            if (counts[a.status] !== undefined) counts[a.status]++;
        });
        return [
            { name: "Completed", count: counts.Completed },
            { name: "In Progress", count: counts["In Progress"] },
            { name: "Proposal", count: counts.Proposal },
            { name: "Revision", count: counts.Revision },
        ];
    }, [activities]);

    // Tren Bulanan
    const monthlyTrends = useMemo(() => {
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        const data = months.map((m) => ({
            month: m,
            PKL: 0,
            Thesis: 0,
            Competition: 0,
        }));

        activities.forEach((a) => {
            const date = new Date(a.created_at);
            if (!isNaN(date)) {
                const monthIndex = date.getMonth();
                if (data[monthIndex][a.activityType] !== undefined) {
                    data[monthIndex][a.activityType]++;
                }
            }
        });
        return data.filter((d) => d.PKL + d.Thesis + d.Competition > 0);
    }, [activities]);

    // Progress Grouping
    const progressByActivity = useMemo(() => {
        const ranges = [
            { range: "0-25%", min: 0, max: 25, count: 0 },
            { range: "26-50%", min: 26, max: 50, count: 0 },
            { range: "51-75%", min: 51, max: 75, count: 0 },
            { range: "76-100%", min: 76, max: 100, count: 0 },
        ];
        activities.forEach((a) => {
            const p = a.progress;
            const bucket = ranges.find((r) => p >= r.min && p <= r.max);
            if (bucket) bucket.count++;
        });
        return ranges;
    }, [activities]);

    // --- HELPERS ---
    const getStatusColor = (status) => {
        switch (status) {
            case "Completed":
                return "bg-green-100 text-green-700";
            case "In Progress":
                return "bg-blue-100 text-blue-700";
            case "On Progress":
                return "bg-blue-100 text-blue-700";
            case "Active":
                return "bg-blue-100 text-blue-700";
            case "Proposal":
                return "bg-yellow-100 text-yellow-700";
            case "Revision":
                return "bg-orange-100 text-orange-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case "PKL":
                return <Briefcase className="w-4 h-4" />;
            case "Thesis":
                return <GraduationCap className="w-4 h-4" />;
            case "Competition":
                return <Award className="w-4 h-4" />;
            default:
                return null;
        }
    };

    const handleQuickExportFormat = (format) => {
        if (format === "pdf") {
            window.open(
                route("reports.export.pdf", {
                    activityType,
                    statusFilter,
                    dateRange,
                }),
                "_blank"
            );
        }

        if (format === "excel") {
            window.open(
                route("reports.export.excel", {
                    activityType,
                    statusFilter,
                    dateRange,
                }),
                "_blank"
            );
        }
    };

    return (
        <MainLayout>
            <Head title="Reports" />
            <div className="space-y-6">
                {/* Header Dinamis Sesuai Role */}
                <div>
                    <h1>{headerInfo.title}</h1>
                    <p className="text-sm text-muted-foreground">
                        {headerInfo.desc}
                    </p>
                </div>

                {/* Report Filter Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter Reports</CardTitle>
                        <CardDescription>
                            Customize the data view
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
                                <div className="space-y-2">
                                    <Label>Activity Type</Label>
                                    <Select
                                        value={activityType}
                                        onValueChange={setActivityType}
                                    >
                                        <SelectTrigger className="w-full md:w-48">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Activities
                                            </SelectItem>
                                            <SelectItem value="pkl">
                                                PKL Only
                                            </SelectItem>
                                            <SelectItem value="thesis">
                                                Thesis Only
                                            </SelectItem>
                                            <SelectItem value="competition">
                                                Competition Only
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select
                                        value={statusFilter}
                                        onValueChange={setStatusFilter}
                                    >
                                        <SelectTrigger className="w-full md:w-48">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Status
                                            </SelectItem>
                                            <SelectItem value="completed">
                                                Completed
                                            </SelectItem>
                                            <SelectItem value="in-progress">
                                                In Progress
                                            </SelectItem>
                                            <SelectItem value="proposal">
                                                Proposal
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Date Range</Label>
                                    <Select
                                        value={dateRange}
                                        onValueChange={setDateRange}
                                    >
                                        <SelectTrigger className="w-full md:w-48">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="month">
                                                This Month
                                            </SelectItem>
                                            <SelectItem value="year">
                                                This Year
                                            </SelectItem>
                                            <SelectItem value="all">
                                                All Time
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 md:ml-auto md:pt-8">
                                    <Button
                                        variant="outline"
                                        className="gap-2"
                                        onClick={() =>
                                            handleQuickExportFormat("pdf")
                                        }
                                    >
                                        <FileText className="w-4 h-4" /> Export
                                        PDF
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="gap-2"
                                        onClick={() =>
                                            handleQuickExportFormat("excel")
                                        }
                                    >
                                        <FileSpreadsheet className="w-4 h-4" />{" "}
                                        Export Excel
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Total Activities
                            </CardTitle>
                            <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {stats.totalProjects}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        projects
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">Completed</CardTitle>
                            <Award className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {stats.completedProjects}
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
                            <CardTitle className="text-sm">Active</CardTitle>
                            <Users className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {stats.activeProjects}
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
                            <CardTitle className="text-sm">
                                Engagement
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
                                    Participation rate
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {/* Activity Type Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Activity Type Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer
                                width="100%"
                                height={chartHeight}
                            >
                                <PieChart>
                                    <Pie
                                        data={activityDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={(entry) =>
                                            `${entry.name}: ${entry.value}`
                                        }
                                        outerRadius={pieChartRadius}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {activityDistribution.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                />
                                            )
                                        )}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Status Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Activity Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer
                                width="100%"
                                height={chartHeight}
                            >
                                <BarChart data={statusDistribution}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: isMobile ? 11 : 12 }}
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar
                                        dataKey="count"
                                        fill="#1E88E5"
                                        name="Activities"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Monthly Trends */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Trends</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer
                                width="100%"
                                height={chartHeight}
                            >
                                <LineChart data={monthlyTrends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="PKL"
                                        stroke="#1E88E5"
                                        strokeWidth={2}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="Thesis"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="Competition"
                                        stroke="#f59e0b"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Progress Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Progress Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer
                                width="100%"
                                height={chartHeight}
                            >
                                <BarChart data={progressByActivity}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="range"
                                        tick={{ fontSize: isMobile ? 11 : 12 }}
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar
                                        dataKey="count"
                                        fill="#10b981"
                                        name="Activities"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Activity Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Student Activity Details</CardTitle>
                        <CardDescription>
                            {filteredActivities.length} activities found
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Activity Type</TableHead>
                                        <TableHead>Activity Name</TableHead>
                                        <TableHead>Supervisor</TableHead>
                                        <TableHead>Period</TableHead>
                                        <TableHead>Progress</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredActivities.length > 0 ? (
                                        filteredActivities.map((activity) => (
                                            <TableRow key={activity.id}>
                                                <TableCell>
                                                    <div>
                                                        <p>
                                                            {
                                                                activity.studentName
                                                            }
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {
                                                                activity.studentNIM
                                                            }
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className="gap-1"
                                                    >
                                                        {getActivityIcon(
                                                            activity.activityType
                                                        )}
                                                        {activity.activityType}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="max-w-xs">
                                                        <p className="line-clamp-2">
                                                            {
                                                                activity.activityName
                                                            }
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-sm">
                                                        {
                                                            activity.supervisorName
                                                        }
                                                    </p>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        <p className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {activity.startDate
                                                                ? new Date(
                                                                      activity.startDate
                                                                  ).toLocaleDateString()
                                                                : "-"}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="w-16">
                                                        <span className="text-sm font-medium">
                                                            {activity.progress}%
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={getStatusColor(
                                                            activity.status
                                                        )}
                                                    >
                                                        {activity.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="text-center py-8 text-muted-foreground"
                                            >
                                                No activities found matching
                                                your criteria
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
