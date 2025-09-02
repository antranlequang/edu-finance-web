'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Users, FileText, BookOpen, Award } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, Pie, PieChart, Cell, ResponsiveContainer, CartesianGrid, XAxis } from 'recharts';

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


export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
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
            <div className="text-2xl font-bold">1,254</div>
            <p className="text-xs text-muted-foreground">+50 since last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
             <p className="text-xs text-muted-foreground">{pendingCount} pending review</p>
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
          <CardTitle>Recent Financial Aid Applications</CardTitle>
          <CardDescription>Review and manage the {mockApplications.length} most recent student applications.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Scholarship</TableHead>
                <TableHead className="text-center">Eduscore</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.name}</TableCell>
                   <TableCell className="text-muted-foreground">{app.scholarship}</TableCell>
                  <TableCell className="text-center font-semibold">{app.eduscore}</TableCell>
                  <TableCell>
                    <Badge variant={
                      app.status === 'Approved' ? 'default' : 
                      app.status === 'Rejected' ? 'destructive' : 'secondary'
                    } className={app.status === 'Approved' ? 'bg-green-600/80 text-primary-foreground' : ''}>{app.status}</Badge>
                  </TableCell>
                  <TableCell>{app.date}</TableCell>
                  <TableCell className="text-right">
                    {app.status === 'Pending' ? (
                      <div className="space-x-2">
                         <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-100 hover:text-green-700">Approve</Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-100 hover:text-red-700">Reject</Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm">View Details</Button>
                    )}
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
