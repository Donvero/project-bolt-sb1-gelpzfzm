// SAMS™ Report Generation Service
// Advanced reporting system for generating executive and detailed reports
// Part of Phase 2: Advanced Visualization & Reporting Enhancements

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { formatCurrency, formatPercentageChange } from '../utils/helpers';

class ReportGenerator {
  constructor() {
    this.reportCache = new Map();
    this.templateCache = new Map();
    this.lastGeneratedReports = [];
  }

  /**
   * Generate an executive summary report
   * @param {Object} data - Data for the report including budget, compliance, and risk information
   * @param {string} format - Output format ('pdf', 'excel', 'csv')
   * @returns {Promise<Blob|string>} - The generated report
   */
  async generateExecutiveReport(data, format = 'pdf') {
    try {
      const reportData = this._prepareExecutiveReportData(data);
      
      switch (format.toLowerCase()) {
        case 'pdf':
          return this._generatePdfReport(reportData, 'executive');
        case 'excel':
          return this._generateExcelReport(reportData, 'executive');
        case 'csv':
          return this._generateCsvReport(reportData, 'executive');
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
    } catch (error) {
      console.error('Failed to generate executive report:', error);
      throw error;
    }
  }

  /**
   * Generate a detailed financial report
   * @param {Object} data - Detailed financial data
   * @param {string} format - Output format ('pdf', 'excel', 'csv')
   * @returns {Promise<Blob|string>} - The generated report
   */
  async generateFinancialReport(data, format = 'pdf') {
    try {
      const reportData = this._prepareFinancialReportData(data);
      
      switch (format.toLowerCase()) {
        case 'pdf':
          return this._generatePdfReport(reportData, 'financial');
        case 'excel':
          return this._generateExcelReport(reportData, 'financial');
        case 'csv':
          return this._generateCsvReport(reportData, 'financial');
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
    } catch (error) {
      console.error('Failed to generate financial report:', error);
      throw error;
    }
  }

  /**
   * Generate a compliance audit report
   * @param {Object} data - Compliance and audit data
   * @param {string} format - Output format ('pdf', 'excel', 'csv')
   * @returns {Promise<Blob|string>} - The generated report
   */
  async generateComplianceReport(data, format = 'pdf') {
    try {
      const reportData = this._prepareComplianceReportData(data);
      
      switch (format.toLowerCase()) {
        case 'pdf':
          return this._generatePdfReport(reportData, 'compliance');
        case 'excel':
          return this._generateExcelReport(reportData, 'compliance');
        case 'csv':
          return this._generateCsvReport(reportData, 'compliance');
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
    } catch (error) {
      console.error('Failed to generate compliance report:', error);
      throw error;
    }
  }

  /**
   * Generate a custom report based on user-defined parameters
   * @param {Object} data - Report data
   * @param {Object} parameters - User-defined report parameters
   * @param {string} format - Output format ('pdf', 'excel', 'csv')
   * @returns {Promise<Blob|string>} - The generated report
   */
  async generateCustomReport(data, parameters, format = 'pdf') {
    try {
      const reportData = this._prepareCustomReportData(data, parameters);
      
      switch (format.toLowerCase()) {
        case 'pdf':
          return this._generatePdfReport(reportData, 'custom');
        case 'excel':
          return this._generateExcelReport(reportData, 'custom');
        case 'csv':
          return this._generateCsvReport(reportData, 'custom');
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
    } catch (error) {
      console.error('Failed to generate custom report:', error);
      throw error;
    }
  }

  /**
   * Schedule a report for recurring generation
   * @param {string} reportType - Type of report to generate
   * @param {Object} parameters - Report parameters
   * @param {Object} schedule - Schedule information (frequency, time, recipients)
   * @returns {string} - Scheduled report ID
   */
  scheduleReport(reportType, parameters, schedule) {
    const reportId = `scheduled-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // In a real implementation, this would store the schedule in a database
    // or integrate with a task scheduler
    console.log(`Scheduled report ${reportId} of type ${reportType} with parameters:`, parameters);
    console.log('Schedule:', schedule);
    
    return reportId;
  }

  /**
   * Generate a natural language summary of key insights
   * @param {Object} data - Report data
   * @returns {Object} - Object containing insights with natural language explanations
   */
  generateNaturalLanguageInsights(data) {
    // This would normally use NLP/AI to generate natural language insights
    // For now, we'll use templates
    
    const insights = {
      budgetUtilization: this._generateBudgetUtilizationInsight(data),
      complianceStatus: this._generateComplianceStatusInsight(data),
      riskAssessment: this._generateRiskAssessmentInsight(data),
      keyFindings: this._generateKeyFindingsInsights(data),
      recommendations: this._generateRecommendationsInsights(data)
    };
    
    return insights;
  }

  // Private helper methods for preparing report data
  _prepareExecutiveReportData(data) {
    return {
      title: 'SAMS™ Executive Summary Report',
      generatedDate: new Date().toISOString(),
      municipality: data.municipality || 'Demo Municipality',
      fiscalPeriod: data.fiscalPeriod || 'Current Fiscal Year',
      summary: {
        budgetUtilization: data.budgetUtilization || 0,
        complianceScore: data.complianceScore || 0,
        riskLevel: data.riskLevel || 'Low',
        anomaliesDetected: data.anomaliesDetected || 0
      },
      keyMetrics: data.keyMetrics || [],
      insights: this.generateNaturalLanguageInsights(data),
      charts: data.charts || [],
      tables: data.tables || []
    };
  }

  _prepareFinancialReportData(data) {
    return {
      title: 'SAMS™ Detailed Financial Report',
      generatedDate: new Date().toISOString(),
      municipality: data.municipality || 'Demo Municipality',
      fiscalPeriod: data.fiscalPeriod || 'Current Fiscal Year',
      financialSummary: data.financialSummary || {},
      budgetCategories: data.budgetCategories || [],
      transactions: data.transactions || [],
      departmentAnalysis: data.departmentAnalysis || [],
      trends: data.trends || [],
      insights: this.generateNaturalLanguageInsights(data),
      charts: data.charts || [],
      tables: data.tables || []
    };
  }

  _prepareComplianceReportData(data) {
    return {
      title: 'SAMS™ Compliance Audit Report',
      generatedDate: new Date().toISOString(),
      municipality: data.municipality || 'Demo Municipality',
      auditPeriod: data.auditPeriod || 'Current Fiscal Year',
      complianceSummary: data.complianceSummary || {},
      regulatoryFrameworks: data.regulatoryFrameworks || [],
      violations: data.violations || [],
      riskAreas: data.riskAreas || [],
      recommendations: data.recommendations || [],
      insights: this.generateNaturalLanguageInsights(data),
      charts: data.charts || [],
      tables: data.tables || []
    };
  }

  _prepareCustomReportData(data, parameters) {
    // Create a custom report structure based on user parameters
    const reportData = {
      title: parameters.title || 'SAMS™ Custom Report',
      generatedDate: new Date().toISOString(),
      municipality: data.municipality || 'Demo Municipality',
      period: parameters.period || 'Custom Period',
      sections: []
    };
    
    // Add selected sections based on parameters
    if (parameters.includeBudget) {
      reportData.sections.push({
        title: 'Budget Analysis',
        data: data.budget || {}
      });
    }
    
    if (parameters.includeCompliance) {
      reportData.sections.push({
        title: 'Compliance Analysis',
        data: data.compliance || {}
      });
    }
    
    if (parameters.includeRisk) {
      reportData.sections.push({
        title: 'Risk Assessment',
        data: data.risk || {}
      });
    }
    
    if (parameters.includeInsights) {
      reportData.insights = this.generateNaturalLanguageInsights(data);
    }
    
    // Add custom metrics if specified
    if (parameters.customMetrics && parameters.customMetrics.length > 0) {
      reportData.customMetrics = parameters.customMetrics.map(metricName => {
        return {
          name: metricName,
          value: data[metricName] || 'N/A'
        };
      });
    }
    
    return reportData;
  }

  // PDF generation
  _generatePdfReport(data, reportType) {
    return new Promise((resolve) => {
      const doc = new jsPDF();
      
      // Add header
      doc.setFontSize(18);
      doc.text(data.title, 105, 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date(data.generatedDate).toLocaleDateString()}`, 105, 30, { align: 'center' });
      doc.text(`Municipality: ${data.municipality}`, 105, 35, { align: 'center' });
      
      // Add content based on report type
      switch (reportType) {
        case 'executive':
          this._addExecutiveSummaryContent(doc, data);
          break;
        case 'financial':
          this._addFinancialContent(doc, data);
          break;
        case 'compliance':
          this._addComplianceContent(doc, data);
          break;
        case 'custom':
          this._addCustomContent(doc, data);
          break;
      }
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`SAMS™ - Confidential | Page ${i} of ${pageCount}`, 105, 287, { align: 'center' });
      }
      
      // Resolve with the PDF blob
      const blob = doc.output('blob');
      
      // Store in cache
      this.reportCache.set(`${reportType}-${Date.now()}`, blob);
      this.lastGeneratedReports.unshift({
        type: reportType,
        date: new Date().toISOString(),
        format: 'pdf',
        size: blob.size
      });
      
      // Keep only the last 10 reports in history
      if (this.lastGeneratedReports.length > 10) {
        this.lastGeneratedReports.pop();
      }
      
      resolve(blob);
    });
  }

  // Executive Summary content for PDF
  _addExecutiveSummaryContent(doc, data) {
    doc.setFontSize(14);
    doc.text('Executive Summary', 14, 50);
    
    doc.setFontSize(10);
    doc.text(`Fiscal Period: ${data.fiscalPeriod}`, 14, 60);
    
    // Summary section
    doc.setFontSize(12);
    doc.text('Key Performance Indicators', 14, 75);
    
    const summaryTableData = [
      ['Metric', 'Value', 'Status'],
      ['Budget Utilization', `${data.summary.budgetUtilization.toFixed(1)}%`, this._getStatusText(data.summary.budgetUtilization, 100, 80)],
      ['Compliance Score', `${data.summary.complianceScore.toFixed(1)}%`, this._getStatusText(data.summary.complianceScore, 0, 80)],
      ['Risk Level', data.summary.riskLevel, this._getRiskStatusText(data.summary.riskLevel)],
      ['Anomalies Detected', data.summary.anomaliesDetected.toString(), this._getAnomalyStatusText(data.summary.anomaliesDetected)]
    ];
    
    doc.autoTable({
      startY: 80,
      head: [summaryTableData[0]],
      body: summaryTableData.slice(1),
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [25, 118, 210] },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 60 },
        2: { cellWidth: 60 }
      }
    });
    
    // Key insights section
    doc.setFontSize(12);
    doc.text('Key Insights', 14, doc.lastAutoTable.finalY + 20);
    
    let y = doc.lastAutoTable.finalY + 30;
    
    if (data.insights && data.insights.keyFindings) {
      data.insights.keyFindings.forEach((finding, index) => {
        if (y > 250) {
          doc.addPage();
          y = 20;
        }
        
        doc.setFontSize(10);
        doc.text(`${index + 1}. ${finding.title}`, 14, y);
        
        doc.setFontSize(9);
        const lines = doc.splitTextToSize(finding.description, 180);
        doc.text(lines, 14, y + 5);
        
        y += 10 + (lines.length * 5);
      });
    }
    
    // Recommendations section
    doc.setFontSize(12);
    doc.text('Recommendations', 14, y + 10);
    
    y += 20;
    
    if (data.insights && data.insights.recommendations) {
      data.insights.recommendations.forEach((recommendation, index) => {
        if (y > 250) {
          doc.addPage();
          y = 20;
        }
        
        doc.setFontSize(10);
        doc.text(`${index + 1}. ${recommendation.title}`, 14, y);
        
        doc.setFontSize(9);
        const lines = doc.splitTextToSize(recommendation.description, 180);
        doc.text(lines, 14, y + 5);
        
        y += 10 + (lines.length * 5);
      });
    }
  }

  _addFinancialContent(doc, data) {
    // Implementation for financial report content
    // Similar structure to executive report but with financial details
    doc.setFontSize(14);
    doc.text('Financial Report', 14, 50);
    
    // Add financial tables and charts here
  }

  _addComplianceContent(doc, data) {
    // Implementation for compliance report content
    doc.setFontSize(14);
    doc.text('Compliance Report', 14, 50);
    
    // Add compliance tables and charts here
  }

  _addCustomContent(doc, data) {
    // Implementation for custom report content
    doc.setFontSize(14);
    doc.text('Custom Report', 14, 50);
    
    // Add custom sections based on the data.sections
    let y = 60;
    
    data.sections.forEach(section => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFontSize(12);
      doc.text(section.title, 14, y);
      
      y += 10;
      
      // Custom rendering based on section type
      // This would be more complex in a real implementation
    });
  }

  // Excel report generation
  _generateExcelReport(data, reportType) {
    return new Promise((resolve) => {
      const workbook = XLSX.utils.book_new();
      
      // Add a summary worksheet
      const summaryData = this._prepareExcelSummaryData(data, reportType);
      const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');
      
      // Add detail worksheets based on report type
      switch (reportType) {
        case 'executive':
          this._addExecutiveExcelWorksheets(workbook, data);
          break;
        case 'financial':
          this._addFinancialExcelWorksheets(workbook, data);
          break;
        case 'compliance':
          this._addComplianceExcelWorksheets(workbook, data);
          break;
        case 'custom':
          this._addCustomExcelWorksheets(workbook, data);
          break;
      }
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Store in cache
      this.reportCache.set(`${reportType}-${Date.now()}`, blob);
      this.lastGeneratedReports.unshift({
        type: reportType,
        date: new Date().toISOString(),
        format: 'excel',
        size: blob.size
      });
      
      // Keep only the last 10 reports in history
      if (this.lastGeneratedReports.length > 10) {
        this.lastGeneratedReports.pop();
      }
      
      resolve(blob);
    });
  }

  // CSV report generation
  _generateCsvReport(data, reportType) {
    return new Promise((resolve) => {
      let csvContent = '';
      
      // Generate CSV content based on report type
      switch (reportType) {
        case 'executive':
          csvContent = this._generateExecutiveCsvContent(data);
          break;
        case 'financial':
          csvContent = this._generateFinancialCsvContent(data);
          break;
        case 'compliance':
          csvContent = this._generateComplianceCsvContent(data);
          break;
        case 'custom':
          csvContent = this._generateCustomCsvContent(data);
          break;
      }
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      
      // Store in cache
      this.reportCache.set(`${reportType}-${Date.now()}`, blob);
      this.lastGeneratedReports.unshift({
        type: reportType,
        date: new Date().toISOString(),
        format: 'csv',
        size: blob.size
      });
      
      // Keep only the last 10 reports in history
      if (this.lastGeneratedReports.length > 10) {
        this.lastGeneratedReports.pop();
      }
      
      resolve(blob);
    });
  }

  // Natural language insight generation helpers
  _generateBudgetUtilizationInsight(data) {
    const budgetUtilization = data.budgetUtilization || 0;
    
    let status = 'optimal';
    if (budgetUtilization > 95) status = 'high';
    else if (budgetUtilization < 70) status = 'low';
    
    const messages = {
      high: `Budget utilization is currently at ${budgetUtilization.toFixed(1)}%, which is higher than the recommended range. This may indicate potential overspending or the need for budget reallocation.`,
      optimal: `Budget utilization is at an optimal level of ${budgetUtilization.toFixed(1)}%, indicating effective financial management and appropriate budget allocation.`,
      low: `Budget utilization is currently at ${budgetUtilization.toFixed(1)}%, which is lower than expected. This may indicate delayed project implementation or potential for reallocation to underfunded areas.`
    };
    
    return {
      title: 'Budget Utilization Analysis',
      description: messages[status],
      status,
      value: budgetUtilization
    };
  }

  _generateComplianceStatusInsight(data) {
    const complianceScore = data.complianceScore || 0;
    
    let status = 'good';
    if (complianceScore < 70) status = 'critical';
    else if (complianceScore < 85) status = 'warning';
    
    const messages = {
      critical: `Compliance score of ${complianceScore.toFixed(1)}% indicates significant compliance risks that require immediate attention. Key regulatory frameworks may have critical violations.`,
      warning: `Compliance score of ${complianceScore.toFixed(1)}% indicates areas of potential concern. While not critical, these areas should be addressed to ensure full regulatory compliance.`,
      good: `Compliance score of ${complianceScore.toFixed(1)}% indicates good adherence to regulatory requirements. Continue monitoring to maintain this high level of compliance.`
    };
    
    return {
      title: 'Compliance Status Assessment',
      description: messages[status],
      status,
      value: complianceScore
    };
  }

  _generateRiskAssessmentInsight(data) {
    const riskLevel = data.riskLevel || 'Low';
    const numericRisk = riskLevel === 'High' ? 80 : riskLevel === 'Medium' ? 50 : 20;
    
    const messages = {
      High: `Risk assessment indicates a high level of financial and compliance risk. Critical attention is required in the areas of ${data.highRiskAreas?.join(', ') || 'various municipal operations'}.`,
      Medium: `Risk assessment indicates a moderate level of risk across municipal operations. Targeted monitoring and controls are recommended, particularly in ${data.mediumRiskAreas?.join(', ') || 'key operational areas'}.`,
      Low: `Risk assessment indicates a low overall risk profile. Continue with current controls and monitoring to maintain this favorable risk position.`
    };
    
    return {
      title: 'Risk Assessment Summary',
      description: messages[riskLevel] || messages.Low,
      status: riskLevel.toLowerCase(),
      value: numericRisk
    };
  }

  _generateKeyFindingsInsights(data) {
    // This would normally be generated based on AI analysis of the data
    // For demonstration, we'll return mock findings
    return [
      {
        title: 'Budget Variance in Capital Projects',
        description: 'Capital projects are currently showing a 15% variance from planned expenditure, primarily due to procurement delays and contractor issues.',
        impact: 'Medium',
        area: 'Capital Projects'
      },
      {
        title: 'Improved Compliance in Procurement Processes',
        description: 'Procurement compliance has improved by 12% this quarter, reflecting successful implementation of new procurement controls and training.',
        impact: 'Positive',
        area: 'Procurement'
      },
      {
        title: 'Increasing Operational Expenses in IT Department',
        description: 'IT operational expenses have increased 23% above projections, primarily due to unplanned software licensing costs and emergency cybersecurity measures.',
        impact: 'High',
        area: 'IT Operations'
      }
    ];
  }

  _generateRecommendationsInsights(data) {
    // This would normally be generated based on AI analysis of the data
    // For demonstration, we'll return mock recommendations
    return [
      {
        title: 'Implement Procurement Workflow Automation',
        description: 'Automate the procurement approval workflow to reduce processing time and improve compliance with MFMA regulations.',
        priority: 'High',
        estimatedImpact: 'Reduction in procurement processing time by 35% and improvement in compliance score by 15%'
      },
      {
        title: 'Reallocate Budget from Underspent Areas',
        description: 'Identify and reallocate funds from consistently underspent budget lines to priority areas with funding shortfalls.',
        priority: 'Medium',
        estimatedImpact: 'Improved budget utilization of approximately 12% and better alignment with strategic priorities'
      },
      {
        title: 'Enhance Vendor Performance Monitoring',
        description: 'Implement a structured vendor performance monitoring system with quarterly reviews and performance metrics.',
        priority: 'Medium',
        estimatedImpact: 'Potential cost savings of 8-10% through improved vendor management and performance'
      }
    ];
  }

  // Helper methods for formatting
  _getStatusText(value, badThreshold, goodThreshold) {
    if ((badThreshold > goodThreshold && value >= badThreshold) || 
        (badThreshold < goodThreshold && value <= badThreshold)) {
      return 'Critical';
    } else if ((badThreshold > goodThreshold && value >= goodThreshold && value < badThreshold) || 
               (badThreshold < goodThreshold && value > badThreshold && value <= goodThreshold)) {
      return 'Warning';
    } else {
      return 'Good';
    }
  }

  _getRiskStatusText(riskLevel) {
    switch (riskLevel.toLowerCase()) {
      case 'high': return 'Critical';
      case 'medium': return 'Warning';
      case 'low': return 'Good';
      default: return 'Unknown';
    }
  }

  _getAnomalyStatusText(count) {
    if (count > 10) return 'Critical';
    if (count > 0) return 'Warning';
    return 'Good';
  }

  // Methods for Excel report generation
  _prepareExcelSummaryData(data, reportType) {
    const baseData = [
      ['SAMS™ REPORT', ''],
      ['', ''],
      ['Report Type', this._getReportTypeName(reportType)],
      ['Generated Date', new Date(data.generatedDate).toLocaleString()],
      ['Municipality', data.municipality],
      ['Period', data.fiscalPeriod || data.auditPeriod || data.period || 'Current Period'],
      ['', '']
    ];
    
    // Add summary metrics based on report type
    switch (reportType) {
      case 'executive':
        baseData.push(
          ['SUMMARY METRICS', ''],
          ['Budget Utilization', `${data.summary.budgetUtilization.toFixed(1)}%`],
          ['Compliance Score', `${data.summary.complianceScore.toFixed(1)}%`],
          ['Risk Level', data.summary.riskLevel],
          ['Anomalies Detected', data.summary.anomaliesDetected.toString()]
        );
        break;
      case 'financial':
        // Add financial summary metrics
        break;
      case 'compliance':
        // Add compliance summary metrics
        break;
      case 'custom':
        // Add custom summary metrics
        break;
    }
    
    return baseData;
  }

  _getReportTypeName(reportType) {
    switch (reportType) {
      case 'executive': return 'Executive Summary Report';
      case 'financial': return 'Detailed Financial Report';
      case 'compliance': return 'Compliance Audit Report';
      case 'custom': return 'Custom Report';
      default: return 'Report';
    }
  }

  _addExecutiveExcelWorksheets(workbook, data) {
    // Add key metrics worksheet
    if (data.keyMetrics && data.keyMetrics.length > 0) {
      const metricsData = [['Metric', 'Value', 'Status']];
      data.keyMetrics.forEach(metric => {
        metricsData.push([metric.name, metric.value.toString(), metric.status]);
      });
      
      const metricsWorksheet = XLSX.utils.aoa_to_sheet(metricsData);
      XLSX.utils.book_append_sheet(workbook, metricsWorksheet, 'Key Metrics');
    }
    
    // Add insights worksheet
    if (data.insights) {
      const insightsData = [['Insight', 'Description', 'Status']];
      
      if (data.insights.budgetUtilization) {
        insightsData.push([
          data.insights.budgetUtilization.title,
          data.insights.budgetUtilization.description,
          data.insights.budgetUtilization.status
        ]);
      }
      
      if (data.insights.complianceStatus) {
        insightsData.push([
          data.insights.complianceStatus.title,
          data.insights.complianceStatus.description,
          data.insights.complianceStatus.status
        ]);
      }
      
      if (data.insights.riskAssessment) {
        insightsData.push([
          data.insights.riskAssessment.title,
          data.insights.riskAssessment.description,
          data.insights.riskAssessment.status
        ]);
      }
      
      const insightsWorksheet = XLSX.utils.aoa_to_sheet(insightsData);
      XLSX.utils.book_append_sheet(workbook, insightsWorksheet, 'Insights');
    }
    
    // Add findings worksheet
    if (data.insights && data.insights.keyFindings) {
      const findingsData = [['Finding', 'Description', 'Impact', 'Area']];
      data.insights.keyFindings.forEach(finding => {
        findingsData.push([
          finding.title,
          finding.description,
          finding.impact,
          finding.area
        ]);
      });
      
      const findingsWorksheet = XLSX.utils.aoa_to_sheet(findingsData);
      XLSX.utils.book_append_sheet(workbook, findingsWorksheet, 'Key Findings');
    }
    
    // Add recommendations worksheet
    if (data.insights && data.insights.recommendations) {
      const recommendationsData = [['Recommendation', 'Description', 'Priority', 'Estimated Impact']];
      data.insights.recommendations.forEach(recommendation => {
        recommendationsData.push([
          recommendation.title,
          recommendation.description,
          recommendation.priority,
          recommendation.estimatedImpact
        ]);
      });
      
      const recommendationsWorksheet = XLSX.utils.aoa_to_sheet(recommendationsData);
      XLSX.utils.book_append_sheet(workbook, recommendationsWorksheet, 'Recommendations');
    }
  }

  _addFinancialExcelWorksheets(workbook, data) {
    // Implementation for financial Excel worksheets
    // Would add specific financial data worksheets
  }

  _addComplianceExcelWorksheets(workbook, data) {
    // Implementation for compliance Excel worksheets
    // Would add specific compliance data worksheets
  }

  _addCustomExcelWorksheets(workbook, data) {
    // Implementation for custom Excel worksheets
    // Would add worksheets based on the custom sections
    if (data.sections && data.sections.length > 0) {
      data.sections.forEach(section => {
        // Create a worksheet for each section
        // This would be more complex in a real implementation
      });
    }
  }

  // CSV content generation
  _generateExecutiveCsvContent(data) {
    let csvContent = 'SAMS™ Executive Summary Report\n';
    csvContent += `Generated Date,${new Date(data.generatedDate).toLocaleString()}\n`;
    csvContent += `Municipality,${data.municipality}\n`;
    csvContent += `Fiscal Period,${data.fiscalPeriod}\n\n`;
    
    csvContent += 'Summary Metrics\n';
    csvContent += `Budget Utilization,${data.summary.budgetUtilization.toFixed(1)}%\n`;
    csvContent += `Compliance Score,${data.summary.complianceScore.toFixed(1)}%\n`;
    csvContent += `Risk Level,${data.summary.riskLevel}\n`;
    csvContent += `Anomalies Detected,${data.summary.anomaliesDetected}\n\n`;
    
    if (data.insights && data.insights.keyFindings) {
      csvContent += 'Key Findings\n';
      csvContent += 'Finding,Description,Impact,Area\n';
      
      data.insights.keyFindings.forEach(finding => {
        csvContent += `"${finding.title}","${finding.description}","${finding.impact}","${finding.area}"\n`;
      });
      
      csvContent += '\n';
    }
    
    if (data.insights && data.insights.recommendations) {
      csvContent += 'Recommendations\n';
      csvContent += 'Recommendation,Description,Priority,Estimated Impact\n';
      
      data.insights.recommendations.forEach(recommendation => {
        csvContent += `"${recommendation.title}","${recommendation.description}","${recommendation.priority}","${recommendation.estimatedImpact}"\n`;
      });
    }
    
    return csvContent;
  }

  _generateFinancialCsvContent(data) {
    // Implementation for financial CSV content
    // Similar structure to executive but with financial data
    return '';
  }

  _generateComplianceCsvContent(data) {
    // Implementation for compliance CSV content
    return '';
  }

  _generateCustomCsvContent(data) {
    // Implementation for custom CSV content
    return '';
  }
}

export const reportGenerator = new ReportGenerator();
export default reportGenerator;
