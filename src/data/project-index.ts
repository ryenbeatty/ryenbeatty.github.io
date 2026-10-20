import { projectIndexSchema } from '../schemas/project-index'

export const projectIndexConfig = projectIndexSchema.parse({
  rows: [
    {
      tiles: [{
        project: 'outbound',
        width: 'full',
        height: 'tall',
        visibleIn: { default: false, outpost: true },
        outpost: {
          type: 'video',
          // url: 'https://www.youtube.com/watch?v=29XymHesxa0&t=2s',
          url: 'https://www.youtube.com/watch?v=kSZddHca0ME'
        },
      }],
    },
    {
      tiles: [
        { project: 'kato', width: 'half', height: 'regular', visibleIn: { default: true, outpost: false }, outpost: { type: 'video', url: 'https://www.youtube.com/watch?v=29XymHesxa0&t=2s' } },
        { project: 'outbound', width: 'half', height: 'regular', visibleIn: { default: true, outpost: false }, outpost: { type: 'video', url: 'https://www.youtube.com/watch?v=29XymHesxa0&t=2s' } },
      ],
    },
    {
      tiles: [
        { project: 'researchgate', width: 'half', height: 'regular' },
        { project: 'scout', width: 'half', height: 'regular' },
      ],
    },
    // {
    //   tiles: [
    //     { project: 'outbound', width: 'half', height: 'short' },
    //     { project: 'outbound', width: 'half', height: 'short' },
    //   ],
    // },

  ],
})
