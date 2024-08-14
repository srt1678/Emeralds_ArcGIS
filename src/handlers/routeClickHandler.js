// import { addGraphic, getRoute } from "../utils/RouteService";
// import { hospitalLayer, fireStationLayer, earthquakeM6Layer } from "../layers";

// export const handleRouteClick = (
//     view,
//     response,
//     type,
    
// ) => {
//     if (type) {
//         addGraphic(view, type, response);
//     } else {
//         const results = response.results;
//         if (results.length > 0) {
//             const graphic = results.filter((result) => {
//                 return (
//                     result.graphic.layer === hospitalLayer ||
//                     result.graphic.layer === fireStationLayer
//                 );
//             })[0];
//             if (graphic) {
//                 if (view.graphics.length === 0) {
//                     addGraphic(view, "start", graphic.graphic.geometry);
//                 } else if (view.graphics.length === 1) {
//                     addGraphic(view, "finish", graphic.graphic.geometry);
//                     getRoute(view, earthquakeM6Layer); // Pass earthquakeM6Layer as barriers
//                 } else {
//                     view.graphics.removeAll();
//                     addGraphic(view, "start", graphic.graphic.geometry);
//                 }
//             }
//         }
//     }
// };
