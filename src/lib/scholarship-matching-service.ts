interface ScholarshipCriteria {
  minGPA?: number;
  maxGPA?: number;
  majors?: string[];
  currentYear?: string[];
  maxFamilyIncome?: string;
  minEduscore?: number;
  maxAge?: number;
  nationality?: string[];
  specialCircumstances?: string[];
  extracurriculars?: string[];
  awards?: boolean;
  languages?: string[];
  workExperience?: boolean;
}

export interface Scholarship {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  provider: string;
  eligibilityCriteria: ScholarshipCriteria;
  applicationDeadline?: string;
  isActive: boolean;
  totalSlots: number;
  occupiedSlots: number;
  requirements?: string[];
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };
}

export interface UserProfile {
  name?: string;
  dateOfBirth?: string;
  occupation?: string;
  academicInfoGPA: number;
  major: string;
  currentYear: string;
  university: string;
  familyIncome: string;
  eduscore: number;
  extracurricularActivities: string;
  awards: string;
  languageSkills: string;
  workExperience: string;
  specialCircumstances?: string;
  technicalSkills?: string;
  certifications?: string;
  aspirations?: string;
  careerGoals?: string;
}

export interface MatchResult {
  scholarship: Scholarship;
  matchType: 'fully_matching' | 'partially_matching';
  missingCriteria: string[];
  matchPercentage: number;
}

export interface ScholarshipMatchingResult {
  fullyMatching: MatchResult[];
  partiallyMatching: MatchResult[];
}

// Mock scholarships data - in a real app, this would come from the database
const mockScholarships: Scholarship[] = [
  {
    id: '1',
    name: 'Tech Excellence Scholarship',
    description: 'Supporting outstanding computer science and engineering students',
    amount: 5000,
    currency: 'USD',
    provider: 'Tech Foundation',
    eligibilityCriteria: {
      minGPA: 3.5,
      majors: ['Computer Science', 'Software Engineering', 'Information Technology'],
      currentYear: ['3rd Year', '4th Year'],
      maxFamilyIncome: '$2,500',
      minEduscore: 70
    },
    isActive: true,
    totalSlots: 10,
    occupiedSlots: 3,
    requirements: ['Academic transcript', 'Recommendation letter', 'Technical portfolio'],
    contactInfo: {
      email: 'scholarships@techfoundation.org',
      website: 'https://techfoundation.org/scholarships'
    }
  },
  {
    id: '2',
    name: 'Global Leadership Grant',
    description: 'For students demonstrating leadership potential across all disciplines',
    amount: 3000,
    currency: 'USD',
    provider: 'Global Education Initiative',
    eligibilityCriteria: {
      minGPA: 3.0,
      minEduscore: 60,
      maxFamilyIncome: '$5,000',
      extracurriculars: ['leadership', 'volunteer', 'community'],
      awards: true
    },
    isActive: true,
    totalSlots: 20,
    occupiedSlots: 8,
    requirements: ['Essay on leadership experience', 'Community service documentation'],
    contactInfo: {
      email: 'grants@globaledu.org'
    }
  },
  {
    id: '3',
    name: 'STEM Innovation Award',
    description: 'Encouraging innovation in science, technology, engineering, and mathematics',
    amount: 7500,
    currency: 'USD',
    provider: 'Innovation Hub',
    eligibilityCriteria: {
      minGPA: 3.7,
      majors: ['Computer Science', 'Engineering', 'Mathematics', 'Physics', 'Data Science'],
      currentYear: ['2nd Year', '3rd Year', '4th Year'],
      minEduscore: 80,
      workExperience: true
    },
    isActive: true,
    totalSlots: 5,
    occupiedSlots: 1,
    requirements: ['Research project proposal', 'Technical portfolio', 'Innovation essay'],
    contactInfo: {
      email: 'awards@innovationhub.org',
      website: 'https://innovationhub.org/stem-awards'
    }
  },
  {
    id: '4',
    name: 'First Generation Student Support',
    description: 'Supporting first-generation college students across all majors',
    amount: 2500,
    currency: 'USD',
    provider: 'Education Access Foundation',
    eligibilityCriteria: {
      minGPA: 2.8,
      maxFamilyIncome: '$2,500',
      minEduscore: 50,
      specialCircumstances: ['first-generation', 'financial hardship']
    },
    isActive: true,
    totalSlots: 30,
    occupiedSlots: 12,
    requirements: ['Financial documentation', 'Personal essay'],
    contactInfo: {
      email: 'support@educationaccess.org'
    }
  },
  {
    id: '5',
    name: 'Business Excellence Scholarship',
    description: 'For outstanding business and economics students',
    amount: 4000,
    currency: 'USD',
    provider: 'Business Leaders Network',
    eligibilityCriteria: {
      minGPA: 3.4,
      majors: ['Business Administration', 'Economics', 'Finance Banking', 'Marketing', 'Accounting'],
      currentYear: ['3rd Year', '4th Year', 'Graduate'],
      minEduscore: 65,
      workExperience: true
    },
    isActive: true,
    totalSlots: 15,
    occupiedSlots: 6,
    requirements: ['Business plan or case study', 'Professional references'],
    contactInfo: {
      email: 'scholarships@businessleaders.org',
      website: 'https://businessleaders.org/scholarships'
    }
  }
];

