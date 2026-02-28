// app/calculator/page.tsx
import CalculatorClient from './components/CalculatorClient';
import { BSTApiClient } from '@/lib/api';
import { Container, Typography, Box, Alert } from '@mui/material';
import type { Paper } from '@/lib/types';

interface CalculatorPageProps {
    searchParams: Promise<{
        notation?: string;
        unit?: 'kPa' | 'psi' | 'kgf/cm2';
    }>;
}

export default async function CalculatorPage({
    searchParams,
}: CalculatorPageProps) {
    // Parse search params on server
    const params = await searchParams;
    const initialNotation = params.notation || '125K|127B|125K';
    const initialUnit = params.unit || 'kPa';

    let initialResult = null;
    let error = null;

    // Fetch initial data on server if notation is provided
    if (initialNotation) {
        try {
            initialResult = await BSTApiClient.calculateSingle(
                initialNotation,
                initialUnit
            );
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to calculate';
            console.error('Calculation error:', err);
        }
    }

    // Also fetch papers for the form
    let papers: Paper[] = [];
    try {
        papers = await BSTApiClient.getPapers();
    } catch (err) {
        console.error('Failed to fetch papers:', err);
    }

    return (
        <Container maxWidth="xl" className="py-8">
            <Box className="mb-8">
                <Typography variant="h4" component="h1" gutterBottom>
                    BST Calculator
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Enter board notation to calculate Burst Strength
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" className="mb-4">
                    {error}
                </Alert>
            )}

            {/* Pass all data as props to client component */}
            <CalculatorClient
                initialNotation={initialNotation}
                initialUnit={initialUnit}
                initialResult={initialResult}
                papers={papers}
            />
        </Container>
    );
}