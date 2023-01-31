import { Paginated } from "@interfaces/IPaginated";
import { User } from "@models/User";
import { Scrap } from "../../../models/Scrap";
import { CreateUserPayload } from "./ICreateUserPayload";
import { ScrapsSearchOptions, UserSearchOptions } from "./IUserSearchOptions";

export interface IUserService {
	getOne: (id) => Promise<User>;
	getMany: (options: UserSearchOptions) => Promise<Paginated<User>>;
	create: (data: CreateUserPayload) => Promise<void>;
	delete: (id) => Promise<void>;
	follow: (followerId: string, followingId: string) => Promise<void>;
	unfollow: (followerId, followingId) => Promise<void>;
	getScraps: (id, options: ScrapsSearchOptions) => Promise<Paginated<Scrap>>
}