import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Briefcase, 
  GraduationCap, 
  Trophy, 
  Users, 
  BookOpen, 
  Info,
  CheckCircle2,
  User,
  UserCheck,
  X
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export function RegistrationPage() {
  const [selectedActivity, setSelectedActivity] = useState('pkl');
  
  // Student Info (from profile)
  const studentInfo = {
    name: 'Ahmad Rizki Pratama',
    nim: '2021001234',
    interests: ['Machine Learning', 'Data Science'],
  };

  // PKL Form State
  const [pklFormData, setPklFormData] = useState({
    description: '',
    preferredCompany: '',
  });

  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);

  // Thesis Form State
  const [thesisFormData, setThesisFormData] = useState({
    title: '',
    abstract: '',
  });

  const [selectedResearchTopics, setSelectedResearchTopics] = useState([]);
  const [selectedMainSupervisor, setSelectedMainSupervisor] = useState(null);
  const [selectedAssistantSupervisor, setSelectedAssistantSupervisor] = useState(null);

  // Competition Form State
  const [competitionFormData, setCompetitionFormData] = useState({
    competitionName: '',
    competitionField: '',
  });

  const [selectedCompetitionTeam, setSelectedCompetitionTeam] = useState([]);
  const [selectedCompetitionSupervisor, setSelectedCompetitionSupervisor] = useState(null);

  // Recommended team members based on matching interests
  const recommendedTeamMembers = [
    {
      id: 1,
      name: 'Siti Nurhaliza',
      nim: '2021002345',
      interests: ['Data Science', 'Machine Learning', 'Python'],
      gpa: 3.75,
      matchScore: 95,
    },
    {
      id: 2,
      name: 'Budi Santoso',
      nim: '2021003456',
      interests: ['Machine Learning', 'Deep Learning'],
      gpa: 3.65,
      matchScore: 88,
    },
    {
      id: 3,
      name: 'Dewi Lestari',
      nim: '2021004567',
      interests: ['Data Analytics', 'Machine Learning'],
      gpa: 3.80,
      matchScore: 85,
    },
    {
      id: 4,
      name: 'Eko Prasetyo',
      nim: '2021005678',
      interests: ['AI', 'Data Science'],
      gpa: 3.70,
      matchScore: 82,
    },
  ];

  // Recommended supervisors based on matching expertise
  const recommendedSupervisors = [
    {
      id: 1,
      name: 'Dr. Sarah Wijaya, M.Kom',
      expertise: ['Machine Learning', 'AI', 'Data Science'],
      currentStudents: 6,
      maxStudents: 8,
      matchScore: 95,
      availability: 'Available',
    },
    {
      id: 2,
      name: 'Prof. Ahmad Suryanto, Ph.D',
      expertise: ['Data Science', 'Analytics', 'Big Data'],
      currentStudents: 5,
      maxStudents: 8,
      matchScore: 92,
      availability: 'Available',
    },
    {
      id: 3,
      name: 'Dr. Rina Kusuma, M.T',
      expertise: ['Software Engineering', 'Machine Learning'],
      currentStudents: 7,
      maxStudents: 8,
      matchScore: 85,
      availability: 'Limited',
    },
    {
      id: 4,
      name: 'Dr. Agus Priyanto, M.Kom',
      expertise: ['AI', 'Computer Vision'],
      currentStudents: 8,
      maxStudents: 8,
      matchScore: 80,
      availability: 'Not Available',
    },
  ];

  const getMatchColor = (score) => {
    if (score >= 90) return 'bg-green-100 text-green-700';
    if (score >= 80) return 'bg-blue-100 text-blue-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const getAvailabilityColor = (status) => {
    if (status === 'Available') return 'bg-green-100 text-green-700';
    if (status === 'Limited') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const handleTeamMemberToggle = (id) => {
    setSelectedTeamMembers((prev) =>
      prev.includes(id) ? prev.filter((memberId) => memberId !== id) : [...prev, id]
    );
  };

  const handleSupervisorSelect = (id) => {
    setSelectedSupervisor(id);
  };

  // Available research topics
  const researchTopics = [
    'Machine Learning',
    'Deep Learning',
    'Natural Language Processing',
    'Computer Vision',
    'Data Science',
    'Big Data Analytics',
    'Artificial Intelligence',
    'Web Development',
    'Mobile Development',
    'Cybersecurity',
    'Internet of Things',
    'Cloud Computing',
  ];

  // Competition fields
  const competitionFields = [
    'Machine Learning',
    'Data Science',
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Cybersecurity',
    'IoT & Robotics',
    'Game Development',
    'Business Innovation',
    'Social Impact',
  ];

  const handlePKLSubmit = () => {
    // Handle PKL registration submission
    console.log('PKL Registration:', {
      ...studentInfo,
      ...pklFormData,
      teamMembers: selectedTeamMembers,
      supervisor: selectedSupervisor,
    });
    alert('PKL registration submitted successfully!');
  };

  const handleThesisSubmit = () => {
    // Handle Thesis registration submission
    console.log('Thesis Registration:', {
      ...studentInfo,
      ...thesisFormData,
      researchTopics: selectedResearchTopics,
      mainSupervisor: selectedMainSupervisor,
      assistantSupervisor: selectedAssistantSupervisor,
    });
    alert('Thesis registration submitted successfully!');
  };

  const handleCompetitionSubmit = () => {
    // Handle Competition registration submission
    console.log('Competition Registration:', {
      ...studentInfo,
      ...competitionFormData,
      teamMembers: selectedCompetitionTeam,
      supervisor: selectedCompetitionSupervisor,
    });
    alert('Competition registration submitted successfully!');
  };

  const toggleResearchTopic = (topic) => {
    setSelectedResearchTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const removeResearchTopic = (topic) => {
    setSelectedResearchTopics((prev) => prev.filter((t) => t !== topic));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>Activity Registration</h1>
        <p className="text-muted-foreground">
          Register for PKL (Internship), Thesis, or Academic Competition
        </p>
      </div>

      {/* Activity Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Activity Type</CardTitle>
          <CardDescription>
            Choose the type of activity you want to register for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedActivity} onValueChange={setSelectedActivity}>
            {/* Mobile: Dropdown */}
            <div className="md:hidden">
              <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an activity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pkl">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>PKL (Internship)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="skripsi">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      <span>Thesis</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="competition">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      <span>Competition</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Desktop: Tabs */}
            <TabsList className="hidden md:grid w-full grid-cols-3">
              <TabsTrigger value="pkl" className="gap-2">
                <Briefcase className="w-4 h-4" />
                PKL (Internship)
              </TabsTrigger>
              <TabsTrigger value="skripsi" className="gap-2">
                <GraduationCap className="w-4 h-4" />
                Thesis
              </TabsTrigger>
              <TabsTrigger value="competition" className="gap-2">
                <Trophy className="w-4 h-4" />
                Competition
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* PKL Form */}
      {selectedActivity === 'pkl' && (
        <div className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>PKL Registration</AlertTitle>
            <AlertDescription>
              Register for your internship program. We'll recommend team members and supervisors based on your interests and expertise alignment.
            </AlertDescription>
          </Alert>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Your basic information from your profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pkl-name">Full Name</Label>
                  <Input
                    id="pkl-name"
                    value={studentInfo.name}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pkl-nim">NIM</Label>
                  <Input
                    id="pkl-nim"
                    value={studentInfo.nim}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PKL Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                PKL Details
              </CardTitle>
              <CardDescription>Provide information about your internship</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Your Interests</Label>
                <div className="flex gap-2">
                  {studentInfo.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pkl-company">Preferred Company/Institution (Optional)</Label>
                <Input
                  id="pkl-company"
                  placeholder="e.g., PT. Technology Indonesia"
                  value={pklFormData.preferredCompany}
                  onChange={(e) =>
                    setPklFormData({ ...pklFormData, preferredCompany: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pkl-description">PKL Description</Label>
                <Textarea
                  id="pkl-description"
                  placeholder="Describe your PKL goals, objectives, and what you hope to achieve..."
                  value={pklFormData.description}
                  onChange={(e) =>
                    setPklFormData({ ...pklFormData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Recommended Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Recommended Team Members
              </CardTitle>
              <CardDescription>
                Students with matching interests and expertise for collaboration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Select</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>NIM</TableHead>
                      <TableHead>Interests</TableHead>
                      <TableHead>GPA</TableHead>
                      <TableHead>Match Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recommendedTeamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedTeamMembers.includes(member.id)}
                            onCheckedChange={() => handleTeamMemberToggle(member.id)}
                          />
                        </TableCell>
                        <TableCell>{member.name}</TableCell>
                        <TableCell className="text-muted-foreground">{member.nim}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {member.interests.slice(0, 2).map((interest, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {interest}
                              </Badge>
                            ))}
                            {member.interests.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{member.interests.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{member.gpa}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getMatchColor(member.matchScore)}>
                            {member.matchScore}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {selectedTeamMembers.length > 0 && (
                <div className="mt-4 p-3 bg-accent rounded-lg">
                  <p className="text-sm">
                    <CheckCircle2 className="w-4 h-4 inline mr-1" />
                    {selectedTeamMembers.length} team member(s) selected
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommended Supervisors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Recommended PKL Supervisors
              </CardTitle>
              <CardDescription>
                Lecturers with expertise matching your interests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Select</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Expertise</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Availability</TableHead>
                      <TableHead>Match Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recommendedSupervisors.map((supervisor) => (
                      <TableRow key={supervisor.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedSupervisor === supervisor.id}
                            onCheckedChange={() => handleSupervisorSelect(supervisor.id)}
                            disabled={supervisor.availability === 'Not Available'}
                          />
                        </TableCell>
                        <TableCell>{supervisor.name}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {supervisor.expertise.slice(0, 2).map((exp, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {exp}
                              </Badge>
                            ))}
                            {supervisor.expertise.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{supervisor.expertise.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {supervisor.currentStudents} / {supervisor.maxStudents}
                        </TableCell>
                        <TableCell>
                          <Badge className={getAvailabilityColor(supervisor.availability)}>
                            {supervisor.availability}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getMatchColor(supervisor.matchScore)}>
                            {supervisor.matchScore}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {selectedSupervisor && (
                <div className="mt-4 p-3 bg-accent rounded-lg">
                  <p className="text-sm">
                    <CheckCircle2 className="w-4 h-4 inline mr-1" />
                    Supervisor selected
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">Save as Draft</Button>
            <Button onClick={handlePKLSubmit} disabled={!selectedSupervisor}>
              Submit PKL Registration
            </Button>
          </div>
        </div>
      )}

      {/* Thesis Form */}
      {selectedActivity === 'skripsi' && (
        <div className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Thesis Registration</AlertTitle>
            <AlertDescription>
              Register for your thesis project. Select your research topics, and we'll recommend main and assistant supervisors based on your interests.
            </AlertDescription>
          </Alert>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Your basic information from your profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="thesis-name">Full Name</Label>
                  <Input
                    id="thesis-name"
                    value={studentInfo.name}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thesis-nim">NIM</Label>
                  <Input
                    id="thesis-nim"
                    value={studentInfo.nim}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thesis Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Thesis Details
              </CardTitle>
              <CardDescription>Provide your thesis title and abstract</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="thesis-title">Thesis Title</Label>
                <Input
                  id="thesis-title"
                  placeholder="Enter your thesis title..."
                  value={thesisFormData.title}
                  onChange={(e) =>
                    setThesisFormData({ ...thesisFormData, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thesis-abstract">Abstract</Label>
                <Textarea
                  id="thesis-abstract"
                  placeholder="Write your thesis abstract here..."
                  value={thesisFormData.abstract}
                  onChange={(e) =>
                    setThesisFormData({ ...thesisFormData, abstract: e.target.value })
                  }
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          {/* Research Topics */}
          <Card>
            <CardHeader>
              <CardTitle>Research Topics</CardTitle>
              <CardDescription>
                Select multiple research topics related to your thesis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Topics</Label>
                <Select onValueChange={toggleResearchTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose research topics..." />
                  </SelectTrigger>
                  <SelectContent>
                    {researchTopics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedResearchTopics.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Topics</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedResearchTopics.map((topic) => (
                      <Badge key={topic} variant="secondary" className="gap-1">
                        {topic}
                        <button
                          onClick={() => removeResearchTopic(topic)}
                          className="ml-1 hover:bg-muted rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Supervisor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Main Supervisor
              </CardTitle>
              <CardDescription>
                Select your main thesis supervisor based on expertise match
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Select</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Expertise</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Availability</TableHead>
                      <TableHead>Match Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recommendedSupervisors.map((supervisor) => (
                      <TableRow key={supervisor.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedMainSupervisor === supervisor.id}
                            onCheckedChange={() => setSelectedMainSupervisor(supervisor.id)}
                            disabled={supervisor.availability === 'Not Available'}
                          />
                        </TableCell>
                        <TableCell>{supervisor.name}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {supervisor.expertise.slice(0, 2).map((exp, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {exp}
                              </Badge>
                            ))}
                            {supervisor.expertise.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{supervisor.expertise.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {supervisor.currentStudents} / {supervisor.maxStudents}
                        </TableCell>
                        <TableCell>
                          <Badge className={getAvailabilityColor(supervisor.availability)}>
                            {supervisor.availability}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getMatchColor(supervisor.matchScore)}>
                            {supervisor.matchScore}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {selectedMainSupervisor && (
                <div className="mt-4 p-3 bg-accent rounded-lg">
                  <p className="text-sm">
                    <CheckCircle2 className="w-4 h-4 inline mr-1" />
                    Main supervisor selected
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assistant Supervisor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Assistant Supervisor
              </CardTitle>
              <CardDescription>
                Select your assistant thesis supervisor (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Select</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Expertise</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Availability</TableHead>
                      <TableHead>Match Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recommendedSupervisors
                      .filter((s) => s.id !== selectedMainSupervisor)
                      .map((supervisor) => (
                        <TableRow key={supervisor.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedAssistantSupervisor === supervisor.id}
                              onCheckedChange={() =>
                                setSelectedAssistantSupervisor(supervisor.id)
                              }
                              disabled={supervisor.availability === 'Not Available'}
                            />
                          </TableCell>
                          <TableCell>{supervisor.name}</TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {supervisor.expertise.slice(0, 2).map((exp, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {exp}
                                </Badge>
                              ))}
                              {supervisor.expertise.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{supervisor.expertise.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {supervisor.currentStudents} / {supervisor.maxStudents}
                          </TableCell>
                          <TableCell>
                            <Badge className={getAvailabilityColor(supervisor.availability)}>
                              {supervisor.availability}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getMatchColor(supervisor.matchScore)}>
                              {supervisor.matchScore}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              {selectedAssistantSupervisor && (
                <div className="mt-4 p-3 bg-accent rounded-lg">
                  <p className="text-sm">
                    <CheckCircle2 className="w-4 h-4 inline mr-1" />
                    Assistant supervisor selected
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">Save as Draft</Button>
            <Button
              onClick={handleThesisSubmit}
              disabled={!thesisFormData.title || !selectedMainSupervisor}
            >
              Submit Thesis Registration
            </Button>
          </div>
        </div>
      )}

      {/* Competition Form */}
      {selectedActivity === 'competition' && (
        <div className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Competition Registration</AlertTitle>
            <AlertDescription>
              Register for academic competitions. Form teams with matching skills and get supervisor support.
            </AlertDescription>
          </Alert>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Your basic information from your profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="comp-name">Full Name</Label>
                  <Input
                    id="comp-name"
                    value={studentInfo.name}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comp-nim">NIM</Label>
                  <Input
                    id="comp-nim"
                    value={studentInfo.nim}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Competition Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Competition Details
              </CardTitle>
              <CardDescription>Provide information about the competition</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="comp-title">Competition Name/Activity</Label>
                <Input
                  id="comp-title"
                  placeholder="e.g., National Data Science Competition 2025"
                  value={competitionFormData.competitionName}
                  onChange={(e) =>
                    setCompetitionFormData({
                      ...competitionFormData,
                      competitionName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comp-field">Competition Field</Label>
                <Select
                  value={competitionFormData.competitionField}
                  onValueChange={(value) =>
                    setCompetitionFormData({ ...competitionFormData, competitionField: value })
                  }
                >
                  <SelectTrigger id="comp-field">
                    <SelectValue placeholder="Select competition field..." />
                  </SelectTrigger>
                  <SelectContent>
                    {competitionFields.map((field) => (
                      <SelectItem key={field} value={field}>
                        {field}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Team Members */}
          {competitionFormData.competitionField && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Recommended Team Members
                </CardTitle>
                <CardDescription>
                  Students matching your selected field: {competitionFormData.competitionField}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Select</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>NIM</TableHead>
                        <TableHead>Interests</TableHead>
                        <TableHead>GPA</TableHead>
                        <TableHead>Match Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recommendedTeamMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedCompetitionTeam.includes(member.id)}
                              onCheckedChange={() => {
                                setSelectedCompetitionTeam((prev) =>
                                  prev.includes(member.id)
                                    ? prev.filter((id) => id !== member.id)
                                    : [...prev, member.id]
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>{member.name}</TableCell>
                          <TableCell className="text-muted-foreground">{member.nim}</TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {member.interests.slice(0, 2).map((interest, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {interest}
                                </Badge>
                              ))}
                              {member.interests.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{member.interests.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{member.gpa}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getMatchColor(member.matchScore)}>
                              {member.matchScore}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {selectedCompetitionTeam.length > 0 && (
                  <div className="mt-4 p-3 bg-accent rounded-lg">
                    <p className="text-sm">
                      <CheckCircle2 className="w-4 h-4 inline mr-1" />
                      {selectedCompetitionTeam.length} team member(s) selected
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Competition Supervisor */}
          {competitionFormData.competitionField && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Competition Supervisor
                </CardTitle>
                <CardDescription>
                  Select a supervisor to guide your competition team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Select</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Expertise</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Availability</TableHead>
                        <TableHead>Match Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recommendedSupervisors.map((supervisor) => (
                        <TableRow key={supervisor.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedCompetitionSupervisor === supervisor.id}
                              onCheckedChange={() =>
                                setSelectedCompetitionSupervisor(supervisor.id)
                              }
                              disabled={supervisor.availability === 'Not Available'}
                            />
                          </TableCell>
                          <TableCell>{supervisor.name}</TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {supervisor.expertise.slice(0, 2).map((exp, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {exp}
                                </Badge>
                              ))}
                              {supervisor.expertise.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{supervisor.expertise.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {supervisor.currentStudents} / {supervisor.maxStudents}
                          </TableCell>
                          <TableCell>
                            <Badge className={getAvailabilityColor(supervisor.availability)}>
                              {supervisor.availability}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getMatchColor(supervisor.matchScore)}>
                              {supervisor.matchScore}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {selectedCompetitionSupervisor && (
                  <div className="mt-4 p-3 bg-accent rounded-lg">
                    <p className="text-sm">
                      <CheckCircle2 className="w-4 h-4 inline mr-1" />
                      Supervisor selected
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">Save as Draft</Button>
            <Button
              onClick={handleCompetitionSubmit}
              disabled={
                !competitionFormData.competitionName ||
                !competitionFormData.competitionField ||
                !selectedCompetitionSupervisor
              }
            >
              Submit Competition Registration
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
