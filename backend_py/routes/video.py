from flask import Blueprint, Response, request, jsonify, send_file
import cv2
import time
import os
import io
import gridfs
from datetime import datetime
from pymongo import MongoClient
from flask_cors import CORS
import ffmpeg

bp = Blueprint('face', __name__)
camera = None
CORS(bp)

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")  # Update this with your MongoDB URI
db = client["video_storage"]
fs = gridfs.GridFS(db)

# Path to temporarily store the recorded video before uploading
TEMP_VIDEO_PATH = "recorded_video.avi"

# Load pre-trained Haar cascades for face and eye detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')

# Global variables to track engagement
total_time = 0
eye_contact_time = 0
tracking_started = False  # Flag to track when to start counting
start_time = None         # Start time for the session






def process_frame(frame):
    global total_time, eye_contact_time, tracking_started, start_time

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    eye_contact = False

    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
        roi_gray = gray[y:y + h, x:x + w]
        roi_color = frame[y:y + h, x:x + w]

        eyes = eye_cascade.detectMultiScale(roi_gray)
        for (ex, ey, ew, eh) in eyes:
            eye_contact = True
            cv2.rectangle(roi_color, (ex, ey), (ex + ew, ey + eh), (0, 255, 0), 2)

    # Start tracking when eye contact is first detected
    if not tracking_started and eye_contact:
        tracking_started = True
        start_time = time.time()  # Start the timer

    if tracking_started:
        current_time = time.time()
        frame_time = current_time - start_time  # Time elapsed since start
        start_time = current_time  # Reset start_time for next frame
        total_time += frame_time  # Add to total session time

        if eye_contact:
            eye_contact_time += frame_time  # Add to engagement time

    # Calculate engagement score
    engagement_score = int((eye_contact_time / total_time) * 100) if total_time > 0 else 0

    # Overlay feedback on the frame
    feedback_text = f"Engagement Score: {engagement_score}%"
    eye_contact_text = f"Eye Contact Time: {eye_contact_time:.2f}s"
    status_color = (0, 255, 0) if eye_contact else (0, 0, 255)
    status_text = "Eye Contact: Maintained" if eye_contact else "Eye Contact: Lost"

    cv2.putText(frame, feedback_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    cv2.putText(frame, eye_contact_text, (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    cv2.putText(frame, status_text, (10, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.7, status_color, 2)

    return frame

def generate_frames():
    global camera
    camera = cv2.VideoCapture(0)

    # Setup video writer to save video locally
    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    out = cv2.VideoWriter(TEMP_VIDEO_PATH, fourcc, 20.0, (640, 480))

    try:
        while True:
            success, frame = camera.read()
            if not success:
                break
            else:
                processed_frame = process_frame(frame)
                out.write(frame)  # Save each frame to the video file
                _, buffer = cv2.imencode('.jpg', processed_frame)
                frame = buffer.tobytes()
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    except GeneratorExit:
        # Cleanup when client disconnects
        camera.release()
        out.release()  # Release the video writer
        print("Client disconnected, camera released.")

@bp.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# @bp.route('/stop_camera', methods=['POST'])
# def stop_camera():
#     global camera, total_time, eye_contact_time, tracking_started, start_time

#     camera.release()  # Release the camera
#     total_time = 0
#     eye_contact_time = 0
#     tracking_started = False
#     start_time = None

#     # Determine content type of the video
#     content_type = "video/avi"  # Change if you are saving videos in a different format

#     # Upload the video to MongoDB with contentType
#     with open(TEMP_VIDEO_PATH, "rb") as video_file:
#         file_id = fs.put(
#             video_file,
#             filename="session_video.avi",
#             upload_date=datetime.utcnow(),
#             contentType=content_type  # Adding content type metadata
#         )

#     # Remove the temporary file
#     if os.path.exists(TEMP_VIDEO_PATH):
#         os.remove(TEMP_VIDEO_PATH)

#     return jsonify({"success": True, "message": "Camera stopped and video uploaded", "file_id": str(file_id)}), 200
  
  

@bp.route('/stop_camera', methods=['POST'])
def stop_camera():
    global camera, total_time, eye_contact_time, tracking_started, start_time

    camera.release()  # Release the camera
    total_time = 0
    eye_contact_time = 0
    tracking_started = False
    start_time = None

    # Determine content type of the video (now mp4)
    content_type = "video/mp4"  # Change to MP4 content type

    # Upload the video to MongoDB with contentType
    with open(TEMP_VIDEO_PATH, "rb") as video_file:
        file_id = fs.put(
            video_file,
            filename="session_video.mp4",  # Save the video as .mp4
            upload_date=datetime.utcnow(),
            contentType=content_type  # Adding content type metadata
        )

    # Remove the temporary file
    if os.path.exists(TEMP_VIDEO_PATH):
        os.remove(TEMP_VIDEO_PATH)

    return jsonify({"success": True, "message": "Camera stopped and video uploaded", "file_id": str(file_id)}), 200


@bp.route('/get_videos', methods=['GET'])
def get_videos():
    # Fetch all files from GridFS
    files = fs.find()
    video_files = []
    
    for file in files:
        video_files.append({
            "file_id": str(file._id),
            "filename": file.filename,
            "upload_date": file.upload_date
        })
    
    return jsonify({"videos": video_files}), 200


@bp.route('/video/<file_id>', methods=['GET'])
def serve_video(file_id):
    video_file = fs.get(file_id)
    
    # Temporarily save the .avi video to disk
    temp_avi_path = 'temp_video.avi'
    with open(temp_avi_path, 'wb') as f:
        f.write(video_file.read())

    # Convert the .avi video to .mp4 format using ffmpeg
    temp_mp4_path = 'temp_video.mp4'
    try:
        ffmpeg.input(temp_avi_path).output(temp_mp4_path, vcodec='libx264', acodec='aac').run()
        
        # Read the converted .mp4 video and send it to the frontend
        with open(temp_mp4_path, 'rb') as f:
            video_data = BytesIO(f.read())
            video_data.seek(0)  # Reset pointer to the start of the file
        
        # Remove the temporary video files
        os.remove(temp_avi_path)
        os.remove(temp_mp4_path)

        return send_file(video_data, mimetype='video/mp4', as_attachment=False)
    except Exception as e:
        print(f"Error converting video: {e}")
        os.remove(temp_avi_path)
        return {"error": "Error processing video."}, 500