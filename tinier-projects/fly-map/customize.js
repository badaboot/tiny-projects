// Create root and chart
const root = am5.Root.new("chartdiv");

// Set themes
root.setThemes([am5themes_Animated.new(root)]);

const chart = root.container.children.push(
    am5map.MapChart.new(root, {
        projection: am5map.geoNaturalEarth1(),
    })
);

// Create polygon series
const polygonSeries = chart.series.push(
    am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_region_world_asiaLow,
        // include: ["CN", "JP", "MX"]
    })
);

// GeoJSON data
const cities = {
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
        {
            type: "Feature",
            properties: { name: "Shanghai" },
            geometry: { type: "Point", coordinates: [121.4737, 31.2304] },
        },
        {
            type: "Feature",
            properties: { name: "Shenzhen" },
            geometry: { type: "Point", coordinates: [114.0596, 22.5429] },
        },
        {
            type: "Feature",
            properties: { name: "Taiwan" },
            geometry: { type: "Point", coordinates: [120.9605, 23.6978] },
        },
        {
            type: "Feature",
            properties: { name: "Qingdao" },
            geometry: { type: "Point", coordinates: [120.3830, 36.0662] },
        },
        {
            type: "Feature",
            properties: { name: "Nepal" },
            geometry: { type: "Point", coordinates: [84.1240, 28.3949] },
        },
        {
            type: "Feature",
            properties: { name: "Busan" },
            geometry: { type: "Point", coordinates: [129.0714, 35.1731] },
        },
    ],
};

// Create point series
const pointSeries = chart.series.push(
    am5map.MapPointSeries.new(root, {
        geoJSON: cities,
        polygonIdField: "country"
    })
);

pointSeries.bullets.push(function () {
    // show city name
    return am5.Bullet.new(root, {
        sprite: am5.Label.new(root, {
            centerX: am5.p50,
            centerY: am5.p50,
            text: "{name}",
            populateText: true
        })
    });
});
// orange circle
pointSeries.bullets.push(function () {
    return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
            radius: 5,
            fill: am5.color(0xffba00),
        }),
    });
});