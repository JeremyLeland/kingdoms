export const CommonVertexShader = /*glsl*/`# version 300 es
  in vec4 vertexPosition;

  uniform mat4 mvp;

  out vec2 v_pos;

  void main() {
    gl_Position = mvp * vertexPosition;
    v_pos = vertexPosition.xy;
  }
`;

export const CommonFragmentShader = /*glsl*/ `# version 300 es
  precision mediump float;

  in vec2 v_pos;

  uniform vec3 color;

  out vec4 outColor;

  void main() {
    outColor = vec4( 0.0, 1.0, 0.0, 1.0 );
  }
`;

export const CommonAttributes = [ 'vertexPosition' ];
export const CommonUniforms = [ 'mvp', 'color' ];

export function getShader( gl, shaderInfo ) {
  const program = initShaderProgram( gl, shaderInfo.vertexShader, shaderInfo.fragmentShader );
  
  const attribLocations = {};
  shaderInfo.attributes.forEach( attribName => 
    attribLocations[ attribName ] = gl.getAttribLocation( program, attribName ) 
  );
  
  const uniformLocations = {};
  shaderInfo.uniforms.forEach( uniformName => 
    uniformLocations[ uniformName ] = gl.getUniformLocation( program, uniformName ) 
  );
  
  return {
    program: program,
    attribLocations: attribLocations,
    uniformLocations: uniformLocations,
    buffer: initBuffer( gl, shaderInfo.points ),
    bufferLength: shaderInfo.points.length / 2,
  };
}

export function drawShader( gl, shaderInfo, uniforms ) {

  const shader = getShader( gl, shaderInfo );

  gl.useProgram( shader.program );

  gl.uniformMatrix4fv( shader.uniformLocations.mvp, false, uniforms.mvp );

  gl.uniform3fv( shader.uniformLocations.color, uniforms.color );

  drawPoints( gl, shader );
}

export function drawPoints( gl, shader ) {
  gl.bindBuffer( gl.ARRAY_BUFFER, shader.buffer );
  gl.vertexAttribPointer( shader.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( shader.attribLocations.vertexPosition );

  gl.drawArrays( gl.TRIANGLE_STRIP, 0, shader.bufferLength );
}

function initShaderProgram( gl, vsSource, fsSource ) {
  const vertexShader = loadShader( gl, gl.VERTEX_SHADER, vsSource );
  const fragmentShader = loadShader( gl, gl.FRAGMENT_SHADER, fsSource );

  const shaderProgram = gl.createProgram();
  gl.attachShader( shaderProgram, vertexShader );
  gl.attachShader( shaderProgram, fragmentShader );
  gl.linkProgram( shaderProgram );

  if ( !gl.getProgramParameter( shaderProgram, gl.LINK_STATUS ) ) {
    alert( `Unable to initialize the shader program: ${ gl.getProgramInfoLog( shaderProgram ) }` );
    return null;
  }
  else {
    return shaderProgram;
  }
}

function loadShader( gl, type, source ) {
  const shader = gl.createShader( type );

  gl.shaderSource( shader, source );
  gl.compileShader( shader );

  if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
    const errorMsg = gl.getShaderInfoLog( shader );

    const errorMatches = /ERROR: 0:(\d+)/.exec( errorMsg );
    if ( errorMatches ) {
      const errorLine = parseInt( errorMatches[ 1 ] );

      const sourceLines = gl.getShaderSource( shader ).split( '\n' );
      const outLines = [];

      const from = Math.max( errorLine - 3, 0 );
      const to   = Math.min( errorLine + 3, sourceLines.length );
      for ( let i = from; i < to; i ++ ) {
        const line = i + 1;
        outLines.push( `${ line == errorLine ? '>' : ' ' }${ line }: ${ sourceLines[ i ] }` );
      }

      alert( 'An error occurred compiling the shaders:\n' + errorMsg + '\n' + outLines.join( '\n' ) );
    }    

    gl.deleteShader( shader );
    return null;
  }
  else {
    return shader;
  }
}

function initBuffer( gl, positions ) {
  const buffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( positions ), gl.STATIC_DRAW );
  return buffer;
}