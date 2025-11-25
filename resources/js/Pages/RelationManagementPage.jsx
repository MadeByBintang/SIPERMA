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
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Search,
    Eye,
    Edit,
    Trash2,
    Plus,
    GitBranch,
    UserCheck,
    CheckCircle2,
    Users,
    Download,
    BookOpen,
    Calendar,
    User,
    Info,
} from "lucide-react";
import { toast } from "sonner";
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
import { Alert, AlertDescription, AlertTitle } from "../Components/ui/alert";

export default function RelationManagementPage({
    studentLecturerRelations = [],
    studentStudentRelations = [],
    studentsList = [], // Terima data dropdown
    lecturersList = [], // Terima data dropdown
}) {
    const [relationType, setRelationType] = useState("student-lecturer");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentTab, setCurrentTab] = useState("all");

    // State Data (Sync dengan props)
    const [slData, setSlData] = useState(studentLecturerRelations);
    const [ssData, setSsData] = useState(studentStudentRelations);

    useEffect(() => {
        setSlData(studentLecturerRelations);
        setSsData(studentStudentRelations);
    }, [studentLecturerRelations, studentStudentRelations]);

    // CRUD States
    const [selectedRelation, setSelectedRelation] = useState(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({});

    // --- HANDLERS CRUD ---

    const handleAdd = () => {
        setFormData({
            relationType: relationType, // Default sesuai tab aktif
            student_id: "",
            lecturer_id: "",
            activity_type: "Thesis",
            title: "",
            status: "active",
        });
        setIsAddDialogOpen(true);
    };

    const handleEdit = (relation) => {
        setSelectedRelation(relation);
        setFormData({
            title: relation.thesisTitle || relation.activityName,
            status: relation.status,
        });
        setIsEditDialogOpen(true);
    };

    const handleDelete = (relation) => {
        setSelectedRelation(relation);
        setIsDeleteDialogOpen(true);
    };

    const handleViewDetails = (relation) => {
        setSelectedRelation(relation);
        setIsDetailDialogOpen(true);
    };

    // --- DATABASE ACTIONS ---

    const saveCreate = () => {
        router.post(route("relations.store"), formData, {
            // Pastikan route ini ada di web.php (misal: /relations)
            onSuccess: () => {
                toast.success("Relation created successfully");
                setIsAddDialogOpen(false);
            },
            onError: () => toast.error("Failed to create. Check inputs."),
        });
    };

    const saveUpdate = () => {
        router.put(route("relations.update", selectedRelation.id), formData, {
            // Pastikan route ini ada
            onSuccess: () => {
                toast.success("Relation updated successfully");
                setIsEditDialogOpen(false);
            },
            onError: () => toast.error("Failed to update."),
        });
    };

    const confirmDelete = () => {
        if (!selectedRelation) return;
        router.delete(route("relations.destroy", selectedRelation.id), {
            // Pastikan route ini ada
            onSuccess: () => {
                toast.success("Relation deleted successfully");
                setIsDeleteDialogOpen(false);
            },
            onError: () => toast.error("Failed to delete."),
        });
    };

    // --- RENDER HELPERS ---

    const getFilteredData = () => {
        const data = relationType === "student-lecturer" ? slData : ssData;
        return data.filter((item) => {
            const q = searchQuery.toLowerCase();
            const type = item.activityType
                ? item.activityType.toLowerCase()
                : "";

            // Filter Tab
            if (currentTab !== "all" && !type.includes(currentTab))
                return false;

            // Filter Search
            if (relationType === "student-lecturer") {
                return (
                    item.studentName?.toLowerCase().includes(q) ||
                    item.supervisorName?.toLowerCase().includes(q) ||
                    item.thesisTitle?.toLowerCase().includes(q)
                );
            } else {
                return item.activityName?.toLowerCase().includes(q);
            }
        });
    };
    const filteredData = getFilteredData();

    const getStatusBadge = (status) => {
        let style = "bg-gray-100";
        if (status === "active") style = "bg-blue-100 text-blue-800";
        if (status === "pending") style = "bg-orange-100 text-orange-800";
        if (status === "completed") style = "bg-green-100 text-green-800";
        return (
            <Badge className={style} variant="outline">
                {status}
            </Badge>
        );
    };

    const getActivityBadge = (type) => {
        return <Badge variant="outline">{type}</Badge>;
    };

    // FORM INPUTS
    const renderFormFields = (isEdit = false) => (
        <div className="space-y-4 py-2">
            {/* Tampilkan Pilihan User Hanya Saat CREATE */}
            {!isEdit && (
                <>
                    <div className="space-y-2">
                        <Label>Relation Type</Label>
                        <Select
                            value={formData.relationType}
                            onValueChange={(v) =>
                                setFormData({ ...formData, relationType: v })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="student-lecturer">
                                    Supervision (Student-Lecturer)
                                </SelectItem>
                                <SelectItem value="student-student">
                                    Team (Student-Student)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Activity Type</Label>
                        <Select
                            value={formData.activity_type}
                            onValueChange={(v) =>
                                setFormData({ ...formData, activity_type: v })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Thesis">Thesis</SelectItem>
                                <SelectItem value="PKL">PKL</SelectItem>
                                <SelectItem value="Competition">
                                    Competition
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Student (Leader)</Label>
                        <Select
                            onValueChange={(v) =>
                                setFormData({ ...formData, student_id: v })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Student" />
                            </SelectTrigger>
                            <SelectContent>
                                {studentsList.map((s) => (
                                    <SelectItem key={s.id} value={String(s.id)}>
                                        {s.name} ({s.nim})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Supervisor (Lecturer)</Label>
                        <Select
                            onValueChange={(v) =>
                                setFormData({ ...formData, lecturer_id: v })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Lecturer" />
                            </SelectTrigger>
                            <SelectContent>
                                {lecturersList.map((l) => (
                                    <SelectItem key={l.id} value={String(l.id)}>
                                        {l.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </>
            )}

            <div className="space-y-2">
                <Label>Activity Title</Label>
                <Input
                    value={formData.title || ""}
                    onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                    }
                />
            </div>

            <div className="space-y-2">
                <Label>Status</Label>
                <Select
                    value={formData.status || "pending"}
                    onValueChange={(v) =>
                        setFormData({ ...formData, status: v })
                    }
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );

    return (
        <MainLayout>
            <Head title="My Relations" />
            <div className="space-y-6">
                {/* Info Alert */}
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>System-Managed Relations</AlertTitle>
                    <AlertDescription>
                        All relations displayed here are automatically managed
                        by the system based on registrations and approvals.
                        Relations cannot be manually edited or deleted as they
                        are linked to the database records.
                    </AlertDescription>
                </Alert>
                <Card>
                    <CardHeader>
                        <CardTitle>Relation Management</CardTitle>
                        <CardDescription>
                            Manage your activity relations.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <Select
                                    value={relationType}
                                    onValueChange={(value) => {
                                        setRelationType(value);
                                        setCurrentTab("all");
                                    }}
                                >
                                    <SelectTrigger className="w-full md:w-64">
                                        <SelectValue placeholder="Select relation type" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="student-lecturer">
                                            <div className="flex items-center gap-2">
                                                <UserCheck className="w-4 h-4" />
                                                Supervision
                                            </div>
                                        </SelectItem>

                                        <SelectItem value="student-student">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                Team
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Input
                                    placeholder="Search..."
                                    className="w-[250px]"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <Button onClick={handleAdd} className="gap-2">
                                    <Plus className="w-4 h-4" /> Add Relation
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Filter Tabs */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {relationType === "student-lecturer"
                                ? "Student–Lecturer Relations"
                                : "Student–Student Relations"}
                        </CardTitle>
                        <CardDescription>
                            Manage your activity relations.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={currentTab} onValueChange={setCurrentTab}>
                            {/* Mobile Dropdown */}
                            <div className="md:hidden mb-4">
                                <Select
                                    value={currentTab}
                                    onValueChange={setCurrentTab}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Filter" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="pkl">PKL</SelectItem>

                                        {/* Thesis hanya muncul jika relasinya student-lecturer */}
                                        {relationType ===
                                            "student-lecturer" && (
                                            <SelectItem value="thesis">
                                                Thesis
                                            </SelectItem>
                                        )}

                                        <SelectItem value="competition">
                                            Competition
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Desktop Tabs */}
                            <TabsList
                                className={`hidden md:grid w-full mb-4 
            ${
                relationType === "student-lecturer"
                    ? "grid-cols-4" // ada Thesis → 4 kolom
                    : "grid-cols-3" // tidak ada Thesis → 3 kolom
            }`}
                            >
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="pkl">PKL</TabsTrigger>

                                {relationType === "student-lecturer" && (
                                    <TabsTrigger value="thesis">
                                        Thesis
                                    </TabsTrigger>
                                )}

                                <TabsTrigger value="competition">
                                    Competition
                                </TabsTrigger>
                            </TabsList>

                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            {relationType ===
                                            "student-lecturer" ? (
                                                <>
                                                    <TableHead>
                                                        Student
                                                    </TableHead>
                                                    <TableHead>
                                                        Supervisor
                                                    </TableHead>
                                                    <TableHead>
                                                        Activity
                                                    </TableHead>
                                                    <TableHead>
                                                        Status
                                                    </TableHead>
                                                </>
                                            ) : (
                                                <>
                                                    <TableHead>
                                                        Team Name
                                                    </TableHead>
                                                    <TableHead>
                                                        Supervisor
                                                    </TableHead>
                                                    <TableHead>
                                                        Status
                                                    </TableHead>
                                                </>
                                            )}

                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredData.length > 0 ? (
                                            filteredData.map((rel) => (
                                                <TableRow key={rel.id}>
                                                    {relationType ===
                                                    "student-lecturer" ? (
                                                        <>
                                                            <TableCell>
                                                                <div className="font-medium">
                                                                    {
                                                                        rel.studentName
                                                                    }
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {
                                                                        rel.studentNIM
                                                                    }
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    rel.supervisorName
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {getActivityBadge(
                                                                    rel.activityType
                                                                )}
                                                                <p className="text-xs mt-1">
                                                                    {
                                                                        rel.thesisTitle
                                                                    }
                                                                </p>
                                                            </TableCell>
                                                            <TableCell>
                                                                {getStatusBadge(
                                                                    rel.status
                                                                )}
                                                            </TableCell>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <TableCell>
                                                                <div className="font-medium">
                                                                    {
                                                                        rel.activityName
                                                                    }
                                                                </div>
                                                                {getActivityBadge(
                                                                    rel.activityType
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    rel.supervisorName
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {getStatusBadge(
                                                                    rel.status
                                                                )}
                                                            </TableCell>
                                                        </>
                                                    )}
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() =>
                                                                    handleViewDetails(
                                                                        rel
                                                                    )
                                                                }
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        rel
                                                                    )
                                                                }
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-red-500"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        rel
                                                                    )
                                                                }
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
                                                    No data found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* DIALOGS */}
                <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Relation</DialogTitle>
                        </DialogHeader>
                        {renderFormFields(false)}
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsAddDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={saveCreate}>Create</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Relation</DialogTitle>
                        </DialogHeader>
                        {renderFormFields(true)}
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={saveUpdate}>Update</Button>
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
                                This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-red-500"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Detail Dialog */}
                <Dialog
                    open={isDetailDialogOpen}
                    onOpenChange={setIsDetailDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Details</DialogTitle>
                        </DialogHeader>
                        {selectedRelation && (
                            <div className="space-y-2">
                                <p>
                                    <strong>Activity:</strong>{" "}
                                    {selectedRelation.thesisTitle ||
                                        selectedRelation.activityName}
                                </p>
                                <p>
                                    <strong>Status:</strong>{" "}
                                    {selectedRelation.status}
                                </p>
                                <p>
                                    <strong>Start Date:</strong>{" "}
                                    {selectedRelation.startDate}
                                </p>
                            </div>
                        )}
                        <DialogFooter>
                            <Button
                                onClick={() => setIsDetailDialogOpen(false)}
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
}
