// Create root and chart
var root = am5.Root.new("chartdiv");

// Set themes
root.setThemes([am5themes_Animated.new(root)]);

var chart = root.container.children.push(
    am5map.MapChart.new(root, {
        projection: am5map.geoNaturalEarth1(),
    })
);

// Create polygon series
var polygonSeries = chart.series.push(
    am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_region_world_asiaLow,
    })
);

// Set themes
root.setThemes([am5themes_Animated.new(root)]);

// GeoJSON data
var cities = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: { name: "Beijing " },
            geometry: { type: "Point", coordinates: [116.597504, 40.072498] },
        },
        {
            type: "Feature",
            properties: { name: "Seoul" },
            geometry: { type: "Point", coordinates: [126.9828, 37.5139] },
        },
        {
            type: "Feature",
            properties: { name: "Tokyo" },
            geometry: { type: "Point", coordinates: [139.6823, 35.6785] },
        },
    ],
};

// Create point series
var pointSeries = chart.series.push(
    am5map.MapPointSeries.new(root, {
        geoJSON: cities,
    })
);

pointSeries.bullets.push(function () {
    let circle = am5.Circle.new(root, {
        radius: 5,
        fill: am5.color(0xff0000),
        tooltipText: "{name}",
    });

    circle.events.on("click", function (ev) {
        console.log(ev.target.dataItem);
    });

    return am5.Bullet.new(root, {
        sprite: circle,
    });
});
pointSeries.bullets.push(function () {
    return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
            radius: 5,
            fill: am5.color(0xffba00),
        }),
    });
});