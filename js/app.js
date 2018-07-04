//  Global Variables
let canvas = null;
let canvasContext = null;
let chickenX = null; // x coordinate
let chickenY = null; // y coordinate
let chickenWidth = 40; // 
let chickenHeight = 40;
let vehicleX = null;
// let vehicleY = null;
// let vehicleWidth = 80;
// let vehicleHeight = 40;

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
let vehicle = new Vehicles(0, 300/2, 40, 80, 10, 3, 'purple');
vehicle = new Vehicles(0, 400, 30, 50, 10, 3, 'blue');

console.log('vehicles is ' + vehicles);
onRoad.push(vehicles.shift(0, 1));
// console.log(vehicles.shift(0, 1));
console.log('onRoad is' + onRoad);



const getOnRoad = () => {
  onRoad.push(vehicles.shift(0, 1));
}

console.log('getOnRoad array has ' + onRoad);


// Main Functions - Set Canvas and Draw Everything per setInterval
window.onload = () => {
  console.log("Why did the chicken cross the road?");
  canvas = document.getElementById('game-canvas');
  canvasContext = canvas.getContext('2d');

  const framesPerSecond = 30;
  setInterval(() => {
    // moveEverthing();
    drawEverything();
  }, 1000 / framesPerSecond);

  setInterval(() => {
    
    
    if(onRoad.length > 0) {
      getOnRoad();
      console.log('gets on the road');
    }
   
  }, 1000);

  canvas.addEventListener('mousemove', (event) => {
    const mousePosition = getMousePosition (event);
    chickenX = mousePosition.x - chickenWidth/2;
    chickenY = mousePosition.y - chickenHeight/2; 
    // drawEverything();    
  })
  
}

//  ##################  TESTING
// const init = () => {
//   vehicles = [];
//   for (let i = 0; i < 5; i += 1) {
//     let x = Math.random() * 50; // ' - radius * 2 to keep circle within bounds upon creation of x
//     let y = Math.random() * 40;
//     let width = 80;
//     let height = 40;
//     let weight = 5;
//     let speed = Math.random() * 3 + 1;

//     vehicles.push(new Vehicles(x, y, width, height, weight, speed));
//     console.log(vehicles);
    
//     animate();
//   }
// }

// function animate() {
//   requestAnimationFrame(animate);
  
//   vehicles.forEach(vehicle => {
//     drawEverything(vehicle.y, 'white');
//   });
// }


//  ################# END of TESING

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

// const moveEverything = () => {

// }

// Draw Vehicle
const drawVehicle = (vehicle) => {
  vehicle.x += vehicle.speedX;
  drawRect(vehicle.x, vehicle.y, vehicle.width, vehicle.height, vehicle.color); 
}

// Draw Lanes (proportinal to the canvas size)
const drawLane = (topY) => {
  const roadWidth = canvas.height/4;  // thickness of the road
  const laneWidth = roadWidth/3; // width of lane in the road (3 lanes per road)
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

// Draw Everything
const drawEverything = () => {
  drawRect(0, 0, canvas.width, canvas.height, 'green'); // canvas
  drawLane(canvas.height/5); // top lane
  drawLane(canvas.height/1.8); // bottom lane
  drawRect(chickenX, chickenY, chickenWidth, chickenHeight, 'yellow'); // chicken
  // drawVehicle(canvas.height / 2.6, 'red');
  // drawVehicle(canvas.height /1.75, 'blue');
  if (onRoad.length > 0) {
    // getOnRoad();
      onRoad.forEach(element => {  // vehicles
      // element.y = 500;
      drawVehicle(element);
    });
    console.log('onRoad.lenght is ' + onRoad.length);
    
  }

  
}


// init();