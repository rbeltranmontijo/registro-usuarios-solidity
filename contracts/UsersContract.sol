pragma solidity ^0.4.24;

// Este contrato tiene la funcionalidad de que los usuarios pueden registrarse
// de manera única con su cuenta de ethereum y van a poder elejir un nombre y apelldio
contract UsersContract {

    struct User {
        string name;
        string surName;
    }

    // que para cada direccion representara un usuario
    mapping(address => User) private users;

    mapping(address => bool) private joinedUsers;

    address[] total;

    // funcion para poder registrarse los usuarios
    function join(string name, string surName) public {
        require(!userJoined(msg.sender));
        User storage user = users[msg.sender];
        user.name = name;
        user.surName = surName;
        joinedUsers[msg.sender] = true;
        total.push(msg.sender);
    }

    function getUser(address addr) public view returns (string, string) {
        require(userJoined(msg.sender));
        User memory user = users[addr];
        return(user.name, user.surName);
    }

    function userJoined(address addr) private view returns (bool) {
        return joinedUsers[addr];
    }

    function totalUsers() public view returns (uint) {
        return total.length;
    }
}