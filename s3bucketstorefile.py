import json
import base64
import boto3
import uuid

# Initialize the S3 client
s3 = boto3.client('s3')

# The name of your S3 bucket
BUCKET_NAME = 'your-s3-bucket-name'

def lambda_handler(event, context):
    # Get the base64 encoded file and file name from the event
    file_base64 = event.get('file_base64')
    file_name = event.get('file_name')

    if not file_base64 or not file_name:
        return {
            'statusCode': 400,
            'body': json.dumps('Both "file_base64" and "file_name" must be provided.')
        }

    try:
        # Decode the base64 encoded file
        file_data = base64.b64decode(file_base64)

        # Create a unique file name if no file name is provided
        if not file_name:
            file_name = str(uuid.uuid4()) + ".pdf"  # Add .pdf extension by default

        # Upload the file to S3
        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=file_name,
            Body=file_data,
            ContentType='application/pdf'  # Assuming it's a PDF file
        )

        return {
            'statusCode': 200,
            'body': json.dumps(f'File "{file_name}" uploaded successfully.')
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error uploading file: {str(e)}')
        }
