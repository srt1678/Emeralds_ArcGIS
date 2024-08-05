import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

const earthquakeCustomScenarioLayer = new GraphicsLayer({
    title: "Custom Earthquake Scenario",
    listMode: "show",
    visible: false,
});

export default earthquakeCustomScenarioLayer;
