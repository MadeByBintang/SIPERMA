import { useState } from "react";
import { Head, usePage, useForm, router } from "@inertiajs/react"; // Tambahkan useForm
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
import { Textarea } from "@/Components/ui/textarea";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import { Badge } from "@/Components/ui/badge";
import { Switch } from "@/Components/ui/switch";
import { Edit2, Save, Check, X } from "lucide-react";
import { toast } from "sonner";

const expertiseOptions = [
    "Machine Learning", "Data Science", "Artificial Intelligence", "Web Development",
    "Mobile Development", "Cybersecurity", "Software Engineering", "Cloud Computing",
    "Internet of Things", "Blockchain", "Computer Vision", "Natural Language Processing"
];

const academicTitleOptions = [
    "S.Kom", "M.Kom", "M.T", "M.Sc", "Ph.D", "Dr.", "Prof."
];

function removeAcademicTitles(name) {
    if (!name) return "";
    // Regex penjelasan:
    // (^(\w+\.\s+)*) -> Menghapus gelar depan (misal: Dr. Ir. )
    // | -> ATAU
    // (,\s*([a-zA-Z\.]+))+$ -> Menghapus gelar belakang setelah koma (misal: , S.Kom, M.T)
    return name.replace(/(^(\w+\.\s+)*)|(,\s*([a-zA-Z\.]+))+$/g, "").trim();
}

const getInitials = (name) => {
    return name ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase() : "-";
};

