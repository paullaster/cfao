// app/page.tsx
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
  Paper as MuiPaper,
  Chip,
} from '@mui/material';
import Link from 'next/link';
import CalculateIcon from '@mui/icons-material/Calculate';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BatchIcon from '@mui/icons-material/History';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ScienceIcon from '@mui/icons-material/Science';
import { BSTApiClient } from '@/lib/api';
import type { Paper } from '@/lib/types';
import FeatureCard from '@/components/shared/FeatureCard';

export default async function HomePage() {
  // Fetch papers on the server for initial data
  let papers: Paper[] = [];
  try {
    papers = await BSTApiClient.getPapers();
  } catch (error) {
    console.error('Failed to fetch papers:', error);
  }

  const features = [
    {
      title: 'Single Calculation',
      description: 'Precision analysis for individual board specs with instant validation.',
      icon: <CalculateIcon fontSize="inherit" />,
      href: '/calculator',
      color: '#1565C0', // Industrial Blue
      cta: 'Start Calculating',
    },
    {
      title: 'Paper Database',
      description: 'Access the global catalog of paper grades and burst strength indices.',
      icon: <LibraryBooksIcon fontSize="inherit" />,
      href: '/papers',
      color: '#EF6C00', // Safety Orange
      cta: 'Browse Database',
    },
    {
      title: 'Batch Processing',
      description: 'Optimized workflow for high-volume manufacturing specifications.',
      icon: <BatchIcon fontSize="inherit" />,
      href: '/batch',
      color: '#2E7D32', // Success Green
      cta: 'Process Batch',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Abstract shapes for visual interest */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.05)',
            zIndex: 0,
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography
                variant="h1"
                component="h1"
                sx={{ mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}
              >
                Precision Corrugated <br /> BST Calculator
              </Typography>
              <Typography
                variant="h5"
                sx={{ mb: 4, opacity: 0.9, maxWidth: 600, fontWeight: 400 }}
              >
                The industry standard for calculating Burst Strength. Optimized for
                manufacturing efficiency and quality control.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Link href="/calculator" passHref>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                  >
                    Calculate Now
                  </Button>
                </Link>
                <Link href="/papers" passHref>
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="large"
                    sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderColor: 'rgba(255,255,255,0.5)' }}
                  >
                    View Database
                  </Button>
                </Link>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ScienceIcon sx={{ fontSize: 200, opacity: 0.2, color: 'white' }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Features Grid */}
        <Typography variant="h3" component="h2" align="center" sx={{ mb: 6 }}>
          Powerful Tools for Manufacturing
        </Typography>

        <Grid container spacing={4} sx={{ mb: 10 }}>
          {features.map((feature) => (
            <Grid size={{ xs: 12, md: 4 }} key={feature.title}>
              <FeatureCard {...feature} />
            </Grid>
          ))}
        </Grid>

        {/* Paper Database Preview */}
        <MuiPaper
          elevation={0}
          sx={{
            p: { xs: 3, md: 6 },
            bgcolor: 'grey.50',
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" gutterBottom>
                Material Specs
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Latest updates from the paper database ({papers.length} types available)
              </Typography>
            </Box>
            <Link href="/papers" passHref>
              <Button variant="outlined" endIcon={<ArrowForwardIcon />}>
                Full Database
              </Button>
            </Link>
          </Box>

          <Grid container spacing={2}>
            {papers.slice(0, 8).map((paper) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={paper.type}>
                <MuiPaper
                  variant="outlined"
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    bgcolor: 'background.paper',
                    '&:hover': { borderColor: 'primary.main' },
                    cursor: 'default',
                  }}
                >
                  <Typography variant="h6" color="primary.main" fontWeight="bold">
                    {paper.type}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Burst Index
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {paper.burstIndex}
                  </Typography>
                </MuiPaper>
              </Grid>
            ))}
          </Grid>
        </MuiPaper>
      </Container>
    </Box>
  );
}