// app/optimize/components/OptimizeClient.tsx
'use client';

import { useState } from 'react';
import {
    Card,
    CardContent,
    TextField,
    Select,
    MenuItem,
    Button,
    Grid,
    Typography,
    Box,
    Chip,
    Divider,
    CircularProgress,
    Alert,
    Stack,
    InputLabel,
    FormControl,
    InputAdornment,
    FormControlLabel,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper as MuiPaper,
} from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import YardIcon from '@mui/icons-material/Yard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CloudIcon from '@mui/icons-material/Cloud';

import { optimizeAction } from '@/app/actions/calculator';
import type { Paper, OptimizationResult } from '@/lib/types';

interface OptimizeClientProps {
    papers: Paper[];
}

export default function OptimizeClient({ papers }: OptimizeClientProps) {
    const [targetBCT, setTargetBCT] = useState('400');
    const [length, setLength] = useState('300');
    const [width, setWidth] = useState('200');
    const [height, setHeight] = useState('200');
    const [safetyFactor, setSafetyFactor] = useState('1.2');
    const [sortBy, setSortBy] = useState<'cost' | 'co2'>('cost');
    const [onlyRecycled, setOnlyRecycled] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<OptimizationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleOptimize = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await optimizeAction({
                targetBCT: Number(targetBCT),
                length: Number(length),
                width: Number(width),
                height: Number(height),
                safetyFactor: Number(safetyFactor),
                sortBy,
                onlyRecycled,
                maxResults: 15
            });
            setResult(data);
        } catch (err: any) {
            setError(err.message || 'Optimization failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Grid container spacing={4}>
            {/* Input Column */}
            <Grid size={{ xs: 12, md: 4 }}>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <InsightsIcon sx={{ mr: 1, color: 'primary.main' }} /> Parameters
                        </Typography>
                        
                        <Stack spacing={3} sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                label="Target BCT (Baseline)"
                                type="number"
                                value={targetBCT}
                                onChange={(e) => setTargetBCT(e.target.value)}
                                slotProps={{ input: { endAdornment: <InputAdornment position="end">kgf</InputAdornment> } }}
                                helperText="Minimum stacking strength required"
                            />

                            <TextField
                                fullWidth
                                label="Safety Factor"
                                type="number"
                                value={safetyFactor}
                                onChange={(e) => setSafetyFactor(e.target.value)}
                                helperText="Multiplier for environmental safety"
                            />

                            <Divider>Dimensions (mm)</Divider>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 4 }}>
                                    <TextField fullWidth label="L" value={length} onChange={(e) => setLength(e.target.value)} size="small" />
                                </Grid>
                                <Grid size={{ xs: 4 }}>
                                    <TextField fullWidth label="W" value={width} onChange={(e) => setWidth(e.target.value)} size="small" />
                                </Grid>
                                <Grid size={{ xs: 4 }}>
                                    <TextField fullWidth label="H" value={height} onChange={(e) => setHeight(e.target.value)} size="small" />
                                </Grid>
                            </Grid>

                            <Divider>Preferences</Divider>

                            <FormControl fullWidth size="small">
                                <InputLabel>Optimize For</InputLabel>
                                <Select value={sortBy} label="Optimize For" onChange={(e) => setSortBy(e.target.value as any)}>
                                    <MenuItem value="cost">Minimum Cost ($)</MenuItem>
                                    <MenuItem value="co2">Minimum Carbon Footprint (CO2)</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControlLabel
                                control={<Switch checked={onlyRecycled} onChange={(e) => setOnlyRecycled(e.target.checked)} />}
                                label="Only use Recycled Materials"
                            />

                            <Button 
                                fullWidth 
                                variant="contained" 
                                size="large" 
                                onClick={handleOptimize}
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <InsightsIcon />}
                            >
                                {loading ? 'Solving...' : 'Run Optimizer'}
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>

            {/* Results Column */}
            <Grid size={{ xs: 12, md: 8 }}>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                {result ? (
                    <Stack spacing={3}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>Optimization Results</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Found {result.recommendations.length} viable combinations meeting {result.searchCriteria.requiredBCT}kgf target.
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="caption" display="block">Standard Reference</Typography>
                                <Typography variant="subtitle1" fontWeight="bold" color="primary">{result.boxMetrics.standardReference || '125K/127B/125K'}</Typography>
                            </Box>
                        </Box>

                        {/* Top Picks Summary Cards */}
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <MuiPaper 
                                    elevation={0} 
                                    sx={{ 
                                        p: 3, 
                                        borderRadius: 4, 
                                        bgcolor: 'primary.50', 
                                        border: '2px solid', 
                                        borderColor: 'primary.light',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <AttachMoneyIcon sx={{ position: 'absolute', right: -10, bottom: -10, fontSize: 100, opacity: 0.1, color: 'primary.main' }} />
                                    <Typography variant="overline" color="primary.main" fontWeight="bold">BEST VALUE PICK</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 900, my: 1 }}>{result.recommendations[0]?.notation}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Saves <strong>${result.recommendations[0]?.savingsVsStandard || '0.00'}</strong> per 1,000 units vs. standard.
                                    </Typography>
                                </MuiPaper>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <MuiPaper 
                                    elevation={0} 
                                    sx={{ 
                                        p: 3, 
                                        borderRadius: 4, 
                                        bgcolor: 'success.50', 
                                        border: '2px solid', 
                                        borderColor: 'success.light',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <YardIcon sx={{ position: 'absolute', right: -10, bottom: -10, fontSize: 100, opacity: 0.1, color: 'success.main' }} />
                                    <Typography variant="overline" color="success.main" fontWeight="bold">LOWEST CARBON</Typography>
                                    {(() => {
                                        const lowestCo2 = [...result.recommendations].sort((a, b) => a.sustainability.co2KgPerBox - b.sustainability.co2KgPerBox)[0];
                                        return (
                                            <>
                                                <Typography variant="h4" sx={{ fontWeight: 900, my: 1 }}>{lowestCo2?.notation}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Emits only <strong>{lowestCo2?.sustainability.co2KgPerBox.toFixed(3)}kg</strong> CO2e per box.
                                                </Typography>
                                            </>
                                        );
                                    })()}
                                </MuiPaper>
                            </Grid>
                        </Grid>

                        <TableContainer component={MuiPaper} variant="outlined" sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                            <Table>
                                <TableHead sx={{ bgcolor: 'grey.50' }}>
                                    <TableRow>
                                        <TableCell>Notation</TableCell>
                                        <TableCell align="right">Strength (kgf)</TableCell>
                                        <TableCell align="right">Weight (kg)</TableCell>
                                        <TableCell align="right">CO₂ (kg)</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Cost / 1k</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {result.recommendations.map((rec, idx) => (
                                        <TableRow key={idx} sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}>
                                            <TableCell component="th" scope="row">
                                                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                                                    {rec.notation}
                                                </Typography>
                                                <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5 }}>
                                                    {rec.sustainability.isEcoFriendly && (
                                                        <Chip icon={<YardIcon sx={{ fontSize: '12px !important' }} />} label="Eco" size="small" color="success" variant="outlined" sx={{ height: 18, fontSize: '10px' }} />
                                                    )}
                                                    {rec.sustainability.recycledPercentage > 80 && (
                                                        <Chip label={`${rec.sustainability.recycledPercentage}% Recycled`} size="small" variant="outlined" sx={{ height: 18, fontSize: '10px' }} />
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="body2" fontWeight="medium">{rec.technical.bct.toFixed(1)}</Typography>
                                                <Typography variant="caption" color="text.secondary">ECT: {rec.technical.ect}</Typography>
                                            </TableCell>
                                            <TableCell align="right">{rec.technical.weightKg.toFixed(3)}</TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                    {rec.sustainability.co2KgPerBox.toFixed(3)}
                                                    <CloudIcon sx={{ ml: 0.5, fontSize: 16, color: 'text.disabled' }} />
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="subtitle2" color="primary.main" fontWeight="bold">
                                                    ${rec.financial.costPer1000.toFixed(2)}
                                                </Typography>
                                                <Typography variant="caption">${rec.financial.costPerBox.toFixed(3)}/ea</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Alert icon={<AttachMoneyIcon />} severity="info">
                                    <strong>Cost Savings Tip:</strong> Switching from Virgin Kraft to Test Liner for the inner layer typically reduces cost by 12% while maintaining 85% of structural integrity.
                                </Alert>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Alert icon={<YardIcon />} severity="success">
                                    <strong>ESG Advantage:</strong> Combinations with over 70% recycled content reduce Scope 3 emissions by an average of 0.15kg CO2e per box.
                                </Alert>
                            </Grid>
                        </Grid>
                    </Stack>
                ) : (
                    <Box sx={{ height: '100%', minHeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', borderRadius: 4, border: '2px dashed', borderColor: 'divider' }}>
                        <InsightsIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">Optimizer Ready</Typography>
                        <Typography variant="body2" color="text.disabled" align="center" sx={{ maxWidth: 400 }}>
                            Adjust your target strength and dimensions, then click "Run Optimizer" to generate the most efficient material recipes.
                        </Typography>
                    </Box>
                )}
            </Grid>
        </Grid>
    );
}