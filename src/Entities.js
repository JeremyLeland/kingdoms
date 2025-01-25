export const Info = {
  'Tree': ( () => {
    const TRUNK_WIDTH = 0.2, TRUNK_HEIGHT = 0.2;
    const TREE_WIDTH = 0.4, TREE_HEIGHT = 1;

    const trunk = new Path2D();
    trunk.roundRect( -TRUNK_WIDTH / 2, -TRUNK_HEIGHT, TRUNK_WIDTH, TRUNK_HEIGHT );

    const branches = new Path2D();
    branches.moveTo( 0, -TREE_HEIGHT );
    branches.lineTo(  TREE_WIDTH, -TRUNK_HEIGHT );
    branches.lineTo( -TREE_WIDTH, -TRUNK_HEIGHT );
    branches.closePath();

    return [
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
    ];
  } )(),
}

export function draw( ctx, info ) {
  info.forEach( layer => {
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