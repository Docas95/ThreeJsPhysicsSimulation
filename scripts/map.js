import * as THREE from 'three';

class Map{
    constructor(width, height, floorColors, floorMap, models, modelsMap){
        this.width = width;
        this.height = height;
        this.floorColors = floorColors;
        this.floorMap = floorMap;
        this.models = models;
        this.modelsMap = modelsMap;
    }
    
    drawFloor(scene){
        const geometryPlane = new THREE.BoxGeometry(1, 1, 0.5); 
        for(let i = 0; i < this.width; i++){
            for(let j = 0; j < this.height; j++){
                const materialPlane = new THREE.MeshPhongMaterial({color: this.floorColors[this.floorMap[i][j]]});
                const plane = new THREE.Mesh(geometryPlane, materialPlane);
                plane.position.set(i * 1, j * 1, 0);
                plane.receiveShadow = true;
                scene.add(plane);
            }  
        }
    }

    drawModels(scene){
        for(let i = 0; i < this.width; i++) {
            for(let j = 0; j < this.height; j++) {
                if(this.modelsMap[i][j] > 0) {
                    const modelIndex = this.modelsMap[i][j] - 1; 
                    const modelClone = this.models[modelIndex].clone();
                    modelClone.position.set(i * 1, j * 1, 1.2);
                    modelClone.rotateX(Math.PI / 2);
                    scene.add(modelClone);
                }
            }
        }
    }
}

export default Map;