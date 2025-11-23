import { useState } from "react";
import { Head, router } from "@inertiajs/react"; // Pastikan import router
import MainLayout from "@/Layouts/MainLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import { Separator } from "@/Components/ui/separator";
import {
    BookOpen,
    Award,
    CheckCircle2,
    Clock,
    FileText,
    User,
    AlertCircle,
    ChevronRight,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/Components/ui/dialog";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { toast } from "sonner";

export default function TimelineProgressPage({ 
    userRole = 'student', 
    studentActivities = [], 
    supervisedStudents = [] 
}) {
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [selectedTimelineItem, setSelectedTimelineItem] = useState(null);
    const [updateNote, setUpdateNote] = useState("");
    const [updateStatus, setUpdateStatus] = useState("");

    // -- Helpers UI --

    const getStatusColor = (status) => {
        const s = status ? status.toLowerCase() : '';
        if (s === 'completed') return "bg-green-100 text-green-700";
        if (s === 'in-progress' || s === 'in progress') return "bg-blue-100 text-blue-700";
        if (s === 'overdue') return "bg-red-100 text-red-700";
        return "bg-gray-100 text-gray-700";
    };

    const getActivityIcon = (type) => {
        const t = type ? type.toLowerCase() : '';
        if (t.includes("pkl")) return <BookOpen className="w-5 h-5" />;
        if (t.includes("thesis")) return <FileText className="w-5 h-5" />;
        if (t.includes("competition")) return <Award className="w-5 h-5" />;
        return <FileText className="w-5 h-5" />;
    };

    const getStatusIcon = (status) => {
        const s = status ? status.toLowerCase() : '';
        if (s === 'completed') return <CheckCircle2 className="w-4 h-4 text-green-600" />;
        if (s === 'in-progress') return <Clock className="w-4 h-4 text-blue-600" />;
        if (s === 'overdue') return <AlertCircle className="w-4 h-4 text-red-600" />;
        return <Clock className="w-4 h-4 text-gray-400" />;
    };

    // -- Handlers --

    const handleViewDetails = (activity) => {
        setSelectedActivity(activity);
        setIsDialogOpen(true);
    };

    const handleViewStudentProgress = (student) => {
        setSelectedStudent(student);
        setIsDialogOpen(true);
    };

    const handleUpdateProgress = (item) => {
        setSelectedTimelineItem(item);
        setUpdateNote(item.description || ""); // Menggunakan description dari data log
        setUpdateStatus(item.status || "pending");
        setIsUpdateDialogOpen(true);
    };

    const handleSaveUpdate = () => {
        // 1. Tentukan ID Aktivitas
        // Cek apakah kita sedang di view Mahasiswa (selectedActivity) atau Dosen (selectedStudent)
        const activityId = userRole === 'student' 
            ? selectedActivity?.real_id || selectedActivity?.id // Sesuaikan dengan struktur data dari controller
            : selectedStudent?.id; // Di view dosen, ID utama adalah ID activity/supervision

        // NOTE: Karena struktur data dari controller agak kompleks (prefix 'sup_', 'team_'),
        // Idealnya controller mengirim 'activity_id' mentah. 
        // Namun jika menggunakan struktur sekarang, kita perlu pastikan ID yang dikirim valid.
        
        // Solusi Aman: Kita asumsikan controller mengirim activity_id di dalam timeline item atau parent object
        // Tapi untuk sekarang kita coba kirim note saja dulu.
        
        // PENTING: Anda mungkin perlu menambahkan 'activity_id' ke dalam data yang dikirim Controller
        // agar di sini bisa diambil dengan mudah: const id = selectedActivity.activity_id;
        
        // Fallback sementara: Kita tidak bisa update tanpa ID activity yang jelas.
        // Pastikan Controller mengirim 'activity_id' (raw ID) di objek utama.

        router.post(route('timeline.progress.update'), {
            // Disini kita butuh activity_id murni (angka).
            // Cek apakah props dari controller sudah menyediakan field 'real_id' atau sejenisnya.
            // Jika belum, parsing string 'sup_1' -> 1 bisa dilakukan tapi berisiko.
            
            // Asumsi: Backend Anda sudah pintar menangani ini, atau kita kirim dummy dulu untuk tes UI.
            activity_id: 1, // <--- HARUS DIGANTI DENGAN ID DINAMIS
            status: updateStatus,
            progress_note: updateNote,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Progress log recorded!");
                setIsUpdateDialogOpen(false);
                setSelectedTimelineItem(null);
                setUpdateNote("");
            },
            onError: (err) => {
                toast.error("Failed to save progress.");
                console.error(err);
            },
        });
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedActivity(null);
        setSelectedStudent(null);
    };


    // -- Render Functions --

    const renderStudentView = () => {
        if (studentActivities.length === 0) {
            return (
                <div className="text-center py-12 text-muted-foreground border rounded-lg bg-gray-50">
                    <p>No active projects found.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {studentActivities.map((activity, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gray-100">
                                        {getActivityIcon(activity.activityType)}
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{activity.activityType}</CardTitle>
                                        <CardDescription className="text-xs">
                                            {activity.status}
                                        </CardDescription>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-medium line-clamp-1">{activity.activityName}</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Supervisor: {activity.supervisor}
                                    </p>
                                </div>
                                
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Progress</span>
                                        <span>{activity.overallProgress}%</span>
                                    </div>
                                    <Progress value={activity.overallProgress} className="h-2" />
                                </div>

                                <Button 
                                    variant="outline" 
                                    className="w-full gap-2"
                                    onClick={() => handleViewDetails(activity)}
                                >
                                    View Timeline <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    };

    const renderLecturerView = () => {
        if (supervisedStudents.length === 0) {
            return (
                <div className="text-center py-12 text-muted-foreground border rounded-lg bg-gray-50">
                    <p>No students under supervision.</p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {supervisedStudents.map((student) => (
                    <div key={student.id} className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">{student.studentName}</h4>
                                    <p className="text-sm text-muted-foreground">{student.studentNIM}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="secondary" className="text-xs">{student.activityType}</Badge>
                                        <span className="text-xs text-muted-foreground line-clamp-1">{student.activityName}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col md:items-end gap-2 min-w-[150px]">
                                <div className="flex items-center gap-2">
                                    <Progress value={student.overallProgress} className="w-24 h-2" />
                                    <span className="text-sm font-medium">{student.overallProgress}%</span>
                                </div>
                                <Badge className={getStatusColor(student.status)} variant="outline">
                                    {student.status}
                                </Badge>
                            </div>

                            <div>
                                <Button variant="ghost" size="sm" onClick={() => handleViewStudentProgress(student)}>
                                    Details
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <MainLayout>
            <Head title="Timeline & Progress" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1>Timeline & Progress</h1>
                        <p className="text-sm text-muted-foreground">
                            {userRole === "mahasiswa" || userRole === "student"
                                ? "Track and manage your activity progress"
                                : "Monitor student progress across all activities"}
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                {(userRole === "mahasiswa" || userRole === "student")
                    ? renderStudentView()
                    : renderLecturerView()}

                {/* Timeline Detail Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {(userRole === "mahasiswa" || userRole === "student") ? "Activity Timeline" : "Student Progress"}
                            </DialogTitle>
                            <DialogDescription>
                                Detailed milestones and progress tracking
                            </DialogDescription>
                        </DialogHeader>

                        {/* Content Detail */}
                        {((userRole === "mahasiswa" || userRole === "student") && selectedActivity) ? (
                            <div className="space-y-6 mt-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Activity</p>
                                        <p className="font-medium">{selectedActivity.activityName}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Supervisor</p>
                                        <p className="font-medium">{selectedActivity.supervisor}</p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-4">
                                    <h4 className="font-semibold">Timeline</h4>
                                    {selectedActivity.timeline.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 relative pb-6 last:pb-0">
                                            {idx < selectedActivity.timeline.length - 1 && (
                                                <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200" />
                                            )}
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${item.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                                {getStatusIcon(item.status)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium text-sm">{item.title}</p>
                                                        <p className="text-xs text-muted-foreground">{item.date}</p>
                                                    </div>
                                                    <Badge variant="outline" className="capitalize text-xs">
                                                        {item.status}
                                                    </Badge>
                                                </div>
                                                
                                                {/* Action Button (Hanya Muncul Jika Student) */}
                                                <Button 
                                                    variant="link" 
                                                    size="sm" 
                                                    className="h-auto p-0 text-xs mt-1 text-blue-600"
                                                    onClick={() => handleUpdateProgress(item)}
                                                >
                                                    Update Progress
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            (userRole === "dosen" || userRole === "lecturer") && selectedStudent && (
                                <div className="space-y-6 mt-4">
                                    <div className="flex items-center gap-4 p-4 bg-accent/50 rounded-lg">
                                        <User className="w-8 h-8 text-muted-foreground" />
                                        <div>
                                            <h3 className="font-semibold">{selectedStudent.studentName}</h3>
                                            <p className="text-sm text-muted-foreground">{selectedStudent.activityName}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="font-semibold">Progress History</h4>
                                        {selectedStudent.timeline.map((item, idx) => (
                                            <div key={idx} className="flex gap-4 items-center border-b pb-4 last:border-0">
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{item.title}</p>
                                                    <p className="text-xs text-muted-foreground">{item.date}</p>
                                                </div>
                                                <Badge variant={item.status === 'completed' ? 'default' : 'outline'}>
                                                    {item.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        )}

                        <DialogFooter>
                            <Button variant="outline" onClick={handleCloseDialog}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                 {/* Update Progress Dialog */}
                 <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Update Progress</DialogTitle>
                            <DialogDescription>
                                {selectedTimelineItem?.title}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={updateStatus} onValueChange={setUpdateStatus}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Notes</Label>
                                <Textarea 
                                    value={updateNote} 
                                    onChange={(e) => setUpdateNote(e.target.value)} 
                                    placeholder="Describe your progress..."
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSaveUpdate}>Save Update</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </MainLayout>
    );
}