'use client';

import { Card, CardContent, Box, Typography, Button, alpha } from '@mui/material';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ReactNode } from 'react';

interface FeatureCardProps {
    title: string;
    description: string;
    icon: ReactNode;
    href: string;
    color: string;
    cta: string;
}

export default function FeatureCard({ title, description, icon, href, color, cta }: FeatureCardProps) {
    return (
        <Card
            elevation={0}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid',
                borderColor: 'divider',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: (theme) => `0 12px 24px ${alpha(theme.palette.common.black, 0.1)}`,
                    borderColor: color,
                    '& .card-icon': {
                        transform: 'scale(1.1) rotate(-5deg)',
                        bgcolor: color,
                        color: 'white',
                    },
                    '& .card-cta': {
                        color: color,
                    }
                },
            }}
        >
            <CardContent sx={{ flexGrow: 1, p: 4, zIndex: 1 }}>
                <Box
                    className="card-icon"
                    sx={{
                        display: 'inline-flex',
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: (theme) => alpha(color, 0.1),
                        color: color,
                        fontSize: 40,
                        mb: 2,
                        transition: 'all 0.3s ease',
                    }}
                >
                    {icon}
                </Box>
                <Typography variant="h5" component="h3" gutterBottom fontWeight="700">
                    {title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                    {description}
                </Typography>
            </CardContent>
            
            <Box sx={{ p: 3, pt: 0, mt: 'auto' }}>
                <Link href={href} passHref style={{ textDecoration: 'none' }}>
                    <Button
                        className="card-cta"
                        variant="text"
                        endIcon={<ArrowForwardIcon />}
                        sx={{ 
                            fontWeight: 700,
                            color: 'text.primary',
                            transition: 'color 0.2s',
                            '&:hover': { bgcolor: 'transparent' }
                        }}
                    >
                        {cta}
                    </Button>
                </Link>
            </Box>
        </Card>
    );
}
