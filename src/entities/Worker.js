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


// TODO: Helper function to add offsets to existing path

export const Model = {
  bounds: [ 0.5, 1.5, 0.5 ],
  animations: {
    walk: {
      duration: 1000,
      loop: true,
    },
    carry: {
      duration: 1000,
      loop: true,
    },
    swing: {
      duration: 800,
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
        carry: {
          start: {
            pos: [ Info.BodyRadius, Info.CarryHeight, -Info.BodyRadius ],
          },
          control1: {
            pos: [ Info.BodyRadius + 0.1, Info.CarryHeight, -Info.BodyRadius ],
          },
          end: {
            pos: [ Info.BodyRadius, Info.CarryHeight, -Info.BodyRadius ],
          }
        },
        swing: {
          start: {
            pos: [ Info.BodyRadius - 0.2, 1, Info.BodyRadius ],
            rot: [ Math.PI / 4, 0, Math.PI / 4 ],
            offset: [ 0, 0.2, 0 ],
          },
          control1: {
            pos: [ Info.BodyRadius, 0.5, -Info.BodyRadius ],
            rot: [ Math.PI / 4, 0, -Math.PI / 4 ],
            offset: [ 0, 0.2, 0 ],
          },
          end: {
            pos: [ 0, 0.25, -Info.BodyRadius ],
            rot: [ Math.PI / 4, 0, -Math.PI / 2 ],
            offset: [ 0, 0.2, 0 ],
          },
        },
      },
    },
    RightHand: {
      mesh: MeshCommon.Sphere( Info.HandRadius, Info.HandRadius, Info.HandRadius ),
      material: Info.SkinMaterial,
      animationPaths: {
        walk: WalkBobPath,
        carry: {
          start: {
            pos: [ Info.BodyRadius, Info.CarryHeight, Info.BodyRadius ],
          },
          control1: {
            pos: [ Info.BodyRadius + 0.1, Info.CarryHeight, Info.BodyRadius ],
          },
          end: {
            pos: [ Info.BodyRadius, Info.CarryHeight, Info.BodyRadius ],
          }
        },
        swing: {
          start: {
            pos: [ Info.BodyRadius - 0.2, 1, Info.BodyRadius ],
            rot: [ Math.PI / 4, 0, Math.PI / 4 ],
            offset: [ 0, -0.2, 0 ],
          },
          control1: {
            pos: [ Info.BodyRadius, 0.5, -Info.BodyRadius ],
            rot: [ Math.PI / 4, 0, -Math.PI / 4 ],
            offset: [ 0, -0.2, 0 ],
          },
          end: {
            pos: [ 0, 0.25, -Info.BodyRadius ],
            rot: [ Math.PI / 4, 0, -Math.PI / 2 ],
            offset: [ 0, -0.2, 0 ],
          },
        },
      },
    },
    Carry: {
      // pos: [ Info.BodyRadius, Info.CarryHeight + 0.1, 0 ],
      animationPaths: {
        walk: WalkBobPath,
        carry: {
          start: {
            pos: [ Info.BodyRadius, Info.CarryHeight, 0 ],
          },
          control1: {
            pos: [ Info.BodyRadius + 0.1, Info.CarryHeight, 0 ],
          },
          end: {
            pos: [ Info.BodyRadius, Info.CarryHeight, 0 ],
          }
        },
        // Position for swing matches left hand, since this is the base of the axe
        swing: {
          start: {
            pos: [ Info.BodyRadius - 0.2, 1, Info.BodyRadius ],
            rot: [ Math.PI / 4, 0, Math.PI / 4 ],
          },
          control1: {
            pos: [ Info.BodyRadius, 0.5, -Info.BodyRadius ],
            rot: [ Math.PI / 4, 0, -Math.PI / 4 ],
          },
          end: {
            pos: [ 0, 0.25, -Info.BodyRadius ],
            rot: [ Math.PI / 4, 0, -Math.PI / 2 ],
          },
        },
      },
      attach: 'carry',
      // TODO: attachFunc, something to specify how to draw multiple items
    },
  }
};

const AxeInfo = {
  Head: {
    Height: 0.15,
    Width: 0.3,
  },
  Handle: {
    Height: 0.35,
    Radius: 0.05,
  },
}

export const Axe = {
  parts: {
    Head: {
      mesh: MeshCommon.Cylinder( AxeInfo.Head.Width, AxeInfo.Head.Height, AxeInfo.Handle.Radius ),
      pos: [ 0, ( AxeInfo.Handle.Height + AxeInfo.Head.Height ), 0 ],
      material: {
        shader: ShaderCommon.Lighting,
        uniforms: { color: [ 0.2, 0.2, 0.2 ] },
      },
    },
    Handle: {
      mesh: MeshCommon.Cylinder( AxeInfo.Handle.Radius, AxeInfo.Handle.Height, AxeInfo.Handle.Radius ),
      material: {
        shader: ShaderCommon.Lighting,
        uniforms: { color: [ 0.3, 0.2, 0.1 ] },
      },
    },
  }
}
