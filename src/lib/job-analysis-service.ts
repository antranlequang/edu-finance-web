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

export async function analyzeJobRequirements(eduscoreData: EduscoreData): Promise<JobRequirementAnalysis> {
  // Simulate API delay for better UX
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    // Get base analysis for the major
    let analysis = majorJobData[eduscoreData.major] || {
      strengths: [`Academic background in ${eduscoreData.major}`, 'Motivated to learn', 'Good educational foundation'],
      weaknesses: ['Limited work experience', 'Need more industry exposure', 'Lack of professional network'],
      recommendations: ['Gain practical experience through internships', 'Build a professional network', 'Develop relevant technical skills', 'Join professional associations', 'Create a strong portfolio'],
      suitableJobTypes: ['Entry-level positions', 'Internships', 'Graduate trainee programs', 'Junior roles in your field'],
      skillsToImprove: ['Communication skills', 'Technical skills', 'Leadership abilities', 'Problem-solving skills']
    };

    // Customize based on EduScore and other factors
    const customizedAnalysis = { ...analysis };

    // Adjust based on EduScore
    if (eduscoreData.score >= 85) {
      customizedAnalysis.strengths.unshift("Outstanding academic performance");
      customizedAnalysis.suitableJobTypes.unshift("Fast-track management programs", "Competitive graduate schemes");
    } else if (eduscoreData.score >= 70) {
      customizedAnalysis.strengths.unshift("Strong academic performance");
    } else {
      customizedAnalysis.weaknesses.push("Need to improve academic performance");
      customizedAnalysis.recommendations.push("Focus on improving GPA and academic skills");
    }

    // Adjust based on GPA
    if (eduscoreData.academicInfoGPA >= 3.5) {
      customizedAnalysis.strengths.push("Excellent GPA demonstrates academic excellence");
    } else if (eduscoreData.academicInfoGPA < 3.0) {
      customizedAnalysis.weaknesses.push("GPA below industry expectations");
      customizedAnalysis.recommendations.push("Work on improving academic performance");
    }

    // Adjust based on extracurricular activities
    if (eduscoreData.extracurricularActivities && eduscoreData.extracurricularActivities.toLowerCase() !== 'none') {
      customizedAnalysis.strengths.push("Active in extracurricular activities showing leadership potential");
    } else {
      customizedAnalysis.weaknesses.push("Limited extracurricular involvement");
      customizedAnalysis.recommendations.push("Participate in student organizations and volunteer activities");
    }

    // Adjust based on awards
    if (eduscoreData.awards && eduscoreData.awards.toLowerCase() !== 'none') {
      customizedAnalysis.strengths.push("Recognition through awards demonstrates excellence");
    }

    // Adjust based on academic year
    if (eduscoreData.currentYear.includes('1st') || eduscoreData.currentYear.includes('2nd')) {
      customizedAnalysis.recommendations.push("Focus on building foundational skills early");
      customizedAnalysis.suitableJobTypes = customizedAnalysis.suitableJobTypes.filter(job => 
        job.includes('Intern') || job.includes('Part-time') || job.includes('Assistant')
      );
    }

    return customizedAnalysis;
  } catch (error) {
    console.error('Error analyzing job requirements:', error);
    // Return default analysis in case of error
    return {
      strengths: [`Academic background in ${eduscoreData.major}`, 'Strong motivation to learn'],
      weaknesses: ['Limited work experience', 'Need more industry exposure'],
      recommendations: ['Gain practical experience through internships', 'Build a professional network', 'Develop technical skills'],
      suitableJobTypes: ['Entry-level positions', 'Internships', 'Graduate trainee programs'],
      skillsToImprove: ['Communication skills', 'Technical skills', 'Leadership abilities']
    };
  }
}