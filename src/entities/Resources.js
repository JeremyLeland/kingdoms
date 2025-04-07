import * as MeshCommon from '../common/MeshCommon.js';

export const WoodModel = {
  Plank: {
    mesh: MeshCommon.Cube(),
    pos: [ 0, 0.05, 0 ],
    scale: [ 0.1, 0.05, 0.5 ],
    color: [ 0.5, 0.2, 0.0 ],
  },
};

export const StoneModel = {
  Block: {
    mesh: MeshCommon.Cube(),
    pos: [ 0, 0.2, 0 ],
    scale: [ 0.1, 0.2, 0.3 ],
    color: [ 0.4, 0.4, 0.4 ],
  },
};