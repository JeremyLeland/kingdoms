export const Direction = {
  North: 'North',
  East: 'East',
  South: 'South',
  West: 'West',
};

export const Info = {
  'Tree': ( () => {
    const TRUNK_WIDTH = 0.2, TRUNK_HEIGHT = 0.2;
    const TREE_WIDTH = 0.4, TREE_HEIGHT = 2;

    const trunk = new Path2D();
    trunk.roundRect( -TRUNK_WIDTH / 2, -TRUNK_HEIGHT * 1.5, TRUNK_WIDTH, TRUNK_HEIGHT * 1.5, TRUNK_WIDTH / 3 );

    const top = new Path2D();
    top.roundRect( -TRUNK_WIDTH / 2, -TRUNK_HEIGHT * 1.5, TRUNK_WIDTH, TRUNK_HEIGHT * 0.5, TRUNK_WIDTH / 3 );

    const branches = new Path2D();
    branches.moveTo( 0, -TREE_HEIGHT );
    branches.lineTo(  TREE_WIDTH, -TRUNK_HEIGHT );
    branches.lineTo( -TREE_WIDTH, -TRUNK_HEIGHT );
    branches.closePath();

    // TODO: Can hide top when tree is intact and hide branches after tree is harvested?
    //       Maybe the keyframes needs to be a higher level so elements can belong to only certain animations?

    return {
      width: 1,
      height: 1,
      drawLayers: [
        {
          fillStyle: 'saddlebrown',
          fill: trunk,
          stroke: trunk,
        },
        {
          fillStyle: 'sienna',
          fill: top,
          stroke: top,
        },
        {
          keyframes: {
            fell: {
              duration: 5000,
              rotate: {
                x: TRUNK_WIDTH,
                y: -TRUNK_HEIGHT,
                angle: [ 0, 1.8 ],
              },
            },
          },
          
          fillStyle: 'green',
          fill: branches,
          stroke: branches,
        },
      ]
    };
  } )(),

  'Board': ( () => {
    const WIDTH = 0.8, HEIGHT = 0.2, DEPTH = 0.05;

    const northTop = new Path2D();
    northTop.rect( -WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT );

    const northSide = new Path2D();
    northSide.rect( -WIDTH / 2, HEIGHT / 2, WIDTH, DEPTH );

    const eastTop = new Path2D();
    eastTop.rect( -HEIGHT / 2, -WIDTH / 2, HEIGHT, WIDTH );

    const eastSide = new Path2D();
    eastSide.rect( -HEIGHT / 2, WIDTH / 2, HEIGHT, DEPTH );

    return {
      width: 1,
      height: 1,
      depth: DEPTH,
      drawLayers: {
        'North': [
          {
            fillStyle: 'sienna',
            fill: northTop,
            stroke: northTop,
          },
          {
            fillStyle: 'sienna',
            fill: northSide,
            stroke: northSide,
          },
        ],
        'East': [
          {
            fillStyle: 'sienna',
            fill: eastTop,
            stroke: eastTop,
          },
          {
            fillStyle: 'sienna',
            fill: eastSide,
            stroke: eastSide,
          },
        ]
      },
    };
  } )(),

  'Farm': ( () => {
    const SIZE = 3;

    const ROW_WIDTH = 0.21, ROW_HEIGHT = 2.8;
    const GAP_WIDTH = 0.25;
    const PLANT_WIDTH = 0.15, PLANT_HEIGHT = 0.2, PLANT_SUB_HEIGHT = 0.1;

    const ground = new Path2D();
    ground.roundRect( -SIZE / 2, -SIZE / 2, SIZE, SIZE, 0.2 );

    const rows = new Path2D();
    const plants = new Path2D();

    for ( let col = 0; col < 6; col ++ ) {
      const rowLeft = -1.5 + GAP_WIDTH + col * ( ROW_WIDTH + GAP_WIDTH );

      rows.roundRect( rowLeft, -ROW_HEIGHT / 2, ROW_WIDTH, ROW_HEIGHT, 0.1 );

      const x = rowLeft + ROW_WIDTH / 2;

      for ( let row = 0; row < 6; row ++ ) {
        const y = -1.2 + row / 2;
        
        plants.moveTo( x, y );
        plants.lineTo( x - PLANT_WIDTH, y - PLANT_HEIGHT );
        plants.lineTo( x, y - PLANT_SUB_HEIGHT );
        plants.lineTo( x + PLANT_WIDTH, y - PLANT_HEIGHT );
        plants.lineTo( x, y );
      }
    }
    
    return {
      width: SIZE,
      height: SIZE,
      drawLayers: [
        {
          fillStyle: 'sienna',
          fill: ground,
          stroke: ground,
        },
        {
          fillStyle: 'saddlebrown',
          fill: rows,
          stroke: rows,
        },
        {
          fillStyle: 'green',
          fill: plants,
          stroke: plants,
        },
      ],
    };
  } )(),

  'House': ( () => {

    const SIZE = 2;

    const ROOF_WIDTH = SIZE * 0.45, ROOF_TOP = SIZE * 0.85, ROOF_BOTTOM = SIZE * 0.5, ROOF_DEPTH = SIZE * 0.5;
    const FRONT_WIDTH = SIZE * 0.4;
    const DOOR_WIDTH = SIZE * 0.15, DOOR_HEIGHT = SIZE * 0.4;

    const y = ROOF_TOP / 2;

    const front = new Path2D();
    front.rect( -FRONT_WIDTH, y - ROOF_TOP, FRONT_WIDTH * 2, ROOF_TOP );

    const door = new Path2D();
    door.rect( -DOOR_WIDTH, y - DOOR_HEIGHT, DOOR_WIDTH * 2, DOOR_HEIGHT );

    const leftRoof = new Path2D();
    leftRoof.lineTo( 0, y - ROOF_TOP );
    leftRoof.lineTo( 0, y - ROOF_TOP - ROOF_DEPTH );
    leftRoof.lineTo( -ROOF_WIDTH, y - ROOF_BOTTOM - ROOF_DEPTH );
    leftRoof.lineTo( -ROOF_WIDTH, y - ROOF_BOTTOM );
    leftRoof.closePath();

    const rightRoof = new Path2D();
    rightRoof.lineTo( 0, y - ROOF_TOP );
    rightRoof.lineTo( 0, y - ROOF_TOP - ROOF_DEPTH );
    rightRoof.lineTo( ROOF_WIDTH, y - ROOF_BOTTOM - ROOF_DEPTH );
    rightRoof.lineTo( ROOF_WIDTH, y - ROOF_BOTTOM );
    rightRoof.closePath();

    return {
      width: SIZE,
      height: SIZE,
      drawLayers: [
        {
          fillStyle: 'goldenrod',
          fill: front,
          stroke: front,
        },
        {
          fillStyle: 'sienna',
          fill: door,
          stroke: door,
        },
        {
          fillStyle: 'brown',
          fill: leftRoof,
          stroke: leftRoof,
        },
        {
          fillStyle: 'brown',
          fill: rightRoof,
          stroke: rightRoof,
        }
      ]
    };

  } )(),
}

