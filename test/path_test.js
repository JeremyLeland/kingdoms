document.title = 'Animation paths instead of keyframes';

import { mat4, vec3 } from '../lib/gl-matrix.js';
import { GLCanvas } from '../src/common/GLCanvas.js';
import { MatrixStack } from '../src/common/MatrixStack.js';

import { OrbitCamera, Scene } from '../src/common/Scene.js';

import * as MeshCommon from '../src/common/MeshCommon.js';
import * as ShaderCommon from '../src/common/ShaderCommon.js';
import * as Util from '../src/common/Util.js';

import * as Buildings from '../src/entities/Buildings.js';
import * as Environment from '../src/entities/Environment.js';
import * as Resources from '../src/entities/Resources.js';
import * as Worker from '../src/entities/Worker.js';
import * as Entity from '../src/Entity.js';


// TODO: Make animation be a map of animation names and their time, and apply all of them
const entities = [
  {
    type: 'Tree',
    pos: [ 0, 0, 0 ],
    animation: {
      name: 'swing',
      time: 0,
      // 'walk': 0,
      // 'carry': 0,     // TODO: Does carry make sense as an animation? Maybe have a slight sway of the hands?
    },
    delay: 0,
    carry: [
      { type: 'Axe' },
    ],
  },
];

//
// UI
//
const divUI = document.createElement( 'div' );
divUI.style.position = 'absolute';
document.body.appendChild( divUI );

for ( const name in Entity.ModelInfo[ entities[ 0 ].type ].animations ) {
  const button = document.createElement( 'button' );
  button.innerText = name;
  button.addEventListener( 'click', e => {
    startAnimation( entities[ 0 ], name );
  } );

  divUI.appendChild( button );
}

const timeSlider = document.createElement( 'input' );

Object.assign( timeSlider.style, {
  position: 'absolute',
  top: 32,
  width: '99%',
} );

Object.assign( timeSlider, {
  type: 'range',
  value: 0,
  min: 0,
  max: 1000,
  step: 1,
} );

// TODO: Can we get autocomplete if we do it this way?

document.body.appendChild( timeSlider );

timeSlider.addEventListener( 'input', e => {
  const newTime = +timeSlider.value;

  entities.forEach( entity => entity.animation.time = newTime );
} );

//
// GLCanvas
//
const canvas = new GLCanvas();
const scene = new Scene( /*canvas.gl */ );

//
// Persist camera state between sessions
//
const TestStateKey = 'kingdoms_pathTestState';

const oldState = JSON.parse( localStorage.getItem( TestStateKey ) );
if ( oldState ) {
  scene.camera = new OrbitCamera( oldState );
}

window.addEventListener( 'beforeunload', ( e ) =>
  localStorage.setItem( TestStateKey, JSON.stringify( scene.camera ) )
);


canvas.update = ( dt ) => {
  // entities.forEach( entity => entity.animation.time += dt );
}

function startAnimation( entity, name ) {
  entity.animation = { name: name, time: 0 };

  timeSlider.value = 0;
  timeSlider.max = Entity.ModelInfo[ entity.type ].animations[ name ].duration;
}


const modelMatrixStack = new MatrixStack( mat4.create() );

// Draw grid for ground (to help us see where things are and if they are underground)
const gridMesh = MeshCommon.Grid( -10, -10, 10, 10 );
const gridMaterial = {
  shader: ShaderCommon.SolidColor,
  uniforms: { color: [ 0.5, 0.5, 0.5 ] },
};
const gridModelMatrix = mat4.create();


canvas.draw = ( gl ) => {

  const fieldOfView = 45 * Math.PI / 180; // in radians
  const zNear = 0.1;
  const zFar = 100.0;
  mat4.perspective( scene.projectionMatrix, fieldOfView, canvas.canvas.width / canvas.canvas.height, zNear, zFar );

  scene.drawLines( gl, gridMesh, gridMaterial, gridModelMatrix );

  entities.forEach( entity => {
    Entity.draw( gl, entity, scene, modelMatrixStack );
  } );
}

canvas.start();


const X_TURN_SENSITIVITY = 100;
const Y_TURN_SENSITIVITY = -100;
const X_MOVE_SENSITIVITY = -50;
const Y_MOVE_SENSITIVITY = -50;

canvas.canvas.addEventListener( 'pointermove', e => {
  // Rotate around origin with left mouse button
  if ( e.buttons == 1 ) {
    const dPhi   = e.movementX / X_TURN_SENSITIVITY;
    const dTheta = e.movementY / Y_TURN_SENSITIVITY;

    scene.camera.rotate( dPhi, dTheta );
  }

  // Pan with right mouse button
  else if ( e.buttons == 2 ) {
    const dx = e.movementX / X_MOVE_SENSITIVITY;
    const dy = e.movementY / Y_MOVE_SENSITIVITY;

    scene.camera.pan( dx, dy );
  }
} );

const ZOOM_SENSIVITY = -200;

canvas.canvas.addEventListener( 'wheel', e => {
  scene.camera.zoom( e.wheelDelta / ZOOM_SENSIVITY );
} );
