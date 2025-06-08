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

export function Grid( left = -5, top = -5, right = 5, bottom = 5 ) {
  const grid = {
    positions: [],
    normals: [],
  };

  for ( let x = left; x <= right; x ++ ) {
    grid.positions.push(
      x, 0, top,
      x, 0, bottom,
    );
  }

  for ( let z = top; z <= bottom; z ++ ) {
    grid.positions.push(
      left, 0, z, 
      right, 0, z
    );
  }

  return grid;
}

export function Plane( width = 1, height = 1, widthSegments = 1, heightSegments = 1 ) {
  const plane = {
    positions: [],
    normals: [],
    indices: [],
  };

  for ( let row = 0; row <= heightSegments; row ++ ) {
    for ( let col = 0; col <= widthSegments; col ++ ) {
      plane.positions.push( col * width / widthSegments, 0, row * height / heightSegments );
      plane.normals.push( 0, 0, 1 );
    }
  }

  for ( let row = 0; row < heightSegments; row ++ ) {
    for ( let col = 0; col < widthSegments; col ++ ) {
      plane.indices.push( 
        ( widthSegments + 1 ) * row + col,
        ( widthSegments + 1 ) * ( row + 1 ) + col,
        ( widthSegments + 1 ) * ( row + 1 ) + col + 1,
      );

      plane.indices.push( 
        ( widthSegments + 1 ) * row + col,
        ( widthSegments + 1 ) * row + col + 1,
        ( widthSegments + 1 ) * ( row + 1 ) + col + 1,
      );
    }
  }

  return plane;
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
