var origGear = document.querySelector(".gear");
var gearWidth = 200;
origGear.style.width =  gearWidth + "px";
origGear.style.height = gearWidth + "px";
var gears = [];
var circlesCount = 0;
var count = Math.min(window.innerWidth / gearWidth, 100);
var gearCopy = null;
var getRandomX = function(){ return Math.random() * window.innerWidth; };
var getRandomY = function(){ return Math.random() * window.innerHeight; };
var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var context = canvas.getContext("2d");

function animationFrame(timestamp){
    drawGear();
    drawCircle(context);
    window.requestAnimationFrame(animationFrame);
}

window.requestAnimationFrame(animationFrame);

function drawGear(){
    if (gears.length > count) return;
    gearCopy = origGear.cloneNode(true);
    gearCopy.id = "gear"+gears.length;
    gearCopy.style.top = getRandomY() + "px";
    gearCopy.style.left = getRandomX() + "px";
    gearCopy.style.zIndex = "-"+(1+gears.length);
    document.body.appendChild(gearCopy);
    gears.push(gearCopy);
}

var maxCircleSize = 4;
function drawCircle(ctx){
    if (circlesCount > window.innerWidth) return;
    ctx.beginPath();
    ctx.arc(getRandomX(), getRandomY(), Math.random()*maxCircleSize, 0, 2*Math.PI);
    ctx.fillStyle = "yellow";
    ctx.fill();
    circlesCount++;
}