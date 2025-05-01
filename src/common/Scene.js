import { mat4, vec4 } from '../../lib/gl-matrix.js';
import * as ShaderCommon from './ShaderCommon.js';


export class Scene {

  viewMatrix = mat4.create();
  projectionMatrix = mat4.create();


  #normalMatrix = mat4.create();
  #viewInverse = mat4.create();
  #eyePos = vec4.create();

  // // Should Scene be created with a gl context, or take it in every draw?
  // constructor( gl ) {
  //   this.gl = gl;
  // }

  draw( gl, mesh, shader, modelMatrix ) {
    if ( !shader.program ) {
      // Leave our shader load code as is for now, append to shader here
      Object.assign( shader, ShaderCommon.getShader( gl, shader ) );
    }

    if ( !mesh.vao ) {
      mesh.vao = gl.createVertexArray();
      gl.bindVertexArray( mesh.vao );

      gl.bindBuffer( gl.ARRAY_BUFFER, createArrayBuffer( gl, mesh.positions ) );
      gl.vertexAttribPointer( shader.attribLocations.position, 3, gl.FLOAT, false, 0, 0 );
      gl.enableVertexAttribArray( shader.attribLocations.position );

      gl.bindBuffer( gl.ARRAY_BUFFER, createArrayBuffer( gl, mesh.normals ) );
      gl.vertexAttribPointer( shader.attribLocations.normal, 3, gl.FLOAT, false, 0, 0 );
      gl.enableVertexAttribArray( shader.attribLocations.normal );

      gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, createIndexBuffer( gl, mesh.indices ) );

      gl.bindVertexArray( null );
    }

    gl.useProgram( shader.program );

    gl.uniformMatrix4fv( shader.uniformLocations.modelMatrix, false, modelMatrix );
    gl.uniformMatrix4fv( shader.uniformLocations.viewMatrix, false, this.viewMatrix );
    gl.uniformMatrix4fv( shader.uniformLocations.projectionMatrix, false, this.projectionMatrix );

    if ( shader.uniformLocations.normalMatrix ) {
      mat4.invert( this.#normalMatrix, modelMatrix );
      mat4.transpose( this.#normalMatrix, this.#normalMatrix );

      gl.uniformMatrix4fv( shader.uniformLocations.normalMatrix, false, this.#normalMatrix );
    }

    // TODO: Lighting -- can we make these structs, then check for struct location before passing in?
    gl.uniform4fv( shader.uniformLocations.lightPos, [ 10, 10, 10, 1 ] );
    gl.uniform3fv( shader.uniformLocations.lightColor, [ 1, 1, 1 ] );

    if ( shader.uniformLocations.eyePos ) {
      mat4.invert( this.#viewInverse, this.viewMatrix );
      vec4.set( this.#eyePos, viewInverse[ 12 ], viewInverse[ 13 ], viewInverse[ 14 ], 1 );

      gl.uniformMatrix4fv( shader.uniformLocations.eyePos, false, this.#eyePos );
    }

    // TODO: Where should this get stored? Passed in? Part of material settings?
    gl.uniform3fv( shader.uniformLocations.color, [ 1, 1, 1 ] );

    gl.bindVertexArray( mesh.vao );
    gl.drawElements( gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0 );
  }
}

function createArrayBuffer( gl, array ) {
  const arrayBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, arrayBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( array ), gl.STATIC_DRAW );
  return arrayBuffer;
}

function createIndexBuffer( gl, indices ) {
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indexBuffer );
  gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( indices ), gl.STATIC_DRAW );
  return indexBuffer;
}
