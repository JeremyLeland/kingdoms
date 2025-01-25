export function draw( ctx, minX, minY, maxX, maxY ) {

  // Make it look like:
  // + - - +
  // |     |
  // |     |
  // + - - +
  ctx.setLineDash( [ 0.1, 0.2, 0.1, 0.2, 0.1, 0.2, 0.1, 0 ] );
  ctx.fillStyle = ctx.strokeStyle = '#ccca';

  for ( let col = minX; col <= maxX + 1; col ++ ) {
    ctx.moveTo( col - 0.5, minY - 0.5 );
    ctx.lineTo( col - 0.5, maxY + 0.5 );
  }

  for ( let row = minY; row <= maxY + 1; row ++ ) {
    ctx.moveTo( minX - 0.5, row - 0.5 );
    ctx.lineTo( maxX + 0.5, row - 0.5 );
  }

  ctx.stroke();

  ctx.save(); {
    ctx.font = '0.2px Arial';
    ctx.textAlign = 'center';
    // ctx.textBaseline = 'middle';

    ctx.translate( minX, minY );
    for ( let row = minY; row <= maxY; row ++ ) {
      ctx.save(); {
        for ( let col = minX; col <= maxX; col ++ ) {
          ctx.fillText( `(${ col },${ row })`, 0, 0 );
          ctx.translate( 1, 0 );
        }
      }
      ctx.restore();

      ctx.translate( 0, 1 );
    }
  }
  ctx.restore();
}