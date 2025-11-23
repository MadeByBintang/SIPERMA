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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    GraduationCap,
    Award,
    Power, // Icon untuk toggle status
} from "lucide-react";
import { toast } from "sonner";

export default function UserManagementPage({ students: propStudents = [], lecturers: propLecturers = [], filters = {} }) {
    // State Pencarian
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    
    // State Dialog
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    
    // State Data Aktif
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserType, setSelectedUserType] = useState("student");
    const [currentTab, setCurrentTab] = useState("student");

    // Form state
    const [formData, setFormData] = useState({});

    // STATE DATA LOKAL
    const [students, setStudents] = useState(propStudents);
    const [lecturers, setLecturers] = useState(propLecturers);

    useEffect(() => {
        setStudents(propStudents);
        setLecturers(propLecturers);
    }, [propStudents, propLecturers]);

    // --- HANDLERS ---

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            router.get(route('admin.users'), { search: searchQuery }, { preserveState: true });
        }
    };

    // ADD USER
    const handleAddUser = () => {
        setSelectedUserType(currentTab);
        setFormData({
            userType: currentTab,
            status: 'active'
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
                toast.error("Failed to add user. Check input fields.");
            }
        });
    };

    // EDIT USER
    const handleEditUser = (user, type) => {
        setSelectedUser(user);
        setSelectedUserType(type);
        setFormData({
            ...user,
            expertise: Array.isArray(user.expertise) ? user.expertise.join(', ') : user.expertise
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
            onError: () => toast.error("Failed to update user")
        });
    };

    // DELETE USER
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

    // TOGGLE STATUS (FIXED LOGIC)
    const handleToggleStatus = (user) => {
        const action = user.status === 'active' ? 'deactivate' : 'activate';
        
        if (confirm(`Are you sure you want to ${action} this user?`)) {
            router.put(route('admin.users.toggle-status', user.id), {}, {
                preserveScroll: true,
                onSuccess: () => toast.success(`User status updated`),
                onError: () => toast.error("Failed to update status")
            });
        }
    };

    // --- RENDER HELPER ---
    const getStatusBadge = (status) => {
        const isActive = status === 'active';
        return (
            <Badge variant="outline" className={isActive ? "bg-green-50 text-green-700 border-green-300" : "bg-red-50 text-red-700 border-red-300"}>
                {isActive ? "Active" : "Inactive"}
            </Badge>
        );
    };

    // Form Fields (Sama seperti sebelumnya)
    const renderStudentFormFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="nim">NIM</Label>
                    <Input id="nim" placeholder="e.g., 2021001234" value={formData.nim || ""} onChange={(e) => setFormData({ ...formData, nim: e.target.value })} required />
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
                {/*<div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="+62 812-3456-7890" value={formData.phone || ""} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>*/}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="major">Major</Label>
                    <Select value={formData.major || ""} onValueChange={(value) => setFormData({ ...formData, major: value })}>
                        <SelectTrigger id="major"><SelectValue placeholder="Select major" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                            <SelectItem value="Information Systems">Information Systems</SelectItem>
                            <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                            <SelectItem value="Information Technology">Information Technology</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="year">Enrollment Year</Label>
                    <Select value={formData.year || ""} onValueChange={(value) => setFormData({ ...formData, year: value })}>
                        <SelectTrigger id="year"><SelectValue placeholder="Select year" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2021">2021</SelectItem>
                            <SelectItem value="2022">2022</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                            <SelectItem value="2024">2024</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {/*<div className="space-y-2">
                <Label htmlFor="gpa">GPA</Label>
                <Input id="gpa" type="number" step="0.01" min="0" max="4" value={formData.gpa || ""} onChange={(e) => setFormData({ ...formData, gpa: e.target.value })} />
            </div>*/}
        </>
    );

    const renderLecturerFormFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="nip">NIP</Label>
                    <Input id="nip" placeholder="e.g., 198501012010011001" value={formData.nip || ""} onChange={(e) => setFormData({ ...formData, nip: e.target.value })} required />
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
                {/*<div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="+62 821-1234-5678" value={formData.phone || ""} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>*/}
            </div>
            <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={formData.department || ""} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                    <SelectTrigger id="department"><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Information Systems">Information Systems</SelectItem>
                        <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                        <SelectItem value="Information Technology">Information Technology</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="expertise">Areas of Expertise</Label>
                <Input id="expertise" placeholder="e.g., Machine Learning, AI (comma separated)" value={formData.expertise || ""} onChange={(e) => setFormData({ ...formData, expertise: e.target.value })} />
                <p className="text-xs text-muted-foreground">Enter multiple areas separated by commas</p>
            </div>
        </>
    );

    return (
        <MainLayout>
            <Head title="User Management" />
            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h1>User Management</h1>
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

                    {/* STUDENTS TABLE */}
                    <TabsContent value="student">
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>NIM</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Major</TableHead>
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
                                                    <TableCell>{student.major}</TableCell>
                                                    <TableCell>{getStatusBadge(student.status)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            {/* Edit Button */}
                                                            <Button variant="ghost" size="icon" onClick={() => handleEditUser(student, "student")}>
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            
                                                            {/* Toggle Status Button */}
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className={student.status === 'active' ? "text-orange-500 hover:text-orange-600" : "text-green-500 hover:text-green-600"}
                                                                onClick={() => handleToggleStatus(student)}
                                                                title={student.status === 'active' ? "Deactivate User" : "Activate User"}
                                                            >
                                                                <Power className="w-4 h-4" />
                                                            </Button>

                                                            {/* Delete Button */}
                                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteUser(student, "student")}>
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No students found.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* LECTURERS TABLE */}
                    <TabsContent value="lecturer">
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>NIP</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Department</TableHead>
                                            <TableHead>Expertise</TableHead>
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
                                                    <TableCell>{lecturer.department}</TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-1 flex-wrap max-w-[200px]">
                                                            {lecturer.expertise.slice(0, 2).map((exp, idx) => (
                                                                <Badge key={idx} variant="outline" className="text-xs">{exp}</Badge>
                                                            ))}
                                                            {lecturer.expertise.length > 2 && <span className="text-xs text-muted-foreground">+{lecturer.expertise.length - 2}</span>}
                                                        </div>
                                                    </TableCell>
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

                {/* Add/Edit Dialogs & Alert Dialog tetep sama seperti sebelumnya, tidak perlu diubah */}
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