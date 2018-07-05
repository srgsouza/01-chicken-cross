//  Global Variables
let canvas = null;
let canvasContext = null;
let roadWidth = null; // set in windows.onload() function
let laneWidth = null;
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
    this.width = width;
    this.height = height;
    this.weight = weight;
    this.speedX = speedX;
    this.color = color;
    vehicles.push(this);
  }
}

// Create instances of vehicles
let vehicle = null;
for (let i = 0; i < 10; i++ ) {
  vehicle = new Vehicles(1200, 400, 60, 40 , 50, normalFlowSpeed, 'blue');
}

// initial traffic (vehicles on road at the start of the game)
// onRoad.push(vehicles.shift(0, 1));

// ########################################################################################################################
// ########################################################################################################################
// ########################################################################################################################




// Main Functions - Set Canvas and Draw Everything per setInterval
window.onload = () => {
  console.log("Why did the chicken cross the road?");
  canvas = document.getElementById('game-canvas');
  canvasContext = canvas.getContext('2d');
  roadWidth = canvas.height / 4;  // thickness of the road
  laneWidth = roadWidth / 3; // width of lane in the road (3 lanes per road)
  
  const framesPerSecond = 30;
  setInterval(() => {
    // moveEverthing();
    // drawEverything();
    // isThereCollision();
    // slowVehicleSpeedEastBound(); 
  }, 1000 / framesPerSecond);

  setInterval(() => {  // interval for insertion of new cars on the road
    getOnRoad();  
    resumeSpeedEastBound(); 
  }, 2000);

  canvas.addEventListener('mousemove', (event) => {
    const mousePosition = getMousePosition (event);
    chickenX = mousePosition.x - chickenWidth/2;
    chickenY = mousePosition.y - chickenHeight/2; 
    // drawEverything();   
    // collisionDetection(); 
  })
  
}


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


// Remove object from the vehicles[] array and add it to onRoad[] array
const getOnRoad = () => {
  if (vehicles.length > 0) {
    onRoad.push(vehicles.shift(0, 1));
  }
}


// Draw Vehicles
const drawVehicle = (vehicle) => {
  vehicle.x -= vehicle.speedX;  // vehicle goes to the left
  drawRect(vehicle.x, vehicle.y, vehicle.width, vehicle.height, vehicle.color); 
}

// Draw Lanes (proportinal to the canvas size)
const drawLane = (topY) => {
  const dashLength = canvas.width/10; // length of the dashed center lines
  const lineWidth = 3; // thickness of the lines
  drawRect(0, topY, canvas.width, roadWidth, 'gray'); // road tarmac
  drawRect(0, topY, canvas.width, 5, 'white'); // road line (top)
  drawRect(0, topY + roadWidth, canvas.width, 5, 'white'); //road line (bottom)
  for (let i = canvas.width/30; i < canvas.width; i += canvas.width/6 ) {
    drawRect(i, topY + laneWidth, dashLength, lineWidth, 'white'); // dashed line (top)
    drawRect(i, topY + laneWidth * 2, dashLength, lineWidth, 'white'); // dashed line (bottom)
  }
}

// Draw Rectangles (roads, lines, vehicles, chicken);
const drawRect = (leftX, topY, width, height, drawColor) => {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}


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

// Draw Everything
const drawEverything = () => {
  const topRoad = canvas.height / 5;
  const bottomRoad = canvas.height / 1.8;
  drawRect(0, 0, canvas.width, canvas.height, 'green'); // canvas
  drawLane(topRoad); // top lane
  drawLane(bottomRoad); // bottom lane
  drawRect(chickenX, chickenY, chickenWidth, chickenHeight, 'yellow'); // chicken
  // drawVehicle(canvas.height / 2.6, 'red');
  // drawVehicle(canvas.height /1.75, 'blue');
  if (onRoad.length > 0) {
    onRoad.forEach(element => {  // vehicles
      element.y = bottomRoad + (roadWidth / 6) - element.height / 2
      drawVehicle(element);
    });
  }
}


// Animate

function animate() {
  requestAnimationFrame(animate);
  drawEverything();
  isThereCollision();
  slowVehicleSpeedEastBound(); 
}

animate();