import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  Button,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import { 
  Assessment, 
  AccountTree, 
  Approval, 
  Description, 
  CheckCircle, 
  Warning, 
  Error, 
  DonutLarge,
  PlayArrow,
  Pause,
  Refresh,
  MoreVert,
  FilterList,
  Search,
  Assignment,
  Schedule,
  VerifiedUser,
  DescriptionOutlined,
  HourglassEmpty,
  AttachFile,
  TrendingUp,
  Lightbulb,
  LinearProgress
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { workflowIntelligenceService } from '../services/workflowIntelligenceService';
import Avatar from '@mui/material/Avatar';

const WorkflowDashboard = () => {
  const theme = useTheme();
  const [workflowStats, setWorkflowStats] = useState(null);
  const [activeWorkflows, setActiveWorkflows] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [workflowInsights, setWorkflowInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);

  const statusColors = {
    'completed': theme.palette.success.main,
    'in-progress': theme.palette.primary.main,
    'pending': theme.palette.warning.main,
    'rejected': theme.palette.error.main,
    'paused': theme.palette.grey[500],
  };

  const WORKFLOW_TYPES = {
    'BUDGET_APPROVAL': 'Budget Approval',
    'PROCUREMENT_REQUEST': 'Procurement Request',
    'INVOICE_PROCESSING': 'Invoice Processing',
    'COMPLIANCE_REVIEW': 'Compliance Review',
    'AUDIT_PREPARATION': 'Audit Preparation',
    'BUDGET_ADJUSTMENT': 'Budget Adjustment'
  };
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Initialize the service
        await workflowIntelligenceService.initialize();
        
        // Load workflow statistics
        const analytics = workflowIntelligenceService.getWorkflowAnalytics();
        
        // Transform data for dashboard
        const stats = {
          activeWorkflows: analytics.activeWorkflows,
          activeWorkflowsChange: 5, // Mock percentage change
          pendingApprovals: analytics.pendingApprovals,
          pendingApprovalsUrgent: analytics.highPriorityApprovals,
          avgCompletionTime: analytics.avgCompletionTime.toFixed(1) + ' hours',
          avgCompletionTimeChange: -2, // Mock percentage change
          complianceScore: 92, // Mock score
          complianceScoreChange: 3, // Mock percentage change
          
          // Create mock data for charts
          workflowTypeDistribution: [
            { name: 'Budget Approval', value: 35 },
            { name: 'Procurement', value: 25 },
            { name: 'Document Approval', value: 40 }
          ],
          
          workflowStatusDistribution: [
            { name: 'In Progress', value: analytics.activeWorkflows },
            { name: 'Completed', value: analytics.completedWorkflows },
            { name: 'Pending', value: analytics.pendingApprovals },
            { name: 'Paused', value: 2 }  // Mock value
          ]
        };
        
        setWorkflowStats(stats);
        
        // Load active workflows
        const instances = workflowIntelligenceService.getWorkflowInstances({ status: 'in-progress' });
        const formattedWorkflows = instances.map(instance => ({
          id: instance.id,
          type: instance.templateId.replace('-workflow', '').toUpperCase(),
          title: instance.name,
          status: instance.status,
          startDate: instance.createdAt,
          currentStep: instance.currentStage,
          priority: instance.data && instance.data.risk ? 
                    (instance.data.risk > 70 ? 'high' : 
                     instance.data.risk > 30 ? 'medium' : 'low') : 'medium',
          progress: Math.random() * 100, // Mock progress value
          steps: instance.history.map(h => ({
            name: h.stage,
            description: h.comments,
            timestamp: h.timestamp || h.completedAt,
            status: 'completed',
            type: h.stage.includes('approval') ? 'approval' : 
                  h.stage.includes('document') ? 'document' : 
                  h.stage.includes('compliance') ? 'compliance' : 'task',
            assignee: h.actor
          }))
        }));
        
        setActiveWorkflows(formattedWorkflows);
        
        // Load pending approvals
        const approvals = workflowIntelligenceService.getApprovalQueue();
        const formattedApprovals = approvals.map(approval => ({
          id: approval.id,
          title: approval.name,
          workflowType: approval.templateId.replace('-workflow', '').toUpperCase(),
          requestDate: approval.createdAt,
          isUrgent: approval.priority === 'high',
          urgentReason: approval.priority === 'high' ? 'Approaching deadline' : ''
        }));
        
        setPendingApprovals(formattedApprovals);
        
        // Load workflow insights based on analytics data
        const insights = [];
        
        // Add bottleneck insights if available
        if (analytics.bottlenecks && analytics.bottlenecks.length > 0) {
          analytics.bottlenecks.forEach(bottleneck => {
            insights.push({
              type: 'bottleneck',
              title: `Bottleneck Detected: ${bottleneck.stage}`,
              category: 'Process Optimization',
              description: `This stage takes an average of ${bottleneck.avgTime.toFixed(1)} hours to complete, causing delays in workflow processing.`,
              impact: 'High',
              metrics: {
                timeSaved: `${(bottleneck.avgTime * 0.3).toFixed(1)} hours per workflow`
              }
            });
          });
        }
        
        // Add general optimization insights
        insights.push({
          type: 'optimization',
          title: 'Approval Consolidation',
          category: 'Process Efficiency',
          description: 'Consolidating approval steps for low-risk budget items could improve processing time by 40%.',
          impact: 'Medium',
          metrics: {
            timeSaved: '12 hours per week'
          }
        });
        
        insights.push({
          type: 'insight',
          title: 'Compliance Pattern Detected',
          category: 'Compliance Intelligence',
          description: 'A pattern of documentation issues has been detected in procurement workflows from the IT department.',
          impact: 'Medium',
          metrics: {
            timeSaved: '8 hours per month'
          }
        });
        
        setWorkflowInsights(insights);
      } catch (error) {
        console.error('Error loading workflow dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  const handleWorkflowSelect = (workflow) => {
    setSelectedWorkflow(workflow);
  };

  const renderStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return <CheckCircle sx={{ color: statusColors['completed'] }} />;
      case 'in-progress':
        return <DonutLarge sx={{ color: statusColors['in-progress'] }} />;
      case 'pending':
        return <HourglassEmpty sx={{ color: statusColors['pending'] }} />;
      case 'rejected':
        return <Error sx={{ color: statusColors['rejected'] }} />;
      case 'paused':
        return <Pause sx={{ color: statusColors['paused'] }} />;
      default:
        return <DonutLarge sx={{ color: statusColors['in-progress'] }} />;
    }
  };

  const renderWorkflowTimeline = (workflow) => {
    if (!workflow || !workflow.steps) return null;
    
    return (
      <Timeline position="alternate">
        {workflow.steps.map((step, index) => (
          <TimelineItem key={index}>
            <TimelineOppositeContent color="text.secondary">
              {step.timestamp ? new Date(step.timestamp).toLocaleString() : 'Pending'}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color={
                step.status === 'completed' ? 'success' :
                step.status === 'in-progress' ? 'primary' :
                step.status === 'pending' ? 'grey' :
                step.status === 'rejected' ? 'error' : 'grey'
              }>
                {step.type === 'approval' ? <Approval /> :
                 step.type === 'document' ? <Description /> :
                 step.type === 'compliance' ? <VerifiedUser /> :
                 <Assignment />}
              </TimelineDot>
              {index < workflow.steps.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" component="h3">
                  {step.name}
                </Typography>
                <Typography>{step.description}</Typography>
                {step.assignee && (
                  <Typography variant="body2" color="textSecondary">
                    Assigned to: {step.assignee}
                  </Typography>
                )}
                {step.documents && step.documents.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    {step.documents.map((doc, i) => (
                      <Chip 
                        key={i}
                        size="small"
                        icon={<AttachFile />}
                        label={doc.name}
                        sx={{ mr: 0.5, mb: 0.5 }}
                        onClick={() => {/* Handle document view */}}
                      />
                    ))}
                  </Box>
                )}
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Workflow Intelligence Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Monitor and manage intelligent workflows across the organization
      </Typography>
      
      {/* Statistics Overview */}
      {workflowStats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Active Workflows
                </Typography>
                <Typography variant="h4">
                  {workflowStats.activeWorkflows}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {workflowStats.activeWorkflowsChange > 0 ? '+' : ''}{workflowStats.activeWorkflowsChange}% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Pending Approvals
                </Typography>
                <Typography variant="h4">
                  {workflowStats.pendingApprovals}
                </Typography>
                <Typography variant="body2" color={workflowStats.pendingApprovalsUrgent > 0 ? "error" : "textSecondary"}>
                  {workflowStats.pendingApprovalsUrgent} urgent
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Average Completion Time
                </Typography>
                <Typography variant="h4">
                  {workflowStats.avgCompletionTime}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {workflowStats.avgCompletionTimeChange > 0 ? '+' : ''}{workflowStats.avgCompletionTimeChange}% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Compliance Score
                </Typography>
                <Typography variant="h4">
                  {workflowStats.complianceScore}%
                </Typography>
                <Typography variant="body2" color={workflowStats.complianceScoreChange >= 0 ? "success.main" : "error.main"}>
                  {workflowStats.complianceScoreChange > 0 ? '+' : ''}{workflowStats.complianceScoreChange}% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      <Grid container spacing={3}>
        {/* Left Column - Workflow Charts */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Workflow Distribution</Typography>
              <IconButton size="small">
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ height: 300 }}>
              {workflowStats && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={workflowStats.workflowTypeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {workflowStats.workflowTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={theme.palette.augmentedColors[index % theme.palette.augmentedColors.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Status Distribution</Typography>
              </Box>
              <Box sx={{ height: 300 }}>
                {workflowStats && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={workflowStats.workflowStatusDistribution}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <RechartsTooltip />
                      <Bar dataKey="value" fill={theme.palette.primary.main} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        {/* Middle Column - Active Workflows */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Active Workflows</Typography>
              <Box>
                <IconButton size="small" sx={{ mr: 1 }}>
                  <FilterList fontSize="small" />
                </IconButton>
                <IconButton size="small">
                  <Search fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            
            <List sx={{ overflow: 'auto', maxHeight: 650 }}>
              {activeWorkflows.map((workflow) => (
                <React.Fragment key={workflow.id}>
                  <ListItem 
                    button 
                    selected={selectedWorkflow && selectedWorkflow.id === workflow.id}
                    onClick={() => handleWorkflowSelect(workflow)}
                  >
                    <ListItemIcon>
                      {renderStatusIcon(workflow.status)}
                    </ListItemIcon>
                    <ListItemText 
                      primary={WORKFLOW_TYPES[workflow.type] || workflow.type} 
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="textPrimary">
                            {workflow.title}
                          </Typography>
                          <Typography component="span" variant="body2" display="block" color="textSecondary">
                            Started: {new Date(workflow.startDate).toLocaleDateString()}
                          </Typography>
                          <Typography component="span" variant="body2" display="block" color="textSecondary">
                            Current step: {workflow.currentStep}
                          </Typography>
                        </>
                      }
                    />
                    <Box>
                      <Chip 
                        size="small" 
                        label={workflow.priority}
                        color={
                          workflow.priority === 'high' ? 'error' :
                          workflow.priority === 'medium' ? 'warning' : 'default'
                        }
                        sx={{ mr: 1 }}
                      />
                      <IconButton size="small">
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </Box>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        
        {/* Right Column - Selected Workflow or Approvals */}
        <Grid item xs={12} md={4}>
          {selectedWorkflow ? (
            <Paper sx={{ p: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Workflow Details</Typography>
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={() => setSelectedWorkflow(null)}
                >
                  Back to List
                </Button>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="h5">{selectedWorkflow.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Type: {WORKFLOW_TYPES[selectedWorkflow.type] || selectedWorkflow.type}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Chip 
                    icon={renderStatusIcon(selectedWorkflow.status)} 
                    label={selectedWorkflow.status.toUpperCase()}
                    sx={{ mr: 1, textTransform: 'capitalize' }} 
                  />
                  <Chip 
                    label={`Priority: ${selectedWorkflow.priority.toUpperCase()}`}
                    color={
                      selectedWorkflow.priority === 'high' ? 'error' :
                      selectedWorkflow.priority === 'medium' ? 'warning' : 'default'
                    }
                    size="small"
                  />
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Progress</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={selectedWorkflow.progress} 
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="textSecondary">{`${Math.round(selectedWorkflow.progress)}%`}</Typography>
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1">Workflow Timeline</Typography>
                  <Box>
                    <Tooltip title="Refresh">
                      <IconButton size="small">
                        <Refresh fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {selectedWorkflow.status === 'in-progress' ? (
                      <Tooltip title="Pause workflow">
                        <IconButton size="small">
                          <Pause fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    ) : selectedWorkflow.status === 'paused' && (
                      <Tooltip title="Resume workflow">
                        <IconButton size="small">
                          <PlayArrow fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
                
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {renderWorkflowTimeline(selectedWorkflow)}
                </Box>
              </Box>
            </Paper>
          ) : (
            <Paper sx={{ p: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Pending Approvals</Typography>
                <IconButton size="small">
                  <FilterList fontSize="small" />
                </IconButton>
              </Box>
              
              <List sx={{ overflow: 'auto', maxHeight: 650 }}>
                {pendingApprovals.map((approval) => (
                  <React.Fragment key={approval.id}>
                    <ListItem button>
                      <ListItemIcon>
                        <Approval color={approval.isUrgent ? "error" : "primary"} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={approval.title} 
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="textSecondary">
                              Workflow: {WORKFLOW_TYPES[approval.workflowType] || approval.workflowType}
                            </Typography>
                            <Typography component="span" variant="body2" display="block" color="textSecondary">
                              Waiting since: {new Date(approval.requestDate).toLocaleDateString()}
                            </Typography>
                            {approval.isUrgent && (
                              <Typography component="span" variant="body2" color="error">
                                Urgent: {approval.urgentReason}
                              </Typography>
                            )}
                          </>
                        }
                      />
                      <Box>
                        <Button 
                          size="small" 
                          variant="contained" 
                          color="primary" 
                          sx={{ mr: 1 }}
                        >
                          Review
                        </Button>
                      </Box>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )}
        </Grid>
        
        {/* Bottom Row - Workflow Insights */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Workflow Insights & Optimization</Typography>
              <Button 
                variant="outlined" 
                startIcon={<Assessment />}
                size="small"
              >
                Full Analysis
              </Button>
            </Box>
            
            <Grid container spacing={2}>
              {workflowInsights.map((insight, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ 
                          bgcolor: insight.type === 'optimization' ? 'success.main' : 
                                   insight.type === 'bottleneck' ? 'error.main' : 'info.main' 
                        }}>
                          {insight.type === 'optimization' ? <TrendingUp /> : 
                           insight.type === 'bottleneck' ? <Warning /> : <Lightbulb />}
                        </Avatar>
                      }
                      title={insight.title}
                      subheader={insight.category}
                    />
                    <CardContent>
                      <Typography variant="body2" color="textSecondary" paragraph>
                        {insight.description}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Potential impact: <strong>{insight.impact}</strong>
                      </Typography>
                      {insight.metrics && (
                        <Typography variant="body2" color="textSecondary">
                          Estimated time saved: <strong>{insight.metrics.timeSaved}</strong>
                        </Typography>
                      )}
                      <Box sx={{ mt: 2 }}>
                        <Button size="small" color="primary">
                          Apply Suggestion
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WorkflowDashboard;
