import { Route, Routes } from 'react-router-dom'
import { RequireAccess } from './components/RequireAccess'
import { SiteLayout } from './layouts/SiteLayout'
import { AboutPage } from './pages/AboutPage'
import { AccessPage } from './pages/AccessPage'
import { ComingSoonPage } from './pages/ComingSoonPage'
import { DocRequestPage } from './pages/DocRequestPage'
import { FaqPage } from './pages/FaqPage'
import { GuidePage } from './pages/GuidePage'
import { HomePage } from './pages/HomePage'
import { MissingDocsPage } from './pages/MissingDocsPage'
import { ExplanationPage } from './pages/ExplanationPage'
import { FalseAnswerPage } from './pages/FalseAnswerPage'
import { QuestionPage } from './pages/QuestionPage'

// Mọi trang gộp trong một file JS: mở thẳng link thì cả trang hiện một lần, không hiện header/Footnote trước rồi chèn nội dung sau
export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="ve-kinh-lup" element={<AboutPage />} />
        <Route path="ho-tro/huong-dan-choi" element={<GuidePage />} />
        <Route path="ho-tro/faq" element={<FaqPage />} />
        <Route path="ho-tro/ho-so" element={<MissingDocsPage />} />
        <Route path="ho-tro/ho-so/:productId" element={<DocRequestPage />} />
        <Route path=":productId/truy-cap" element={<AccessPage />} />
        {/* Các trang chơi chỉ mở sau khi nhập đúng mã truy cập */}
        <Route element={<RequireAccess />}>
          {/* Đoạn tĩnh "giai-thich" được ưu tiên hơn :questionId */}
          <Route path=":productId/:objectiveId/giai-thich" element={<ExplanationPage />} />
          <Route path=":productId/:objectiveId/:questionId" element={<QuestionPage />} />
          <Route path=":productId/:objectiveId/:questionId/sai" element={<FalseAnswerPage />} />
        </Route>
        <Route path="*" element={<ComingSoonPage />} />
      </Route>
    </Routes>
  )
}
