import openai

# Set your OpenAI API key
openai.api_key = ""

def read_resume_from_txt(file_path):
    """
    Reads the content of a .txt file and returns it as a string.

    :param file_path: Path to the .txt file.
    :return: Content of the text file as a single string.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception as e:
        print("Error reading the text file:", e)
        return ""

def ask_chatgpt(question, model="gpt-4"):
    """
    Sends a question to the OpenAI ChatGPT API and returns the response.

    :param question: The question to ask ChatGPT.
    :param model: The GPT model to use (e.g., "gpt-3.5-turbo" or "gpt-4").
    :return: Response text from ChatGPT.
    """
    try:
        # Send a message to the ChatGPT API
        response = openai.ChatCompletion.create(
            model=model,  # Use "gpt-4" or another GPT model as required
            messages=[
                {"role": "user", "content": question}
            ]
        )

        # Extract and return the assistant's response
        return response['choices'][0]['message']['content']
    except Exception as e:
        print("An error occurred:", e)
        return ""

# Main logic
if __name__ == "__main__":
    # Path to the resume file
    resume_file_path = "resume.txt"
    
    # Read the resume content from the text file
    resume_content = read_resume_from_txt(resume_file_path)

    if resume_content:
        # Prepare the question for ChatGPT
        question = f"This is my resume, can you help me write a cover letter for the position of software engineer at Google?:\n{resume_content}"

        # Ask ChatGPT
        chat_response = ask_chatgpt(question)
        print("ChatGPT Response:\n", chat_response)
    else:
        print("Failed to read the resume content.")
