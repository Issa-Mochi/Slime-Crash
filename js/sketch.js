let spriteSheet;
let backgroundSprite;

let serialPDM;        
let portName = 'COM7';
let sensors;
let xBorder = 1024;
let yBorder = 720;
let slimeArray = [];
let backgroundsx = 0;


const sounds = new Tone.Players({
  chomp: "Media/Cartoon_Chomp_Sound_Effect_(getmp3.pro)_01.mp3",
}).toDestination();

let synth = new Tone.FMSynth().toDestination();

let synth2 = new Tone.DuoSynth().toDestination();

var synthJSON = {"harmonicity":8,
"modulationIndex": 2,
"oscillator" : {
    "type": "sine"
},
"envelope": {
    "attack": 0.001,
    "decay": 2,
    "sustain": 0.1,
    "release": 2
},
"modulation" : {
    "type" : "square"
},
"modulationEnvelope" : {
    "attack": 0.002,
    "decay": 0.2,
    "sustain": 0,
    "release": 0.2
}};

var synth2JSON = {
  "harmonicity":8,
  "modulationIndex": 2,
  "oscillator" : {
      "type": "sine"
  },
  "envelope": {
      "attack": 0.001,
      "decay": 2,
      "sustain": 0.1,
      "release": 2
  },
  "modulation" : {
      "type" : "square"
  },
  "modulationEnvelope" : {
      "attack": 0.002,
      "decay": 0.2,
      "sustain": 0,
      "release": 0.2
  }
};

var effect1 = new Tone.Vibrato();
var effect1JSON = {
  "frequency": 2.3,
  "depth": 0.4,
  "type": "triangle",      
  "wet": 0.5
};

let part = new Tone.Sequence((time, note) => {
    
  synth.triggerAttackRelease(note, "8n", time+.25);
}, ["C4", "G4" , "E4", "G4", "B4", "A4", "C5"]);

function preload()
{
  spriteSheet = loadImage("Media/d72dd39c-55a5-4032-9a6f-9bb66a8b09f3.png");
  backgroundSprite = loadImage("Media/beegspriteSheet.png");
}

function setup() {
  serialPDM = new PDMSerial(portName);
  sensors = serialPDM.sensorData;
  createCanvas(xBorder, yBorder);

  synth.set(synthJSON);
  effect1.set(effect1JSON);
  synth.connect(effect1);

  synth2.set(synth2JSON);

  
  Tone.start();
  Tone.Transport.bpm.value = 80;
  part.start();
  Tone.Transport.start();
  
}

function draw() {
  killAllButton();
  imageMode(CORNER);
  image(backgroundSprite, 0, 0, xBorder, yBorder, backgroundsx * 512, 0, 512, 512);
  if(frameCount % 12 == 0) {
    backgroundsx++;
    if(backgroundsx == 3) {
      backgroundsx = 0;
    }
  }
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
  sounds.player("chomp").start();
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
  //play sound to spawn
  synth2.triggerAttackRelease("C3", "16n");
  serialPDM.transmit('spawnLED', 1);
  serialPDM.transmit('spawnLED', 0);
  
}
function killAllButton() {
  if(sensors.p7 == 1) {
    MOTHEROFALLISHOLYDONOTPUSH();
  }
}
function keyPressed() {
  if(keyCode == LEFT_ARROW) {
    MOTHEROFALLISHOLYDONOTPUSH();
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
    if(frameCount % 10 == 0) {
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

    let speedMultiplier = 1;
    //console.log(sensors.a0);
    if(sensors.float0 * 1023 < 341) {
      speedMultiplier = .5;
    }
    else if(sensors.float0 * 1023 < 682) {
      speedMultiplier = 1;
    }
    else if(sensors.float0 * 1023 < 1023) {
      speedMultiplier = 2;
    }
      
    this.x += this.speedX * speedMultiplier;
    this.y += this.speedY * speedMultiplier;
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