from flask import Blueprint, request, jsonify

from Services.EconomyService import EconomyService


class EconomyController:
    def __init__(self):
        self.economy_blueprint = Blueprint('economy', __name__, url_prefix='/economy')
        self._register_routes()

    def _register_routes(self):
        self.economy_blueprint.add_url_rule('/getEconomy/<int:user_id>/<int:month>', 'get_economy', self.get_economy, methods=['GET'])
        self.economy_blueprint.add_url_rule('/getTotalEconomy/<int:user_id>','get_total_economy', self.get_total_economy, methods=['GET'])

    def get_economy(self, user_id, month):
        tuple_economy = EconomyService.get_economy_by_month_and_user_id(month, user_id)
        money = tuple_economy[0]
        kcal = tuple_economy[1]
        return jsonify(money=money, kcal=kcal)

    def get_total_economy(self,user_id):
        money_list, kcal_list = EconomyService.get_economy_by_user_id(user_id)
        return jsonify(money=money_list, kcal=kcal_list)