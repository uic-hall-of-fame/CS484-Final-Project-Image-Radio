import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

function Navbar({ supabase, session = null }) {
    const pages = ['About'];
    const settings = ['Profile', 'Logout'];

    const [anchorElUser, setAnchorElUser] = React.useState(null);

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

                <Box sx={{ flexGrow: 1, mt: 0.5 }}>
                    {pages.map((page) => (
                        <Button
                            key={page}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            {page}
                        </Button>
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
                                alt="Remy Sharp"
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
