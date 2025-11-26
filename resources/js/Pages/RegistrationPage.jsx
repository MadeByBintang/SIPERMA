import { useState } from "react";
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
import { Checkbox } from "../Components/ui/checkbox";
import { Textarea } from "../Components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../Components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../Components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "../Components/ui/tabs";
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
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../Components/ui/alert";
import { toast } from "sonner";
import MainLayout from "@/Layouts/MainLayout";
import { Head, useForm } from "@inertiajs/react";

const FOCUS_LABELS = ["BIG DATA", "MTI", "JARINGAN"];
// Recommended team members based on matching interests
const TeamSelectionCard = ({ members, selectedMembers, onToggle }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Recommended Team Members
            </CardTitle>
            <CardDescription>
                Students with matching interests and expertise for collaboration
            </CardDescription>
        </CardHeader>
        <CardContent>
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
                        {members.length > 0 ? (
                            members.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedMembers.includes(
                                                member.id
                                            )}
                                            disabled={
                                                selectedMembers.length >= 3 &&
                                                !selectedMembers.includes(
                                                    member.id
                                                )
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
                                    colSpan={5}
                                    className="text-center py-4 text-muted-foreground"
                                >
                                    No recommended members found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
    </Card>
);

export default function RegistrationPage({
    studentInfo,
    allSupervisors,
    // filteredSupervisors,
    allMembers,
    // filteredMembers,
    institutions = [],
    // userFocus,
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        activityType: "pkl",

        // PKL
        description: "",
        preferredCompany: "",
        teamMembers: [],
        supervisor: null,

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
        competitionField: "",
        competitionTeam: [],
        competitionSupervisor: null,
    });

    const filteredThesisSup = allSupervisors.filter((s) =>
        data.researchTopics.includes(s.expertise)
    );

    const filteredCompSup = allSupervisors.filter(
        (s) => s.expertise === data.competitionField
    );

    const filteredCompMembers = allMembers.filter(
        (m) => m.interests === data.competitionField
    );

    // Recommended supervisors based on matching expertise
    const SupervisorSelectionCard = ({
        title,
        supervisors,
        selectedId,
        onSelect,
        filterId,
        error,
    }) => {
        const filteredList = filterId
            ? supervisors.filter((s) => s.id !== filterId)
            : supervisors;

        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" /> {title}
                    </CardTitle>
                    <CardDescription>
                        Select a lecturer based on expertise
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border max-h-64 overflow-y-auto">
                        <Table className="table-auto w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16">
                                        Select
                                    </TableHead>
                                    <TableHead className="min-w-40">
                                        Name
                                    </TableHead>
                                    <TableHead className="min-w-40">
                                        Expertise
                                    </TableHead>
                                    <TableHead className="min-w-24">
                                        Quota
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filteredList.length > 0 ? (
                                    filteredList.map((sup) => (
                                        <TableRow key={sup.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={
                                                        selectedId === sup.id
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
                                            colSpan={5}
                                            className="text-center py-4 text-muted-foreground"
                                        >
                                            No supervisors found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {error && (
                        <p className="text-red-500 text-xs mt-2">{error}</p>
                    )}
                </CardContent>
            </Card>
        );
    };

    const handleTabChange = (value) => {
        setData("activityType", value);

        if (value === "pkl") {
            setData("competitionTeam", []);
        } else if (value === "competition") {
            setData("teamMembers", []);
        }
    };

    const handleTeamMemberToggle = (id) => {
        const field =
            data.activityType === "pkl" ? "teamMembers" : "competitionTeam";

        const current = data[field];

        if (current.includes(id)) {
            setData(
                field,
                current.filter((mId) => mId !== id)
            );
        } else {
            if (current.length >= 3) return; // maksimal 4 termasuk leader
            setData(field, [...current, id]);
        }
    };

    // Available research topics
    const researchTopics = FOCUS_LABELS;

    // Competition fields
    const competitionFields = FOCUS_LABELS;

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("registration.store"), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Registration submitted successfully!");
                reset();
            },
            onError: (err) => {
                toast.error(
                    "Failed to submit. Please check the form for errors."
                );
                console.error(err);
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
                        Register for PKL (Internship), Thesis, or Academic
                        Competition
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
                                        <SelectItem value="pkl">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4" />
                                                <span>PKL (Internship)</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="skripsi">
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="w-4 h-4" />
                                                <span>Thesis</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="competition">
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
                                <TabsTrigger value="pkl" className="gap-2">
                                    <Briefcase className="w-4 h-4" />
                                    PKL (Internship)
                                </TabsTrigger>
                                <TabsTrigger value="skripsi" className="gap-2">
                                    <GraduationCap className="w-4 h-4" />
                                    Thesis
                                </TabsTrigger>
                                <TabsTrigger
                                    value="competition"
                                    className="gap-2"
                                >
                                    <Trophy className="w-4 h-4" />
                                    Competition
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* PKL Form */}
                {data.activityType === "pkl" && (
                    <div className="space-y-6">
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>PKL Registration</AlertTitle>
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
                                        <Label htmlFor="pkl-name">
                                            Full Name
                                        </Label>
                                        <Input
                                            id="pkl-name"
                                            value={studentInfo.name}
                                            disabled
                                            className="bg-muted"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="pkl-nim">NIM</Label>
                                        <Input
                                            id="pkl-nim"
                                            value={studentInfo.nim}
                                            disabled
                                            className="bg-muted"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* PKL Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Briefcase className="w-5 h-5" />
                                    PKL Details
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
                                            onCheckedChange={(checked) =>
                                                setData(
                                                    "isNewInstitution",
                                                    checked
                                                )
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
                                        <div className="space-y-2">
                                            <Label>Select Institution</Label>
                                            <Select
                                                value={data.institution_id}
                                                onValueChange={(val) =>
                                                    setData(
                                                        "institution_id",
                                                        val
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Search institution..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {institutions.length > 0 ? (
                                                        institutions.map(
                                                            (inst) => (
                                                                <SelectItem
                                                                    key={
                                                                        inst.internship_id
                                                                    }
                                                                    value={inst.internship_id.toString()}
                                                                >
                                                                    {inst.name}
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
                                    <Label htmlFor="pkl-description">
                                        PKL Description
                                    </Label>
                                    <Textarea
                                        id="pkl-description"
                                        placeholder="Describe your PKL goals, objectives, and what you hope to achieve..."
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
                            </CardContent>
                        </Card>

                        <TeamSelectionCard
                            members={allMembers}
                            selectedMembers={data.teamMembers}
                            onToggle={handleTeamMemberToggle}
                        />

                        <SupervisorSelectionCard
                            title="Recommended PKL Supervisors"
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
                                    : "Submit PKL Registration"}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Thesis Form */}
                {data.activityType === "skripsi" && (
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
                                        <Label htmlFor="thesis-name">
                                            Full Name
                                        </Label>
                                        <Input
                                            id="thesis-name"
                                            value={studentInfo.name}
                                            disabled
                                            className="bg-muted"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="thesis-nim">NIM</Label>
                                        <Input
                                            id="thesis-nim"
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
                                    Provide your thesis title and abstract
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="thesis-title">
                                        Thesis Title
                                    </Label>
                                    <Input
                                        id="thesis-title"
                                        placeholder="Enter your thesis title..."
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="thesis-abstract">
                                        Abstract
                                    </Label>
                                    <Textarea
                                        id="thesis-abstract"
                                        placeholder="Write your thesis abstract here..."
                                        value={data.abstract}
                                        onChange={(e) =>
                                            setData("abstract", e.target.value)
                                        }
                                        rows={6}
                                    />
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
                {data.activityType === "competition" && (
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
                                        <Label htmlFor="comp-nim">NIM</Label>
                                        <Input
                                            id="comp-nim"
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
                                        Competition Name/Activity
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
                                            onValueChange={(val) =>
                                                setData("competitionField", val)
                                            }
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
                                                onClick={() =>
                                                    setData(
                                                        "competitionField",
                                                        ""
                                                    )
                                                }
                                            >
                                                {data.competitionField}
                                                <X className="w-3 h-3 ml-1" />
                                            </Badge>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <TeamSelectionCard
                            members={filteredCompMembers}
                            selectedMembers={data.competitionTeam}
                            onToggle={handleTeamMemberToggle}
                        />

                        <SupervisorSelectionCard
                            title="Recommended Competition Supervisors"
                            supervisors={filteredCompSup}
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
                                    : "Submit Competitiom"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
