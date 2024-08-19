import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";

const emergencyHubsUrl = "https://gisrevprxy.seattle.gov/arcgis/rest/services/SPU_EXT/CommunityEmergencyHubs/MapServer/0" 

const emergencyHubsTemplate = {
  title: "{NAME}",
  content: [
      {
          type: "fields",
          fieldInfos: [
              { fieldName: "ADDRESS", label: "Address" },
              { fieldName: "ACSCOMSEC", label: "Acscomsec" },
              { fieldName: "LATITUDE", label: "Latitude" },
              { fieldName: "LONGITUDE", label: "Longitude" },
          ],
      },
  ],
};

const emergencyHubsLayer = new FeatureLayer({
  id: "emergencyHubsLayer",
  url: emergencyHubsUrl,
  title: "Community Emergency Hubs",
  outFields: ["*"],
  visible: false,
  listMode: "show",
  popupTemplate: emergencyHubsTemplate,
  note: "Community Emergency Hubs are places where people gather after a disaster to help each other. Hubs serve as a central gathering place among neighbors in homes, apartments and condominiums, some who have organized using SNAP."
});

export default emergencyHubsLayer;
