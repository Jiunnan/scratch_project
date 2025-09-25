export interface ScratchSetting {
    backgroundImage: string
    maskImage: string
    scratchRatio: number // 1~2
    prizeFontSize: number // 20~40
    prizeFontColor: string
    backgroundWhiteOpacity: number
  }

export interface ScratchUser {
  userName: string
  scratchCount: number
  useCount: number
}