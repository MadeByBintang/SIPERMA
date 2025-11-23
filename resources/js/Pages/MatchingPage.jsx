import { useState } from "react";
import { Head } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
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
import { Badge } from "@/Components/ui/badge";
import { Info, Mail, BookOpen, GraduationCap, Award } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/Components/ui/dialog";
import { Separator } from "@/Components/ui/separator";

// TERIMA DATA DARI CONTROLLER
export default function MatchingPage({ matches = [], currentUserName, userRole }) {
    const [filterAvailability, setFilterAvailability] = useState("all");
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Helper Warna Skor
    const getMatchColor = (score) => {
        if (score >= 90) return "bg-green-100 text-green-700 hover:bg-green-200";
        if (score >= 80) return "bg-blue-100 text-blue-700 hover:bg-blue-200";
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
    };

    // Helper Warna Ketersediaan
    const getAvailabilityColor = (status) => {
        if (status === "Available") return "bg-green-100 text-green-700 border-green-200";
        if (status === "Limited") return "bg-yellow-100 text-yellow-700 border-yellow-200";
        return "bg-red-100 text-red-700 border-red-200";
    };

    const handleViewDetails = (match) => {
        setSelectedMatch(match);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedMatch(null);
    };

    // Filter data berdasarkan Availability
    const filteredMatches = matches.filter((match) => {
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
                        {userRole === "lecturer"
                            ? `Welcome, ${currentUserName}. Our system recommends students whose interests align with your expertise. Match scores above 90% indicate highly compatible pairings.`
                            : `Welcome, ${currentUserName}. Our system matches you with lecturers based on interest alignment, expertise compatibility, and availability.`}
                    </AlertDescription>
                </Alert>

                {/* Matching Results Table */}
                <Card>
                    <CardHeader>
                        <div className="space-y-4 md:space-y-0 flex flex-col md:flex-row justify-between items-start md:items-center">
                            <CardTitle>
                                {userRole === "lecturer"
                                    ? "Student Recommendations"
                                    : "Recommended Lecturers"}
                            </CardTitle>
                            
                            <div className="w-full md:w-48">
                                <Select
                                    value={filterAvailability}
                                    onValueChange={setFilterAvailability}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="available">Available</SelectItem>
                                        <SelectItem value="limited">Limited</SelectItem>
                                        <SelectItem value="unavailable">Not Available</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {userRole === "student" ? (
                                            // Header untuk Mahasiswa (Melihat Dosen)
                                            <>
                                                <TableHead>Lecturer</TableHead>
                                                <TableHead>Expertise</TableHead>
                                                <TableHead>Match Score</TableHead>
                                                <TableHead>Availability</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </>
                                        ) : (
                                            // Header untuk Dosen (Melihat Mahasiswa)
                                            <>
                                                <TableHead>Student</TableHead>
                                                <TableHead>Interests</TableHead>
                                                {/*<TableHead>GPA</TableHead>*/}
                                                <TableHead>Match Score</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </>
                                        )}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMatches.length > 0 ? (
                                        filteredMatches.map((match) => (
                                            <TableRow key={match.id}>
                                                {userRole === "student" ? (
                                                    // Row Mahasiswa
                                                    <>
                                                        <TableCell>
                                                            <div className="font-medium">{match.recommendedLecturer}</div>
                                                            <div className="text-xs text-muted-foreground">{match.lecturerNIP}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <p className="text-sm max-w-xs line-clamp-2">{match.lecturerExpertise}</p>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={getMatchColor(match.matchScore)}>
                                                                {match.matchScore}%
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className={getAvailabilityColor(match.availability)}>
                                                                {match.availability}
                                                            </Badge>
                                                            <div className="text-xs text-muted-foreground mt-1">
                                                                {match.lecturerCurrentStudents} / {match.lecturerMaxStudents} Students
                                                            </div>
                                                        </TableCell>
                                                    </>
                                                ) : (
                                                    // Row Dosen
                                                    <>
                                                        <TableCell>
                                                            <div className="font-medium">{match.studentName}</div>
                                                            <div className="text-xs text-muted-foreground">{match.studentNIM}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <p className="text-sm max-w-xs line-clamp-2">{match.studentInterest}</p>
                                                        </TableCell>
                                                        <TableCell>
                                                            {/*<Badge variant="secondary">{match.studentGPA}</Badge>*/}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={getMatchColor(match.matchScore)}>
                                                                {match.matchScore}%
                                                            </Badge>
                                                        </TableCell>
                                                    </>
                                                )}
                                                
                                                <TableCell className="text-right">
                                                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(match)}>
                                                        View Analysis
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                No matches found. Try updating your profile/interests.
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
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Match Analysis</DialogTitle>
                            <DialogDescription>
                                Detailed breakdown of compatibility
                            </DialogDescription>
                        </DialogHeader>

                        {selectedMatch && (
                            <div className="space-y-6">
                                {/* Match Score Header */}
                                <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg border">
                                    <div>
                                        <h3 className="font-semibold text-lg">Compatibility Score</h3>
                                        <p className="text-sm text-muted-foreground">Calculated based on skills, interests, and history</p>
                                    </div>
                                    <Badge className={`${getMatchColor(selectedMatch.matchScore)} text-xl px-4 py-2`}>
                                        {selectedMatch.matchScore}% Match
                                    </Badge>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left Side: Target Profile Info */}
                                    <div className="space-y-4">
                                        <h4 className="flex items-center gap-2 font-medium border-b pb-2">
                                            {userRole === "student" ? <BookOpen className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                                            {userRole === "student" ? "Lecturer Profile" : "Student Profile"}
                                        </h4>
                                        <div className="space-y-3 text-sm">
                                            <div>
                                                <span className="text-muted-foreground block text-xs uppercase tracking-wider">Name</span>
                                                <span className="font-medium text-base">
                                                    {userRole === "student" ? selectedMatch.recommendedLecturer : selectedMatch.studentName}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block text-xs uppercase tracking-wider">Email</span>
                                                <div className="flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {userRole === "student" ? selectedMatch.lecturerEmail : selectedMatch.studentEmail}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block text-xs uppercase tracking-wider">
                                                    {userRole === "student" ? "Expertise" : "Interests"}
                                                </span>
                                                <span className="leading-relaxed">
                                                    {userRole === "student" ? selectedMatch.lecturerExpertise : selectedMatch.studentInterest}
                                                </span>
                                            </div>
                                            <div>
                                                 <span className="text-muted-foreground block text-xs uppercase tracking-wider">Description</span>
                                                 <p className="text-muted-foreground">
                                                    {userRole === "student" ? selectedMatch.lecturerDescription : selectedMatch.studentDescription}
                                                 </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side: Matching Reasons */}
                                    {userRole === 'student' && (
                                    <div className="space-y-4">
                                        <h4 className="flex items-center gap-2 font-medium border-b pb-2">
                                            <Award className="w-4 h-4" />
                                            Key Matching Factors
                                        </h4>
                                        <ul className="space-y-3">
                                            {selectedMatch.matchingReasons.map((reason, index) => (
                                                <li key={index} className="flex items-start gap-2 text-sm bg-green-50 p-2 rounded border border-green-100 text-green-800">
                                                    <div className="mt-1">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                                                    </div>
                                                    <span>{reason}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    )}
                                </div>

                                <Separator />
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={handleCloseDialog}>Close</Button>
                                    {/* Button tambahan jika ingin langsung kontak/request */}
                                    {userRole === 'student' && (
                                        <Button>Request Supervision</Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
}