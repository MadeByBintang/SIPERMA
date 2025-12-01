import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/Button";
import { Input } from "@/Components/ui/Input";
import { Label } from "@/Components/ui/Label";
import { Badge } from "@/Components/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/Tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/Table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/Dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/AlertDialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/Select";
import { Switch } from "@/Components/ui/Switch";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    UserCheck,
    UserX,
    Mail,
    Phone,
    Calendar,
    GraduationCap,
    Award,
    Users,
} from "lucide-react";
import { toast } from "sonner";

const UserType = "student" | "lecturer";

export default function UserManagementPage({ all_student, all_lecturer }) {
    const isQuotaValid = (quota) => Number(quota) >= 0;
    // Validation constants
    const maxNameLength = 50;
    const maxNimLength = 15;
    const maxNipLength = 18;

    // Validation helpers
    const isNameValid = (name) =>
        /^[A-Za-z\s]+$/.test(name) && name.length <= maxNameLength;
    const isNimValid = (nim) =>
        /^[0-9]+$/.test(nim) && nim.length <= maxNimLength;
    const isNipValid = (nip) =>
        /^[0-9]+$/.test(nip) && nip.length <= maxNipLength;

    // Error state
    const [formErrors, setFormErrors] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserType, setSelectedUserType] = useState("student");
    const [currentTab, setCurrentTab] = useState("student");

    // Form state
    const [formData, setFormData] = useState({});

    // Mock student data
    const [students, setStudents] = useState(all_student);

    // Mock lecturer data
    const [lecturers, setLecturers] = useState(all_lecturer);

    // Filter users based on search query
    const filteredStudents = students.filter(
        (student) =>
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.nim.includes(searchQuery) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredLecturers = lecturers.filter(
        (lecturer) =>
            lecturer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lecturer.nip.includes(searchQuery) ||
            lecturer.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle add user
    const handleAddUser = () => {
        setSelectedUserType(currentTab);
        setFormData({
            userType: currentTab,
            status: "active",
            supervision_quota: currentTab === "lecturer" ? 8 : 0,
        });
        setFormErrors({});
        setIsAddDialogOpen(true);
    };

    const saveNewUser = () => {
        // Frontend validation
        let errors = {};
        if (selectedUserType === "student") {
            if (!isNameValid(formData.name || ""))
                errors.name = `Full Name must be letters only and max ${maxNameLength} chars.`;
            if (!isNimValid(formData.nim || ""))
                errors.nim = `NIM must be numbers only and max ${maxNimLength} chars.`;
        } else {
            if (!isNameValid(formData.name || ""))
                errors.name = `Full Name must be letters only and max ${maxNameLength} chars.`;
            if (!isNipValid(formData.nip || ""))
                errors.nip = `NIP must be numbers only and max ${maxNipLength} chars.`;
            if (!isQuotaValid(formData.supervision_quota))
                errors.supervision_quota =
                    "Supervision quota cannot be negative.";
        }
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            toast.error(Object.values(errors).join("\n"));
            return;
        }
        setFormErrors({});
        router.post(route("admin.users.store"), formData, {
            onSuccess: () => {
                toast.success(`${selectedUserType} added successfully`);
                setIsAddDialogOpen(false);
                setFormData({});
            },
            onError: (errors) => {
                setFormErrors(errors);
                if (errors.email) toast.error(errors.email);
                else if (errors.nim) toast.error(errors.nim);
                else if (errors.nip) toast.error(errors.nip);
                else if (errors.supervision_quota)
                    toast.error(errors.supervision_quota);
                else toast.error("Failed to add user. Check inputs.");
            },
        });
    };

    // Handle edit user
    const handleEditUser = (user, type) => {
        setSelectedUser(user);
        setSelectedUserType(type);
        setFormData({
            ...user,
            supervision_quota: user.supervision_quota || 0,
        });
        setFormErrors({});
        setIsEditDialogOpen(true);
        // Clear errors when dialog closed
        const handleCloseAddDialog = () => {
            setIsAddDialogOpen(false);
            setFormErrors({});
        };
        const handleCloseEditDialog = () => {
            setIsEditDialogOpen(false);
            setFormErrors({});
        };
    };

    const saveEditUser = () => {
        // Frontend validation
        let errors = {};
        if (selectedUserType === "student") {
            if (!isNameValid(formData.name || ""))
                errors.name = `Full Name must be letters only and max ${maxNameLength} chars.`;
            if (!isNimValid(formData.nim || ""))
                errors.nim = `NIM must be numbers only and max ${maxNimLength} chars.`;
        } else {
            if (!isNameValid(formData.name || ""))
                errors.name = `Full Name must be letters only and max ${maxNameLength} chars.`;
            if (!isNipValid(formData.nip || ""))
                errors.nip = `NIP must be numbers only and max ${maxNipLength} chars.`;
            if (!isQuotaValid(formData.supervision_quota))
                errors.supervision_quota =
                    "Supervision quota cannot be negative.";
        }
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            toast.error(Object.values(errors).join("\n"));
            return;
        }
        setFormErrors({});
        router.put(route("admin.users.update", selectedUser.id), formData, {
            onSuccess: () => {
                toast.success("User updated successfully");
                setIsEditDialogOpen(false);
                setSelectedUser(null);
                setFormData({});
            },
            onError: (errors) => {
                setFormErrors(errors);
                if (errors.email) toast.error(errors.email);
                else if (errors.nim) toast.error(errors.nim);
                else if (errors.nip) toast.error(errors.nip);
                else if (errors.supervision_quota)
                    toast.error(errors.supervision_quota);
                else toast.error("Failed to update user.");
            },
        });
    };

    // Handle delete user
    const handleDeleteUser = (user, type) => {
        setSelectedUser(user);
        setSelectedUserType(type);
        setIsDeleteDialogOpen(true);
    };

    // Confirm delete
    const confirmDelete = () => {
        if (!selectedUser) return;
        router.delete(route("admin.users.destroy", selectedUser.id), {
            onSuccess: () => {
                toast.success("Account deleted successfully");
                setIsDeleteDialogOpen(false);
                setSelectedUser(null);
            },
            onError: () => toast.error("Failed to delete user"),
        });
    };

    // Handle toggle status
    const toggleUserStatus = (user) => {
        const action = user.status === "active" ? "deactivate" : "activate";

        router.put(
            route("admin.users.toggle-status", user.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => toast.success(`Status updated`),
                onError: () => toast.error("Failed to update status"),
            }
        );
    };

    // Render student form fields
    const renderStudentFormFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="nim">NIM</Label>
                    <Input
                        id="nim"
                        placeholder="e.g., 2021001234"
                        value={formData.nim || ""}
                        onChange={(e) => {
                            const value = e.target.value
                                .replace(/[^0-9]/g, "")
                                .slice(0, maxNimLength);
                            setFormData({ ...formData, nim: value });
                        }}
                        required
                    />
                    {formErrors.nim && (
                        <span className="text-red-500 text-xs">
                            {formErrors.nim}
                        </span>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        placeholder="Enter full name"
                        value={formData.name || ""}
                        onChange={(e) => {
                            const value = e.target.value
                                .replace(/[^A-Za-z\s]/g, "")
                                .slice(0, maxNameLength);
                            setFormData({ ...formData, name: value });
                        }}
                        required
                    />
                    {formErrors.name && (
                        <span className="text-red-500 text-xs">
                            {formErrors.name}
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="student@university.ac.id"
                        value={formData.email || ""}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        required
                    />
                </div>
            </div>
        </>
    );

    // Render lecturer form fields
    const renderLecturerFormFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="nip">NIP</Label>
                    <Input
                        id="nip"
                        placeholder="e.g., 198501012010011001"
                        value={formData.nip || ""}
                        onChange={(e) => {
                            const value = e.target.value
                                .replace(/[^0-9]/g, "")
                                .slice(0, maxNipLength);
                            setFormData({ ...formData, nip: value });
                        }}
                        required
                    />
                    {formErrors.nip && (
                        <span className="text-red-500 text-xs">
                            {formErrors.nip}
                        </span>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        placeholder="Enter full name"
                        value={formData.name || ""}
                        onChange={(e) => {
                            const value = e.target.value
                                .replace(/[^A-Za-z\s]/g, "")
                                .slice(0, maxNameLength);
                            setFormData({ ...formData, name: value });
                        }}
                        required
                    />
                    {formErrors.name && (
                        <span className="text-red-500 text-xs">
                            {formErrors.name}
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="lecturer@university.ac.id"
                        value={formData.email || ""}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="quota">Supervision Quota</Label>
                    <Input
                        id="quota"
                        type="number"
                        placeholder="0"
                        value={formData.supervision_quota || ""}
                        min={0}
                        onChange={(e) => {
                            let value = e.target.value;
                            if (Number(value) < 0) value = 0;
                            setFormData({
                                ...formData,
                                supervision_quota: Number(value),
                            });
                        }}
                        required
                    />
                    {formErrors.supervision_quota && (
                        <span className="text-red-500 text-xs">
                            {formErrors.supervision_quota}
                        </span>
                    )}
                </div>
            </div>
        </>
    );

    return (
        <MainLayout>
            <Head title="User Management" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h1>User Management</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage student and lecturer accounts
                        </p>
                    </div>
                    <Button onClick={handleAddUser} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add User
                    </Button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Total Students
                            </CardTitle>
                            <GraduationCap className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {students.length}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {
                                        students.filter(
                                            (s) => s.status === "active"
                                        ).length
                                    }{" "}
                                    active
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Total Lecturers
                            </CardTitle>
                            <Award className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {lecturers.length}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {
                                        lecturers.filter(
                                            (l) => l.status === "active"
                                        ).length
                                    }{" "}
                                    active
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Active Users
                            </CardTitle>
                            <UserCheck className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {students.filter(
                                            (s) => s.status === "active"
                                        ).length +
                                            lecturers.filter(
                                                (l) => l.status === "active"
                                            ).length}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Currently active
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Inactive Users
                            </CardTitle>
                            <UserX className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {students.filter(
                                            (s) => s.status === "inactive"
                                        ).length +
                                            lecturers.filter(
                                                (l) => l.status === "inactive"
                                            ).length}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Deactivated accounts
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* User List */}
                <Card>
                    <CardHeader>
                        <div className="flex items-start md:items-center justify-between gap-4 flex-col md:flex-row">
                            <div>
                                <CardTitle>User Accounts</CardTitle>
                                <CardDescription>
                                    View and manage all user accounts in the
                                    system
                                </CardDescription>
                            </div>
                            <div className="w-full md:w-auto">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search users..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="pl-9 w-full md:w-[300px]"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Tabs
                            value={currentTab}
                            onValueChange={(value) => setCurrentTab(value)}
                            className="w-full"
                        >
                            {/* Mobile Dropdown */}
                            <div className="md:hidden mb-6">
                                <Select
                                    value={currentTab}
                                    onValueChange={(value) =>
                                        setCurrentTab(value)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select user type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="student">
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="w-4 h-4" />
                                                <span>
                                                    Students (
                                                    {filteredStudents.length})
                                                </span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="lecturer">
                                            <div className="flex items-center gap-2">
                                                <Award className="w-4 h-4" />
                                                <span>
                                                    Lecturers (
                                                    {filteredLecturers.length})
                                                </span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Desktop Tabs */}
                            <TabsList className="hidden md:grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="student" className="gap-2">
                                    <GraduationCap className="w-4 h-4" />
                                    Students ({filteredStudents.length})
                                </TabsTrigger>
                                <TabsTrigger value="lecturer" className="gap-2">
                                    <Award className="w-4 h-4" />
                                    Lecturers ({filteredLecturers.length})
                                </TabsTrigger>
                            </TabsList>

                            {/* Students Table */}
                            <TabsContent value="student" className="space-y-4">
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <Table className="w-full text-center">
                                            <TableHeader className="[&>tr>th]:text-center">
                                                <TableRow>
                                                    <TableHead>NIM</TableHead>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Email</TableHead>
                                                    <TableHead>
                                                        Status
                                                    </TableHead>
                                                    <TableHead>
                                                        Actions
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredStudents.length > 0 ? (
                                                    filteredStudents.map(
                                                        (student) => (
                                                            <TableRow
                                                                key={student.id}
                                                            >
                                                                <TableCell>
                                                                    {
                                                                        student.nim
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center justify-center gap-2">
                                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                                            <span className="text-xs text-primary">
                                                                                {student.name
                                                                                    .split(
                                                                                        " "
                                                                                    )
                                                                                    .map(
                                                                                        (
                                                                                            n
                                                                                        ) =>
                                                                                            n[0]
                                                                                    )
                                                                                    .join(
                                                                                        ""
                                                                                    )
                                                                                    .substring(
                                                                                        0,
                                                                                        2
                                                                                    )}
                                                                            </span>
                                                                        </div>
                                                                        <span>
                                                                            {
                                                                                student.name
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-sm text-muted-foreground">
                                                                    {
                                                                        student.email
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className={
                                                                            student.status ===
                                                                            "active"
                                                                                ? "bg-green-50 text-green-700 border-green-300"
                                                                                : "bg-gray-50 text-gray-700 border-gray-300"
                                                                        }
                                                                    >
                                                                        {student.status ===
                                                                        "active" ? (
                                                                            <>
                                                                                <UserCheck className="w-3 h-3 mr-1" />
                                                                                Active
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <UserX className="w-3 h-3 mr-1" />
                                                                                Inactive
                                                                            </>
                                                                        )}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center justify-center gap-2">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                toggleUserStatus(
                                                                                    student,
                                                                                    "student"
                                                                                )
                                                                            }
                                                                            title={
                                                                                student.status ===
                                                                                "active"
                                                                                    ? "Deactivate"
                                                                                    : "Activate"
                                                                            }
                                                                        >
                                                                            {student.status ===
                                                                            "active" ? (
                                                                                <UserX className="w-4 h-4" />
                                                                            ) : (
                                                                                <UserCheck className="w-4 h-4" />
                                                                            )}
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                handleEditUser(
                                                                                    student,
                                                                                    "student"
                                                                                )
                                                                            }
                                                                        >
                                                                            <Edit className="w-4 h-4" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                handleDeleteUser(
                                                                                    student,
                                                                                    "student"
                                                                                )
                                                                            }
                                                                            className="text-destructive hover:text-destructive"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    )
                                                ) : (
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={8}
                                                            className="text-center py-8 text-muted-foreground"
                                                        >
                                                            No students found
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Lecturers Table */}
                            <TabsContent value="lecturer" className="space-y-4">
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <Table className="w-full text-center">
                                            <TableHeader className="[&>tr>th]:text-center">
                                                <TableRow>
                                                    <TableHead>NIP</TableHead>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Email</TableHead>
                                                    <TableHead>
                                                        Supervision Quota
                                                    </TableHead>
                                                    <TableHead>
                                                        Status
                                                    </TableHead>
                                                    <TableHead>
                                                        Actions
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredLecturers.length >
                                                0 ? (
                                                    filteredLecturers.map(
                                                        (lecturer) => (
                                                            <TableRow
                                                                key={
                                                                    lecturer.id
                                                                }
                                                            >
                                                                <TableCell>
                                                                    {
                                                                        lecturer.nip
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                                            <span className="text-xs text-primary">
                                                                                {lecturer.name
                                                                                    .split(
                                                                                        " "
                                                                                    )
                                                                                    .map(
                                                                                        (
                                                                                            n
                                                                                        ) =>
                                                                                            n[0]
                                                                                    )
                                                                                    .join(
                                                                                        ""
                                                                                    )
                                                                                    .substring(
                                                                                        0,
                                                                                        2
                                                                                    )}
                                                                            </span>
                                                                        </div>
                                                                        <span>
                                                                            {
                                                                                lecturer.name
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-sm text-muted-foreground">
                                                                    {
                                                                        lecturer.email
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    {
                                                                        lecturer.supervision_quota
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className={
                                                                            lecturer.status ===
                                                                            "active"
                                                                                ? "bg-green-50 text-green-700 border-green-300"
                                                                                : "bg-gray-50 text-gray-700 border-gray-300"
                                                                        }
                                                                    >
                                                                        {lecturer.status ===
                                                                        "active" ? (
                                                                            <>
                                                                                <UserCheck className="w-3 h-3 mr-1" />
                                                                                Active
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <UserX className="w-3 h-3 mr-1" />
                                                                                Inactive
                                                                            </>
                                                                        )}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center justify-center gap-2">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                toggleUserStatus(
                                                                                    lecturer,
                                                                                    "lecturer"
                                                                                )
                                                                            }
                                                                            title={
                                                                                lecturer.status ===
                                                                                "active"
                                                                                    ? "Deactivate"
                                                                                    : "Activate"
                                                                            }
                                                                        >
                                                                            {lecturer.status ===
                                                                            "active" ? (
                                                                                <UserX className="w-4 h-4" />
                                                                            ) : (
                                                                                <UserCheck className="w-4 h-4" />
                                                                            )}
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                handleEditUser(
                                                                                    lecturer,
                                                                                    "lecturer"
                                                                                )
                                                                            }
                                                                        >
                                                                            <Edit className="w-4 h-4" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                handleDeleteUser(
                                                                                    lecturer,
                                                                                    "lecturer"
                                                                                )
                                                                            }
                                                                            className="text-destructive hover:text-destructive"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    )
                                                ) : (
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={7}
                                                            className="text-center py-8 text-muted-foreground"
                                                        >
                                                            No lecturers found
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Add User Dialog */}
                <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                >
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                Add New{" "}
                                {selectedUserType === "student"
                                    ? "Student"
                                    : "Lecturer"}
                            </DialogTitle>
                            <DialogDescription>
                                Fill in the details to create a new{" "}
                                {selectedUserType} account
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            {selectedUserType === "student"
                                ? renderStudentFormFields()
                                : renderLecturerFormFields()}
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsAddDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={saveNewUser}>Create User</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit User Dialog */}
                <Dialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                >
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                Edit{" "}
                                {selectedUserType === "student"
                                    ? "Student"
                                    : "Lecturer"}
                            </DialogTitle>
                            <DialogDescription>
                                Update the {selectedUserType} account
                                information
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            {selectedUserType === "student"
                                ? renderStudentFormFields()
                                : renderLecturerFormFields()}
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={saveEditUser}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the{" "}
                                {selectedUserType} account for{" "}
                                <span className="font-medium text-foreground">
                                    {selectedUser?.name}
                                </span>
                                . This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Delete Account
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </MainLayout>
    );
}
