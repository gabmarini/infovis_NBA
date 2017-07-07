(function(){

	var colleges = {}

	colleges.draw = function(state, score_type){
		d3.json("http://infovis-nba.herokuapp.com/colleges/" + state, function(data){
			config.actual_state = state
			college = data.sort(function(a,b){
				return d3.ascending(a[score_type],b[score_type])
			})
		var svg = d3.select("#bar-state"),
			margin = {top: 15, right: 15, bottom: 15, left: 300},
			width = 950 - margin.right - margin.left,
			height = 600 - margin.top - margin.bottom;		    
		
		var x = d3.scaleLinear().range([0, width]);
		var y = d3.scaleBand().range([height, 0]);

		svg.selectAll("*").remove();

		var g = svg.append("g") 
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		x.domain([0, d3.max(college, function(d) { return d[score_type]; })]);
    	y.domain(college.map(function(d) { return d.name; })).padding(0.2);

    	g.append("g")
        .attr("class", "x axis")
       	.attr("transform", "translate(0," + height + ")")
      	.call(d3.axisBottom(x).ticks(5).tickFormat(function(d) { return parseInt(d); }).tickSizeInner([-height]));

      	g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

        g.selectAll(".bar")
        .data(college)
      	.enter()
      	.append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(d.name); })
        .style('fill', config[score_type])
        .transition()
        .duration(3000)
        .attr("width", function(d) { return x(d[score_type]); })

		g.selectAll('.label')
		.data(college)
		.enter()
		.append('text')
		.text(function(d){ 
			var text = d3.format(".2f")(d[score_type]) == 0.00 ? '' : d3.format(".2f")(d[score_type])
			return text
		})
		.attr('y', function(d,i){ 
			return y(d.name) + margin.top + d3.select('rect').node().getBBox().height/2 - 8; 
		})
		.transition()
		.duration(3000)
		.attr('x', function(d) {
			var pos = x(d[score_type]) - d3.select(this).node().getBBox().width - 5
			if (pos <= 1){
				d3.select(this).text('')
			}
			return pos; 
		})
		.style('fill', '#FFFFFF')

        })


	}


	/*
	uStates.draw = function(id, data, toolTip){		

		function mouseOver(d){
			d3.select("#tooltip").transition().duration(200).style("opacity", .9);      
			
			d3.select("#tooltip").html(toolTip(d.n, data[d.id]))  
				.style("left", (d3.event.pageX) + "px")     
				.style("top", (d3.event.pageY - 28) + "px");
		}
		
		function mouseOut(){
			d3.select("#tooltip").transition().duration(500).style("opacity", 0);      
		}
		
		d3.select(id).selectAll(".state")
			.data(uStatePaths).enter().append("path").attr("class","state").attr("d",function(d){ return d.d;})
			.style('fill','white')
			.on("mouseover", mouseOver).on("mouseout", mouseOut)
			.transition()
			.duration(5000)
			.style("fill",function(d){ 
				var score = 0
				try{
					score = data[d.id].att_score
				} catch(err) {
					score = 0
				}
				return colorize(minScore(data,'att_score'), maxScore(data,'att_score'), score); 
			});
		
	}*/
	this.colleges=colleges;
})();