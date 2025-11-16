import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { 
  Search, 
  Edit, 
  Eye,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Users,
  UserCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function ProjectOverviewPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({});

  // Mock project data
  const [projects, setProjects] = useState([
    {
      id: '1',
      type: 'pkl',
      title: 'Enterprise Resource Planning Implementation at PT Teknologi Maju',
      teamMembers: ['Ahmad Rizki Pratama', 'Siti Aminah'],
      supervisor: 'Dr. Sarah Wijaya, M.T.',
      status: 'ongoing',
      progress: 65,
      startDate: '2024-09-01',
      endDate: '2024-12-15',
      description: 'Implementing ERP system for manufacturing company to streamline business processes and improve operational efficiency.',
      department: 'Computer Science'
    },
    {
      id: '2',
      type: 'thesis',
      title: 'Deep Learning Approach for Indonesian Sentiment Analysis on Social Media',
      teamMembers: ['Budi Santoso'],
      supervisor: 'Prof. Dr. Budi Hartono, M.Kom.',
      status: 'ongoing',
      progress: 45,
      startDate: '2024-08-15',
      endDate: '2025-01-20',
      description: 'Developing a deep learning model using BERT for sentiment analysis of Indonesian text on social media platforms.',
      department: 'Computer Science'
    },
    {
      id: '3',
      type: 'competition',
      title: 'Smart Agriculture IoT System - National Innovation Competition 2024',
      teamMembers: ['Dewi Lestari', 'Hendra Wijaya', 'Rina Marlina'],
      supervisor: 'Dr. Ahmad Fauzi, M.Kom.',
      status: 'ongoing',
      progress: 80,
      startDate: '2024-07-10',
      endDate: '2024-11-30',
      description: 'IoT-based smart agriculture monitoring system with AI prediction for optimal crop growth and automated irrigation.',
      department: 'Information Technology'
    },
    {
      id: '4',
      type: 'pkl',
      title: 'Mobile Application Development for E-Commerce Platform',
      teamMembers: ['Andi Wijaya'],
      supervisor: 'Dr. Maya Putri, M.T.',
      status: 'completed',
      progress: 100,
      startDate: '2024-06-01',
      endDate: '2024-09-30',
      description: 'Developed cross-platform mobile application for e-commerce startup with integrated payment gateway and real-time order tracking.',
      department: 'Software Engineering'
    },
    {
      id: '5',
      type: 'thesis',
      title: 'Blockchain-based Supply Chain Management System',
      teamMembers: ['Farhan Abdullah', 'Putri Kusuma'],
      supervisor: 'Dr. Rina Kusuma, M.T.',
      status: 'ongoing',
      progress: 55,
      startDate: '2024-09-01',
      endDate: '2025-02-15',
      description: 'Implementing blockchain technology to ensure transparency and traceability in supply chain management for pharmaceutical industry.',
      department: 'Information Systems'
    },
    {
      id: '6',
      type: 'competition',
      title: 'AI-Powered Healthcare Chatbot - ASEAN Tech Challenge',
      teamMembers: ['Lisa Anggraini', 'Ryan Pratama'],
      supervisor: 'Dr. Sarah Wijaya, M.T.',
      status: 'completed',
      progress: 100,
      startDate: '2024-05-15',
      endDate: '2024-10-01',
      description: 'Developed an AI chatbot for preliminary health diagnosis and medical information assistance using NLP and machine learning.',
      department: 'Computer Science'
    },
    {
      id: '7',
      type: 'pkl',
      title: 'Data Analytics Dashboard for Financial Services',
      teamMembers: ['Michael Tanjung', 'Sarah Handayani'],
      supervisor: 'Prof. Dr. Budi Hartono, M.Kom.',
      status: 'ongoing',
      progress: 70,
      startDate: '2024-08-20',
      endDate: '2024-12-20',
      description: 'Building interactive data analytics dashboard for financial institution to visualize customer behavior and transaction patterns.',
      department: 'Information Systems'
    },
    {
      id: '8',
      type: 'thesis',
      title: 'Augmented Reality for Interactive Learning in Primary Education',
      teamMembers: ['Diana Permata'],
      supervisor: 'Dr. Ahmad Fauzi, M.Kom.',
      status: 'ongoing',
      progress: 40,
      startDate: '2024-09-05',
      endDate: '2025-03-10',
      description: 'Developing AR-based educational application to enhance interactive learning experience for primary school students.',
      department: 'Information Technology'
    },
    {
      id: '9',
      type: 'competition',
      title: 'Green Energy Monitoring System - Environmental Hackathon',
      teamMembers: ['Kevin Saputra', 'Indah Permatasari', 'Bagus Hermawan'],
      supervisor: 'Dr. Rina Kusuma, M.T.',
      status: 'pending',
      progress: 25,
      startDate: '2024-10-15',
      endDate: '2024-12-01',
      description: 'IoT system for monitoring and optimizing green energy usage in smart buildings with real-time analytics and recommendations.',
      department: 'Information Technology'
    },
    {
      id: '10',
      type: 'pkl',
      title: 'Cybersecurity Assessment for Banking Infrastructure',
      teamMembers: ['Arief Rahman'],
      supervisor: 'Dr. Ahmad Fauzi, M.Kom.',
      status: 'cancelled',
      progress: 30,
      startDate: '2024-07-01',
      endDate: '2024-10-15',
      description: 'Conducting comprehensive security assessment and penetration testing for banking IT infrastructure.',
      department: 'Computer Science'
    },
    {
      id: '11',
      type: 'thesis',
      title: 'Computer Vision for Automated Quality Control in Manufacturing',
      teamMembers: ['Yoga Pratama', 'Nina Wijayanti'],
      supervisor: 'Dr. Sarah Wijaya, M.T.',
      status: 'ongoing',
      progress: 60,
      startDate: '2024-08-01',
      endDate: '2025-01-30',
      description: 'Using computer vision and deep learning to automate quality inspection process in manufacturing production line.',
      department: 'Computer Science'
    },
    {
      id: '12',
      type: 'competition',
      title: 'Smart City Traffic Management - Innovation Challenge 2024',
      teamMembers: ['Riko Firmansyah', 'Ayu Lestari'],
      supervisor: 'Prof. Dr. Budi Hartono, M.Kom.',
      status: 'ongoing',
      progress: 75,
      startDate: '2024-08-10',
      endDate: '2024-11-25',
      description: 'AI-based traffic prediction and management system for smart city implementation with real-time optimization.',
      department: 'Software Engineering'
    }
  ]);

  // Filter projects based on tab and search
  const filteredProjects = projects.filter(project => {
    const matchesTab = currentTab === 'all' || project.type === currentTab;
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.supervisor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.teamMembers.some(member => member.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  // Get statistics
  const stats = {
    total: projects.length,
    pkl: projects.filter(p => p.type === 'pkl').length,
    thesis: projects.filter(p => p.type === 'thesis').length,
    competition: projects.filter(p => p.type === 'competition').length,
    ongoing: projects.filter(p => p.status === 'ongoing').length,
    completed: projects.filter(p => p.status === 'completed').length,
    pending: projects.filter(p => p.status === 'pending').length,
    cancelled: projects.filter(p => p.status === 'cancelled').length
  };

  // Handle view details
  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setIsDetailDialogOpen(true);
  };

  // Handle edit project
  const handleEditProject = (project) => {
    setSelectedProject(project);
    setFormData({
      ...project,
      teamMembers: project.teamMembers.join(', ')
    });
    setIsEditDialogOpen(true);
  };

  // Handle save changes
  const handleSaveChanges = () => {
    if (!selectedProject) return;

    const updatedProjects = projects.map(p => {
      if (p.id === selectedProject.id) {
        return {
          ...p,
          ...formData,
          teamMembers: typeof formData.teamMembers === 'string' 
            ? formData.teamMembers.split(',').map((m) => m.trim())
            : formData.teamMembers,
          progress: parseInt(formData.progress) || 0
        };
      }
      return p;
    });

    setProjects(updatedProjects);
    setIsEditDialogOpen(false);
    setSelectedProject(null);
    setFormData({});
    toast.success('Project updated successfully');
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        label: 'Pending',
        className: 'bg-orange-50 text-orange-700 border-orange-300',
        icon: Clock
      },
      ongoing: {
        label: 'Ongoing',
        className: 'bg-blue-50 text-blue-700 border-blue-300',
        icon: TrendingUp
      },
      completed: {
        label: 'Completed',
        className: 'bg-green-50 text-green-700 border-green-300',
        icon: CheckCircle2
      },
      cancelled: {
        label: 'Cancelled',
        className: 'bg-red-50 text-red-700 border-red-300',
        icon: XCircle
      }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={`${config.className} gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  // Get type badge
  const getTypeBadge = (type) => {
    const typeConfig = {
      pkl: {
        label: 'PKL',
        className: 'bg-purple-50 text-purple-700 border-purple-300',
        icon: Briefcase
      },
      thesis: {
        label: 'Thesis',
        className: 'bg-indigo-50 text-indigo-700 border-indigo-300',
        icon: GraduationCap
      },
      competition: {
        label: 'Competition',
        className: 'bg-amber-50 text-amber-700 border-amber-300',
        icon: Award
      }
    };

    const config = typeConfig[type];
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={`${config.className} gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  // Get progress color
  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>Project Overview</h1>
        <p className="text-sm text-muted-foreground">
          Monitor and manage all academic activities and projects
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">PKL Projects</CardTitle>
            <Briefcase className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl">{stats.pkl}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Field internships
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Thesis</CardTitle>
            <GraduationCap className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl">{stats.thesis}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Research projects
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Competitions</CardTitle>
            <Award className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl">{stats.competition}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Active competitions
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Projects</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl">{stats.total}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                All activities
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-blue-900">Ongoing</CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-700" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-blue-900">{stats.ongoing}</div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-green-900">Completed</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-green-700" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-green-900">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-orange-900">Pending</CardTitle>
            <Clock className="w-4 h-4 text-orange-700" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-orange-900">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-red-900">Cancelled</CardTitle>
            <XCircle className="w-4 h-4 text-red-700" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-red-900">{stats.cancelled}</div>
          </CardContent>
        </Card>
      </div>

      {/* Project List */}
      <Card>
        <CardHeader>
          <div className="flex items-start md:items-center justify-between gap-4 flex-col md:flex-row">
            <div>
              <CardTitle>All Projects</CardTitle>
              <CardDescription>
                Manage and monitor all academic activities
              </CardDescription>
            </div>
            <div className="w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
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
            <div className="lg:hidden mb-6">
              <Select value={currentTab} onValueChange={(value) => setCurrentTab(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>All ({stats.total})</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="pkl">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>PKL ({stats.pkl})</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="thesis">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      <span>Thesis ({stats.thesis})</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="competition">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>Competition ({stats.competition})</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Desktop Tabs */}
            <TabsList className="hidden lg:grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="all" className="gap-2">
                <FileText className="w-4 h-4" />
                All ({stats.total})
              </TabsTrigger>
              <TabsTrigger value="pkl" className="gap-2">
                <Briefcase className="w-4 h-4" />
                PKL ({stats.pkl})
              </TabsTrigger>
              <TabsTrigger value="thesis" className="gap-2">
                <GraduationCap className="w-4 h-4" />
                Thesis ({stats.thesis})
              </TabsTrigger>
              <TabsTrigger value="competition" className="gap-2">
                <Award className="w-4 h-4" />
                Competition ({stats.competition})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={currentTab} className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[300px]">Project</TableHead>
                        <TableHead>Team Members</TableHead>
                        <TableHead>Supervisor</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProjects.length > 0 ? (
                        filteredProjects.map((project) => (
                          <TableRow key={project.id}>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  {getTypeBadge(project.type)}
                                </div>
                                <p className="line-clamp-2">{project.title}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(project.startDate).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                  {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}`}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <div className="space-y-1">
                                  {project.teamMembers.slice(0, 2).map((member, idx) => (
                                    <div key={idx} className="text-sm">
                                      {member}
                                    </div>
                                  ))}
                                  {project.teamMembers.length > 2 && (
                                    <div className="text-xs text-muted-foreground">
                                      +{project.teamMembers.length - 2} more
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-sm">{project.supervisor}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-2 min-w-[120px]">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">{project.progress}%</span>
                                </div>
                                <Progress value={project.progress} className="h-2" />
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(project.status)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDetails(project)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditProject(project)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No projects found
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

      {/* Project Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
            <DialogDescription>
              Complete information about the project
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-6 py-4">
              {/* Title and Type */}
              <div className="space-y-2">
                <div className="flex items-start gap-2 flex-wrap">
                  {getTypeBadge(selectedProject.type)}
                  {getStatusBadge(selectedProject.status)}
                </div>
                <h3 className="text-lg">{selectedProject.title}</h3>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedProject.description}
                </p>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <p className="text-sm">{selectedProject.department}</p>
                </div>

                <div className="space-y-2">
                  <Label>Supervisor</Label>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{selectedProject.supervisor}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(selectedProject.startDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>

                {selectedProject.endDate && (
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(selectedProject.endDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Team Members */}
              <div className="space-y-2">
                <Label>Team Members ({selectedProject.teamMembers.length})</Label>
                <div className="space-y-2">
                  {selectedProject.teamMembers.map((member, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-accent rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-primary">
                          {member.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </span>
                      </div>
                      <span className="text-sm">{member}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Progress</Label>
                  <span className="text-sm">{selectedProject.progress}%</span>
                </div>
                <Progress value={selectedProject.progress} className="h-3" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsDetailDialogOpen(false);
              if (selectedProject) handleEditProject(selectedProject);
            }}>
              Edit Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update project information and progress
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Project Type</Label>
                <Select 
                  value={formData.type || ''} 
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pkl">PKL (Internship)</SelectItem>
                    <SelectItem value="thesis">Thesis</SelectItem>
                    <SelectItem value="competition">Competition</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status || ''} 
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select 
                  value={formData.department || ''} 
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
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
                <Label htmlFor="supervisor">Supervisor</Label>
                <Input
                  id="supervisor"
                  value={formData.supervisor || ''}
                  onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamMembers">Team Members</Label>
              <Input
                id="teamMembers"
                placeholder="e.g., John Doe, Jane Smith (comma separated)"
                value={formData.teamMembers || ''}
                onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Enter multiple members separated by commas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate || ''}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate || ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="progress">Progress</Label>
                <span className="text-sm text-muted-foreground">
                  {formData.progress || 0}%
                </span>
              </div>
              <Input
                id="progress"
                type="range"
                min="0"
                max="100"
                step="5"
                value={formData.progress || 0}
                onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                className="cursor-pointer"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
