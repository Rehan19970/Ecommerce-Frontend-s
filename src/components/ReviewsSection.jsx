import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { uploadImage } from '../services/uploadService';

export default function ReviewsSection({ product, onRefresh }) {
  const { userInfo } = useSelector((s) => s.auth);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      const { image } = await uploadImage(file);
      setImages((prev) => [...prev, image]);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/products/${product._id}/reviews`, { rating, comment, images });
      toast.success('Review submit ho gaya — approval ke baad dikhega');
      setComment('');
      setImages([]);
      setRating(5);
      setShowForm(false);
      onRefresh?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review submit nahi hua');
    } finally {
      setSubmitting(false);
    }
  };

  // Sirf approved reviews dikhao (agar backend filter na kare to bhi safe rahe)
  const approvedReviews =
    product.reviews?.filter((r) => !r.status || r.status === 'approved') || [];
  const total = approvedReviews.length;

  return (
    <div className="space-y-10">
      {/* Summary + bars */}
      <div className="grid md:grid-cols-2 gap-8 pb-8 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <p className="font-heading text-5xl">{product.rating?.toFixed(1) || '0.0'}</p>
          <div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${
                    i < Math.round(product.rating || 0) ? 'text-brand-gold' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-xs text-brand-grey mt-1">{total} reviews</p>
          </div>
        </div>
        <div className="space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = approvedReviews.filter((r) => r.rating === star).length;
            const pct = total ? (count / total) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-8 text-brand-grey">{star} ★</span>
                <div className="flex-1 h-2 bg-gray-100">
                  <div className="h-full bg-brand-gold transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 text-right text-brand-grey">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write review */}
      {!userInfo ? (
        <p className="text-sm text-brand-grey">
          Review likhne ke liye{' '}
          <Link to="/login" className="text-brand-gold underline">
            login
          </Link>{' '}
          karein.
        </p>
      ) : !showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="border border-brand-black px-6 py-3 text-xs uppercase tracking-widest hover:bg-brand-black hover:text-white transition"
        >
          Write a Review
        </button>
      ) : (
        <form
          onSubmit={submitReview}
          className="border border-gray-200 p-6 space-y-4 bg-brand-cream/30"
        >
          <h4 className="font-heading text-lg">Apna Review Likhein</h4>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-brand-grey block mb-2">
              Rating *
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setRating(s)}
                  className={`text-3xl transition ${
                    s <= rating ? 'text-brand-gold' : 'text-gray-300 hover:text-brand-gold/50'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-brand-grey block mb-2">
              Comment *
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Product ka quality, fit, aur overall experience share karein..."
              className="w-full border border-gray-300 p-3 text-sm focus:border-brand-gold focus:outline-none resize-none"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-brand-grey block mb-2">
              Photos (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="text-xs"
            />
            {images.length > 0 && (
              <div className="flex gap-2 mt-2">
                {images.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img} className="w-16 h-16 object-cover border" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, k) => k !== i))}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-brand-black text-white px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-brand-gold disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="border border-gray-300 px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-brand-cream"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      {approvedReviews.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-gray-300">
          <p className="text-brand-grey text-sm">Abhi tak koi review nahi. Pehla review aap dein!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {approvedReviews.map((review, i) => (
            <div key={i} className="pb-6 border-b border-gray-200 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-sm">
                    {review.name}
                    {review.isVerifiedPurchase && (
                      <span className="ml-2 text-[9px] uppercase tracking-widest bg-green-100 text-green-700 px-2 py-0.5">
                        ✓ Verified
                      </span>
                    )}
                  </p>
                  <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, j) => (
                      <span
                        key={j}
                        className={`text-xs ${
                          j < review.rating ? 'text-brand-gold' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-brand-grey">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="text-sm text-brand-grey leading-relaxed mb-2">{review.comment}</p>
              {review.images?.length > 0 && (
                <div className="flex gap-2">
                  {review.images.map((img, k) => (
                    <img key={k} src={img} className="w-16 h-16 object-cover border" />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}