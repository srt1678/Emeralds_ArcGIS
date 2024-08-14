// import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
// import Point from "@arcgis/core/geometry/Point";
// import Polyline from "@arcgis/core/geometry/Polyline";
// import * as projection from "@arcgis/core/geometry/projection";

// export async function checkPowerLineConnection(
//     point1,
//     point2,
//     cityLightLineLayer,
//     view
// ) {
//     // Ensure projection module is loaded
//     await projection.load();

//     // Query all power lines
//     const query = cityLightLineLayer.createQuery();
//     query.geometry = view.extent;
//     query.outFields = ["*"];
//     query.returnGeometry = true;

//     try {
//         const results = await cityLightLineLayer.queryFeatures(query);

//         // Ensure we have features to work with
//         if (results.features.length === 0) {
//             console.log("No power lines found in the current view extent.");
//             return false;
//         }

//         // Combine all power line geometries into a single polyline
//         const allLines = results.features.map((feature) => feature.geometry);
//         const combinedLines = geometryEngine.union(allLines);

//         // Ensure all geometries are in the same spatial reference
//         const spatialReference = combinedLines.spatialReference;
//         point1 = projectPointIfNeeded(point1, spatialReference);
//         point2 = projectPointIfNeeded(point2, spatialReference);

//         // Check if both points are near the power lines
//         const bufferDistance = 50; // Increased buffer distance in meters, adjust as needed
//         const bufferedPoint1 = geometryEngine.buffer(point1, bufferDistance, "meters");
//         const bufferedPoint2 = geometryEngine.buffer(point2, bufferDistance, "meters");

//         if (!bufferedPoint1 || !bufferedPoint2) {
//             console.log("Error creating buffer geometries.");
//             return false;
//         }

//         const isPoint1Near = geometryEngine.intersects(bufferedPoint1, combinedLines);
//         const isPoint2Near = geometryEngine.intersects(bufferedPoint2, combinedLines);

//         if (!isPoint1Near || !isPoint2Near) {
//             console.log("One or both points are not near any power lines.");
//             return false;
//         }

//         // Find the closest points on the power lines
//         const closestPoint1 = geometryEngine.nearestVertex(combinedLines, point1).coordinate;
//         const closestPoint2 = geometryEngine.nearestVertex(combinedLines, point2).coordinate;

//         // Create a line between the closest points
//         const connectingLine = new Polyline({
//             paths: [[[closestPoint1.x, closestPoint1.y], [closestPoint2.x, closestPoint2.y]]],
//             spatialReference: spatialReference
//         });

//         // Check if the connecting line intersects the power lines
//         const isConnected = geometryEngine.crosses(combinedLines, connectingLine);

//         if (isConnected) {
//             console.log("The points are CONNECTED via power lines.");
//             return true;
//         } else {
//             console.log("The points are near power lines but not connected.");
//             return false;
//         }
//     } catch (error) {
//         console.error("Error checking power line connection:", error);
//         return false;
//     }
// }

// function projectPointIfNeeded(point, targetSR) {
//     if (point.spatialReference.wkid !== targetSR.wkid) {
//         return projection.project(point, targetSR);
//     }
//     return point;
// }
