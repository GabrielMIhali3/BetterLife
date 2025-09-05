import os.path

from flask import Flask

from Controllers.ChatBotController import ChatBotController
from Controllers.EconomyController import EconomyController
from Controllers.ProductController import ProductController
from Controllers.ScanController import ScanController
from Controllers.UserController import UserController
from DTO.ProductDTO import ProductDTO
from Services.ProductService import ProductService
from Services.ScanHistoryService import ScanHistoryService
from Services.UserService import UserService
from extensions import db
from config.settings import UPLOAD_FOLDER, SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
from domain.Product import Product
from domain.User import User
from domain.ScanHistory import ScanHistory
from Controllers.ScanHistoryController import ScanHistoryController


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS

db.init_app(app)

userController = UserController()
app.register_blueprint(userController.user_blueprint)
productController = ProductController()
app.register_blueprint(productController.product_blueprint)
scanHistoryController = ScanHistoryController()
app.register_blueprint(scanHistoryController.scan_history_blueprint)
scanController = ScanController()
app.register_blueprint(scanController.scan_blueprint)
economyController = EconomyController()
app.register_blueprint(economyController.economy_blueprint)
chatBotController = ChatBotController()
app.register_blueprint(chatBotController.chatBot_blueprint)

with app.app_context():
    db.create_all()

#app.register_blueprint()

if __name__ == '__app__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run()