function parseIncomeRange(incomeRange: string): number {
  // Convert income range to maximum value for comparison
  switch (incomeRange) {
    case '< $1,000':
      return 1000;
    case '$1,000 - $2,500':
      return 2500;
    case '$2,501 - $5,000':
      return 5000;
    case '> $5,000':
      return 10000; // Assume high income
    default:
      return 10000;
  }
}

function checkCriteriaMatch(userProfile: UserProfile, criteria: ScholarshipCriteria): { matches: boolean; missing: string[] } {
  const missing: string[] = [];
  let matches = true;

  // Check GPA
  if (criteria.minGPA && userProfile.academicInfoGPA < criteria.minGPA) {
    matches = false;
    missing.push(`Minimum GPA of ${criteria.minGPA} required (you have ${userProfile.academicInfoGPA})`);
  }

  if (criteria.maxGPA && userProfile.academicInfoGPA > criteria.maxGPA) {
    matches = false;
    missing.push(`Maximum GPA of ${criteria.maxGPA} required (you have ${userProfile.academicInfoGPA})`);
  }

  // Check major
  if (criteria.majors && !criteria.majors.includes(userProfile.major)) {
    matches = false;
    missing.push(`Major must be one of: ${criteria.majors.join(', ')} (you have ${userProfile.major})`);
  }

  // Check current year
  if (criteria.currentYear && !criteria.currentYear.includes(userProfile.currentYear)) {
    matches = false;
    missing.push(`Academic year must be one of: ${criteria.currentYear.join(', ')} (you are in ${userProfile.currentYear})`);
  }

  // Check family income
  if (criteria.maxFamilyIncome) {
    const userIncomeValue = parseIncomeRange(userProfile.familyIncome);
    const maxIncomeValue = parseIncomeRange(criteria.maxFamilyIncome);
    if (userIncomeValue > maxIncomeValue) {
      matches = false;
      missing.push(`Family income must be ${criteria.maxFamilyIncome} or less (you selected ${userProfile.familyIncome})`);
    }
  }

  // Check Eduscore
  if (criteria.minEduscore && userProfile.eduscore < criteria.minEduscore) {
    matches = false;
    missing.push(`Minimum Eduscore of ${criteria.minEduscore} required (you have ${userProfile.eduscore})`);
  }

  // Check work experience
  if (criteria.workExperience && (userProfile.workExperience === 'None' || !userProfile.workExperience.trim())) {
    matches = false;
    missing.push('Work experience required');
  }

  // Check awards
  if (criteria.awards && (userProfile.awards === 'None' || !userProfile.awards.trim())) {
    matches = false;
    missing.push('Awards or achievements required');
  }

  // Check extracurriculars
  if (criteria.extracurriculars) {
    const userActivities = userProfile.extracurricularActivities.toLowerCase();
    const hasRequiredActivities = criteria.extracurriculars.some(activity => 
      userActivities.includes(activity.toLowerCase())
    );
    if (!hasRequiredActivities) {
      matches = false;
      missing.push(`Must have experience in: ${criteria.extracurriculars.join(', ')}`);
    }
  }

  // Check special circumstances
  if (criteria.specialCircumstances) {
    const userCircumstances = userProfile.specialCircumstances?.toLowerCase() || '';
    const hasRequiredCircumstances = criteria.specialCircumstances.some(circumstance => 
      userCircumstances.includes(circumstance.toLowerCase())
    );
    if (!hasRequiredCircumstances) {
      matches = false;
      missing.push(`Must meet special circumstances: ${criteria.specialCircumstances.join(', ')}`);
    }
  }

  return { matches, missing };
}

