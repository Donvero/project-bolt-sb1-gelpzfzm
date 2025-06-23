import React from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import { AccountTree, Approval, Analytics, Description, DocumentScanner, AutoFixHigh } from '@mui/icons-material';
import { useState } from 'react';
import WorkflowDashboard from '../components/WorkflowDashboard';
import ApprovalQueue from '../components/ApprovalQueue';
import WorkflowMonitoring from '../components/WorkflowMonitoring';
import WorkflowAnalytics from '../components/WorkflowAnalytics';
import DocumentIntelligence from '../components/DocumentIntelligence';
import ComplianceAutoCorrection from '../components/ComplianceAutoCorrection';

const WorkflowIntelligencePage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Workflow Intelligence
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Smart automation & workflow intelligence for municipal processes
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="workflow intelligence tabs"
        >
          <Tab icon={<AccountTree />} label="Dashboard" iconPosition="start" />
          <Tab icon={<Approval />} label="Approval Queue" iconPosition="start" />
          <Tab icon={<Description />} label="Workflow Monitoring" iconPosition="start" />
          <Tab icon={<Analytics />} label="Analytics" iconPosition="start" />
          <Tab icon={<DocumentScanner />} label="Document Intelligence" iconPosition="start" />
          <Tab icon={<AutoFixHigh />} label="Auto-Correction" iconPosition="start" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <WorkflowDashboard />
      )}
      {activeTab === 1 && (
        <ApprovalQueue />
      )}
      {activeTab === 2 && (
        <WorkflowMonitoring />
      )}
      {activeTab === 3 && (
        <WorkflowAnalytics />
      )}
      {activeTab === 4 && (
        <DocumentIntelligence />
      )}
      {activeTab === 5 && (
        <ComplianceAutoCorrection />
      )}
    </Box>
  );
};

export default WorkflowIntelligencePage;
