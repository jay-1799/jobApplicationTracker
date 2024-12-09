import json
import openai
import os

openai.api_key = os.environ['API_KEY']

def ask_chatgpt(question, model="gpt-4o-mini"):
    try:
        response = openai.ChatCompletion.create(
            model=model,
            messages=[{"role": "user", "content": question}]
        )
        return response['choices'][0]['message']['content']
    except Exception as e:
        print("An error occurred:", e)
        return "Error generating the cover letter."


def lambda_handler(event, context):
    try:
        print("This is a test log.")
        body = json.loads(event['body'])
        print("This is a test log2.")

        job_title = body.get('job_title', 'No job title provided')
        company = body.get('company', 'No company provided')
        job_description = body.get('job_description', 'No job description provided')
        print("This is a test log3.")
        resume = '''
        ''' 
        
        # job_title = "Software Engineer"
        # company = "Google"
        # job_description = "full stack developer"
        
        question = f"Here is my {resume}, can you help me write a cover letter for the position of {job_title} at {company}?\nJob Description: {job_description}"
        
        cover_letter = ask_chatgpt(question)
        # print(cover_letter)
        
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'coverLetter': cover_letter
            }),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",  # For CORS
            }
        }
    
    except Exception as e:
        print("An error occurred:", e)
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': 'Error processing the request.'
            }),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",  # For CORS
            }
        }
