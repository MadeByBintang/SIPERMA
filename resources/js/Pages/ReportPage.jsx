import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Download, FileText, TrendingUp, Users, BookOpen, Award, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Separator } from '../ui/separator';
import { useIsMobile } from '../ui/use-mobile';

export function ReportPage() {
  const [activityType, setActivityType] = useState('all');
  const [dateRange, setDateRange] = useState('year');
  const [statusFilter, setStatusFilter] = useState('all');
  const isMobile = useIsMobile();
  
  // Responsive chart dimensions
  const chartHeight = isMobile ? 200 : 300;
  const pieChartRadius = isMobile ? 60 : 100;

  // Comprehensive student activity data
  const studentActivities = [
    {
      id: 1,
      studentName: 'Ahmad Rizki Pratama',
      studentNIM: '2021001234',
      activityType: 'PKL',
      activityName: 'Internship at Tech Startup Indonesia',
      supervisorName: 'Dr. Rina Kusuma, M.T',
      teamMembers: ['Ahmad Rizki Pratama', 'Budi Santoso', 'Dewi Lestari'],
      startDate: '2024-09-01',
      endDate: '2024-12-31',
      status: 'In Progress',
      progress: 65,
    },
    {
      id: 2,
      studentName: 'Farhan Abdullah',
      studentNIM: '2021006789',
      activityType: 'Competition',
      activityName: 'National Hackathon 2024',
      supervisorName: 'Dr. Sarah Wijaya, M.Kom',
      teamMembers: ['Farhan Abdullah', 'Hendra Wijaya', 'Indah Kusuma', 'Karina Dewi'],
      startDate: '2024-10-01',
      endDate: '2024-10-15',
      status: 'Completed',
      progress: 100,
    },
    {
      id: 3,
      studentName: 'Hendra Wijaya',
      studentNIM: '2021008901',
      activityType: 'Thesis',
      activityName: 'Deep Learning for Indonesian Text Sentiment Analysis',
      supervisorName: 'Dr. Kartika Sari, M.Kom',
      startDate: '2024-09-01',
      endDate: '2025-01-31',
      status: 'On Progress',
      progress: 45,
      researchArea: 'Natural Language Processing',
    },
    {
      id: 4,
      studentName: 'Siti Nurhaliza',
      studentNIM: '2021002345',
      activityType: 'PKL',
      activityName: 'Industry Internship at Bank Digital',
      supervisorName: 'Prof. Ahmad Suryanto, Ph.D',
      teamMembers: ['Siti Nurhaliza', 'Lukman Hakim'],
      startDate: '2024-08-15',
      endDate: '2024-11-30',
      status: 'In Progress',
      progress: 70,
    },
    {
      id: 5,
      studentName: 'Joko Prasetyo',
      studentNIM: '2021010123',
      activityType: 'Thesis',
      activityName: 'Blockchain-based Secure Voting System',
      supervisorName: 'Prof. Linda Wijaya, Ph.D',
      startDate: '2024-08-15',
      endDate: '2024-12-20',
      status: 'Proposal',
      progress: 20,
      researchArea: 'Blockchain & Cryptography',
    },
    {
      id: 6,
      studentName: 'Eko Prasetyo',
      studentNIM: '2021005678',
      activityType: 'Competition',
      activityName: 'International Cybersecurity CTF 2024',
      supervisorName: 'Prof. Linda Wijaya, Ph.D',
      teamMembers: ['Eko Prasetyo', 'Joko Prasetyo', 'Gita Permata'],
      startDate: '2024-11-05',
      endDate: '2024-11-07',
      status: 'Active',
      progress: 30,
    },
    {
      id: 7,
      studentName: 'Farhan Abdullah',
      studentNIM: '2021006789',
      activityType: 'Thesis',
      activityName: 'Real-time Object Detection for Autonomous Vehicles',
      supervisorName: 'Dr. Sarah Wijaya, M.Kom',
      startDate: '2024-07-01',
      endDate: '2024-11-30',
      status: 'Revision',
      progress: 85,
      researchArea: 'Computer Vision & AI',
    },
    {
      id: 8,
      studentName: 'Gita Permata',
      studentNIM: '2021007890',
      activityType: 'PKL',
      activityName: 'Software Development at E-commerce Company',
      supervisorName: 'Dr. Bambang Hartono, M.T',
      teamMembers: ['Gita Permata', 'Ahmad Rizki Pratama', 'Farhan Abdullah'],
      startDate: '2024-07-01',
      endDate: '2024-10-31',
      status: 'Completed',
      progress: 100,
    },
    {
      id: 9,
      studentName: 'Lukman Hakim',
      studentNIM: '2021012345',
      activityType: 'Thesis',
      activityName: 'Predictive Analytics for Student Academic Performance',
      supervisorName: 'Prof. Ahmad Suryanto, Ph.D',
      startDate: '2024-06-01',
      endDate: '2024-10-15',
      status: 'Completed',
      progress: 100,
      researchArea: 'Data Science & Analytics',
    },
    {
      id: 10,
      studentName: 'Gita Permata',
      studentNIM: '2021007890',
      activityType: 'Thesis',
      activityName: 'Cloud-based Microservices Architecture for E-Learning',
      supervisorName: 'Dr. Bambang Hartono, M.T',
      startDate: '2024-09-15',
      endDate: '2025-02-28',
      status: 'On Progress',
      progress: 40,
      researchArea: 'Cloud Computing',
    },
    {
      id: 11,
      studentName: 'Karina Dewi',
      studentNIM: '2021011234',
      activityType: 'Thesis',
      activityName: '3D Game Development Using Unreal Engine 5',
      supervisorName: 'Dr. Rudi Hartono, M.Kom',
      startDate: '2024-08-01',
      endDate: '2024-12-31',
      status: 'On Progress',
      progress: 55,
      researchArea: 'Game Development & AI',
    },
    {
      id: 12,
      studentName: 'Budi Santoso',
      studentNIM: '2021003456',
      activityType: 'PKL',
      activityName: 'Internship at Tech Startup Indonesia',
      supervisorName: 'Dr. Rina Kusuma, M.T',
      teamMembers: ['Ahmad Rizki Pratama', 'Budi Santoso', 'Dewi Lestari'],
      startDate: '2024-09-01',
      endDate: '2024-12-31',
      status: 'In Progress',
      progress: 65,
    },
    {
      id: 13,
      studentName: 'Dewi Lestari',
      studentNIM: '2021004567',
      activityType: 'PKL',
      activityName: 'Internship at Tech Startup Indonesia',
      supervisorName: 'Dr. Rina Kusuma, M.T',
      teamMembers: ['Ahmad Rizki Pratama', 'Budi Santoso', 'Dewi Lestari'],
      startDate: '2024-09-01',
      endDate: '2024-12-31',
      status: 'In Progress',
      progress: 65,
    },
    {
      id: 14,
      studentName: 'Indah Kusuma',
      studentNIM: '2021009012',
      activityType: 'Competition',
      activityName: 'National Hackathon 2024',
      supervisorName: 'Dr. Sarah Wijaya, M.Kom',
      teamMembers: ['Farhan Abdullah', 'Hendra Wijaya', 'Indah Kusuma', 'Karina Dewi'],
      startDate: '2024-10-01',
      endDate: '2024-10-15',
      status: 'Completed',
      progress: 100,
    },
  ];

  // Filter activities
  const filteredActivities = studentActivities.filter((activity) => {
    const matchesType = activityType === 'all' || activity.activityType.toLowerCase() === activityType;
    const matchesStatus = statusFilter === 'all' || activity.status.toLowerCase().replace(' ', '-') === statusFilter;
    return matchesType && matchesStatus;
  });

  // Calculate statistics
  const totalPKL = studentActivities.filter(a => a.activityType === 'PKL').length;
  const totalThesis = studentActivities.filter(a => a.activityType === 'Thesis').length;
  const totalCompetition = studentActivities.filter(a => a.activityType === 'Competition').length;
  const totalActivities = studentActivities.length;

  const completedActivities = studentActivities.filter(a => a.status === 'Completed').length;
  const activeActivities = studentActivities.filter(a => 
    a.status === 'In Progress' || a.status === 'On Progress' || a.status === 'Active'
  ).length;
  const proposalActivities = studentActivities.filter(a => a.status === 'Proposal').length;

  const completionRate = Math.round((completedActivities / totalActivities) * 100);
  const averageProgress = Math.round(
    studentActivities.reduce((sum, a) => sum + a.progress, 0) / totalActivities
  );

  // Activity type distribution
  const activityDistribution = [
    { name: 'PKL', value: totalPKL, color: '#1E88E5' },
    { name: 'Thesis', value: totalThesis, color: '#10b981' },
    { name: 'Competition', value: totalCompetition, color: '#f59e0b' },
  ];

  // Status distribution
  const statusDistribution = [
    { name: 'Completed', count: completedActivities },
    { name: 'In Progress', count: activeActivities },
    { name: 'Proposal', count: proposalActivities },
    { name: 'Revision', count: studentActivities.filter(a => a.status === 'Revision').length },
  ];

  // Monthly activity trends
  const monthlyTrends = [
    { month: 'Jun', PKL: 1, Thesis: 1, Competition: 0 },
    { month: 'Jul', PKL: 2, Thesis: 2, Competition: 0 },
    { month: 'Aug', PKL: 3, Thesis: 4, Competition: 0 },
    { month: 'Sep', PKL: 5, Thesis: 6, Competition: 0 },
    { month: 'Oct', PKL: 5, Thesis: 6, Competition: 2 },
    { month: 'Nov', PKL: 5, Thesis: 6, Competition: 2 },
  ];

  // Progress by student
  const progressByActivity = [
    { range: '0-25%', count: studentActivities.filter(a => a.progress <= 25).length },
    { range: '26-50%', count: studentActivities.filter(a => a.progress > 25 && a.progress <= 50).length },
    { range: '51-75%', count: studentActivities.filter(a => a.progress > 50 && a.progress <= 75).length },
    { range: '76-100%', count: studentActivities.filter(a => a.progress > 75).length },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'In Progress':
      case 'On Progress':
      case 'Active':
        return 'bg-blue-100 text-blue-700';
      case 'Proposal':
        return 'bg-yellow-100 text-yellow-700';
      case 'Revision':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'PKL':
        return <BookOpen className="w-4 h-4" />;
      case 'Thesis':
        return <FileText className="w-4 h-4" />;
      case 'Competition':
        return <Award className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Reports</CardTitle>
          <CardDescription>
            Comprehensive summary of all student activities including PKL, Thesis, and Competitions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="space-y-2">
                <Label htmlFor="activityType">Activity Type</Label>
                <Select value={activityType} onValueChange={(value) => setActivityType(value)}>
                  <SelectTrigger id="activityType" className="w-full md:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="pkl">PKL Only</SelectItem>
                    <SelectItem value="thesis">Thesis Only</SelectItem>
                    <SelectItem value="competition">Competition Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="statusFilter">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="statusFilter" className="w-full md:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="on-progress">On Progress</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="revision">Revision</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateRange">Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger id="dateRange" className="w-full md:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 md:ml-auto md:w-auto">
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

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Activities</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl">{filteredActivities.length}</span>
                <span className="text-sm text-muted-foreground">of {totalActivities}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                PKL: {totalPKL} | Thesis: {totalThesis} | Competition: {totalCompetition}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Completion Rate</CardTitle>
            <Award className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl">{completionRate}%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {completedActivities} completed activities
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Activities</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl">{activeActivities}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Currently in progress
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Average Progress</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl">{averageProgress}%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Across all activities
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Activity Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Type Distribution</CardTitle>
            <CardDescription>Breakdown by PKL, Thesis, and Competition</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <PieChart>
                <Pie
                  data={activityDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={pieChartRadius}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {activityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Status</CardTitle>
            <CardDescription>Current status of all activities</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart data={statusDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: isMobile ? 11 : 12 }}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#1E88E5" name="Activities" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Activity Trends</CardTitle>
            <CardDescription>Activity registrations over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="PKL" stroke="#1E88E5" strokeWidth={2} />
                <Line type="monotone" dataKey="Thesis" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="Competition" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Progress Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Distribution</CardTitle>
            <CardDescription>Activities grouped by completion percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart data={progressByActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="range" 
                  tick={{ fontSize: isMobile ? 11 : 12 }}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" name="Activities" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Activity Details</CardTitle>
          <CardDescription>
            {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Activity Type</TableHead>
                  <TableHead>Activity Name</TableHead>
                  <TableHead>Supervisor</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <div>
                          <p>{activity.studentName}</p>
                          <p className="text-xs text-muted-foreground">{activity.studentNIM}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          {getActivityIcon(activity.activityType)}
                          {activity.activityType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="line-clamp-2">{activity.activityName}</p>
                          {activity.researchArea && (
                            <p className="text-xs text-muted-foreground mt-1">{activity.researchArea}</p>
                          )}
                          {activity.teamMembers && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Team: {activity.teamMembers.length} members
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{activity.supervisorName}</p>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(activity.startDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            to {new Date(activity.endDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2 transition-all"
                              style={{ width: `${activity.progress}%` }}
                            />
                          </div>
                          <span className="text-sm">{activity.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No activities found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary by Activity Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* PKL Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              PKL Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total PKL</span>
                <span>{totalPKL} activities</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="text-green-600">
                  {studentActivities.filter(a => a.activityType === 'PKL' && a.status === 'Completed').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">In Progress</span>
                <span className="text-blue-600">
                  {studentActivities.filter(a => a.activityType === 'PKL' && a.status === 'In Progress').length}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Unique Students</span>
                <span>
                  {new Set(studentActivities.filter(a => a.activityType === 'PKL').map(a => a.studentNIM)).size}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thesis Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Thesis Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Thesis</span>
                <span>{totalThesis} activities</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="text-green-600">
                  {studentActivities.filter(a => a.activityType === 'Thesis' && a.status === 'Completed').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">On Progress</span>
                <span className="text-blue-600">
                  {studentActivities.filter(a => a.activityType === 'Thesis' && a.status === 'On Progress').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Proposal</span>
                <span className="text-yellow-600">
                  {studentActivities.filter(a => a.activityType === 'Thesis' && a.status === 'Proposal').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competition Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-500" />
              Competition Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Competitions</span>
                <span>{totalCompetition} activities</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="text-green-600">
                  {studentActivities.filter(a => a.activityType === 'Competition' && a.status === 'Completed').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active</span>
                <span className="text-blue-600">
                  {studentActivities.filter(a => a.activityType === 'Competition' && a.status === 'Active').length}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Unique Students</span>
                <span>
                  {new Set(studentActivities.filter(a => a.activityType === 'Competition').map(a => a.studentNIM)).size}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
