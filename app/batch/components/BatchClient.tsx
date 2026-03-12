// app/batch/components/BatchClient.tsx
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
    CircularProgress,
    Alert,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper as MuiPaper,
    IconButton,
    Tooltip,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { calculateBatchAction } from '@/app/actions/calculator';

export default function BatchClient() {
    const [input, setInput] = useState('125K/127B/125K\n150K/127C/150K\n175K/127B/175K');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleProcess = async () => {
        setLoading(true);
        setError(null);
        
        const notations = input.split('\n').map(s => s.trim()).filter(s => s.length > 0);
        
        if (notations.length === 0) {
            setError('Please enter at least one notation');
            setLoading(false);
            return;
        }

        try {
            const data = await calculateBatchAction(notations);
            setResults(data.results);
        } catch (err: any) {
            setError(err.message || 'Batch processing failed');
        } finally {
            setLoading(false);
        }
    };

    const clearInput = () => setInput('');

    return (
        <Grid container spacing={4}>
            {/* Input Column */}
            <Grid size={{ xs: 12, md: 4 }}>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                                <ContentPasteIcon sx={{ mr: 1, color: 'primary.main' }} /> Input List
                            </Typography>
                            <Button size="small" onClick={clearInput} startIcon={<DeleteOutlineIcon />}>
                                Clear
                            </Button>
                        </Box>
                        
                        <TextField
                            fullWidth
                            multiline
                            rows={12}
                            variant="outlined"
                            placeholder="Enter board notations (one per line)..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            sx={{ '& textarea': { fontFamily: 'monospace', fontSize: '0.9rem' } }}
                        />
                        
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            Example: 125K/127B/125K
                        </Typography>

                        <Button 
                            fullWidth 
                            variant="contained" 
                            size="large" 
                            onClick={handleProcess}
                            disabled={loading}
                            sx={{ mt: 3 }}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <HistoryIcon />}
                        >
                            {loading ? 'Processing...' : 'Run Batch Analysis'}
                        </Button>
                    </CardContent>
                </Card>
            </Grid>

            {/* Results Column */}
            <Grid size={{ xs: 12, md: 8 }}>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                {results.length > 0 ? (
                    <TableContainer component={MuiPaper} variant="outlined" sx={{ borderRadius: 2 }}>
                        <Table>
                            <TableHead sx={{ bgcolor: 'grey.50' }}>
                                <TableRow>
                                    <TableCell width="40">Status</TableCell>
                                    <TableCell>Notation</TableCell>
                                    <TableCell align="right">BST (kPa)</TableCell>
                                    <TableCell align="right">ECT (kN/m)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {results.map((res, idx) => (
                                    <TableRow key={idx} sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}>
                                        <TableCell>
                                            {res.success ? (
                                                <Tooltip title="Valid Spec"><CheckCircleOutlineIcon color="success" fontSize="small" /></Tooltip>
                                            ) : (
                                                <Tooltip title={res.error}><ErrorOutlineIcon color="error" fontSize="small" /></Tooltip>
                                            )}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: res.success ? 'bold' : 'normal', color: res.success ? 'text.primary' : 'text.disabled' }}>
                                                {res.notation}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            {res.success ? res.burstStrength.toFixed(1) : '-'}
                                        </TableCell>
                                        <TableCell align="right">
                                            {res.success ? res.ect.toFixed(2) : '-'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Box sx={{ height: '100%', minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', borderRadius: 4, border: '2px dashed', borderColor: 'divider' }}>
                        <HistoryIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">Ready for Bulk Analysis</Typography>
                        <Typography variant="body2" color="text.disabled" align="center" sx={{ maxWidth: 400 }}>
                            Enter a list of board notations on the left to analyze multiple specifications simultaneously.
                        </Typography>
                    </Box>
                )}
            </Grid>
        </Grid>
    );
}
