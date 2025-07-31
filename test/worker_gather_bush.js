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


const entities = [
  {
    type: 'Worker', 
    pos: [ 4, 0, 2 ],
    tool: { type: 'Axe' },
  },
  {
    type: 'Worker', 
    pos: [ 4, 0, 3 ],
    tool: { type: 'Axe' },
  },
  {
    type: 'Worker', 
    pos: [ 4, 0, 4 ],
    tool: { type: 'Axe' },
  },
  {
    type: 'Stockpile',
    pos: [ -1, 0, 3 ],
    pile: [],
  },
  {
    type: 'Stockpile',
    pos: [ 0, 0, 3 ],
    pile: [],
  },
  {
    type: 'Stockpile',
    pos: [ 1, 0, 3 ],
    pile: [],
  },
  {
    type: 'Ground',
    pos: [ 0, 0, 0 ],
  },
  {
    type: 'Bush',
    resources: {
      'Berry': 10,
    },
    pos: [ 2, 0, -2 ],
  },
  {
    type: 'Rock',
    resources: {
      'Stone': 10,
    },
    pos: [ 0, 0, -2 ],
  },
  {
    type: 'Tree',
    animation: {
      name: 'fell',
      time: 1000,   // fell.duration
    },
    resources: {
      'Wood': 10,
    },
    pos: [ -2, 0, -2 ],
  },
];

const desired = {
  'Berry': 1,
  'Stone': 1,
  'Wood': 1,
};

//
// UI
//
const divUI = document.createElement( 'div' );

Object.assign( divUI.style, {
  position: 'absolute',
  left: 0,
  top: 0,
  display: 'grid',
  gridTemplateColumns: '1fr 75px',
  background: '#000a',
} );

for ( const [ key, value ] of Object.entries( desired ) ) {
  const labelUI = document.createElement( 'label' );
  labelUI.innerText = key;
  
  const numInputUI = document.createElement( 'input' );
  numInputUI.type = 'number';
  numInputUI.value = value;

  numInputUI.oninput = _ => {
    desired[ key ] = parseInt( numInputUI.value );
  };

  divUI.appendChild( labelUI );
  divUI.appendChild( numInputUI );
}

document.body.appendChild( divUI );

//
// GLCanvas
//

const canvas = new GLCanvas();
const scene = new Scene( /*canvas.gl */ );

//
// Persist camera state between sessions
// TODO: Make this part of Scene, maybe? Pass in the state key name to use
//
const TestStateKey = 'kingdoms_workerGatherTestState';

const oldState = JSON.parse( localStorage.getItem( TestStateKey ) );
if ( oldState ) {
  scene.camera = new OrbitCamera( oldState );
}

window.addEventListener( 'beforeunload', ( e ) =>
  localStorage.setItem( TestStateKey, JSON.stringify( scene.camera ) )
);

canvas.update = ( dt ) => {
 
  const workers = entities.filter( e => e.type == 'Worker' );

  entities.forEach( entity => {

    if ( entity.animation ) {
      const animInfo = Entity.ModelInfo[ entity.type ].animations[ entity.animation.name ];
    
      if ( animInfo ) {
        entity.animation.time += dt;
        
        if ( animInfo.loop ) {
          entity.animation.time %= animInfo.duration;
        }
      }

      // if ( entity.animation.time < Entity.ModelInfo[ entity.type ].animations[ entity.animation.name ].duration ) {
      //   return;    // TODO: Only bail if certain animations are playing? Or should this just be part of delay?
      // }

      // TODO: Clear animation when done? stay at last frame? (Loop it if it loops)
    }

    if ( entity.delay > 0 ) {
      entity.delay -= dt;   // or max( delay - dt, zero )?
      return;
    }

    if ( entity.type == 'Worker' ) {
      updateWorker( entity, workers, dt );
    }

    if ( entity.type == 'Tree' ) {
      if ( entity.action == 'impact' ) {
        entity.health -= 1;   // eventually: entity cut damage? (so better axes cut faster)

        if ( entity.health > 0 ) {
          entity.animation = {
            name: 'impact',
            time: 0,
          };
          entity.delay = 500;
          entity.action = 'idle';
        }
        else {
          entity.animation = {
            name: 'fell',
            time: 0,
          };
          entity.delay = 2000;
          entity.action = 'sink';

          // Spawn some wood!
          const SPAWN_COUNT = 8, SPAWN_DIST = 1.5;
          for ( let i = 0; i < SPAWN_COUNT; i ++ ) {
            const angle = ( i / SPAWN_COUNT ) * Math.PI * 2;

            const dist = SPAWN_DIST;
            const offset = [ dist * Math.cos( angle ), 0, dist * Math.sin( angle ) ];

            entities.push( { 
              type: 'Wood',
              pos: vec3.add( [], entity.pos, offset ),
              rot: [ 0, -angle, 0 ],
            } );
          }
        }
      }
      else if ( entity.action == 'sink' ) {
        entity.animation = {
          name: 'sink',
          time: 0,
        };
        entity.delay = 2000;
        entity.action = 'dead';
      }
    }
  } );
}

