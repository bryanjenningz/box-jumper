var SPACEBAR = 32, jumped = false;

function createCanvas(width = 200, height = 200) {
  var canvas = document.createElement('canvas');
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  canvas.setAttribute('style', 'background-color: white; border: 1px solid black;');
  document.body.appendChild(canvas);
  return canvas.getContext('2d');
}

function drawBox(context, x, y, rotation = 0) {
  var width = 20, height = 20;
  var centerX = x + width/2, centerY = y + height/2;
  context.translate(centerX, centerY);
  context.rotate(rotation);
  context.fillRect(-width/2, -height/2, width, height);
  context.rotate(-rotation);
  context.translate(-centerX, -centerY);
}

function createBox() {
  return {x: 40, y: 40, vx: 0, vy: 0};
}

function update(state) {
  state.box = updateVelocity(state.box);
  state.pipes = updatePipes(state.pipes);
  state.context.clearRect(0, 0, 200, 200);
  state.pipes.forEach((pipe) => drawPipe(state.context, pipe.x, pipe.openIndex));
  drawBox(state.context, state.box.x, state.box.y);
  requestAnimationFrame(function() { update(state); });
}

function updateVelocity(box) {
  var gravity = -0.15;
  var y = box.y - box.vy, vy = jumped ? 3 : box.vy + gravity;
  jumped = false;
  return Object.assign({}, box, {y, vy});
}

function updatePipes(pipes) {
  if (pipes.slice(-1)[0].x <= 50) {
    pipes = pipes.concat(generatePipe());
  }
  return pipes.map((pipe) => Object.assign({}, pipe, {x: pipe.x - 2}));
}

function drawPipe(context, x, openIndex) {
  context.fillRect(x, 0, 20, openIndex * 20);
  context.fillRect(x, (openIndex + 2) * 20, 20, 200 - (openIndex + 1));
}

function generatePipe() {
  var openIndex = Math.floor(Math.random() * 7) + 1;
  return {x: 190, openIndex};
}

function init() {
  update({box: createBox(), context: createCanvas(), pipes: [generatePipe()]});
  addEventListener('keydown', function jump(e) {
    if (e.keyCode === SPACEBAR) {
      jumped = true;
    }
  });
}

init();
