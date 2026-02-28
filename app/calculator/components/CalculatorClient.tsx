// app/calculator/components/CalculatorClient.tsx
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
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
    Tabs,
    Tab,
    InputAdornment,
    AlertTitle,
    IconButton,
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import LayersIcon from '@mui/icons-material/Layers';
import HistoryIcon from '@mui/icons-material/History';
import InfoIcon from '@mui/icons-material/Info';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Inventory2Icon from '@mui/icons-material/Inventory2'; // Box Icon
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import StraightenIcon from '@mui/icons-material/Straighten';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import { 
    calculateSingleAction, 
    calculateBoxAction, 
    calculateRCTAction 
} from '@/app/actions/calculator';
import type { Paper, CalculationResult } from '@/lib/types';

interface CalculatorClientProps {
    initialNotation: string;
    initialUnit: 'kPa' | 'psi' | 'kgf/cm2';
    initialResult: CalculationResult | null;
    papers: Paper[];
}

interface RCTLayer {
    type: string;
    grammage: string;
}

function SafeTimestamp({ timestamp }: { timestamp: string }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    try {
        return <>{new Date(timestamp).toLocaleTimeString()}</>;
    } catch (e) {
        return null;
    }
}

export default function CalculatorClient({
    initialNotation,
    initialUnit,
    initialResult,
    papers,
}: CalculatorClientProps) {
    const [mode, setMode] = useState<'bst' | 'rct' | 'ect' | 'box'>('bst');
    const [notation, setNotation] = useState(initialNotation);
    
    // Box Dimensions State
    const [length, setLength] = useState<string>('');
    const [width, setWidth] = useState<string>('');
    const [height, setHeight] = useState<string>('');
    const [thickness, setThickness] = useState<string>('');

    // Multi-layer RCT State
    const [rctLayers, setRctLayers] = useState<RCTLayer[]>([{ type: papers[0]?.type || 'K', grammage: '125' }]);
    const [multiRctResults, setMultiRctResults] = useState<any[]>([]);

    const [unit, setUnit] = useState<'kPa' | 'psi' | 'kgf/cm2'>(initialUnit);
    const [result, setResult] = useState<CalculationResult | null>(initialResult);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<CalculationResult[]>(
        initialResult ? [initialResult] : []
    );

    const examples = [
        '125K/127B/125K',
        '150WK|140C|150WK',
        '135TL/127B/135TL',
        '200K/175B/175K/140C/200K',
    ];

    const clearHistory = () => {
        setHistory([]);
    };

    // Helper to build notation from layers
    const buildNotationFromLayers = (layers: RCTLayer[]) => {
        return layers
            .filter(l => l.type && l.grammage)
            .map(l => `${l.grammage}${l.type}`)
            .join('/');
    };

    // Helper to parse layers from notation
    const parseLayersFromNotation = (notStr: string): RCTLayer[] | null => {
        try {
            const parts = notStr.split(/[|\/]/).filter(p => p.trim());
            if (parts.length === 0) return null;
            
            const newLayers: RCTLayer[] = parts.map(part => {
                const match = part.trim().match(/^(\d+)([a-zA-Z]+)$/);
                if (match) {
                    return { grammage: match[1], type: match[2].toUpperCase() };
                }
                throw new Error("Invalid format");
            });

            // Validate all types exist
            if (newLayers.every(l => papers.some(p => p.type === l.type))) {
                return newLayers;
            }
            return null;
        } catch (e) {
            return null;
        }
    };

    const handleAddRctLayer = () => {
        if (rctLayers.length >= 5) return;
        const newLayers = [...rctLayers, { type: papers[0]?.type || 'K', grammage: '125' }];
        setRctLayers(newLayers);
        setNotation(buildNotationFromLayers(newLayers));
    };

    const handleRemoveRctLayer = (index: number) => {
        const newLayers = [...rctLayers];
        newLayers.splice(index, 1);
        setRctLayers(newLayers);
        setNotation(buildNotationFromLayers(newLayers));
    };

    const handleRctLayerChange = (index: number, field: keyof RCTLayer, value: string) => {
        const newLayers = [...rctLayers];
        newLayers[index] = { ...newLayers[index], [field]: value };
        setRctLayers(newLayers);
        setNotation(buildNotationFromLayers(newLayers));
    };

    const handleCalculate = useCallback(async (overrideUnit?: typeof unit) => {
        const activeUnit = overrideUnit || unit;
        setLoading(true);
        setError(null);

        try {
            if (mode === 'rct') {
                const count = rctLayers.length;
                if (![1, 3, 5].includes(count)) {
                    throw new Error(`Invalid ply count: ${count}. Standard board tests require 1, 3, or 5 paper layers.`);
                }
                const results = await Promise.all(
                    rctLayers.map(l => calculateRCTAction(l.type, Number(l.grammage)))
                );
                setMultiRctResults(results);
                setResult(null);
            } else {
                if (!notation.trim()) throw new Error("Please enter a board notation.");
                
                let calculation: CalculationResult;
                if (mode === 'box') {
                    if (!length || !width || !height) {
                        throw new Error("Dimensions are required for Box calculation.");
                    }
                    calculation = await calculateBoxAction(notation, {
                        length: Number(length),
                        width: Number(width),
                        height: Number(height),
                        thickness: thickness ? Number(thickness) : undefined
                    }, activeUnit);
                } else {
                    calculation = await calculateSingleAction(notation, activeUnit);
                }

                setResult(calculation);
                setMultiRctResults([]); 
                setHistory((prev) => {
                    const exists = prev.some(p => p.notation === calculation.notation && p.unit === calculation.unit && p.bct === calculation.bct);
                    if (exists) return prev;
                    return [calculation, ...prev.slice(0, 9)];
                });
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
            setResult(null);
            setMultiRctResults([]);
        } finally {
            setLoading(false);
        }
    }, [notation, unit, mode, length, width, height, rctLayers]);

    // Handle unit change with immediate recalculation
    const handleUnitChange = (newUnit: typeof unit) => {
        setUnit(newUnit);
        if (result && (mode === 'bst' || mode === 'box')) {
            handleCalculate(newUnit);
        }
    };

    // Handle manual notation change
    const handleNotationChange = (val: string) => {
        setNotation(val);
        const parsed = parseLayersFromNotation(val);
        if (parsed) {
            setRctLayers(parsed);
        }
    };

    return (
        <Grid container spacing={4}>
            {/* Input Column */}
            <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={3}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <CardContent sx={{ p: 0 }}>
                            <Tabs 
                                value={mode} 
                                onChange={(_, v) => setMode(v)} 
                                variant="scrollable"
                                scrollButtons="auto"
                                sx={{ borderBottom: 1, borderColor: 'divider' }}
                            >
                                <Tab label="Board Strength" value="bst" icon={<LayersIcon />} iconPosition="start" />
                                <Tab label="RCT" value="rct" icon={<CalculateIcon />} iconPosition="start" />
                                <Tab label="ECT" value="ect" icon={<StraightenIcon />} iconPosition="start" />
                                <Tab label="Box Compression" value="box" icon={<Inventory2Icon />} iconPosition="start" />
                            </Tabs>

                            <Box sx={{ p: 3 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    {mode === 'bst' && "Calculate Burst Strength (BST) for paper or board notation."}
                                    {mode === 'rct' && "Calculate Ring Crush Test (RCT) for 1, 3, or 5 papers. Results will flow to other tabs."}
                                    {mode === 'ect' && "Calculate Edge Crush Test (ECT) for board notation."}
                                    {mode === 'box' && "Calculate full Box Compression Test (BCT) using McKee's formula."}
                                </Typography>

                                {mode === 'rct' ? (
                                    <Stack spacing={2}>
                                        {rctLayers.map((layer, idx) => (
                                            <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                <Typography variant="caption" sx={{ minWidth: 20, fontWeight: 'bold' }}>{idx + 1}.</Typography>
                                                <FormControl size="small" sx={{ flex: 2 }}>
                                                    <Select
                                                        value={layer.type}
                                                        onChange={(e) => handleRctLayerChange(idx, 'type', e.target.value)}
                                                    >
                                                        {papers.map((p) => (
                                                            <MenuItem key={p.type} value={p.type}>{p.type} - {p.name}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <TextField
                                                    size="small"
                                                    type="number"
                                                    label="Grammage"
                                                    value={layer.grammage}
                                                    onChange={(e) => handleRctLayerChange(idx, 'grammage', e.target.value)}
                                                    sx={{ flex: 1.5 }}
                                                />
                                                <IconButton 
                                                    size="small" 
                                                    color="error" 
                                                    onClick={() => handleRemoveRctLayer(idx)}
                                                    disabled={rctLayers.length <= 1}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        ))}
                                        <Button startIcon={<AddIcon />} size="small" onClick={handleAddRctLayer} disabled={rctLayers.length >= 5} sx={{ alignSelf: 'flex-start' }}>
                                            Add Paper Layer
                                        </Button>
                                        {[2, 4].includes(rctLayers.length) && (
                                            <Alert severity="warning" sx={{ py: 0 }}>
                                                Standard board tests require 1, 3, or 5 paper layers.
                                            </Alert>
                                        )}
                                    </Stack>
                                ) : (
                                    <Stack spacing={3}>
                                        <TextField
                                            fullWidth
                                            label="Board Notation"
                                            value={notation}
                                            onChange={(e) => handleNotationChange(e.target.value)}
                                            placeholder="e.g., 125K/127B/125K"
                                            variant="outlined"
                                            helperText='Use "/" or "|" to separate layers'
                                            InputProps={{ sx: { fontFamily: 'monospace', fontSize: '1.1rem' } }}
                                        />
                                        {mode === 'box' && (
                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 6 }}><TextField fullWidth label="Length" type="number" value={length} onChange={(e) => setLength(e.target.value)} size="small" slotProps={{ input: { endAdornment: <InputAdornment position="end">mm</InputAdornment> } }}/></Grid>
                                                <Grid size={{ xs: 6 }}><TextField fullWidth label="Width" type="number" value={width} onChange={(e) => setWidth(e.target.value)} size="small" slotProps={{ input: { endAdornment: <InputAdornment position="end">mm</InputAdornment> } }}/></Grid>
                                                <Grid size={{ xs: 6 }}><TextField fullWidth label="Height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} size="small" slotProps={{ input: { endAdornment: <InputAdornment position="end">mm</InputAdornment> } }}/></Grid>
                                                <Grid size={{ xs: 6 }}><TextField fullWidth label="Thickness" type="number" value={thickness} onChange={(e) => setThickness(e.target.value)} size="small" placeholder="Auto" slotProps={{ input: { endAdornment: <InputAdornment position="end">mm</InputAdornment> } }}/></Grid>
                                            </Grid>
                                        )}
                                    </Stack>
                                )}

                                {mode !== 'rct' && (
                                    <Box sx={{ mt: 3, mb: 2 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                                            <LightbulbIcon sx={{ fontSize: 14, mr: 0.5, color: 'warning.main' }} />TRY AN EXAMPLE
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {examples.map((example) => (
                                                <Chip key={example} label={example} size="small" onClick={() => handleNotationChange(example)} sx={{ fontFamily: 'monospace', bgcolor: 'background.default', border: '1px solid transparent', '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' } }} />
                                            ))}
                                        </Box>
                                    </Box>
                                )}

                                <Divider sx={{ my: 3 }} />

                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        {mode !== 'rct' && mode !== 'ect' ? (
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Output Unit (BST)</InputLabel>
                                                <Select value={unit} label="Output Unit (BST)" onChange={(e) => handleUnitChange(e.target.value as any)}>
                                                    <MenuItem value="kPa">Kilopascals (kPa)</MenuItem>
                                                    <MenuItem value="psi">PSI</MenuItem>
                                                    <MenuItem value="kgf/cm2">kgf/cm²</MenuItem>
                                                </Select>
                                            </FormControl>
                                        ) : (
                                            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                                <Typography variant="body2" color="text.secondary">Calculates <strong>{mode === 'rct' ? "Individual RCT" : "Board ECT"}</strong> in <strong>kN/m</strong></Typography>
                                            </Box>
                                        )}
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Button fullWidth variant="contained" size="large" onClick={() => handleCalculate()} disabled={loading || (mode !== 'rct' && !notation.trim())} startIcon={loading && <CircularProgress size={20} color="inherit" />} sx={{ height: 40 }}>
                                            {loading ? 'Calculating...' : 'Calculate'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </CardContent>
                    </Card>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', bgcolor: 'primary.50' }}>
                        <CardContent>
                             <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.dark' }}>
                                <HelpOutlineIcon fontSize="small" sx={{ mr: 1 }} />Input Format Guide
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {mode === 'rct' ? "RCT is tested per paper layer. Standard board types require 1, 3, or 5 paper layers." : <>Enter each layer as <strong>[Grammage][Type]</strong>. Separate with <strong>/</strong> or <strong>|</strong>.</>}
                            </Typography>
                            {mode !== 'rct' && <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>Example: 125K/127B/125K</Typography>}
                        </CardContent>
                    </Card>
                </Stack>
            </Grid>

            {/* Results Column */}
            <Grid size={{ xs: 12, md: 6 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 3, border: '1px solid', borderColor: 'error.light', borderRadius: 2 }} onClose={() => setError(null)}>
                        <AlertTitle sx={{ fontWeight: 700 }}>Something went wrong</AlertTitle>
                        <Typography variant="body2">{error}</Typography>
                    </Alert>
                )}

                {multiRctResults.length > 0 && (
                    <Stack spacing={2} sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}><CalculateIcon sx={{ mr: 1 }} color="warning" />Layer-by-Layer RCT Results</Typography>
                        <Grid container spacing={2}>
                            {multiRctResults.map((r, i) => (
                                <Grid size={{ xs: 12, sm: multiRctResults.length === 1 ? 12 : 6 }} key={i}>
                                    <MuiPaper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'warning.light', bgcolor: 'warning.50', borderRadius: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box><Typography variant="subtitle2" color="warning.dark">{r.grammage}g {r.type}</Typography><Typography variant="caption" color="text.secondary">{r.name}</Typography></Box>
                                            <Box sx={{ textAlign: 'right' }}><Typography variant="h5" fontWeight="bold" color="warning.dark">{r.rct?.toFixed(2)}</Typography><Typography variant="caption">{r.unit}</Typography></Box>
                                        </Box>
                                    </MuiPaper>
                                </Grid>
                            ))}
                        </Grid>
                        {multiRctResults.length > 1 && <Alert severity="success" icon={<StraightenIcon />}>Combined layers notation: <strong>{notation}</strong> is ready for ECT or Box calculation.</Alert>}
                    </Stack>
                )}

                {result ? (
                    <Stack spacing={3}>
                        <Grid container spacing={2}>
                            {mode === 'box' ? (
                                <>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Card elevation={0} sx={{ background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)', color: 'white', borderRadius: 3, height: '100%' }}>
                                            <CardContent sx={{ p: 2, textAlign: 'center' }}>
                                                <Typography variant="overline" sx={{ opacity: 0.8 }}>BST</Typography>
                                                <Typography variant="h4" sx={{ fontWeight: 700 }}>{result.burstStrength?.toFixed(2)}<Typography component="span" variant="caption" sx={{ opacity: 0.8, ml: 0.5 }}>{result.unit}</Typography></Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Card elevation={0} sx={{ background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)', color: 'white', borderRadius: 3, height: '100%' }}>
                                            <CardContent sx={{ p: 2, textAlign: 'center' }}>
                                                <Typography variant="overline" sx={{ opacity: 0.8 }}>ECT</Typography>
                                                <Typography variant="h4" sx={{ fontWeight: 700 }}>{result.ect?.toFixed(2)}<Typography component="span" variant="caption" sx={{ opacity: 0.8, ml: 0.5 }}>kN/m</Typography></Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Card elevation={0} sx={{ background: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)', color: 'white', borderRadius: 3, height: '100%' }}>
                                            <CardContent sx={{ p: 2, textAlign: 'center' }}>
                                                <Typography variant="overline" sx={{ opacity: 0.8 }}>BCT</Typography>
                                                <Typography variant="h4" sx={{ fontWeight: 700 }}>{result.bct_kgf?.toFixed(2)}<Typography component="span" variant="caption" sx={{ opacity: 0.8, ml: 0.5 }}>kgf</Typography></Typography>
                                                <Typography variant="caption" sx={{ opacity: 0.9 }}>{result.bct?.toFixed(2)} kN</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Card elevation={0} sx={{ background: 'linear-gradient(135deg, #607D8B 0%, #455A64 100%)', color: 'white', borderRadius: 3, height: '100%' }}>
                                            <CardContent sx={{ p: 2, textAlign: 'center' }}>
                                                <Typography variant="overline" sx={{ opacity: 0.8 }}>Box Weight</Typography>
                                                <Typography variant="h4" sx={{ fontWeight: 700 }}>{result.weight_kg?.toFixed(3)}<Typography component="span" variant="caption" sx={{ opacity: 0.8, ml: 0.5 }}>kg</Typography></Typography>
                                                <Typography variant="caption" sx={{ opacity: 0.9 }}>{result.weight_g?.toFixed(1)} g</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </>
                            ) : (
                                <>
                                    {(mode === 'bst') && (
                                        <Grid size={{ xs: 12, sm: result.ect ? 6 : 12 }}>
                                            <Card elevation={0} sx={{ background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)', color: 'white', borderRadius: 3, boxShadow: (theme) => theme.shadows[4], height: '100%' }}>
                                                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                                    <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 1 }}>Burst Strength (BST)</Typography>
                                                    <Typography variant="h3" sx={{ fontWeight: 700, my: 1 }}>{result.burstStrength?.toFixed(2)}<Typography component="span" variant="h6" sx={{ opacity: 0.8, ml: 1 }}>{result.unit}</Typography></Typography>
                                                    {result.ect && <Chip label={`ECT: ${result.ect?.toFixed(2)} kN/m`} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', mt: 1 }} />}
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    )}
                                    {mode === 'ect' && (
                                        <Grid size={{ xs: 12 }}>
                                            <Card elevation={0} sx={{ background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)', color: 'white', borderRadius: 3, boxShadow: (theme) => theme.shadows[4], height: '100%' }}>
                                                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                                    <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 1 }}>Edge Crush Test (ECT)</Typography>
                                                    <Typography variant="h3" sx={{ fontWeight: 700, my: 1 }}>{result.ect?.toFixed(2)}<Typography component="span" variant="h6" sx={{ opacity: 0.8, ml: 1 }}>kN/m</Typography></Typography>
                                                    <Typography variant="body1">Board Strength for: {result.notation}</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    )}
                                </>
                            )}
                        </Grid>
                        <Box>
                             <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}><LayersIcon sx={{ mr: 1 }} color="action" />Layer Composition</Typography>
                            <Stack spacing={1} sx={{ mt: 2 }}>
                                {result.layers?.map((layer, index) => {
                                    const resolvedPaper = layer.paper || papers.find(p => p.type === layer.type);
                                    return (
                                        <MuiPaper key={index} elevation={0} sx={{ p: 2, borderLeft: '6px solid', borderLeftColor: layer.isLiner ? 'secondary.main' : 'grey.400', bgcolor: layer.isLiner ? 'background.paper' : 'grey.100', border: '1px solid', borderColor: 'divider', borderLeftWidth: 6, transition: 'transform 0.2s', '&:hover': { transform: 'translateX(4px)' } }}>
                                            <Grid container alignItems="center">
                                                <Grid size={{ xs: 6 }}><Typography variant="subtitle1" fontWeight="bold">{layer.grammage}{layer.type}</Typography><Typography variant="body2" color="text.secondary">{resolvedPaper?.name || 'Unknown Spec'} • {layer.isLiner ? 'Liner' : 'Fluting'}</Typography></Grid>
                                                <Grid size={{ xs: 3 }} sx={{ textAlign: 'right' }}>{(mode === 'bst' || mode === 'box') && layer.isLiner && <Box><Typography variant="body2" fontWeight="bold">{layer.contribution?.toFixed(2)}</Typography><Typography variant="caption" color="text.secondary">BST Contrib.</Typography></Box>}</Grid>
                                                <Grid size={{ xs: 3 }} sx={{ textAlign: 'right' }}>{layer.rctContribution !== undefined && <Box><Typography variant="body2" fontWeight="bold" color="success.main">{layer.rctContribution?.toFixed(2)}</Typography><Typography variant="caption" color="text.secondary">RCT Contrib.</Typography></Box>}</Grid>
                                            </Grid>
                                        </MuiPaper>
                                    );
                                })}
                            </Stack>
                        </Box>
                        {result.caliper && (
                            <Alert severity="info" icon={<InfoIcon />}>
                                {thickness ? "Using User Caliper: " : "Theoretical Board Caliper: "}
                                <strong>{result.caliper?.toFixed(2)} mm</strong>
                                {thickness && result.caliperFallback && <Typography component="span" variant="caption" sx={{ ml: 1 }}>(Calculated was: {result.caliperFallback.toFixed(2)}mm)</Typography>}
                            </Alert>
                        )}
                    </Stack>
                ) : (
                     <Box sx={{ height: '100%', minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', borderRadius: 4, border: '2px dashed', borderColor: 'divider' }}>
                        {loading ? <CircularProgress sx={{ mb: 2 }} /> : <CalculateIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />}
                        <Typography variant="h6" color="text.secondary">{loading ? 'Processing...' : 'Ready to Calculate'}</Typography>
                        <Typography variant="body2" color="text.disabled">{mode === 'rct' ? "Configure 1, 3, or 5 paper layers on the left." : "Enter a notation on the left to see results."}</Typography>
                    </Box>
                )}
                {history.length > 0 && (
                    <Box sx={{ mt: 6 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                             <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}><HistoryIcon sx={{ mr: 1 }} color="action" />Recent Calculations</Typography>
                            <Button size="small" onClick={clearHistory} startIcon={<DeleteOutlineIcon />}>Clear</Button>
                        </Box>
                        <Grid container spacing={2}>
                            {history.slice(0, 6).map((item, index) => (
                                <Grid size={{ xs: 12, sm: 6 }} key={index}>
                                    <Card variant="outlined" sx={{ '&:hover': { borderColor: 'primary.main' } }}>
                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="subtitle2">{item.notation}</Typography>{item.bct ? <Typography variant="subtitle2" color="success.main">{item.bct_kgf?.toFixed(2)} kgf</Typography> : <Typography variant="subtitle2" color="primary.main">{item.burstStrength?.toFixed(2)} {item.unit}</Typography>}</Box>
                                            <Typography variant="caption" color="text.secondary">
                                                {item.ect && `ECT: ${item.ect?.toFixed(2)} kN/m`} 
                                                {item.weight_kg && ` • ${item.weight_kg.toFixed(2)}kg`}
                                                {item.caliper && ` • ${item.caliper.toFixed(1)}mm`}
                                                {` • `}<SafeTimestamp timestamp={item.timestamp} />
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