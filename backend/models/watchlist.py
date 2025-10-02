from flask import Blueprint, request, jsonify
from db import get_db

watchlist_bp = Blueprint('watchlist', __name__)


@watchlist_bp.route('/<int:user_id>', methods=['GET'])
def get_watchlist(user_id):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT w.watchlist_id as cart_id, w.seats_selected as quantity, m.title as name, m.price "
            "FROM watchlist w LEFT JOIN movies m ON w.movie_id=m.movie_id WHERE w.user_id=%s",
            (user_id,)
        )
        cols = [c[0] for c in cursor.description]
        rows = cursor.fetchall()
        data = [dict(zip(cols, r)) for r in rows]
        return jsonify(data)
    finally:
        cursor.close()
        conn.close()


@watchlist_bp.route('/', methods=['POST'])
def add_to_watchlist():
    data = request.get_json() or {}
    user_id = data.get('customer_id')
    movie_id = data.get('product_id')
    seats_selected = data.get('quantity', 1)

    if not all([user_id, movie_id]):
        return jsonify({"success": False, "message": "customer_id and product_id required"}), 400

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO watchlist (user_id, movie_id, seats_selected) VALUES (%s,%s,%s)",
            (user_id, movie_id, seats_selected)
        )
        conn.commit()
        return jsonify({"success": True})
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@watchlist_bp.route('/<int:watchlist_id>', methods=['DELETE'])
def delete_watchlist_item(watchlist_id):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM watchlist WHERE watchlist_id=%s", (watchlist_id,))
        conn.commit()
        return jsonify({"success": True})
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


