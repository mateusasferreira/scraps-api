import { User } from "../../../models/User";
import { UserSearchOptions } from "./IUserSearchOptions";

export interface UserDao {
    find: (options: UserSearchOptions) => Promise<User[]>
    findOne: (item: Partial<User> | string) => Promise<User>
    count: (options: UserSearchOptions) => Promise<number>
    insert: (payload: Partial<User>) => Promise<User>
    delete: (item: Partial<User> | string) => Promise<void>
    follow: (followerId: string, followingId: string) => Promise<void>
    unfollow: (followerId: string, followingId: string) => Promise<void>
    checkIsFollowing: (followerId: string, followingId: string) => Promise<boolean>
}