import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  Grid,
  Button,
  CircularProgress,
  Tooltip,
  IconButton,
  useTheme
} from '@mui/material';
import {
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  ViewInAr as View3DIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import * as d3 from 'd3';
import { useBudgetStore } from '../store/budgetStore';

// Styled components
const ControlPanel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: 12,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2)
}));

const VisualizationCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  position: 'relative'
}));

const ControlButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  margin: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));

// 3D Visualization component
const Advanced3DVisualization = () => {
  const theme = useTheme();
  const svgRef = useRef(null);
  const budgetStore = useBudgetStore();
  
  // State for visualization options
  const [dataType, setDataType] = useState('budget');
  const [visualizationType, setVisualizationType] = useState('3d-bar');
  const [rotationSpeed, setRotationSpeed] = useState(30);
  const [zoom, setZoom] = useState(1);
  const [isRotating, setIsRotating] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [dimensions] = useState({ width: 800, height: 500 });
  
  // Mock data for demonstration
  const [visualizationData, setVisualizationData] = useState([]);
  
  // Initialize and prepare data
  useEffect(() => {
    budgetStore.initialize();
    prepareData();
  }, [dataType]);
  
  // Prepare data for visualization
  const prepareData = () => {
    setIsLoading(true);
    
    // Simulate data preparation delay
    setTimeout(() => {
      let data = [];
      
      switch (dataType) {
        case 'budget':
          data = generateBudgetData();
          break;
        case 'compliance':
          data = generateComplianceData();
          break;
        case 'procurement':
          data = generateProcurementData();
          break;
        default:
          data = generateBudgetData();
      }
      
      setVisualizationData(data);
      setIsLoading(false);
      initializeVisualization();
    }, 1000);
  };
  
  // Generate mock budget data
  const generateBudgetData = () => {
    const departments = ['Finance', 'Infrastructure', 'Health', 'Education', 'Administration', 'IT'];
    const periods = ['Q1', 'Q2', 'Q3', 'Q4'];
    
    const data = [];
    
    departments.forEach((dept, deptIndex) => {
      periods.forEach((period, periodIndex) => {
        data.push({
          department: dept,
          period: period,
          budget: Math.random() * 1000000 + 500000,
          spent: Math.random() * 900000 + 400000,
          compliance: Math.random() * 100,
          x: deptIndex,
          y: periodIndex,
          z: Math.random() * 0.5 + 0.5 // For 3D effect
        });
      });
    });
    
    return data;
  };
  
  // Generate mock compliance data
  const generateComplianceData = () => {
    const regulations = ['MFMA', 'PFMA', 'SCM', 'Treasury', 'Auditor General'];
    const departments = ['Finance', 'Infrastructure', 'Health', 'Education', 'Administration', 'IT'];
    
    const data = [];
    
    regulations.forEach((reg, regIndex) => {
      departments.forEach((dept, deptIndex) => {
        data.push({
          regulation: reg,
          department: dept,
          compliance: Math.random() * 100,
          violations: Math.floor(Math.random() * 10),
          risk: Math.random() * 100,
          x: regIndex,
          y: deptIndex,
          z: Math.random() * 0.5 + 0.5 // For 3D effect
        });
      });
    });
    
    return data;
  };
  
  // Generate mock procurement data
  const generateProcurementData = () => {
    const vendors = ['Vendor A', 'Vendor B', 'Vendor C', 'Vendor D', 'Vendor E'];
    const categories = ['IT', 'Office Supplies', 'Construction', 'Consulting', 'Maintenance'];
    
    const data = [];
    
    vendors.forEach((vendor, vendorIndex) => {
      categories.forEach((category, categoryIndex) => {
        data.push({
          vendor: vendor,
          category: category,
          amount: Math.random() * 2000000 + 100000,
          compliance: Math.random() * 100,
          performance: Math.random() * 100,
          x: vendorIndex,
          y: categoryIndex,
          z: Math.random() * 0.5 + 0.5 // For 3D effect
        });
      });
    });
    
    return data;
  };
  
  // Initialize the 3D visualization
  const initializeVisualization = () => {
    if (!svgRef.current || visualizationData.length === 0) return;
    
    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Create SVG container
    const svg = d3.select(svgRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .append('g')
      .attr('transform', `translate(${dimensions.width / 2}, ${dimensions.height / 2})`);
    
    // Scale for 3D bars
    const xScale = d3.scaleBand()
      .domain(visualizationData.map(d => d.x))
      .range([-dimensions.width / 3, dimensions.width / 3])
      .padding(0.2);
    
    const yScale = d3.scaleBand()
      .domain(visualizationData.map(d => d.y))
      .range([-dimensions.height / 3, dimensions.height / 3])
      .padding(0.2);
    
    const zScale = d3.scaleLinear()
      .domain([0, d3.max(visualizationData, d => d.z)])
      .range([0, 100]);
    
    const colorScale = d3.scaleSequential()
      .domain([0, d3.max(visualizationData, d => d.z)])
      .interpolator(d3.interpolateBlues);
    
    // Create 3D bars
    svg.selectAll('.bar')
      .data(visualizationData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.x))
      .attr('y', d => yScale(d.y))
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('fill', d => colorScale(d.z))
      .attr('stroke', '#000')
      .attr('stroke-width', 0.5)
      .attr('transform', d => `scale(1, ${d.z}) translate(0, ${-yScale(d.y) * d.z})`)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('stroke-width', 2)
          .attr('stroke', theme.palette.primary.main);
        
        // Add tooltip
        svg.append('text')
          .attr('class', 'tooltip')
          .attr('x', xScale(d.x) + xScale.bandwidth() / 2)
          .attr('y', yScale(d.y) - 10)
          .attr('text-anchor', 'middle')
          .attr('font-size', '12px')
          .attr('fill', theme.palette.text.primary)
          .text(() => {
            switch (dataType) {
              case 'budget':
                return `${d.department} (${d.period}): $${Math.round(d.budget).toLocaleString()}`;
              case 'compliance':
                return `${d.department} (${d.regulation}): ${Math.round(d.compliance)}%`;
              case 'procurement':
                return `${d.vendor} (${d.category}): $${Math.round(d.amount).toLocaleString()}`;
              default:
                return '';
            }
          });
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('stroke-width', 0.5)
          .attr('stroke', '#000');
        
        svg.selectAll('.tooltip').remove();
      });
    
    // Add labels if enabled
    if (showLabels) {
      // X axis labels
      svg.selectAll('.x-label')
        .data([...new Set(visualizationData.map(d => d.x))])
        .enter()
        .append('text')
        .attr('class', 'x-label')
        .attr('x', d => xScale(d) + xScale.bandwidth() / 2)
        .attr('y', dimensions.height / 3 + 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', theme.palette.text.secondary)
        .text(d => {
          const item = visualizationData.find(item => item.x === d);
          switch (dataType) {
            case 'budget':
              return item.department;
            case 'compliance':
              return item.regulation;
            case 'procurement':
              return item.vendor;
            default:
              return '';
          }
        });
      
      // Y axis labels
      svg.selectAll('.y-label')
        .data([...new Set(visualizationData.map(d => d.y))])
        .enter()
        .append('text')
        .attr('class', 'y-label')
        .attr('x', -dimensions.width / 3 - 20)
        .attr('y', d => yScale(d) + yScale.bandwidth() / 2)
        .attr('text-anchor', 'end')
        .attr('font-size', '10px')
        .attr('fill', theme.palette.text.secondary)
        .text(d => {
          const item = visualizationData.find(item => item.y === d);
          switch (dataType) {
            case 'budget':
              return item.period;
            case 'compliance':
              return item.department;
            case 'procurement':
              return item.category;
            default:
              return '';
          }
        });
    }
    
    // Add animation if enabled
    if (isRotating) {
      const rotate = () => {
        const currentRotation = svg.attr('transform') || `translate(${dimensions.width / 2}, ${dimensions.height / 2})`;
        const rotationMatch = currentRotation.match(/rotate\(([^)]+)\)/);
        let angle = rotationMatch ? parseFloat(rotationMatch[1]) : 0;
        
        angle = (angle + rotationSpeed / 100) % 360;
        
        svg.attr('transform', `translate(${dimensions.width / 2}, ${dimensions.height / 2}) rotate(${angle})`);
        
        if (isRotating) {
          requestAnimationFrame(rotate);
        }
      };
      
      requestAnimationFrame(rotate);
    }
  };
  
  // Handle rotation toggle
  useEffect(() => {
    if (isRotating) {
      initializeVisualization();
    }
  }, [isRotating]);
  
  // Update visualization when options change
  useEffect(() => {
    if (!isLoading) {
      initializeVisualization();
    }
  }, [zoom, showLabels, visualizationType]);
  
  // Handle zoom change
  const handleZoomChange = (event, newValue) => {
    setZoom(newValue);
    
    if (svgRef.current) {
      const svg = d3.select(svgRef.current).select('g');
      svg.attr('transform', `translate(${dimensions.width / 2}, ${dimensions.height / 2}) scale(${newValue})`);
    }
  };
  
  // Handle rotation speed change
  const handleRotationSpeedChange = (event, newValue) => {
    setRotationSpeed(newValue);
  };
  
  // Handle manual rotation
  const handleManualRotate = (direction) => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current).select('g');
      const currentRotation = svg.attr('transform') || `translate(${dimensions.width / 2}, ${dimensions.height / 2})`;
      const rotationMatch = currentRotation.match(/rotate\(([^)]+)\)/);
      let angle = rotationMatch ? parseFloat(rotationMatch[1]) : 0;
      
      angle = (angle + (direction === 'left' ? -15 : 15)) % 360;
      
      svg.attr('transform', `translate(${dimensions.width / 2}, ${dimensions.height / 2}) scale(${zoom}) rotate(${angle})`);
    }
  };
  
  // Save visualization as image
  const saveVisualization = () => {
    if (!svgRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `3d-visualization-${dataType}-${Date.now()}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };
  
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        3D Data Visualization
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Explore municipal financial data in three-dimensional space with interactive controls.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <ControlPanel>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Visualization Options
            </Typography>
            
            <FormControl fullWidth>
              <InputLabel>Data Type</InputLabel>
              <Select
                value={dataType}
                onChange={(e) => setDataType(e.target.value)}
                label="Data Type"
              >
                <MenuItem value="budget">Budget Data</MenuItem>
                <MenuItem value="compliance">Compliance Data</MenuItem>
                <MenuItem value="procurement">Procurement Data</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Visualization Type</InputLabel>
              <Select
                value={visualizationType}
                onChange={(e) => setVisualizationType(e.target.value)}
                label="Visualization Type"
              >
                <MenuItem value="3d-bar">3D Bar Chart</MenuItem>
                <MenuItem value="3d-scatter">3D Scatter Plot</MenuItem>
                <MenuItem value="3d-surface">3D Surface Chart</MenuItem>
              </Select>
            </FormControl>
            
            <Typography variant="body2" gutterBottom>
              Zoom Level
            </Typography>
            <Slider
              value={zoom}
              onChange={handleZoomChange}
              min={0.5}
              max={2}
              step={0.1}
              marks={[
                { value: 0.5, label: '0.5x' },
                { value: 1, label: '1x' },
                { value: 1.5, label: '1.5x' },
                { value: 2, label: '2x' }
              ]}
              valueLabelDisplay="auto"
            />
            
            <Typography variant="body2" gutterBottom>
              Rotation Speed
            </Typography>
            <Slider
              value={rotationSpeed}
              onChange={handleRotationSpeedChange}
              min={0}
              max={100}
              step={1}
              marks={[
                { value: 0, label: '0' },
                { value: 50, label: '50' },
                { value: 100, label: '100' }
              ]}
              valueLabelDisplay="auto"
              disabled={!isRotating}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={isRotating}
                  onChange={(e) => setIsRotating(e.target.checked)}
                  color="primary"
                />
              }
              label="Auto-rotate"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                  color="primary"
                />
              }
              label="Show Labels"
            />
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={prepareData}
              fullWidth
            >
              Refresh Data
            </Button>
            
            <Button
              variant="outlined"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={saveVisualization}
              fullWidth
            >
              Save as Image
            </Button>
          </ControlPanel>
        </Grid>
        
        <Grid item xs={12} md={9}>
          <VisualizationCard>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight={600}>
                  {dataType === 'budget' ? 'Budget Allocation by Department and Quarter' :
                   dataType === 'compliance' ? 'Compliance Score by Department and Regulation' :
                   'Procurement Spending by Vendor and Category'}
                </Typography>
                
                <Box>
                  <Tooltip title="Rotate Left">
                    <ControlButton onClick={() => handleManualRotate('left')}>
                      <RotateLeftIcon />
                    </ControlButton>
                  </Tooltip>
                  
                  <Tooltip title="Rotate Right">
                    <ControlButton onClick={() => handleManualRotate('right')}>
                      <RotateRightIcon />
                    </ControlButton>
                  </Tooltip>
                  
                  <Tooltip title="Zoom In">
                    <ControlButton onClick={() => setZoom(Math.min(zoom + 0.1, 2))}>
                      <ZoomInIcon />
                    </ControlButton>
                  </Tooltip>
                  
                  <Tooltip title="Zoom Out">
                    <ControlButton onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))}>
                      <ZoomOutIcon />
                    </ControlButton>
                  </Tooltip>
                </Box>
              </Box>
              
              <Box 
                sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  position: 'relative'
                }}
              >
                {isLoading ? (
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <CircularProgress size={60} thickness={4} />
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                      Preparing 3D visualization...
                    </Typography>
                  </Box>
                ) : (
                  <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
                )}
              </Box>
              
              <Typography variant="caption" color="textSecondary" sx={{ mt: 2, textAlign: 'center' }}>
                {visualizationType === '3d-bar' ? 'The height of each bar represents the ' :
                 visualizationType === '3d-scatter' ? 'The position of each point represents the ' :
                 'The height of the surface represents the '}
                {dataType === 'budget' ? 'budget amount allocated to each department and quarter.' :
                 dataType === 'compliance' ? 'compliance score for each department and regulatory framework.' :
                 'procurement spending for each vendor and category.'}
              </Typography>
            </CardContent>
          </VisualizationCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Advanced3DVisualization;
