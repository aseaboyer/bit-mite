/*
 * Vars
 */
var game, keys,
    player;

/*
 * Key presses
 */
document.body.addEventListener("keydown", function (e) {
    keys.press (e.keyCode);
});
document.body.addEventListener("keyup", function (e) {
    keys.release (e.keyCode);
});
document.getElementById ("restart").addEventListener("click", function (e) {
    game.restart ();
});

/*
 * INIT Phase
 */
(function () { // INIT
    var c = document.getElementById ("game");
    var bitSize = 5;
    game = new Game (c, bitSize);
    keys = new Keyring ();
    
    player = new Player (
        (c.width / bitSize / 2), 
        (c.height / bitSize / 2)
    );
    
    game.spawnCoin ();
    game.spawnEnemy ();
    
    Draw ();
    GameLoop ();
})();

/*
 * UPDATE Loop
 */
function GameLoop () {
    window.requestAnimationFrame(GameLoop);
    
    var now = Date.now ();
    
    if (now >= (game.frame.last + game.frame.frequency) &&
       game.paused === false) {
        if (keys.current.pressed) { // update and redraw
            /*
                Updates
            */
            game.frame.update ();
            
            player.move (keys.current.state);
            
            /*
                Execute Draws
            */
            Draw ();
        }
    }
    
    //console.log (keys.current);
};

function Draw () {
    // clear canvas
    game.clearCanvas ();
    
    // player
    for (var j = 0; j < (player.history.length >= 4 ? 4 : player.history.length); j++) {
        game.drawBit (player.history [j].x, player.history [j].y,
                  game.colors.player, "0." + (-j+5));
    }
    game.drawBit (player.position.x, player.position.y,
                  game.colors.player, "1");
    
    // coin actions
    if (player.position.x === game.coin.x &&
        player.position.y === game.coin.y) {
        game.collectCoin ();
        
    } else {
        game.drawBit (game.coin.x, game.coin.y,
                  game.colors.coin, "1");
    }
    
    // enemies
    for (var i = 0; i < game.enemies.length; i++) {
        game.enemies [i].update ();
        
        // Check to see if it's offscreen - use player check
        if (game.enemies [i].position.x >= 0 &&
            game.enemies [i].position.x < game.board.width &&
            game.enemies [i].position.y >= 0 &&
            game.enemies [i].position.y < game.board.height) {
            
            game.drawBit (game.enemies [i].position.x, 
                game.enemies [i].position.y,
                game.colors.enemy, "1");
            for (var j = 0; j < (game.enemies [i].history.length >= 4 ? 4 : game.enemies [i].history.length); j++) {
                if (game.enemies [i].spawning) {
                    game.drawBit (game.enemies [i].history [j].x,
                            game.enemies [i].history [j].y,
                            game.colors.spawningEnemy, "0." + (-j+5));
                } else {
                    game.drawBit (game.enemies [i].history [j].x,
                            game.enemies [i].history [j].y,
                            game.colors.enemy, "0." + (-j+5));
                }
            }
        } else {
            game.removeEnemy (i);
        }
    }
    
    // check for enemy impacts with player
    for (var i = 0; i < game.enemies.length; i++) {
        if (game.enemies [i].position.x === player.position.x &&
            game.enemies [i].position.y === player.position.y &&
            game.enemies [i].spawning === false) {
                player.changeHealth (-30);
        }
    }
    
    
    // spawn a new enemy - progressively more enemies
    if (game.enemies.length < (game.coinsCollected/2) ||
        game.enemies.length <= 0) {
        game.spawnEnemy ();
    }
}