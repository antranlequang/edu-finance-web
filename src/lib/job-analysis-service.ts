export interface JobRequirementAnalysis {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  suitableJobTypes: string[];
  skillsToImprove: string[];
}

export interface EduscoreData {
  score: number;
  reasoning: string;
  major: string;
  currentYear: string;
  university: string;
  academicInfoGPA: number;
  extracurricularActivities: string;
  awards: string;
  aspirations: string;
}

// Job market data for different majors in Vietnam
const majorJobData: Record<string, JobRequirementAnalysis> = {
  "Computer Science": {
    strengths: ["Strong technical foundation", "High demand in Vietnam tech sector", "Good problem-solving skills", "Adaptable to new technologies"],
    weaknesses: ["Limited practical experience", "Need more soft skills development", "Lack of industry networking"],
    recommendations: ["Build portfolio with real projects", "Contribute to open source projects", "Join tech communities and meetups", "Practice coding interviews", "Learn cloud technologies", "Develop communication skills"],
    suitableJobTypes: ["Junior Software Developer", "Frontend Developer", "Backend Developer", "QA Engineer", "IT Support Specialist", "Data Analyst", "Mobile App Developer"],
    skillsToImprove: ["React/Angular", "Node.js", "Cloud platforms (AWS/Azure)", "Database management", "Agile methodologies"]
  },
  "Business Administration": {
    strengths: ["Leadership potential", "Strategic thinking abilities", "Good analytical skills", "Understanding of business fundamentals"],
    weaknesses: ["Need more practical business experience", "Limited digital marketing knowledge", "Lack of industry specialization"],
    recommendations: ["Gain internship experience in target industry", "Learn digital marketing tools", "Develop data analysis skills", "Build professional network", "Study specific industry trends", "Improve presentation skills"],
    suitableJobTypes: ["Management Trainee", "Business Analyst", "Marketing Assistant", "Sales Representative", "Project Coordinator", "Operations Assistant"],
    skillsToImprove: ["Digital marketing", "Data analysis", "Project management", "CRM software", "Financial modeling"]
  },
  "Marketing": {
    strengths: ["Creative thinking", "Understanding of consumer behavior", "Communication skills", "Brand awareness"],
    weaknesses: ["Limited digital marketing experience", "Need more data analysis skills", "Lack of campaign management experience"],
    recommendations: ["Get Google Ads and Analytics certifications", "Build social media marketing portfolio", "Learn content creation tools", "Study successful Vietnamese marketing campaigns", "Practice data-driven decision making"],
    suitableJobTypes: ["Digital Marketing Specialist", "Content Creator", "Social Media Manager", "Brand Assistant", "Market Research Analyst", "PR Assistant"],
    skillsToImprove: ["Google Analytics", "Social media advertising", "Content marketing", "SEO/SEM", "Marketing automation"]
  },
  "Engineering": {
    strengths: ["Strong analytical skills", "Problem-solving abilities", "Technical mindset", "Attention to detail"],
    weaknesses: ["Limited practical project experience", "Need more teamwork experience", "Lack of industry certifications"],
    recommendations: ["Complete engineering internships", "Work on practical projects", "Get relevant certifications", "Join professional engineering associations", "Develop project management skills"],
    suitableJobTypes: ["Junior Engineer", "Design Engineer", "Quality Control Engineer", "Project Engineer", "Technical Sales Engineer", "R&D Assistant"],
    skillsToImprove: ["AutoCAD", "Project management", "Industry-specific software", "Quality control methods", "Safety regulations"]
  },
  "Economics": {
    strengths: ["Strong analytical thinking", "Understanding of market dynamics", "Research skills", "Statistical knowledge"],
    weaknesses: ["Need more practical application experience", "Limited programming skills", "Lack of industry specialization"],
    recommendations: ["Learn data analysis tools (Python/R)", "Gain experience in economic research", "Study Vietnamese economic policies", "Build financial modeling skills", "Network with economic professionals"],
    suitableJobTypes: ["Economic Analyst", "Financial Analyst", "Market Research Analyst", "Policy Research Assistant", "Banking Associate", "Investment Analyst"],
    skillsToImprove: ["Python/R programming", "Financial modeling", "Data visualization", "Statistical software", "Economic forecasting"]
  }
};

// Helper function to check if data is meaningful
const hasValidData = (data: string | undefined): boolean => {
  return data && 
         data.trim() !== '' && 
         data.toLowerCase() !== 'none' && 
         data.toLowerCase() !== 'không có' &&
         data.toLowerCase() !== 'không' &&
         data !== 'No data to analyze';
};

