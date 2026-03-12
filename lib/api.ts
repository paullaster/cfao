import { 
    Paper, 
    CalculationResult, 
    BatchCalculationResult, 
    BoxDimensions,
    OptimizationRequest,
    OptimizationResult,
    ForensicAuditRequest,
    ForensicAuditResult,
    AuditRecord
} from './types';

const API_BASE_URL = process.env.API_URL || 'http://localhost:3450';
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || 'boxmetric-secret-dev';


export class BSTApiClient {
    static async calculateSingle(
        notation: string,
        unit: 'kPa' | 'psi' | 'kgf/cm2' = 'kPa'
    ): Promise<CalculationResult> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/calculate`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-api-key': INTERNAL_API_KEY
                },
                body: JSON.stringify({ notation, unit }),
                cache: 'no-store' // Dynamic data
            });

            if (!response.ok) {
                const errorText = await response.text().catch(() => '');
                console.error(`[BSTApiClient] Server error on ${API_BASE_URL}: ${response.status} ${response.statusText}`, errorText);
                throw new Error(`API error: ${response.statusText || 'Internal Server Error'}`);
            }

            const data = await response.json();
            return {
                ...data,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error(`[BSTApiClient] Fetch failure on ${API_BASE_URL}:`, error);
            throw error;
        }
    }

    static async calculateBox(
        notation: string,
        dimensions: BoxDimensions,
        unit: 'kPa' | 'psi' | 'kgf/cm2' = 'kPa'
    ): Promise<CalculationResult> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/calculate-box`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-api-key': INTERNAL_API_KEY
                },
                body: JSON.stringify({ notation, ...dimensions, unit }),
                cache: 'no-store'
            });

            if (!response.ok) {
                const errorText = await response.text().catch(() => '');
                console.error(`[BSTApiClient] Server error on ${API_BASE_URL}: ${response.status} ${response.statusText}`, errorText);
                throw new Error(`API error: ${response.statusText || 'Internal Server Error'}`);
            }

            const data = await response.json();
            return {
                ...data,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error(`[BSTApiClient] Fetch failure on ${API_BASE_URL}:`, error);
            throw error;
        }
    }

    static async calculateBatch(
        notations: string[],
        unit: 'kPa' | 'psi' | 'kgf/cm2' = 'kPa'
    ): Promise<BatchCalculationResult> {
        const response = await fetch(`${API_BASE_URL}/api/batch-calculate`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-api-key': INTERNAL_API_KEY
            },
            body: JSON.stringify({ notations, unit }),
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        return response.json();
    }

    static async getPapers(search?: string, limit: number = 100): Promise<Paper[]> {
        const url = new URL(`${API_BASE_URL}/api/papers`);
        if (search) url.searchParams.append('search', search);
        url.searchParams.append('limit', String(limit));

        const response = await fetch(url.toString(), {
            headers: { 'x-api-key': INTERNAL_API_KEY },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        return response.json();
    }

    static async calculateRCT(type: string, grammage: number): Promise<{
        type: string;
        name: string;
        grammage: number;
        rctFactor: number;
        rct: number;
        unit: string;
    }> {
        const response = await fetch(`${API_BASE_URL}/api/calculate-rct`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-api-key': INTERNAL_API_KEY
            },
            body: JSON.stringify({ type, grammage }),
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        return response.json();
    }

    static async optimize(params: OptimizationRequest): Promise<OptimizationResult> {
        const response = await fetch(`${API_BASE_URL}/api/optimize`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-api-key': INTERNAL_API_KEY
            },
            body: JSON.stringify(params),
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        return response.json();
    }

    static async forensicAudit(params: ForensicAuditRequest): Promise<ForensicAuditResult> {
        const response = await fetch(`${API_BASE_URL}/api/forensic-audit`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-api-key': INTERNAL_API_KEY
            },
            body: JSON.stringify(params),
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        return response.json();
    }

    static async getAuditHistory(): Promise<AuditRecord[]> {
        const response = await fetch(`${API_BASE_URL}/api/audit-history`, {
            headers: { 'x-api-key': INTERNAL_API_KEY },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        return response.json();
    }

    static async downloadCertificate(params: {
        notation: string;
        length: number;
        width: number;
        height: number;
        auditId?: number;
    }): Promise<Blob> {
        const response = await fetch(`${API_BASE_URL}/api/generate-certificate`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-api-key': INTERNAL_API_KEY
            },
            body: JSON.stringify(params),
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        return response.blob();
    }
}