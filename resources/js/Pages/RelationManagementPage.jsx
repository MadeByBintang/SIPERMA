import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Download, Users, BookOpen, Eye, Calendar, User, Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export function RelationManagementPage() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [relationType, setRelationType] = useState('student-student');
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Student-Student Relations (PKL and Competition)
  const studentStudentRelations = [
    {
      id: 1,
      activityType: 'PKL',
      activityName: 'Internship at Tech Startup Indonesia',
      teamMembers: [
        { name: 'Ahmad Rizki Pratama', nim: '2021001234', role: 'Team Leader' },
        { name: 'Budi Santoso', nim: '2021003456', role: 'Frontend Developer' },
        { name: 'Dewi Lestari', nim: '2021004567', role: 'Backend Developer' },
      ],
      supervisorName: 'Dr. Rina Kusuma, M.T',
      supervisorNIP: '198209052008012003',
      startDate: '2024-09-01',
      endDate: '2024-12-31',
      status: 'In Progress',
      location: 'PT Tech Startup Indonesia, Jakarta',
      description: 'Developing a mobile application for inventory management system using React Native and Node.js backend.',
    },
    {
      id: 2,
      activityType: 'Competition',
      activityName: 'National Hackathon 2024 - AI Innovation Challenge',
      teamMembers: [
        { name: 'Farhan Abdullah', nim: '2021006789', role: 'Team Leader' },
        { name: 'Hendra Wijaya', nim: '2021008901', role: 'AI Developer' },
        { name: 'Indah Kusuma', nim: '2021009012', role: 'UI/UX Designer' },
        { name: 'Karina Dewi', nim: '2021011234', role: 'Data Analyst' },
      ],
      supervisorName: 'Dr. Sarah Wijaya, M.Kom',
      supervisorNIP: '198501122010122001',
      startDate: '2024-10-01',
      endDate: '2024-10-15',
      status: 'Completed',
      location: 'Jakarta Convention Center',
      description: 'Built an AI-powered chatbot for mental health support using natural language processing and sentiment analysis.',
    },
    {
      id: 3,
      activityType: 'PKL',
      activityName: 'Industry Internship at Bank Digital',
      teamMembers: [
        { name: 'Siti Nurhaliza', nim: '2021002345', role: 'Team Leader' },
        { name: 'Lukman Hakim', nim: '2021012345', role: 'Data Engineer' },
      ],
      supervisorName: 'Prof. Ahmad Suryanto, Ph.D',
      supervisorNIP: '197803151998031002',
      startDate: '2024-08-15',
      endDate: '2024-11-30',
      status: 'In Progress',
      location: 'PT Bank Digital Indonesia, Surabaya',
      description: 'Working on big data analytics project for customer behavior prediction and fraud detection system.',
    },
    {
      id: 4,
      activityType: 'Competition',
      activityName: 'International Cybersecurity CTF 2024',
      teamMembers: [
        { name: 'Eko Prasetyo', nim: '2021005678', role: 'Team Leader' },
        { name: 'Joko Prasetyo', nim: '2021010123', role: 'Cryptography Specialist' },
        { name: 'Gita Permata', nim: '2021007890', role: 'Network Security' },
      ],
      supervisorName: 'Prof. Linda Wijaya, Ph.D',
      supervisorNIP: '197512201995122001',
      startDate: '2024-11-05',
      endDate: '2024-11-07',
      status: 'Active',
      location: 'Online Platform',
      description: 'Participating in capture-the-flag competition focusing on web security, reverse engineering, and cryptography challenges.',
    },
    {
      id: 5,
      activityType: 'PKL',
      activityName: 'Software Development at E-commerce Company',
      teamMembers: [
        { name: 'Gita Permata', nim: '2021007890', role: 'Team Leader' },
        { name: 'Ahmad Rizki Pratama', nim: '2021001234', role: 'DevOps Engineer' },
        { name: 'Farhan Abdullah', nim: '2021006789', role: 'ML Engineer' },
      ],
      supervisorName: 'Dr. Bambang Hartono, M.T',
      supervisorNIP: '198304102009121002',
      startDate: '2024-07-01',
      endDate: '2024-10-31',
      status: 'Completed',
      location: 'PT E-commerce Nusantara, Bandung',
      description: 'Implemented cloud-based recommendation system using machine learning and deployed on AWS infrastructure.',
    },
  ];

  // Student-Lecturer Relations (Thesis)
  const studentLecturerRelations = [
    {
      id: 1,
      activityType: 'Thesis',
      thesisTitle: 'Deep Learning Approach for Indonesian Text Sentiment Analysis on Social Media',
      studentName: 'Hendra Wijaya',
      studentNIM: '2021008901',
      supervisorName: 'Dr. Kartika Sari, M.Kom',
      supervisorNIP: '198608252011012004',
      coSupervisorName: 'Dr. Sarah Wijaya, M.Kom',
      coSupervisorNIP: '198501122010122001',
      startDate: '2024-09-01',
      endDate: '2025-01-31',
      status: 'On Progress',
      researchArea: 'Natural Language Processing',
      description: 'Research focuses on developing a deep learning model using BERT and LSTM for sentiment analysis of Indonesian language posts on Twitter and Instagram.',
    },
    {
      id: 2,
      activityType: 'Thesis',
      thesisTitle: 'Blockchain-based Secure Voting System for University Elections',
      studentName: 'Joko Prasetyo',
      studentNIM: '2021010123',
      supervisorName: 'Prof. Linda Wijaya, Ph.D',
      supervisorNIP: '197512201995122001',
      startDate: '2024-08-15',
      endDate: '2024-12-20',
      status: 'Proposal',
      researchArea: 'Blockchain & Cryptography',
      description: 'Designing and implementing a decentralized voting system using smart contracts on Ethereum blockchain to ensure transparency and security.',
    },
    {
      id: 3,
      activityType: 'Thesis',
      thesisTitle: 'Real-time Object Detection for Autonomous Vehicles Using YOLO Algorithm',
      studentName: 'Farhan Abdullah',
      studentNIM: '2021006789',
      supervisorName: 'Dr. Sarah Wijaya, M.Kom',
      supervisorNIP: '198501122010122001',
      startDate: '2024-07-01',
      endDate: '2024-11-30',
      status: 'Revision',
      researchArea: 'Computer Vision & AI',
      description: 'Implementing and optimizing YOLOv8 algorithm for real-time detection of pedestrians, vehicles, and traffic signs in Indonesian road conditions.',
    },
    {
      id: 4,
      activityType: 'Thesis',
      thesisTitle: 'Predictive Analytics for Student Academic Performance Using Machine Learning',
      studentName: 'Lukman Hakim',
      studentNIM: '2021012345',
      supervisorName: 'Prof. Ahmad Suryanto, Ph.D',
      supervisorNIP: '197803151998031002',
      coSupervisorName: 'Dr. Bambang Hartono, M.T',
      coSupervisorNIP: '198304102009121002',
      startDate: '2024-06-01',
      endDate: '2024-10-15',
      status: 'Completed',
      researchArea: 'Data Science & Analytics',
      description: 'Developed machine learning models using Random Forest and XGBoost to predict student performance and identify at-risk students for early intervention.',
    },
    {
      id: 5,
      activityType: 'Thesis',
      thesisTitle: 'Cloud-based Microservices Architecture for E-Learning Platform',
      studentName: 'Gita Permata',
      studentNIM: '2021007890',
      supervisorName: 'Dr. Bambang Hartono, M.T',
      supervisorNIP: '198304102009121002',
      startDate: '2024-09-15',
      endDate: '2025-02-28',
      status: 'On Progress',
      researchArea: 'Cloud Computing & Software Engineering',
      description: 'Designing and implementing scalable microservices architecture using Docker, Kubernetes, and AWS for a comprehensive e-learning platform.',
    },
    {
      id: 6,
      activityType: 'Thesis',
      thesisTitle: '3D Game Development Using Unreal Engine 5 with AI-Driven NPCs',
      studentName: 'Karina Dewi',
      studentNIM: '2021011234',
      supervisorName: 'Dr. Rudi Hartono, M.Kom',
      supervisorNIP: '198107142007011001',
      startDate: '2024-08-01',
      endDate: '2024-12-31',
      status: 'On Progress',
      researchArea: 'Game Development & AI',
      description: 'Creating an immersive 3D adventure game with intelligent non-player characters using behavior trees and machine learning for adaptive gameplay.',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
      case 'On Progress':
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'Proposal':
        return 'bg-yellow-100 text-yellow-700';
      case 'Revision':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleViewDetails = (relation) => {
    setSelectedDetail(relation);
    setIsDetailDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedDetail(null);
  };

  // Filter relations based on status only
  const filteredRelations = relationType === 'student-student'
    ? studentStudentRelations.filter((relation) => {
        const matchesStatus = filterStatus === 'all' || 
          relation.status.toLowerCase().replace(' ', '-') === filterStatus;
        
        return matchesStatus;
      })
    : studentLecturerRelations.filter((relation) => {
        const matchesStatus = filterStatus === 'all' || 
          relation.status.toLowerCase().replace(' ', '-') === filterStatus;
        
        return matchesStatus;
      });

  return (
    <div className="space-y-6">
      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>System-Managed Relations</AlertTitle>
        <AlertDescription>
          All relations displayed here are automatically managed by the system based on registrations and approvals. 
          Relations cannot be manually edited or deleted as they are linked to the database records.
        </AlertDescription>
      </Alert>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle>Relation Management</CardTitle>
          <CardDescription>
            View and track student relationships including PKL, competitions, and thesis supervisions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={relationType} onValueChange={(value) => setRelationType(value)}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Select relation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student-student">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Student-Student Relations
                    </div>
                  </SelectItem>
                  <SelectItem value="student-lecturer">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Student-Lecturer Relations
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {relationType === 'student-student' ? (
                    <>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="proposal">Proposal</SelectItem>
                      <SelectItem value="on-progress">On Progress</SelectItem>
                      <SelectItem value="revision">Revision</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Relations Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {relationType === 'student-student' 
              ? 'Student-Student Relations (PKL & Competitions)' 
              : 'Student-Lecturer Relations (Thesis)'}
          </CardTitle>
          <CardDescription>
            {filteredRelations.length} {filteredRelations.length === 1 ? 'relation' : 'relations'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {relationType === 'student-student' ? (
                    <>
                      <TableHead>Activity Type</TableHead>
                      <TableHead>Activity Name</TableHead>
                      <TableHead>Team Members</TableHead>
                      <TableHead>Supervisor</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead>Student</TableHead>
                      <TableHead>Thesis Title</TableHead>
                      <TableHead>Supervisor</TableHead>
                      <TableHead>Research Area</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRelations.length > 0 ? (
                  filteredRelations.map((relation) => (
                    <TableRow key={relation.id}>
                      {relationType === 'student-student' ? (
                        <>
                          <TableCell>
                            <Badge variant="outline">
                              {relation.activityType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <p className="max-w-xs">{relation.activityName}</p>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{relation.teamMembers.length} Members</p>
                              <p className="text-xs text-muted-foreground">
                                Leader: {relation.teamMembers[0].name}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{relation.supervisorName}</p>
                              <p className="text-xs text-muted-foreground">{relation.supervisorNIP}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p>{new Date(relation.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                              <p className="text-xs text-muted-foreground">
                                to {new Date(relation.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(relation.status)}>
                              {relation.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-2"
                              onClick={() => handleViewDetails(relation)}
                            >
                              <Eye className="w-3 h-3" />
                              View Details
                            </Button>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>
                            <div>
                              <p>{relation.studentName}</p>
                              <p className="text-xs text-muted-foreground">
                                {relation.studentNIM}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="max-w-md line-clamp-2">
                              {relation.thesisTitle}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{relation.supervisorName}</p>
                              <p className="text-xs text-muted-foreground">{relation.supervisorNIP}</p>
                              {relation.coSupervisorName && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Co: {relation.coSupervisorName}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {relation.researchArea}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p>{new Date(relation.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                              <p className="text-xs text-muted-foreground">
                                to {new Date(relation.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(relation.status)}>
                              {relation.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-2"
                              onClick={() => handleViewDetails(relation)}
                            >
                              <Eye className="w-3 h-3" />
                              View Details
                            </Button>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No relations found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {relationType === 'student-student' ? 'Team Activity Details' : 'Thesis Details'}
            </DialogTitle>
            <DialogDescription>
              Detailed information about this {relationType === 'student-student' ? 'team activity' : 'thesis supervision'}
            </DialogDescription>
          </DialogHeader>

          {selectedDetail && (
            <div className="space-y-6">
              {relationType === 'student-student' ? (
                <>
                  {/* Activity Information */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Activity Information
                      </h4>
                      <Badge variant="outline" className="text-base px-3 py-1">
                        {selectedDetail.activityType}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 col-span-2">
                        <p className="text-sm text-muted-foreground">Activity Name</p>
                        <p>{selectedDetail.activityName}</p>
                      </div>
                      <div className="space-y-1 col-span-2">
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p className="text-sm">{selectedDetail.description}</p>
                      </div>
                      {selectedDetail.location && (
                        <div className="space-y-1 col-span-2">
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="text-sm">{selectedDetail.location}</p>
                        </div>
                      )}
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Start Date</p>
                        <p className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(selectedDetail.startDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">End Date</p>
                        <p className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(selectedDetail.endDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge className={getStatusColor(selectedDetail.status)}>
                          {selectedDetail.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Team Members */}
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Team Members ({selectedDetail.teamMembers.length})
                    </h4>
                    <div className="space-y-3">
                      {selectedDetail.teamMembers.map((member, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p>{member.name}</p>
                              <p className="text-sm text-muted-foreground">NIM: {member.nim}</p>
                            </div>
                          </div>
                          <Badge variant="secondary">{member.role}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Supervisor */}
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Supervisor
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p>{selectedDetail.supervisorName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">NIP</p>
                        <p>{selectedDetail.supervisorNIP}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Thesis Information */}
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Thesis Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 col-span-2">
                        <p className="text-sm text-muted-foreground">Thesis Title</p>
                        <p>{selectedDetail.thesisTitle}</p>
                      </div>
                      <div className="space-y-1 col-span-2">
                        <p className="text-sm text-muted-foreground">Research Area</p>
                        <Badge variant="secondary">
                          {selectedDetail.researchArea}
                        </Badge>
                      </div>
                      <div className="space-y-1 col-span-2">
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p className="text-sm">{selectedDetail.description}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Start Date</p>
                        <p className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(selectedDetail.startDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">End Date</p>
                        <p className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(selectedDetail.endDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge className={getStatusColor(selectedDetail.status)}>
                          {selectedDetail.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Student Information */}
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Student
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p>{selectedDetail.studentName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">NIM</p>
                        <p>{selectedDetail.studentNIM}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Supervisors */}
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Supervision
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Main Supervisor</p>
                          <p>{selectedDetail.supervisorName}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">NIP</p>
                          <p>{selectedDetail.supervisorNIP}</p>
                        </div>
                      </div>
                      {selectedDetail.coSupervisorName && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Co-Supervisor</p>
                            <p>{selectedDetail.coSupervisorName}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">NIP</p>
                            <p>{selectedDetail.coSupervisorNIP}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end pt-4">
                <Button onClick={handleCloseDialog}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
