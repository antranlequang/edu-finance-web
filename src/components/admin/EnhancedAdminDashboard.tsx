'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth-neon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Loader2, Users, FileText, BookOpen, Award, Shield, Eye, TrendingUp,
  Activity, DollarSign, UserCheck, AlertTriangle, ChevronUp, ChevronDown,
  Calendar, BarChart3, LineChart, Settings
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { 
  Bar, BarChart, Pie, PieChart, Cell, ResponsiveContainer, CartesianGrid, 
  XAxis, YAxis, Area, AreaChart, Line, LineChart as RechartsLineChart,
  Legend, Tooltip
} from 'recharts';
import { format, subDays, subMonths } from 'date-fns';

// Enhanced interfaces
interface UserProfile {
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
  lastLogin?: Date;
  eduScore?: number;
  verifiedSkills: number;
  forumPosts: number;
  scholarshipApplications: number;
}

interface AdminStats {
  totalUsers: number;
  newUsersThisMonth: number;
  verifiedUsers: number;
  pendingVerification: number;
  totalEduScores: number;
  averageEduScore: number;
  totalScholarshipApplications: number;
  approvedApplications: number;
  totalForumPosts: number;
  activeUsersToday: number;
  totalRevenue: number;
  platformGrowthRate: number;
}

interface ChartData {
  userGrowth: Array<{ date: string; users: number; newUsers: number }>;
  eduScoreDistribution: Array<{ range: string; count: number; fill: string }>;
  verificationStats: Array<{ status: string; count: number; fill: string }>;
  scholarshipApplications: Array<{ month: string; applications: number; approved: number }>;
  userActivity: Array<{ hour: string; posts: number; logins: number }>;
  levelDistribution: Array<{ level: string; count: number; percentage: number }>;
  skillsAnalytics: Array<{ skill: string; verified: number; unverified: number }>;
}

