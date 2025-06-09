import { mat4, vec3, vec4 } from '../../lib/gl-matrix.js';
import * as ShaderCommon from './ShaderCommon.js';

const MIN_DIST = 1;
const MAX_DIST = 100;

export class OrbitCamera {
  center = [ 0, 0, 0 ];
  distance = 10;
  phi = Math.PI / 2;
  theta = Math.PI / 3;

  #eyePos = vec3.create();
  #viewMatrix = mat4.create();

  constructor( vals ) {
    Object.assign( this, vals );
    this.#updateViewMatrix();
  }

  getEyePos() {
    return this.#eyePos;
  }

  getViewMatrix() {
    return this.#viewMatrix;
  }

  rotate( dPhi, dTheta ) {
    this.phi += dPhi;
    this.theta = Math.max( 1e-6, Math.min( Math.PI, this.theta + dTheta ) );

    this.#updateViewMatrix();
  }

  pan( dx, dy ) {
    const cos = Math.cos( this.phi );
    const sin = Math.sin( this.phi );

    this.center[ 0 ] +=  sin * dx + cos * dy;
    this.center[ 2 ] += -cos * dx + sin * dy;

    this.#updateViewMatrix();
  }

  zoom( dDistance ) {
    this.distance = Math.max( MIN_DIST, Math.min( MAX_DIST, this.distance + dDistance ) );

    this.#updateViewMatrix();
  }

  #updateViewMatrix() {
    vec3.set(
      this.#eyePos,
      this.center[ 0 ] + this.distance * Math.cos( this.phi ) * Math.sin( this.theta ),
      this.center[ 1 ] + this.distance * Math.cos( this.theta ),
      this.center[ 2 ] + this.distance * Math.sin( this.phi ) * Math.sin( this.theta )
    );

    mat4.lookAt(
      this.#viewMatrix,
      this.#eyePos,
      this.center,
      [ 0, 1, 0 ],
    );
  }
}

export class Scene {

  // TODO: Look into Uniform Buffer Object for camera and lighting information? (not sure if worth it)
  //       ex: https://gist.github.com/jialiang/2880d4cc3364df117320e8cb324c2880
  camera = new OrbitCamera();

  projectionMatrix = mat4.create();

  #normalMatrix = mat4.create();

  // // Should Scene be created with a gl context, or take it in every draw?
  // constructor( gl ) {
  //   this.gl = gl;
  // }

  drawMesh( gl, mesh, material, modelMatrix ) {
    if ( !mesh || !material ) {
      return;
    }

    const shader = material.shader;
    const uniforms = material.uniforms;

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
    gl.uniformMatrix4fv( shader.uniformLocations.viewMatrix, false, this.camera.getViewMatrix() );
    gl.uniformMatrix4fv( shader.uniformLocations.projectionMatrix, false, this.projectionMatrix );

    if ( shader.uniformLocations.normalMatrix ) {
      mat4.invert( this.#normalMatrix, modelMatrix );
      mat4.transpose( this.#normalMatrix, this.#normalMatrix );

      gl.uniformMatrix4fv( shader.uniformLocations.normalMatrix, false, this.#normalMatrix );
    }

    // TODO: Lighting -- can we make these structs, then check for struct location before passing in?
    gl.uniform3fv( shader.uniformLocations.lightPos, [ 10, 10, 10 ] );
    gl.uniform3fv( shader.uniformLocations.lightColor, [ 1, 1, 1 ] );
    gl.uniform3fv( shader.uniformLocations.eyePos, this.camera.getEyePos() );

    // TODO: Where should this get stored? Passed in? Part of material settings?
    for ( const name in uniforms ) {
      // TODO: Check length of value and assign uniform appropriately
      gl.uniform3fv( shader.uniformLocations[ name ], uniforms[ name ] );
    }

    gl.bindVertexArray( mesh.vao );
    gl.drawElements( gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0 );
  }

  // // TODO: cache the lines so we aren't recreating every time? (useful for grid, less useful for debugging)
  // //       maybe can use uniforms of some sort for positions so we aren't altering VAO in that case?
  // was trying to use this for drawing lines that would be different every frame

  drawLines( gl, mesh, material, modelMatrix ) {
    if ( !mesh || !material ) {
      return;
    }

    const shader = material.shader;
    const uniforms = material.uniforms;

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

      gl.bindVertexArray( null );
    }

    gl.useProgram( shader.program );

    gl.uniformMatrix4fv( shader.uniformLocations.modelMatrix, false, modelMatrix );
    gl.uniformMatrix4fv( shader.uniformLocations.viewMatrix, false, this.camera.getViewMatrix() );
    gl.uniformMatrix4fv( shader.uniformLocations.projectionMatrix, false, this.projectionMatrix );
    
    gl.uniform3fv( shader.uniformLocations.color, uniforms.color ?? [ 1, 1, 1 ] );

    gl.bindVertexArray( mesh.vao );
    gl.drawArrays( gl.LINES, 0, mesh.positions.length / 3 );
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
