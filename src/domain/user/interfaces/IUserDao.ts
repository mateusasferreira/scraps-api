import { Paginated } from "../../../interfaces/IPaginated";
import { Scrap } from "../../../models/Scrap";
import { User } from "../../../models/User";
import { ScrapsSearchOptions, UserSearchOptions } from "./IUserSearchOptions";

export interface IUserDao {
    find: (options: UserSearchOptions) => Promise<Paginated<User>>
    findOne: (item: Partial<User> | string) => Promise<User>
    insert: (payload: Partial<User>) => Promise<User>
    delete: (item: Partial<User> | string) => Promise<void>
    follow: (followerId: string, followingId: string) => Promise<void>
    unfollow: (followerId: string, followingId: string) => Promise<void>
    checkIsFollowing: (followerId: string, followingId: string) => Promise<boolean>
    getScraps: (id, options: ScrapsSearchOptions) => Promise<Paginated<Scrap>>
}