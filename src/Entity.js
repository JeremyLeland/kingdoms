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
  'Farm': Buildings.FarmModel,
  'Worker': Worker.Model,
  'Axe': Worker.Axe,
  'Tree': Environment.TreeModel,

  'Ground': {
    parts: {
      Grass: {
        mesh: MeshCommon.Plane( 10, 10 ),
        material: {
          shader: ShaderCommon.Lighting,
          uniforms: { color: [ 0.0, 0.6, 0.0 ] },
        },
        pos: [ 0, 0, 0 ],
        // rot: [ -Math.PI / 2, 0, 0 ],
        color: [ 0.0, 0.6, 0.0 ],
      },
    }
  },
};

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
      const animInfo = ModelInfo[ entity.type ].animations[ entity.animation.name ];
      const percentTime = entity.animation.time / animInfo.duration;

      const t = Math.max( 0, Math.min( 1, percentTime ) );   // should we clamp this elsewhere?
  
      // const A = ( 1 - t ) ** 2;
      // const B = 2 * ( 1 - t ) * t;
      // const C = t ** 2;

      // Cubic Bezier
      const A =              ( 1 - t ) ** 3;
      const B = 3 * t      * ( 1 - t ) ** 2;
      const C = 3 * t ** 2 * ( 1 - t );
      const D =     t ** 3;
  
      // For performance, would it be better to explicitly call out the possible properties?
      for ( const prop in animationPath.start ) {
        for ( let i = 0; i < 3; i ++ ) {
          const P0 = animationPath.start[ prop ][ i ];
          const P1 = animationPath.control1[ prop ][ i ];
          const P2 = animationPath.control2[ prop ][ i ];
          const P3 = animationPath.end[ prop ][ i ];

          blendInfo[ prop ][ i ] = A * P0 + B * P1 + C * P2 + D * P3;
        }
      }

      applyTransforms( modelMatrix, blendInfo );
    }
  }
}


// TODO: Use different meshes for start/end and control points? (except cube is good for showing rotation...hm)
//       Show path, either with lines or lots of little cubes? (cubes show rotation, not sure how useful this is)

const pathPointMesh = MeshCommon.Cube( 0.05, 0.05, 0.05 );
const pathControlPointMesh = MeshCommon.Cube( 0.025, 0.025, 0.025 );

const DebugColors = [
  [ 1, 0, 0 ],
  [ 1, 1, 0 ],
  [ 0, 1, 0 ],
  [ 0, 0, 1 ],
  [ 0, 1, 1 ],
];

const pathMaterials = DebugColors.map( color => (
  {
    shader: ShaderCommon.Lighting,
    uniforms: { color: color },
  } 
) );

const lineMatrials = DebugColors.map( color => (
  {
    shader: ShaderCommon.SolidColor,
    uniforms: { color: color },
  } 
) );


export function draw( gl, entity, scene, modelMatrixStack ) {

  let pathIndex = 0;

  modelMatrixStack.save(); {

    applyTransforms( modelMatrixStack.current, entity );     // Should this have another stack save level?
    
    const modelInfo = ModelInfo[ entity.type ];

    applyTransforms( modelMatrixStack.current, modelInfo );    // NOTE: Do we ever have model-wide transforms?

    if ( entity.animation ) {
      const animModelMatrix = mat4.create();
      const animationPath = modelInfo.animationPaths?.[ entity.animation.name ];
      const material = pathMaterials[ pathIndex ];

      if ( animationPath ) {
        mat4.copy( animModelMatrix, modelMatrixStack.current );
        applyTransforms( animModelMatrix, animationPath.start );
        scene.drawMesh( gl, pathPointMesh, material, animModelMatrix );

        mat4.copy( animModelMatrix, modelMatrixStack.current );
        applyTransforms( animModelMatrix, animationPath.control1 );
        scene.drawMesh( gl, pathControlPointMesh, material, animModelMatrix );

        mat4.copy( animModelMatrix, modelMatrixStack.current );
        applyTransforms( animModelMatrix, animationPath.control2 );
        scene.drawMesh( gl, pathControlPointMesh, material, animModelMatrix );

        mat4.copy( animModelMatrix, modelMatrixStack.current );
        applyTransforms( animModelMatrix, animationPath.end );
        scene.drawMesh( gl, pathPointMesh, material, animModelMatrix );

        if ( animationPath.start.pos ) {
          const linePathMesh = MeshCommon.BezierCurve(
            animationPath.start.pos, 
            animationPath.control1.pos, 
            animationPath.control2.pos, 
            animationPath.end.pos 
          );
          scene.drawLines( gl, linePathMesh, lineMatrials[ pathIndex ], modelMatrixStack.current );
        }

        pathIndex ++;
      }
    }

    applyAnimationTransform( modelMatrixStack.current, entity, modelInfo );   // we definitely have model-wide animations

    for ( const partName in modelInfo.parts ) {
      modelMatrixStack.save(); {

        const partInfo = modelInfo.parts[ partName ];

        applyTransforms( modelMatrixStack.current, partInfo );

        // DEBUG: Draw path
        if ( entity.animation ) {
          const animModelMatrix = mat4.create();
          const animationPath = partInfo.animationPaths?.[ entity.animation.name ];
          const material = pathMaterials[ pathIndex ];

          if ( animationPath ) {
            mat4.copy( animModelMatrix, modelMatrixStack.current );
            applyTransforms( animModelMatrix, animationPath.start );
            scene.drawMesh( gl, pathPointMesh, material, animModelMatrix );

            mat4.copy( animModelMatrix, modelMatrixStack.current );
            applyTransforms( animModelMatrix, animationPath.control1 );
            scene.drawMesh( gl, pathControlPointMesh, material, animModelMatrix );

            mat4.copy( animModelMatrix, modelMatrixStack.current );
            applyTransforms( animModelMatrix, animationPath.control2 );
            scene.drawMesh( gl, pathControlPointMesh, material, animModelMatrix );

            mat4.copy( animModelMatrix, modelMatrixStack.current );
            applyTransforms( animModelMatrix, animationPath.end );
            scene.drawMesh( gl, pathPointMesh, material, animModelMatrix );

            if ( animationPath.start.pos ) {
              // TODO: Take into account offset
              //       Would drawing more cubes with applyTransforms take care of this for us?
              const linePathMesh = MeshCommon.BezierCurve( 
                animationPath.start.pos, 
                animationPath.control1.pos, 
                animationPath.control2.pos, 
                animationPath.end.pos,
              );
              scene.drawLines( gl, linePathMesh, lineMatrials[ pathIndex ], modelMatrixStack.current );
            }

            pathIndex ++;
          }
        }

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
