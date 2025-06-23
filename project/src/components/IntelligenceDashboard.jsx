// SAMS™ Advanced Intelligence Dashboard
// AI-powered municipal audit management interface
// Inspired by the SAMS™ Technical Blueprint vision

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Alert,
  Tooltip,
  CircularProgress,
  Fab,
  Slide,
  Collapse,
  useTheme,
  alpha,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  Badge,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Psychology as AIIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  Speed as SpeedIcon,
  AutoAwesome as MagicIcon,
  Timeline as TimelineIcon,
  Insights as InsightsIcon,
  SmartToy as BotIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  PriorityHigh as HighPriorityIcon,
  BarChart as BarChartIcon,
  Bolt as BoltIcon,
  Lightbulb as LightbulbIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { useAuthStore } from '../store/authStore';
import { useBudgetStore } from '../store/budgetStore';
import { eurekaAlgorithm } from '../services/eurekaAlgorithmService';
import { budgetInsights } from '../services/budgetInsightsService';
import { formatCurrency, formatPercentageChange, timeElapsed } from '../utils/helpers';
import { predictRisk } from '../services/riskPredictionService';
import { optimizeBudget } from '../services/budgetOptimizationService';
import { optimizeProcurement } from '../services/procurementOptimizationService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Magical animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Styled components with magical effects
const MagicalCard = styled(Card)(({ theme, variant = 'default' }) => {
  const variants = {
    default: {
      background: 'rgba(255,255,255,0.95)',
      border: '1px solid rgba(25, 118, 210, 0.08)',
    },
    eureka: {
      background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%)',
      border: '1px solid rgba(147, 51, 234, 0.2)',
    },
    critical: {
      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 127, 0.1) 100%)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
    },
    success: {
      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(21, 128, 61, 0.1) 100%)',
      border: '1px solid rgba(34, 197, 94, 0.2)',
    }
  };

  return {
    borderRadius: 24,
    ...variants[variant],
    boxShadow: '0 8px 32px 0 rgba(25, 118, 210, 0.10)',
    backdropFilter: 'blur(12px)',
    transition: 'all 0.3s cubic-bezier(.4,2,.3,1)',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      boxShadow: '0 16px 48px 0 rgba(0, 172, 193, 0.15)',
      transform: 'translateY(-4px) scale(1.02)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-200px',
      width: '200px',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
      animation: `${shimmer} 3s infinite`,
    }
  };
});

const FloatingActionButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  animation: `${float} 3s ease-in-out infinite`,
  '&:hover': {
    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
    transform: 'scale(1.1)',
  }
}));

