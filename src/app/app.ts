import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {frameArea} from "../scene_objects/frame.ts";
import type {Models} from "../interface/Models.ts";
// @ts-ignore
import type {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import { type WebGLRenderer} from "three";

enum camera{
    x = 0,
    y = 10,
    z = 20,
}

enum controls{
    x = 0,
    y = 5,
    z = 0,
}

export class App{
    private readonly renderer: THREE.WebGLRenderer;
    private readonly scene: THREE.Scene;
    private readonly camera: THREE.PerspectiveCamera;
    private readonly controls: OrbitControls;
    private readonly manager: THREE.LoadingManager;


    constructor(
        private canvas: HTMLCanvasElement
    ) {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 55, 2, 0.1, 100 );
        this.controls = new OrbitControls( this.camera, canvas );
        this.manager = new THREE.LoadingManager();
        this.init();
    }

    private init() {

        // camera
        this.camera.position.set(camera.x, camera.y, camera.z);

        // controls
        this.controls.target.set(controls.x, controls.y, controls.z);
        this.controls.update();
        // load models

        // start render loop
        requestAnimationFrame(() => this.render());
    }

    public addScene(...object: THREE.Object3D[]){
       this.scene.add(...object)
    }

    public loadModels(models: Record<string, Models>){
        const gltfLoader = new GLTFLoader(this.manager);

        for (const model of Object.values(models)) {

            gltfLoader.load(model.url, (gltf: GLTF) => {
                const root = gltf.scene;
                model.gltf = gltf;
                this.scene.add(root)

                const box = new THREE.Box3().setFromObject(root);
                const boxSize = box.getSize(new THREE.Vector3()).length();
                const boxCenter = box.getCenter(new THREE.Vector3());

                frameArea(boxSize * 1.2, boxSize, boxCenter, this.camera);

                this.controls.maxDistance = boxSize * 10;
                this.controls.target.copy(boxCenter);
                this.controls.update();

            });
        }
    }

    private resizeRendererToDisplaySize(renderer: WebGLRenderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    private render() {
        if (this.resizeRendererToDisplaySize(this.renderer)) {
            const canvas = this.renderer.domElement;
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.camera.updateProjectionMatrix();
        }

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.render());
    }
}