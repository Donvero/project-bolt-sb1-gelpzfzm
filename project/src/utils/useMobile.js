
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

/**
 * A custom hook to determine if the current viewport matches mobile screen sizes.
 * @returns {boolean} True if the screen is considered mobile, false otherwise.
 */
const useMobile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return isMobile;
};

export default useMobile;
