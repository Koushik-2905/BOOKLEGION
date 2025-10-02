from flask import Blueprint, request, jsonify
from db import get_db

payments_bp = Blueprint('payments', __name__)


@payments_bp.route('', methods=['POST'])
def add_payment():
    data = request.get_json() or {}
    booking_id = data.get('order_id')  # frontend uses order terminology
    amount = data.get('amount')
    method = data.get('method', 'cash')
    status = data.get('status', 'success')

    if not (booking_id and amount is not None):
        return jsonify({"success": False, "message": "order_id and amount required"}), 400

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO payments (booking_id, amount, method, status) VALUES (%s,%s,%s,%s)",
            (booking_id, amount, method, status)
        )
        conn.commit()
        return jsonify({"success": True, "message": "Payment recorded"})
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


