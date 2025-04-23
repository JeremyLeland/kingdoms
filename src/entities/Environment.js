import * as MeshCommon from '../common/MeshCommon.js';

const TreeInfo = {
  TrunkRadius: 0.4,
  TrunkHeight: 0.75,
  LeavesRadius: 1.25,
  LeavesHeight: 2.5,
}

export const TreeModel = {
  bounds: [ TreeInfo.LeavesRadius, TreeInfo.TrunkHeight + TreeInfo.LeavesHeight, TreeInfo.LeavesRadius ],
  parts: {
    Trunk: {
      mesh: MeshCommon.Cylinder(),
      scale: [ TreeInfo.TrunkRadius, TreeInfo.TrunkHeight, TreeInfo.TrunkRadius ],
      color: [ 0.5, 0.2, 0.0 ],
    },
    Leaves: {
      mesh: MeshCommon.Cone( 32 ),
      pos: [ 0, TreeInfo.TrunkHeight, 0 ],
      scale: [ TreeInfo.LeavesRadius, TreeInfo.LeavesHeight, TreeInfo.LeavesRadius ],
      color: [ 0.1, 0.5, 0.1 ],
    }
  }
}