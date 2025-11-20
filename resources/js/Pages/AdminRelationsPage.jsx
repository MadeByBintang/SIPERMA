import { useState } from "react";
import { Head } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { Label } from "../Components/ui/label";
import { Badge } from "../Components/ui/badge";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../Components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../Components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../Components/ui/select";
import {
    Search,
    Eye,
    Edit,
    Trash2,
    Plus,
    GitBranch,
    Users,
    UserCheck,
    GraduationCap,
    Briefcase,
    Award,
    CheckCircle2,
    Clock,
    XCircle,
    AlertCircle,
    Link as LinkIcon,
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
} from "../Components/ui/AlertDialog";
import { useIsMobile } from "../Components/ui/UseMobile";

const RelationType = "student-lecturer" | "student-student";
const ActivityType = "pkl" | "thesis" | "competition" | "all";
const RelationStatus = "active" | "pending" | "completed" | "terminated";

const StudentLecturerRelation = [
    {
        id: "string",
        studentId: "string",
        studentName: "string",
        studentNim: "string",
        lecturerId: "string",
        lecturerName: "string",
        lecturerNip: "string",
        activityType: "pkl" | "thesis" | "competition",
        activityTitle: "string",
        status: "RelationStatus",
        startDate: "string",
        endDate: "string",
        department: "string",
    },
];

const StudentStudentRelation = [
    {
        id: "string",
        student1Id: "string",
        student1Name: "string",
        student1Nim: "string",
        student2Id: "string",
        student2Name: "string",
        student2Nim: "string",
        activityType: "pkl" | "thesis" | "competition",
        activityTitle: "string",
        status: "RelationStatus",
        startDate: "string",
        endDate: "string",
        department: "string",
        role1: "string",
        role2: "string",
    },
];

