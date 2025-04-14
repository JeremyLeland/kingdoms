// Do we want to incorporate width, height, and depth during creation? Or just scale it later?
export function Cube( /*width = 1, height = 1, depth = 1*/ ) {
  return {
    positions: [
      // Back
      -1, -1, -1,
       1, -1, -1,
       1,  1, -1,
      -1,  1, -1,

      // Right
       1, -1, -1,
       1, -1,  1,
       1,  1,  1,
       1,  1, -1,

      // Front
       1, -1,  1,
      -1, -1,  1,
      -1,  1,  1,
       1,  1,  1,

      // Left
      -1, -1,  1,
      -1, -1, -1,
      -1,  1, -1,
      -1,  1,  1,

      // Top
      -1,  1, -1,
       1,  1, -1,
       1,  1,  1,
      -1,  1,  1,

      // Bottom
      -1, -1,  1,
       1, -1,  1,
       1, -1, -1,
      -1, -1, -1,
    ] /*.map( ( e, index ) => e * [ width, height, depth ][ index % 3 ] )*/,
    normals: [
      // Back
       0,  0, -1,
       0,  0, -1,
       0,  0, -1,
       0,  0, -1,

      // Right
       1,  0,  0,
       1,  0,  0,
       1,  0,  0,
       1,  0,  0,

      // Front
       0,  0,  1,
       0,  0,  1,
       0,  0,  1,
       0,  0,  1,

      // Left
      -1,  0,  0,
      -1,  0,  0,
      -1,  0,  0,
      -1,  0,  0,

      // Top
       0,  1,  0,
       0,  1,  0,
       0,  1,  0,
       0,  1,  0,

      // Bottom
       0, -1,  0,
       0, -1,  0,
       0, -1,  0,
       0, -1,  0,
    ],
    uvs: [
      // back
      0, 0,
      1, 0,
      1, 1,
      0, 1,

      // right
      0, 0,
      1, 0,
      1, 1,
      0, 1,

      // front
      0, 0,
      1, 0,
      1, 1,
      0, 1,
      
      // left
      0, 0,
      1, 0,
      1, 1,
      0, 1,

      // top
      0, 0,
      1, 0,
      1, 1,
      0, 1,

      // bottom
      0, 0,
      1, 0,
      1, 1,
      0, 1,
    ],
    indices: [
      // back
      0, 1, 2, 
      0, 2, 3,

      // right
      4, 5, 6, 
      4, 6, 7,
      
      // front
      8, 9, 10, 
      8, 10, 11,
      
      // left
      12, 13, 14, 
      12, 14, 15, 
      
      // top
      16, 17, 18, 
      16, 18, 19,
      
      // bottom
      20, 21, 22, 
      20, 22, 23
    ],
  }
}

// TODO: Is there any reason to subdivide this into segments?
export function Plane() {
  return {
    positions: [
       1, -1,  0,
      -1, -1,  0,
      -1,  1,  0,
       1,  1,  0,
    ],
    normals: [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
    ],
    indices: [
      0, 1, 2,
      0, 2, 3,
    ],
  };
}

export function Sphere( widthSegments = 32, heightSegments = 32, phiStart = 0, phiLength = Math.PI * 2, thetaStart = 0, thetaLength = Math.PI ) {
  const sphere = {
    positions: [],
    normals: [],
    indices: [],
  };

  for ( let row = 0; row <= heightSegments; row ++ ) {
    for ( let col = 0; col <= widthSegments; col ++ ) {
      const phi   = phiStart   + phiLength   * col / widthSegments;
      const theta = thetaStart + thetaLength * row / heightSegments;

      const x = Math.cos( phi ) * Math.sin( theta );
      const y = Math.cos( theta );
      const z = Math.sin( phi ) * Math.sin( theta );

      sphere.positions.push( x, y, z );
      sphere.normals.push( x, y, z );
    }
  }

  for ( let row = 0; row < heightSegments; row ++ ) {
    for ( let col = 0; col < widthSegments; col ++ ) {
      sphere.indices.push( 
        ( widthSegments + 1 ) * row + col,
        ( widthSegments + 1 ) * ( row + 1 ) + col,
        ( widthSegments + 1 ) * ( row + 1 ) + col + 1,
      );

      sphere.indices.push( 
        ( widthSegments + 1 ) * row + col,
        ( widthSegments + 1 ) * row + col + 1,
        ( widthSegments + 1 ) * ( row + 1 ) + col + 1,
      );
    }
  }

  return sphere;
}

// TODO: Is there any reason to subdivide this into height segments?
export function Cylinder( widthSegments = 32, phiStart = 0, phiLength = Math.PI * 2 ) {
  const cylinder = {
    positions: [],
    normals: [],
    indices: [],
  };

  // Where do we want tip of default cylinder? Maybe center of base is 0,0,0?
  for ( let col = 0; col <= widthSegments; col ++ ) {
    const phi = phiStart + phiLength * col / widthSegments;
    
    const x = Math.cos( phi );
    const z = Math.sin( phi );
    
    const ny = Math.cos( Math.PI / 4 );
    const nx = x * ny;
    const nz = z * ny;
    
    cylinder.positions.push( 0, 1, 0 );
    cylinder.normals.push( nx, ny, nz );

    cylinder.positions.push( x, 0, z );
    cylinder.normals.push( nx, ny, nz );
  }

  // For convenience, we alternated top and bottom for cylinder points

  const heightSegments = 2;
  for ( let col = 0; col < widthSegments; col ++ ) {
    cylinder.indices.push( col * heightSegments, col * heightSegments + 1, col * heightSegments + 3 );

    // cylinder.indices.push( 
    //   ( widthSegments + 1 ) * row + col,
    //   ( widthSegments + 1 ) * ( row + 1 ) + col,
    //   ( widthSegments + 1 ) * ( row + 1 ) + col + 1,
    // );

    // cylinder.indices.push( 
    //   ( widthSegments + 1 ) * row + col,
    //   ( widthSegments + 1 ) * row + col + 1,
    //   ( widthSegments + 1 ) * ( row + 1 ) + col + 1,
    // );
  }

  return cylinder;
}

export function getMesh( gl, meshInfo ) {  
  return {
    positionBuffer: createArrayBuffer( gl, meshInfo.positions ),
    normalBuffer: createArrayBuffer( gl, meshInfo.normals ),
    uvBuffer: createArrayBuffer( gl, meshInfo.uvs ),
    indexBuffer: createIndexBuffer( gl, meshInfo.indices ),
    length: meshInfo.indices.length,
  };
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
