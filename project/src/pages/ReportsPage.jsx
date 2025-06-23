import React, { useState, Suspense, lazy } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Divider, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Button,
  Chip,
  useTheme,
  CircularProgress
} from '@mui/material';
import { 
  Assessment as ReportIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as ExcelIcon,
  Storage as CsvIcon,
  Insights as InsightsIcon,
  Dashboard as DashboardIcon,
  Build as CustomizeIcon,
  BarChart as ChartIcon,
  Schedule as ScheduleIcon,
  ViewInAr as View3DIcon
} from '@mui/icons-material';

// Replace static imports with lazy
const ExecutiveReportGenerator = lazy(() => import('../components/ExecutiveReportGenerator'));
const Advanced3DVisualization = lazy(() => import('../components/Advanced3DVisualization'));
const CustomReportBuilder = lazy(() => import('../components/CustomReportBuilder'));
const NaturalLanguageInsights = lazy(() => import('../components/NaturalLanguageInsights'));
const ScheduledReportsManager = lazy(() => import('../components/ScheduledReportsManager'));

import { styled } from '@mui/material/styles';

// Styled components
const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16,
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)'
  }
}));

const ReportsPage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(25,118,210,0.05) 0%, rgba(66,165,245,0.1) 100%)',
          border: '1px solid rgba(25,118,210,0.1)'
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Advanced Reports & Analytics
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Generate comprehensive reports, interactive visualizations, and AI-powered insights for municipal financial management.
        </Typography>
        
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 2 }}
        >
          <Tab 
            icon={<ReportIcon />} 
            label="Executive Reports" 
            iconPosition="start"
          />
          <Tab 
            icon={<ChartIcon />} 
            label="Advanced Visualizations" 
            iconPosition="start"
          />
          <Tab 
            icon={<View3DIcon />} 
            label="3D Visualization" 
            iconPosition="start"
          />
          <Tab 
            icon={<CustomizeIcon />} 
            label="Custom Reports" 
            iconPosition="start"
          />
          <Tab 
            icon={<InsightsIcon />} 
            label="AI Insights" 
            iconPosition="start"
          />
          <Tab 
            icon={<ScheduleIcon />} 
            label="Scheduled Reports" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      <TabPanel value={activeTab} index={0}>
        <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>}>
          <ExecutiveReportGenerator />
        </Suspense>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Advanced Data Visualizations
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Explore your municipal data with interactive, 3D, and real-time visualizations.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CardMedia
                component="img"
                height="160"
                image="https://via.placeholder.com/400x160?text=Interactive+Dashboard"
                alt="Interactive Dashboard"
              />
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" fontWeight={600}>
                    Interactive Dashboards
                  </Typography>
                  <Chip 
                    label="Coming Soon" 
                    size="small" 
                    color="primary"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Create custom interactive dashboards with drag-and-drop functionality. Combine multiple visualization types and data sources.
                </Typography>
                <Button variant="outlined" color="primary" fullWidth>
                  Preview
                </Button>
              </CardContent>
            </FeatureCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CardMedia
                component="img"
                height="160"
                image="https://via.placeholder.com/400x160?text=3D+Visualization"
                alt="3D Visualization"
              />
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" fontWeight={600}>
                    3D Data Visualization
                  </Typography>
                  <Chip 
                    label="Available" 
                    size="small" 
                    color="success"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Explore complex financial data relationships with interactive 3D visualizations. Rotate, zoom, and explore data from any angle.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  fullWidth
                  onClick={() => setActiveTab(2)}
                >
                  Open
                </Button>
              </CardContent>
            </FeatureCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CardMedia
                component="img"
                height="160"
                image="https://via.placeholder.com/400x160?text=Real-time+Analytics"
                alt="Real-time Analytics"
              />
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" fontWeight={600}>
                    Real-time Analytics
                  </Typography>
                  <Chip 
                    label="Coming Soon" 
                    size="small" 
                    color="info"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Monitor municipal finances with live data streaming and real-time analytics. Set alerts and notifications for important thresholds.
                </Typography>
                <Button variant="outlined" color="info" fullWidth>
                  Preview
                </Button>
              </CardContent>
            </FeatureCard>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>}>
          <Advanced3DVisualization />
        </Suspense>
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>}>
          <CustomReportBuilder />
        </Suspense>
      </TabPanel>

      <TabPanel value={activeTab} index={4}>
        <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>}>
          <NaturalLanguageInsights />
        </Suspense>
      </TabPanel>

      <TabPanel value={activeTab} index={5}>
        <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>}>
          <ScheduledReportsManager />
        </Suspense>
      </TabPanel>
    </Box>
  );
};

export default ReportsPage;