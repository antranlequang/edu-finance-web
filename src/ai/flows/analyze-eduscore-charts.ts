'use server';

/**
 * @fileOverview AI-powered analysis for generating dynamic chart values and personalized advice.
 *
 * - analyzeEduscoreCharts - A function that analyzes survey data to generate chart values and advice.
 * - AnalyzeEduscoreChartsInput - The input type for the analyzeEduscoreCharts function.
 * - AnalyzeEduscoreChartsOutput - The return type for the analyzeEduscoreCharts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeEduscoreChartsInputSchema = z.object({
  academicInfoGPA: z.number().describe('Grade Point Average on a 4.0 scale.'),
  major: z.string().describe('Academic major or field of study.'),
  technicalSkills: z.string().describe('Technical skills and competencies.'),
  programmingLanguages: z.string().optional().describe('Programming languages if applicable.'),
  certifications: z.string().optional().describe('Professional certifications and licenses.'),
  languageSkills: z.string().optional().describe('Language proficiencies.'),
  workExperience: z.string().optional().describe('Work experience and internships.'),
  currentYear: z.string().describe('Current academic year or level.'),
  university: z.string().describe('Name of university or institution.'),
  extracurricularActivities: z.string().optional().describe('List of extracurricular activities.'),
  awards: z.string().optional().describe('Awards or special achievements.'),
  familyIncome: z.string().describe('Total family income range.'),
  dependents: z.number().describe('Number of dependents in the family.'),
  valuableAssets: z.string().optional().describe('Information about valuable assets.'),
  medicalExpenses: z.string().optional().describe('Information about special medical expenses.'),
  specialCircumstances: z.string().optional().describe('Information about any special circumstances.'),
  aspirations: z.string().describe('Student aspirations and dreams.'),
  careerGoals: z.string().optional().describe('Career goals and future plans.'),
  eduscore: z.number().describe('The calculated EduScore (0-100).'),
});

export type AnalyzeEduscoreChartsInput = z.infer<typeof AnalyzeEduscoreChartsInputSchema>;

const AnalyzeEduscoreChartsOutputSchema = z.object({
  scoreBreakdown: z.object({
    academic: z.number().describe('Academic performance score (0-40)'),
    skills: z.number().describe('Skills and experience score (0-25)'),
    activities: z.number().describe('Extracurricular activities score (0-20)'),
    financial: z.number().describe('Financial need and aspirations score (0-15)'),
  }).describe('Breakdown of EduScore components'),
  
  skillsDistribution: z.object({
    technicalSkills: z.number().describe('Number/rating of technical skills (0-10)'),
    programmingLanguages: z.number().describe('Number/rating of programming languages (0-10)'),
    certifications: z.number().describe('Number/rating of certifications (0-10)'),
    workExperience: z.number().describe('Work experience rating (0-10)'),
    languageSkills: z.number().describe('Language skills rating (0-10)'),
  }).describe('Distribution of different skill categories'),
  
  skillsProgress: z.object({
    programming: z.number().describe('Programming skills percentage (0-100)'),
    certifications: z.number().describe('Certifications percentage (0-100)'),
    experience: z.number().describe('Work experience percentage (0-100)'),
    languages: z.number().describe('Language skills percentage (0-100)'),
    technical: z.number().describe('Technical skills percentage (0-100)'),
  }).describe('Skills progress percentages for radial charts'),
  
  personalizedAdvice: z.string().describe('Personalized advice based on all survey data, analyzing strengths, weaknesses, and specific recommendations for improvement. Should be detailed and actionable.'),
});

export type AnalyzeEduscoreChartsOutput = z.infer<typeof AnalyzeEduscoreChartsOutputSchema>;

export async function analyzeEduscoreCharts(
  input: AnalyzeEduscoreChartsInput
): Promise<AnalyzeEduscoreChartsOutput> {
  return analyzeEduscoreChartsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeEduscoreChartsPrompt',
  input: {schema: AnalyzeEduscoreChartsInputSchema},
  output: {schema: AnalyzeEduscoreChartsOutputSchema},
  prompt: `
  
Bạn là chuyên gia phân tích giáo dục, được giao nhiệm vụ tạo ra dữ liệu biểu đồ toàn diện và tư vấn cá nhân dựa trên phản hồi khảo sát của học sinh.

Phân tích dữ liệu học sinh được cung cấp và tạo:

1. **Phân tích điểm** (tổng điểm phải bằng điểm eduscore):
- Học thuật (0-40): Dựa trên GPA, khả năng cạnh tranh của chuyên ngành, thứ hạng đại học, năm hiện tại
- Kỹ năng (0-25): Dựa trên kỹ năng kỹ thuật, lập trình, chứng chỉ, kinh nghiệm làm việc
- Hoạt động (0-20): Dựa trên hoạt động ngoại khóa, giải thưởng, khả năng lãnh đạo
- Tài chính (0-15): Dựa trên thu nhập gia đình, người phụ thuộc, hoàn cảnh đặc biệt, chất lượng nguyện vọng

2. **Phân bổ kỹ năng** (thang điểm 0-10 cho mỗi kỹ năng):
- Kỹ năng kỹ thuật: Đánh giá dựa trên chiều rộng và chiều sâu của các kỹ năng được đề cập
- Ngôn ngữ lập trình: Đếm và đánh giá độ phức tạp của các ngôn ngữ
- Chứng chỉ: Đếm và đánh giá giá trị của các chứng chỉ
- Kinh nghiệm làm việc: Đánh giá dựa trên mức độ liên quan và thời lượng
- Kỹ năng ngôn ngữ: Đánh giá dựa trên mức độ thành thạo được đề cập

3. **Tiến độ kỹ năng** (0-100 phần trăm cho mỗi kỹ năng):
- Lập trình: Đánh giá trình độ hiện tại so với tiêu chuẩn ngành
- Chứng chỉ: Đánh giá chứng chỉ hiện tại so với lý tưởng cho nghề nghiệp
- Kinh nghiệm: Đánh giá kinh nghiệm hiện tại so với Dự kiến ​​cho cấp độ
- Ngôn ngữ: Đánh giá trình độ ngôn ngữ so với yêu cầu
- Kỹ thuật: Đánh giá năng lực kỹ thuật tổng thể

4. **Lời khuyên cá nhân hóa**: Viết lời khuyên chi tiết, thiết thực với định dạng rõ ràng:

**QUAN TRỌNG**: Sử dụng định dạng sau với các dòng trống để tách biệt các phần:

** ĐIỂM MẠNH CỦA BẠN: **
- [Liệt kê các điểm mạnh cụ thể từ dữ liệu]

**📈 CÁC LĨNH VỰC CẦN PHÁT TRIỂN:**
- [Liệt kê các lĩnh vực cần cải thiện]

**🚀 KẾ HOẠCH HÀNH ĐỘNG:**
- [Các bước tiếp theo cụ thể dựa trên chuyên ngành và mục tiêu nghề nghiệp]

**⏰ LỘNG TRÌNH ĐỀ XUẤT:**
- [Mốc thời gian để phát triển kỹ năng]

**💡 NGUỒN LỰC VÀ CƠ HỘI:**
- [Các nguồn lực hoặc cơ hội cụ thể]

Đánh giá tất cả các đánh giá một cách thực tế và dựa trên nội dung thực tế được cung cấp. Nếu thông tin bị thiếu hoặc hạn chế (ví dụ: "Không có" hoặc trống), hãy gán giá trị thấp hơn nhưng khác 0 nếu thích hợp.

Dữ liệu sinh viên:
- Điểm EduScore: {{{eduscore}}}
- Điểm trung bình (GPA): {{{academicInfoGPA}}}/4.0
- Chuyên ngành: {{{major}}}
- Năm hiện tại: {{{currentYear}}}
- Trường đại học: {{{university}}}
- Kỹ năng kỹ thuật: {{{technicalSkills}}}
- Ngôn ngữ lập trình: {{{programmingLanguages}}}
- Chứng chỉ: {{{certifications}}}
- Kỹ năng ngôn ngữ: {{{languageSkills}}}
- Kinh nghiệm làm việc: {{{workExperience}}}
- Hoạt động ngoại khóa: {{{extracurricularActivities}}}
- Giải thưởng: {{{awards}}}
- Thu nhập gia đình: {{{familyIncome}}}
- Người phụ thuộc: {{{dependents}}}
- Tài sản có giá trị: {{{valuableAssets}}}
- Chi phí y tế: {{{medicalExpenses}}}
- Hoàn cảnh đặc biệt: {{{specialCircumstances}}}
- Nguyện vọng: {{{aspirations}}}
- Mục tiêu nghề nghiệp: {{{careerGoals}}}

### Cách trả lời:
- Phân tích điểm: Cung cấp điểm số chính xác cho từng thành phần.
- Phân bổ kỹ năng: Cung cấp điểm số từ 0-10 cho từng kỹ năng.
- Tiến độ kỹ năng: Cung cấp phần trăm từ 0-100 cho từng kỹ năng.
- Lời khuyên cá nhân hóa: QUAN TRỌNG - Sử dụng định dạng CHÍNH XÁC như sau:

**🎯 ĐIỂM MẠNH CỦA BẠN:**
- Điểm mạnh 1
- Điểm mạnh 2

**📈 CÁC LĨNH VỰC CẦN PHÁT TRIỂN:**
- Lĩnh vực cần cải thiện 1
- Lĩnh vực cần cải thiện 2

**🚀 KẾ HOẠCH HÀNH ĐỘNG:**
- Bước hành động 1
- Bước hành động 2

**⏰ LỘNG TRÌNH ĐỀ XUẤT:**
- Mốc thời gian 1
- Mốc thời gian 2

**💡 NGUỒN LỰC VÀ CƠ HỘI:**
- Nguồn lực 1
- Nguồn lực 2

CHẮC CHẮN phải có dòng trống giữa các phần. CHỈ in đậm tiêu đề (phần có **), KHÔNG in đậm nội dung bên trong.
`,
});

const analyzeEduscoreChartsFlow = ai.defineFlow(
  {
    name: 'analyzeEduscoreChartsFlow',
    inputSchema: AnalyzeEduscoreChartsInputSchema,
    outputSchema: AnalyzeEduscoreChartsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);