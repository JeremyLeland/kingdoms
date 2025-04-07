import * as MeshCommon from '../common/MeshCommon.js';

export const Info = {
  SkinColor: [ 0.7, 0.6, 0.5 ],
  Neck: 0.2,
  BodyRadius: 0.5,
  BodyHeight: 1,
  BodyColor: [ 0.1, 0.2, 0.4 ],
  CarryWidth: 0.4,
  CarryHeight: 0.4,
  WalkTime: 1000,
  WalkSpeed: 0.001,
  TurnSpeed: 0.004,
}

// The "bob" part of the walk is used by head and hands
const WalkBobFrames = [
  {
    time: 0,
    pos: [ 0, 0, 0 ],
  },
  {
    time: Info.WalkTime / 2,
    pos: [ 0, -0.25, 0 ],
  },
  {
    time: Info.WalkTime,
    pos: [ 0, 0, 0 ],
  },
];

export const Model = {
  Head: {
    mesh: MeshCommon.Sphere(),
    pos: [ 0, Info.BodyHeight + Info.Neck, 0 ],
    scale: [ 0.3, 0.3, 0.3 ],
    color: Info.SkinColor,
    keyframes: {
      walk: WalkBobFrames,
    },
  },
  Body: {
    mesh: MeshCommon.Sphere( 32, 32, 0, Math.PI * 2, 0, Math.PI / 2 ),
    scale: [ Info.BodyRadius, Info.BodyHeight, Info.BodyRadius ],
    color: Info.BodyColor,
    keyframes: {
      walk: [
        {
          time: 0,
          scale: [ 1, 1, 1 ],
        },
        {
          time: Info.WalkTime / 2,
          scale: [ 1, 0.75, 1 ],
        },
        {
          time: Info.WalkTime,
          scale: [ 1, 1, 1 ],
        },
      ],
    }
  },
  LeftHand: {
    mesh: MeshCommon.Sphere(),
    pos: [ Info.BodyRadius, Info.CarryHeight, -Info.CarryWidth ],
    scale: [ 0.1, 0.1, 0.1 ],
    color: Info.SkinColor,
    keyframes: {
      walk: WalkBobFrames,
    },
  },
  RightHand: {
    mesh: MeshCommon.Sphere(),
    pos: [ Info.BodyRadius, Info.CarryHeight, Info.CarryWidth ],
    scale: [ 0.1, 0.1, 0.1 ],
    color: Info.SkinColor,
    keyframes: {
      walk: WalkBobFrames,
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
};
