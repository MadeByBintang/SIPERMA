import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Award,
  Users
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserType, setSelectedUserType] = useState('student');
  const [currentTab, setCurrentTab] = useState('student');

  // Form state
  const [formData, setFormData] = useState({});

  // Mock student data
  const [students, setStudents] = useState([
    {
      id: '1',
      nim: '2021001234',
      name: 'Ahmad Rizki Pratama',
      email: 'ahmad.rizki@university.ac.id',
      phone: '+62 812-3456-7890',
      major: 'Computer Science',
      year: '2021',
      gpa: 3.75,
      status: 'active',
      enrollmentDate: '2021-08-15'
    },
    {
      id: '2',
      nim: '2021005678',
      name: 'Siti Aminah',
      email: 'siti.aminah@university.ac.id',
      phone: '+62 813-4567-8901',
      major: 'Information Systems',
      year: '2021',
      gpa: 3.82,
      status: 'active',
      enrollmentDate: '2021-08-15'
    },
    {
      id: '3',
      nim: '2020007890',
      name: 'Budi Santoso',
      email: 'budi.santoso@university.ac.id',
      phone: '+62 814-5678-9012',
      major: 'Software Engineering',
      year: '2020',
      gpa: 3.68,
      status: 'active',
      enrollmentDate: '2020-08-20'
    },
    {
      id: '4',
      nim: '2022002345',
      name: 'Dewi Lestari',
      email: 'dewi.lestari@university.ac.id',
      phone: '+62 815-6789-0123',
      major: 'Computer Science',
      year: '2022',
      gpa: 3.90,
      status: 'active',
      enrollmentDate: '2022-08-10'
    },
    {
      id: '5',
      nim: '2021009876',
      name: 'Hendra Wijaya',
      email: 'hendra.wijaya@university.ac.id',
      phone: '+62 816-7890-1234',
      major: 'Information Technology',
      year: '2021',
      gpa: 3.55,
      status: 'inactive',
      enrollmentDate: '2021-08-15'
    }
  ]);

  // Mock lecturer data
  const [lecturers, setLecturers] = useState([
    {
      id: '1',
      nip: '198501012010011001',
      name: 'Dr. Sarah Wijaya, M.T.',
      email: 'sarah.wijaya@university.ac.id',
      phone: '+62 821-1234-5678',
      department: 'Computer Science',
      expertise: ['Machine Learning', 'Data Mining', 'Artificial Intelligence'],
      status: 'active',
      hireDate: '2010-01-15'
    },
    {
      id: '2',
      nip: '198703152012012002',
      name: 'Prof. Dr. Budi Hartono, M.Kom.',
      email: 'budi.hartono@university.ac.id',
      phone: '+62 822-2345-6789',
      department: 'Software Engineering',
      expertise: ['Software Architecture', 'Agile Development', 'DevOps'],
      status: 'active',
      hireDate: '2012-02-20'
    },
    {
      id: '3',
      nip: '199001202015011003',
      name: 'Dr. Rina Kusuma, M.T.',
      email: 'rina.kusuma@university.ac.id',
      phone: '+62 823-3456-7890',
      department: 'Information Systems',
      expertise: ['Database Systems', 'Business Intelligence', 'Data Warehousing'],
      status: 'active',
      hireDate: '2015-03-10'
    },
    {
      id: '4',
      nip: '198805102013012004',
      name: 'Dr. Ahmad Fauzi, M.Kom.',
      email: 'ahmad.fauzi@university.ac.id',
      phone: '+62 824-4567-8901',
      department: 'Computer Science',
      expertise: ['Computer Networks', 'IoT', 'Cybersecurity'],
      status: 'active',
      hireDate: '2013-06-15'
    },
    {
      id: '5',
      nip: '199203052016012005',
      name: 'Dr. Maya Putri, M.T.',
      email: 'maya.putri@university.ac.id',
      phone: '+62 825-5678-9012',
      department: 'Information Technology',
      expertise: ['Mobile Development', 'UI/UX Design', 'Web Technologies'],
      status: 'inactive',
      hireDate: '2016-08-01'
    }
  ]);

  // Filter users based on search query
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.nim.includes(searchQuery) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.major.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLecturers = lecturers.filter(lecturer =>
    lecturer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lecturer.nip.includes(searchQuery) ||
    lecturer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lecturer.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle add user
  const handleAddUser = () => {
    setSelectedUserType(currentTab);
    setFormData({});
    setIsAddDialogOpen(true);
  };

  // Handle edit user
  const handleEditUser = (user, type) => {
    setSelectedUser(user);
    setSelectedUserType(type);
    setFormData(user);
    setIsEditDialogOpen(true);
  };

  // Handle delete user
  const handleDeleteUser = (user, type) => {
    setSelectedUser(user);
    setSelectedUserType(type);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (!selectedUser) return;

    if (selectedUserType === 'student') {
      setStudents(students.filter(s => s.id !== selectedUser.id));
      toast.success('Student account deleted successfully');
    } else {
      setLecturers(lecturers.filter(l => l.id !== selectedUser.id));
      toast.success('Lecturer account deleted successfully');
    }

    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  // Handle toggle status
  const handleToggleStatus = (user, type) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';

    if (type === 'student') {
      setStudents(students.map(s => 
        s.id === user.id ? { ...s, status: newStatus } : s
      ));
    } else {
      setLecturers(lecturers.map(l => 
        l.id === user.id ? { ...l, status: newStatus } : l
      ));
    }

    toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
  };

  // Handle save (add or edit)
  const handleSave = () => {
    if (isAddDialogOpen) {
      // Add new user
      if (selectedUserType === 'student') {
        const newStudent = {
          id: String(students.length + 1),
          nim: formData.nim || '',
          name: formData.name || '',
          email: formData.email || '',
          phone: formData.phone || '',
          major: formData.major || '',
          year: formData.year || '',
          gpa: parseFloat(formData.gpa) || 0,
          status: 'active',
          enrollmentDate: new Date().toISOString().split('T')[0]
        };
        setStudents([...students, newStudent]);
        toast.success('Student added successfully');
      } else {
        const newLecturer = {
          id: String(lecturers.length + 1),
          nip: formData.nip || '',
          name: formData.name || '',
          email: formData.email || '',
          phone: formData.phone || '',
          department: formData.department || '',
          expertise: formData.expertise?.split(',').map((e) => e.trim()) || [],
          status: 'active',
          hireDate: new Date().toISOString().split('T')[0]
        };
        setLecturers([...lecturers, newLecturer]);
        toast.success('Lecturer added successfully');
      }
      setIsAddDialogOpen(false);
    } else {
      // Edit existing user
      if (selectedUserType === 'student') {
        setStudents(students.map(s => 
          s.id === selectedUser?.id ? { ...s, ...formData } : s
        ));
        toast.success('Student updated successfully');
      } else {
        setLecturers(lecturers.map(l => 
          l.id === selectedUser?.id ? { 
            ...l, 
            ...formData,
            expertise: typeof formData.expertise === 'string' 
              ? formData.expertise.split(',').map((e) => e.trim())
              : formData.expertise
          } : l
        ));
        toast.success('Lecturer updated successfully');
      }
      setIsEditDialogOpen(false);
    }

    setFormData({});
    setSelectedUser(null);
  };

  // Render student form fields
  const renderStudentFormFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nim">NIM</Label>
          <Input
            id="nim"
            placeholder="e.g., 2021001234"
            value={formData.nim || ''}
            onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Enter full name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="student@university.ac.id"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            placeholder="+62 812-3456-7890"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="major">Major</Label>
          <Select value={formData.major || ''} onValueChange={(value) => setFormData({ ...formData, major: value })}>
            <SelectTrigger id="major">
              <SelectValue placeholder="Select major" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Information Systems">Information Systems</SelectItem>
              <SelectItem value="Software Engineering">Software Engineering</SelectItem>
              <SelectItem value="Information Technology">Information Technology</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">Enrollment Year</Label>
          <Select value={formData.year || ''} onValueChange={(value) => setFormData({ ...formData, year: value })}>
            <SelectTrigger id="year">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2020">2020</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="gpa">GPA</Label>
        <Input
          id="gpa"
          type="number"
          step="0.01"
          min="0"
          max="4"
          placeholder="e.g., 3.75"
          value={formData.gpa || ''}
          onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
          required
        />
      </div>
    </>
  );

  // Render lecturer form fields
  const renderLecturerFormFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nip">NIP</Label>
          <Input
            id="nip"
            placeholder="e.g., 198501012010011001"
            value={formData.nip || ''}
            onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Enter full name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="lecturer@university.ac.id"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            placeholder="+62 821-1234-5678"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Select value={formData.department || ''} onValueChange={(value) => setFormData({ ...formData, department: value })}>
          <SelectTrigger id="department">
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Computer Science">Computer Science</SelectItem>
            <SelectItem value="Information Systems">Information Systems</SelectItem>
            <SelectItem value="Software Engineering">Software Engineering</SelectItem>
            <SelectItem value="Information Technology">Information Technology</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="expertise">Areas of Expertise</Label>
        <Input
          id="expertise"
          placeholder="e.g., Machine Learning, AI, Data Mining (comma separated)"
          value={Array.isArray(formData.expertise) ? formData.expertise.join(', ') : formData.expertise || ''}
          onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
          required
        />
        <p className="text-xs text-muted-foreground">
          Enter multiple areas separated by commas
        </p>
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1>User Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage student and lecturer accounts
          </p>
        </div>
        <Button onClick={handleAddUser} className="gap-2">
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Students</CardTitle>
            <GraduationCap className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl">{students.length}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {students.filter(s => s.status === 'active').length} active
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Lecturers</CardTitle>
            <Award className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl">{lecturers.length}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {lecturers.filter(l => l.status === 'active').length} active
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Users</CardTitle>
            <UserCheck className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl">
                  {students.filter(s => s.status === 'active').length + 
                   lecturers.filter(l => l.status === 'active').length}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Inactive Users</CardTitle>
            <UserX className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl">
                  {students.filter(s => s.status === 'inactive').length + 
                   lecturers.filter(l => l.status === 'inactive').length}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Deactivated accounts
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User List */}
      <Card>
        <CardHeader>
          <div className="flex items-start md:items-center justify-between gap-4 flex-col md:flex-row">
            <div>
              <CardTitle>User Accounts</CardTitle>
              <CardDescription>
                View and manage all user accounts in the system
              </CardDescription>
            </div>
            <div className="w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full md:w-[300px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value)} className="w-full">
            {/* Mobile Dropdown */}
            <div className="md:hidden mb-6">
              <Select value={currentTab} onValueChange={(value) => setCurrentTab(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      <span>Students ({filteredStudents.length})</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="lecturer">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>Lecturers ({filteredLecturers.length})</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Desktop Tabs */}
            <TabsList className="hidden md:grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="student" className="gap-2">
                <GraduationCap className="w-4 h-4" />
                Students ({filteredStudents.length})
              </TabsTrigger>
              <TabsTrigger value="lecturer" className="gap-2">
                <Award className="w-4 h-4" />
                Lecturers ({filteredLecturers.length})
              </TabsTrigger>
            </TabsList>

            {/* Students Table */}
            <TabsContent value="student" className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>NIM</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Major</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>GPA</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>{student.nim}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs text-primary">
                                    {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                  </span>
                                </div>
                                <span>{student.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{student.email}</TableCell>
                            <TableCell>{student.major}</TableCell>
                            <TableCell>{student.year}</TableCell>
                            <TableCell>{student.gpa.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={student.status === 'active' 
                                  ? 'bg-green-50 text-green-700 border-green-300' 
                                  : 'bg-gray-50 text-gray-700 border-gray-300'
                                }
                              >
                                {student.status === 'active' ? (
                                  <>
                                    <UserCheck className="w-3 h-3 mr-1" />
                                    Active
                                  </>
                                ) : (
                                  <>
                                    <UserX className="w-3 h-3 mr-1" />
                                    Inactive
                                  </>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleStatus(student, 'student')}
                                  title={student.status === 'active' ? 'Deactivate' : 'Activate'}
                                >
                                  {student.status === 'active' ? (
                                    <UserX className="w-4 h-4" />
                                  ) : (
                                    <UserCheck className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditUser(student, 'student')}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteUser(student, 'student')}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            No students found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            {/* Lecturers Table */}
            <TabsContent value="lecturer" className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>NIP</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Expertise</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLecturers.length > 0 ? (
                        filteredLecturers.map((lecturer) => (
                          <TableRow key={lecturer.id}>
                            <TableCell>{lecturer.nip}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs text-primary">
                                    {lecturer.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                  </span>
                                </div>
                                <span>{lecturer.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{lecturer.email}</TableCell>
                            <TableCell>{lecturer.department}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {lecturer.expertise.slice(0, 2).map((exp, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {exp}
                                  </Badge>
                                ))}
                                {lecturer.expertise.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{lecturer.expertise.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={lecturer.status === 'active' 
                                  ? 'bg-green-50 text-green-700 border-green-300' 
                                  : 'bg-gray-50 text-gray-700 border-gray-300'
                                }
                              >
                                {lecturer.status === 'active' ? (
                                  <>
                                    <UserCheck className="w-3 h-3 mr-1" />
                                    Active
                                  </>
                                ) : (
                                  <>
                                    <UserX className="w-3 h-3 mr-1" />
                                    Inactive
                                  </>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleStatus(lecturer, 'lecturer')}
                                  title={lecturer.status === 'active' ? 'Deactivate' : 'Activate'}
                                >
                                  {lecturer.status === 'active' ? (
                                    <UserX className="w-4 h-4" />
                                  ) : (
                                    <UserCheck className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditUser(lecturer, 'lecturer')}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteUser(lecturer, 'lecturer')}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No lecturers found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New {selectedUserType === 'student' ? 'Student' : 'Lecturer'}</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new {selectedUserType} account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedUserType === 'student' ? renderStudentFormFields() : renderLecturerFormFields()}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Add {selectedUserType === 'student' ? 'Student' : 'Lecturer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {selectedUserType === 'student' ? 'Student' : 'Lecturer'}</DialogTitle>
            <DialogDescription>
              Update the {selectedUserType} account information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedUserType === 'student' ? renderStudentFormFields() : renderLecturerFormFields()}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the {selectedUserType} account for{' '}
              <span className="font-medium text-foreground">{selectedUser?.name}</span>. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
