import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  IconButton,
  CircularProgress,
  Tooltip,
  Alert,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Fingerprint,
  MicNone,
  Mic,
  Info,
  Settings,
  Check,
  VolumeUp,
  VpnKey,
  Help
} from '@mui/icons-material';
import { biometricAuthService } from '../services/biometricAuthService';
import { voiceInterfaceService } from '../services/voiceInterfaceService';
import { contextualHelpService } from '../services/contextualHelpService';
import { useAuthStore } from '../store/authStore';
import useMobile from '../utils/useMobile';

const EnhancedMobileFeatures = () => {
  const { user } = useAuthStore();
  const isMobile = useMobile();
  const [biometricStatus, setBiometricStatus] = React.useState({ supported: false, enrolled: false });
  const [voiceStatus, setVoiceStatus] = React.useState({ supported: false, listening: false });
  const [helpStatus, setHelpStatus] = React.useState({ initialized: false, availableTopics: [] });
  const [transcript, setTranscript] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [message, setMessage] = React.useState(null);
  const [contextualHelpEnabled, setContextualHelpEnabled] = React.useState(true);

  // Initialize services
  React.useEffect(() => {
    const initializeFeatures = async () => {
      // Initialize biometric service
      try {
        const capabilities = await biometricAuthService.getBiometricCapabilities();
        const enrolled = user?.id ? biometricAuthService.isUserEnrolled(user.id) : false;
        setBiometricStatus({ 
          ...capabilities, 
          enrolled 
        });
      } catch (error) {
        console.error('Biometric initialization error:', error);
        setBiometricStatus({ supported: false, enrolled: false });
      }

      // Initialize voice service
      const voiceSupported = voiceInterfaceService.checkSupport();
      if (voiceSupported) {
        voiceInterfaceService.initialize({
          onStart: () => setVoiceStatus(prev => ({ ...prev, listening: true })),
          onEnd: () => setVoiceStatus(prev => ({ ...prev, listening: false })),
          onResult: (results) => setTranscript(results.lastTranscript),
          onError: (error) => console.error('Voice recognition error:', error)
        });
      }
      setVoiceStatus({ supported: voiceSupported, listening: false });

      // Initialize contextual help
      const helpInitialized = contextualHelpService.initialize();
      const availableTopics = contextualHelpService.getContextualHelp();
      setHelpStatus({ initialized: helpInitialized, availableTopics });

      setLoading(false);
    };

    initializeFeatures();

    // Cleanup
    return () => {
      if (voiceStatus.listening) {
        voiceInterfaceService.stopListening();
      }
    };
  }, [user?.id]);

  // Handle biometric enrollment
  const handleBiometricEnroll = async () => {
    if (!user?.id) {
      setMessage({ type: 'error', text: 'You must be logged in to enroll biometrics' });
      return;
    }

    setLoading(true);
    try {
      const result = await biometricAuthService.initializeBiometric(
        user.id, 
        user.name || user.username || 'SAMS User'
      );
      
      if (result.success) {
        setBiometricStatus(prev => ({ ...prev, enrolled: true }));
        setMessage({ type: 'success', text: 'Biometric authentication enrolled successfully' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to enroll biometrics' });
      }
    } catch (error) {
      console.error('Biometric enrollment error:', error);
      setMessage({ type: 'error', text: error.message || 'An error occurred during biometric enrollment' });
    }
    setLoading(false);
  };

  // Handle biometric authentication test
  const handleBiometricTest = async () => {
    if (!user?.id || !biometricStatus.enrolled) {
      setMessage({ type: 'error', text: 'You must enroll biometrics first' });
      return;
    }

    setLoading(true);
    try {
      const result = await biometricAuthService.authenticateWithBiometric(user.id);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Biometric authentication successful' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Authentication failed' });
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      setMessage({ type: 'error', text: error.message || 'Authentication error' });
    }
    setLoading(false);
  };

  // Handle voice recognition toggle
  const toggleVoiceRecognition = () => {
    if (voiceStatus.listening) {
      voiceInterfaceService.stopListening();
      setVoiceStatus(prev => ({ ...prev, listening: false }));
    } else {
      const started = voiceInterfaceService.startListening();
      if (started) {
        setVoiceStatus(prev => ({ ...prev, listening: true }));
      } else {
        setMessage({ type: 'error', text: 'Failed to start voice recognition' });
      }
    }
  };

  // Handle voice command test
  const handleVoiceTest = () => {
    voiceInterfaceService.speak(
      'Voice interface is working. You can use commands like "Go to dashboard" or "Search for budget"',
      { rate: 1, pitch: 1, volume: 1 }
    );
  };

  // Toggle contextual help
  const toggleContextualHelp = (event) => {
    const enabled = event.target.checked;
    setContextualHelpEnabled(enabled);
    
    if (enabled) {
      contextualHelpService.initialize();
      const availableTopics = contextualHelpService.getContextualHelp();
      setHelpStatus(prev => ({ ...prev, initialized: true, availableTopics }));
    }
  };

  // Show a quick tip from contextual help
  const showQuickTip = () => {
    const tip = contextualHelpService.getQuickTip();
    
    if (tip) {
      setMessage({ 
        type: 'info', 
        text: `${tip.title}: ${tip.content}`,
        duration: 8000 
      });
    } else {
      setMessage({ 
        type: 'info', 
        text: 'No contextual help available for the current view',
        duration: 3000
      });
    }
  };

  // Clear message after timeout
  React.useEffect(() => {
    if (message && message.duration) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, message.duration);
      
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Enhanced Mobile & User Experience
      </Typography>
      
      {message && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 3 }}
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Biometric Authentication */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Fingerprint color="primary" sx={{ fontSize: 28, mr: 1 }} />
                <Typography variant="h6">Biometric Authentication</Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Biometric authentication allows secure access using your device's fingerprint sensor, face recognition, or other biometric capabilities.
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>Status:</Typography>
                  <Chip 
                    label={biometricStatus.supported ? "Supported" : "Not Supported"} 
                    color={biometricStatus.supported ? "success" : "error"}
                    size="small"
                  />
                </Box>
                
                {biometricStatus.supported && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>Enrolled:</Typography>
                    <Chip 
                      label={biometricStatus.enrolled ? "Yes" : "No"} 
                      color={biometricStatus.enrolled ? "success" : "warning"}
                      size="small"
                    />
                  </Box>
                )}
              </Box>
            </CardContent>
            
            <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
              {biometricStatus.supported && !biometricStatus.enrolled && (
                <Button 
                  variant="contained" 
                  startIcon={<VpnKey />} 
                  onClick={handleBiometricEnroll}
                  disabled={loading}
                >
                  Enroll Biometrics
                </Button>
              )}
              
              {biometricStatus.supported && biometricStatus.enrolled && (
                <Button 
                  variant="outlined" 
                  startIcon={<Fingerprint />} 
                  onClick={handleBiometricTest}
                  disabled={loading}
                >
                  Test Authentication
                </Button>
              )}
              
              {!biometricStatus.supported && (
                <Button 
                  variant="outlined" 
                  disabled
                  startIcon={<Fingerprint />}
                >
                  Not Available on Device
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>
        
        {/* Voice Interface */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {voiceStatus.listening ? (
                  <Mic color="primary" sx={{ fontSize: 28, mr: 1 }} />
                ) : (
                  <MicNone color="primary" sx={{ fontSize: 28, mr: 1 }} />
                )}
                <Typography variant="h6">Voice Interface</Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Voice interface enables hands-free operation of the SAMS platform using natural language commands like "Go to dashboard" or "Search for budget items".
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>Status:</Typography>
                  <Chip 
                    label={voiceStatus.supported ? "Supported" : "Not Supported"} 
                    color={voiceStatus.supported ? "success" : "error"}
                    size="small"
                  />
                </Box>
                
                {voiceStatus.supported && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>Listening:</Typography>
                    <Chip 
                      label={voiceStatus.listening ? "Active" : "Inactive"} 
                      color={voiceStatus.listening ? "success" : "default"}
                      size="small"
                    />
                  </Box>
                )}
                
                {voiceStatus.listening && (
                  <Paper sx={{ p: 1, mt: 2, bgcolor: 'rgba(0,0,0,0.03)' }}>
                    <Typography variant="caption" color="text.secondary">
                      Heard:
                    </Typography>
                    <Typography>
                      {transcript || "Listening..."}
                    </Typography>
                  </Paper>
                )}
              </Box>
            </CardContent>
            
            <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
              {voiceStatus.supported && (
                <>
                  <Tooltip title="Test voice feedback">
                    <IconButton onClick={handleVoiceTest} disabled={loading}>
                      <VolumeUp />
                    </IconButton>
                  </Tooltip>
                  
                  <Button 
                    variant={voiceStatus.listening ? "contained" : "outlined"} 
                    color={voiceStatus.listening ? "primary" : "primary"}
                    startIcon={voiceStatus.listening ? <Mic /> : <MicNone />} 
                    onClick={toggleVoiceRecognition}
                    disabled={loading}
                  >
                    {voiceStatus.listening ? "Stop Listening" : "Start Voice Recognition"}
                  </Button>
                </>
              )}
              
              {!voiceStatus.supported && (
                <Button 
                  variant="outlined" 
                  disabled
                  startIcon={<MicNone />}
                >
                  Not Available on Browser
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>
        
        {/* Contextual Help */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Help color="primary" sx={{ fontSize: 28, mr: 1 }} />
                <Typography variant="h6">Contextual Help System</Typography>
                
                <Box sx={{ ml: 'auto' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={contextualHelpEnabled}
                        onChange={toggleContextualHelp}
                        name="contextualHelpToggle"
                        color="primary"
                      />
                    }
                    label="Enabled"
                  />
                </Box>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body2" color="text.secondary" paragraph>
                The contextual help system provides intelligent assistance based on your current view and recent actions.
                It anticipates your needs and shows relevant guidance at the right moment.
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Available Help Topics
                    </Typography>
                    
                    {helpStatus.availableTopics.length > 0 ? (
                      <Box component="ul" sx={{ pl: 2 }}>
                        {helpStatus.availableTopics.slice(0, 3).map(topic => (
                          <Box component="li" key={topic.id} sx={{ mb: 1 }}>
                            <Typography variant="body2">
                              {topic.title}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No context-specific help topics available for the current view.
                      </Typography>
                    )}
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <Paper sx={{ p: 2, height: '100%', bgcolor: 'rgba(25, 118, 210, 0.05)' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      How It Works
                    </Typography>
                    
                    <Typography variant="body2" paragraph>
                      The contextual help system:
                    </Typography>
                    
                    <Box component="ol" sx={{ pl: 2 }}>
                      <Box component="li" sx={{ mb: 0.5 }}>
                        <Typography variant="body2">
                          Tracks your current location in the application
                        </Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 0.5 }}>
                        <Typography variant="body2">
                          Monitors recent actions to understand your context
                        </Typography>
                      </Box>
                      <Box component="li" sx={{ mb: 0.5 }}>
                        <Typography variant="body2">
                          Provides relevant help topics and quick tips
                        </Typography>
                      </Box>
                      <Box component="li">
                        <Typography variant="body2">
                          Adapts to your experience level over time
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
            
            <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
              <Button 
                variant="outlined" 
                startIcon={<Info />} 
                onClick={showQuickTip}
                disabled={!contextualHelpEnabled || helpStatus.availableTopics.length === 0}
              >
                Show Quick Tip
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EnhancedMobileFeatures;
