import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Avatar,
    Button,
    MenuItem,
} from '@mui/material';

function Navbar({ supabase, session = null }) {
    const pages = ['About', 'Player'];
    const settings = ['Profile', 'Logout'];
    const navLinks = {
        About: '/',
        Player: '/player',
    };

    const [anchorElUser, setAnchorElUser] = useState(null);

    async function signInWithSpotify() {
        await supabase.auth.signInWithOAuth({
            provider: 'spotify',
        });
    }

    async function signOut() {
        await supabase.auth.signOut();
    }

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleSettings = (setting) => {
        handleCloseUserMenu();
        switch (setting) {
            case 'Logout':
                signOut();
                break;
            default:
        }
    };

    return (
        <AppBar position="static">
            <Toolbar disableGutters>
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    href="/"
                    sx={{
                        mr: 2,
                        ml: 1,
                        display: { xs: 'none', md: 'flex' },
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    Image Radio
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexGrow: 1,
                        flexDirection: 'row',
                        mt: 0.5,
                    }}
                >
                    {pages.map((page) => (
                        <NavLink
                            key={page}
                            to={navLinks[page]}
                            style={{ textDecoration: 'none' }}
                        >
                            <Button
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page}
                            </Button>
                        </NavLink>
                    ))}
                </Box>

                <Box sx={{ flexGrow: 0 }}>
                    <IconButton
                        onClick={
                            session ? handleOpenUserMenu : signInWithSpotify
                        }
                        sx={{
                            p: 0,
                            mr: '10px',
                            color: 'white',
                            fontSize: '20px',
                        }}
                    >
                        {session ? (
                            <Avatar
                                alt={session.user.user_metadata.full_name}
                                src="/static/images/user.jpg"
                                sx={{ mr: '10px' }}
                            />
                        ) : (
                            <>Login</>
                        )}
                    </IconButton>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        {settings.map((setting) => (
                            <MenuItem
                                key={setting}
                                onClick={() => handleSettings(setting)}
                            >
                                <Typography textAlign="center">
                                    {setting}
                                </Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
