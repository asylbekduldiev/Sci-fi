import * as THREE from 'three';

export function createLights(): THREE.Light[] {
    const hemi = new THREE.HemisphereLight(0xB1E1FF, 0xB97A20, 2);
    const dir = new THREE.DirectionalLight(0xffffff, 2.5);
    dir.position.set(5, 10, 2);
    return [hemi, dir];
}