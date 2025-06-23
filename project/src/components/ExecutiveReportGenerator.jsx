import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Grid,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Description as ReportIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as ExcelIcon,
  Storage as CsvIcon,
  Download as DownloadIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  DateRange as DateRangeIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { styled } from '@mui/material/styles';
import { useBudgetStore } from '../store/budgetStore';
import { useAuthStore } from '../store/authStore';
import reportGenerator from '../services/reportGeneratorService';
import { formatCurrency } from '../utils/helpers';

// Styled components
const ReportButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(2),
  marginBottom: theme.spacing(2),
  minWidth: 150,
  borderRadius: 12,
  padding: theme.spacing(1, 3),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
  },
  transition: 'all 0.2s ease-in-out'
}));

const ReportPreviewCard = styled(Card)(({ theme }) => ({
  height: '100%',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  borderRadius: 16,
  overflow: 'visible',
  position: 'relative',
  '&:hover': {
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.18)',
    transform: 'translateY(-4px)',
  },
  transition: 'all 0.3s ease'
}));

const FormatChip = styled(Chip)(({ theme, active }) => ({
  margin: theme.spacing(0, 1, 1, 0),
  fontWeight: active ? 700 : 400,
  transform: active ? 'scale(1.05)' : 'scale(1)',
  boxShadow: active ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
  transition: 'all 0.2s ease'
}));

