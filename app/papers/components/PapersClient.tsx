'use client';

import { useState } from 'react';
import { Paper as MuiPaper, Box, TextField, InputAdornment, Alert, Chip, Card, CardContent, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import type { Paper } from '@/lib/types';

interface PapersClientProps {
    initialPapers: Paper[];
    initialError: string | null;
}

export default function PapersClient({ initialPapers, initialError }: PapersClientProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const columns: GridColDef[] = [
        { 
            field: 'code', 
            headerName: 'Paper Code', 
            width: 120,
            renderCell: (params) => (
                <Chip label={params.value} size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />
            )
        },
        { field: 'name', headerName: 'Description', flex: 1, minWidth: 150 },
        { 
            field: 'burstIndex', 
            headerName: 'Burst Index', 
            type: 'number', 
            width: 130,
            align: 'right',
            headerAlign: 'right',
        },
        { 
            field: 'rctFactor', 
            headerName: 'RCT Factor', 
            type: 'number', 
            width: 130,
            align: 'right',
            headerAlign: 'right',
            valueGetter: (value) => value || 1.0
        },
        {
            field: 'defaultGrammage',
            headerName: 'Std. Grammage',
            type: 'number',
            width: 140,
            align: 'right',
            headerAlign: 'right',
            valueFormatter: (value) => `${value} g/m²`
        },
        {
            field: 'defaultRCT',
            headerName: 'Std. RCT (kN/m)',
            type: 'number',
            width: 160,
            align: 'right',
            headerAlign: 'right',
            valueGetter: (_, row) => {
                const rctFactor = row.rctFactor || 1.0;
                const grammage = row.defaultGrammage || 125;
                return Number(((grammage / 100) * rctFactor).toFixed(3));
            },
            renderCell: (params) => (
                <Typography variant="body2" fontWeight="bold" color="primary.main">
                    {params.value}
                </Typography>
            )
        }
    ];

    const filteredPapers = initialPapers.filter(paper => 
        paper.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const rows = filteredPapers.map((paper, index) => ({
        id: index, // or paper.code if unique
        ...paper
    }));

    if (initialError) {
        return <Alert severity="error">{initialError}</Alert>;
    }

    return (
        <Box>
            <Card elevation={0} sx={{ mb: 4, border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search papers by code or name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </CardContent>
            </Card>

            <MuiPaper elevation={0} sx={{ height: 600, width: '100%', border: '1px solid', borderColor: 'divider' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[10, 25, 50]}
                    checkboxSelection={false}
                    disableRowSelectionOnClick
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: 'grey.50',
                        },
                    }}
                    slots={{ toolbar: GridToolbar }}
                />
            </MuiPaper>
        </Box>
    );
}