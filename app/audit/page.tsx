// app/audit/page.tsx
import AuditClient from './components/AuditClient';
import { Container, Typography, Box } from '@mui/material';
import { getAuditHistoryAction } from '@/app/actions/calculator';
import { AuditRecord } from '@/lib/types';

export default async function AuditPage() {
    let initialHistory: AuditRecord[] = [];
    try {
        initialHistory = await getAuditHistoryAction();
    } catch (err) {
        console.error('Failed to fetch audit history:', err);
    }

    return (
        <Container maxWidth="xl" className="py-8">
            <Box className="mb-8">
                <Typography variant="h4" component="h1" gutterBottom>
                    Forensic Structural Audit
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Analyze structural failure points by accounting for environmental degradation, humidity, and storage creep.
                </Typography>
            </Box>

            <AuditClient initialHistory={initialHistory} />
        </Container>
    );
}