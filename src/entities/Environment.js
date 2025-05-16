import * as MeshCommon from '../common/MeshCommon.js';
import * as ShaderCommon from '../common/ShaderCommon.js';

const TreeInfo = {
  TrunkRadius: 0.4,
  TrunkHeight: 0.75,
  TrunkMaterial: {
    shader: ShaderCommon.Lighting,
    uniforms: { color: [ 0.5, 0.2, 0.0 ] },
  },
  LeavesRadius: 1.25,
  LeavesHeight: 2.5,
  LeavesMaterial: {
    shader: ShaderCommon.Lighting,
    uniforms: { color: [ 0.1, 0.5, 0.1 ] },
  },
  ImpactRot: 0.1,
};

export const TreeModel = {
  bounds: [ TreeInfo.LeavesRadius, TreeInfo.TrunkHeight + TreeInfo.LeavesHeight, TreeInfo.LeavesRadius ],
  animations: {
    impact: {
      duration: 500,
    },
    fell: {
      duration: 1000,
    },
  },
  // TODO: Paths instead of keyframes
  //       Where to define? If its an overall path, should it be in the top level animation?
  //       Then define animation paths as applicable in the inner parts?
  //       Should each of these have a duration as well? Do they share parent one?
  //       Seems like loop would need to be shared, or cause all sorts of problems. 
  //       May as well have duration the same, too.
  animationPaths: {
    fell: {
      start: {
        rot: [ 0, 0, 0 ],
      },
      end: {
        rot: [ 0, 0, Math.PI / 2 ],
      },
      control1: {
        rot: [ 0, 0, 0.1 * Math.PI / 2 ],
      },
    },
  },
  keyframes: {
    impact: [
      {
        time: 0,
        rot: [ 0, 0, 0 ],
      },
      {
        time: 0.25,
        rot: [ 0, 0, TreeInfo.ImpactRot ],
      },
      {
        time: 0.5,
        rot: [ 0, 0, 0 ],
      },
      {
        time: 0.75,
        rot: [ 0, 0, -TreeInfo.ImpactRot ],
      },
      {
        time: 1,
        rot: [ 0, 0, 0 ],
      },
    ],
    fell: [
      {
        time: 0,
        rot: [ 0, 0, 0 ],
      },
      {
        time: 1,
        rot: [ 0, 0, Math.PI / 2 ],
      },
    ],
  },
  parts: {
    Trunk: {
      mesh: MeshCommon.Cylinder(),
      scale: [ TreeInfo.TrunkRadius, TreeInfo.TrunkHeight, TreeInfo.TrunkRadius ],
      material: TreeInfo.TrunkMaterial,
    },
    Leaves: {
      mesh: MeshCommon.Cone( 32 ),
      pos: [ 0, TreeInfo.TrunkHeight, 0 ],
      scale: [ TreeInfo.LeavesRadius, TreeInfo.LeavesHeight, TreeInfo.LeavesRadius ],
      material: TreeInfo.LeavesMaterial,
    },
    Leaves2: {
      mesh: MeshCommon.Cone( 32 ),
      pos: [ 0, TreeInfo.TrunkHeight + 0.6, 0 ],
      scale: [ TreeInfo.LeavesRadius * 0.9, TreeInfo.LeavesHeight * 0.9, TreeInfo.LeavesRadius * 0.9 ],
      material: TreeInfo.LeavesMaterial,
    },
    Leaves3: {
      mesh: MeshCommon.Cone( 32 ),
      pos: [ 0, TreeInfo.TrunkHeight + 1.2, 0 ],
      scale: [ TreeInfo.LeavesRadius * 0.8, TreeInfo.LeavesHeight * 0.8, TreeInfo.LeavesRadius * 0.8 ],
      material: TreeInfo.LeavesMaterial,
    }
  }
}
