'use client';

import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Star, Clock, Users, PlayCircle, BookOpen, Award, Search, Filter, User, DollarSign, ChevronDown, ChevronUp, X } from "lucide-react";
import { useState, useMemo } from "react";

const courses = [
    // High School Subjects
    {
        title: "Toán học THPT - Giải tích và Hình học",
        category: "Môn học THPT",
        price: "Free",
        originalPrice: 0,
        finalPrice: 0,
        rating: 4.9,
        students: 3245,
        instructor: "TS. Nguyễn Văn Minh",
        duration: "120 giờ",
        videoCount: 85,
        image: "https://picsum.photos/400/300?random=1",
        level: "Trung học",
        description: "Khóa học toán học THPT toàn diện, từ cơ bản đến nâng cao"
    },
    {
        title: "Vật lý THPT - Cơ học và Điện học",
        category: "Môn học THPT",
        price: "Paid",
        originalPrice: 599000,
        finalPrice: 399000,
        rating: 4.7,
        students: 2156,
        instructor: "PGS. Lê Thị Hương",
        duration: "90 giờ",
        videoCount: 67,
        image: "https://picsum.photos/400/300?random=2",
        level: "Trung học",
        description: "Vật lý THPT với thí nghiệm ảo và bài tập thực hành"
    },
    {
        title: "Hóa học THPT - Hóa hữu cơ và Vô cơ",
        category: "Môn học THPT",
        price: "Paid",
        originalPrice: 499000,
        finalPrice: 299000,
        rating: 4.8,
        students: 1867,
        instructor: "ThS. Trần Quốc Anh",
        duration: "110 giờ",
        videoCount: 78,
        image: "https://picsum.photos/400/300?random=3",
        level: "Trung học",
        description: "Hóa học THPT với phòng thí nghiệm ảo 3D"
    },
    {
        title: "Ngữ văn THPT - Văn học và Nghị luận",
        category: "Môn học THPT",
        price: "Free",
        originalPrice: 0,
        finalPrice: 0,
        rating: 4.6,
        students: 4123,
        instructor: "Cô Phạm Thị Lan",
        duration: "80 giờ",
        videoCount: 45,
        image: "https://picsum.photos/400/300?random=4",
        level: "Trung học",
        description: "Ngữ văn THPT với kỹ năng viết và phân tích văn học"
    },
    {
        title: "Tiếng Anh THPT - IELTS Foundation",
        category: "Môn học THPT",
        price: "Paid",
        originalPrice: 799000,
        finalPrice: 599000,
        rating: 4.9,
        students: 5234,
        instructor: "Mr. John Smith",
        duration: "150 giờ",
        videoCount: 95,
        image: "https://picsum.photos/400/300?random=5",
        level: "Trung học",
        description: "Tiếng Anh THPT chuẩn bị cho kỳ thi IELTS"
    },

    // Soft Skills Courses
    {
        title: "Kỹ năng giao tiếp và thuyết trình",
        category: "Kỹ năng mềm",
        price: "Paid",
        originalPrice: 899000,
        finalPrice: 699000,
        rating: 4.8,
        students: 2345,
        instructor: "ThS. Nguyễn Hoàng Nam",
        duration: "40 giờ",
        videoCount: 32,
        image: "https://picsum.photos/400/300?random=6",
        level: "Cơ bản",
        description: "Phát triển kỹ năng giao tiếp hiệu quả trong mọi tình huống"
    },
    {
        title: "Lãnh đạo và Quản lý nhóm",
        category: "Kỹ năng mềm",
        price: "Paid",
        originalPrice: 1299000,
        finalPrice: 999000,
        rating: 4.7,
        students: 1876,
        instructor: "CEO Lê Văn Đức",
        duration: "60 giờ",
        videoCount: 42,
        image: "https://picsum.photos/400/300?random=7",
        level: "Nâng cao",
        description: "Kỹ năng lãnh đạo cho sinh viên và người mới bắt đầu"
    },
    {
        title: "Tư duy phản biện và Giải quyết vấn đề",
        category: "Kỹ năng mềm",
        price: "Free",
        originalPrice: 0,
        finalPrice: 0,
        rating: 4.6,
        students: 3456,
        instructor: "PGS. TS. Hoàng Minh",
        duration: "35 giờ",
        videoCount: 28,
        image: "https://picsum.photos/400/300?random=8",
        level: "Cơ bản",
        description: "Phát triển tư duy logic và khả năng giải quyết vấn đề"
    },
    {
        title: "Quản lý thời gian và Năng suất",
        category: "Kỹ năng mềm",
        price: "Paid",
        originalPrice: 599000,
        finalPrice: 399000,
        rating: 4.9,
        students: 4567,
        instructor: "ThS. Trần Thị Mai",
        duration: "25 giờ",
        videoCount: 20,
        image: "https://picsum.photos/400/300?random=9",
        level: "Cơ bản",
        description: "Tối ưu hóa thời gian và tăng năng suất học tập, làm việc"
    },

    // Specialized University Courses
    {
        title: "Lập trình Python cho Data Science",
        category: "Chuyên ngành Đại học",
        price: "Paid",
        originalPrice: 1599000,
        finalPrice: 1199000,
        rating: 4.8,
        students: 2134,
        instructor: "TS. Đinh Văn Hùng",
        duration: "180 giờ",
        videoCount: 125,
        image: "https://picsum.photos/400/300?random=10",
        level: "Nâng cao",
        description: "Khóa học Python chuyên sâu cho phân tích dữ liệu"
    },
    {
        title: "Marketing Digital và Social Media",
        category: "Chuyên ngành Đại học",
        price: "Paid",
        originalPrice: 1299000,
        finalPrice: 899000,
        rating: 4.7,
        students: 3245,
        instructor: "ThS. Vũ Thanh Hà",
        duration: "100 giờ",
        videoCount: 68,
        image: "https://picsum.photos/400/300?random=11",
        level: "Trung cấp",
        description: "Chiến lược marketing online và quản lý mạng xã hội"
    },
    {
        title: "Thiết kế UI/UX chuyên nghiệp",
        category: "Chuyên ngành Đại học",
        price: "Paid",
        originalPrice: 1799000,
        finalPrice: 1399000,
        rating: 4.9,
        students: 1567,
        instructor: "Nguyễn Thiết kế UX",
        duration: "120 giờ",
        videoCount: 89,
        image: "https://picsum.photos/400/300?random=12",
        level: "Nâng cao",
        description: "Thiết kế giao diện người dùng và trải nghiệm người dùng"
    },
    {
        title: "Kế toán Tài chính Doanh nghiệp",
        category: "Chuyên ngành Đại học",
        price: "Free",
        originalPrice: 0,
        finalPrice: 0,
        rating: 4.5,
        students: 2890,
        instructor: "ThS. CPA Lê Hồng Nhung",
        duration: "140 giờ",
        videoCount: 98,
        image: "https://picsum.photos/400/300?random=13",
        level: "Trung cấp",
        description: "Kế toán tài chính từ cơ bản đến nâng cao cho DN"
    },
    {
        title: "Kiến trúc Phần mềm và DevOps",
        category: "Chuyên ngành Đại học",
        price: "Paid",
        originalPrice: 2199000,
        finalPrice: 1699000,
        rating: 4.8,
        students: 1234,
        instructor: "Arch. Phạm Công Minh",
        duration: "200 giờ",
        videoCount: 156,
        image: "https://picsum.photos/400/300?random=14",
        level: "Chuyên gia",
        description: "Kiến trúc hệ thống và triển khai ứng dụng quy mô lớn"
    },
    {
        title: "Y học Cơ sở và Sinh lý học",
        category: "Chuyên ngành Đại học",
        price: "Paid",
        originalPrice: 1899000,
        finalPrice: 1499000,
        rating: 4.6,
        students: 987,
        instructor: "BS. CKI Trần Văn Khoa",
        duration: "160 giờ",
        videoCount: 112,
        image: "https://picsum.photos/400/300?random=15",
        level: "Chuyên gia",
        description: "Y học cơ sở với mô hình 3D và case study thực tế"
    }
];

