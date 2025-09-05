from domain.User import User
from DTO.UserDTO import UserDTO

class UserMapper:
    @staticmethod
    def mapToUserDTO(user: User) -> UserDTO:
        """Maps a User entity to a UserDTO (excluding password)."""
        return UserDTO(user.id, user.username, user.weight, allergies=user.allergies, intolerances=user.intolerances, diseases=user.diseases)

    @staticmethod
    def mapToUser(user_dto: UserDTO, password: str) -> User:
        """Maps a UserDTO to a User entity and assigns the password."""
        user = User(user_dto.username, password, user_dto.weight, allergies=user_dto.allergies, intolerances=user_dto.intolerances, diseases=user_dto.diseases)
        user.id = user_dto.id
        return user
