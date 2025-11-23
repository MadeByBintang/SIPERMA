import { useState, useEffect } from "react";
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
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Separator } from "@/Components/ui/separator";
import {
    Save,
    Users,
    Bell,
    Shield,
    Database,
    AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/Components/ui/UseMobile";

// TERIMA PROPS DARI CONTROLLER
export default function SystemSettingsPage({ initialSettings = {} }) {
    const isMobile = useIsMobile();
    const [hasChanges, setHasChanges] = useState(false);

    // --- INITIALIZE STATE DARI DATABASE ---
    // Gunakan fallback value (|| "5") jika database masih kosong

    // Supervision Limits
    const [maxStudentsPerLecturer, setMaxStudentsPerLecturer] = useState(initialSettings.max_students_per_lecturer || "5");
    const [maxPKLPerLecturer, setMaxPKLPerLecturer] = useState(initialSettings.max_pkl_per_lecturer || "3");
    const [maxThesisPerLecturer, setMaxThesisPerLecturer] = useState(initialSettings.max_thesis_per_lecturer || "4");
    const [maxCompetitionPerLecturer, setMaxCompetitionPerLecturer] = useState(initialSettings.max_competition_per_lecturer || "2");

    // Registration Settings (Convert string "1"/"0" to boolean)
    const [registrationEnabled, setRegistrationEnabled] = useState(initialSettings.registration_enabled == '1' || initialSettings.registration_enabled === true);
    const [autoApproval, setAutoApproval] = useState(initialSettings.auto_approval == '1' || initialSettings.auto_approval === true);
    const [requireApproval, setRequireApproval] = useState(initialSettings.require_approval !== '0' && initialSettings.require_approval !== false); // Default true

    // Notification Settings
    const [emailNotifications, setEmailNotifications] = useState(initialSettings.email_notifications !== '0');
    const [systemNotifications, setSystemNotifications] = useState(initialSettings.system_notifications !== '0');
    const [deadlineReminders, setDeadlineReminders] = useState(initialSettings.deadline_reminders !== '0');
    const [reminderDaysBefore, setReminderDaysBefore] = useState(initialSettings.reminder_days_before || "7");

    // System Preferences
    const [maintenanceMode, setMaintenanceMode] = useState(initialSettings.maintenance_mode == '1');
    const [dataRetentionPeriod, setDataRetentionPeriod] = useState(initialSettings.data_retention_period || "5");


    const markAsChanged = () => {
        setHasChanges(true);
    };

    // --- SAVE KE DATABASE ---
    const handleSaveSettings = () => {
        // Petakan state local ke nama key database (snake_case)
        const payload = {
            max_students_per_lecturer: maxStudentsPerLecturer,
            max_pkl_per_lecturer: maxPKLPerLecturer,
            max_thesis_per_lecturer: maxThesisPerLecturer,
            max_competition_per_lecturer: maxCompetitionPerLecturer,
            
            registration_enabled: registrationEnabled,
            auto_approval: autoApproval,
            require_approval: requireApproval,
            
            email_notifications: emailNotifications,
            system_notifications: systemNotifications,
            deadline_reminders: deadlineReminders,
            reminder_days_before: reminderDaysBefore,
            
            maintenance_mode: maintenanceMode,
            data_retention_period: dataRetentionPeriod,
        };

        router.post(route('admin.settings.update'), payload, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Settings saved successfully!", {
                    description: "System configuration has been updated.",
                });
                setHasChanges(false);
            },
            onError: () => {
                toast.error("Failed to save settings.");
            }
        });
    };

    const handleResetToDefaults = () => {
        if(confirm("Are you sure you want to reset unsaved changes?")) {
            window.location.reload(); // Cara termudah reset ke nilai DB terakhir
        }
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
                                    max="50"
                                    value={maxStudentsPerLecturer}
                                    onChange={(e) => {
                                        setMaxStudentsPerLecturer(e.target.value);
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
                                    max="20"
                                    value={maxPKLPerLecturer}
                                    onChange={(e) => {
                                        setMaxPKLPerLecturer(e.target.value);
                                        markAsChanged();
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="max-thesis">
                                    Max Thesis Students per Lecturer
                                </Label>
                                <Input
                                    id="max-thesis"
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={maxThesisPerLecturer}
                                    onChange={(e) => {
                                        setMaxThesisPerLecturer(e.target.value);
                                        markAsChanged();
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="max-competition">
                                    Max Competition Teams per Lecturer
                                </Label>
                                <Input
                                    id="max-competition"
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={maxCompetitionPerLecturer}
                                    onChange={(e) => {
                                        setMaxCompetitionPerLecturer(e.target.value);
                                        markAsChanged();
                                    }}
                                />
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
                                    Allow students to register for new activities
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
                                    Automatically approve student registrations without manual review
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
                                    Require lecturers to approve supervision requests
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
                                            <SelectItem value="3">3 days before</SelectItem>
                                            <SelectItem value="5">5 days before</SelectItem>
                                            <SelectItem value="7">7 days before</SelectItem>
                                            <SelectItem value="14">14 days before</SelectItem>
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
                                    Enable to prevent users from accessing the system
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
                                    <SelectItem value="unlimited">Unlimited</SelectItem>
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
                        {isMobile ? "Reset" : "Reset Changes"}
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => window.location.reload()}
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