export function draw( ctx, entity ) {
  ctx.save(); {
    ctx.translate( entity.x, entity.y );
    
    let layers = Info[ entity.type ].drawLayers;

    if ( entity.dir ) {
      layers = layers[ entity.dir ];
    }

    layers.forEach( layer => {

      if ( entity.animation ) {
        const keyframeInfo = layer.keyframes?.[ entity.animation.name ];

        if ( keyframeInfo ) {
          const partialTime = entity.animation.time / keyframeInfo.duration;

          if ( keyframeInfo.rotate ) {
            const keyAngles = keyframeInfo.rotate.angle;
            const partialAngle = keyAngles[ 0 ] + partialTime * ( keyAngles[ 1 ] - keyAngles[ 0 ] );

            ctx.translate( keyframeInfo.rotate.x, keyframeInfo.rotate.y );
            ctx.rotate( partialAngle );
            ctx.translate( -keyframeInfo.rotate.x, -keyframeInfo.rotate.y );
          }
        }
      }

      if ( layer.fill ) {
        ctx.fillStyle = layer.fillStyle ?? 'white';
        ctx.fill( layer.fill );
      }
      if ( layer.stroke ) {
        ctx.strokeStyle = layer.strokeStyle ?? 'black';
        ctx.stroke( layer.stroke );
      }
    } );  
  }
  ctx.restore();
}