export default function CoursePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('popular');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        categories: [] as string[],
        priceTypes: [] as string[],
        levels: [] as string[],
        ratings: [] as string[]
    });

    // Filter and sort courses
    const filteredAndSortedCourses = useMemo(() => {
        let filtered = courses.filter(course => {
            // Search filter
            const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                course.description.toLowerCase().includes(searchTerm.toLowerCase());

            // Category filter
            const matchesCategory = filters.categories.length === 0 || 
                                  filters.categories.includes(course.category);

            // Price filter
            const matchesPrice = filters.priceTypes.length === 0 || 
                               filters.priceTypes.includes(course.price.toLowerCase());

            // Level filter
            const matchesLevel = filters.levels.length === 0 || 
                               filters.levels.includes(course.level);

            // Rating filter
            const matchesRating = filters.ratings.length === 0 || 
                                filters.ratings.some(rating => {
                                    switch(rating) {
                                        case '4.5+': return course.rating >= 4.5;
                                        case '4.0+': return course.rating >= 4.0;
                                        case '3.5+': return course.rating >= 3.5;
                                        default: return true;
                                    }
                                });

            return matchesSearch && matchesCategory && matchesPrice && matchesLevel && matchesRating;
        });

        // Sort courses
        switch(sortBy) {
            case 'rating':
                return filtered.sort((a, b) => b.rating - a.rating);
            case 'newest':
                return filtered.sort((a, b) => b.students - a.students); // Using students as proxy for newest
            case 'price-low':
                return filtered.sort((a, b) => a.finalPrice - b.finalPrice);
            case 'price-high':
                return filtered.sort((a, b) => b.finalPrice - a.finalPrice);
            case 'popular':
            default:
                return filtered.sort((a, b) => b.students - a.students);
        }
    }, [searchTerm, sortBy, filters]);

    const handleFilterChange = (filterType: keyof typeof filters, value: string, checked: boolean) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: checked 
                ? [...prev[filterType], value]
                : prev[filterType].filter(item => item !== value)
        }));
    };

    const clearAllFilters = () => {
        setFilters({
            categories: [],
            priceTypes: [],
            levels: [],
            ratings: []
        });
        setSearchTerm('');
    };

    const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0) || searchTerm;

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Header />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-white">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-cyan-500/10 to-indigo-600/10"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent"></div>
                    
                    <div className="relative z-10 container mx-auto px-4 text-center ">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-anton tracking-wide leading-tight mb-8">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600">
                                KHÓA HỌC
                            </span>
                        </h1>
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Hơn 500+ khóa học chất lượng cao
                        </div>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input 
                                    placeholder="Tìm kiếm khóa học..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-12 pr-4 py-4 text-lg rounded-full border-0 shadow-lg bg-white/90 backdrop-blur-sm"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filters and Content */}
                <section className="container mx-auto px-4 py-12">
                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden mb-6">
                        <div className="flex items-center justify-between gap-4">
                            <Button 
                                variant="outline" 
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 border-2"
                            >
                                <Filter className="h-4 w-4" />
                                Bộ lọc
                                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                            
                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearAllFilters}
                                    className="text-gray-600 hover:text-red-600"
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    Xóa bộ lọc
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Enhanced Filters Sidebar */}
                        <aside className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                            <Card className="sticky top-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Filter className="h-5 w-5" />
                                            Bộ lọc tìm kiếm
                                        </CardTitle>
                                        {hasActiveFilters && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={clearAllFilters}
                                                className="hidden lg:flex text-gray-600 hover:text-red-600 text-xs"
                                            >
                                                <X className="h-3 w-3 mr-1" />
                                                Xóa tất cả
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Category Filter */}
                                    <div>
                                        <h3 className="font-semibold mb-3 text-gray-800">Danh mục</h3>
                                        <div className="space-y-3">
                                            <FilterCheckbox 
                                                id="highschool" 
                                                label="Môn học THPT" 
                                                checked={filters.categories.includes("Môn học THPT")}
                                                onChange={(checked) => handleFilterChange('categories', 'Môn học THPT', checked)}
                                            />
                                            <FilterCheckbox 
                                                id="softskills" 
                                                label="Kỹ năng mềm" 
                                                checked={filters.categories.includes("Kỹ năng mềm")}
                                                onChange={(checked) => handleFilterChange('categories', 'Kỹ năng mềm', checked)}
                                            />
                                            <FilterCheckbox 
                                                id="university" 
                                                label="Chuyên ngành Đại học" 
                                                checked={filters.categories.includes("Chuyên ngành Đại học")}
                                                onChange={(checked) => handleFilterChange('categories', 'Chuyên ngành Đại học', checked)}
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Price Filter */}
                                    <div>
                                        <h3 className="font-semibold mb-3 text-gray-800">Giá khóa học</h3>
                                        <div className="space-y-3">
                                            <FilterCheckbox 
                                                id="free" 
                                                label="Miễn phí" 
                                                checked={filters.priceTypes.includes("free")}
                                                onChange={(checked) => handleFilterChange('priceTypes', 'free', checked)}
                                            />
                                            <FilterCheckbox 
                                                id="paid" 
                                                label="Có phí" 
                                                checked={filters.priceTypes.includes("paid")}
                                                onChange={(checked) => handleFilterChange('priceTypes', 'paid', checked)}
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Level Filter */}
                                    <div>
                                        <h3 className="font-semibold mb-3 text-gray-800">Trình độ</h3>
                                        <div className="space-y-3">
                                            <FilterCheckbox 
                                                id="basic" 
                                                label="Cơ bản" 
                                                checked={filters.levels.includes("Cơ bản")}
                                                onChange={(checked) => handleFilterChange('levels', 'Cơ bản', checked)}
                                            />
                                            <FilterCheckbox 
                                                id="intermediate" 
                                                label="Trung cấp" 
                                                checked={filters.levels.includes("Trung cấp")}
                                                onChange={(checked) => handleFilterChange('levels', 'Trung cấp', checked)}
                                            />
                                            <FilterCheckbox 
                                                id="intermediate2" 
                                                label="Trung học" 
                                                checked={filters.levels.includes("Trung học")}
                                                onChange={(checked) => handleFilterChange('levels', 'Trung học', checked)}
                                            />
                                            <FilterCheckbox 
                                                id="advanced" 
                                                label="Nâng cao" 
                                                checked={filters.levels.includes("Nâng cao")}
                                                onChange={(checked) => handleFilterChange('levels', 'Nâng cao', checked)}
                                            />
                                            <FilterCheckbox 
                                                id="expert" 
                                                label="Chuyên gia" 
                                                checked={filters.levels.includes("Chuyên gia")}
                                                onChange={(checked) => handleFilterChange('levels', 'Chuyên gia', checked)}
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Rating Filter */}
                                    <div>
                                        <h3 className="font-semibold mb-3 text-gray-800">Đánh giá</h3>
                                        <div className="space-y-3">
                                            <FilterCheckbox 
                                                id="rating45" 
                                                label="4.5★ trở lên" 
                                                checked={filters.ratings.includes("4.5+")}
                                                onChange={(checked) => handleFilterChange('ratings', '4.5+', checked)}
                                            />
                                            <FilterCheckbox 
                                                id="rating40" 
                                                label="4.0★ trở lên" 
                                                checked={filters.ratings.includes("4.0+")}
                                                onChange={(checked) => handleFilterChange('ratings', '4.0+', checked)}
                                            />
                                            <FilterCheckbox 
                                                id="rating35" 
                                                label="3.5★ trở lên" 
                                                checked={filters.ratings.includes("3.5+")}
                                                onChange={(checked) => handleFilterChange('ratings', '3.5+', checked)}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </aside>

                        {/* Course Grid */}
                        <section className="lg:col-span-3">
                            {/* Sort and View Options */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Tất cả khóa học</h2>
                                    <p className="text-gray-600">{filteredAndSortedCourses.length} khóa học được tìm thấy</p>
                                    {hasActiveFilters && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {filters.categories.map(cat => (
                                                <Badge key={cat} variant="secondary" className="text-xs">
                                                    {cat}
                                                    <X 
                                                        className="h-3 w-3 ml-1 cursor-pointer" 
                                                        onClick={() => handleFilterChange('categories', cat, false)}
                                                    />
                                                </Badge>
                                            ))}
                                            {filters.priceTypes.map(price => (
                                                <Badge key={price} variant="secondary" className="text-xs">
                                                    {price === 'free' ? 'Miễn phí' : 'Có phí'}
                                                    <X 
                                                        className="h-3 w-3 ml-1 cursor-pointer" 
                                                        onClick={() => handleFilterChange('priceTypes', price, false)}
                                                    />
                                                </Badge>
                                            ))}
                                            {filters.levels.map(level => (
                                                <Badge key={level} variant="secondary" className="text-xs">
                                                    {level}
                                                    <X 
                                                        className="h-3 w-3 ml-1 cursor-pointer" 
                                                        onClick={() => handleFilterChange('levels', level, false)}
                                                    />
                                                </Badge>
                                            ))}
                                            {filters.ratings.map(rating => (
                                                <Badge key={rating} variant="secondary" className="text-xs">
                                                    {rating} sao
                                                    <X 
                                                        className="h-3 w-3 ml-1 cursor-pointer" 
                                                        onClick={() => handleFilterChange('ratings', rating, false)}
                                                    />
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="w-48">
                                            <SelectValue placeholder="Sắp xếp theo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="popular">Phổ biến nhất</SelectItem>
                                            <SelectItem value="rating">Đánh giá cao</SelectItem>
                                            <SelectItem value="newest">Mới nhất</SelectItem>
                                            <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                                            <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* No Results Message */}
                            {filteredAndSortedCourses.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                                        <Search className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Không tìm thấy khóa học</h3>
                                    <p className="text-gray-600 mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                                    <Button onClick={clearAllFilters} variant="outline">
                                        Xóa tất cả bộ lọc
                                    </Button>
                                </div>
                            )}

                            {/* Course Cards Grid */}
                            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredAndSortedCourses.map((course, index) => (
                                    <EnhancedCourseCard key={course.title} {...course} />
                                ))}
                            </div>
                        </section>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

function FilterCheckbox({ id, label, checked, onChange }: { 
    id: string, 
    label: string, 
    checked?: boolean, 
    onChange?: (checked: boolean) => void 
}) {
    return (
        <div className="flex items-center space-x-3">
            <Checkbox 
                id={id} 
                className="border-2" 
                checked={checked}
                onCheckedChange={onChange}
            />
            <Label htmlFor={id} className="font-normal text-sm cursor-pointer hover:text-blue-600 transition-colors">
                {label}
            </Label>
        </div>
    );
}

function EnhancedCourseCard({ 
    title, 
    category, 
    price, 
    originalPrice,
    finalPrice,
    rating, 
    students, 
    instructor,
    duration,
    videoCount,
    image, 
    level,
    description 
}: typeof courses[0]) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const hasDiscount = price === 'Paid' && originalPrice > finalPrice;

    return (
        <Card className="group relative flex flex-col h-full overflow-hidden bg-white border-0 shadow-md hover:shadow-xl transition-all duration-500 hover:scale-105">
            {/* Course Image */}
            <div className="relative w-full h-48 overflow-hidden">
                <Image 
                    src={image} 
                    alt={title} 
                    layout="fill" 
                    objectFit="cover"
                    className="group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Price Badge */}
                <div className="absolute top-3 right-3">
                    {price === 'Free' ? (
                        <Badge className="bg-green-500 hover:bg-green-600 text-white px-3 py-1">
                            Miễn phí
                        </Badge>
                    ) : (
                        <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1">
                            Có phí
                        </Badge>
                    )}
                </div>

                {/* Video Count Badge */}
                <div className="absolute top-3 left-3">
                    <Badge variant="outline" className="bg-black/70 text-white border-none backdrop-blur-sm">
                        <PlayCircle className="w-3 h-3 mr-1" />
                        {videoCount} video
                    </Badge>
                </div>

                {/* Level Badge */}
                <div className="absolute bottom-3 left-3">
                    <Badge variant="secondary" className="bg-white/90 text-gray-800">
                        {level}
                    </Badge>
                </div>
            </div>

            <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                        {category}
                    </Badge>
                </div>
                <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {title}
                </CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                    {description}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-grow space-y-3">
                {/* Instructor */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{instructor}</span>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{duration}</span>
                </div>

                {/* Rating and Students */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-gray-800">{rating}</span>
                        <span className="text-gray-500">({students.toLocaleString()})</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-4 border-t bg-gray-50/50">
                <div className="w-full flex items-center justify-between">
                    {/* Price */}
                    <div className="flex flex-col">
                        {price === 'Free' ? (
                            <span className="text-lg font-bold text-green-600">
                                Miễn phí
                            </span>
                        ) : (
                            <div className="space-y-1">
                                {hasDiscount && (
                                    <span className="text-sm text-gray-500 line-through">
                                        {formatPrice(originalPrice)}
                                    </span>
                                )}
                                <span className="text-lg font-bold text-blue-600">
                                    {formatPrice(finalPrice)}
                                </span>
                                {hasDiscount && (
                                    <Badge variant="destructive" className="text-xs ml-2">
                                        -{Math.round((1 - finalPrice / originalPrice) * 100)}%
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>

                    {/* CTA Button */}
                    <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                        {price === 'Free' ? 'Học ngay' : 'Xem chi tiết'}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
