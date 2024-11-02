import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

import * as CANNON from 'cannon-es';

class Map{
    // measurements
    width;
    height;

    // default floor colors and tree models
    floorColors = [0x1A1A19, 0x31511E];
    modelsNum = 2;
    modelUrls = ["./models/treeA/untitled.gltf", "./models/treeB/untitled.gltf"];
    
    // maps
    floorMap;
    modelsMap;

    // physics
    mapPhysicsBody;


    constructor(width, height, floorMap, modelsMap){
        this.width = width;
        this.height = height;
        this.floorMap = floorMap;
        this.modelsMap = modelsMap;

        let planeShape = new CANNON.Box(new CANNON.Vec3(this.width / 2, 0.01, this.height / 2));
        this.mapPhysicsBody = new CANNON.Body({mass: 0});
        this.mapPhysicsBody.addShape(planeShape);
        this.mapPhysicsBody.position.set(this.width / 2 - 1, 0,  this.height / 2 - 1);

        for(let i = 0; i < this.width; i++) {
            for(let j = 0; j < this.height; j++) {
                if(this.modelsMap[i][j] > 0) {
                    let treeShape = new CANNON.Box(new CANNON.Vec3(0.5,1.0,0.5));
                    this.mapPhysicsBody.addShape(treeShape, new CANNON.Vec3(i - this.width / 2 + 1, 0.5, j - this.height / 2 + 1));
                }
            }
        }
    }
    
    getWidth(){
        return this.width;
    }

    getHeight(){
        return this.height;
    }

    async drawFloor(scene){
        const geometryPlane = new THREE.PlaneGeometry(1.0, 1.0);
        geometryPlane.rotateX(-Math.PI / 2);
        for(let i = 0; i < this.width; i++){
            for(let j = 0; j < this.height; j++){
                const materialPlane = new THREE.MeshPhongMaterial({color: this.floorColors[this.floorMap[i][j]]});
                const plane = new THREE.Mesh(geometryPlane, materialPlane);
                plane.position.set(i * 1,0,  j * 1);
                plane.receiveShadow = true;
                scene.add(plane);
            }  
        }
    }

    async drawModels(scene){
        let models = [];
        for(let i = 0; i < this.modelsNum; i++){
            models[i] = await loadModel(this.modelUrls[i]);
            modelCastShadows(models[i]);
        }

        for(let i = 0; i < this.width; i++) {
            for(let j = 0; j < this.height; j++) {
                if(this.modelsMap[i][j] > 0) {
                    const modelIndex = this.modelsMap[i][j] - 1; 
                    const modelClone = models[modelIndex].clone();
                    modelClone.position.set(i * 1, 0, j * 1);
                    scene.add(modelClone);
                }
            }
        }
    }

    addPhysics(world){
        world.addBody(this.mapPhysicsBody);
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

export default Map;