import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Chip,
  Tooltip,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Stack,
  Alert,
  useMediaQuery
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Add as AddIcon,
  GetApp as DownloadIcon,
  Refresh as RefreshIcon,
  TrendingDown as TrendingDownIcon,
  Timeline as TimelineIcon,
  AttachMoney as AttachMoneyIcon,
  CreditCard as CreditCardIcon,
  CalendarToday as CalendarTodayIcon,
  Close as CloseIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { useBudgetStore } from '../store/budgetStore';
import { 
  formatCurrency, 
  formatDate, 
  calculatePercentage, 
  downloadCSV, 
  calculateTrend, 
  formatPercentageChange,
  getBudgetStatusColor,
  getBudgetStatusLabel,
  calculateRemainingDays
} from '../utils/helpers';
import { getBudgetStatusDescription } from '../utils/budgetHelpers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { optimizeBudget } from '../services/budgetOptimizationService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

// Styled components
const GlassCard = styled(Card)(({ theme }) => ({
  borderRadius: 24,
  background: 'rgba(255,255,255,0.85)',
  boxShadow: '0 8px 32px 0 rgba(25, 118, 210, 0.10)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(25, 118, 210, 0.08)',
  transition: 'all 0.2s cubic-bezier(.4,2,.3,1)',
  '&:hover': {
    boxShadow: '0 16px 48px 0 rgba(0, 172, 193, 0.15)',
    transform: 'translateY(-4px) scale(1.02)',
  },
}));

