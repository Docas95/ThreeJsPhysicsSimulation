import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

import * as CANNON from 'cannon-es';

class Car{
    modelUrl = "./models/car/untitled.gltf";
    model;
    moveSpeed = 50;
    rotationSpeed = 50;
    physicsBody;
    
    constructor(){
        let cubeShape = new CANNON.Box(new CANNON.Vec3(0.3,0.2,0.5));
        this.physicsBody = new CANNON.Body({mass: 100});
        this.physicsBody.addShape(cubeShape);
        this.physicsBody.position.set(5, 4, 5);

        this.physicsBody.linearFactor = new CANNON.Vec3(1, 0.2, 1); 
        this.physicsBody.angularFactor = new CANNON.Vec3(0, 1, 0);
    }


    setPosition(x, y, z){
        this.model.position.set(x, y, z);
        this.physicsBody.position.set(x, y, z);
    }

    async addToScene(scene){
        this.model = await loadModel(this.modelUrl);
        modelCastShadows(this.model);
        this.model.position.set(5, 4, 5);

        scene.add(this.model);
    }

    addToWorld(world){
        world.addBody(this.physicsBody);
    }

    move(keyboard, dt){
        let moved = false;
        if(keyboard[87]){
            this.physicsBody.applyLocalForce(new CANNON.Vec3(0, 0, this.moveSpeed * dt));
            moved = true;
        }
        if(keyboard[83]){
            this.physicsBody.applyLocalForce(new CANNON.Vec3(0, 0, -this.moveSpeed * dt));
            moved = true;
        }
        if(keyboard[65]){
            this.physicsBody.applyTorque(new CANNON.Vec3(0, this.rotationSpeed, 0));
        }    
        if(keyboard[68]){
            this.physicsBody.applyTorque(new CANNON.Vec3(0, -this.rotationSpeed, 0));
        }
        this.model.position.set(this.physicsBody.position.x, this.physicsBody.position.y - 0.2, this.physicsBody.position.z);
        this.model.quaternion.copy(this.physicsBody.quaternion);
    }
}

function loadModel(url){
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
            url,
            (gltf) => resolve(gltf.scene),
            undefined,
            (error) => reject(error)
        );
    });
}

function modelCastShadows(model){
    model.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
        }
    });
}

export default Car;