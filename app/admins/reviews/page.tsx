'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import "../../styles/reviews-page/reviewsPage.scss";

interface Review {
  _id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  status: 'new' | 'approved' | 'rejected';
  createdAt: Date;
}

const ReviewsPage = () => {
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const [approvedReviews, setApprovedReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const pendingResponse = await fetch('/api/reviews/moderate?status=new');
      const pendingData = await pendingResponse.json();
      if (pendingData.success) {
        setPendingReviews(pendingData.reviews);
      }
      const approvedResponse = await fetch('/api/reviews?status=approved');
      const approvedData = await approvedResponse.json();
      if (approvedData.success) {
        setApprovedReviews(approvedData.reviews);
      }
    } catch (error) {
      console.error('Ошибка при загрузке отзывов:', error);
      setError('Ошибка при загрузке отзывов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const approveReview = async (id: string) => {
    setActionLoading(id);
    try {
      const response = await fetch(`/api/reviews/moderate?id=${id}&action=approve`, {
        method: 'PATCH',
      });
      const data = await response.json();
      
      if (data.success) {
        const review = pendingReviews.find(r => r._id === id);
        if (review) {
          setPendingReviews(prev => prev.filter(r => r._id !== id));
          setApprovedReviews(prev => [{ ...review, status: 'approved' }, ...prev]);
        }
        setError(null);
      } else {
        setError(data.error || 'Ошибка при одобрении отзыва');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setError('Ошибка при одобрении отзыва');
    } finally {
      setActionLoading(null);
    }
  };

  const rejectReview = async (id: string) => {
    if (!confirm('Удалить этот отзыв? Действие необратимо.')) return;
    
    setActionLoading(id);
    try {
      const response = await fetch(`/api/reviews/moderate?id=${id}&action=reject`, {
        method: 'PATCH',
      });
      const data = await response.json();
      
      if (data.success) {
        setPendingReviews(prev => prev.filter(r => r._id !== id));
        setError(null);
      } else {
        setError(data.error || 'Ошибка при удалении отзыва');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setError('Ошибка при удалении отзыва');
    } finally {
      setActionLoading(null);
    }
  };

  const deleteApprovedReview = async (id: string) => {
    if (!confirm('Удалить этот отзыв с сайта? Действие необратимо.')) return;
    
    setActionLoading(id);
    try {
      const response = await fetch(`/api/reviews/moderate?id=${id}&action=delete`, {
        method: 'PATCH',
      });
      const data = await response.json();
      
      if (data.success) {
        setApprovedReviews(prev => prev.filter(r => r._id !== id));
        setError(null);
      } else {
        setError(data.error || 'Ошибка при удалении отзыва');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setError('Ошибка при удалении отзыва');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="reviews__rating">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
        ))}
      </div>
    );
  };

  return (
    <div className="reviews">
      <div className="reviews__header">
        <h1>Модерация отзывов</h1>
        <p>Управление отзывами клиентов</p>
      </div>

      <div className="reviews__stats">
        <div className="reviews__stat-card">
          <span className="reviews__stat-label">На модерации</span>
          <span className="reviews__stat-value">{pendingReviews.length}</span>
        </div>
        <div className="reviews__stat-card">
          <span className="reviews__stat-label">Опубликовано</span>
          <span className="reviews__stat-value">{approvedReviews.length}</span>
        </div>
        <div className="reviews__stat-card">
          <span className="reviews__stat-label">Всего отзывов</span>
          <span className="reviews__stat-value">{pendingReviews.length + approvedReviews.length}</span>
        </div>
      </div>

      <div className="reviews__sections">
        <div className="reviews__section">
          <div className="reviews__section-header">
            <h2>На модерацию</h2>
            <span className="reviews__section-badge">{pendingReviews.length}</span>
          </div>
          
          <div className="reviews__list">
            {loading ? (
              <div className="reviews__loading">Загрузка...</div>
            ) : pendingReviews.length === 0 ? (
              <div className="reviews__empty">Нет отзывов на модерацию</div>
            ) : (
              pendingReviews.map((review) => (
                <motion.div
                  key={review._id}
                  className="reviews__card reviews__card--pending"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="reviews__card-header">
                    <div className="reviews__card-info">
                      <div className="reviews__card-name">{review.name}</div>
                      <div className="reviews__card-role">{review.role}</div>
                      <div className="reviews__card-date">{formatDate(review.createdAt)}</div>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  
                  <div className="reviews__card-text">{review.text}</div>
                  
                  <div className="reviews__card-actions">
                    <button
                      className="reviews__btn reviews__btn--approve"
                      onClick={() => approveReview(review._id)}
                      disabled={actionLoading === review._id}
                    >
                      {actionLoading === review._id ? '...' : '✓ Опубликовать'}
                    </button>
                    <button
                      className="reviews__btn reviews__btn--reject"
                      onClick={() => rejectReview(review._id)}
                      disabled={actionLoading === review._id}
                    >
                      {actionLoading === review._id ? '...' : '× Удалить'}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div className="reviews__section">
          <div className="reviews__section-header">
            <h2>Опубликованные</h2>
            <span className="reviews__section-badge">{approvedReviews.length}</span>
          </div>
          
          <div className="reviews__list">
            {loading ? (
              <div className="reviews__loading">Загрузка...</div>
            ) : approvedReviews.length === 0 ? (
              <div className="reviews__empty">Нет опубликованных отзывов</div>
            ) : (
              approvedReviews.map((review) => (
                <motion.div
                  key={review._id}
                  className="reviews__card reviews__card--approved"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="reviews__card-header">
                    <div className="reviews__card-info">
                      <div className="reviews__card-name">{review.name}</div>
                      <div className="reviews__card-role">{review.role}</div>
                      <div className="reviews__card-date">{formatDate(review.createdAt)}</div>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  
                  <div className="reviews__card-text">{review.text}</div>
                  
                  <div className="reviews__card-actions">
                    <button
                      className="reviews__btn reviews__btn--delete"
                      onClick={() => deleteApprovedReview(review._id)}
                      disabled={actionLoading === review._id}
                    >
                      {actionLoading === review._id ? '...' : '× Удалить с сайта'}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {error && <div className="reviews__error">{error}</div>}
    </div>
  );
};

export default ReviewsPage;