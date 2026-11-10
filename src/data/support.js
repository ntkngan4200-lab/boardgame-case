import { products } from './home'
import { caseDocumentOptions } from './product1'

// Hỗ trợ › Hồ sơ: vụ án nào có danh mục hồ sơ để yêu cầu bổ sung
const docRequestCases = {
  p1: {
    productId: 'p1',
    title: 'Phạm Thùy Chi',
    // Mỗi lần yêu cầu ít nhất 1, tối đa 3 hồ sơ
    question: {
      id: 'ho-so-p1',
      minPick: 1,
      pick: 3,
      pickUnit: 'ít nhất một hồ sơ',
      options: caseDocumentOptions,
      backTo: '/ho-tro/ho-so',
    },
  },
}

export function getDocRequestCase(productId) {
  return docRequestCases[productId] ?? null
}

// Lưới vụ án: vụ án đã ra mắt đứng trước, bấm vào để tới phiếu yêu cầu hồ sơ
export const docRequestProducts = [...products]
  .sort((a, b) => Number(Boolean(a.comingSoon)) - Number(Boolean(b.comingSoon)))
  .map((product) => ({
    ...product,
    to: docRequestCases[product.id] ? `/ho-tro/ho-so/${product.id}` : undefined,
  }))