const StockpileLayout = {
  'Berry': [ 2, 2 ],  // was Basket
  'Stone': [ 2, 1 ],
  'Wood': [ 3, 1 ],
};

const HarvestAnimation = {
  'Berry': 'gather',
  'Stone': 'swing',
  'Wood': 'swing',
};

function addItemToStockpile( target, item ) {
  const targetInfo = Entity.ModelInfo[ target.type ];
  const itemInfo = Entity.ModelInfo[ item.type ];

  const [ cols, rows ] = StockpileLayout[ item.type ];
  const totalPerLayer = cols * rows;

  const withinLayer = target.pile.length % totalPerLayer;
  const layerIndex = Math.floor( target.pile.length / totalPerLayer );

  const withinRow = withinLayer % cols;
  const rowIndex = Math.floor( withinLayer / cols );

  const horizSpacing = targetInfo.bounds[ 0 ] / cols;
  const vertSpacing = targetInfo.bounds[ 2 ] / rows;

  const horizCol = ( withinRow * 2 - ( cols - 1 ) ) * horizSpacing; //itemInfo.bounds[ 0 ];
  const horizRow = ( rowIndex  * 2 - ( rows - 1 ) ) * vertSpacing;  //itemInfo.bounds[ 2 ];

  const vert = layerIndex * itemInfo.bounds[ 1 ] * 2;

  if ( layerIndex % 2 == 0 ) {
    item.pos = [ horizCol, vert, horizRow ];
    item.rot = [ 0, 0, 0 ];
  }
  else {
    item.pos = [ horizRow, vert, horizCol ];
    item.rot = [ 0, Math.PI / 2, 0 ];
  }

  item.rot[ 1 ] += ( -0.5 + Math.random() ) * 0.15;

  target.pile.push( item );
}

const CARRY_MAX = 3;
const CARRY_GAP = 0.05;
const STOCKPILE_MAX = 9;

