import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import CannonDebugger from 'cannon-es-debugger';
import { Asteroid } from './Asteriod';
import { Spaceship } from './Spaceship';
import { Bullet } from './Bullet';
import { Wall } from './Wall';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';




    const clock = new THREE.Clock();
    const keys = {};
document.addEventListener('keydown', (event) => {
    keys[event.code] = true;
});
document.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});
class Game {
  constructor(){
    this. scene = new THREE.Scene();
    this. camera  = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this. renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this. world = new CANNON.World();
    this.world.gravity.set(0, 0, 0); // Set gravity
    this.camera.position.Z= 5;
    this. cannonDebugger = new CannonDebugger(this.scene,this. world, {
      color: 0x00ff00, // Wireframe color for debug shapes
    });
    this. fog = new THREE.FogExp2(0x87ceeb, 0.1); // Color, density
    this.scene.fog = this.fog;
    this.renderer.setClearColor(0x404040);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-5,- 5,- 5).normalize(); // Set the light direction
    this.scene.add(directionalLight)
    this.gameOver = false;
    this.score =0;
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
    this.clickonce = false;




    //  this. bullet  = new Bullet(this);
    //  this.bullet.show();
    //  this.asteroid = new Asteroid(this);
     this.InitializeObjects();
     }
     InitializeObjects (){
      console.log("obj", this);
      this.spaceship = new Spaceship(this, spaceshipModel.clone());
      this.spaceship.show();
    this.wall = new Wall(this);
    this.unseenAsteroids =[];
    this.seenAsteroids = [];
    this.screenBullets =[];
    this.offScreenbullets =[];
     for(let i=0; i<10; i++ ){
       this.unseenAsteroids.push(new Asteroid(this,asteroidModel.clone()))
       this.offScreenbullets.push(new Bullet(this))
     }

     this.popupAsteroid()
    this.popupAsteroid = this.popupAsteroid.bind(this)
    this.popupInterval =setInterval(this.popupAsteroid,5000)
  
    this.viewHeight = this.getviewHeight(this.camera.position.z);
    this.viewWidth = this.getViewWidthAtDistance(this.camera.position.z, this.camera);
    console.log("view ", this.viewHeight,this.viewWidth)
  }
  popupAsteroid(){
     console.log("unseen asteroid", this.unseenAsteroids);
     if(this.unseenAsteroids.length>0){
    let onjectforscreen = this.unseenAsteroids.pop();
      this.seenAsteroids.push(onjectforscreen);
      // onjectforscreen.cube.position.copy( this.getRandomPointInSphere(new THREE.Vector3(0,0,-10),2))
      onjectforscreen.setPosition( this.getRandomPointInSphere(new THREE.Vector3(0,0,-20),2))
      onjectforscreen.show();
     }
  }
   getRandomPointInSphere(startingPoint, radius) {
    // Generate random spherical coordinates
    const u = Math.random(); // Random number between 0 and 1
    const v = Math.random();
    const theta = 2 * Math.PI * u; // Random angle between 0 and 2π
    const phi = Math.acos(2 * v - 1); // Random angle between 0 and π
    const r = radius * Math.cbrt(Math.random()); // Random radius inside the sphere
  
    // Convert spherical coordinates to Cartesian coordinates
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
  
    // Offset by the starting point
    return new THREE.Vector3(
      startingPoint.x + x,
      startingPoint.y + y,
      startingPoint.z + z
    );
  }
  shoot(){
    let bullet = this.offScreenbullets.pop();
     this.screenBullets.push(bullet);
     bullet.show();
     bullet.shoot();
  }
   getViewWidthAtDistance(distance, camera) {
    // Calculate the height of the view at the specified distance
    console.log("camera distance, fov, aspect ",this.camera.position.z, camera.fov,camera.aspect)
    const height =this.getviewHeight(this.camera.position.z);
    console.log("height",height)
    // Calculate the width based on the aspect ratio
    const width = height * camera.aspect;
    console.log("width",width)

    return width;
}
 getviewHeight(distance){
  console.log("dis",distance);
    return 2 * this.camera.position.Z * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
}

  handleInput(deltaTime) {
    if (this.spaceship) {
        if (keys['ArrowLeft']) {
          console.log("key pressed");
          
          console.log(this.viewWidth);
          console.log(this.viewHeight);
            if(this.spaceship.cube.position.x>= -(this.viewWidth/2)){
              
            this.spaceship.cube.position.x =this.spaceship.cube.position.x - 1*deltaTime;
            }
           
        }
        if (keys['ArrowRight']) {
             if(this.spaceship.cube.position.x<= (this.viewWidth/2)){
                this.spaceship.cube.position.x =  this.spaceship.cube.position.x + 1*deltaTime;
           
             }

        }
        if (keys['ArrowUp']) {
             if(this.spaceship.cube.position.y<= (this.viewHeight/2)){
                this.spaceship.cube.position.y =  this.spaceship.cube.position.y+1*deltaTime;
           
             }

        }
        if (keys['ArrowDown']) {
            if(this.spaceship.cube.position.y>= -(this.viewHeight/2)){
                this.spaceship.cube.position.y = this.spaceship.cube.position.y - 1*deltaTime;
           
            }

        }
    }
   
  }

  gameoverDisplay(){

   
      const overlay = document.getElementById('overlay');
      overlay.style.display = 'block';
    
      document.getElementById("restart").addEventListener('click', (EVT) => {
        console.log(EVT);
        
        if(!this.clickonce  ){
          const overlay = document.getElementById('overlay');
          overlay.style.display = 'none';
          console.log("click");
          this.Restart();
          this.clickonce = true;
        }
       
       
       //
      });
    
  }
   changeScore(value){
    const overlay = document.getElementById('score');
    let scr = 'Score : '+value;
      overlay.innerHTML = 'Score : '+value;
     
  }

  Restart(){
    this.score=0;
    this.changeScore(this.score);
   
    for(let i=0;i< this.seenAsteroids.length; i++){
      this.seenAsteroids[i].hide();
      this.unseenAsteroids.push(this.seenAsteroids[i]);

    }
    this.seenAsteroids = [];
    for(let i=0;i< this.screenBullets.length; i++){
      this.screenBullets[i].hide();
      this.offScreenbullets.push(this.screenBullets[i]);
      this.offScreenbullets.setPosition(new THREE.Vector3(0,0,-10))
       this.screenBullets[i].body.velocity.set(0,0,0);
      
    }
    this.screenBullets = [];
    this.spaceship.show();
    this.spaceship.setPosition(new THREE.Vector3(0,0,-5))
    this.gameOver = false;
     this .popupAsteroid();
     this.popupInterval = setInterval(this.popupAsteroid,5000)
    console.log("restRT");

  }
}
let game ;
function animate() {
  requestAnimationFrame(animate);
if(game){
  const deltaTime = clock.getDelta();
  game.handleInput(deltaTime);
  game.spaceship.update(deltaTime);
  if(!game.gameOver){
  for(let i=0;i< game.seenAsteroids.length; i++){
    //  console.log(game.seenAsteroids);
    game.seenAsteroids[i].update(deltaTime);
  }
  let removable =[];
  for(let i=0; i< game.screenBullets.length; i++){
       game.screenBullets[i].update(deltaTime)
      game.screenBullets[i].body.position<-20;
      removable.push(game.offScreenbullets[i])
       
  }
   if(removable.length>0){
    for(let i=0; i<removable.length; i++){
      game.screenBullets= game.screenBullets.filter(item => item !== removable[i])

    }
  }
   }
else{
  console.log("clear intervals");
   clearInterval(game.popupInterval);
}
  // Step physics world
  game.world.step(1 / 60);
   game.camera.updateProjectionMatrix();
  // this.cube.position.copy (this.body.position);
  // game.bullet.cube.position.copy(game.bullet.body.position)

  // game.cannonDebugger.update()
  // Log position for debugging
//   console.log('Body position:', body.position);
  game.renderer.render(game.scene, game.camera);
}
}
animate();
window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    console.log('Space key pressed!');
    game.shoot(); // Call the shootBullet function when space is pressed
  }
})

