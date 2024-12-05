import json
import openai

openai.api_key = ""

def ask_chatgpt(question, model="gpt-4o-mini"):
    """
    Sends a question to the OpenAI ChatGPT API and returns the response.
    
    :param question: The question to ask ChatGPT.
    :param model: The GPT model to use (e.g., "gpt-3.5-turbo" or "gpt-4").
    :return: Response text from ChatGPT.
    """
    try:
        # Send a message to the ChatGPT API
        response = openai.ChatCompletion.create(
            model=model,
            messages=[
                {"role": "user", "content": question}
            ]
        )
        return response['choices'][0]['message']['content']
    except Exception as e:
        print("An error occurred:", e)
        return "Error generating the cover letter."

def lambda_handler(event, context):
    """
    AWS Lambda function handler that receives job details from the user,
    and generates a cover letter using the OpenAI API.
    
    :param event: The event containing the input data.
    :param context: The runtime context of the Lambda function.
    :return: The generated cover letter.
    """
    try:
        body = json.loads(event['body'])
        resume = '''

        '''
        job_title = body['jobTitle']
        company = body['company']
        job_description = body['jobDescription']
        
        question = f"Here is my {resume}, can you help me write a cover letter for the position of {job_title} at {company}?\nJob Description: {job_description}"
        
        cover_letter = ask_chatgpt(question)
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'coverLetter': cover_letter
            })
        }
    
    except Exception as e:
        print("An error occurred:", e)
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': 'Error processing the request.'
            })
        }
