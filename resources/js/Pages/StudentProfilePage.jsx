import { useState } from "react";
import { Head } from "@inertiajs/react";
import MainLayout from "../Layouts/MainLayout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { Label } from "../Components/ui/label";
import { Textarea } from "../Components/ui/textarea";
import { Avatar, AvatarFallback } from "../Components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../Components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../Components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../Components/ui/command";
import { Badge } from "../Components/ui/badge";
import { Edit2, Save, Check, X } from "lucide-react";

const interestOptions = [
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

export default function StudentProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedInterests, setSelectedInterests] = useState([
        "Machine Learning",
        "Data Science",
    ]);
    const [originalInterests, setOriginalInterests] = useState([
        "Machine Learning",
        "Data Science",
    ]);
    const [formData, setFormData] = useState({
        name: "Ahmad Rizki Pratama",
        nim: "2021001234",
        studyProgram: "Information Technology",
        email: "ahmad.rizki@university.edu",
        phone: "+62 812-9876-5432",
        gpa: "3.85",
        semester: "7",
        description:
            "Passionate about AI and its applications in real-world problems. Looking forward to working on innovative research projects.",
    });
    const [originalFormData, setOriginalFormData] = useState({
        name: "Ahmad Rizki Pratama",
        nim: "2021001234",
        studyProgram: "Information Technology",
        email: "ahmad.rizki@university.edu",
        phone: "+62 812-9876-5432",
        gpa: "3.85",
        semester: "7",
        description:
            "Passionate about AI and its applications in real-world problems. Looking forward to working on innovative research projects.",
    });

    const handleEdit = () => {
        // Store current data as original before editing
        setOriginalFormData(formData);
        setOriginalInterests([...selectedInterests]);
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        // Save logic would go here
    };

    const handleCancel = () => {
        // Restore original data
        setFormData(originalFormData);
        setSelectedInterests([...originalInterests]);
        setIsEditing(false);
    };

    const toggleInterest = (interest) => {
        setSelectedInterests((prev) =>
            prev.includes(interest)
                ? prev.filter((i) => i !== interest)
                : [...prev, interest]
        );
    };

    const removeInterest = (interest) => {
        setSelectedInterests((prev) => prev.filter((i) => i !== interest));
    };

    const supervisors = [
        {
            id: 1,
            name: "Dr. Sarah Wijaya, M.Kom",
            expertise: "Machine Learning & AI",
            period: "Sep 2024 - Present",
            status: "Active",
        },
        {
            id: 2,
            name: "Prof. Ahmad Suryanto, Ph.D",
            expertise: "Data Science",
            period: "Jan 2024 - Aug 2024",
            status: "Completed",
        },
    ];

    return (
        <MainLayout>
            <Head title="Student Profile" />
            <div className="space-y-6">
                {/* Profile Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Student Profile</CardTitle>
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
                                    Save
                                </Button>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Profile Picture and Basic Info */}
                        <div className="flex items-start gap-6">
                            <Avatar className="w-24 h-24">
                                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                                    AR
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
                                        <Label htmlFor="nim">NIM</Label>
                                        <Input
                                            id="nim"
                                            value={formData.nim}
                                            disabled
                                            className="bg-muted"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="studyProgram">
                                        Study Program
                                    </Label>
                                    <Input
                                        id="studyProgram"
                                        value={formData.studyProgram}
                                        disabled
                                        className="bg-muted"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="gpa">GPA</Label>
                                        <Input
                                            id="gpa"
                                            value={formData.gpa}
                                            disabled
                                            className="bg-muted"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="semester">
                                            Current Semester
                                        </Label>
                                        <Input
                                            id="semester"
                                            value={formData.semester}
                                            disabled
                                            className="bg-muted"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="interestArea">
                                        Interest Areas
                                    </Label>
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <Popover
                                                open={open}
                                                onOpenChange={setOpen}
                                            >
                                                <PopoverTrigger asChild>
                                                    <button
                                                        type="button"
                                                        role="combobox"
                                                        aria-expanded={open}
                                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        Select interests...
                                                        <span className="ml-2 text-xs text-muted-foreground">
                                                            (
                                                            {
                                                                selectedInterests.length
                                                            }{" "}
                                                            selected)
                                                        </span>
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-full p-0"
                                                    align="start"
                                                >
                                                    <Command>
                                                        <CommandInput placeholder="Search interests..." />
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                No interest
                                                                found.
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                {interestOptions.map(
                                                                    (
                                                                        interest
                                                                    ) => (
                                                                        <CommandItem
                                                                            key={
                                                                                interest
                                                                            }
                                                                            onSelect={() =>
                                                                                toggleInterest(
                                                                                    interest
                                                                                )
                                                                            }
                                                                        >
                                                                            <div className="flex items-center gap-2 flex-1">
                                                                                <div
                                                                                    className={`w-4 h-4 border rounded flex items-center justify-center ${
                                                                                        selectedInterests.includes(
                                                                                            interest
                                                                                        )
                                                                                            ? "bg-primary border-primary"
                                                                                            : "border-input"
                                                                                    }`}
                                                                                >
                                                                                    {selectedInterests.includes(
                                                                                        interest
                                                                                    ) && (
                                                                                        <Check className="w-3 h-3 text-primary-foreground" />
                                                                                    )}
                                                                                </div>
                                                                                <span>
                                                                                    {
                                                                                        interest
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

                                            {/* Selected Interests */}
                                            {selectedInterests.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedInterests.map(
                                                        (interest) => (
                                                            <Badge
                                                                key={interest}
                                                                variant="secondary"
                                                                className="gap-1"
                                                            >
                                                                {interest}
                                                                <button
                                                                    onClick={() =>
                                                                        removeInterest(
                                                                            interest
                                                                        )
                                                                    }
                                                                    className="ml-1 hover:bg-muted rounded-full"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </Badge>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2 p-3 border border-border rounded-lg bg-muted/30">
                                            {selectedInterests.length > 0 ? (
                                                selectedInterests.map(
                                                    (interest) => (
                                                        <Badge
                                                            key={interest}
                                                            variant="secondary"
                                                        >
                                                            {interest}
                                                        </Badge>
                                                    )
                                                )
                                            ) : (
                                                <span className="text-sm text-muted-foreground">
                                                    No interests selected
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

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
                                        placeholder="Write a brief description about yourself, your academic interests, and career goals..."
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Supervisors Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Current & Past Supervisors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {supervisors.map((supervisor) => (
                                <div
                                    key={supervisor.id}
                                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                {supervisor.name
                                                    .substring(0, 2)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h4>{supervisor.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {supervisor.expertise}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {supervisor.period}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        className={
                                            supervisor.status === "Active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-700"
                                        }
                                    >
                                        {supervisor.status}
                                    </Badge>
                                </div>
                            ))}
                            {supervisors.length === 0 && (
                                <p className="text-center text-muted-foreground py-8">
                                    No supervisors assigned yet
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
