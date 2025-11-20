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
import { Separator } from "../Components/ui/separator";
import { Avatar, AvatarFallback } from "../Components/ui/avatar";
import {
    Save,
    User,
    Mail,
    Phone,
    MapPin,
    Lock,
    Shield,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminProfilePage() {
    // Personal Information
    const [fullName, setFullName] = useState("System Administrator");
    const [email, setEmail] = useState("admin@siperma.ac.id");
    const [phone, setPhone] = useState("+62 812 3456 7890");
    const [position, setPosition] = useState("System Administrator");
    const [department, setDepartment] = useState("Information Technology");
    const [address, setAddress] = useState(
        "Jl. Raya Universitas No. 123, Jakarta"
    );

    // Account Credentials
    const [username, setUsername] = useState("admin");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Password visibility
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [hasProfileChanges, setHasProfileChanges] = useState(false);
    const [hasPasswordChanges, setHasPasswordChanges] = useState(false);

    const handleSaveProfile = () => {
        toast.success("Profile updated successfully!", {
            description: "Your personal information has been saved.",
        });
        setHasProfileChanges(false);
    };

    const handleChangePassword = () => {
        // Validate passwords
        if (!currentPassword) {
            toast.error("Please enter your current password");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("New password must be at least 8 characters long");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        toast.success("Password changed successfully!", {
            description: "Your password has been updated.",
        });

        // Clear password fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setHasPasswordChanges(false);
    };

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: "", color: "" };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;

        if (strength <= 2)
            return { strength, label: "Weak", color: "bg-red-500" };
        if (strength <= 3)
            return { strength, label: "Medium", color: "bg-orange-500" };
        if (strength <= 4)
            return { strength, label: "Strong", color: "bg-green-500" };
        return { strength, label: "Very Strong", color: "bg-green-600" };
    };

    const passwordStrength = getPasswordStrength(newPassword);

    return (
        <MainLayout>
            <Head title="Admin Profile" />
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1>Admin Profile</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your personal information and account settings
                    </p>
                </div>

                {/* Profile Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-start gap-6 flex-col md:flex-row">
                            <Avatar className="w-24 h-24">
                                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                                    {fullName
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .substring(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h3>{fullName}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {position}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {department}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="w-4 h-4" />
                                        {email}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone className="w-4 h-4" />
                                        {phone}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" />
                                    <CardTitle>Personal Information</CardTitle>
                                </div>
                                <CardDescription>
                                    Update your personal details
                                </CardDescription>
                            </div>
                            {hasProfileChanges && (
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-orange-500" />
                                    <span className="text-sm text-orange-500">
                                        Unsaved changes
                                    </span>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="full-name">Full Name</Label>
                                <Input
                                    id="full-name"
                                    value={fullName}
                                    onChange={(e) => {
                                        setFullName(e.target.value);
                                        setHasProfileChanges(true);
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setHasProfileChanges(true);
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => {
                                        setPhone(e.target.value);
                                        setHasProfileChanges(true);
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="position">Position</Label>
                                <Input
                                    id="position"
                                    value={position}
                                    onChange={(e) => {
                                        setPosition(e.target.value);
                                        setHasProfileChanges(true);
                                    }}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="department">Department</Label>
                                <Input
                                    id="department"
                                    value={department}
                                    onChange={(e) => {
                                        setDepartment(e.target.value);
                                        setHasProfileChanges(true);
                                    }}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={address}
                                    onChange={(e) => {
                                        setAddress(e.target.value);
                                        setHasProfileChanges(true);
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                onClick={handleSaveProfile}
                                className="gap-2"
                                disabled={!hasProfileChanges}
                            >
                                <Save className="w-4 h-4" />
                                Save Profile
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Credentials */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            <CardTitle>Account Credentials</CardTitle>
                        </div>
                        <CardDescription>
                            Manage your login credentials
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Username */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        setHasProfileChanges(true);
                                    }}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Your username for logging into the system
                                </p>
                            </div>
                        </div>

                        <Separator />

                        {/* Change Password */}
                        <div className="space-y-4">
                            <div>
                                <h4 className="flex items-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    Change Password
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Update your account password
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">
                                        Current Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="current-password"
                                            type={
                                                showCurrentPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={currentPassword}
                                            onChange={(e) => {
                                                setCurrentPassword(
                                                    e.target.value
                                                );
                                                setHasPasswordChanges(true);
                                            }}
                                            placeholder="Enter current password"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3"
                                            onClick={() =>
                                                setShowCurrentPassword(
                                                    !showCurrentPassword
                                                )
                                            }
                                        >
                                            {showCurrentPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="new-password">
                                        New Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="new-password"
                                            type={
                                                showNewPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={newPassword}
                                            onChange={(e) => {
                                                setNewPassword(e.target.value);
                                                setHasPasswordChanges(true);
                                            }}
                                            placeholder="Enter new password"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3"
                                            onClick={() =>
                                                setShowNewPassword(
                                                    !showNewPassword
                                                )
                                            }
                                        >
                                            {showNewPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>
                                    {newPassword && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-muted-foreground">
                                                    Password strength:
                                                </span>
                                                <span className="text-xs">
                                                    {passwordStrength.label}
                                                </span>
                                            </div>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all ${passwordStrength.color}`}
                                                    style={{
                                                        width: `${
                                                            (passwordStrength.strength /
                                                                5) *
                                                            100
                                                        }%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Must be at least 8 characters long
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">
                                        Confirm New Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="confirm-password"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                setConfirmPassword(
                                                    e.target.value
                                                );
                                                setHasPasswordChanges(true);
                                            }}
                                            placeholder="Re-enter new password"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>
                                    {confirmPassword &&
                                        newPassword === confirmPassword && (
                                            <div className="flex items-center gap-2 text-xs text-green-600">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Passwords match
                                            </div>
                                        )}
                                    {confirmPassword &&
                                        newPassword !== confirmPassword && (
                                            <div className="flex items-center gap-2 text-xs text-red-600">
                                                <AlertCircle className="w-3 h-3" />
                                                Passwords do not match
                                            </div>
                                        )}
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button
                                    onClick={handleChangePassword}
                                    className="gap-2"
                                    disabled={!hasPasswordChanges}
                                >
                                    <Lock className="w-4 h-4" />
                                    Change Password
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Security Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Security Information</CardTitle>
                        <CardDescription>
                            Account security details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    <span className="text-sm">Last Login</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    October 26, 2024 at 09:15 AM
                                </p>
                            </div>

                            <div className="p-4 border rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    <span className="text-sm">
                                        Password Last Changed
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    September 15, 2024
                                </p>
                            </div>

                            <div className="p-4 border rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        Login Location
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Jakarta, Indonesia
                                </p>
                            </div>

                            <div className="p-4 border rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield className="w-4 h-4 text-green-600" />
                                    <span className="text-sm">
                                        Account Status
                                    </span>
                                </div>
                                <p className="text-sm text-green-600">
                                    Active & Secure
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
