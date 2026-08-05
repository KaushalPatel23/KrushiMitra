export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AnalysisCreateDto {
  imageUrl: string;
  cropName: string;
  healthStatus: string;
  disease?: string;
  confidence: number;
  fertilizer?: string;
  pesticide?: string;
  recommendation?: string;
}

export interface UserProfileDto {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CropAnalysisDto {
  id: string;
  imageUrl: string;
  cropName: string;
  healthStatus: string;
  disease?: string;
  confidence: number;
  fertilizer?: string;
  pesticide?: string;
  recommendation?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface ReportDto {
  id: string;
  analysisId: string;
  reportUrl: string;
  createdAt: string;
}
