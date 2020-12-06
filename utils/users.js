const users = [];
let room = 1;

const userJoin = (id) => {
    const user = {id, room};
    let canStart = false
    users.push(user);
    if(users.length % 2 === 0) {
        room++;
        canStart = true;
    }
    return {user, canStart};
}
const getCurrentUser = (id) => {
    return users.find(user => user.id === id)
}

const userLeave = (id) => {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const checkRoom = (room) => {
    const userInRoom = users.filter(user => user.room === room);
    if (userInRoom.length === 1) {
        users.push('empty');
    }
}

module.exports = {
    userJoin,
    checkRoom
}

