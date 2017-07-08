(function(){

	var colleges = {}

	colleges.draw = function(state_name,state, score_type){
		d3.json("http://infovis-nba.herokuapp.com/colleges/" + state, function(data){
			college = data.sort(function(a,b){
				return d3.ascending(a[score_type],b[score_type])
			})
			config.actual_state = state

			var svg = d3.select("#bar-state"),
				margin = {top: 15, right: 15, bottom: 15, left: 300},
				width = 950 - margin.right - margin.left,
				height = 600 - margin.top - margin.bottom;		    
			
			var x = d3.scaleLinear().range([0, width]);
			var y = d3.scaleBand().range([height, 0]);

			svg.selectAll("*").remove();

			svg.append('text')
			.text(state_name)
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			config.state_name = state_name

			var g = svg.append("g") 
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			x.domain([0, d3.max(college, function(d) { return d[score_type]; })]);
	    	y.domain(college.map(function(d) { return d.name; })).padding(0.1);

	    	g.append("g")
	        .attr("class", "x axis")
	       	.attr("transform", "translate(0," + height + ")")
	      	.call(d3.axisBottom(x).ticks(5).tickFormat(function(d) { return parseInt(d); }).tickSizeInner([-height]));

	      	g.append("g")
	        .attr("class", "y axis")
	        .call(d3.axisLeft(y));

	        d3.selectAll('#bar-state g .y .tick text').classed('university', true)

	        d3.selectAll('.university')
	        .attr('fill', function(d){
	        	return d3.select(this).text() == config.actual_college ? 'red' : 'black'
	        })
	      

	        g.selectAll(".bar")
	        .data(college)
	      	.enter()
	      	.append("rect")
	      	.on('click', function(d){
	      		d3.selectAll(".university").attr('fill','black')
	      		d3.selectAll('.university').filter(function(uni){
	      			return uni == d.name
	      		}).attr('fill', 'red').classed('uni-selected', true)
	      		players.draw(d.name, score_type) //TODO: aggiungere un remove e redraw per rendere tutto più fluido

	      	})
	        .attr("class", "bar")
	        .attr("x", 0)
	        .attr("height", y.bandwidth())
	        .attr("y", function(d) { return y(d.name); })
	        .style('fill', config[score_type])
	        .transition()
	        .duration(1500)
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
				return y(d.name) + margin.top + y.bandwidth()/2 - 8; 
			})
			.transition()
			.duration(1500)
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

	this.colleges=colleges;
})();