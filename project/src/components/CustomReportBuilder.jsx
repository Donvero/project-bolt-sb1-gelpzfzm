import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  Divider,
  Checkbox,
  ListItemText,
  OutlinedInput,
  List,
  ListItem,
  ListItemIcon,
  IconButton,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  DragIndicator as DragIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Download as DownloadIcon,
  BarChart as ChartIcon,
  TableChart as TableIcon,
  Insights as InsightsIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  ShowChart as LineChartIcon,
  DonutLarge as DonutChartIcon,
  Refresh as RefreshIcon,
  FormatAlignLeft as TextIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useBudgetStore } from '../store/budgetStore';
import reportGenerator from '../services/reportGeneratorService';

// Styled components
const ComponentCard = styled(Card)(({ theme }) => ({
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(2),
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  }
}));

const ComponentPlaceholder = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  borderRadius: 8,
  border: '2px dashed',
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.default,
  minHeight: 100,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
}));

// Component types with icons
const componentTypes = [
  { type: 'heading', label: 'Heading', icon: <TextIcon /> },
  { type: 'text', label: 'Text Block', icon: <TextIcon /> },
  { type: 'lineChart', label: 'Line Chart', icon: <LineChartIcon /> },
  { type: 'barChart', label: 'Bar Chart', icon: <ChartIcon /> },
  { type: 'pieChart', label: 'Pie Chart', icon: <PieChartIcon /> },
  { type: 'donutChart', label: 'Donut Chart', icon: <DonutChartIcon /> },
  { type: 'table', label: 'Data Table', icon: <TableIcon /> },
  { type: 'insights', label: 'AI Insights', icon: <InsightsIcon /> },
  { type: 'image', label: 'Image', icon: <ImageIcon /> }
];

