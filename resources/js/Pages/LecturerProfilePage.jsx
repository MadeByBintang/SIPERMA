import { useState } from "react";
import { Head, usePage, useForm } from "@inertiajs/react"; // Tambahkan useForm
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

export default function LecturerProfilePage({ supervisedStudents, stats }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const lecturerData = auth.lecturer || {};

    // Parse JSON data dari database (karena disimpan sebagai string JSON)
    const parseJson = (data) => {
        try {
            return typeof data === 'string' ? JSON.parse(data) : (data || []);
        } catch (e) {
            return [];
        }
    };

    const initialTitles = parseJson(lecturerData.academic_titles);
    const initialExpertise = parseJson(lecturerData.expertise);

    const { data, setData, put, processing, errors, reset } = useForm({
        name: user.name || "",
        nip: lecturerData.nip || user.username || "-", // NIP biasanya username dosen
        email: user.email || "",
        //phone: user.phone || "",
        academicTitles: initialTitles,
        expertise: initialExpertise,
        description: lecturerData.description || "",
        office_location: lecturerData.office_location || "",
        quota: lecturerData.quota || 10,
        is_available: Boolean(lecturerData.is_available),
    });

    const [isEditing, setIsEditing] = useState(false);
    const [open, setOpen] = useState(false); // Popover state

    // Handle Actions
    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        reset(); // Kembalikan ke data awal dari props
        setIsEditing(false);
    };

    const handleSave = () => {
        // Kirim data ke controller
        put(route('profile.lecturer.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Profile updated successfully!");
                setIsEditing(false);
            },
            onError: () => {
                toast.error("Failed to update profile.");
            }
        });
    };

    // Logic UI Helper
    const toggleExpertise = (item) => {
        const current = data.expertise;
        const updated = current.includes(item)
            ? current.filter((e) => e !== item)
            : [...current, item];
        setData('expertise', updated);
    };

    const removeExpertise = (item) => {
        setData('expertise', data.expertise.filter((e) => e !== item));
    };

    const addTitle = (title) => {
        if (!data.academicTitles.includes(title)) {
            setData('academicTitles', [...data.academicTitles, title]);
        }
    };

    const removeTitle = (title) => {
        setData('academicTitles', data.academicTitles.filter(t => t !== title));
    };

    const getFullName = () => {
        const titles = data.academicTitles.join(" ");
        return `${titles} ${data.name}`.trim();
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
                                    {data.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-4 w-full">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                        {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nip">NIP</Label>
                                        <Input id="nip" value={data.nip} disabled className="bg-muted" />
                                    </div>
                                </div>

                                {/* Academic Titles */}
                                <div className="space-y-2">
                                    <Label>Academic Titles</Label>
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap gap-2">
                                                {data.academicTitles.map((title) => (
                                                    <Badge key={title} variant="secondary" className="gap-1">
                                                        {title}
                                                        <button onClick={() => removeTitle(title)} className="hover:text-destructive">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </Badge>
                                                ))}
                                            </div>
                                            <Select onValueChange={addTitle}>
                                                <SelectTrigger><SelectValue placeholder="Add title" /></SelectTrigger>
                                                <SelectContent>
                                                    {academicTitleOptions.map((t) => (
                                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {data.academicTitles.map((title) => (
                                                <Badge key={title} variant="secondary">{title}</Badge>
                                            ))}
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground">Preview: {getFullName()}</p>
                                </div>

                                {/* Contact Info */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input value={data.email} disabled className="bg-muted" />
                                    </div>
                                    {/*<div className="space-y-2">
                                        <Label>Phone Number</Label>
                                        <Input
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>*/}
                                    <div className="space-y-2">
                                        <Label>Office Location</Label>
                                        <Input
                                            value={data.office_location}
                                            onChange={(e) => setData('office_location', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label>About / Description</Label>
                                    <Textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        disabled={!isEditing}
                                        rows={3}
                                    />
                                </div>

                                {/* Expertise */}
                                <div className="space-y-3 pt-4 border-t">
                                    <Label>Areas of Expertise</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {data.expertise.map((item) => (
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
                                                                    <div className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${data.expertise.includes(exp) ? "bg-primary text-primary-foreground" : "opacity-50"}`}>
                                                                        {data.expertise.includes(exp) && <Check className="h-3 w-3" />}
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
                                </div>

                                {/* Settings */}
                                <div className="space-y-4 pt-4 border-t">
                                    <h4>Supervision Settings</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Maximum Quota</Label>
                                            <Input
                                                type="number"
                                                value={data.quota}
                                                onChange={(e) => setData('quota', e.target.value)}
                                                disabled={!isEditing}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Current: {stats.current} of {data.quota} students
                                            </p>
                                        </div>
                                        <div className="space-y-2">
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
                                        </div>
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