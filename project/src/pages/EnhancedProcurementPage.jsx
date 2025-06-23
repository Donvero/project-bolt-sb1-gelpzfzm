// SAMS™ Advanced Procurement Management System
// AI-powered procurement and vendor management
// Inspired by the SAMS™ Technical Blueprint vision

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tab,
  Tabs,
  Paper,
  LinearProgress,
  Tooltip,
  Badge,
  Alert,
  AlertTitle,
  Divider,
  useTheme,
  alpha,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  ShoppingCart as ProcurementIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Business as VendorIcon,
  Assessment as AnalyticsIcon,
  Security as ComplianceIcon,
  Psychology as AIIcon,
  AutoAwesome as MagicIcon,
  Timeline as TimelineIcon,
  ExpandMore as ExpandMoreIcon,
  DocumentScanner as DocumentIcon,
  Gavel as BidIcon,
  LocalShipping as DeliveryIcon,
  Payment as PaymentIcon,
  Star as StarIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';

const ProcurementPage = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [procurements, setProcurements] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);

  // Initialize with sample data
  useEffect(() => {
    const sampleProcurements = [
      {
        id: 'PROC-2024-001',
        title: 'Road Infrastructure Maintenance',
        department: 'Public Works',
        value: 25000000,
        status: 'In Progress',
        vendor: 'Advanced Construction Ltd',
        startDate: '2024-01-15',
        endDate: '2024-06-30',
        progress: 65,
        complianceScore: 92,
        riskLevel: 'Low',
        documents: 15,
        bids: 5
      },
      {
        id: 'PROC-2024-002',
        title: 'Municipal Software Licenses',
        department: 'IT Services',
        value: 8500000,
        status: 'Bidding',
        vendor: 'TBD',
        startDate: '2024-02-01',
        endDate: '2024-07-31',
        progress: 25,
        complianceScore: 88,
        riskLevel: 'Medium',
        documents: 8,
        bids: 12
      },
      {
        id: 'PROC-2024-003',
        title: 'Water Treatment Equipment',
        department: 'Water & Sanitation',
        value: 45000000,
        status: 'Planning',
        vendor: 'AquaTech Solutions',
        startDate: '2024-03-01',
        endDate: '2024-12-31',
        progress: 15,
        complianceScore: 95,
        riskLevel: 'High',
        documents: 22,
        bids: 3
      }
    ];

    const sampleVendors = [
      {
        id: 'VEN-001',
        name: 'Advanced Construction Ltd',
        category: 'Construction',
        rating: 4.8,
        totalContracts: 15,
        activeContracts: 3,
        complianceScore: 92,
        totalValue: 125000000,
        established: '2010'
      },
      {
        id: 'VEN-002',
        name: 'TechFlow Systems',
        category: 'IT Services',
        rating: 4.6,
        totalContracts: 22,
        activeContracts: 5,
        complianceScore: 88,
        totalValue: 85000000,
        established: '2015'
      },
      {
        id: 'VEN-003',
        name: 'AquaTech Solutions',
        category: 'Water Management',
        rating: 4.9,
        totalContracts: 8,
        activeContracts: 2,
        complianceScore: 95,
        totalValue: 67000000,
        established: '2008'
      }
    ];

    setProcurements(sampleProcurements);
    setVendors(sampleVendors);
    generateAIInsights(sampleProcurements, sampleVendors);
  }, []);

  const generateAIInsights = (procurementData, vendorData) => {
    // Simulate AI-powered insights
    const insights = {
      totalValue: procurementData.reduce((sum, p) => sum + p.value, 0),
      averageComplianceScore: procurementData.reduce((sum, p) => sum + p.complianceScore, 0) / procurementData.length,
      riskDistribution: {
        low: procurementData.filter(p => p.riskLevel === 'Low').length,
        medium: procurementData.filter(p => p.riskLevel === 'Medium').length,
        high: procurementData.filter(p => p.riskLevel === 'High').length
      },
      topVendors: vendorData.sort((a, b) => b.rating - a.rating).slice(0, 3),
      recommendations: [
        {
          type: 'optimization',
          title: 'Vendor Consolidation Opportunity',
          description: 'Consider consolidating IT services with top-rated vendors to reduce costs by ~15%',
          impact: 'Medium',
          savings: 2500000
        },
        {
          type: 'compliance',
          title: 'Document Management Enhancement',
          description: 'Implement automated document verification to improve compliance scores',
          impact: 'High',
          savings: 0
        },
        {
          type: 'risk',
          title: 'High-Value Project Monitoring',
          description: 'Water Treatment Equipment project requires enhanced monitoring due to high value and risk',
          impact: 'Critical',
          savings: 0
        }
      ]
    };
    setAiInsights(insights);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'primary';
      case 'Bidding': return 'warning';
      case 'Planning': return 'info';
      case 'Completed': return 'success';
      default: return 'default';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'error';
      default: return 'default';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" gutterBottom sx={{ 
          fontWeight: 900, 
          letterSpacing: '-0.03em', 
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <ProcurementIcon sx={{ fontSize: '2rem' }} />
          Procurement Management
          <Chip
            icon={<AIIcon />}
            label="AI-Enhanced"
            color="primary"
            variant="outlined"
            sx={{ ml: 2 }}
          />
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
          Intelligent procurement oversight with AI-driven insights and compliance monitoring
        </Typography>
      </Box>

      {/* AI Insights Dashboard */}
      {aiInsights && (
        <Paper sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(0, 172, 193, 0.05) 100%)',
          border: '1px solid rgba(25, 118, 210, 0.1)'
        }}>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <MagicIcon sx={{ mr: 1, color: 'primary.main' }} />
            AI-Powered Insights
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Card sx={{ 
                borderRadius: 3, 
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(25, 118, 210, 0.1)'
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="primary.main" sx={{ fontWeight: 900 }}>
                    {formatCurrency(aiInsights.totalValue)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Portfolio Value
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ 
                borderRadius: 3, 
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(25, 118, 210, 0.1)'
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="success.main" sx={{ fontWeight: 900 }}>
                    {aiInsights.averageComplianceScore.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Compliance Score
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ 
                borderRadius: 3, 
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(25, 118, 210, 0.1)'
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="info.main" sx={{ fontWeight: 900 }}>
                    {procurements.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Procurements
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ 
                borderRadius: 3, 
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(25, 118, 210, 0.1)'
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="warning.main" sx={{ fontWeight: 900 }}>
                    {aiInsights.riskDistribution.high}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    High Risk Projects
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* AI Recommendations */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              AI Recommendations
            </Typography>
            <Grid container spacing={2}>
              {aiInsights.recommendations.map((rec, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Alert 
                    severity={rec.impact === 'Critical' ? 'error' : rec.impact === 'High' ? 'warning' : 'info'}
                    sx={{ borderRadius: 2 }}
                  >
                    <AlertTitle>{rec.title}</AlertTitle>
                    <Typography variant="body2">{rec.description}</Typography>
                    {rec.savings > 0 && (
                      <Typography variant="caption" sx={{ display: 'block', mt: 1, fontWeight: 700 }}>
                        Potential Savings: {formatCurrency(rec.savings)}
                      </Typography>
                    )}
                  </Alert>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      )}

      {/* Main Content Tabs */}
      <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '1rem'
            }
          }}
        >
          <Tab icon={<ProcurementIcon />} label="Active Procurements" />
          <Tab icon={<VendorIcon />} label="Vendor Management" />
          <Tab icon={<AnalyticsIcon />} label="Analytics" />
          <Tab icon={<ComplianceIcon />} label="Compliance" />
        </Tabs>

        {/* Active Procurements Tab */}
        <TabPanel value={currentTab} index={0}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Active Procurement Projects</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
                sx={{ borderRadius: 3 }}
              >
                New Procurement
              </Button>
            </Box>

            <Grid container spacing={3}>
              {procurements.map((procurement) => (
                <Grid item xs={12} key={procurement.id}>
                  <Card sx={{ 
                    borderRadius: 3,
                    border: '1px solid rgba(0,0,0,0.05)',
                    '&:hover': {
                      boxShadow: theme.shadows[8],
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={4}>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                              {procurement.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {procurement.department} • {procurement.id}
                            </Typography>
                            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                              {formatCurrency(procurement.value)}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Chip
                              label={procurement.status}
                              color={getStatusColor(procurement.status)}
                              variant="filled"
                              sx={{ mb: 1, fontWeight: 600 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {procurement.vendor}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                              <Typography variant="body2" sx={{ mr: 1 }}>Progress</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {procurement.progress}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={procurement.progress}
                              sx={{ borderRadius: 2, height: 6 }}
                            />
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Chip
                              label={`${procurement.riskLevel} Risk`}
                              color={getRiskColor(procurement.riskLevel)}
                              size="small"
                              sx={{ mb: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              Compliance: {procurement.complianceScore}%
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Tooltip title="View Details">
                              <IconButton size="small">
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton size="small">
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </TabPanel>

        {/* Vendor Management Tab */}
        <TabPanel value={currentTab} index={1}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Vendor Performance Dashboard</Typography>
            
            <Grid container spacing={3}>
              {vendors.map((vendor) => (
                <Grid item xs={12} md={6} lg={4} key={vendor.id}>
                  <Card sx={{ 
                    borderRadius: 3,
                    height: '100%',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{ 
                            bgcolor: 'primary.main', 
                            mr: 2,
                            width: 48,
                            height: 48
                          }}
                        >
                          <VendorIcon />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {vendor.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {vendor.category}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <StarIcon sx={{ color: 'orange', mr: 0.5, fontSize: 20 }} />
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {vendor.rating}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Total Contracts
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {vendor.totalContracts}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Active Contracts
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {vendor.activeContracts}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            Total Contract Value
                          </Typography>
                          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                            {formatCurrency(vendor.totalValue)}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Compliance Score</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {vendor.complianceScore}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={vendor.complianceScore}
                          color={vendor.complianceScore > 90 ? 'success' : vendor.complianceScore > 80 ? 'primary' : 'warning'}
                          sx={{ borderRadius: 2, height: 6 }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={currentTab} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Procurement Analytics</Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Risk Distribution</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="success.main" sx={{ fontWeight: 900 }}>
                          {aiInsights?.riskDistribution.low || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Low Risk</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="warning.main" sx={{ fontWeight: 900 }}>
                          {aiInsights?.riskDistribution.medium || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Medium Risk</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="error.main" sx={{ fontWeight: 900 }}>
                          {aiInsights?.riskDistribution.high || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">High Risk</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Department Breakdown</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Public Works" secondary="R 25M active" />
                      <ListItemSecondaryAction>
                        <Chip label="1 Project" size="small" />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="IT Services" secondary="R 8.5M active" />
                      <ListItemSecondaryAction>
                        <Chip label="1 Project" size="small" />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Water & Sanitation" secondary="R 45M active" />
                      <ListItemSecondaryAction>
                        <Chip label="1 Project" size="small" />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        {/* Compliance Tab */}
        <TabPanel value={currentTab} index={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Compliance Monitoring</Typography>
            
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              <AlertTitle>MFMA Compliance Status</AlertTitle>
              All active procurements are currently compliant with Municipal Finance Management Act requirements.
            </Alert>

            <Grid container spacing={3}>
              {procurements.map((procurement) => (
                <Grid item xs={12} key={procurement.id}>
                  <Accordion sx={{ borderRadius: 2, border: '1px solid rgba(0,0,0,0.05)' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, flexGrow: 1 }}>
                          {procurement.title}
                        </Typography>
                        <Chip
                          label={`${procurement.complianceScore}% Compliant`}
                          color={procurement.complianceScore > 90 ? 'success' : 'warning'}
                          size="small"
                          sx={{ mr: 2 }}
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Document Compliance
                          </Typography>
                          <List dense>
                            <ListItem>
                              <ListItemIcon>
                                <CheckCircleIcon color="success" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary="Bid Documents" secondary="Complete" />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <CheckCircleIcon color="success" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary="MFMA Section 217 Compliance" secondary="Verified" />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <WarningIcon color="warning" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary="Performance Guarantees" secondary="Pending Review" />
                            </ListItem>
                          </List>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Process Compliance
                          </Typography>
                          <List dense>
                            <ListItem>
                              <ListItemIcon>
                                <CheckCircleIcon color="success" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary="Public Advertisement" secondary="28 days" />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <CheckCircleIcon color="success" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary="Bid Evaluation" secondary="Committee Approved" />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <CheckCircleIcon color="success" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary="Award Process" secondary="Council Approved" />
                            </ListItem>
                          </List>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              ))}
            </Grid>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default ProcurementPage;
