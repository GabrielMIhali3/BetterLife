import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.vectorstores import InMemoryVectorStore
# from langchain_ollama import OllamaEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama.llms import OllamaLLM
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings
import re

MD_STORAGE_PATH = "Utils/chatBot/document_store/mds"

EMBEDDING_MODEL = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-mpnet-base-v2",
    model_kwargs={'device': 'cpu'}
)
DOCUMENT_VECTOR_DB = InMemoryVectorStore(EMBEDDING_MODEL)
LANGUAGE_MODEL = OllamaLLM(model="deepseek-r1:7b-8k")

PROMPT_TEMPLATE = """
You are an expert research assistant. Use the provided context to answer the query.
If unsure, state that you don't know. Be concise and factual (max 3 sentences).

Query: {user_query}
Context: {document_context}
Answer:
"""


def load_md_documents():
    """incarca si returneaza toate fisierele Markdown din folderul specificat."""
    md_documents = []
    for filename in os.listdir(MD_STORAGE_PATH):
        if filename.endswith(".md"):
            file_path = os.path.join(MD_STORAGE_PATH, filename)
            with open(file_path, "r", encoding="utf-8") as file:
                content = file.read()
                md_documents.append(Document(page_content=content, metadata={"source": filename}))  # Convertit corect
    return md_documents


def chunk_documents(raw_documents):
    text_processor = RecursiveCharacterTextSplitter(
        chunk_size=650,
        chunk_overlap=125,
        add_start_index=True
    )
    return text_processor.split_documents(raw_documents)  # acum `raw_documents` sunt `Document`


def index_documents(document_chunks):
    DOCUMENT_VECTOR_DB.add_documents(document_chunks)


def find_related_documents(query):
    return DOCUMENT_VECTOR_DB.similarity_search(query)


def generate_answer(user_query, context_documents):
    context_text = "\n\n".join([doc.page_content for doc in context_documents])
    conversation_prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    response_chain = conversation_prompt | LANGUAGE_MODEL
    response = response_chain.invoke({"user_query": user_query, "document_context": context_text})

    response_cleaned = re.sub(r'<think>.*?</think>', '', response, flags=re.DOTALL).strip()
    return response_cleaned


def ask_question(user_query):
    """Primeste o intrebare si returneaza raspunsul generat de model fara partea de gandire."""
    relevant_docs = find_related_documents(user_query)
    return generate_answer(user_query, relevant_docs)

def init_chatBot():
    if os.path.exists(MD_STORAGE_PATH):
        raw_docs = load_md_documents()
        if raw_docs:
            processed_chunks = chunk_documents(raw_docs)
            index_documents(processed_chunks)
            print(f"{len(raw_docs)} Markdown document(s) loaded and indexed successfully!")
        else:
            print("No Markdown documents found in 'document_store/mds/'. Please add some files.")
    else:
        print(f"Folder '{MD_STORAGE_PATH}' not found! Please create it and add Markdown files.")

