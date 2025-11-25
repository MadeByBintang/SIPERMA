// --- Core & Third Party Libraries ---
import { useState } from "react";
import { Head, usePage, useForm, router } from "@inertiajs/react";
import { toast } from "sonner";

// --- Layouts ---
import MainLayout from "@/Layouts/MainLayout";

// --- UI Components (Forms & Inputs) ---
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

// --- UI Components (Display & Layout) ---
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

// --- UI Components (Overlays & Interaction) ---
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

// --- Icons ---
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

export default function StudentProfilePage({student, supervisors = [], allSkills = [] }) {

    const { auth } = usePage().props;
    const user = auth?.user || {};

    const [isEditing, setIsEditing] = useState(false);
    const [open, setOpen] = useState(false);
    const [dropdownSkill, setDropdownSkill] = useState(null);


    const initialData = {
        name: student?.name || "Guest",
        nim: student?.nim || "-",
        studyProgram: student?.studyProgram || "-",
        email: student?.email || "-",
        skills: Array.isArray(student?.skills)
        ? student.skills.map(s => ({
            id: s.id,
            name: s.name,
            level: s.level,
        }))
        : [],
    };

    // 2. SETUP FORM INERTIA
    const { data, setData, post, processing, reset, errors } = useForm({
        skills: initialData.skills,
    });

    // Handlers
    const handleEdit = () => setIsEditing(true);

    const handleCancel = () => {
        reset();
        setIsEditing(false);
    };

    const handleSave = () => {
        // Gunakan POST ke route update (karena HTML form method spoofing)
        // Pastikan route 'profile.student.update' ada di web.php
        router.post(route('profile.student.update'), {
            _method: 'post',
            skills: data.skills.map(s => ({
                id: s.id,
                level: s.level ?? 1,
            }))
        }, {
            onSuccess: () => {
                toast.success("Profile updated successfully");
                setIsEditing(false);
            },
            onError: (err) => {
                console.error(err);
                toast.error("Failed to update profile. Check inputs.");
            }
        });
    };


    const toggleSkill = (skill) => {
        const exists = data.skills.find(i => i.id === skill.id);
        if (exists) {
            setData('skills', data.skills.filter(i => i.id !== skill.id));
        } else {
            const newSkillEntry = {
                ...skill,
                level: 1
            };
            setData('skills', [...data.skills, newSkillEntry]);
        }
    };



    const removeSkill = (id) => {
        setData('skills', data.skills.filter(i => i.id !== id));
    };

    const updateSkillLevel = (id, level) => {
        setData('skills', data.skills.map(s => s.id === id ? {...s, level} : s));
    };



    const getInitials = (name) => {
        return name ? name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .toUpperCase() : "-";
    };

    const {
        data: accountData,
        setData: setAccountData,
        put: updateAccount,
        processing: accountProcessing,
        errors: accountErrors,
        reset: resetAccount
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
                resetAccount("current_password", "password", "password_confirmation");

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

        if (strength <= 2) return { strength, label: "Weak", color: "bg-red-500" };
        if (strength <= 3) return { strength, label: "Medium", color: "bg-orange-500" };
        if (strength <= 4) return { strength, label: "Strong", color: "bg-green-500" };
        return { strength, label: "Very Strong", color: "bg-green-600" };
    };

    const passwordStrength = getPasswordStrength(accountData.password);

    return (
        <MainLayout>
            <Head title="Student Profile" />
            <div className="space-y-6">

                {/* Profile Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Student Profile</CardTitle>
                        {!isEditing ? (
                            <Button onClick={handleEdit} variant="outline" className="gap-2">
                                <Edit2 className="w-4 h-4" /> Edit
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button onClick={handleCancel} variant="outline" className="gap-2">
                                    <X className="w-4 h-4" /> Cancel
                                </Button>
                                <Button onClick={handleSave} className="gap-2" disabled={processing}>
                                    <Save className="w-4 h-4" /> {processing ? "Saving..." : "Save"}
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
                                        <Input value={initialData.name} disabled className="bg-muted" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>NIM</Label>
                                        <Input value={initialData.nim} disabled className="bg-muted" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input value={initialData.email} disabled className="bg-muted" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Program Studi</Label>
                                        <Input value={initialData.studyProgram} disabled className="bg-muted" />
                                    </div>
                                </div>



                                {/* Editable Field: skill Areas */}
                                <div className="space-y-2">
                                    <Label>Skill Areas</Label>
                                    {/* <div className="flex flex-wrap gap-2 p-3 border border-border rounded-lg bg-muted/30 min-h-[3rem]">
                                        {data.skills.length > 0 ? (
                                            data.skills.map((skill) => (
                                                <Badge key={skill.id} variant="secondary" className="gap-1">
                                                    {skill.name} {skill.level}
                                                    {isEditing && (
                                                        <button
                                                            onClick={() => removeSkill(skill.id)}
                                                            className="ml-1 hover:text-red-500"
                                                            type="button"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </Badge>


                                            ))
                                        ) : (
                                            <span className="text-sm text-muted-foreground self-center">No skills selected</span>
                                        )}
                                    </div> */}

                                    <div className="flex flex-wrap gap-2">
                                    {data.skills.map(skill => (
                                        <div key={skill.id} className="relative">
                                        <Badge
                                            variant="secondary"
                                            className="gap-1 cursor-pointer flex items-center"
                                            onClick={() => setDropdownSkill(dropdownSkill === skill.id ? null : skill.id)}
                                        >
                                            {skill.name} (Lvl {skill.level})
                                            {isEditing && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeSkill(skill.id); }}
                                                className="ml-1 hover:text-red-500"
                                                type="button"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                            )}
                                        </Badge>

                                        {/* Dropdown muncul hanya untuk badge yang diklik */}
                                        {isEditing && dropdownSkill === skill.id && (
                                            <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded shadow-md">
                                            {[1,2,3,4,5].map(lvl => (
                                                <div
                                                key={lvl}
                                                className={`px-3 py-1 cursor-pointer hover:bg-gray-100 ${skill.level === lvl ? 'font-bold' : ''}`}
                                                onClick={() => {
                                                    updateSkillLevel(skill.id, lvl);
                                                    setDropdownSkill(null); // tutup dropdown
                                                }}
                                                >
                                                Level {lvl}
                                                </div>
                                            ))}
                                            </div>
                                        )}
                                        </div>
                                    ))}
                                    </div>


                                    {isEditing && (
                                        <div className="mt-2">
                                            <Popover open={open} onOpenChange={setOpen}>
                                                <PopoverTrigger asChild>
                                                    <button
                                                        type="button"
                                                        role="combobox"
                                                        aria-expanded={open}
                                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        Select skills...
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[300px] p-0" align="start">
                                                    <Command>
                                                        <CommandInput placeholder="Search skills..." />
                                                        <CommandList>
                                                            <CommandEmpty>No skill found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {allSkills.map((skill) => {
                                                                    const isSelected = data.skills.some(i => i.id === skill.id);
                                                                    return (
                                                                    <CommandItem
                                                                        key={skill.id}
                                                                        onSelect={() => toggleSkill(skill)}
                                                                    >
                                                                        <div className="flex items-center justify-between w-full">
                                                                            <div className="flex items-center gap-2">
                                                                                <div
                                                                                    className={`w-4 h-4 border rounded flex items-center justify-center ${
                                                                                        isSelected ? "bg-primary border-primary" : "border-input"
                                                                                    }`}
                                                                                >
                                                                                    {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                                                                                </div>
                                                                                <span>{skill.name}</span>
                                                                            </div>
                                                                        </div>
                                                                    </CommandItem>
                                                                )})}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Supervisors History Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Supervision History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {supervisors.length > 0 ? supervisors.map((supervisor) => (
                                <div key={supervisor.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                {getInitials(supervisor.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h4 className="font-medium">{supervisor.name}</h4>
                                            <p className="text-sm text-muted-foreground">{supervisor.expertise}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{supervisor.period}</p>
                                        </div>
                                    </div>
                                    <Badge variant={supervisor.status === "Active" ? "default" : "secondary"}>
                                        {supervisor.status}
                                    </Badge>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
                                    <p>No supervision history found.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <form onSubmit={handleChangeAccount}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-primary" />
                                <CardTitle>Account</CardTitle>
                            </div>
                            <CardDescription>Update username or password</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={accountData.username}
                                    onChange={(e) => setAccountData("username", e.target.value)}
                                />
                                {accountErrors.username && <div className="text-red-500 text-xs">{accountErrors.username}</div>}
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <div className="relative">
                                    <Input
                                        id="current-password"
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={accountData.current_password}
                                        onChange={(e) => setAccountData("current_password", e.target.value)}
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
                                {accountErrors.current_password && <div className="text-red-500 text-xs">{accountErrors.current_password}</div>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="new-password"
                                        type={showNewPassword ? "text" : "password"}
                                        value={accountData.password}
                                        onChange={(e) => setAccountData("password", e.target.value)}
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
                                {accountData.password && (
                                    <div className="mt-2">
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Strength:</span>
                                            <span>{passwordStrength.label}</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all ${passwordStrength.color}`}
                                                style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                                {accountErrors.password && <div className="text-red-500 text-xs">{accountErrors.password}</div>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={accountData.password_confirmation}
                                        onChange={(e) => setAccountData("password_confirmation", e.target.value)}
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
                                {accountData.password_confirmation &&
                                    accountData.password === accountData.password_confirmation && (
                                        <div className="flex items-center gap-2 text-xs text-green-600">
                                            <CheckCircle2 className="w-3 h-3" /> Passwords match
                                        </div>
                                    )}
                                {accountData.password_confirmation &&
                                    accountData.password !== accountData.password_confirmation && (
                                        <div className="flex items-center gap-2 text-xs text-red-600">
                                            <AlertCircle className="w-3 h-3" /> Passwords do not match
                                        </div>
                                    )}
                                {accountErrors.password_confirmation && <div className="text-red-500 text-xs">{accountErrors.password_confirmation}</div>}
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" className="gap-2" disabled={accountProcessing}>
                                    <Lock className="w-4 h-4" /> Update Account
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </MainLayout>
    );
}
