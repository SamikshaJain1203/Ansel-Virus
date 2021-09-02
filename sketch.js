var PLAY = 1;
var END = 0;
var gameState = PLAY;

var student, student_running, student_collided;
var ground, invisibleGround, groundImage;

var virusGroup, virus1, virus2, virus3, virus4, virus5, virus6;

var score;
var maskNum = 0;
var sanitizerNum = 0;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  pathImg = loadImage("Road.png");
  student_running = loadAnimation("student1-bg.png","student2-bg.png");
  student_collided = loadAnimation("studentcollided.png");
  
 // groundImage = loadImage("ground2.png");
  bgImg = loadImage("HallwayBG1.png");
  
  virus1 = loadImage("OBS1.png");
  virus2 = loadImage("OBS2.png");
  virus3 = loadImage("OBS3.png");
  virus4 = loadImage("OBS4-bg.png");
  virus5 = loadImage("OBS5-bg.png");
  virus6 = loadImage("OBS6-bg.png");
  
  sanitizerImage = loadImage("Sanitizer-bg.png");

  maskImage = loadImage("mask-bg.png");

  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  path=createSprite(width/2,height/2,width,2);
  path.addImage(pathImg);
  path.velocityX = -6;
  
  student = createSprite(100,height-70,20,50);
  student.addAnimation("running", student_running);
  student.addAnimation("collided", student_collided);
  student.scale = 1.5;
  
  /*ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;*/
  
  gameOver = createSprite(width/2,height/2- 120);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.6;
  restart.scale = 0.2;
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  invisibleGround.visible = false;
  
  //create Virus, Sanitizer and Mask Groups
  virusGroup = createGroup();
  sanitizerGroup = createGroup();
  maskGroup = createGroup();
  
  student.setCollider('circle',0,0,50);
  //student.debug = true 
  
  score = 0;
  
}

function draw() {
  
  background(0);

  //displaying score
  textSize(30);
  fill("red");
  text("Distance : " +score, 50,50);
  console.log(score);

  text("Masks : " +maskNum, 50,100);
  console.log(maskNum);
  
  text("Sanitizer : " +sanitizerNum, 50,150);
  console.log(sanitizerNum);
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    student.changeAnimation("running", student_running)
 
    path.velocityX = -(6 + 2*score/100);
    //ground.velocityX = -(4 + 3* score/100);
    
    //scoring
    score = score + Math.round(getFrameRate()/60);
  
      if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    //code to reset the background
  if(path.x < 0 ){
    path.x = path.width/2;
  }
/*
    if (ground.x < 0){
      ground.x = ground.width/2;
    }*/
    
    //jump when the space key is pressed
    if((touches.length > 0 || keyDown("SPACE")) && student.y  >= height-250) {
      jumpSound.play();
      student.velocityY = -23;
       touches = [];
    }
    
    //add gravity
    student.velocityY = student.velocityY + 0.8
  
    //spawn virus, Sanitizer & Masks
    spawnVirus();
    spawnSanitizer();
    spawnMasks();
    
    if(virusGroup.isTouching(student)){
        dieSound.play();
        gameState = END;  
    }

    if(maskGroup.isTouching(student)){
      maskNum = maskNum + 1;
      maskGroup[0].destroy();
    }
    if(sanitizerGroup.isTouching(student)){
      sanitizerNum = sanitizerNum + 1;
      sanitizerGroup[0].destroy();

    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the student animation
      student.changeAnimation("collided", student_collided);
     
      if (mousePressedOver(restart)) {
        if (sanitizerNum > 0 && maskNum > 0) {
          reset();
        }
        else{
          textSize(40);
          fill("red");
          text("Ooppsss...You Forgot to take precautions against Virus..", width/2-300, height/2-200)
        }
      }
     // ground.velocityX = 0;
      student.velocityX = 0;
      path.velocityX = 0

      //set lifetime of the game objects so that they are never destroyed
     virusGroup.setLifetimeEach(-1);
     virusGroup.setVelocityXEach(0);

     sanitizerGroup.setLifetimeEach(-1);
     sanitizerGroup.setVelocityXEach(0);

     maskGroup.setLifetimeEach(-1);
     maskGroup.setVelocityXEach(0);
   
   }
  
  //stop student from falling down
  student.collide(invisibleGround);

  drawSprites();
}

function reset(){ 
  gameState=PLAY;
  virusGroup.destroyEach();
  sanitizerGroup.destroyEach();
  maskGroup.destroyEach();
  score = 0;
  sanitizerNum = 0;
  maskNum = 0;
  
}

function spawnVirus(){
 if (frameCount % 200 === 0){
   var virus = createSprite(width+20,height-10,30,10);
   virus.y = Math.round(random(height-70,height-180));
   virus.velocityX = -(8 + score/100);
   virus.scale = 0.4;
   
    //generate random viruses
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: virus.addImage(virus1);
              break;
      case 2: virus.addImage(virus2);
              break;
      case 3: virus.addImage(virus3);
              break;
      case 4: virus.addImage(virus4);
              break;
      case 5: virus.addImage(virus5);
              break;
      case 6: virus.addImage(virus6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    virus.scale = 0.5;
    virus.lifetime = 600;

   //add each obstacle to the group
    virusGroup.add(virus);
  }
}

function spawnSanitizer() {
  //write code here to spawn the sanitizer
  if (frameCount % 300 === 0) {
    var sanitizer = createSprite(width+20,height-50,30,10);
    sanitizer.y = Math.round(random(height-170,height-350));
    sanitizer.addImage(sanitizerImage);
    sanitizer.scale = 0.5;
    sanitizer.velocityX = -5;
    
     //assign lifetime to the variable
     sanitizer.lifetime = 600;
    
    //adjust the depth
    sanitizer.depth = student.depth;
    student.depth = student.depth+1;
    
    //add each cloud to the group
    sanitizerGroup.add(sanitizer);
  }
  
}


function spawnMasks() {
  
  if (frameCount % 300 === 0) {
    var mask = createSprite(width+20,height-60,30,10);
    mask.y = Math.round(random(height-200,height-300));
    mask.addImage(maskImage);
    mask.scale = 0.5;
    mask.velocityX = -7;
    
     //assign lifetime to the variable
    mask.lifetime = 600;
    
    //adjust the depth
    mask.depth = student.depth;
    student.depth = student.depth+1;
    
    //add each mask to the group
    maskGroup.add(mask);
  }
}