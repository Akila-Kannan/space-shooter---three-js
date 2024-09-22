import * as CANNON from 'cannon-es';
import * as THREE from 'three';
export class Asteroid{
    constructor(game,model){
   
  //  this. geometry = new THREE.BoxGeometry(1, 1, 1);
  //      this. material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  //      this. cube = new THREE.Mesh(this.geometry, this.material);
   this.body =  new CANNON.Body({
     mass: 1,
     shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5 )),
     position: new CANNON.Vec3(0, 0, -5),
   });
   this.body.angularFactor.set(0, 0, 0);
   this.game = game;
   this.cube = model;
   console.log(this.cube);
   this.body.wakeUp();
   this.cube.position.copy(this.body.position)
    }
    show(){
     this.game.scene.add(this.cube);
     this.game.world.addBody(this.body);
    }
    hide(){
     this.game.scene.remove(this.cube);
   this.game.world.removeBody(this.body);}

   update(deltaTime){
     this.cube.position.z = this.cube.position.z+ (1*deltaTime);
     this.body.position.copy(this.cube.position)
   }
   setPosition(pos){
    this.cube.position.copy(pos);
    this.body.position.copy(pos);
   }
 }