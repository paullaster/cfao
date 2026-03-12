export type PaperType = 'K' | 'WK' | 'TK' | 'TL' | 'WTL' | 'BL' | 'B' | 'C' | 'E';

export interface Paper {
    id?: number;
    code: string;
    type?: PaperType; // Legacy support
    name: string;
    isLiner: boolean;
    burstIndex: number;
    rctFactor?: number;
    defaultGrammage: number;
    costPerTonne?: number;
    isRecycled?: number;
    co2PerKg?: number;
    color?: string;
}

export interface Layer {
    grammage: number;
    type: string; 
    typeCode?: string;
    paper?: Paper;
    isLiner: boolean;
    contribution: number;
    rctContribution?: number;
}

export interface BoxDimensions {
    length: number;
    width: number;
    height: number;
    thickness?: number;
}

export interface CalculationResult {
    notation: string;
    burstStrength: number;
    ect?: number; // kN/m
    bct?: number; // kN
    bct_kgf?: number; // kgf
    caliper?: number; // mm
    caliperFallback?: number; // mm
    totalGrammage?: number; // g/m2
    weight_g?: number;
    weight_kg?: number;
    unit: 'kPa' | 'psi' | 'kgf/cm2';
    layers: Layer[];
    timestamp: string;
    dimensions?: BoxDimensions;
}

export interface BatchCalculationResult {
    results: Array<{
        notation: string;
        burstStrength: number;
        ect?: number;
        unit: 'kPa' | 'psi' | 'kgf/cm2';
        success: boolean;
        error?: string;
    }>;
}

// Phase 3 & 4: Optimization Types
export interface OptimizationRequest {
    targetBCT: number;
    length: number;
    width: number;
    height: number;
    thickness?: number;
    safetyFactor?: number;
    sortBy?: 'cost' | 'co2';
    maxResults?: number;
    onlyRecycled?: boolean;
}

export interface OptimizationRecommendation {
    notation: string;
    technical: {
        bct: number;
        ect: number;
        caliper: number;
        weightKg: number;
    };
    financial: {
        costPerBox: number;
        costPer1000: number;
    };
    sustainability: {
        co2KgPerBox: number;
        recycledPercentage: number;
        isEcoFriendly: boolean;
    };
    savingsVsStandard?: number;
}

export interface OptimizationResult {
    searchCriteria: any;
    boxMetrics: {
        dimensions: BoxDimensions;
        blankAreaM2: number;
        standardReference?: string;
    };
    recommendations: OptimizationRecommendation[];
}

// Phase 5: Forensic Audit Types
export interface ForensicAuditRequest {
    notation: string;
    length: number;
    width: number;
    height: number;
    thickness?: number;
    relativeHumidity?: number;
    storageDays?: number;
    performedBy?: string;
}

export interface ForensicAuditResult {
    auditId: number;
    baselineBct: number;
    degradedBct: number;
    degradationFactor: number;
    unit: string;
    timestamp: string;
}

export interface AuditRecord {
    id: number;
    auditType: string;
    inputData: any;
    outputData: any;
    environmentalFactors: any;
    performedBy: string;
    createdAt: string;
}