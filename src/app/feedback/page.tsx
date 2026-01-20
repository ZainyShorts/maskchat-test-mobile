import FeedbackPage from "../../components/FeedBack"
import { Suspense } from "react"

function FeedbackPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FeedbackPage />
    </Suspense>
  )
}

export default function Page() {
  return <FeedbackPageWrapper />
}

