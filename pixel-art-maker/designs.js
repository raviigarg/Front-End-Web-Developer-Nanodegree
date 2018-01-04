// Select size input

let rows =  $("#input_height");
let	cols = 	$("#input_width");

let table = document.getElementById("pixel_canvas");

// When size is submitted by the user, call makeGrid()

function makeGrid() {
	table.innerHTML = "";
	let r = rows.val();
	let c = cols.val();

	for (let i=0; i<r; i++) {
		let row = document.createElement("tr");
		for(let t=0; t<c; t++) {
		let cell = document.createElement("td");
		row.appendChild(cell);
		}
		table.appendChild(row);
	}
}
	
//after grid construction, fill selected pixel to selected color

function addColor() {
	// Select color input
	let color = $("#colorPicker").val();
	$(this).css("background-color", color);
	}

// Your code goes here!

$("input[type=submit]").click(function(evt) {
	evt.preventDefault();
	makeGrid();
	});

$("#pixel_canvas").on("click", "td", addColor);