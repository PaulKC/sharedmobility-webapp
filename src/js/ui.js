function setTimeplotVisible(visible) {
    if (visible) {
        document.getElementById("mapContainer").classList.add("hidden")
        document.getElementById("chartContainer").classList.add("shown")
    } else {
        document.getElementById("mapContainer").classList.remove("hidden")
        document.getElementById("chartContainer").classList.remove("shown")
    }
}

function addUiHandlers() {
    var radioBtns = document.getElementsByClassName("btn-radio")
    for (var i = 0; i < radioBtns.length; i++) {
        radioBtns.item(i).addEventListener('click', e => {
            for (var j = 0; j < radioBtns.length; j++) {
                radioBtns.item(j).classList.remove('active');
            }
            e.target.classList.add('active')
            var dateRange = get_date_range();
            get_station_data(sharedmobility_status.current_station, dateRange.from_date, dateRange.to_date).then(station_data => {
                drawChart(station_data);
            })
        });
    }

    document.getElementById("btnClose").addEventListener('click', e => {
        setTimeplotVisible(false);
    })
}
window.onload = function () {
    addUiHandlers();
};