import * as MeshCommon from '../common/MeshCommon.js';

export const StockpileModel = {
  Base: {
    mesh: MeshCommon.Cube(),
    pos: [ 0, 0.05, 0 ],
    scale: [ 0.5, 0.05, 0.5 ],
    color: [ 0.7, 0.7, 0.7 ],
  },
  Pile: {
    pos: [ 0, 0.05 * 2, 0 ],
    attach: 'pile',
  },
};