export const dashboardChartPalette = [
  '#7768D5',
  '#A596EA',
  '#5AA7DF',
  '#94D1EC',
  '#70B9A1',
  '#F08F83',
  '#B88CE8',
  '#54AFC1',
  '#A9C66C',
  '#E4A3B6',
  '#8190B5',
  '#C9B9F3'
]

export const dashboardChartOtherColor = '#B8BEC8'

export const tokenUsageTrendColors = {
  input: '#5AA7DF',
  output: '#70B9A1',
  cacheCreation: '#7768D5',
  cacheRead: '#A596EA',
  cacheHitRate: '#F08F83'
}

export const getDashboardChartColors = (count: number): string[] => {
  if (count <= 0) return []
  return Array.from({ length: count }, (_, index) => (
    dashboardChartPalette[index % dashboardChartPalette.length]
  ))
}