const WorkerActions = {
  DropOff: {
    targetFunc: ( entity ) => {
      const stockpiles = entities.filter( e => e.type == 'Stockpile' );
      const matchingPiles = stockpiles.filter( e =>
        e.pile.length > 0 && e.pile[ 0 ].type == entity.carry[ 0 ].type &&
        e.pile.length < STOCKPILE_MAX
      );

      if ( matchingPiles.length > 0 ) {
        return closestTo( entity, matchingPiles );
      }
      else {
        const emptyPiles = stockpiles.filter( e => e.pile.length == 0 );

        return closestTo( entity, emptyPiles )
      }
    },
    actionFunc: ( entity, target ) => {
      const item = entity.carry.splice( entity.carry.length - 1, 1 )[ 0 ];

      addItemToStockpile( target, item );

      // TODO: Stockpile delay as well? (so different people can't dump a bunch of things at once)

      entity.delay += Worker.Info.UnloadDelay;
    },
  },
  PickUp: {
    targetFunc: ( entity ) => {
      const matchFunc = entity.carry.length > 0 ? e => e.type == entity.carry[ 0 ].type : e => e.type == 'Wood' || e.type == 'Stone';
      const resources = entities.filter( matchFunc );
      return closestTo( entity, resources );
    },
    actionFunc: ( entity, target ) => {
      const itemInfo = Entity.ModelInfo[ target.type ];

      target.pos = [ 0, entity.carry.length * ( itemInfo.bounds[ 1 ] * 2 + CARRY_GAP ), 0 ];
      target.rot = [ 0, 0, 0 ];

      entity.carry.push( ...entities.splice( entities.indexOf( target ), 1 ) );
      entity.delay += Worker.Info.PickupDelay;

      if ( entity.animation.name != 'carry' ) {
        entity.animation = {
          name: 'carry',
          time: 0,
        };
      }
    },
  },

  // TODO: One generic harvest for all of them? How to know what to gather?
  // TODO: Trying to get rid of entity.job.resource and make job just be 'Harvest' or 'DropOff' again
  //          - can we get everything we need without it?

  Harvest: {
    targetFunc: ( entity ) => {
      return closestTo( entity,
        entities.filter( e => e.resources?.[ entity.job.resource ] > 0 )
      );
    },
    actionFunc: ( entity, target ) => {
      entity.animation = {
        name: HarvestAnimation[ entity.job.resource ],  // base on target instead of resource type?
        time: 0,
      };
      entity.delay = 1000;    // TODO: get from animation duration? or do we need to set this at all?

      // TODO: change rock stage to less rock

      const resourceName = entity.job.resource;

      target.resources[ resourceName ] --;
      entity.carry.push( { type: resourceName } );
      entity.job = { type: 'DropOff' };
    },
  },
}

// TODO: Trying to figure out how to sequence this:
//       1) Start worker swing animation
//       2) 400ms later, damage tree and start impact or fell animation
//       3) If tree dead, wait 400ms then spawn wood


function closestTo( target, entities ) {
  let closestEntity, closestDist = Infinity;
  
  entities.forEach( e => {
    if ( e != target ) {
      const dist = Math.hypot( e.pos[ 0 ] - target.pos[ 0 ], e.pos[ 2 ] - target.pos[ 2 ] );
      if ( dist < closestDist ) {
        closestEntity = e;
        closestDist = dist;
      }
    }
  } );

  return closestEntity;
}

function numResourceAvailable( resourceName ) {
  let total = 0;

  entities.forEach( e => total += e.resources?.[ resourceName ] ?? 0 );

  return total;
}

