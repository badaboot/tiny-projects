// Create root and chart
const root = am5.Root.new("chartdiv");

// Set themes
root.setThemes([am5themes_Animated.new(root)]);

const chart = root.container.children.push(
    am5map.MapChart.new(root, {
        projection: am5map.geoNaturalEarth1(),
    })
);

// Create polygon series for the world map
const polygonSeries = chart.series.push(
    am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
    })
);

// Define cities with their coordinates
const cities = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: { name: "New York" },
            geometry: { type: "Point", coordinates: [-74.0060, 40.7128] }
        },
        {
            type: "Feature",
            properties: { name: "London" },
            geometry: { type: "Point", coordinates: [-0.1278, 51.5074] }
        },
        {
            type: "Feature",
            properties: { name: "Tokyo" },
            geometry: { type: "Point", coordinates: [139.6917, 35.6895] }
        },
        {
            type: "Feature",
            properties: { name: "Sydney" },
            geometry: { type: "Point", coordinates: [151.2093, -33.8688] }
        },
        {
            type: "Feature",
            properties: { name: "Paris" },
            geometry: { type: "Point", coordinates: [2.3522, 48.8566] }
        }
    ]
};

// Create point series for cities
const pointSeries = chart.series.push(
    am5map.MapPointSeries.new(root, {
        geoJSON: cities,
    })
);

// Add city markers
pointSeries.bullets.push(function() {
    return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
            radius: 5,
            fill: am5.color(0xff0000),
        })
    });
});

// Add city labels
pointSeries.bullets.push(function() {
    return am5.Bullet.new(root, {
        sprite: am5.Label.new(root, {
            text: "{name}",
            centerY: am5.p50,
            centerX: am5.p50,
            populateText: true,
            background: am5.Rectangle.new(root, {
                fill: am5.color(0xffffff),
                fillOpacity: 0.7
            })
        })
    });
});

// Get DOM elements
const plane = document.querySelector('.plane');
const message = document.querySelector('.message');

// Initial plane position (center of the map)
let planePosition = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
};

// Update plane position
function updatePlanePosition() {
    plane.style.left = planePosition.x + 'px';
    plane.style.top = planePosition.y + 'px';
}

// Check if plane is near a city
function checkCityProximity() {
    const planeRect = plane.getBoundingClientRect();
    const planeCenter = {
        x: planeRect.left + planeRect.width / 2,
        y: planeRect.top + planeRect.height / 2
    };

    let closestCity = null;
    let minDistance = Infinity;

    cities.features.forEach(city => {
        const cityPoint = chart.convert({
            longitude: city.geometry.coordinates[0],
            latitude: city.geometry.coordinates[1]  
        }
        );
console.log(cityPoint, planeCenter)
        if (cityPoint) {
            const distance = Math.sqrt(
                Math.pow(cityPoint.x - planeCenter.x, 2) + 
                Math.pow(cityPoint.y - planeCenter.y, 2)
            );

            if (distance < 50) { // 50px threshold for proximity
                if (distance < minDistance) {
                    minDistance = distance;
                    closestCity = city;
                }
            }
        }
    });

    if (closestCity) {
        message.style.display = 'block';
        message.style.left = (planeCenter.x + 20) + 'px';
        message.style.top = (planeCenter.y - 20) + 'px';
    } else {
        message.style.display = 'none';
    }
}

// Handle keyboard controls
document.addEventListener('keydown', (e) => {
    const step = 10;
    let rotation = 0;

    switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
            planePosition.y -= step;
            rotation = -90;
            break;
        case 's':
        case 'arrowdown':
            planePosition.y += step;
            rotation = 90;
            break;
        case 'a':
        case 'arrowleft':
            planePosition.x -= step;
            rotation = 180;
            break;
        case 'd':
        case 'arrowright':
            planePosition.x += step;
            rotation = 0;
            break;
    }

    // Update plane position and rotation
    updatePlanePosition();
    plane.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

    // Check if plane is near a city
    checkCityProximity();
});

// Initial position
updatePlanePosition(); 