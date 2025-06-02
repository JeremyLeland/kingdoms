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
  HandRadius: 0.1,
  CarryWidth: 0.4,
  CarryHeight: 0.4,
  WalkTime: 1000,
  WalkSpeed: 0.001,
  TurnSpeed: 0.004,
  PickupDelay: 500,
  UnloadDelay: 500,
};

// The "bob" part of the walk is used by head and hands
const WalkBobPath = {
  start: {
    pos: [ 0, 0, 0 ],
  },
  control1: {
    pos: [ 0, -0.5, 0 ],
  },
  end: {
    pos: [ 0, 0, 0 ],
  },
};


// TODO: Support cubic paths of some sort
//       Maybe specify start and end points, then some number of control points?
//       Control points for each keyframe?
//       We can probably accomplish most of what we want for now with a single path

// TODO: Make the worker always use hands together (holding axe, carrying wood, etc)
//       And the warriors can use hands separately? (sword in one, shield in other)
//       What if we want a warrior to use an axe? And workers could walk with hands swinging separately?
//       Having everything have separate paths is simplest, but figuring out the right paths is hard :(
//       Maybe add an offset? So we could use rotation to move around offset instead of trying to figure out positions

// TODO: It's easiest to animate one thing. A sword, an axe, a bundle of wood.
//       Sometimes there is one hand attached to it, sometimes there are two.
//       For my own sanity, I need a way to specify what the hands are moving based on
//       Giving the hands and axe the same transforms is the same as attaching them.
//       Maybe the "offset" should be relative to that?

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
      mesh: MeshCommon.Sphere( Info.HeadRadius, Info.HeadRadius, Info.HeadRadius ),
      pos: [ 0, Info.BodyHeight + Info.Neck, 0 ],
      material: Info.SkinMaterial,
      animationPaths: {
        walk: WalkBobPath,
      },
    },
    Body: {
      mesh: MeshCommon.Sphere( Info.BodyRadius, Info.BodyHeight, Info.BodyRadius, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2 ),
      material: Info.BodyMaterial,
      animationPaths: {
        walk: {
          start: {
            scale: [ 1, 1, 1 ],
          },
          control1: {
            scale: [ 1, 0.5, 1 ],
          },
          end: {
            scale: [ 1, 1, 1 ],
          },
        },
      },
    },
    LeftHand: {
      mesh: MeshCommon.Sphere( Info.HandRadius, Info.HandRadius, Info.HandRadius ),
      material: Info.SkinMaterial,
      animationPaths: {
        walk: WalkBobPath,
        swing: {
          start: {
            // pos: [ Info.BodyRadius, 0.5, 0 ],
            // offset: [ 1, 0, 0 ],
            // rot: [ 1, 0, 1 ],
          },
          control1: {
            // pos: [ Info.BodyRadius, 0.25, -Info.BodyRadius ],
            // offset: [ 1, 0, 0 ],
            // rot: [ 2, 0, 2 ],
          },
          end: {
            // pos: [ 0, 0, -Info.BodyRadius ],
            // offset: [ 1, 0, 0 ],
            // rot: [ 3, 0, 3 ],
          },
        },
      },
    },
    RightHand: {
      mesh: MeshCommon.Sphere( Info.HandRadius, Info.HandRadius, Info.HandRadius ),
      material: Info.SkinMaterial,
      animationPaths: {
        walk: WalkBobPath,
        swing: {
          start: {
            // pos: [ 0, 1, Info.BodyRadius ],
            // offset: [ 1, 0, 0 ],
            // rot: [ 1, 0, 0 ],
          },
          control1: {
            // pos: [ Info.BodyRadius + 0.2, 1.2, Info.BodyRadius ],
            // offset: [ 1, 0, 0 ],
            // rot: [ 2, 0, 1 ],
          },
          end: {
            // pos: [ Info.BodyRadius, 0.5, 0 ],
            // offset: [ 1, 0, 0 ],
            // rot: [ 3, 0, 2 ],
          },
        },
      },
    },
    Carry: {
      // pos: [ Info.BodyRadius, Info.CarryHeight + 0.1, 0 ],
      animationPaths: {
        walk: WalkBobPath,
        // Position for swing matches left hand, since this is the base of the axe
        swing: {
          start: {
            pos: [ Info.BodyRadius, 0.5, 0 ],
            //pos: [ Info.BodyRadius, 0, 0 ],
            // rot: [ Math.PI / 4, 0, 0.6 ],
            //offset: [ 1, 0, 0 ],
            rot: [ Math.PI / 4, 0, 0 ],
          },
          control1: {
            pos: [ Info.BodyRadius, 0.25, -Info.BodyRadius ],
            //pos: [ Info.BodyRadius, 0, 0 ],
            // rot: [ Math.PI / 4, 0, -0.2 ],
            //offset: [ 1, 0, 0 ],
            rot: [ Math.PI / 4, 0, -Math.PI / 4 ],
          },
          end: {
            pos: [ 0, 0, -Info.BodyRadius ],
            //pos: [ Info.BodyRadius, 0, 0 ],
            // rot: [ Math.PI / 4, 0, -0.6 ],
            //offset: [ 1, 0, 0 ],
            rot: [ Math.PI / 4, 0, -Math.PI / 2 ],
          },
        },
      },
      attach: 'carry',
      // TODO: attachFunc, something to specify how to draw multiple items
    },
  }
};

export const Axe = {
  parts: {
    Head: {
      mesh: MeshCommon.Cylinder(),
      pos: [ 0, 1, 0 ],
      scale: [ 0.3, 0.3, 0.05 ],
      material: {
        shader: ShaderCommon.Lighting,
        uniforms: { color: [ 0.2, 0.2, 0.2 ] },
      },
    },
    Handle: {
      mesh: MeshCommon.Cylinder(),
      pos: [ 0, 0, 0 ],
      scale: [ 0.05, 1, 0.05 ],
      material: {
        shader: ShaderCommon.Lighting,
        uniforms: { color: [ 0.3, 0.2, 0.1 ] },
      },
    },
  }
}
