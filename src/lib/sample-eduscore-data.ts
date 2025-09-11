export interface SampleEduscoreData {
  score: number;
  reasoning: string;
  surveyData: {
    academicInfoGPA: number;
    major: string;
    majorSpecialization?: string;
    technicalSkills: string;
    programmingLanguages?: string;
    certifications?: string;
    languageSkills?: string;
    workExperience?: string;
    currentYear: string;
    university: string;
    extracurricularActivities?: string;
    awards?: string;
    familyIncome: string;
    dependents: number;
    valuableAssets?: string;
    medicalExpenses?: string;
    specialCircumstances?: string;
    aspirations?: string;
    careerGoals?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Sample EduScore data for user@hyhan.com demo account
export const SAMPLE_EDUSCORE_DATA: SampleEduscoreData = {
  score: 87,
  reasoning: `📚 **Thành tích học tập (35.0/40 điểm):**
- GPA 3.5/4.0 - Xuất sắc!
- Chuyên ngành: Công nghệ tài chính
- Trường: Đại học Kinh tết - Luật

🔧 **Kỹ năng & Kinh nghiệm (23/25 điểm):**
- Kỹ năng chuyên môn: JavaScript, React, Node.js, Python, Machine Learning, Data Analysis, UI/UX Design...
- Ngôn ngữ lập trình: JavaScript, Python, Java, C++, TypeScript
- Kinh nghiệm làm việc: Có

🌟 **Hoạt động & Thành tích (18/20 điểm):**
- Hoạt động ngoại khóa: Có
- Giải thưởng: Có

💰 **Nhu cầu tài chính & Nguyện vọng (11/15 điểm):**
- Thu nhập gia đình: 15 - 25 triệu/tháng
- Số người phụ thuộc: 3
- Có nguyện vọng rõ ràng

📊 **Tổng kết:**
- **EduScore: 87/100**
- Hồ sơ xuất sắc! Bạn có cơ hội cao với các học bổng.

✨ **Lời khuyên:** Tiếp tục phát triển kỹ năng, tham gia hoạt động ngoại khóa và duy trì thành tích học tập tốt!`,
  surveyData: {
    academicInfoGPA: 3.5,
    major: "Công nghệ thông tin",
    majorSpecialization: "Trí tuệ nhân tạo và Machine Learning",
    technicalSkills: "JavaScript, React, Node.js, Python, Machine Learning, Data Analysis, UI/UX Design, Database Management, Cloud Computing, DevOps, Git, Docker, Kubernetes",
    programmingLanguages: "JavaScript, Python, Java, C++, TypeScript, SQL, HTML/CSS, R, MATLAB",
    certifications: "AWS Cloud Practitioner, Google Analytics Certified, Microsoft Azure Fundamentals, Coursera Machine Learning Certificate",
    languageSkills: "Tiếng Anh (TOEIC 850)",
    workExperience: "Thực tập sinh Full-stack Developer tại FPT Software (6 tháng), Freelance Web Developer (1 năm), Mentor lập trình cho sinh viên năm nhất",
    currentYear: "Năm 3",
    university: "Đại học Bách khoa Hà Nội",
    extracurricularActivities: "Chủ tịch Câu lạc bộ Lập trình, Tham gia đội tuyển Olympic Tin học, Tổ chức Hackathon cho sinh viên, Tình nguyện viên dạy lập trình cho trẻ em vùng cao",
    awards: "Giải Nhì Olympic Tin học Sinh viên Toàn quốc 2023, Giải Ba Cuộc thi Khởi nghiệp Sinh viên, Học bổng Khuyến khích Học tập xuất sắc 3 kỳ liên tiếp",
    familyIncome: "15-25 triệu/tháng",
    dependents: 2,
    valuableAssets: "Nhà ở tự có, xe máy, laptop công việc",
    medicalExpenses: "Chi phí khám sức khỏe định kỳ cho gia đình",
    specialCircumstances: "Gia đình có người già cần chăm sóc, em trai đang học cấp 3",
    aspirations: "Trở thành một kỹ sư phần mềm giỏi, có thể đóng góp vào sự phát triển của công nghệ Việt Nam. Mong muốn được học tập và làm việc trong môi trường quốc tế để nâng cao kỹ năng và kiến thức. Hy vọng có thể khởi nghiệp và tạo ra những sản phẩm công nghệ có ích cho cộng đồng.",
    careerGoals: "Trở thành Senior Software Engineer trong 5 năm tới, chuyên sâu về AI/ML. Mục tiêu dài hạn là thành lập startup công nghệ giáo dục, ứng dụng AI để cá nhân hóa việc học. Muốn được làm việc tại các công ty công nghệ lớn như Google, Microsoft, hoặc các startup unicorn."
  },
  createdAt: new Date('2024-01-15T10:30:00.000Z'),
  updatedAt: new Date('2024-01-15T10:30:00.000Z')
};

// Function to get sample data for specific users
export function getSampleEduscoreData(email: string): SampleEduscoreData | null {
  if (email === 'user@hyhan.com') {
    return SAMPLE_EDUSCORE_DATA;
  }
  return null;
}

// Function to check if user has sample data
export function hasSampleEduscoreData(email: string): boolean {
  return email === 'user@hyhan.com';
}