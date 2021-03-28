async function get_available_stations(provider_id) {
    return new Promise(function (resolve, reject) {
        var url = "https://europe-west6-sharedmobility.cloudfunctions.net/get_station_information?provider_id="+encodeURIComponent(provider_id)
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(JSON.parse(xmlhttp.response));
            } else {
                reject({
                    status: this.status,
                    statusText: xmlhttp.statusText
                });
            }
        };
        xmlhttp.onerror = function () {
            reject({
                status: this.status,
                statusText: xmlhttp.statusText
            });
        };
        xmlhttp.send();
    })
}

async function get_station_data(station_id,from_date,to_date) {
    return new Promise(function (resolve, reject) {
        var url = "https://europe-west6-sharedmobility.cloudfunctions.net/station_status/";

        var requestUrl = url+encodeURIComponent(station_id);
        if(from_date || to_date) {
            requestUrl += "?";
            if(from_date) {
                requestUrl += "from_date="+from_date;
            }
            if(from_date && to_date) {
                requestUrl+="&";
            }
            if(to_date) {
                requestUrl += "to_date="+to_date;
            }
        }
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", requestUrl, true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(JSON.parse(xmlhttp.response));
            } else {
                reject({
                    status: this.status,
                    statusText: xmlhttp.statusText
                });
            }
        };
        xmlhttp.onerror = function () {
            reject({
                status: this.status,
                statusText: xmlhttp.statusText
            });
        };
        xmlhttp.send();
    })
}

async function get_available_providers() {
    return new Promise(function (resolve, reject) {
        var url = "https://europe-west6-sharedmobility.cloudfunctions.net/get_provider";

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(JSON.parse(xmlhttp.response));
            } else {
                reject({
                    status: this.status,
                    statusText: xmlhttp.statusText
                });
            }
        };
        xmlhttp.onerror = function () {
            reject({
                status: this.status,
                statusText: xmlhttp.statusText
            });
        };
        xmlhttp.send();
    })
}