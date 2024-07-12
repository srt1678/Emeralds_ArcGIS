import Graphic from "@arcgis/core/Graphic.js";
import RouteParameters from "@arcgis/core/rest/support/RouteParameters.js";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet.js";
import * as route from "@arcgis/core/rest/route.js";

const routeSymbol = {
    type: "simple-line",
    color: [5, 150, 255],
    width: 3,
};

function addGraphic(view, type, point) {
    let color = "#ffffff";
    let outlineColor = "#000000";
    let size = "12px";
    if (type === "start") {
        color = "#ffffff";
    } else if (type === "stop") {
        color = "#000000";
        outlineColor = "#ffffff";
        size = "8px";
    } else {
        color = "#000000";
        outlineColor = "#ffffff";
    }
    const graphic = new Graphic({
        symbol: {
            type: "simple-marker",
            color: color,
            size: size,
            outline: {
                color: outlineColor,
                width: "1px",
            },
        },
        geometry: point,
    });
    view.graphics.add(graphic);
}

function getRoute(view) {
    const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

    const routeParams = new RouteParameters({
        stops: new FeatureSet({
            features: view.graphics.toArray(),
        }),
    });

    route.solve(routeUrl, routeParams)
        .then((data) => {
            if (data.routeResults.length > 0) {
                showRoute(view, data.routeResults[0].route);
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

function showRoute(view, routeResult) {
    routeResult.symbol = routeSymbol;
    view.graphics.add(routeResult, 0);
}

export { addGraphic, getRoute };
