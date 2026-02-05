'use client';

import { useState } from 'react';
import { Paper as MuiPaper, Box, TextField, InputAdornment, Alert, Chip, Card, CardContent } from '@mui/material';
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
            field: 'type', 
            headerName: 'Paper Code', 
            width: 150,
            renderCell: (params) => (
                <Chip label={params.value} size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />
            )
        },
        { field: 'name', headerName: 'Description', flex: 1, minWidth: 200 },
        { 
            field: 'burstIndex', 
            headerName: 'Burst Index (kPa·m²/g)', 
            type: 'number', 
            width: 200,
            align: 'right',
            headerAlign: 'right',
        },
        // Assuming there might be other fields in Paper type, or we can add simulated ones
    ];

    const filteredPapers = initialPapers.filter(paper => 
        paper.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const rows = filteredPapers.map((paper, index) => ({
        id: index, // or paper.type if unique
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