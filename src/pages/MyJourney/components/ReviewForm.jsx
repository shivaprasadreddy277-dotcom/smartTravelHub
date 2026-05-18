import { useState } from 'react'

const FALLBACK_NAME = 'Guest'

function ReviewForm({ reviewerName, onSubmit, onCancel }) {
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewMessage, setReviewMessage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const result = onSubmit(reviewRating, reviewComment)
    setReviewMessage(result.message)
    if (result.success) {
      setReviewComment('')
      setReviewRating(5)
    }
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="review-row">
        <div className="review-note">
          Reviewing as <strong>{reviewerName || FALLBACK_NAME}</strong>
        </div>
        <label>
          Rating
          <select value={reviewRating} onChange={(event) => setReviewRating(Number(event.target.value))}>
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} star{value > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Comment
        <textarea
          value={reviewComment}
          onChange={(event) => setReviewComment(event.target.value)}
          placeholder="Share what you enjoyed and what future travelers should know."
        />
      </label>
      <div className="review-actions">
        <button type="submit">Send Review</button>
        <button type="button" className="delete-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
      {reviewMessage && <p className="review-message">{reviewMessage}</p>}
    </form>
  )
}

export default ReviewForm
