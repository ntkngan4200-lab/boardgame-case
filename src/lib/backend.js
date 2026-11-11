// URL Web app của Google Apps Script (apps-script/kinh-lup.gs): gửi yêu cầu hồ sơ về kinhlupinfo@gmail.com,
// ghi lượt truy cập, lưu tiến trình theo mã.
const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbzUfkVQHmZGiRy1fB7eqHzpAbayiHG-938NF3nuJg2BzhqvUUeOEWaVNUa1IF1HbLc7/exec'

// Gửi dạng text/plain để trình duyệt không cần preflight CORS (Apps Script không trả lời OPTIONS)
export async function callBackend(action, payload, { timeout = 8000, keepalive = false } = {}) {
  const response = await fetch(appsScriptUrl, {
    method: 'POST',
    body: JSON.stringify({ action, ...payload }),
    keepalive,
    signal: AbortSignal.timeout(timeout),
  })
  const result = response.ok ? await response.json().catch(() => null) : null
  if (!result?.ok) throw new Error(`Máy chủ chưa nhận yêu cầu "${action}" (HTTP ${response.status})`)
  return result
}
