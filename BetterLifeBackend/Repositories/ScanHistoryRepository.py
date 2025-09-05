from sqlalchemy.sql import extract, and_

from extensions import db
from domain.ScanHistory import ScanHistory

class ScanHistoryRepository:
    @staticmethod
    def add_scanHistory(scanHistory):
        """Adds a new scan history to the database"""
        try:
            db.session.add(scanHistory)
            db.session.commit()
            return scanHistory
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Error adding scan history: {e}")

    @staticmethod
    def get_all_by_user_id(user_id):
        """Gets all scan history by user id"""
        return ScanHistory.query.filter(ScanHistory.user_id == user_id).all()

    @staticmethod
    def get_by_id(scanHistory_id):
        """Gets a scan history by id"""
        return ScanHistory.query.get(scanHistory_id)

    @staticmethod
    def get_all_by_month_and_user_id(month: int, user_id: int):
        """Gets all scan history by month and user id"""
        return ScanHistory.query.filter(and_(extract('month', ScanHistory.scanned_at) == month,
                                        ScanHistory.user_id == user_id
                                )).all()