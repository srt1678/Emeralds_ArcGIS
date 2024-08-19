import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

const earthquakeCustomScenarioLayer = new GraphicsLayer({
    title: "Custom Earthquake Scenario",
    listMode: "show",
    visible: false,
    note: "A Custome Earthquake Scenario for Users"
});

export default earthquakeCustomScenarioLayer;
