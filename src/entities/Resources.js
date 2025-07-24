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


// TODO: Keep berry info in one spot

const BasketInfo = {
  BerryRadius: 0.015,
  BerrySegments: 6,
  BerryMaterial: {
    shader: ShaderCommon.Lighting,
    uniforms: { color: [ 0.7, 0.1, 0.2 ] },
  },
  Rungs: 8,
};

const BasketBounds = [ 0.25, 0.1, 0.25 ];

export const BasketModel = {
  bounds: BasketBounds,
  parts: {
    Basket: {
      mesh: MeshCommon.Sphere( ...BasketBounds, 32, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2 ),//, 32, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI ),
      pos: [ 0, BasketBounds[ 1 ], 0 ],
      material: {
        shader: ShaderCommon.Lighting,
        uniforms: { color: [ 0.6, 0.4, 0.2 ] },
      },
    },
  },
};

for ( let rung = 0; rung < BasketInfo.Rungs; rung ++ ) {

  const radius = 0.15 - 0.15 * ( rung / BasketInfo.Rungs );
  const numBerries = Math.floor( Math.PI * radius / BasketInfo.BerryRadius );

  for ( let i = 0; i < numBerries; i ++ ) {
    const phi = ( i / numBerries ) * Math.PI * 2;
    
    const x = radius * Math.cos( phi );
    const y = 0.075 + BasketInfo.BerryRadius * rung;
    const z = radius * Math.sin( phi );
    
    BasketModel.parts[ `Berry${rung}_${ i }` ] = {
      mesh: MeshCommon.Sphere( BasketInfo.BerryRadius, BasketInfo.BerryRadius, BasketInfo.BerryRadius, BasketInfo.BerrySegments, BasketInfo.BerrySegments ),
      pos: [ x, y, z ],
      material: BasketInfo.BerryMaterial,
    }
  }
}