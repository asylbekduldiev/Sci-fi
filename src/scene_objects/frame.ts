import {PerspectiveCamera, Vector3} from "three";
import * as THREE from "three";

export function frameArea( sizeToFitOnScreen:number, boxSize:number, boxCenter: Vector3, camera:PerspectiveCamera ) {

    const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
    const halfFovY = THREE.MathUtils.degToRad( camera.fov * .5 );
    const distance = halfSizeToFitOnScreen / Math.tan( halfFovY );

    const direction = ( new THREE.Vector3() )
        .subVectors( camera.position, boxCenter )
        .multiply( new THREE.Vector3( 1, 0, 1 ) )
        .normalize();

    camera.position.copy( direction.multiplyScalar( distance ).add( boxCenter ) );
    camera.near = boxSize / 100;
    camera.far = boxSize * 100;

    camera.updateProjectionMatrix();

    camera.lookAt( boxCenter.x, boxCenter.y, boxCenter.z );
}