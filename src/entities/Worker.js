import * as MeshCommon from '../common/MeshCommon.js';
import * as ShaderCommon from '../common/ShaderCommon.js';

export const Info = {
  SkinMaterial: {
    shader: ShaderCommon.Lighting,
    uniforms: { color: [ 0.7, 0.6, 0.5 ] },
  },
  Neck: 0.2,
  HeadRadius: 0.3,
  BodyRadius: 0.5,
  BodyHeight: 1,
  BodyMaterial: {
    shader: ShaderCommon.Lighting,
    uniforms: { color: [ 0.1, 0.2, 0.4 ] },
  },
  CarryWidth: 0.4,
  CarryHeight: 0.4,
  WalkTime: 1000,
  WalkSpeed: 0.001,
  TurnSpeed: 0.004,
  PickupDelay: 500,
  UnloadDelay: 500,
};

// The "bob" part of the walk is used by head and hands
const WalkBobFrames = [
  {
    time: 0,
    pos: [ 0, 0, 0 ],
  },
  {
    time: 0.5,
    pos: [ 0, -0.25, 0 ],
  },
  {
    time: 1,
    pos: [ 0, 0, 0 ],
  },
];

// TODO: Support cubic paths of some sort
//       Maybe specify start and end points, then some number of control points?
//       Control points for each keyframe?
//       We can probably accomplish most of what we want for now with a single path

export const Model = {
  bounds: [ 0.5, 1.5, 0.5 ],
  animations: {
    walk: {
      duration: 1000,
      loop: true,
    },
    swing: {
      duration: 1000,
    },
  },
  parts: {
    Head: {
      mesh: MeshCommon.Sphere(),
      pos: [ 0, Info.BodyHeight + Info.Neck, 0 ],
      scale: [ Info.HeadRadius, Info.HeadRadius, Info.HeadRadius ],
      material: Info.SkinMaterial,
      keyframes: {
        walk: WalkBobFrames,
      },
    },
    Body: {
      mesh: MeshCommon.Sphere( 32, 32, 0, Math.PI * 2, 0, Math.PI / 2 ),
      scale: [ Info.BodyRadius, Info.BodyHeight, Info.BodyRadius ],
      material: Info.BodyMaterial,
      keyframes: {
        walk: [
          {
            time: 0,
            scale: [ 1, 1, 1 ],
          },
          {
            time: 0.5,
            scale: [ 1, 0.75, 1 ],
          },
          {
            time: 1,
            scale: [ 1, 1, 1 ],
          },
        ],
      }
    },
    LeftHand: {
      mesh: MeshCommon.Sphere(),
      scale: [ 0.1, 0.1, 0.1 ],
      material: Info.SkinMaterial,
      keyframes: {
        walk: WalkBobFrames,
        carry: {
          time: 0,
          pos: [ Info.BodyRadius, Info.CarryHeight, -Info.CarryWidth ],
        },
        swing: [
          {
            time: 0,
            pos: [ Info.BodyRadius, 1, 0 ],
          },
          {
            time: 1,
            pos: [ 0, 0, -Info.BodyRadius ],
          },
        ],
      },
    },
    RightHand: {
      mesh: MeshCommon.Sphere(),
      scale: [ 0.1, 0.1, 0.1 ],
      material: Info.SkinMaterial,
      keyframes: {
        walk: WalkBobFrames,
        carry: {
          time: 0,
          pos: [ Info.BodyRadius, Info.CarryHeight, Info.CarryWidth ],
        },
        swing: [
          {
            time: 0,
            pos: [ 0, 1, Info.BodyRadius ],
          },
          {
            time: 1,
            pos: [ Info.BodyRadius, 0.5, 0 ],
          },
        ],
      },
    },
    Carry: {
      pos: [ Info.BodyRadius, Info.CarryHeight + 0.1, 0 ],
      keyframes: {
        walk: WalkBobFrames,
      },
      attach: 'carry',
      // TODO: attachFunc, something to specify how to draw multiple items
    },
  }
};
