from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import base64
from PIL import Image
import io
import torch
import torch.nn.functional as F
from torchvision import transforms as T
import timm
from torchvision import models
from torchvision import transforms



app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load YOLOv8 model
# model = YOLO('./yolo_acne_detection.pt')  

def calculate_acne_level(boxes, threshold_area=300):  
    relevant_boxes = [box for box in boxes if (box[2] - box[0]) * (box[3] - box[1]) > threshold_area]
    num_acne_spots = len(relevant_boxes)
    
    if num_acne_spots == 0:
        return "None", 100  
    
    size_acne_spots = sum((box[2] - box[0]) * (box[3] - box[1]) for box in relevant_boxes)
    severity = num_acne_spots * 2 + size_acne_spots / 10000

    if severity < 10:
        acne_level = "Mild"
        percentage = 70 + (30 - (severity / 10) * 30)  
    elif severity < 20:
        acne_level = "Moderate"
        percentage = 45 + (25 - (severity - 10) / 10 * 25)  
    else:
        acne_level = "Severe"

        percentage = 20 + (25 - min(25, (severity - 20) / 10 * 25))  

    return acne_level, round(percentage)

def predict_acne(image):
    image_resized = image.resize((640, 640))
    image_array = np.array(image_resized)
    image_tensor = torch.from_numpy(image_array).permute(2, 0, 1).unsqueeze(0).float() / 255.0
    results = model(image_tensor)

    # Set a confidence threshold to filter out low-confidence detections
    confidence_threshold = 0.3
    boxes = results[0].boxes.xyxy.cpu().numpy()
    scores = results[0].boxes.conf.cpu().numpy()
    filtered_boxes = [box for box, score in zip(boxes, scores) if score > confidence_threshold]
    boxes_list = [(box[0], box[1], box[2], box[3]) for box in filtered_boxes]
    acne_level, percentage = calculate_acne_level(boxes_list)

    return acne_level, boxes_list, percentage

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image = request.files['image']
    image_bytes = image.read()
    image = Image.open(io.BytesIO(image_bytes))
    image = image.convert('RGB')

    acne_level, boxes, percentage = predict_acne(image)
    image_with_spots = draw_acne_spots(image, boxes)

    image_with_spots_pil = Image.fromarray(image_with_spots)
    buffered = io.BytesIO()
    image_with_spots_pil.save(buffered, format="JPEG")
    encoded_image_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')

    return jsonify({'acne_level': acne_level, 'percentage': percentage, 'image': encoded_image_base64})
    
def detect_face(image_np):
    # Load pre-trained face detector model
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    gray_image = cv2.cvtColor(image_np, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    return faces

def draw_acne_spots(image, boxes):
    image_np = np.array(image)
    image_np = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)  

 
    for (x1, y1, x2, y2) in boxes:
        center_x = int((x1 + x2) / 2)
        center_y = int((y1 + y2) / 2)
        radius = max(int((x2 - x1) / 8), 5) 
        cv2.circle(image_np, (center_x, center_y), radius, (0, 0, 255), 2)  

    image_np = cv2.cvtColor(image_np, cv2.COLOR_BGR2RGB) 
    return image_np


# Skin-type 

skin_model = timm.create_model("rexnet_150", pretrained=False, num_classes=3)
skin_model.load_state_dict(torch.load("./skin_best_model.pth", map_location=torch.device('cpu')))
skin_model.eval()

# Define the transformations
mean, std, im_size = [0.485, 0.456, 0.406], [0.229, 0.224, 0.225], 224
tfs = T.Compose([T.Resize((im_size, im_size)), T.ToTensor(), T.Normalize(mean=mean, std=std)])

# Class names
classes = ["Normal", "Dry", "Oily"]

@app.route('/predict-type', methods=['POST'])
def predictType():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    img = Image.open(file.stream).convert("RGB")
    img = tfs(img).unsqueeze(0)

    with torch.no_grad():
        outputs = skin_model(img)
        _, predicted = torch.max(outputs, 1)
        predicted_class = classes[predicted.item()]
        confidence = F.softmax(outputs, dim=1).max().item()

    return jsonify({'class': predicted_class, 'confidence': confidence})


    
#  skin-tone

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load the model
model = models.resnet18(pretrained=False)
num_features = model.fc.in_features
model.fc = torch.nn.Linear(num_features, 3)  # 3 classes: White, Black, Brown
model.load_state_dict(torch.load("C://Users/vasun/Desktop/Minor_Project/ml/skin_tone_classifier.pth", map_location=device))
model = model.to(device)
model.eval()

# Define the transformation using 'T' instead of 'transforms'
transform = T.Compose([
    T.Resize((224, 224)),
    T.ToTensor(),
    T.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Class mapping
class_map = {0: "White", 1: "Black", 2: "Brown"}

# Route to upload an image and get a prediction
@app.route('/skin-tone', methods=['POST'])
def predict_skin_tone():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    # Open and transform the image
    image = Image.open(file).convert("RGB")
    image = transform(image).unsqueeze(0)  # Add batch dimension
    image = image.to(device)
    
    # Make the prediction
    with torch.no_grad():
        outputs = model(image)
        _, predicted = torch.max(outputs, 1)
        predicted_class = predicted.item()

    return jsonify({"predicted_class": class_map[predicted_class]}),200

if __name__ == '__main__':
    app.run(debug=True)
