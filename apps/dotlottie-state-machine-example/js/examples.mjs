function easingProps() {
  return {
    o: { x: [0.333, 0.333], y: [0, 0] },
    i: { x: [0.667, 0.667], y: [1, 1] },
  };
}

export default [
  {
    name: 'Partial Animated Color',
    animationPath: './assets/rect_animated.json',
    data: {
      rules: [
        {
          sid: 'rect_color',
          ty: 'color',
          pk: [
            {
              t: 60,
              s: [0, 0, 0, 1],
            },
          ],
        },
      ],
    },
  },
  {
    name: 'Partial Animated Scale',
    animationPath: './assets/rect_animated.json',
    data: {
      rules: [
        {
          sid: 'rect_scale',
          ty: 'color',
          pk: [
            {
              t: 60,
              s: [20, 20],
            },
          ],
        },
      ],
    },
  },
  {
    name: 'Expression',
    animationPath: './assets/rect.json',
    data: {
      rules: [
        {
          sid: 'rect_rotation',
          ty: 'rotation',
          x: 'var $bm_rt = time * 360;',
        },
        {
          sid: 'rect_position',
          ty: 'position',
          x: 'var $bm_rt = [];\n$bm_rt[0] = value[0] + Math.cos(2 * Math.PI * time) * 100;\n$bm_rt[1] = value[1];',
        },
        {
          sid: 'rect_scale',
          ty: 'scale',
          x: 'var $bm_rt = [];\n$bm_rt[0] = value[0] + Math.cos(2 * Math.PI * time) * 100;\n$bm_rt[1] = value[1];',
        },
      ],
    },
  },
  {
    name: 'Animated Gradient',
    animationPath: './assets/gradient.json',
    data: {
      rules: [
        {
          sid: 'gradient_color',
          ty: 'gradient_color',
          k: [
            {
              t: 0,
              ...easingProps(),
              value: {
                color_stops: [
                  {
                    offset: 0,
                    color: { r: 0, g: 255, b: 0, a: 255 },
                  },
                  {
                    offset: 0.5,
                    color: { r: 255, g: 255, b: 0, a: 255 },
                  },
                  {
                    offset: 1,
                    color: { r: 0, g: 255, b: 255, a: 255 },
                  },
                ],
              },
            },
            {
              t: 100,
              ...easingProps(),
              value: {
                color_stops: [
                  {
                    offset: 0,
                    color: { r: 255, g: 0, b: 255, a: 255 },
                  },
                  {
                    offset: 0.5,
                    color: { r: 255, g: 255, b: 0, a: 255 },
                  },
                  {
                    offset: 1,
                    color: { r: 0, g: 255, b: 255, a: 255 },
                  },
                ],
              },
            },
            {
              t: 200,
              value: {
                color_stops: [
                  {
                    offset: 0,
                    color: { r: 0, g: 255, b: 0, a: 255 },
                  },
                  {
                    offset: 0.5,
                    color: { r: 0, g: 255, b: 0, a: 255 },
                  },
                  {
                    offset: 1,
                    color: { r: 0, g: 0, b: 255, a: 255 },
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  },
  {
    name: 'Gradient',
    animationPath: './assets/gradient.json',
    data: {
      rules: [
        {
          sid: 'gradient_start_point',
          ty: 'gradient_start_point',
          value: {
            x: 100,
            y: 100,
          },
        },
        {
          sid: 'gradient_end_point',
          ty: 'gradient_end_point',
          ty: {
            x: 300,
            y: 300,
          },
        },
        {
          sid: 'gradient_opacity',
          ty: 'gradient_opacity',

          value: 50,
        },
        {
          sid: 'gradient_color',
          ty: 'gradient_color',

          value: {
            color_stops: [
              {
                offset: 0,
                color: { r: 255, g: 0, b: 0, a: 255 },
              },
              {
                offset: 0.5,
                color: { r: 0, g: 255, b: 0, a: 255 },
              },
              {
                offset: 1,
                color: { r: 255, g: 255, b: 0, a: 255 },
              },
            ],
          },
        },
      ],
    },
  },
  {
    name: 'Image',
    animationPath: './assets/image.json',
    data: {
      rules: [
        {
          sid: 'sun_img',
          ty: 'image_asset',
          value: {
            width: 500,
            embedded: false,
            filename: 'https://placehold.co/400',
            path: '',
          },
        },
      ],
    },
  },
  {
    name: 'Skew',
    animationPath: './assets/rect.json',
    data: {
      rules: [
        {
          sid: 'rect_skew',
          ty: 'skew',
          k: 200,
        },
      ],
    },
  },
  {
    name: 'Animated Skew',
    animationPath: './assets/rect.json',
    data: {
      rules: [
        {
          sid: 'rect_skew',
          ty: 'skew',
          k: [
            {
              t: 0,
              s: [100],
              ...easingProps(),
            },
            {
              t: 60,
              s: [200],
              ...easingProps(),
            },
            {
              t: 180,
              s: [300],
            },
          ],
        },
      ],
    },
  },
  {
    name: 'Skew Angle',
    animationPath: './assets/rect.json',
    data: {
      rules: [
        {
          sid: 'rect_skew',
          ty: 'skew',
          k: 200,
        },
        {
          sid: 'rect_skew_angle',
          ty: 'skew_angle',
          k: 300,
        },
      ],
    },
  },
  {
    name: 'Animated Skew Angle',
    animationPath: './assets/rect.json',
    data: {
      rules: [
        {
          sid: 'rect_skew',
          ty: 'skew',
          k: 250,
        },
        {
          sid: 'rect_skew_angle',
          ty: 'skew_angle',
          k: [
            {
              t: 0,
              s: [0],
              ...easingProps(),
            },
            {
              t: 60,
              s: [100],
              ...easingProps(),
            },
            {
              t: 180,
              s: [300],
            },
          ],
        },
      ],
    },
  },
  {
    name: 'Rotation',
    animationPath: './assets/rect.json',
    data: {
      rules: [
        {
          sid: 'rect_rotation',
          ty: 'rotation',
          k: 120,
        },
      ],
    },
  },
  {
    name: 'Animated Rotation',
    animationPath: './assets/rect.json',
    data: {
      rules: [
        {
          sid: 'rect_rotation',
          ty: 'rotation',
          k: [
            {
              t: 0,
              s: [0],
              ...easingProps(),
            },
            {
              t: 60,
              s: [120],
              ...easingProps(),
            },
            {
              t: 120,
              s: [360],
            },
          ],
        },
      ],
    },
  },
  {
    name: 'Anchor Point',
    animationPath: './assets/rect.json',
    data: {
      rules: [
        {
          sid: 'rect_anchor_point',
          ty: 'anchor_point',
          k: [320, 350],
        },
      ],
    },
  },
  {
    name: 'Animated Anchor Point',
    animationPath: './assets/rect.json',
    data: {
      rules: [
        {
          sid: 'rect_anchor_point',
          ty: 'anchor_point',
          k: [
            {
              t: 0,
              s: [320, 350],
              ...easingProps(),
            },
            {
              t: 180,
              s: [100, 100],
            },
          ],
        },
      ],
    },
  },
  {
    name: 'Scale',
    animationPath: './assets/rect.json',
    data: {
      rules: [
        {
          sid: 'rect_scale',
          ty: 'scale',
          k: [60, 60],
        },
      ],
    },
  },
  {
    name: 'Animated Scale',
    animationPath: './assets/rect.json',
    data: {
      rules: [
        {
          sid: 'rect_scale',
          ty: 'scale',
          k: [
            {
              t: 0,
              s: [50, 50],
              ...easingProps(),
            },
            {
              t: 180,
              s: [100, 100],
            },
          ],
        },
      ],
    },
  },
  {
    name: 'Static Position',
    animationPath: './assets/rect.json',
    data: {
      rules: [
        {
          sid: 'rect_position',
          ty: 'position',
          k: [320, 400],
        },
      ],
    },
  },
  {
    name: 'Animated Position',
    animationPath: './assets/rect.json',
    data: {
      rules: [
        {
          sid: 'rect_position',
          ty: 'position',
          k: [
            {
              t: 0,
              s: [200, 300],
              ...easingProps(),
            },
            {
              t: 180,
              s: [100, 100],
            },
          ],
        },
      ],
    },
  },
  {
    name: 'Color',
    animationPath: './assets/bouncy_ball.json',
    data: {
      rules: [
        {
          sid: 'ball_color',
          ty: 'color',
          k: [0, 1, 0, 1],
        },
      ],
    },
  },
  {
    name: 'Animated Color',
    animationPath: './assets/bouncy_ball.json',
    data: {
      rules: [
        {
          sid: 'ball_color',
          ty: 'color',
          k: [
            {
              t: 0,
              s: [0, 1, 0, 1],
              ...easingProps(),
            },
            {
              t: 100,
              s: [1, 0, 0, 1],
              ...easingProps(),
            },
            {
              t: 200,
              s: [0, 1, 0, 1],
              ...easingProps(),
            },
          ],
        },
      ],
    },
  },
  {
    name: 'Opacity',
    animationPath: './assets/bouncy_ball.json',
    data: {
      rules: [
        {
          sid: 'ball_opacity',
          ty: 'opacity',
          k: 40,
        },
      ],
    },
  },
  {
    name: 'Animated Opacity',
    animationPath: './assets/bouncy_ball.json',
    data: {
      rules: [
        {
          sid: 'ball_opacity',
          ty: 'opacity',
          k: [
            {
              t: 0,
              s: [100],
              ...easingProps(),
            },
            {
              t: 60,
              s: [60],
              ...easingProps(),
            },
            {
              t: 120,
              s: [10],
              ...easingProps(),
            },
          ],
        },
      ],
    },
  },
];
