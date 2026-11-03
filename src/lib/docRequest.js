// Nơi nhận yêu cầu bổ sung hồ sơ (máy chủ, Google Apps Script, Formspree…).
// Để trống: chưa gửi đi đâu, trang vẫn báo đã nhận để thử giao diện.
const docRequestEndpoint = ''

export async function submitDocRequest(request) {
  if (!docRequestEndpoint) {
    console.info('[Kính Lúp] Chưa cấu hình nơi nhận yêu cầu hồ sơ, yêu cầu chưa được gửi đi.')
    return
  }
  const response = await fetch(docRequestEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  if (!response.ok) throw new Error(`Gửi yêu cầu thất bại (HTTP ${response.status})`)
}
