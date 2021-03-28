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
  let available_providers = await get_available_providers();
  available_providers = available_providers.data.providers;
  available_providers.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  var selectProvider = document.getElementById('selectProvider');
  // Add Select Provider info
  var option = document.createElement("option");
  option.text = "Anbieter auswählen...";
  option.value = "null";
  option.setAttribute("disabled", "disabled");
  option.setAttribute("selected", "selected");
  selectProvider.add(option);

  for (provider of available_providers) {
    var option = document.createElement("option");
    option.text = provider.name + " (" + provider.vehicle_type + ")";
    option.value = provider.provider_id;
    selectProvider.add(option);
  }

  document.getElementById('selectProvider').addEventListener('change', event => {
    get_available_stations(event.target.value).then(stations => {
      drawStationsToMap(stations);
    });
    setTimeplotVisible(false);
  })
}

init()