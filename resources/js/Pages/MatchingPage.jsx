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

const FOCUS_LABELS = {
    "BIG DATA": "Big Data",
    MTI: "Manajemen TI",
    JARINGAN: "Jaringan",
};

export default function MatchingPage({ user, matches = [] }) {
    const userRole = user.role_name;

    const [filterFocus, setFilterFocus] = useState("all");
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [recommendationType, setRecommendationType] = useState(
        userRole === "dosen" ? "students" : "students"
    );

    const handleViewDetails = (match) => {
        setSelectedMatch(match);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedMatch(null);
    };

    const currentList = matches[recommendationType] || [];
    const filteredMatches = currentList.filter((match) => {
        if (filterFocus === "all") return true;

        if (filterFocus === "none") {
            return !match.focus || match.focus === "" || match.focus === "-";
        }

        return match.focus === filterFocus;
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
                                    value={filterFocus}
                                    onValueChange={setFilterFocus}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Focus
                                        </SelectItem>

                                        <SelectItem value="BIG DATA">
                                            Big Data
                                        </SelectItem>
                                        <SelectItem value="MTI">
                                            Manajemen TI
                                        </SelectItem>
                                        <SelectItem value="JARINGAN">
                                            Jaringan
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
                                        value={filterFocus}
                                        onValueChange={setFilterFocus}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Focus
                                            </SelectItem>

                                            <SelectItem value="BIG DATA">
                                                Big Data
                                            </SelectItem>
                                            <SelectItem value="MTI">
                                                Manajemen TI
                                            </SelectItem>
                                            <SelectItem value="JARINGAN">
                                                Jaringan
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border max-h-90 overflow-y-auto">
                            <Table className="w-full text-center">
                                <TableHeader className="[&>tr>th]:text-center">
                                    <TableRow>
                                        {recommendationType === "students" ? (
                                            <>
                                                <TableHead>Student</TableHead>
                                                <TableHead>Interest</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </>
                                        ) : (
                                            <>
                                                <TableHead>Lecturer</TableHead>
                                                <TableHead>Expertise</TableHead>
                                                <TableHead>Actions</TableHead>
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
                                                                    {match.name}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {match.uid}
                                                                </p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                FOCUS_LABELS[
                                                                    match.focus
                                                                ]
                                                            }
                                                        </TableCell>
                                                        <TableCell>
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
                                                                    {match.name}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {match.uid}
                                                                </p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                FOCUS_LABELS[
                                                                    match.focus
                                                                ]
                                                            }
                                                        </TableCell>
                                                        <TableCell>
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
                            <DialogTitle>Detailed Info</DialogTitle>
                            <DialogDescription>
                                Detailed information about the person
                            </DialogDescription>
                        </DialogHeader>

                        {selectedMatch && (
                            <div className="space-y-6">
                                {/* Info Grid */}
                                <div className="ggrid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                                    <div className="space-y-4">
                                        <h4 className="flex items-center gap-2 font-medium border-b pb-2">
                                            {selectedMatch.type ===
                                            "lecturer" ? (
                                                <BookOpen className="w-4 h-4" />
                                            ) : (
                                                <GraduationCap className="w-4 h-4" />
                                            )}
                                            {selectedMatch.type === "lecturer"
                                                ? "Lecturer Profile"
                                                : "Student Profile"}
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <p className="text-sm text-muted-foreground">
                                                    Name
                                                </p>
                                                <p>{selectedMatch.name}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm text-muted-foreground">
                                                    {selectedMatch.type ===
                                                    "student"
                                                        ? "NIM"
                                                        : "NIP"}
                                                </p>
                                                <p>{selectedMatch.uid}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    Email
                                                </p>
                                                <p className="flex items-center gap-1 text-sm">
                                                    <Mail className="w-3 h-3" />
                                                    {selectedMatch.email}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    {selectedMatch.type ===
                                                    "lecturer"
                                                        ? "Expertise"
                                                        : "Interests"}
                                                </p>
                                                <Badge>
                                                    {
                                                        FOCUS_LABELS[
                                                            selectedMatch.focus
                                                        ]
                                                    }
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator />
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={handleCloseDialog}
                                    >
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
