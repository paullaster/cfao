// app/calculator/components/CalculatorClient.tsx
'use client';

import { useState, useCallback } from 'react';
import {
    Card,
    CardContent,
    TextField,
    Select,
    MenuItem,
    Button,
    Grid,
    Typography,
    Paper as MuiPaper,
    Box,
    Chip,
    Divider,
    CircularProgress,
    Alert,
    Stack,
    InputLabel,
    FormControl,
    Tooltip,
    IconButton,
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LayersIcon from '@mui/icons-material/Layers';
import HistoryIcon from '@mui/icons-material/History';
import InfoIcon from '@mui/icons-material/Info';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { BSTApiClient } from '@/lib/api';
import type { Paper, CalculationResult } from '@/lib/types';

interface CalculatorClientProps {
    initialNotation: string;
    initialUnit: 'kPa' | 'psi' | 'kgf/cm2';
    initialResult: CalculationResult | null;
    papers: Paper[];
}

export default function CalculatorClient({
    initialNotation,
    initialUnit,
    initialResult,
    papers,
}: CalculatorClientProps) {
    const [notation, setNotation] = useState(initialNotation);
    const [unit, setUnit] = useState<'kPa' | 'psi' | 'kgf/cm2'>(initialUnit);
    const [result, setResult] = useState<CalculationResult | null>(initialResult);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<CalculationResult[]>(
        initialResult ? [initialResult] : []
    );

    const handleCalculate = useCallback(async () => {
        if (!notation.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const calculation = await BSTApiClient.calculateSingle(notation, unit);
            setResult(calculation);
            // Add to history if unique
            setHistory((prev) => {
                const exists = prev.some(
                    (p) => p.notation === calculation.notation && p.unit === calculation.unit
                );
                if (exists) return prev;
                return [calculation, ...prev.slice(0, 9)];
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Calculation failed');
            setResult(null);
        } finally {
            setLoading(false);
        }
    }, [notation, unit]);

    const handleCopyNotation = () => {
        navigator.clipboard.writeText(notation);
    };

    const handleExampleClick = (example: string) => {
        setNotation(example);
    };

    const clearHistory = () => {
        setHistory([]);
    };

    const examples = [
        '125K|127B|125K',
        '150WK|140C|150WK',
        '135TL|127B|135TL',
        '200K|175B|175K|140C|200K', // 5-ply
    ];

    return (
        <Grid container spacing={4}>
            {/* Input Column */}
            <Grid size={{ xs: 12, md: 5 }}>
                <Stack spacing={3}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CalculateIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Board Specification</Typography>
                            </Box>

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Enter the board composition code (notation) to calculate its theoretical burst strength.
                            </Typography>

                            <TextField
                                fullWidth
                                label="Board Notation"
                                value={notation}
                                onChange={(e) => setNotation(e.target.value)}
                                placeholder="e.g., 125K|127B|125K"
                                variant="outlined"
                                helperText="Format: [Grammage][Type]|[Grammage][Type]..."
                                InputProps={{
                                    sx: { fontFamily: 'monospace', fontSize: '1.1rem' }
                                }}
                            />

                            <Box sx={{ mt: 3, mb: 2 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                                    QUICK EXAMPLES
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {examples.map((example) => (
                                        <Chip
                                            key={example}
                                            label={example}
                                            size="small"
                                            onClick={() => handleExampleClick(example)}
                                            sx={{ 
                                                fontFamily: 'monospace',
                                                bgcolor: 'background.default',
                                                border: '1px solid transparent',
                                                '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' }
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Output Unit</InputLabel>
                                        <Select
                                            value={unit}
                                            label="Output Unit"
                                            onChange={(e) =>
                                                setUnit(e.target.value as 'kPa' | 'psi' | 'kgf/cm2')
                                            }
                                        >
                                            <MenuItem value="kPa">Kilopascals (kPa)</MenuItem>
                                            <MenuItem value="psi">PSI</MenuItem>
                                            <MenuItem value="kgf/cm2">kgf/cm²</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        onClick={handleCalculate}
                                        disabled={loading || !notation.trim()}
                                        startIcon={loading && <CircularProgress size={20} color="inherit" />}
                                        sx={{ height: 40 }}
                                    >
                                        {loading ? 'Calculating...' : 'Calculate'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Paper Reference Card (Compact) */}
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
                        <CardContent>
                             <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <InfoIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                Paper Code Reference
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {papers.slice(0, 8).map((paper) => (
                                    <Tooltip key={paper.type} title={`Burst Index: ${paper.burstIndex}`}>
                                        <Chip 
                                            label={paper.type} 
                                            size="small" 
                                            variant="outlined" 
                                            sx={{ bgcolor: 'background.paper' }} 
                                        />
                                    </Tooltip>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Stack>
            </Grid>

            {/* Results Column */}
            <Grid size={{ xs: 12, md: 7 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {result ? (
                    <Stack spacing={3}>
                        {/* Main Result Hero */}
                        <Card 
                            elevation={0}
                            sx={{ 
                                background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
                                color: 'white',
                                borderRadius: 3,
                                boxShadow: (theme) => theme.shadows[4]
                            }}
                        >
                            <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 1 }}>
                                    Total Burst Strength
                                </Typography>
                                <Typography variant="h1" sx={{ fontSize: { xs: '3rem', md: '4.5rem' }, fontWeight: 700 }}>
                                    {result.burstStrength.toFixed(0)}
                                    <Typography component="span" variant="h4" sx={{ opacity: 0.8, ml: 1 }}>
                                        {result.unit}
                                    </Typography>
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>
                                    Configuration: {result.notation}
                                </Typography>
                            </CardContent>
                        </Card>

                        {/* Layer Breakdown Visualizer */}
                        <Box>
                             <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <LayersIcon sx={{ mr: 1 }} color="action" />
                                Layer Composition
                            </Typography>
                            <Stack spacing={1} sx={{ mt: 2 }}>
                                {result.layers.map((layer, index) => {
                                    const resolvedPaper = layer.paper || papers.find(p => p.type === layer.type);
                                    return (
                                        <MuiPaper
                                            key={index}
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                borderLeft: '6px solid',
                                                borderLeftColor: layer.isLiner ? 'secondary.main' : 'grey.400',
                                                bgcolor: layer.isLiner ? 'background.paper' : 'grey.100',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                borderLeftWidth: 6, // Override outline
                                                transition: 'transform 0.2s',
                                                '&:hover': { transform: 'translateX(4px)' }
                                            }}
                                        >
                                            <Grid container alignItems="center">
                                                <Grid size={{ xs: 8 }}>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        {layer.grammage}{layer.type}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {resolvedPaper?.name || 'Unknown Paper Spec'} • {layer.isLiner ? 'Liner' : 'Fluting'}
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 4 }} sx={{ textAlign: 'right' }}>
                                                    {layer.isLiner ? (
                                                        <Box>
                                                            <Typography variant="h6" color="primary.main">
                                                                {layer.contribution.toFixed(0)}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {result.unit === 'kPa' ? 'kPa Contrib.' : `${result.unit} Contrib.`}
                                                            </Typography>
                                                        </Box>
                                                    ) : (
                                                        <Typography variant="body2" color="text.disabled" fontStyle="italic">
                                                            (Structural)
                                                        </Typography>
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </MuiPaper>
                                    );
                                })}
                            </Stack>
                        </Box>
                    </Stack>
                ) : (
                     <Box 
                        sx={{ 
                            height: '100%', 
                            minHeight: 400,
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'center', 
                            justifyContent: 'center',
                            bgcolor: 'background.default',
                            borderRadius: 4,
                            border: '2px dashed',
                            borderColor: 'divider'
                        }}
                    >
                        <CalculateIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            Ready to Calculate
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                            Enter a board notation on the left to see results.
                        </Typography>
                    </Box>
                )}

                {/* History Section */}
                {history.length > 0 && (
                    <Box sx={{ mt: 6 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                             <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                                <HistoryIcon sx={{ mr: 1 }} color="action" />
                                Recent Calculations
                            </Typography>
                            <Button size="small" onClick={clearHistory} startIcon={<DeleteOutlineIcon />}>
                                Clear
                            </Button>
                        </Box>
                        
                        <Grid container spacing={2}>
                            {history.slice(0, 6).map((item, index) => (
                                <Grid size={{ xs: 12, sm: 6 }} key={index}>
                                    <Card variant="outlined" sx={{ '&:hover': { borderColor: 'primary.main' } }}>
                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="subtitle2">{item.notation}</Typography>
                                                <Typography variant="subtitle2" color="primary.main">
                                                    {item.burstStrength.toFixed(0)} {item.unit}
                                                </Typography>
                                            </Box>
                                            <Typography variant="caption" color="text.secondary">
                                                {item.layers.length} layers • {new Date().toLocaleTimeString()}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </Grid>
        </Grid>
    );
}