export default function LecturerProfilePage({lecturer, supervisedStudents = [], allSkills = []}) {

    const initialData = {
        name: lecturer?.name || "Guest",
        nip: lecturer?.nip || "-",
        studyProgram: "Teknologi Informasi",
        email: lecturer?.email || "-",
        supervision_quota: lecturer?.supervision_quota || "0",
        skills: Array.isArray(lecturer?.skills)
        ? lecturer.skills.map(s => ({
            id: s.id,
            name: s.name,
            level: s.level,
        }))
        : [],
    };

    const { data, setData, post, processing, reset, errors } = useForm({
        skills: initialData.skills,
    });


    const [isEditing, setIsEditing] = useState(false);
    const [open, setOpen] = useState(false);
    const [dropdownSkill, setDropdownSkill] = useState(null);

    // Handle Actions
    const handleEdit = () => setIsEditing(true);

    const handleCancel = () => {
        reset();
        setIsEditing(false);
    };

    const handleSave = () => {
        // Gunakan POST ke route update (karena HTML form method spoofing)
        // Pastikan route 'profile.student.update' ada di web.php
        router.post(route('profile.lecturer.update'), {
            _method: 'post',
            skills: data.skills.map(s => ({
                id: s.id,
                level: s.level ?? 1,
            }))
        }, {
            onSuccess: () => {
                toast.success("Profile updated successfully");
                setIsEditing(false);
            },
            onError: (err) => {
                console.error(err);
                toast.error("Failed to update profile. Check inputs.");
            }
        });
    };


    const toggleSkill = (skill) => {
        const exists = data.skills.find(i => i.id === skill.id);
        if (exists) {
            setData('skills', data.skills.filter(i => i.id !== skill.id));
        } else {
            setData('skills', [...data.skills, skill]);
        }
    };


    const removeSkill = (id) => {
        setData('skills', data.skills.filter(i => i.id !== id));
    };

    const updateSkillLevel = (id, level) => {
        setData('skills', data.skills.map(s => s.id === id ? {...s, level} : s));
    };

    return (
        <MainLayout>
            <Head title="Lecturer Profile" />
            <div className="space-y-6">
                {/* Profile Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Lecturer Profile</CardTitle>
                        {!isEditing ? (
                            <Button onClick={handleEdit} variant="outline" className="gap-2">
                                <Edit2 className="w-4 h-4" /> Edit
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button onClick={handleCancel} variant="outline" className="gap-2" disabled={processing}>
                                    <X className="w-4 h-4" /> Cancel
                                </Button>
                                <Button onClick={handleSave} className="gap-2" disabled={processing}>
                                    <Save className="w-4 h-4" /> {processing ? 'Saving...' : 'Update'}
                                </Button>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-start gap-6 flex-col md:flex-row">
                            <Avatar className="w-24 h-24">
                                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                                    {getInitials(removeAcademicTitles(initialData.name))}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-4 w-full">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={initialData.name}
                                            disabled className="bg-muted"
                                        />
                                        {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nip">NIP</Label>
                                        <Input id="nip" value={initialData.nip} disabled className="bg-muted" />
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input value={initialData.email} disabled className="bg-muted" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Program Studi</Label>
                                        <Input value={initialData.studyProgram} disabled className="bg-muted" />
                                    </div>
                                </div>

                                {/* Description */}
                                {/* <div className="space-y-2">
                                    <Label>About / Description</Label>
                                    <Textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        disabled={!isEditing}
                                        rows={3}
                                    />
                                </div> */}

                                {/* Expertise */}
                                {/* <div className="space-y-3 pt-4 border-t">
                                    <Label>Skill Areas</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {data.skills.map((item) => (
                                            <Badge key={item} variant="secondary" className="gap-1">
                                                {item}
                                                {isEditing && (
                                                    <button onClick={() => removeExpertise(item)}>
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </Badge>
                                        ))}
                                    </div>
                                    {isEditing && (
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" size="sm" className="mt-2">+ Add Expertise</Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0" align="start">
                                                <Command>
                                                    <CommandInput placeholder="Search expertise..." />
                                                    <CommandList>
                                                        <CommandEmpty>No results found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {expertiseOptions.map((exp) => (
                                                                <CommandItem key={exp} onSelect={() => toggleExpertise(exp)}>
                                                                    <div className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${data.skills.includes(exp) ? "bg-primary text-primary-foreground" : "opacity-50"}`}>
                                                                        {data.skills.includes(exp) && <Check className="h-3 w-3" />}
                                                                    </div>
                                                                    {exp}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                </div> */}
                                <div className="space-y-2">
                                    <Label>Skill Areas</Label>
                                    {/* <div className="flex flex-wrap gap-2 p-3 border border-border rounded-lg bg-muted/30 min-h-[3rem]">
                                        {data.skills.length > 0 ? (
                                            data.skills.map((skill) => (
                                                <Badge key={skill.id} variant="secondary" className="gap-1">
                                                    {skill.name} {skill.level}
                                                    {isEditing && (
                                                        <button
                                                            onClick={() => removeSkill(skill.id)}
                                                            className="ml-1 hover:text-red-500"
                                                            type="button"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </Badge>


                                            ))
                                        ) : (
                                            <span className="text-sm text-muted-foreground self-center">No skills selected</span>
                                        )}
                                    </div> */}

                                    <div className="flex flex-wrap gap-2">
                                    {data.skills.map(skill => (
                                        <div key={skill.id} className="relative">
                                        <Badge
                                            variant="secondary"
                                            className="gap-1 cursor-pointer flex items-center"
                                            onClick={() => setDropdownSkill(dropdownSkill === skill.id ? null : skill.id)}
                                        >
                                            {skill.name} (Lvl {skill.level})
                                            {isEditing && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeSkill(skill.id); }}
                                                className="ml-1 hover:text-red-500"
                                                type="button"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                            )}
                                        </Badge>

                                        {/* Dropdown muncul hanya untuk badge yang diklik */}
                                        {isEditing && dropdownSkill === skill.id && (
                                            <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded shadow-md">
                                            {[1,2,3,4,5].map(lvl => (
                                                <div
                                                key={lvl}
                                                className={`px-3 py-1 cursor-pointer hover:bg-gray-100 ${skill.level === lvl ? 'font-bold' : ''}`}
                                                onClick={() => {
                                                    updateSkillLevel(skill.id, lvl);
                                                    setDropdownSkill(null); // tutup dropdown
                                                }}
                                                >
                                                Level {lvl}
                                                </div>
                                            ))}
                                            </div>
                                        )}
                                        </div>
                                    ))}
                                    </div>


                                    {isEditing && (
                                        <div className="mt-2">
                                            <Popover open={open} onOpenChange={setOpen}>
                                                <PopoverTrigger asChild>
                                                    <button
                                                        type="button"
                                                        role="combobox"
                                                        aria-expanded={open}
                                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        Select skills...
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[300px] p-0" align="start">
                                                    <Command>
                                                        <CommandInput placeholder="Search skills..." />
                                                        <CommandList>
                                                            <CommandEmpty>No skill found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {allSkills.map((skill) => {
                                                                    const isSelected = data.skills.some(i => i.id === skill.id);
                                                                    return (
                                                                    <CommandItem
                                                                        key={skill.id}
                                                                        onSelect={() => toggleSkill(skill)}
                                                                    >
                                                                        <div className="flex items-center justify-between w-full">
                                                                            <div className="flex items-center gap-2">
                                                                                <div
                                                                                    className={`w-4 h-4 border rounded flex items-center justify-center ${
                                                                                        isSelected ? "bg-primary border-primary" : "border-input"
                                                                                    }`}
                                                                                >
                                                                                    {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                                                                                </div>
                                                                                <span>{skill.name}</span>
                                                                            </div>
                                                                        </div>
                                                                    </CommandItem>
                                                                )})}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    )}
                                </div>

                                {/* Settings */}
                                <div className="space-y-4 pt-4">
                                    <h4>Supervision Info</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Maximum Quota</Label>
                                            <div className="text-2xl font-bold">{initialData.supervision_quota}</div>
                                            <p className="text-xs text-muted-foreground">
                                                Current: {initialData.supervision_quota} of {initialData.supervision_quota} students
                                            </p>
                                        </div>
                                        {/* <div className="space-y-2">
                                            <Label>Availability</Label>
                                            <div className="flex items-center gap-3 h-10">
                                                <Switch
                                                    checked={data.is_available}
                                                    onCheckedChange={(checked) => setData('is_available', checked)}
                                                    disabled={!isEditing}
                                                />
                                                <span className="text-sm text-muted-foreground">
                                                    {data.is_available ? "Available for new students" : "Not accepting new students"}
                                                </span>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Supervised Students List (Data dari DB) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Currently Supervised Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {supervisedStudents.length > 0 ? (
                                supervisedStudents.map((student) => (
                                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarFallback className="bg-primary text-primary-foreground">
                                                    {student.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4>{student.name}</h4>
                                                <p className="text-sm text-muted-foreground">NIM: {student.nim}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className="text-xs">{student.activityType}</Badge>
                                                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">{student.interest}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge className="bg-green-100 text-green-700">{student.status}</Badge>
                                            <p className="text-sm text-muted-foreground mt-1">Since {student.startDate}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    No students currently supervised.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
