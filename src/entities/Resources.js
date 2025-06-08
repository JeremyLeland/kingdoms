import * as MeshCommon from '../common/MeshCommon.js';
import * as ShaderCommon from '../common/ShaderCommon.js';

const WoodBounds = [ 0.1, 0.05, 0.5 ];

export const WoodModel = {
  bounds: WoodBounds,
  parts: {
    Plank: {
      mesh: MeshCommon.Cube( ...WoodBounds),
      pos: [ 0, WoodBounds[ 1 ], 0 ],
      material: {
        shader: ShaderCommon.Lighting,
        uniforms: { color: [ 0.5, 0.2, 0.0 ] },
      },
    },
  },
};

const StoneBounds = [ 0.1, 0.2, 0.3 ];

export const StoneModel = {
  bounds: StoneBounds,
  parts: {
    Block: {
      mesh: MeshCommon.Cube( ...StoneBounds),
      pos: [ 0, StoneBounds[ 1 ], 0 ],
      material: {
        shader: ShaderCommon.Lighting,
        uniforms: { color: [ 0.4, 0.4, 0.4 ] },
      },
    },
  },
};