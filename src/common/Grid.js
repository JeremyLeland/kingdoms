export class Grid {
  #path;

  constructor( minX, minY, maxX, maxY ) {
    this.#path = getGrid( minX, minY, maxX, maxY );
  }

  draw( ctx ) {
  // ctx.save(); {

      // Make it look like:
      // + - - +
      // |     |
      // |     |
      // + - - +
      // ctx.setLineDash( [ 0.1, 0.2, 0.1, 0.2, 0.1, 0.2, 0.1, 0 ] );
      ctx.fillStyle = ctx.strokeStyle = '#ccca';

      ctx.stroke( this.#path );

      if ( false ) {
        ctx.font = '0.2px Arial';
        ctx.textAlign = 'center';
        // ctx.textBaseline = 'middle';

        // ctx.translate( minX, minY );
        for ( let row = minY; row <= maxY; row ++ ) {
          // ctx.save(); {
            for ( let col = minX; col <= maxX; col ++ ) {
              ctx.fillText( `(${ col },${ row })`, col, row );
              // ctx.translate( 1, 0 );
            }
          // }
          // ctx.restore();

          // ctx.translate( 0, 1 );
        }
      }
    // }
    // ctx.restore();
  }
}

function getGrid( minX, minY, maxX, maxY ) {
  const grid = new Path2D();

  for ( let col = minX; col <= maxX + 1; col ++ ) {
    grid.moveTo( col - 0.5, minY - 0.5 );
    grid.lineTo( col - 0.5, maxY + 0.5 );
  }

  for ( let row = minY; row <= maxY + 1; row ++ ) {
    grid.moveTo( minX - 0.5, row - 0.5 );
    grid.lineTo( maxX + 0.5, row - 0.5 );
  }

  return grid;
}