'use client';

import { Box, Container, Typography, Link as MuiLink, Grid } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                py: 6,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                borderTop: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid size={{xs: 12, sm: 4}}>
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            BoxMetric Performance Suite
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Professional tool for calculating Burst Strength (BST), Ring Crush Test (RCT), Edge Crush Test (ECT), Box Compression Test (BCT), and Weight of corrugated packaging. Designed for precision and efficiency in manufacturing.
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            Resources
                        </Typography>
                        <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                            <Box component="li" sx={{ mb: 1 }}>
                                <MuiLink href="/calculator" color="text.secondary" underline="hover">
                                    Calculator Tool
                                </MuiLink>
                            </Box>
                            <Box component="li" sx={{ mb: 1 }}>
                                <MuiLink href="/papers" color="text.secondary" underline="hover">
                                    Paper Database
                                </MuiLink>
                            </Box>
                            <Box component="li">
                                <MuiLink href="#" color="text.secondary" underline="hover">
                                    Standards (ISO 2759)
                                </MuiLink>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            Legal
                        </Typography>
                        <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                            <Box component="li" sx={{ mb: 1 }}>
                                <MuiLink 
                                    href="https://docs.google.com/document/d/e/2PACX-1vQuKTfNbSxt7mB36Y1gSr6KsaU_DbnGt-Woyb-9p4SXD4cmFi1K3er_2vahMOjBXTHpSL17Q4Yi8gvw/pub" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    color="text.secondary" 
                                    underline="hover"
                                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                                >
                                    Privacy Policy
                                    <OpenInNewIcon sx={{ fontSize: 14 }} />
                                </MuiLink>
                            </Box>
                            <Box component="li">
                                <MuiLink 
                                    href="https://docs.google.com/document/d/e/2PACX-1vSY4C71LNiVJI_O4goBPdFBpoc2ZrC8WKsTFWzoNIcu-8YFePUqgPpG-1illa5EkRAzXNdVEhLsWj9V/pub" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    color="text.secondary" 
                                    underline="hover"
                                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                                >
                                    Terms of Service
                                    <OpenInNewIcon sx={{ fontSize: 14 }} />
                                </MuiLink>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 5 }}>
                    <Typography variant="body2" color="text.secondary" align="center">
                        {'Copyright © '}
                        <MuiLink color="inherit" href="https://www.linkedin.com/in/paullaster/">
                            BrainSpore
                        </MuiLink>{' '}
                        {new Date().getFullYear()}
                        {'.'}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}