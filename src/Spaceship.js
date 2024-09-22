import * as CANNON from 'cannon-es';
import * as THREE from 'three';
export class Spaceship{

    constructor(gameobj,model){
    
      this. geometry = new THREE.BoxGeometry(.5, .5, .5);
          this. material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
          this. cube = new THREE.Mesh(this.geometry, this.material);
      this.body =  new CANNON.Body({
        mass: 1,
        shape: new CANNON.Box(new CANNON.Vec3(0.25, 0.25, 0.25)),
        position: new CANNON.Vec3(0, 0, 4),
      });
      this.body.angularFactor.set(0, 0, 0);
      this.game = gameobj
      this.cube  = model;
      console.log(this.cube);
      this.body.wakeUp();
      this.cube.position.set(0,0,-4);
       this.addCollider();
       this.collidedOnce;
       }
       show(){
        this.game.scene.add(this.cube);
        this.game.world.addBody(this.body);
       }
       hide(){
        this.game.scene.remove(this.cube);
        this.game.world.removeBody(this.body);
       }
       update(deltaTime){
        this.body.position.copy(this.cube.position);
       }
       setPosition(pos){
        this.cube.position.copy(pos);
        this.body.position.copy(pos);
       }
    addCollider(){
    this.body.addEventListener('collide', (event)=>{
   
   
      let removable = [];
      for(let i=0;i< this.game.seenAsteroids.length;i++){
          if(event.body == this.game.seenAsteroids[i].body){
          
             this.game.unseenAsteroids.push(this.game.seenAsteroids[i]);
             removable.push(this.game.seenAsteroids[i]);
             this.game.seenAsteroids[i].hide();
             this.hide ();
             this.game.gameOver = true;
             if(!this.collidedOnce){
             this.game.gameoverDisplay();
             this.collideOnce = true;
            this.game.clickonce = false;
          }
      }
      for (let i=0; i<removable.length;i++){
        this.game.seenAsteroids= this.game.seenAsteroids.filter(item => item !== removable[i])
      }
      
        }
      console.log("space ship collided Collided");
    })
  }
 
  }