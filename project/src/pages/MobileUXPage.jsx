import React, { Suspense } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Switch, 
  FormControlLabel, 
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { 
  Smartphone, 
  Tablet, 
  Computer, 
  TouchApp, 
  Accessibility,
  Palette,
  SpeedDial
} from '@mui/icons-material';
import useMobile from '../utils/useMobile';
import { userPreferenceService } from '../services/userPreferenceService';
import { useAuthStore } from '../store/authStore';

// Use React.lazy for dynamic loading of EnhancedMobileFeatures
const EnhancedMobileFeatures = React.lazy(() => 
  import('../components/EnhancedMobileFeatures')
);

// Create a namespace for dynamic components
const dynamic = {
  EnhancedMobileFeatures
};

const MobileUXPage = () => {
  const isMobile = useMobile();
  const { user } = useAuthStore();
  const [preferences, setPreferences] = React.useState({ 
    compactMode: false, 
    theme: 'light', 
    fontSize: 14,
    animationsEnabled: true,
    notificationPreference: 'all',
    touchOptimization: false 
  });

  React.useEffect(() => {
    const fetchPrefs = async () => {
      if (user?.id) {
        const prefs = await userPreferenceService.getPreferences(user.id);
        setPreferences(prev => ({ ...prev, ...prefs }));
      }
    };
    fetchPrefs();
  }, [user?.id]);

  const handlePreferenceChange = async (event) => {
    const { name, checked, value } = event.target;
    const newValue = event.target.type === 'checkbox' ? checked : value;
    const newPreferences = { ...preferences, [name]: newValue };
    setPreferences(newPreferences);
    await userPreferenceService.savePreferences(user.id, newPreferences);
  };

  const handleSliderChange = async (name, value) => {
    const newPreferences = { ...preferences, [name]: value };
    setPreferences(newPreferences);
    await userPreferenceService.savePreferences(user.id, newPreferences);
  };

  const getDeviceIcon = () => {
    if (window.innerWidth < 600) return <Smartphone color="primary" />;
    if (window.innerWidth < 1200) return <Tablet color="primary" />;
    return <Computer color="primary" />;
  };
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {getDeviceIcon()}
        Mobile-First & Personalization Experience
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Experience the responsive, personalized interface designed for optimal usability across all devices
      </Typography>

      {/* Device Detection */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
            Smart Device Detection
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Chip 
              icon={getDeviceIcon()} 
              label={`Current View: ${isMobile ? 'Mobile' : 'Desktop'}`}
              sx={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
            <Chip 
              label={`${window.innerWidth}x${window.innerHeight}`}
              sx={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>
            This component automatically adapts its layout, touch targets, and interaction patterns based on your device capabilities.
          </Typography>
        </CardContent>
      </Card>

      {/* User Personalization */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Palette color="primary" />
            Personalization Settings
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.compactMode}
                    onChange={handlePreferenceChange}
                    name="compactMode"
                    color="primary"
                  />
                }
                label="Compact Mode"
              />
              <Typography variant="caption" display="block" color="text.secondary">
                Reduce spacing and padding for more content on screen
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.touchOptimization}
                    onChange={handlePreferenceChange}
                    name="touchOptimization"
                    color="primary"
                  />
                }
                label="Touch Optimization"
              />
              <Typography variant="caption" display="block" color="text.secondary">
                Larger touch targets and gesture-friendly interactions
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Font Size</Typography>
              <Slider
                value={preferences.fontSize}
                onChange={(_, value) => handleSliderChange('fontSize', value)}
                aria-labelledby="font-size-slider"
                min={12}
                max={20}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Theme</InputLabel>
                <Select
                  value={preferences.theme}
                  label="Theme"
                  name="theme"
                  onChange={handlePreferenceChange}
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="auto">Auto</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Mobile Optimizations */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TouchApp color="primary" />
                Touch-Friendly Interface
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Button 
                  variant="contained" 
                  size={preferences.touchOptimization ? "large" : "medium"}
                  sx={{ mr: 1, mb: 1, minHeight: preferences.touchOptimization ? 48 : 36 }}
                >
                  Primary Action
                </Button>
                <Button 
                  variant="outlined" 
                  size={preferences.touchOptimization ? "large" : "medium"}
                  sx={{ mb: 1, minHeight: preferences.touchOptimization ? 48 : 36 }}
                >
                  Secondary
                </Button>
              </Box>
              <Typography variant="body2">
                Interface elements adapt their size and spacing based on your touch optimization preference. 
                Mobile devices get larger touch targets automatically.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Accessibility color="primary" />
                Accessibility Features
              </Typography>
              <Box sx={{ fontSize: preferences.fontSize }}>
                <Typography sx={{ mb: 1 }}>
                  Text scales with your font size preference: {preferences.fontSize}px
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All interface elements respect accessibility guidelines with proper contrast ratios, 
                  keyboard navigation, and screen reader support.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Responsive Layout Demonstration
              </Typography>
              <Grid container spacing={2}>
                {[1, 2, 3, 4].map((item) => (
                  <Grid item xs={12} sm={6} md={3} key={item}>
                    <Paper 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        height: preferences.compactMode ? 80 : 120,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                        color: 'white'
                      }}
                    >
                      <Typography variant="h6">
                        Item {item}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              <Typography variant="body2" sx={{ mt: 2 }}>
                This grid automatically adjusts from 4 columns on desktop to 2 on tablet and 1 on mobile.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Enhanced Mobile Features */}
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Enhanced Mobile Experience Features
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          The following advanced features enhance the mobile experience with biometric authentication, voice commands, and contextual help.
        </Typography>
      </Box>
      
      {/* Include the EnhancedMobileFeatures component */}
      <Box sx={{ mt: 2 }}>
        <React.Suspense fallback={<CircularProgress />}>
          <dynamic.EnhancedMobileFeatures />
        </React.Suspense>
      </Box>
    </Container>
  );
};

export default MobileUXPage;
