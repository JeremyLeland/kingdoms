import * as MeshCommon from '../common/MeshCommon.js';
import * as ShaderCommon from '../common/ShaderCommon.js';

const StockpileBounds = [ 0.5, 0.05, 0.5 ];

export const StockpileModel = {
  bounds: StockpileBounds,
  parts: {
    Base: {
      mesh: MeshCommon.Cube( ...StockpileBounds ),
      pos: [ 0, StockpileBounds[ 1 ], 0 ],
      material: {
        shader: ShaderCommon.Lighting,
        uniforms: { color: [ 0.7, 0.7, 0.7 ] },
      },
    },
    Pile: {
      pos: [ 0, StockpileBounds[ 1 ] * 2, 0 ],
      attach: 'pile',
    },
  }
};

const FarmInfo = {
  RowSpacing: 0.75,
  RowRadius: 0.25,
  DirtMaterial: {
    shader: ShaderCommon.Lighting,
    uniforms: { color: [ 0.4, 0.2, 0.1 ] },
  },
};

const rowMesh = MeshCommon.Cylinder( 0.25, 1, 0.25, 1, 1, Math.PI, Math.PI );

// TODO: Attachments for plants to grow

export const FarmModel = {
  bounds: [ 1, 1, 1 ],
  parts: {
    Field: {
      mesh: MeshCommon.Cube( 1, 0.05, 1 ),
      material: FarmInfo.DirtMaterial,
    },
    Row1: {
      mesh: rowMesh,
      material: FarmInfo.DirtMaterial,
      pos: [ -FarmInfo.RowSpacing, 0, 0 ],
      rot: [ Math.PI / 2, 0, 0 ],
    },
    Row2: {
      mesh: rowMesh,
      material: FarmInfo.DirtMaterial,
      rot: [ Math.PI / 2, 0, 0 ],
    },
    Row3: {
      mesh: rowMesh,
      material: FarmInfo.DirtMaterial,
      pos: [ FarmInfo.RowSpacing, 0, 0 ],
      rot: [ Math.PI / 2, 0, 0 ],
    },
  },
}
