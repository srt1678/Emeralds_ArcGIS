// import Graphic from "@arcgis/core/Graphic";
// import RouteLayer from "@arcgis/core/layers/RouteLayer";
// import Stop from "@arcgis/core/rest/support/Stop";
// import PolygonBarrier from "@arcgis/core/rest/support/PolygonBarrier";
// import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
// import esriConfig from "@arcgis/core/config";

// let routeLayer = null;

// export const addGraphic = (view, type, geometry) => {
//     let color = "#ffffff";
//     let outlineColor = "#000000";
//     let size = "12px";
//     let symbol;

//     if (type === "start") {
//         color = "#ffffff";
//         symbol = {
//             type: "simple-marker",
//             color: color,
//             size: size,
//             outline: {
//                 color: outlineColor,
//                 width: "1px",
//             },
//         };
//     } else if (type === "stop") {
//         color = "#000000";
//         outlineColor = "#ffffff";
//         size = "8px";
//         symbol = {
//             type: "simple-marker",
//             color: color,
//             size: size,
//             outline: {
//                 color: outlineColor,
//                 width: "1px",
//             },
//         };
//     } else {
//         color = "#000000";
//         outlineColor = "#ffffff";
//         symbol = {
//             type: "simple-marker",
//             color: color,
//             size: size,
//             outline: {
//                 color: outlineColor,
//                 width: "1px",
//             },
//         };
//     }

//     const graphic = new Graphic({
//         symbol: symbol,
//         geometry: geometry,
//     });
//     view.graphics.add(graphic);
// };

// export const clearRouteLayer = () => {
//     if (routeLayer) {
//         routeLayer.removeAll(); // Remove all graphics from the route layer
//         routeLayer = null; // Reset the route layer reference
//     }
// };

// export const getRoute = async (view) => {
//     if (routeLayer) {
//         view.map.remove(routeLayer); // Remove any existing route layer
//     }

//     routeLayer = new RouteLayer();
//     view.map.add(routeLayer);

//     try {
//         // Add the stops
//         const stops = view.graphics.toArray().map(graphic => new Stop({ geometry: graphic.geometry }));

//         // Set stops on the RouteLayer
//         routeLayer.stops = stops;

//         // Solve the route
//         const result = await routeLayer.solve({ apiKey: esriConfig.apiKey });

//         // Update the RouteLayer with the results
//         routeLayer.update(result);

//         // Zoom to the extent of the solved route
//         view.goTo(routeLayer.routeInfo.geometry);

//         return result;
//     } catch (error) {
//         console.error('Error solving route:', error);
//     }
// };

// export const checkIncidentFacilityConnection = async (view, incident, facilities, polygonBarriersResult) => {
//     // Add incident graphic to the view
//     addGraphic(view, "start", incident.geometry);

//     // Add facility graphics to the view
//     facilities.forEach((facility) => {
//         addGraphic(view, "stop", facility.geometry);
//     });

//     try {
//         // Create PolygonBarrier instances from the polygonBarriersResult
//         const polygonBarriers = polygonBarriersResult.features.map((feature) => {
//             return new PolygonBarrier({
//                 geometry: feature.geometry,
//                 barrierType: "restriction",
//             });
//         });

//         // Check if at least one facility is not within any barriers
//         const facilityNotInBarrier = facilities.some((facility) => {
//             return !polygonBarriers.some((barrier) => 
//                 geometryEngine.contains(barrier.geometry, facility.geometry)
//             );
//         });

//         if (!facilityNotInBarrier) {
//             console.log("All facilities are within the barriers.");
//             return false;
//         }

//         // Get the route between the incident and facilities
//         const result = await getRoute(view);

//         // Check if routes are available
//         if (result && result.routes && result.routes.length > 0) {
//             console.log("Incident and facilities are connected by a valid route.");
            
//             // Highlight the first route
//             const firstRoute = result.routes[0];
//             if (firstRoute) {
//                 const routeGraphic = new Graphic({
//                     geometry: firstRoute.geometry,
//                     symbol: {
//                         type: "simple-line",
//                         color: [255, 0, 0, 0.5],
//                         width: 5,
//                     },
//                 });
//                 view.graphics.add(routeGraphic);
//                 view.goTo(routeGraphic.geometry.extent.expand(1.2));
//             }

//             return true;
//         } else {
//             console.log("No valid route found between the incident and facilities.");
//             return false;
//         }
//     } catch (error) {
//         console.error("Error checking incident-facility connection:", error);
//         return false;
//     } finally {
//         // Clear the route layer after checking
//         clearRouteLayer();
//     }
// };
