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

var game = {};

game.onLoadResources = function(volume)
{
	demo = volume.get(Demo, "attract");
}

game.onReset = function()
{
	game.setStage(new AttractStage(demo));
}

game.start = function()
{
	game.setStage(new GameStage(demo));
}

game.enterHighscore = function(completed, score)
{
	game.setStage(new EnterScoreStage(demo, completed, score));
}

game.showHighscores = function()
{
	game.setStage(new HighscoreStage(demo));
}

game.submitAndShowHighscores = function(highscore)
{
	game.submitHighscore(highscore);
	game.setStage(new HighscoreStage(demo));
}

game.onSetupInitialScores = function()
{
	game.addInitialScore(new GameAPI.Highscore("AAA", 100));
	game.addInitialScore(new GameAPI.Highscore("RLY", 90));
	game.addInitialScore(new GameAPI.Highscore("LAY", 80));
	game.addInitialScore(new GameAPI.Highscore("BUC", 70));
	game.addInitialScore(new GameAPI.Highscore("ROB", 60));
	game.addInitialScore(new GameAPI.Highscore("ZKS", 50));
	game.addInitialScore(new GameAPI.Highscore("IAN", 40));
	game.addInitialScore(new GameAPI.Highscore("GAR", 30));
	game.addInitialScore(new GameAPI.Highscore("JON", 20));
	game.addInitialScore(new GameAPI.Highscore("IVN", 10));
}
