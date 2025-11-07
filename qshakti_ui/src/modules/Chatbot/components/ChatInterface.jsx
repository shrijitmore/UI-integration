/**
 * ChatInterface Component
 * Main chatbot interface with conversation flow management
 * Handles user interactions and displays responses
 * 
 * This component manages the entire chatbot conversation flow including:
 * - PO Status queries
 * - Inspection details (Inward, In-process, Final)
 * - Parameter analysis
 * - Parameter distribution
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, TextField, Alert } from '@mui/material';
import ChatMessages from './ChatMessages';
import TableDisplay from './TableDisplay';
import ChartDisplay, { RunChartStats } from './ChartDisplay';
import * as chatbotApi from '../chatbotApi';

// Conversation step types
// Defines all possible steps in the conversation flow
const CONVERSATION_STEPS = {
  START: 'start',
  PO_STATUS_SELECT_FACTORY: 'po_status_select_factory',
  PO_STATUS_SELECT_PO: 'po_status_select_po',
  INSPECTION_SELECT_TYPE: 'inspection_select_type',
  INSPECTION_SELECT_FACTORY: 'inspection_select_factory',
  INSPECTION_SELECT_SECTION: 'inspection_select_section',
  INSPECTION_SELECT_ITEM: 'inspection_select_item',
  INSPECTION_SELECT_PO: 'inspection_select_po',
  PARAM_ANALYSIS_SELECT_FACTORY: 'param_analysis_select_factory',
  PARAM_ANALYSIS_SELECT_SECTION: 'param_analysis_select_section',
  PARAM_ANALYSIS_SELECT_ITEM: 'param_analysis_select_item',
  PARAM_ANALYSIS_SELECT_OPERATION: 'param_analysis_select_operation',
  PARAM_ANALYSIS_SELECT_PARAMETER: 'param_analysis_select_parameter',
  PARAM_ANALYSIS_SELECT_DURATION: 'param_analysis_select_duration',
  PARAM_ANALYSIS_SELECT_RESULT: 'param_analysis_select_result',
  PARAM_DIST_SELECT_CONTEXT: 'param_dist_select_context',
  PARAM_DIST_SELECT_FACTORY: 'param_dist_select_factory',
  PARAM_DIST_SELECT_SECTION: 'param_dist_select_section',
  PARAM_DIST_SELECT_ITEM: 'param_dist_select_item',
  END: 'end',
};

// Main menu options shown at start
const MAIN_OPTIONS = [
  { label: 'Production Order (PO) Status', value: 'po_status' },
  { label: 'Inward Material Quality Inspection', value: 'inward_inspection' },
  { label: 'In-process Inspection', value: 'in_process_inspection' },
  { label: 'Final Inspection / FAI Inspection Details', value: 'final_inspection' },
  { label: 'Inspection Parameter Wise Analysis', value: 'param_analysis' },
  { label: 'Distribution of Captured Inspection Parameter', value: 'param_dist' },
];

/**
 * NumericInput component for typing numeric option values
 * Allows users to type option numbers instead of clicking buttons
 */
const NumericInput = ({ options, onSubmit, onError }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      onError('Please enter a value');
      return;
    }

    // Find matching option by value
    const matchedOption = options.find(
      (opt) => opt.value.toString().toLowerCase() === trimmedValue.toLowerCase()
    );

    if (matchedOption) {
      setInputValue('');
      onSubmit(matchedOption);
    } else {
      onError(
        `Invalid input. Please type one of the numbers shown in the options: ${options
          .map((o) => o.value)
          .join(', ')}`
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
      <TextField
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type number here..."
        size="small"
        fullWidth
        data-testid="numeric-input"
      />
      <Button type="submit" variant="contained" size="small" data-testid="numeric-submit-btn">
        Submit
      </Button>
    </form>
  );
};

/**
 * Main ChatInterface component
 */
