export function Box( width, height, depth ) {
  return {
    vertices: [
      // Front
      -width,  -height, -depth,
       width , -height, -depth,
       width,   height, -depth,
      -width,   height, -depth,

      // Back
       width,  -height,  depth,
      -width,  -height,  depth,
      -width,   height,  depth,
       width,   height,  depth,
    ],
    indices: [
      0, 1, 2, // front
      0, 2, 3,
      1, 4, 7, // right
      1, 7, 2,
      4, 5, 6, // back
      4, 6, 7,
      5, 0, 3, // left
      5, 3, 6,
      3, 2, 7, // top
      3, 7, 6,
      0, 1, 5, // bottom
      1, 4, 5
    ],
  }
}

export function getMesh( gl, meshInfo ) {  
  return {
    vertexBuffer: createVertexBuffer( gl, meshInfo.vertices ),
    vertexLength: meshInfo.vertices.length / 3,
    indexBuffer: createIndexBuffer( gl, meshInfo.indices ),
    indexLength: meshInfo.indices.length,
  };
}

function createVertexBuffer( gl, vertices ) {
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );
  return vertexBuffer;
}

function createIndexBuffer( gl, indices ) {
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indexBuffer );
  gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( indices ), gl.STATIC_DRAW );
  return indexBuffer;
}