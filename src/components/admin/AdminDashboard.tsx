'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth-neon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Users, FileText, BookOpen, Award, Shield, Eye } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, Pie, PieChart, Cell, ResponsiveContainer, CartesianGrid, XAxis } from 'recharts';
// import { getAllUsers, getUserStats, updateVerificationStatus, getAccountLevelName } from '@/lib/database-operations';
// import type { UserProfile } from '@/lib/database';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const mockApplications = [
  { id: 1, name: 'Linh Nguyen', eduscore: 88, status: 'Pending', date: '2024-07-20', scholarship: 'Future Leaders Grant' },
  { id: 2, name: 'An Tran', eduscore: 92, status: 'Approved', date: '2024-07-19', scholarship: 'STEM Achievers Award' },
  { id: 3, name: 'Bao Pham', eduscore: 75, status: 'Pending', date: '2024-07-21', scholarship: 'Creative Minds Scholarship' },
  { id: 4, name: 'Chi Le', eduscore: 68, status: 'Rejected', date: '2024-07-18', scholarship: 'Community First Scholarship' },
  { id: 5, name: 'Dung Hoang', eduscore: 81, status: 'Pending', date: '2024-07-22', scholarship: 'Phoenix Scholars Program' },
  { id: 6, name: 'Giang Tran', eduscore: 95, status: 'Approved', date: '2024-07-20', scholarship: 'STEM Achievers Award' },
  { id: 7, name: 'Hieu Nguyen', eduscore: 78, status: 'Pending', date: '2024-07-23', scholarship: 'Phoenix Scholars Program' },
];

const scholarshipStatusData = [
    { status: 'pending', count: 4, fill: 'var(--color-pending)'},
    { status: 'approved', count: 2, fill: 'var(--color-approved)'},
    { status: 'rejected', count: 1, fill: 'var(--color-rejected)'},
];
const scholarshipStatusConfig = {
    count: { label: 'Applications' },
    pending: { label: 'Pending', color: 'hsl(var(--chart-4))' },
    approved: { label: 'Approved', color: 'hsl(var(--chart-1))' },
    rejected: { label: 'Rejected', color: 'hsl(var(--destructive))' },
} satisfies ChartConfig;


