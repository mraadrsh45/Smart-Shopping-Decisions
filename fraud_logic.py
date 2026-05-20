from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import random
import json
from datetime import datetime
from functools import wraps

from fraud_logic import calculate_risk

app = Flask(__name__)
CORS(app) # Enable cross-origin requests from any website

# In-memory storage for OTPs.
# Note: For production on a real website, use Redis or a Database mapped to User ID/Phone.
otp_store = {}

def load_db():
    try:
        with open('subscriptions.json', 'r') as f:
            return json.load(f)
    except:
        return {}

def require_api_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # We look for "X-API-KEY" in the request headers
        api_key = request.headers.get('X-API-KEY')
        
        # Fallback to checking json body (useful during local simple tests)
        if not api_key and request.is_json:
            api_key = request.get_json(silent=True).get('api_key')
            
        if not api_key:
            return jsonify({"error": "Unauthorized", "message": "API Key is missing. Please provide X-API-KEY."}), 401
            
        db = load_db()
        if api_key not in db:
            return jsonify({"error": "Unauthorized", "message": "Invalid API Key."}), 401
            
        sub = db[api_key]
        if sub.get('status') != 'active':
            return jsonify({"error": "Unauthorized", "message": "API Key has been revoked or deactivated."}), 401
            
        # Check expiry
        expiry_str = sub.get('expiry_date')
        if expiry_str:
            expiry_date = datetime.fromisoformat(expiry_str)
            if datetime.now() > expiry_date:
                return jsonify({"error": "Payment Required", "message": "Subscription expired. Please renew plan."}), 402
                
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/evaluate_risk', methods=['POST'])
@require_api_key
def eval_risk():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input provided"}), 400
        
    attempts = data.get('attempts', 0)
    location = data.get('location', 'Known')
    time = data.get('time', 'Day')
    device = data.get('device', 'Unknown Device')
    
    print(f"[REAL-TIME LOG] Evaluating Threat from Device Context: {device}")

    # Convert attempts to int if it's a string
    try:
        attempts = int(attempts)
    except:
        attempts = 0

    result = calculate_risk(attempts, location, time)
    
    # --- WEBHOOK LOGIC: Automatically & Fastly push alert to the Real Website's Backend ---
    if result['status'] in ['MEDIUM', 'HIGH']:
        # Fire and forget thread: This makes it super FAST so the login screen isn't delayed
        def send_webhook_alert():
            payload = {
                "event": "FRAUD_DETECTED" if result['status'] == "HIGH" else "SUSPICIOUS_LOGIN_TEST",
                "risk_score": result['score'],
                "device_info": device,
                "login_attempts": attempts
            }
            if result['status'] == "HIGH":
                payload["recommended_action"] = "BLOCK_USER_FOR_1_HOUR"
                
            # Yahan par aapki real website ka receiving webhook URL daalna hoga
            # requests.post("https://apki-real-website.com/api/security-alerts", json=payload)
            print(f"\n[⚡ WEBHOOK FIRED] FAST Alert sent to Real Website's Server: {payload}")
        
        # Start webhook in background
        import threading
        t = threading.Thread(target=send_webhook_alert)
        t.start()
    
    return jsonify({
        "Risk Score": result['score'],
        "Status": result['status'],
        "Reason": result['reason']
    })

@app.route('/api/send_otp', methods=['POST'])
@require_api_key
def send_otp():
    # In a real app, you would extract the user's phone number or email from the request
    # phone_number = request.get_json().get('phone')
    
    # Generate a real random 6-digit OTP
    otp = str(random.randint(100000, 999999))
    
    # Store OTP for verification later (using a static key 'current_session' for demonstration)
    otp_store['current_session'] = otp
    
    # --- INSERT REAL SMS/EMAIL API INTEGRATION HERE ---
    # e.g., twilio_client.messages.create(body=f"Your OTP is {otp}", from_='+1234', to=phone_number)
    print(f"\n" + "="*50)
    print(f"[SYSTEM LOG] REAL OTP GENERATED: {otp}")
    print(f"[SYSTEM LOG] Action: Send this OTP using Twilio, AWS SNS, or Email Gateway.")
    print("="*50 + "\n")
    # --------------------------------------------------
    
    return jsonify({"success": True, "message": "OTP sent successfully"})

@app.route('/api/verify_otp', methods=['POST'])
@require_api_key
def verify_otp():
    data = request.get_json()
    if not data or 'otp' not in data:
         return jsonify({"success": False, "message": "No OTP provided"}), 400
         
    user_otp = str(data.get('otp')).strip()
    stored_otp = otp_store.get('current_session')
    
    if stored_otp and user_otp == stored_otp:
        # Clear the OTP after successful verification to prevent reuse
        del otp_store['current_session']
        return jsonify({"success": True, "message": "OTP verified successfully"})
    else:
        return jsonify({"success": False, "message": "Invalid or expired OTP"}), 400

# =====================================================================
# INTERNAL ADMIN API (For your new Frontend UI to automatically get Keys)
# =====================================================================
import secrets
from datetime import timedelta

@app.route('/api/admin/generate_key', methods=['POST'])
def auto_generate_key():
    data = request.get_json()
    
    # Ye password aap apne naye Frontend ke backend me save rakhenge
    ADMIN_PASSWORD = "super_secret_admin_password_123" 
    
    if data.get("admin_password") != ADMIN_PASSWORD:
        return jsonify({"error": "Unauthorized"}), 401
    
    client_name = data.get("client_name", "Anonymous Client")
    days = data.get("days", 30)
    
    # Same logic as admin_panel.py
    api_key = "FG-" + secrets.token_hex(16).upper()
    expiry_date = datetime.now() + timedelta(days=days)
    
    db = load_db()
    db[api_key] = {
        "client_name": client_name,
        "created_at": datetime.now().isoformat(),
        "expiry_date": expiry_date.isoformat(),
        "status": "active"
    }
    
    # Save to file
    with open('subscriptions.json', 'w') as f:
        json.dump(db, f, indent=4)
        
    return jsonify({
        "success": True,
        "api_key": api_key,
        "expiry_date": expiry_date.strftime('%Y-%m-%d'),
        "client_name": client_name,
        "message": "Key successfully generated & saved in FraudGuard Engine!"
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
