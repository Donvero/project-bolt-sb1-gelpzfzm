import React from 'react';import {   Box, 
  Typography, 
  Paper,
  Grid,
  LinearProgress,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material';
import { 
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  ArrowForward as ArrowForwardIcon,
  NotificationsActive as AlertIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// CompliancePage component with simplified structure to avoid syntax errors
const CompliancePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Sample data
  const complianceSummary = {
    mfma: 86,
    pfma: 92,
    policy: 78
  };
  
  const recentAlerts = [
    { id: 1, title: 'Procurement Compliance Violation', message: 'Transaction TRX-002 failed to follow required competitive bidding process.', priority: 'critical' },
    { id: 2, title: 'Potential Irregular Expenditure', message: 'Transaction TRX-005 shows evidence of process deviation without documented approval.', priority: 'high' },
    { id: 3, title: 'Spending Anomaly Detected', message: 'Transaction TRX-007 amount is significantly higher than typical for maintenance category.', priority: 'medium' },
    { id: 4, title: 'Document Missing', message: 'Supporting documentation for TRX-012 is incomplete.', priority: 'low' }
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Page Title */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 900, letterSpacing: '-0.03em', color: 'primary.main', textShadow: '0 2px 8px rgba(25, 118, 210, 0.10)' }}>
          Compliance Monitoring
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AlertIcon />}
          onClick={() => navigate('/alerts')}
          sx={{
            fontWeight: 700,
            fontSize: 16,
            borderRadius: 3,
            boxShadow: '0 4px 16px 0 rgba(25, 118, 210, 0.10)',
            background: 'linear-gradient(135deg, #1976d2 0%, #00acc1 100%)',
            color: '#fff',
            transition: 'all 0.2s cubic-bezier(.4,2,.3,1)',
            '&:hover': {
              background: 'linear-gradient(135deg, #00acc1 0%, #1976d2 100%)',
              boxShadow: '0 8px 32px 0 rgba(0, 172, 193, 0.10)',
              transform: 'translateY(-2px) scale(1.03)',
            }
          }}
        >
          View Alerts
        </Button>
      </Box>
      
      {/* Main Content - Simplified */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 4,
            background: 'rgba(255,255,255,0.85)',
            boxShadow: '0 8px 32px 0 rgba(25, 118, 210, 0.10)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(25, 118, 210, 0.08)',
          }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
              Compliance Status
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box mt={2}>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Overall MFMA Compliance</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{complianceSummary.mfma}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={complianceSummary.mfma} 
                sx={{ height: 8, borderRadius: 4, mb: 3 }}
              />
              
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Overall PFMA Compliance</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{complianceSummary.pfma}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={complianceSummary.pfma}
                color="success"
                sx={{ height: 8, borderRadius: 4, mb: 3 }}
              />
              
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Policy Compliance</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{complianceSummary.policy}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={complianceSummary.policy}
                color="warning" 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 4,
            background: 'rgba(255,255,255,0.85)',
            boxShadow: '0 8px 32px 0 rgba(25, 118, 210, 0.10)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(25, 118, 210, 0.08)',
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Recent Compliance Alerts
              </Typography>
              <Button 
                endIcon={<ArrowForwardIcon />} 
                onClick={() => navigate('/alerts')}
                sx={{ 
                  fontWeight: 700,
                  color: 'primary.main',
                  '&:hover': { transform: 'translateX(5px)' } 
                }}
              >
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              {recentAlerts.map((alert) => (
                <ListItem key={alert.id} alignItems="flex-start" sx={{ 
                  mb: 1, 
                  borderRadius: 2,
                  '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' } 
                }}>
                  <ListItemIcon>
                    {alert.priority === 'critical' && <ErrorIcon color="error" />}
                    {alert.priority === 'high' && <WarningIcon color="warning" />}
                    {alert.priority === 'medium' && <InfoIcon color="info" />}
                    {alert.priority === 'low' && <SuccessIcon color="success" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{alert.title}</Typography>}
                    secondary={alert.message}
                  />
                  <Chip 
                    size="small" 
                    label={alert.priority}
                    color={
                      alert.priority === 'critical' ? 'error' :
                      alert.priority === 'high' ? 'warning' :
                      alert.priority === 'medium' ? 'info' : 'success'
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompliancePage;