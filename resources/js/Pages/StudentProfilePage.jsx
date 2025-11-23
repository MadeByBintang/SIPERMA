import { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
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
import { Edit2, Save, Check, X } from "lucide-react";
import { toast } from "sonner";

export default function StudentProfilePage({ student, supervisors = [], allSkills = [] }) {
    const [isEditing, setIsEditing] = useState(false);
    const [open, setOpen] = useState(false);

    // 1. ROBUST INITIAL DATA: Pastikan semua field ada nilainya
    const initialData = {
        name: student?.name || "Guest",
        nim: student?.nim || "-",
        studyProgram: student?.studyProgram || "-",
        email: student?.email || "-",
        //phone: student?.phone || "",
        //gpa: student?.gpa || "0.00",
        semester: student?.semester || "1",
        description: student?.description || "",
        interests: Array.isArray(student?.interests) ? student.interests : [],
    };

    // 2. SETUP FORM INERTIA
    const { data, setData, post, processing, reset, errors } = useForm({
        //phone: initialData.phone,
        description: initialData.description,
        interests: initialData.interests,
        
        // Field Read-Only (disimpan di state form hanya untuk display, tidak dikirim ke server via update)
        // Atau jika ingin dikirim untuk validasi, pastikan backend handle-nya (biasanya ignored)
        _name: initialData.name, 
        _nim: initialData.nim,
        _studyProgram: initialData.studyProgram,
        _email: initialData.email,
        _gpa: initialData.gpa,
        _semester: initialData.semester,
    });

    // Handlers
    const handleEdit = () => setIsEditing(true);
    
    const handleCancel = () => {
        reset(); // Reset form ke nilai awal
        setIsEditing(false);
    };

    const handleSave = () => {
        // Gunakan POST ke route update (karena HTML form method spoofing)
        // Pastikan route 'profile.student.update' ada di web.php
        router.post(route('profile.student.update'), {
            _method: 'put', // Method spoofing untuk PUT
            //phone: data.phone,
            description: data.description,
            interests: data.interests,
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

    const toggleInterest = (interest) => {
        const current = data.interests;
        const updated = current.includes(interest)
            ? current.filter((i) => i !== interest)
            : [...current, interest];
        setData('interests', updated);
    };

    const removeInterest = (interest) => {
        setData('interests', data.interests.filter((i) => i !== interest));
    };

    // Helper untuk Avatar Initial
    const getInitials = (name) => {
        return name ? name.substring(0, 2).toUpperCase() : "ST";
    };

    return (
        <MainLayout>
            <Head title="Student Profile" />
            <div className="space-y-6">
                
                {/* Profile Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Student Profile</CardTitle>
                        {!isEditing ? (
                            <Button onClick={handleEdit} variant="outline" className="gap-2">
                                <Edit2 className="w-4 h-4" /> Edit
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button onClick={handleCancel} variant="outline" className="gap-2">
                                    <X className="w-4 h-4" /> Cancel
                                </Button>
                                <Button onClick={handleSave} className="gap-2" disabled={processing}>
                                    <Save className="w-4 h-4" /> {processing ? "Saving..." : "Save"}
                                </Button>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col md:flex-row items-start gap-6">
                            {/* Avatar */}
                            <Avatar className="w-24 h-24">
                                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                                    {getInitials(initialData.name)}
                                </AvatarFallback>
                            </Avatar>

                            {/* Form Fields */}
                            <div className="flex-1 space-y-4 w-full">
                                {/* Read Only Fields */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Full Name</Label>
                                        <Input value={initialData.name} disabled className="bg-muted" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>NIM</Label>
                                        <Input value={initialData.nim} disabled className="bg-muted" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Study Program</Label>
                                    <Input value={initialData.studyProgram} disabled className="bg-muted" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input value={initialData.email} disabled className="bg-muted" />
                                    </div>
                                    
                                    {/* Editable Field: Phone */}
                                    {/*<div className="space-y-2">
                                        <Label>Phone Number</Label>
                                        <Input 
                                            value={data.phone} 
                                            onChange={e => setData('phone', e.target.value)}
                                            disabled={!isEditing}
                                            placeholder="+62..."
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                                    </div>*/}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>GPA</Label>
                                        <Input value={initialData.gpa} disabled className="bg-muted" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Semester</Label>
                                        <Input value={initialData.semester} disabled className="bg-muted" />
                                    </div>
                                </div>

                                {/* Editable Field: Interest Areas */}
                                <div className="space-y-2">
                                    <Label>Interest Areas</Label>
                                    <div className="flex flex-wrap gap-2 p-3 border border-border rounded-lg bg-muted/30 min-h-[3rem]">
                                        {data.interests.length > 0 ? (
                                            data.interests.map((interest) => (
                                                <Badge key={interest} variant="secondary" className="gap-1">
                                                    {interest}
                                                    {isEditing && (
                                                        <button 
                                                            onClick={() => removeInterest(interest)} 
                                                            className="ml-1 hover:text-red-500"
                                                            type="button"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-sm text-muted-foreground self-center">No interests selected</span>
                                        )}
                                    </div>
                                    
                                    {isEditing && (
                                        <div className="mt-2">
                                            <Popover open={open} onOpenChange={setOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="w-full justify-between font-normal">
                                                        Select interests...
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[300px] p-0" align="start">
                                                    <Command>
                                                        <CommandInput placeholder="Search interests..." />
                                                        <CommandList>
                                                            <CommandEmpty>No interest found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {allSkills.map((skill) => (
                                                                    <CommandItem key={skill} onSelect={() => toggleInterest(skill)}>
                                                                        <div className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${data.interests.includes(skill) ? "bg-primary text-primary-foreground" : "opacity-50"}`}>
                                                                            {data.interests.includes(skill) && <Check className="h-3 w-3" />}
                                                                        </div>
                                                                        {skill}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    )}
                                </div>

                                {/* Editable Field: Description */}
                                <div className="space-y-2">
                                    <Label>About / Description</Label>
                                    <Textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        disabled={!isEditing}
                                        rows={3}
                                        placeholder="Describe your academic interests..."
                                    />
                                    {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Supervisors History Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Supervision History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {supervisors.length > 0 ? supervisors.map((supervisor) => (
                                <div key={supervisor.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                {getInitials(supervisor.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h4 className="font-medium">{supervisor.name}</h4>
                                            <p className="text-sm text-muted-foreground">{supervisor.expertise}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{supervisor.period}</p>
                                        </div>
                                    </div>
                                    <Badge variant={supervisor.status === "Active" ? "default" : "secondary"}>
                                        {supervisor.status}
                                    </Badge>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
                                    <p>No supervision history found.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}