'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth-neon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, MessageSquare, Heart, Eye, Clock, Pin, Search, Filter,
  Briefcase, GraduationCap, Users, TrendingUp, Star, ArrowUp
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: 'jobs' | 'scholarships' | 'networking' | 'general';
  author: {
    id: string;
    name: string;
    avatar?: string;
    level: number;
    verified: boolean;
  };
  tags: string[];
  likes: number;
  views: number;
  comments: number;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    level: number;
    verified: boolean;
  };
  likes: number;
  createdAt: Date;
  parentId?: string;
  replies?: Comment[];
}

export default function ForumPage() {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending'>('newest');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general' as const,
    tags: [] as string[]
  });

  // Mock data
  const mockPosts: ForumPost[] = [
    {
      id: '1',
      title: 'Remote Software Engineering Opportunities for Students',
      content: 'Hey everyone! I\'ve compiled a list of companies that are actively hiring remote software engineers, especially those friendly to new graduates. Here are some great options...',
      category: 'jobs',
      author: {
        id: 'user1',
        name: 'Sarah Chen',
        level: 4,
        verified: true
      },
      tags: ['remote', 'software-engineering', 'entry-level'],
      likes: 45,
      views: 230,
      comments: 12,
      pinned: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Full Scholarship Opportunities for International Students 2024',
      content: 'I\'ve been researching scholarship opportunities and found some amazing fully-funded programs. Here\'s what I discovered:',
      category: 'scholarships',
      author: {
        id: 'user2',
        name: 'Ahmed Hassan',
        level: 3,
        verified: true
      },
      tags: ['international', 'full-scholarship', 'graduate'],
      likes: 67,
      views: 450,
      comments: 23,
      pinned: false,
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-14')
    },
    {
      id: '3',
      title: 'Building Your Professional Network as a Student',
      content: 'Networking can feel intimidating, but it doesn\'t have to be! Here are some practical tips I\'ve learned...',
      category: 'networking',
      author: {
        id: 'user3',
        name: 'Maria Rodriguez',
        level: 5,
        verified: true
      },
      tags: ['networking', 'career-advice', 'professional-development'],
      likes: 34,
      views: 180,
      comments: 8,
      pinned: false,
      createdAt: new Date('2024-01-13'),
      updatedAt: new Date('2024-01-13')
    },
    {
      id: '4',
      title: 'Data Science Bootcamp vs University Degree - Your Experience?',
      content: 'I\'m torn between enrolling in a data science bootcamp or pursuing a traditional CS degree. What are your thoughts and experiences?',
      category: 'general',
      author: {
        id: 'user4',
        name: 'James Kim',
        level: 2,
        verified: false
      },
      tags: ['data-science', 'education', 'career-path'],
      likes: 28,
      views: 95,
      comments: 15,
      pinned: false,
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-12')
    }
  ];

  useEffect(() => {
    setPosts(mockPosts);
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedPosts = filteredPosts.sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.likes - a.likes;
      case 'trending':
        return b.views - a.views;
      case 'newest':
      default:
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'jobs':
        return <Briefcase className="h-4 w-4" />;
      case 'scholarships':
        return <GraduationCap className="h-4 w-4" />;
      case 'networking':
        return <Users className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'jobs':
        return 'bg-blue-100 text-blue-800';
      case 'scholarships':
        return 'bg-green-100 text-green-800';
      case 'networking':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreatePost = () => {
    // In a real app, this would make an API call
    const post: ForumPost = {
      id: Date.now().toString(),
      ...newPost,
      author: {
        id: user?.id || '',
        name: user?.name || user?.email || 'Anonymous',
        level: user?.accountLevel || 1,
        verified: user?.verificationStatus === 'verified'
      },
      likes: 0,
      views: 0,
      comments: 0,
      pinned: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '', category: 'general', tags: [] });
    setIsCreatePostOpen(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Đang tải...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Diễn Đàn Cộng Đồng</h1>
          <p className="text-muted-foreground">Kết nối, chia sẻ và học hỏi từ các sinh viên và chuyên gia khác</p>
        </div>
        <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo Bài Viết
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo Bài Viết Mới</DialogTitle>
              <DialogDescription>Chia sẻ suy nghĩ, đặt câu hỏi hoặc bắt đầu thảo luận</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="Bài viết của bạn về chủ đề gì?"
                />
              </div>
              <div>
                <Label htmlFor="category">Danh mục</Label>
                <Select value={newPost.category} onValueChange={(value: any) => setNewPost({ ...newPost, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Thảo luận chung</SelectItem>
                    <SelectItem value="jobs">Cơ hội việc làm</SelectItem>
                    <SelectItem value="scholarships">Học bổng & Tài trợ</SelectItem>
                    <SelectItem value="networking">Kết nối & Nghề nghiệp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="content">Nội dung</Label>
                <Textarea
                  id="content"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Viết nội dung bài viết tại đây..."
                  rows={6}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreatePostOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleCreatePost} disabled={!newPost.title || !newPost.content}>
                  Tạo Bài Viết
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="popular">Nhiều lượt thích</SelectItem>
                <SelectItem value="trending">Nhiều lượt xem</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="jobs">Việc làm</TabsTrigger>
              <TabsTrigger value="scholarships">Học bổng</TabsTrigger>
              <TabsTrigger value="networking">Kết nối</TabsTrigger>
              <TabsTrigger value="general">Chung</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-6">
            {sortedPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{post.author.name}</span>
                          {post.author.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Level {post.author.level}
                            </Badge>
                          )}
                          {post.pinned && <Pin className="h-4 w-4 text-primary" />}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <Badge className={getCategoryColor(post.category)}>
                      {getCategoryIcon(post.category)}
                      <span className="ml-1 capitalize">{post.category}</span>
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3 mb-4">{post.content}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <button className="flex items-center space-x-1 hover:text-primary">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-primary">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </button>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.views}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Xem Thảo Luận
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chủ Đề Thịnh Hành</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['remote-work', 'scholarships-2024', 'ai-careers', 'networking-tips', 'blockchain-jobs'].map((topic) => (
                  <div key={topic} className="flex items-center justify-between">
                    <span className="text-sm">#{topic}</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Người Đóng Góp Hàng Đầu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Sarah Chen', level: 4, posts: 23 },
                  { name: 'Ahmed Hassan', level: 3, posts: 18 },
                  { name: 'Maria Rodriguez', level: 5, posts: 15 }
                ].map((contributor) => (
                  <div key={contributor.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{contributor.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{contributor.name}</p>
                        <p className="text-xs text-muted-foreground">Level {contributor.level}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {contributor.posts} bài viết
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thống Kê Diễn Đàn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Tổng Bài Viết</span>
                  <span className="font-medium">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span>Người Dùng Hoạt Động</span>
                  <span className="font-medium">567</span>
                </div>
                <div className="flex justify-between">
                  <span>Tuần Này</span>
                  <span className="font-medium">+89 bài viết</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}