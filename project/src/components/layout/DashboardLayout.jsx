import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Security as SecurityIcon,
  AccountBalance as AccountBalanceIcon,
  ShoppingCart as ShoppingCartIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Psychology as AIIcon,
  AccountTree as WorkflowIcon
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import NavigationItem from './NavigationItem';
import useMobile from '../../utils/useMobile';
import { userPreferenceService } from '../../services/userPreferenceService';

const drawerWidth = 280;

const DashboardLayout = ({ children }) => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const { user, logout, hasPermission } = useAuthStore();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
  };

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const prefs = await userPreferenceService.getPreferences(user.id);
        console.log('User preferences:', prefs);
        // Apply preferences to the layout, e.g., theme, density, etc.
      } catch (error) {
        console.error('Failed to fetch user preferences:', error);
      }
    };

    if (user?.id) {
      fetchPreferences();
    }
  }, [user?.id]);

  const isMobile = useMobile();

  useEffect(() => {
    if (isMobile) {
      console.log('Mobile viewport detected. Applying mobile-specific optimizations.');
      // Add any mobile-specific logic here
    }
  }, [isMobile]);

  const navigationItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      permission: 'read'
    },
    {
      text: 'AI Intelligence',
      icon: <AIIcon />,
      path: '/intelligence',
      permission: 'read'
    },
    {
      text: 'Workflow Intelligence',
      icon: <WorkflowIcon />,
      path: '/workflow-intelligence',
      permission: 'read'
    },
    {
      text: 'Mobile-First UX',
      icon: <AIIcon />,
      path: '/mobile-ux',
      permission: 'read'
    },
    {
      text: 'Compliance',
      icon: <SecurityIcon />,
      path: '/compliance',
      permission: 'read'
    },
    {
      text: 'Budget Management',
      icon: <AccountBalanceIcon />,
      path: '/budget',
      permission: 'read'
    },
    {
      text: 'Procurement',
      icon: <ShoppingCartIcon />,
      path: '/procurement',
      permission: 'read'
    },
    {
      text: 'Reports',
      icon: <AssessmentIcon />,
      path: '/reports',
      permission: 'read'
    },
    {
      text: 'User Management',
      icon: <PeopleIcon />,
      path: '/users',
      permission: 'manage_users',
      adminOnly: true
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
      permission: 'read'
    }
  ];

  const drawer = (
    <Box>
      {/* Logo and Title */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #1976d2 0%, #00acc1 100%)',
          color: 'white',
          textAlign: 'center',
          borderRadius: 4,
          boxShadow: '0 8px 32px 0 rgba(25, 118, 210, 0.10)',
          mb: 2,
          position: 'relative',
          overflow: 'hidden',
          '::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.15) 0%, transparent 70%)',
            zIndex: 0,
          }
        }}
      >
        <Avatar
          sx={{
            width: 72,
            height: 72,
            bgcolor: 'rgba(255,255,255,0.25)',
            mx: 'auto',
            mb: 2,
            boxShadow: '0 4px 24px 0 rgba(0, 172, 193, 0.10)',
            border: '2px solid #fff',
            zIndex: 1
          }}
        >
          <SecurityIcon sx={{ fontSize: 36 }} />
        </Avatar>
        <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.03em', zIndex: 1 }}>
          SAMS™
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.95, fontWeight: 600, zIndex: 1 }}>
          Smart Audit Management
        </Typography>
      </Box>

      {/* User Info */}
      <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 3, boxShadow: '0 2px 8px rgba(25, 118, 210, 0.05)', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar sx={{ width: 40, height: 40, mr: 1, bgcolor: 'primary.main', fontWeight: 700, fontSize: 20, boxShadow: '0 2px 8px rgba(25, 118, 210, 0.10)' }}>
            {user?.name?.charAt(0)}
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="body1" sx={{ fontWeight: 700, fontSize: 16 }} noWrap>
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ fontWeight: 600 }}>
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </Typography>
          </Box>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 500 }}>
          {user?.municipality}
        </Typography>
      </Box>

      <Divider />

      {/* Navigation */}
      <List sx={{ px: 1, py: 2, gap: 1, display: 'flex', flexDirection: 'column' }}>
        {navigationItems.map((item) => {
          if (item.adminOnly && user?.role !== 'admin') return null;
          if (!hasPermission(item.permission)) return null;
          return (
            <NavigationItem
              key={item.path}
              item={item}
              isActive={location.pathname === item.path}
              onClick={isMobile ? handleDrawerToggle : undefined}
              sx={{
                borderRadius: 3,
                fontWeight: 700,
                fontSize: 16,
                boxShadow: location.pathname === item.path ? '0 4px 16px 0 rgba(25, 118, 210, 0.10)' : 'none',
                background: location.pathname === item.path ? 'linear-gradient(135deg, #1976d2 0%, #00acc1 100%)' : 'none',
                color: location.pathname === item.path ? '#fff' : 'inherit',
                transition: 'all 0.2s cubic-bezier(.4,2,.3,1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #00acc1 0%, #1976d2 100%)',
                  color: '#fff',
                  boxShadow: '0 8px 32px 0 rgba(0, 172, 193, 0.10)',
                  transform: 'translateY(-2px) scale(1.03)',
                }
              }}
            />
          );
        })}
      </List>

      <Divider />
      
      {/* Quick Links */}
      <Box sx={{ p: 2 }}>
        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 500, display: 'block', mb: 1 }}>
          Quick Links
        </Typography>
        <NavigationItem
          item={{
            text: 'Alerts & Notifications',
            icon: <NotificationsIcon />,
            path: '/alerts',
            badgeContent: 6
          }}
          isActive={location.pathname === '/alerts'}
          onClick={isMobile ? handleDrawerToggle : undefined}
        />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
        elevation={0}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {navigationItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>

          {/* Notifications */}
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Alerts & Notifications">
              <IconButton color="inherit" sx={{ mr: 1 }} onClick={() => window.location.href = '/alerts'}>
                <Badge badgeContent={6} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Profile Menu */}
            <IconButton
              onClick={handleProfileMenuOpen}
              color="inherit"
              aria-controls="profile-menu"
              aria-haspopup="true"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                {user?.name?.charAt(0) || <PersonIcon />}
              </Avatar>
            </IconButton>
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleProfileMenuClose}>
                <PersonIcon fontSize="small" sx={{ mr: 1.5 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <PersonIcon sx={{ mr: 2 }} /> My Account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 2 }} /> Logout
        </MenuItem>
      </Menu>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
          bgcolor: 'background.default',
          borderRadius: 4,
          boxShadow: '0 8px 32px 0 rgba(25, 118, 210, 0.10)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;