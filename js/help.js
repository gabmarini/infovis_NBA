
(function(){

	var help = {}

	var keyCodes = [49, 50, 51, 52, 53, 54, 55, 56]

	help.activatePlayerSelector = function(){
		d3.select('#name-query').on('input', function(){
			if(this.value.length >= 3){
				var selector = d3.select('#player-selection')
				selector.selectAll('*').remove()
				d3.json('http://infovis-nba.herokuapp.com/players/list/' + this.value, function(data){
					data.forEach(function(d){
						selector.append('option').text(function(){
							return d.name
						})
					})
					d3.selectAll('#player-selection')
					.on('click',function(){
						d3.select('#name-query').node().value = this.value
					})
					.on('change', function(){
						d3.select('#name-query').node().value = this.value
					})
				})
			}
		})

	}

	help.setCategory = function(){

		var panel = d3.select('.actual-category')

		panel.text(function(){
			return d3.select('.visualized').text()
		})

		d3.select('.current-category')
		.transition()
		.duration(500)
		.style('top','0%')
		.transition()
		.delay(3000)
		.duration(500)
		.style('top','-10%')


		
	}

	help.changeCategory = function(){

		var catNum = keyCodes.indexOf(config.last_pressed)

		d3.selectAll('.category-list li').classed('visualized', false)
		d3.select('.category-list li:nth-child(' + (catNum+1) +')').classed('visualized', true)
		this.setCategory()

	}

	  

	help.setClickHandler = function() {
		d3.select('#search-button').on('click', function(){


			d3.select('.no-college').remove()

			var name = d3.select('#name-query').node().value


			d3.json('http://infovis-nba.herokuapp.com/players/name/' + name, function(player_info){

				  if (player_info != null) {

						group = d3.select('#score-group').style('display', 'block')
						d3.select('.no-player').remove()

						for (var key in player_info){
							  if (player_info.hasOwnProperty(key)){
									group.selectAll('[score_type="' + key + '"]').text(d3.format('.2f')(player_info[key]))
							  }
						}

						if(player_info.college == 'null'){
							  group.append('b').text('Questo giocatore non ha frequentato un college').classed('no-college', true)
							  d3.selectAll('.state').filter('.selected').classed('selected', false)
							  players.remove()
							  colleges.remove()

						}


					d3.json('http://infovis-nba.herokuapp.com/players/' + player_info.player_id, function(statistics){


						stats.remove()
						stats.draw(player_info.player_id, player_info.name)
							  if(player_info.college != 'null') {
									
									config.actual_college = player_info.college
									var state_abbr = ''
									var found = uStates.uStatePaths.filter(function(item){
										  return item.n === statistics.state
									})
									state_abbr = found[0].id

									d3.selectAll('.state').filter('.selected').classed('selected', false)
									d3.selectAll('.state').filter(function(d){return d.id == state_abbr}).classed('selected', true)

									colleges.draw(statistics.state, state_abbr, config.score_type)
									players.draw(player_info.college, config.score_type)

							  }
						config.actual_player = player_info.name
						
					})
				  } else {
						d3.select('.no-player').remove()
						d3.select('#player-modal .modal-body').append('p').text('Nessun giocatore trovato con questo nome').classed('no-player',true)
						d3.select('#score-group').style('display', 'none')


				  }
			})
		})
	}



	this.help = help

})()