import React from 'react';
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Badge } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NavigationItem = ({ item, isActive, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(item.path);
    if (onClick) onClick();
  };

  return (
    <ListItem disablePadding sx={{ mb: 0.5 }}>
      <ListItemButton
        onClick={handleClick}
        sx={{
          borderRadius: 2,
          mx: 1,
          bgcolor: isActive ? 'primary.main' : 'transparent',
          color: isActive ? 'primary.contrastText' : 'text.primary',
          '&:hover': {
            bgcolor: isActive ? 'primary.dark' : 'action.hover',
          },
          '& .MuiListItemIcon-root': {
            color: isActive ? 'primary.contrastText' : 'text.secondary',
          }
        }}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>
          {item.badgeContent ? (
            <Badge badgeContent={item.badgeContent} color="error">
              {item.icon}
            </Badge>
          ) : (
            item.icon
          )}
        </ListItemIcon>
        <ListItemText 
          primary={item.text}
          primaryTypographyProps={{
            fontSize: '0.875rem',
            fontWeight: isActive ? 600 : 400
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default NavigationItem;