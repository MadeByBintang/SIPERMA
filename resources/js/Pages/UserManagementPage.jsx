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
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
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
    Plus,
    Search,
    Edit,
    Trash2,
    UserCheck,
    UserX,
    GraduationCap,
    Award,
    Users,
} from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/Components/ui/switch";

export default function UserManagementPage({
    students: propStudents = [],
    lecturers: propLecturers = [],
    filters = {},
}) {
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isToggleStatusDialogOpen, setIsToggleStatusDialogOpen] =
        useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedUserType, setSelectedUserType] = useState("student");
    const [currentTab, setCurrentTab] = useState("student");
    const [formData, setFormData] = useState({});
    const [students, setStudents] = useState(propStudents);
    const [lecturers, setLecturers] = useState(propLecturers);

    useEffect(() => {
        setStudents(propStudents);
        setLecturers(propLecturers);
    }, [propStudents, propLecturers]);

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            router.get(
                route("admin.users"),
                { search: searchQuery },
                { preserveState: true }
            );
        }
    };

    const handleAddUser = () => {
        setSelectedUserType(currentTab);
        setFormData({
            userType: currentTab,
            status: "active",
            supervision_quota: currentTab === "lecturer" ? 5 : 0,
        });
        setIsAddDialogOpen(true);
    };

    const saveNewUser = () => {
        router.post(route("admin.users.store"), formData, {
            onSuccess: () => {
                toast.success(`${selectedUserType} added successfully`);
                setIsAddDialogOpen(false);
                setFormData({});
            },
            onError: (errors) => {
                console.error(errors);
                if (errors.email) toast.error(errors.email);
                else if (errors.nim) toast.error(errors.nim);
                else if (errors.nip) toast.error(errors.nip);
                else if (errors.supervision_quota)
                    toast.error(errors.supervision_quota);
                else toast.error("Failed to add user. Check inputs.");
            },
        });
    };

    const handleEditUser = (user, type) => {
        setSelectedUser(user);
        setSelectedUserType(type);
        setFormData({
            ...user,
            supervision_quota: user.supervision_quota || 0,
        });
        setIsEditDialogOpen(true);
    };

    const saveEditUser = () => {
        router.put(route("admin.users.update", selectedUser.id), formData, {
            onSuccess: () => {
                toast.success("User updated successfully");
                setIsEditDialogOpen(false);
                setSelectedUser(null);
                setFormData({});
            },
            onError: (errors) => {
                if (errors.email) toast.error(errors.email);
                else if (errors.nim) toast.error(errors.nim);
                else if (errors.nip) toast.error(errors.nip);
                else if (errors.supervision_quota)
                    toast.error(errors.supervision_quota);
                else toast.error("Failed to update user.");
            },
        });
    };

    const handleDeleteUser = (user, type) => {
        setSelectedUser(user);
        setSelectedUserType(type);
        setIsDeleteDialogOpen(true);
    };

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

    const handleToggleStatus = (user) => {
        setSelectedUser(user);
        setIsToggleStatusDialogOpen(true);
    };

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

    const getStatusBadge = (status) => {
        const isActive = status === "active";
        return (
            <Badge
                variant="outline"
                className={
                    isActive
                        ? "bg-green-50 text-green-700 border-green-300"
                        : "bg-red-50 text-red-700 border-red-300"
                }
            >
                {isActive ? "Active" : "Inactive"}
            </Badge>
        );
    };

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
                            const value = e.target.value.replace(/\D/g, "");
                            setFormData({ ...formData, nim: value });
                        }}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        placeholder="Enter full name"
                        value={formData.name || ""}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        required
                    />
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
                            const value = e.target.value.replace(/\D/g, "");
                            setFormData({ ...formData, nip: value });
                        }}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        placeholder="Enter full name"
                        value={formData.name || ""}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        required
                    />
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="supervision_quota">
                        Supervision Quota (Max Students)
                    </Label>
                    <Input
                        id="supervision_quota"
                        type="number"
                        min="0"
                        max="20"
                        placeholder="e.g., 8"
                        value={formData.supervision_quota || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                supervision_quota: e.target.value,
                            })
                        }
                        required
                    />
                    <p className="text-xs text-muted-foreground">
                        Required. Max 20.
                    </p>
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

                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle>User Accounts</CardTitle>
                                <CardDescription>
                                    View and manage all user accounts in the
                                    system
                                </CardDescription>
                            </div>
                            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto items-start md:items-center">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by Name or ID..."
                                        className="pl-9 w-[250px]"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        onKeyDown={handleSearch}
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
                                                    Students ({students.length})
                                                </span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="lecturer">
                                            <div className="flex items-center gap-2">
                                                <Award className="w-4 h-4" />
                                                <span>
                                                    Lecturers (
                                                    {lecturers.length})
                                                </span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Desktop Tabs */}
                            <TabsList className="hidden md:grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="student" className="gap-2">
                                    <GraduationCap className="w-4 h-4" />{" "}
                                    Students ({students.length})
                                </TabsTrigger>
                                <TabsTrigger value="lecturer" className="gap-2">
                                    <Award className="w-4 h-4" /> Lecturers (
                                    {lecturers.length})
                                </TabsTrigger>
                            </TabsList>

                            {/* Students Table */}
                            <TabsContent value="student">
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>NIM</TableHead>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Email</TableHead>
                                                    <TableHead>
                                                        Status
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        Actions
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {students.length > 0 ? (
                                                    students.map((student) => (
                                                        <TableRow
                                                            key={student.id}
                                                        >
                                                            <TableCell>
                                                                {student.nim}
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center gap-2">
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
                                                                {student.email}
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
                                                                            <UserCheck className="w-3 h-3 mr-1" />{" "}
                                                                            Active
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <UserX className="w-3 h-3 mr-1" />{" "}
                                                                            Inactive
                                                                        </>
                                                                    )}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handleToggleStatus(
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
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={5}
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
                            <TabsContent value="lecturer">
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>NIP</TableHead>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Email</TableHead>
                                                    <TableHead>
                                                        Status
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        Actions
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {lecturers.length > 0 ? (
                                                    lecturers.map(
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
                                                                                <UserCheck className="w-3 h-3 mr-1" />{" "}
                                                                                Active
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <UserX className="w-3 h-3 mr-1" />{" "}
                                                                                Inactive
                                                                            </>
                                                                        )}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center justify-end gap-2">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                handleToggleStatus(
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
                                                            colSpan={5}
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

                <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                >
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                Add New{" "}
                                {selectedUserType === "student"
                                    ? "Student"
                                    : "Lecturer"}
                            </DialogTitle>
                            <DialogDescription>
                                Create a new account. This will automatically
                                create a profile.
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

                <AlertDialog
                    open={isToggleStatusDialogOpen}
                    onOpenChange={setIsToggleStatusDialogOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                {selectedUser?.status === "active"
                                    ? "Deactivate User?"
                                    : "Activate User?"}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {selectedUser?.has_user_account
                                    ? `Are you sure you want to ${
                                          selectedUser.status === "active"
                                              ? "deactivate"
                                              : "activate"
                                      } this user?`
                                    : "This user does not have a login account yet. Do you want to toggle status anyway?"}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-blue-600"
                                onClick={() => {
                                    toggleUserStatus(selectedUser);
                                    setIsToggleStatusDialogOpen(false);
                                }}
                            >
                                {selectedUser?.status === "active"
                                    ? "Deactivate"
                                    : "Activate"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <Dialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                >
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                Edit{" "}
                                {selectedUserType === "student"
                                    ? "Student"
                                    : "Lecturer"}
                            </DialogTitle>
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

                <AlertDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the account for
                                <span className="font-medium text-foreground">
                                    {" "}
                                    {selectedUser?.name}
                                </span>
                                .
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-red-600"
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