const ChatInterface = () => {
  // State management
  const [messages, setMessages] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(CONVERSATION_STEPS.START);
  const [sessionData, setSessionData] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [factories, setFactories] = useState([]);

  // Refs for accessing latest state in async callbacks
  const sessionDataRef = useRef({});
  const factoriesRef = useRef([]);
  const didInitRef = useRef(false);

  // Update refs when state changes
  useEffect(() => {
    sessionDataRef.current = sessionData;
  }, [sessionData]);

  useEffect(() => {
    factoriesRef.current = factories;
  }, [factories]);

  // Initialize chatbot on mount
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    setIsBotTyping(true);

    // Load factories from API
    chatbotApi
      .getFactories()
      .then((factoriesData) => {
        console.log('[ChatInterface] Factories loaded:', factoriesData.length);
        setFactories(factoriesData);

        if (factoriesData.length === 0) {
          addBotMessage(
            'Welcome! Unable to load factories from database. Please check your connection.',
            MAIN_OPTIONS,
            handleMainOptionSelect,
            () => setIsBotTyping(false)
          );
        } else {
          addBotMessage(
            'Welcome to the Quality Insights Chatbot! How can I assist you today?',
            MAIN_OPTIONS,
            handleMainOptionSelect,
            () => setIsBotTyping(false)
          );
        }
      })
      .catch((error) => {
        console.error('[ChatInterface] Error loading factories:', error);
        addBotMessage(
          `Error: ${error instanceof Error ? error.message : 'Failed to load factories'}. Please check your connection.`,
          MAIN_OPTIONS,
          handleMainOptionSelect,
          () => setIsBotTyping(false)
        );
      });
  }, []);

  /**
   * Add a message to the chat
   */
  const addMessage = (role, content) => {
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), role, content }]);
  };

  /**
   * Add a bot message with optional options
   * @param {string} text - Message text
   * @param {Array} options - Optional array of options
   * @param {Function} handler - Optional handler for option selection
   * @param {Function} onComplete - Optional callback called after message is added (after delay)
   */
  const addBotMessage = (text, options = null, handler = null, onComplete = null) => {
    console.log('[addBotMessage] Called with:', {
      text,
      optionsCount: options?.length || 0,
      hasHandler: !!handler,
    });

    // Add 2 second delay before showing the message
    setTimeout(() => {
      // Check if all options are numeric and short
      const isNumericOptions = options?.every((opt) => {
        const val = opt.value.toString();
        return /^\d{1,5}$/.test(val) || /^[A-Z]-\d{1,4}$/.test(val);
      });

      const content = (
        <div>
          <p style={{ marginBottom: '16px' }}>{text}</p>
          {options && handler && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Show text input for numeric options */}
              {isNumericOptions && (
                <NumericInput
                  options={options}
                  onSubmit={handler}
                  onError={(msg) => setErrorMessage(msg)}
                />
              )}
              {/* Always show option buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {options.length > 0 ? (
                  options.map((opt) => (
                    <Button
                      key={opt.value}
                      variant="outlined"
                      size="small"
                      onClick={() => handler(opt)}
                      data-testid={`option-${opt.value}`}
                    >
                      {opt.label}
                    </Button>
                  ))
                ) : (
                  <p style={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                    No options available
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      );
      addMessage('bot', content);
      // Call onComplete callback after message is added
      if (onComplete) {
        onComplete();
      }
    }, 2000); // 2 second delay
  };

  /**
   * Add a user message
   */
  const addUserMessage = (text) => {
    addMessage('user', text);
  };

  /**
   * Handle main menu option selection
   */
  const handleMainOptionSelect = (option) => {
    addUserMessage(option.label);
    setIsBotTyping(true);
    setErrorMessage('');

    // Get current factories from ref
    const currentFactories =
      factoriesRef.current.length > 0 ? factoriesRef.current : factories;
    console.log('[handleMainOptionSelect] Factories available:', currentFactories.length);

    if (currentFactories.length === 0) {
      console.warn('[handleMainOptionSelect] No factories available!');
      addBotMessage(
        'Error: Factories not loaded yet. Please wait a moment and try again.',
        MAIN_OPTIONS,
        handleMainOptionSelect,
        () => setIsBotTyping(false)
      );
      return;
    }

    // Handle inspection options
    if (option.value.includes('inspection')) {
      const type = option.value.split('_')[0];
      let inspectionType = type.charAt(0).toUpperCase() + type.slice(1);
      if (option.value === 'in_process_inspection') inspectionType = 'In-process';

      setSessionData((prev) => ({ ...prev, inspectionType }));
      setCurrentStep(CONVERSATION_STEPS.INSPECTION_SELECT_FACTORY);
      addBotMessage(
        `Let's retrieve ${inspectionType} inspection details. First, please select a factory:`,
        currentFactories,
        (opt) => handleInspectionDetails(CONVERSATION_STEPS.INSPECTION_SELECT_FACTORY, opt),
        () => setIsBotTyping(false)
      );
      return;
    }

    // Handle other main options
    switch (option.value) {
      case 'po_status':
        setCurrentStep(CONVERSATION_STEPS.PO_STATUS_SELECT_FACTORY);
        addBotMessage(
          'Select the factory for which you want to see PO number status.',
          currentFactories,
          (opt) => handlePoStatus(CONVERSATION_STEPS.PO_STATUS_SELECT_FACTORY, opt),
          () => setIsBotTyping(false)
        );
        break;

      case 'param_analysis':
        setCurrentStep(CONVERSATION_STEPS.PARAM_ANALYSIS_SELECT_FACTORY);
        addBotMessage(
          'For parameter analysis, first select a factory:',
          currentFactories,
          (opt) => handleParamAnalysis(CONVERSATION_STEPS.PARAM_ANALYSIS_SELECT_FACTORY, opt),
          () => setIsBotTyping(false)
        );
        break;

      case 'param_dist':
        setCurrentStep(CONVERSATION_STEPS.PARAM_DIST_SELECT_CONTEXT);
        const contexts = [
          { label: 'Inward', value: 'Inward' },
          { label: 'In-process', value: 'In-process' },
          { label: 'Final', value: 'Final' },
        ];
        addBotMessage(
          'Select the context for distribution:',
          contexts,
          (opt) => handleParamDistribution(CONVERSATION_STEPS.PARAM_DIST_SELECT_CONTEXT, opt),
          () => setIsBotTyping(false)
        );
        break;

      default:
        break;
    }
  };

  /**
   * Handle PO status flow
   */
  const handlePoStatus = async (step, option) => {
    addUserMessage(option.label);
    setIsBotTyping(true);
    setErrorMessage('');

    const current = sessionDataRef.current;
    const newSessionData = { ...current, [step]: option.value };
    setSessionData(newSessionData);

    try {
      switch (step) {
        case CONVERSATION_STEPS.PO_STATUS_SELECT_FACTORY:
          setCurrentStep(CONVERSATION_STEPS.PO_STATUS_SELECT_PO);
          const poOptions = await chatbotApi.getPurchaseOrders(parseInt(option.value));
          addBotMessage(
            'Select a PO Number:',
            poOptions,
            (opt) => handlePoStatus(CONVERSATION_STEPS.PO_STATUS_SELECT_PO, opt)
          );
          break;

        case CONVERSATION_STEPS.PO_STATUS_SELECT_PO:
          const result = await chatbotApi.getPurchaseOrderStatus(option.value);
          if (result) {
            const rows = Object.entries(result).map(([key, value]) => [key, value]);
            addMessage(
              'bot',
              <TableDisplay
                title={`Status for PO ${option.value}`}
                headers={['Property', 'Value']}
                rows={rows}
              />
            );
          } else {
            addBotMessage(`Sorry, I couldn't find details for PO ${option.value}.`);
          }
          showEnd();
          break;

        default:
          break;
      }
    } catch (error) {
      console.error('Error in handlePoStatus:', error);
      addBotMessage('An error occurred while fetching data. Please try again.');
      showEnd();
    }

    setIsBotTyping(false);
  };

  /**
   * Handle inspection details flow
   */
  const handleInspectionDetails = async (step, option) => {
    addUserMessage(option.label);
    setIsBotTyping(true);
    setErrorMessage('');

    const current = sessionDataRef.current;
    const newSessionData = { ...current, [step]: option.value };
    setSessionData(newSessionData);

    try {
      switch (step) {
        case CONVERSATION_STEPS.INSPECTION_SELECT_FACTORY:
          setCurrentStep(CONVERSATION_STEPS.INSPECTION_SELECT_SECTION);
          const sections = await chatbotApi.getFactorySections(parseInt(option.value));
          addBotMessage(
            'Great. Now select a section/building:',
            sections,
            (opt) => handleInspectionDetails(CONVERSATION_STEPS.INSPECTION_SELECT_SECTION, opt)
          );
          break;

        case CONVERSATION_STEPS.INSPECTION_SELECT_SECTION:
          setCurrentStep(CONVERSATION_STEPS.INSPECTION_SELECT_ITEM);
          const itemCodes = await chatbotApi.getItems(
            parseInt(newSessionData.inspection_select_factory),
            option.value
          );
          addBotMessage(
            'Select an item code:',
            itemCodes,
            (opt) => handleInspectionDetails(CONVERSATION_STEPS.INSPECTION_SELECT_ITEM, opt)
          );
          break;

        case CONVERSATION_STEPS.INSPECTION_SELECT_ITEM:
          setCurrentStep(CONVERSATION_STEPS.INSPECTION_SELECT_PO);
          const poOptions = await chatbotApi.getPurchaseOrders(
            parseInt(newSessionData.inspection_select_factory),
            option.value
          );
          addBotMessage(
            'Finally, select a PO Number / Lot No.:',
            poOptions,
            (opt) => handleInspectionDetails(CONVERSATION_STEPS.INSPECTION_SELECT_PO, opt)
          );
          break;

        case CONVERSATION_STEPS.INSPECTION_SELECT_PO:
          const filters = {
            factoryId: parseInt(newSessionData.inspection_select_factory),
            section: newSessionData.inspection_select_section,
            itemCode: newSessionData.inspection_select_item,
            type: newSessionData.inspectionType,
            poId: option.value,
          };
          const inspections = await chatbotApi.getFilteredInspections(filters);

          if (inspections.length > 0) {
            const inspectionDetails = inspections.flatMap((i) =>
              i.parameters.map((p) => [
                i.id,
                i.operationName || 'N/A',
                p.name,
                p.value,
                p.unit,
                new Date(p.timestamp).toLocaleString(),
              ])
            );
            addMessage(
              'bot',
              <TableDisplay
                title="Inspection Details"
                headers={['Insp. ID', 'Operation', 'Parameter', 'Value', 'Unit', 'Timestamp']}
                rows={inspectionDetails}
              />
            );
          } else {
            addBotMessage('No inspection records found for the selected criteria.');
          }
          showEnd();
          break;

        default:
          break;
      }
    } catch (error) {
      console.error('Error in handleInspectionDetails:', error);
      addBotMessage('An error occurred while fetching data. Please try again.');
      showEnd();
    }

    setIsBotTyping(false);
  };

  /**
   * Handle parameter analysis flow
   */
  const handleParamAnalysis = async (step, option) => {
    addUserMessage(option.label);
    setIsBotTyping(true);
    setErrorMessage('');

    const current = sessionDataRef.current;
    const newSessionData = { ...current, [step]: option.value };
    setSessionData(newSessionData);

    try {
      switch (step) {
        case CONVERSATION_STEPS.PARAM_ANALYSIS_SELECT_FACTORY:
          setCurrentStep(CONVERSATION_STEPS.PARAM_ANALYSIS_SELECT_SECTION);
          const sections = await chatbotApi.getFactorySections(parseInt(option.value));
          addBotMessage(
            'Select a Section/Building/Lab:',
            sections,
            (opt) => handleParamAnalysis(CONVERSATION_STEPS.PARAM_ANALYSIS_SELECT_SECTION, opt)
          );
          break;

        case CONVERSATION_STEPS.PARAM_ANALYSIS_SELECT_SECTION:
          setCurrentStep(CONVERSATION_STEPS.PARAM_ANALYSIS_SELECT_ITEM);
          const itemCodes = await chatbotApi.getItems(
            parseInt(newSessionData.param_analysis_select_factory),
            option.value
          );
          addBotMessage(
            'Select an Item Code:',
            itemCodes,
            (opt) => handleParamAnalysis(CONVERSATION_STEPS.PARAM_ANALYSIS_SELECT_ITEM, opt)
          );
          break;

        case CONVERSATION_STEPS.PARAM_ANALYSIS_SELECT_ITEM:
          setCurrentStep(CONVERSATION_STEPS.PARAM_ANALYSIS_SELECT_OPERATION);
          const operations = await chatbotApi.getOperations(
            parseInt(newSessionData.param_analysis_select_factory),
            option.value,
            newSessionData.param_analysis_select_section
          );
          addBotMessage(
            'Select an Operation:',
            operations,
            (opt) => handleParamAnalysis(CONVERSATION_STEPS.PARAM_ANALYSIS_SELECT_OPERATION, opt)
          );
          break;

        case CONVERSATION_STEPS.PARAM_ANALYSIS_SELECT_OPERATION:
          setCurrentStep(CONVERSATION_STEPS.PARAM_ANALYSIS_SELECT_PARAMETER);
          const parameters = await chatbotApi.getParameters(
            parseInt(newSessionData.param_analysis_select_factory),
            newSessionData.param_analysis_select_item,
            option.value
          );
          addBotMessage(
            'Select an Inspection Parameter:',
            parameters,
            (opt) => handleParamAnalysis(CONVERSATION_STEPS.PARAM_ANALYSIS_SELECT_PARAMETER, opt)
          );
          break;

        case CONVERSATION_STEPS.PARAM_ANALYSIS_SELECT_PARAMETER:
          setCurrentStep(CONVERSATION_STEPS.PARAM_ANALYSIS_SELECT_DURATION);
          const durations = [
            { label: 'Last 7 days', value: '7' },
            { label: 'Last 30 days', value: '30' },
            { label: 'Last 90 days', value: '90' },
            { label: 'All time', value: '0' },
          ];
          addBotMessage(
            'Select duration for analysis:',
            durations,
            (opt) => handleParamAnalysis(CONVERSATION_STEPS.PARAM_ANALYSIS_SELECT_DURATION, opt)
          );
          break;

        case CONVERSATION_STEPS.PARAM_ANALYSIS_SELECT_DURATION:
          setCurrentStep(CONVERSATION_STEPS.PARAM_ANALYSIS_SELECT_RESULT);
          const resultTypes = [
            { label: 'Inspection parameters results', value: 'results_table' },
            { label: 'Average of the reading', value: 'avg' },
            { label: 'Run chart of the reading', value: 'run_chart' },
            { label: 'Minimum & Maximum reading', value: 'min_max' },
            { label: 'Which reading fall outside specification', value: 'oos' },
            { label: 'Who was the operator at that time', value: 'operators' },
            { label: 'Operation-wise LSL/USL distribution chart', value: 'dist_chart' },
          ];
          addBotMessage(
            'What do you want to see in the result?',
            resultTypes,
            (opt) => handleParamAnalysis(CONVERSATION_STEPS.PARAM_ANALYSIS_SELECT_RESULT, opt)
          );
          break;

        case CONVERSATION_STEPS.PARAM_ANALYSIS_SELECT_RESULT: {
          const days = parseInt(newSessionData.param_analysis_select_duration || '0') || undefined;
          const factoryId = parseInt(newSessionData.param_analysis_select_factory);
          const itemCode = newSessionData.param_analysis_select_item;
          const operation = newSessionData.param_analysis_select_operation;
          const parameter = newSessionData.param_analysis_select_parameter;

          // Handle distribution chart
          if (option.value === 'dist_chart') {
            const dist = await chatbotApi.getLSLUSLDistribution(
              factoryId,
              itemCode,
              operation,
              parameter,
              days
            );
            addMessage(
              'bot',
              <ChartDisplay
                type="bar"
                data={dist.data}
                title={`Operation Wise - ${operation}`}
                xAxisLabel={dist.xAxisLabel}
                yAxisLabel={dist.yAxisLabel}
              />
            );
            showEnd();
            break;
          }

          // Get parameter analysis data
          const analysis = await chatbotApi.getParameterSeriesAndStats(
            factoryId,
            itemCode,
            operation,
            parameter,
            days
          );

          // Handle different result types
          switch (option.value) {
            case 'results_table': {
              const rows = analysis.readings.map((r) => [
                new Date(r.timestamp).toLocaleString(),
                r.value,
                analysis.stats.unit || '',
                r.operator,
                r.status,
              ]);
              addMessage(
                'bot',
                <TableDisplay
                  title={`Readings for ${parameter}`}
                  headers={['Timestamp', 'Value', 'Unit', 'Operator', 'Status']}
                  rows={rows}
                />
              );
              break;
            }
            case 'avg': {
              const rows = [['Average Reading', analysis.stats.avg]];
              addMessage(
                'bot',
                <TableDisplay
                  title={`Average for ${parameter}`}
                  headers={['Metric', 'Value']}
                  rows={rows}
                />
              );
              break;
            }
            case 'min_max': {
              const rows = [
                ['Min Reading', analysis.stats.min],
                ['Max Reading', analysis.stats.max],
              ];
              addMessage(
                'bot',
                <TableDisplay
                  title={`Min/Max for ${parameter}`}
                  headers={['Metric', 'Value']}
                  rows={rows}
                />
              );
              break;
            }
            case 'oos': {
              if (analysis.oos.length === 0) {
                addBotMessage('No readings fall outside the specification range.');
              } else {
                const rows = analysis.oos.map((r) => [
                  new Date(r.timestamp).toLocaleString(),
                  r.value,
                  r.operator,
                ]);
                addMessage(
                  'bot',
                  <TableDisplay
                    title={`Out-of-spec Readings for ${parameter}`}
                    headers={['Timestamp', 'Value', 'Operator']}
                    rows={rows}
                  />
                );
              }
              break;
            }
            case 'operators': {
              const rows = analysis.readings.map((r) => [
                new Date(r.timestamp).toLocaleString(),
                r.operator,
                r.value,
              ]);
              addMessage(
                'bot',
                <TableDisplay
                  title={`Operators for ${parameter}`}
                  headers={['Timestamp', 'Operator', 'Value']}
                  rows={rows}
                />
              );
              break;
            }
            case 'run_chart':
            default: {
              addMessage(
                'bot',
                <div style={{ display: 'grid', gap: '16px' }}>
                  <ChartDisplay
                    type="line"
                    data={analysis.series}
                    title={`${parameter} - Run Chart`}
                    xAxisLabel="Time"
                    yAxisLabel={analysis.stats.unit ? `${analysis.stats.unit}` : 'Value'}
                    refLines={{
                      lsl: analysis.spec.lsl,
                      usl: analysis.spec.usl,
                      target: analysis.spec.target,
                    }}
                  />
                  <RunChartStats
                    stats={{
                      min: analysis.stats.min,
                      max: analysis.stats.max,
                      avg: analysis.stats.avg,
                      count: analysis.stats.count,
                    }}
                  />
                </div>
              );
              break;
            }
          }
          showEnd();
          break;
        }

        default:
          break;
      }
    } catch (error) {
      console.error('Error in handleParamAnalysis:', error);
      addBotMessage('An error occurred while fetching data. Please try again.');
      showEnd();
    }

    setIsBotTyping(false);
  };

  /**
   * Handle parameter distribution flow
   */
  const handleParamDistribution = async (step, option) => {
    addUserMessage(option.label);
    setIsBotTyping(true);
    setErrorMessage('');

    const current = sessionDataRef.current;
    const newSessionData = {
      ...current,
      inspectionType: current.inspectionType || '',
      [step]: option.value,
    };
    setSessionData(newSessionData);

    try {
      switch (step) {
        case CONVERSATION_STEPS.PARAM_DIST_SELECT_CONTEXT: {
          const currentFactories =
            factoriesRef.current.length > 0 ? factoriesRef.current : factories;
          if (currentFactories.length === 0) {
            addBotMessage(
              'Error: Factories not loaded. Please refresh the page.',
              MAIN_OPTIONS,
              handleMainOptionSelect
            );
          } else {
            addBotMessage(
              'Select a Factory:',
              currentFactories,
              (opt) => handleParamDistribution(CONVERSATION_STEPS.PARAM_DIST_SELECT_FACTORY, opt)
            );
          }
          break;
        }

        case CONVERSATION_STEPS.PARAM_DIST_SELECT_FACTORY:
          setCurrentStep(CONVERSATION_STEPS.PARAM_DIST_SELECT_SECTION);
          const sections = await chatbotApi.getFactorySections(parseInt(option.value));
          addBotMessage(
            'Select a Section/Building/Lab:',
            sections,
            (opt) => handleParamDistribution(CONVERSATION_STEPS.PARAM_DIST_SELECT_SECTION, opt)
          );
          break;

        case CONVERSATION_STEPS.PARAM_DIST_SELECT_SECTION:
          setCurrentStep(CONVERSATION_STEPS.PARAM_DIST_SELECT_ITEM);
          const itemCodes = await chatbotApi.getItems(
            parseInt(newSessionData.param_dist_select_factory),
            option.value
          );
          addBotMessage(
            'Select an Item Code:',
            itemCodes,
            (opt) => handleParamDistribution(CONVERSATION_STEPS.PARAM_DIST_SELECT_ITEM, opt)
          );
          break;

        case CONVERSATION_STEPS.PARAM_DIST_SELECT_ITEM:
          const result = await chatbotApi.getParameterDistribution(
            newSessionData.param_dist_select_context,
            parseInt(newSessionData.param_dist_select_factory),
            newSessionData.param_dist_select_section,
            option.value
          );
          if (result) {
            const rows = Object.entries(result).map(([key, value]) => [key, value]);
            addMessage(
              'bot',
              <TableDisplay
                title={`Distribution for ${option.label}`}
                headers={['Category', 'Details']}
                rows={rows}
              />
            );
          } else {
            addBotMessage(`No distribution data found for '${option.label}'.`);
          }
          showEnd();
          break;

        default:
          break;
      }
    } catch (error) {
      console.error('Error in handleParamDistribution:', error);
      addBotMessage('An error occurred while fetching data. Please try again.');
      showEnd();
    }

    setIsBotTyping(false);
  };

  /**
   * Show end message and reset for new conversation
   */
  const showEnd = () => {
    setSessionData({});
    setCurrentStep(CONVERSATION_STEPS.END);
    setIsBotTyping(true);
    setTimeout(() => {
      addBotMessage(
        'Is there anything else I can help you with?',
        MAIN_OPTIONS,
        handleMainOptionSelect,
        () => setIsBotTyping(false)
      );
    }, 1000);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Error message display */}
      {errorMessage && (
        <Box sx={{ p: 2, flexShrink: 0 }}>
          <Alert severity="error" onClose={() => setErrorMessage('')}>
            {errorMessage}
          </Alert>
        </Box>
      )}

      {/* Chat messages area - only this should scroll */}
      <Box sx={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        <ChatMessages messages={messages} isBotTyping={isBotTyping} />
      </Box>
    </Box>
  );
};

export default ChatInterface;
