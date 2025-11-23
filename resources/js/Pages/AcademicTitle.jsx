import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/Components/ui/table";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/Components/ui/dialog";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/Components/ui/AlertDialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/Components/ui/select";
import { Plus, Edit, Trash2, BookType } from "lucide-react";
import { toast } from "sonner";

export default function AcademicTitlePage({ titles = [] }) {
    // Dialog States
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    
    // Data States
    const [selectedTitle, setSelectedTitle] = useState(null);
    const [formData, setFormData] = useState({ name: "", type: "back" }); // Default 'back' (Gelar Belakang)

    // --- HANDLERS ---

    const openAddDialog = () => {
        setSelectedTitle(null);
        setFormData({ name: "", type: "back" });
        setIsDialogOpen(true);
    };

    const openEditDialog = (title) => {
        setSelectedTitle(title);
        setFormData({ name: title.name, type: title.type });
        setIsDialogOpen(true);
    };

    const openDeleteDialog = (title) => {
        setSelectedTitle(title);
        setIsDeleteDialogOpen(true);
    };

    const handleSubmit = () => {
        if (selectedTitle) {
            // Update
            router.put(route('admin.academic-titles.update', selectedTitle.id), formData, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    toast.success("Title updated successfully");
                },
                onError: () => toast.error("Failed to update title")
            });
        } else {
            // Create
            router.post(route('admin.academic-titles.store'), formData, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    toast.success("Title created successfully");
                },
                onError: () => toast.error("Failed to create title")
            });
        }
    };

    const handleDelete = () => {
        if (!selectedTitle) return;
        router.delete(route('admin.academic-titles.destroy', selectedTitle.id), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                toast.success("Title deleted successfully");
            }
        });
    };

    // Helper UI
    const getTypeBadge = (type) => {
        return type === 'front' 
            ? <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">Gelar Depan</Badge>
            : <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">Gelar Belakang</Badge>;
    };

    return (
        <MainLayout>
            <Head title="Academic Titles" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1>Academic Titles</h1>
                        <p className="text-sm text-muted-foreground">Manage academic prefixes and suffixes</p>
                    </div>
                    <Button onClick={openAddDialog} className="gap-2">
                        <Plus className="w-4 h-4" /> Add Title
                    </Button>
                </div>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>List of Titles</CardTitle>
                        <CardDescription>Total: {titles.length} titles registered</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">ID</TableHead>
                                    <TableHead>Title Name</TableHead>
                                    <TableHead>Position (Type)</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {titles.length > 0 ? (
                                    titles.map((title) => (
                                        <TableRow key={title.id}>
                                            <TableCell className="font-mono text-xs text-muted-foreground">#{title.id}</TableCell>
                                            <TableCell className="font-medium">{title.name}</TableCell>
                                            <TableCell>{getTypeBadge(title.type)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(title)}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => openDeleteDialog(title)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                            No academic titles found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Create/Edit Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{selectedTitle ? "Edit Title" : "Add New Title"}</DialogTitle>
                            <DialogDescription>
                                {selectedTitle ? "Update existing academic title details." : "Add a new academic title to the system."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Title Name</Label>
                                <Input 
                                    placeholder="e.g., Dr., S.Kom, M.T." 
                                    value={formData.name} 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Position Type</Label>
                                <Select 
                                    value={formData.type} 
                                    onValueChange={(val) => setFormData({...formData, type: val})}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="front">Gelar Depan (Prefix)</SelectItem>
                                        <SelectItem value="back">Gelar Belakang (Suffix)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmit}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Alert */}
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete <b>{selectedTitle?.name}</b>. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-red-600">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </MainLayout>
    );
}