let img;

let tl; //temporary layer
let inc = 13;
let pSize = 10; //  size
let minPSize = 6;
let maxPSize = 10;
let pSpeed = 0.3;
let dir = 1; // direction (1 means it grows)

// star stuff
var starX, starY
var pg
var circle_angle, circle_anglespeed
var star_anglespeed

var star1Init = -250;
var star2Init = -star1Init;

let wham = true;
let bang = false;

let particles = [];

let mouseCounter = 0;
let textArray = [
  "tuesday",
  "august 20",
  "6-8 pm",
  "pier 57"
]
let textBits = [];
let regular, italic;

function preload(){
  regular = loadFont('Helvetica.ttf');
  italic = loadFont('Helvetica-Oblique.ttf');
}

function setup() {
  createCanvas(800, 800);
  
  //create temporary layer
  tl = createGraphics(width, height);

  tl.textFont(regular);
  // textAlign(CENTER, CENTER);
  
  //print image onto temporary layer
  tl.textSize(200);
  tl.fill(255);
  tl.textAlign(CENTER);
  tl.text("CCNYC", width/2, height/2 - 30);
  // tl.circle(50, 50, 200);
  
  noStroke();
  rectMode(CENTER);
  angleMode(DEGREES);

  for(let i = 0; i < width; i += inc){
    for(let j = 0; j < height; j += inc){
      let c = tl.get(i, j);
      if(brightness(c) > 10){
        particles.push(new Particle(i, j));
      }
    }
  }

  // STAR STUFF
  starX = width;
	starY = height;

	circle_angle = 0;

	ellipseMode(CENTER);
	noStroke();
}

function draw() {
  background(0);
  
  // show temporary layer
  // image(tl, 0, 0);
  

  // STAR STUFF
  // circle_anglespeed = map(mouseX, 0, width, -.005, -.015)
	// star_anglespeed = map(mouseY, 0, height, 80, 220)
	star_anglespeed = 30

	// fill(243, 237, 219)
	// push()
	// circle_angle = circle_angle + circle_anglespeed
	// translate(starX/2, starY/2)
	// rotate(circle_angle)
	// ellipse(x*.2, y*.2, 300, 300)
	// pop()

	fill(147, 115, 148)
	push()
  let starR = 70
	translate(starX/2, starY/2)
	rotate(frameCount/-star_anglespeed)
	star(star1Init, star1Init, starR, starR*2, 18)
	pop()

	fill(180, 208, 230)
	push()
  starR = 90
	translate(starX/2, starY/2)
	rotate(frameCount/-star_anglespeed)
	star(-star1Init, -star1Init, starR, starR*2, 20)
	pop()

  star1Init += 1;

  // if(frameCount % 4 == 0) {
  //   star1Init *= .95;
  //   star2Init *= .95;
  // }

  if(star1Init > -10) {
    star1Init = 1000;

    for(let i = 0; i < particles.length ; i ++){
      particles[i].checkHover();
      particles[i].explode(wham);
      particles[i].explode2(bang);
      particles[i].show();
      particles[i].animate();
    }
  }

  textFont(italic);
  textSize(32);
  for(let i = 0; i < textBits.length; i++) {
    let xPrev, yPrev;
    let t = textBits[i];

    if(i != 0){
      xPrev = textBits[i-1].x;
      yPrev = textBits[i-1].y;
      stroke(255);
      line(xPrev, yPrev, t.x, t.y);
      noStroke();
    }
  
    text(t.txt, t.x + 20, t.y);

    let tempS_size = 14;
    star(t.x, t.y, tempS_size, tempS_size/2, 8);
  }
  
}

function keyPressed(){
  wham = false;
  bang = true;
}

function mouseClicked(){
  let txt;
  if(mouseCounter % 2 == 0){
    txt = "";
  } else {
    txt = textArray[Math.floor(mouseCounter/2)];
  }
  textBits.push({ txt: txt, x: mouseX, y: mouseY });

  mouseCounter++;
}

class Particle{
  constructor(x, y){
    this.x = width/2;
    this.y = height/2;
    this.midX = random(0, width);
    this.midY = random(0, height);
    this.finalX = x;
    this.finalY = y;
    this.pSize = random(minPSize, maxPSize);
    this.dir = random([-1, 1]);
    this.angle = random(360);
    this.angleDir = random([-1, 1]);
    this.angleInc = 0.1;
    this.hover = false;
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.explosionSpeed = 7;
  }

  explode(wham){
    if(wham){
      let d = dist(this.x, this.y, this.midX, this.midY);
      this.explosionSpeed = d/20;

      if(this.x < this.midX) {
        this.x += this.explosionSpeed;
      }
      if(this.y < this.midY) {
        this.y += this.explosionSpeed;
      }
      if(this.x > this.midX) {
        this.x -= this.explosionSpeed;
      }
      if(this.y > this.midY) {
        this.y -= this.explosionSpeed;
      }
    }
  } 

  explode2(bang){
    if(bang){
      let d = dist(this.x, this.y, this.finalX, this.finalY);
      this.explosionSpeed = d/20;

      if(this.x < this.finalX) {
        this.x += this.explosionSpeed;
      }
      if(this.y < this.finalY) {
        this.y += this.explosionSpeed;
      }
      if(this.x > this.finalX) {
        this.x -= this.explosionSpeed;
      }
      if(this.y > this.finalY) {
        this.y -= this.explosionSpeed;
      }

      this.angleDir = 0;
    }
  }

  show(){
    angleMode(DEGREES);

    fill(this.r, this.g, this.b);    
    // ellipse(this.x, this.y, this.pSize, this.pSize);
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    if(wham) {
      star(0, 0, 10/2, 10, 8);
    } else {
      star(0, 0, this.pSize/2, this.pSize, 8);
    }
    pop();
    this.angle += 2 * this.angleDir;
  }
  
  animate(){
    if(bang) {
      if(this.pSize >= maxPSize && this.dir == 1){
        this.dir *= -1;
      } else if(this.pSize <= minPSize && this.dir == -1){
        this.dir *= -1;
      }
      this.pSize += pSpeed * this.dir;
    }
  }
  
  checkHover(){
    if(dist(mouseX, mouseY, this.x, this.y) < inc*1/2){
      this.hover = true;
    }
    else{
      this.hover = false;
    }
    this.hoverColor();
  }

  hoverColor(){
    if(this.hover){
      this.r = 0;
      this.g = 0;
      this.b = 139;
    } else if(this.r < 255 || this.g < 255){
        this.r += 3;
        this.g += 3;

        if(this.b < 255) {
          this.b += 3;
        }
    }
  }
}

// star stuff
function star(x, y, radius1, radius2, npoints) {
  angleMode(RADIANS);
  var angle = TWO_PI / npoints;
  var halfAngle = angle / 2.0;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius2;
    var sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
