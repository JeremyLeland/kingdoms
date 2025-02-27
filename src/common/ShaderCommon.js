export const SolidColor = {
  vertex: /*glsl*/`# version 300 es
    in vec4 position;

    uniform mat4 mvp;

    void main() {
      gl_Position = mvp * position;
    }
  `,
  fragment: /*glsl*/ `# version 300 es
    precision mediump float;

    uniform vec3 color;

    out vec4 outColor;

    void main() {
      outColor.xyz = color;
    }
  `,
}

export function getShader( gl, shaderInfo ) {
  const vertexShader = loadShader( gl, gl.VERTEX_SHADER, shaderInfo.vertex );
  const fragmentShader = loadShader( gl, gl.FRAGMENT_SHADER, shaderInfo.fragment );

  const shaderProgram = gl.createProgram();
  gl.attachShader( shaderProgram, vertexShader );
  gl.attachShader( shaderProgram, fragmentShader );
  gl.linkProgram( shaderProgram );

  if ( !gl.getProgramParameter( shaderProgram, gl.LINK_STATUS ) ) {
    alert( `Unable to initialize the shader program: ${ gl.getProgramInfoLog( shaderProgram ) }` );
    return null;
  }
  else {
    const lines = shaderInfo.vertex.split( '\n' ).concat( shaderInfo.fragment.split( '\n' ) );

    const attributes = new Set();
    const uniforms = new Set();

    lines.forEach( line => {
      const aMatch = line.match( /^\s*in\s+\S+\s+(\S+);/ );
      if ( aMatch ) {
        attributes.add( aMatch[ 1 ] );
      }
      else {
        const uMatch = line.match( /^\s*uniform\s+\S+\s+(\S+);/ );
        if ( uMatch ) {
          uniforms.add( uMatch[ 1 ] );
        }
      }
    } );

    const attribLocations = {};
    attributes.forEach( attribName => 
      attribLocations[ attribName ] = gl.getAttribLocation( shaderProgram, attribName ) 
    );
    
    const uniformLocations = {};
    uniforms.forEach( uniformName => 
      uniformLocations[ uniformName ] = gl.getUniformLocation( shaderProgram, uniformName ) 
    );

    return {
      program: shaderProgram,
      attribLocations: attribLocations,
      uniformLocations: uniformLocations,
    }
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