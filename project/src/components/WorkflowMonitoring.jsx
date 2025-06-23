import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  CircularProgress,
  Divider
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  Refresh, 
  CheckCircle, 
  Error, 
  Warning,
  DonutLarge,
  Pause,
  PlayArrow,
  Visibility,
  History,
  MoreVert,
  Cancel,
  Timeline,
  AccountTree
} from '@mui/icons-material';
import {
  Timeline as MuiTimeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import { workflowIntelligenceService } from '../services/workflowIntelligenceService';

const WorkflowMonitoring = () => {
  const [workflows, setWorkflows] = useState([]);
  const [filteredWorkflows, setFilteredWorkflows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const workflowTypes = {
    'budget-approval-workflow': 'Budget Approval',
    'procurement-workflow': 'Procurement',
    'document-approval-workflow': 'Document Approval'
  };

  useEffect(() => {
    const loadWorkflows = async () => {
      setIsLoading(true);
      try {
        // Initialize the service if needed
        await workflowIntelligenceService.initialize();
        
        // Get all workflow instances
        const instances = workflowIntelligenceService.getWorkflowInstances();
        
        // Format workflows for display
        const formattedWorkflows = instances.map(instance => {
          const template = workflowIntelligenceService.getWorkflowTemplate(instance.templateId);
          const currentStage = template.stages.find(s => s.id === instance.currentStage);
          
          return {
            id: instance.id,
            name: instance.name,
            type: instance.templateId,
            typeName: workflowTypes[instance.templateId] || instance.templateId,
            status: instance.status,
            currentStage: instance.currentStage,
            currentStageName: currentStage ? currentStage.name : instance.currentStage,
            startDate: new Date(instance.createdAt),
            history: instance.history || [],
            data: instance.data || {}
          };
        });
        
        setWorkflows(formattedWorkflows);
        setFilteredWorkflows(formattedWorkflows);
      } catch (error) {
        console.error('Error loading workflows:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWorkflows();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...workflows];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(workflow => 
        workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workflow.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(workflow => workflow.status === statusFilter);
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(workflow => workflow.type === typeFilter);
    }
    
    setFilteredWorkflows(filtered);
    setPage(0); // Reset to first page when filters change
  }, [workflows, searchTerm, statusFilter, typeFilter]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (workflow) => {
    setSelectedWorkflow(workflow);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
  };

  const renderStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle color="success" />;
      case 'in-progress':
        return <DonutLarge color="primary" />;
      case 'paused':
        return <Pause color="warning" />;
      case 'error':
        return <Error color="error" />;
      default:
        return <DonutLarge />;
    }
  };

  const renderStatusChip = (status) => {
    switch (status) {
      case 'completed':
        return <Chip label="Completed" color="success" size="small" />;
      case 'in-progress':
        return <Chip label="In Progress" color="primary" size="small" />;
      case 'paused':
        return <Chip label="Paused" color="warning" size="small" />;
      case 'error':
        return <Chip label="Error" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const renderWorkflowTimeline = (workflow) => {
    if (!workflow.history || workflow.history.length === 0) {
      return (
        <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
          No history available for this workflow.
        </Typography>
      );
    }
    
    return (
      <MuiTimeline position="alternate" sx={{ maxHeight: 400, overflow: 'auto' }}>
        {workflow.history.map((event, index) => (
          <TimelineItem key={index}>
            <TimelineOppositeContent color="text.secondary">
              {new Date(event.timestamp || event.completedAt).toLocaleString()}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color={
                event.stage.includes('rejection') ? 'error' : 
                event.stage.includes('approval') ? 'success' : 
                event.stage.includes('validation') ? 'warning' : 
                'primary'
              }>
                {event.stage.includes('rejection') ? <Cancel /> : 
                 event.stage.includes('approval') ? <CheckCircle /> : 
                 <AccountTree />}
              </TimelineDot>
              {index < workflow.history.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2">
                  {event.stage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Typography>
                <Typography variant="body2">{event.comments}</Typography>
                <Typography variant="caption" color="textSecondary">
                  Actor: {event.actor}
                </Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </MuiTimeline>
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
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h5" gutterBottom>
        Workflow Monitoring
      </Typography>
      <Typography variant="subtitle1" paragraph>
        Monitor and manage all workflow instances across the system
      </Typography>
      
      {/* Filter Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search Workflows"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="paused">Paused</MenuItem>
                <MenuItem value="error">Error</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Workflow Type</InputLabel>
              <Select
                value={typeFilter}
                label="Workflow Type"
                onChange={handleTypeFilterChange}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="budget-approval-workflow">Budget Approval</MenuItem>
                <MenuItem value="procurement-workflow">Procurement</MenuItem>
                <MenuItem value="document-approval-workflow">Document Approval</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => window.location.reload()}
              >
                Refresh
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Workflows Table */}
      <Paper>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Current Stage</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredWorkflows.length > 0 ? (
                filteredWorkflows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((workflow) => (
                    <TableRow key={workflow.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {renderStatusIcon(workflow.status)}
                          <Box sx={{ ml: 1 }}>
                            {renderStatusChip(workflow.status)}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">{workflow.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          ID: {workflow.id}
                        </Typography>
                      </TableCell>
                      <TableCell>{workflow.typeName}</TableCell>
                      <TableCell>{workflow.currentStageName}</TableCell>
                      <TableCell>{workflow.startDate.toLocaleString()}</TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small" 
                            onClick={() => handleViewDetails(workflow)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View History">
                          <IconButton 
                            size="small"
                            onClick={() => handleViewDetails(workflow)}
                          >
                            <History />
                          </IconButton>
                        </Tooltip>
                        {workflow.status === 'in-progress' && (
                          <Tooltip title="Pause Workflow">
                            <IconButton size="small">
                              <Pause />
                            </IconButton>
                          </Tooltip>
                        )}
                        {workflow.status === 'paused' && (
                          <Tooltip title="Resume Workflow">
                            <IconButton size="small">
                              <PlayArrow />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      No workflows found
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Try adjusting your search or filters
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredWorkflows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Workflow Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedWorkflow && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">
                  Workflow Details: {selectedWorkflow.name}
                </Typography>
                {renderStatusChip(selectedWorkflow.status)}
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        General Information
                      </Typography>
                      <Typography variant="body2">
                        <strong>ID:</strong> {selectedWorkflow.id}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Type:</strong> {selectedWorkflow.typeName}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Current Stage:</strong> {selectedWorkflow.currentStageName}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Started:</strong> {selectedWorkflow.startDate.toLocaleString()}
                      </Typography>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="subtitle1" gutterBottom>
                        Workflow Data
                      </Typography>
                      {Object.entries(selectedWorkflow.data).map(([key, value]) => (
                        <Typography variant="body2" key={key}>
                          <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {
                            typeof value === 'object' ? JSON.stringify(value) : 
                            key.includes('date') && value ? new Date(value).toLocaleString() :
                            String(value)
                          }
                        </Typography>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle1">
                          Workflow Timeline
                        </Typography>
                        <Chip 
                          icon={<Timeline />} 
                          label={`${selectedWorkflow.history.length} Events`} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </Box>
                      {renderWorkflowTimeline(selectedWorkflow)}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              {selectedWorkflow.status === 'in-progress' && (
                <Button
                  startIcon={<Pause />}
                  color="warning"
                  variant="outlined"
                >
                  Pause Workflow
                </Button>
              )}
              {selectedWorkflow.status === 'paused' && (
                <Button
                  startIcon={<PlayArrow />}
                  color="primary"
                  variant="outlined"
                >
                  Resume Workflow
                </Button>
              )}
              <Button onClick={handleCloseDetailsDialog}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default WorkflowMonitoring;
