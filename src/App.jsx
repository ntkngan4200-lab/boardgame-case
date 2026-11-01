import { Navigate, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './layouts/SiteLayout'
import { ComingSoonPage } from './pages/ComingSoonPage'
import { ExplanationPage } from './pages/ExplanationPage'
import { FalseAnswerPage } from './pages/FalseAnswerPage'
import { QuestionPage } from './pages/QuestionPage'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        {/* Tạm chuyển về Câu hỏi 1 cho tới khi có Homepage + Access Page */}
        <Route index element={<Navigate to="/p1/o1/q1" replace />} />
        {/* Đoạn tĩnh "giai-thich" được ưu tiên hơn :questionId */}
        <Route path=":productId/:objectiveId/giai-thich" element={<ExplanationPage />} />
        <Route path=":productId/:objectiveId/:questionId" element={<QuestionPage />} />
        <Route path=":productId/:objectiveId/:questionId/sai" element={<FalseAnswerPage />} />
        <Route path="*" element={<ComingSoonPage />} />
      </Route>
    </Routes>
  )
}
