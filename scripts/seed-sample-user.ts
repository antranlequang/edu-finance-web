/**
 * Script to create sample user account with EduScore data
 * Run with: npx tsx scripts/seed-sample-user.ts
 */

import { createUserProfile, saveEduscoreResult, getUserByEmail } from '../src/lib/database-operations';
import { EduscoreService } from '../src/lib/eduscore-service';

const SAMPLE_USER_EMAIL = 'user@hyhan.com';
const SAMPLE_USER_PASSWORD = '12345678';
const SAMPLE_USER_NAME = 'Sample User';

const sampleSurveyData = {
  academicInfoGPA: 3.7,
  major: 'Computer Science',
  majorSpecialization: 'Artificial Intelligence',
  technicalSkills: 'Python, JavaScript, React, Node.js, Machine Learning, Data Analysis',
  programmingLanguages: 'Python, JavaScript, Java, C++, SQL',
  certifications: 'AWS Solutions Architect Associate, Google Cloud Professional Data Engineer, Coursera Machine Learning Certificate',
  languageSkills: 'English (Native), Vietnamese (Fluent), Japanese (Intermediate)',
  workExperience: 'Software Engineering Intern at TechCorp (6 months), Frontend Developer at StartupXYZ (1 year)',
  currentYear: 'Year 3',
  university: 'University of Technology Vietnam',
  extracurricularActivities: 'President of Computer Science Club, Volunteer at Code.org, Hackathon organizer',
  awards: 'Dean\'s List 2023, Best Innovation Award at TechHack 2023, Outstanding Student Leader Award',
  familyIncome: '20-30 million VND',
  dependents: 2,
  valuableAssets: 'Family home (estimated 2 billion VND), savings account',
  medicalExpenses: 'Minor - routine healthcare only',
  specialCircumstances: 'First-generation college student, supporting younger siblings\' education',
  aspirations: 'Become a leading AI researcher and entrepreneur, establish a tech company that creates positive social impact, mentor young students in STEM fields',
  careerGoals: 'Work at a top tech company like Google or Meta, pursue Master\'s degree in AI/ML, eventually start my own AI startup focused on educational technology'
};

const sampleEduScoreResult = {
  eduscore: 87,
  reasoning: `**Phân tích EduScore chi tiết cho ${SAMPLE_USER_NAME}:**

🎓 **Thành tích học thuật (35/40 điểm):**
- GPA 3.7/4.0 thể hiện sự xuất sắc trong học tập
- Chuyên ngành Computer Science với chuyên sâu AI rất phù hợp với xu hướng thị trường
- Năm 3 cho thấy sự ổn định và tiến bộ trong quá trình học
- Trường University of Technology Vietnam là trường có uy tín trong lĩnh vực công nghệ

💻 **Kỹ năng chuyên môn (28/30 điểm):**
- Thành thạo các ngôn ngữ lập trình quan trọng: Python, JavaScript, Java, C++
- Kỹ năng công nghệ hiện đại: React, Node.js, Machine Learning, Data Analysis
- Chứng chỉ chuyên nghiệp: AWS, Google Cloud, Coursera ML - thể hiện cam kết học hỏi
- Kỹ năng đa ngôn ngữ: Tiếng Anh, Tiếng Việt, Tiếng Nhật - lợi thế lớn trong môi trường quốc tế

🌟 **Hoạt động ngoại khóa (17/20 điểm):**
- Chủ tịch Câu lạc bộ Khoa học Máy tính - khả năng lãnh đạo
- Tình nguyện viên tại Code.org - tinh thần cống hiến cộng đồng
- Tổ chức hackathon - khả năng tổ chức sự kiện lớn
- Giải thưởng: Dean's List, Best Innovation Award - thành tích xuất sắc

💼 **Kinh nghiệm làm việc (7/10 điểm):**
- Thực tập tại TechCorp 6 tháng - kinh nghiệm thực tế
- Frontend Developer tại StartupXYZ 1 năm - kinh nghiệm chuyên sâu
- Cần tích lũy thêm kinh nghiệm để đạt điểm tối đa

**Điểm mạnh nổi bật:**
- Kết hợp tốt giữa lý thuyết và thực hành
- Kỹ năng lãnh đạo và tổ chức xuất sắc
- Định hướng nghề nghiệp rõ ràng và tham vọng
- Tinh thần học hỏi và phát triển bản thân cao

**Khuyến nghị cải thiện:**
- Tích lũy thêm kinh nghiệm làm việc thực tế
- Phát triển thêm các dự án cá nhân để xây dựng portfolio
- Tham gia các cuộc thi quốc tế để nâng cao uy tín

**Cơ hội học bổng phù hợp:**
- Học bổng STEM cho sinh viên xuất sắc
- Học bổng công nghệ cho sinh viên có thành tích cao
- Học bổng nghiên cứu AI/ML
- Học bổng dành cho sinh viên có hoạt động cộng đồng

Với EduScore 87/100, bạn thuộc nhóm sinh viên xuất sắc và có nhiều cơ hội nhận học bổng danh giá!`
};

async function createSampleUser() {
  try {
    console.log('🔄 Checking if sample user already exists...');
    
    // Check if user already exists
    const existingUser = await getUserByEmail(SAMPLE_USER_EMAIL);
    
    if (existingUser) {
      console.log('✅ Sample user already exists:', existingUser.email);
      console.log('📊 Adding/updating EduScore data...');
      
      // Add EduScore data
      await saveEduscoreResult({
        userId: existingUser.id,
        score: sampleEduScoreResult.eduscore,
        reasoning: sampleEduScoreResult.reasoning,
        surveyData: sampleSurveyData,
        documentUrls: {
          transcript: null,
          recommendationLetter: null
        }
      });
      
      console.log('✅ Sample EduScore data added successfully!');
      return;
    }

    console.log('🔄 Creating sample user account...');
    
    // Create user
    const newUser = await createUserProfile({
      email: SAMPLE_USER_EMAIL,
      name: SAMPLE_USER_NAME,
      password: SAMPLE_USER_PASSWORD,
      role: 'student'
    });
    
    console.log('✅ Sample user created successfully:', newUser.email);
    
    console.log('📊 Adding EduScore data...');
    
    // Add EduScore data
    await saveEduscoreResult({
      userId: newUser.id,
      score: sampleEduScoreResult.eduscore,
      reasoning: sampleEduScoreResult.reasoning,
      surveyData: sampleSurveyData,
      documentUrls: {
        transcript: null,
        recommendationLetter: null
      }
    });
    
    console.log('✅ Sample EduScore data added successfully!');
    console.log('');
    console.log('🎉 Sample user setup complete!');
    console.log('📧 Email: user@hyhan.com');
    console.log('🔑 Password: 12345678');
    console.log('📊 EduScore: 87/100');
    console.log('');
    console.log('You can now login with these credentials to see a fully populated profile.');
    
  } catch (error) {
    console.error('❌ Error creating sample user:', error);
    process.exit(1);
  }
}

// Run the script
createSampleUser()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });