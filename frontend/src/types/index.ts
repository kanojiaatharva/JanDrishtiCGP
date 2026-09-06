export interface User {
    id: number;
    email: string;
    name: string;
    role: 'CITIZEN' | 'OFFICER';
    phone: string;
    preferredLanguage: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface Report {
    id: number;
    reportCode: string;
    originalText: string;
    category: string;
    subcategory?: string;
    ward?: string;
    district?: string;
    urgency?: number;
    aiConfidence?: number;
    status: string;
    createdAt: string;
}

export interface DemandCluster {
    id: number;
    category: string;
    subcategory?: string;
    ward: string;
    district: string;
    latitude?: number;
    longitude?: number;
    reportCount: number;
    demandScore: number;
    priorityScore: number;
    growthRate: number;
    serviceGapScore: number;
    populationImpactScore?: number;
    urgencyScore: number;
    summary: string;
    recommendedActions?: string;
    createdAt?: string;
}

export interface Notification {
    id: number;
    userId: number;
    reportId?: number;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: string;
}
