(function () {

	var players = {}

	players.draw = function (college, score_type) {
		d3.json("http://infovis-nba.herokuapp.com/players/college/" + college, function (data) {
			player = data.sort(function (a, b) {
				return d3.ascending(a[score_type], b[score_type])
			})

			config.actual_college = college

			var svg = d3.select("#bar-college"),
				margin = {
					top: 15,
					right: 15,
					bottom: 15,
					left: 130
				},
				width = 950 - margin.right - margin.left,
				height = 20 * player.length + 20 - margin.top - margin.bottom;
			height = player.length <= 3 ? 30 * player.length : height

			d3.select('#bar-college').attr('viewBox', "0 0 950 " + (height + margin.top + margin.bottom))

			var x = d3.scaleLinear().range([0, width]);
			var y = d3.scaleBand().range([height, 0]);

			svg.selectAll("*").remove();

			svg.append('text')
				.text(college + ', ' + config.actual_state)
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var g = svg.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			x.domain([0, d3.max(player, function (d) {
				return d[score_type];
			})]);
			y.domain(player.map(function (d) {
				return d.name;
			})).padding(0.1);

			g.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x).ticks(5).tickFormat(function (d) {
					return parseInt(d);
				}).tickSizeInner([-height]));

			g.append("g")
				.attr("class", "y axis")
				.call(d3.axisLeft(y));

			d3.selectAll("#bar-college g .y .tick text").classed('player', true).on('click', function () {

			})

			g.selectAll(".bar")
				.data(player)
				.enter()
				.append("rect")
				.attr("class", "bar")
				.attr('data-player', function (d) {
					return d.player_id
				})
				.attr("x", 0)
				.attr("height", y.bandwidth())
				.attr("y", function (d) {
					return y(d.name);
				})
				.on('click', function (d) {
					stats.draw(d.player_id)
				})
				.style('fill', config[score_type])
				.transition()
				.duration(1500)
				.attr("width", function (d) {
					return x(d[score_type]);
				})

			g.selectAll('.label')
				.data(player)
				.enter()
				.append('text')
				.text(function (d) {
					var text = d3.format(".2f")(d[score_type]) == 0.00 ? '' : d3.format(".2f")(d[score_type])
					return text
				})
				.attr('y', function (d, i) {
					return y(d.name) + margin.top + y.bandwidth() / 2 - 9; //prendere la rect dei player e non la rect dei college
				})
				.transition()
				.duration(1500)
				.attr('x', function (d) {
					var pos = x(d[score_type]) - d3.select(this).node().getBBox().width - 5
					if (pos <= 1) {
						d3.select(this).text('')
					}
					return pos;
				})
				.style('fill', '#FFFFFF')
		})
	}


	players.remove = function () {

		d3.select('#bar-college')
			.transition()
			.duration(1000)
			.style('opacity', 0)
			.on('end', function () {
				d3.select('#bar-college').selectAll('*').remove()
				d3.select('#bar-college').style('opacity', 1)
				config.actual_college = undefined
			})
	}

	this.players = players;
})();