import { useState } from "react";
import { Head, usePage, useForm, router } from "@inertiajs/react";
import { toast } from "sonner";
import MainLayout from "@/Layouts/MainLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Switch } from "@/Components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import { Separator } from "@/Components/ui/separator";
import { Badge } from "@/Components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import {
    AlertCircle,
    Check,
    CheckCircle2,
    Edit2,
    Eye,
    EyeOff,
    Lock,
    Save,
    Shield,
    User,
    X,
} from "lucide-react";

const FOCUS_LABELS = {
    "BIG DATA": "Big Data",
    MTI: "Manajemen TI",
    JARINGAN: "Jaringan",
};

export default function StudentProfilePage({ student }) {
    const { auth } = usePage().props;
    const user = auth?.user || {};

    const [isEditing, setIsEditing] = useState(false);

    const initialData = {
        name: student?.name || "Guest",
        nim: student?.nim || "-",
        studyProgram: student?.studyProgram || "-",
        email: student?.email || "-",
        focus: student?.focus || "",
    };

    const { data, setData, processing, reset, errors } = useForm({
        email: initialData.email,
        focus: initialData.focus,
    });

    const [localErrors, setLocalErrors] = useState({});
    const [dirty, setDirty] = useState({ email: false });

    const isDirty = dirty.email && data.email !== initialData.email;

    const handleEdit = () => setIsEditing(true);

    const handleCancel = () => {
        setIsEditing(false);
        reset(); // reset data
        setLocalErrors({}); // clear frontend errors
        setDirty({ email: false }); // reset dirty flag
    };

    const handleSave = () => {
        // don't allow save if email is invalid
        if (localErrors.email) {
            toast.error("Invalid email. Please fix before saving.");
            return;
        }

        router.post(
            route("profile.student.update"),
            {
                _method: "post",
                email: data.email,
                focus: data.focus,
            },
            {
                onSuccess: () => {
                    toast.success("Profile updated successfully");
                    setIsEditing(false);
                },
                onError: (err) => {
                    console.error(err);
                    toast.error("Failed to update profile. Check inputs.");
                },
            }
        );
    };

    const getInitials = (name) => {
        return name
            ? name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()
            : "-";
    };

    const {
        data: accountData,
        setData: setAccountData,
        put: updateAccount,
        processing: accountProcessing,
        errors: accountErrors,
        reset: resetAccount,
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
        updateAccount(route("profile.student.accountupdate"), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Account updated successfully!");
                reset("current_password", "password", "password_confirmation");

                // get latest username from auth props
                setAccountData({ username: page.props.auth.user.username });
            },
            onError: () => toast.error("Failed to update account."),
        });
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

    const passwordStrength = getPasswordStrength(accountData.password);

    return (
        <MainLayout>
            <Head title="Student Profile" />
            <div className="space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Student Profile</CardTitle>
                        {!isEditing ? (
                            <Button
                                onClick={handleEdit}
                                variant="outline"
                                className="gap-2"
                            >
                                <Edit2 className="w-4 h-4" /> Edit
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleCancel}
                                    variant="outline"
                                    className="gap-2"
                                >
                                    <X className="w-4 h-4" /> Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    className="gap-2"
                                    disabled={processing || localErrors.email}
                                >
                                    <Save className="w-4 h-4" />{" "}
                                    {processing ? "Saving..." : "Save"}
                                </Button>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col md:flex-row items-start gap-6">
                            {/* Avatar */}
                            <Avatar className="w-24 h-24">
                                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                                    {getInitials(initialData.name)}
                                </AvatarFallback>
                            </Avatar>

                            {/* Form Fields */}
                            <div className="flex-1 space-y-4 w-full">
                                {/* Read Only Fields */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Full Name</Label>
                                        <Input
                                            id="name"
                                            value={initialData.name}
                                            disabled
                                            className={"bg-muted"}
                                        />
                                        {errors.name && (
                                            <div className="text-red-500 text-xs">
                                                {errors.name}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>NIM</Label>
                                        <Input
                                            value={initialData.nim}
                                            disabled
                                            className="bg-muted"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setData("email", value);

                                                // mark field as changed by user
                                                setDirty((prev) => ({
                                                    ...prev,
                                                    email: true,
                                                }));

                                                const emailRegex =
                                                    /^[a-zA-Z0-9]+@mhs\.ulm\.ac\.id$/;

                                                if (!isDirty) {
                                                    setLocalErrors((prev) => ({
                                                        ...prev,
                                                        email: null,
                                                    }));
                                                } else if (
                                                    !emailRegex.test(value)
                                                ) {
                                                    setLocalErrors((prev) => ({
                                                        ...prev,
                                                        email: "Invalid email format.",
                                                    }));
                                                } else {
                                                    setLocalErrors((prev) => ({
                                                        ...prev,
                                                        email: null,
                                                    }));
                                                }

                                                setDirty((prev) => ({
                                                    ...prev,
                                                    email: true,
                                                }));
                                            }}
                                            disabled={!isEditing}
                                            className={
                                                !isEditing
                                                    ? "bg-muted"
                                                    : "bg-background"
                                            }
                                        />

                                        {isEditing && localErrors.email && (
                                            <div className="text-red-500 text-xs">
                                                {localErrors.email}
                                            </div>
                                        )}

                                        {!isEditing && errors.email && (
                                            <div className="text-red-500 text-xs">
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Study Program</Label>
                                        <Input
                                            value={initialData.studyProgram}
                                            disabled
                                            className="bg-muted"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Focus Area</Label>
                                    {isEditing ? (
                                        <Select
                                            value={data.focus}
                                            onValueChange={(val) =>
                                                setData("focus", val)
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Focus Area" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="BIG DATA">
                                                    Big Data
                                                </SelectItem>
                                                <SelectItem value="MTI">
                                                    Manajemen TI
                                                </SelectItem>
                                                <SelectItem value="JARINGAN">
                                                    Jaringan
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Input
                                            value={
                                                FOCUS_LABELS[
                                                    initialData.focus
                                                ] ||
                                                initialData.focus ||
                                                ""
                                            }
                                            disabled
                                            className="bg-muted"
                                        />
                                    )}
                                    {errors.focus && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.focus}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

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
                                        maxLength={50}
                                        onChange={(e) => {
                                            let value = e.target.value;

                                            // Hapus karakter yang tidak diizinkan (hanya A-Z, 0-9, _)
                                            value = value.replace(
                                                /[^A-Za-z0-9]/g,
                                                ""
                                            );

                                            // Batasi maksimal 50 karakter
                                            if (value.length <= 50) {
                                                setAccountData(
                                                    "username",
                                                    value
                                                );
                                            }
                                        }}
                                    />
                                    {accountErrors.username && (
                                        <div className="text-red-500 text-xs">
                                            {accountErrors.username}
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Username for logging in (max 50
                                        characters, A-Z, 0-9, underscore only)
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {accountData.username.length}/50
                                        characters
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
                                            <div className="flex justify-between text-xs text-muted-foreground">
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
                                        Must be 8-15 characters long
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
                                        Confirm Password
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
                                                <CheckCircle2 className="w-3 h-3" />{" "}
                                                Passwords match
                                            </div>
                                        )}
                                    {accountData.password_confirmation &&
                                        accountData.password !==
                                            accountData.password_confirmation && (
                                            <div className="flex items-center gap-2 text-xs text-red-600">
                                                <AlertCircle className="w-3 h-3" />{" "}
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
