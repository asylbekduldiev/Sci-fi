import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { WebGLRenderer} from "three";
import {createGround} from "./scene_objects/grounds.ts";
import {createLights} from "./scene_objects/lights.ts";
import type {Models} from "./interface/Models.ts";
// @ts-ignore
import type {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {frameArea} from "./scene_objects/frame.ts";


const models: Record<string, Models> = {
    travis: {url: './assets/silver_soldier.glb'}
}

enum pcamera{
    fov = 55,
    aspect = 2,
    near = 0.1,
    far = 100
}

function main(){
    const canvas= document.querySelector<HTMLCanvasElement>("#c")!;
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( pcamera.fov, pcamera.aspect, pcamera.near, pcamera.far );
    const controls = new OrbitControls( camera, canvas );
    const manager = new THREE.LoadingManager();

    //camera
    camera.position.set( 0, 10, 20 );

    //controls
    controls.target.set( 0, 5, 0 );
    controls.update();

    //scene
    scene.add(createGround(),...createLights());

    gtfload()
    requestAnimationFrame( render );


    function gtfload(){
        const gltfLoader = new GLTFLoader(manager);

        for (const model of Object.values(models)) {

            gltfLoader.load(model.url, (gltf: GLTF) => {
                const root = gltf.scene;
                model.gltf = gltf;
                scene.add(root)

                const box = new THREE.Box3().setFromObject(root);
                const boxSize = box.getSize(new THREE.Vector3()).length();
                const boxCenter = box.getCenter(new THREE.Vector3());

                frameArea(boxSize * 1.2, boxSize, boxCenter, camera);

                controls.maxDistance = boxSize * 10;
                controls.target.copy(boxCenter);
                controls.update();

            });
        }
    }

    function resizeRendererToDisplaySize( renderer:WebGLRenderer ) {

        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if ( needResize ) {
            renderer.setSize( width, height, false );
        }

        return needResize;
    }

    function render() {

        if ( resizeRendererToDisplaySize( renderer ) ) {

            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();

        }

        renderer.render( scene, camera );

        requestAnimationFrame( render );
    }
}
main()
