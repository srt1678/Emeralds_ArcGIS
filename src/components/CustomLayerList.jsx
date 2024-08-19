import React, { useEffect, useRef } from "react";
import Expand from "@arcgis/core/widgets/Expand";
import LayerList from "@arcgis/core/widgets/LayerList";
import "./CustomLayerList.css";

const CustomLayerList = ({
    view,
    onLayerSelect,
    clearLayersFlag
}) => {
    // Refs to store widget instances
    const expandRef = useRef(null);
    const layerListRef = useRef(null);

    useEffect(() => {
        if (!view) return;

        let layerList, expand;

        // Function to create and add widgets
        const createAndAddWidgets = () => {
            if (!view || !view.ready) return;

            // Create LayerList if it doesn't exist
            if (!layerList) {
                layerList = new LayerList({
                    view: view,
                });
                layerListRef.current = layerList;
            }

            // Create Expand widget if it doesn't exist
            if (!expand) {
                expand = new Expand({
                    view: view,
                    content: layerList,
                    expandIconClass: "esri-icon-layer-list",
                    group: "bottom-right",
                    placement: "bottom",
                    collapseIcon: "chevrons-up",
                    autoCollapse: false,
                });
                expandRef.current = expand;
            }

            // Add the Expand widget to the view's UI if it's not already there
            if (view.ui && !view.ui.find((widget) => widget === expand)) {
                view.ui.add(expand, "top-right");
            }

            // Function to handle layer visibility changes
            const handleLayerVisibilityChange = (layer) => {
                if (layer.visible) {
                    // If the layer becomes visible, select it
                    onLayerSelect(layer);
                } else {
                    // If the layer becomes invisible, check if there are any other visible layers
                    const visibleLayers = view.map.allLayers.filter(l => l.visible && l.type !== "vector-tile");
                    if (visibleLayers.length === 0) {
                        // If no layers are visible, deselect all
                        onLayerSelect(null);
                    } else {
                        // If there are other visible layers, select the first one
                        onLayerSelect(visibleLayers[0]);
                    }
                }
            };

            // Add visibility change watchers to all non-basemap layers
            view.map.allLayers.forEach(layer => {
                if (layer.type !== "vector-tile") {
                    layer.watch("visible", () => handleLayerVisibilityChange(layer));
                }
            });
        };

        // Check if the view is ready, if not, set up a watcher
        if (view.ready) {
            createAndAddWidgets();
        } else {
            const watchHandle = view.watch("ready", (isReady) => {
                if (isReady) {
                    createAndAddWidgets();
                    watchHandle.remove();
                }
            });
        }

        // Cleanup function
        return () => {
            if (view && !view.destroyed) {
                view.ui.remove(expandRef.current);
            }
            if (expandRef.current) {
                expandRef.current.destroy();
            }
            if (layerListRef.current) {
                layerListRef.current.destroy();
            }
        };
    }, [view, onLayerSelect]);

    // Effect to handle layer clearing
    useEffect(() => {
        if (clearLayersFlag && view && view.map) {
            // Turn off visibility for all non-basemap layers
            view.map.allLayers.forEach(layer => {
                if (layer.type !== "vector-tile") {
                    layer.visible = false;
                }
            });
            // Deselect all layers
            onLayerSelect(null);
        }
    }, [clearLayersFlag, view, onLayerSelect]);

    // This component doesn't render anything directly
    return null;
};

export default CustomLayerList;

// import React, { useEffect, useRef } from "react";
// import Expand from "@arcgis/core/widgets/Expand";
// import LayerList from "@arcgis/core/widgets/LayerList";
// import "./CustomLayerList.css";

// const CustomLayerList = ({
//     view,
//     onLayerSelect,
//     earthquakeM6Layer,
//     earthquakeM7Layer,
//     earthquakeCustomScenarioLayer,
//     clearLayersFlag
// }) => {
//     // Refs to store widget instances
//     const expandRef = useRef(null);
//     const layerListRef = useRef(null);

//     useEffect(() => {
//         if (!view) return;

//         let layerList, expand;

//         // Function to create and add widgets
//         const createAndAddWidgets = () => {
//             if (!view || !view.ready) return;

//             // Step 1: Create LayerList widget
//             if (!layerList) {
//                 layerList = new LayerList({
//                     view: view,
//                 });
//                 layerListRef.current = layerList;
//             }

