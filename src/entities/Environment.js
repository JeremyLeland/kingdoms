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
};

export const TreeModel = {
  bounds: [ TreeInfo.LeavesRadius, TreeInfo.TrunkHeight + TreeInfo.LeavesHeight, TreeInfo.LeavesRadius ],
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