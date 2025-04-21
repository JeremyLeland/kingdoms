import { mat4 } from '../lib/gl-matrix.js';


import * as MeshCommon from '../src/common/MeshCommon.js';
import * as ShaderCommon from '../src/common/ShaderCommon.js';

import * as Buildings from '../src/entities/Buildings.js';
import * as Environment from '../src/entities/Environment.js';
import * as Resources from '../src/entities/Resources.js';
import * as Worker from '../src/entities/Worker.js';

const ModelInfo = {
  'Wood': Resources.WoodModel,
  'Stone': Resources.StoneModel,
  'Stockpile': Buildings.StockpileModel,
  'Worker': Worker.Model,
  'Tree': Environment.TreeModel,
  'Ground': {
    Grass: {
      mesh: MeshCommon.Plane(),
      pos: [ 0, 0, 0 ],
      rot: [ Math.PI / 2, 0, 0 ],
      color: [ 0.0, 0.6, 0.0 ],
    },
  },
};

const Meshes = new Map();

let shader;

function applyTransforms( matrix, transform ) {
  if ( transform.pos ) {
    mat4.translate( matrix, matrix, transform.pos );
  }

  if ( transform.rot ) {
    mat4.rotate( matrix, matrix, transform.rot[ 2 ], [ 0, 0, 1 ] );
    mat4.rotate( matrix, matrix, transform.rot[ 1 ], [ 0, 1, 0 ] );
    mat4.rotate( matrix, matrix, transform.rot[ 0 ], [ 1, 0, 0 ] );
  }

  if ( transform.scale ) {
    mat4.scale( matrix, matrix, transform.scale );
  }
}

const mvp = mat4.create();
const normalMatrix = mat4.create();

const blend = {
  pos: [ 0, 0, 0 ],
  scale: [ 1, 1, 1 ],
};

export function draw( entity, gl, modelMatrixStack, projViewMatrix ) {

  modelMatrixStack.save();

  applyTransforms( modelMatrixStack.current, entity );

  const modelInfo = ModelInfo[ entity.type ];

  for ( const part in modelInfo ) {
    const partInfo = modelInfo[ part ];

    modelMatrixStack.save();

    if ( entity.animation ) {

      // TODO: Where should animation specific transforms go? Here?
      // Using fill to avoid garbage collection
      blend.pos.fill( 0 );
      blend.scale.fill( 1 );
      
      const keyframes = partInfo.keyframes?.[ entity.animation.name ];

      if ( keyframes ) {
        const totalTime = keyframes[ keyframes.length - 1 ].time;
        const loopTime = entity.animation.time % totalTime;
        
        let nextIndex = 0;
        for ( let i = 0; i < keyframes.length; i ++ ) {
          if ( keyframes[ i ].time > loopTime ) {
            nextIndex = i;
            break;
          }
        }

        // NOTE: This assumes a keyframe at zero. Should we create one automatically?
        const prevFrame = keyframes[ nextIndex - 1 ];
        const nextFrame = keyframes[ nextIndex ];

        const partialTime = ( entity.animation.time - prevFrame.time ) / ( nextFrame.time - prevFrame.time );

        for ( let i = 0; i < 3; i ++ ) {
          if ( prevFrame.pos ) {
            blend.pos[ i ] = prevFrame.pos[ i ] + partialTime * ( nextFrame.pos[ i ] - prevFrame.pos[ i ] );
          }

          if ( prevFrame.scale ) {
            blend.scale[ i ] = prevFrame.scale[ i ] + partialTime * ( nextFrame.scale[ i ] - prevFrame.scale[ i ] );
          }
        }

        applyTransforms( modelMatrixStack.current, blend );
      }
    }

    applyTransforms( modelMatrixStack.current, partInfo );

    mat4.multiply( mvp, projViewMatrix, modelMatrixStack.current );

    mat4.invert( normalMatrix, modelMatrixStack.current );
    mat4.transpose( normalMatrix, normalMatrix );

    // TODO: Map of shaders, like Map of meshes below
    if ( shader == null ) {
      shader = ShaderCommon.getShader( gl, ShaderCommon.BasicLighting );
    }

    gl.useProgram( shader.program );
    gl.uniformMatrix4fv( shader.uniformLocations.mvp, false, mvp );
    gl.uniformMatrix4fv( shader.uniformLocations.normalMatrix, false, normalMatrix );

    if ( partInfo.color ) {
      gl.uniform3fv( shader.uniformLocations.color, partInfo.color );
    }

    if ( partInfo.mesh ) {
      if ( !Meshes.has( part ) ) {
        Meshes.set( part, MeshCommon.getMesh( gl, partInfo.mesh ) );
      }
      
      const mesh = Meshes.get( part );
      
      gl.bindBuffer( gl.ARRAY_BUFFER, mesh.positionBuffer );
      gl.vertexAttribPointer( shader.attribLocations.position, 3, gl.FLOAT, false, 0, 0 );
      gl.enableVertexAttribArray( shader.attribLocations.position );
      
      gl.bindBuffer( gl.ARRAY_BUFFER, mesh.normalBuffer );
      gl.vertexAttribPointer( shader.attribLocations.normal, 3, gl.FLOAT, false, 0, 0 );
      gl.enableVertexAttribArray( shader.attribLocations.normal );
      
      gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer );
      gl.drawElements( gl.TRIANGLES, mesh.length, gl.UNSIGNED_SHORT, 0 );
    }

    if ( partInfo.attach ) {
      const attachList = entity[ partInfo.attach ];

      attachList.forEach( attached => {
        draw( attached, gl, modelMatrixStack, projViewMatrix );
      } );
    }

    modelMatrixStack.restore();
  }

  modelMatrixStack.restore();
}