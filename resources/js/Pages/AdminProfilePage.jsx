import { useState } from "react";
import { usePage, useForm, Head } from "@inertiajs/react";
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
import { Separator } from "@/Components/ui/separator";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import {
    Save,
    User,
    Shield,
    Mail,
    Lock,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminProfilePage({ admin }) {
    const { auth } = usePage().props;
    const user = auth?.user || {};
    const adminData = admin || {
        full_name: "Admin",
        email: "admin@example.com",
    };

    // ---------------- PROFILE FORM ----------------
    const { data, setData, post, processing, errors, isDirty } = useForm({
        full_name: adminData?.full_name || "",
        email: adminData?.email || "",
    });

    const handleSaveProfile = (e) => {
        e.preventDefault();
        post(route("profile.admin.update"), {
            onSuccess: () =>
                toast.success("Profile updated successfully!", {
                    description: "Your personal information has been saved.",
                }),
            onError: () => toast.error("Failed to update profile."),
        });
    };

    // ---------------- ACCOUNT FORM ----------------
    const {
        data: accountData,
        setData: setAccountData,
        put: updateAccount,
        processing: accountProcessing,
        errors: accountErrors,
        reset,
    } = useForm({
        username: user?.username || "",
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChangeAccount = (e) => {
        e.preventDefault();
        updateAccount(route("profile.admin.accountupdate"), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Account updated successfully!");
                reset("current_password", "password", "password_confirmation");

                // ambil username terbaru dari auth props
                setAccountData({ username: page.props.auth.user.username });
            },
            onError: () => toast.error("Failed to update account."),
        });
    };

    // ---------------- PASSWORD STRENGTH ----------------
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

    const passwordStrength = getPasswordStrength(accountData.password);

    return (
        <MainLayout>
            <Head title="Admin Profile" />
            <div className="space-y-6">
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
                                    {data.full_name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .substring(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h3>{data.full_name}</h3>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="w-4 h-4" />
                                        {data.email}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ----------- PROFILE FORM ----------- */}
                <form onSubmit={handleSaveProfile}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <User className="w-5 h-5 text-primary" />
                                        <CardTitle>
                                            Personal Information
                                        </CardTitle>
                                    </div>
                                    <CardDescription>
                                        Update your personal details
                                    </CardDescription>
                                </div>
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
                                        value={data.full_name}
                                        onChange={(e) =>
                                            setData("full_name", e.target.value)
                                        }
                                    />
                                    {errors.full_name && (
                                        <div className="text-red-500 text-xs">
                                            {errors.full_name}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                    />
                                    {errors.email && (
                                        <div className="text-red-500 text-xs">
                                            {errors.email}
                                        </div>
                                    )}
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

                {/* ----------- ACCOUNT FORM ----------- */}
                <form onSubmit={handleChangeAccount}>
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
                                        value={accountData.username}
                                        onChange={(e) =>
                                            setAccountData(
                                                "username",
                                                e.target.value
                                            )
                                        }
                                    />
                                    {accountErrors.username && (
                                        <div className="text-red-500 text-xs">
                                            {accountErrors.username}
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Your username for logging into the
                                        system
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

                                {/* Current Password */}
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
                                            value={accountData.current_password}
                                            onChange={(e) =>
                                                setAccountData(
                                                    "current_password",
                                                    e.target.value
                                                )
                                            }
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
                                    {accountErrors.current_password && (
                                        <div className="text-red-500 text-xs">
                                            {accountErrors.current_password}
                                        </div>
                                    )}
                                </div>

                                {/* New Password */}
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
                                            value={accountData.password}
                                            onChange={(e) =>
                                                setAccountData(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
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

                                    {accountData.password && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span>Password strength:</span>
                                                <span>
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
                                    {accountErrors.password && (
                                        <div className="text-red-500 text-xs">
                                            {accountErrors.password}
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
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
                                            value={
                                                accountData.password_confirmation
                                            }
                                            onChange={(e) =>
                                                setAccountData(
                                                    "password_confirmation",
                                                    e.target.value
                                                )
                                            }
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

                                    {accountData.password_confirmation &&
                                        accountData.password ===
                                            accountData.password_confirmation && (
                                            <div className="flex items-center gap-2 text-xs text-green-600">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Passwords match
                                            </div>
                                        )}

                                    {accountData.password_confirmation &&
                                        accountData.password !==
                                            accountData.password_confirmation && (
                                            <div className="flex items-center gap-2 text-xs text-red-600">
                                                <AlertCircle className="w-3 h-3" />
                                                Passwords do not match
                                            </div>
                                        )}

                                    {accountErrors.password_confirmation && (
                                        <div className="text-red-500 text-xs">
                                            {
                                                accountErrors.password_confirmation
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-4">
                                <Button
                                    type="submit"
                                    className="gap-2"
                                    disabled={accountProcessing}
                                >
                                    <Lock className="w-4 h-4" />
                                    Update Account
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </MainLayout>
    );
}
