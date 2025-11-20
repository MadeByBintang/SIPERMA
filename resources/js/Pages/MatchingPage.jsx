import { useState } from "react";
import { Head } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../Components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../Components/ui/table";
import { Badge } from "../Components/ui/badge";
import { Info, Mail, BookOpen, GraduationCap, Award } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../Components/ui/alert";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "../Components/ui/dialog";
import { Separator } from "../Components/ui/separator";

const MatchingData = [
    {
        id: "number",
        studentName: "string",
        studentNIM: "string",
        studentInterest: "string",
        studentEmail: "string",
        studentDescription: "string",
        studentGPA: "number",
        recommendedLecturer: "string",
        lecturerNIP: "string",
        lecturerExpertise: "string",
        lecturerEmail: "string",
        lecturerDescription: "string",
        lecturerCurrentStudents: "number",
        lecturerMaxStudents: "number",
        matchScore: "number",
        availability: "string",
        matchingReasons: "string",
    },
];

const MatchingPageProps = [
    {
        currentUserName: "string",
        userRole: "mahasiswa" | "dosen",
    },
];

const RecommendationType = "mahasiswa" | "dosen";

export default function MatchingPage({ currentUserName, userRole }) {
    const [filterAvailability, setFilterAvailability] = useState("all");
    // Lecturers can only see student recommendations, students can see both
    const [recommendationType, setRecommendationType] = useState(
        userRole === "dosen" ? "mahasiswa" : "mahasiswa"
    );
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const allMatchingData = [
        {
            id: 1,
            studentName: "Ahmad Rizki Pratama",
            studentNIM: "2021001234",
            studentInterest: "Machine Learning",
            studentEmail: "ahmad.rizki@university.edu",
            studentDescription:
                "Passionate about AI and its applications in real-world problems. Looking forward to working on innovative research projects.",
            studentGPA: 3.85,
            recommendedLecturer: "Dr. Sarah Wijaya, M.Kom",
            lecturerNIP: "198501122010122001",
            lecturerExpertise: "Machine Learning & AI",
            lecturerEmail: "sarah.wijaya@university.edu",
            lecturerDescription:
                "Specializes in deep learning and neural networks with 10+ years of research experience in AI applications.",
            lecturerCurrentStudents: 6,
            lecturerMaxStudents: 8,
            matchScore: 95,
            availability: "Available",
            matchingReasons: [
                "Strong alignment in Machine Learning interests",
                "Lecturer has expertise in AI and deep learning",
                "Student GPA meets lecturer requirements (3.5+)",
                "Lecturer has availability for new students",
            ],
        },
        {
            id: 2,
            studentName: "Siti Nurhaliza",
            studentNIM: "2021002345",
            studentInterest: "Data Science",
            studentEmail: "siti.nur@university.edu",
            studentDescription:
                "Interested in statistical analysis and big data processing. Eager to explore predictive modeling.",
            studentGPA: 3.75,
            recommendedLecturer: "Prof. Ahmad Suryanto, Ph.D",
            lecturerNIP: "197803151998031002",
            lecturerExpertise: "Data Science & Analytics",
            lecturerEmail: "ahmad.suryanto@university.edu",
            lecturerDescription:
                "Expert in statistical modeling and data analytics with numerous publications in top-tier journals.",
            lecturerCurrentStudents: 5,
            lecturerMaxStudents: 8,
            matchScore: 92,
            availability: "Available",
            matchingReasons: [
                "Perfect match in Data Science focus area",
                "Lecturer specializes in statistical analysis",
                "Compatible research interests in predictive modeling",
                "Good student-lecturer ratio for personalized guidance",
            ],
        },
        {
            id: 3,
            studentName: "Budi Santoso",
            studentNIM: "2021003456",
            studentInterest: "Web Development",
            studentEmail: "budi.santoso@university.edu",
            studentDescription:
                "Enthusiastic about full-stack development and modern web frameworks. Strong portfolio in web projects.",
            studentGPA: 3.65,
            recommendedLecturer: "Dr. Rina Kusuma, M.T",
            lecturerNIP: "198209052008012003",
            lecturerExpertise: "Software Engineering",
            lecturerEmail: "rina.kusuma@university.edu",
            lecturerDescription:
                "Focuses on software architecture and web technologies with industry experience in tech companies.",
            lecturerCurrentStudents: 7,
            lecturerMaxStudents: 8,
            matchScore: 88,
            availability: "Limited",
            matchingReasons: [
                "Web development aligns with software engineering expertise",
                "Lecturer has industry experience in web technologies",
                "Student has strong practical portfolio",
                "Limited availability - only 1 slot remaining",
            ],
        },
        {
            id: 4,
            studentName: "Dewi Lestari",
            studentNIM: "2021004567",
            studentInterest: "Mobile Development",
            studentEmail: "dewi.lestari@university.edu",
            studentDescription:
                "Passionate about creating user-friendly mobile applications. Experience with both iOS and Android.",
            studentGPA: 3.8,
            recommendedLecturer: "Dr. Agus Priyanto, M.Kom",
            lecturerNIP: "198706182012121001",
            lecturerExpertise: "Mobile & IoT",
            lecturerEmail: "agus.priyanto@university.edu",
            lecturerDescription:
                "Specializes in mobile computing and IoT systems. Active in mobile app development research.",
            lecturerCurrentStudents: 4,
            lecturerMaxStudents: 8,
            matchScore: 90,
            availability: "Available",
            matchingReasons: [
                "Exact match in mobile development interests",
                "Lecturer expertise in both mobile platforms",
                "Cross-platform development opportunities",
                "Ample availability for new supervisions",
            ],
        },
        {
            id: 5,
            studentName: "Eko Prasetyo",
            studentNIM: "2021005678",
            studentInterest: "Cybersecurity",
            studentEmail: "eko.prasetyo@university.edu",
            studentDescription:
                "Focused on network security and cryptography. Interested in ethical hacking and security audits.",
            studentGPA: 3.7,
            recommendedLecturer: "Prof. Linda Wijaya, Ph.D",
            lecturerNIP: "197512201995122001",
            lecturerExpertise: "Security & Networks",
            lecturerEmail: "linda.wijaya@university.edu",
            lecturerDescription:
                "Renowned expert in cybersecurity and network protocols. Leading researcher in cryptography.",
            lecturerCurrentStudents: 8,
            lecturerMaxStudents: 8,
            matchScore: 85,
            availability: "Not Available",
            matchingReasons: [
                "Strong match in cybersecurity focus",
                "Lecturer is top expert in security field",
                "Shared interest in cryptography",
                "Currently at maximum student capacity",
            ],
        },
        {
            id: 6,
            studentName: "Farhan Abdullah",
            studentNIM: "2021006789",
            studentInterest: "Computer Vision",
            studentEmail: "farhan.abdullah@university.edu",
            studentDescription:
                "Interested in image processing and object detection. Working on autonomous vehicle perception systems.",
            studentGPA: 3.92,
            recommendedLecturer: "Dr. Sarah Wijaya, M.Kom",
            lecturerNIP: "198501122010122001",
            lecturerExpertise: "Machine Learning & AI",
            lecturerEmail: "sarah.wijaya@university.edu",
            lecturerDescription:
                "Specializes in deep learning and neural networks with 10+ years of research experience in AI applications.",
            lecturerCurrentStudents: 6,
            lecturerMaxStudents: 8,
            matchScore: 94,
            availability: "Available",
            matchingReasons: [
                "Computer Vision aligns with AI and deep learning expertise",
                "Lecturer has research experience in neural networks",
                "Excellent student GPA indicates strong academic performance",
                "Lecturer availability for quality supervision",
            ],
        },
        {
            id: 7,
            studentName: "Gita Permata",
            studentNIM: "2021007890",
            studentInterest: "Cloud Computing",
            studentEmail: "gita.permata@university.edu",
            studentDescription:
                "Enthusiastic about distributed systems and cloud infrastructure. Experience with AWS and Azure platforms.",
            studentGPA: 3.68,
            recommendedLecturer: "Dr. Bambang Hartono, M.T",
            lecturerNIP: "198304102009121002",
            lecturerExpertise: "Cloud & Distributed Systems",
            lecturerEmail: "bambang.hartono@university.edu",
            lecturerDescription:
                "Expert in cloud architecture and distributed computing. Consultant for major tech companies on cloud migration.",
            lecturerCurrentStudents: 5,
            lecturerMaxStudents: 8,
            matchScore: 91,
            availability: "Available",
            matchingReasons: [
                "Perfect alignment in cloud computing focus",
                "Lecturer has industry consulting experience",
                "Shared interest in distributed systems architecture",
                "Good availability for hands-on project guidance",
            ],
        },
        {
            id: 8,
            studentName: "Hendra Wijaya",
            studentNIM: "2021008901",
            studentInterest: "Natural Language Processing",
            studentEmail: "hendra.wijaya@university.edu",
            studentDescription:
                "Passionate about text analysis and language models. Working on Indonesian language sentiment analysis.",
            studentGPA: 3.78,
            recommendedLecturer: "Dr. Kartika Sari, M.Kom",
            lecturerNIP: "198608252011012004",
            lecturerExpertise: "NLP & Text Mining",
            lecturerEmail: "kartika.sari@university.edu",
            lecturerDescription:
                "Specializes in natural language processing for Indonesian and regional languages. Published extensively in NLP conferences.",
            lecturerCurrentStudents: 4,
            lecturerMaxStudents: 8,
            matchScore: 96,
            availability: "Available",
            matchingReasons: [
                "Exact match in NLP research interests",
                "Lecturer specializes in Indonesian language processing",
                "Strong alignment in sentiment analysis focus",
                "Excellent availability for collaborative research",
            ],
        },
        {
            id: 9,
            studentName: "Indah Kusuma",
            studentNIM: "2021009012",
            studentInterest: "UI/UX Design",
            studentEmail: "indah.kusuma@university.edu",
            studentDescription:
                "Focused on human-computer interaction and user experience design. Portfolio includes mobile and web interfaces.",
            studentGPA: 3.72,
            recommendedLecturer: "Dr. Rina Kusuma, M.T",
            lecturerNIP: "198209052008012003",
            lecturerExpertise: "Software Engineering",
            lecturerEmail: "rina.kusuma@university.edu",
            lecturerDescription:
                "Focuses on software architecture and web technologies with industry experience in tech companies.",
            lecturerCurrentStudents: 7,
            lecturerMaxStudents: 8,
            matchScore: 87,
            availability: "Limited",
            matchingReasons: [
                "UI/UX design complements software engineering expertise",
                "Lecturer has industry experience with user-facing applications",
                "Good match for design-focused software projects",
                "Limited slots - only 1 position available",
            ],
        },
        {
            id: 10,
            studentName: "Joko Prasetyo",
            studentNIM: "2021010123",
            studentInterest: "Blockchain Technology",
            studentEmail: "joko.prasetyo@university.edu",
            studentDescription:
                "Interested in decentralized systems and cryptocurrency. Exploring smart contract development and DeFi applications.",
            studentGPA: 3.81,
            recommendedLecturer: "Prof. Linda Wijaya, Ph.D",
            lecturerNIP: "197512201995122001",
            lecturerExpertise: "Security & Networks",
            lecturerEmail: "linda.wijaya@university.edu",
            lecturerDescription:
                "Renowned expert in cybersecurity and network protocols. Leading researcher in cryptography.",
            lecturerCurrentStudents: 8,
            lecturerMaxStudents: 8,
            matchScore: 84,
            availability: "Not Available",
            matchingReasons: [
                "Blockchain security aligns with cryptography expertise",
                "Lecturer is expert in secure distributed protocols",
                "Strong match in decentralized systems research",
                "Currently at full capacity - waitlist available",
            ],
        },
        {
            id: 11,
            studentName: "Karina Dewi",
            studentNIM: "2021011234",
            studentInterest: "Game Development",
            studentEmail: "karina.dewi@university.edu",
            studentDescription:
                "Passionate about interactive entertainment and game engines. Experience with Unity and Unreal Engine.",
            studentGPA: 3.65,
            recommendedLecturer: "Dr. Rudi Hartono, M.Kom",
            lecturerNIP: "198107142007011001",
            lecturerExpertise: "Computer Graphics & Games",
            lecturerEmail: "rudi.hartono@university.edu",
            lecturerDescription:
                "Expert in computer graphics and game development. Previously worked as senior developer at game studios.",
            lecturerCurrentStudents: 3,
            lecturerMaxStudents: 8,
            matchScore: 93,
            availability: "Available",
            matchingReasons: [
                "Perfect match in game development interests",
                "Lecturer has extensive game industry experience",
                "Shared expertise in modern game engines",
                "Excellent availability with low student ratio",
            ],
        },
        {
            id: 12,
            studentName: "Lukman Hakim",
            studentNIM: "2021012345",
            studentInterest: "Big Data Analytics",
            studentEmail: "lukman.hakim@university.edu",
            studentDescription:
                "Focused on large-scale data processing and analytics. Working with Hadoop, Spark, and data warehousing.",
            studentGPA: 3.88,
            recommendedLecturer: "Prof. Ahmad Suryanto, Ph.D",
            lecturerNIP: "197803151998031002",
            lecturerExpertise: "Data Science & Analytics",
            lecturerEmail: "ahmad.suryanto@university.edu",
            lecturerDescription:
                "Expert in statistical modeling and data analytics with numerous publications in top-tier journals.",
            lecturerCurrentStudents: 5,
            lecturerMaxStudents: 8,
            matchScore: 95,
            availability: "Available",
            matchingReasons: [
                "Excellent match in big data and analytics focus",
                "Lecturer specializes in large-scale data processing",
                "Strong alignment in data warehousing research",
                "Good student-lecturer ratio for intensive mentoring",
            ],
        },
    ];

    // Filter out the current user from the matching data and sort by match score
    const matchingData = allMatchingData
        .filter((match) => match.studentName !== currentUserName)
        .sort((a, b) => b.matchScore - a.matchScore); // Sort by match score descending

    const getMatchColor = (score) => {
        if (score >= 90) return "bg-green-100 text-green-700";
        if (score >= 80) return "bg-blue-100 text-blue-700";
        return "bg-yellow-100 text-yellow-700";
    };

    const getAvailabilityColor = (status) => {
        if (status === "Available") return "bg-green-100 text-green-700";
        if (status === "Limited") return "bg-yellow-100 text-yellow-700";
        return "bg-red-100 text-red-700";
    };

    const handleViewDetails = (match) => {
        setSelectedMatch(match);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedMatch(null);
    };

    // Filter data based on availability
    const filteredMatches = matchingData.filter((match) => {
        if (filterAvailability === "all") return true;
        if (filterAvailability === "available")
            return match.availability === "Available";
        if (filterAvailability === "limited")
            return match.availability === "Limited";
        if (filterAvailability === "unavailable")
            return match.availability === "Not Available";
        return true;
    });

    return (
        <MainLayout>
            <Head title="Matching" />
            <div className="space-y-6">
                {/* Info Alert */}
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Matching Algorithm</AlertTitle>
                    <AlertDescription>
                        {userRole === "dosen"
                            ? "Our system recommends students whose interests align with your expertise. Match scores above 90% indicate highly compatible pairings for supervision."
                            : "Our system matches students with lecturers based on interest alignment, expertise compatibility, and availability. Match scores above 90% indicate highly compatible pairings."}
                    </AlertDescription>
                </Alert>

                {/* Matching Results Table */}
                <Card>
                    <CardHeader>
                        <div className="space-y-4 md:space-y-0">
                            {/* Mobile: Three lines */}
                            <div className="md:hidden space-y-4">
                                <CardTitle>
                                    {userRole === "dosen"
                                        ? "Student Recommendations"
                                        : "Recommended Matches"}
                                </CardTitle>
                                {/* Only show recommendation type dropdown for students */}
                                {userRole === "mahasiswa" && (
                                    <Select
                                        value={recommendationType}
                                        onValueChange={(value) =>
                                            setRecommendationType(value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select recommendation type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="mahasiswa">
                                                Student Recommendations
                                            </SelectItem>
                                            <SelectItem value="dosen">
                                                Lecturer Recommendations
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                                <Select
                                    value={filterAvailability}
                                    onValueChange={setFilterAvailability}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Status
                                        </SelectItem>
                                        <SelectItem value="available">
                                            Available
                                        </SelectItem>
                                        <SelectItem value="limited">
                                            Limited
                                        </SelectItem>
                                        <SelectItem value="unavailable">
                                            Not Available
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Desktop: One line with flex */}
                            <div className="hidden md:flex items-center justify-between">
                                <CardTitle>
                                    {userRole === "dosen"
                                        ? "Student Recommendations"
                                        : "Recommended Matches"}
                                </CardTitle>
                                <div className="flex gap-3">
                                    {/* Only show recommendation type dropdown for students */}
                                    {userRole === "mahasiswa" && (
                                        <Select
                                            value={recommendationType}
                                            onValueChange={(value) =>
                                                setRecommendationType(value)
                                            }
                                        >
                                            <SelectTrigger className="w-56">
                                                <SelectValue placeholder="Select recommendation type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="mahasiswa">
                                                    Student Recommendations
                                                </SelectItem>
                                                <SelectItem value="dosen">
                                                    Lecturer Recommendations
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                    <Select
                                        value={filterAvailability}
                                        onValueChange={setFilterAvailability}
                                    >
                                        <SelectTrigger className="w-48">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Status
                                            </SelectItem>
                                            <SelectItem value="available">
                                                Available
                                            </SelectItem>
                                            <SelectItem value="limited">
                                                Limited
                                            </SelectItem>
                                            <SelectItem value="unavailable">
                                                Not Available
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {recommendationType === "mahasiswa" ? (
                                            <>
                                                <TableHead>Student</TableHead>
                                                <TableHead>Interest</TableHead>
                                                <TableHead>
                                                    Match Score
                                                </TableHead>
                                                <TableHead>
                                                    Availability
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    Actions
                                                </TableHead>
                                            </>
                                        ) : (
                                            <>
                                                <TableHead>Lecturer</TableHead>
                                                <TableHead>Expertise</TableHead>
                                                <TableHead>
                                                    Match Score
                                                </TableHead>
                                                <TableHead>
                                                    Availability
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    Actions
                                                </TableHead>
                                            </>
                                        )}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMatches.length > 0 ? (
                                        filteredMatches.map((match) => (
                                            <TableRow key={match.id}>
                                                {recommendationType ===
                                                "mahasiswa" ? (
                                                    <>
                                                        <TableCell>
                                                            <div>
                                                                <p>
                                                                    {
                                                                        match.studentName
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {
                                                                        match.studentNIM
                                                                    }
                                                                </p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                match.studentInterest
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                className={getMatchColor(
                                                                    match.matchScore
                                                                )}
                                                            >
                                                                {
                                                                    match.matchScore
                                                                }
                                                                %
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                className={getAvailabilityColor(
                                                                    match.availability
                                                                )}
                                                            >
                                                                {
                                                                    match.availability
                                                                }
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleViewDetails(
                                                                        match
                                                                    )
                                                                }
                                                            >
                                                                View Details
                                                            </Button>
                                                        </TableCell>
                                                    </>
                                                ) : (
                                                    <>
                                                        <TableCell>
                                                            <div>
                                                                <p>
                                                                    {
                                                                        match.recommendedLecturer
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {
                                                                        match.lecturerNIP
                                                                    }
                                                                </p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                match.lecturerExpertise
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                className={getMatchColor(
                                                                    match.matchScore
                                                                )}
                                                            >
                                                                {
                                                                    match.matchScore
                                                                }
                                                                %
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                className={getAvailabilityColor(
                                                                    match.availability
                                                                )}
                                                            >
                                                                {
                                                                    match.availability
                                                                }
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleViewDetails(
                                                                        match
                                                                    )
                                                                }
                                                            >
                                                                View Details
                                                            </Button>
                                                        </TableCell>
                                                    </>
                                                )}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="text-center py-8 text-muted-foreground"
                                            >
                                                No matches found for the
                                                selected filter
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Details Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {recommendationType === "mahasiswa"
                                    ? "mahasiswa"
                                    : "dosen"}{" "}
                                Matching Details
                            </DialogTitle>
                            <DialogDescription>
                                {recommendationType === "mahasiswa"
                                    ? "Detailed information about the student and recommended lecturer"
                                    : "Detailed information about the lecturer and matched student"}
                            </DialogDescription>
                        </DialogHeader>

                        {selectedMatch && (
                            <div className="space-y-6">
                                {/* Match Score Overview */}
                                <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                                    <div>
                                        <h3>Match Score</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Compatibility rating based on
                                            interests and availability
                                        </p>
                                    </div>
                                    <Badge
                                        className={`${getMatchColor(
                                            selectedMatch.matchScore
                                        )} text-lg px-4 py-2`}
                                    >
                                        {selectedMatch.matchScore}%
                                    </Badge>
                                </div>

                                {/* Matching Reasons */}
                                <div className="space-y-3">
                                    <h4 className="flex items-center gap-2">
                                        <Award className="w-4 h-4" />
                                        Why This Match?
                                    </h4>
                                    <ul className="space-y-2">
                                        {selectedMatch.matchingReasons.map(
                                            (reason, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start gap-2 text-sm"
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                                    <span>{reason}</span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>

                                <Separator />

                                {recommendationType === "mahasiswa" ? (
                                    <>
                                        {/* Student Information (Primary) */}
                                        <div className="space-y-4">
                                            <h4 className="flex items-center gap-2">
                                                <GraduationCap className="w-4 h-4" />
                                                Student Information
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        Name
                                                    </p>
                                                    <p>
                                                        {
                                                            selectedMatch.studentName
                                                        }
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        NIM
                                                    </p>
                                                    <p>
                                                        {
                                                            selectedMatch.studentNIM
                                                        }
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        Email
                                                    </p>
                                                    <p className="flex items-center gap-1 text-sm">
                                                        <Mail className="w-3 h-3" />
                                                        {
                                                            selectedMatch.studentEmail
                                                        }
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        GPA
                                                    </p>
                                                    <Badge variant="secondary">
                                                        {
                                                            selectedMatch.studentGPA
                                                        }
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1 col-span-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        Interest Area
                                                    </p>
                                                    <Badge>
                                                        {
                                                            selectedMatch.studentInterest
                                                        }
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1 col-span-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        Description
                                                    </p>
                                                    <p className="text-sm">
                                                        {
                                                            selectedMatch.studentDescription
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Recommended Lecturer (Secondary) */}
                                        <div className="space-y-4">
                                            <h4 className="flex items-center gap-2">
                                                <BookOpen className="w-4 h-4" />
                                                Recommended Lecturer
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        Name
                                                    </p>
                                                    <p>
                                                        {
                                                            selectedMatch.recommendedLecturer
                                                        }
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        NIP
                                                    </p>
                                                    <p>
                                                        {
                                                            selectedMatch.lecturerNIP
                                                        }
                                                    </p>
                                                </div>
                                                <div className="space-y-1 col-span-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        Email
                                                    </p>
                                                    <p className="flex items-center gap-1 text-sm">
                                                        <Mail className="w-3 h-3" />
                                                        {
                                                            selectedMatch.lecturerEmail
                                                        }
                                                    </p>
                                                </div>
                                                <div className="space-y-1 col-span-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        Expertise
                                                    </p>
                                                    <Badge>
                                                        {
                                                            selectedMatch.lecturerExpertise
                                                        }
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1 col-span-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        Description
                                                    </p>
                                                    <p className="text-sm">
                                                        {
                                                            selectedMatch.lecturerDescription
                                                        }
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        Current Students
                                                    </p>
                                                    <p>
                                                        {
                                                            selectedMatch.lecturerCurrentStudents
                                                        }{" "}
                                                        /{" "}
                                                        {
                                                            selectedMatch.lecturerMaxStudents
                                                        }
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        Availability
                                                    </p>
                                                    <Badge
                                                        className={getAvailabilityColor(
                                                            selectedMatch.availability
                                                        )}
                                                    >
                                                        {
                                                            selectedMatch.availability
                                                        }
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Lecturer Information (Primary) */}
                                        <div className="space-y-4">
                                            <h4 className="flex items-center gap-2">
                                                <BookOpen className="w-4 h-4" />
                                                Lecturer Information
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        Name
                                                    </p>
                                                    <p>
                                                        {
                                                            selectedMatch.recommendedLecturer
                                                        }
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        NIP
                                                    </p>
                                                    <p>
                                                        {
                                                            selectedMatch.lecturerNIP
                                                        }
                                                    </p>
                                                </div>
                                                <div className="space-y-1 col-span-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        Email
                                                    </p>
                                                    <p className="flex items-center gap-1 text-sm">
                                                        <Mail className="w-3 h-3" />
                                                        {
                                                            selectedMatch.lecturerEmail
                                                        }
                                                    </p>
                                                </div>
                                                <div className="space-y-1 col-span-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        Expertise
                                                    </p>
                                                    <Badge>
                                                        {
                                                            selectedMatch.lecturerExpertise
                                                        }
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1 col-span-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        Description
                                                    </p>
                                                    <p className="text-sm">
                                                        {
                                                            selectedMatch.lecturerDescription
                                                        }
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        Current Students
                                                    </p>
                                                    <p>
                                                        {
                                                            selectedMatch.lecturerCurrentStudents
                                                        }{" "}
                                                        /{" "}
                                                        {
                                                            selectedMatch.lecturerMaxStudents
                                                        }
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        Availability
                                                    </p>
                                                    <Badge
                                                        className={getAvailabilityColor(
                                                            selectedMatch.availability
                                                        )}
                                                    >
                                                        {
                                                            selectedMatch.availability
                                                        }
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Matched Student (Secondary) */}
                                        <div className="space-y-4">
                                            <h4 className="flex items-center gap-2">
                                                <GraduationCap className="w-4 h-4" />
                                                Matched Student
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        Name
                                                    </p>
                                                    <p>
                                                        {
                                                            selectedMatch.studentName
                                                        }
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        NIM
                                                    </p>
                                                    <p>
                                                        {
                                                            selectedMatch.studentNIM
                                                        }
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        Email
                                                    </p>
                                                    <p className="flex items-center gap-1 text-sm">
                                                        <Mail className="w-3 h-3" />
                                                        {
                                                            selectedMatch.studentEmail
                                                        }
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">
                                                        GPA
                                                    </p>
                                                    <Badge variant="secondary">
                                                        {
                                                            selectedMatch.studentGPA
                                                        }
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1 col-span-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        Interest Area
                                                    </p>
                                                    <Badge>
                                                        {
                                                            selectedMatch.studentInterest
                                                        }
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1 col-span-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        Description
                                                    </p>
                                                    <p className="text-sm">
                                                        {
                                                            selectedMatch.studentDescription
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Action Buttons */}
                                <div className="flex justify-end pt-4">
                                    <Button onClick={handleCloseDialog}>
                                        Close
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
}
