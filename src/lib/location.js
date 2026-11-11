// Tỉnh/thành phố đoán theo địa chỉ IP (GeoJS: miễn phí, không cần khoá) để ghi kèm lượt truy cập.
// Gọi sớm khi người chơi bắt đầu nhập mã; lỗi hoặc quá lâu thì ghi "Không xác định".
let pending = null

export function lookupLocation() {
  pending ??= fetch('https://get.geojs.io/v1/ip/geo.json', { signal: AbortSignal.timeout(4000) })
    .then((response) => response.json())
    .then(({ city, region, country }) => [...new Set([city, region, country].filter(Boolean))].join(', '))
    .catch(() => '')
    .then((place) => place || 'Không xác định')
  return pending
}
