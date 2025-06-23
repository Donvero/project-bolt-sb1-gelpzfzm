import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Badge,
  Tooltip,
  Fade,
  useTheme,
  alpha
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Error,
  Info,
  AccountBalance,
  Security,
  Assessment,
  ShoppingCart,
  MoreVert,
  Refresh,
  PlayArrow,
  Pause,
  Psychology
} from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';
import { realTimeAnalytics } from '../services/realTimeAnalyticsService';

const Dashboard = () => {
  const { user } = useAuthStore();
  const theme = useTheme();
  const [realTimeData, setRealTimeData] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Initialize real-time analytics
  useEffect(() => {
    const subscriberId = 'dashboard-main';
    
    realTimeAnalytics.subscribe(subscriberId, (data) => {
      setRealTimeData(data);
      setLastUpdate(new Date().toLocaleTimeString());
    });

    return () => {
      realTimeAnalytics.unsubscribe(subscriberId);
      realTimeAnalytics.stopStreaming();
    };
  }, []);

  const handleToggleStreaming = () => {
    if (isStreaming) {
      realTimeAnalytics.stopStreaming();
      setIsStreaming(false);
    } else {
      realTimeAnalytics.startStreaming(3000); // Update every 3 seconds
      setIsStreaming(true);
    }
  };

  const handleRefreshData = () => {
    realTimeAnalytics.stopStreaming();
    realTimeAnalytics.startStreaming(100); // Quick refresh
    setTimeout(() => {
      if (!isStreaming) {
        realTimeAnalytics.stopStreaming();
      }
    }, 1000);
  };

  // Enhanced stats with real-time data
  const getEnhancedStats = () => {
    const baseStats = [
      {
        title: 'Budget Utilization',
        value: realTimeData ? `${realTimeData.budgetMetrics.utilizationRate}%` : '78.5%',
        change: realTimeData ? `${realTimeData.budgetMetrics.utilizationRate > 78.5 ? '+' : ''}${(realTimeData.budgetMetrics.utilizationRate - 78.5).toFixed(1)}%` : '+2.3%',
        trend: realTimeData ? (realTimeData.budgetMetrics.utilizationRate > 78.5 ? 'up' : 'down') : 'up',
        color: realTimeData && realTimeData.budgetMetrics.utilizationRate > 90 ? 'error' : 'primary',
        icon: <AccountBalance />,
        isRealTime: !!realTimeData
      },
      {
        title: 'Compliance Score',
        value: realTimeData ? `${realTimeData.complianceStatus.overallScore}%` : '94.2%',
        change: realTimeData ? `${realTimeData.complianceStatus.overallScore > 94.2 ? '+' : ''}${(realTimeData.complianceStatus.overallScore - 94.2).toFixed(1)}%` : '+1.8%',
        trend: realTimeData ? realTimeData.complianceStatus.trend : 'up',
        color: 'success',
        icon: <Security />,
        isRealTime: !!realTimeData
      },
      {
        title: 'Transaction Flow',
        value: realTimeData ? `${realTimeData.transactionFlow.currentRate}/h` : '12',
        change: realTimeData ? realTimeData.transactionFlow.trend : '-2',
        trend: realTimeData ? (realTimeData.transactionFlow.trend === 'increasing' ? 'up' : 'stable') : 'down',
        color: 'info',
        icon: <Assessment />,
        isRealTime: !!realTimeData
      },
      {
        title: 'Risk Level',
        value: realTimeData ? realTimeData.riskMetrics.category : 'Medium',
        change: realTimeData ? `${realTimeData.riskMetrics.overallRisk.toFixed(1)}` : '+3',
        trend: realTimeData ? realTimeData.riskMetrics.trend : 'up',
        color: realTimeData && realTimeData.riskMetrics.category === 'High' ? 'error' : 'warning',
        icon: <Psychology />,
        isRealTime: !!realTimeData
      }
    ];
    return baseStats;
  };

  const stats = getEnhancedStats();

  const recentAlerts = realTimeData ? realTimeData.alerts.map(alert => ({
    id: alert.id,
    type: alert.severity,
    title: alert.type,
    description: `${alert.department} - ${alert.type}`,
    time: new Date(alert.timestamp).toLocaleTimeString(),
    isRealTime: true
  })) : [
    {
      id: 1,
      type: 'warning',
      title: 'Budget Threshold Exceeded',
      description: 'Roads & Infrastructure budget is 85% utilized',
      time: '2 hours ago',
      isRealTime: false
    },
    {
      id: 2,
      type: 'error',
      title: 'Compliance Violation',
      description: 'Procurement process missing required documentation',
      time: '4 hours ago',
      isRealTime: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Audit Scheduled',
      description: 'AGSA audit scheduled for next week',
      time: '1 day ago',
      isRealTime: false
    },
    {
      id: 4,
      type: 'success',
      title: 'Report Generated',
      description: 'Monthly compliance report ready for review',
      time: '2 days ago',
      isRealTime: false
    }
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return <Warning color="warning" />;
      case 'error': return <Error color="error" />;
      case 'success': return <CheckCircle color="success" />;
      default: return <Info color="info" />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'success': return 'success';
      default: return 'info';
    }
  };

  return (
    <Box>
      {/* Add pulse animation styles */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
      
      {/* Real-Time Controls Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        p: 2,
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(0, 172, 193, 0.05) 100%)',
        border: '1px solid rgba(25, 118, 210, 0.1)'
      }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
            <Psychology sx={{ mr: 1, color: 'primary.main' }} />
            SAMS™ Real-Time Intelligence
          </Typography>
          {lastUpdate && (
            <Typography variant="caption" color="text.secondary">
              Last updated: {lastUpdate}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={isStreaming ? 'Pause real-time updates' : 'Start real-time updates'}>
            <Button
              variant={isStreaming ? 'contained' : 'outlined'}
              size="small"
              onClick={handleToggleStreaming}
              startIcon={isStreaming ? <Pause /> : <PlayArrow />}
              sx={{ minWidth: 120 }}
            >
              {isStreaming ? 'Live' : 'Start Live'}
            </Button>
          </Tooltip>
          <Tooltip title="Refresh data">
            <IconButton onClick={handleRefreshData} size="small">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 900, letterSpacing: '-0.03em', color: 'primary.main', textShadow: '0 2px 8px rgba(25, 118, 210, 0.10)' }}>
          Welcome back, {user?.name?.split(' ')[0]}!
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 600 }}>
          Here's what's happening with your municipal audit management today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{
              borderRadius: 4,
              background: 'rgba(255,255,255,0.85)',
              boxShadow: stat.isRealTime ? '0 8px 32px 0 rgba(0, 172, 193, 0.15)' : '0 8px 32px 0 rgba(25, 118, 210, 0.10)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: stat.isRealTime ? '1px solid rgba(0, 172, 193, 0.2)' : '1px solid rgba(25, 118, 210, 0.08)',
              transition: 'all 0.2s cubic-bezier(.4,2,.3,1)',
              position: 'relative',
              '&:hover': {
                boxShadow: '0 16px 48px 0 rgba(0, 172, 193, 0.15)',
                transform: 'translateY(-4px) scale(1.02)',
              },
            }}>
              {stat.isRealTime && (
                <Box sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 1
                }}>
                  <Badge
                    badgeContent="LIVE"
                    color="success"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        animation: isStreaming ? 'pulse 2s infinite' : 'none'
                      }
                    }}
                  />
                </Box>
              )}
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: `${stat.color}.main`,
                      width: 56,
                      height: 56,
                      mr: 2,
                      boxShadow: '0 2px 8px rgba(25, 118, 210, 0.10)',
                      fontSize: 32,
                      fontWeight: 700,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.03em' }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {stat.trend === 'up' ? (
                    <TrendingUp color="success" sx={{ mr: 1 }} />
                  ) : (
                    <TrendingDown color="error" sx={{ mr: 1 }} />
                  )}
                  <Typography
                    variant="body2"
                    color={stat.trend === 'up' ? 'success.main' : 'error.main'}
                    sx={{ fontWeight: 700 }}
                  >
                    {stat.change} from last month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Budget Overview */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 4, background: 'rgba(255,255,255,0.85)', boxShadow: '0 8px 32px 0 rgba(25, 118, 210, 0.10)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(25, 118, 210, 0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Budget Overview</Typography>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Roads & Infrastructure</Typography>
                      <Typography variant="body2" color="text.secondary">85%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={85} color="warning" />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Water & Sanitation</Typography>
                      <Typography variant="body2" color="text.secondary">62%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={62} color="primary" />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Public Safety</Typography>
                      <Typography variant="body2" color="text.secondary">45%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={45} color="success" />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Social Services</Typography>
                      <Typography variant="body2" color="text.secondary">73%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={73} color="info" />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Administration</Typography>
                      <Typography variant="body2" color="text.secondary">58%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={58} color="secondary" />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Emergency Services</Typography>
                      <Typography variant="body2" color="text.secondary">39%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={39} color="success" />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Paper>
        </Grid>

        {/* Recent Alerts */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 4, background: 'rgba(255,255,255,0.85)', boxShadow: '0 8px 32px 0 rgba(25, 118, 210, 0.10)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(25, 118, 210, 0.08)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Alerts
              </Typography>
              <List disablePadding>
                {recentAlerts.map((alert, index) => (
                  <React.Fragment key={alert.id}>
                    <ListItem disablePadding sx={{ 
                      py: 1,
                      borderRadius: 2,
                      background: alert.isRealTime ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                      border: alert.isRealTime ? `1px solid ${alpha(theme.palette.primary.main, 0.1)}` : 'none',
                      mb: 1,
                      px: 1
                    }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Box sx={{ position: 'relative' }}>
                          {getAlertIcon(alert.type)}
                          {alert.isRealTime && (
                            <Box sx={{
                              position: 'absolute',
                              top: -2,
                              right: -2,
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: 'success.main',
                              animation: isStreaming ? 'pulse 2s infinite' : 'none'
                            }} />
                          )}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {alert.title}
                            </Typography>
                            {alert.isRealTime ? (
                              <Chip
                                label="LIVE"
                                size="small"
                                color="success"
                                sx={{ 
                                  height: 16, 
                                  fontSize: '0.65rem',
                                  fontWeight: 700
                                }}
                              />
                            ) : (
                              <Chip
                                label={alert.type}
                                size="small"
                                color={getAlertColor(alert.type)}
                                variant="outlined"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              {alert.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              {alert.time}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentAlerts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;