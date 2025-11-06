# Quality Insights Chatbot - Documentation

## Overview

This chatbot has been converted from Next.js to React and integrated into the qshakti_ui production application. It provides an interactive interface for querying production orders, inspection data, and quality parameters.

## Conversion Summary

### What Was Changed

1. **Framework Conversion**: Next.js → Standard React
   - Removed "use client" directives
   - Converted TypeScript (.tsx) to JavaScript (.jsx)
   - Replaced Next.js routing with React Router
   - Converted server actions to API calls

2. **UI Library**: Radix UI → Material-UI
   - All components now use Material-UI (MUI) to match qshakti_ui
   - Maintained the same visual design and user experience
   - Used MUI components: Card, Button, TextField, Table, Avatar, etc.

3. **Data Fetching**: Server Actions → Axios API Calls
   - Created `chatbotApi.js` with all API integration
   - Uses backend APIs from `newdata.txt`
   - Includes dummy APIs for features not yet available in backend

4. **Database**: Removed PostgreSQL dependency
   - All data now fetched from backend REST APIs
   - No direct database connections

## File Structure

```
/app/qshakti_ui/src/modules/Chatbot/
├── Chatbot.jsx                    # Main page component
├── chatbotApi.js                  # All API calls and backend integration
├── README.md                      # This documentation file
└── components/
    ├── ChatInterface.jsx          # Main chat logic and conversation flow
    ├── ChatMessages.jsx           # Message display component
    ├── ChatAvatar.jsx             # Avatar for bot and user
    ├── BotCard.jsx                # Bot message card wrapper
    ├── TableDisplay.jsx           # Table display for data
    └── ChartDisplay.jsx           # Chart visualization (line/bar)
```

## Features

The chatbot provides the following capabilities:

### 1. Production Order (PO) Status
- Query status of production orders
- View lot numbers, quantities, and progress
- **Backend API**: `/api/master/production_planner/list/`, `/api/master/po_no_dropdown/`

### 2. Inspection Details
Three types of inspections:
- **Inward Material Quality Inspection** (RM Inspection)
  - Backend API: `/api/master/io_no_dropdown/`
- **In-process Inspection**
  - Backend API: `/api/master/po_no_dropdown/`
- **Final Inspection / FAI Inspection**
  - Backend API: `/api/master/fai_po_no_dropdown/`

### 3. Parameter Analysis
- Analyze inspection parameters over time
- View statistics (min, max, average)
- Identify out-of-specification readings
- Track operator performance
- **Backend API**: `/api/master/order-details/:id/operation_details/`
- **Note**: Time-series data uses dummy API (marked in code)

### 4. Parameter Distribution
- View distribution of captured inspection parameters
- Filter by context (Inward/In-process/Final)
- **Note**: Uses dummy API (to be replaced with actual backend endpoint)

## API Integration

### Backend Base URL
```javascript
const API_BASE_URL = 'https://demo-qshakti.c4i4.org/api';
```

### Available Backend APIs

1. **Items List**
   - Endpoint: `/master/items/`
   - Purpose: Get items by factory and section
   - Used for: Item selection in all flows

2. **Production Planner**
   - Endpoint: `/master/production_planner/list/`
   - Purpose: Get production orders and status
   - Used for: PO status queries

3. **PO Dropdown**
   - Endpoint: `/master/po_no_dropdown/`
   - Purpose: Get available PO numbers by section
   - Used for: PO selection

4. **Order Details**
   - Endpoint: `/master/order-details/:id/operation_details/`
   - Purpose: Get operations and parameters for an order
   - Used for: Parameter analysis

5. **IO Number Dropdown**
   - Endpoint: `/master/io_no_dropdown/`
   - Purpose: Get IO numbers for RM inspection
   - Used for: Inward inspection

6. **FAI PO Dropdown**
   - Endpoint: `/master/fai_po_no_dropdown/`
   - Purpose: Get FAI PO numbers
   - Used for: Final inspection

### Dummy APIs (To Be Replaced)

The following features use dummy/mock data and need actual backend endpoints:

1. **Factory List** (`getFactories`)
   - Currently returns static factory data
   - Replace with actual `/master/plants/` or similar endpoint

2. **Inspection Records** (`getFilteredInspections`)
   - Returns dummy inspection data
   - Need actual endpoint for inspection records

3. **Parameter Analysis** (`getParameterSeriesAndStats`)
   - Returns generated time-series data
   - Need actual endpoint for historical parameter data

4. **LSL/USL Distribution** (`getLSLUSLDistribution`)
   - Returns dummy distribution data
   - Need actual endpoint for distribution analysis

