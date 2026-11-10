const encoder = new TextEncoder()

// So đáp án qua hash để người chơi xem source không thấy ngay đáp án đúng.
// Sắp xếp id trước khi băm để thứ tự chọn không ảnh hưởng kết quả.
async function sha256Hex(text) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(text))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

// Số lựa chọn đúng trong các lựa chọn đã chọn (chỉ với câu hỏi có correctOptionHashes)
export async function countCorrect(question, optionIds) {
  if (!question.correctOptionHashes) return null
  const hashes = await Promise.all(optionIds.map((id) => sha256Hex(`${question.id}:${id}`)))
  return hashes.filter((hash) => question.correctOptionHashes.includes(hash)).length
}

// Câu hỏi có nhiều cặp đáp án đúng thì dùng answerHashes (mảng); chỉ một đáp án thì dùng answerHash
export async function verifyAnswer(question, optionIds) {
  const key = `${question.id}:${[...optionIds].sort().join(',')}`
  const hash = await sha256Hex(key)
  return (question.answerHashes ?? [question.answerHash]).includes(hash)
}

// Mã truy cập: bỏ khoảng trắng, không phân biệt hoa thường
export async function verifyAccessCode(access, code) {
  const normalized = code.trim().toUpperCase()
  return access.codeHashes.includes(await sha256Hex(`${access.productId}:${normalized}`))
}
