import { useState } from "react";
import { Head } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
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
export default function MatchingPage({
    matches = [],
    currentUserName,
    userRole,
}) {
    const [filterAvailability, setFilterAvailability] = useState("all");
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [recommendationType, setRecommendationType] = useState(
        userRole === "lecturer" ? "students" : "students"
    );

    // Helper Warna Skor
    const getMatchColor = (score) => {
        if (score >= 90)
            return "bg-green-100 text-green-700 hover:bg-green-200";
        if (score >= 80) return "bg-blue-100 text-blue-700 hover:bg-blue-200";
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
    };

    // Helper Warna Ketersediaan
    const getAvailabilityColor = (status) => {
        if (status === "Available")
            return "bg-green-100 text-green-700 border-green-200";
        if (status === "Limited")
            return "bg-yellow-100 text-yellow-700 border-yellow-200";
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
                                    {userRole === "lecturer"
                                        ? "Student Recommendations"
                                        : "Recommended Matches"}
                                </CardTitle>
                                {/* Only show recommendation type dropdown for students */}
                                {userRole === "student" && (
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
                                            <SelectItem value="students">
                                                Student Recommendations
                                            </SelectItem>
                                            <SelectItem value="lecturers">
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
                                                <SelectItem value="students">
                                                    Student Recommendations
                                                </SelectItem>
                                                <SelectItem value="lecturers">
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
                                        {recommendationType === "students" ? (
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
                                                "students" ? (
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
                                        <h3 className="font-semibold text-lg">
                                            Compatibility Score
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Calculated based on skills,
                                            interests, and history
                                        </p>
                                    </div>
                                    <Badge
                                        className={`${getMatchColor(
                                            selectedMatch.matchScore
                                        )} text-xl px-4 py-2`}
                                    >
                                        {selectedMatch.matchScore}% Match
                                    </Badge>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left Side: Target Profile Info */}
                                    <div className="space-y-4">
                                        <h4 className="flex items-center gap-2 font-medium border-b pb-2">
                                            {userRole === "mahasiswa" ? (
                                                <BookOpen className="w-4 h-4" />
                                            ) : (
                                                <GraduationCap className="w-4 h-4" />
                                            )}
                                            {userRole === "mahasiswa"
                                                ? "Lecturer Profile"
                                                : "Student Profile"}
                                        </h4>
                                        <div className="space-y-3 text-sm">
                                            <div>
                                                <span className="text-muted-foreground block text-xs uppercase tracking-wider">
                                                    Name
                                                </span>
                                                <span className="font-medium text-base">
                                                    {userRole === "mahasiswa"
                                                        ? selectedMatch.recommendedLecturer
                                                        : selectedMatch.studentName}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block text-xs uppercase tracking-wider">
                                                    Email
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {userRole === "mahasiswa"
                                                        ? selectedMatch.lecturerEmail
                                                        : selectedMatch.studentEmail}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block text-xs uppercase tracking-wider">
                                                    {userRole === "mahasiswa"
                                                        ? "Expertise"
                                                        : "Interests"}
                                                </span>
                                                <span className="leading-relaxed">
                                                    {userRole === "mahasiswa"
                                                        ? selectedMatch.lecturerExpertise
                                                        : selectedMatch.studentInterest}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block text-xs uppercase tracking-wider">
                                                    Description
                                                </span>
                                                <p className="text-muted-foreground">
                                                    {userRole === "mahasiswa"
                                                        ? selectedMatch.lecturerDescription
                                                        : selectedMatch.studentDescription}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side: Matching Reasons */}
                                    {userRole === "mahasiswa" && (
                                        <div className="space-y-4">
                                            <h4 className="flex items-center gap-2 font-medium border-b pb-2">
                                                <Award className="w-4 h-4" />
                                                Key Matching Factors
                                            </h4>
                                            <ul className="space-y-3">
                                                {selectedMatch.matchingReasons.map(
                                                    (reason, index) => (
                                                        <li
                                                            key={index}
                                                            className="flex items-start gap-2 text-sm bg-green-50 p-2 rounded border border-green-100 text-green-800"
                                                        >
                                                            <div className="mt-1">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                                                            </div>
                                                            <span>
                                                                {reason}
                                                            </span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <Separator />
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={handleCloseDialog}
                                    >
                                        Close
                                    </Button>
                                    {/* Button tambahan jika ingin langsung kontak/request */}
                                    {userRole === "mahasiswa" && (
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
