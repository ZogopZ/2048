document.addEventListener("DOMContentLoaded", canvasDrawer);
document.addEventListener("DOMContentLoaded", function(){
    document.onkeydown = checkKey;
    function checkKey(e) {
        e = e || window.Event;
        if (e.key == 'ArrowUp') {
            alert('up was pressed');
        }
        else if (e.key == 'ArrowDown') {
            alert('down was pressed');
        }
        else if (e.key == 'ArrowLeft') {
            alert('left was pressed');
        }
        else if (e.key == 'ArrowRight') {
            alert('right was pressed');
        }

    }
});

function canvasDrawer() {
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    for (let x = 20; x <= 335; x += 105) {
        for (let y = 20; y <= 335; y += 105) {
            console.log(x, y);  // todo: delete this comment.
            ctx.fillStyle = "#D3D3D3D3";
            ctx.beginPath();
            ctx.rect(x, y, 100, 100);  // Use static sizes to create squares for the game.
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = "#FFFFF0";
            ctx.rect(x+2, y+2, 96, 96);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = "#000000";
            ctx.beginPath();
            ctx.fillText('number', x+40, y+50, 100);
            ctx.fill();
        }
    }
    ctx.beginPath();
    ctx.fillStyle = "#FFFFF0"
    ctx.rect(600, 200, 100, 100);
    ctx.fill();
    ctx.closePath();
}

