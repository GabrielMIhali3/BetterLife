from DTO.UserDTO import UserDTO
from Mapper.UserMapper import UserMapper
from Repositories.UserRepository import UserRepository
from Validation.UserValidation import UserValidation
from domain.User import User

class UserService:
    @staticmethod
    def add_user(user_dto, password) -> UserDTO:
        """Adds a new user after validation"""
        user = UserMapper.mapToUser(user_dto, password)
        try:
            if UserRepository.get_by_username(user.username) is not None:
                raise ValueError('Username already exists!')

            UserValidation.validate_user(user)
            return UserMapper.mapToUserDTO(UserRepository.add_user(user))
        except Exception as e:
            raise RuntimeError(e)

    @staticmethod
    def get_user_by_username(username) -> UserDTO | None:
        """Gets a user by username"""
        user = UserRepository.get_by_username(username)
        if user is None:
            return None
        return UserMapper.mapToUserDTO(user)

    @staticmethod
    def get_all_users() -> list[UserDTO]:
        """Gets all users"""
        users = UserRepository.get_all()
        return [UserMapper.mapToUserDTO(u) for u in users]

    @staticmethod
    def login_user(username, password) -> UserDTO:
        """Checks if the given username and password are correct"""
        user = UserRepository.get_by_username(username)
        if user is None or not user.check_password(password):
            raise Exception('Username or password is incorrect!')
        return UserMapper.mapToUserDTO(user)

    @staticmethod
    def get_by_id(user_id) -> UserDTO | None:
        """Gets a user by id"""
        user = UserRepository.get_by_id(user_id)
        if user is None:
            return None
        return UserMapper.mapToUserDTO(user)