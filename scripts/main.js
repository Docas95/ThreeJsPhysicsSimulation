import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';


function loadModel(url){
    return new Promise((model, reject) => {
        const loader = new GLTFLoader();
        loader.load(url, (gltf) => model(gltf.scene), undefined, (error) => reject(error));
    });
}


async function main(){

    // *** Load 3D models ***
    // **********************
    var treeModelA, treeModelB, car; 
    treeModelA = await loadModel("./models/treeA/treeA.gltf");
    treeModelB = await loadModel("./models/treeB/treeB.gltf");
    treeModelB.scale.set(0.5, 0.5, 0.5);
    car = await loadModel("./models/low-poly_truck_car_drifter/scene.gltf");

    treeModelA.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
        }
    });
    treeModelB.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
        }
    });

    // *** Map costumization ***
    // *************************
    const mapWidth = 10;
    const mapHeight = 10;

    const floorColors = [0x1A1A19, 0x31511E];
    const floorMap = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    const models = [treeModelA, treeModelB];
    const modelsMap = [
        [1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    ];

    // *** Basic Renderer, Scene, Camera set up ***
    // ********************************************
    const c = document.querySelector("#c");

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xBBCCEE);

    const camera = new THREE.PerspectiveCamera(75, c.clientWidth / c.clientHeight, 0.1, 1000);
    const controls = new OrbitControls(camera, c);
    camera.position.set(0, 0, 10);
    controls.lo

    const renderer = new THREE.WebGLRenderer({canvas: c});
    renderer.setSize(c.clientWidth, c.clientHeight);
    document.body.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;


    // *** Set up floor plane ***
    // **************************
    const geometryPlane = new THREE.BoxGeometry(1, 1, 0.5); 
    for(let i = 0; i < mapWidth; i++){
        for(let j = 0; j < mapHeight; j++){
            const materialPlane = new THREE.MeshPhongMaterial({color: floorColors[floorMap[i][j]], side: THREE.DoubleSide});
            const plane = new THREE.Mesh(geometryPlane, materialPlane);
            plane.position.set(i * 1, j * 1, 0);
            plane.receiveShadow = true;;
            scene.add(plane);
        }
    }

    // *** Place models ***
    // ********************
    for(let i = 0; i < mapWidth; i++) {
        for(let j = 0; j < mapHeight; j++) {
            if(modelsMap[i][j] > 0) {
                const modelIndex = modelsMap[i][j] - 1; 
                const modelClone = models[modelIndex].clone();
                modelClone.position.set(i * 1, j * 1, 1.2);
                modelClone.rotateX(Math.PI / 2)
                scene.add(modelClone);
            }
        }
    }

    // *** Add lights ***
    // *****************
    const dirLight = new THREE.DirectionalLight(0xFFFFFF, 4);
    dirLight.position.set(10,10,10);
    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.left = -15;
    dirLight.shadow.camera.right = 15;
    dirLight.shadow.camera.top = 15;
    dirLight.shadow.camera.bottom = -15;

    scene.add(dirLight);

    // *** Animation loop ***
    // **********************
    function animate() {
        controls.update();
        requestAnimationFrame(animate); 
        renderer.render(scene, camera);
    }
    animate();

}

main();