const ExecutiveReportGenerator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const budgetStore = useBudgetStore();
  const authStore = useAuthStore();
  
  // State for report generation
  const [reportFormat, setReportFormat] = useState('pdf');
  const [reportData, setReportData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [reportUrl, setReportUrl] = useState(null);
  
  // State for report options
  const [reportPeriod, setReportPeriod] = useState('current');
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 3)));
  const [endDate, setEndDate] = useState(new Date());
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  
  // State for scheduling
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [scheduleFrequency, setScheduleFrequency] = useState('monthly');
  const [scheduleDay, setScheduleDay] = useState(1);
  const [scheduleEmail, setScheduleEmail] = useState('');
  
  // Initialize and load data
  useEffect(() => {
    budgetStore.initialize();
    prepareReportData();
  }, []);
  
  // Prepare data for report generation
  const prepareReportData = () => {
    const budgets = budgetStore.budgets || [];
    const stats = budgetStore.budgetStatistics || {};
    
    // Calculate overall budget utilization
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = budgets.reduce((sum, budget) => sum + (budget.spent || 0), 0);
    const utilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    
    // Mock data for demonstration
    const reportData = {
      municipality: 'Demo Municipality',
      fiscalPeriod: `${new Date().getFullYear()} Financial Year`,
      budgetUtilization: utilization,
      complianceScore: 85,
      riskLevel: 'Medium',
      anomaliesDetected: 3,
      keyMetrics: [
        { name: 'Total Budget', value: formatCurrency(totalBudget), status: 'Good' },
        { name: 'Total Spent', value: formatCurrency(totalSpent), status: 'Good' },
        { name: 'Remaining Budget', value: formatCurrency(totalBudget - totalSpent), status: totalBudget - totalSpent > 0 ? 'Good' : 'Critical' },
        { name: 'Departments', value: stats.byDepartment?.length || 0, status: 'Good' }
      ],
      highRiskAreas: ['Procurement', 'Capital Projects'],
      mediumRiskAreas: ['HR', 'IT Operations'],
      charts: [],
      tables: []
    };
    
    setReportData(reportData);
  };
  
  // Generate report
  const generateReport = async () => {
    if (!reportData) return;
    
    setIsGenerating(true);
    setError(null);
    setReportUrl(null);
    
    try {
      const result = await reportGenerator.generateExecutiveReport(reportData, reportFormat);
      const url = URL.createObjectURL(result);
      setReportUrl(url);
    } catch (err) {
      console.error('Failed to generate report:', err);
      setError('Failed to generate the report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Download report
  const downloadReport = () => {
    if (!reportUrl) return;
    
    const link = document.createElement('a');
    link.href = reportUrl;
    link.download = `SAMS-Executive-Report-${new Date().toISOString().split('T')[0]}.${reportFormat}`;
    link.click();
  };
  
  // Schedule report
  const scheduleReport = () => {
    // This would integrate with the scheduleReport method in reportGeneratorService
    const scheduleInfo = {
      frequency: scheduleFrequency,
      day: scheduleDay,
      recipients: [scheduleEmail],
      format: reportFormat
    };
    
    reportGenerator.scheduleReport('executive', {
      includeRecommendations,
      includeCharts
    }, scheduleInfo);
    
    setShowScheduleDialog(false);
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Executive Report Generator
      </Typography>
      
      <Typography variant="body1" color="textSecondary" paragraph>
        Generate comprehensive executive reports with insights and recommendations based on municipal financial data.
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={600}>
            Report Options
          </Typography>
          <Button
            startIcon={showOptions ? <CloseIcon /> : <SettingsIcon />}
            onClick={() => setShowOptions(!showOptions)}
            variant={showOptions ? "outlined" : "contained"}
            size="small"
          >
            {showOptions ? 'Hide Options' : 'Show Options'}
          </Button>
        </Box>
        
        {showOptions && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Report Period</InputLabel>
                <Select
                  value={reportPeriod}
                  onChange={(e) => setReportPeriod(e.target.value)}
                  label="Report Period"
                >
                  <MenuItem value="current">Current Financial Year</MenuItem>
                  <MenuItem value="previous">Previous Financial Year</MenuItem>
                  <MenuItem value="custom">Custom Date Range</MenuItem>
                </Select>
              </FormControl>
              
              {reportPeriod === 'custom' && (
                <Box mt={2}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <DatePicker
                          label="Start Date"
                          value={startDate}
                          onChange={(newValue) => setStartDate(newValue)}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DatePicker
                          label="End Date"
                          value={endDate}
                          onChange={(newValue) => setEndDate(newValue)}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                      </Grid>
                    </Grid>
                  </LocalizationProvider>
                </Box>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Report Content
              </Typography>
              
              <FormControlLabel
                control={
                  <Radio
                    checked={includeRecommendations}
                    onChange={(e) => setIncludeRecommendations(e.target.checked)}
                  />
                }
                label="Include Recommendations"
              />
              
              <FormControlLabel
                control={
                  <Radio
                    checked={includeCharts}
                    onChange={(e) => setIncludeCharts(e.target.checked)}
                  />
                }
                label="Include Charts and Visualizations"
              />
            </Grid>
          </Grid>
        )}
        
        <Divider sx={{ my: 2 }} />
        
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Report Format
          </Typography>
          
          <Box display="flex" flexWrap="wrap">
            <FormatChip
              icon={<PdfIcon />}
              label="PDF"
              clickable
              color={reportFormat === 'pdf' ? 'primary' : 'default'}
              onClick={() => setReportFormat('pdf')}
              active={reportFormat === 'pdf' ? 1 : 0}
            />
            
            <FormatChip
              icon={<ExcelIcon />}
              label="Excel"
              clickable
              color={reportFormat === 'excel' ? 'primary' : 'default'}
              onClick={() => setReportFormat('excel')}
              active={reportFormat === 'excel' ? 1 : 0}
            />
            
            <FormatChip
              icon={<CsvIcon />}
              label="CSV"
              clickable
              color={reportFormat === 'csv' ? 'primary' : 'default'}
              onClick={() => setReportFormat('csv')}
              active={reportFormat === 'csv' ? 1 : 0}
            />
          </Box>
        </Box>
        
        <Box mt={3}>
          <ReportButton
            variant="contained"
            startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <ReportIcon />}
            onClick={generateReport}
            disabled={isGenerating || !reportData}
          >
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </ReportButton>
          
          <ReportButton
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={downloadReport}
            disabled={!reportUrl}
          >
            Download
          </ReportButton>
          
          <ReportButton
            variant="outlined"
            startIcon={<ScheduleIcon />}
            onClick={() => setShowScheduleDialog(true)}
          >
            Schedule
          </ReportButton>
          
          <ReportButton
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={prepareReportData}
          >
            Refresh Data
          </ReportButton>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>
      
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Report Preview
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ReportPreviewCard>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <ReportIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6" fontWeight={600}>
                  Executive Summary
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              {reportData ? (
                <>
                  <Typography variant="body2" paragraph>
                    <strong>Municipality:</strong> {reportData.municipality}
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    <strong>Fiscal Period:</strong> {reportData.fiscalPeriod}
                  </Typography>
                  
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Key Performance Indicators
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Budget Utilization:</strong>
                      </Typography>
                      <Typography variant="h6" color={
                        reportData.budgetUtilization > 95 ? 'error.main' :
                        reportData.budgetUtilization > 85 ? 'warning.main' :
                        'success.main'
                      }>
                        {reportData.budgetUtilization.toFixed(1)}%
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Compliance Score:</strong>
                      </Typography>
                      <Typography variant="h6" color={
                        reportData.complianceScore < 70 ? 'error.main' :
                        reportData.complianceScore < 85 ? 'warning.main' :
                        'success.main'
                      }>
                        {reportData.complianceScore.toFixed(1)}%
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Risk Level:</strong>
                      </Typography>
                      <Typography variant="h6" color={
                        reportData.riskLevel === 'High' ? 'error.main' :
                        reportData.riskLevel === 'Medium' ? 'warning.main' :
                        'success.main'
                      }>
                        {reportData.riskLevel}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Anomalies Detected:</strong>
                      </Typography>
                      <Typography variant="h6" color={
                        reportData.anomaliesDetected > 10 ? 'error.main' :
                        reportData.anomaliesDetected > 0 ? 'warning.main' :
                        'success.main'
                      }>
                        {reportData.anomaliesDetected}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Budget Metrics
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {reportData.keyMetrics?.map((metric, index) => (
                      <Grid item xs={6} key={index}>
                        <Typography variant="body2">
                          <strong>{metric.name}:</strong>
                        </Typography>
                        <Typography variant="body1">
                          {metric.value}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                  <CircularProgress />
                </Box>
              )}
            </CardContent>
          </ReportPreviewCard>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <ReportPreviewCard>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <InsightsIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                <Typography variant="h6" fontWeight={600}>
                  Key Insights
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              {reportData ? (
                <>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Budget Utilization
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    Budget utilization is currently at {reportData.budgetUtilization.toFixed(1)}%, which is 
                    {reportData.budgetUtilization > 95 ? ' higher than the recommended range. This may indicate potential overspending or the need for budget reallocation.' :
                     reportData.budgetUtilization < 70 ? ' lower than expected. This may indicate delayed project implementation or potential for reallocation to underfunded areas.' :
                     ' at an optimal level, indicating effective financial management and appropriate budget allocation.'}
                  </Typography>
                  
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Compliance Status
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    Compliance score of {reportData.complianceScore.toFixed(1)}% indicates 
                    {reportData.complianceScore < 70 ? ' significant compliance risks that require immediate attention. Key regulatory frameworks may have critical violations.' :
                     reportData.complianceScore < 85 ? ' areas of potential concern. While not critical, these areas should be addressed to ensure full regulatory compliance.' :
                     ' good adherence to regulatory requirements. Continue monitoring to maintain this high level of compliance.'}
                  </Typography>
                  
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Risk Assessment
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    Risk assessment indicates a {reportData.riskLevel.toLowerCase()} level of 
                    {reportData.riskLevel === 'High' ? ' financial and compliance risk. Critical attention is required in the areas of ' + reportData.highRiskAreas?.join(', ') + '.' :
                     reportData.riskLevel === 'Medium' ? ' risk across municipal operations. Targeted monitoring and controls are recommended, particularly in ' + reportData.mediumRiskAreas?.join(', ') + '.' :
                     ' overall risk profile. Continue with current controls and monitoring to maintain this favorable risk position.'}
                  </Typography>
                  
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Recommended Actions
                  </Typography>
                  
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" paragraph>
                      • Implement Procurement Workflow Automation to reduce processing time and improve compliance with MFMA regulations.
                    </Typography>
                    
                    <Typography variant="body2" paragraph>
                      • Reallocate Budget from Underspent Areas to priority areas with funding shortfalls.
                    </Typography>
                    
                    <Typography variant="body2" paragraph>
                      • Enhance Vendor Performance Monitoring with quarterly reviews and performance metrics.
                    </Typography>
                  </Box>
                </>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                  <CircularProgress />
                </Box>
              )}
            </CardContent>
          </ReportPreviewCard>
        </Grid>
      </Grid>
      
      {/* Schedule Dialog */}
      {showScheduleDialog && (
        <Paper
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '90%' : 500,
            p: 4,
            borderRadius: 3,
            zIndex: 1000,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={600}>
              Schedule Report
            </Typography>
            <IconButton onClick={() => setShowScheduleDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={scheduleFrequency}
                  onChange={(e) => setScheduleFrequency(e.target.value)}
                  label="Frequency"
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {scheduleFrequency === 'weekly' && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Day of Week</InputLabel>
                  <Select
                    value={scheduleDay}
                    onChange={(e) => setScheduleDay(e.target.value)}
                    label="Day of Week"
                  >
                    <MenuItem value={1}>Monday</MenuItem>
                    <MenuItem value={2}>Tuesday</MenuItem>
                    <MenuItem value={3}>Wednesday</MenuItem>
                    <MenuItem value={4}>Thursday</MenuItem>
                    <MenuItem value={5}>Friday</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
            
            {scheduleFrequency === 'monthly' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Day of Month"
                  type="number"
                  InputProps={{ inputProps: { min: 1, max: 31 } }}
                  value={scheduleDay}
                  onChange={(e) => setScheduleDay(e.target.value)}
                />
              </Grid>
            )}
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Recipients"
                placeholder="email@example.com"
                value={scheduleEmail}
                onChange={(e) => setScheduleEmail(e.target.value)}
                helperText="Enter email addresses separated by commas"
              />
            </Grid>
          </Grid>
          
          <Box display="flex" justifyContent="flex-end" mt={4}>
            <Button
              variant="outlined"
              onClick={() => setShowScheduleDialog(false)}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={scheduleReport}
            >
              Schedule Report
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default ExecutiveReportGenerator;
