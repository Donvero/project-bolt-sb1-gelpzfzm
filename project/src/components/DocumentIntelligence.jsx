import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Paper, Grid, CircularProgress, LinearProgress, Alert, Chip, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { UploadFile, CheckCircle, Error, HourglassEmpty, FindInPage, Rule, TaskAlt, DocumentScanner, DataObject } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { documentIntelligenceService } from '../services/documentIntelligenceService';

const DocumentIntelligence = () => {
  const [documents, setDocuments] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const unsubscribe = documentIntelligenceService.subscribe(setDocuments);
    return () => unsubscribe();
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach(file => {
      documentIntelligenceService.addDocument(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'application/pdf,image/*' });

  useEffect(() => {
    const processing = documents.some(d => d.status === 'processing' || d.status === 'queued');
    setIsProcessing(processing);
  }, [documents]);

  const renderStatusChip = (status) => {
    const statusMap = {
      queued: { label: 'Queued', color: 'default', icon: <HourglassEmpty /> },
      processing: { label: 'Processing', color: 'primary', icon: <CircularProgress size={16} /> },
      completed: { label: 'Completed', color: 'success', icon: <CheckCircle /> },
      failed: { label: 'Failed', color: 'error', icon: <Error /> },
    };
    const { label, color, icon } = statusMap[status] || statusMap.queued;
    return <Chip icon={icon} label={label} color={color} size="small" />;
  };

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: 4,
          textAlign: 'center',
          border: `2px dashed ${isDragActive ? 'primary.main' : 'grey.400'}`,
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
          mb: 4,
        }}
      >
        <input {...getInputProps()} />
        <UploadFile sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6">Drag & drop documents here, or click to select files</Typography>
        <Typography variant="body2" color="text.secondary">PDF or Image files accepted</Typography>
      </Paper>

      {isProcessing && <Alert severity="info" sx={{ mb: 2 }}>Document processing is in progress...</Alert>}

      <Grid container spacing={3}>
        {documents.map(doc => (
          <Grid item xs={12} md={6} key={doc.id}>
            <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant="h6" gutterBottom>{doc.name}</Typography>
              {renderStatusChip(doc.status)}
              {doc.status === 'processing' && <LinearProgress variant="determinate" value={doc.progress} sx={{ my: 2 }} />}
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Processing Stages:</Typography>
                <List dense>
                  {doc.stages.map((stage, index) => (
                    <ListItem key={index}>
                      <ListItemIcon><TaskAlt color="success" /></ListItemIcon>
                      <ListItemText primary={stage.name} secondary={new Date(stage.timestamp).toLocaleString()} />
                    </ListItem>
                  ))}
                </List>
              </Box>

              {doc.status === 'completed' && doc.extractedData && (
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="text.secondary">Extracted Data:</Typography>
                  <List dense>
                    {Object.entries(doc.extractedData).map(([key, value]) => (
                      <ListItem key={key}>
                        <ListItemIcon><DataObject /></ListItemIcon>
                        <ListItemText primary={key} secondary={value} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {doc.validation && (
                <Box sx={{ mt: 2 }}>
                   <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="text.secondary">Compliance Validation:</Typography>
                  {doc.validation.isValid ? (
                     <Alert severity="success" icon={<CheckCircle />}>Validation Passed</Alert>
                  ) : (
                    <Alert severity="error" icon={<Error />}>Validation Failed</Alert>
                  )}
                  <List dense>
                    {doc.validation.checks?.map((check, index) => (
                      <ListItem key={index}>
                        <ListItemIcon><Rule color="success" /></ListItemIcon>
                        <ListItemText primary={check.rule} secondary={check.status} />
                      </ListItem>
                    ))}
                     {doc.validation.issues?.map((issue, index) => (
                      <ListItem key={index}>
                        <ListItemIcon><Error color="error" /></ListItemIcon>
                        <ListItemText primary={issue} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DocumentIntelligence;
