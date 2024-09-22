import * as CANNON from 'cannon-es';

  export class Wall{
    constructor(game){
    // this. geometry = new THREE.BoxGeometry(1, 1, 1);
    //       this. material = new THREE.MeshBasicMaterial({ color: 0x7186b9 });
    //       this. cube = new THREE.Mesh(this.geometry, this.material);
      this.body =  new CANNON.Body({
        mass: 0,
        shape: new CANNON.Box(new CANNON.Vec3(100, 100, 2 )),
        position: new CANNON.Vec3(0, 0, 10),
      });
    this.body.angularFactor.set(0, 0, 0);

      // game.scene.add(this.cube);
      game.world.addBody(this.body);
      console.log(this.body);
      this.body.wakeUp();
      // this.cube.position.copy(this.body.position)
      // this.body.angularFactor.set(0, 0, 0);
      this.addCollider();
      this.game = game;
    }
    addCollider(){
      this.body.addEventListener('collide', (event)=>{
        console.log("wall collided Collided");
       let removable = [];
      for(let i=0;i< this.game.seenAsteroids.length;i++){
          if(event.body ==this.game.seenAsteroids[i].body){
          
             this.game.unseenAsteroids.push(this.game.seenAsteroids[i]);
             removable.push(this.game.seenAsteroids[i]);
             this.game.seenAsteroids[i].hide();
          }
      }
      for (let i=0; i<removable.length;i++){
        this.game.seenAsteroids= this.game.seenAsteroids.filter(item => item !== removable[i])
      }
      })
    }

    }