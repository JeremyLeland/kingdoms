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

export const PositionColor = {
  vertex: /*glsl*/`# version 300 es
    in vec4 position;

    uniform mat4 mvp;

    out vec4 v_pos;

    void main() {
      gl_Position = mvp * position;
      v_pos = position;
    }
  `,
  fragment: /*glsl*/ `# version 300 es
    precision mediump float;

    in vec4 v_pos;

    out vec4 outColor;

    void main() {
      outColor = v_pos;
    }
  `,
}

export const NormalColor = {
  vertex: /*glsl*/`# version 300 es
    in vec4 position;
    in vec3 normal;

    uniform mat4 mvp;

    out vec3 v_norm;

    void main() {
      gl_Position = mvp * position;
      v_norm = normal;
    }
  `,
  fragment: /*glsl*/ `# version 300 es
    precision mediump float;

    in vec3 v_norm;

    out vec4 outColor;

    void main() {
      outColor = vec4( v_norm, 1.0 );
    }
  `,
}

export const UVColor = {
  vertex: /*glsl*/`# version 300 es
    in vec4 position;
    in vec2 uv;

    uniform mat4 mvp;

    out vec2 v_uv;

    void main() {
      gl_Position = mvp * position;
      v_uv = uv;
    }
  `,
  fragment: /*glsl*/ `# version 300 es
    precision mediump float;

    in vec2 v_uv;

    out vec4 outColor;

    void main() {
      outColor = vec4( v_uv.x, v_uv.y, 0.0, 1.0 );
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