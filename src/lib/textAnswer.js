const encoder = new TextEncoder()
// Cụm từ dài nhất được chấp nhận (số chữ), vd. "buon ban bat hop phap" = 5 chữ
const MAX_PHRASE_WORDS = 6

async function sha256Hex(text) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(text))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

// "Buồn LẬU!" → "buon lau": bỏ dấu, đ → d, chữ thường, ký tự khác chữ/số thành khoảng trắng
export function normalizeAnswer(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

// Ô tự điền đúng khi câu trả lời có chứa một cụm từ được chấp nhận.
// Cụm từ lưu dạng SHA-256 của "<questionId>:<fieldId>:<cụm từ đã normalizeAnswer>", tạo bằng:
//   printf '%s' 'p1-o1-q1:mat-hang:thuoc la dien tu' | shasum -a 256
// So từng cụm liền nhau 1–MAX_PHRASE_WORDS chữ trong câu trả lời với danh sách hash.
export async function checkTextAnswer(question, field, text) {
  const words = normalizeAnswer(text).split(' ').filter(Boolean)
  const phrases = new Set()
  for (let start = 0; start < words.length; start++) {
    for (let end = start + 1; end <= Math.min(words.length, start + MAX_PHRASE_WORDS); end++) {
      phrases.add(words.slice(start, end).join(' '))
    }
  }
  const hashes = await Promise.all([...phrases].map((phrase) => sha256Hex(`${question.id}:${field.id}:${phrase}`)))
  return hashes.some((hash) => field.phraseHashes.includes(hash))
}
