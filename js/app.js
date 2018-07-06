// ########################################################################################################################
// ################################ GLOBAL VARIABLES AND OBJECTS ##############################################################
// ########################################################################################################################

//  Global Variables
const canvas = document.getElementById('game-canvas');
const canvasContext = canvas.getContext('2d'); // gets canvas context

  chickenImage = new Image();
  chickenImage.src = 'images/chick.png';
  




let normalFlowSpeed = 5;
let isWestTrafficFlowNormal = true; 
let isEastTrafficFlowNormal = true; 

const vehicles = [];  // array to hold vehicles
const westBoundRoad = []; // array of vehicles that go on the westBound road
let eastBoundRoad = []; // array of vehicles that go on the westBound road

// Objects
class Chicken {
  constructor() {
    this.chickenX = canvas.width / 2; // x coordinate
    this.chickenY = canvas.height - 100; // y coordinate
    this.chickenWidth = 15; // 
    this.chickenHeight = 15;
    this.chickenSpeed = 8;
    this.score = 0;
    this.isHit = false;
    this.sideOfRoad = 'bottom';
    this.lastLocation = 'bottom';

  }
  checkScore() {
    if (this.chickenY < 155) {
      this.sideOfRoad = 'top';
    } else if (this.chickenY > 630) {
      this.sideOfRoad = 'bottom';
    }
    if (this.lastLocation != this.sideOfRoad) { 
      this.score += 1;
      this.lastLocation = this.sideOfRoad;
    }    
  }
  isDead() {
    if (chicken.isHit) {
      chicken.resetScore();
    }
    console.log('is hit? ' + chicken.isHit);
    
  }
  resetScore() {
    this.score = 0;
    this.isHit = false;
    this.sideOfRoad = 'bottom'
    this.lastLocation = 'bottom'
    this.chickenX = canvas.width / 2; 
    this.chickenY = canvas.height - 100;
  }
  moveLeft() {
    this.chickenX -= this.chickenSpeed;
  }
  moveRight() {
    this.chickenX += this.chickenSpeed;
  }
  moveDown() {
    this.chickenY += this.chickenSpeed;
  }
  moveUp() {
    this.chickenY -= this.chickenSpeed;
  }
}

class Vehicles {
  constructor(x, y, width, height, weight, speedX, color) {
    this.x = x;
    this.y = y;
    this.yCenter = this.y - this.y/2;
    this.width = width;
    this.height = height;
    this.weight = weight;
    this.speedX = speedX;
    this.directionX = 1; // positive goes from left to right
    // this.velocityX = this.speedX * this.directionX;
    this.color = color;
    vehicles.push(this);
  }
}

class Road {
  constructor(topY) {
    this.topY = topY;
    this.roadWidth = canvas.height / 4;
    this.laneWidth = this.roadWidth / 3;
    this.dashLength = canvas.width / 10;
    this.lineWidth = 3;
    this.roadCenterY = topY + this.roadWidth - this.roadWidth / 2;
    this.topYToCenterDraw = topY - this.roadWidth / 2;  
  }
}

// Create instance of chicken
const chicken = new Chicken();

// Create instances of vehicles
let vehicle = null;
for (let i = 0; i < 60; i++ ) {
  vehicle = new Vehicles(0, 400, 60, 40 , 50, normalFlowSpeed, 'blue');
}

// Create instances of roads
const topRoad = new Road( (canvas.height / 2) - (canvas.height / 6) );
const bottomRoad = new Road((canvas.height / 2) + (canvas.height / 6));


// initial traffic (vehicles on road at the start of the game)
// westBoundRoad.push(vehicles.shift(0, 1));

// ########################################################################################################################
// ######################################### CREATE AND MANAGE SHAPES / OBJECTS ######################################################################
// ########################################################################################################################

// Draw Vehicles
const drawVehicleWestBound = (vehicle) => {
  vehicle.x -= vehicle.speedX;  // adjust x by speedX on each call, gives object a velocity 
  drawRect(vehicle.x, vehicle.y, vehicle.width, vehicle.height, vehicle.color); 
}
const drawVehicleEastBound = (vehicle) => {
  vehicle.x += vehicle.speedX;  // adjust x by speedX on each call, gives object a velocity 
  drawRect(vehicle.x, vehicle.y, vehicle.width, vehicle.height, vehicle.color);
}
 
// Draw Lanes (proportinal to the canvas size) - takes a road object and the Y coordinate as parameters
const drawRoad = (road, topY) => {
  // canvasContext.drawImage(chickenImage, 400, 200);
  
  canvasContext.font = "bold 16pt Courier";
  canvasContext.fillText('SCORE: ' + chicken.score, 200, 80);
  drawRect(0, topY, canvas.width, road.roadWidth, 'gray'); // road tarmac
  drawRect(0, topY, canvas.width, road.lineWidth, 'white'); // road line (top)
  drawRect(0, topY + road.roadWidth - road.lineWidth, canvas.width, road.lineWidth, 'white'); //road line (bottom)
  for (let i = canvas.width/30; i < canvas.width; i += canvas.width/6 ) {
    drawRect(i, topY + road.laneWidth, road.dashLength, road.lineWidth, 'white'); // dashed line (top)
    drawRect(i, topY + road.laneWidth * 2, road.dashLength, road.lineWidth, 'white'); // dashed line (bottom)
  }
}

