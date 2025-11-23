import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
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
    Edit,
    Trash2,
    Plus,
    GitBranch,
    UserCheck,
    CheckCircle2,
    Users,
    Eye
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

// TERIMA PROPS LENGKAP
export default function AdminRelationsPage({ 
    slRelations = [], 
    ssRelations = [], 
    studentsList = [], 
    lecturersList = [] 
}) {
    const [relationType, setRelationType] = useState("student-lecturer");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentTab, setCurrentTab] = useState("all");

    const [studentLecturerRelations, setStudentLecturerRelations] = useState(slRelations);
    const [studentStudentRelations, setStudentStudentRelations] = useState(ssRelations);

    useEffect(() => {
        setStudentLecturerRelations(slRelations);
        setStudentStudentRelations(ssRelations);
    }, [slRelations, ssRelations]);

    // CRUD States
    const [selectedRelation, setSelectedRelation] = useState(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    
    // Form Data State
    const [formData, setFormData] = useState({
        relationType: 'individual',
        student_id: '',
        lecturer_id: '',
        activity_type: 'Thesis',
        title: '',
        status: 'pending',
        activityTitle: '' // For edit mode
    });

    // --- FILTERING ---
    const getFilteredData = () => {
        const data = relationType === "student-lecturer" ? studentLecturerRelations : studentStudentRelations;
        
        return data.filter((item) => {
            const matchesTab = currentTab === "all" || 
                (item.activityType && item.activityType.toLowerCase().includes(currentTab.toLowerCase()));

            const q = searchQuery.toLowerCase();
            let matchesSearch = false;

            if (relationType === "student-lecturer") {
                matchesSearch =
                    (item.studentName || "").toLowerCase().includes(q) ||
                    (item.studentNim || "").includes(q) ||
                    (item.lecturerName || "").toLowerCase().includes(q) ||
                    (item.activityTitle || "").toLowerCase().includes(q);
            } else {
                matchesSearch =
                    (item.student1Name || "").toLowerCase().includes(q) ||
                    (item.student2Name || "").toLowerCase().includes(q) ||
                    (item.activityTitle || "").toLowerCase().includes(q);
            }

            return matchesTab && matchesSearch;
        });
    };

    const filteredData = getFilteredData();

    const stats = {
        total: studentLecturerRelations.length + studentStudentRelations.length,
        uniqueLecturers: new Set(studentLecturerRelations.map(r => r.lecturerId)).size,
        active: studentLecturerRelations.filter(r => r.status === 'active').length + 
                studentStudentRelations.filter(r => r.status === 'active').length,
        completed: studentLecturerRelations.filter(r => r.status === 'completed').length +
                   studentStudentRelations.filter(r => r.status === 'completed').length,
    };

    // --- HANDLERS ---
    const handleAddRelation = () => {
        setFormData({
            relationType: 'individual',
            student_id: '',
            lecturer_id: '',
            activity_type: 'Thesis',
            title: '',
            status: 'active'
        });
        setIsAddDialogOpen(true);
    };

    const handleEdit = (relation) => {
        setSelectedRelation(relation);
        setFormData({
            activityTitle: relation.activityTitle,
            status: relation.status
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
    const handleSaveCreate = () => {
        router.post(route('admin.relations.store'), formData, {
            onSuccess: () => {
                toast.success("Relation added successfully");
                setIsAddDialogOpen(false);
            },
            onError: () => toast.error("Failed to add relation. Check inputs."),
        });
    };

    const handleSaveUpdate = () => {
        router.put(route('admin.relations.update', selectedRelation.id), formData, {
            onSuccess: () => {
                toast.success("Relation updated successfully");
                setIsEditDialogOpen(false);
            },
            onError: () => toast.error("Failed to update relation"),
        });
    };

    const confirmDelete = () => {
        if (!selectedRelation) return;
        router.delete(route('admin.relations.destroy', selectedRelation.id), {
            onSuccess: () => {
                toast.success("Relation deleted successfully");
                setIsDeleteDialogOpen(false);
                setSelectedRelation(null);
            },
            onError: () => toast.error("Failed to delete relation"),
        });
    };

    // --- UI HELPERS ---
    const getStatusBadge = (status) => {
        const s = status ? status.toLowerCase() : 'unknown';
        let style = "bg-gray-100 text-gray-700 border-gray-300";
        if (['active', 'approved', 'ongoing'].includes(s)) style = "bg-blue-50 text-blue-700 border-blue-300";
        if (['pending', 'proposal'].includes(s)) style = "bg-orange-50 text-orange-700 border-orange-300";
        if (['completed', 'finished'].includes(s)) style = "bg-green-50 text-green-700 border-green-300";
        if (['terminated', 'rejected'].includes(s)) style = "bg-red-50 text-red-700 border-red-300";
        return <Badge variant="outline" className={style}>{status}</Badge>;
    };

    const getActivityBadge = (type) => {
        const t = type ? type.toLowerCase() : 'unknown';
        let style = "bg-gray-50 text-gray-700";
        if (t.includes('pkl')) style = "bg-purple-50 text-purple-700 border-purple-300";
        if (t.includes('thesis')) style = "bg-indigo-50 text-indigo-700 border-indigo-300";
        if (t.includes('competition')) style = "bg-amber-50 text-amber-700 border-amber-300";
        return <Badge variant="outline" className={style}>{type ? type.toUpperCase() : 'OTHER'}</Badge>;
    };

    // FORM RENDERER (DROPDOWN FOR STUDENT/LECTURER)
    const renderSLFormFields = () => (
        <div className="space-y-4 py-2">
            {/* Hanya Tampilkan Dropdown Nama di Form Create */}
            {isAddDialogOpen && (
                <>
                    <div className="space-y-2">
                        <Label>Relation Type</Label>
                        <Select value={formData.relationType} onValueChange={(v) => setFormData({...formData, relationType: v})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="individual">Individual (Thesis/PKL)</SelectItem>
                                <SelectItem value="team">Team (Competition)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Student (Leader)</Label>
                        <Select 
                            value={formData.student_id ? String(formData.student_id) : ""} 
                            onValueChange={(v) => setFormData({...formData, student_id: v})}
                        >
                            <SelectTrigger><SelectValue placeholder="Select Student" /></SelectTrigger>
                            <SelectContent>
                                {studentsList.length > 0 ? studentsList.map(s => (
                                    <SelectItem key={s.id} value={String(s.id)}>{s.name} ({s.nim})</SelectItem>
                                )) : <SelectItem value="0" disabled>No students available</SelectItem>}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Lecturer (Supervisor)</Label>
                        <Select 
                            value={formData.lecturer_id ? String(formData.lecturer_id) : ""} 
                            onValueChange={(v) => setFormData({...formData, lecturer_id: v})}
                        >
                            <SelectTrigger><SelectValue placeholder="Select Lecturer" /></SelectTrigger>
                            <SelectContent>
                                {lecturersList.length > 0 ? lecturersList.map(l => (
                                    <SelectItem key={l.id} value={String(l.id)}>{l.name}</SelectItem>
                                )) : <SelectItem value="0" disabled>No lecturers available</SelectItem>}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Activity Type</Label>
                        <Select value={formData.activity_type} onValueChange={(v) => setFormData({...formData, activity_type: v})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Thesis">Thesis</SelectItem>
                                <SelectItem value="PKL">PKL (Internship)</SelectItem>
                                <SelectItem value="Competition">Competition</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Activity Title</Label>
                        <Input 
                            placeholder="e.g. Research Project" 
                            value={formData.title || ""} 
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                </>
            )}

            {/* Field untuk Edit Mode */}
            {isEditDialogOpen && (
                <div className="space-y-2">
                    <Label>Activity Title</Label>
                    <Input 
                        value={formData.activityTitle || ""} 
                        onChange={(e) => setFormData({...formData, activityTitle: e.target.value})}
                    />
                </div>
            )}

            {/* Status bisa diedit baik di Create maupun Edit */}
            <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status || "pending"} onValueChange={(v) => setFormData({...formData, status: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );

    return (
        <MainLayout>
            <Head title="Admin Relations" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Relations Management</h1>
                        <p className="text-muted-foreground">Manage student-lecturer and student-student relations</p>
                    </div>
                    <Button onClick={handleAddRelation} className="gap-2"><Plus className="w-4 h-4"/> Add Relation</Button>
                </div>

                {/* Stats Display */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Relations</CardTitle><GitBranch className="w-4 h-4 text-muted-foreground"/></CardHeader><CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent></Card>
                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Active Supervisors</CardTitle><UserCheck className="w-4 h-4 text-muted-foreground"/></CardHeader><CardContent><div className="text-2xl font-bold">{stats.uniqueLecturers}</div></CardContent></Card>
                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Active Relations</CardTitle><CheckCircle2 className="w-4 h-4 text-muted-foreground"/></CardHeader><CardContent><div className="text-2xl font-bold">{stats.active}</div></CardContent></Card>
                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Completed</CardTitle><CheckCircle2 className="w-4 h-4 text-muted-foreground"/></CardHeader><CardContent><div className="text-2xl font-bold">{stats.completed}</div></CardContent></Card>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex gap-2">
                                <Button 
                                    variant={relationType === "student-lecturer" ? "default" : "outline"}
                                    onClick={() => { setRelationType("student-lecturer"); setCurrentTab("all"); }}
                                >
                                    <UserCheck className="w-4 h-4 mr-2"/> Student-Lecturer
                                </Button>
                                <Button 
                                    variant={relationType === "student-student" ? "default" : "outline"}
                                    onClick={() => { setRelationType("student-student"); setCurrentTab("all"); }}
                                >
                                    <Users className="w-4 h-4 mr-2"/> Student-Student
                                </Button>
                            </div>
                            <Input 
                                placeholder="Search..." 
                                className="w-[250px]" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={currentTab} onValueChange={setCurrentTab}>
                            <TabsList className="mb-4">
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="pkl">PKL</TabsTrigger>
                                <TabsTrigger value="thesis">Thesis</TabsTrigger>
                                <TabsTrigger value="competition">Competition</TabsTrigger>
                            </TabsList>

                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            {relationType === "student-lecturer" ? (
                                                <>
                                                    <TableHead>Student</TableHead>
                                                    <TableHead>Lecturer</TableHead>
                                                    <TableHead>Activity</TableHead>
                                                    <TableHead>Status</TableHead>
                                                </>
                                            ) : (
                                                <>
                                                    <TableHead>Activity</TableHead>
                                                    <TableHead>Leader</TableHead>
                                                    <TableHead>Member</TableHead>
                                                    <TableHead>Status</TableHead>
                                                </>
                                            )}
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredData.length > 0 ? filteredData.map((rel) => (
                                            <TableRow key={rel.id}>
                                                {relationType === "student-lecturer" ? (
                                                    <>
                                                        <TableCell>
                                                            <div className="font-medium">{rel.studentName}</div>
                                                            <div className="text-xs text-muted-foreground">{rel.studentNim}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="font-medium">{rel.lecturerName}</div>
                                                            <div className="text-xs text-muted-foreground">{rel.lecturerNip}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {getActivityBadge(rel.activityType)}
                                                            <p className="text-xs mt-1 line-clamp-1">{rel.activityTitle}</p>
                                                        </TableCell>
                                                        <TableCell>{getStatusBadge(rel.status)}</TableCell>
                                                    </>
                                                ) : (
                                                    <>
                                                        <TableCell>
                                                            <div className="font-medium">{rel.activityTitle}</div>
                                                            {getActivityBadge(rel.activityType)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="font-medium">{rel.student1Name}</div>
                                                            <div className="text-xs text-muted-foreground">{rel.student1Nim}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="font-medium">{rel.student2Name}</div>
                                                        </TableCell>
                                                        <TableCell>{getStatusBadge(rel.status)}</TableCell>
                                                    </>
                                                )}
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button variant="ghost" size="icon" onClick={() => handleViewDetails(rel)}><Eye className="w-4 h-4"/></Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(rel)}><Edit className="w-4 h-4"/></Button>
                                                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(rel)}><Trash2 className="w-4 h-4"/></Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No data found.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* DIALOGS */}
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Add New Relation</DialogTitle></DialogHeader>
                        {renderSLFormFields()}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSaveCreate}>Create</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Edit Relation</DialogTitle></DialogHeader>
                        {renderSLFormFields()}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSaveUpdate}>Update</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* DELETE & DETAILS DIALOGS (Tetap sama) */}
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete} className="bg-red-500">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Relation Details</DialogTitle></DialogHeader>
                        {selectedRelation && (
                            <div className="space-y-3 text-sm">
                                <div className="grid grid-cols-3 gap-2">
                                    <span className="font-semibold">Activity:</span>
                                    <span className="col-span-2">{selectedRelation.activityTitle}</span>
                                    <span className="font-semibold">Type:</span>
                                    <span className="col-span-2">{selectedRelation.activityType}</span>
                                    <span className="font-semibold">Status:</span>
                                    <span className="col-span-2">{getStatusBadge(selectedRelation.status)}</span>
                                    <span className="font-semibold">Student:</span>
                                    <span className="col-span-2">{selectedRelation.studentName || selectedRelation.student1Name}</span>
                                    <span className="font-semibold">Lecturer:</span>
                                    <span className="col-span-2">{selectedRelation.lecturerName || selectedRelation.supervisorName || '-'}</span>
                                </div>
                            </div>
                        )}
                        <DialogFooter><Button onClick={() => setIsDetailDialogOpen(false)}>Close</Button></DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
}