import { User } from "@models/User"

export function getUserFixture(props?){
    return {
        password: 'User@123',
        email: 'user@email.com',
        username: 'user',
        ...props
    }
}