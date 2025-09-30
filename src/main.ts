import './style.css'
import {createGround} from "./scene_objects/grounds.ts";
import {createLights} from "./scene_objects/lights.ts";
import type {Models} from "./interface/Models.ts";
import {App} from "./app/app.ts";
// @ts-ignore
import type {GLTF} from "three/examples/jsm/loaders/GLTFLoader";


const models: Record<string, Models> = {
    travis: {url: './assets/silver_soldier.glb'}
}

function main(){
    const canvas= document.querySelector<HTMLCanvasElement>("#c")!;

    const app = new App(canvas)

    app.loadModels(models)

    app.addScene(createGround(), ...createLights())

}
main()
