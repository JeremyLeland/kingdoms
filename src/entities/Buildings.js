import * as MeshCommon from '../common/MeshCommon.js';

// TODO: Make bounds separate from scale for now (this was messing up objects in pile)

const StockpileBounds = [ 0.5, 0.05, 0.5 ];

export const StockpileModel = {
  bounds: StockpileBounds,
  parts: {
    Base: {
      mesh: MeshCommon.Cube(),
      pos: [ 0, StockpileBounds[ 1 ], 0 ],
      scale: StockpileBounds,
      color: [ 0.7, 0.7, 0.7 ],
    },
    Pile: {
      pos: [ 0, StockpileBounds[ 1 ] * 2, 0 ],
      attach: 'pile',
    },
  }
};