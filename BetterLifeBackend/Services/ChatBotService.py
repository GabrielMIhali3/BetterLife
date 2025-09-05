from Services.ProductService import ProductService
from Services.UserService import UserService
from Utils.chatBot.a3 import ask_question, init_chatBot
from ollama._types import ResponseError


class ChatBotService:
    def __init__(self):
        init_chatBot()

    def ask_chat_bot(self, question: str) -> str:
        try:
            answer = ask_question(question)
            return answer
        except ResponseError as e:
            print(e)
            if "requires more system memory" in str(e):
                raise MemoryError("Modelul necesita mai multa memorie decat este disponibila.")


    def ask_chat_bot_after_scan(self, user_id: int, product_id: int) -> str:
        try:
            user = UserService.get_by_id(user_id)
            if user is None:
                raise ValueError("User not found!")
            product = ProductService.get_by_id(product_id)
            if product is None:
                raise ValueError("Product not found!")

            question = ""
            answer = ask_question(question)
            return answer
        except ResponseError as e:
            print(e)
            if "requires more system memory" in str(e):
                raise MemoryError("Modelul necesita mai multa memorie decat este disponibila.")


"""
ALLOWED_ALLERGIES = {
        "Peanut allergy", "Tree nut allergy", "Milk allergy", "Egg allergy",
        "Soy allergy", "Wheat allergy", "Sesame allergy"
    }

    ALLOWED_INTOLERANCES = {
        "Lactose intolerance", "Gluten intolerance", "Fructose intolerance"
    }
    
    ALLOWED_DISEASES = {
        "Diabetes", "Hypertension", "High cholesterol", "Kidney disease",
        "Gout", "Gastroesophageal reflux disease"
    }
"""