// Draw Rectangles (roads, lines, vehicles, chicken);
const drawRect = (leftX, topY, width, height, drawColor) => {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}

// Draw Everything
const drawEverything = () => {

  drawRect(0, 0, canvas.width, canvas.height, 'green'); // draw canvas
  drawRoad(topRoad, topRoad.topYToCenterDraw); // top road
  drawRoad(bottomRoad, bottomRoad.topYToCenterDraw); // bottom road
  drawRect(chicken.chickenX, chicken.chickenY, chicken.chickenWidth, chicken.chickenHeight, 'yellow'); // draw chicken
  if (westBoundRoad.length > 0) {
    westBoundRoad.forEach(element => {  // vehicles of the westBoundRoad array
      drawVehicleWestBound(element);
    });
  }
  if (eastBoundRoad.length > 0) {
    eastBoundRoad.forEach(element => {  // vehicles of the westBoundRoad array
      // element.speedX = -element.speedX
      drawVehicleEastBound(element);
    });
  }
  canvasContext.drawImage(chickenImage, chicken.chickenX - 10, chicken.chickenY - 9); // draw chicken image
}

// Feed Vehicles onto the Road
// Remove object from the vehicles[] array and add it to westBoundRoad[] array
const getOnWestBoundRoad = () => {
  if (vehicles.length > 0) { // if there are any vehicles available to go on the road
    const laneNumber = Math.floor(Math.random() * 3) + 1; // num between 1 and 3
    switch (laneNumber) { // insert vehicle onto a random lane
      case 1:
        vehicles[0].x = canvas.width;
        // vehicles[0].velocityX *= -1;  // reverses velocity 
        vehicles[0].y = topRoad.topY - topRoad.laneWidth * 1.25;
        break;
      case 2:
        vehicles[0].x = canvas.width;
        // vehicles[0].velocityX *= -1;  // reverses velocity 
        vehicles[0].y = topRoad.topY - topRoad.laneWidth * 0.25;
        break;
      case 3:
        vehicles[0].x = canvas.width;
        // vehicles[0].velocityX *= -1;  // reverses velocity 
        vehicles[0].y = topRoad.topY + topRoad.laneWidth * 0.7
        break;
      default:
        break;
    }   
    westBoundRoad.push(vehicles.shift(0, 1));
  } else {
    westBoundRoad.forEach(vehicle => {
      if ((vehicle.x + vehicle.width) < 0) { // vehicle goes back to vehicles[] array if reaches the end of the road
        vehicles.push(westBoundRoad.shift(0, 1))
      }
    });
  }
}

// same as getOnWestBoundRoad, but with some reversed functionalities
const getOnEastBoundRoad = () => {
  if (vehicles.length > 0) { 
    const laneNumber = Math.floor(Math.random() * 3) + 1; 
    switch (laneNumber) { 
      case 1:
        vehicles[0].x = 0 - vehicles[0].width;
        vehicles[0].y = topRoad.topY + topRoad.laneWidth * 2.7
        break;
      case 2:
        vehicles[0].x = 0 - vehicles[0].width;
        vehicles[0].y = topRoad.topY + topRoad.laneWidth * 3.7
        break;
      case 3:
        vehicles[0].x = 0 - vehicles[0].width;
        vehicles[0].y = topRoad.topY + topRoad.laneWidth * 4.7
        break;
      default:
        break;
    }
    eastBoundRoad.push(vehicles.shift(0, 1));
  } else {
    eastBoundRoad.forEach(vehicle => {
      if (vehicle.x > canvas.width) { // 
        vehicles.push(eastBoundRoad.shift(0, 1))
      }
    });
  }
}

// ########################################################################################################################
// ######################################### CHECK / ADJUST MOVEMENTS ######################################################################
// ########################################################################################################################

