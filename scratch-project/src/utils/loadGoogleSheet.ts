// src/utils/sheets.ts
export type SheetsFetchOptions = {
    spreadsheetId: string
    range: string                       // 例如 'Sheet1!A1:Z' 或 '工作表!A:Z'
    apiKey: string
    valueRenderOption?: 'FORMATTED_VALUE' | 'UNFORMATTED_VALUE' | 'FORMULA'
    dateTimeRenderOption?: 'SERIAL_NUMBER' | 'FORMATTED_STRING'
    majorDimension?: 'ROWS' | 'COLUMNS'
    signal?: AbortSignal
  }
  
  /** 讀取 Google Sheets 為二維陣列 rows: string[][] */
  export async function fetchSheetValues(opts: SheetsFetchOptions): Promise<string[][]> {
    const {
      spreadsheetId,
      range,
      apiKey,
      valueRenderOption = 'FORMATTED_VALUE',
      dateTimeRenderOption = 'FORMATTED_STRING',
      majorDimension = 'ROWS',
      signal,
    } = opts
  
    const base = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}`
    const url = `${base}?key=${encodeURIComponent(apiKey)}&valueRenderOption=${valueRenderOption}&dateTimeRenderOption=${dateTimeRenderOption}&majorDimension=${majorDimension}`
  
    const res = await fetch(url, { signal })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`Sheets API error ${res.status}: ${text || res.statusText}`)
    }
    const json = await res.json()
    return (json.values ?? []) as string[][]
  }
  
  /** 以第一列作為欄位名，輸出物件陣列（自動補齊缺欄位為空字串） */
  export async function fetchSheetAsObjects(opts: SheetsFetchOptions): Promise<Record<string, string>[]> {
    const rows = await fetchSheetValues(opts)
    if (!rows.length) return []
    const headers = rows[0].map(h => String(h || '').trim())
    const body = rows.slice(1)
    return body.map(row => {
      const obj: Record<string, string> = {}
      headers.forEach((key, i) => { obj[key || `col_${i}`] = String(row[i] ?? '') })
      return obj
    })
  }
  