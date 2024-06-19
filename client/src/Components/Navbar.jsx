import React, { useContext, useState } from 'react';
import { GlobalStateContext } from './Context';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, Typography, Menu, MenuItem, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = ({ onSignupButtonClick, onLoginButtonClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { userLoggedIn, currentUsername, setUserLoggedIn, setCurrentUsername } = useContext(GlobalStateContext);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMyProfileClick = () => {
    navigate(`/Profile/${currentUsername}`, { state: { name: currentUsername } });
    handleMenuClose();
  };

  const handleLogoutClick = () => {
    navigate('/');
    setCurrentUsername(null);
    setUserLoggedIn(false);
  };

  return (
    <AppBar position="sticky" className="navbar-container" sx={{ background: 'rgba(25, 118, 210, 1)' }}>
      <Container>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
              <img src="/logo.png" alt="TechTestHub-Logo" style={{ marginRight: '10px', height: '40px' }} />
              TechTestHub
            </Link>
          </Typography>
          <Button component={Link} to="/Upload" color="inherit" sx={{ marginRight: 2 }}>
            Upload New Question
          </Button>
          <Button onClick={onSignupButtonClick} color="inherit" sx={{ marginRight: 2 }}>
            Sign Up
          </Button>
          <Button onClick={onLoginButtonClick} color="inherit">
            Log In
          </Button>
          {userLoggedIn ? (
            <>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <AccountCircleIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleMyProfileClick}>My Profile</MenuItem>
                <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <></>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;




