import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import {
    Card,
    CardContent,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/Components/ui/tabs";
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
    GraduationCap,
    Award,
    Power, 
} from "lucide-react";
import { toast } from "sonner";

export default function UserManagementPage({ students: propStudents = [], lecturers: propLecturers = [], filters = {} }) {
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
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
        if (e.key === 'Enter') {
            router.get(route('admin.users'), { search: searchQuery }, { preserveState: true });
        }
    };

    const handleAddUser = () => {
        setSelectedUserType(currentTab);
        setFormData({
            userType: currentTab,
            status: 'active',
            supervision_quota: currentTab === 'lecturer' ? 5 : 0 
        });
        setIsAddDialogOpen(true);
    };

    const saveNewUser = () => {
        router.post(route('admin.users.store'), formData, {
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
                else if (errors.supervision_quota) toast.error(errors.supervision_quota);
                else toast.error("Failed to add user. Check inputs.");
            }
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
        router.put(route('admin.users.update', selectedUser.id), formData, {
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
                else if (errors.supervision_quota) toast.error(errors.supervision_quota);
                else toast.error("Failed to update user.");
            }
        });
    };

    const handleDeleteUser = (user, type) => {
        setSelectedUser(user);
        setSelectedUserType(type);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedUser) return;
        router.delete(route('admin.users.destroy', selectedUser.id), {
            onSuccess: () => {
                toast.success("Account deleted successfully");
                setIsDeleteDialogOpen(false);
                setSelectedUser(null);
            },
            onError: () => toast.error("Failed to delete user")
        });
    };

    const handleToggleStatus = (user) => {
        const action = user.status === 'active' ? 'deactivate' : 'activate';
        if (!user.has_user_account) {
             if (confirm(`This user does not have a login account yet. Do you want to toggle status?`)) {
             } else {
                 return;
             }
        } else {
             if (!confirm(`Are you sure you want to ${action} this user?`)) return;
        }

        router.put(route('admin.users.toggle-status', user.id), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success(`Status updated`),
            onError: () => toast.error("Failed to update status")
        });
    };

    const getStatusBadge = (status) => {
        const isActive = status === 'active';
        return (
            <Badge variant="outline" className={isActive ? "bg-green-50 text-green-700 border-green-300" : "bg-red-50 text-red-700 border-red-300"}>
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
                            const value = e.target.value.replace(/\D/g, '');
                            setFormData({ ...formData, nim: value });
                        }} 
                        required 
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter full name" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="student@university.ac.id" value={formData.email || ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
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
                            const value = e.target.value.replace(/\D/g, '');
                            setFormData({ ...formData, nip: value });
                        }} 
                        required 
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter full name" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="lecturer@university.ac.id" value={formData.email || ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="supervision_quota">Supervision Quota (Max Students)</Label>
                    <Input 
                        id="supervision_quota" 
                        type="number" 
                        min="0"
                        max="20"
                        placeholder="e.g., 8" 
                        value={formData.supervision_quota || ""} 
                        onChange={(e) => setFormData({ ...formData, supervision_quota: e.target.value })} 
                        required 
                    />
                    <p className="text-xs text-muted-foreground">Required. Max 20.</p>
                </div>
            </div>
        </>
    );

    return (
        <MainLayout>
            <Head title="User Management" />
            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
                        <p className="text-sm text-muted-foreground">Manage student and lecturer accounts</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by Name or ID..." 
                                className="pl-9 w-[250px]" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>
                        <Button onClick={handleAddUser} className="gap-2">
                            <Plus className="w-4 h-4" /> Add User
                        </Button>
                    </div>
                </div>

                <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="student" className="gap-2"><GraduationCap className="w-4 h-4" /> Students ({students.length})</TabsTrigger>
                        <TabsTrigger value="lecturer" className="gap-2"><Award className="w-4 h-4" /> Lecturers ({lecturers.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="student">
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>NIM</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {students.length > 0 ? (
                                            students.map((student) => (
                                                <TableRow key={student.id}>
                                                    <TableCell>{student.nim}</TableCell>
                                                    <TableCell className="font-medium">{student.name}</TableCell> 
                                                    <TableCell className="text-muted-foreground">{student.email}</TableCell>
                                                    <TableCell>{getStatusBadge(student.status)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="ghost" size="icon" onClick={() => handleEditUser(student, "student")}>
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className={student.status === 'active' ? "text-orange-500 hover:text-orange-600" : "text-green-500 hover:text-green-600"}
                                                                onClick={() => handleToggleStatus(student)}
                                                                title={student.status === 'active' ? "Deactivate User" : "Activate User"}
                                                            >
                                                                <Power className="w-4 h-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteUser(student, "student")}>
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No students found.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="lecturer">
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>NIP</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Quota</TableHead> 
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {lecturers.length > 0 ? (
                                            lecturers.map((lecturer) => (
                                                <TableRow key={lecturer.id}>
                                                    <TableCell>{lecturer.nip}</TableCell>
                                                    <TableCell className="font-medium">{lecturer.name}</TableCell>
                                                    <TableCell className="text-muted-foreground">{lecturer.email}</TableCell>
                                                    <TableCell className="text-center">{lecturer.supervision_quota}</TableCell> 
                                                    <TableCell>{getStatusBadge(lecturer.status)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="ghost" size="icon" onClick={() => handleEditUser(lecturer, "lecturer")}>
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className={lecturer.status === 'active' ? "text-orange-500 hover:text-orange-600" : "text-green-500 hover:text-green-600"}
                                                                onClick={() => handleToggleStatus(lecturer)}
                                                                title={lecturer.status === 'active' ? "Deactivate User" : "Activate User"}
                                                            >
                                                                <Power className="w-4 h-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteUser(lecturer, "lecturer")}>
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No lecturers found.</TableCell> 
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add New {selectedUserType === "student" ? "Student" : "Lecturer"}</DialogTitle>
                            <DialogDescription>Create a new account. This will automatically create a profile.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            {selectedUserType === "student" ? renderStudentFormFields() : renderLecturerFormFields()}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                            <Button onClick={saveNewUser}>Create User</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Edit {selectedUserType === "student" ? "Student" : "Lecturer"}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            {selectedUserType === "student" ? renderStudentFormFields() : renderLecturerFormFields()}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                            <Button onClick={saveEditUser}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the account for 
                                <span className="font-medium text-foreground"> {selectedUser?.name}</span>.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete} className="bg-red-600">Delete Account</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </MainLayout>
    );
}