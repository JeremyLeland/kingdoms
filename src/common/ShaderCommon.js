export const CommonVertexShader = /*glsl*/`# version 300 es
  in vec4 vertexPosition;

  uniform mat4 mvp;

  out vec4 v_pos;

  void main() {
    v_pos = vertexPosition;
    gl_Position = mvp * vertexPosition;
  }
`;

export const CommonFragmentShader = /*glsl*/ `# version 300 es
  precision mediump float;

  in vec4 v_pos;

  uniform vec3 color;

  out vec4 outColor;

  void main() {
    outColor.xyz = color;
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
  };
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