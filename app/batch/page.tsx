// app/batch/page.tsx
import { Container, Typography, Box, Breadcrumbs, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import BatchClient from './components/BatchClient';

export const metadata = {
    title: 'Batch Processing | BoxMetric',
    description: 'High-volume structural integrity analysis for multiple board specifications.',
};

export default function BatchPage() {
    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 2 }}>
                    <Link href="/" passHref legacyBehavior>
                        <MuiLink underline="hover" color="inherit">
                            Home
                        </MuiLink>
                    </Link>
                    <Typography color="text.primary">Batch Processing</Typography>
                </Breadcrumbs>
                
                <Typography variant="h3" component="h1" gutterBottom>
                    Batch Processing
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800 }}>
                    Upload or paste multiple board specifications to perform bulk structural analysis. 
                    Ideal for verifying entire production runs or comparing complex material catalogs.
                </Typography>
            </Box>

            <BatchClient />
        </Container>
    );
}
