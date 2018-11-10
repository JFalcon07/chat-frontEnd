import * as moment from 'moment';


export function getUsername(users, id) {
    for (let i = 0 ; i < users.length; i++) {
        if (users[i]._id === id) {
            return users[i].username;
        }
    }
}
