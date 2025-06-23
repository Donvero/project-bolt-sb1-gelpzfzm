import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Tooltip,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Avatar
} from '@mui/material';
import { 
  Assessment, 
  Warning, 
  TrendingUp, 
  TrendingDown, 
  Schedule, 
  Speed,
  CheckCircle,
  Error,
  Lightbulb,
  HourglassEmpty,
  DateRange,
  Timeline
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { workflowIntelligenceService } from '../services/workflowIntelligenceService';

const WorkflowAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [bottlenecks, setBottlenecks] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [typeDistribution, setTypeDistribution] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [radarData, setRadarData] = useState([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      try {
        // Initialize the service if needed
        await workflowIntelligenceService.initialize();
        
        // Get analytics from the service
        const workflowAnalytics = workflowIntelligenceService.getWorkflowAnalytics();
        setAnalytics(workflowAnalytics);
        
        // Extract bottlenecks
        setBottlenecks(workflowAnalytics.bottlenecks || []);
        
        // Generate mock timeline data
        generateMockTimelineData();
        
        // Generate mock type distribution
        generateMockTypeDistribution();
        
        // Generate mock performance data
        generateMockPerformanceData();
        
        // Generate mock radar data
        generateMockRadarData();
      } catch (error) {
        console.error('Error loading workflow analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAnalytics();
  }, []);

  // Generate mock data for visualizations
  const generateMockTimelineData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toLocaleDateString(),
        completed: Math.floor(Math.random() * 10) + 1,
        started: Math.floor(Math.random() * 8) + 2,
      });
    }
    
    setTimelineData(data);
  };

  const generateMockTypeDistribution = () => {
    setTypeDistribution([
      { name: 'Budget Approval', value: 35 },
      { name: 'Procurement', value: 25 },
      { name: 'Document Approval', value: 40 }
    ]);
  };

  const generateMockPerformanceData = () => {
    setPerformanceData([
      { name: 'Budget Approval', avgTime: 36, successRate: 92 },
      { name: 'Procurement', avgTime: 72, successRate: 88 },
      { name: 'Document Approval', avgTime: 24, successRate: 95 }
    ]);
  };

  const generateMockRadarData = () => {
    setRadarData([
      { subject: 'Efficiency', A: 85, B: 90, fullMark: 100 },
      { subject: 'Compliance', A: 92, B: 85, fullMark: 100 },
      { subject: 'Speed', A: 75, B: 78, fullMark: 100 },
      { subject: 'Accuracy', A: 95, B: 90, fullMark: 100 },
      { subject: 'Automation', A: 80, B: 70, fullMark: 100 },
      { subject: 'Optimization', A: 72, B: 85, fullMark: 100 },
    ]);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
    // In a real app, we would reload data based on the new time range
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Workflow Analytics
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Insights and performance analytics for workflow processes
          </Typography>
        </Box>
        <Box>
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={handleTimeRangeChange}
            >
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="quarter">Last Quarter</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      {/* Key Metrics */}
      {analytics && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ mr: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Assessment />
                    </Avatar>
                  </Box>
                  <Box>
                    <Typography color="textSecondary" variant="body2">
                      Total Workflows
                    </Typography>
                    <Typography variant="h5">
                      {analytics.totalWorkflows}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ mr: 2 }}>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <HourglassEmpty />
                    </Avatar>
                  </Box>
                  <Box>
                    <Typography color="textSecondary" variant="body2">
                      Active Workflows
                    </Typography>
                    <Typography variant="h5">
                      {analytics.activeWorkflows}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ mr: 2 }}>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <CheckCircle />
                    </Avatar>
                  </Box>
                  <Box>
                    <Typography color="textSecondary" variant="body2">
                      Completed Workflows
                    </Typography>
                    <Typography variant="h5">
                      {analytics.completedWorkflows}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ mr: 2 }}>
                    <Avatar sx={{ bgcolor: 'error.main' }}>
                      <Schedule />
                    </Avatar>
                  </Box>
                  <Box>
                    <Typography color="textSecondary" variant="body2">
                      Avg. Completion Time
                    </Typography>
                    <Typography variant="h5">
                      {analytics.avgCompletionTime.toFixed(1)} hrs
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      <Grid container spacing={3}>
        {/* Workflow Timeline */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Workflow Activity Timeline
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Number of workflows started and completed over time
            </Typography>
            
            <Box sx={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={timelineData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="started"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    name="Started"
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#82ca9d"
                    name="Completed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Workflow Distribution */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Workflow Type Distribution
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Breakdown of workflows by type
            </Typography>
            
            <Box sx={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {typeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Performance Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Workflow Performance
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Average completion time and success rate by workflow type
            </Typography>
            
            <Box sx={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <RechartsTooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="avgTime"
                    name="Avg. Time (hours)"
                    fill="#8884d8"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="successRate"
                    name="Success Rate (%)"
                    fill="#82ca9d"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Process Quality Radar */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Process Quality Metrics
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Quality indicators comparison (Current vs Previous Period)
            </Typography>
            
            <Box sx={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Current Period"
                    dataKey="A"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Previous Period"
                    dataKey="B"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                  />
                  <Legend />
                  <RechartsTooltip />
                </RadarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Bottlenecks Analysis */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Process Bottlenecks
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Identified workflow stages causing delays
            </Typography>
            
            <Grid container spacing={3}>
              {/* Bottlenecks List */}
              <Grid item xs={12} md={6}>
                <List 
                  subheader={
                    <ListSubheader component="div">
                      Top Bottlenecks
                    </ListSubheader>
                  }
                >
                  {bottlenecks.length > 0 ? (
                    bottlenecks.map((bottleneck, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Warning color="warning" />
                        </ListItemIcon>
                        <ListItemText
                          primary={bottleneck.stage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          secondary={`Average time: ${bottleneck.avgTime.toFixed(1)} hours`}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText
                        primary="No significant bottlenecks detected"
                        secondary="Workflow processes are running efficiently"
                      />
                    </ListItem>
                  )}
                </List>
              </Grid>
              
              {/* Optimization Recommendations */}
              <Grid item xs={12} md={6}>
                <List
                  subheader={
                    <ListSubheader component="div">
                      Optimization Recommendations
                    </ListSubheader>
                  }
                >
                  {bottlenecks.length > 0 ? (
                    bottlenecks.map((bottleneck, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Lightbulb color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Optimize ${bottleneck.stage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`}
                          secondary={`Potential time saving: ${(bottleneck.avgTime * 0.4).toFixed(1)} hours per workflow`}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemIcon>
                        <TrendingUp color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Processes are well optimized"
                        secondary="Continue monitoring for future opportunities"
                      />
                    </ListItem>
                  )}
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUp color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Implement approval consolidation"
                      secondary="Reduce approval steps for low-risk items"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUp color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Enhance document validation"
                      secondary="Implement AI-based pre-validation to reduce errors"
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WorkflowAnalytics;
