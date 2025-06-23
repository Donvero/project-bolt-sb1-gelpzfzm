import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  CircularProgress,
  Chip,
  Divider,
  IconButton,
  Collapse,
  Alert,
  useTheme,
  alpha
} from '@mui/material';
import {
  AutoAwesome as MagicIcon,
  Psychology as AIIcon,
  Insights as InsightsIcon,
  Summarize as SummarizeIcon,
  Lightbulb as LightbulbIcon,
  BarChart as ChartIcon,
  TableChart as TableIcon,
  AttachMoney as MoneyIcon,
  Security as SecurityIcon,
  Business as BusinessIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ContentCopy as CopyIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useBudgetStore } from '../store/budgetStore';
import reportGenerator from '../services/reportGeneratorService';

// Styled components
const InsightCard = styled(Card)(({ theme, severity }) => {
  const severityColors = {
    critical: theme.palette.error.main,
    warning: theme.palette.warning.main,
    success: theme.palette.success.main,
    info: theme.palette.info.main,
    default: theme.palette.primary.main
  };
  
  const color = severityColors[severity] || severityColors.default;
  
  return {
    height: '100%',
    borderRadius: 16,
    boxShadow: `0 4px 20px ${alpha(color, 0.15)}`,
    border: `1px solid ${alpha(color, 0.2)}`,
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 8px 30px ${alpha(color, 0.25)}`
    }
  };
});

const InsightIcon = styled(Box)(({ theme, severity }) => {
  const severityColors = {
    critical: theme.palette.error.main,
    warning: theme.palette.warning.main,
    success: theme.palette.success.main,
    info: theme.palette.info.main,
    default: theme.palette.primary.main
  };
  
  const color = severityColors[severity] || severityColors.default;
  
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: alpha(color, 0.1),
    color: color,
    marginRight: theme.spacing(2)
  };
});

// Natural Language Insights component
const NaturalLanguageInsights = () => {
  const theme = useTheme();
  const budgetStore = useBudgetStore();
  
  // State for insights
  const [insightType, setInsightType] = useState('executive');
  const [isGenerating, setIsGenerating] = useState(false);
  const [insights, setInsights] = useState(null);
  const [query, setQuery] = useState('');
  const [expandedInsights, setExpandedInsights] = useState({});
  const [promptHistory, setPromptHistory] = useState([]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [error, setError] = useState(null);
  
  // Initialize
  useEffect(() => {
    budgetStore.initialize();
  }, []);
  
  // Generate insights
  const generateInsights = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Prepare data for insights generation
      const data = prepareDataForInsights();
      
      // Generate insights
      const generatedInsights = await reportGenerator.generateNaturalLanguageInsights(data);
      
      setInsights(generatedInsights);
      
      // Add query to history if it's a custom query
      if (customPrompt) {
        setPromptHistory([
          { prompt: customPrompt, timestamp: new Date().toISOString() },
          ...promptHistory
        ]);
        setCustomPrompt('');
      }
    } catch (err) {
      console.error('Failed to generate insights:', err);
      setError('Failed to generate insights. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Prepare data for insights generation
  const prepareDataForInsights = () => {
    const budgets = budgetStore.budgets || [];
    const stats = budgetStore.budgetStatistics || {};
    
    // Calculate overall budget utilization
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = budgets.reduce((sum, budget) => sum + (budget.spent || 0), 0);
    const utilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    
    // Mock data for demonstration
    return {
      municipality: 'Demo Municipality',
      fiscalPeriod: `${new Date().getFullYear()} Financial Year`,
      budgetUtilization: utilization,
      complianceScore: 85,
      riskLevel: 'Medium',
      anomaliesDetected: 3,
      highRiskAreas: ['Procurement', 'Capital Projects'],
      mediumRiskAreas: ['HR', 'IT Operations'],
      keyMetrics: [
        { name: 'Total Budget', value: totalBudget, status: 'Good' },
        { name: 'Total Spent', value: totalSpent, status: 'Good' },
        { name: 'Remaining Budget', value: totalBudget - totalSpent, status: totalBudget - totalSpent > 0 ? 'Good' : 'Critical' },
        { name: 'Departments', value: stats.byDepartment?.length || 0, status: 'Good' }
      ],
      prompt: customPrompt || null,
      insights: insightType
    };
  };
  
  // Toggle expanded insight
  const toggleInsight = (id) => {
    setExpandedInsights({
      ...expandedInsights,
      [id]: !expandedInsights[id]
    });
  };
  
  // Get icon for insight card
  const getInsightIcon = (type) => {
    switch (type) {
      case 'budgetUtilization':
        return <MoneyIcon />;
      case 'complianceStatus':
        return <SecurityIcon />;
      case 'riskAssessment':
        return <BusinessIcon />;
      default:
        return <InsightsIcon />;
    }
  };
  
  // Get severity for insight card
  const getInsightSeverity = (insight) => {
    if (!insight || !insight.status) return 'default';
    
    switch (insight.status.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'critical';
      case 'warning':
      case 'medium':
        return 'warning';
      case 'good':
      case 'low':
        return 'success';
      default:
        return 'info';
    }
  };
  
  // Save insights
  const saveInsights = () => {
    if (!insights) return;
    
    const insightsText = JSON.stringify(insights, null, 2);
    const blob = new Blob([insightsText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `insights-${insightType}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };
  
  // Copy insight to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };
  
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Natural Language Insights
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Generate human-readable explanations and insights from complex municipal financial data.
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Generate Insights
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Choose an insight type or ask a specific question about your financial data.
            </Typography>
            
            <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
              <Chip
                icon={<SummarizeIcon />}
                label="Executive Summary"
                clickable
                color={insightType === 'executive' ? 'primary' : 'default'}
                onClick={() => setInsightType('executive')}
              />
              <Chip
                icon={<MoneyIcon />}
                label="Budget Analysis"
                clickable
                color={insightType === 'budget' ? 'primary' : 'default'}
                onClick={() => setInsightType('budget')}
              />
              <Chip
                icon={<SecurityIcon />}
                label="Compliance Status"
                clickable
                color={insightType === 'compliance' ? 'primary' : 'default'}
                onClick={() => setInsightType('compliance')}
              />
              <Chip
                icon={<BusinessIcon />}
                label="Risk Assessment"
                clickable
                color={insightType === 'risk' ? 'primary' : 'default'}
                onClick={() => setInsightType('risk')}
              />
              <Chip
                icon={<LightbulbIcon />}
                label="Recommendations"
                clickable
                color={insightType === 'recommendations' ? 'primary' : 'default'}
                onClick={() => setInsightType('recommendations')}
              />
            </Box>
            
            <Typography variant="subtitle2" gutterBottom>
              Or ask a specific question:
            </Typography>
            
            <TextField
              fullWidth
              variant="outlined"
              placeholder="e.g., What are the key budget trends this quarter?"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <Button
              variant="contained"
              color="primary"
              startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <MagicIcon />}
              onClick={generateInsights}
              disabled={isGenerating}
              fullWidth
            >
              {isGenerating ? 'Generating Insights...' : 'Generate Natural Language Insights'}
            </Button>
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Previous Queries
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Quickly access your previous insight requests.
            </Typography>
            
            {promptHistory.length > 0 ? (
              <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                {promptHistory.map((item, index) => (
                  <Chip
                    key={index}
                    label={item.prompt}
                    size="medium"
                    onClick={() => {
                      setCustomPrompt(item.prompt);
                      setInsightType('custom');
                    }}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No previous queries. Ask a question to get started.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
      
      {insights && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={600}>
              Generated Insights
            </Typography>
            
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={saveInsights}
            >
              Save Insights
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {/* Main Insights */}
            {insights.budgetUtilization && (
              <Grid item xs={12} md={4}>
                <InsightCard severity={getInsightSeverity(insights.budgetUtilization)}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <InsightIcon severity={getInsightSeverity(insights.budgetUtilization)}>
                        {getInsightIcon('budgetUtilization')}
                      </InsightIcon>
                      <Typography variant="h6" fontWeight={600}>
                        {insights.budgetUtilization.title}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" paragraph>
                      {insights.budgetUtilization.description}
                    </Typography>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Chip 
                        label={insights.budgetUtilization.status} 
                        size="small" 
                        color={
                          insights.budgetUtilization.status === 'high' ? 'error' :
                          insights.budgetUtilization.status === 'low' ? 'warning' :
                          'success'
                        }
                      />
                      
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(insights.budgetUtilization.description)}
                      >
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </InsightCard>
              </Grid>
            )}
            
            {insights.complianceStatus && (
              <Grid item xs={12} md={4}>
                <InsightCard severity={getInsightSeverity(insights.complianceStatus)}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <InsightIcon severity={getInsightSeverity(insights.complianceStatus)}>
                        {getInsightIcon('complianceStatus')}
                      </InsightIcon>
                      <Typography variant="h6" fontWeight={600}>
                        {insights.complianceStatus.title}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" paragraph>
                      {insights.complianceStatus.description}
                    </Typography>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Chip 
                        label={insights.complianceStatus.status} 
                        size="small" 
                        color={
                          insights.complianceStatus.status === 'critical' ? 'error' :
                          insights.complianceStatus.status === 'warning' ? 'warning' :
                          'success'
                        }
                      />
                      
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(insights.complianceStatus.description)}
                      >
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </InsightCard>
              </Grid>
            )}
            
            {insights.riskAssessment && (
              <Grid item xs={12} md={4}>
                <InsightCard severity={getInsightSeverity(insights.riskAssessment)}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <InsightIcon severity={getInsightSeverity(insights.riskAssessment)}>
                        {getInsightIcon('riskAssessment')}
                      </InsightIcon>
                      <Typography variant="h6" fontWeight={600}>
                        {insights.riskAssessment.title}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" paragraph>
                      {insights.riskAssessment.description}
                    </Typography>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Chip 
                        label={insights.riskAssessment.status} 
                        size="small" 
                        color={
                          insights.riskAssessment.status === 'high' ? 'error' :
                          insights.riskAssessment.status === 'medium' ? 'warning' :
                          'success'
                        }
                      />
                      
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(insights.riskAssessment.description)}
                      >
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </InsightCard>
              </Grid>
            )}
            
            {/* Key Findings */}
            {insights.keyFindings && insights.keyFindings.length > 0 && (
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 3, mb: 3 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <InsightIcon severity="info">
                        <LightbulbIcon />
                      </InsightIcon>
                      <Typography variant="h6" fontWeight={600}>
                        Key Findings
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      {insights.keyFindings.map((finding, index) => (
                        <Grid item xs={12} key={index}>
                          <Paper 
                            sx={{ 
                              p: 2, 
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: finding.impact === 'High' ? 'error.main' : 
                                          finding.impact === 'Medium' ? 'warning.main' : 
                                          'divider'
                            }}
                          >
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {finding.title}
                              </Typography>
                              
                              <Box>
                                <Chip 
                                  label={finding.impact} 
                                  size="small" 
                                  color={
                                    finding.impact === 'High' ? 'error' :
                                    finding.impact === 'Medium' ? 'warning' :
                                    finding.impact === 'Positive' ? 'success' :
                                    'default'
                                  }
                                  sx={{ mr: 1 }}
                                />
                                
                                <Chip 
                                  label={finding.area} 
                                  size="small" 
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                            
                            <Collapse in={expandedInsights[`finding-${index}`] !== false} defaultExpanded>
                              <Typography variant="body2">
                                {finding.description}
                              </Typography>
                            </Collapse>
                            
                            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                              <IconButton
                                size="small"
                                onClick={() => toggleInsight(`finding-${index}`)}
                              >
                                {expandedInsights[`finding-${index}`] === false ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                              </IconButton>
                              
                              <IconButton
                                size="small"
                                onClick={() => copyToClipboard(`${finding.title}: ${finding.description}`)}
                              >
                                <CopyIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
            
            {/* Recommendations */}
            {insights.recommendations && insights.recommendations.length > 0 && (
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <InsightIcon severity="success">
                        <MagicIcon />
                      </InsightIcon>
                      <Typography variant="h6" fontWeight={600}>
                        AI-Generated Recommendations
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      {insights.recommendations.map((recommendation, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Paper 
                            sx={{ 
                              p: 2, 
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: recommendation.priority === 'High' ? 'error.main' : 
                                          recommendation.priority === 'Medium' ? 'warning.main' : 
                                          'divider'
                            }}
                          >
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {recommendation.title}
                              </Typography>
                              
                              <Chip 
                                label={recommendation.priority} 
                                size="small" 
                                color={
                                  recommendation.priority === 'High' ? 'error' :
                                  recommendation.priority === 'Medium' ? 'warning' :
                                  'default'
                                }
                              />
                            </Box>
                            
                            <Collapse in={expandedInsights[`recommendation-${index}`] !== false} defaultExpanded>
                              <Typography variant="body2" paragraph>
                                {recommendation.description}
                              </Typography>
                              
                              <Typography variant="body2" fontWeight={600}>
                                Estimated Impact:
                              </Typography>
                              <Typography variant="body2">
                                {recommendation.estimatedImpact}
                              </Typography>
                            </Collapse>
                            
                            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                              <IconButton
                                size="small"
                                onClick={() => toggleInsight(`recommendation-${index}`)}
                              >
                                {expandedInsights[`recommendation-${index}`] === false ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                              </IconButton>
                              
                              <IconButton
                                size="small"
                                onClick={() => copyToClipboard(`${recommendation.title}: ${recommendation.description}`)}
                              >
                                <CopyIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default NaturalLanguageInsights;
