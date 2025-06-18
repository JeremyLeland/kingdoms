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

export function BezierCurve( start, control1, control2, end, numPoints = 50 ) {

  if ( !control2 ) {
    debugger;
  }

  const points = {
    positions: [],
  };

  const step = 1 / numPoints;

  for ( let i = 0; i <= numPoints; i ++ ) {
    const t = i * step;

    // Cubic Bezier
    const A =              ( 1 - t ) ** 3;
    const B = 3 * t      * ( 1 - t ) ** 2;
    const C = 3 * t ** 2 * ( 1 - t );
    const D =     t ** 3;

    // Repeat all points except first and last (since we are defining individual lines)
    const shouldRepeat = i != 0 && i != numPoints;
    for ( let repeat = 0; repeat <= shouldRepeat ? 1 : 0; repeat ++ ) { 
      for ( let j = 0; j < 3; j ++ ) {
        const P0 = start[ j ];
        const P1 = control1[ j ];
        const P2 = control2[ j ];
        const P3 = end[ j ];

        points.positions.push(
          A * P0 + B * P1 + C * P2 + D * P3
        );
      }
    }
  }

  return points;
}

export function Plane( width = 1, height = 1, widthSegments = 1, heightSegments = 1 ) {
  const plane = {
    positions: [],
    normals: [],
    indices: [],
  };

  for ( let row = 0; row <= heightSegments; row ++ ) {
    for ( let col = 0; col <= widthSegments; col ++ ) {
      plane.positions.push( width * ( -0.5 + col / widthSegments ), 0, height * ( -0.5 + row / heightSegments ) );
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


// TODO: Optional caps at top and bottom? Bonus: Rounded caps? (cap height?)
//       In theory, we could have Sphere and Cylinder be special cases of a common Pill with top height, mid height, and bottom height
//       Sphere is equal top and bottom height with no mid, cylinder is all mid
// TODO: Is there any reason to subdivide this into height segments?
export function Cylinder( width = 1, height = 1, depth = 1, radiusTop = 1, radiusBottom = 1, thetaStart = 0, thetaLength = Math.PI * 2, widthSegments = 32 ) {
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

    cylinder.positions.push( radiusTop * cosTheta, height, radiusTop * sinTheta );
    cylinder.normals.push( ...normal );

    cylinder.positions.push( radiusBottom * cosTheta, -height, radiusBottom * sinTheta );
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
export function Cone( width = 1, height = 1, depth = 1, thetaStart = 0, thetaLength = Math.PI * 2, widthSegments = 32 ) {
  return Cylinder( width, height, depth, 0, 1, thetaStart, thetaLength, widthSegments);
}
