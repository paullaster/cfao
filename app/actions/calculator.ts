'use server';

import { BSTApiClient } from '@/lib/api';
import { CalculationResult, BoxDimensions } from '@/lib/types';

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
