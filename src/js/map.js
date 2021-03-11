var stationMap = L.map('mapContainer').setView([46.81462157354145, 8.578648004175719], 8);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(stationMap);

L.Map.prototype.panToOffset = function (latlng, offset) {
    var x = this.latLngToContainerPoint(latlng).x - offset[0]
    var y = this.latLngToContainerPoint(latlng).y - offset[1]
    var point = this.containerPointToLatLng([x, y])
    return this.panTo(point)
}

var highlightIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var defaultIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
var selectedMarker = null;
var markers = []

function drawStationsToMap(stations) {
    for (let marker of markers) {
        stationMap.removeLayer(marker);
    }
    markers = []
    for (let station of stations) {
        const marker = L.marker([station.lat, station.lon]).addTo(stationMap).setIcon(defaultIcon);
        marker.on('click', function (e) {
            if (selectedMarker) {
                selectedMarker.setIcon(defaultIcon)
            }
            selectedMarker = marker;
            marker.setIcon(highlightIcon);
            stationMap.panToOffset(marker.getLatLng(), [0, -250]);
            sharedmobility_status.current_station = station.station_id
            var dateRange = get_date_range();
            document.getElementById("stationName").innerHTML = station.station_name
            get_station_data(sharedmobility_status.current_station, dateRange.from_date, dateRange.to_date).then(station_data => {
                setTimeplotVisible(true);
                drawChart(station_data);
            })
        });
        markers.push(marker);
    }
    var group = new L.featureGroup(markers);
    stationMap.fitBounds(group.getBounds().pad(0.03));
}