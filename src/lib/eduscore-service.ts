'use client';

import { getSampleEduscoreData, hasSampleEduscoreData } from './sample-eduscore-data';

export interface EduscoreData {
  score: number;
  reasoning: string;
  surveyData: {
    major: string;
    majorSpecialization?: string;
    technicalSkills: string;
    programmingLanguages?: string;
    certifications: string;
    languageSkills: string;
    workExperience: string;
    currentYear: string;
    university: string;
    academicInfoGPA: number;
    extracurricularActivities: string;
    awards: string;
    familyIncome: string;
    dependents: number;
    valuableAssets: string;
    medicalExpenses: string;
    specialCircumstances: string;
    aspirations: string;
    careerGoals: string;
  };
  completedAt: Date;
}

export class EduscoreService {
  private static readonly STORAGE_KEY = 'eduscoreData';
  private static readonly SURVEY_KEY = 'surveyData';
  private static readonly RESULT_KEY = 'eduscoreResult';

  static saveEduscoreData(data: EduscoreData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        ...data,
        completedAt: data.completedAt.toISOString()
      }));
    } catch (error) {
      console.error('Lưu dữ liệu EduScore không thành công!:', error);
    }
  }

  static getEduscoreData(userEmail?: string): EduscoreData | null {
    try {
      // Check for sample data first if userEmail is provided
      if (userEmail && hasSampleEduscoreData(userEmail)) {
        const sampleData = getSampleEduscoreData(userEmail);
        if (sampleData) {
          return {
            score: sampleData.score,
            reasoning: sampleData.reasoning,
            surveyData: {
              ...sampleData.surveyData,
              certifications: sampleData.surveyData.certifications || '',
              languageSkills: sampleData.surveyData.languageSkills || '',
              workExperience: sampleData.surveyData.workExperience || '',
              extracurricularActivities: sampleData.surveyData.extracurricularActivities || '',
              awards: sampleData.surveyData.awards || '',
              valuableAssets: sampleData.surveyData.valuableAssets || '',
              medicalExpenses: sampleData.surveyData.medicalExpenses || '',
              specialCircumstances: sampleData.surveyData.specialCircumstances || '',
              aspirations: sampleData.surveyData.aspirations || '',
              careerGoals: sampleData.surveyData.careerGoals || ''
            },
            completedAt: sampleData.createdAt
          };
        }
      }
      
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      return {
        ...parsed,
        completedAt: new Date(parsed.completedAt)
      };
    } catch (error) {
      console.error('Failed to get EduScore data:', error);
      return null;
    }
  }

  static hasValidEduscore(userEmail?: string): boolean {
    const data = this.getEduscoreData(userEmail);
    if (!data) return false;
    
    // Sample data is always considered valid
    if (userEmail && hasSampleEduscoreData(userEmail)) {
      return true;
    }
    
    // Check if data is not older than 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    return data.completedAt > sixMonthsAgo;
  }

  static getEduscoreForRecommendations(userEmail?: string): { score: number; major: string; familyIncome: string } | null {
    const data = this.getEduscoreData(userEmail);
    if (!data || !this.hasValidEduscore(userEmail)) return null;
    
    return {
      score: data.score,
      major: data.surveyData.major,
      familyIncome: data.surveyData.familyIncome
    };
  }

  static clearEduscoreData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.SURVEY_KEY);
      localStorage.removeItem(this.RESULT_KEY);
    } catch (error) {
      console.error('Failed to clear EduScore data:', error);
    }
  }

  // Legacy support for existing localStorage items
  static migrateLegacyData(): EduscoreData | null {
    try {
      const surveyData = localStorage.getItem(this.SURVEY_KEY);
      const resultData = localStorage.getItem(this.RESULT_KEY);
      
      if (surveyData && resultData) {
        const parsedSurvey = JSON.parse(surveyData);
        const parsedResult = JSON.parse(resultData);
        
        const eduscoreData: EduscoreData = {
          score: parsedResult.eduscore || 0,
          reasoning: parsedResult.reasoning || '',
          surveyData: parsedSurvey,
          completedAt: new Date()
        };
        
        this.saveEduscoreData(eduscoreData);
        return eduscoreData;
      }
    } catch (error) {
      console.error('Failed to migrate legacy data:', error);
    }
    
    return null;
  }

  static getRecommendationContext(userEmail?: string): RecommendationContext | null {
    let data = this.getEduscoreData(userEmail);
    
    // Try to migrate legacy data if no new data exists (but not for demo accounts)
    if (!data && (!userEmail || !hasSampleEduscoreData(userEmail))) {
      data = this.migrateLegacyData();
    }
    
    if (!data || !this.hasValidEduscore(userEmail)) return null;
    
    return {
      eduscore: data.score,
      major: data.surveyData.major,
      currentYear: data.surveyData.currentYear,
      familyIncome: data.surveyData.familyIncome,
      technicalSkills: data.surveyData.technicalSkills.split(',').map(s => s.trim()),
      languageSkills: data.surveyData.languageSkills || '',
      workExperience: data.surveyData.workExperience || '',
      careerGoals: data.surveyData.careerGoals || ''
    };
  }
}

export interface RecommendationContext {
  eduscore: number;
  major: string;
  currentYear: string;
  familyIncome: string;
  technicalSkills: string[];
  languageSkills: string;
  workExperience: string;
  careerGoals: string;
}

// Hook for React components
export function useEduscore() {
  const getEduscoreData = (userEmail?: string) => EduscoreService.getEduscoreData(userEmail);
  const hasValidEduscore = (userEmail?: string) => EduscoreService.hasValidEduscore(userEmail);
  const getRecommendationContext = (userEmail?: string) => EduscoreService.getRecommendationContext(userEmail);
  
  return {
    getEduscoreData,
    hasValidEduscore,
    getRecommendationContext,
    clearData: EduscoreService.clearEduscoreData
  };
}