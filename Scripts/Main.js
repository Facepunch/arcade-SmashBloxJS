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
    game.setStage(new GameStage(demo));
}
