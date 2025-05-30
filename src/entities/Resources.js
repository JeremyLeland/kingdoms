import * as MeshCommon from '../common/MeshCommon.js';
import * as ShaderCommon from '../common/ShaderCommon.js';

// TODO: Want to keep track of overall bounds for objects
// Should I just hardcode this separately from inner scales, or calculate it somehow?
// Feels like I'll be duplicating it a bunch, but could be trickier for more complex obejcts
// Could also be weird for specifying scaling animations
// Would we define things as a porportion of 1,1,1, but then stretch them out by bounds?

// Either way, will need another level of specification

const WoodBounds = [ 0.1, 0.05, 0.5 ];

export const WoodModel = {
  bounds: WoodBounds,
  parts: {
    Plank: {
      mesh: MeshCommon.Cube(),
      pos: [ 0, WoodBounds[ 1 ], 0 ],
      scale: WoodBounds,
      material: {
        shader: ShaderCommon.Lighting,
        uniforms: { color: [ 0.5, 0.2, 0.0 ] },
      }
    },
  }
};

const StoneBounds = [ 0.1, 0.2, 0.3 ];

export const StoneModel = {
  bounds: StoneBounds,
  parts: {
    Block: {
      mesh: MeshCommon.Cube(),
      pos: [ 0, StoneBounds[ 1 ], 0 ],
      scale: StoneBounds,
      material: {
        shader: ShaderCommon.Lighting,
        uniforms: { color: [ 0.4, 0.4, 0.4 ] },
      }
    },
  }
};