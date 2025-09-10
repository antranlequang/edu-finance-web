'use server';
/**
 * @fileOverview An AI advisor that can recommend scholarships, courses, and jobs.
 *
 * - chat - A function that handles the conversational chat process.
 * - Message - The type for a single chat message.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Mock data - in a real app, this would come from a database.
const allScholarships = [
  { name: "Future Leaders Grant", provider: "Tech Innovators Foundation", amount: 5000, minEduscore: 85, deadline: "2024-12-31" },
  { name: "Creative Minds Scholarship", provider: "Arts & Culture Council", amount: 3000, minEduscore: 75, deadline: "2024-11-30" },
  { name: "STEM Achievers Award", provider: "Science & Eng. Society", amount: 10000, minEduscore: 90, deadline: "2025-01-15" },
  { name: "Community First Scholarship", provider: "Local Goodwill Org", amount: 2000, minEduscore: 70, deadline: "2024-12-01" },
  { name: "Phoenix Scholars Program", provider: "Rise Up Foundation", amount: 7500, minEduscore: 80, deadline: "2025-02-01" },
  { name: "Global Citizen Grant", provider: "One World United", amount: 4000, minEduscore: 65, deadline: "2024-11-15" },
];

const allCourses = [
    { title: "Web Development Bootcamp", category: "Technology", price: "Paid", rating: 4.8 },
    { title: "Introduction to Business", category: "Business", price: "Free", rating: 4.5 },
    { title: "Graphic Design Masterclass", category: "Design", price: "Paid", rating: 4.9 },
    { title: "Data Science with Python", category: "Technology", price: "Paid", rating: 4.7 },
    { title: "The Science of Well-being", category: "Science", price: "Free", rating: 4.9 },
    { title: "Digital Marketing Essentials", category: "Business", price: "Paid", rating: 4.6 },
    { title: "UI/UX Design Fundamentals", category: "Design", price: "Free", rating: 4.7 },
    { title: "Quantum Physics Explained", category: "Science", price: "Paid", rating: 4.8 },
];

const allJobs = [
    { title: "Junior Web Developer Intern", company: "Innovatech Solutions", location: "Remote", type: "Internship", tags: ["React", "Node.js", "Web Dev"] },
    { title: "Marketing Assistant (Part-Time)", company: "Growth Wizards", location: "New York, NY", type: "Part-Time", tags: ["Social Media", "SEO", "Marketing"] },
    { title: "Data Analyst Intern", company: "DataDriven Inc.", location: "San Francisco, CA", type: "Internship", tags: ["SQL", "Python", "Tableau"] },
    { title: "Graphic Design Intern", company: "Creative Minds Agency", location: "Remote", type: "Internship", tags: ["Photoshop", "Illustrator", "UI/UX"] },
    { title: "Business Development Trainee", company: "Future Corp", location: "Chicago, IL", type: "Full-Time", tags: ["Sales", "CRM", "Business"] },
    { title: "Software Engineer Co-op", company: "CodeCrafters", location: "Boston, MA", type: "Co-op", tags: ["Java", "Spring", "Cloud"] },
];

const getScholarships = ai.defineTool(
  {
    name: 'getScholarships',
    description: 'Retrieves a list of available scholarships. Use this to help users find financial aid opportunities.',
    inputSchema: z.object({
        minEduscore: z.number().optional().describe("Filter by minimum Eduscore. Use the user's Eduscore if they have one."),
        maxAmount: z.number().optional().describe("Filter by maximum scholarship amount."),
    }),
    outputSchema: z.array(z.object({
        name: z.string(),
        provider: z.string(),
        amount: z.number(),
    })),
  },
  async ({minEduscore, maxAmount}) => {
    let scholarships = allScholarships;
    if (minEduscore) {
        scholarships = scholarships.filter(s => s.minEduscore <= minEduscore);
    }
    if (maxAmount) {
        scholarships = scholarships.filter(s => s.amount <= maxAmount);
    }
    return scholarships.map(({name, provider, amount}) => ({name, provider, amount}));
  }
);

const getCourses = ai.defineTool(
    {
        name: 'getCourses',
        description: 'Retrieves a list of available courses. Use this to recommend educational programs to users based on their interests.',
        inputSchema: z.object({
            category: z.enum(["Technology", "Business", "Design", "Science"]).optional().describe("Filter by category."),
            price: z.enum(["Free", "Paid"]).optional().describe("Filter by price.")
        }),
        outputSchema: z.array(z.object({
            title: z.string(),
            category: z.string(),
            price: z.string(),
        }))
    },
    async ({category, price}) => {
        let courses = allCourses;
        if (category) {
            courses = courses.filter(c => c.category === category);
        }
        if (price) {
            courses = courses.filter(c => c.price === price);
        }
        return courses.map(({title, category, price}) => ({title, category, price}));
    }
);

const getJobs = ai.defineTool(
    {
        name: 'getJobs',
        description: 'Retrieves a list of available job openings. Use this to help users find internships, part-time, or full-time positions.',
        inputSchema: z.object({
            type: z.enum(["Internship", "Part-Time", "Full-Time", "Co-op"]).optional().describe("Filter by job type."),
            location: z.string().optional().describe("Filter by location. 'Remote' is an option."),
        }),
        outputSchema: z.array(z.object({
            title: z.string(),
            company: z.string(),
            type: z.string(),
            location: z.string()
        }))
    },
    async ({type, location}) => {
        let jobs = allJobs;
        if (type) {
            jobs = jobs.filter(j => j.type === type);
        }
        if (location) {
            jobs = jobs.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
        }
        return jobs;
    }
);

const MessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});

const AdvisorInputSchema = z.object({
    history: z.array(MessageSchema),
    message: z.string(),
  });

const advisorPrompt = ai.definePrompt({
    name: 'advisorPrompt',
    inputSchema: z.object({
        history: z.array(MessageSchema),
        message: z.string(),
    }),
    system: 
    
`### Bạn là Hyhan - người bạn đồng hành AI, chuyên cung cấp thông tin và tư vấn cá nhân hóa cho học sinh, sinh viên về các cơ hội học tập, phát triển sự nghiệp và hỗ trợ tài chính.

### ĐỊNH HƯỚNG GIAO TIẾP, CÁCH TRẢ LỜI:
- Thân thiện và gần gũi: Xưng hô "mình" - "bạn", "Hyhan" - "bạn" hoặc "tôi" - "bạn" tùy ngữ cảnh, luôn sử dụng giọng điệu tích cực, động viên và dễ tiếp cận.
- Chuyên nghiệp và rõ ràng: Trả lời trực tiếp vào câu hỏi, tránh lan man.
- Cấu trúc phản hồi:
+ Phần mở đầu: Bắt đầu bằng lời chào thân thiện, thể hiện sự thấu hiểu câu hỏi của người dùng.
+ Nội dung chính: Liệt kê các thông tin một cách khoa học, sử dụng các tiêu đề, danh sách (list), và in đậm (bold) để làm nổi bật thông tin quan trọng.
+ Phần kết: Kết thúc bằng một câu hỏi mở để khuyến khích người dùng tiếp tục tương tác, hoặc một lời chúc tốt đẹp.
- Nhiệm vụ và Quy tắc:
+ Sử dụng công cụ: Tận dụng tối đa các công cụ có sẵn để tìm kiếm thông tin phù hợp với yêu cầu của người dùng.
+ Cập nhật dữ liệu:
+ Sử dụng dữ liệu nội bộ của nền tảng Hyhan để trả lời các câu hỏi cụ thể (ví dụ: các khóa học, học bổng đang có trên Hyhan).
+ Khi cần, hãy tìm kiếm và tổng hợp thông tin mới nhất từ các nguồn đáng tin cậy trên internet để cung cấp câu trả lời toàn diện hơn (ví dụ: xu hướng ngành nghề, yêu cầu tuyển dụng mới).
- Tối ưu hóa tìm kiếm:
+ Nếu người dùng hỏi một câu hỏi chung ("có những học bổng nào?"), hãy sử dụng các công cụ tìm kiếm mà không cần bộ lọc cụ thể để cung cấp một cái nhìn tổng quan.
+ Nếu người dùng cung cấp thông tin cụ thể (ví dụ: Eduscore), sử dụng thông tin này làm bộ lọc để tìm kiếm các cơ hội phù hợp nhất.
- Trình bày thông tin:
+ Phản hồi phải có cấu trúc khoa học và dễ đọc.
+ Sử dụng danh sách (bullet points hoặc numbered list) để liệt kê thông tin.
+ Đảm bảo các danh mục như "học bổng", "khóa học", "công việc" được phân tách rõ ràng.
- Ví dụ về cấu trúc câu trả lời:
+ Mở bài: "Chào bạn, Hyhan đã nhận được câu hỏi của bạn. Mình hiểu bạn đang tìm kiếm thông tin về..."
+ Nội dung chính:
    "Tiêu đề 1: Học bổng dành cho bạn
    - Tên học bổng 1
    - Tên học bổng 2
    Tiêu đề 2: Các khóa học liên quan
    - Khóa học A
    - Khóa học B
    ..."
+ Kết bài: "Hy vọng những thông tin trên hữu ích cho bạn! Bạn có muốn tìm hiểu thêm về khóa học hay học bổng nào không?"

### HÌNH THỨC TRÌNH BÀY CÂU TRẢ LỜI:
- Sử dụng tiếng Việt có dấu, ngữ pháp và chính tả chuẩn.
- Tránh sử dụng tiếng lóng, từ địa phương hoặc biệt ngữ kỹ thuật.
- Không để khoảng trống dư giữa các dòng và đoạn văn.
- Sử dụng các ký hiệu đặc biệt (như dấu chấm đầu dòng, số thứ tự) để làm rõ các danh sách.
- Đảm bảo định dạng nhất quán trong toàn bộ phản hồi.
- Ở đầu các nội dung chính, mục chính thì có thể chèn icon 📘 hoặc 🎓  để tăng tính trực quan và hấp dẫn, tuy nhiên phải thống nhất chung (nghĩa là cùng mức độ tiêu đề thì sẽ cùng icon với nhau, tránh bị quá đà)
- Tránh sử dụng các biểu tượng cảm xúc (emoji) trong phản hồi.
- Luôn kiểm tra lại câu trả lời để đảm bảo không có lỗi chính tả hoặc ngữ pháp.
- Nếu không chắc chắn về câu trả lời, hãy thừa nhận điều đó một cách trung thực và đề xuất các bước tiếp theo để tìm kiếm thông tin chính xác hơn.`,
    messages: (input: z.infer<typeof AdvisorInputSchema>) => [
        ...input.history,
        { role: 'user', content: input.message }
    ],
    tools: [getScholarships, getCourses, getJobs],
});
export type Message = z.infer<typeof MessageSchema>;

const ChatInputSchema = z.object({
    history: z.array(MessageSchema),
    prompt: z.string(),
    eduscore: z.number().optional()
});

export async function chat(input: z.infer<typeof ChatInputSchema>): Promise<string> {
    const history = [...input.history];
    if (input.eduscore) {
        history.unshift({
            role: 'user',
            content: `For your information, my Eduscore is ${input.eduscore}. Please use it when recommending scholarships.`
        });
    }

    const result = await ai.generate({
        prompt: advisorPrompt,
        input: {
            history: history,
            message: input.prompt
        },
        model: 'googleai/gemini-2.5-flash',
    });

    return result.text;
}
