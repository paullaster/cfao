export type PaperType = 'K' | 'WK' | 'TK' | 'TL' | 'WTL' | 'BL' | 'B' | 'C' | 'E';

export interface Paper {
    type: PaperType;
    name: string;
    burstIndex: number;
    rctFactor?: number;
    defaultGrammage: number;
    color?: string;
}

export interface Layer {
    grammage: number;
    type: PaperType; // API uses 'type'
    typeCode?: PaperType; // Keeping for compatibility if needed
    paper?: Paper; // API might not return this
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

export interface BatchCalculationRequest {
    notations: string[];
    unit?: 'kPa' | 'psi' | 'kgf/cm2';
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