5. **Parameter Distribution** (`getParameterDistribution`)
   - Returns dummy statistics
   - Need actual endpoint for parameter distribution

**How to Replace Dummy APIs:**

1. Open `/app/qshakti_ui/src/modules/Chatbot/chatbotApi.js`
2. Find functions marked with `// DUMMY API` comment
3. Replace with actual API calls to your backend
4. Update data transformation to match your backend response format

## Authentication

The chatbot automatically includes authentication token from session storage in all API requests:

```javascript
const token = sessionStorage.getItem('token');
config.headers.Authorization = `Bearer ${token}`;
```

## Usage

### For Users

1. Click "CHATBOT" in the sidebar menu
2. Select from available options:
   - Production Order Status
   - Inspection details
   - Parameter analysis
   - Parameter distribution
3. Follow the conversation flow
4. You can either:
   - Click option buttons
   - Type option numbers directly and press Submit

### For Developers

#### Adding New Features

1. **Add new API function** in `chatbotApi.js`:
```javascript
export const getNewData = async (params) => {
  try {
    const response = await axiosInstance.get('/your-endpoint', { params });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};
```

2. **Add conversation step** in `ChatInterface.jsx`:
```javascript
// Add to CONVERSATION_STEPS
NEW_FEATURE_STEP: 'new_feature_step',

// Add to MAIN_OPTIONS
{ label: 'New Feature', value: 'new_feature' },

// Add handler function
const handleNewFeature = async (step, option) => {
  // Your logic here
};
```

3. **Update switch statement** in `handleMainOptionSelect`:
```javascript
case 'new_feature':
  setCurrentStep(CONVERSATION_STEPS.NEW_FEATURE_STEP);
  // Your logic
  break;
```

#### Modifying UI

All Material-UI styling can be customized using the `sx` prop:

```javascript
<Box sx={{ bgcolor: 'primary.main', p: 2 }}>
  // Your content
</Box>
```

## Dependencies

The chatbot uses the following libraries:

- **@mui/material**: UI components
- **@mui/icons-material**: Icons (SmartToy, Person, TrendingUp)
- **recharts**: Charts and data visualization
- **axios**: HTTP client for API calls

All dependencies are already included in qshakti_ui's `package.json`.

## Troubleshooting

### Chatbot not showing in sidebar
- Check if the route is added in `routingdata.jsx`
- Verify sidebar item in `sidebardata.jsx`
- Check user permissions for "chatbot" screen

### API calls failing
- Verify backend URL in `chatbotApi.js`
- Check authentication token in session storage
- Verify CORS settings on backend
- Check browser console for detailed error messages

### Charts not displaying
- Ensure recharts is installed: `yarn add recharts`
- Check data format matches expected structure
- Verify responsive container has height set

### Options not clickable
- Check handler function is passed to `addBotMessage`
- Verify options array is not empty
- Check for JavaScript errors in console

## Integration Points

### Modified Files in qshakti_ui

1. **`/app/qshakti_ui/src/common/routingdata.jsx`**
   - Added Chatbot route
   - Import statement for lazy loading

2. **`/app/qshakti_ui/src/layouts/sidebar/sidebardata.jsx`**
   - Added CHATBOT menu item
   - Added SmartToyIcon import

### No Other Files Modified
The chatbot is fully self-contained in the `/modules/Chatbot/` directory and doesn't affect any other existing functionality.

## Future Enhancements

Suggested improvements for future versions:

1. **Real-time Updates**
   - Integrate WebSocket for live data updates
   - Show real-time notifications for new inspections

2. **Advanced Analytics**
   - Add trend analysis
   - Predictive analytics for quality issues
   - Statistical process control (SPC) charts

3. **Export Functionality**
   - Export chat history
   - Download charts and tables as PDF/Excel

4. **Multi-language Support**
   - Support for Hindi and other regional languages
   - Language selection in chatbot settings

5. **Voice Interface**
   - Voice commands for hands-free operation
   - Text-to-speech for responses

6. **Enhanced Visualizations**
   - 3D charts
   - Interactive dashboards
   - Heat maps for quality distribution

## Support

For issues or questions:
1. Check this documentation
2. Review comments in source code
3. Check browser console for error messages
4. Verify backend API responses using browser dev tools

## Version History

- **v1.0.0** (Current) - Initial conversion from Next.js to React
  - Converted all TSX to JSX
  - Replaced Radix UI with Material-UI
  - Integrated with qshakti_ui backend APIs
  - Added comprehensive documentation and comments

---

**Note**: This chatbot is designed to grow with your application. All dummy APIs are clearly marked and can be easily replaced as backend endpoints become available.
