export function Box( width, height, depth ) {
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
    ].map( ( value, index ) => value * [ width, height, depth ][ index % 3 ] / 2 ),
    normals: [
      // Back
       0,  0,  -1,
       0,  0,  -1,
       0,  0,  -1,
       0,  0,  -1,

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
       0, 1,  0,
       0, 1,  0,
       0, 1,  0,
       0, 1,  0,

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
    ]
  }
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