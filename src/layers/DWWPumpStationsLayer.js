import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";

const dwwPumpStationsUrl = "https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/DWW_Pump_Stationsss/FeatureServer" 

const dwwPumpStationsTemplate = {
  title: "{OBJECTID}",
  content: [
      {
          type: "fields",
          fieldInfos: [
              { fieldName: "PS_OWNER_CODE", label: "Owner Code" },
              { fieldName: "PS_OWNER_TEXT", label: "Owner" },
              { fieldName: "PS_LIFECYCLE_CODE", label: "Lifecycle" },
              { fieldName: "PS_LIFECYCLE_TEXT", label: "Lifecycle Desc" },
              { fieldName: "PS_FEATYPE_TEXT", label: "Feature Type" },
          ],
      },
  ],
};

const dwwPumpStationsLayer = new FeatureLayer({
  id: "dwwPumpStationsLayer",
  url: dwwPumpStationsUrl,
  title: "DWW Pump Stations",
  outFields: ["*"],
  visible: false,
  popupTemplate: dwwPumpStationsTemplate,
});

dwwPumpStationsLayer.renderer = {
  type: "simple",
  symbol: {
    type: "simple-marker",
    size: 5,
    color: "gray"
  }
}

export default dwwPumpStationsLayer;