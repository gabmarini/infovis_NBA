/*fare un metodo per cambiare i colori dei nodi a seconda dello score corrente
mappatura etichette statistiche + orinare statistiche per nome
*/

(function () {

	var stats = {}

	stats.remove = function(){

		
		d3.select("#stat-tree")
		.selectAll('*')
		.remove()


	}

	stats.restyle = function(){
		d3.selectAll('circle')
		.transition()
		.duration(500)
		.style('fill-opacity',0)
		.transition()
		.duration(500)
		.style('fill', function(){
			var color = d3.select(this).style('fill')
			return (color != 'red' && color != 'white') ? config[config.score_type] : color
		})
		.style('fill-opacity', 1)
	}

	stats.draw = function (player_id, player_name) {

		d3.json("http://infovis-nba.herokuapp.com/players/" + player_id, function (data) {

			function d3TransformTree(data) {
				new_data = {}
				new_data.value = player_name
				new_data.children = []
				data.seasons.forEach(function(season){
					stats = []
					season.stats.forEach(function(stat){
						stats.push({'value': Object.keys(stat)[0].replace(/_/g,' ') + ': ' + d3.format('.2f')(stat[Object.keys(stat)[0]]), 'label': Object.keys(stat)[0]})
					})
					new_data.children.push({'value': season.season, 'children': stats})
				})
				return new_data
			}

			data = d3TransformTree(data)
			

			data.children = data.children.sort(function(a,b){
				return d3.ascending(a.value,b.value)
			})

			data.children.forEach(function(c){
				c.children.sort(function(a,b){
					return d3.ascending(a.value,b.value)
				})
			})

			//TODO: sortare anche i figli all'interno della singola stagione

			// Set the dimensions and margins of the tree
			var margin = {
					top: 10,
					right: 15,
					bottom: 10,
					left: 100
				},
				width = 950 - margin.left - margin.right,
				height = 1100 - margin.top - margin.bottom;

			var svg = d3.select("#stat-tree")
				.append("g")
				.attr("transform", "translate(" +
					margin.left*2 + "," + margin.top + ")");

			var i = 0,
				duration = 750,
				root;

			// declares a tree layout and assigns the size
			var treemap = d3.tree().size([height, width]);

			// Assigns parent, children, height, depth
			root = d3.hierarchy(data, function (d) {
				return d.children
			});
			root.x0 = height / 2;
			root.y0 = 0;

			// Collapse after the second level
			root.children.forEach(collapse);

			update(root);

			// Collapse the node and all it's children
			function collapse(d) {
				if (d.children) {
					d._children = d.children
					d._children.forEach(collapse)
					d.children = null
				}
			}

			function update(source) {

				// Assigns the x and y position for the nodes
				var data = treemap(root);

				// Compute the new tree layout.
				var nodes = data.descendants(),
					links = data.descendants().slice(1);

				// Normalize for fixed-depth.
				nodes.forEach(function (d) {
					d.y = d.depth * 180
				});

				// ****************** Nodes section ***************************

				// Update the nodes...
				var node = svg.selectAll('g.node')
					.data(nodes, function (d) {
						return d.id || (d.id = ++i);
					});

				// Enter any new modes at the parent's previous position.
				var nodeEnter = node.enter().append('g')
					.attr('class', 'node')
					.attr("transform", function (d) {
						return "translate(" + source.y0 + "," + source.x0 + ")";
					})
					.on('click', click);

				// Add Circle for the nodes
				nodeEnter.append('circle')
					.attr('class', 'node')
					.attr('r', 1e-6)
					.on('mouseover', function(d){
					})
					.on('mouseout', function(d){
					})
					.style("fill", function (d) {
						return d.data.label == config.actual_stat && config.actual_stat != undefined ? 'red' : (d._children ? config[config.score_type] : "white");
					})
					.classed('leaf', function(d){
						return ((d.children || d._children) && !d.data.label) ? false : true
					});



				// Add labels for the nodes
				nodeEnter.append('text')
					.attr("dy", ".35em")
					.attr("x", function (d) {
						return d.children || d._children ? -13 : 13;
					})
					.attr("text-anchor", function (d) {
						return d.children || d._children ? "end" : "start";
					})
					.style('fill', function(d){
						return d.data.label == config.actual_stat && config.actual_stat != undefined ? 'red' : 'black';
					})
					.text(function (d) {
						return d.data.value
					});


				// UPDATE
				var nodeUpdate = nodeEnter.merge(node);

				// Transition to the proper position for the node
				nodeUpdate.transition()
					.duration(duration)
					.attr("transform", function (d) {
						return "translate(" + d.y + "," + d.x + ")";
					});

				// Update the node attributes and style
				nodeUpdate.select('circle.node')
					.attr('r', 5)
					.style("fill", function (d) {
						return (d.data.label == config.actual_stat && config.actual_stat != undefined) ? 'red' : (d._children ? config[config.score_type] : "white");
					})
					.attr('cursor', 'pointer');


				d3.selectAll('.leaf')
				.on('click', function(d){
					config.actual_stat = d.data.label
					d3.selectAll('.node text')
					.style('fill', function(text){
						return text.data.label == config.actual_stat && config.actual_stat != undefined ? 'red' : 'black'
					})
				})


				// Remove any exiting nodes
				var nodeExit = node.exit().transition()
					.duration(duration)
					.attr("transform", function (d) {
						return "translate(" + source.y + "," + source.x + ")";
					})
					.remove();

				// On exit reduce the node circles size to 0
				nodeExit.select('circle')
					.attr('r', 1e-6);

				// On exit reduce the opacity of text labels
				nodeExit.select('text')
					.style('fill-opacity', 1e-6);

				// ****************** links section ***************************

				// Update the links...
				var link = svg.selectAll('path.link')
					.data(links, function (d) {
						return d.id;
					});

				// Enter any new links at the parent's previous position.
				var linkEnter = link.enter().insert('path', "g")
					.attr("class", "link")
					.attr('d', function (d) {
						var o = {
							x: source.x0,
							y: source.y0
						}
						return diagonal(o, o)
					});

				// UPDATE
				var linkUpdate = linkEnter.merge(link);

				// Transition back to the parent element position
				linkUpdate.transition()
					.duration(duration)
					.attr('d', function (d) {
						return diagonal(d, d.parent)
					});

				// Remove any exiting links
				var linkExit = link.exit().transition()
					.duration(duration)
					.attr('d', function (d) {
						var o = {
							x: source.x,
							y: source.y
						}
						return diagonal(o, o)
					})
					.remove();

				// Store the old positions for transition.
				nodes.forEach(function (d) {
					d.x0 = d.x;
					d.y0 = d.y;
				});

				// Creates a curved (diagonal) path from parent to the child nodes
				function diagonal(s, d) {

					path = `M ${s.y} ${s.x}
			C ${(s.y + d.y) / 2} ${s.x},
			  ${(s.y + d.y) / 2} ${d.x},
			  ${d.y} ${d.x}`

					return path
				}

				// Toggle children on click.
				function click(d) {
					if (d.children) {
						d._children = d.children;
						d.children = null;
					} else {
						d.children = d._children;
						d._children = null;
					}
					update(d);
				}
			}

		})



	}

	this.stats = stats
})();