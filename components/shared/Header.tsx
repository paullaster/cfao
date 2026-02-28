'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Container,
    Button,
    useScrollTrigger,
    Slide,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CalculateIcon from '@mui/icons-material/Calculate';
import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

interface Props {
    window?: () => Window;
    children?: React.ReactElement;
}

function HideOnScroll(props: Props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
    });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children || <div />}
        </Slide>
    );
}

const navItems = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Calculator', path: '/calculator', icon: <CalculateIcon /> },
    { label: 'Papers', path: '/papers', icon: <LibraryBooksIcon /> },
];

export default function Header(props: Props) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2, fontWeight: 'bold', color: 'primary.main' }}>
                BoxMetric
            </Typography>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <Link href={item.path} passHref style={{ width: '100%', textDecoration: 'none', color: 'inherit' }}>
                            <ListItemButton selected={pathname === item.path}>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <HideOnScroll {...props}>
                <AppBar
                    position="sticky"
                    color="default"
                    elevation={0}
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(8px)',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                            {/* Mobile Menu Icon */}
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, display: { sm: 'none' } }}
                            >
                                <MenuIcon />
                            </IconButton>

                            {/* Logo - Desktop */}
                            <CalculateIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
                            <Typography
                                variant="h6"
                                noWrap
                                component={Link}
                                href="/"
                                sx={{
                                    mr: 4,
                                    display: { xs: 'none', md: 'flex' },
                                    fontWeight: 700,
                                    color: 'text.primary',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        color: 'primary.main',
                                    },
                                }}
                            >
                                BoxMetric
                            </Typography>

                            {/* Logo - Mobile */}
                            <CalculateIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'primary.main' }} />
                            <Typography
                                variant="h6"
                                noWrap
                                component={Link}
                                href="/"
                                sx={{
                                    flexGrow: 1,
                                    display: { xs: 'flex', md: 'none' },
                                    fontWeight: 700,
                                    color: 'text.primary',
                                    textDecoration: 'none',
                                }}
                            >
                                BoxMetric
                            </Typography>

                            {/* Desktop Nav */}
                            <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
                                {navItems.map((item) => (
                                    <Link key={item.label} href={item.path} passHref>
                                        <Button
                                            key={item.label}
                                            startIcon={item.icon}
                                            sx={{
                                                color: pathname === item.path ? 'primary.main' : 'text.secondary',
                                                fontWeight: pathname === item.path ? 700 : 500,
                                                '&:hover': {
                                                    backgroundColor: 'action.hover',
                                                    color: 'primary.main',
                                                },
                                            }}
                                        >
                                            {item.label}
                                        </Button>
                                    </Link>
                                ))}
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
            </HideOnScroll>
            <nav>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
        </>
    );
}