// Custom Report Builder component
const CustomReportBuilder = () => {
  const theme = useTheme();
  const budgetStore = useBudgetStore();
  
  // State for report configuration
  const [reportTitle, setReportTitle] = useState('Custom Report');
  const [reportDescription, setReportDescription] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [selectedDataSources, setSelectedDataSources] = useState(['budget']);
  const [reportComponents, setReportComponents] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportPreview, setReportPreview] = useState(null);
  const [error, setError] = useState(null);
  const [savedReports, setSavedReports] = useState([]);
  
  // Available data sources
  const dataSources = [
    { value: 'budget', label: 'Budget Data' },
    { value: 'compliance', label: 'Compliance Data' },
    { value: 'procurement', label: 'Procurement Data' },
    { value: 'risk', label: 'Risk Assessment Data' }
  ];
  
  // Time periods
  const periods = [
    { value: 'current', label: 'Current Financial Year' },
    { value: 'previous', label: 'Previous Financial Year' },
    { value: 'ytd', label: 'Year to Date' },
    { value: 'custom', label: 'Custom Date Range' }
  ];
  
  // Initialize
  useEffect(() => {
    budgetStore.initialize();
    
    // Load saved reports from localStorage
    const saved = localStorage.getItem('customReports');
    if (saved) {
      try {
        setSavedReports(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved reports:', e);
      }
    }
  }, []);
  
  // Handle drag and drop reordering
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(reportComponents);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setReportComponents(items);
  };
  
  // Add a new component to the report
  const addComponent = (type) => {
    const newComponent = {
      id: `component-${Date.now()}`,
      type,
      title: `New ${componentTypes.find(c => c.type === type)?.label || 'Component'}`,
      content: '',
      dataSource: selectedDataSources[0],
      options: getDefaultOptionsForType(type)
    };
    
    setReportComponents([...reportComponents, newComponent]);
  };
  
  // Get default options based on component type
  const getDefaultOptionsForType = (type) => {
    switch (type) {
      case 'heading':
        return { level: 'h2' };
      case 'lineChart':
      case 'barChart':
      case 'pieChart':
      case 'donutChart':
        return {
          showLegend: true,
          showGrid: true,
          height: 300,
          metrics: []
        };
      case 'table':
        return {
          showHeader: true,
          pageSize: 10,
          columns: []
        };
      case 'insights':
        return {
          insightType: 'general',
          maxItems: 3
        };
      case 'image':
        return {
          url: '',
          width: '100%',
          alignment: 'center'
        };
      default:
        return {};
    }
  };
  
  // Remove a component from the report
  const removeComponent = (id) => {
    setReportComponents(reportComponents.filter(c => c.id !== id));
  };
  
  // Update component properties
  const updateComponent = (id, updates) => {
    setReportComponents(
      reportComponents.map(component => 
        component.id === id ? { ...component, ...updates } : component
      )
    );
  };
  
  // Generate report preview
  const generateReportPreview = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // In a real implementation, this would call the report service with the configuration
      // For now, we'll simulate a delay and set a mock preview
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setReportPreview({
        title: reportTitle,
        description: reportDescription,
        components: reportComponents,
        generatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to generate report preview:', err);
      setError('Failed to generate report preview. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Save report configuration
  const saveReport = () => {
    const reportConfig = {
      id: `report-${Date.now()}`,
      title: reportTitle,
      description: reportDescription,
      dataSources: selectedDataSources,
      period: selectedPeriod,
      components: reportComponents,
      createdAt: new Date().toISOString()
    };
    
    const updatedReports = [...savedReports, reportConfig];
    setSavedReports(updatedReports);
    
    // Save to localStorage
    try {
      localStorage.setItem('customReports', JSON.stringify(updatedReports));
    } catch (e) {
      console.error('Failed to save report:', e);
    }
  };
  
  // Load a saved report
  const loadReport = (report) => {
    setReportTitle(report.title);
    setReportDescription(report.description);
    setSelectedDataSources(report.dataSources);
    setSelectedPeriod(report.period);
    setReportComponents(report.components);
    
    // Generate preview for the loaded report
    generateReportPreview();
  };
  
  // Delete a saved report
  const deleteReport = (id) => {
    const updatedReports = savedReports.filter(report => report.id !== id);
    setSavedReports(updatedReports);
    
    // Update localStorage
    try {
      localStorage.setItem('customReports', JSON.stringify(updatedReports));
    } catch (e) {
      console.error('Failed to update saved reports:', e);
    }
  };
  
  // Export report as PDF
  const exportReport = async () => {
    if (!reportPreview) return;
    
    try {
      // In a real implementation, this would call the report service to generate the PDF
      // For now, we'll just log the configuration
      console.log('Exporting report with configuration:', {
        title: reportTitle,
        description: reportDescription,
        dataSources: selectedDataSources,
        period: selectedPeriod,
        components: reportComponents
      });
      
      // Mock PDF generation
      alert('Report exported successfully! (This is a mock implementation)');
    } catch (err) {
      console.error('Failed to export report:', err);
      setError('Failed to export report. Please try again.');
    }
  };
  
  // Render component editor based on type
  const renderComponentEditor = (component) => {
    switch (component.type) {
      case 'heading':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Heading Text"
                value={component.content}
                onChange={(e) => updateComponent(component.id, { content: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Heading Level</InputLabel>
                <Select
                  value={component.options.level}
                  onChange={(e) => updateComponent(component.id, { 
                    options: { ...component.options, level: e.target.value } 
                  })}
                  label="Heading Level"
                >
                  <MenuItem value="h1">H1 - Main Title</MenuItem>
                  <MenuItem value="h2">H2 - Section Title</MenuItem>
                  <MenuItem value="h3">H3 - Subsection Title</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
        
      case 'text':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Text Content"
            value={component.content}
            onChange={(e) => updateComponent(component.id, { content: e.target.value })}
          />
        );
        
      case 'lineChart':
      case 'barChart':
      case 'pieChart':
      case 'donutChart':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Chart Title"
                value={component.title}
                onChange={(e) => updateComponent(component.id, { title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Data Source</InputLabel>
                <Select
                  value={component.dataSource}
                  onChange={(e) => updateComponent(component.id, { dataSource: e.target.value })}
                  label="Data Source"
                >
                  {dataSources.map(source => (
                    <MenuItem key={source.value} value={source.value}>
                      {source.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Metrics</InputLabel>
                <Select
                  multiple
                  value={component.options.metrics}
                  onChange={(e) => updateComponent(component.id, { 
                    options: { ...component.options, metrics: e.target.value } 
                  })}
                  input={<OutlinedInput label="Metrics" />}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {getMetricsForDataSource(component.dataSource).map(metric => (
                    <MenuItem key={metric.value} value={metric.value}>
                      <Checkbox checked={component.options.metrics.indexOf(metric.value) > -1} />
                      <ListItemText primary={metric.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Chart Height</InputLabel>
                <Select
                  value={component.options.height}
                  onChange={(e) => updateComponent(component.id, { 
                    options: { ...component.options, height: e.target.value } 
                  })}
                  label="Chart Height"
                >
                  <MenuItem value={200}>Small (200px)</MenuItem>
                  <MenuItem value={300}>Medium (300px)</MenuItem>
                  <MenuItem value={400}>Large (400px)</MenuItem>
                  <MenuItem value={500}>Extra Large (500px)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Show Legend</InputLabel>
                <Select
                  value={component.options.showLegend}
                  onChange={(e) => updateComponent(component.id, { 
                    options: { ...component.options, showLegend: e.target.value } 
                  })}
                  label="Show Legend"
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
        
      case 'table':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Table Title"
                value={component.title}
                onChange={(e) => updateComponent(component.id, { title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Data Source</InputLabel>
                <Select
                  value={component.dataSource}
                  onChange={(e) => updateComponent(component.id, { dataSource: e.target.value })}
                  label="Data Source"
                >
                  {dataSources.map(source => (
                    <MenuItem key={source.value} value={source.value}>
                      {source.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Columns</InputLabel>
                <Select
                  multiple
                  value={component.options.columns}
                  onChange={(e) => updateComponent(component.id, { 
                    options: { ...component.options, columns: e.target.value } 
                  })}
                  input={<OutlinedInput label="Columns" />}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {getColumnsForDataSource(component.dataSource).map(column => (
                    <MenuItem key={column.value} value={column.value}>
                      <Checkbox checked={component.options.columns.indexOf(column.value) > -1} />
                      <ListItemText primary={column.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Page Size</InputLabel>
                <Select
                  value={component.options.pageSize}
                  onChange={(e) => updateComponent(component.id, { 
                    options: { ...component.options, pageSize: e.target.value } 
                  })}
                  label="Page Size"
                >
                  <MenuItem value={5}>5 rows</MenuItem>
                  <MenuItem value={10}>10 rows</MenuItem>
                  <MenuItem value={20}>20 rows</MenuItem>
                  <MenuItem value={50}>50 rows</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Show Header</InputLabel>
                <Select
                  value={component.options.showHeader}
                  onChange={(e) => updateComponent(component.id, { 
                    options: { ...component.options, showHeader: e.target.value } 
                  })}
                  label="Show Header"
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
        
      case 'insights':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Insights Title"
                value={component.title}
                onChange={(e) => updateComponent(component.id, { title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Insight Type</InputLabel>
                <Select
                  value={component.options.insightType}
                  onChange={(e) => updateComponent(component.id, { 
                    options: { ...component.options, insightType: e.target.value } 
                  })}
                  label="Insight Type"
                >
                  <MenuItem value="general">General Insights</MenuItem>
                  <MenuItem value="budget">Budget Analysis</MenuItem>
                  <MenuItem value="compliance">Compliance Status</MenuItem>
                  <MenuItem value="risk">Risk Assessment</MenuItem>
                  <MenuItem value="recommendations">Recommendations</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Max Insights</InputLabel>
                <Select
                  value={component.options.maxItems}
                  onChange={(e) => updateComponent(component.id, { 
                    options: { ...component.options, maxItems: e.target.value } 
                  })}
                  label="Max Insights"
                >
                  <MenuItem value={1}>1 insight</MenuItem>
                  <MenuItem value={3}>3 insights</MenuItem>
                  <MenuItem value={5}>5 insights</MenuItem>
                  <MenuItem value={10}>10 insights</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
        
      case 'image':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                value={component.options.url}
                onChange={(e) => updateComponent(component.id, { 
                  options: { ...component.options, url: e.target.value } 
                })}
                placeholder="https://example.com/image.jpg"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Width"
                value={component.options.width}
                onChange={(e) => updateComponent(component.id, { 
                  options: { ...component.options, width: e.target.value } 
                })}
                placeholder="100% or 300px"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Alignment</InputLabel>
                <Select
                  value={component.options.alignment}
                  onChange={(e) => updateComponent(component.id, { 
                    options: { ...component.options, alignment: e.target.value } 
                  })}
                  label="Alignment"
                >
                  <MenuItem value="left">Left</MenuItem>
                  <MenuItem value="center">Center</MenuItem>
                  <MenuItem value="right">Right</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
        
      default:
        return <Typography>Unknown component type: {component.type}</Typography>;
    }
  };
  
  // Get metrics for data source
  const getMetricsForDataSource = (dataSource) => {
    switch (dataSource) {
      case 'budget':
        return [
          { value: 'budget_amount', label: 'Budget Amount' },
          { value: 'budget_spent', label: 'Budget Spent' },
          { value: 'budget_remaining', label: 'Budget Remaining' },
          { value: 'budget_utilization', label: 'Budget Utilization %' },
          { value: 'budget_by_department', label: 'Budget by Department' },
          { value: 'budget_by_quarter', label: 'Budget by Quarter' }
        ];
      case 'compliance':
        return [
          { value: 'compliance_score', label: 'Compliance Score' },
          { value: 'compliance_by_regulation', label: 'Compliance by Regulation' },
          { value: 'compliance_violations', label: 'Compliance Violations' },
          { value: 'compliance_by_department', label: 'Compliance by Department' },
          { value: 'compliance_trend', label: 'Compliance Trend' }
        ];
      case 'procurement':
        return [
          { value: 'procurement_spending', label: 'Procurement Spending' },
          { value: 'procurement_by_vendor', label: 'Spending by Vendor' },
          { value: 'procurement_by_category', label: 'Spending by Category' },
          { value: 'procurement_compliance', label: 'Procurement Compliance' }
        ];
      case 'risk':
        return [
          { value: 'risk_level', label: 'Overall Risk Level' },
          { value: 'risk_by_category', label: 'Risk by Category' },
          { value: 'risk_by_department', label: 'Risk by Department' },
          { value: 'risk_trend', label: 'Risk Trend' }
        ];
      default:
        return [];
    }
  };
  
  // Get columns for data source
  const getColumnsForDataSource = (dataSource) => {
    switch (dataSource) {
      case 'budget':
        return [
          { value: 'department', label: 'Department' },
          { value: 'period', label: 'Period' },
          { value: 'amount', label: 'Budget Amount' },
          { value: 'spent', label: 'Spent Amount' },
          { value: 'remaining', label: 'Remaining' },
          { value: 'utilization', label: 'Utilization %' },
          { value: 'status', label: 'Status' }
        ];
      case 'compliance':
        return [
          { value: 'regulation', label: 'Regulation' },
          { value: 'department', label: 'Department' },
          { value: 'score', label: 'Compliance Score' },
          { value: 'violations', label: 'Violations' },
          { value: 'status', label: 'Status' },
          { value: 'last_check', label: 'Last Check' }
        ];
      case 'procurement':
        return [
          { value: 'vendor', label: 'Vendor' },
          { value: 'category', label: 'Category' },
          { value: 'amount', label: 'Amount' },
          { value: 'date', label: 'Date' },
          { value: 'compliance', label: 'Compliance' },
          { value: 'status', label: 'Status' }
        ];
      case 'risk':
        return [
          { value: 'category', label: 'Risk Category' },
          { value: 'department', label: 'Department' },
          { value: 'level', label: 'Risk Level' },
          { value: 'description', label: 'Description' },
          { value: 'mitigation', label: 'Mitigation' },
          { value: 'status', label: 'Status' }
        ];
      default:
        return [];
    }
  };
  
  // Render component visualization in preview
  const renderComponentPreview = (component) => {
    const ComponentIcon = componentTypes.find(c => c.type === component.type)?.icon || <ChartIcon />;
    
    return (
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <Box mr={1}>{ComponentIcon}</Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {component.title}
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        {component.type === 'heading' && (
          <Typography variant={component.options.level} fontWeight={600}>
            {component.content || 'Heading Text'}
          </Typography>
        )}
        
        {component.type === 'text' && (
          <Typography variant="body1">
            {component.content || 'Text content will appear here.'}
          </Typography>
        )}
        
        {(component.type === 'lineChart' || component.type === 'barChart' || 
          component.type === 'pieChart' || component.type === 'donutChart') && (
          <Box 
            sx={{ 
              height: component.options.height, 
              backgroundColor: 'action.hover',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}
          >
            {ComponentIcon}
            <Typography variant="body2" color="textSecondary" mt={1}>
              {component.type.charAt(0).toUpperCase() + component.type.slice(1)} Visualization
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Data Source: {dataSources.find(d => d.value === component.dataSource)?.label}
            </Typography>
            {component.options.metrics.length > 0 && (
              <Box mt={1} display="flex" flexWrap="wrap" justifyContent="center">
                {component.options.metrics.map(metric => (
                  <Chip 
                    key={metric} 
                    label={getMetricsForDataSource(component.dataSource).find(m => m.value === metric)?.label} 
                    size="small" 
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}
        
        {component.type === 'table' && (
          <Box 
            sx={{ 
              minHeight: 100, 
              backgroundColor: 'action.hover',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              p: 2
            }}
          >
            <TableIcon />
            <Typography variant="body2" color="textSecondary" mt={1}>
              Data Table Visualization
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Data Source: {dataSources.find(d => d.value === component.dataSource)?.label}
            </Typography>
            {component.options.columns.length > 0 && (
              <Box mt={1} display="flex" flexWrap="wrap" justifyContent="center">
                {component.options.columns.map(column => (
                  <Chip 
                    key={column} 
                    label={getColumnsForDataSource(component.dataSource).find(c => c.value === column)?.label} 
                    size="small" 
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}
        
        {component.type === 'insights' && (
          <Box 
            sx={{ 
              minHeight: 100, 
              backgroundColor: 'action.hover',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              p: 2
            }}
          >
            <InsightsIcon />
            <Typography variant="body2" color="textSecondary" mt={1}>
              AI Insights - {component.options.insightType.charAt(0).toUpperCase() + component.options.insightType.slice(1)}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Max Items: {component.options.maxItems}
            </Typography>
          </Box>
        )}
        
        {component.type === 'image' && (
          <Box 
            sx={{ 
              textAlign: component.options.alignment,
              my: 2
            }}
          >
            {component.options.url ? (
              <Box 
                component="img"
                src={component.options.url}
                alt="Report image"
                sx={{ 
                  maxWidth: '100%',
                  width: component.options.width || '100%',
                  borderRadius: 1
                }}
              />
            ) : (
              <Box 
                sx={{ 
                  width: component.options.width || '100%',
                  height: 150,
                  backgroundColor: 'action.hover',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  margin: component.options.alignment === 'center' ? '0 auto' : 0
                }}
              >
                <ImageIcon />
                <Typography variant="body2" color="textSecondary" mt={1}>
                  Image Placeholder
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    );
  };
  
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Custom Report Builder
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Design and configure custom reports with your choice of data visualizations, insights, and formatting.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {/* Report Configuration */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Report Configuration
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Report Title"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Report Description"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Time Period</InputLabel>
                  <Select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    label="Time Period"
                  >
                    {periods.map(period => (
                      <MenuItem key={period.value} value={period.value}>
                        {period.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Data Sources</InputLabel>
                  <Select
                    multiple
                    value={selectedDataSources}
                    onChange={(e) => setSelectedDataSources(e.target.value)}
                    input={<OutlinedInput label="Data Sources" />}
                    renderValue={(selected) => selected.map(value => 
                      dataSources.find(source => source.value === value)?.label
                    ).join(', ')}
                  >
                    {dataSources.map(source => (
                      <MenuItem key={source.value} value={source.value}>
                        <Checkbox checked={selectedDataSources.indexOf(source.value) > -1} />
                        <ListItemText primary={source.label} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Available Components */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Available Components
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Add components to your report by clicking on them.
            </Typography>
            
            <Grid container spacing={1}>
              {componentTypes.map(component => (
                <Grid item xs={6} sm={4} key={component.type}>
                  <Button
                    variant="outlined"
                    startIcon={component.icon}
                    onClick={() => addComponent(component.type)}
                    fullWidth
                    sx={{ mb: 1, justifyContent: 'flex-start', py: 1 }}
                  >
                    {component.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>
          
          {/* Report Components */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Report Components
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Drag to reorder components. Click to expand and edit properties.
            </Typography>
            
            {reportComponents.length === 0 ? (
              <ComponentPlaceholder>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  No components added yet
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Add components from the list above to start building your report.
                </Typography>
              </ComponentPlaceholder>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="report-components">
                  {(provided) => (
                    <Box
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {reportComponents.map((component, index) => (
                        <Draggable key={component.id} draggableId={component.id} index={index}>
                          {(provided) => (
                            <ComponentCard
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                  <Box display="flex" alignItems="center">
                                    <Box {...provided.dragHandleProps} mr={1}>
                                      <DragIcon color="action" />
                                    </Box>
                                    {componentTypes.find(c => c.type === component.type)?.icon}
                                    <Typography variant="subtitle1" sx={{ ml: 1 }}>
                                      {component.title}
                                    </Typography>
                                  </Box>
                                  <IconButton onClick={() => removeComponent(component.id)}>
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
                                
                                <Divider sx={{ my: 2 }} />
                                
                                {renderComponentEditor(component)}
                              </CardContent>
                            </ComponentCard>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          {/* Actions */}
          <Box display="flex" gap={2} mb={3}>
            <Button
              variant="contained"
              color="primary"
              startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
              onClick={generateReportPreview}
              disabled={isGenerating || reportComponents.length === 0}
            >
              {isGenerating ? 'Generating...' : 'Generate Preview'}
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={saveReport}
              disabled={reportComponents.length === 0}
            >
              Save Report
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={exportReport}
              disabled={!reportPreview}
            >
              Export Report
            </Button>
          </Box>
          
          {/* Report Preview */}
          <Paper sx={{ p: 3, borderRadius: 3, height: 'calc(100% - 56px)' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Report Preview
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {isGenerating ? (
              <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                py={8}
              >
                <CircularProgress size={60} thickness={4} />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Generating report preview...
                </Typography>
              </Box>
            ) : reportPreview ? (
              <Box sx={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto', pr: 1 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  {reportPreview.title}
                </Typography>
                
                {reportPreview.description && (
                  <Typography variant="body1" paragraph>
                    {reportPreview.description}
                  </Typography>
                )}
                
                <Divider sx={{ my: 2 }} />
                
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Generated on: {new Date(reportPreview.generatedAt).toLocaleString()}
                  </Typography>
                </Box>
                
                <Box sx={{ mt: 3 }}>
                  {reportComponents.map(component => (
                    <Box key={component.id}>
                      {renderComponentPreview(component)}
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : (
              <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                py={8}
              >
                <Box sx={{ mb: 2 }}>
                  <ChartIcon fontSize="large" color="action" />
                </Box>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  No preview generated yet
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Add components to your report and click "Generate Preview" to see how your report will look.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Saved Reports */}
        {savedReports.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 3, mt: 2 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Saved Reports
              </Typography>
              
              <Grid container spacing={2}>
                {savedReports.map(report => (
                  <Grid item xs={12} sm={6} md={4} key={report.id}>
                    <Card sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                          {report.title}
                        </Typography>
                        
                        <Typography variant="body2" color="textSecondary" paragraph>
                          {report.description || 'No description provided'}
                        </Typography>
                        
                        <Box display="flex" flexWrap="wrap" mb={2}>
                          {report.dataSources.map(source => (
                            <Chip 
                              key={source}
                              label={dataSources.find(s => s.value === source)?.label}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                        
                        <Typography variant="caption" color="textSecondary" display="block" mb={2}>
                          Created: {new Date(report.createdAt).toLocaleDateString()}
                        </Typography>
                        
                        <Box display="flex" justifyContent="space-between">
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => loadReport(report)}
                          >
                            Load
                          </Button>
                          
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => deleteReport(report.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CustomReportBuilder;
