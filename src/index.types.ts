import { FigureType } from './index.enums'

export const figureTypeLabel: {
  [key in FigureType]: string
} = {
  [FigureType.VideoLoop]: 'Video Loop',
  [FigureType.Image]: 'Image',
}
