// app/page.tsx
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Stack,
  Paper as MuiPaper,
} from '@mui/material';
import Link from 'next/link';
import CalculateIcon from '@mui/icons-material/Calculate';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BatchIcon from '@mui/icons-material/History';
import InsightsIcon from '@mui/icons-material/Insights';
import GavelIcon from '@mui/icons-material/Gavel';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { BSTApiClient } from '@/lib/api';
import type { Paper } from '@/lib/types';
import FeatureCard from '@/components/shared/FeatureCard';
import Box3D from '@/components/shared/Box3D';

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
      title: 'Structural Intelligence',
      description: 'Precision analysis for BST, ECT, and BCT with instant engineering validation.',
      icon: <CalculateIcon fontSize="inherit" />,
      href: '/calculator',
      color: '#1565C0',
      cta: 'Start Analysis',
    },
    {
      title: 'Cost & ESG Optimizer',
      description: 'AI-driven solver to find the lowest-cost and lowest-carbon material recipes.',
      icon: <InsightsIcon fontSize="inherit" />,
      href: '/optimize',
      color: '#00838F',
      cta: 'Optimize Now',
    },
    {
      title: 'Forensic Auditing',
      description: 'Post-failure analysis accounting for humidity, storage time, and creep decay.',
      icon: <GavelIcon fontSize="inherit" />,
      href: '/audit',
      color: '#C62828',
      cta: 'Run Audit',
    },
    {
      title: 'Material Database',
      description: 'Global catalog of paper grades, structural indices, and cost factors.',
      icon: <LibraryBooksIcon fontSize="inherit" />,
      href: '/papers',
      color: '#EF6C00',
      cta: 'Explore Data',
    },
    {
      title: 'Batch Processing',
      description: 'High-volume analysis for production runs and complex material catalogs.',
      icon: <BatchIcon fontSize="inherit" />,
      href: '/batch',
      color: '#2E7D32',
      cta: 'Bulk Process',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: { xs: 6, md: 10 },
          background: 'linear-gradient(135deg, #1A237E 0%, #0D47A1 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={3}>
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{ fontSize: { xs: '2.8rem', md: '4rem' }, fontWeight: 800, lineHeight: 1.1 }}
                >
                  Engineering <br />
                  <Box component="span" sx={{ color: '#64B5F6' }}>Intelligence</Box> for <br />
                  Packaging
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ color: 'white', maxWidth: 550, fontWeight: 400, lineHeight: 1.6 }}
                >
                  BoxMetric automates structural physics and material optimization. 
                  Design stronger boxes, reduce paper waste, and certify your carbon footprint.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
                  <Link href="/calculator" passHref>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ px: 4, py: 1.8, fontSize: '1.1rem', borderRadius: 2, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                    >
                      Analyze Spec
                    </Button>
                  </Link>
                  <Link href="/optimize" passHref>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{ 
                        px: 4, 
                        py: 1.8, 
                        fontSize: '1.1rem', 
                        borderRadius: 2, 
                        borderWidth: 2, 
                        color: 'white',
                        borderColor: 'white',
                        '&:hover': { 
                          borderWidth: 2, 
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.1)'
                        } 
                      }}
                    >
                      Cost Solver
                    </Button>
                  </Link>
                </Stack>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ position: 'relative', height: { xs: 300, md: 500 } }}>
                <Box3D dimensions={{ length: 300, width: 250, height: 250 }} />
                
                {/* Data overlays for "Effectiveness at a glance" */}
                <MuiPaper 
                  sx={{ 
                    position: 'absolute', 
                    top: '20%', 
                    right: '10%', 
                    p: 2, 
                    borderRadius: 3, 
                    bgcolor: 'rgba(255,255,255,0.9)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    display: { xs: 'none', lg: 'block' }
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', display: 'block' }}>BCT PREDICTION</Typography>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 900 }}>482.5 <Typography component="span" variant="body2">kgf</Typography></Typography>
                </MuiPaper>

                <MuiPaper 
                  sx={{ 
                    position: 'absolute', 
                    bottom: '20%', 
                    left: '10%', 
                    p: 2, 
                    borderRadius: 3, 
                    bgcolor: 'rgba(255,255,255,0.9)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    display: { xs: 'none', lg: 'block' }
                  }}
                >
                  <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold', display: 'block' }}>CARBON IMPACT</Typography>
                  <Typography variant="h4" color="success.main" sx={{ fontWeight: 900 }}>-12.4 <Typography component="span" variant="body2">% CO2e</Typography></Typography>
                </MuiPaper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 10 }}>
        {/* Value Prop Section */}
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold', letterSpacing: 2 }}>THE PLATFORM</Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, mt: 1 }}>Complete Material Intelligence</Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 12 }}>
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