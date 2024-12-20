export function toSlots(theme, animationSlottedProperties) {
  const slots = {};

  const slotFunctions = {
    color: to2DArraySlotValue,

    gradient_color: toGradientColorSlot,

    position: to2DArraySlotValue,
    scale: to2DArraySlotValue,
    anchor_point: to2DArraySlotValue,
    gradient_start_point: to2DArraySlotValue,
    gradient_end_point: to2DArraySlotValue,

    gradient_opacity: toScalarSlotValue,
    rotation: toScalarSlotValue,
    opacity: toScalarSlotValue,
    stroke_width: toScalarSlotValue,
    skew: toScalarSlotValue,
    skew_angle: toScalarSlotValue,

    image_asset: toImageAssetSlot,
  };

  for (const rule of theme.rules) {
    const func = slotFunctions[rule.ty];
    if (func) {
      slots[rule['sid']] = func(rule, animationSlottedProperties);
    } else {
      throw new Error(`Unknown rule type: ${rule.ty}`);
    }
  }

  return slots;
}

function toImageAssetSlot(rule) {
  const p = {};

  if (rule.value.width) {
    p.w = rule.value.width;
  }

  if (rule.value.height) {
    p.h = rule.value.height;
  }

  if (rule.value.filename) {
    p.p = rule.value.filename;
  }

  if (rule.value.path) {
    p.u = rule.value.path;
  }

  if (rule.value.embedded) {
    p.e = rule.value.embedded;
  }

  return {
    p,
  };
}

function toGradientColorSlot(rule) {
  let a = 0;
  let k = [];

  if (rule.k) {
    a = 1;
    for (const keyframe of rule.k) {
      const keyframValue = {};
      keyframValue.t = keyframe.t;
      keyframValue.s = [];

      for (const colorStop of keyframe.value.color_stops) {
        keyframValue.s.push(colorStop.offset);
        keyframValue.s.push(colorStop.color.r / 255);
        keyframValue.s.push(colorStop.color.g / 255);
        keyframValue.s.push(colorStop.color.b / 255);
      }

      for (const colorStop of keyframe.value.color_stops) {
        keyframValue.s.push(colorStop.offset);
        keyframValue.s.push(colorStop.color.a / 255);
      }

      if (keyframe.i) {
        keyframValue.i = keyframe.i;
      }

      if (keyframe.o) {
        keyframValue.o = keyframe.o;
      }

      k.push(keyframValue);
    }
  } else {
    for (const colorStop of rule.value.color_stops) {
      k.push(colorStop.offset);
      k.push(colorStop.color.r / 255);
      k.push(colorStop.color.g / 255);
      k.push(colorStop.color.b / 255);
    }

    for (const colorStop of rule.value.color_stops) {
      k.push(colorStop.offset);
      k.push(colorStop.color.a / 255);
    }
  }

  return {
    p: {
      a,
      k,
    },
  };
}

function to2DArraySlotValue(rule, animationSlottedProperties) {
  let a = undefined;
  let k = undefined;
  let x = rule.x;

  if (Array.isArray(rule.pk) && rule.pk.length > 0) {
    const originalK = animationSlottedProperties.find((prop) => prop.sid === rule.sid)?.k || [];

    k = originalK.map((originalkeyframe) => {
      rule.pk.forEach((partialkeyframe) => {
        if (Number(partialkeyframe.t) === Number(originalkeyframe.t)) {
          Object.assign(originalkeyframe, partialkeyframe);
        }
      });
      return originalkeyframe;
    });

    a = 1;
  }

  k = rule.k;

  if (Array.isArray(rule.k) && rule.k.length > 0 && typeof rule.k[0] === 'object') {
    a = 1;
  } else {
    a = 0;
  }

  return {
    p: {
      a,
      k,
      x,
    },
  };
}

function toScalarSlotValue(rule, animationSlottedProperties) {
  let a = undefined;
  let k = undefined;
  let x = rule.x;

  if (Array.isArray(rule.pk) && rule.pk.length > 0) {
    const originalK = animationSlottedProperties.find((prop) => prop.sid === rule.sid)?.k || [];
    const frameIndexMap = new Map(rule.pk.map((keyframe) => [Number(keyframe.t), keyframe]));

    k = originalK.map((keyframe) => {
      const keyframeTime = Number(keyframe.t);
      if (frameIndexMap.has(keyframeTime)) {
        const update = frameIndexMap.get(keyframeTime);
        return {
          ...keyframe,
          ...update,
        };
      }
      return keyframe;
    });

    a = 1;
  }

  k = rule.k;

  if (Array.isArray(rule.k) && rule.k.length > 0 && typeof rule.k[0] === 'object') {
    a = 1;
  } else {
    a = 0;
  }

  return {
    p: {
      a,
      k,
      x,
    },
  };
}
