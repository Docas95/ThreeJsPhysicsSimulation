import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

import Map from './map.js';
import Car from './car.js';

async function main(){
    // *** Set up: scene, camera, renderer ***
    // ***************************************
    var c, scene, camera, renderer, controls;
    c = document.querySelector("#c");

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x4A628A);

    camera = new THREE.PerspectiveCamera(75, c.clientWidth / c.clientHeight, 0.1, 1000);
    controls = new OrbitControls(camera, c);

    renderer = new THREE.WebGLRenderer({canvas: c});
    renderer.setSize(c.clientWidth, c.clientHeight);
    document.body.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;

    // *** Set up: physics ***
    // ***********************
    var world = new CANNON.World();
    world.gravity.set(0, -9.8, 0);
    let timestep = 1/60;

    // *** Visualize physics bodies ***
    // ********************************
    var canonDebugger = initCanonDebugger(scene, world); 

    // *** Set up map ***
    // ******************
    var map = setUpMap();
    map.drawFloor(scene);
    await map.drawModels(scene);
    map.addPhysics(world);

    camera.position.set(map.getWidth()/2, map.getHeight()/2, 30);
    camera.lookAt(map.getWidth()/2, map.getHeight()/2, 0);

    // *** Create car ***
    // ******************
    var car = new Car();
    await car.addToScene(scene);
    car.addToWorld(world);

    // *** Add lights ***
    // ******************
    addLight(scene);

    // *** Process User Input ***
    // **************************
    var keyboard = {};
    var lastFrame = Date.now();
    addKeysListener();

    // *** Animation loop ***
    // **********************
    function animate(){
        var currentFrame = Date.now();
        var dt = currentFrame - lastFrame;

        car.move(keyboard, dt);

        world.step(timestep);
        canonDebugger.update();

        controls.update();

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
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

    animate();
}

// *** Set up map ***
// ******************
function setUpMap(){
    let map;

    const mapWidth = 20;
    const mapHeight = 20;

    const floorMap = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

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
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2],
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

    map = new Map(mapWidth, mapHeight, floorMap, modelsMap);
    return map;
}

// *** Add lights ***
// ******************
function addLight(scene){
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
}

// *** Visualize physics bodies ***
// ********************************
function initCanonDebugger(scene, world){
    var canonDebugger = new CannonDebugger(scene, world, {
        onInit(body, mesh){
            document.addEventListener("keydown", (event) =>{
                if (event.key === "f") {
                    mesh.visible = !mesh.visible;
                }
            });
        },
    });
    return canonDebugger;
}

main();