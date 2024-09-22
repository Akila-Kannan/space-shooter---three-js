import * as CANNON from 'cannon-es';
import * as THREE from 'three';
export class Bullet{
    constructor(game){
     
      this. geometry = new THREE.BoxGeometry(1, 1, 1);
          this. material = new THREE.MeshBasicMaterial({ color: 0x7186b9 });
          this. cube = new THREE.Mesh(this.geometry, this.material);
      this.body =  new CANNON.Body({
        mass: 1,
        shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
        position: new CANNON.Vec3(0, 0, -5),
      });
      this.body.angularFactor.set(0, 0, 0);
      this.game = game;
      console.log(this.cube);
      this.body.wakeUp();
      this.cube.position.copy(this.body.position)
      this.addCollider();
      //  this.cube.position.copy (this.body.position);
    
    
    }
    show(){
      this.game.scene.add(this.cube);
      this.game.world.addBody(this.body);
     }
     hide(){
      this.game.scene.remove(this.cube);
    this.game.world.removeBody(this.body);
    this.body.velocity.set(0,0,0);
  }
    shoot(){
      console.log("shoot");
      this.body.position.set(this.game.spaceship.cube.position.x,this.game.spaceship.cube.position.y,this.game.spaceship.cube.position.z-1 );
      const impulse = new CANNON.Vec3(0, 0,-50); // Impulse in X direction
      const worldPoint = new CANNON.Vec3(0, 0, 0); // Apply at the center of mass
      this.body.applyImpulse(impulse, worldPoint);
    }
    addCollider(){
      this.body.addEventListener('collide', (event)=>{
        console.log("bullet Collided");
        let removable = [];
        for(let i=0;i< this.game.seenAsteroids.length;i++){
            if(event.body == this.game.seenAsteroids[i].body){
            
               this.game.unseenAsteroids.push(this.game.seenAsteroids[i]);
               removable.push(this.game.seenAsteroids[i]);
               this.game.seenAsteroids[i].hide();
               this.game.score++;
         console.log("score ",score);
        this.game.changeScore(this.game.score)
            }
        }
        for (let i=0; i<removable.length;i++){
          this.game.seenAsteroids= this.game.seenAsteroids.filter(item => item !== removable[i])
        }
        this.hide();
        
        this.game.screenBullets= this.game.screenBullets.filter(item => item !== this)
        this.game.offScreenbullets.push(this);
       
      })
    }
  
   
    update(deltaTime){
      this.cube.position.copy(this.body.position);
    }
    }