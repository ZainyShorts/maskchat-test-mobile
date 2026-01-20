import FeedBackList from "@/components/FeedBackList"
import { Suspense } from "react"
function FeedbackPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FeedBackList />
    </Suspense>
  )
}

export default function Page() {
  return <FeedbackPageWrapper />
}
