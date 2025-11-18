import json
import boto3
import base64
import os

rekognition = boto3.client('rekognition')

MIN_CONFIDENCE = 90

def lambda_handler(event, context):
    headers = {
        "Access-Control-Allow-Origin": "*",  # Permite cualquier origen
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST,OPTIONS" # Métodos permitidos
    }

    # --- Manejo de Petición OPTIONS (Pre-flight de CORS) ---
    # El navegador envía una petición OPTIONS antes del POST para verificar permisos
    if event['httpMethod'] == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps('OPTIONS request handled')
        }

    # --- Manejo de Petición POST ---
    try:
        # 1. Obtener los datos de la imagen desde el body
        # El body completo de la petición es el string Base64
        image_data = base64.b64decode(event['body'])

        # 2. Llamar a la API de Rekognition
        # Usamos Boto3 para llamar al servicio
        print("Llamando a Rekognition...")
        
        response = rekognition.detect_moderation_labels(
            Image={'Bytes': image_data},
            MinConfidence=MIN_CONFIDENCE
        )
        
        labels = response['ModerationLabels']
        print(f"Etiquetas encontradas: {len(labels)}")

        # 3. Devolver una respuesta exitosa a API Gateway
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(labels) # Devolvemos la lista de etiquetas
        }

    except base64.binascii.Error as e:
        # Error si el string Base64 es inválido
        print(f"Error de Base64: {str(e)}")
        return {
            'statusCode': 400, # Bad Request
            'headers': headers,
            'body': json.dumps({"error": "Invalid Base64 format"})
        }
    except Exception as e:
        print(f"Error inesperado: {str(e)}")
        return {
            'statusCode': 500, # Internal Server Error
            'headers': headers,
            'body': json.dumps({"error": "Internal server error", "details": str(e)})
        }