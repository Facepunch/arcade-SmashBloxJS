function setupGameInfo(info)
{
    info.api = "GameAPI.BudgetBoy";

    info.title = "Smash Blox";
    info.authorName = "James King";
    info.authorContact = "james.king@facepunchstudios.com";
    info.description = "Like Breakout but cheaper!";

    info.updateRate = 60;
}

function setupGraphicsInfo(info)
{
    info.width = 200;
    info.height = 160;
}

var demo = null;

game.onLoadResources = function(volume)
{
    demo = volume.get(Demo, "attract");
}

game.onReset = function()
{
	//game.setStage(new AttractStage(demo));
	//game.setStage(new GameStage(demo));
	//game.setStage(new EnterScoreStage(demo, true, 32));
    
	game.setStage(new HighscoreStage(demo));
}

game.start = function()
{
	game.setStage(new GameStage(demo));
}

game.submitHighscore = function(completed, score)
{
	game.setStage(new EnterScoreStage(demo, completed, score));
}

game.showHighscores = function()
{
	game.setStage(new HighscoreStage(demo));
}

game.submitAndShowHighscores = function(highscore)
{

}