var svg;
var Width = 700;
var Height = 1000;
var projection;

function display() {

	var UKMapPromise = new Promise((resolve, reject) => {
		d3.json("https://raw.githubusercontent.com/martinjc/UK-GeoJSON/master/json/administrative/gb/lad.json", (data) => {
			resolve(data);
		});
	});

	var NIMapPromise = new Promise((resolve, reject) => {
		d3.json("https://raw.githubusercontent.com/martinjc/UK-GeoJSON/master/json/administrative/ni/lgd.json", (data) => {
			resolve(data);
		});
	});

	Promise.all([UKMapPromise, NIMapPromise])
		.then(([ukData, niData]) => {
			console.log("UK Map Data:", ukData);
			console.log("NI Map Data:", niData);
			d3MapUK(ukData);
			d3MapNI(niData);
		})
		.catch((error) => {
			console.error("An error occurred:", error);
		});
}

function d3MapUK(data) {

	if ((typeof svg == 'undefined')) {
		svg = d3.select("body").append("svg")
			.attr("width", Width)
			.attr("height", Height);
	} else {

	}

	svg.append("g")
		.selectAll("path")
		.data(data.features)
		.enter()
		.append("path")
		.attr("fill", "lightgrey")
		.attr("d", d3.geoPath().projection(projection));
}



function d3MapNI(data) {


	if ((typeof svg == 'undefined')) {
		svg = d3.select("body").append("svg")
			.attr("width", Width)
			.attr("height", Height);
	} else {

	}

	svg.append("g")
		.selectAll("path")
		.data(data.features)
		.enter()
		.append("path")
		.attr("fill", "lightgrey")
		.attr("d", d3.geoPath().projection(projection));
}

function d3Draw(dataset) {
	if (typeof svg === 'undefined') {
		svg = d3.select("body").append("svg")
			.attr("width", Width)
			.attr("height", Height);
	} else {
		svg.selectAll("circle").remove();
	}

	var circle = svg.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attr("id", function (d) {
			return "circle-" + d.Town;
		})
		.transition()
		.duration(5)
		.ease(d3.easeLinear)
		.attr("fill", "brown");

	circle.attr("cx", function (d) {
		return projection([d.lng, d.lat])[0];
	})
		.attr("cy", function (d) {
			return projection([d.lng, d.lat])[1];
		})
		.attr("r", function (d) {
			return d.Population / 22000;
		});
}


function updateData(url) {
	d3.json(url, function (error, data) {
		if (error) {
			console.log("error!!");
		} else {
			d3Draw(data);
		}
	});
}


function loadData() {

	projection = d3.geoMercator()
		.center([0, 54])
		.scale(2000)
		.translate([Width / 2, Height / 2]);


	document.getElementById("townSlider").addEventListener("input", function () {
		const selectedValue = this.value;
		document.getElementById("sliderValue").textContent = "Towns: " + selectedValue;
	});

	document.getElementById("goButton").addEventListener("click", function () {
		const selectedValue = document.getElementById("townSlider").value;
		var dataUrl = "http://34.38.72.236/Circles/Towns/" + selectedValue;
		updateData(dataUrl);
	});

	
		
			

	d3.json("http://34.38.72.236/Circles/Towns/50", function (error, data) {
		if (error) {
			console.write("error!!");
		} else {
			display();
			setTimeout(function () {
				d3Draw(data);
			}, 2000);
		}
	}
	);
}

window.onload = loadData();