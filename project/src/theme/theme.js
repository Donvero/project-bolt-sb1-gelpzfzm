import { createTheme } from '@mui/material/styles';

// Sophisticated Enterprise Color Palette
const colorPalette = {
  primary: {
    50: '#f0f4f8',
    100: '#d9e2ec',
    200: '#bcccdc',
    300: '#9fb3c8',
    400: '#829ab1',
    500: '#627d98',
    600: '#486581',
    700: '#334e68',
    800: '#243b53',
    900: '#1a202c'
  },
  neutral: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b'
  }
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colorPalette.primary[600],
      light: colorPalette.primary[400],
      dark: colorPalette.primary[800],
      contrastText: '#ffffff',
    },
    error: {
      main: '#dc2626',
      light: '#f87171',
      dark: '#991b1b',
    },
    warning: {
      main: '#d97706',
      light: '#fbbf24',
      dark: '#92400e',
    },
    info: {
      main: '#2563eb',
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    success: {
      main: '#059669',
      light: '#34d399',
      dark: '#047857',
    },
    background: {
      default: '#fafbfc',
      paper: '#ffffff',
    },
    text: {
      primary: colorPalette.neutral[900],
      secondary: colorPalette.neutral[600],
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 800,
      letterSpacing: '-0.04em',
      lineHeight: 1.1,
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      letterSpacing: '-0.03em',
      lineHeight: 1.2,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    ...Array(19).fill('0 25px 50px -12px rgba(0, 0, 0, 0.25)')
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 700,
          padding: '12px 32px',
          background: 'linear-gradient(135deg, #1976d2 0%, #00acc1 100%)',
          color: '#fff',
          boxShadow: '0 4px 24px rgba(25, 118, 210, 0.15)',
          transition: 'all 0.2s cubic-bezier(.4,2,.3,1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #00acc1 0%, #1976d2 100%)',
            boxShadow: '0 8px 32px rgba(0, 172, 193, 0.18)',
            transform: 'translateY(-2px) scale(1.03)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          background: 'rgba(255,255,255,0.85)',
          boxShadow: '0 8px 32px 0 rgba(25, 118, 210, 0.10)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(25, 118, 210, 0.08)',
          transition: 'all 0.2s cubic-bezier(.4,2,.3,1)',
          '&:hover': {
            boxShadow: '0 16px 48px 0 rgba(0, 172, 193, 0.15)',
            transform: 'translateY(-4px) scale(1.02)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          background: 'rgba(255,255,255,0.7)',
          boxShadow: '0 4px 24px 0 rgba(0, 172, 193, 0.10)',
          backdropFilter: 'blur(6px)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: 'rgba(255,255,255,0.85)',
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.05)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 24px rgba(25, 118, 210, 0.10)',
          background: 'rgba(255,255,255,0.95)',
          color: '#1976d2',
        },
      },
    },
  },
});

export default theme;