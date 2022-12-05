import {faker} from "@faker-js/faker"

export function getUserFixture(props = {}){
    return {
        password_hash: faker.datatype.uuid(),
        id: faker.datatype.uuid(),
        ...props
    }
}

export function getLoginPayloadFixture(props = {}){
    return {
        password: faker.internet.password(),
        user: faker.internet.email()
    }
}