window.addEventListener('resize', () => {
  game.renderer.setSize(window.innerWidth, window.innerHeight);
  game.camera.aspect = window.innerWidth / window.innerHeight;
  game.camera.updateProjectionMatrix();
  game.viewHeight = game.getviewHeight(game.camera.position.z);
  game.viewWidth = game.getViewWidthAtDistance(game.camera.position.z,camera);
});
let spaceshipModel ;
 const loader = new FBXLoader();
loader.load('./assets/fbx/spaceship.fbx',function (object){
 
  object.scale.set(0.001,0.001,0.001);
  object.position.set(0 ,0,0);
  object.rotation.set(0,-90,0);
  // spaceship.show();
  object.traverse(function(child){
      if(child.isMesh){
           child.castShadow = true;
           child.recieveShadow = true;
      }
      spaceshipModel = object;
  });


 console.log(object);
})

let asteroidModel;

loader.load('./assets/fbx/asteriod.fbx',function (object){
  
  object.scale.set(0.03,0.03,0.03);
  object.position.set(0 ,0,0);
  // scene.add(object);
  object.traverse(function(child){
      if(child.isMesh){
           child.castShadow = true;
           child.recieveShadow = true;
      }
  });
  object.update=()=>{
    object.position.z = object.position.z+0.1;
  }
  asteroidModel= object;
  // initializeAsteriods();
 
 console.log(object);
})
let loadercheck = setInterval(checkmodelload,1000)
function checkmodelload(){
if(asteroidModel && spaceshipModel){
  game = new Game();
  clearInterval(loadercheck);
}
}
