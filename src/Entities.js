export const Info = {
  'Tree': ( () => {
    const TRUNK_WIDTH = 0.2, TRUNK_HEIGHT = 0.2;
    const TREE_WIDTH = 0.4, TREE_HEIGHT = 1;

    const trunk = new Path2D();
    trunk.roundRect( -TRUNK_WIDTH / 2, -TRUNK_HEIGHT * 2, TRUNK_WIDTH, TRUNK_HEIGHT * 2, TRUNK_WIDTH / 3 );

    const branches = new Path2D();
    branches.moveTo( 0, -TREE_HEIGHT );
    branches.lineTo(  TREE_WIDTH, -TRUNK_HEIGHT );
    branches.lineTo( -TREE_WIDTH, -TRUNK_HEIGHT );
    branches.closePath();

    return {
      width: 1,
      height: 1,
      drawLayers: [
        {
          fillStyle: 'brown',
          fill: trunk,
          stroke: trunk,
        },
        {
          fillStyle: 'green',
          fill: branches,
          stroke: branches,
        },
      ]
    };
  } )(),
  'Farm': ( () => {
    const SIZE = 3;

    const ROW_WIDTH = 0.21, ROW_HEIGHT = 2.8;
    const GAP_WIDTH = 0.25;

    const ground = new Path2D();
    ground.roundRect( -SIZE / 2, -SIZE / 2, SIZE, SIZE, 0.2 );

    const rows = new Path2D();

    for ( let i = 0; i < 6; i ++ ) {
      rows.roundRect( -1.5 + GAP_WIDTH + i * ( ROW_WIDTH + GAP_WIDTH ), -ROW_HEIGHT / 2, ROW_WIDTH, ROW_HEIGHT, 0.1 );
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
      ],
    };
  } )(),
}

export function draw( ctx, entity ) {
  ctx.save(); {
    ctx.translate( entity.x, entity.y );
    
    Info[ entity.type ].drawLayers.forEach( layer => {
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