
var canvas,ctx,h,w;
var mousePos;

//Empty arrays
var balls=[];

var player = {
  x:10,
  y:10,
  width:20,
  height:20,
  color:'red'
}

window.onload =function init() {
  console.log('inside init function');
  //called after the page is loaded
  canvas = document.querySelector('#myCanvas');
  ctx = canvas.getContext('2d');

  // often useful
  w = canvas.width;
  h = canvas.height;

  //create 10 balls
  balls = createBalls(10);

  //add a mousemove event listenerto the canvas
  canvas.addEventListener('mousemove',mouseMoved);

  //ready to go !
  mainLoop();
};

function mainLoop() {
  console.log('inside mainLoop');
  //1 - clear the myCanvas
  ctx.clearRect(0,0,w,h);
  //draw the balls and rectangles
  drawFilledRectangle(player);
  drawAllBalls(balls);
  drawNumberOfBallsAlive(balls);

  // Animate the balls that are bouncing all over the drawAllBalls
  moveAllBalls(balls);

  movePlayerWithMouse();

  //ask for new animation frame
  requestAnimationFrame(mainLoop);
}

function mouseMoved(evt) {
    console.log('inside mouseMoved');
    mousePos = getMousePos(canvas, evt);
}

function getMousePos(canvas, evt) {
  console.log('inside getMousePos');
    // necessary work in the canvas coordinate system
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function movePlayerWithMouse() {
  console.log('inside movePlayerWithMouse');
    if(mousePos !== undefined) {
        player.x = mousePos.x;
        player.y = mousePos.y;
    }
}

function createBalls(n) {
  console.log('inside create ball function');
  // empty array
  var ballArray = [];

  // create n balls
  for(var i=0; i < n; i++) {
     var b = {
        x:w/2,
        y:h/2,
        radius: 5 + 30 * Math.random(), // between 5 and 35
        speedX: -5 + 10 * Math.random(), // between -5 and + 5
        speedY: -5 + 10 * Math.random(), // between -5 and + 5
        color:getARandomColor(),
      }
     // add ball b to the array
     ballArray.push(b);
    }
  // returns the array full of randomly created balls
  return ballArray;
}

function getARandomColor() {
  console.log('inside getARandomColor');
  var colors = ['red', 'blue', 'cyan', 'purple', 'pink', 'green', 'yellow'];
  // a value between 0 and color.length-1
  // Math.round = rounded value
  // Math.random() a value between 0 and 1
  var colorIndex = Math.round((colors.length-1)*Math.random());
  var c = colors[colorIndex];

  // return the random color
  return c;
}

function drawAllBalls(balls) {
  console.log('drawAllBalls');
  balls.forEach(function(b) {
    drawFilledCircle(b);
  });
}

function moveAllBalls(ballArray) {
  console.log('inside moveAllBalls');
  ballArray.forEach(function(b,index){
    b.x+=b.speedX;
    b.y+=b.speedY;
     testCollisionBallWithWalls(b);
     testCollisionWithPlayer(b, index);
  });
}

function testCollisionWithPlayer(b, index) {
  if(circRectsOverlap(player.x, player.y,
                     player.width, player.height,
                     b.x, b.y, b.radius)) {
    // we remove the element located at index
    // from the balls array
    // splice: first parameter = starting index
    //         second parameter = number of elements to remove
    balls.splice(index, 1);
  }
}

function testCollisionBallWithWalls(b) {
    // COLLISION WITH VERTICAL WALLS ?
    if((b.x + b.radius) > w) {
    // the ball hit the right wall
    // change horizontal direction
    b.speedX = -b.speedX;

    // put the ball at the collision point
    b.x = w - b.radius;
  } else if((b.x -b.radius) < 0) {
    // the ball hit the left wall
    // change horizontal direction
    b.speedX = -b.speedX;

    // put the ball at the collision point
    b.x = b.radius;
  }

  // COLLISIONS WTH HORIZONTAL WALLS ?
  // Not in the else as the ball can touch both
  // vertical and horizontal walls in corners
  if((b.y + b.radius) > h) {
    // the ball hit the right wall
    // change horizontal direction
    b.speedY = -b.speedY;

    // put the ball at the collision point
    b.y = h - b.radius;
  } else if((b.y -b.radius) < 0) {
    // the ball hit the left wall
    // change horizontal direction
    b.speedY = -b.speedY;

    // put the ball at the collision point
    b.Y = b.radius;
  }
}

function drawFilledRectangle(r) {
  console.log('inside drawFilledRectangle');
  //save the current state of canvas to a stack
  ctx.save();
  ctx.translate(r.x,r.y);
  ctx.fillStyle = r.color;
  ctx.fillRect(0,0,r.width,r.height);
  // restore the saved canvas from the stack
  ctx.restore();
}

function drawFilledCircle(c) {
      console.log('drawFilledCircle');
      ctx.save();
      ctx.translate(c.x,c.y);
      ctx.fillStyle = c.color;
      ctx.beginPath();
      // ctx.arc(x-co-ordinate,y-co-ordinate,radius,starting radian,ending radian)
      ctx.arc(0,0,c.radius,0,2*Math.PI);
      ctx.fill();
      ctx.restore();
}

function drawNumberOfBallsAlive(balls) {
  ctx.save();
  ctx.font="30px Arial";

  if(balls.length === 0) {
    ctx.fillText("YOU WIN!", 20, 30);
  } else {
    ctx.fillText(balls.length, 20, 30);
  }
  ctx.restore();
}

// Collisions between rectangle and circle
function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
   var testX=cx;
   var testY=cy;
   if (testX < x0) testX=x0;
   if (testX > (x0+w0)) testX=(x0+w0);
   if (testY < y0) testY=y0;
   if (testY > (y0+h0)) testY=(y0+h0);
   return (((cx-testX)*(cx-testX)+(cy-testY)*(cy-testY))< r*r);
}
