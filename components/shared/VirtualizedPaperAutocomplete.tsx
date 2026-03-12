'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
    Autocomplete, 
    TextField, 
    CircularProgress, 
    useTheme, 
    useMediaQuery,
    Box,
    Typography
} from '@mui/material';
import { List, type RowComponentProps } from 'react-window';
import { getPapersAction } from '@/app/actions/calculator';
import type { Paper } from '@/lib/types';

// Define the type for the props shared via rowProps
interface RowData {
  items: React.ReactNode[];
}

/**
 * RowComponent following strictly the react-window 2.x architectural pattern.
 * Avoids cloneElement for maximum performance and stability.
 */
function RowComponent({
  index,
  items,
  style
}: RowComponentProps<RowData>) {
  return (
    <div style={style}>
      {items[index]}
    </div>
  );
}

// Custom Listbox Component for Virtualization using react-window 2.x API
const ListboxComponent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
  function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const itemData = React.Children.toArray(children);
    
    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
      noSsr: true,
    });

    const itemCount = itemData.length;
    const itemSize = smUp ? 48 : 56;
    const height = Math.min(itemCount * itemSize, 300);

    return (
      <div ref={ref} {...other}>
        <List
          rowComponent={RowComponent}
          rowCount={itemCount}
          rowHeight={itemSize}
          rowProps={{ items: itemData }}
          style={{ height, width: '100%' }}
        />
      </div>
    );
  },
);

interface VirtualizedPaperAutocompleteProps {
    value: Paper | null;
    onChange: (newValue: Paper | null) => void;
    label?: string;
    sx?: any;
    initialOptions?: Paper[];
    isLinerFilter?: boolean; // Optional: restrict to only liners or only flutes
}

/**
 * Highly optimized Virtualized Autocomplete for Paper Selection.
 * Features: Server-side search, real-time debouncing, and react-window virtualization.
 */
export default function VirtualizedPaperAutocomplete({ 
    value, 
    onChange, 
    label = "Select Paper",
    sx,
    initialOptions = [],
    isLinerFilter
}: VirtualizedPaperAutocompleteProps) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<Paper[]>([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    // Initial load and filter application
    useEffect(() => {
        let initial = initialOptions;
        if (isLinerFilter !== undefined) {
            initial = initialOptions.filter(p => p.isLiner === isLinerFilter);
        }
        setOptions(initial.slice(0, 100));
    }, [initialOptions, isLinerFilter]);

    const fetchOptions = async (search: string) => {
        setLoading(true);
        try {
            const results = await getPapersAction(search, 100);
            let filteredResults = results;
            if (isLinerFilter !== undefined) {
                filteredResults = results.filter(p => p.isLiner === isLinerFilter);
            }
            setOptions(filteredResults);
        } catch (error) {
            console.error('[PaperAutocomplete] Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    // Unified effect for search debouncing and idle state
    useEffect(() => {
        if (!open) return;

        if (inputValue === '') {
            // When open but no input, show relevant initial papers
            let initial = initialOptions;
            if (isLinerFilter !== undefined) {
                initial = initialOptions.filter(p => p.isLiner === isLinerFilter);
            }
            
            // Prioritize current value if it exists
            const merged = value ? [value, ...initial.filter(p => p.id !== value.id)] : initial;
            setOptions(merged.slice(0, 50));
            return;
        }

        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(() => {
            fetchOptions(inputValue);
        }, 300);

        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [inputValue, open, initialOptions, value, isLinerFilter]);

    return (
        <Autocomplete
            sx={sx}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            size="small"
            autoHighlight
            filterOptions={(x) => x} // Disable MUI built-in filtering (we use server/custom filtering)
            ListboxComponent={ListboxComponent}
            options={options}
            loading={loading}
            value={value}
            onChange={(_, newValue) => onChange(newValue)}
            onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
            getOptionLabel={(option) => `${option.code} - ${option.name} (${option.defaultGrammage}g)`}
            isOptionEqualToValue={(option, val) => option.id === val.id}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    placeholder="Search by code (e.g. K, TL) or name..."
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
            renderOption={(props, option) => {
                const { key, ...optionProps } = props as any;
                return (
                    <li key={option.id || key} {...optionProps}>
                        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                            <Box 
                                component="span" 
                                sx={{ 
                                    fontWeight: 900, 
                                    mr: 2, 
                                    minWidth: '40px', 
                                    display: 'inline-block',
                                    color: option.isLiner ? 'primary.main' : 'warning.main'
                                }}
                            >
                                {option.code}
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {option.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {option.isLiner ? 'Liner' : 'Fluting'} • {option.defaultGrammage}g/m²
                                </Typography>
                            </Box>
                        </Box>
                    </li>
                );
            }}
        />
    );
}
