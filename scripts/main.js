import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import Map from './map.js';
import Car from './car.js';
import { timerGlobal } from 'three/webgpu';

var c, scene, camera, renderer, controls;
var car;

var keyboard = {};

var lastFrame = 0.0;


// *** set up camera, renderer and scene ***
// *****************************************
function init(){
    c = document.querySelector("#c");

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x4A628A);

    camera = new THREE.PerspectiveCamera(75, c.clientWidth / c.clientHeight, 0.1, 1000);
    controls = new OrbitControls(camera, c);
    camera.position.set(0, 0, 10);
    controls.lo

    renderer = new THREE.WebGLRenderer({canvas: c});
    renderer.setSize(c.clientWidth, c.clientHeight);
    document.body.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;
}

// *** Load 3D model ***
// *********************
function loadModel(url){
    return new Promise((model, reject) => {
        const loader = new GLTFLoader();
        loader.load(url, (gltf) => model(gltf.scene), undefined, (error) => reject(error));
    });
}

// *** Animation loop ***
// **********************
function animate() {
    var currentFrame = Date.now();
    var deltaT = currentFrame - lastFrame;

    car.move(keyboard, deltaT);

    controls.update();

    requestAnimationFrame(animate); 
    renderer.render(scene, camera);
    lastFrame = currentFrame;
}

// *** Process User Input ***
// **************************
function addKeysListener(){
    window.addEventListener('keydown', function(event){
        keyboard[event.keyCode] = true;
    }, false);
    window.addEventListener('keyup', function(event){
        keyboard[event.keyCode] = false;
    }, false);
}

async function main(){
    init();

    // *** Load 3D models ***
    // **********************
    var treeModelA, treeModelB, carModel; 
    treeModelA = await loadModel("./models/treeA/treeA.gltf");
    treeModelB = await loadModel("./models/treeB/treeB.gltf");
    treeModelB.scale.set(0.5, 0.5, 0.5);
    carModel = await loadModel("./models/low-poly_truck_car_drifter/untitled.gltf");
    carModel.rotateX(Math.PI / 2);

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

    carModel.traverse((node) =>{
        if(node.isMesh) {
            node.castShadow = true;
        }
    })

    // *** Process User Input ***
    // **************************
    addKeysListener();

    // *** Map costumization ***
    // *************************
    const mapWidth = 20;
    const mapHeight = 20;

    const floorColors = [0x1A1A19, 0x31511E, 0xF6FCDF];
    const floorMap = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    const models = [treeModelA, treeModelB];
    const modelsMap = [
        [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
        [2, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 1],
        [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2],
        [2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2],
        [2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
        [1, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 2],
        [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1]
    ];
    var map = new Map(mapWidth, mapHeight, floorColors, floorMap, models, modelsMap);   
    map.drawFloor(scene);
    map.drawModels(scene);

    // *** Place Car ***
    // ******************
    car = new Car(carModel);
    car.setPosition(16, 8, 0.25);
    car.addToScene(scene);

    // *** Add lights ***
    // *****************
    const dirLight = new THREE.DirectionalLight(0xBBBBFF, 4);
    dirLight.position.set(30,30,30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    scene.add(dirLight);

    const ambLight = new THREE.AmbientLight(0xBBBBFF, 0.3);
    scene.add(ambLight);


    animate();
}

main();