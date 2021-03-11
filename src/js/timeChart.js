const marginLeft = 30;
const marginTop = 10;
const marginRight = 30;
const marginBottom = 20;

const start_of_records = 1613559600;

var svg = d3.select("#chartContainer").append("svg").attr("height", "calc(100% - 70px)").attr("width", "100%").attr("id", "chartSVG");

function get_date_range() {
    var date_range = {
        from_date: null,
        to_date: null
    }
    var selectedBtns = document.getElementsByClassName("btn-radio active")
    if (selectedBtns.length == 1) {
        var selectedBtn = selectedBtns.item(0);
        date_range.to_date = Math.floor(Date.now() / 1000);
        if (selectedBtn.value != 'max') {
            date_range.from_date = date_range.to_date - selectedBtn.value;
        }
    }
    return date_range;
}

function drawChart(data) {
    // Remove the current chart
    svg.selectAll("*").remove();
    // Determine size of svg element
    var chartWidth = document.getElementById("chartSVG").clientWidth;
    var chartHeight = document.getElementById("chartSVG").clientHeight;
    var selectedDateRange = get_date_range()
    var maxBikes = Math.max.apply(Math, data.map(o => o.num_bikes_available))
    var reportDates = data.map(o => o.last_reported)
    var minDate = new Date(Math.min.apply(Math, reportDates))
    if (data.length == 1) {
        if (selectedDateRange.from_date && data[0].last_reported < selectedDateRange.from_date) {
            data[0].last_reported = selectedDateRange.from_date;
        }
        const endPoint = JSON.parse(JSON.stringify(data[0]));
        endPoint.last_reported = selectedDateRange.to_date;
        data.push(endPoint);
    }
    // If the oldest record is older than the from filter move it to the from date.
    if(selectedDateRange.from_date && data.length > 0 && data[0].last_reported < selectedDateRange.from_date) {
        data[0].last_reported = selectedDateRange.from_date;
    }
    // In case we selected max we set the minimum date as from
    if(!selectedDateRange.from_date) {
        selectedDateRange.from_date = minDate;
    }
    // If the newest record time is before the to date filter the last entry is still valid now
    if(data[data.length - 1].last_reported<selectedDateRange.to_date) {
        const endPoint = JSON.parse(JSON.stringify(data[data.length - 1]));
        endPoint.last_reported = selectedDateRange.to_date;
        data.push(endPoint);
    }
    
    timeScale = d3.scaleTime()
        .domain([selectedDateRange.from_date * 1000, selectedDateRange.to_date * 1000])
        .range([marginLeft, chartWidth - marginRight]);
    bikeScale = d3.scaleLinear().domain([maxBikes, 0]).range([marginTop, chartHeight - marginBottom])

    var line = d3.line()
        .x(function (d) {
            return timeScale(new Date(d.last_reported * 1000));
        })
        .y(function (d) {
            return bikeScale(d.num_bikes_available);
        })
        .curve(d3.curveStepAfter);

    var group = svg.append("g")

    // Bottom axis
    var bottomAxis;
    if (selectedDateRange.to_date - selectedDateRange.from_date == 0) {
        bottomAxis = d3.axisBottom(timeScale).ticks(10).tickFormat(d3.timeFormat("%a %d.%m"))
    } else if (selectedDateRange.to_date - selectedDateRange.from_date <= 86400) {
        bottomAxis = d3.axisBottom(timeScale).ticks(d3.timeHour.every(2)).tickFormat(d3.timeFormat("%H:%M"))
    } else if (selectedDateRange.to_date - selectedDateRange.from_date <= 604800) {
        bottomAxis = d3.axisBottom(timeScale).ticks(d3.timeDay.every(1)).tickFormat(d3.timeFormat("%a %d.%m"))
    } else {
        bottomAxis = d3.axisBottom(timeScale).ticks(10).tickFormat(d3.timeFormat("%a %d.%m.%Y"))
    }
    svg.append("g")
        .attr("transform", "translate(0," + (chartHeight - marginBottom) + ")")
        .call(bottomAxis);

    //Left axis
    svg.append("g")
        .attr("transform", "translate(" + marginLeft + ",0)")
        .call(d3.axisLeft(bikeScale).ticks(maxBikes));

    // vertical lines
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + (chartHeight - marginBottom) + ")")
        .call(bottomAxis
            .tickFormat("")
            .tickSize(-(chartHeight - marginBottom - marginTop))
        )
    // Line
    group.append("path")
        .style("fill", "none")
        .style("stroke", "#0f52ba")
        .style("stroke-width", "2px")
        .attr("d", function (d, i) {
            return line(data);
        });
}