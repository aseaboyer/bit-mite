function Keyring () {
    var obj = {};
    
    obj.current = {
        pressed: false,
        state: "",
        num: 0
    };
    
    obj.press = function (k) {console.log (k);
        if (k === 87 || k === 38) {
            this.current.pressed = true;
            this.current.state = "up";
            this.current.num = k;
        } else if (k === 83 || k === 40) {
            this.current.pressed = true;
            this.current.state = "down";
            this.current.num = k;
        } else if (k === 65 || k === 37) {
            this.current.pressed = true;
            this.current.state = "left";
            this.current.num = k;
        } else if (k === 68 || k === 39) {
            this.current.pressed = true;
            this.current.state = "right";
            this.current.num = k;
        }
        
        document.body.dataset.keyPressed = this.current.state;
    };
    obj.release = function (k) {
        if (this.current.pressed === true) {
            if (this.current.num === k) {
                this.current.pressed = false;
                this.current.state = "";
                this.current.num = 0;
            }
        }
        document.body.dataset.keyPressed = "";
    };
    
    return obj;
}