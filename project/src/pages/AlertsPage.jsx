import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Typography, Alert, AlertTitle, Paper, Grid, Button } from '@mui/material';
import { WarningAmber as WarningIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AlertsPage = () => {
  const navigate = useNavigate();
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Alerts & Notifications
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4, borderRadius: 4, background: 'rgba(255,255,255,0.85)', boxShadow: '0 8px 32px 0 rgba(25, 118, 210, 0.10)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(25, 118, 210, 0.08)' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <WarningIcon color="warning" sx={{ fontSize: 48 }} />
          </Grid>
          <Grid item xs>
            <Typography variant="h6">
              Alerts Center
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View and manage your compliance alerts and system notifications
            </Typography>
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/compliance')}
            >
              Go to Compliance Dashboard
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Alert severity="critical" sx={{ mb: 2, borderRadius: 3, fontWeight: 700, fontSize: 18, boxShadow: '0 2px 8px rgba(244,67,54,0.10)', background: 'rgba(255,255,255,0.85)', color: '#d32f2f', border: '1px solid #f44336' }}>
        <AlertTitle sx={{ fontWeight: 900, fontSize: 20 }}>Procurement Compliance Violation</AlertTitle>
        Transaction TRX-002 for R250,000 failed to follow required competitive bidding process.
      </Alert>
      
      <Alert severity="error" sx={{ mb: 2, borderRadius: 3, fontWeight: 700, fontSize: 18, boxShadow: '0 2px 8px rgba(244,67,54,0.10)', background: 'rgba(255,255,255,0.85)', color: '#d32f2f', border: '1px solid #f44336' }}>
        <AlertTitle sx={{ fontWeight: 900, fontSize: 20 }}>Potential Irregular Expenditure</AlertTitle>
        Transaction TRX-002 shows evidence of process deviation without documented approval.
      </Alert>
      
      <Alert severity="warning" sx={{ mb: 2, borderRadius: 3, fontWeight: 700, fontSize: 18, boxShadow: '0 2px 8px rgba(255,152,0,0.10)', background: 'rgba(255,255,255,0.85)', color: '#f57c00', border: '1px solid #ff9800' }}>
        <AlertTitle sx={{ fontWeight: 900, fontSize: 20 }}>Spending Anomaly Detected</AlertTitle>
        Transaction TRX-007 amount (R420,000) is significantly higher than typical for maintenance category.
      </Alert>
      
      <Alert severity="warning" sx={{ mb: 2, borderRadius: 3, fontWeight: 700, fontSize: 18, boxShadow: '0 2px 8px rgba(255,152,0,0.10)', background: 'rgba(255,255,255,0.85)', color: '#f57c00', border: '1px solid #ff9800' }}>
        <AlertTitle sx={{ fontWeight: 900, fontSize: 20 }}>Undisclosed Conflict of Interest</AlertTitle>
        Transaction TRX-004 shows potential conflict of interest that was not properly disclosed.
      </Alert>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        <AlertTitle>Budget Threshold Warning</AlertTitle>
        Public Works department has used 85% of quarterly budget allocation. Review required.
      </Alert>
      
      <Alert severity="success">
        <AlertTitle>Database Maintenance Complete</AlertTitle>
        Routine database maintenance completed at 02:00. Performance improved by 15%.
      </Alert>
    </Box>
  );
};

export default AlertsPage;
