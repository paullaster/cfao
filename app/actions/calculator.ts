'use server';

import { BSTApiClient } from '@/lib/api';
import { 
    CalculationResult, 
    BoxDimensions, 
    OptimizationRequest, 
    OptimizationResult,
    ForensicAuditRequest,
    ForensicAuditResult
} from '@/lib/types';

export async function calculateSingleAction(
    notation: string,
    unit: 'kPa' | 'psi' | 'kgf/cm2' = 'kPa'
): Promise<CalculationResult> {
    return await BSTApiClient.calculateSingle(notation, unit);
}

export async function calculateBoxAction(
    notation: string,
    dimensions: BoxDimensions,
    unit: 'kPa' | 'psi' | 'kgf/cm2' = 'kPa'
): Promise<CalculationResult> {
    return await BSTApiClient.calculateBox(notation, dimensions, unit);
}

export async function calculateRCTAction(type: string, grammage: number) {
    return await BSTApiClient.calculateRCT(type, grammage);
}

export async function getPapersAction(search?: string, limit?: number) {
    return await BSTApiClient.getPapers(search, limit);
}

export async function calculateBatchAction(notations: string[], unit: 'kPa' | 'psi' | 'kgf/cm2' = 'kPa') {
    return await BSTApiClient.calculateBatch(notations, unit);
}

export async function optimizeAction(params: OptimizationRequest): Promise<OptimizationResult> {
    return await BSTApiClient.optimize(params);
}

export async function forensicAuditAction(params: ForensicAuditRequest): Promise<ForensicAuditResult> {
    return await BSTApiClient.forensicAudit(params);
}

export async function getAuditHistoryAction() {
    return await BSTApiClient.getAuditHistory();
}

export async function downloadCertificateAction(params: {
    notation: string;
    length: number;
    width: number;
    height: number;
    auditId?: number;
}) {
    const blob = await BSTApiClient.downloadCertificate(params);
    // Convert blob to base64 to pass through server action boundary
    const arrayBuffer = await blob.arrayBuffer();
    return Buffer.from(arrayBuffer).toString('base64');
}
