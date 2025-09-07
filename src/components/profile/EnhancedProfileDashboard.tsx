'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth-neon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Loader2, User, Award, ArrowRight, LayoutDashboard, Shield, FileCheck, 
  GraduationCap, Briefcase, Star, Plus, Edit, CheckCircle, AlertCircle,
  BookOpen, Target, TrendingUp, Users, MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { getAccountLevelName } from '@/lib/utils';
import type { EduscoreData, VerificationDocument } from '@/lib/database-operations';

interface UserSkill {
  id: string;
  skillName: string;
  proficiencyLevel: string;
  verified: boolean;
  certificationUrl?: string;
}

interface UserEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  verified: boolean;
}

interface UserExperience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  currentlyWorking: boolean;
  verified: boolean;
}

interface ProfileStats {
  totalSkills: number;
  verifiedSkills: number;
  totalEducation: number;
  verifiedEducation: number;
  totalExperience: number;
  verifiedExperience: number;
  profileCompleteness: number;
  accountLevel: number;
  nextLevelRequirements: string[];
}

export default function EnhancedProfileDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  
  const [eduscoreResult, setEduscoreResult] = useState<EduscoreData | null>(null);
  const [verificationDocs, setVerificationDocs] = useState<VerificationDocument[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [userEducation, setUserEducation] = useState<UserEducation[]>([]);
  const [userExperience, setUserExperience] = useState<UserExperience[]>([]);
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const mockSkills: UserSkill[] = [
    { id: '1', skillName: 'JavaScript', proficiencyLevel: 'advanced', verified: true, certificationUrl: 'https://cert.example.com/js' },
    { id: '2', skillName: 'React', proficiencyLevel: 'expert', verified: true },
    { id: '3', skillName: 'Python', proficiencyLevel: 'intermediate', verified: false },
    { id: '4', skillName: 'Machine Learning', proficiencyLevel: 'beginner', verified: false },
  ];

  const mockEducation: UserEducation[] = [
    {
      id: '1',
      institution: 'MIT',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2020-09',
      endDate: '2024-05',
      gpa: '3.8/4.0',
      verified: true
    },
    {
      id: '2',
      institution: 'Harvard Extension',
      degree: 'Certificate',
      fieldOfStudy: 'Data Science',
      startDate: '2023-01',
      endDate: '2023-06',
      verified: false
    }
  ];

  const mockExperience: UserExperience[] = [
    {
      id: '1',
      company: 'Google',
      position: 'Software Engineer Intern',
      description: 'Developed React components for internal tools',
      startDate: '2023-06',
      endDate: '2023-09',
      currentlyWorking: false,
      verified: true
    },
    {
      id: '2',
      company: 'Startup Inc.',
      position: 'Full Stack Developer',
      description: 'Working on fintech applications',
      startDate: '2024-01',
      currentlyWorking: true,
      verified: false
    }
  ];

  const mockProfileStats: ProfileStats = {
    totalSkills: 4,
    verifiedSkills: 2,
    totalEducation: 2,
    verifiedEducation: 1,
    totalExperience: 2,
    verifiedExperience: 1,
    profileCompleteness: 75,
    accountLevel: 3,
    nextLevelRequirements: [
      'Verify at least 1 more education credential',
      'Add 2 more verified skills',
      'Complete blockchain wallet verification'
    ]
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          // Load existing data
          const eduscoreResponse = await fetch('/api/user/eduscore');
          if (eduscoreResponse.ok) {
            const { eduscore } = await eduscoreResponse.json();
            if (eduscore) {
              setEduscoreResult(eduscore);
            }
          }
          
          const docsResponse = await fetch('/api/user/documents');
          if (docsResponse.ok) {
            const { documents } = await docsResponse.json();
            setVerificationDocs(documents);
          }

          // Set mock data
          setUserSkills(mockSkills);
          setUserEducation(mockEducation);
          setUserExperience(mockExperience);
          setProfileStats(mockProfileStats);
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
      setIsLoading(false);
    };
    
    loadUserData();
  }, [user]);

  if (loading || !user || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const chartData = eduscoreResult ? [{ name: 'Eduscore', value: eduscoreResult.score, fill: 'hsl(var(--primary))' }] : [];
  
  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-purple-500';
      case 'advanced': return 'bg-blue-500';
      case 'intermediate': return 'bg-green-500';
      case 'beginner': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const ProfileCompleteness = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Profile Completeness
        </CardTitle>
        <CardDescription>
          Complete your profile to unlock more opportunities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">{profileStats?.profileCompleteness}% Complete</span>
            <Badge variant={profileStats && profileStats.profileCompleteness > 80 ? 'default' : 'secondary'}>
              Level {profileStats?.accountLevel}
            </Badge>
          </div>
          <Progress value={profileStats?.profileCompleteness} className="h-3" />
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Next Level Requirements:</h4>
            {profileStats?.nextLevelRequirements.map((req, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                {req}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name || user.email}!</h1>
          <p className="text-muted-foreground">
            Your comprehensive profile dashboard with verification system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            {getAccountLevelName(user.accountLevel)} - Level {user.accountLevel}
          </Badge>
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            AI Assistant
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verified Skills</p>
                <p className="text-2xl font-bold">{profileStats?.verifiedSkills}/{profileStats?.totalSkills}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Education</p>
                <p className="text-2xl font-bold">{profileStats?.verifiedEducation}/{profileStats?.totalEducation}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Experience</p>
                <p className="text-2xl font-bold">{profileStats?.verifiedExperience}/{profileStats?.totalExperience}</p>
              </div>
              <Briefcase className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">EduScore</p>
                <p className="text-2xl font-bold">{eduscoreResult?.score || 'N/A'}</p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {user.role === 'admin' && (
                <Card className="bg-primary/10 border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LayoutDashboard />
                      Admin Access
                    </CardTitle>
                    <CardDescription>You have administrative privileges.</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/admin">Go to Admin Dashboard</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award />
                    Your EduScore
                  </CardTitle>
                  {!eduscoreResult && (
                    <CardDescription>
                      Complete the survey to unlock AI-powered scholarship matching
                    </CardDescription>
                  )}
                </CardHeader>
                {eduscoreResult ? (
                  <>
                    <CardContent className="grid md:grid-cols-2 gap-8 items-center">
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadialBarChart innerRadius="70%" outerRadius="100%" data={chartData} startAngle={90} endAngle={-270}>
                            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                            <RadialBar background dataKey='value' cornerRadius={10} />
                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-4xl font-bold fill-foreground">
                              {eduscoreResult.score}
                            </text>
                            <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" className="text-md fill-muted-foreground">
                              / 100
                            </text>
                          </RadialBarChart>
                        </ResponsiveContainer>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2 text-primary">AI Evaluation Summary</h3>
                        <p className="text-sm text-muted-foreground italic">"{eduscoreResult.reasoning}"</p>
                      </div>
                    </CardContent>
                    <CardFooter className='flex-col items-start gap-4'>
                      <Button asChild>
                        <Link href="/scholarship">
                          View Matching Scholarships <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </>
                ) : (
                  <CardContent className="flex flex-col items-center justify-center text-center p-12">
                    <p className="text-muted-foreground mb-4">Complete the EduScore survey to unlock opportunities</p>
                    <Button asChild>
                      <Link href="/survey">Take the Survey</Link>
                    </Button>
                  </CardContent>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Skills & Certifications</CardTitle>
                    <CardDescription>Showcase your verified skills and certifications</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {userSkills.map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getProficiencyColor(skill.proficiencyLevel)}`} />
                          <div>
                            <h4 className="font-medium">{skill.skillName}</h4>
                            <p className="text-sm text-muted-foreground capitalize">{skill.proficiencyLevel}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {skill.verified ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Unverified
                            </Badge>
                          )}
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Education History</CardTitle>
                    <CardDescription>Track your educational achievements</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {userEducation.map((edu) => (
                      <div key={edu.id} className="border-l-4 border-primary pl-6 pb-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{edu.degree}</h4>
                            <p className="text-muted-foreground">{edu.institution}</p>
                            <p className="text-sm text-muted-foreground">{edu.fieldOfStudy}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {edu.startDate} - {edu.endDate || 'Present'}
                            </p>
                            {edu.gpa && (
                              <p className="text-sm font-medium mt-2">GPA: {edu.gpa}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {edu.verified ? (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Unverified
                              </Badge>
                            )}
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Work Experience</CardTitle>
                    <CardDescription>Document your professional experience</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {userExperience.map((exp) => (
                      <div key={exp.id} className="border-l-4 border-green-500 pl-6 pb-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{exp.position}</h4>
                            <p className="text-muted-foreground">{exp.company}</p>
                            <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {exp.verified ? (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Unverified
                              </Badge>
                            )}
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <ProfileCompleteness />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Account Status</span>
                <Badge variant={user.verificationStatus === 'verified' ? 'default' : 'secondary'}>
                  {user.verificationStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Documents</span>
                <span className="text-sm text-muted-foreground">{verificationDocs.length} uploaded</span>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/verification">
                  <FileCheck className="h-4 w-4 mr-2" />
                  Manage Documents
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/forum">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Join Community Forum
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/scholarship">
                  <Award className="h-4 w-4 mr-2" />
                  Browse Scholarships
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/course">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Courses
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}