export async function analyzeJobRequirements(eduscoreData: EduscoreData): Promise<JobRequirementAnalysis> {
  // Simulate AI analysis delay for better UX
  await new Promise(resolve => setTimeout(resolve, 1500));

  try {
    // Map Vietnamese major names to English for analysis
    const majorMapping: Record<string, string> = {
      "Khoa học máy tính": "Computer Science",
      "Quản trị kinh doanh": "Business Administration", 
      "Marketing": "Marketing",
      "Kỹ thuật": "Engineering",
      "Kinh tế": "Economics",
      "Công nghệ thông tin": "Computer Science",
      "Kế toán": "Business Administration",
      "Tài chính": "Economics"
    };

    const mappedMajor = majorMapping[eduscoreData.major] || "General Studies";
    
    // Get base analysis for the major
    let analysis = majorJobData[mappedMajor] || {
      strengths: [`Nền tảng học thuật vững chắc trong ${eduscoreData.major}`, 'Động lực học tập cao', 'Tư duy phân tích tốt'],
      weaknesses: ['Hạn chế về kinh nghiệm thực tiễn', 'Cần mở rộng mạng lưới nghề nghiệp', 'Cần phát triển kỹ năng chuyên môn'],
      recommendations: ['Tích lũy kinh nghiệm qua thực tập', 'Xây dựng mạng lưới chuyên nghiệp', 'Phát triển kỹ năng chuyên môn', 'Tham gia các tổ chức nghề nghiệp', 'Xây dựng portfolio mạnh'],
      suitableJobTypes: ['Vị trí entry-level', 'Chương trình thực tập', 'Chương trình đào tạo sau đại học', 'Vị trí junior trong ngành'],
      skillsToImprove: ['Kỹ năng giao tiếp', 'Kỹ năng chuyên môn', 'Khả năng lãnh đạo', 'Kỹ năng giải quyết vấn đề']
    };

    // Deep copy for customization
    const customizedAnalysis: JobRequirementAnalysis = JSON.parse(JSON.stringify(analysis));

    // AI-based analysis adjustments based on available data

    // Adjust based on EduScore - Primary indicator
    if (eduscoreData.score >= 85) {
      customizedAnalysis.strengths.unshift("Thành tích học tập xuất sắc (EduScore 85+)");
      customizedAnalysis.suitableJobTypes.unshift("Chương trình quản lý tài năng", "Chương trình đào tạo cạnh tranh cao");
      customizedAnalysis.recommendations.unshift("Tập trung vào cơ hội phát triển cao cấp");
    } else if (eduscoreData.score >= 70) {
      customizedAnalysis.strengths.unshift("Thành tích học tập tốt (EduScore 70+)");
      customizedAnalysis.recommendations.unshift("Tiếp tục duy trì thành tích tốt");
    } else if (eduscoreData.score >= 50) {
      customizedAnalysis.strengths.push("Có tiềm năng phát triển");
      customizedAnalysis.recommendations.unshift("Cải thiện thành tích học tập để mở rộng cơ hội");
    } else {
      customizedAnalysis.weaknesses.unshift("Cần cải thiện đáng kể thành tích học tập");
      customizedAnalysis.recommendations.unshift("Ưu tiên nâng cao GPA và kỹ năng học thuật");
    }

    // GPA Analysis - Secondary academic indicator
    if (eduscoreData.academicInfoGPA >= 3.5) {
      customizedAnalysis.strengths.push(`GPA xuất sắc (${eduscoreData.academicInfoGPA}/4.0) thể hiện năng lực học tập`);
    } else if (eduscoreData.academicInfoGPA >= 3.0) {
      customizedAnalysis.strengths.push(`GPA tốt (${eduscoreData.academicInfoGPA}/4.0) cho thấy nền tảng vững chắc`);
    } else if (eduscoreData.academicInfoGPA > 0) {
      customizedAnalysis.weaknesses.push(`GPA cần cải thiện (${eduscoreData.academicInfoGPA}/4.0)`);
      customizedAnalysis.recommendations.push("Tập trung nâng cao điểm số học tập");
    }

    // Extracurricular Activities Analysis - Leadership & engagement indicator
    if (hasValidData(eduscoreData.extracurricularActivities)) {
      customizedAnalysis.strengths.push("Tích cực tham gia hoạt động ngoại khóa thể hiện khả năng lãnh đạo");
      if (eduscoreData.extracurricularActivities.toLowerCase().includes('chủ tịch') || 
          eduscoreData.extracurricularActivities.toLowerCase().includes('leader') ||
          eduscoreData.extracurricularActivities.toLowerCase().includes('captain')) {
        customizedAnalysis.strengths.push("Kinh nghiệm lãnh đạo qua các vị trí quan trọng");
        customizedAnalysis.skillsToImprove = customizedAnalysis.skillsToImprove.filter(s => s !== 'Khả năng lãnh đạo');
      }
    } else {
      customizedAnalysis.weaknesses.push("Ít tham gia hoạt động ngoại khóa");
      customizedAnalysis.recommendations.push("Tham gia tổ chức sinh viên và hoạt động tình nguyện");
    }

    // Awards Analysis - Excellence indicator
    if (hasValidData(eduscoreData.awards)) {
      customizedAnalysis.strengths.push("Đạt được giải thưởng thể hiện sự xuất sắc");
      if (eduscoreData.awards.toLowerCase().includes('nhất') || 
          eduscoreData.awards.toLowerCase().includes('first') ||
          eduscoreData.awards.toLowerCase().includes('gold')) {
        customizedAnalysis.strengths.push("Giải thưởng cao thể hiện năng lực vượt trội");
      }
    } else {
      // Not a weakness if student is early in career - more neutral
      if (!eduscoreData.currentYear.includes('1st')) {
        customizedAnalysis.recommendations.push("Tham gia các cuộc thi để thể hiện năng lực");
      }
    }

    // Academic Year Analysis - Experience level indicator
    if (eduscoreData.currentYear.includes('1st') || eduscoreData.currentYear.includes('Năm một')) {
      customizedAnalysis.recommendations.unshift("Bắt đầu xây dựng kỹ năng nền tảng ngay từ sớm");
      customizedAnalysis.suitableJobTypes = ['Thực tập sinh', 'Công việc bán thời gian', 'Trợ lý junior'];
      customizedAnalysis.strengths.push("Thời gian còn nhiều để phát triển và học hỏi");
    } else if (eduscoreData.currentYear.includes('4th') || eduscoreData.currentYear.includes('Năm tư')) {
      customizedAnalysis.recommendations.unshift("Chuẩn bị tích cực cho việc làm sau tốt nghiệp");
      customizedAnalysis.suitableJobTypes.unshift("Graduate trainee programs", "Entry-level full-time positions");
    }

    // University prestige factor (basic analysis)
    if (eduscoreData.university.toLowerCase().includes('bách khoa') || 
        eduscoreData.university.toLowerCase().includes('kinh tế') ||
        eduscoreData.university.toLowerCase().includes('quốc gia')) {
      customizedAnalysis.strengths.push(`Đang học tại ${eduscoreData.university} - trường có uy tín`);
    }

    // Aspirations analysis - Future direction indicator
    if (hasValidData(eduscoreData.aspirations)) {
      if (eduscoreData.aspirations.toLowerCase().includes('khởi nghiệp') || 
          eduscoreData.aspirations.toLowerCase().includes('startup')) {
        customizedAnalysis.recommendations.push("Phát triển kỹ năng kinh doanh và networking cho khởi nghiệp");
        customizedAnalysis.skillsToImprove.push("Kỹ năng kinh doanh", "Quản lý dự án");
      }
      if (eduscoreData.aspirations.toLowerCase().includes('nghiên cứu') || 
          eduscoreData.aspirations.toLowerCase().includes('research')) {
        customizedAnalysis.recommendations.push("Tập trung vào nghiên cứu khoa học và học lên cao");
        customizedAnalysis.suitableJobTypes.push("Trợ lý nghiên cứu", "Thực tập nghiên cứu");
      }
    }

    return customizedAnalysis;
  } catch (error) {
    console.error('Error in AI job analysis:', error);
    // Return intelligent default analysis
    return {
      strengths: [`Nền tảng học thuật trong ${eduscoreData.major}`, 'Động lực học tập cao', 'Tiềm năng phát triển tốt'],
      weaknesses: ['Cần tích lũy thêm kinh nghiệm thực tiễn', 'Cần mở rộng mạng lưới nghề nghiệp'],
      recommendations: ['Tham gia thực tập để có kinh nghiệm', 'Xây dựng mạng lưới chuyên nghiệp', 'Phát triển kỹ năng mềm'],
      suitableJobTypes: ['Vị trí entry-level', 'Chương trình thực tập', 'Trợ lý junior'],
      skillsToImprove: ['Kỹ năng giao tiếp', 'Kỹ năng chuyên môn', 'Làm việc nhóm']
    };
  }
}