// app/papers/page.tsx
import PapersClient from './components/PapersClient';
import { BSTApiClient } from '@/lib/api';
import { Container, Typography, Box } from '@mui/material';
import type { Paper } from '@/lib/types';

export default async function PapersPage() {
    // Fetch papers data on the server
    let papers: Paper[] = [];
    let error = null;

    try {
        papers = await BSTApiClient.getPapers();
    } catch (err) {
        error = err instanceof Error ? err.message : 'Failed to load papers';
        console.error('Failed to fetch papers:', err);
    }

    return (
        <Container maxWidth="xl" className="py-8">
            <Box className="mb-8">
                <Typography variant="h4" component="h1" gutterBottom>
                    Paper Types Database
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Browse all paper types with their burst indices and properties
                </Typography>
            </Box>

            {/* Pass fetched data to client component */}
            <PapersClient initialPapers={papers} initialError={error} />
        </Container>
    );
}