import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Approval, 
  Search, 
  FilterList, 
  Assignment, 
  AccessTime, 
  CheckCircle, 
  Cancel, 
  Comment, 
  MoreVert,
  Sort,
  NotificationImportant,
  Person,
  VerifiedUser,
  Description,
  ThumbUp,
  ThumbDown
} from '@mui/icons-material';
import { workflowIntelligenceService } from '../services/workflowIntelligenceService';

const ApprovalQueue = () => {
  const [approvals, setApprovals] = useState([]);
  const [filteredApprovals, setFilteredApprovals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('priority');
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [comments, setComments] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Mock user ID for approvals
  const currentUserId = 'user-123';

  useEffect(() => {
    const loadApprovals = async () => {
      setIsLoading(true);
      try {
        // Initialize the service if needed
        await workflowIntelligenceService.initialize();
        
        // Get approvals from the service
        const approvalQueue = workflowIntelligenceService.getApprovalQueue();
        
        // Format the approvals for display
        const formattedApprovals = approvalQueue.map(item => ({
          id: item.id,
          workflowId: item.workflowId,
          title: item.name,
          stage: item.stage,
          priority: item.priority,
          dueDate: new Date(item.dueDate),
          assignedRoles: item.assignedRoles || [],
          data: item.data,
          createdAt: item.createdAt ? new Date(item.createdAt) : new Date()
        }));
        
        setApprovals(formattedApprovals);
        setFilteredApprovals(formattedApprovals);
      } catch (error) {
        console.error('Error loading approval queue:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadApprovals();
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...approvals];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(approval => 
        approval.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        approval.data?.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(approval => approval.priority === priorityFilter);
    }
    
    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(approval => 
        approval.assignedRoles.includes(roleFilter)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'dueDate':
          return a.dueDate - b.dueDate;
        case 'createdAt':
          return b.createdAt - a.createdAt;
        default:
          return 0;
      }
    });
    
    setFilteredApprovals(filtered);
  }, [approvals, searchTerm, priorityFilter, roleFilter, sortOrder]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePriorityFilterChange = (event) => {
    setPriorityFilter(event.target.value);
  };

  const handleRoleFilterChange = (event) => {
    setRoleFilter(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleApprovalSelect = (approval) => {
    setSelectedApproval(approval);
  };

  const handleApprovalDialogOpen = () => {
    setApprovalDialogOpen(true);
  };

  const handleApprovalDialogClose = () => {
    setApprovalDialogOpen(false);
  };

  const handleRejectionDialogOpen = () => {
    setRejectionDialogOpen(true);
  };

  const handleRejectionDialogClose = () => {
    setRejectionDialogOpen(false);
  };

  const handleCommentsChange = (event) => {
    setComments(event.target.value);
  };

  const handleApprove = () => {
    if (!selectedApproval) return;
    
    try {
      workflowIntelligenceService.processApproval(
        selectedApproval.id,
        true,
        currentUserId,
        comments
      );
      
      // Update the local state
      const updatedApprovals = approvals.filter(
        approval => approval.id !== selectedApproval.id
      );
      setApprovals(updatedApprovals);
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Approval processed successfully',
        severity: 'success'
      });
      
      // Close the dialog
      setApprovalDialogOpen(false);
      setSelectedApproval(null);
      setComments('');
    } catch (error) {
      console.error('Error processing approval:', error);
      setSnackbar({
        open: true,
        message: 'Error processing approval',
        severity: 'error'
      });
    }
  };

  const handleReject = () => {
    if (!selectedApproval) return;
    
    try {
      workflowIntelligenceService.processApproval(
        selectedApproval.id,
        false,
        currentUserId,
        comments
      );
      
      // Update the local state
      const updatedApprovals = approvals.filter(
        approval => approval.id !== selectedApproval.id
      );
      setApprovals(updatedApprovals);
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Rejection processed successfully',
        severity: 'success'
      });
      
      // Close the dialog
      setRejectionDialogOpen(false);
      setSelectedApproval(null);
      setComments('');
    } catch (error) {
      console.error('Error processing rejection:', error);
      setSnackbar({
        open: true,
        message: 'Error processing rejection',
        severity: 'error'
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDueDate = (date) => {
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day(s)`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else {
      return `Due in ${diffDays} day(s)`;
    }
  };

  const isOverdue = (date) => {
    return date < new Date();
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
        Approval Queue
      </Typography>
      <Typography variant="subtitle1" paragraph>
        Manage and process approval requests across all workflows
      </Typography>
      
      {/* Filter and Search Row */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search"
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
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Priority</InputLabel>
              <Select
                value={priorityFilter}
                label="Priority"
                onChange={handlePriorityFilterChange}
              >
                <MenuItem value="all">All Priorities</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                label="Role"
                onChange={handleRoleFilterChange}
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="finance-director">Finance Director</MenuItem>
                <MenuItem value="cfo">CFO</MenuItem>
                <MenuItem value="department-head">Department Head</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortOrder}
                label="Sort By"
                onChange={handleSortOrderChange}
                startAdornment={
                  <InputAdornment position="start">
                    <Sort />
                  </InputAdornment>
                }
              >
                <MenuItem value="priority">Priority</MenuItem>
                <MenuItem value="dueDate">Due Date</MenuItem>
                <MenuItem value="createdAt">Date Created</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ textAlign: 'right' }}>
              <Chip 
                icon={<Assignment />} 
                label={`${filteredApprovals.length} Approvals`}
                color="primary"
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Approval List */}
      <Grid container spacing={3}>
        {/* Approval List Column */}
        <Grid item xs={12} md={selectedApproval ? 7 : 12}>
          <Paper sx={{ height: '100%' }}>
            <List sx={{ p: 0 }}>
              {filteredApprovals.length > 0 ? (
                filteredApprovals.map((approval, index) => (
                  <React.Fragment key={approval.id}>
                    <ListItem 
                      button 
                      selected={selectedApproval && selectedApproval.id === approval.id}
                      onClick={() => handleApprovalSelect(approval)}
                      sx={{ 
                        p: 2,
                        bgcolor: isOverdue(approval.dueDate) && approval.priority === 'high' ? 
                          'error.light' : 'inherit'
                      }}
                    >
                      <ListItemIcon>
                        <Approval color={getPriorityColor(approval.priority)} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle1" component="span">
                              {approval.title}
                            </Typography>
                            {isOverdue(approval.dueDate) && (
                              <Chip 
                                size="small"
                                label="OVERDUE"
                                color="error"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              Stage: {approval.stage.replace(/-/g, ' ')}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {approval.data?.department && `Department: ${approval.data.department}`}
                              {approval.data?.amount && `, Amount: $${approval.data.amount.toLocaleString()}`}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <Chip 
                                size="small"
                                label={approval.priority.toUpperCase()}
                                color={getPriorityColor(approval.priority)}
                                sx={{ mr: 1 }}
                              />
                              <Tooltip title={approval.dueDate.toLocaleString()}>
                                <Chip
                                  size="small"
                                  icon={<AccessTime />}
                                  label={formatDueDate(approval.dueDate)}
                                  color={isOverdue(approval.dueDate) ? "error" : "default"}
                                  variant="outlined"
                                />
                              </Tooltip>
                            </Box>
                          </Box>
                        }
                      />
                      <Box>
                        <Button 
                          variant="contained" 
                          color="primary"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprovalSelect(approval);
                            handleApprovalDialogOpen();
                          }}
                          startIcon={<ThumbUp />}
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="error"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprovalSelect(approval);
                            handleRejectionDialogOpen();
                          }}
                          startIcon={<ThumbDown />}
                        >
                          Reject
                        </Button>
                      </Box>
                    </ListItem>
                    {index < filteredApprovals.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText 
                    primary="No approvals found"
                    secondary="The approval queue is empty or no items match your filters."
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
        
        {/* Approval Details Column */}
        {selectedApproval && (
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Approval Details
              </Typography>
              
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6">
                    {selectedApproval.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    ID: {selectedApproval.id}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Workflow Information
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Workflow ID: {selectedApproval.workflowId}<br/>
                    Current Stage: {selectedApproval.stage.replace(/-/g, ' ')}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Request Details
                  </Typography>
                  <Grid container spacing={2}>
                    {selectedApproval.data && Object.entries(selectedApproval.data).map(([key, value]) => (
                      <Grid item xs={6} key={key}>
                        <Typography variant="body2" color="textSecondary">
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </Typography>
                        <Typography variant="body1">
                          {typeof value === 'number' && key.includes('amount') 
                            ? `$${value.toLocaleString()}`
                            : String(value)}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Approval Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Priority:
                      </Typography>
                      <Chip 
                        size="small"
                        label={selectedApproval.priority.toUpperCase()}
                        color={getPriorityColor(selectedApproval.priority)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Due Date:
                      </Typography>
                      <Typography variant="body1">
                        {selectedApproval.dueDate.toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        Assigned Roles:
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        {selectedApproval.assignedRoles.map((role, index) => (
                          <Chip 
                            key={index}
                            size="small"
                            icon={<Person />}
                            label={role}
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<ThumbUp />}
                  onClick={handleApprovalDialogOpen}
                  sx={{ flex: 1, mr: 1 }}
                >
                  Approve
                </Button>
                <Button 
                  variant="outlined" 
                  color="error"
                  startIcon={<ThumbDown />}
                  onClick={handleRejectionDialogOpen}
                  sx={{ flex: 1, ml: 1 }}
                >
                  Reject
                </Button>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
      
      {/* Approval Dialog */}
      <Dialog
        open={approvalDialogOpen}
        onClose={handleApprovalDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Approve Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to approve: <strong>{selectedApproval?.title}</strong>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="comments"
            label="Approval Comments"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={comments}
            onChange={handleCommentsChange}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleApprovalDialogClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleApprove} color="primary" variant="contained">
            Confirm Approval
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Rejection Dialog */}
      <Dialog
        open={rejectionDialogOpen}
        onClose={handleRejectionDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to reject: <strong>{selectedApproval?.title}</strong>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="rejection-comments"
            label="Rejection Reason (Required)"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={comments}
            onChange={handleCommentsChange}
            required
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRejectionDialogClose} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleReject} 
            color="error" 
            variant="contained"
            disabled={!comments.trim()}
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ApprovalQueue;
