import { useState } from "react";
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
import { Input } from "../Components/ui/input";
import { Label } from "../Components/ui/label";
import { Switch } from "../Components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../Components/ui/select";
import { Separator } from "../Components/ui/separator";
import {
    Save,
    Settings,
    Calendar,
    Users,
    Bell,
    Shield,
    Database,
    Mail,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "../Components/ui/UseMobile";

export default function SystemSettingsPage() {
    const isMobile = useIsMobile();

    // Academic Settings
    const [activeYear, setActiveYear] = useState("2024/2025");
    const [activeSemester, setActiveSemester] = useState("1");
    const [semesterStartDate, setSemesterStartDate] = useState("2024-09-01");
    const [semesterEndDate, setSemesterEndDate] = useState("2025-01-31");

    // Supervision Limits
    const [maxStudentsPerLecturer, setMaxStudentsPerLecturer] = useState("5");
    const [maxPKLPerLecturer, setMaxPKLPerLecturer] = useState("3");
    const [maxThesisPerLecturer, setMaxThesisPerLecturer] = useState("4");
    const [maxCompetitionPerLecturer, setMaxCompetitionPerLecturer] =
        useState("2");

    // Registration Settings
    const [registrationEnabled, setRegistrationEnabled] = useState(true);
    const [autoApproval, setAutoApproval] = useState(false);
    const [requireApproval, setRequireApproval] = useState(true);

    // Notification Settings
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [systemNotifications, setSystemNotifications] = useState(true);
    const [deadlineReminders, setDeadlineReminders] = useState(true);
    const [reminderDaysBefore, setReminderDaysBefore] = useState("7");

    // System Preferences
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [dataRetentionPeriod, setDataRetentionPeriod] = useState("5");

    const [hasChanges, setHasChanges] = useState(false);

    const handleSaveSettings = () => {
        toast.success("Settings saved successfully!", {
            description: "All system settings have been updated.",
        });
        setHasChanges(false);
    };

    const handleResetToDefaults = () => {
        setActiveYear("2024/2025");
        setActiveSemester("1");
        setMaxStudentsPerLecturer("5");
        setMaxPKLPerLecturer("3");
        setMaxThesisPerLecturer("4");
        setMaxCompetitionPerLecturer("2");
        setRegistrationEnabled(true);
        setAutoApproval(false);
        setRequireApproval(true);
        setEmailNotifications(true);
        setSystemNotifications(true);
        setDeadlineReminders(true);
        setReminderDaysBefore("7");
        setMaintenanceMode(false);
        setDataRetentionPeriod("5");

        toast.success("Settings reset to defaults");
        setHasChanges(false);
    };

    const markAsChanged = () => {
        setHasChanges(true);
    };

    return (
        <MainLayout>
            <Head title="System Settings" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h1>System Settings</h1>
                        <p className="text-sm text-muted-foreground">
                            Configure system parameters and preferences
                        </p>
                    </div>
                    {hasChanges && (
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                            <span className="text-sm text-orange-500">
                                Unsaved changes
                            </span>
                        </div>
                    )}
                </div>

                {/* Academic Year Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            <CardTitle>Academic Year Settings</CardTitle>
                        </div>
                        <CardDescription>
                            Configure the active academic year and semester
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="academic-year">
                                    Active Academic Year
                                </Label>
                                <Select
                                    value={activeYear}
                                    onValueChange={(value) => {
                                        setActiveYear(value);
                                        markAsChanged();
                                    }}
                                >
                                    <SelectTrigger id="academic-year">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2024/2025">
                                            2024/2025
                                        </SelectItem>
                                        <SelectItem value="2023/2024">
                                            2023/2024
                                        </SelectItem>
                                        <SelectItem value="2022/2023">
                                            2022/2023
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="semester">
                                    Active Semester
                                </Label>
                                <Select
                                    value={activeSemester}
                                    onValueChange={(value) => {
                                        setActiveSemester(value);
                                        markAsChanged();
                                    }}
                                >
                                    <SelectTrigger id="semester">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">
                                            Semester 1 (Odd)
                                        </SelectItem>
                                        <SelectItem value="2">
                                            Semester 2 (Even)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="start-date">
                                    Semester Start Date
                                </Label>
                                <Input
                                    id="start-date"
                                    type="date"
                                    value={semesterStartDate}
                                    onChange={(e) => {
                                        setSemesterStartDate(e.target.value);
                                        markAsChanged();
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="end-date">
                                    Semester End Date
                                </Label>
                                <Input
                                    id="end-date"
                                    type="date"
                                    value={semesterEndDate}
                                    onChange={(e) => {
                                        setSemesterEndDate(e.target.value);
                                        markAsChanged();
                                    }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Supervision Limits */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            <CardTitle>Supervision Limits</CardTitle>
                        </div>
                        <CardDescription>
                            Set maximum number of students per lecturer
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="max-total">
                                    Max Students per Lecturer (Total)
                                </Label>
                                <Input
                                    id="max-total"
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={maxStudentsPerLecturer}
                                    onChange={(e) => {
                                        setMaxStudentsPerLecturer(
                                            e.target.value
                                        );
                                        markAsChanged();
                                    }}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Overall limit across all activity types
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="max-pkl">
                                    Max PKL Students per Lecturer
                                </Label>
                                <Input
                                    id="max-pkl"
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={maxPKLPerLecturer}
                                    onChange={(e) => {
                                        setMaxPKLPerLecturer(e.target.value);
                                        markAsChanged();
                                    }}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Limit for internship supervision
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="max-thesis">
                                    Max Thesis Students per Lecturer
                                </Label>
                                <Input
                                    id="max-thesis"
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={maxThesisPerLecturer}
                                    onChange={(e) => {
                                        setMaxThesisPerLecturer(e.target.value);
                                        markAsChanged();
                                    }}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Limit for thesis supervision
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="max-competition">
                                    Max Competition Teams per Lecturer
                                </Label>
                                <Input
                                    id="max-competition"
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={maxCompetitionPerLecturer}
                                    onChange={(e) => {
                                        setMaxCompetitionPerLecturer(
                                            e.target.value
                                        );
                                        markAsChanged();
                                    }}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Limit for competition supervision
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Registration & Approval Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            <CardTitle>
                                Registration & Approval Settings
                            </CardTitle>
                        </div>
                        <CardDescription>
                            Configure registration and approval workflows
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                                <Label htmlFor="registration-enabled">
                                    Enable Student Registration
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Allow students to register for new
                                    activities
                                </p>
                            </div>
                            <Switch
                                id="registration-enabled"
                                checked={registrationEnabled}
                                onCheckedChange={(checked) => {
                                    setRegistrationEnabled(checked);
                                    markAsChanged();
                                }}
                            />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                                <Label htmlFor="auto-approval">
                                    Auto-Approve Registrations
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Automatically approve student registrations
                                    without manual review
                                </p>
                            </div>
                            <Switch
                                id="auto-approval"
                                checked={autoApproval}
                                onCheckedChange={(checked) => {
                                    setAutoApproval(checked);
                                    markAsChanged();
                                }}
                            />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                                <Label htmlFor="require-approval">
                                    Require Lecturer Approval
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Require lecturers to approve supervision
                                    requests
                                </p>
                            </div>
                            <Switch
                                id="require-approval"
                                checked={requireApproval}
                                onCheckedChange={(checked) => {
                                    setRequireApproval(checked);
                                    markAsChanged();
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-primary" />
                            <CardTitle>Notification Settings</CardTitle>
                        </div>
                        <CardDescription>
                            Manage system notifications and reminders
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                                <Label htmlFor="email-notif">
                                    Email Notifications
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Send email notifications to users
                                </p>
                            </div>
                            <Switch
                                id="email-notif"
                                checked={emailNotifications}
                                onCheckedChange={(checked) => {
                                    setEmailNotifications(checked);
                                    markAsChanged();
                                }}
                            />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                                <Label htmlFor="system-notif">
                                    System Notifications
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Show in-app notifications
                                </p>
                            </div>
                            <Switch
                                id="system-notif"
                                checked={systemNotifications}
                                onCheckedChange={(checked) => {
                                    setSystemNotifications(checked);
                                    markAsChanged();
                                }}
                            />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                                <Label htmlFor="deadline-reminders">
                                    Deadline Reminders
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Send reminders before project deadlines
                                </p>
                            </div>
                            <Switch
                                id="deadline-reminders"
                                checked={deadlineReminders}
                                onCheckedChange={(checked) => {
                                    setDeadlineReminders(checked);
                                    markAsChanged();
                                }}
                            />
                        </div>

                        {deadlineReminders && (
                            <>
                                <Separator />
                                <div className="space-y-2">
                                    <Label htmlFor="reminder-days">
                                        Reminder Days Before Deadline
                                    </Label>
                                    <Select
                                        value={reminderDaysBefore}
                                        onValueChange={(value) => {
                                            setReminderDaysBefore(value);
                                            markAsChanged();
                                        }}
                                    >
                                        <SelectTrigger id="reminder-days">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="3">
                                                3 days before
                                            </SelectItem>
                                            <SelectItem value="5">
                                                5 days before
                                            </SelectItem>
                                            <SelectItem value="7">
                                                7 days before
                                            </SelectItem>
                                            <SelectItem value="14">
                                                14 days before
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* System Preferences */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Database className="w-5 h-5 text-primary" />
                            <CardTitle>System Preferences</CardTitle>
                        </div>
                        <CardDescription>
                            Advanced system configuration
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-orange-50 border-orange-200">
                            <div className="space-y-0.5">
                                <Label
                                    htmlFor="maintenance-mode"
                                    className="text-orange-900"
                                >
                                    Maintenance Mode
                                </Label>
                                <p className="text-sm text-orange-700">
                                    Enable to prevent users from accessing the
                                    system
                                </p>
                            </div>
                            <Switch
                                id="maintenance-mode"
                                checked={maintenanceMode}
                                onCheckedChange={(checked) => {
                                    setMaintenanceMode(checked);
                                    markAsChanged();
                                }}
                            />
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Label htmlFor="data-retention">
                                Data Retention Period (Years)
                            </Label>
                            <Select
                                value={dataRetentionPeriod}
                                onValueChange={(value) => {
                                    setDataRetentionPeriod(value);
                                    markAsChanged();
                                }}
                            >
                                <SelectTrigger id="data-retention">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1 year</SelectItem>
                                    <SelectItem value="3">3 years</SelectItem>
                                    <SelectItem value="5">5 years</SelectItem>
                                    <SelectItem value="10">10 years</SelectItem>
                                    <SelectItem value="unlimited">
                                        Unlimited
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                How long to keep inactive project data
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-2 sm:gap-4 pt-4 border-t">
                    <Button variant="outline" onClick={handleResetToDefaults}>
                        {isMobile ? "Reset" : "Reset to Defaults"}
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setHasChanges(false)}
                            disabled={!hasChanges}
                        >
                            {isMobile ? "Discard" : "Discard Changes"}
                        </Button>
                        <Button
                            onClick={handleSaveSettings}
                            className="gap-2"
                            disabled={!hasChanges}
                        >
                            <Save className="w-4 h-4" />
                            {isMobile ? "Save" : "Save Settings"}
                        </Button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
