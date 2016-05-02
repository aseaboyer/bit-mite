function Tile (x, y) {
    var obj = {},
        now = Date.now ();
    
    obj.x = x;
    obj.y = y;
    
    obj.visited = {
        by: "",
        time: ""
    };
    
    return obj;
}