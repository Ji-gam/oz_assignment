# pyrefly: ignore [missing-import]
from llama_cpp import Llama

llm = Llama(
    model_path="./models/Llama-3.2-1B-Instruct-Q4_K_M.gguf",
    n_ctx = 4096,
    n_threads = 2,
    verbose = False,
    chat_format = "llama-3"
)

SYSTEM_PROMPT = (
    "You are a concise assistant. "
    "Always reply in the same language as the user's input. "
    "Do not change the language. "
    "Do not mix languages."
)



# result = llm.create_chat_completion(
#     messages = [
#         {"role": "system", "content": ""},
#         {"role": "user", "content": ""},
#     ],
#     max_tokens = 256,
#     temperature = 0.7,
# )

# answer = result["choices"][0]["message"]["content"]
# print("답변: ", answer)