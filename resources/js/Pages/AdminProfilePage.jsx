import { useState } from "react";
import { usePage, useForm, Head } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";

// PENTING: Gunakan '@' agar tidak error White Screen (Module not found)
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
import { Separator } from "@/Components/ui/separator";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import {
    Save,
    User,
    Mail,
    //Phone,
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
    // 1. AMBIL DATA DARI DATABASE
    const { auth } = usePage().props;
    const user = auth?.user || {}; // Pakai fallback {} agar tidak crash

    // 2. FORM PROFIL (Menggunakan useForm Inertia)
    const { data, setData, post, processing, errors, isDirty } = useForm({
        name: user?.name || "",
        email: user?.email || "",
        //phone: user?.phone || "",
        position: user?.position || "",
        department: user?.department || "",
        address: user?.address || "",
        username: user?.username || "",
    });

    // 3. FORM PASSWORD (Menggunakan useForm Inertia)
    const {
        data: passwordData,
        setData: setPasswordData,
        put: updatePassword,
        processing: passwordProcessing,
        errors: passwordErrors,
        reset: resetPassword,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    // State UI untuk Password Visibility (Tetap pakai useState)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // --- LOGIKA SIMPAN KE DATABASE ---
    const handleSaveProfile = (e) => {
        e.preventDefault();
        post(route("profile.update"), {
            onSuccess: () => toast.success("Profile updated successfully!", {
                description: "Your personal information has been saved to database.",
            }),
            onError: () => toast.error("Failed to update profile."),
        });
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        updatePassword(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Password changed successfully!");
                resetPassword();
            },
            onError: () => toast.error("Failed to change password."),
        });
    };

    // Helper UI: Password Strength
    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: "", color: "" };
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;

        if (strength <= 2) return { strength, label: "Weak", color: "bg-red-500" };
        if (strength <= 3) return { strength, label: "Medium", color: "bg-orange-500" };
        if (strength <= 4) return { strength, label: "Strong", color: "bg-green-500" };
        return { strength, label: "Very Strong", color: "bg-green-600" };
    };

    const passwordStrength = getPasswordStrength(passwordData.password);

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

                {/* Profile Overview (Data dari DB) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-start gap-6 flex-col md:flex-row">
                            <Avatar className="w-24 h-24">
                                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                                    {data.name
                                        ? data.name.split(" ").map((n) => n[0]).join("").substring(0, 2)
                                        : "AD"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h3>{data.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {data.position || "System Administrator"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {data.department || "IT Department"}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="w-4 h-4" />
                                        {data.email}
                                    </div>
                                    {/*<div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone className="w-4 h-4" />
                                        {data.phone || "-"}
                                    </div>*/}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Personal Information Form */}
                <form onSubmit={handleSaveProfile}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <User className="w-5 h-5 text-primary" />
                                        <CardTitle>Personal Information</CardTitle>
                                    </div>
                                    <CardDescription>Update your personal details</CardDescription>
                                </div>
                                {/* Menggunakan isDirty dari Inertia untuk cek perubahan */}
                                {isDirty && (
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
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                    />
                                    {errors.name && <div className="text-red-500 text-xs">{errors.name}</div>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                    />
                                    {errors.email && <div className="text-red-500 text-xs">{errors.email}</div>}
                                </div>

                                {/*<div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData("phone", e.target.value)}
                                    />
                                </div>*/}

                                <div className="space-y-2">
                                    <Label htmlFor="position">Position</Label>
                                    <Input
                                        id="position"
                                        value={data.position}
                                        onChange={(e) => setData("position", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Input
                                        id="department"
                                        value={data.department}
                                        onChange={(e) => setData("department", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        value={data.address}
                                        onChange={(e) => setData("address", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button
                                    type="submit"
                                    className="gap-2"
                                    disabled={processing || !isDirty}
                                >
                                    <Save className="w-4 h-4" />
                                    {processing ? "Saving..." : "Save Profile"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>

                {/* Account Credentials Form */}
                <form onSubmit={handleChangePassword}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-primary" />
                                <CardTitle>Account Credentials</CardTitle>
                            </div>
                            <CardDescription>Manage your login credentials</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        value={data.username}
                                        onChange={(e) => setData("username", e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Your username for logging into the system
                                    </p>
                                    {errors.username && <div className="text-red-500 text-xs">{errors.username}</div>}
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div>
                                    <h4 className="flex items-center gap-2">
                                        <Lock className="w-4 h-4" /> Change Password
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        Update your account password
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current-password">Current Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="current-password"
                                                type={showCurrentPassword ? "text" : "password"}
                                                value={passwordData.current_password}
                                                onChange={(e) => setPasswordData("current_password", e.target.value)}
                                                placeholder="Enter current password"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            >
                                                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                        {passwordErrors.current_password && <div className="text-red-500 text-xs">{passwordErrors.current_password}</div>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="new-password">New Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="new-password"
                                                type={showNewPassword ? "text" : "password"}
                                                value={passwordData.password}
                                                onChange={(e) => setPasswordData("password", e.target.value)}
                                                placeholder="Enter new password"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                            >
                                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                        {passwordData.password && (
                                            <div className="space-y-2 mt-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-muted-foreground">Strength:</span>
                                                    <span className="text-xs">{passwordStrength.label}</span>
                                                </div>
                                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all ${passwordStrength.color}`}
                                                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {passwordErrors.password && <div className="text-red-500 text-xs">{passwordErrors.password}</div>}
                                        <p className="text-xs text-muted-foreground">
                                            Must be at least 8 characters long
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="confirm-password"
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={passwordData.password_confirmation}
                                                onChange={(e) => setPasswordData("password_confirmation", e.target.value)}
                                                placeholder="Re-enter new password"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                        {passwordData.password_confirmation && passwordData.password === passwordData.password_confirmation && (
                                            <div className="flex items-center gap-2 text-xs text-green-600">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Passwords match
                                            </div>
                                        )}
                                        {passwordData.password_confirmation && passwordData.password !== passwordData.password_confirmation && (
                                            <div className="flex items-center gap-2 text-xs text-red-600">
                                                <AlertCircle className="w-3 h-3" />
                                                Passwords do not match
                                            </div>
                                        )}
                                        {passwordErrors.password_confirmation && <div className="text-red-500 text-xs">{passwordErrors.password_confirmation}</div>}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button type="submit" className="gap-2" disabled={passwordProcessing}>
                                        <Lock className="w-4 h-4" />
                                        Change Password
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </form>

                {/* Security Information - Static / Read Only for now */}
                <Card>
                    <CardHeader>
                        <CardTitle>Security Information</CardTitle>
                        <CardDescription>Account security details</CardDescription>
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
                                    <span className="text-sm">Role</span>
                                </div>
                                <p className="text-sm text-muted-foreground capitalize">
                                    {user?.role_name || 'Admin'}
                                </p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">Login Location</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Jakarta, Indonesia
                                </p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield className="w-4 h-4 text-green-600" />
                                    <span className="text-sm">Account Status</span>
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