export class MatrixStack {
  #stack = [];

  constructor( initial ) {
    this.#stack.push( initial );
  }

  get current() {
    return this.#stack.at( -1 );
  }

  // TODO: Don't pop stack, just move index. Only push new copies if needed.
  // (Do this for potential performance improvement from avoiding garbage collecting)

  save() {
    // since matrices are Float32Arrays, use slice() to make copy
    this.#stack.push( this.current.slice() );
  }

  restore() {
    this.#stack.pop();
  }
}