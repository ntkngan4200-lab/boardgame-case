import cover960 from '../assets/access/access-cover-960.webp'
import cover1680 from '../assets/access/access-cover-1680.webp'
import roadTile from '../assets/access/access-road-tile.webp'
import reflection from '../assets/access/access-reflection.webp'

// Access Page của từng sản phẩm: ảnh bìa + ô nhập mã truy cập.
// codeHashes = SHA-256 của "<productId>:<mã viết hoa>", tạo bằng:
//   printf 'p1:3590' | shasum -a 256
// Mã lấy từ Google Sheet "Code game" (50 bộ đầu). adminCodeHash: mã Admin, vào trang câu hỏi là đã điền sẵn đáp án.
// finalPath: trang cuối của vụ án — đồng hồ chơi dừng ở đây; lần nhập mã sau chọn Tiếp tục (xem lại) hoặc Chơi lại.
// summaryPath: trang Tóm tắt sau trang cuối (thời gian chơi + so sánh với các nhóm khác).
const accessPages = {
  p1: {
    productId: 'p1',
    title: 'Phạm Thùy Chi',
    cover: {
      srcSet: `${cover960} 960w, ${cover1680} 1680w`,
      src: cover1680,
      width: 1680,
      height: 944,
      // Mặt đường kéo dài bên dưới bìa: ô hoa văn lặp dọc liền mạch, dựng từ dải mặt đường sát đáy ảnh (cùng bề ngang 1680)
      road: roadTile,
      // Bóng phản chiếu của nhân vật trên mặt đường ướt: bắt đầu ngay dưới đế từng chiếc bốt (theo "Giày des"),
      // xiên phải, lấn xuống phần thân trang; x, y, width: vị trí và bề ngang khung bóng theo toạ độ ảnh bìa 1680×944
      reflection: { src: reflection, x: 1080, y: 840, width: 449 },
      // Lề trái của khối chữ trong ảnh bìa: màn rộng canh cột Mua ngay + ô nhập mã theo lề này, chừa chỗ cho bóng nhân vật
      textX: 256,
      alt: 'Poster vụ án Phạm Thùy Chi: cô gái mặc váy đi trên con phố đêm ướt mưa, cạnh Khách sạn Mai Hoa',
    },
    codeHashes: [
      'cc6f3ababb8998e6efb480170407488ea260379dde5c649b80ef616e34db5ca6',
      'b5ee893b5970422f4fd8b246afd3ca0819ec26cab17fcae27b410d89997999be',
      'ceb68db10fd2f5d80746b7cf0dd06b002f39c8c3eae042bbf5d77792e3185db7',
      '37d598c677309e68c7639b00c557e16a2ed1da03cb510fb7b18043628d6eb363',
      'fe7e6055b71a751dff944730d83f04a9887a76e2f777dec94d6aa6ee83e88a7e',
      '4ff10289e247e6d512f7ee12c7972c70cbbca1a4ca1117253f8ef5f3afea96a0',
      '77085d6475198acc3177b85ed1196e677d17c4178f1c76c0d56daa9de6596f97',
      'aead45491353e6a32666cc55fa6c4e16d6c5fdaded52b66ab9a9023a9747296f',
      '9a70edbe2cd7933cd732a6b7862debe212ce5c13795dd9f246c10f3d75353a7e',
      '0342b770ffe90442458961f5b0e18214347dbc07f2036841cd0409f4b787ca9c',
      '423b44d09d2b0a6e5aa6c26832d0fad101f6d32f61ff60bb67d24c7f66f540b8',
      '320f2096b6de2aa412160b4782f040b5b47d8da3f5618338b1c3974d9d2fad76',
      '8db968a6515466a5bde80560eb8508f80d959443df187302e270aab889e7064b',
      '04733c73d1539c12ad70ef02b7a32a111a07a6b715a365f7f99d754c1513e403',
      '565f7804b56d1ba745d665019d74c9197211c6d5ab47649cf158ac34b27e5cc8',
      'f0265f7b6eef2d07db746e5366ee41e1dc0dd9c5fe8be32b6c12aa3445410ea3',
      '909c95f320e4acf24726fb24a22cdea06054f8c549b72632bd2159aee62d11aa',
      '78c4db85aa76d02b1e0a8ffa6defbd709b7dedb0eedfd1ac0b19e524891788ec',
      'e87743374e2ed70c9854b040888a0fc38e20cf297bb54b2a66617237335f00a6',
      '46040f024bed8b9ba5cb69376cc2ac35f2150b6ec179611db3f970cf213c392c',
      '6fff6ebd5e91e8f227bdf7311c8a24272320840f6ad493921ac170d196dea53b',
      '539720d096facaed35eb62877e983f561d973d51cad3c19e85f748803e9b8580',
      '8f6209f860fdeb9ce6ddae4b1754e3dc02412bfd73e4f2dc2a14681c169add24',
      'd0d8c2d144c7967024c19d2bb0e9c874af9c275dcabcee487a957449805cb8a1',
      '04591b6ae276d7541d322ca61a3e2d13e6911010669f8d1ce862b5a768d49a0d',
      'c9dc5f2e2b83950c0a254b511dd74164143a72cee90a3ea88adf684621500475',
      '38e24341a20ce3102b9ff2b7dac0c235d479639067f10c8a220dcf100e63e9db',
      '4e73c432aba1604506adada84c7ee914b7d2c145bedff5481de95540d5a967f4',
      '66364c58f9dddc8fed90b66b818ae81a8d0fa7c2d7abc43974b52a18f6e7a544',
      'cc66999b7398e181a51e9ae360c3727c52062b7140f965e55d4b63cd73b5417c',
      'd3128b43255c73ce491ffdf6fbbebf6cd72e85fef23a3568da0b26e8a4a4f5bd',
      'dd17230316bcb9a5a6cea50368ef0a32cf4ecd74859a250e346187613d0dc6bb',
      'f71a8054645efe3a80d31bdc9a971a1c72a765daed023a671591554c617575d8',
      '224e3cdd37aec8d52f1df2676518fd2d1a31e41d6956d60c34aacd999e3b5657',
      'd20a95ed1403a77e4ee7e5c4e8422b47fc4c50b957a26f9400b56acedf3a9138',
      'fdbdae1396113f396ab95470d0119cdff655851cd60936a9776e20eb386131e2',
      '6c2db5fcc9d0b462e6f481b0819786716f8f804182f29265b0fed57dfaa0ff5b',
      '0ffa87fcb727c32499882173a370f565579dd2acd2665e0b7f2b23dc3a5fe420',
      'eb3e1499a2796b9ec85e4f8085fbd026ca0685983d0366c8097a331647bf1d49',
      '109d7cd25acf871a89f9dc480ebf6450e176b1777b606a2f91b0aa3a98b1500c',
      '05995eabd7fab6a36ee4dc830125442b0b25ad9aa3a4bb2afdd0c8eba71cd064',
      'e0a039b62382effb3186a68d4563b4020a8da549fa6a1d4932e4023111d6a7bd',
      '40bb77047ed4fac3aec9086c5f920b8551106cf489e9705a1d49fc95f601149b',
      '55ce3c94cebcee5c341af325ca7659e1e48e25da763ed6759e74eb9b64ed9263',
      '6e6e19f697b8f61ae82056e4ee46bc85d3f14e50e70b9d9f6b8b68a6e1097115',
      '52bcc8fccf81b900c66e31c206255ce60cfa03a1b50b35289caf963113634dce',
      '55825c9a457876c729788f77d033492d9253f1026e58954f738ffab504987b90',
      'fc5b0137230346a602fa2716cda121889521b5f72c2b9c2583b5c26bb7f85941',
      '4778d0a3171c4d66e596233983b7d56af7f1cf14aed2e0a70b731a285ae4b8e8',
      '5b5a7a1587b79cf223944af741e389d8ec00b7a643fa6cf36931d8c0ca58cb14',
    ],
    adminCodeHash: 'd8d29ce91917f861eeb68a86562bb2c152bb0b713a86586d33ece39ef219bf8a',
    next: '/p1/o1/q1',
    finalPath: '/p1/o2/giai-thich',
    summaryPath: '/p1/tom-tat',
    backTo: '/',
  },
}

export function getAccessPage(productId) {
  return accessPages[productId] ?? null
}
