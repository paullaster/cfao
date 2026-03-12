// app/optimize/page.tsx
import OptimizeClient from './components/OptimizeClient';
import { BSTApiClient } from '@/lib/api';
import { Container, Typography, Box } from '@mui/material';
import type { Paper } from '@/lib/types';

export default async function OptimizePage() {
    // Fetch papers for the client component if needed
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
                    Material Cost Optimizer
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Find the most cost-effective paper combinations that meet your target BCT strength and sustainability goals.
                </Typography>
            </Box>

            <OptimizeClient papers={papers} />
        </Container>
    );
}