export default function EnhancedAdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '3m' | '1y'>('30d');

  // Mock comprehensive data
  const mockUsers: UserProfile[] = [
    {
      id: '1',
      email: 'student1@test.com',
      name: 'Alice Johnson',
      role: 'student',
      accountLevel: 4,
      verificationStatus: 'verified',
      dateOfBirth: new Date('1995-05-15'),
      gender: 'female',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-07-20'),
      lastLogin: new Date('2024-07-25'),
      eduScore: 87,
      verifiedSkills: 5,
      forumPosts: 12,
      scholarshipApplications: 3
    },
    {
      id: '2',
      email: 'student2@test.com',
      name: 'Bob Smith',
      role: 'student',
      accountLevel: 2,
      verificationStatus: 'pending',
      dateOfBirth: new Date('1998-03-22'),
      gender: 'male',
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-07-18'),
      lastLogin: new Date('2024-07-24'),
      eduScore: 72,
      verifiedSkills: 2,
      forumPosts: 5,
      scholarshipApplications: 1
    },
    {
      id: '3',
      email: 'charlie@test.com',
      name: 'Charlie Brown',
      role: 'student',
      accountLevel: 3,
      verificationStatus: 'verified',
      createdAt: new Date('2024-03-05'),
      updatedAt: new Date('2024-07-22'),
      lastLogin: new Date('2024-07-25'),
      eduScore: 95,
      verifiedSkills: 7,
      forumPosts: 8,
      scholarshipApplications: 2
    }
  ];

  const mockAdminStats: AdminStats = {
    totalUsers: 2847,
    newUsersThisMonth: 234,
    verifiedUsers: 1923,
    pendingVerification: 456,
    totalEduScores: 2103,
    averageEduScore: 78.5,
    totalScholarshipApplications: 1456,
    approvedApplications: 892,
    totalForumPosts: 3421,
    activeUsersToday: 423,
    totalRevenue: 125430,
    platformGrowthRate: 23.5
  };

  const mockChartData: ChartData = {
    userGrowth: [
      { date: '2024-01', users: 1200, newUsers: 120 },
      { date: '2024-02', users: 1450, newUsers: 250 },
      { date: '2024-03', users: 1750, newUsers: 300 },
      { date: '2024-04', users: 2100, newUsers: 350 },
      { date: '2024-05', users: 2400, newUsers: 300 },
      { date: '2024-06', users: 2650, newUsers: 250 },
      { date: '2024-07', users: 2847, newUsers: 197 }
    ],
    eduScoreDistribution: [
      { range: '90-100', count: 312, fill: 'hsl(var(--chart-1))' },
      { range: '80-89', count: 578, fill: 'hsl(var(--chart-2))' },
      { range: '70-79', count: 734, fill: 'hsl(var(--chart-3))' },
      { range: '60-69', count: 423, fill: 'hsl(var(--chart-4))' },
      { range: '0-59', count: 56, fill: 'hsl(var(--chart-5))' }
    ],
    verificationStats: [
      { status: 'verified', count: 1923, fill: 'hsl(var(--chart-1))' },
      { status: 'pending', count: 456, fill: 'hsl(var(--chart-4))' },
      { status: 'unverified', count: 468, fill: 'hsl(var(--chart-5))' }
    ],
    scholarshipApplications: [
      { month: 'Jan', applications: 145, approved: 89 },
      { month: 'Feb', applications: 189, approved: 134 },
      { month: 'Mar', applications: 234, approved: 156 },
      { month: 'Apr', applications: 267, approved: 178 },
      { month: 'May', applications: 198, approved: 123 },
      { month: 'Jun', applications: 234, approved: 145 },
      { month: 'Jul', applications: 189, approved: 67 }
    ],
    userActivity: [
      { hour: '00', posts: 12, logins: 34 },
      { hour: '06', posts: 23, logins: 78 },
      { hour: '12', posts: 89, logins: 234 },
      { hour: '18', posts: 67, logins: 189 },
      { hour: '24', posts: 45, logins: 123 }
    ],
    levelDistribution: [
      { level: 'Beginner (1-2)', count: 1234, percentage: 43.4 },
      { level: 'Intermediate (3-4)', count: 987, percentage: 34.7 },
      { level: 'Advanced (5-6)', count: 456, percentage: 16.0 },
      { level: 'Expert (7+)', count: 170, percentage: 5.9 }
    ],
    skillsAnalytics: [
      { skill: 'JavaScript', verified: 234, unverified: 145 },
      { skill: 'Python', verified: 189, unverified: 234 },
      { skill: 'React', verified: 167, unverified: 123 },
      { skill: 'Data Science', verified: 89, unverified: 167 },
      { skill: 'Machine Learning', verified: 67, unverified: 234 }
    ]
  };

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
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(mockUsers);
      setAdminStats(mockAdminStats);
      setChartData(mockChartData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const getAccountLevelName = (level: number) => {
    if (level >= 7) return 'Expert';
    if (level >= 5) return 'Advanced';
    if (level >= 3) return 'Intermediate';
    return 'Beginner';
  };

  if (loading || !user || user.role !== 'admin' || isLoadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bảng điều khiển Admin</h1>
          <p className="text-muted-foreground">Phân tích toàn diện và quản lý người dùng</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="7d">7 ngày trước</option>
            <option value="30d">30 ngày trước</option>
            <option value="3m">3 tháng trước</option>
            <option value="1y">6 tháng trước</option>
          </select>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Cài đặt
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="users">Người dùng</TabsTrigger>
          <TabsTrigger value="analytics">Phân tích</TabsTrigger>
          <TabsTrigger value="scholarships">Học bổng</TabsTrigger>
          <TabsTrigger value="system">Hệ thống</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng số người dùng</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats?.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  +{adminStats?.newUsersThisMonth} tháng này
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats?.activeUsersToday}</div>
                <p className="text-xs text-muted-foreground">
                  {((adminStats?.activeUsersToday || 0) / (adminStats?.totalUsers || 1) * 100).toFixed(1)}% tổng số người dùng
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Điểm trung bình EduScore</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats?.averageEduScore.toFixed(1)}</div>
                <Progress value={adminStats?.averageEduScore} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tỷ lệ tăng trưởng</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats?.platformGrowthRate}%</div>
                <p className="text-xs text-muted-foreground">Tăng trưởng tháng</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Xu hướng tăng trưởng người dùng</CardTitle>
                <CardDescription>Đăng ký người dùng mới theo thời gian</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData?.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="users" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="newUsers" stackId="2" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.8} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phân phối Eduscore</CardTitle>
                <CardDescription>Phân phối Eduscores của người dùng</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData?.eduScoreDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ range, percentage }) => `${range}: ${(percentage || 0).toFixed(1)}%`}
                    >
                      {chartData?.eduScoreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Hồ sơ xét học bổng</CardTitle>
              <CardDescription>Xu hướng xét học bổng hàng tháng</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData?.scholarshipApplications}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="applications" fill="hsl(var(--chart-1))" name="Đã nộp" />
                  <Bar dataKey="approved" fill="hsl(var(--chart-2))" name="Đã duyệt" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Phân phối cấp người dùng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chartData?.levelDistribution.map((level) => (
                    <div key={level.level} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{level.level}</span>
                        <span>{level.count} ({level.percentage}%)</span>
                      </div>
                      <Progress value={level.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trạng thái xác minh</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={chartData?.verificationStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {chartData?.verificationStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Số liệu thống kê</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Người dùng đã xác minh</span>
                    <Badge variant="default">{adminStats?.verifiedUsers}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Đang chờ xem xét</span>
                    <Badge variant="secondary">{adminStats?.pendingVerification}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Bài viết trên diễn đàn</span>
                    <Badge variant="outline">{adminStats?.totalForumPosts}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tổng số Eduscores</span>
                    <Badge variant="outline">{adminStats?.totalEduScores}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quản lý người dùng</CardTitle>
              <CardDescription>Tổng quan người dùng với thông tin chi tiết</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Cấp</TableHead>
                    <TableHead>Điểm EduScore</TableHead>
                    <TableHead>Kỹ năng đã xác minh</TableHead>
                    <TableHead>Hoạt động diễn đàn</TableHead>
                    <TableHead>Hồ sơ</TableHead>
                    <TableHead>Đăng nhập lần cuối</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((userProfile) => (
                    <TableRow key={userProfile.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{userProfile.name}</p>
                          <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{getAccountLevelName(userProfile.accountLevel)}</Badge>
                          <span className="text-xs text-muted-foreground">L{userProfile.accountLevel}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={userProfile.eduScore && userProfile.eduScore > 80 ? 'default' : 'secondary'}>
                          {userProfile.eduScore || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>{userProfile.verifiedSkills}/10</TableCell>
                      <TableCell>{userProfile.forumPosts} bài viết</TableCell>
                      <TableCell>{userProfile.scholarshipApplications}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {userProfile.lastLogin ? format(userProfile.lastLogin, 'MMM dd, HH:mm') : 'Chưa từng'}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedUser(userProfile)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Chi tiết người dùng: {selectedUser?.name}</DialogTitle>
                              <DialogDescription>Thông tin hồ sơ người dùng chi tiết</DialogDescription>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="grid gap-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="font-semibold">Email</p>
                                    <p className="text-muted-foreground">{selectedUser.email}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Cấp tài khoản</p>
                                    <p className="text-muted-foreground">{getAccountLevelName(selectedUser.accountLevel)} (Cấp {selectedUser.accountLevel})</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Điểm EduScore</p>
                                    <p className="text-muted-foreground">{selectedUser.eduScore || 'Chưa hoàn thành'}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Kỹ năng đã xác minh</p>
                                    <p className="text-muted-foreground">{selectedUser.verifiedSkills} đã xác minh</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Hoạt động diễn đàn</p>
                                    <p className="text-muted-foreground">{selectedUser.forumPosts} bài viết</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Hồ sơ</p>
                                    <p className="text-muted-foreground">{selectedUser.scholarshipApplications} hồ sơ học bổng</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">Gửi tin nhắn</Button>
                                  <Button variant="outline" size="sm">Xem hồ sơ đầy đủ</Button>
                                  <Button variant="destructive" size="sm">Khoá tài khoản</Button>
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
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Phân tích xác minh kỹ năng</CardTitle>
                <CardDescription>So sánh kỹ năng đã xác minh và chưa xác minh</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData?.skillsAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skill" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="verified" fill="hsl(var(--chart-1))" name="Đã xác minh" />
                    <Bar dataKey="unverified" fill="hsl(var(--chart-5))" name="Chưa xác minh" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hoạt động người dùng theo thời gian</CardTitle>
                <CardDescription>Bài viết diễn đàn và đăng nhập trong ngày</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={chartData?.userActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="posts" stroke="hsl(var(--chart-1))" name="Bài viết diễn đàn" />
                    <Line type="monotone" dataKey="logins" stroke="hsl(var(--chart-2))" name="Lượt đăng nhập" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scholarships" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thống kê hồ sơ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Tổng số hồ sơ</span>
                    <Badge>{adminStats?.totalScholarshipApplications}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Đã duyệt</span>
                    <Badge variant="default">{adminStats?.approvedApplications}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Tỷ lệ thành công</span>
                    <Badge variant="outline">
                      {adminStats ? ((adminStats.approvedApplications / adminStats.totalScholarshipApplications) * 100).toFixed(1) : 0}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ảnh hưởng doanh thu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Tổng phân phối</span>
                    <Badge>${adminStats?.totalRevenue.toLocaleString()}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Trung bình mỗi sinh viên</span>
                    <Badge variant="outline">
                      ${adminStats ? Math.round(adminStats.totalRevenue / adminStats.approvedApplications).toLocaleString() : 0}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hàng chờ xử lý</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Đang chờ duyệt</span>
                    <Badge variant="secondary">234</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Cần xử lý</span>
                    <Badge variant="destructive">12</Badge>
                  </div>
                  <Button size="sm" className="w-full mt-4">
                    Xem xét hồ sơ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tình trạng hệ thống</CardTitle>
                <CardDescription>Chỉ số hiệu suất nền tảng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Thời gian hoạt động của máy chủ</span>
                    <Badge variant="default">99.9%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Hiệu suất cơ sở dữ liệu</span>
                    <Badge variant="default">Excellent</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Thời gian phản hồi API</span>
                    <Badge variant="outline">45ms avg</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Mức sử dụng lưu trữ</span>
                    <Badge variant="secondary">67%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tổng quan bảo mật</CardTitle>
                <CardDescription>Chỉ số và cảnh báo bảo mật</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Số lần đăng nhập thất bại</span>
                    <Badge variant="destructive">23 hôm nay</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Hoạt động đáng ngờ</span>
                    <Badge variant="outline">0 cảnh báo</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Địa chỉ IP bị chặn</span>
                    <Badge variant="secondary">12</Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Xem nhật ký bảo mật
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}