export async function fileToPngBase64(file: File, maxSide?: number): Promise<string> {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  
    // 建立 Image 載入
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = dataUrl
    })
  
    // 縮放（可選）
    let { width, height } = img
    if (maxSide) {
      const scale = Math.min(1, maxSide / Math.max(width, height))
      width = Math.round(width * scale)
      height = Math.round(height * scale)
    }
  
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(img, 0, 0, width, height)
  
    // 轉成 PNG Base64
    return canvas.toDataURL('image/png') // data:image/png;base64,....
  }