function calculateMatchPercentage(userProfile: UserProfile, criteria: ScholarshipCriteria): number {
  let totalCriteria = 0;
  let metCriteria = 0;

  // Count and check each criterion
  if (criteria.minGPA !== undefined) {
    totalCriteria++;
    if (userProfile.academicInfoGPA >= criteria.minGPA) metCriteria++;
  }

  if (criteria.maxGPA !== undefined) {
    totalCriteria++;
    if (userProfile.academicInfoGPA <= criteria.maxGPA) metCriteria++;
  }

  if (criteria.majors) {
    totalCriteria++;
    if (criteria.majors.includes(userProfile.major)) metCriteria++;
  }

  if (criteria.currentYear) {
    totalCriteria++;
    if (criteria.currentYear.includes(userProfile.currentYear)) metCriteria++;
  }

  if (criteria.maxFamilyIncome) {
    totalCriteria++;
    const userIncomeValue = parseIncomeRange(userProfile.familyIncome);
    const maxIncomeValue = parseIncomeRange(criteria.maxFamilyIncome);
    if (userIncomeValue <= maxIncomeValue) metCriteria++;
  }

  if (criteria.minEduscore !== undefined) {
    totalCriteria++;
    if (userProfile.eduscore >= criteria.minEduscore) metCriteria++;
  }

  if (criteria.workExperience !== undefined) {
    totalCriteria++;
    if (userProfile.workExperience !== 'None' && userProfile.workExperience.trim()) metCriteria++;
  }

  if (criteria.awards !== undefined) {
    totalCriteria++;
    if (userProfile.awards !== 'None' && userProfile.awards.trim()) metCriteria++;
  }

  if (criteria.extracurriculars) {
    totalCriteria++;
    const userActivities = userProfile.extracurricularActivities.toLowerCase();
    const hasRequiredActivities = criteria.extracurriculars.some(activity => 
      userActivities.includes(activity.toLowerCase())
    );
    if (hasRequiredActivities) metCriteria++;
  }

  if (criteria.specialCircumstances) {
    totalCriteria++;
    const userCircumstances = userProfile.specialCircumstances?.toLowerCase() || '';
    const hasRequiredCircumstances = criteria.specialCircumstances.some(circumstance => 
      userCircumstances.includes(circumstance.toLowerCase())
    );
    if (hasRequiredCircumstances) metCriteria++;
  }

  return totalCriteria > 0 ? Math.round((metCriteria / totalCriteria) * 100) : 0;
}

export function matchScholarships(userProfile: UserProfile): ScholarshipMatchingResult {
  const fullyMatching: MatchResult[] = [];
  const partiallyMatching: MatchResult[] = [];

  for (const scholarship of mockScholarships) {
    if (!scholarship.isActive || scholarship.occupiedSlots >= scholarship.totalSlots) {
      continue; // Skip inactive or full scholarships
    }

    const { matches, missing } = checkCriteriaMatch(userProfile, scholarship.eligibilityCriteria);
    const matchPercentage = calculateMatchPercentage(userProfile, scholarship.eligibilityCriteria);

    const matchResult: MatchResult = {
      scholarship,
      matchType: matches ? 'fully_matching' : 'partially_matching',
      missingCriteria: missing,
      matchPercentage
    };

    if (matches) {
      fullyMatching.push(matchResult);
    } else if (matchPercentage >= 50) { // Only show partial matches with at least 50% compatibility
      partiallyMatching.push(matchResult);
    }
  }

  // Sort by match percentage (highest first)
  fullyMatching.sort((a, b) => b.matchPercentage - a.matchPercentage);
  partiallyMatching.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return {
    fullyMatching,
    partiallyMatching
  };
}

export function getScholarshipById(id: string): Scholarship | undefined {
  return mockScholarships.find(scholarship => scholarship.id === id);
}

export function getAllActiveScholarships(): Scholarship[] {
  return mockScholarships.filter(scholarship => 
    scholarship.isActive && scholarship.occupiedSlots < scholarship.totalSlots
  );
}