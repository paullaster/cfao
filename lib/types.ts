export type PaperType = 'K' | 'WK' | 'TK' | 'TL' | 'WTL' | 'B' | 'C' | 'E';

export interface Paper {
    type: PaperType;
    name: string;
    burstIndex: number;
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
}

export interface CalculationResult {
    notation: string;
    burstStrength: number;
    unit: 'kPa' | 'psi' | 'kgf/cm2';
    layers: Layer[];
    timestamp: string;
}

export interface BatchCalculationRequest {
    notations: string[];
    unit?: 'kPa' | 'psi' | 'kgf/cm2';
}

export interface BatchCalculationResult {
    results: Array<{
        notation: string;
        burstStrength: number;
        unit: 'kPa' | 'psi' | 'kgf/cm2';
        success: boolean;
        error?: string;
    }>;
}