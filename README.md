# Seattle Earthquake Scenario Analysis App Documentation

## Table of Contents
1. [Overview](#1-overview)
2. [Application Structure](#2-application-structure)
3. [Key Components](#3-key-components)
4. [Configuration](#4-configuration)
5. [Utilities](#5-utilities)
6. [Core Functionality](#6-core-functionality)
7. [User Interface](#7-user-interface)
8. [Data Flow](#8-data-flow)
9. [Future Enhancements](#9-future-enhancements)
10. [Usage](#10-usage)
11. [Troubleshooting](#11-troubleshooting)

## 1. Overview

The Seattle Earthquake Scenario Analysis App is a sophisticated web application built using React and the ArcGIS JavaScript SDK. It provides an interactive platform for analyzing the potential impact of earthquake scenarios on Seattle's infrastructure, population, and critical facilities.

Key features include:
- Visualization of various infrastructure layers (hospitals, fire stations, schools, etc.)
- Multiple earthquake scenario modes (M6.8, M7.2, and custom scenarios)
- Closest facility analysis for emergency response planning
- Population impact assessment
- Custom routing with different travel modes

## 2. Application Structure

The application is structured into several key directories:

- `/components`: React components for the UI
- `/config`: Configuration files for layers, neighborhoods, and travel modes
- `/layers`: Definitions for various map layers
- `/utils`: Utility functions for data processing and analysis

## 3. Key Components

### 3.1 MapComponent (MapComponent.jsx)
- Core component for rendering the ArcGIS map
- Initializes the map view and adds basic widgets (search, legend)

### 3.2 MapWrapper (MapWrapper.jsx)
- Manages the overall state of the map and analysis
- Coordinates interactions between different components

### 3.3 AnalysisComponent (AnalysisComponent.jsx)
- Displays analysis results for selected features
- Provides interface for closest facility analysis

### 3.4 LayerSelector (LayerSelector.jsx)
- Allows users to select and filter earthquake damage levels

### 3.5 Menu (Menu.jsx)
- Provides UI for selecting source and target infrastructure
- Handles neighborhood selection and custom earthquake scenarios

### 3.6 LegendComponent (LegendComponent.jsx)
- Manages the display of the map legend

## 4. Configuration

### 4.1 Layer Configuration (allLayersConfig.js, infrastructureLayers.js)
- Defines various map layers (hospitals, fire stations, earthquake scenarios, etc.)

### 4.2 Neighborhood Configuration (neighborhoodsConfig.js)
- Defines Seattle neighborhoods for analysis

### 4.3 Travel Modes (travelModes.js)
- Configures different travel modes for routing (walking, driving with/without highways)

### 4.4 Earthquake Scenarios (earthquakeScenarioModes.js)
- Defines different earthquake scenario modes (M6.8, M7.2, custom)

## 5. Utilities

### 5.1 ClosestFacilityService (ClosestFacilityService.js)
- Performs closest facility analysis using ArcGIS REST services

### 5.2 DamagedInfraQueryService (DamagedInfraQueryService.js)
- Queries infrastructure affected by earthquake scenarios

### 5.3 EarthquakeService (EarthquakeService.js)
- Queries earthquake features based on damage values

### 5.4 HighlightService (HighlightService.js)
- Manages highlighting of features on the map

### 5.5 PopulationService (PopulationService.js)
- Queries population data for affected areas and routes

## 6. Core Functionality

### 6.1 Earthquake Scenario Analysis
- Users can visualize predefined (M6.8, M7.2) or custom earthquake scenarios
- The app calculates and displays affected infrastructure

### 6.2 Closest Facility Analysis
- Finds the nearest critical facilities (e.g., hospitals) to affected areas
- Considers different travel modes and potential road closures

### 6.3 Population Impact Assessment
- Estimates the population affected by earthquake damage
- Calculates population along evacuation routes

### 6.4 Custom Routing
- Allows users to find routes between selected points
- Considers earthquake damage in route calculation

## 7. User Interface

The UI is composed of several key elements:
- Interactive map display
- Layer list for toggling different data layers
- Analysis panel for displaying results and controls
- Search functionality for locating specific addresses or features

## 8. Data Flow

1. User selects an earthquake scenario or draws a custom scenario
2. App queries affected infrastructure based on the scenario
3. User can select source and target infrastructure for analysis
4. Closest facility analysis is performed, considering damage and travel modes
5. Results are displayed, including affected population and optimal routes

## 9. Future Enhancements

Potential areas for future development may include:
- Integration with real-time seismic data
- More detailed building damage assessment
- Expanded infrastructure types (e.g., power stations, water supply)
- Time-based analysis for long-term recovery planning
- Neighborhood selection feature to focus analysis on specific areas of Seattle


## 10. Usage

### 10.1 Prerequisites

- Node.js and npm installed on your machine
- Credential from ArcGIS Location Platform (https://location.arcgis.com/sign-up/)

### 10.2 Setup and Running the App
1. Clone the repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Run `npm install` to install dependencies.
4. Run `npm run dev` to start the development server.
5. Open your web browser and navigate to `http://localhost:5173` (or the port specified in the console output).
6. Log in with your ArcGIS Location Platform credentials when prompted.

The app should now be running and ready for use.

### 10.3 How to Use the App

1. **Selecting an Earthquake Scenario**
   - Use the layer list to toggle between M6.8, M7.2, or custom earthquake scenarios.
   - For custom scenarios, use the sketch tools to draw the affected area on the map.

2. **Viewing Affected Infrastructure**
   - Once a scenario is selected, affected infrastructure will be highlighted on the map.
   - Use the analysis panel to view detailed information about affected facilities.

3. **Performing Closest Facility Analysis**
   - Select a source infrastructure type (e.g., hospitals) from the dropdown menu.
   - Choose a target infrastructure type (e.g., fire stations).
   - Click "Find Closest Facilities" to perform the analysis.
   - Results will display optimal routes and affected populations.

4. **Customizing Analysis Parameters**
   - Adjust travel modes (walking, driving with/without highways) in the analysis settings.
   - Modify the maximum number of facilities or travel time as needed.

5. **Population Impact Assessment**
   - View estimated populations affected by the earthquake scenario in the analysis panel.
   - Population along routes is automatically calculated during closest facility analysis.
   - The route with the highest population will be highlighted in green on the map.

6. **Using the Search Function**
   - Enter an address or place name in the search bar to locate specific areas.
   - Use the search results to center the map or as starting points for analysis.

7. **Toggling Map Layers**
   - Use the layer list to toggle visibility of different infrastructure and data layers.

8. **Viewing the Legend**
   - Click the legend button in the lower right to view symbol explanations for visible layers.

9. **Clearing the Map**
   - Use the eraser button in the upper right corner to remove all current states and graphics from the map.


## 11. Troubleshooting
- If you encounter any issues or unexpected behavior, refresh the page and log in again.
- If the map doesn't load, ensure you're logged in with valid ArcGIS account credentials.
- For performance issues, try reducing the number of visible layers or the extent of your analysis area.
- If closest facility analysis fails, ensure both source and target infrastructure types are selected and visible on the map.
- For any persistent issues, check the browser console for error messages and refer to the ArcGIS Maps SDK for JavaScript documentation.