function updateWorker( entity, others, dt ) {
  // Initialize default values
  entity.rot ??= [ 0, 0, 0 ];
  entity.carry ??= [];
  entity.delay ??= 0;
  entity.job ??= { type: 'Idle' };

  // Find avoid vectors
  const avoid = [ 0, 0, 0 ];

  others.forEach( other => {
    if ( entity != other ) {
      const cx = entity.pos[ 0 ] - other.pos[ 0 ];
      const cy = entity.pos[ 2 ] - other.pos[ 2 ];
      const dist = Math.hypot( cx, cy );
      const angle = Math.atan2( cy, cx );

      const weight = 10 * ( 1 - Math.tanh( dist ) );

      avoid[ 0 ] += weight * Math.cos( angle );
      avoid[ 2 ] += weight * Math.sin( angle );
    }
  } );

  //console.log( entity.pos + " avoid: " + avoid );

  entity.avoid = avoid;

  if ( entity.job?.type == 'Harvest' ) {
    const pileContents = entities.flatMap( e => e.pile ?? e.carry ?? [] );  // Should we use one name for this?

    const nextDesired = Object.entries( desired ).find( ( [ key, val ] ) => val > pileContents.filter( e => e.type == key ).length );

    if ( nextDesired ) { 
      entity.job = {
        type: 'Harvest',
        resource: nextDesired[ 0 ],
      };
    }
    else {
      entity.job = { type: 'Idle' };
    }

    // TODO: Include this in part of the search above (compare against list of available resources)
    const resCount = numResourceAvailable( entity.job.resource );

    if ( resCount == 0 ) {
      entity.job = { type: 'DropOff' };
    }
  }

  if ( entity.job?.type == 'DropOff' && entity.animation?.name != 'carry' ) {
    entity.animation = {
      name: 'carry',
      time: 0,
    };
  }

  if ( entity.job?.type == 'DropOff' && entity.carry.length == 0 ) {
    entity.job = { type: 'Idle' };

    entity.animation = {
      name: 'Idle',
      time: 0,
    };
  }

  //
  // TODO: We're harvesting too many items this way, since we are committing to a gather
  //       and not re-checking if it's still needed. Maybe check all carrys (not just piles)
  //       and do this every update? Then we can redirect to another resource if someone
  //       already grabbed all we need of the first one
  //

  if ( entity.job.type == 'Idle' ) {
  //   // TODO: Find total number of each resource in stockpiles and only grab what we want more of
  //   const pileContents = entities.flatMap( e => e.pile ?? [] );

  //   const nextDesired = Object.entries( desired ).find( ( [ key, val ] ) => val > pileContents.filter( e => e.type == key ).length );

  //   if ( nextDesired ) { 
      entity.job = {
        type: 'Harvest',
  //       resource: nextDesired[ 0 ],
      };
  //   }
  }

  const workerAction = WorkerActions[ entity.job.type ];
  //const workerAction = entity.carry.length >= CARRY_MAX ? WorkerActions.DropOff : WorkerActions.PickUp;
  const target = workerAction?.targetFunc( entity );

  // Get target vector, but also get avoid vectors, then move appropriately

  // TODO: May want to avoid even if we don't have a target (i.e. move out of way of others?)

  if ( target ) {

    const toTarget = vec3.sub( [], target.pos, entity.pos );
    const goalVec = vec3.normalize( [], toTarget );

    vec3.add( goalVec, goalVec, entity.avoid );


    const currentAngle = entity.rot[ 1 ];
    const desiredAngle = Math.atan2( -goalVec[ 2 ], goalVec[ 0 ] );   // need to flip Z here
    const angleFrom = Util.deltaAngle( currentAngle, desiredAngle )
    
    entity.rot[ 1 ] += sigma( angleFrom ) * Worker.Info.TurnSpeed * dt;
    
    const distanceFrom = vec3.len( toTarget );
    
    // TODO: Do we need to separate concept of moving toward immediate goal (which may include avoidance)
    //       and being in range of target? Otherwise, I'd be moving slowly to avoid if near target...
    //       which may be ok

    // TODO: Incorporate angleFrom into how fast we try to move. (e.g. move slower if we are turning,
    //       so we don't make such wide circles). If we are having to do a big avoid, may be better to stay
    //       in place while turning so other can more easily go around us.

    // TODO: Should we have an WorkerAction.actionDistance function? (for ranged actions like shooting?)
    //       For now, just use width (someday -- figure out proper distance for wide and narrow objects?)
    const goalDist = Entity.ModelInfo[ entity.type ].bounds[ 0 ] + Entity.ModelInfo[ target.type ].bounds[ 0 ];

    if ( distanceFrom > goalDist ) { 
      const angle = entity.rot[ 1 ]
      const moveDist = sigma( distanceFrom ) * Worker.Info.WalkSpeed * dt;
      entity.pos[ 0 ] += Math.cos( angle ) * moveDist;
      entity.pos[ 2 ] -= Math.sin( angle ) * moveDist;    // need to flip Z here
    }
    else {
      workerAction.actionFunc( entity, target );
    }
  }
}


// Play with different functions here
function sigma( x ) {
  return Math.tanh( 10 * x );
}

function bump( x ) {
  if ( x < 0 )  return 0;
  if ( x > 1 )  return 1;
  return Math.sin( x * Math.PI / 2 );
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
