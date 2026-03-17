import ReviewsClient from "./ReviewsClient"

export const revalidate = 300

export default function ReviewsPage() {
  return (
    <>
      <ReviewsClient />
    </>
  )
}
