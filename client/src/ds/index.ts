import { Auth, User, Post } from './ds'

class DataService {
    get auth() {
        return new Auth()
    }

    get user() {
        return new User()
    }

    get post() {
        return new Post()
    }
}

export default new DataService()