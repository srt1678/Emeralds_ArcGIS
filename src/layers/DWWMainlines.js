import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";

const dwwMainlinesUrl = "https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/SPU_DWW_Mainlines_External/FeatureServer" 

const dWWMainlinesLayer = new FeatureLayer({
  id: "dwwMainlinesLayer",
  url: dwwMainlinesUrl,
  title: "DWW Mainlines",
  outFields: ["*"],
  visible: false,
  listMode: "show"
});

export default dWWMainlinesLayer;
