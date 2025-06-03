import { mat4 } from '../lib/gl-matrix.js';


import * as MeshCommon from '../src/common/MeshCommon.js';
import * as ShaderCommon from '../src/common/ShaderCommon.js';

import * as Buildings from '../src/entities/Buildings.js';
import * as Environment from '../src/entities/Environment.js';
import * as Resources from '../src/entities/Resources.js';
import * as Worker from '../src/entities/Worker.js';

export const ModelInfo = {
  'Wood': Resources.WoodModel,
  'Stone': Resources.StoneModel,
  'Stockpile': Buildings.StockpileModel,
  'Worker': Worker.Model,
  'Axe': Worker.Axe,
  'Tree': Environment.TreeModel,

  // Why is ground so fucked up? Rotation isn't right at all, skews?
  // And it won't draw at all without rotation?
  // Normals change based on other things being drawn...
  'Ground': {
    parts: {
      Grass: {
        mesh: MeshCommon.Plane(),
        pos: [ 0, 0, 0 ],
        rot: [ -Math.PI / 2, 0, 0 ],
        color: [ 0.0, 0.6, 0.0 ],
      },
    }
  },
};

const Meshes = new Map();

let shader, lineShader;

export function applyTransforms( matrix, transform ) {
  if ( transform.pos ) {
    mat4.translate( matrix, matrix, transform.pos );
  }

  // TODO: What order should these be in? Should I just use quaternions instead?
  if ( transform.rot ) {
    mat4.rotate( matrix, matrix, transform.rot[ 0 ], [ 1, 0, 0 ] );
    mat4.rotate( matrix, matrix, transform.rot[ 1 ], [ 0, 1, 0 ] );
    mat4.rotate( matrix, matrix, transform.rot[ 2 ], [ 0, 0, 1 ] );
  }

  if ( transform.offset ) {
    mat4.translate( matrix, matrix, transform.offset );
  }

  if ( transform.scale ) {
    mat4.scale( matrix, matrix, transform.scale );
  }
}

function doBlend( out, animationPath, time ) {
  
  const t = Math.max( 0, Math.min( 1, time ) );   // should we clamp this elsewhere?
  
  const A = ( 1 - t ) ** 2;
  const B = 2 * ( 1 - t ) * t;
  const C = t ** 2;
  
  // For performance, would it be better to explicitly call out the possible properties?
  for ( const prop in animationPath.start ) {
    for ( let i = 0; i < 3; i ++ ) {
      const P0 = animationPath.start[ prop ][ i ];
      const P1 = animationPath.control1[ prop ][ i ];
      const P2 = animationPath.end[ prop ][ i ];

      out[ prop ][ i ] = A * P0 + B * P1 + C * P2;
    }
  }
}

const blendInfo = {
  pos: [ 0, 0, 0 ],
  rot: [ 0, 0, 0 ],
  scale: [ 1, 1, 1 ],
  offset: [ 0, 0, 0 ],
};

function applyAnimationTransform( modelMatrix, entity, info ) {
  // applyTransforms( modelMatrix, info );
  // moving this out so we can more easily draw animation path

  if ( entity.animation ) {
    // Using fill to avoid garbage collection
    blendInfo.pos.fill( 0 );
    blendInfo.rot.fill( 0 );
    blendInfo.scale.fill( 1 );
    blendInfo.offset.fill( 0 );

    // TODO: Support multiple animations at once (e.g. carry and walk)
    //       These will probably need different animation times, since you might start a swing mid-walk
    //       Could track these as a map of animation names and times, e.g. { 'walk': 2000, 'swing': 150 }

    const animationPath = info.animationPaths?.[ entity.animation.name ];

    if ( animationPath ) {
      const percentTime = entity.animation.time / ModelInfo[ entity.type ].animations[ entity.animation.name ].duration;

      doBlend( blendInfo, animationPath, percentTime );

      applyTransforms( modelMatrix, blendInfo );
    }
  }
}

const normalMatrix = mat4.create();

const blend = {
  pos: [ 0, 0, 0 ],
  scale: [ 1, 1, 1 ],
};

// TODO: For path debugging, have different colors for each path (increment counter as we draw so first red, second orange, etc)
//       Use different meshes for start/end and control points
//       Bonus: Draw the curved path with lines! (lots of blend calls to find points?)
const pathPointMesh = MeshCommon.Cube( 0.05, 0.05, 0.05 );
const pathPointMaterial = {
  shader: ShaderCommon.Lighting,
  uniforms: { color: [ 0.5, 0.5, 0.5 ] },
};
const pathControlPointMaterial = {
  shader: ShaderCommon.Lighting,
  uniforms: { color: [ 0.8, 0.8, 0.8 ] },
};


export function draw( gl, entity, scene, modelMatrixStack ) {
  modelMatrixStack.save(); {
    
    const modelInfo = ModelInfo[ entity.type ];

    applyTransforms( modelMatrixStack.current, modelInfo );    // NOTE: Do we ever have model-wide transforms?

    // const animModelMatrix = mat4.create();
    // const animationPath = modelInfo.animationPaths?.[ entity.animation.name ];

    // if ( animationPath ) {
    //   mat4.copy( animModelMatrix, modelMatrixStack.current );
    //   Entity.applyTransforms( animModelMatrix, animationPath.start );
    //   scene.drawMesh( gl, pathPointMesh, pathPointMaterial, animModelMatrix );

    //   mat4.copy( animModelMatrix, modelMatrixStack.current );
    //   Entity.applyTransforms( animModelMatrix, animationPath.control1 );
    //   scene.drawMesh( gl, pathPointMesh, pathControlPointMaterial, animModelMatrix )

    //   mat4.copy( animModelMatrix, modelMatrixStack.current );
    //   Entity.applyTransforms( animModelMatrix, animationPath.end );
    //   scene.drawMesh( gl, pathPointMesh, pathPointMaterial, animModelMatrix )
    // }

    applyAnimationTransform( modelMatrixStack.current, entity, modelInfo );   // we definitely have model-wide animations

    for ( const partName in modelInfo.parts ) {
      modelMatrixStack.save(); {

        const partInfo = modelInfo.parts[ partName ];

        applyTransforms( modelMatrixStack.current, partInfo );

        // const animModelMatrix = mat4.create();
        // const animationPath = partInfo.animationPaths?.[ entity.animation.name ];

        // if ( animationPath ) {
        //   mat4.copy( animModelMatrix, modelMatrixStack.current );
        //   Entity.applyTransforms( animModelMatrix, animationPath.start );
        //   scene.drawMesh( gl, pathPointMesh, pathPointMaterial, animModelMatrix );

        //   mat4.copy( animModelMatrix, modelMatrixStack.current );
        //   Entity.applyTransforms( animModelMatrix, animationPath.control1 );
        //   scene.drawMesh( gl, pathPointMesh, pathControlPointMaterial, animModelMatrix )

        //   mat4.copy( animModelMatrix, modelMatrixStack.current );
        //   Entity.applyTransforms( animModelMatrix, animationPath.end );
        //   scene.drawMesh( gl, pathPointMesh, pathPointMaterial, animModelMatrix )
        // }

        applyAnimationTransform( modelMatrixStack.current, entity, partInfo );

        scene.drawMesh( gl, partInfo.mesh, partInfo.material, modelMatrixStack.current );

        if ( partInfo.attach ) {
          const attachList = entity[ partInfo.attach ];

          attachList.forEach( attached => {
            draw( gl, attached, scene, modelMatrixStack );
          } );
        }
      }

      modelMatrixStack.restore();
    }
  }

  modelMatrixStack.restore();
}
