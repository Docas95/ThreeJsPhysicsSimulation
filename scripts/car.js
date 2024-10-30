import * as THREE from 'three';

class Car{
    model = new THREE.Mesh();
    speed = 0.005;
    constructor(model){
        this.model = model.clone();
    }

    setPosition(x, y, z){
        this.model.position.set(x, y, z);
    }

    addToScene(scene){
        scene.add(this.model);
    }

    move(keyboard, dt){
        if(keyboard[87]){
            this.model.translateZ(-this.speed * dt);
        }
        if(keyboard[83]){
            this.model.translateZ(this.speed * dt);
        }
        if(keyboard[65]){
            this.model.translateX(-this.speed * dt);
        }
        if(keyboard[68]){
            this.model.translateX(this.speed * dt);
        }
    }
}

export default Car;