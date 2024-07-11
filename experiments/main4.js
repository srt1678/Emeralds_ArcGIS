// All hospitals and firestations conncect as RouteLayer
require([
    "esri/WebMap",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/layers/RouteLayer",
    "esri/rest/support/Stop",
    "esri/config"
  ], function (WebMap, MapView, FeatureLayer, RouteLayer, Stop, esriConfig) {
    esriConfig.apiKey = window.API_KEY
  
    // Data URLs
    const hospitalUrl = "https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/Hospital/FeatureServer/0";
    const fireStationUrl = "https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/Fire_Stations/FeatureServer/0";
  
    // Popup template for hospitals
    const hospitalTemplate = {
      title: "{FACILITY}",
      content: [
        {
          type: "fields",
          fieldInfos: [
            { fieldName: "ADDRESS", label: "ADDRESS" },
            { fieldName: "CITY", label: "CITY" },
            { fieldName: "URL", label: "URL" },
            { fieldName: "TELEPHONE", label: "TELEPHONE" },
            { fieldName: "GLOBALID", label: "GLOBAL ID" }
          ]
        }
      ]
    };
  
    // Popup template for fire stations
    const fireStationTemplate = {
      title: "{STNID}",
      content: [
        {
          type: "fields",
          fieldInfos: [
            { fieldName: "ADDRESS", label: "ADDRESS" }
          ]
        }
      ]
    };
  
    // Define the hospital layer with popup template
    const hospitalLayer = new FeatureLayer({
      url: hospitalUrl,
      outFields: ["*"],
      popupTemplate: hospitalTemplate
    });
  
    // Define the fire station layer with popup template
    const fireStationLayer = new FeatureLayer({
      url: fireStationUrl,
      outFields: ["*"],
      popupTemplate: fireStationTemplate
    });
  
    // Create the map
    const map = new WebMap({
      basemap: "topo-vector",
      layers: [hospitalLayer, fireStationLayer]
    });
  
    // Create the view
    const view = new MapView({
      container: "viewDiv",
      map: map,
      zoom: 12,
      center: [-122.3328, 47.6061]
    });
  
    // Wait for the view to load
    view.when(async () => {
      // Query all hospitals
      const hospitalResults = await hospitalLayer.queryFeatures({
        where: "1=1",
        outFields: ["*"],
        returnGeometry: true
      });
  
      // Query all fire stations
      const fireStationResults = await fireStationLayer.queryFeatures({
        where: "1=1",
        outFields: ["*"],
        returnGeometry: true
      });
  
      const hospitals = hospitalResults.features;
      const fireStations = fireStationResults.features;
  
      // Create routes for each combination of hospitals and fire stations
      for (let hospital of hospitals) {
        for (let fireStation of fireStations) {
          const stops = [
            new Stop({
              geometry: hospital.geometry,
              name: hospital.attributes.FACILITY
            }),
            new Stop({
              geometry: fireStation.geometry,
              name: fireStation.attributes.STNID
            })
          ];
  
          // Create a new RouteLayer with the stops
          const routeLayer = new RouteLayer({
            stops: stops
          });
  
          // Add the RouteLayer to the map
          map.add(routeLayer);
  
          // Wait for the RouteLayer to load
          await routeLayer.load();
  
          // Solve the route
          const results = await routeLayer.solve({ apiKey: esriConfig.apiKey });
  
          // Update the RouteLayer with the results
          routeLayer.update(results);
        }
      }
  
      // Optionally, zoom to the extent of all routes
      if (map.layers.length > 2) {
        await view.goTo({
          target: map.layers.getItemAt(2).fullExtent,
          zoom: 12
        });
      }
    });
  });
