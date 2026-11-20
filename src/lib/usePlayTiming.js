import { useSyncExternalStore } from 'react'
import { getPlayTiming, subscribeProgress } from './progress'

// Đồng hồ chơi của mã đang dùng, vẽ lại mỗi khi tạm dừng / tiếp tục / có thao tác mới
export function usePlayTiming(productId) {
  return useSyncExternalStore(subscribeProgress, () => getPlayTiming(productId))
}