const courseEnrollmentData = [
  { name: 'Web Dev', students: 1250, fill: 'var(--color-web)' },
  { name: 'Business', students: 850, fill: 'var(--color-business)' },
  { name: 'Design', students: 2100, fill: 'var(--color-design)' },
  { name: 'Data Sci', students: 1800, fill: 'var(--color-data)' },
  { name: 'Well-being', students: 5400, fill: 'var(--color-wellbeing)' },
  { name: 'Marketing', students: 980, fill: 'var(--color-marketing)' },
  { name: 'Physics', students: 600, fill: 'var(--color-physics)' },
];
const courseEnrollmentConfig = {
    students: { label: 'Students' },
    web: { label: 'Web Dev', color: 'hsl(var(--chart-1))' },
    business: { label: 'Business', color: 'hsl(var(--chart-2))' },
    design: { label: 'Design', color: 'hsl(var(--chart-3))' },
    data: { label: 'Data Sci', color: 'hsl(var(--chart-4))' },
    wellbeing: { label: 'Well-being', color: 'hsl(var(--chart-5))' },
    marketing: { label: 'Marketing', color: 'hsl(var(--chart-2))' },
    physics: { label: 'Physics', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;


// Mock user type for demo purposes
type MockUserProfile = {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  accountLevel: number;
  verificationStatus: 'unverified' | 'pending' | 'verified';
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  createdAt: Date;
  updatedAt: Date;
};

// Mock users data
const mockUsers: MockUserProfile[] = [
  {
    id: '1',
    email: 'student1@test.com',
    name: 'Nguyen Van A',
    role: 'student',
    accountLevel: 1,
    verificationStatus: 'verified',
    dateOfBirth: new Date('1995-05-15'),
    gender: 'male',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-07-20'),
  },
  {
    id: '2',
    email: 'student2@test.com',
    name: 'Tran Thi B',
    role: 'student',
    accountLevel: 2,
    verificationStatus: 'pending',
    dateOfBirth: new Date('1998-03-22'),
    gender: 'female',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-07-18'),
  },
  {
    id: '3',
    email: 'admin@hyhan.vn',
    name: 'Admin',
    role: 'admin',
    accountLevel: 999,
    verificationStatus: 'verified',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-07-25'),
  }
];

// Mock user stats
const mockUserStats = {
  totalUsers: 3,
  verifiedUsers: 2,
  pendingVerification: 1,
};

// Mock function to get account level name
const getAccountLevelName = (level: number) => {
  if (level >= 999) return 'Admin';
  if (level >= 5) return 'Advanced';
  if (level >= 3) return 'Intermediate';
  return 'Beginner';
};

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<MockUserProfile[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<MockUserProfile | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') {
        router.push('/login');
      } else {
        loadAdminData();
      }
    }
  }, [user, loading, router]);
  
  const loadAdminData = async () => {
    try {
      // Use mock data instead of database calls
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
      setUsers(mockUsers);
      setUserStats(mockUserStats);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  if (loading || !user || user.role !== 'admin' || isLoadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalApplications = mockApplications.length;
  const pendingCount = mockApplications.filter(app => app.status === 'Pending').length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">Manage users, applications, and site statistics.</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">{userStats?.verifiedUsers || 0} verified</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats?.pendingVerification || 0}</div>
             <p className="text-xs text-muted-foreground">accounts awaiting verification</p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scholarship Application Status</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent className="pb-0">
                <ChartContainer config={scholarshipStatusConfig} className="h-24">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart accessibilityLayer>
                        <Pie data={scholarshipStatusData} dataKey="count" nameKey="status" innerRadius={25} outerRadius={40} strokeWidth={2}>
                           {scholarshipStatusData.map((entry) => (
                             <Cell key={`cell-${entry.status}`} fill={entry.fill} />
                           ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent nameKey="status" />} />
                      </PieChart>
                   </ResponsiveContainer>
                </ChartContainer>
             </CardContent>
             <CardFooter className="flex-row gap-2 border-t p-2 text-xs">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[--color-pending]" />
                    <span className="text-muted-foreground">Pending ({scholarshipStatusData.find(d => d.status === 'pending')?.count})</span>
                </div>
                 <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[--color-approved]" />
                    <span className="text-muted-foreground">Approved ({scholarshipStatusData.find(d => d.status === 'approved')?.count})</span>
                </div>
                 <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[--color-rejected]" />
                    <span className="text-muted-foreground">Rejected ({scholarshipStatusData.find(d => d.status === 'rejected')?.count})</span>
                </div>
             </CardFooter>
        </Card>
      </div>
      
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> Course Enrollment</CardTitle>
                    <CardDescription>Number of students enrolled in each course category.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={courseEnrollmentConfig} className="h-64 w-full">
                        <BarChart data={courseEnrollmentData} accessibilityLayer>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                            <Bar dataKey="students" radius={4}>
                                {courseEnrollmentData.map((entry) => (
                                    <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
       </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage user accounts. Total users: {users.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Account Level</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((userProfile) => (
                <TableRow key={userProfile.id}>
                  <TableCell className="font-medium">{userProfile.name}</TableCell>
                  <TableCell className="text-muted-foreground">{userProfile.email}</TableCell>
                  <TableCell>
                    <Badge variant={userProfile.role === 'admin' ? 'default' : 'secondary'}>
                      {userProfile.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{getAccountLevelName(userProfile.accountLevel)}</Badge>
                      <span className="text-xs text-muted-foreground">L{userProfile.accountLevel}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      userProfile.verificationStatus === 'verified' ? 'default' : 
                      userProfile.verificationStatus === 'pending' ? 'secondary' : 'destructive'
                    }>
                      {userProfile.verificationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {userProfile.createdAt ? format(userProfile.createdAt, 'MMM dd, yyyy') : 'Unknown'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedUser(userProfile)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>User Details: {selectedUser?.name}</DialogTitle>
                          <DialogDescription>
                            Complete profile information for {selectedUser?.email}
                          </DialogDescription>
                        </DialogHeader>
                        {selectedUser && (
                          <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="font-semibold">Email</p>
                                <p className="text-muted-foreground">{selectedUser.email}</p>
                              </div>
                              <div>
                                <p className="font-semibold">Role</p>
                                <p className="text-muted-foreground capitalize">{selectedUser.role}</p>
                              </div>
                              <div>
                                <p className="font-semibold">Account Level</p>
                                <p className="text-muted-foreground">{getAccountLevelName(selectedUser.accountLevel)} (Level {selectedUser.accountLevel})</p>
                              </div>
                              <div>
                                <p className="font-semibold">Verification Status</p>
                                <p className="text-muted-foreground capitalize">{selectedUser.verificationStatus}</p>
                              </div>
                              <div>
                                <p className="font-semibold">Date of Birth</p>
                                <p className="text-muted-foreground">
                                  {selectedUser.dateOfBirth ? format(selectedUser.dateOfBirth, 'PPP') : 'Not set'}
                                </p>
                              </div>
                              <div>
                                <p className="font-semibold">Gender</p>
                                <p className="text-muted-foreground capitalize">{selectedUser.gender || 'Not set'}</p>
                              </div>
                              <div>
                                <p className="font-semibold">Joined</p>
                                <p className="text-muted-foreground">
                                  {selectedUser.createdAt ? format(selectedUser.createdAt, 'PPP') : 'Unknown'}
                                </p>
                              </div>
                              <div>
                                <p className="font-semibold">Last Updated</p>
                                <p className="text-muted-foreground">
                                  {selectedUser.updatedAt ? format(selectedUser.updatedAt, 'PPP') : 'Unknown'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