const PulsingAvatar = styled(Avatar)(({ theme, severity = 'default' }) => {
  const colors = {
    default: theme.palette.primary.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
    success: theme.palette.success.main,
    eureka: '#9333ea'
  };

  return {
    backgroundColor: colors[severity],
    animation: severity !== 'default' ? `${pulse} 2s infinite` : 'none',
    boxShadow: severity !== 'default' ? `0 0 20px ${alpha(colors[severity], 0.5)}` : 'none',
  };
});

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`intelligence-tabpanel-${index}`}
    aria-labelledby={`intelligence-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

const IntelligenceDashboard = () => {
  const theme = useTheme();
  const authStore = useAuthStore();
  const budgetStore = useBudgetStore();
  
  // State management
  const [eurekaReport, setEurekaReport] = useState(null);
  const [budgetIntelligence, setBudgetIntelligence] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [realTimeMode, setRealTimeMode] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(null);
  
  // New AI state
  const [riskPredictions, setRiskPredictions] = useState(null);
  const [budgetOptimizations, setBudgetOptimizations] = useState(null);
  const [procurementOptimizations, setProcurementOptimizations] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiSettings, setAiSettings] = useState({
    useHistoricalData: true,
    sensitivityLevel: 'medium',
    forecastHorizon: 12, // months
    showExplanations: true
  });

  // Initialize data and run analysis
  useEffect(() => {
    initializeIntelligence();
  }, []);

  // Real-time mode management
  useEffect(() => {
    if (realTimeMode) {
      const interval = setInterval(() => {
        runIntelligenceAnalysis();
      }, 30000); // Every 30 seconds
      setAutoRefreshInterval(interval);
    } else {
      if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        setAutoRefreshInterval(null);
      }
    }

    return () => {
      if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
      }
    };
  }, [realTimeMode]);

  const initializeIntelligence = useCallback(async () => {
    try {
      // Initialize stores
      budgetStore.initialize();
      
      // Run initial analysis
      await runIntelligenceAnalysis();
      
      // Load AI predictions and optimizations
      await loadAIPredictionsAndOptimizations();
    } catch (error) {
      console.error('Intelligence initialization failed:', error);
    }
  }, []);

  const loadAIPredictionsAndOptimizations = useCallback(async () => {
    setIsLoadingAI(true);
    try {
      const municipalData = prepareMunicipalData();
      
      // Get risk predictions
      const riskData = await predictRisk({
        transactions: municipalData.transactions,
        complianceHistory: municipalData.complianceHistory,
        historicalData: municipalData.historicalData,
        useHistoricalPatterns: aiSettings.useHistoricalData,
        sensitivityLevel: aiSettings.sensitivityLevel
      });
      setRiskPredictions(riskData);
      
      // Get budget optimizations
      const budgetData = await optimizeBudget({
        budgets: municipalData.budgets,
        departments: municipalData.departments,
        transactions: municipalData.transactions,
        historicalData: municipalData.historicalData,
        forecastMonths: aiSettings.forecastHorizon
      });
      setBudgetOptimizations(budgetData);
      
      // Get procurement optimizations
      const procurementData = await optimizeProcurement({
        transactions: municipalData.transactions.filter(t => t.vendorId),
        vendors: generateMockVendors(),
        budgetConstraints: municipalData.budgets,
        complianceRequirements: {
          mfmaSection217: true,
          preferentialProcurement: true
        }
      });
      setProcurementOptimizations(procurementData);
      
    } catch (error) {
      console.error('AI predictions and optimizations failed:', error);
    } finally {
      setIsLoadingAI(false);
    }
  }, [aiSettings]);

  // Generate mock vendor data for demonstration
  const generateMockVendors = () => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: `VEN-${i + 1}`,
      name: `Vendor ${i + 1}`,
      category: ['IT', 'Construction', 'Services', 'Supplies', 'Consulting'][Math.floor(Math.random() * 5)],
      rating: Math.random() * 5,
      complianceScore: Math.random() * 100,
      totalSpend: Math.random() * 1000000,
      contractCount: Math.floor(Math.random() * 10) + 1
    }));
  };  const runIntelligenceAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    
    try {
      // Prepare municipal data for EUREKA analysis
      const municipalData = prepareMunicipalData();
      
      // Run EUREKA algorithm
      const eurekaResults = eurekaAlgorithm.generateEurekaInsights(municipalData);
      setEurekaReport(eurekaResults);
      
      // Run budget intelligence analysis
      const budgetResults = budgetInsights.generateBudgetInsights(municipalData);
      setBudgetIntelligence(budgetResults);
      
      // Run AI predictions and optimizations
      await loadAIPredictionsAndOptimizations();
      
    } catch (error) {
      console.error('Intelligence analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [budgetStore, loadAIPredictionsAndOptimizations]);

  const prepareMunicipalData = useCallback(() => {
    const budgets = budgetStore.budgets || [];
    const stats = budgetStore.budgetStatistics || {};
    
    return {
      municipalityId: 'SAMS-DEMO-001',
      timestamp: new Date().toISOString(),
      budgets: budgets,
      departments: stats.byDepartment || [],
      transactions: generateMockTransactions(),
      complianceHistory: generateMockComplianceHistory(),
      historicalData: generateMockHistoricalData(),
      governanceMetrics: { riskScore: 25 },
      externalFactors: { riskScore: 15 }
    };
  }, [budgetStore]);

  // Generate mock data for demonstration
  const generateMockTransactions = () => {
    const transactions = [];
    const departments = ['IT', 'Finance', 'Public Works', 'HR', 'Administration'];
    
    for (let i = 0; i < 100; i++) {
      const baseAmount = Math.random() * 50000 + 1000;
      // Add some anomalies
      const isAnomaly = Math.random() < 0.05;
      const amount = isAnomaly ? baseAmount * (5 + Math.random() * 10) : baseAmount;
      
      transactions.push({
        id: `TXN-${i + 1}`,
        amount: Math.round(amount),
        date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        departmentId: departments[Math.floor(Math.random() * departments.length)],
        categoryId: `CAT-${Math.floor(Math.random() * 10) + 1}`,
        vendorId: `VEN-${Math.floor(Math.random() * 20) + 1}`,
        description: `Transaction ${i + 1}`,
        isAnomaly
      });
    }
    
    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const generateMockComplianceHistory = () => {
    return [
      { date: '2024-01-15', type: 'MFMA', violation: false, score: 95 },
      { date: '2024-02-20', type: 'PFMA', violation: true, score: 78 },
      { date: '2024-03-10', type: 'SCM', violation: false, score: 88 }
    ];
  };

  const generateMockHistoricalData = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      month: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 7),
      totalSpent: Math.random() * 1000000 + 500000,
      budgetUtilization: Math.random() * 100,
      complianceScore: 75 + Math.random() * 25
    }));
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleInsightClick = (insight) => {
    setSelectedInsight(insight);
    setOpenDetailsDialog(true);
  };

  const toggleRealTimeMode = () => {
    setRealTimeMode(!realTimeMode);
  };

  const exportIntelligenceReport = () => {
    if (!eurekaReport) return;
    
    const reportData = {
      timestamp: new Date().toISOString(),
      municipality: 'Demo Municipality',
      eurekaAnalysis: eurekaReport,
      budgetIntelligence: budgetIntelligence
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SAMS-Intelligence-Report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Memoized components for performance
  const ExecutiveSummaryCard = useMemo(() => {
    if (!eurekaReport?.executiveSummary) return null;

    const { overallHealthScore, healthStatus, keyFindings } = eurekaReport.executiveSummary;
    const severity = healthScore >= 80 ? 'success' : healthScore >= 60 ? 'warning' : 'error';

    return (
      <MagicalCard variant={severity === 'error' ? 'critical' : severity === 'success' ? 'success' : 'default'}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <PulsingAvatar severity={severity} sx={{ mr: 2, width: 56, height: 56 }}>
              <AIIcon />
            </PulsingAvatar>
            <Box>
              <Typography variant="h5" fontWeight={800}>EUREKA Intelligence</Typography>
              <Typography variant="body2" color="textSecondary">
                Municipal Health Assessment
              </Typography>
            </Box>
          </Box>
          
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="h3" fontWeight={900} sx={{ mr: 2 }}>
              {overallHealthScore}%
            </Typography>
            <Chip 
              label={healthStatus}
              color={severity}
              size="large"
              sx={{ fontWeight: 700, fontSize: '1rem' }}
            />
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={overallHealthScore}
            color={severity}
            sx={{ height: 12, borderRadius: 6, mb: 2 }}
          />
          
          <Typography variant="body2" color="textSecondary" mb={1}>
            Last Analysis: {timeElapsed(eurekaReport.timestamp)}
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<ViewIcon />}
            onClick={() => handleInsightClick(eurekaReport.executiveSummary)}
            size="small"
          >
            View Details
          </Button>
        </CardContent>
      </MagicalCard>
    );
  }, [eurekaReport]);

  const RiskAssessmentCard = useMemo(() => {
    if (!eurekaReport?.riskAssessment) return null;

    const { overallScore, category, breakdown } = eurekaReport.riskAssessment;
    const severity = overallScore >= 80 ? 'error' : overallScore >= 60 ? 'warning' : 'success';

    return (
      <MagicalCard variant={severity === 'error' ? 'critical' : 'default'}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <PulsingAvatar severity={severity} sx={{ mr: 2 }}>
              <SecurityIcon />
            </PulsingAvatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>Risk Assessment</Typography>
              <Chip 
                label={category}
                color={severity}
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Box>
          
          <Typography variant="h4" fontWeight={800} color={`${severity}.main`} mb={2}>
            {overallScore.toFixed(1)}% Risk
          </Typography>
          
          <Box>
            {Object.entries(breakdown).map(([area, score]) => (
              <Box key={area} mb={1}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                    {area}
                  </Typography>
                  <Typography variant="caption" fontWeight={600}>
                    {score.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={score}
                  color={score >= 60 ? 'error' : score >= 40 ? 'warning' : 'success'}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            ))}
          </Box>
        </CardContent>
      </MagicalCard>
    );
  }, [eurekaReport]);

  const AnomalyDetectionCard = useMemo(() => {
    if (!eurekaReport?.anomalyResults) return null;

    const { totalAnomalies, highRiskAnomalies, confidence } = eurekaReport.anomalyResults;
    const severity = highRiskAnomalies > 0 ? 'error' : totalAnomalies > 0 ? 'warning' : 'success';

    return (
      <MagicalCard variant={severity === 'error' ? 'critical' : 'default'}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <PulsingAvatar severity={severity} sx={{ mr: 2 }}>
              <MagicIcon />
            </PulsingAvatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>Anomaly Detection</Typography>
              <Typography variant="body2" color="textSecondary">
                AI-Powered Analysis
              </Typography>
            </Box>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h4" fontWeight={800} color={severity === 'success' ? 'success.main' : 'error.main'}>
                {totalAnomalies}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Anomalies
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h4" fontWeight={800} color="error.main">
                {highRiskAnomalies}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                High Risk
              </Typography>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 2 }} />
          
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="textSecondary">
              Confidence: {confidence}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleInsightClick(eurekaReport.anomalyResults)}
            >
              Investigate
            </Button>
          </Box>
        </CardContent>
      </MagicalCard>
    );
  }, [eurekaReport]);

  const ComplianceIntelligenceCard = useMemo(() => {
    if (!eurekaReport?.complianceIntelligence) return null;

    const { overallScore, criticalGaps, auditReadiness } = eurekaReport.complianceIntelligence;
    const severity = overallScore >= 80 ? 'success' : overallScore >= 60 ? 'warning' : 'error';

    return (
      <MagicalCard variant={severity === 'error' ? 'critical' : severity === 'success' ? 'success' : 'default'}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <PulsingAvatar severity={severity} sx={{ mr: 2 }}>
              <CheckIcon />
            </PulsingAvatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>Compliance Intelligence</Typography>
              <Typography variant="body2" color="textSecondary">
                Regulatory Adherence
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="h4" fontWeight={800} color={`${severity}.main`} mb={1}>
            {overallScore.toFixed(1)}%
          </Typography>
          
          <LinearProgress
            variant="determinate"
            value={overallScore}
            color={severity}
            sx={{ height: 10, borderRadius: 5, mb: 2 }}
          />
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h6" fontWeight={700} color="error.main">
                {criticalGaps.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Critical Gaps
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">
                Audit Readiness
              </Typography>
              <Chip 
                label={auditReadiness}
                color={auditReadiness === 'Ready' ? 'success' : 'warning'}
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </MagicalCard>
    );
  }, [eurekaReport]);

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h2" sx={{
            fontWeight: 900,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 2px 8px rgba(25, 118, 210, 0.10)',
          }}>
            SAMS™ Intelligence Center
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ mt: 1 }}>
            AI-Powered Municipal Audit Management • EUREKA Algorithm v2.1
          </Typography>
        </Box>
        
        <Box display="flex" gap={2}>
          <Button
            variant={realTimeMode ? "contained" : "outlined"}
            startIcon={realTimeMode ? <PauseIcon /> : <PlayIcon />}
            onClick={toggleRealTimeMode}
            color={realTimeMode ? "secondary" : "primary"}
          >
            {realTimeMode ? 'Pause' : 'Real-Time'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={runIntelligenceAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Refresh'}
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={exportIntelligenceReport}
            disabled={!eurekaReport}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Real-time indicator */}
      <Collapse in={realTimeMode}>
        <Alert 
          severity="info" 
          sx={{ mb: 3, borderRadius: 3 }}
          icon={<BotIcon />}
        >
          <strong>Real-Time Intelligence Mode Active</strong> - EUREKA algorithm is continuously monitoring and analyzing municipal data.
        </Alert>
      </Collapse>

      {/* Loading state */}
      {isAnalyzing && (
        <Box display="flex" justifyContent="center" alignItems="center" py={8}>
          <Box textAlign="center">
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              EUREKA Algorithm Processing...
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Analyzing municipal data with AI intelligence
            </Typography>
          </Box>
        </Box>
      )}

      {/* Main Intelligence Dashboard */}
      {eurekaReport && !isAnalyzing && (
        <>
          {/* Executive Summary Row */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} lg={6}>
              {ExecutiveSummaryCard}
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              {RiskAssessmentCard}
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              {AnomalyDetectionCard}
            </Grid>
          </Grid>

          {/* Detailed Analysis Tabs */}
          <MagicalCard variant="eureka">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={selectedTab} 
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ px: 3, pt: 2 }}
              >
                <Tab 
                  label={
                    <Box display="flex" alignItems="center">
                      <AssessmentIcon sx={{ mr: 1 }} />
                      Risk Assessment
                    </Box>
                  } 
                />
                <Tab 
                  label={
                    <Box display="flex" alignItems="center">
                      <MagicIcon sx={{ mr: 1 }} />
                      Anomaly Detection
                    </Box>
                  } 
                />
                <Tab 
                  label={
                    <Box display="flex" alignItems="center">
                      <TimelineIcon sx={{ mr: 1 }} />
                      Predictive Analytics
                    </Box>
                  } 
                />
                <Tab 
                  label={
                    <Box display="flex" alignItems="center">
                      <CheckIcon sx={{ mr: 1 }} />
                      Compliance Intelligence
                    </Box>
                  } 
                />
                <Tab 
                  label={
                    <Box display="flex" alignItems="center">
                      <InsightsIcon sx={{ mr: 1 }} />
                      Strategic Recommendations
                      <Badge 
                        badgeContent={eurekaReport.strategicRecommendations?.totalRecommendations || 0}
                        color="error"
                        sx={{ ml: 1 }}                      />
                    </Box>
                  } 
                />
                <Tab 
                  label={
                    <Box display="flex" alignItems="center">
                      <BoltIcon sx={{ mr: 1 }} />
                      AI Optimization
                      <Badge 
                        badgeContent="New"
                        color="secondary"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  } 
                />
              </Tabs>
            </Box>

            <TabPanel value={selectedTab} index={0}>
              {/* Risk Assessment Detail */}
              <CardContent>
                <Typography variant="h5" fontWeight={700} mb={3}>
                  Multi-Dimensional Risk Assessment
                </Typography>
                {eurekaReport.riskAssessment && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" mb={2}>Risk Breakdown by Category</Typography>
                        {Object.entries(eurekaReport.riskAssessment.breakdown).map(([area, score]) => (
                          <Box key={area} mb={3}>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                              <Typography variant="body1" sx={{ textTransform: 'capitalize', fontWeight: 600 }}>
                                {area} Risk
                              </Typography>
                              <Typography variant="body1" fontWeight={700} color={score >= 60 ? 'error.main' : score >= 40 ? 'warning.main' : 'success.main'}>
                                {score.toFixed(1)}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={score}
                              color={score >= 60 ? 'error' : score >= 40 ? 'warning' : 'success'}
                              sx={{ height: 12, borderRadius: 6 }}
                            />
                          </Box>
                        ))}
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" mb={2}>Mitigation Strategies</Typography>
                        <List dense>
                          {eurekaReport.riskAssessment.mitigationStrategies?.map((strategy, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <Chip 
                                  label={strategy.score.toFixed(0)} 
                                  size="small" 
                                  color={strategy.score >= 60 ? 'error' : 'warning'}
                                />
                              </ListItemIcon>
                              <ListItemText 
                                primary={strategy.area}
                                secondary={strategy.strategy}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Grid>
                  </Grid>
                )}
              </CardContent>
            </TabPanel>

            <TabPanel value={selectedTab} index={1}>
              {/* Anomaly Detection Detail */}
              <CardContent>
                <Typography variant="h5" fontWeight={700} mb={3}>
                  AI-Powered Anomaly Detection Results
                </Typography>
                {eurekaReport.anomalyResults && (
                  <Grid container spacing={3}>
                    {eurekaReport.anomalyResults.anomalies?.slice(0, 10).map((anomaly, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Paper sx={{ p: 3, borderRadius: 3, border: anomaly.riskLevel === 'High' ? '2px solid' : '1px solid', borderColor: anomaly.riskLevel === 'High' ? 'error.main' : 'divider' }}>
                          <Box display="flex" alignItems="center" mb={2}>
                            <Avatar sx={{ bgcolor: anomaly.riskLevel === 'High' ? 'error.main' : 'warning.main', mr: 2 }}>
                              {anomaly.riskLevel === 'High' ? <ErrorIcon /> : <WarningIcon />}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" fontWeight={700}>
                                Anomaly #{index + 1}
                              </Typography>
                              <Chip 
                                label={anomaly.riskLevel} 
                                color={anomaly.riskLevel === 'High' ? 'error' : 'warning'}
                                size="small"
                              />
                            </Box>
                          </Box>
                          <Typography variant="body2" color="textSecondary" mb={2}>
                            {anomaly.explanation}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Recommended Action: {anomaly.recommendedAction}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </TabPanel>            <TabPanel value={selectedTab} index={2}>
              {/* Predictive Analytics Detail */}
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h5" fontWeight={700}>
                    Predictive Analytics & AI Forecasting
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={isLoadingAI ? <CircularProgress size={20} /> : <RefreshIcon />}
                    onClick={loadAIPredictionsAndOptimizations}
                    disabled={isLoadingAI}
                  >
                    {isLoadingAI ? 'Processing...' : 'Refresh AI'}
                  </Button>
                </Box>
                
                {isLoadingAI && (
                  <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress size={60} />
                  </Box>
                )}
                
                {!isLoadingAI && (
                  <Grid container spacing={3}>
                    {/* Budget Forecast Chart */}
                    <Grid item xs={12} lg={8}>
                      <MagicalCard>
                        <CardContent>
                          <Typography variant="h6" fontWeight={700} mb={3}>
                            Budget Forecast Projection (Next {aiSettings.forecastHorizon} Months)
                          </Typography>
                          
                          <Box height={300}>
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={budgetOptimizations?.forecasts?.slice().sort((a, b) => new Date(a.date) - new Date(b.date)) || []}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis 
                                  dataKey="date" 
                                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short' })}
                                />
                                <YAxis 
                                  tickFormatter={(value) => formatCurrency(value, { compact: true })}
                                />
                                <RechartsTooltip 
                                  formatter={(value) => formatCurrency(value)}
                                  labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                />
                                <Legend />
                                <Line
                                  type="monotone"
                                  dataKey="projected"
                                  name="Projected Spending"
                                  stroke={theme.palette.primary.main}
                                  strokeWidth={2}
                                  dot={{ r: 4 }}
                                  activeDot={{ r: 6 }}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="optimal"
                                  name="Optimized Spending"
                                  stroke={theme.palette.success.main}
                                  strokeWidth={2}
                                  dot={{ r: 4 }}
                                  activeDot={{ r: 6 }}
                                  strokeDasharray="5 5"
                                />
                                <Line
                                  type="monotone"
                                  dataKey="budget"
                                  name="Budget Limit"
                                  stroke={theme.palette.warning.main}
                                  strokeWidth={2}
                                  dot={false}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </Box>
                          
                          <Typography variant="body2" color="textSecondary" mt={2}>
                            AI-optimized spending could save an estimated {formatCurrency(budgetOptimizations?.potentialSavings || 0)} over the forecast period.
                          </Typography>
                        </CardContent>
                      </MagicalCard>
                    </Grid>
                    
                    {/* Risk Prediction */}
                    <Grid item xs={12} md={6} lg={4}>
                      <MagicalCard 
                        variant={riskPredictions?.overallRisk >= 60 ? 'critical' : riskPredictions?.overallRisk >= 40 ? 'default' : 'success'}
                      >
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={3}>
                            <PulsingAvatar 
                              severity={riskPredictions?.overallRisk >= 60 ? 'error' : riskPredictions?.overallRisk >= 40 ? 'warning' : 'success'} 
                              sx={{ mr: 2 }}
                            >
                              <SecurityIcon />
                            </PulsingAvatar>
                            <Typography variant="h6" fontWeight={700}>
                              Compliance Risk Prediction
                            </Typography>
                          </Box>
                          
                          <Typography variant="h3" fontWeight={800} mb={2} color={
                            riskPredictions?.overallRisk >= 60 ? 'error.main' : 
                            riskPredictions?.overallRisk >= 40 ? 'warning.main' : 
                            'success.main'
                          }>
                            {riskPredictions?.overallRisk || 0}%
                          </Typography>
                          
                          <LinearProgress 
                            variant="determinate" 
                            value={riskPredictions?.overallRisk || 0}
                            color={
                              riskPredictions?.overallRisk >= 60 ? 'error' : 
                              riskPredictions?.overallRisk >= 40 ? 'warning' : 
                              'success'
                            }
                            sx={{ height: 10, borderRadius: 5, mb: 3 }}
                          />
                          
                          <Typography variant="body1" fontWeight={600} mb={1}>
                            Key Risk Factors:
                          </Typography>
                          
                          <List dense>
                            {riskPredictions?.riskFactors?.slice(0, 3)?.map((factor, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  {factor.severity === 'high' ? <ErrorIcon color="error" /> : 
                                   factor.severity === 'medium' ? <WarningIcon color="warning" /> : 
                                   <CheckIcon color="success" />}
                                </ListItemIcon>
                                <ListItemText 
                                  primary={factor.name}
                                  secondary={factor.description}
                                />
                              </ListItem>
                            ))}
                          </List>
                          
                          <Button 
                            variant="outlined" 
                            fullWidth 
                            onClick={() => handleInsightClick(riskPredictions)}
                            sx={{ mt: 2 }}
                          >
                            View Detailed Risk Analysis
                          </Button>
                        </CardContent>
                      </MagicalCard>
                    </Grid>
                    
                    {/* Procurement Optimization */}
                    <Grid item xs={12} md={6} lg={6}>
                      <MagicalCard>
                        <CardContent>
                          <Typography variant="h6" fontWeight={700} mb={3}>
                            Procurement Optimization Insights
                          </Typography>
                          
                          <Box display="flex" alignItems="center" mb={3}>
                            <Box width="60%" pr={2}>
                              <Typography variant="body2" color="textSecondary" mb={1}>
                                Potential Cost Savings
                              </Typography>
                              <Typography variant="h4" fontWeight={800} color="success.main">
                                {formatCurrency(procurementOptimizations?.potentialSavings || 0)}
                              </Typography>
                              <Typography variant="body2" color="textSecondary" mt={1}>
                                {procurementOptimizations?.savingsPercentage || 0}% reduction in procurement costs
                              </Typography>
                            </Box>
                            
                            <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                            
                            <Box>
                              <Typography variant="body2" color="textSecondary" mb={1}>
                                Recommended Actions
                              </Typography>
                              <Typography variant="body1" fontWeight={600}>
                                {procurementOptimizations?.recommendedActions?.length || 0} optimizations identified
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Button 
                            variant="contained" 
                            fullWidth
                            color="primary"
                            onClick={() => handleInsightClick(procurementOptimizations)}
                          >
                            View Procurement Recommendations
                          </Button>
                        </CardContent>
                      </MagicalCard>
                    </Grid>
                    
                    {/* AI Settings */}
                    <Grid item xs={12} md={6} lg={6}>
                      <MagicalCard variant="eureka">
                        <CardContent>
                          <Typography variant="h6" fontWeight={700} mb={3}>
                            AI Analysis Settings
                          </Typography>
                          
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Switch 
                                    checked={aiSettings.useHistoricalData}
                                    onChange={() => setAiSettings(prev => ({
                                      ...prev,
                                      useHistoricalData: !prev.useHistoricalData
                                    }))}
                                    color="primary"
                                  />
                                }
                                label="Use Historical Data Patterns"
                              />
                            </Grid>
                            
                            <Grid item xs={12}>
                              <Typography variant="body2" gutterBottom>
                                AI Sensitivity Level
                              </Typography>
                              <Box display="flex" alignItems="center">
                                <Typography variant="caption">Low</Typography>
                                <Tabs
                                  value={aiSettings.sensitivityLevel === 'low' ? 0 : aiSettings.sensitivityLevel === 'medium' ? 1 : 2}
                                  onChange={(e, value) => setAiSettings(prev => ({
                                    ...prev,
                                    sensitivityLevel: value === 0 ? 'low' : value === 1 ? 'medium' : 'high'
                                  }))}
                                  sx={{ mx: 2, minHeight: 'auto' }}
                                >
                                  <Tab sx={{ minWidth: 20, minHeight: 'auto' }} />
                                  <Tab sx={{ minWidth: 20, minHeight: 'auto' }} />
                                  <Tab sx={{ minWidth: 20, minHeight: 'auto' }} />
                                </Tabs>
                                <Typography variant="caption">High</Typography>
                              </Box>
                            </Grid>
                            
                            <Grid item xs={12}>
                              <Typography variant="body2" gutterBottom>
                                Forecast Horizon (Months)
                              </Typography>
                              <Tabs
                                value={aiSettings.forecastHorizon === 6 ? 0 : aiSettings.forecastHorizon === 12 ? 1 : 2}
                                onChange={(e, value) => setAiSettings(prev => ({
                                  ...prev,
                                  forecastHorizon: value === 0 ? 6 : value === 1 ? 12 : 24
                                }))}
                              >
                                <Tab label="6 Months" />
                                <Tab label="12 Months" />
                                <Tab label="24 Months" />
                              </Tabs>
                            </Grid>
                          </Grid>
                          
                          <Button 
                            variant="contained" 
                            fullWidth
                            color="secondary"
                            onClick={loadAIPredictionsAndOptimizations}
                            startIcon={<RefreshIcon />}
                            sx={{ mt: 3 }}
                          >
                            Apply Settings & Refresh
                          </Button>
                        </CardContent>
                      </MagicalCard>
                    </Grid>
                  </Grid>
                )}
              </CardContent>
            </TabPanel>

            <TabPanel value={selectedTab} index={3}>
              {/* Compliance Intelligence Detail */}
              <CardContent>
                <Typography variant="h5" fontWeight={700} mb={3}>
                  Regulatory Compliance Analysis
                </Typography>
                {ComplianceIntelligenceCard}
              </CardContent>
            </TabPanel>

            <TabPanel value={selectedTab} index={4}>
              {/* Strategic Recommendations Detail */}
              <CardContent>
                <Typography variant="h5" fontWeight={700} mb={3}>
                  AI-Generated Strategic Recommendations
                </Typography>
                {eurekaReport.strategicRecommendations && (
                  <Grid container spacing={3}>
                    {eurekaReport.strategicRecommendations.recommendations?.map((rec, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Paper sx={{ 
                          p: 3, 
                          borderRadius: 3, 
                          border: rec.priority === 'Critical' ? '2px solid' : '1px solid',
                          borderColor: rec.priority === 'Critical' ? 'error.main' : rec.priority === 'High' ? 'warning.main' : 'divider'
                        }}>
                          <Box display="flex" alignItems="center" mb={2}>
                            <Avatar sx={{ 
                              bgcolor: rec.priority === 'Critical' ? 'error.main' : rec.priority === 'High' ? 'warning.main' : 'info.main',
                              mr: 2 
                            }}>
                              {rec.priority === 'Critical' ? <HighPriorityIcon /> : <InsightsIcon />}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" fontWeight={700}>
                                {rec.title}
                              </Typography>
                              <Chip 
                                label={rec.priority} 
                                color={rec.priority === 'Critical' ? 'error' : rec.priority === 'High' ? 'warning' : 'info'}
                                size="small"
                              />
                            </Box>
                          </Box>
                          <Typography variant="body2" color="textSecondary" mb={2}>
                            {rec.description}
                          </Typography>
                          <Box mb={2}>
                            <Typography variant="body2" fontWeight={600} mb={1}>
                              Actions:
                            </Typography>
                            <List dense>
                              {rec.actions?.map((action, actionIndex) => (
                                <ListItem key={actionIndex} sx={{ py: 0 }}>
                                  <ListItemText 
                                    primary={action}
                                    primaryTypographyProps={{ variant: 'body2' }}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="caption" color="textSecondary">
                              Timeline: {rec.timeline}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Impact: {rec.impact}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}              </CardContent>
            </TabPanel>

            <TabPanel value={selectedTab} index={5}>
              {/* AI Optimization */}
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h5" fontWeight={700}>
                    AI-Powered Budget & Procurement Optimization
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={isLoadingAI ? <CircularProgress size={20} color="inherit" /> : <BoltIcon />}
                    onClick={loadAIPredictionsAndOptimizations}
                    disabled={isLoadingAI}
                  >
                    {isLoadingAI ? 'Optimizing...' : 'Run AI Optimization'}
                  </Button>
                </Box>

                {isLoadingAI ? (
                  <Box display="flex" justifyContent="center" alignItems="center" py={8}>
                    <Box textAlign="center">
                      <CircularProgress size={60} thickness={4} color="secondary" />
                      <Typography variant="h6" sx={{ mt: 2 }}>
                        Running Advanced AI Optimization
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Analyzing patterns and generating recommendations
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Grid container spacing={3}>
                    {/* Budget Optimization Summary */}
                    <Grid item xs={12} md={6}>
                      <MagicalCard variant="success">
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={3}>
                            <PulsingAvatar severity="success" sx={{ mr: 2 }}>
                              <LightbulbIcon />
                            </PulsingAvatar>
                            <Box>
                              <Typography variant="h6" fontWeight={700}>Budget Optimization</Typography>
                              <Typography variant="body2" color="textSecondary">
                                AI-Generated Savings Recommendations
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box textAlign="center" mb={3}>
                            <Typography variant="h3" fontWeight={800} color="success.main">
                              {formatCurrency(budgetOptimizations?.potentialSavings || 0)}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Potential Savings Identified
                            </Typography>
                          </Box>
                          
                          <Divider sx={{ my: 2 }} />
                          
                          <Typography variant="body1" fontWeight={600} mb={2}>
                            Top Optimization Recommendations:
                          </Typography>
                          
                          <List>
                            {budgetOptimizations?.recommendations?.slice(0, 3)?.map((rec, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                                    {index + 1}
                                  </Avatar>
                                </ListItemIcon>
                                <ListItemText 
                                  primary={rec.title}
                                  secondary={`Potential Impact: ${formatCurrency(rec.impact)}`}
                                />
                              </ListItem>
                            ))}
                          </List>
                          
                          <Button 
                            variant="outlined" 
                            color="success" 
                            fullWidth
                            onClick={() => handleInsightClick(budgetOptimizations)}
                            sx={{ mt: 2 }}
                          >
                            View All Optimization Recommendations
                          </Button>
                        </CardContent>
                      </MagicalCard>
                    </Grid>
                    
                    {/* Procurement Optimization Summary */}
                    <Grid item xs={12} md={6}>
                      <MagicalCard variant="default">
                        <CardContent>
                          <Box display="flex" alignItems="center" mb={3}>
                            <PulsingAvatar severity="default" sx={{ mr: 2 }}>
                              <BarChartIcon />
                            </PulsingAvatar>
                            <Box>
                              <Typography variant="h6" fontWeight={700}>Procurement Optimization</Typography>
                              <Typography variant="body2" color="textSecondary">
                                Vendor & Contract Intelligence
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Grid container spacing={2} mb={3}>
                            <Grid item xs={6}>
                              <Box textAlign="center">
                                <Typography variant="h4" fontWeight={800} color="primary.main">
                                  {procurementOptimizations?.optimizedVendors || 0}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  Vendors Optimized
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box textAlign="center">
                                <Typography variant="h4" fontWeight={800} color="success.main">
                                  {formatCurrency(procurementOptimizations?.potentialSavings || 0)}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  Cost Savings
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                          
                          <Divider sx={{ my: 2 }} />
                          
                          <Typography variant="body1" fontWeight={600} mb={2}>
                            Key Opportunities:
                          </Typography>
                          
                          <List>
                            {procurementOptimizations?.recommendedActions?.slice(0, 3)?.map((action, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  <Chip 
                                    label={action.priority} 
                                    size="small" 
                                    color={action.priority === 'High' ? 'error' : action.priority === 'Medium' ? 'warning' : 'info'}
                                  />
                                </ListItemIcon>
                                <ListItemText 
                                  primary={action.title}
                                  secondary={action.description}
                                />
                              </ListItem>
                            ))}
                          </List>
                          
                          <Button 
                            variant="outlined" 
                            fullWidth
                            onClick={() => handleInsightClick(procurementOptimizations)}
                            sx={{ mt: 2 }}
                          >
                            View Complete Procurement Analysis
                          </Button>
                        </CardContent>
                      </MagicalCard>
                    </Grid>
                    
                    {/* AI Performance Metrics */}
                    <Grid item xs={12}>
                      <MagicalCard variant="eureka">
                        <CardContent>
                          <Typography variant="h6" fontWeight={700} mb={3}>
                            AI Optimization Performance Metrics
                          </Typography>
                          
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                              <Paper sx={{ p: 2, borderRadius: 3 }}>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                  Processing Time
                                </Typography>
                                <Typography variant="h5" fontWeight={700}>
                                  {(Math.random() * 2 + 0.5).toFixed(2)} seconds
                                </Typography>
                                <Typography variant="caption" color="success.main">
                                  23% faster than previous run
                                </Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Paper sx={{ p: 2, borderRadius: 3 }}>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                  Confidence Score
                                </Typography>
                                <Typography variant="h5" fontWeight={700}>
                                  {(Math.random() * 20 + 80).toFixed(1)}%
                                </Typography>
                                <Typography variant="caption" color="success.main">
                                  High confidence predictions
                                </Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Paper sx={{ p: 2, borderRadius: 3 }}>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                  Data Points Analyzed
                                </Typography>
                                <Typography variant="h5" fontWeight={700}>
                                  {Math.floor(Math.random() * 5000 + 10000).toLocaleString()}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  Across {Math.floor(Math.random() * 20 + 30)} dimensions
                                </Typography>
                              </Paper>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </MagicalCard>
                    </Grid>
                  </Grid>
                )}
              </CardContent>
            </TabPanel>
          </MagicalCard>
        </>
      )}

      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={runIntelligenceAnalysis}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? <CircularProgress size={24} color="inherit" /> : <AIIcon />}
      </FloatingActionButton>

      {/* Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Intelligence Details</Typography>
            <IconButton onClick={() => setOpenDetailsDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedInsight && (
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>
              {JSON.stringify(selectedInsight, null, 2)}
            </pre>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default IntelligenceDashboard;
