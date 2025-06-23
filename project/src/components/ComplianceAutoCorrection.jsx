
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Grid,
} from '@mui/material';
import { CheckCircleOutline, ErrorOutline, HourglassEmpty } from '@mui/icons-material';
import complianceAutoCorrectionService from '../services/complianceAutoCorrectionService';

const ComplianceAutoCorrection = () => {
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const subscription = complianceAutoCorrectionService.subscribeToComplianceIssues(newIssues => {
      setIssues(newIssues);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedIssue) {
      const subscription = complianceAutoCorrectionService.subscribeToCorrectionSuggestion(
        selectedIssue.id,
        newSuggestion => {
          setSuggestion(newSuggestion);
        }
      );
      return () => subscription.unsubscribe();
    }
  }, [selectedIssue]);

  const handleSelectIssue = (issue) => {
    setSelectedIssue(issue);
  };

  const handleApplyCorrection = async () => {
    if (!selectedIssue || !suggestion) return;

    try {
      await complianceAutoCorrectionService.applyCorrection(selectedIssue.id, suggestion.suggestionId);
    } catch (err) {
      setError('Failed to apply correction. Please try again.');
    }
  };

  const handleStepToggle = async (stepId, currentStatus) => {
    if (!selectedIssue) return;
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      await complianceAutoCorrectionService.updateCorrectionStepStatus(selectedIssue.id, stepId, newStatus);
    } catch (err) {
      setError('Failed to update step status.');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircleOutline color="success" />;
      case 'Pending':
        return <HourglassEmpty color="warning" />;
      default:
        return <ErrorOutline color="disabled" />;
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Typography variant="h6" gutterBottom>Compliance Issues</Typography>
        <Paper elevation={2} sx={{ maxHeight: '60vh', overflow: 'auto' }}>
          <List>
            {issues.map((issue, index) => (
              <React.Fragment key={issue.id}>
                <ListItem button selected={selectedIssue?.id === issue.id} onClick={() => handleSelectIssue(issue)}>
                  <ListItemText 
                    primary={issue.type} 
                    secondary={`Severity: ${issue.severity} | Status: ${issue.status}`}
                  />
                  <Chip label={issue.status} size="small" color={issue.status === 'Pending Correction' ? 'error' : 'warning'} />
                </ListItem>
                {index < issues.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} md={8}>
        <Typography variant="h6" gutterBottom>Correction Details</Typography>
        {selectedIssue ? (
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                {selectedIssue.type}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                {selectedIssue.description}
              </Typography>
              <Divider sx={{ my: 2 }} />
              {suggestion ? (
                <Box>
                  <Typography variant="h6">Suggested Correction</Typography>
                  <Typography variant="subtitle1" color="primary">{suggestion.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Confidence: {(suggestion.confidenceScore * 100).toFixed(0)}%
                  </Typography>
                  <Stepper activeStep={-1} orientation="vertical">
                    {suggestion.steps.map((step, index) => (
                      <Step key={step.id} active={true}>
                        <StepLabel 
                          icon={getStatusIcon(step.status)}
                          onClick={() => handleStepToggle(step.id, step.status)}
                          sx={{ cursor: 'pointer' }}
                        >
                          {step.action}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              ) : (
                <Typography>No suggestion available for this issue.</Typography>
              )}
            </CardContent>
            <CardActions>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleApplyCorrection}
                disabled={!suggestion || selectedIssue.status !== 'Pending Correction'}
              >
                Apply Correction
              </Button>
            </CardActions>
          </Card>
        ) : (
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Typography variant="h6" color="text.secondary">
              Select a compliance issue to see details and suggested corrections.
            </Typography>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

export default ComplianceAutoCorrection;
