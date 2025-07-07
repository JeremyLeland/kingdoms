import { vec3 } from '../../lib/gl-matrix.js';
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
  CarryHeight: 0.6,
  CarryDist: 0.6,
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
    pos: [ 0, -0.25, 0 ],
  },
  control2: {
    pos: [ 0, -0.25, 0 ],
  },
  end: {
    pos: [ 0, 0, 0 ],
  },
};

const WalkBodyPath = {
  start: {
    scale: [ 1, 1, 1 ],
  },
  control1: {
    scale: [ 1, 0.75, 1 ],
  },
  control2: {
    scale: [ 1, 0.75, 1 ],
  },
  end: {
    scale: [ 1, 1, 1 ],
  },
};

const CarryPos = {
  Left:  [ Info.CarryDist, Info.CarryHeight, -Info.CarryWidth ],
  Right: [ Info.CarryDist, Info.CarryHeight,  Info.CarryWidth ],
  Carry: [ Info.CarryDist, Info.CarryHeight,  0 ],
};

// TODO: Probably need to string multiple paths together to get the swing I want
//         - One for downswing, one for upswing?
// TODO: Maybe make this easier by
//         1) Show paths (maybe a bunch of intermediate points as well control points?)
//         2) Allow path to be edited in real time with HTML input controls?

const SwingPath = {
  start: {
    pos: [ Info.BodyRadius - 0.1, 0.75, Info.BodyRadius ],
    rot: [ Math.PI / 4, 0, Math.PI / 4 ],
  },
  control1: {
    pos: [ Info.BodyRadius - 1, 0.95, Info.BodyRadius + 0.2 ],
    rot: [ Math.PI / 4, 0, Math.PI ],
  },
  control2: {
    pos: [ Info.BodyRadius + 1.25, 0.45, 0 ],
    rot: [ Math.PI / 4, 0, -Math.PI / 4 ],
  },
  end: {
    pos: [ Info.BodyRadius - 0.1, 0.25, -Info.BodyRadius ],
    rot: [ Math.PI / 4, 0, -Math.PI / 2 ],
  },
};

const SwingOffset = {
  Left:  [ 0,  0.2, 0 ],
  Right: [ 0, -0.2, 0 ],
};

// TODO: Gather currently looks weird in the left hand, since it races out to grab a berry and then slowly brings it back
//       This looks better in the right hand, where it carefully reaches out and then quickly brings back
//       To do this right, they would need to both have the right path but be alternated.
//       This would require some kind of staggering and tracking separately of the hands. 
//       Not sure the complexity is worth it.

const GatherPos = {
  Left:  [ Info.BodyRadius, 0.4, -0.3 ],
  Right: [ Info.BodyRadius, 0.4,  0.3 ],
};

function getOffsetPath( path, offset ) {
  const copy = structuredClone( path );

  for ( const key in copy ) {
    copy[ key ].offset = offset;     // someday, use Object.assign() here for things besides offset?
  }

  return copy;
}

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
    gather: {
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
        carry: WalkBobPath,
      },
    },
    Body: {
      mesh: MeshCommon.Sphere( Info.BodyRadius, Info.BodyHeight, Info.BodyRadius, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2 ),
      material: Info.BodyMaterial,
      animationPaths: {
        walk: WalkBodyPath,
        carry: WalkBodyPath,
      },
    },
    LeftHand: {
      mesh: MeshCommon.Sphere( Info.HandRadius, Info.HandRadius, Info.HandRadius ),
      material: Info.SkinMaterial,
      animationPaths: {
        // TODO: Combine WalkBobPath with current carry path
        // TODO: Have walk path include some arm swinging (will this require 2 control points?)
        walk: WalkBobPath,
        carry: {
          start: {
            pos: vec3.add( [], WalkBobPath.start.pos, CarryPos.Left ),
          },
          control1: {
            pos: vec3.add( [], WalkBobPath.control1.pos, CarryPos.Left ),
          },
          control2: {
            pos: vec3.add( [], WalkBobPath.control2.pos, CarryPos.Left ),
          },
          end: {
            pos: vec3.add( [], WalkBobPath.end.pos, CarryPos.Left ),
          }
        },
        swing: getOffsetPath( SwingPath, SwingOffset.Left ),
        gather: {
          start: {
            pos: GatherPos.Left,
          },
          control1: {
            pos: vec3.add( [], [ 0.4, -0.2, -0.1 ], CarryPos.Left ),
          },
          control2: {
            pos: GatherPos.Left,
          },
          end: {
            pos: GatherPos.Left,
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
            pos: vec3.add( [], WalkBobPath.start.pos, CarryPos.Right ),
          },
          control1: {
            pos: vec3.add( [], WalkBobPath.control1.pos, CarryPos.Right ),
          },
          control2: {
            pos: vec3.add( [], WalkBobPath.control2.pos, CarryPos.Right ),
          },
          end: {
            pos: vec3.add( [], WalkBobPath.end.pos, CarryPos.Right ),
          }
        },
        swing: getOffsetPath( SwingPath, SwingOffset.Right ),
        gather: {
          start: {
            pos: GatherPos.Right,
          },
          control1: {
            pos: GatherPos.Right,
          },
          control2: {
            pos: vec3.add( [], [ 0.4, -0.2, 0.1 ], GatherPos.Right ),
          },
          end: {
            pos: GatherPos.Right,
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
            pos: vec3.add( [], WalkBobPath.start.pos, CarryPos.Carry ),
          },
          control1: {
            pos: vec3.add( [], WalkBobPath.control1.pos, CarryPos.Carry ),
          },
          control2: {
            pos: vec3.add( [], WalkBobPath.control2.pos, CarryPos.Carry ),
          },
          end: {
            pos: vec3.add( [], WalkBobPath.end.pos, CarryPos.Carry ),
          }
        },
        // Position for swing matches left hand, since this is the base of the axe
        swing: SwingPath,
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
