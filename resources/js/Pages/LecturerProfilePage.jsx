import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../components/ui/command";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Edit2, Save, Check, X } from "lucide-react";

const expertiseOptions = [
    "Machine Learning",
    "Data Science",
    "Artificial Intelligence",
    "Web Development",
    "Mobile Development",
    "Cybersecurity",
    "Software Engineering",
    "Cloud Computing",
    "Internet of Things",
    "Blockchain",
    "Computer Vision",
    "Natural Language Processing",
    "Database Systems",
    "Network Security",
    "Game Development",
    "Computer Graphics",
    "Human-Computer Interaction",
    "Information Systems",
    "Distributed Systems",
    "Big Data Analytics",
];

const academicTitleOptions = [
    "S.Kom",
    "M.Kom",
    "M.T",
    "M.Sc",
    "Ph.D",
    "Dr.",
    "Prof.",
];

export default function LecturerProfilePage({ auth }) {
    const [isEditing, setIsEditing] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedExpertise, setSelectedExpertise] = useState([
        "Machine Learning",
        "Artificial Intelligence",
        "Data Science",
    ]);
    const [originalExpertise, setOriginalExpertise] = useState([
        "Machine Learning",
        "Artificial Intelligence",
        "Data Science",
    ]);
    const [formData, setFormData] = useState({
        name: "Sarah Wijaya",
        nip: "198512312010122001",
        academicTitles: ["Dr.", "M.Kom"],
        description:
            "Specializes in deep learning and neural networks with 10+ years of research experience in AI applications. Passionate about mentoring students in cutting-edge AI research and applications.",
        email: "sarah.wijaya@university.edu",
        phone: "+62 812-3456-7890",
        office: "Building A, Room 301",
        quota: "8",
        currentStudents: "6",
        available: true,
    });
    const [originalFormData, setOriginalFormData] = useState({
        name: "Sarah Wijaya",
        nip: "198512312010122001",
        academicTitles: ["Dr.", "M.Kom"],
        description:
            "Specializes in deep learning and neural networks with 10+ years of research experience in AI applications. Passionate about mentoring students in cutting-edge AI research and applications.",
        email: "sarah.wijaya@university.edu",
        phone: "+62 812-3456-7890",
        office: "Building A, Room 301",
        quota: "8",
        currentStudents: "6",
        available: true,
    });

    const handleEdit = () => {
        setOriginalFormData({ ...formData });
        setOriginalExpertise([...selectedExpertise]);
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        // TODO: post ke Laravel pakai Inertia form
        // Inertia.post('/lecturer/profile/update', formData);
    };

    const handleCancel = () => {
        setFormData({ ...originalFormData });
        setSelectedExpertise([...originalExpertise]);
        setIsEditing(false);
    };

    const toggleExpertise = (expertise) => {
        setSelectedExpertise((prev) =>
            prev.includes(expertise)
                ? prev.filter((e) => e !== expertise)
                : [...prev, expertise]
        );
    };

    const removeExpertise = (expertise) => {
        setSelectedExpertise((prev) => prev.filter((e) => e !== expertise));
    };

    const getFullName = () => {
        const titles = formData.academicTitles.join(" ");
        return `${titles} ${formData.name}`.trim();
    };

    const supervisedStudents = [
        {
            id: 1,
            name: "Ahmad Rizki Pratama",
            nim: "2021001234",
            interest: "Machine Learning",
            activityType: "Thesis",
            startDate: "Sep 2024",
            status: "Active",
        },
        {
            id: 2,
            name: "Siti Nurhaliza",
            nim: "2021002345",
            interest: "Data Science",
            activityType: "Thesis",
            startDate: "Sep 2024",
            status: "Active",
        },
        {
            id: 3,
            name: "Budi Santoso",
            nim: "2021003456",
            interest: "AI Applications",
            activityType: "PKL",
            startDate: "Aug 2024",
            status: "Active",
        },
        {
            id: 4,
            name: "Farhan Abdullah",
            nim: "2021006789",
            interest: "Computer Vision",
            activityType: "Thesis",
            startDate: "Jul 2024",
            status: "Active",
        },
        {
            id: 5,
            name: "Gita Permata",
            nim: "2021007890",
            interest: "Cloud Computing",
            activityType: "Thesis",
            startDate: "Sep 2024",
            status: "Active",
        },
        {
            id: 6,
            name: "Dewi Lestari",
            nim: "2021004567",
            interest: "Machine Learning",
            activityType: "Competition",
            startDate: "Oct 2024",
            status: "Active",
        },
    ];

    return (
        <>
            <Head title="Lecturer Profile" />

            <div className="space-y-6 p-6">
                {/* Profile Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Lecturer Profile</CardTitle>
                        {!isEditing ? (
                            <Button
                                onClick={handleEdit}
                                variant="outline"
                                className="gap-2"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleCancel}
                                    variant="outline"
                                    className="gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} className="gap-2">
                                    <Save className="w-4 h-4" />
                                    Update
                                </Button>
                            </div>
                        )}
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Basic Info */}
                        <div className="flex items-start gap-6">
                            <Avatar className="w-24 h-24">
                                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                                    SW
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    name: e.target.value,
                                                })
                                            }
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nip">NIP</Label>
                                        <Input
                                            id="nip"
                                            value={formData.nip}
                                            disabled
                                            className="bg-muted"
                                        />
                                    </div>
                                </div>

                                {/* Academic Titles */}
                                <div className="space-y-2">
                                    <Label>Academic Titles</Label>
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap gap-2">
                                                {formData.academicTitles.map(
                                                    (title) => (
                                                        <Badge
                                                            key={title}
                                                            variant="secondary"
                                                            className="gap-1 px-3 py-1"
                                                        >
                                                            {title}
                                                            <button
                                                                onClick={() =>
                                                                    setFormData(
                                                                        {
                                                                            ...formData,
                                                                            academicTitles:
                                                                                formData.academicTitles.filter(
                                                                                    (
                                                                                        t
                                                                                    ) =>
                                                                                        t !==
                                                                                        title
                                                                                ),
                                                                        }
                                                                    )
                                                                }
                                                                className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </Badge>
                                                    )
                                                )}
                                            </div>
                                            <Select
                                                onValueChange={(value) => {
                                                    if (
                                                        !formData.academicTitles.includes(
                                                            value
                                                        )
                                                    ) {
                                                        setFormData({
                                                            ...formData,
                                                            academicTitles: [
                                                                ...formData.academicTitles,
                                                                value,
                                                            ],
                                                        });
                                                    }
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Add academic title" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {academicTitleOptions.map(
                                                        (title) => (
                                                            <SelectItem
                                                                key={title}
                                                                value={title}
                                                            >
                                                                {title}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.academicTitles.map(
                                                (title) => (
                                                    <Badge
                                                        key={title}
                                                        variant="secondary"
                                                    >
                                                        {title}
                                                    </Badge>
                                                )
                                            )}
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Full name with titles: {getFullName()}
                                    </p>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email: e.target.value,
                                            })
                                        }
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    phone: e.target.value,
                                                })
                                            }
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="office">
                                            Office Location
                                        </Label>
                                        <Input
                                            id="office"
                                            value={formData.office}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    office: e.target.value,
                                                })
                                            }
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        About / Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                        disabled={!isEditing}
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Expertise Section */}
                        <div className="space-y-3 pt-4 border-t border-border">
                            <Label>Areas of Expertise</Label>
                            {isEditing ? (
                                <div className="space-y-3">
                                    <div className="flex flex-wrap gap-2">
                                        {selectedExpertise.map((expertise) => (
                                            <Badge
                                                key={expertise}
                                                variant="secondary"
                                                className="gap-1 px-3 py-1"
                                            >
                                                {expertise}
                                                <button
                                                    onClick={() =>
                                                        removeExpertise(
                                                            expertise
                                                        )
                                                    }
                                                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <button
                                                type="button"
                                                className="flex h-10 w-full items-center justify-start rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent"
                                            >
                                                + Add Expertise Area
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-full p-0"
                                            align="start"
                                        >
                                            <Command>
                                                <CommandInput placeholder="Search expertise areas..." />
                                                <CommandList>
                                                    <CommandEmpty>
                                                        No results found.
                                                    </CommandEmpty>
                                                    <CommandGroup>
                                                        {expertiseOptions.map(
                                                            (expertise) => (
                                                                <CommandItem
                                                                    key={
                                                                        expertise
                                                                    }
                                                                    onSelect={() =>
                                                                        toggleExpertise(
                                                                            expertise
                                                                        )
                                                                    }
                                                                >
                                                                    <div className="flex items-center gap-2 w-full">
                                                                        <div
                                                                            className={`w-4 h-4 border rounded flex items-center justify-center ${
                                                                                selectedExpertise.includes(
                                                                                    expertise
                                                                                )
                                                                                    ? "bg-primary border-primary"
                                                                                    : "border-input"
                                                                            }`}
                                                                        >
                                                                            {selectedExpertise.includes(
                                                                                expertise
                                                                            ) && (
                                                                                <Check className="w-3 h-3 text-primary-foreground" />
                                                                            )}
                                                                        </div>
                                                                        <span>
                                                                            {
                                                                                expertise
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </CommandItem>
                                                            )
                                                        )}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {selectedExpertise.map((expertise) => (
                                        <Badge
                                            key={expertise}
                                            variant="secondary"
                                        >
                                            {expertise}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Supervision Section */}
                        <div className="space-y-4 pt-4 border-t border-border">
                            <h4>Supervision Settings</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="quota">
                                        Maximum Supervision Quota
                                    </Label>
                                    <Input
                                        id="quota"
                                        type="number"
                                        value={formData.quota}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                quota: e.target.value,
                                            })
                                        }
                                        disabled={!isEditing}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Currently supervising:{" "}
                                        {formData.currentStudents} of{" "}
                                        {formData.quota} students
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="available">
                                        Availability for New Students
                                    </Label>
                                    <div className="flex items-center gap-3 h-10">
                                        <Switch
                                            id="available"
                                            checked={formData.available}
                                            onCheckedChange={(checked) =>
                                                setFormData({
                                                    ...formData,
                                                    available: checked,
                                                })
                                            }
                                            disabled={!isEditing}
                                        />
                                        <span className="text-sm text-muted-foreground">
                                            {formData.available
                                                ? "Available"
                                                : "Not Available"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Supervised Students */}
                <Card>
                    <CardHeader>
                        <CardTitle>Currently Supervised Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {supervisedStudents.map((student) => (
                                <div
                                    key={student.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50"
                                >
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                {student.name
                                                    .substring(0, 2)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4>{student.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                NIM: {student.nim}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {student.activityType}
                                                </Badge>
                                                <p className="text-xs text-muted-foreground">
                                                    {student.interest}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge
                                            className={
                                                student.status === "Active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-700"
                                            }
                                        >
                                            {student.status}
                                        </Badge>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Since {student.startDate}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