//             // Step 2: Create Expand widget
//             if (!expand) {
//                 expand = new Expand({
//                     view: view,
//                     content: layerList,
//                     expandIconClass: "esri-icon-layer-list",
//                     group: "bottom-right",
//                     placement: "bottom",
//                     collapseIcon: "chevrons-up",
//                     autoCollapse: false,
//                 });
//                 expandRef.current = expand;
//             }

//             // Step 3: Add Expand widget to the view's UI
//             if (view.ui && !view.ui.find((widget) => widget === expand)) {
//                 view.ui.add(expand, "top-right");
//             }

//             // Step 4: Define function to handle layer visibility changes
//             const handleLayerVisibilityChange = (layer) => {
//                 if (layer.visible) {
//                     // If a layer becomes visible, select it
//                     onLayerSelect(layer);
//                 } else {
//                     // Check if any earthquake layer is visible
//                     const isEarthquakeLayerVisible = 
//                         (earthquakeM6Layer && earthquakeM6Layer.visible) ||
//                         (earthquakeM7Layer && earthquakeM7Layer.visible) ||
//                         (earthquakeCustomScenarioLayer && earthquakeCustomScenarioLayer.visible);

//                     if (!isEarthquakeLayerVisible) {
//                         // If no earthquake layer is visible, check other layers
//                         const visibleLayers = view.map.allLayers.filter(l => l.visible && l.type !== "vector-tile");
//                         if (visibleLayers.length === 0) {
//                             // If no layers are visible, deselect all
//                             onLayerSelect(null);
//                         } else {
//                             // If there are other visible layers, select the first one
//                             onLayerSelect(visibleLayers[0]);
//                         }
//                     }
//                 }
//             };

//             // Step 5: Set up watchers for earthquake layers
//             [earthquakeM6Layer, earthquakeM7Layer, earthquakeCustomScenarioLayer].forEach(layer => {
//                 if (layer) {
//                     layer.watch("visible", () => handleLayerVisibilityChange(layer));
//                 }
//             });

//             // Step 6: Set up watchers for other layers
//             view.map.allLayers.forEach(layer => {
//                 if (layer.type !== "vector-tile" && 
//                     layer !== earthquakeM6Layer && 
//                     layer !== earthquakeM7Layer && 
//                     layer !== earthquakeCustomScenarioLayer) {
//                     layer.watch("visible", () => handleLayerVisibilityChange(layer));
//                 }
//             });
//         };

//         // Step 7: Check if the view is ready, if not, set up a watcher
//         if (view.ready) {
//             createAndAddWidgets();
//         } else {
//             const watchHandle = view.watch("ready", (isReady) => {
//                 if (isReady) {
//                     createAndAddWidgets();
//                     watchHandle.remove();
//                 }
//             });
//         }

//         // Step 8: Cleanup function
//         return () => {
//             if (view && !view.destroyed) {
//                 view.ui.remove(expandRef.current);
//             }
//             if (expandRef.current) {
//                 expandRef.current.destroy();
//             }
//             if (layerListRef.current) {
//                 layerListRef.current.destroy();
//             }
//         };
//     }, [view, onLayerSelect, earthquakeM6Layer, earthquakeM7Layer, earthquakeCustomScenarioLayer]);

//     // Step 9: Effect to handle layer clearing
//     useEffect(() => {
//         if (clearLayersFlag && view && view.map) {
//             // Turn off visibility for earthquake layers
//             [earthquakeM6Layer, earthquakeM7Layer, earthquakeCustomScenarioLayer].forEach(layer => {
//                 if (layer) layer.visible = false;
//             });

//             // Turn off visibility for all other non-basemap layers
//             view.map.allLayers.forEach(layer => {
//                 if (layer.type !== "vector-tile" && 
//                     layer !== earthquakeM6Layer && 
//                     layer !== earthquakeM7Layer && 
//                     layer !== earthquakeCustomScenarioLayer) {
//                     layer.visible = false;
//                 }
//             });
            
//             onLayerSelect(null);
//         }
//     }, [clearLayersFlag, view, onLayerSelect, earthquakeM6Layer, earthquakeM7Layer, earthquakeCustomScenarioLayer]);

//     // This component doesn't render anything directly
//     return null;
// };

// export default CustomLayerList;
