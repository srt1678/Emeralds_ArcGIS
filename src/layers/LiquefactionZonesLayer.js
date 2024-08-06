import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";

const liquefactionZonesUrl = "https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/ECA_LiquefactionProneAreas/FeatureServer" 

const emergencyHubsTemplate = {
  title: "{OBJECTID}",
  content: [
      {
          type: "fields",
          fieldInfos: [
              { fieldName: "Shape__Area", label: "Shape Area" },
              { fieldName: "Shape__Length", label: "Shape Length" },
          ],
      },
  ],
};

const liquefactionZonesLayer = new FeatureLayer({
  id: "liquefactionZonesLayer",
  url: liquefactionZonesUrl,
  title: "Liquefaction Zones",
  outFields: ["*"],
  visible: false,
  listMode: "show",
  popupTemplate: emergencyHubsTemplate
});

export default liquefactionZonesLayer;
