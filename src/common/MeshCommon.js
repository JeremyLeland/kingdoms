import { vec3 } from '../../lib/gl-matrix.js';

// Do we want to incorporate width, height, and depth during creation? Or just scale it later?
export function Cube( width = 1, height = 1, depth = 1 ) {
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
    ].map( ( e, index ) => e * [ width, height, depth ][ index % 3 ] ),
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
export function Plane( width = 1, height = 1, depth = 1 ) {
  return {
    positions: [
       1, -1,  0,
      -1, -1,  0,
      -1,  1,  0,
       1,  1,  0,
    ].map( ( e, index ) => e * [ width, height, depth ][ index % 3 ] ),
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

export function Sphere( width = 1, height = 1, depth = 1, widthSegments = 32, heightSegments = 32, phiStart = 0, phiLength = Math.PI * 2, thetaStart = 0, thetaLength = Math.PI ) {
  const sphere = {
    positions: [],
    normals: [],
    indices: [],
  };

  for ( let row = 0; row <= heightSegments; row ++ ) {
    for ( let col = 0; col <= widthSegments; col ++ ) {
      const phi   = phiStart   + phiLength   * col / widthSegments;
      const theta = thetaStart + thetaLength * row / heightSegments;

      const x = width * Math.cos( phi ) * Math.sin( theta );
      const y = height * Math.cos( theta );
      const z = depth * Math.sin( phi ) * Math.sin( theta );

      sphere.positions.push( x, y, z );

      const normal = vec3.normalize( [], [ x / width ** 2, y / height ** 2, z / depth ** 2 ] );
      sphere.normals.push( ...normal );
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


// TODO: Scale cylinders by width/height/depth
// TODO: Optional caps at top and bottom?
// TODO: Is there any reason to subdivide this into height segments?
export function Cylinder( width = 1, height = 1, depth = 1, radiusTop = 1, radiusBottom = 1, widthSegments = 32, thetaStart = 0, thetaLength = Math.PI * 2 ) {
  const cylinder = {
    positions: [],
    normals: [],
    indices: [],
  };

  // TODO: Account for differences in width and depth

  const slope = ( radiusBottom - radiusTop ) / height;

  // Where do we want base of unit cylinder? Should it be height of 1 or height of 2? (radius is 1)
  for ( let col = 0; col <= widthSegments; col ++ ) {
    const phi = thetaStart + thetaLength * col / widthSegments;
    
    const cosTheta = width * Math.cos( phi );
    const sinTheta = depth * Math.sin( phi );

    const normal = vec3.normalize( [], [ cosTheta / width ** 2, slope / height ** 2, sinTheta / depth ** 2 ] );

    cylinder.positions.push( radiusTop * cosTheta, height / 2, radiusTop * sinTheta );
    cylinder.normals.push( ...normal );

    cylinder.positions.push( radiusBottom * cosTheta, -height / 2, radiusBottom * sinTheta );
    cylinder.normals.push( ...normal );
  }

  // For convenience, we alternated top and bottom for cylinder points

  const heightSegments = 2;
  for ( let col = 0; col < widthSegments; col ++ ) {
    cylinder.indices.push( col * heightSegments, col * heightSegments + 1, col * heightSegments + 3 );
    cylinder.indices.push( col * heightSegments, col * heightSegments + 2, col * heightSegments + 3 );
  }

  return cylinder;
}

// TODO: Optional cap at bottom?
// TODO: Is there any reason to subdivide this into height segments?
// TODO: Make this special case of Cylinder? (allow different top and bottom radius)
export function Cone( width = 1, height = 1, depth = 1, widthSegments = 32, thetaStart = 0, thetaLength = Math.PI * 2 ) {
  return Cylinder( width, height, depth, 0, 1, widthSegments, thetaStart, thetaLength );
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

// TODO: Should these be STATIC_DRAW, DYNAMIC_DRAW, or STREAM_DRAW?
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

// TODO: getLine function like getMesh that creates buffers and everything
// TODO: Helper function to drawMesh and drawLine here? (take code from drawEntity in Entity.js)

export function drawLine( gl, positions, shader ) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( positions ), gl.STATIC_DRAW );

  // gl.useProgram( shader.program );
  gl.enableVertexAttribArray( shader.attribLocations.position );
  gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
  gl.vertexAttribPointer( shader.attribLocations.position, 3, gl.FLOAT, false, 0, 0 );

  gl.drawArrays( gl.LINES, 0, positions.length / 3 );
}
