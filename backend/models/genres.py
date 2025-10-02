from flask import Blueprint, jsonify
from db import get_db

genres_bp = Blueprint('genres', __name__)


@genres_bp.route('/', methods=['GET'])
def get_genres():
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT genre_id, name FROM genres")
        cols = [c[0] for c in cursor.description]
        rows = cursor.fetchall()
        data = [dict(zip(cols, r)) for r in rows]
        return jsonify(data)
    finally:
        cursor.close()
        conn.close()


