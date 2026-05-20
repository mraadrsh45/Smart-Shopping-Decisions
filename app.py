import argparse
import json
import secrets
import os
from datetime import datetime, timedelta

DB_FILE = 'subscriptions.json'

def load_db():
    if not os.path.exists(DB_FILE):
        return {}
    with open(DB_FILE, 'r') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return {}

def save_db(data):
    with open(DB_FILE, 'w') as f:
        json.dump(data, f, indent=4)

def generate_key():
    # Generate a strong, random API key string
    return "FG-" + secrets.token_hex(16).upper()

def create_subscription(days, client_name):
    db = load_db()
    
    api_key = generate_key()
    expiry_date = datetime.now() + timedelta(days=days)
    
    db[api_key] = {
        "client_name": client_name,
        "created_at": datetime.now().isoformat(),
        "expiry_date": expiry_date.isoformat(),
        "status": "active"
    }
    
    save_db(db)
    
    print("\n" + "="*50)
    print(">> SUCCESS: Naya API Subscription Create Ho Gaya!")
    print("="*50)
    print(f"Client Name : {client_name}")
    print(f"Plan Days   : {days} Days")
    print(f"Expiry Date : {expiry_date.strftime('%Y-%m-%d %H:%M:%S')}")
    print("-" * 50)
    print(f"SECRET KEY  : {api_key}")
    print("*" * 50)
    print("-> Ise copy karein aur customer ko bhej dein.")
    print("="*50 + "\n")

def list_keys():
    db = load_db()
    if not db:
        print("Koi subscription nahi mila.")
        return
        
    print(f"{'Client':<20} | {'API Key':<40} | {'Expiry Date':<20} | {'Status'}")
    print("-" * 100)
    for key, data in db.items():
        print(f"{data.get('client_name', 'Unknown')[:18]:<20} | {key:<40} | {data['expiry_date'][:10]:<20} | {data['status']}")
    print("-" * 100)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="FraudGuard API Key Admin Panel")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # Generate command
    gen_parser = subparsers.add_parser('generate', help="Naya API Key create karein")
    gen_parser.add_argument('--days', type=int, required=True, help="Kitne dino ke liye plan chahiye? (e.g., 30)")
    gen_parser.add_argument('--name', type=str, required=True, help="Customer ya Website ka naam")

    # List command
    list_parser = subparsers.add_parser('list', help="Saare API keys dekhein")

    args = parser.parse_args()

    if args.command == 'generate':
        create_subscription(args.days, args.name)
    elif args.command == 'list':
        list_keys()