export default function AdminRelationsPage() {
    const isMobile = useIsMobile();
    const [relationType, setRelationType] = useState("student-lecturer");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentTab, setCurrentTab] = useState("all");
    const [selectedSLRelation, setSelectedSLRelation] = useState(null);
    const [selectedSSRelation, setSelectedSSRelation] = useState(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [formData, setFormData] = useState({});

    // Mock student-lecturer relations data
    const [studentLecturerRelations, setStudentLecturerRelations] = useState([
        {
            id: "1",
            studentId: "1",
            studentName: "Ahmad Rizki Pratama",
            studentNim: "2021001234",
            lecturerId: "1",
            lecturerName: "Dr. Sarah Wijaya, M.T.",
            lecturerNip: "198501012010011001",
            activityType: "pkl",
            activityTitle:
                "Enterprise Resource Planning Implementation at PT Teknologi Maju",
            status: "active",
            startDate: "2024-09-01",
            endDate: "2024-12-15",
            department: "Computer Science",
        },
        {
            id: "2",
            studentId: "2",
            studentName: "Siti Aminah",
            studentNim: "2021005678",
            lecturerId: "1",
            lecturerName: "Dr. Sarah Wijaya, M.T.",
            lecturerNip: "198501012010011001",
            activityType: "pkl",
            activityTitle:
                "Enterprise Resource Planning Implementation at PT Teknologi Maju",
            status: "active",
            startDate: "2024-09-01",
            endDate: "2024-12-15",
            department: "Computer Science",
        },
        {
            id: "3",
            studentId: "3",
            studentName: "Budi Santoso",
            studentNim: "2020007890",
            lecturerId: "2",
            lecturerName: "Prof. Dr. Budi Hartono, M.Kom.",
            lecturerNip: "198703152012012002",
            activityType: "thesis",
            activityTitle:
                "Deep Learning Approach for Indonesian Sentiment Analysis on Social Media",
            status: "active",
            startDate: "2024-08-15",
            endDate: "2025-01-20",
            department: "Computer Science",
        },
        {
            id: "4",
            studentId: "4",
            studentName: "Dewi Lestari",
            studentNim: "2022002345",
            lecturerId: "4",
            lecturerName: "Dr. Ahmad Fauzi, M.Kom.",
            lecturerNip: "198805102013012004",
            activityType: "competition",
            activityTitle:
                "Smart Agriculture IoT System - National Innovation Competition 2024",
            status: "active",
            startDate: "2024-07-10",
            endDate: "2024-11-30",
            department: "Information Technology",
        },
        {
            id: "5",
            studentId: "5",
            studentName: "Hendra Wijaya",
            studentNim: "2021009876",
            lecturerId: "4",
            lecturerName: "Dr. Ahmad Fauzi, M.Kom.",
            lecturerNip: "198805102013012004",
            activityType: "competition",
            activityTitle:
                "Smart Agriculture IoT System - National Innovation Competition 2024",
            status: "active",
            startDate: "2024-07-10",
            endDate: "2024-11-30",
            department: "Information Technology",
        },
        {
            id: "6",
            studentId: "6",
            studentName: "Andi Wijaya",
            studentNim: "2021003456",
            lecturerId: "5",
            lecturerName: "Dr. Maya Putri, M.T.",
            lecturerNip: "199203052016012005",
            activityType: "pkl",
            activityTitle:
                "Mobile Application Development for E-Commerce Platform",
            status: "completed",
            startDate: "2024-06-01",
            endDate: "2024-09-30",
            department: "Software Engineering",
        },
        {
            id: "7",
            studentId: "7",
            studentName: "Farhan Abdullah",
            studentNim: "2021004567",
            lecturerId: "3",
            lecturerName: "Dr. Rina Kusuma, M.T.",
            lecturerNip: "199001202015011003",
            activityType: "thesis",
            activityTitle: "Blockchain-based Supply Chain Management System",
            status: "active",
            startDate: "2024-09-01",
            endDate: "2025-02-15",
            department: "Information Systems",
        },
        {
            id: "8",
            studentId: "8",
            studentName: "Putri Kusuma",
            studentNim: "2021005789",
            lecturerId: "3",
            lecturerName: "Dr. Rina Kusuma, M.T.",
            lecturerNip: "199001202015011003",
            activityType: "thesis",
            activityTitle: "Blockchain-based Supply Chain Management System",
            status: "active",
            startDate: "2024-09-01",
            endDate: "2025-02-15",
            department: "Information Systems",
        },
        {
            id: "9",
            studentId: "9",
            studentName: "Lisa Anggraini",
            studentNim: "2021006890",
            lecturerId: "1",
            lecturerName: "Dr. Sarah Wijaya, M.T.",
            lecturerNip: "198501012010011001",
            activityType: "competition",
            activityTitle:
                "AI-Powered Healthcare Chatbot - ASEAN Tech Challenge",
            status: "completed",
            startDate: "2024-05-15",
            endDate: "2024-10-01",
            department: "Computer Science",
        },
        {
            id: "10",
            studentId: "10",
            studentName: "Ryan Pratama",
            studentNim: "2021007901",
            lecturerId: "1",
            lecturerName: "Dr. Sarah Wijaya, M.T.",
            lecturerNip: "198501012010011001",
            activityType: "competition",
            activityTitle:
                "AI-Powered Healthcare Chatbot - ASEAN Tech Challenge",
            status: "completed",
            startDate: "2024-05-15",
            endDate: "2024-10-01",
            department: "Computer Science",
        },
        {
            id: "11",
            studentId: "11",
            studentName: "Michael Tanjung",
            studentNim: "2021008012",
            lecturerId: "2",
            lecturerName: "Prof. Dr. Budi Hartono, M.Kom.",
            lecturerNip: "198703152012012002",
            activityType: "pkl",
            activityTitle: "Data Analytics Dashboard for Financial Services",
            status: "active",
            startDate: "2024-08-20",
            endDate: "2024-12-20",
            department: "Information Systems",
        },
        {
            id: "12",
            studentId: "12",
            studentName: "Diana Permata",
            studentNim: "2021009123",
            lecturerId: "4",
            lecturerName: "Dr. Ahmad Fauzi, M.Kom.",
            lecturerNip: "198805102013012004",
            activityType: "thesis",
            activityTitle:
                "Augmented Reality for Interactive Learning in Primary Education",
            status: "active",
            startDate: "2024-09-05",
            endDate: "2025-03-10",
            department: "Information Technology",
        },
        {
            id: "13",
            studentId: "13",
            studentName: "Kevin Saputra",
            studentNim: "2022001234",
            lecturerId: "3",
            lecturerName: "Dr. Rina Kusuma, M.T.",
            lecturerNip: "199001202015011003",
            activityType: "competition",
            activityTitle:
                "Green Energy Monitoring System - Environmental Hackathon",
            status: "pending",
            startDate: "2024-10-15",
            endDate: "2024-12-01",
            department: "Information Technology",
        },
        {
            id: "14",
            studentId: "14",
            studentName: "Arief Rahman",
            studentNim: "2020008234",
            lecturerId: "4",
            lecturerName: "Dr. Ahmad Fauzi, M.Kom.",
            lecturerNip: "198805102013012004",
            activityType: "pkl",
            activityTitle:
                "Cybersecurity Assessment for Banking Infrastructure",
            status: "terminated",
            startDate: "2024-07-01",
            endDate: "2024-10-15",
            department: "Computer Science",
        },
    ]);

    // Mock student-student relations data (team collaborations)
    const [studentStudentRelations, setStudentStudentRelations] = useState([
        {
            id: "ss1",
            student1Id: "1",
            student1Name: "Ahmad Rizki Pratama",
            student1Nim: "2021001234",
            student2Id: "2",
            student2Name: "Siti Aminah",
            student2Nim: "2021005678",
            activityType: "pkl",
            activityTitle:
                "Enterprise Resource Planning Implementation at PT Teknologi Maju",
            status: "active",
            startDate: "2024-09-01",
            endDate: "2024-12-15",
            department: "Computer Science",
            role1: "Team Lead",
            role2: "Backend Developer",
        },
        {
            id: "ss2",
            student1Id: "4",
            student1Name: "Dewi Lestari",
            student1Nim: "2022002345",
            student2Id: "5",
            student2Name: "Hendra Wijaya",
            student2Nim: "2021009876",
            activityType: "competition",
            activityTitle:
                "Smart Agriculture IoT System - National Innovation Competition 2024",
            status: "active",
            startDate: "2024-07-10",
            endDate: "2024-11-30",
            department: "Information Technology",
            role1: "Hardware Engineer",
            role2: "Software Developer",
        },
        {
            id: "ss3",
            student1Id: "7",
            student1Name: "Farhan Abdullah",
            student1Nim: "2021004567",
            student2Id: "8",
            student2Name: "Putri Kusuma",
            student2Nim: "2021005789",
            activityType: "thesis",
            activityTitle: "Blockchain-based Supply Chain Management System",
            status: "active",
            startDate: "2024-09-01",
            endDate: "2025-02-15",
            department: "Information Systems",
            role1: "Blockchain Developer",
            role2: "UI/UX Designer",
        },
        {
            id: "ss4",
            student1Id: "9",
            student1Name: "Lisa Anggraini",
            student1Nim: "2021006890",
            student2Id: "10",
            student2Name: "Ryan Pratama",
            student2Nim: "2021007901",
            activityType: "competition",
            activityTitle:
                "AI-Powered Healthcare Chatbot - ASEAN Tech Challenge",
            status: "completed",
            startDate: "2024-05-15",
            endDate: "2024-10-01",
            department: "Computer Science",
            role1: "AI Engineer",
            role2: "Full Stack Developer",
        },
        {
            id: "ss5",
            student1Id: "15",
            student1Name: "Nina Kartika",
            student1Nim: "2021010234",
            student2Id: "16",
            student2Name: "Tommy Setiawan",
            student2Nim: "2021011345",
            activityType: "pkl",
            activityTitle: "Cloud Infrastructure Migration for Enterprise",
            status: "active",
            startDate: "2024-09-15",
            endDate: "2025-01-15",
            department: "Information Technology",
            role1: "DevOps Engineer",
            role2: "Cloud Architect",
        },
        {
            id: "ss6",
            student1Id: "17",
            student1Name: "Sarah Oktavia",
            student1Nim: "2020005678",
            student2Id: "18",
            student2Name: "Eko Prasetyo",
            student2Nim: "2020006789",
            activityType: "thesis",
            activityTitle:
                "Machine Learning for Predictive Maintenance in Manufacturing",
            status: "active",
            startDate: "2024-08-01",
            endDate: "2025-02-28",
            department: "Computer Science",
            role1: "Data Scientist",
            role2: "ML Engineer",
        },
        {
            id: "ss7",
            student1Id: "19",
            student1Name: "Dimas Wicaksono",
            student1Nim: "2022003456",
            student2Id: "20",
            student2Name: "Rina Handayani",
            student2Nim: "2022004567",
            activityType: "competition",
            activityTitle:
                "Smart City Traffic Management - Urban Tech Innovation",
            status: "pending",
            startDate: "2024-10-20",
            endDate: "2024-12-20",
            department: "Information Systems",
            role1: "Frontend Developer",
            role2: "Data Analyst",
        },
        {
            id: "ss8",
            student1Id: "21",
            student1Name: "Faisal Ramadhan",
            student1Nim: "2021012456",
            student2Id: "22",
            student2Name: "Maya Sari",
            student2Nim: "2021013567",
            activityType: "pkl",
            activityTitle: "E-Learning Platform Development for K-12 Education",
            status: "completed",
            startDate: "2024-06-15",
            endDate: "2024-10-15",
            department: "Software Engineering",
            role1: "Full Stack Developer",
            role2: "UX Researcher",
        },
    ]);

    // Filter relations based on type
    const filteredSLRelations = studentLecturerRelations.filter((relation) => {
        const matchesTab =
            currentTab === "all" || relation.activityType === currentTab;
        const matchesSearch =
            relation.studentName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            relation.studentNim.includes(searchQuery) ||
            relation.lecturerName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            relation.lecturerNip.includes(searchQuery) ||
            relation.activityTitle
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            relation.department
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

        return matchesTab && matchesSearch;
    });

    const filteredSSRelations = studentStudentRelations.filter((relation) => {
        const matchesTab =
            currentTab === "all" || relation.activityType === currentTab;
        const matchesSearch =
            relation.student1Name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            relation.student1Nim.includes(searchQuery) ||
            relation.student2Name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            relation.student2Nim.includes(searchQuery) ||
            relation.activityTitle
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            relation.department
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

        return matchesTab && matchesSearch;
    });

    // Get statistics based on relation type
    const getSLStats = () => ({
        total: studentLecturerRelations.length,
        pkl: studentLecturerRelations.filter((r) => r.activityType === "pkl")
            .length,
        thesis: studentLecturerRelations.filter(
            (r) => r.activityType === "thesis"
        ).length,
        competition: studentLecturerRelations.filter(
            (r) => r.activityType === "competition"
        ).length,
        active: studentLecturerRelations.filter((r) => r.status === "active")
            .length,
        pending: studentLecturerRelations.filter((r) => r.status === "pending")
            .length,
        completed: studentLecturerRelations.filter(
            (r) => r.status === "completed"
        ).length,
        terminated: studentLecturerRelations.filter(
            (r) => r.status === "terminated"
        ).length,
        uniqueLecturers: new Set(
            studentLecturerRelations.map((r) => r.lecturerId)
        ).size,
    });

    const getSSStats = () => ({
        total: studentStudentRelations.length,
        pkl: studentStudentRelations.filter((r) => r.activityType === "pkl")
            .length,
        thesis: studentStudentRelations.filter(
            (r) => r.activityType === "thesis"
        ).length,
        competition: studentStudentRelations.filter(
            (r) => r.activityType === "competition"
        ).length,
        active: studentStudentRelations.filter((r) => r.status === "active")
            .length,
        pending: studentStudentRelations.filter((r) => r.status === "pending")
            .length,
        completed: studentStudentRelations.filter(
            (r) => r.status === "completed"
        ).length,
        terminated: studentStudentRelations.filter(
            (r) => r.status === "terminated"
        ).length,
        uniqueTeams: studentStudentRelations.length,
    });

    const stats =
        relationType === "student-lecturer" ? getSLStats() : getSSStats();

    // Handle view details
    const handleViewDetails = (relation) => {
        if (relationType === "student-lecturer") {
            setSelectedSLRelation(relation);
        } else {
            setSelectedSSRelation(relation);
        }
        setIsDetailDialogOpen(true);
    };

    // Handle edit
    const handleEdit = (relation) => {
        if (relationType === "student-lecturer") {
            setSelectedSLRelation(relation);
        } else {
            setSelectedSSRelation(relation);
        }
        setFormData(relation);
        setIsEditDialogOpen(true);
    };

    // Handle delete
    const handleDelete = (relation) => {
        if (relationType === "student-lecturer") {
            setSelectedSLRelation(relation);
        } else {
            setSelectedSSRelation(relation);
        }
        setIsDeleteDialogOpen(true);
    };

    // Confirm delete
    const confirmDelete = () => {
        if (relationType === "student-lecturer" && selectedSLRelation) {
            setStudentLecturerRelations(
                studentLecturerRelations.filter(
                    (r) => r.id !== selectedSLRelation.id
                )
            );
            setSelectedSLRelation(null);
        } else if (relationType === "student-student" && selectedSSRelation) {
            setStudentStudentRelations(
                studentStudentRelations.filter(
                    (r) => r.id !== selectedSSRelation.id
                )
            );
            setSelectedSSRelation(null);
        }

        setIsDeleteDialogOpen(false);
        toast.success("Relation deleted successfully");
    };

    // Handle add new relation
    const handleAddRelation = () => {
        setFormData({});
        setIsAddDialogOpen(true);
    };

    // Handle save
    const handleSave = () => {
        if (relationType === "student-lecturer") {
            if (isAddDialogOpen) {
                const newRelation = [
                    {
                        id: String(studentLecturerRelations.length + 1),
                        studentId: formData.studentId || "",
                        studentName: formData.studentName || "",
                        studentNim: formData.studentNim || "",
                        lecturerId: formData.lecturerId || "",
                        lecturerName: formData.lecturerName || "",
                        lecturerNip: formData.lecturerNip || "",
                        activityType: formData.activityType || "pkl",
                        activityTitle: formData.activityTitle || "",
                        status: formData.status || "pending",
                        startDate:
                            formData.startDate ||
                            new Date().toISOString().split("T")[0],
                        endDate: formData.endDate || undefined,
                        department: formData.department || "",
                    },
                ];
                setStudentLecturerRelations([
                    ...studentLecturerRelations,
                    newRelation,
                ]);
            } else {
                setStudentLecturerRelations(
                    studentLecturerRelations.map((r) =>
                        r.id === selectedSLRelation?.id
                            ? { ...r, ...formData }
                            : r
                    )
                );
            }
        } else {
            if (isAddDialogOpen) {
                const newRelation = [
                    {
                        id: "ss" + String(studentStudentRelations.length + 1),
                        student1Id: formData.student1Id || "",
                        student1Name: formData.student1Name || "",
                        student1Nim: formData.student1Nim || "",
                        student2Id: formData.student2Id || "",
                        student2Name: formData.student2Name || "",
                        student2Nim: formData.student2Nim || "",
                        activityType: formData.activityType || "pkl",
                        activityTitle: formData.activityTitle || "",
                        status: formData.status || "pending",
                        startDate:
                            formData.startDate ||
                            new Date().toISOString().split("T")[0],
                        endDate: formData.endDate || undefined,
                        department: formData.department || "",
                        role1: formData.role1 || "",
                        role2: formData.role2 || "",
                    },
                ];
                setStudentStudentRelations([
                    ...studentStudentRelations,
                    newRelation,
                ]);
            } else {
                setStudentStudentRelations(
                    studentStudentRelations.map((r) =>
                        r.id === selectedSSRelation?.id
                            ? { ...r, ...formData }
                            : r
                    )
                );
            }
        }

        toast.success(
            isAddDialogOpen
                ? "Relation added successfully"
                : "Relation updated successfully"
        );
        setIsAddDialogOpen(false);
        setIsEditDialogOpen(false);
        setFormData({});
        setSelectedSLRelation(null);
        setSelectedSSRelation(null);
    };

    // Get status badge
    const getStatusBadge = (status) => {
        const statusConfig = {
            active: {
                label: "Active",
                className: "bg-blue-50 text-blue-700 border-blue-300",
                icon: CheckCircle2,
            },
            pending: {
                label: "Pending",
                className: "bg-orange-50 text-orange-700 border-orange-300",
                icon: Clock,
            },
            completed: {
                label: "Completed",
                className: "bg-green-50 text-green-700 border-green-300",
                icon: CheckCircle2,
            },
            terminated: {
                label: "Terminated",
                className: "bg-red-50 text-red-700 border-red-300",
                icon: XCircle,
            },
        };

        const config = statusConfig[status];
        const Icon = config.icon;

        return (
            <Badge variant="outline" className={`${config.className} gap-1`}>
                <Icon className="w-3 h-3" />
                {config.label}
            </Badge>
        );
    };

    // Get activity badge
    const getActivityBadge = (type) => {
        const typeConfig = {
            pkl: {
                label: "PKL",
                className: "bg-purple-50 text-purple-700 border-purple-300",
                icon: Briefcase,
            },
            thesis: {
                label: "Thesis",
                className: "bg-indigo-50 text-indigo-700 border-indigo-300",
                icon: GraduationCap,
            },
            competition: {
                label: "Competition",
                className: "bg-amber-50 text-amber-700 border-amber-300",
                icon: Award,
            },
        };

        const config = typeConfig[type];
        const Icon = config.icon;

        return (
            <Badge variant="outline" className={`${config.className} gap-1`}>
                <Icon className="w-3 h-3" />
                {config.label}
            </Badge>
        );
    };

    // Render form fields for student-lecturer
    const renderSLFormFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="studentName">Student Name</Label>
                    <Input
                        id="studentName"
                        placeholder="Enter student name"
                        value={formData.studentName || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                studentName: e.target.value,
                            })
                        }
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="studentNim">Student NIM</Label>
                    <Input
                        id="studentNim"
                        placeholder="e.g., 2021001234"
                        value={formData.studentNim || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                studentNim: e.target.value,
                            })
                        }
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="lecturerName">Lecturer Name</Label>
                    <Input
                        id="lecturerName"
                        placeholder="Enter lecturer name"
                        value={formData.lecturerName || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                lecturerName: e.target.value,
                            })
                        }
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lecturerNip">Lecturer NIP</Label>
                    <Input
                        id="lecturerNip"
                        placeholder="e.g., 198501012010011001"
                        value={formData.lecturerNip || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                lecturerNip: e.target.value,
                            })
                        }
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="activityTitle">Activity Title</Label>
                <Input
                    id="activityTitle"
                    placeholder="Enter activity/project title"
                    value={formData.activityTitle || ""}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            activityTitle: e.target.value,
                        })
                    }
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="activityType">Activity Type</Label>
                    <Select
                        value={formData.activityType || ""}
                        onValueChange={(value) =>
                            setFormData({ ...formData, activityType: value })
                        }
                    >
                        <SelectTrigger id="activityType">
                            <SelectValue placeholder="Select activity type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pkl">
                                PKL (Internship)
                            </SelectItem>
                            <SelectItem value="thesis">Thesis</SelectItem>
                            <SelectItem value="competition">
                                Competition
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                        value={formData.department || ""}
                        onValueChange={(value) =>
                            setFormData({ ...formData, department: value })
                        }
                    >
                        <SelectTrigger id="department">
                            <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Computer Science">
                                Computer Science
                            </SelectItem>
                            <SelectItem value="Information Systems">
                                Information Systems
                            </SelectItem>
                            <SelectItem value="Software Engineering">
                                Software Engineering
                            </SelectItem>
                            <SelectItem value="Information Technology">
                                Information Technology
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                        value={formData.status || ""}
                        onValueChange={(value) =>
                            setFormData({ ...formData, status: value })
                        }
                    >
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="terminated">
                                Terminated
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                startDate: e.target.value,
                            })
                        }
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate || ""}
                    onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                    }
                />
            </div>
        </>
    );

    // Render form fields for student-student
    const renderSSFormFields = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="student1Name">Student 1 Name</Label>
                    <Input
                        id="student1Name"
                        placeholder="Enter student name"
                        value={formData.student1Name || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                student1Name: e.target.value,
                            })
                        }
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="student1Nim">Student 1 NIM</Label>
                    <Input
                        id="student1Nim"
                        placeholder="e.g., 2021001234"
                        value={formData.student1Nim || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                student1Nim: e.target.value,
                            })
                        }
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="student2Name">Student 2 Name</Label>
                    <Input
                        id="student2Name"
                        placeholder="Enter student name"
                        value={formData.student2Name || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                student2Name: e.target.value,
                            })
                        }
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="student2Nim">Student 2 NIM</Label>
                    <Input
                        id="student2Nim"
                        placeholder="e.g., 2021005678"
                        value={formData.student2Nim || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                student2Nim: e.target.value,
                            })
                        }
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="role1">Student 1 Role</Label>
                    <Input
                        id="role1"
                        placeholder="e.g., Team Lead"
                        value={formData.role1 || ""}
                        onChange={(e) =>
                            setFormData({ ...formData, role1: e.target.value })
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="role2">Student 2 Role</Label>
                    <Input
                        id="role2"
                        placeholder="e.g., Developer"
                        value={formData.role2 || ""}
                        onChange={(e) =>
                            setFormData({ ...formData, role2: e.target.value })
                        }
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="activityTitle">Activity Title</Label>
                <Input
                    id="activityTitle"
                    placeholder="Enter activity/project title"
                    value={formData.activityTitle || ""}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            activityTitle: e.target.value,
                        })
                    }
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="activityType">Activity Type</Label>
                    <Select
                        value={formData.activityType || ""}
                        onValueChange={(value) =>
                            setFormData({ ...formData, activityType: value })
                        }
                    >
                        <SelectTrigger id="activityType">
                            <SelectValue placeholder="Select activity type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pkl">
                                PKL (Internship)
                            </SelectItem>
                            <SelectItem value="thesis">Thesis</SelectItem>
                            <SelectItem value="competition">
                                Competition
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                        value={formData.department || ""}
                        onValueChange={(value) =>
                            setFormData({ ...formData, department: value })
                        }
                    >
                        <SelectTrigger id="department">
                            <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Computer Science">
                                Computer Science
                            </SelectItem>
                            <SelectItem value="Information Systems">
                                Information Systems
                            </SelectItem>
                            <SelectItem value="Software Engineering">
                                Software Engineering
                            </SelectItem>
                            <SelectItem value="Information Technology">
                                Information Technology
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                        value={formData.status || ""}
                        onValueChange={(value) =>
                            setFormData({ ...formData, status: value })
                        }
                    >
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="terminated">
                                Terminated
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate || ""}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                startDate: e.target.value,
                            })
                        }
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate || ""}
                    onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                    }
                />
            </div>
        </>
    );

    return (
        <MainLayout>
            <Head title="Relations Management" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start md:items-center justify-between gap-4 flex-col md:flex-row">
                    <div className="flex-1">
                        <h1>Relations Management</h1>
                        <p className="text-sm text-muted-foreground">
                            Student-lecturer supervision and student
                            collaboration mapping
                        </p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex-1 md:flex-initial md:w-[280px]">
                            <Select
                                value={relationType}
                                onValueChange={(value) =>
                                    setRelationType(value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="student-lecturer">
                                        <div className="flex items-center gap-2">
                                            <UserCheck className="w-4 h-4" />
                                            <span>
                                                Student-Lecturer Relations
                                            </span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="student-student">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            <span>
                                                Student-Student Relations
                                            </span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            onClick={handleAddRelation}
                            className="gap-2 shrink-0"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                Add Relation
                            </span>
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Total Relations
                            </CardTitle>
                            <GitBranch className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {stats.total}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {relationType === "student-lecturer"
                                        ? "Active mappings"
                                        : "Team collaborations"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                {relationType === "student-lecturer"
                                    ? "Active Supervisors"
                                    : "Active Teams"}
                            </CardTitle>
                            {relationType === "student-lecturer" ? (
                                <UserCheck className="w-4 h-4 text-muted-foreground" />
                            ) : (
                                <Users className="w-4 h-4 text-muted-foreground" />
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {relationType === "student-lecturer"
                                            ? stats.uniqueLecturers
                                            : stats.uniqueTeams}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {relationType === "student-lecturer"
                                        ? "Lecturers involved"
                                        : "Total teams"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">
                                Active Relations
                            </CardTitle>
                            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {stats.active}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Currently ongoing
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm">Completed</CardTitle>
                            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl">
                                        {stats.completed}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Finished projects
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Relations List */}
                <Card>
                    <CardHeader>
                        <div className="flex items-start md:items-center justify-between gap-4 flex-col md:flex-row">
                            <div>
                                <CardTitle>
                                    {relationType === "student-lecturer"
                                        ? "Student-Lecturer Relations"
                                        : "Student-Student Relations"}
                                </CardTitle>
                                <CardDescription>
                                    {relationType === "student-lecturer"
                                        ? "View and manage supervision relationships"
                                        : "View and manage student team collaborations"}
                                </CardDescription>
                            </div>
                            <div className="w-full md:w-auto">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search relations..."
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
                        {/* Mobile: Dropdown */}
                        {isMobile && (
                            <div className="mb-6">
                                <Select
                                    value={currentTab}
                                    onValueChange={(value) =>
                                        setCurrentTab(value)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            <div className="flex items-center gap-2">
                                                <LinkIcon className="w-4 h-4" />
                                                <span>All ({stats.total})</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="pkl">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4" />
                                                <span>PKL ({stats.pkl})</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="thesis">
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="w-4 h-4" />
                                                <span>
                                                    Thesis ({stats.thesis})
                                                </span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="competition">
                                            <div className="flex items-center gap-2">
                                                <Award className="w-4 h-4" />
                                                <span>
                                                    Competition (
                                                    {stats.competition})
                                                </span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Desktop: Tabs */}
                        <Tabs
                            value={currentTab}
                            onValueChange={(value) => setCurrentTab(value)}
                            className="w-full"
                        >
                            {!isMobile && (
                                <TabsList className="grid w-full grid-cols-4 mb-6">
                                    <TabsTrigger value="all" className="gap-2">
                                        <LinkIcon className="w-4 h-4" />
                                        All ({stats.total})
                                    </TabsTrigger>
                                    <TabsTrigger value="pkl" className="gap-2">
                                        <Briefcase className="w-4 h-4" />
                                        PKL ({stats.pkl})
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="thesis"
                                        className="gap-2"
                                    >
                                        <GraduationCap className="w-4 h-4" />
                                        Thesis ({stats.thesis})
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="competition"
                                        className="gap-2"
                                    >
                                        <Award className="w-4 h-4" />
                                        Competition ({stats.competition})
                                    </TabsTrigger>
                                </TabsList>
                            )}

                            <TabsContent
                                value={currentTab}
                                className="space-y-4"
                            >
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="overflow-x-auto">
                                        {relationType === "student-lecturer" ? (
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Student
                                                        </TableHead>
                                                        <TableHead>
                                                            Lecturer
                                                        </TableHead>
                                                        <TableHead className="min-w-[250px]">
                                                            Activity
                                                        </TableHead>
                                                        <TableHead>
                                                            Department
                                                        </TableHead>
                                                        <TableHead>
                                                            Status
                                                        </TableHead>
                                                        <TableHead className="text-right">
                                                            Actions
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredSLRelations.length >
                                                    0 ? (
                                                        filteredSLRelations.map(
                                                            (relation) => (
                                                                <TableRow
                                                                    key={
                                                                        relation.id
                                                                    }
                                                                >
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                                                <span className="text-xs text-primary">
                                                                                    {relation.studentName
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
                                                                            <div>
                                                                                <p className="line-clamp-1">
                                                                                    {
                                                                                        relation.studentName
                                                                                    }
                                                                                </p>
                                                                                <p className="text-xs text-muted-foreground">
                                                                                    {
                                                                                        relation.studentNim
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            <UserCheck className="w-4 h-4 text-muted-foreground shrink-0" />
                                                                            <div>
                                                                                <p className="line-clamp-1">
                                                                                    {
                                                                                        relation.lecturerName
                                                                                    }
                                                                                </p>
                                                                                <p className="text-xs text-muted-foreground">
                                                                                    {
                                                                                        relation.lecturerNip
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="space-y-1">
                                                                            {getActivityBadge(
                                                                                relation.activityType
                                                                            )}
                                                                            <p className="text-sm line-clamp-2">
                                                                                {
                                                                                    relation.activityTitle
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {
                                                                            relation.department
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {getStatusBadge(
                                                                            relation.status
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center justify-end gap-2">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleViewDetails(
                                                                                        relation
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Eye className="w-4 h-4" />
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleEdit(
                                                                                        relation
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Edit className="w-4 h-4" />
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleDelete(
                                                                                        relation
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
                                                                colSpan={6}
                                                                className="text-center py-8 text-muted-foreground"
                                                            >
                                                                No relations
                                                                found
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        ) : (
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Student 1
                                                        </TableHead>
                                                        <TableHead>
                                                            Student 2
                                                        </TableHead>
                                                        <TableHead className="min-w-[250px]">
                                                            Activity
                                                        </TableHead>
                                                        <TableHead>
                                                            Department
                                                        </TableHead>
                                                        <TableHead>
                                                            Status
                                                        </TableHead>
                                                        <TableHead className="text-right">
                                                            Actions
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredSSRelations.length >
                                                    0 ? (
                                                        filteredSSRelations.map(
                                                            (relation) => (
                                                                <TableRow
                                                                    key={
                                                                        relation.id
                                                                    }
                                                                >
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                                                <span className="text-xs text-primary">
                                                                                    {relation.student1Name
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
                                                                            <div>
                                                                                <p className="line-clamp-1">
                                                                                    {
                                                                                        relation.student1Name
                                                                                    }
                                                                                </p>
                                                                                <p className="text-xs text-muted-foreground">
                                                                                    {
                                                                                        relation.student1Nim
                                                                                    }
                                                                                </p>
                                                                                {relation.role1 && (
                                                                                    <p className="text-xs text-blue-600">
                                                                                        {
                                                                                            relation.role1
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                                                <span className="text-xs text-primary">
                                                                                    {relation.student2Name
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
                                                                            <div>
                                                                                <p className="line-clamp-1">
                                                                                    {
                                                                                        relation.student2Name
                                                                                    }
                                                                                </p>
                                                                                <p className="text-xs text-muted-foreground">
                                                                                    {
                                                                                        relation.student2Nim
                                                                                    }
                                                                                </p>
                                                                                {relation.role2 && (
                                                                                    <p className="text-xs text-blue-600">
                                                                                        {
                                                                                            relation.role2
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="space-y-1">
                                                                            {getActivityBadge(
                                                                                relation.activityType
                                                                            )}
                                                                            <p className="text-sm line-clamp-2">
                                                                                {
                                                                                    relation.activityTitle
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {
                                                                            relation.department
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {getStatusBadge(
                                                                            relation.status
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center justify-end gap-2">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleViewDetails(
                                                                                        relation
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Eye className="w-4 h-4" />
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleEdit(
                                                                                        relation
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Edit className="w-4 h-4" />
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleDelete(
                                                                                        relation
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
                                                                colSpan={6}
                                                                className="text-center py-8 text-muted-foreground"
                                                            >
                                                                No relations
                                                                found
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Detail Dialog - Student-Lecturer */}
                {relationType === "student-lecturer" && (
                    <Dialog
                        open={isDetailDialogOpen}
                        onOpenChange={setIsDetailDialogOpen}
                    >
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>
                                    Student-Lecturer Relation Details
                                </DialogTitle>
                                <DialogDescription>
                                    Complete information about the supervision
                                    relationship
                                </DialogDescription>
                            </DialogHeader>
                            {selectedSLRelation && (
                                <div className="space-y-6 py-4">
                                    <div className="flex items-start gap-2 flex-wrap">
                                        {getActivityBadge(
                                            selectedSLRelation.activityType
                                        )}
                                        {getStatusBadge(
                                            selectedSLRelation.status
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <Label className="text-muted-foreground">
                                                    Student
                                                </Label>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                        <span className="text-sm text-primary">
                                                            {selectedSLRelation.studentName
                                                                .split(" ")
                                                                .map(
                                                                    (n) => n[0]
                                                                )
                                                                .join("")
                                                                .substring(
                                                                    0,
                                                                    2
                                                                )}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p>
                                                            {
                                                                selectedSLRelation.studentName
                                                            }
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {
                                                                selectedSLRelation.studentNim
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <Label className="text-muted-foreground">
                                                    Supervisor
                                                </Label>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <UserCheck className="w-5 h-5 text-muted-foreground" />
                                                    <div>
                                                        <p>
                                                            {
                                                                selectedSLRelation.lecturerName
                                                            }
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {
                                                                selectedSLRelation.lecturerNip
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <Label className="text-muted-foreground">
                                                    Department
                                                </Label>
                                                <p className="mt-1">
                                                    {
                                                        selectedSLRelation.department
                                                    }
                                                </p>
                                            </div>

                                            <div>
                                                <Label className="text-muted-foreground">
                                                    Duration
                                                </Label>
                                                <p className="text-sm mt-1">
                                                    {
                                                        selectedSLRelation.startDate
                                                    }{" "}
                                                    -{" "}
                                                    {selectedSLRelation.endDate ||
                                                        "Ongoing"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-muted-foreground">
                                            Activity Title
                                        </Label>
                                        <p className="mt-1">
                                            {selectedSLRelation.activityTitle}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                )}

                {/* Detail Dialog - Student-Student */}
                {relationType === "student-student" && (
                    <Dialog
                        open={isDetailDialogOpen}
                        onOpenChange={setIsDetailDialogOpen}
                    >
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>
                                    Student-Student Relation Details
                                </DialogTitle>
                                <DialogDescription>
                                    Complete information about the team
                                    collaboration
                                </DialogDescription>
                            </DialogHeader>
                            {selectedSSRelation && (
                                <div className="space-y-6 py-4">
                                    <div className="flex items-start gap-2 flex-wrap">
                                        {getActivityBadge(
                                            selectedSSRelation.activityType
                                        )}
                                        {getStatusBadge(
                                            selectedSSRelation.status
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <Label className="text-muted-foreground">
                                                    Student 1
                                                </Label>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                        <span className="text-sm text-primary">
                                                            {selectedSSRelation.student1Name
                                                                .split(" ")
                                                                .map(
                                                                    (n) => n[0]
                                                                )
                                                                .join("")
                                                                .substring(
                                                                    0,
                                                                    2
                                                                )}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p>
                                                            {
                                                                selectedSSRelation.student1Name
                                                            }
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {
                                                                selectedSSRelation.student1Nim
                                                            }
                                                        </p>
                                                        {selectedSSRelation.role1 && (
                                                            <p className="text-sm text-blue-600">
                                                                {
                                                                    selectedSSRelation.role1
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <Label className="text-muted-foreground">
                                                    Department
                                                </Label>
                                                <p className="mt-1">
                                                    {
                                                        selectedSSRelation.department
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <Label className="text-muted-foreground">
                                                    Student 2
                                                </Label>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                        <span className="text-sm text-primary">
                                                            {selectedSSRelation.student2Name
                                                                .split(" ")
                                                                .map(
                                                                    (n) => n[0]
                                                                )
                                                                .join("")
                                                                .substring(
                                                                    0,
                                                                    2
                                                                )}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p>
                                                            {
                                                                selectedSSRelation.student2Name
                                                            }
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {
                                                                selectedSSRelation.student2Nim
                                                            }
                                                        </p>
                                                        {selectedSSRelation.role2 && (
                                                            <p className="text-sm text-blue-600">
                                                                {
                                                                    selectedSSRelation.role2
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <Label className="text-muted-foreground">
                                                    Duration
                                                </Label>
                                                <p className="text-sm mt-1">
                                                    {
                                                        selectedSSRelation.startDate
                                                    }{" "}
                                                    -{" "}
                                                    {selectedSSRelation.endDate ||
                                                        "Ongoing"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-muted-foreground">
                                            Activity Title
                                        </Label>
                                        <p className="mt-1">
                                            {selectedSSRelation.activityTitle}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                )}

                {/* Edit Dialog */}
                <Dialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                >
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Relation</DialogTitle>
                            <DialogDescription>
                                Update the relation information
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            {relationType === "student-lecturer"
                                ? renderSLFormFields()
                                : renderSSFormFields()}
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Add Dialog */}
                <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                >
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Relation</DialogTitle>
                            <DialogDescription>
                                {relationType === "student-lecturer"
                                    ? "Create a new student-lecturer supervision relationship"
                                    : "Create a new student-student team collaboration"}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            {relationType === "student-lecturer"
                                ? renderSLFormFields()
                                : renderSSFormFields()}
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsAddDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>Add Relation</Button>
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
                                This action cannot be undone. This will
                                permanently delete the relation from the system.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </MainLayout>
    );
}
