import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";

const dWWMainlinesLayer = new FeatureLayer({
  //url: "https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/SPU_DWW_Mainlines_External/FeatureServer",  
  
  portalItem: {
    id: "9cd1e993421543c197300dbe45e1ad77",
    portal: "https://www.arcgis.com",
  },
  visible: false
});

export default dWWMainlinesLayer;
