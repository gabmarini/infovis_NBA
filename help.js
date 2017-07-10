

(function(){

	var help = {}

	d3.select('#search-button').on('click', function(){
      var name = d3.select('#name-query').node().value
      d3.json('http://infovis-nba.herokuapp.com/players/name/' + name, function(player_info){
      	d3.json('http://infovis-nba.herokuapp.com/players/' + player_info.player_id, function(statistics){
      		stats.remove()
      		stats.draw(player_info.player_id, player_info.name)
      		console.log(player_info, statistics)
      		config.actual_college = player_info.college
      		config.actual_player = player_info.name
      		//colleges.remove()
      		var state_abbr = ''
      		var found = uStates.uStatePaths.filter(function(item){
      			return item.n === statistics.state
      		})
      		state_abbr = found[0].id
      		console.log(statistics.state, state_abbr, config.score_type)
      		colleges.draw(statistics.state, state_abbr, config.score_type)
      		players.draw(player_info.college, config.score_type)
      	})
      })
 	})



	this.help = help

})()