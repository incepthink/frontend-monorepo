import { colors as baseColors } from '@repo/lib/shared/services/chakra/themes/base/colors'

export const colors = {
  ...baseColors,
  base: {
    light: 'background.level1',
    hslLight: '44,22%,90%',
    dark: 'hsla(216,12%,25%,1)',
    hslDark: '216,12%,25%',
  },
  font: {
    primary: '#00F5E0', // this defines --chakra-colors-font-primary
  },
}

export const primaryTextColor = `linear-gradient(45deg, ${colors.gray['700']} 0%, ${colors.gray['500']} 100%)`
