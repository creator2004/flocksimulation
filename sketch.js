let boidarr=[];
let predvar = 0;
function setup() {
  createCanvas(400, 400);
  this.i=0;
  this.mouseposition=createVector(0,0);
  class Boid {
    constructor() {
  this.separation=createVector(0,0);
  this.hawkavoidance=createVector(0,0);
  this.cohesion=createVector(0,0);
  this.steering=createVector(0,0);
  this.finalForce=createVector(0,0);
 this.position=createVector(random(0,400),random(0,400));
//this.position=createVector(200,200);
  this.velocity=createVector(random(-1,1),random(-1,1));
  this.acceleration=createVector(random(-1,1),random(-1,1));
this.maxspeed=1;
    }
  }
  class Predator {
    constructor() {
      this.finalForce=createVector(0,0);
      this.attack=createVector(0,0);
      this.position=createVector(random(0,400),random(0,400));
      this.velocity=createVector(random(-1,1),random(-1,1));
      this.acceleration=createVector(random(-1,1),random(-1,1));
      this.maxspeed=2;
    }
  }
  for (let i=0;i<=29;i++) {
  window["boid"+i]=new Boid();
  boidarr.push(window["boid"+i]);
}
  
  Hawk0=new Predator();
}


function draw() {
  //BOID SECTION//
  background(230,230,250);
  function updateposvelacc(boid) {
    boid.velocity.add(boid.acceleration);
    boid.position.add(boid.velocity);
    if (boid.velocity.mag()>=boid.maxspeed) {
      boid.velocity = boid.velocity.normalize().mult(boid.maxspeed);
    }
    if (boid.acceleration.mag()>=boid.maxspeed) {
      boid.acceleration = boid.acceleration.normalize();
    }
    boid.acceleration=createVector(0,0);
  }
  
  function edges(boid) {
    if (boid.position.x>400) {
      boid.position.x=0;
    }
    if (boid.position.x<0) {
      boid.position.x=400;
    }
    if (boid.position.y<0) {
      boid.position.y=400;
    }
    if (boid.position.y>400) {
      boid.position.y=0;
    }
  }
  
  function separate(boid) {
    let distance=createVector(0,0);
    boidarr.forEach(function(elem) {     distance=dist(boid.position.x,boid.position.y,elem.position.x,elem.position.y);
      if (distance>0&&distance<=20) {
      boid.separation = p5.Vector.sub(boid.position, elem.position);
      boid.separation.normalize();
      boid.separation.div(distance);
      return boid.separation;
      }
    })
  }
  
  function avoidpredator(boid) {
    if(predvar===1) {
    let distance=createVector(0,0);    distance=dist(boid.position.x,boid.position.y,Hawk0.position.x,Hawk0.position.y);
      if (distance>0&&distance<=40) {
      boid.hawkavoidance = p5.Vector.sub(boid.position, Hawk0.position);
      boid.hawkavoidance.normalize();
      boid.hawkavoidance.div(distance).mult(10);
      return boid.hawkavoidance;
      }
    }
  }
  
  function align(boid) {
  let averagevel = createVector(0,0);
  boidarr.forEach(function(elem) {
    averagevel.add(elem.velocity);
  })
  averagevel.div(30);
  averagevel.normalize();
  if (predvar===1) {
  boid.steering=averagevel.sub(boid.velocity).div(8);
  } else if (predvar===0){
  boid.steering=averagevel.sub(boid.velocity).div(5);
  }
  return boid.steering;
}
  function SeekCenterMass(boid) {
  if(this.i===0) {
  let averagex=0;
  let averagey=0;
  boidarr.forEach(function(elem){
    averagex+=elem.position.x;
    averagey+=elem.position.y;
  })
  averagex=averagex/30;
  averagey=averagey/30;
  averagePos=createVector(averagex,averagey);
  boid.cohesion=averagePos.sub(boid.position);
  if (predvar===0){
  boid.cohesion.normalize().div(20);
  } else if (predvar===1) {
  boid.cohesion.normalize().div(20);
  }
  return boid.cohesion;
  }
}
  
  function applyrules(boid) {
    separate(boid); 
    align(boid);
    SeekCenterMass(boid);
    if (predvar===1) {
    avoidpredator(boid);
    }
    boid.finalForce.add(boid.separation);
    boid.finalForce.add(boid.cohesion);
    boid.finalForce.add(boid.steering);
    if (predvar===1) {
    boid.finalForce.add(boid.hawkavoidance);
    }
    boid.acceleration.add(boid.finalForce);
    boid.finalForce=createVector(0,0);
  }
  
  function render(boid) {
    let theta = boid.velocity.heading() + radians(90);
   fill(100);
   stroke(200);
   push();
   translate(boid.position.x, boid.position.y);
   rotate(theta);
   beginShape();
   vertex(0, -5 * 2);
   vertex(-5, 5 * 2);
   vertex(5, 5 * 2);
   endShape(CLOSE);
   pop();
  }
  boidarr.forEach(function(elem){
    updateposvelacc(elem);
    applyrules(elem);
    edges(elem);
    render(elem);
  })
  //END BOID SECTION//
  
  //ENTER PREDATOR SECION//
  function updatepredatorvectors(predator) {
    predator.velocity.add(predator.acceleration);
    predator.position.add(predator.velocity);
    if (predator.velocity.mag()>=predator.maxspeed) {
      predator.velocity = predator.velocity.normalize().mult(predator.maxspeed);
    }
    if (predator.acceleration.mag()>=predator.maxspeed) {
      predator.acceleration = predator.acceleration.normalize();
    }
    predator.acceleration=createVector(0,0);
  }
  
  function renderpredator(predator) {
    let theta = predator.velocity.heading() + radians(90);
   fill(250,80,80);
   stroke(200);
   push();
   translate(predator.position.x, predator.position.y);
   rotate(theta);
   beginShape();
   vertex(0, -5 * 2);
   vertex(-5, 5 * 2);
   vertex(5, 5 * 2);
   endShape(CLOSE);
   pop();
  }
  function predatoredges(predator) {
    if (predator.position.x>400) {
      predator.position.x=0;
    }
    if (predator.position.x<0) {
      predator.position.x=400;
    }
    if (predator.position.y<0) {
      predator.position.y=400;
    }
    if (predator.position.y>400) {
      predator.position.y=0;
    }
  }
  
  function seekprey(predator) {
    let distance=createVector(0,0);
    boidarr.forEach(function(elem) {     distance=dist(predator.position.x,predator.position.y,elem.position.x,elem.position.y);
      if (distance>10&&distance<=50) {
      predator.attack = p5.Vector.sub(elem.position,predator.position);
      predator.attack.normalize();
      predator.attack.div(distance);
      return predator.attack;
      }
    })
  }
  
  function applypredatorrules(predator) {
    seekprey(predator); 
    predator.finalForce.add(predator.attack);
    predator.acceleration.add(predator.finalForce);
    predator.finalForce=createVector(0,0);
  }
  
  if (predvar===1) {
  applypredatorrules(Hawk0);
  updatepredatorvectors(Hawk0);
  renderpredator(Hawk0);
  predatoredges(Hawk0);
  }
}
function mousePressed () {
    this.i=1
    let subthis=createVector(200,200);
    boidarr.forEach(function (elem) {
    elem.cohesion=createVector(mouseX,mouseY);
    elem.cohesion.sub(subthis);
    elem.cohesion.normalize().div(20);
    return elem.cohesion;
    })
  }
function mouseReleased () {
  this.i=0;
}
function touchStarted () {
    this.i=1
    let subthis=createVector(200,200);
    boidarr.forEach(function (elem) {
    elem.cohesion=createVector(mouseX,mouseY);
    elem.cohesion.sub(subthis);
    elem.cohesion.normalize().div(20);
    return elem.cohesion;
    })
  }
function touchEnded() {
  this.i=0;
}

function createPredator() {
  predvar=1;
}
function removePredator() {
  predvar=0;
}
