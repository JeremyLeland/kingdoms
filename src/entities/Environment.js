import * as MeshCommon from '../common/MeshCommon.js';
import * as ShaderCommon from '../common/ShaderCommon.js';

const TreeInfo = {
  TrunkRadius: 0.4,
  TrunkHeight: 0.375,
  TrunkMaterial: {
    shader: ShaderCommon.Lighting,
    uniforms: { color: [ 0.5, 0.2, 0.0 ] },
  },
  LeavesRadius: 1.25,
  LeavesHeight: 1.25,
  LeavesMaterial: {
    shader: ShaderCommon.Lighting,
    uniforms: { color: [ 0.1, 0.3, 0.1 ] },
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
      control1: {
        rot: [ 0, 0, 0.1 * Math.PI / 2 ],
      },
      control2: {
        rot: [ 0, 0, 0.2 * Math.PI / 2 ],
      },
      end: {
        rot: [ 0, 0, Math.PI / 2 ],
      },
    },
    impact: {
      start: {
        rot: [ 0, 0, 0 ],
      },
      control1: {
        rot: [ 0, 0, TreeInfo.ImpactRot ],
      },
      control2: {
        rot: [ 0, 0, -TreeInfo.ImpactRot ],
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
      control2: {
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
      pos: [ 0, TreeInfo.TrunkHeight, 0 ],
      material: TreeInfo.TrunkMaterial,
    },
    Leaves: {
      mesh: MeshCommon.Cone( TreeInfo.LeavesRadius, TreeInfo.LeavesHeight, TreeInfo.LeavesRadius ),
      pos: [ 0, TreeInfo.TrunkHeight + TreeInfo.LeavesHeight, 0 ],
      material: TreeInfo.LeavesMaterial,
    },
    Leaves2: {
      mesh: MeshCommon.Cone( TreeInfo.LeavesRadius * 0.9, TreeInfo.LeavesHeight * 0.9, TreeInfo.LeavesRadius * 0.9 ),
      pos: [ 0, TreeInfo.TrunkHeight + TreeInfo.LeavesHeight + 0.6, 0 ],
      material: TreeInfo.LeavesMaterial,
    },
    Leaves3: {
      mesh: MeshCommon.Cone( TreeInfo.LeavesRadius * 0.8, TreeInfo.LeavesHeight * 0.8, TreeInfo.LeavesRadius * 0.8  ),
      pos: [ 0, TreeInfo.TrunkHeight + TreeInfo.LeavesHeight + 1.2, 0 ],
      material: TreeInfo.LeavesMaterial,
    }
  }
};

const RockInfo = {
  Bounds: [ 0.4, 0.7, 0.4 ],
  BelowGround: 0.3,
  Material: {
    shader: ShaderCommon.Lighting,
    uniforms: { color: [ 0.3, 0.3, 0.3 ] },
  },
};

export const RockModel = {
  bounds: RockInfo.Bounds,
  parts: {
    Main: {
      mesh: MeshCommon.Sphere( ...RockInfo.Bounds ),
      pos: [ 0, RockInfo.BelowGround, 0 ],
      material: RockInfo.Material,
    },
  },
};

const BushInfo = {
  Radius: 0.5,
  BelowGround: 0.3,
  Material: {
    shader: ShaderCommon.Lighting,
    uniforms: { color: [ 0.1, 0.3, 0.1 ] },
  },
  NumBerries: 41,
  BerryRadius: 0.02,
  BerryMaterial: {
    shader: ShaderCommon.Lighting,
    uniforms: { color: [ 0.7, 0.1, 0.2 ] },
  },
};

export const BushModel = {
  bounds: [ BushInfo.Radius, BushInfo.Radius, BushInfo.Radius ],
  parts: {
    Main: {
      mesh: MeshCommon.Sphere( BushInfo.Radius, BushInfo.Radius, BushInfo.Radius ),
      pos: [ 0, BushInfo.BelowGround, 0 ],
      material: BushInfo.Material,
    },
  },
};

for ( let i = 0; i < BushInfo.NumBerries; i ++ ) {
  const phi = ( i / BushInfo.NumBerries ) * Math.PI * 2;
  const theta = 0.25 + 0.75 * Math.sin( ( i / BushInfo.NumBerries ) * Math.PI * 32 );

  // Why are berries only on one side? Trying to get them evenly distributed, sort of

  const x = BushInfo.Radius * Math.cos( phi ) * Math.cos( theta );
  const y = BushInfo.Radius * Math.sin( theta ) + BushInfo.BelowGround;
  const z = BushInfo.Radius * Math.sin( phi ) * Math.cos( theta );

  BushModel.parts[ `Berry${ i }` ] = {
    mesh: MeshCommon.Sphere( BushInfo.BerryRadius, BushInfo.BerryRadius, BushInfo.BerryRadius ),
    pos: [ x, y, z ],
    material: BushInfo.BerryMaterial,
  }
}
