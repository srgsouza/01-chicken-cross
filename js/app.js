// ########################################################################################################################
// ################################ GLOBAL VARIABLES AND OBJECTS ##############################################################
// ########################################################################################################################

//  Global Variables
const canvas = document.getElementById('game-canvas');
const canvasContext = canvas.getContext('2d'); // gets canvas context
let chickenX = null; // x coordinate
let chickenY = null; // y coordinate
let chickenWidth = 40; // 
let chickenHeight = 40;
let normalFlowSpeed = 4;
let istTrafficFlowNormal = true; 

let vehicles = [];  // array to hold vehicles
let onRoad = []; // array of vehicles that are on the road

// Objects
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
    this.velocityX = this.speedX * this.directionX;
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

// Create instances of vehicles
let vehicle = null;
for (let i = 0; i < 60; i++ ) {
  vehicle = new Vehicles(1200, 400, 60, 40 , 50, normalFlowSpeed, 'blue');
}

// Create instances of roads
const topRoad = new Road( (canvas.height / 2) - (canvas.height / 6) );
const bottomRoad = new Road((canvas.height / 2) + (canvas.height / 6));


// initial traffic (vehicles on road at the start of the game)
// onRoad.push(vehicles.shift(0, 1));

// ########################################################################################################################
// ######################################### CREATE AND MANAGE SHAPES / OBJECTS ######################################################################
// ########################################################################################################################

// Draw Vehicles
const drawVehicle = (vehicle) => {
  vehicle.x -= vehicle.speedX;  // adjust x by speedX on each call, gives object a velocity 
  drawRect(vehicle.x, vehicle.y, vehicle.width, vehicle.height, vehicle.color); 
}

// Draw Lanes (proportinal to the canvas size) - takes a road object and the Y coordinate as parameters
const drawRoad = (road, topY) => {
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
  drawRect(0, 0, canvas.width, canvas.height, 'green'); // draw anvas
  drawRoad(topRoad, topRoad.topYToCenterDraw); // top road
  drawRoad(bottomRoad, bottomRoad.topYToCenterDraw); // bottom road
  drawRect(chickenX, chickenY, chickenWidth, chickenHeight, 'yellow'); // draw chicken
  if (onRoad.length > 0) {
    onRoad.forEach(element => {  // vehicles of the onRoad array
      drawVehicle(element);
    });
  }
}

// Feed Vehicles onto the Road
// Remove object from the vehicles[] array and add it to onRoad[] array
const getOnEastBoundRoad = () => {
  if (vehicles.length > 0) { // if there are any vehicles available to go on the road
    const laneNumber = Math.floor(Math.random() * 3) + 1; // num between 1 and 3
    console.log('laneNumber is ' + laneNumber);
    switch (laneNumber) {
      case 1:
        vehicles[0].x = canvas.width;
        vehicles[0].velocityX *= -1;  // reverses velocity 
        vehicles[0].y = topRoad.topY - topRoad.laneWidth * 1.25;
        break;
      case 2:
        vehicles[0].x = canvas.width;
        vehicles[0].velocityX *= -1;  // reverses velocity 
        vehicles[0].y = topRoad.topY - topRoad.laneWidth * 0.25;
        break;
      case 3:
        vehicles[0].x = canvas.width;
        vehicles[0].velocityX *= -1;  // reverses velocity 
        vehicles[0].y = topRoad.topY + topRoad.laneWidth * 0.7
        break;
      default:
        break;
    }
    
    onRoad.push(vehicles.shift(0, 1));
  }
}

const getOnWestBoundRoad = () => {
  if (vehicles.length > 0) { // if there are any vehicles available to go on the road
    const laneNumber = Math.floor(Math.random() * 3) + 1; // num between 1 and 3
    console.log('laneNumber is ' + laneNumber);
    switch (laneNumber) {
      case 1:
        vehicles[0].x = 0;
        // vehicles[0].vehicle = -vehicles[0].velocityX
        vehicles[0].y = topRoad.topY + topRoad.laneWidth * 2.7
        break;
      case 2:
        vehicles[0].x = 0;
        vehicles[0].y = topRoad.topY + topRoad.laneWidth * 3.7
        break;
      case 3:
        vehicles[0].x = 0;
        vehicles[0].y = topRoad.topY + topRoad.laneWidth * 4.7
        break;
      default:
        break;
    }

    onRoad.push(vehicles.shift(0, 1));
  }
}



// ########################################################################################################################
// ######################################### CHECK / ADJUST MOVEMENTS ######################################################################
// ########################################################################################################################

// Check for Collision
const isThereCollision = () => {
  const cX1 = chickenX;
  const cX2 = chickenX + chickenWidth;
  const cY1 = chickenY;
  const cY2 = chickenY + chickenHeight
  onRoad.forEach(vehicle => {
    vX1 = vehicle.x;  
    vX2 = vehicle.x + vehicle.width;
    vY1 = vehicle.y;
    vY2 = vehicle.y + vehicle.height;
    if (cX1 <= vX2 && vX1 <= cX2) {
        if (cY1 <= vY2 && vY1 <= cY2) {
        console.log('COLLISION !!!!!! ');  
        vehicle.speedX = 0;  
        istTrafficFlowNormal = false;        
      }
    } 
  }); 
}

// Adjust Vehicle Speed
const slowVehicleSpeedEastBound = () => {  
  for (let i = 0; i < onRoad.length - 1; i += 1) {
    // const vX1 = onRoad[i].x;
    // const vX2 = onRoad[] 
    const vehicleX1 = onRoad[i].x;
    const vehicleX2 = vehicleX1 + onRoad[i].width;
    const vehicleSpeed = onRoad[i].speedX;
    const nextVehicleX1 = onRoad[i + 1].x;

    if (nextVehicleX1 - vehicleX2 <= 10) { //
      // console.log('WATCH OUT !!!!');
      onRoad[i + 1].speedX = vehicleSpeed;
    }
  }
}

// Resume Vehicle Speed
resumeSpeedEastBound = () => {
  if (!istTrafficFlowNormal) {
    onRoad.forEach(vehicle => {
      // console.log(checkForCollision());
      // console.log(checkForCollision());
      console.log('Resuming speed');     
      vehicle.speedX = normalFlowSpeed;
    });
  }
  istTrafficFlowNormal = true;
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
  slowVehicleSpeedEastBound(); 
}

// Main Function - Animation, Intervals, Event Listeners
window.onload = () => {
  console.log("Why did the chicken cross the road?");
  animate();
  const framesPerSecond = 2;
  setInterval(() => {
    getOnEastBoundRoad(); // insertion of new cars on the road
    // getOnWestBoundRoad();
  }, 1000 / framesPerSecond);

  setInterval(() => {
    resumeSpeedEastBound(); // resume traffic speed
  }, 3000);

  canvas.addEventListener('mousemove', (event) => {
    const mousePosition = getMousePosition(event);
    chickenX = mousePosition.x - chickenWidth / 2;
    chickenY = mousePosition.y - chickenHeight / 2;
  })

}

