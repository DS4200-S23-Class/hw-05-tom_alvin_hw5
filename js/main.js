const FRAME_HEIGHT = 550;
const FRAME_WIDTH = 550; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

const FRAME1 = d3.select("#vis-1") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 


function build_scatter_plot() {
	d3.csv("data/scatter-data.csv").then((data) => {

    // Build plot inside of .then 
    // find max X
    const MAX_X = d3.max(data, (d) => { return parseInt(d.x); });

    const MAX_Y = d3.max(data, (d) => { return parseInt(d.y); });
    
    // Define scale functions that maps our data values 
    // (domain) to pixel values (range)
    const X_SCALE = d3.scaleLinear() 
                      .domain([0, 10]) // add some padding  
                      .range([0, VIS_WIDTH]);

    // Define scale functions that maps our data values 
    // (domain) to pixel values (range)
    const Y_SCALE = d3.scaleLinear() 
                      .domain([0, 10]) // add some padding  
                      .range([VIS_HEIGHT,0]);  

    // Use X_SCALE to plot our points
    const circles = FRAME1.selectAll("points")  
        .data(data) // passed from .then  
        .enter()       
        .append("circle")  
          .attr("cx", (d) => { return (X_SCALE(d.x) + MARGINS.left); }) 
          .attr("cy", (d) => { return (Y_SCALE(d.y) + MARGINS.top); }) 
          .attr("r", 10)
          .attr("class", "point")
          .attr("fill", "purple");


    // adds borders to circle when a circle is clicked
    function borders() {
    	d3.select(this).classed("selected", !d3.select(this).classed("selected"));

    	if(d3.select(this).classed("selected")) {
    		d3.select(this)
			    .attr("stroke-width",  "4")
			    .attr("stroke", "red");
    	}

    	else {
    		d3.select(this)
			    .attr("stroke-width",  "0")
			    .attr("stroke", "none");
    	}

    	// also calls add_coordinates function when clicked
    	add_coordinates(this)
	}

	// changes color to orange when the mouse is hovering over the circle
	function mouseOver() {
    	d3.select(this).attr("fill", "orange");
	}

	// changes color to purple when the mouse is not hovering over the circle
	function mouseOut() {
    	d3.select(this).attr("fill", "purple");
	}

	// adds circle to the svg
	function add_circle() {

		// Input numbers
		let x = document.getElementById("xCoordinate").value;
		let y = document.getElementById("yCoordinate").value;

		console.log(x);
		console.log(y);


		// Create SVG circle element
		FRAME1.append("circle")  
	          .attr("cx", (d) => { return (X_SCALE(x) + MARGINS.left); }) 
	          .attr("cy", (d) => { return (Y_SCALE(y) + MARGINS.top); }) 
	          .attr("r", 10)
	          .attr("class", "point")
	          .attr("fill", "purple")
	          .on("click", borders)
  			  .on("mouseover", mouseOver)
  		      .on("mouseout", mouseOut);
	}

	// gets coordinates for the label
	function add_coordinates(circle){
		let x = Math.round(X_SCALE.invert(d3.select(circle).attr('cx') - MARGINS.left));
		let y = Math.round(Y_SCALE.invert(d3.select(circle).attr('cy') - MARGINS.top));



		let coordinate = `(${x}, ${y})`;
		document.getElementById("lastClicked").innerHTML = coordinate;
		console.log(x);
		console.log(y);
	}

	// adds event listener so that when the add point button is clicked, a point is added
	document.getElementById("addPoint")
			.addEventListener('click', add_circle);


	// adds border, mousover, and mouseout functionality		
	FRAME1.selectAll("circle")
  		.on("click", borders)
  		.on("mouseover", mouseOver)
  		.on("mouseout", mouseOut);


  	// adds x axis labels
    FRAME1.append("g") 
          .attr("transform", "translate(" + MARGINS.left + 
                "," + (VIS_HEIGHT + MARGINS.top) + ")") 
          .call(d3.axisBottom(X_SCALE).ticks(10)) 
            .attr("font-size", '20px');

    // adds y axis labels
    FRAME1.append("g") 
          .attr("transform", "translate(" + MARGINS.left + 
                "," + MARGINS.top + ")")
          .call(d3.axisLeft(Y_SCALE).ticks(10)) 
            .attr("font-size", '20px');  

    });
}

build_scatter_plot();




