import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Avatar,
  Alert,
  Divider,
  Chip,
  Grid
} from '@mui/material';
import {
  Security as SecurityIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';

const LoginPage = () => {
  const { login, isLoading } = useAuthStore();
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  const onSubmit = async (data) => {
    await login(data.email, data.password);
  };

  const demoAccounts = [
    { email: 'admin@municipality.gov.za', password: 'admin123', role: 'System Administrator' },
    { email: 'auditor@municipality.gov.za', password: 'auditor123', role: 'Chief Auditor' },
    { email: 'manager@municipality.gov.za', password: 'manager123', role: 'Finance Manager' },
    { email: 'clerk@municipality.gov.za', password: 'clerk123', role: 'Finance Clerk' }
  ];

  const handleDemoLogin = (email, password) => {
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1976d2 0%, #00acc1 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            overflow: 'visible'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.main',
                  mx: 'auto',
                  mb: 2
                }}
              >
                <SecurityIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" component="h1" gutterBottom>
                SAMS™
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Smart Audit Management System
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Secure access to municipal audit and compliance management
              </Typography>
            </Box>

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                margin="normal"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ mb: 2, py: 1.5 }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Chip label="Demo Access" size="small" />
            </Divider>

            {/* Demo Accounts */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                sx={{ mb: 2 }}
              >
                {showDemoAccounts ? 'Hide' : 'Show'} Demo Accounts
              </Button>
            </Box>

            {showDemoAccounts && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Demo Accounts Available:</strong>
                </Typography>
                <Grid container spacing={1}>
                  {demoAccounts.map((account, index) => (
                    <Grid item xs={12} key={index}>
                      <Box
                        sx={{
                          p: 1,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'action.hover'
                          }
                        }}
                        onClick={() => handleDemoLogin(account.email, account.password)}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {account.role}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {account.email}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                  Click on any account to auto-fill login credentials
                </Typography>
              </Alert>
            )}

            {/* Footer */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <AccountBalanceIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Municipal Finance Management
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                © 2025 SAMS™ - All Rights Reserved
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;