// Check for Collision
const isThereCollision = () => {
  const cX1 = chicken.chickenX;
  const cX2 = chicken.chickenX + chicken.chickenWidth;
  const cY1 = chicken.chickenY;
  const cY2 = chicken.chickenY + chicken.chickenHeight
  westBoundRoad.forEach(vehicle => {
    vX1 = vehicle.x;  
    vX2 = vehicle.x + vehicle.width;
    vY1 = vehicle.y;
    vY2 = vehicle.y + vehicle.height;
    if (cX1 <= vX2 && vX1 <= cX2) {
        if (cY1 <= vY2 && vY1 <= cY2) {
        console.log('COLLISION !!!!!! ');  
        vehicle.speedX = 0;  
        isWestTrafficFlowNormal = false;
        chicken.isHit = true;       
      }
    } 
    
  });
  eastBoundRoad.forEach(vehicle => {
    vX1 = vehicle.x;
    vX2 = vehicle.x + vehicle.width;
    vY1 = vehicle.y;
    vY2 = vehicle.y + vehicle.height;
    if (cX1 <= vX2 && vX1 <= cX2) {
      if (cY1 <= vY2 && vY1 <= cY2) {
        console.log('COLLISION !!!!!! ');
        vehicle.speedX = 0;
        isEastTrafficFlowNormal = false;
        chicken.isHit = true;       
      }
    } 
  }); 
}

// Adjust Vehicle Speed
const slowVehicleSpeedWestBound = () => {  
  for (let i = 0; i < westBoundRoad.length - 1; i += 1) {
    const vehicleX1 = westBoundRoad[i].x;
    const vehicleX2 = vehicleX1 + westBoundRoad[i].width;
    const vehicleSpeed = westBoundRoad[i].speedX;
    const nextVehicleX1 = westBoundRoad[i + 1].x;

    if (nextVehicleX1 - vehicleX2 <= 10) { //
      westBoundRoad[i + 1].speedX = vehicleSpeed;
    }
  }
}

// Adjust Vehicle Speed
const slowVehicleSpeedEastBound = () => {
  for (let i = 0; i < eastBoundRoad.length - 1; i += 1) {
    const vehicleX1 = eastBoundRoad[i].x;
    const vehicleSpeed = eastBoundRoad[i].speedX;
    const nextVehicleX2 = eastBoundRoad[i + 1].x + eastBoundRoad[i + 1].width;

    if (vehicleX1 - nextVehicleX2 <= 10) { //
      // console.log('WATCH OUT !!!!');
      eastBoundRoad[i + 1].speedX = vehicleSpeed;
    }
  }
}

// Resume Vehicle Speed
resumeSpeedWestBound = () => {
  if (!isWestTrafficFlowNormal) {
    westBoundRoad.forEach(vehicle => {
      console.log('Resuming speed Westbound');     
      vehicle.speedX = normalFlowSpeed;
    });
  }
  isWestTrafficFlowNormal = true;
}

// Resume Vehicle Speed
resumeSpeedEastBound = () => {
  if (!isEastTrafficFlowNormal) {
    eastBoundRoad.forEach(vehicle => {
      console.log('Resuming speed Eastbound');
      vehicle.speedX = normalFlowSpeed;
    });
  }
  isEastTrafficFlowNormal = true;
}
// ########################################################################################################################
// ############################## ANIMATE AND MAIN GAME FUNCTIONS ###############################################
// ########################################################################################################################

// Get Mouse Position
const getMousePosition = () => {
  const rect = canvas.getBoundingClientRect();
  const root = document.documentElement;
  // Accounts for user scrolling/resizing the page ( '- rect.left - root.scrollLeft')
  let mouseX = event.clientX - rect.left - root.scrollLeft; // horizontal coordinate of the mouse
  let mouseY = event.clientY - rect.top - root.scrollTop; // vertical coord
  return {
    x: mouseX,
    y: mouseY
  }
}

// Animate Function
function animate() {
  requestAnimationFrame(animate);
  drawEverything();
  isThereCollision();
  slowVehicleSpeedWestBound();
  slowVehicleSpeedEastBound();  
}

// Main Function - Animation, Intervals, Event Listeners
window.onload = () => {
  console.log("Why did the chicken cross the road?");

  animate();
  const framesPerSecond = 2;
  setInterval(() => {
    getOnWestBoundRoad();
    getOnEastBoundRoad(); // insertion of new cars on the road
    chicken.checkScore();
  }, 2000 / framesPerSecond);

  setInterval(() => {
    
    chicken.isDead();
    resumeSpeedWestBound(); // resume traffic speed if no collision
    resumeSpeedEastBound(); // resume traffic speed if no collision
  }, 5000);

  // Listener for mouse movements
  canvas.addEventListener('mousemove', (event) => {
    const mousePosition = getMousePosition(event);
    chicken.chickenX = mousePosition.x - chicken.chickenWidth / 2;
    chicken.chickenY = mousePosition.y - chicken.chickenHeight / 2;    
  })

  // Listener for arrow keys
  // canvas.addEventListener('keydown')
  $(document).keydown( (e) => {
    let keyPressed = e.which;    
    if (keyPressed == 37) {
      chicken.moveLeft();      
    } else if (keyPressed == 39) {
      chicken.moveRight();
    } else if (keyPressed == 38) {
      chicken.moveUp();
    } else if (keyPressed == 40) {
      chicken.moveDown();
    }
  })

}
