let spriteSheet;
let backgroundSprite;
let xBorder = 1024;
let yBorder = 720;
let slimeArray = [];
const sounds = new Tone.Players({
  chomp: "Media/Cartoon_Chomp_Sound_Effect_(getmp3.pro)_01.mp3",
}).toDestination();


function preload()
{
  spriteSheet = loadImage("Media/d72dd39c-55a5-4032-9a6f-9bb66a8b09f3.png")
  backgroundSprite = loadImage("Media/eaaec42b-ecdb-44bc-a7fb-e6e9bbe1f03d.png");
}

function setup() {
  createCanvas(1024, 720);
}

function draw() {
  imageMode(CORNER);
  image(backgroundSprite, 0, 0, 1024, 720, 0, 0, 512, 512);
  imageMode(CENTER);
  drawSlime();
  if(slimeArray.length > 1)
    slimeCollision();
}

function drawSlime()
{
  for(var i = 0; i < slimeArray.length; i++) 
  {
    slimeArray[i].draw();
    slimeArray[i].move();
  }
}

function slimeCollision() {
  for(var i = 0; i < slimeArray.length - 1; i++) {
    for(var j = 0; j < slimeArray.length; j++) 
    {
      if(i != j) 
      {
        if(slimeArray[i].collide(slimeArray[j]))
        {
          slimeArray.splice(i, 1);
          j--;
          slimeArray.splice(j, 1);
          if(i > 0)
            i--;
        }
      }
    }
  }
}

function MOTHEROFALLISHOLYDONOTPUSH() {
  while(slimeArray.length > 0) {
    slimeArray.pop();
  }
}

function createSlime(currentX, currentY) 
{
  slimeArray.push(new Slime(spriteSheet, currentX, currentY, Math.floor(random(0, 2)), Math.floor(random(0, 7)), random(-10, 10), random(-10, 10)));
}

function mousePressed()
{
  createSlime(mouseX, mouseY);
}

function keyPressed() {
  if(keyCode == LEFT_ARROW) {
    MOTHEROFALLISHOLYDONOTPUSH();
    sounds.player("chomp").start();
  }
}

class Slime 
{
  //80 x 72
  constructor(spriteSheet, x, y, slimeX, slimeY, speedX, speedY) 
  {
    this.spriteSheet = spriteSheet;
    this.x = x;
    this.y = y;
    this.slimeX = slimeX;
    this.slimeY = slimeY;
    this.speedX = speedX;
    this.speedY = speedY;
    this.facing = 1;
    if(speedX < 0)
      this.facing = -1;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  draw()
  {
    push();
    //console.log(this.slimeY);
    imageMode(CENTER);
    translate(this.x, this.y);
    scale(this.facing, 1);
    if(frameCount % 3 == 0) {
      image(spriteSheet, 0, 0, 200, 200, 0, this.slimeY * 72, 80, 72);
    }
    else{
      image(spriteSheet, 0, 0, 200, 200, 80, this.slimeY * 72, 80, 72);
    }
    pop();
  }

  move()
  {
    if(this.x < 0 || this.x > 1024)
    {
      this.speedX *= -1;
      this.facing *= -1;
    }
    if(this.y < 0 || this.y > 720)
      this.speedY *= -1;


      
    this.x += this.speedX;
    this.y += this.speedY;
  }

  collide(otherSlime) 
  {
    if((this.x > otherSlime.getX() - 40) && (this.x < otherSlime.getX() + 40) && (this.y > otherSlime.getY() - 36) && (this.y < otherSlime.getY() + 36))
    {
      sounds.player("chomp").start();
      return true;
    }
    return false;
  }
}