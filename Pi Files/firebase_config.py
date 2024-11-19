import firebase_admin
from firebase_admin import credentials, db

# Firebase Admin SDK setup
cred = credentials.Certificate("path_to_your_service_account.json")  # Replace with your Firebase service account JSON file
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://<your-database-name>.firebaseio.com"  # Replace with your Firebase Realtime Database URL
})

def send_data_to_firebase(data):
    """Send data to Firebase."""
    ref = db.reference("kpis")
    ref.push(data)
    print("Data sent to Firebase:", data)
