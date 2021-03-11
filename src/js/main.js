var sharedmobility_status = {
    current_station: null
}

var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for (i = L; i >= 0; i--) {
        selectElement.remove(i);
    }
}

async function init() {
    //let data = await get_station_data("publiebike:111")
    let available_providers = await get_available_providers();
    available_providers = available_providers.data.providers;
    let provider_info = {};
    for (provider of available_providers) {
      provider_info[provider.provider_id] = provider;
    }
    let data = await get_available_stations()
    data.sort(function(a, b) {
        var nameA = provider_info[a.provider_id].name;
        var nameB = provider_info[b.provider_id].name;
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    let groupByProvider = groupBy(data, 'provider_id')

    var selectProvider = document.getElementById('selectProvider');
    // Add Select Provider info
    var option = document.createElement("option");
    option.text = "Anbieter auswählen...";
    option.value = "null";
    option.setAttribute("disabled","disabled");
    option.setAttribute("selected","selected");
    selectProvider.add(option);
    for (const [provider_id, stations] of Object.entries(groupByProvider)) {
        var option = document.createElement("option");
        option.text = provider_info[provider_id].name +" ("+provider_info[provider_id].vehicle_type+")";
        option.value = provider_id;
        selectProvider.add(option);
    }

    document.getElementById('selectProvider').addEventListener('change', event => {
      drawStationsToMap(groupByProvider[event.target.value]);
      setTimeplotVisible(false);
  })
}

init()