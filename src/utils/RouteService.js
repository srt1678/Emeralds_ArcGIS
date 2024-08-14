// import Graphic from "@arcgis/core/Graphic";
// import RouteLayer from "@arcgis/core/layers/RouteLayer"; // Import RouteLayer
// import Stop from "@arcgis/core/rest/support/Stop";
// import PolygonBarrier from "@arcgis/core/rest/support/PolygonBarrier";
// import esriConfig from "@arcgis/core/config";

// const routeSymbol = {
//     type: "simple-line",
//     color: [5, 150, 255],
//     width: 3,
// };

// let routeLayer = null; 

// export const addGraphic = (view, type, point) => {
//     let color = "#ffffff";
//     let outlineColor = "#000000";
//     let size = "12px";
//     if (type === "start") {
//         color = "#ffffff";
//     } else if (type === "stop") {
//         color = "#000000";
//         outlineColor = "#ffffff";
//         size = "8px";
//     } else {
//         color = "#000000";
//         outlineColor = "#ffffff";
//     }
//     const graphic = new Graphic({
//         symbol: {
//             type: "simple-marker",
//             color: color,
//             size: size,
//             outline: {
//                 color: outlineColor,
//                 width: "1px",
//             },
//         },
//         geometry: point,
//     });
//     view.graphics.add(graphic);
// };

// export const getRoute = async (view, barrierLayer) => {
//     if (routeLayer) {
//         view.map.remove(routeLayer); // Remove any existing route layer
//     }

//     routeLayer = new RouteLayer();
//     view.map.add(routeLayer);

//     try {
//         // Query the layer for barriers with damage 3 and 3.5 (red areas)
//         const barriersQuery = await barrierLayer.queryFeatures({
//             where: "damage IN (3, 3.5)",
//             outFields: ["*"],
//             returnGeometry: true,
//         });

//         console.log('Barriers Query Results:', barriersQuery);

//         if (!barriersQuery.features.length) {
//             console.error('No barriers found');
//             return;
//         }

//         // Create PolygonBarrier instances from the query results
//         const polygonBarriers = barriersQuery.features.map((feature) => {
//             return new PolygonBarrier({
//                 geometry: feature.geometry,
//                 barrierType: "restriction",
//             });
//         });

//         // Add the stops
//         const stops = view.graphics.toArray().map(graphic => new Stop({ geometry: graphic.geometry }));

//         // Set stops and barriers on the RouteLayer
//         routeLayer.stops = stops;
//         routeLayer.polygonBarriers = polygonBarriers;

//         // Solve the route
//         const result = await routeLayer.solve({ apiKey: esriConfig.apiKey });

//         // Update the RouteLayer with the results
//         routeLayer.update(result);

//         // Zoom to the extent of the solved route
//         view.goTo(routeLayer.routeInfo.geometry);
//     } catch (error) {
//         console.error('Error solving route:', error);
//     }
// };

// export const clearRouteLayer = () => {
//     if (routeLayer) {
//         routeLayer.removeAll(); // Remove all graphics from the route layer
//         routeLayer = null; // Reset the route layer reference
//     }
// };
