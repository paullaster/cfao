// app/audit/components/AuditClient.tsx
'use client';

import { useState } from 'react';
import {
    Card,
    CardContent,
    TextField,
    Button,
    Grid,
    Typography,
    Box,
    Divider,
    CircularProgress,
    Alert,
    AlertTitle,
    Stack,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper as MuiPaper,
    Slider,
    Chip,
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import HistoryIcon from '@mui/icons-material/History';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

import { forensicAuditAction } from '@/app/actions/calculator';
import type { ForensicAuditResult, AuditRecord } from '@/lib/types';

interface AuditClientProps {
    initialHistory: AuditRecord[];
}

export default function AuditClient({ initialHistory }: AuditClientProps) {
    const [notation, setNotation] = useState('125K/127B/125K');
    const [length, setLength] = useState('300');
    const [width, setWidth] = useState('200');
    const [height, setHeight] = useState('200');
    const [humidity, setHumidity] = useState<number>(85);
    const [days, setDays] = useState<number>(30);
    const [performedBy, setPerformedBy] = useState('QA Auditor');

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ForensicAuditResult | null>(null);
    const [history, setHistory] = useState<AuditRecord[]>(initialHistory);
    const [error, setError] = useState<string | null>(null);

    const handleAudit = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await forensicAuditAction({
                notation,
                length: Number(length),
                width: Number(width),
                height: Number(height),
                relativeHumidity: humidity,
                storageDays: days,
                performedBy
            });
            setResult(data);
            
            // Refresh history (simplification - in real app we'd re-fetch)
            setHistory(prev => [{
                id: data.auditId,
                auditType: 'FORENSIC',
                inputData: { notation, humidity, days },
                outputData: data,
                environmentalFactors: { humidity, days },
                performedBy,
                createdAt: data.timestamp
            }, ...prev]);

        } catch (err: any) {
            setError(err.message || 'Audit failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Grid container spacing={4}>
            {/* Input Column */}
            <Grid size={{ xs: 12, md: 5 }}>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <GavelIcon sx={{ mr: 1, color: 'error.main' }} /> Investigation Input
                        </Typography>
                        
                        <Stack spacing={3} sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                label="Board Notation"
                                value={notation}
                                onChange={(e) => setNotation(e.target.value)}
                                placeholder="e.g., 125K/127B/125K"
                                helperText="The theoretical specification of the failed unit"
                            />

                            <Divider>Box Dimensions (mm)</Divider>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 4 }}><TextField fullWidth label="L" value={length} onChange={(e) => setLength(e.target.value)} size="small" /></Grid>
                                <Grid size={{ xs: 4 }}><TextField fullWidth label="W" value={width} onChange={(e) => setWidth(e.target.value)} size="small" /></Grid>
                                <Grid size={{ xs: 4 }}><TextField fullWidth label="H" value={height} onChange={(e) => setHeight(e.target.value)} size="small" /></Grid>
                            </Grid>

                            <Divider>Environmental Factors</Divider>
                            
                            <Box>
                                <Typography variant="body2" gutterBottom sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span><ThermostatIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} /> Relative Humidity</span>
                                    <strong>{humidity}%</strong>
                                </Typography>
                                <Slider
                                    value={humidity}
                                    onChange={(_, v) => setHumidity(v as number)}
                                    valueLabelDisplay="auto"
                                    min={30}
                                    max={100}
                                    color="error"
                                />
                                <Typography variant="caption" color="text.secondary">
                                    Strength significantly degrades above 65% RH.
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="body2" gutterBottom sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span><AccessTimeIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} /> Storage Duration</span>
                                    <strong>{days} Days</strong>
                                </Typography>
                                <Slider
                                    value={days}
                                    onChange={(_, v) => setDays(v as number)}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={180}
                                />
                                <Typography variant="caption" color="text.secondary">
                                    Long-term static loading leads to structural "creep".
                                </Typography>
                            </Box>

                            <TextField
                                fullWidth
                                label="Auditor Name / ID"
                                value={performedBy}
                                onChange={(e) => setPerformedBy(e.target.value)}
                                size="small"
                            />

                            <Button 
                                fullWidth 
                                variant="contained" 
                                color="error"
                                size="large" 
                                onClick={handleAudit}
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <GavelIcon />}
                            >
                                {loading ? 'Analyzing...' : 'Perform Forensic Audit'}
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>

            {/* Results Column */}
            <Grid size={{ xs: 12, md: 7 }}>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                {result ? (
                    <Stack spacing={3}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h5" sx={{ fontWeight: 800 }}>Audit Verdict</Typography>
                            <Chip label={`Audit ID: #${result.auditId}`} variant="outlined" size="small" />
                        </Box>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <MuiPaper 
                                    elevation={0} 
                                    sx={{ 
                                        p: 3, 
                                        borderRadius: 4, 
                                        border: '1px solid', 
                                        borderColor: 'divider',
                                        bgcolor: 'background.paper',
                                        textAlign: 'center'
                                    }}
                                >
                                    <Typography variant="caption" color="text.secondary" fontWeight="bold">RETAINED STRENGTH</Typography>
                                    <Typography variant="h2" sx={{ fontWeight: 900, color: result.degradationFactor > 0.7 ? 'success.main' : (result.degradationFactor > 0.5 ? 'warning.main' : 'error.main') }}>
                                        {(result.degradationFactor * 100).toFixed(1)}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">Compared to factory-new</Typography>
                                </MuiPaper>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <MuiPaper 
                                    elevation={0} 
                                    sx={{ 
                                        p: 3, 
                                        borderRadius: 4, 
                                        border: '1px solid', 
                                        borderColor: 'error.light', 
                                        bgcolor: 'error.50',
                                        textAlign: 'center'
                                    }}
                                >
                                    <Typography variant="caption" color="error.dark" fontWeight="bold">CRITICAL FAILURE LOAD</Typography>
                                    <Typography variant="h2" sx={{ fontWeight: 900, color: 'error.main' }}>
                                        {result.degradedBct.toFixed(1)}
                                    </Typography>
                                    <Typography variant="body2" color="error.dark">Max safe {result.unit}</Typography>
                                </MuiPaper>
                            </Grid>
                        </Grid>

                        <Alert 
                            severity={result.degradationFactor < 0.6 ? "error" : "warning"} 
                            icon={<ReportProblemIcon />}
                            sx={{ borderRadius: 3, p: 2 }}
                        >
                            <AlertTitle sx={{ fontWeight: 'bold' }}>Forensic Conclusion</AlertTitle>
                            The unit has lost <strong>{((1 - result.degradationFactor) * 100).toFixed(1)}%</strong> of its theoretical integrity. 
                            {result.degradationFactor < 0.6 
                                ? " Environmental exposure is the primary root cause of failure. The current material specification is insufficient for these storage conditions." 
                                : " While degradation is present, it may not be the sole cause of failure if the load was within limits."}
                        </Alert>

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <HistoryIcon sx={{ mr: 1 }} /> Investigation Ledger
                            </Typography>
                            <TableContainer component={MuiPaper} variant="outlined" sx={{ borderRadius: 3 }}>
                                <Table size="small">
                                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Auditor</TableCell>
                                            <TableCell>Notation</TableCell>
                                            <TableCell align="right">Result</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {history.map((record) => (
                                            <TableRow key={record.id}>
                                                <TableCell sx={{ fontSize: '0.75rem' }}>{new Date(record.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell sx={{ fontSize: '0.75rem' }}>{record.performedBy}</TableCell>
                                                <TableCell sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{record.inputData.notation}</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                                                    {record.outputData.degradedBct?.toFixed(1)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Stack>
                ) : (
                    <Box sx={{ height: '100%', minHeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', borderRadius: 4, border: '2px dashed', borderColor: 'divider' }}>
                        <GavelIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">Awaiting Forensic Data</Typography>
                        <Typography variant="body2" color="text.disabled" align="center" sx={{ maxWidth: 400 }}>
                            Input the box specifications and the reported environmental conditions to determine the theoretical strength at point of failure.
                        </Typography>
                    </Box>
                )}
            </Grid>
        </Grid>
    );
}