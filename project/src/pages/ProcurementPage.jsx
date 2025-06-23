import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button
} from '@mui/material';
import { 
  ShoppingCart as ShoppingCartIcon,
  Description as DescriptionIcon,
  Security as SecurityIcon,
  History as HistoryIcon,
  AddCircle as AddCircleIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

const ProcurementPage = () => {
  return (
    <Box>
      <Typography variant="h2" gutterBottom sx={{ 
        fontWeight: 900, 
        letterSpacing: '-0.03em', 
        color: 'primary.main', 
        textShadow: '0 2px 8px rgba(25, 118, 210, 0.10)',
        mb: 4
      }}>
        Procurement Management
      </Typography>
      
      <Box sx={{ 
        p: 4, 
        borderRadius: 4, 
        background: 'rgba(255,255,255,0.85)', 
        backdropFilter: 'blur(8px)', 
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: '0 8px 32px 0 rgba(25, 118, 210, 0.10)', 
        border: '1px solid rgba(25, 118, 210, 0.08)',
        mb: 4,
        position: 'relative',
        overflow: 'hidden',
        '::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle at 100% 0%, rgba(255,152,0,0.1) 0%, transparent 70%)',
          zIndex: 0,
        }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <ShoppingCartIcon sx={{ fontSize: 48, color: 'accent.main', mr: 2 }} />
          <Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 800, mb: 1 }}>
              Procurement Module
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
              Coming in Milestone 4
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="body1" sx={{ mb: 3, fontWeight: 500, fontSize: 18 }}>
          The Procurement Management module will streamline procurement processes while ensuring full compliance with regulations:
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              height: '100%',
              borderRadius: 4,
              background: 'rgba(255,255,255,0.7)',
              boxShadow: '0 8px 32px 0 rgba(25, 118, 210, 0.10)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(25, 118, 210, 0.08)',
              transition: 'all 0.2s cubic-bezier(.4,2,.3,1)',
              '&:hover': {
                boxShadow: '0 16px 48px 0 rgba(0, 172, 193, 0.15)',
                transform: 'translateY(-4px) scale(1.02)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <DescriptionIcon sx={{ fontSize: 36, color: 'accent.main', mr: 2 }} />
                  <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
                    Document Management
                  </Typography>
                </Box>
                
                <List sx={{ pl: 2 }}>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText 
                      primary="Centralized Document Repository" 
                      secondary="Store and organize all procurement-related documents in one secure location"
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText 
                      primary="Version Control" 
                      secondary="Track document revisions and maintain audit trail of changes"
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText 
                      primary="Document Templates" 
                      secondary="Pre-approved templates for RFPs, contracts, and other procurement documents"
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              height: '100%',
              borderRadius: 4,
              background: 'rgba(255,255,255,0.7)',
              boxShadow: '0 8px 32px 0 rgba(25, 118, 210, 0.10)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(25, 118, 210, 0.08)',
              transition: 'all 0.2s cubic-bezier(.4,2,.3,1)',
              '&:hover': {
                boxShadow: '0 16px 48px 0 rgba(0, 172, 193, 0.15)',
                transform: 'translateY(-4px) scale(1.02)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <SecurityIcon sx={{ fontSize: 36, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
                    Compliance Validation
                  </Typography>
                </Box>
                
                <List sx={{ pl: 2 }}>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText 
                      primary="Regulatory Compliance" 
                      secondary="Automatic verification against MFMA and PFMA procurement regulations"
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText 
                      primary="Tender Threshold Validation" 
                      secondary="Ensure proper procedures based on procurement value thresholds"
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText 
                      primary="Conflict of Interest Detection" 
                      secondary="Automated checks for potential conflicts in vendor relationships"
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              height: '100%',
              borderRadius: 4,
              background: 'rgba(255,255,255,0.7)',
              boxShadow: '0 8px 32px 0 rgba(25, 118, 210, 0.10)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(25, 118, 210, 0.08)',
              transition: 'all 0.2s cubic-bezier(.4,2,.3,1)',
              '&:hover': {
                boxShadow: '0 16px 48px 0 rgba(0, 172, 193, 0.15)',
                transform: 'translateY(-4px) scale(1.02)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <HistoryIcon sx={{ fontSize: 36, color: 'info.main', mr: 2 }} />
                  <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
                    Approval Workflows
                  </Typography>
                </Box>
                
                <List sx={{ pl: 2 }}>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText 
                      primary="Multi-stage Approval Process" 
                      secondary="Configurable approval workflows based on procurement type and value"
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText 
                      primary="Digital Signatures" 
                      secondary="Secure electronic signing of procurement documents"
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText 
                      primary="Automated Notifications" 
                      secondary="Real-time alerts for pending approvals and status changes"
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              height: '100%',
              borderRadius: 4,
              background: 'rgba(255,255,255,0.7)',
              boxShadow: '0 8px 32px 0 rgba(25, 118, 210, 0.10)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(25, 118, 210, 0.08)',
              transition: 'all 0.2s cubic-bezier(.4,2,.3,1)',
              '&:hover': {
                boxShadow: '0 16px 48px 0 rgba(0, 172, 193, 0.15)',
                transform: 'translateY(-4px) scale(1.02)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <BusinessIcon sx={{ fontSize: 36, color: 'success.main', mr: 2 }} />
                  <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
                    Vendor Management
                  </Typography>
                </Box>
                
                <List sx={{ pl: 2 }}>
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText 
                      primary="Supplier Database" 
                      secondary="Comprehensive vendor profiles with performance metrics"
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText 
                      primary="Vendor Verification" 
                      secondary="Automated checks against tax compliance and other requirements"
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                  <Divider component="li" />
                  <ListItem sx={{ py: 1 }}>
                    <ListItemText 
                      primary="Performance Tracking" 
                      secondary="Monitor and rate vendor performance over time"
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            size="large"
            startIcon={<AddCircleIcon />}
            sx={{
              fontWeight: 700,
              fontSize: 18,
              borderRadius: 3,
              py: 1.5,
              px: 4,
              boxShadow: '0 4px 16px 0 rgba(255, 152, 0, 0.10)',
              background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
              color: '#fff',
              transition: 'all 0.2s cubic-bezier(.4,2,.3,1)',
              '&:hover': {
                background: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
                boxShadow: '0 8px 32px 0 rgba(255, 152, 0, 0.15)',
                transform: 'translateY(-2px) scale(1.03)',
              }
            }}
          >
            Coming Soon in Milestone 4
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProcurementPage;