from flask import Blueprint, jsonify
from db import get_db

reviews_bp = Blueprint('reviews', __name__)


@reviews_bp.route('/<int:movie_id>', methods=['GET'])
def get_reviews(movie_id):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT r.review_id, r.rating, r.comment, r.review_date, u.name FROM reviews r "
            "LEFT JOIN users u ON r.user_id=u.user_id WHERE r.movie_id=%s",
            (movie_id,)
        )
        cols = [c[0] for c in cursor.description]
        rows = cursor.fetchall()
        data = [dict(zip(cols, r)) for r in rows]
        return jsonify(data)
    finally:
        cursor.close()
        conn.close()


