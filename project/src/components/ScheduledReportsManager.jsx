import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
  Divider,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Schedule as ScheduleIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as ExcelIcon,
  Storage as CsvIcon,
  Description as ReportIcon,
  CalendarToday as CalendarIcon,
  Mail as MailIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { styled } from '@mui/material/styles';
import reportGenerator from '../services/reportGeneratorService';

// Styled components
const ScheduleCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 16,
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
  }
}));

const ReportChip = styled(Chip)(({ theme, format }) => {
  const colors = {
    pdf: theme.palette.error.main,
    excel: theme.palette.success.main,
    csv: theme.palette.info.main
  };
  
  return {
    backgroundColor: colors[format] || theme.palette.primary.main,
    color: '#fff',
    fontWeight: 500
  };
});

const ScheduleStatusChip = styled(Chip)(({ theme, status }) => {
  const colors = {
    active: theme.palette.success.main,
    paused: theme.palette.warning.main,
    failed: theme.palette.error.main,
    completed: theme.palette.info.main
  };
  
  return {
    backgroundColor: colors[status] || theme.palette.primary.main,
    color: '#fff',
    fontWeight: 500
  };
});

// Scheduled Reports Manager component
const ScheduledReportsManager = () => {
  const theme = useTheme();
  
  // State for scheduled reports
  const [scheduledReports, setScheduledReports] = useState([]);
  const [scheduledReportHistory, setScheduledReportHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for schedule dialog
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [scheduleFormData, setScheduleFormData] = useState({
    reportName: '',
    reportType: 'executive',
    frequency: 'weekly',
    day: 1,
    time: new Date(),
    format: 'pdf',
    recipients: '',
    description: ''
  });
  
  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Load scheduled reports
  useEffect(() => {
    loadScheduledReports();
  }, []);
  
  // Load scheduled reports from localStorage or API
  const loadScheduledReports = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call an API
      // For now, we'll use localStorage
      const savedReports = localStorage.getItem('scheduledReports');
      if (savedReports) {
        setScheduledReports(JSON.parse(savedReports));
      } else {
        // Mock data for demonstration
        const mockReports = generateMockReports();
        setScheduledReports(mockReports);
        localStorage.setItem('scheduledReports', JSON.stringify(mockReports));
      }
      
      // Load report history
      const reportHistory = localStorage.getItem('reportExecutionHistory');
      if (reportHistory) {
        setScheduledReportHistory(JSON.parse(reportHistory));
      } else {
        // Mock history for demonstration
        const mockHistory = generateMockReportHistory();
        setScheduledReportHistory(mockHistory);
        localStorage.setItem('reportExecutionHistory', JSON.stringify(mockHistory));
      }
    } catch (err) {
      console.error('Failed to load scheduled reports:', err);
      setError('Failed to load scheduled reports. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate mock scheduled reports
  const generateMockReports = () => {
    return [
      {
        id: 'sched-1',
        reportName: 'Monthly Executive Summary',
        reportType: 'executive',
        frequency: 'monthly',
        day: 1,
        time: new Date().toISOString(),
        format: 'pdf',
        recipients: 'finance@municipality.gov, mayor@municipality.gov',
        description: 'Monthly executive summary with budget and compliance overview',
        status: 'active',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastExecuted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'sched-2',
        reportName: 'Weekly Budget Report',
        reportType: 'financial',
        frequency: 'weekly',
        day: 1, // Monday
        time: new Date().toISOString(),
        format: 'excel',
        recipients: 'budget@municipality.gov',
        description: 'Detailed budget analysis with departmental breakdowns',
        status: 'active',
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        lastExecuted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'sched-3',
        reportName: 'Quarterly Compliance Audit',
        reportType: 'compliance',
        frequency: 'quarterly',
        day: 1,
        time: new Date().toISOString(),
        format: 'pdf',
        recipients: 'compliance@municipality.gov, audit@municipality.gov',
        description: 'Comprehensive compliance audit with regulatory analysis',
        status: 'paused',
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        lastExecuted: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  };
  
  // Generate mock report execution history
  const generateMockReportHistory = () => {
    return [
      {
        id: 'exec-1',
        reportName: 'Monthly Executive Summary',
        executedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        recipients: 2,
        format: 'pdf',
        size: '1.2 MB'
      },
      {
        id: 'exec-2',
        reportName: 'Weekly Budget Report',
        executedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        recipients: 1,
        format: 'excel',
        size: '856 KB'
      },
      {
        id: 'exec-3',
        reportName: 'Quarterly Compliance Audit',
        executedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        recipients: 2,
        format: 'pdf',
        size: '3.4 MB'
      },
      {
        id: 'exec-4',
        reportName: 'Weekly Budget Report',
        executedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'failed',
        recipients: 1,
        format: 'excel',
        size: 'N/A',
        error: 'Data source unavailable'
      }
    ];
  };
  
  // Save scheduled reports to localStorage or API
  const saveScheduledReports = (reports) => {
    try {
      localStorage.setItem('scheduledReports', JSON.stringify(reports));
    } catch (err) {
      console.error('Failed to save scheduled reports:', err);
    }
  };
  
  // Open schedule dialog
  const handleOpenScheduleDialog = (report = null) => {
    if (report) {
      // Edit mode
      setIsEditing(true);
      setEditingId(report.id);
      setScheduleFormData({
        ...report,
        time: new Date(report.time)
      });
    } else {
      // Add mode
      setIsEditing(false);
      setEditingId(null);
      setScheduleFormData({
        reportName: '',
        reportType: 'executive',
        frequency: 'weekly',
        day: 1,
        time: new Date(),
        format: 'pdf',
        recipients: '',
        description: ''
      });
    }
    
    setOpenScheduleDialog(true);
  };
  
  // Close schedule dialog
  const handleCloseScheduleDialog = () => {
    setOpenScheduleDialog(false);
  };
  
  // Handle form field change
  const handleFormChange = (field, value) => {
    setScheduleFormData({
      ...scheduleFormData,
      [field]: value
    });
  };
  
  // Save scheduled report
  const handleSaveSchedule = () => {
    if (!scheduleFormData.reportName) {
      setError('Report name is required');
      return;
    }
    
    try {
      let updatedReports;
      
      if (isEditing) {
        // Update existing report
        updatedReports = scheduledReports.map(report => 
          report.id === editingId ? {
            ...scheduleFormData,
            time: scheduleFormData.time.toISOString(),
            status: 'active',
            lastModified: new Date().toISOString()
          } : report
        );
      } else {
        // Add new report
        const newReport = {
          ...scheduleFormData,
          id: `sched-${Date.now()}`,
          time: scheduleFormData.time.toISOString(),
          status: 'active',
          createdAt: new Date().toISOString(),
          lastExecuted: null
        };
        
        updatedReports = [...scheduledReports, newReport];
      }
      
      setScheduledReports(updatedReports);
      saveScheduledReports(updatedReports);
      
      // In a real implementation, this would call the report service
      reportGenerator.scheduleReport(scheduleFormData.reportType, {}, {
        frequency: scheduleFormData.frequency,
        day: scheduleFormData.day,
        recipients: scheduleFormData.recipients.split(',').map(email => email.trim()),
        format: scheduleFormData.format
      });
      
      setOpenScheduleDialog(false);
      setError(null);
    } catch (err) {
      console.error('Failed to save scheduled report:', err);
      setError('Failed to save scheduled report. Please try again.');
    }
  };
  
  // Delete scheduled report
  const handleDeleteReport = (id) => {
    try {
      const updatedReports = scheduledReports.filter(report => report.id !== id);
      setScheduledReports(updatedReports);
      saveScheduledReports(updatedReports);
    } catch (err) {
      console.error('Failed to delete scheduled report:', err);
      setError('Failed to delete scheduled report. Please try again.');
    }
  };
  
  // Toggle report status (active/paused)
  const handleToggleReportStatus = (id) => {
    try {
      const updatedReports = scheduledReports.map(report => {
        if (report.id === id) {
          return {
            ...report,
            status: report.status === 'active' ? 'paused' : 'active',
            lastModified: new Date().toISOString()
          };
        }
        return report;
      });
      
      setScheduledReports(updatedReports);
      saveScheduledReports(updatedReports);
    } catch (err) {
      console.error('Failed to update report status:', err);
      setError('Failed to update report status. Please try again.');
    }
  };
  
  // Execute report immediately
  const handleExecuteReportNow = (report) => {
    try {
      // In a real implementation, this would call the report service
      console.log(`Executing report "${report.reportName}" immediately`);
      
      // Add to execution history
      const executionRecord = {
        id: `exec-${Date.now()}`,
        reportName: report.reportName,
        executedAt: new Date().toISOString(),
        status: 'completed',
        recipients: report.recipients.split(',').length,
        format: report.format,
        size: Math.floor(Math.random() * 1000 + 500) + ' KB'
      };
      
      const updatedHistory = [executionRecord, ...scheduledReportHistory];
      setScheduledReportHistory(updatedHistory);
      localStorage.setItem('reportExecutionHistory', JSON.stringify(updatedHistory));
      
      // Update the last executed date
      const updatedReports = scheduledReports.map(r => {
        if (r.id === report.id) {
          return {
            ...r,
            lastExecuted: new Date().toISOString()
          };
        }
        return r;
      });
      
      setScheduledReports(updatedReports);
      saveScheduledReports(updatedReports);
    } catch (err) {
      console.error('Failed to execute report:', err);
      setError('Failed to execute report. Please try again.');
    }
  };
  
  // Get frequency text
  const getFrequencyText = (frequency, day) => {
    switch (frequency) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return `Weekly on ${days[day - 1]}`;
      case 'monthly':
        return `Monthly on day ${day}`;
      case 'quarterly':
        return 'Quarterly';
      default:
        return frequency;
    }
  };
  
  // Get report type text
  const getReportTypeText = (type) => {
    switch (type) {
      case 'executive':
        return 'Executive Summary';
      case 'financial':
        return 'Financial Report';
      case 'compliance':
        return 'Compliance Audit';
      case 'custom':
        return 'Custom Report';
      default:
        return type;
    }
  };
  
  // Get format icon
  const getFormatIcon = (format) => {
    switch (format) {
      case 'pdf':
        return <PdfIcon />;
      case 'excel':
        return <ExcelIcon />;
      case 'csv':
        return <CsvIcon />;
      default:
        return <ReportIcon />;
    }
  };
  
  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon color="success" />;
      case 'paused':
        return <TimelineIcon color="warning" />;
      case 'failed':
        return <ErrorIcon color="error" />;
      case 'completed':
        return <CheckCircleIcon color="info" />;
      default:
        return <NotificationsIcon />;
    }
  };
  
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Scheduled Reports
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Set up automatic report generation and distribution on your preferred schedule.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight={600}>
            Scheduled Reports
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenScheduleDialog()}
          >
            Add Schedule
          </Button>
        </Box>
        
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={5}>
            <CircularProgress />
          </Box>
        ) : scheduledReports.length > 0 ? (
          <Grid container spacing={3}>
            {scheduledReports.map(report => (
              <Grid item xs={12} md={6} lg={4} key={report.id}>
                <ScheduleCard>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {report.reportName}
                        </Typography>
                        
                        <Box display="flex" alignItems="center" mb={1}>
                          <ReportIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {getReportTypeText(report.reportType)}
                          </Typography>
                        </Box>
                        
                        <Box display="flex" alignItems="center" mb={1}>
                          <ScheduleIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {getFrequencyText(report.frequency, report.day)}
                          </Typography>
                        </Box>
                        
                        <Box display="flex" alignItems="center" mb={1}>
                          <CalendarIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {new Date(report.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Box>
                        
                        <Box display="flex" alignItems="center" mb={1}>
                          <MailIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            {report.recipients.split(',').length} recipient(s)
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box>
                        <ScheduleStatusChip
                          icon={getStatusIcon(report.status)}
                          label={report.status}
                          status={report.status}
                          size="small"
                        />
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box display="flex" alignItems="center" mb={2}>
                      <ReportChip
                        icon={getFormatIcon(report.format)}
                        label={report.format.toUpperCase()}
                        format={report.format}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      
                      {report.lastExecuted && (
                        <Typography variant="caption" color="textSecondary">
                          Last run: {new Date(report.lastExecuted).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between">
                      <Box>
                        <Tooltip title="Edit Schedule">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenScheduleDialog(report)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title={report.status === 'active' ? 'Pause Schedule' : 'Activate Schedule'}>
                          <IconButton
                            size="small"
                            color={report.status === 'active' ? 'warning' : 'success'}
                            onClick={() => handleToggleReportStatus(report.id)}
                          >
                            {report.status === 'active' ? (
                              <TimelineIcon fontSize="small" />
                            ) : (
                              <CheckCircleIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Delete Schedule">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteReport(report.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleExecuteReportNow(report)}
                      >
                        Run Now
                      </Button>
                    </Box>
                  </CardContent>
                </ScheduleCard>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              borderRadius: 3, 
              border: '1px dashed', 
              borderColor: 'divider'
            }}
          >
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No Scheduled Reports
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Click the "Add Schedule" button to create your first scheduled report.
            </Typography>
          </Box>
        )}
      </Paper>
      
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Report Execution History
        </Typography>
        
        {scheduledReportHistory.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Report Name</TableCell>
                  <TableCell>Executed</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Format</TableCell>
                  <TableCell>Recipients</TableCell>
                  <TableCell>Size</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scheduledReportHistory.map(execution => (
                  <TableRow key={execution.id}>
                    <TableCell>{execution.reportName}</TableCell>
                    <TableCell>{new Date(execution.executedAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <ScheduleStatusChip
                        label={execution.status}
                        status={execution.status}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <ReportChip
                        icon={getFormatIcon(execution.format)}
                        label={execution.format.toUpperCase()}
                        format={execution.format}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{execution.recipients}</TableCell>
                    <TableCell>{execution.size}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              borderRadius: 3, 
              border: '1px dashed', 
              borderColor: 'divider'
            }}
          >
            <Typography variant="body2" color="textSecondary">
              No report execution history available.
            </Typography>
          </Box>
        )}
      </Paper>
      
      {/* Schedule Dialog */}
      <Dialog
        open={openScheduleDialog}
        onClose={handleCloseScheduleDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {isEditing ? 'Edit Scheduled Report' : 'Add Scheduled Report'}
        </DialogTitle>
        
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Report Name"
                fullWidth
                value={scheduleFormData.reportName}
                onChange={(e) => handleFormChange('reportName', e.target.value)}
                required
                margin="normal"
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={scheduleFormData.reportType}
                  onChange={(e) => handleFormChange('reportType', e.target.value)}
                  label="Report Type"
                >
                  <MenuItem value="executive">Executive Summary</MenuItem>
                  <MenuItem value="financial">Financial Report</MenuItem>
                  <MenuItem value="compliance">Compliance Audit</MenuItem>
                  <MenuItem value="custom">Custom Report</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={scheduleFormData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={scheduleFormData.frequency}
                  onChange={(e) => handleFormChange('frequency', e.target.value)}
                  label="Frequency"
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                </Select>
              </FormControl>
              
              {scheduleFormData.frequency === 'weekly' && (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Day of Week</InputLabel>
                  <Select
                    value={scheduleFormData.day}
                    onChange={(e) => handleFormChange('day', e.target.value)}
                    label="Day of Week"
                  >
                    <MenuItem value={1}>Monday</MenuItem>
                    <MenuItem value={2}>Tuesday</MenuItem>
                    <MenuItem value={3}>Wednesday</MenuItem>
                    <MenuItem value={4}>Thursday</MenuItem>
                    <MenuItem value={5}>Friday</MenuItem>
                    <MenuItem value={6}>Saturday</MenuItem>
                    <MenuItem value={7}>Sunday</MenuItem>
                  </Select>
                </FormControl>
              )}
              
              {scheduleFormData.frequency === 'monthly' && (
                <TextField
                  label="Day of Month"
                  type="number"
                  fullWidth
                  value={scheduleFormData.day}
                  onChange={(e) => handleFormChange('day', parseInt(e.target.value, 10))}
                  InputProps={{ inputProps: { min: 1, max: 31 } }}
                  margin="normal"
                />
              )}
              
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Time"
                  value={scheduleFormData.time}
                  onChange={(newValue) => handleFormChange('time', newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                />
              </LocalizationProvider>
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Format</InputLabel>
                <Select
                  value={scheduleFormData.format}
                  onChange={(e) => handleFormChange('format', e.target.value)}
                  label="Format"
                >
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="excel">Excel</MenuItem>
                  <MenuItem value="csv">CSV</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                label="Recipients (comma separated)"
                fullWidth
                value={scheduleFormData.recipients}
                onChange={(e) => handleFormChange('recipients', e.target.value)}
                placeholder="email@example.com, another@example.com"
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseScheduleDialog}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveSchedule} 
            variant="contained"
          >
            {isEditing ? 'Update Schedule' : 'Add Schedule'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScheduledReportsManager;
