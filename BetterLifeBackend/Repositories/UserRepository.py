from extensions import db
from domain.User import User

class UserRepository:
    @staticmethod
    def add_user(user):
        """Adds a new user to the database"""
        try:
            db.session.add(user)
            db.session.commit()
            return user
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Error adding user: {e}")

    @staticmethod
    def get_by_username(username):
        """Gets a user by username"""
        return User.query.filter_by(username=username).first()

    @staticmethod
    def get_by_id(user_id):
        """Gets a user by id"""
        return User.query.get(user_id)

    @staticmethod
    def get_all():
        """Gets all users in the database"""
        return User.query.all()