'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { EvaluateEduscoreSurveyOutput } from '@/ai/flows/evaluate-eduscore-survey';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import Link from 'next/link';
import { ArrowRight, TrendingUp, TrendingDown, Target, Briefcase, User, Calendar, GraduationCap, Building, DollarSign, Award, Languages, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { analyzeJobRequirements, JobRequirementAnalysis } from '@/lib/job-analysis-service';
import { matchScholarships, ScholarshipMatchingResult, UserProfile } from '@/lib/scholarship-matching-service';
import { FormattedText } from '@/components/ui/formatted-text';

interface SurveyResultProps {
  result: EvaluateEduscoreSurveyOutput;
}

export default function SurveyResult({ result }: SurveyResultProps) {
  const { eduscore, reasoning } = result;
  const [jobAnalysis, setJobAnalysis] = useState<JobRequirementAnalysis | null>(null);
  const [scholarshipMatches, setScholarshipMatches] = useState<ScholarshipMatchingResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const chartData = [
    { name: 'Eduscore', value: eduscore, fill: 'hsl(var(--primary))' },
  ];

  // Chart colors
  const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    const analyzeProfile = async () => {
      setIsAnalyzing(true);
      try {
        // Get stored survey data from localStorage
        const storedData = localStorage.getItem('eduscoreResult');
        const surveyData = localStorage.getItem('surveyData');
        
        if (storedData && surveyData) {
          const parsedSurveyData = JSON.parse(surveyData);
          
          // Create user profile for scholarship matching
          const profile: UserProfile = {
            name: 'Student', // Default name since we don't collect this in the form
            academicInfoGPA: parsedSurveyData.academicInfoGPA || 3.0,
            major: parsedSurveyData.major || 'General Studies',
            currentYear: parsedSurveyData.currentYear || '1st Year',
            university: parsedSurveyData.university || 'Unknown University',
            familyIncome: parsedSurveyData.familyIncome || '< $1,000',
            eduscore: eduscore,
            extracurricularActivities: parsedSurveyData.extracurricularActivities || 'None',
            awards: parsedSurveyData.awards || 'None',
            languageSkills: parsedSurveyData.languageSkills || 'No data to analyze',
            workExperience: parsedSurveyData.workExperience || 'None',
            specialCircumstances: parsedSurveyData.specialCircumstances || 'None',
            technicalSkills: parsedSurveyData.technicalSkills || 'No data to analyze',
            certifications: parsedSurveyData.certifications || 'None',
            aspirations: parsedSurveyData.aspirations || 'No data to analyze',
            careerGoals: parsedSurveyData.careerGoals || 'No data to analyze'
          };

          setUserProfile(profile);
          
          const eduscoreData = {
            score: eduscore,
            reasoning,
            major: profile.major,
            currentYear: profile.currentYear,
            university: profile.university,
            academicInfoGPA: profile.academicInfoGPA,
            extracurricularActivities: profile.extracurricularActivities,
            awards: profile.awards,
            aspirations: profile.aspirations,
          };
          
          // Get job analysis
          const analysis = await analyzeJobRequirements(eduscoreData);
          setJobAnalysis(analysis);

          // Get scholarship matches
          const matches = matchScholarships(profile);
          setScholarshipMatches(matches);
        }
      } catch (error) {
        console.error('Error analyzing profile:', error);
        // Set default analysis in case of error
        setJobAnalysis({
          strengths: ['Academic dedication', 'Strong motivation'],
          weaknesses: ['Limited work experience', 'Need more industry exposure'],
          recommendations: ['Gain practical experience', 'Build professional network', 'Develop technical skills'],
          suitableJobTypes: ['Entry-level positions', 'Internships', 'Graduate trainee programs'],
          skillsToImprove: ['Communication skills', 'Technical skills', 'Leadership abilities']
        });
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyzeProfile();
  }, [eduscore, reasoning]);

  // Helper function to safely display data with fallback
  const safeDisplay = (data: string | undefined, fallback = "Không có dữ liệu phân tích") => {
    return (!data || data.trim() === '' || data.toLowerCase() === 'none') ? fallback : data;
  };

  // Generate skills chart data
  const generateSkillsChartData = () => {
    if (!userProfile) return [];
    
    const skills = [
      { name: 'Technical Skills', value: userProfile.technicalSkills !== 'No data to analyze' ? 80 : 20 },
      { name: 'Language Skills', value: userProfile.languageSkills !== 'No data to analyze' ? 75 : 25 },
      { name: 'Work Experience', value: userProfile.workExperience !== 'None' ? 70 : 10 },
      { name: 'Extracurriculars', value: userProfile.extracurricularActivities !== 'None' ? 85 : 30 },
      { name: 'Certifications', value: userProfile.certifications !== 'None' ? 60 : 15 }
    ];

    return skills;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* User Information Section */}
      {userProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6 text-blue-600" />
              Thông tin người dùng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Tên</p>
                  <p className="font-medium">{safeDisplay(userProfile.name, "Sinh viên")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Ngày sinh</p>
                  <p className="font-medium">{safeDisplay(userProfile.dateOfBirth)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Nghề nghiệp</p>
                  <p className="font-medium">{safeDisplay(userProfile.occupation, "Sinh viên")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Ngành học</p>
                  <p className="font-medium">{userProfile.major}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Đại học/cao đẳng</p>
                  <p className="font-medium">{userProfile.university}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Thu nhập của gia đình</p>
                  <p className="font-medium">{userProfile.familyIncome}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* EduScore Display */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl">Kết quả EduScore của bạn</CardTitle>
          <CardDescription className="text-center">Điểm số này phản ánh hồ sơ tổng thể của bạn dựa trên thông tin được cung cấp.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  innerRadius="70%" 
                  outerRadius="100%" 
                  data={chartData} 
                  startAngle={90} 
                  endAngle={-270}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar
                    background
                    dataKey='value'
                    cornerRadius={10}
                  />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-5xl font-bold fill-foreground"
                  >
                    {eduscore}
                  </text>
                   <text
                    x="50%"
                    y="65%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-lg fill-muted-foreground"
                  >
                    / 100
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="font-semibold text-xl mb-2 text-primary">Đánh giá dựa trên AI</h3>
              <div className="text-muted-foreground italic text-justify">
                "<FormattedText text={reasoning} />"
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Chart */}
      {userProfile && (
        <Card>
          <CardHeader>
            <CardTitle>Tổng quan kỹ năng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={generateSkillsChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Proficiency']} />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {isAnalyzing ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mr-3" />
            <span>Đang phân tích hồ sơ và tìm kiếm học bổng...</span>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Career Potential & Analysis */}
          {jobAnalysis && (
            <Tabs defaultValue="career" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="career">Nghề nghiệp</TabsTrigger>
                <TabsTrigger value="strengths">Điểm mạnh</TabsTrigger>
                <TabsTrigger value="weaknesses">Điểm yếu</TabsTrigger>
                <TabsTrigger value="recommendations">Khuyến nghị</TabsTrigger>
                <TabsTrigger value="jobs">Công việc phù hợp</TabsTrigger>
                <TabsTrigger value="scholarships">Học bổng</TabsTrigger>
              </TabsList>

              <TabsContent value="career">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-600 text-base" />
                      Phân tích tiềm năng nghề nghiệp
                    </CardTitle>
                    <CardDescription>Dựa trên kết quả từ EduScore và hồ sơ của bạn, đây là triển vọng nghề nghiệp của bạn</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold">Chỉ số sẵn sàng nghề nghiệp</h4>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-purple-600 h-3 rounded-full transition-all duration-500" 
                            style={{ width: `${Math.min(eduscore, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {eduscore >= 80 ? "Triển vọng nghề nghiệp xuất sắc" : 
                           eduscore >= 60 ? "Tiềm năng nghề nghiệp tốt nhưng cần cải thiện thêm" :
                           "Tập trung phát triển kỹ năng để cải thiện mức độ sẵn sàng nghề nghiệp"}
                        </p>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold">Mức độ cạnh tranh trên thị trường</h4>
                        <div className="flex items-center gap-2">
                          {eduscore >= 75 ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">Cao</Badge>
                          ) : eduscore >= 50 ? (
                            <Badge variant="default" className="bg-yellow-100 text-yellow-800">Trung bình</Badge>
                          ) : (
                            <Badge variant="default" className="bg-red-100 text-red-800">Đang phát triển</Badge>
                          )}
                          <span className="text-sm text-muted-foreground">
                            Dựa trên xu hướng thị trường việc làm hiện tại
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Những điểm nổi bật</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Ngành học {userProfile?.major} của bạn phù hợp với nhu cầu thị trường hiện tại</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>GPA {userProfile?.academicInfoGPA} thể hiện năng lực học tập</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span>Tiếp tục tích lũy kinh nghiệm thực tế để tăng khả năng có việc làm</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="strengths">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Điểm mạnh của bạn
                    </CardTitle>
                    <CardDescription>Dựa trên hồ sơ của bạn, đây là những điểm mạnh chính</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {jobAnalysis.strengths.map((strength, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-green-800">{strength}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="weaknesses">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-orange-600" />
                      Những điểm cần cải thiện
                    </CardTitle>
                    <CardDescription>Hãy tập trung vào những điểm này để cải thiện hồ sơ của bạn</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {jobAnalysis.weaknesses.map((weakness, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                          <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-orange-800">{weakness}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      Kế hoạch hành động
                    </CardTitle>
                    <CardDescription>Các bước cụ thể để cải thiện hồ sơ của bạn</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {jobAnalysis.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className="w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-blue-800">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="jobs">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-purple-600" />
                      Công việc phù hợp
                    </CardTitle>
                    <CardDescription>Các loại công việc phù hợp với hồ sơ hiện tại của bạn</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        {jobAnalysis.suitableJobTypes.map((job, index) => (
                          <Badge key={index} variant="outline" className="text-purple-700 border-purple-200 justify-start p-3">
                            {job}
                          </Badge>
                        ))}
                      </div>
                      <div className="border-t pt-4">
                        <p className="text-sm text-muted-foreground mb-3">
                          Khám phá các cơ hội việc làm cụ thể phù hợp với hồ sơ của bạn
                        </p>
                        <Link href="/job">
                          <Button className="w-full bg-purple-600 hover:bg-purple-700">
                            <Briefcase className="mr-2 h-4 w-4" />
                            Xem tất cả việc làm phù hợp
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scholarships">
                <div className="space-y-6">
                  {/* Fully Matching Scholarships */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Học bổng bạn đủ điều kiện
                      </CardTitle>
                      <CardDescription>Những học bổng này phù hợp với tất cả tiêu chí của bạn</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {scholarshipMatches?.fullyMatching.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          Không tìm thấy học bổng nào phù hợp hoàn toàn tại thời điểm này.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {scholarshipMatches?.fullyMatching.map((match, index) => (
                            <div key={index} className="border rounded-lg p-4 bg-green-50 border-green-200">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-green-900">{match.scholarship.name}</h4>
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                  {match.matchPercentage}% Match
                                </Badge>
                              </div>
                              <p className="text-sm text-green-700 mb-2">{match.scholarship.description}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  ${match.scholarship.amount.toLocaleString()} {match.scholarship.currency}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Building className="h-4 w-4" />
                                  {match.scholarship.provider}
                                </span>
                                <span className="flex items-center gap-1 text-green-600">
                                  <CheckCircle className="h-4 w-4" />
                                  Eligible
                                </span>
                              </div>
                              {match.scholarship.contactInfo && (
                                <div className="mt-3 text-xs text-muted-foreground">
                                  Liên hệ: {match.scholarship.contactInfo.email || match.scholarship.contactInfo.website}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Partially Matching Scholarships */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        Học bổng bạn có thể đủ điều kiện
                      </CardTitle>
                      <CardDescription>Những học bổng này yêu cầu bạn cải thiện thêm hồ sơ</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {scholarshipMatches?.partiallyMatching.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          Không tìm thấy học bổng nào phù hợp một phần tại thời điểm này.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {scholarshipMatches?.partiallyMatching.map((match, index) => (
                            <div key={index} className="border rounded-lg p-4 bg-orange-50 border-orange-200">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-orange-900">{match.scholarship.name}</h4>
                                <Badge variant="default" className="bg-orange-100 text-orange-800">
                                  {match.matchPercentage}% Match
                                </Badge>
                              </div>
                              <p className="text-sm text-orange-700 mb-3">{match.scholarship.description}</p>
                              <div className="flex items-center gap-4 text-sm mb-3">
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  ${match.scholarship.amount.toLocaleString()} {match.scholarship.currency}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Building className="h-4 w-4" />
                                  {match.scholarship.provider}
                                </span>
                              </div>
                              <div className="border-t border-orange-200 pt-3">
                                <h5 className="font-medium text-orange-900 mb-2">Các yêu cầu còn thiếu:</h5>
                                <ul className="space-y-1">
                                  {match.missingCriteria.map((criteria, idx) => (
                                    <li key={idx} className="text-sm text-orange-700 flex items-start gap-2">
                                      <span className="text-orange-500 mt-1">•</span>
                                      {criteria}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              {match.scholarship.contactInfo && (
                                <div className="mt-3 text-xs text-muted-foreground">
                                  Liên hệ: {match.scholarship.contactInfo.email || match.scholarship.contactInfo.website}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <div className="w-full space-y-3">
                        <p className="text-sm text-muted-foreground text-center">
                          Tìm hiểu thêm về các chương trình học bổng phù hợp
                        </p>
                        <Link href="/scholarship" className="w-full">
                          <Button className="w-full bg-orange-600 hover:bg-orange-700">
                            <Award className="mr-2 h-4 w-4" />
                            Khám phá tất cả học bổng
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </>
      )}

      <div className="flex justify-end mt-4">
        <Link href="/profile">
          <Button>
            Đi tới hồ sơ của bạn
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
