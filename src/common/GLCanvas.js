const MAX_UPDATE = 100;

export class GLCanvas {
  #reqId;

  constructor( canvas ) {
    this.canvas = canvas;
    
    if ( !this.canvas ) {
      this.canvas = document.createElement( 'canvas' );
      document.body.appendChild( this.canvas );
    }
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    
    this.canvas.oncontextmenu = () => { return false };
    
    this.gl = this.canvas.getContext( 'webgl2' );

    if ( this.gl === null ) {
      alert( "Unable to initialize WebGL. Your browser or machine may not support it." );
    }

    this.gl.clearColor( 0.3, 0.2, 0.1, 1.0 );
    this.gl.clearDepth( 1.0 );
    this.gl.enable( this.gl.DEPTH_TEST );
    this.gl.depthFunc( this.gl.LEQUAL );

    //
    // Resize with parent element
    //

    const resizeObserver = new ResizeObserver( entries => {
      entries.forEach( entry => {
        // safari does not support devicePixelContentBoxSize, attempting to work around
        const width = entry.devicePixelContentBoxSize?.[ 0 ].inlineSize ?? ( entry.contentBoxSize[ 0 ].inlineSize * devicePixelRatio );
        const height = entry.devicePixelContentBoxSize?.[ 0 ].blockSize ?? ( entry.contentBoxSize[ 0 ].blockSize * devicePixelRatio );
        this.canvas.width = width;
        this.canvas.height = height;

        // this still needs to be based on content box
        const inlineSize = entry.contentBoxSize[ 0 ].inlineSize;
        const blockSize = entry.contentBoxSize[ 0 ].blockSize;

        this.gl.viewport( 0, 0, width, height );
      } );
      
      this.redraw();
    } );

    resizeObserver.observe( this.canvas );
  }

  redraw() {
    this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );
    this.draw( this.gl );
  }

  // TODO: Handle starts if already started, stops if already stopped...
  //       check if reqId not null? (set null in stop)

  start() {
    if ( !this.#reqId ) {     // don't try to start again if already started
      let lastTime;
      const animate = ( now ) => {
        lastTime ??= now;  // for first call only
        this.update( Math.min( now - lastTime, MAX_UPDATE ) );
        lastTime = now;
    
        this.redraw();
    
        if ( this.#reqId ) {    // make sure we didn't stop it
          this.#reqId = requestAnimationFrame( animate );
        }
      };

      this.#reqId = requestAnimationFrame( animate );
    }
  }

  stop() {
    cancelAnimationFrame( this.#reqId );
    this.#reqId = null;   // so we can check if stopped
  }

  update( dt ) {}
  draw( ctx ) {}
}
