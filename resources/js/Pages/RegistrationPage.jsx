import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/Components/ui/tabs";
import {
    Briefcase,
    GraduationCap,
    Trophy,
    Users,
    BookOpen,
    Info,
    User,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { toast } from "sonner";

// --- SUB-COMPONENTS (Tetap sama, tidak diubah) ---

const TeamSelectionCard = ({ members, selectedMembers, onToggle, getMatchColor }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" /> Recommended Team Members
            </CardTitle>
            <CardDescription>Select students to join your team</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">Select</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>NIM</TableHead>
                            <TableHead>Interests</TableHead>
                            <TableHead>Match</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.length > 0 ? (
                            members.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedMembers.includes(member.id)}
                                            onCheckedChange={() => onToggle(member.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{member.name}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {member.nim}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 flex-wrap">
                                            {member.interests.slice(0, 2).map((int, i) => (
                                                <Badge key={i} variant="outline" className="text-xs">
                                                    {int}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getMatchColor(member.matchScore)}>
                                            {member.matchScore}%
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                                    No recommended members found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
                {selectedMembers.length} member(s) selected
            </p>
        </CardContent>
    </Card>
);

const SupervisorSelectionCard = ({
    title,
    supervisors,
    selectedId,
    onSelect,
    getMatchColor,
    filterId,
    error,
}) => {
    const filteredList = filterId
        ? supervisors.filter((s) => s.id !== filterId)
        : supervisors;

    return (
        <Card className={error ? "border-red-500" : ""}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" /> {title}
                </CardTitle>
                <CardDescription>Select a lecturer based on expertise</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">Select</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Expertise</TableHead>
                                <TableHead>Quota</TableHead>
                                <TableHead>Match</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredList.length > 0 ? (
                                filteredList.map((sup) => (
                                    <TableRow
                                        key={sup.id}
                                        className={
                                            sup.availability !== "Available" ? "opacity-50" : ""
                                        }
                                    >
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedId === sup.id}
                                                onCheckedChange={() => onSelect(sup.id)}
                                                disabled={sup.availability !== "Available"}
                                            />
                                        </TableCell>
                                        <TableCell>{sup.name}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1 flex-wrap">
                                                {sup.expertise.slice(0, 2).map((exp, i) => (
                                                    <Badge key={i} variant="outline" className="text-xs">
                                                        {exp}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {sup.currentStudents}/{sup.maxStudents}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getMatchColor(sup.matchScore)}>
                                                {sup.matchScore}%
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                                        No supervisors found.
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

// --- MAIN COMPONENT ---

export default function RegistrationPage({
    studentInfo,
    recommendedTeamMembers = [],
    recommendedSupervisors = [],
    institutions = [], // TERIMA PROPS BARU
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        activityType: "pkl",
        description: "",
        
        // --- FIELD BARU UNTUK INSTITUTION ---
        institution_id: "",
        isNewInstitution: false, // Toggle Checkbox
        newInstitutionName: "",
        newInstitutionSector: "",
        newInstitutionAddress: "",
        newOwnerName: "",
        newOwnerPhone: "",
        newOwnerEmail: "",
        // ------------------------------------

        teamMembers: [],
        supervisor: null,
        title: "",
        abstract: "",
        mainSupervisor: null,
        assistantSupervisor: null,
        competitionName: "",
        competitionField: "",
    });

    const handleTabChange = (value) => {
        setData("activityType", value);
    };

    const getMatchColor = (score) => {
        if (score >= 90) return "bg-green-100 text-green-700";
        if (score >= 80) return "bg-blue-100 text-blue-700";
        return "bg-yellow-100 text-yellow-700";
    };

    const handleTeamMemberToggle = (id) => {
        const currentMembers = data.teamMembers;
        if (currentMembers.includes(id)) {
            setData(
                "teamMembers",
                currentMembers.filter((mId) => mId !== id)
            );
        } else {
            setData("teamMembers", [...currentMembers, id]);
        }
    };

    const competitionFields = [
        "Machine Learning",
        "Data Science",
        "Web Development",
        "Mobile Development",
        "UI/UX Design",
        "Cybersecurity",
        "IoT & Robotics",
        "Game Development",
        "Business Innovation",
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        
        post(route("registration.store"), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Registration submitted successfully!");
                reset();
            },
            onError: (err) => {
                toast.error("Failed to submit. Please check the form for errors.");
                console.error(err);
            },
        });
    };

    return (
        <MainLayout>
            <Head title="Activity Registration" />
            <div className="space-y-6">
                <div>
                    <h1>Activity Registration</h1>
                    <p className="text-muted-foreground">
                        Register for PKL (Internship), Thesis, or Academic Competition
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Select Activity Type</CardTitle>
                        <CardDescription>
                            Choose the type of activity you want to register for
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={data.activityType} onValueChange={handleTabChange}>
                            
                            {/* Mobile Dropdown */}
                            <div className="md:hidden mb-4">
                                <Select
                                    value={data.activityType}
                                    onValueChange={handleTabChange}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Activity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pkl">PKL (Internship)</SelectItem>
                                        <SelectItem value="skripsi">Thesis</SelectItem>
                                        <SelectItem value="competition">Competition</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Desktop Tabs */}
                            <TabsList className="hidden md:grid w-full grid-cols-3 mb-6">
                                <TabsTrigger value="pkl" className="gap-2">
                                    <Briefcase className="w-4 h-4" /> PKL (Internship)
                                </TabsTrigger>
                                <TabsTrigger value="skripsi" className="gap-2">
                                    <GraduationCap className="w-4 h-4" /> Thesis
                                </TabsTrigger>
                                <TabsTrigger value="competition" className="gap-2">
                                    <Trophy className="w-4 h-4" /> Competition
                                </TabsTrigger>
                            </TabsList>

                            {/* --- PKL FORM --- */}
                            <TabsContent value="pkl" className="space-y-6">
                                <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertTitle>PKL Registration</AlertTitle>
                                    <AlertDescription>
                                        Register for your internship program. Select team members
                                        and a supervisor.
                                    </AlertDescription>
                                </Alert>

                                {/* Personal Info */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="w-5 h-5" /> Personal Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Full Name</Label>
                                                <Input
                                                    value={studentInfo.name}
                                                    disabled
                                                    className="bg-muted"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>NIM</Label>
                                                <Input
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
                                        <CardTitle>PKL Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        
                                        {/* --- BAGIAN INSTITUTION --- */}
                                        <div className="space-y-4 border p-4 rounded-md bg-muted/20">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox 
                                                    id="new-inst" 
                                                    checked={data.isNewInstitution}
                                                    onCheckedChange={(checked) => setData('isNewInstitution', checked)}
                                                />
                                                <Label htmlFor="new-inst" className="font-medium">
                                                    Company/Institution not listed? Register a new one.
                                                </Label>
                                            </div>

                                            {/* Jika Pilih Existing */}
                                            {!data.isNewInstitution && (
                                                <div className="space-y-2">
                                                    <Label>Select Institution</Label>
                                                    <Select
                                                        value={data.institution_id}
                                                        onValueChange={(val) => setData("institution_id", val)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Search institution..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {institutions.length > 0 ? (
                                                                institutions.map((inst) => (
                                                                    <SelectItem key={inst.id} value={inst.id.toString()}>
                                                                        {inst.name}
                                                                    </SelectItem>
                                                                ))
                                                            ) : (
                                                                <div className="p-2 text-sm text-muted-foreground">Empty list</div>
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.institution_id && <p className="text-red-500 text-xs">{errors.institution_id}</p>}
                                                </div>
                                            )}

                                            {/* Jika Register New */}
                                            {data.isNewInstitution && (
                                                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <Label>Company Name *</Label>
                                                            <Input 
                                                                value={data.newInstitutionName} 
                                                                onChange={e => setData('newInstitutionName', e.target.value)} 
                                                                placeholder="PT. Maju Mundur"
                                                            />
                                                            {errors.newInstitutionName && <p className="text-red-500 text-xs">{errors.newInstitutionName}</p>}
                                                        </div>
                                                        <div className="space-y-1">
                                                            <Label>Sector *</Label>
                                                            <Select 
                                                                value={data.newInstitutionSector} 
                                                                onValueChange={val => setData('newInstitutionSector', val)}
                                                            >
                                                                <SelectTrigger><SelectValue placeholder="Select Sector" /></SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Swasta">Swasta (Private)</SelectItem>
                                                                    <SelectItem value="BUMN">BUMN</SelectItem>
                                                                    <SelectItem value="Dinas">Dinas (Government)</SelectItem>
                                                                    <SelectItem value="Startup">Startup</SelectItem>
                                                                    <SelectItem value="Other">Other</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            {errors.newInstitutionSector && <p className="text-red-500 text-xs">{errors.newInstitutionSector}</p>}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <Label>Address (Optional)</Label>
                                                        <Textarea 
                                                            value={data.newInstitutionAddress} 
                                                            onChange={e => setData('newInstitutionAddress', e.target.value)} 
                                                            placeholder="Full office address"
                                                            rows={2}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t">
                                                        <div className="space-y-1">
                                                            <Label>Owner/Mentor Name *</Label>
                                                            <Input 
                                                                value={data.newOwnerName} 
                                                                onChange={e => setData('newOwnerName', e.target.value)} 
                                                                placeholder="Mr. John Doe"
                                                            />
                                                             {errors.newOwnerName && <p className="text-red-500 text-xs">{errors.newOwnerName}</p>}
                                                        </div>
                                                        <div className="space-y-1">
                                                            <Label>Email (Optional)</Label>
                                                            <Input 
                                                                type="email"
                                                                value={data.newOwnerEmail} 
                                                                onChange={e => setData('newOwnerEmail', e.target.value)} 
                                                                placeholder="contact@company.com"
                                                            />
                                                        </div>
                                                        {/*<div className="space-y-1">
                                                            <Label>Phone (Optional)</Label>
                                                            <Input 
                                                                value={data.newOwnerPhone} 
                                                                onChange={e => setData('newOwnerPhone', e.target.value)} 
                                                                placeholder="0812..."
                                                            />
                                                        </div>*/}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {/* --- END BAGIAN INSTITUTION --- */}

                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Textarea
                                                placeholder="Describe your PKL goals..."
                                                rows={4}
                                                value={data.description}
                                                onChange={(e) =>
                                                    setData("description", e.target.value)
                                                }
                                            />
                                            {errors.description && (
                                                <p className="text-red-500 text-xs">
                                                    {errors.description}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <TeamSelectionCard
                                    members={recommendedTeamMembers}
                                    selectedMembers={data.teamMembers}
                                    onToggle={handleTeamMemberToggle}
                                    getMatchColor={getMatchColor}
                                />

                                <SupervisorSelectionCard
                                    title="Select Supervisor"
                                    supervisors={recommendedSupervisors}
                                    selectedId={data.supervisor}
                                    onSelect={(id) => setData("supervisor", id)}
                                    getMatchColor={getMatchColor}
                                    error={errors.supervisor}
                                />

                                <div className="flex justify-end">
                                    <Button onClick={handleSubmit} disabled={processing}>
                                        {processing ? "Submitting..." : "Submit PKL Registration"}
                                    </Button>
                                </div>
                            </TabsContent>

                            {/* --- THESIS FORM (TETAP SAMA) --- */}
                            <TabsContent value="skripsi" className="space-y-6">
                                <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertTitle>Thesis Registration</AlertTitle>
                                    <AlertDescription>
                                        Register for your thesis. Choose main and assistant
                                        supervisors.
                                    </AlertDescription>
                                </Alert>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Thesis Info</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Thesis Title</Label>
                                            <Input
                                                placeholder="Enter thesis title..."
                                                value={data.title}
                                                onChange={(e) => setData("title", e.target.value)}
                                            />
                                            {errors.title && (
                                                <p className="text-red-500 text-xs">
                                                    {errors.title}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Abstract</Label>
                                            <Textarea
                                                placeholder="Write your thesis abstract..."
                                                rows={5}
                                                value={data.abstract}
                                                onChange={(e) =>
                                                    setData("abstract", e.target.value)
                                                }
                                            />
                                            {errors.abstract && (
                                                <p className="text-red-500 text-xs">
                                                    {errors.abstract}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <SupervisorSelectionCard
                                    title="Select Main Supervisor"
                                    supervisors={recommendedSupervisors}
                                    selectedId={data.mainSupervisor}
                                    onSelect={(id) => setData("mainSupervisor", id)}
                                    getMatchColor={getMatchColor}
                                    error={errors.mainSupervisor}
                                />

                                <SupervisorSelectionCard
                                    title="Select Assistant Supervisor (Optional)"
                                    supervisors={recommendedSupervisors}
                                    selectedId={data.assistantSupervisor}
                                    onSelect={(id) => setData("assistantSupervisor", id)}
                                    getMatchColor={getMatchColor}
                                    filterId={data.mainSupervisor} 
                                />

                                <div className="flex justify-end">
                                    <Button onClick={handleSubmit} disabled={processing}>
                                        {processing
                                            ? "Submitting..."
                                            : "Submit Thesis Registration"}
                                    </Button>
                                </div>
                            </TabsContent>

                            {/* --- COMPETITION FORM (TETAP SAMA) --- */}
                            <TabsContent value="competition" className="space-y-6">
                                <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertTitle>Competition</AlertTitle>
                                    <AlertDescription>
                                        Register for academic competitions and form your team.
                                    </AlertDescription>
                                </Alert>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Competition Name</Label>
                                            <Input
                                                placeholder="e.g., National Data Science Competition"
                                                value={data.competitionName}
                                                onChange={(e) =>
                                                    setData("competitionName", e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Field</Label>
                                            <Select
                                                value={data.competitionField}
                                                onValueChange={(val) =>
                                                    setData("competitionField", val)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Field" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {competitionFields.map((f) => (
                                                        <SelectItem key={f} value={f}>
                                                            {f}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </Card>

                                <TeamSelectionCard
                                    members={recommendedTeamMembers}
                                    selectedMembers={data.teamMembers}
                                    onToggle={handleTeamMemberToggle}
                                    getMatchColor={getMatchColor}
                                />

                                <SupervisorSelectionCard
                                    title="Select Supervisor"
                                    supervisors={recommendedSupervisors}
                                    selectedId={data.supervisor}
                                    onSelect={(id) => setData("supervisor", id)}
                                    getMatchColor={getMatchColor}
                                    error={errors.supervisor}
                                />

                                <div className="flex justify-end">
                                    <Button onClick={handleSubmit} disabled={processing}>
                                        {processing ? "Submitting..." : "Submit Competition"}
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}