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
  ImpactRot: 0.2,
};

export const TreeModel = {
  bounds: [ TreeInfo.LeavesRadius, TreeInfo.TrunkHeight + TreeInfo.LeavesHeight, TreeInfo.LeavesRadius ],
  animations: {
    impact: {
      duration: 300,
    },
    fell: {
      duration: 1000,
    },
    sink: {
      duration: 2000,
    },
  },
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
    impact: {
      start: {
        rot: [ 0, 0, 0 ],
      },
      control1: {
        rot: [ 0, 0, TreeInfo.ImpactRot ],
      },
      end: {
        rot: [ 0, 0, 0 ],
      },
    },
    sink: {
      start: {
        pos: [ 0, 0, 0 ],
        rot: [ 0, 0, Math.PI / 2 ],
      },
      control1: {
        pos: [ 0, -0.5, 0 ],
        rot: [ 0, 0, Math.PI / 2 ],
      },
      end: {
        pos: [ 0, -1.5, 0 ],
        rot: [ 0, 0, Math.PI / 2 ],
      },
    },
  },
  parts: {
    Trunk: {
      mesh: MeshCommon.Cylinder( TreeInfo.TrunkRadius, TreeInfo.TrunkHeight, TreeInfo.TrunkRadius ),
      pos: [ 0, TreeInfo.TrunkHeight / 2, 0 ],
      material: TreeInfo.TrunkMaterial,
    },
    Leaves: {
      mesh: MeshCommon.Cone( TreeInfo.LeavesRadius, TreeInfo.LeavesHeight, TreeInfo.LeavesRadius ),
      pos: [ 0, ( TreeInfo.TrunkHeight + TreeInfo.LeavesHeight ) / 2, 0 ],
      material: TreeInfo.LeavesMaterial,
    },
    Leaves2: {
      mesh: MeshCommon.Cone( TreeInfo.LeavesRadius * 0.9, TreeInfo.LeavesHeight * 0.9, TreeInfo.LeavesRadius * 0.9 ),
      pos: [ 0, ( TreeInfo.TrunkHeight + TreeInfo.LeavesHeight ) / 2 + 0.6, 0 ],
      material: TreeInfo.LeavesMaterial,
    },
    Leaves3: {
      mesh: MeshCommon.Cone( TreeInfo.LeavesRadius * 0.8, TreeInfo.LeavesHeight * 0.8, TreeInfo.LeavesRadius * 0.8  ),
      pos: [ 0, ( TreeInfo.TrunkHeight + TreeInfo.LeavesHeight ) / 2 + 1.2, 0 ],
      material: TreeInfo.LeavesMaterial,
    }
  }
}
