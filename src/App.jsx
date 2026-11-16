import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { RequireAccess } from './components/RequireAccess'
import { SiteLayout } from './layouts/SiteLayout'
import { HomePage } from './pages/HomePage'

// Trang chủ tải ngay; các trang khác tách thành file riêng, chỉ tải khi mở tới
const page = (load, name) => lazy(() => load().then((module) => ({ default: module[name] })))
const AboutPage = page(() => import('./pages/AboutPage'), 'AboutPage')
const AccessPage = page(() => import('./pages/AccessPage'), 'AccessPage')
const ComingSoonPage = page(() => import('./pages/ComingSoonPage'), 'ComingSoonPage')
const DocRequestPage = page(() => import('./pages/DocRequestPage'), 'DocRequestPage')
const FaqPage = page(() => import('./pages/FaqPage'), 'FaqPage')
const GuidePage = page(() => import('./pages/GuidePage'), 'GuidePage')
const MissingDocsPage = page(() => import('./pages/MissingDocsPage'), 'MissingDocsPage')
const ExplanationPage = page(() => import('./pages/ExplanationPage'), 'ExplanationPage')
const FalseAnswerPage = page(() => import('./pages/FalseAnswerPage'), 'FalseAnswerPage')
const QuestionPage = page(() => import('./pages/QuestionPage'), 'QuestionPage')

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