const StyledAvatar = styled(Avatar)(({ theme, statuscolor }) => ({
  backgroundColor: statuscolor || theme.palette.primary.main,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.15)',
  }
}));

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`budget-tabpanel-${index}`}
      aria-labelledby={`budget-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const StyledSearchBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const BudgetPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const budgetStore = useBudgetStore();
  
  // Local state
  const [openNewBudget, setOpenNewBudget] = useState(false);
  const [openTransaction, setOpenTransaction] = useState(false);
  const [openForecast, setOpenForecast] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [newBudget, setNewBudget] = useState({
    department: '',
    period: '',
    allocated: '',
    startDate: null,
    endDate: null,
    notes: ''
  });
  const [transaction, setTransaction] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [forecastData, setForecastData] = useState(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);ull);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [openAiDialog, setOpenAiDialog] = useState(false);
  
  // Filter states
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    budgetStore.initialize();
  }, []);

  const stats = budgetStore.budgetStatistics || {};
  const byDepartment = stats.byDepartment || [];
  const byPeriod = stats.byPeriod || [];
  const budgets = budgetStore.filteredBudgets || [];
  const departmentsList = budgetStore.departmentsList || [];
  const periodsList = budgetStore.periodsList || [];
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Apply filters
  const handleApplyFilters = () => {
    const filters = {};
    if (filterDepartment) filters.department = filterDepartment;
    if (filterPeriod) filters.period = filterPeriod;
    if (filterStatus) filters.status = filterStatus;
    budgetStore.updateBudgetFilters(filters);
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setFilterDepartment('');
    setFilterPeriod('');
    setFilterStatus('');
    budgetStore.resetBudgetFilters();
  };
  
  // Handle new budget form changes
  const handleNewBudgetChange = (field) => (event) => {
    setNewBudget({
      ...newBudget,
      [field]: event.target.value
    });
  };
  
  // Handle date changes for new budget
  const handleDateChange = (field) => (date) => {
    setNewBudget({
      ...newBudget,
      [field]: date ? date.toISOString().split('T')[0] : null
    });
  // Create new budget
  const handleCreateBudget = () => {
    const allocated = parseFloat(newBudget.allocated);
    
    // Enhanced validation
    if (!newBudget.department || !newBudget.period || !newBudget.allocated || !newBudget.startDate || !newBudget.endDate) {
      alert('Please fill in all required fields.');
      return;
    }
    if (allocated <= 0) {
      alert('Allocated budget must be greater than zero.');
      return;
    }
    if (new Date(newBudget.startDate) >= new Date(newBudget.endDate)) {
      alert('Start date must be before end date.');
      return;
    }
    
    budgetStore.createBudget({
      ...newBudget,
      allocated,
      spent: 0,
      status: 'active',
    });
    
    // Reset form and close dialog
    setNewBudget({
      department: '',
      period: '',
      allocated: '',
      startDate: null,
      endDate: null,
      notes: ''
    });
  // Add transaction to budget
  const handleAddTransaction = () => {
    const amount = parseFloat(transaction.amount);
    
    // Enhanced validation
    if (!transaction.amount || !transaction.description) {
      alert('Please fill in all required fields.');
      return;
    }
    if (amount <= 0) {
      alert('Transaction amount must be greater than zero.');
      return;
    }
    
    budgetStore.addTransaction(selectedBudgetId, {
      ...transaction,
      amount,
    });
    
    // Reset form and close dialog
    setTransaction({
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setOpenTransaction(false);
  };
  // Generate forecast
  const handleGenerateForecast = async () => {
    if (selectedBudgetId && forecastMonths > 0) {
      setForecastLoading(true);
      try {
        const forecast = await budgetStore.generateForecast(selectedBudgetId, forecastMonths);
        setForecastData(forecast);
      } catch (error) {
        console.error('Forecast generation failed', error);
        alert('Failed to generate forecast. Please try again.');
      } finally {
        setForecastLoading(false);
      }
    }
  };setTransaction({
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setOpenTransaction(false);
  };
  
  // Open transaction dialog
  const openTransactionDialog = (budgetId) => {
    setSelectedBudgetId(budgetId);
    setOpenTransaction(true);
  };
  
  // Generate forecast
  const handleGenerateForecast = () => {
    if (selectedBudgetId && forecastMonths > 0) {
      const forecast = budgetStore.generateForecast(selectedBudgetId, forecastMonths);
      setForecastData(forecast);
    }
  };
  
  // Trigger AI budget optimization
  const handleOptimizeBudgets = async () => {
    setAiLoading(true);
    try {
      const suggestions = await optimizeBudget({ budgets });
      setAiSuggestions(suggestions);
      setOpenAiDialog(true);
    } catch (error) {
      console.error('AI Optimization failed', error);
    } finally {
      setAiLoading(false);
    }
  };

  // Open forecast dialog
  const openForecastDialog = (budgetId) => {
    setSelectedBudgetId(budgetId);
    setForecastData(null);
    setOpenForecast(true);
  };
  
  // Export budget data
  const handleExportBudget = (budgetId) => {
    const csvData = budgetStore.exportBudget(budgetId);
    if (csvData) {
      const department = budgetStore.budgets.find(b => b.id === budgetId)?.department || 'department';
      downloadCSV(csvData, `${department.replace(/\s+/g, '-')}-budget.csv`);
    }
  };
  
  // Export all budgets
  const handleExportAllBudgets = () => {
    const csvData = budgetStore.exportAllBudgets();
    if (csvData) {
      downloadCSV(csvData, 'all-budgets.csv');
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h2" sx={{
          fontWeight: 900,
          letterSpacing: '-0.03em',
          color: 'primary.main',
          textShadow: '0 2px 8px rgba(25, 118, 210, 0.10)',
        }}>
          Budget Management
        </Typography>
        
        <Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setOpenNewBudget(true)}
            sx={{ mr: 1, borderRadius: 8 }}
          >
            New Budget
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />}
            onClick={handleExportAllBudgets}
            sx={{ borderRadius: 8 }}
          >
            Export All
          </Button>
          <Button variant="contained" onClick={handleOptimizeBudgets} disabled={aiLoading} sx={{ ml:1 }}>
            Optimize Budgets
          </Button>
        </Box>
      </Box>

      {/* Executive Summary */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <GlassCard>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <StyledAvatar sx={{ mr: 2 }}>
                  <AccountBalanceIcon />
                </StyledAvatar>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Total Budgets
                  </Typography>
                  <Typography variant="h5" fontWeight={800}>{stats.totalBudgets || 0}</Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="textSecondary">
                Current Periods: {byPeriod.length}
              </Typography>
            </CardContent>
          </GlassCard>
        </Grid>
        <Grid item xs={12} md={3}>
          <GlassCard>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <StyledAvatar sx={{ bgcolor: theme.palette.success.main, mr: 2 }}>
                  <TrendingUpIcon />
                </StyledAvatar>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Total Allocated
                  </Typography>
                  <Typography variant="h5" fontWeight={800}>{formatCurrency(stats.totalAllocated || 0)}</Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="textSecondary">
                Spent: {formatCurrency(stats.totalSpent || 0)}
              </Typography>
            </CardContent>
          </GlassCard>
        </Grid>
        <Grid item xs={12} md={3}>
          <GlassCard>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <StyledAvatar sx={{ bgcolor: theme.palette.info.main, mr: 2 }}>
                  <AssessmentIcon />
                </StyledAvatar>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Overall Spent %
                  </Typography>
                  <Typography variant="h5" fontWeight={800}>{(stats.overallSpentPercentage || 0).toFixed(1)}%</Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <LinearProgress
                variant="determinate"
                value={Math.min(stats.overallSpentPercentage || 0, 100)}
                sx={{ height: 10, borderRadius: 5, background: theme.palette.grey[200] }}
                color={stats.overallSpentPercentage > 100 ? 'error' : stats.overallSpentPercentage > 90 ? 'warning' : 'success'}
              />
            </CardContent>
          </GlassCard>
        </Grid>
        <Grid item xs={12} md={3}>
          <GlassCard>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <StyledAvatar sx={{ bgcolor: theme.palette.warning.main, mr: 2 }}>
                  <WarningIcon />
                </StyledAvatar>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Overspent Depts
                  </Typography>
                  <Typography variant="h5" fontWeight={800}>
                    {byDepartment.filter(d => d.spent > d.allocated).length}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="textSecondary">
                At Risk: {byDepartment.filter(d => d.spent / d.allocated > 0.9 && d.spent <= d.allocated).length}
              </Typography>
            </CardContent>
          </GlassCard>
        </Grid>
      </Grid>

      {/* Filters and Tabs */}
      <GlassCard sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons={isMobile ? "auto" : false}
            >
              <Tab label="Overview" id="budget-tab-0" />
              <Tab label="Departments" id="budget-tab-1" />
              <Tab label="Periods" id="budget-tab-2" />
              <Tab label="Detailed List" id="budget-tab-3" />
            </Tabs>
          </Box>
          
          <Box mt={2}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    label="Department"
                  >
                    <MenuItem value="">All Departments</MenuItem>
                    {departmentsList.map((dept) => (
                      <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Period</InputLabel>
                  <Select
                    value={filterPeriod}
                    onChange={(e) => setFilterPeriod(e.target.value)}
                    label="Period"
                  >
                    <MenuItem value="">All Periods</MenuItem>
                    {periodsList.map((period) => (
                      <MenuItem key={period} value={period}>{period}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack direction="row" spacing={1}>
                  <Button 
                    variant="contained" 
                    onClick={handleApplyFilters}
                    startIcon={<SearchIcon />}
                    size="small"
                  >
                    Apply Filters
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={handleResetFilters}
                    startIcon={<RefreshIcon />}
                    size="small"
                  >
                    Reset
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </GlassCard>

      {/* Tabs Content */}
      <TabPanel value={tabValue} index={0}>
        {/* Departmental Budgets - Top 3 with Issues */}
        <Typography variant="h5" fontWeight={800} mb={2}>
          Departments Requiring Attention
        </Typography>
        <Grid container spacing={3} mb={4}>
          {byDepartment
            .filter(dept => (dept.spent / dept.allocated) * 100 > 85)
            .sort((a, b) => (b.spent / b.allocated) - (a.spent / a.allocated))
            .slice(0, 3)
            .map((dept) => {
              const spentPct = dept.allocated === 0 ? 0 : (dept.spent / dept.allocated) * 100;
              const isOver = dept.spent > dept.allocated;
              const isWarning = spentPct > 90 && !isOver;
              return (
                <Grid item xs={12} md={4} key={dept.department}>
                  <GlassCard>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <StyledAvatar 
                          sx={{ mr: 2 }}
                          statuscolor={isOver ? theme.palette.error.main : isWarning ? theme.palette.warning.main : theme.palette.success.main}
                        >
                          {isOver ? <ErrorIcon /> : isWarning ? <WarningIcon /> : <CheckCircleIcon />}
                        </StyledAvatar>
                        <Box>
                          <Typography variant="h6" fontWeight={700}>{dept.department}</Typography>
                          <Chip
                            label={isOver ? 'Overspent' : isWarning ? 'At Risk' : 'Caution'}
                            color={isOver ? 'error' : isWarning ? 'warning' : 'info'}
                            size="small"
                            sx={{ fontWeight: 700 }}
                          />
                        </Box>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="textSecondary">
                          Allocated:
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(dept.allocated)}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="textSecondary">
                          Spent:
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color={isOver ? 'error.main' : 'inherit'}>
                          {formatCurrency(dept.spent)}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="textSecondary">
                          Remaining:
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color={isOver ? 'error.main' : 'inherit'}>
                          {formatCurrency(dept.allocated - dept.spent)}
                        </Typography>
                      </Box>
                      <Tooltip title={isOver ? 'Department has exceeded its budget!' : isWarning ? 'Department is approaching its budget limit.' : 'Within budget but nearing threshold.'}>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(spentPct, 100)}
                          color={isOver ? 'error' : isWarning ? 'warning' : 'info'}
                          sx={{ height: 12, borderRadius: 6, background: theme.palette.grey[200], mb: 1 }}
                        />
                      </Tooltip>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="caption" color={isOver ? 'error.main' : isWarning ? 'warning.main' : 'info.main'} fontWeight={700}>
                          {spentPct.toFixed(1)}% Spent
                        </Typography>
                        <Typography variant="caption">
                          {dept.count} budget{dept.count !== 1 ? 's' : ''}
                        </Typography>
                      </Box>
                    </CardContent>
                  </GlassCard>
                </Grid>
              );
            })}
        </Grid>

        {/* Recent Transactions */}
        <Typography variant="h5" fontWeight={800} mb={2}>
          Recent Budget Activities
        </Typography>
        <GlassCard sx={{ mb: 4 }}>
          <TableContainer component={Box}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><Typography fontWeight={700}>Department</Typography></TableCell>
                  <TableCell><Typography fontWeight={700}>Period</Typography></TableCell>
                  <TableCell><Typography fontWeight={700}>Transaction</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight={700}>Amount</Typography></TableCell>
                  <TableCell><Typography fontWeight={700}>Date</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {budgets
                  .filter(budget => budget.history && budget.history.length > 0)
                  .flatMap(budget => 
                    budget.history.map(transaction => ({
                      department: budget.department,
                      period: budget.period,
                      ...transaction,
                      budgetId: budget.id
                    }))
                  )
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 5)
                  .map((transaction, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{transaction.department}</TableCell>
                      <TableCell>{transaction.period}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell align="right">
                        <Typography 
                          fontWeight={600} 
                          color={transaction.amount > 100000 ? 'error.main' : 'inherit'}
                        >
                          {formatCurrency(transaction.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                    </TableRow>
                  ))}
                {budgets.filter(budget => budget.history && budget.history.length > 0).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No recent transactions found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </GlassCard>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* Departmental Budgets */}
        <Grid container spacing={3}>
          {byDepartment.map((dept) => {
            const spentPct = dept.allocated === 0 ? 0 : (dept.spent / dept.allocated) * 100;
            const isOver = dept.spent > dept.allocated;
            const isWarning = spentPct > 90 && !isOver;
            return (
              <Grid item xs={12} md={6} lg={4} key={dept.department}>
                <GlassCard>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <StyledAvatar 
                        sx={{ mr: 2 }}
                        statuscolor={isOver ? theme.palette.error.main : isWarning ? theme.palette.warning.main : theme.palette.success.main}
                      >
                        {isOver ? <ErrorIcon /> : isWarning ? <WarningIcon /> : <CheckCircleIcon />}
                      </StyledAvatar>
                      <Box>
                        <Typography variant="h6" fontWeight={700}>{dept.department}</Typography>
                        <Chip
                          label={isOver ? 'Overspent' : isWarning ? 'At Risk' : 'Healthy'}
                          color={isOver ? 'error' : isWarning ? 'warning' : 'success'}
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      </Box>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="textSecondary">
                        Allocated:
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(dept.allocated)}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="textSecondary">
                        Spent:
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color={isOver ? 'error.main' : 'inherit'}>
                        {formatCurrency(dept.spent)}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="textSecondary">
                        Remaining:
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color={isOver ? 'error.main' : 'inherit'}>
                        {formatCurrency(dept.allocated - dept.spent)}
                      </Typography>
                    </Box>
                    <Tooltip title={isOver ? 'Department has exceeded its budget!' : isWarning ? 'Department is approaching its budget limit.' : 'Within budget.'}>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(spentPct, 100)}
                        color={isOver ? 'error' : isWarning ? 'warning' : 'success'}
                        sx={{ height: 12, borderRadius: 6, background: theme.palette.grey[200], mb: 1 }}
                      />
                    </Tooltip>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="caption" color={isOver ? 'error.main' : isWarning ? 'warning.main' : 'success.main'} fontWeight={700}>
                        {spentPct.toFixed(1)}% Spent
                      </Typography>
                      <Typography variant="caption">
                        {dept.count} budget{dept.count !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  </CardContent>
                </GlassCard>
              </Grid>
            );
          })}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {/* Period Budgets */}
        <Grid container spacing={3}>
          {byPeriod.map((period) => {
            const spentPct = period.allocated === 0 ? 0 : (period.spent / period.allocated) * 100;
            const isOver = period.spent > period.allocated;
            const isWarning = spentPct > 90 && !isOver;
            
            // Calculate trend if we have data for multiple quarters
            const trends = stats.trends?.quarterlySpending || {};
            const quarters = Object.keys(trends).sort();
            const currentQuarterIndex = quarters.indexOf(period.period);
            
            let trendData = null;
            if (currentQuarterIndex > 0) {
              const previousQuarter = quarters[currentQuarterIndex - 1];
              const previousSpending = trends[previousQuarter] || 0;
              if (previousSpending > 0) {
                trendData = calculateTrend(period.spent, previousSpending);
              }
            }
            
            return (
              <Grid item xs={12} md={6} lg={4} key={period.period}>
                <GlassCard>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <StyledAvatar 
                        sx={{ mr: 2 }}
                        statuscolor={theme.palette.secondary.main}
                      >
                        <CalendarTodayIcon />
                      </StyledAvatar>
                      <Box>
                        <Typography variant="h6" fontWeight={700}>{period.period}</Typography>
                        <Chip
                          label={isOver ? 'Overspent' : isWarning ? 'At Risk' : 'Healthy'}
                          color={isOver ? 'error' : isWarning ? 'warning' : 'success'}
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      </Box>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="textSecondary">
                        Allocated:
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(period.allocated)}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="textSecondary">
                        Spent:
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color={isOver ? 'error.main' : 'inherit'}>
                        {formatCurrency(period.spent)}
                      </Typography>
                    </Box>
                    
                    {trendData && (
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="textSecondary">
                          Trend:
                        </Typography>
                        <Box display="flex" alignItems="center">
                          {trendData.direction === 'increasing' ? (
                            <TrendingUpIcon fontSize="small" color="error" sx={{ mr: 0.5 }} />
                          ) : (
                            <TrendingDownIcon fontSize="small" color="success" sx={{ mr: 0.5 }} />
                          )}
                          <Typography 
                            variant="body2" 
                            fontWeight={600}
                            color={trendData.direction === 'increasing' ? 'error.main' : 'success.main'}
                          >
                            {formatPercentageChange(trendData.percentage)}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" color="textSecondary">
                        Remaining:
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color={isOver ? 'error.main' : 'inherit'}>
                        {formatCurrency(period.allocated - period.spent)}
                      </Typography>
                    </Box>
                    
                    <Tooltip title={isOver ? 'Period overspent!' : isWarning ? 'Approaching budget limit.' : 'Within budget.'}>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(spentPct, 100)}
                        color={isOver ? 'error' : isWarning ? 'warning' : 'success'}
                        sx={{ height: 12, borderRadius: 6, background: theme.palette.grey[200], mb: 1 }}
                      />
                    </Tooltip>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="caption" color={isOver ? 'error.main' : isWarning ? 'warning.main' : 'success.main'} fontWeight={700}>
                        {spentPct.toFixed(1)}% Spent
                      </Typography>
                      <Typography variant="caption">
                        {period.count} department{period.count !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  </CardContent>
                </GlassCard>
              </Grid>
            );
          })}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        {/* Detailed Budget List */}
        <GlassCard>
          <TableContainer component={Box}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography fontWeight={700}>Department</Typography></TableCell>
                  <TableCell><Typography fontWeight={700}>Period</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight={700}>Allocated</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight={700}>Spent</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight={700}>Remaining</Typography></TableCell>
                  <TableCell><Typography fontWeight={700}>Status</Typography></TableCell>
                  <TableCell><Typography fontWeight={700}>Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {budgets.map((budget) => {
                  const spentPct = budget.allocated === 0 ? 0 : (budget.spent / budget.allocated) * 100;
                  const remaining = budget.allocated - budget.spent;
                  const remainingDays = calculateRemainingDays(budget.endDate);
                  
                  return (
                    <TableRow key={budget.id} hover>
                      <TableCell>{budget.department}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">{budget.period}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {budget.status === 'active' && remainingDays > 0 ? 
                              `${remainingDays} days remaining` : 
                              budget.status === 'active' ? 'Ends today' : 'Closed'
                            }
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">{formatCurrency(budget.allocated)}</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600} color={budget.spent > budget.allocated ? 'error.main' : 'inherit'}>
                          {formatCurrency(budget.spent)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box>
                          <Typography fontWeight={600} color={remaining < 0 ? 'error.main' : 'inherit'}>
                            {formatCurrency(remaining)}
                          </Typography>
                          <Typography variant="caption" color={
                            spentPct > 100 ? 'error.main' : spentPct > 90 ? 'warning.main' : 'success.main'
                          }>
                            {spentPct.toFixed(1)}% used
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getBudgetStatusLabel(budget.allocated, budget.spent)}
                          size="small"
                          sx={{ 
                            bgcolor: alpha(getBudgetStatusColor(budget.allocated, budget.spent), 0.1),
                            color: getBudgetStatusColor(budget.allocated, budget.spent),
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Add Transaction">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => openTransactionDialog(budget.id)}
                              disabled={budget.status !== 'active'}
                            >
                              <AttachMoneyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Generate Forecast">
                            <IconButton 
                              size="small" 
                              color="secondary"
      {/* New Budget Dialog */}
      <Dialog open={openNewBudget} onClose={() => setOpenNewBudget(false)} maxWidth="sm" fullWidth fullScreen={isMobile}>
                              <TimelineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Export">
                            <IconButton 
                              size="small" 
                              onClick={() => handleExportBudget(budget.id)}
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {budgets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">No budgets matching your filters</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </GlassCard>
      </TabPanel>

      {/* New Budget Dialog */}
      <Dialog open={openNewBudget} onClose={() => setOpenNewBudget(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Create New Budget</Typography>
            <IconButton size="small" onClick={() => setOpenNewBudget(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField
                label="Department"
                fullWidth
                required
                value={newBudget.department}
                onChange={handleNewBudgetChange('department')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Period (e.g., 2025 Q3)"
                fullWidth
                required
                value={newBudget.period}
                onChange={handleNewBudgetChange('period')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Allocated Budget"
                fullWidth
                required
                type="number"
                value={newBudget.allocated}
                onChange={handleNewBudgetChange('allocated')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">R</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={newBudget.startDate ? new Date(newBudget.startDate) : null}
                  onChange={handleDateChange('startDate')}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={newBudget.endDate ? new Date(newBudget.endDate) : null}
      {/* Transaction Dialog */}
      <Dialog open={openTransaction} onClose={() => setOpenTransaction(false)} maxWidth="sm" fullWidth fullScreen={isMobile}>
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes"
                fullWidth
                multiline
                rows={3}
                value={newBudget.notes}
                onChange={handleNewBudgetChange('notes')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewBudget(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateBudget}
            disabled={!newBudget.department || !newBudget.period || !newBudget.allocated || !newBudget.startDate || !newBudget.endDate}
          >
            Create Budget
          </Button>
        </DialogActions>
      </Dialog>

      {/* Transaction Dialog */}
      <Dialog open={openTransaction} onClose={() => setOpenTransaction(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Add Transaction</Typography>
            <IconButton size="small" onClick={() => setOpenTransaction(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedBudgetId && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Adding transaction to {budgetStore.budgets.find(b => b.id === selectedBudgetId)?.department} budget for {budgetStore.budgets.find(b => b.id === selectedBudgetId)?.period}
            </Alert>
          )}
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField
                label="Transaction Amount"
                fullWidth
                required
                type="number"
                value={transaction.amount}
                onChange={handleTransactionChange('amount')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">R</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                required
                value={transaction.description}
                onChange={handleTransactionChange('description')}
      {/* Forecast Dialog */}
      <Dialog open={openForecast} onClose={() => setOpenForecast(false)} maxWidth="md" fullWidth fullScreen={isMobile}>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Transaction Date"
                  value={transaction.date ? new Date(transaction.date) : null}
                  onChange={(date) => setTransaction({
                    ...transaction,
                    date: date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
                  })}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTransaction(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleAddTransaction}
            disabled={!transaction.amount || !transaction.description}
          >
            Add Transaction
          </Button>
        </DialogActions>
      </Dialog>

      {/* Forecast Dialog */}
      <Dialog open={openForecast} onClose={() => setOpenForecast(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Budget Forecast</Typography>
            <IconButton size="small" onClick={() => setOpenForecast(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedBudgetId && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Forecasting for {budgetStore.budgets.find(b => b.id === selectedBudgetId)?.department} budget ({budgetStore.budgets.find(b => b.id === selectedBudgetId)?.period})
            </Alert>
          )}
          
          <Box mb={3}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  label="Forecast Months"
                  type="number"
                  value={forecastMonths}
                  onChange={(e) => setForecastMonths(parseInt(e.target.value) || 1)}
                  InputProps={{ inputProps: { min: 1, max: 12 } }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Button 
                  variant="contained"
                  onClick={handleGenerateForecast}
                  startIcon={<TimelineIcon />}
                  fullWidth
                >
                  Generate Forecast
                </Button>
              </Grid>
            </Grid>
          </Box>
          
          {forecastData ? (
            <Box>
              <GlassCard sx={{ mb: 3 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="textSecondary">Current Spending</Typography>
                      <Typography variant="h6" fontWeight={700}>{formatCurrency(forecastData.spent)}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="textSecondary">Budget Remaining</Typography>
                      <Typography 
                        variant="h6" 
                        fontWeight={700}
                        color={forecastData.remaining < 0 ? 'error.main' : 'inherit'}
                      >
                        {formatCurrency(forecastData.remaining)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body2" color="textSecondary">Monthly Burn Rate</Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {forecastData.burnRatePerMonth.toFixed(1)}% / month
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" color="textSecondary" mb={1}>
                        Time to Budget Depletion
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <LinearProgress
                          variant="determinate"
                          value={Math.min((forecastData.spent / forecastData.allocated) * 100, 100)}
                          color={forecastData.remaining < 0 ? 'error' : forecastData.monthsToDepletion < 1 ? 'warning' : 'success'}
                          sx={{ height: 20, borderRadius: 10, flexGrow: 1, mr: 2 }}
                        />
                        <Typography variant="body1" fontWeight={700}>
                          {forecastData.remaining <= 0 
                            ? 'Depleted' 
                            : `${forecastData.monthsToDepletion} months`}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </GlassCard>
              
              <Typography variant="h6" fontWeight={700} mb={2}>Spending Forecast</Typography>
              <TableContainer component={GlassCard}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><Typography fontWeight={700}>Period</Typography></TableCell>
                      <TableCell align="right"><Typography fontWeight={700}>Projected Spending</Typography></TableCell>
                      <TableCell align="right"><Typography fontWeight={700}>Cumulative Spending</Typography></TableCell>
                      <TableCell><Typography fontWeight={700}>Status</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {forecastData.forecast.map((forecast, index) => {
                      const cumulativeSpent = forecast.cumulativeSpending;
                      const isOverBudget = cumulativeSpent > forecastData.allocated;
                      const remainingBudget = forecastData.allocated - cumulativeSpent;
                      const percentSpent = (cumulativeSpent / forecastData.allocated) * 100;
                      
                      return (
                        <TableRow key={index} hover>
                          <TableCell>{forecast.period}</TableCell>
                          <TableCell align="right">{formatCurrency(forecast.projectedSpending)}</TableCell>
                          <TableCell align="right">
                            <Typography fontWeight={600} color={isOverBudget ? 'error.main' : 'inherit'}>
                              {formatCurrency(cumulativeSpent)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={isOverBudget ? `Over by ${formatCurrency(Math.abs(remainingBudget))}` : `${percentSpent.toFixed(1)}% Used`}
                              size="small"
                              color={isOverBudget ? 'error' : percentSpent > 90 ? 'warning' : 'success'}
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box mt={2}>
                <Alert severity="info">
                  <Typography variant="body2">
                    This forecast is based on historical spending patterns and may not account for special circumstances or future budget adjustments.
                  </Typography>
                </Alert>
              </Box>
            </Box>
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" py={4}>
              <Typography color="textSecondary">Click 'Generate Forecast' to see budget projections</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForecast(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* AI Optimization Dialog */}
      <Dialog open={openAiDialog} onClose={() => setOpenAiDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Budget Optimization Suggestions</DialogTitle>
        <DialogContent dividers>
          {aiLoading ? <CircularProgress /> : (
            aiSuggestions ? (
              <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(aiSuggestions, null, 2)}</pre>
            ) : <Typography>No suggestions received.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAiDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BudgetPage;