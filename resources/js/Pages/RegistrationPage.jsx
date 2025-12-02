import { useState } from "react";
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
import { Checkbox } from "@/Components/ui/checkbox";
import { Textarea } from "@/Components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    Briefcase,
    GraduationCap,
    Trophy,
    Users,
    BookOpen,
    Info,
    CheckCircle2,
    User,
    UserCheck,
    X,
    Search,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { toast } from "sonner";
import MainLayout from "@/Layouts/MainLayout";
import { Head, useForm } from "@inertiajs/react";

const FOCUS_LABELS = ["BIG DATA", "MTI", "JARINGAN"];
// Recommended team members based on matching interests
const TeamSelectionCard = ({
    members,
    selectedMembers,
    onToggle,
    type,
    teamName,
    teamDescription,
    onTeamNameChange,
    onTeamDescriptionChange,
    errors,
}) => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredMembers = members.filter((member) => {
        if (searchQuery === "") return true;

        return (
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.interests?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Recommended Team Members
                </CardTitle>
                <CardDescription>
                    Students with matching interests and expertise for
                    collaboration
                </CardDescription>
                <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Table */}
                <div className="rounded-md border max-h-64 overflow-y-auto">
                    <Table className="table-auto w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">Select</TableHead>
                                <TableHead className="min-w-40">Name</TableHead>
                                <TableHead className="min-w-32">NIM</TableHead>
                                <TableHead className="min-w-48">
                                    Interests
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filteredMembers.length > 0 ? (
                                filteredMembers
                                    .filter((m) => {
                                        if (type === "Internship") {
                                            return ![
                                                "approved",
                                                "completed",
                                                "pending",
                                            ].includes(m?.internship_status);
                                        }
                                        return true;
                                    })
                                    .map((member) => (
                                        <TableRow
                                            key={member.id}
                                            className="cursor-pointer"
                                            onClick={() => onToggle(member.id)}
                                        >
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedMembers.includes(
                                                        member.id
                                                    )}
                                                    disabled={
                                                        selectedMembers.length >=
                                                            3 &&
                                                        !selectedMembers.includes(
                                                            member.id
                                                        )
                                                    }
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                    onCheckedChange={() =>
                                                        onToggle(member.id)
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>{member.name}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {member.nim}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1 flex-wrap">
                                                    {member.interests && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {member.interests}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center py-4 text-muted-foreground"
                                    >
                                        No members found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Team Information - Sekarang di bawah tabel */}
                {selectedMembers.length > 0 && (
                    <div className="space-y-4 p-4 border rounded-lg bg-muted/30 animate-in fade-in slide-in-from-top-2 mt-4">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <Users className="w-4 h-4" />
                            Team Information
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-2">
                                <Label htmlFor="team-name">Team Name *</Label>
                                <Input
                                    id="team-name"
                                    placeholder="Enter your team name..."
                                    value={teamName}
                                    onChange={(e) =>
                                        onTeamNameChange(e.target.value)
                                    }
                                />
                                {errors?.teamName && (
                                    <p className="text-red-500 text-xs">
                                        {errors.teamName}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="team-description">
                                    Team Description *
                                </Label>
                                <Textarea
                                    id="team-description"
                                    placeholder="Describe your team and goals..."
                                    value={teamDescription}
                                    onChange={(e) =>
                                        onTeamDescriptionChange(e.target.value)
                                    }
                                    rows={3}
                                />
                                {errors?.teamDescription && (
                                    <p className="text-red-500 text-xs">
                                        {errors.teamDescription}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// Recommended supervisors based on matching expertise
const SupervisorSelectionCard = ({
    title,
    supervisors,
    selectedId,
    onSelect,
    filterId,
    error,
}) => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredList = filterId
        ? supervisors.filter((s) => s.id !== filterId)
        : supervisors;

    const searchedList = filteredList.filter((sup) => {
        if (searchQuery === "") return true;

        return (
            sup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sup.expertise?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" /> {title}
                </CardTitle>
                <CardDescription>
                    Select a lecturer based on expertise
                </CardDescription>
                <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search supervisors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border max-h-64 overflow-y-auto">
                    <Table className="table-auto w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">Select</TableHead>
                                <TableHead className="min-w-40">Name</TableHead>
                                <TableHead className="min-w-40">
                                    Expertise
                                </TableHead>
                                <TableHead className="min-w-24">
                                    Quota
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {searchedList.length > 0 ? (
                                searchedList.map((sup) => (
                                    <TableRow
                                        key={sup.id}
                                        className="cursor-pointer"
                                        onClick={() => onSelect(sup.id)}
                                    >
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedId === sup.id}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                onCheckedChange={() =>
                                                    onSelect(sup.id)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>{sup.name}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1 flex-wrap">
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {sup.expertise}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {sup.currentStudents}/
                                            {sup.maxStudents}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center py-4 text-muted-foreground"
                                    >
                                        No supervisors found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </CardContent>
        </Card>
    );
};

export default function RegistrationPage({
    studentInfo,
    allSupervisors,
    allMembers,
    institutions = [],
}) {
    const block_internship =
        studentInfo?.internship_status == "approved" ||
        studentInfo?.internship_status == "completed" ||
        studentInfo?.internship_status == "pending";

    const block_thesis =
        studentInfo?.thesis_status == "approved" ||
        studentInfo?.thesis_status == "completed" ||
        studentInfo?.thesis_status == "pending";

    const default_activity_type =
        block_internship && block_thesis
            ? "Competition"
            : block_internship
            ? "Thesis"
            : "Internship";

    const { data, setData, post, processing, errors, reset } = useForm({
        activityType: default_activity_type,
        start_date: "",
        end_date: "",

        // Internship
        description: "",
        preferredCompany: "",
        teamMembers: [],
        supervisor: null,
        teamName: "",
        teamDescription: "",

        // Institution
        institution_id: "",

        isNewInstitution: false,
        newInstitutionName: "",
        newInstitutionSector: "",
        newInstitutionAddress: "",
        newOwnerName: "",
        newOwnerPhone: "",
        newOwnerEmail: "",

        // Thesis
        title: "",
        abstract: "",
        researchTopics: [],
        mainSupervisor: null,

        // Competition
        competitionName: "",
        competitionDescription: "",
        competitionField: "",
        competitionTeam: [],
        competitionSupervisor: null,
        competitionTeamName: "",
        competitionTeamDescription: "",
    });

    // State untuk menyimpan detail institusi yang dipilih
    const [selectedInstitution, setSelectedInstitution] = useState(null);

    // Handler untuk memilih institusi
    const handleInstitutionSelect = (institutionId) => {
        setData("institution_id", Number(institutionId));

        // Cari detail institusi dari data yang ada
        const institution = institutions.find(
            (inst) => inst.internship_id === Number(institutionId)
        );
        setSelectedInstitution(institution);
    };

    // Reset detail saat beralih ke "new institution"
    const handleNewInstitutionToggle = (checked) => {
        setData("isNewInstitution", checked);
        if (checked) {
            setSelectedInstitution(null);
            setData("institution_id", "");
        }
    };

    const filteredThesisSup = allSupervisors.filter((s) =>
        data.researchTopics.includes(s.expertise)
    );

    const filteredCompSup = allSupervisors.filter(
        (s) => s.expertise === data.competitionField
    );

    const filteredCompMembers = allMembers.filter(
        (m) => m.interests === data.competitionField
    );

    const handleTabChange = (value) => {
        setData("activityType", value);

        if (value === "Internship") {
            setData("competitionTeam", []);
        } else if (value === "Competition") {
            setData("teamMembers", []);
        }
    };

    const getMaxEndDate = () => {
        if (!data.start_date) return "";

        const startDate = new Date(data.start_date);
        let maxMonths;

        if (data.activityType === "Internship") {
            maxMonths = 3;
        } else if (data.activityType === "Competition") {
            maxMonths = 2;
        } else if (data.activityType === "Thesis") {
            maxMonths = 6;
        }

        const maxDate = new Date(startDate);
        maxDate.setMonth(maxDate.getMonth() + maxMonths);

        return maxDate.toISOString().split("T")[0];
    };

    const handleTeamMemberToggle = (id) => {
        const field =
            data.activityType === "Internship"
                ? "teamMembers"
                : "competitionTeam";

        const current = data[field];
        // console.log("Selected team members:", data.teamMembers);

        if (current.includes(id)) {
            setData(
                field,
                current.filter((mId) => mId !== id)
            );
        } else {
            if (current.length >= 3) return;
            setData(field, [...current, id]);
        }
    };

    const researchTopics = FOCUS_LABELS;
    const competitionFields = FOCUS_LABELS;

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("registration.store"), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Registration submitted successfully!");
                // reset();
            },
            onError: (err) => {
                Object.values(page.props.errors)
                    .flat()
                    .forEach((msg) => {
                        toast.error(msg);
                    });
            },
        });
    };

    const toggleResearchTopic = (topic) => {
        const currentTopics = data.researchTopics || [];
        if (currentTopics.includes(topic)) {
            // jika diklik lagi, hapus topik
            setData("researchTopics", []);
        } else {
            // pilih topik baru, langsung ganti array dengan 1 item
            setData("researchTopics", [topic]);
        }
    };

    const removeResearchTopic = (topic) => {
        setData("researchTopics", []);
    };

    return (
        <MainLayout>
            <Head title="Activity Registration"></Head>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1>Activity Registration</h1>
                    <p className="text-muted-foreground">
                        Register for Internship, Thesis, or Academic Competition
                    </p>
                </div>

                {/* Activity Type Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle>Select Activity Type</CardTitle>
                        <CardDescription>
                            Choose the type of activity you want to register for
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs
                            value={data.activityType}
                            onValueChange={handleTabChange}
                        >
                            {/* Mobile: Dropdown */}
                            <div className="md:hidden">
                                <Select
                                    value={data.activityType}
                                    onValueChange={handleTabChange}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select an activity type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            value="Internship"
                                            disabled={block_internship}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4" />
                                                <span>Internship</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem
                                            value="Thesis"
                                            disabled={block_thesis}
                                        >
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="w-4 h-4" />
                                                <span>Thesis</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Competition">
                                            <div className="flex items-center gap-2">
                                                <Trophy className="w-4 h-4" />
                                                <span>Competition</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Desktop: Tabs */}
                            <TabsList className="hidden md:grid w-full grid-cols-3">
                                <TabsTrigger
                                    value="Internship"
                                    className="gap-2"
                                    disabled={block_internship}
                                >
                                    <Briefcase className="w-4 h-4" />
                                    Internship
                                </TabsTrigger>
                                <TabsTrigger
                                    value="Thesis"
                                    className="gap-2"
                                    disabled={block_thesis}
                                >
                                    <GraduationCap className="w-4 h-4" />
                                    Thesis
                                </TabsTrigger>
                                <TabsTrigger
                                    value="Competition"
                                    className="gap-2"
                                >
                                    <Trophy className="w-4 h-4" />
                                    Competition
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Internship Form */}
                {data.activityType === "Internship" && (
                    <div className="space-y-6">
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>Internship Registration</AlertTitle>
                            <AlertDescription>
                                Register for your internship program. We'll
                                recommend team members and supervisors based on
                                your interests and expertise alignment.
                            </AlertDescription>
                        </Alert>

                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Personal Information
                                </CardTitle>
                                <CardDescription>
                                    Your basic information from your profile
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="Internship-name">
                                            Full Name
                                        </Label>
                                        <Input
                                            id="Internship-name"
                                            value={studentInfo.name}
                                            disabled
                                            className="bg-muted"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="Internship-nim">
                                            NIM
                                        </Label>
                                        <Input
                                            id="Internship-nim"
                                            value={studentInfo.nim}
                                            disabled
                                            className="bg-muted"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Internship Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Briefcase className="w-5 h-5" />
                                    Internship Details
                                </CardTitle>
                                <CardDescription>
                                    Provide information about your internship
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Your Interests</Label>
                                    <div className="flex gap-2">
                                        <Badge
                                            // key={studentInfo.interests}
                                            variant="secondary"
                                        >
                                            {studentInfo.interests}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="space-y-4 border p-4 rounded-md bg-muted/20">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="new-inst"
                                            checked={data.isNewInstitution}
                                            onCheckedChange={
                                                handleNewInstitutionToggle
                                            }
                                        />
                                        <Label
                                            htmlFor="new-inst"
                                            className="font-medium"
                                        >
                                            Company/Institution not listed?
                                            Register a new one.
                                        </Label>
                                    </div>

                                    {/* Jika Pilih Existing */}
                                    {!data.isNewInstitution && (
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>
                                                    Select Institution
                                                </Label>
                                                <Select
                                                    value={
                                                        data.institution_id
                                                            ? String(
                                                                  data.institution_id
                                                              )
                                                            : ""
                                                    }
                                                    onValueChange={
                                                        handleInstitutionSelect
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Search institution..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {institutions.length >
                                                        0 ? (
                                                            institutions.map(
                                                                (inst) => (
                                                                    <SelectItem
                                                                        key={
                                                                            inst.internship_id
                                                                        }
                                                                        value={inst.internship_id.toString()}
                                                                    >
                                                                        {
                                                                            inst.name
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            )
                                                        ) : (
                                                            <div className="p-2 text-sm text-muted-foreground">
                                                                Empty list
                                                            </div>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {errors.institution_id && (
                                                    <p className="text-red-500 text-xs">
                                                        {errors.institution_id}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Detail Institusi yang Dipilih */}
                                            {selectedInstitution && (
                                                <div className="space-y-3 p-4 bg-muted rounded-md animate-in fade-in slide-in-from-top-2">
                                                    <div className="flex items-center gap-2 text-sm font-semibold">
                                                        <Briefcase className="w-4 h-4" />
                                                        Institution Details
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                        <div>
                                                            <Label className="text-xs text-muted-foreground">
                                                                Company Name
                                                            </Label>
                                                            <p className="font-medium">
                                                                {
                                                                    selectedInstitution.name
                                                                }
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <Label className="text-xs text-muted-foreground">
                                                                Sector
                                                            </Label>
                                                            <p className="font-medium">
                                                                {selectedInstitution.sector ||
                                                                    "-"}
                                                            </p>
                                                        </div>

                                                        {selectedInstitution.address && (
                                                            <div className="md:col-span-2">
                                                                <Label className="text-xs text-muted-foreground">
                                                                    Address
                                                                </Label>
                                                                <p className="font-medium">
                                                                    {
                                                                        selectedInstitution.address
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}

                                                        <div>
                                                            <Label className="text-xs text-muted-foreground">
                                                                Contact Person
                                                            </Label>
                                                            <p className="font-medium">
                                                                {selectedInstitution.owner_name ||
                                                                    "-"}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <Label className="text-xs text-muted-foreground">
                                                                Email
                                                            </Label>
                                                            <p className="font-medium">
                                                                {selectedInstitution.owner_email ||
                                                                    "-"}
                                                            </p>
                                                        </div>

                                                        {selectedInstitution.owner_phone && (
                                                            <div>
                                                                <Label className="text-xs text-muted-foreground">
                                                                    Phone
                                                                </Label>
                                                                <p className="font-medium">
                                                                    {
                                                                        selectedInstitution.owner_phone
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Jika Register New */}
                                    {data.isNewInstitution && (
                                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <Label>
                                                        Company Name *
                                                    </Label>
                                                    <Input
                                                        value={
                                                            data.newInstitutionName
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "newInstitutionName",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="PT. Maju Mundur"
                                                    />
                                                    {errors.newInstitutionName && (
                                                        <p className="text-red-500 text-xs">
                                                            {
                                                                errors.newInstitutionName
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <Label>Sector *</Label>
                                                    <Select
                                                        value={
                                                            data.newInstitutionSector
                                                        }
                                                        onValueChange={(val) =>
                                                            setData(
                                                                "newInstitutionSector",
                                                                val
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Sector" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Swasta">
                                                                Swasta (Private)
                                                            </SelectItem>
                                                            <SelectItem value="BUMN">
                                                                BUMN
                                                            </SelectItem>
                                                            <SelectItem value="Dinas">
                                                                Dinas
                                                                (Government)
                                                            </SelectItem>
                                                            <SelectItem value="Startup">
                                                                Startup
                                                            </SelectItem>
                                                            <SelectItem value="Other">
                                                                Other
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.newInstitutionSector && (
                                                        <p className="text-red-500 text-xs">
                                                            {
                                                                errors.newInstitutionSector
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <Label>
                                                    Address (Optional)
                                                </Label>
                                                <Textarea
                                                    value={
                                                        data.newInstitutionAddress
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "newInstitutionAddress",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Full office address"
                                                    rows={2}
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t">
                                                <div className="space-y-1">
                                                    <Label>
                                                        Owner/Mentor Name *
                                                    </Label>
                                                    <Input
                                                        value={
                                                            data.newOwnerName
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "newOwnerName",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Mr. John Doe"
                                                    />
                                                    {errors.newOwnerName && (
                                                        <p className="text-red-500 text-xs">
                                                            {
                                                                errors.newOwnerName
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <Label>
                                                        Email (Optional)
                                                    </Label>
                                                    <Input
                                                        type="email"
                                                        value={
                                                            data.newOwnerEmail
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "newOwnerEmail",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="contact@company.com"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="Internship-description">
                                        Internship Description
                                    </Label>
                                    <Textarea
                                        id="Internship-description"
                                        placeholder="Describe your Internship goals, objectives, and what you hope to achieve..."
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        rows={4}
                                    />
                                </div>

                                {/* Start & End Date side by side */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="Internship-start">
                                            Start Date *
                                        </Label>
                                        <Input
                                            id="Internship-start"
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) =>
                                                setData(
                                                    "start_date",
                                                    e.target.value
                                                )
                                            }
                                            min={
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                            max={
                                                new Date(
                                                    Date.now() +
                                                        10 * 24 * 60 * 60 * 1000
                                                )
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                            required
                                        />
                                        {errors.start_date && (
                                            <p className="text-red-500 text-xs">
                                                {errors.start_date}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="Internship-end">
                                            End Date *
                                        </Label>
                                        <Input
                                            id="Internship-end"
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) =>
                                                setData(
                                                    "end_date",
                                                    e.target.value
                                                )
                                            }
                                            min={
                                                data.start_date ||
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                            max={getMaxEndDate()}
                                            required
                                        />
                                        {errors.end_date && (
                                            <p className="text-red-500 text-xs">
                                                {errors.end_date}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <TeamSelectionCard
                            members={allMembers}
                            selectedMembers={data.teamMembers}
                            onToggle={handleTeamMemberToggle}
                            type="Internship"
                            teamName={data.teamName}
                            teamDescription={data.teamDescription}
                            onTeamNameChange={(val) => setData("teamName", val)}
                            onTeamDescriptionChange={(val) =>
                                setData("teamDescription", val)
                            }
                            errors={errors}
                        />

                        <SupervisorSelectionCard
                            title="Recommended Internship Supervisors"
                            supervisors={allSupervisors}
                            selectedId={data.supervisor}
                            onSelect={(id) => setData("supervisor", id)}
                            error={errors.supervisor}
                        />

                        {/* Submit Button */}
                        <div className="flex justify-end gap-3">
                            <Button
                                onClick={handleSubmit}
                                disabled={processing}
                            >
                                {processing
                                    ? "Submitting..."
                                    : "Submit Internship Registration"}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Thesis Form */}
                {data.activityType === "Thesis" && (
                    <div className="space-y-6">
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>Thesis Registration</AlertTitle>
                            <AlertDescription>
                                Register for your thesis project. Select your
                                research topics, and we'll recommend main
                                supervisors based on your interests.
                            </AlertDescription>
                        </Alert>

                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Personal Information
                                </CardTitle>
                                <CardDescription>
                                    Your basic information from your profile
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="Thesis-name">
                                            Full Name
                                        </Label>
                                        <Input
                                            id="Thesis-name"
                                            value={studentInfo.name}
                                            disabled
                                            className="bg-muted"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="Thesis-nim">NIM</Label>
                                        <Input
                                            id="Thesis-nim"
                                            value={studentInfo.nim}
                                            disabled
                                            className="bg-muted"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Thesis Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <GraduationCap className="w-5 h-5" />
                                    Thesis Details
                                </CardTitle>
                                <CardDescription>
                                    Provide your thesis title and description
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="thesis-title">
                                        Thesis Title *
                                    </Label>
                                    <Input
                                        id="thesis-title"
                                        placeholder="Enter your thesis title..."
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                    />
                                    {errors.title && (
                                        <p className="text-red-500 text-xs">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="thesis-abstract">
                                        Description *
                                    </Label>
                                    <Textarea
                                        id="thesis-abstract"
                                        placeholder="Write your thesis abstract here (min. 50 characters)..."
                                        value={data.abstract}
                                        onChange={(e) =>
                                            setData("abstract", e.target.value)
                                        }
                                        rows={6}
                                    />
                                    {errors.abstract && (
                                        <p className="text-red-500 text-xs">
                                            {errors.abstract}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Research Topics</CardTitle>
                                <CardDescription>
                                    Select a research topic related to your
                                    thesis
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {data.researchTopics.length === 0 ? (
                                    // Dropdown muncul jika belum ada topik yang dipilih
                                    <div className="space-y-2">
                                        <Label>Select Topic</Label>
                                        <Select
                                            onValueChange={toggleResearchTopic}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose research topic..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {researchTopics.map((topic) => (
                                                    <SelectItem
                                                        key={topic}
                                                        value={topic}
                                                    >
                                                        {topic}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ) : (
                                    // Tampilkan badge saat sudah memilih topik
                                    <div className="space-y-2">
                                        <Label>Selected Topic</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {data.researchTopics.map(
                                                (topic) => (
                                                    <Badge
                                                        key={topic}
                                                        variant="secondary"
                                                        className="gap-1 cursor-pointer"
                                                        onClick={() =>
                                                            removeResearchTopic(
                                                                topic
                                                            )
                                                        }
                                                    >
                                                        {topic}
                                                        <X className="w-3 h-3 ml-1" />
                                                    </Badge>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                                {errors.researchTopics && (
                                    <p className="text-red-500 text-xs mt-2">
                                        {errors.researchTopics}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <SupervisorSelectionCard
                            title="Recommended Thesis Supervisors"
                            supervisors={filteredThesisSup}
                            selectedId={data.mainSupervisor}
                            onSelect={(id) => setData("mainSupervisor", id)}
                            error={errors.mainSupervisor}
                        />

                        {/* Submit Button */}
                        <div className="flex justify-end gap-3">
                            <Button
                                onClick={handleSubmit}
                                disabled={processing}
                            >
                                {processing
                                    ? "Submitting..."
                                    : "Submit Thesis Registration"}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Competition Form */}
                {data.activityType === "Competition" && (
                    <div className="space-y-6">
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>Competition Registration</AlertTitle>
                            <AlertDescription>
                                Register for academic competitions. Form teams
                                with matching skills and get supervisor support.
                            </AlertDescription>
                        </Alert>

                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Personal Information
                                </CardTitle>
                                <CardDescription>
                                    Your basic information from your profile
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="comp-name">
                                            Full Name
                                        </Label>
                                        <Input
                                            id="comp-name"
                                            value={studentInfo.name}
                                            disabled
                                            className="bg-muted"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="Comp-nim">NIM</Label>
                                        <Input
                                            id="Comp-nim"
                                            value={studentInfo.nim}
                                            disabled
                                            className="bg-muted"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Competition Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="w-5 h-5" />
                                    Competition Details
                                </CardTitle>
                                <CardDescription>
                                    Provide information about the competition
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Competition Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="comp-title">
                                        Competition Name/Activity *
                                    </Label>
                                    <Input
                                        id="comp-title"
                                        placeholder="e.g., National Data Science Competition 2025"
                                        value={data.competitionName}
                                        onChange={(e) =>
                                            setData(
                                                "competitionName",
                                                e.target.value
                                            )
                                        }
                                    />
                                    {errors.competitionName && (
                                        <p className="text-red-500 text-xs">
                                            {errors.competitionName}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="comp-description">
                                        Competition Description *
                                    </Label>
                                    <Textarea
                                        id="comp-description"
                                        placeholder="Describe the competition, objectives, and what you hope to achieve..."
                                        value={data.competitionDescription}
                                        onChange={(e) =>
                                            setData(
                                                "competitionDescription",
                                                e.target.value
                                            )
                                        }
                                        rows={4}
                                    />
                                    {errors.competitionDescription && (
                                        <p className="text-red-500 text-xs">
                                            {errors.competitionDescription}
                                        </p>
                                    )}
                                </div>

                                {/* Competition Field */}
                                {!data.competitionField ? (
                                    // Dropdown muncul jika belum ada pilihan
                                    <div className="space-y-2">
                                        <Label htmlFor="comp-field">
                                            Competition Field
                                        </Label>
                                        <Select
                                            value=""
                                            onValueChange={(val) => {
                                                setData(
                                                    "competitionField",
                                                    val
                                                );
                                                setData("competitionTeam", []);
                                            }}
                                        >
                                            <SelectTrigger id="comp-field">
                                                <SelectValue placeholder="Select competition field..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {competitionFields.map(
                                                    (field) => (
                                                        <SelectItem
                                                            key={field}
                                                            value={field}
                                                        >
                                                            {field}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ) : (
                                    // Tampilkan badge saat sudah memilih
                                    <div className="space-y-2">
                                        <Label>Competition Field</Label>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge
                                                variant="secondary"
                                                className="gap-1 cursor-pointer"
                                                onClick={() => {
                                                    setData(
                                                        "competitionField",
                                                        ""
                                                    );
                                                    setData(
                                                        "competitionTeam",
                                                        []
                                                    );
                                                }}
                                            >
                                                {data.competitionField}
                                                <X className="w-3 h-3 ml-1" />
                                            </Badge>
                                        </div>
                                    </div>
                                )}
                                {errors.competitionField && (
                                    <p className="text-red-500 text-xs mt-2">
                                        {errors.competitionField}
                                    </p>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="comp-start">
                                            Start Date
                                        </Label>
                                        <Input
                                            id="comp-start"
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) =>
                                                setData(
                                                    "start_date",
                                                    e.target.value
                                                )
                                            }
                                            min={
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                            max={
                                                new Date(
                                                    Date.now() +
                                                        10 * 24 * 60 * 60 * 1000
                                                )
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                            required
                                        />
                                        {errors.start_date && (
                                            <p className="text-red-500 text-xs">
                                                {errors.start_date}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="comp-end">
                                            End Date
                                        </Label>
                                        <Input
                                            id="comp-end"
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) =>
                                                setData(
                                                    "end_date",
                                                    e.target.value
                                                )
                                            }
                                            min={
                                                data.start_date ||
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                            max={getMaxEndDate()}
                                            required
                                        />
                                        {errors.end_date && (
                                            <p className="text-red-500 text-xs">
                                                {errors.end_date}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <TeamSelectionCard
                            members={filteredCompMembers}
                            selectedMembers={data.competitionTeam}
                            onToggle={handleTeamMemberToggle}
                            type="Competition"
                            teamName={data.competitionTeamName}
                            teamDescription={data.competitionTeamDescription}
                            onTeamNameChange={(val) =>
                                setData("competitionTeamName", val)
                            }
                            onTeamDescriptionChange={(val) =>
                                setData("competitionTeamDescription", val)
                            }
                            errors={errors}
                        />

                        <SupervisorSelectionCard
                            title="Recommended Competition Supervisors"
                            supervisors={filteredCompSup}
                            selectedId={data.competitionSupervisor}
                            onSelect={(id) =>
                                setData("competitionSupervisor", id)
                            }
                            error={errors.competitionSupervisor}
                        />

                        {/* Submit Button */}
                        <div className="flex justify-end gap-3">
                            <Button
                                onClick={handleSubmit}
                                disabled={processing}
                            >
                                {processing
                                    ? "Submitting..."
                                    : "Submit Competition Registration"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
