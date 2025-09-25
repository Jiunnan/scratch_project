import * as XLSX from 'xlsx'

type RowObject = Record<string, any>

/**
 * 將「陣列物件」匯出為 xlsx
 * @param rows  e.g. [{name:'JN', count:1}, ...]
 * @param filename  e.g. '抽獎清單.xlsx'
 * @param sheetName e.g. 'Sheet1'
 * @param headerOrder 指定欄位順序（可選）
 */

export function exportObjectsToXlsx(
    rows: RowObject[],
    filename = 'export.xlsx',
    sheetName = 'Sheet1',
    headerOrder?: string[]
  ) {
    if (!rows?.length) {
      // 空檔也會建立，只有表頭（若 headerOrder 有傳）
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.aoa_to_sheet([headerOrder ?? []])
      autoFitSheet(ws, headerOrder?.map(h => h) ?? [])
      XLSX.utils.book_append_sheet(wb, ws, sheetName)
      XLSX.writeFile(wb, filename)
      return
    }
  
    const headers = headerOrder ?? Object.keys(rows[0])
  
    // 只挑指定欄位並維持順序
    const normalized = rows.map(r => headers.map(h => r[h]))
  
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet([headers, ...normalized])
  
    autoFitSheet(ws, headers, normalized)
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
    XLSX.writeFile(wb, filename)
  }
  
  /**
   * 將「二維陣列」匯出為 xlsx
   * @param rows e.g. [['姓名','次數'], ['JN',1], ...]
   */
  export function exportArray2DToXlsx(
    rows: (string | number | boolean | null | undefined)[][],
    filename = 'export.xlsx',
    sheetName = 'Sheet1'
  ) {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet(rows ?? [])
    const headers = rows?.[0]?.map(String) ?? []
    const body = rows?.slice(1) ?? []
    autoFitSheet(ws, headers, body)
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
    XLSX.writeFile(wb, filename)
  }
  
  /** 依內容長度自動調整欄寬（中文也可） */
  function autoFitSheet(
    ws: XLSX.WorkSheet,
    headers: string[],
    body?: any[][]
  ) {
    const colCount = headers.length;
    const data = [headers, ...(body ?? [])];
    const colWidths: number[] = new Array(colCount).fill(10);
  
    for (let c = 0; c < colCount; c++) {
      let max = 8;
      for (let r = 0; r < data.length; r++) {
        const cell = data[r]?.[c];
        const txt = cell == null ? '' : String(cell);
        const width = textVisualWidth(txt);
        if (width > max) max = width;
      }
      colWidths[c] = Math.min(max + 2, 60); // padding
    }
  
    // ✅ 不用 @ts-ignore；用型別斷言或 Reflect.set
    const cols = colWidths.map(wch => ({ wch }));
    (ws as XLSX.WorkSheet & { ['!cols']?: { wch: number }[] })['!cols'] = cols;
    // 或者：Reflect.set(ws, '!cols', cols);
  }

  // 估算一個字元的視覺寬度（非 ASCII 視為寬字元）
function charVisualWidth(ch: string): number {
    const cp = ch.codePointAt(0) ?? 0;
    return cp > 0xFF ? 2 : 1;
  }
  
  function textVisualWidth(txt: string): number {
    let w = 0;
    for (const ch of Array.from(txt)) w += charVisualWidth(ch);
    return w;
  }