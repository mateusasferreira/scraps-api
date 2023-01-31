import { User } from "@models/User";
import { Injectable } from "@nestjs/common";
import { Inject } from "typedi";
import { DataSource } from "typeorm";
import { Profile } from "../../models/Profile";
import { Scrap } from "../../models/Scrap";
import { IUserDao } from "./interfaces/IUserDao";
import { ScrapsSearchOptions, UserSearchOptions } from "./interfaces/IUserSearchOptions";
import { TYPES } from "./user.constants";

@Injectable()
export class TypeORMUserDao implements IUserDao {
    
    constructor( private dataSource: DataSource) { }
    
    findOne(id: Partial<User> | string){
        return this.dataSource
        .createQueryBuilder()
        .select([
            'user.username',
            'user.id',
            'user.email',
            'user.created_at',
            'profile.name'
        ])
        .from(User, 'user')
        .leftJoin(Profile, 'profile', 'profile.userId = user.id')
        .loadRelationCountAndMap('user.scraps_received', 'user.scraps_received' )
        .loadRelationCountAndMap('user.scraps_sent', 'user.scraps_sent')
        .loadRelationCountAndMap('user.followers', 'user.followedBy')
        .loadRelationCountAndMap('user.following', 'user.following')
        .where('user.id = :id', {id})
        .getOne()
    }

	async find(options: UserSearchOptions) {
		let data, total	
		
		const query = this.dataSource
			.createQueryBuilder()
			.select([
				'user.username',
				'user.id',
				'user.email',
				'user.created_at',
				'profile.name'
			])
			.from(User, 'user')
			.leftJoin(Profile, 'profile', 'profile.userId = user.id')
			.loadRelationCountAndMap('user.scraps_received', 'user.scraps_received' )
			.loadRelationCountAndMap('user.scraps_sent', 'user.scraps_sent')
			.loadRelationCountAndMap('user.followers', 'user.followedBy')
			.loadRelationCountAndMap('user.following', 'user.following')
			.where(builder => {
				if(options.username) {
					builder.where(`lower(user.username) like :username`, {username: `%${options.username}%`} )
				}
		})

		total = await query.getCount()
			
		if(options.limit) {
			query.take(options.limit)
		}
		
		if(options.page) {
			query.skip((options.page - 1) * options.limit)
		}

		if(options.orderBy) {
			const direction = options.direction || 'ASC'
			switch (options.orderBy) {
				case 'username':
					query.orderBy('user.username', direction)
					break;
				case 'email':
					query.orderBy('user.email', direction)
					break;
				default:
					query.orderBy('user.username', direction)
					break;
			}
		}

		data = await query.getMany()

		return {
			data, 
			total
		}
	}

	async getScraps(userId: any, options: ScrapsSearchOptions) {
		let data, total	
		
		const query = this.dataSource
			.createQueryBuilder()
			.select([
				'scraps.id',
				'scraps.created_at',
				'scraps.content',
				'sender.username',
				'sender.id',
				'receiver.username',
				'receiver.id',
			])
			.from(Scrap, 'scrap')
			.where('scraps.receiver = :userId', { userId })
			.leftJoin('scraps.sender', 'sender')
			.leftJoin('scraps.receiver', 'receiver')
			.loadRelationCountAndMap('scraps.likes', 'scraps.likes')
			.orderBy('scraps.created_at', 'ASC' )
			

		total = await query.getCount()
			
		if(options.limit) {
			query.take(options.limit)
		}
		
		if(options.page) {
			query.skip((options.page - 1) * options.limit)
		}

		if(options.orderBy) {
			const direction = options.direction || 'ASC'
			switch (options.orderBy) {
				case 'username':
					query.orderBy('user.username', direction)
					break;
				case 'email':
					query.orderBy('user.email', direction)
					break;
				default:
					query.orderBy('user.username', direction)
					break;
			}
		}

		data = query.getMany()

		return {
			data, 
			total
		}
	}

	async insert(payload: Partial<User>) {
		const userRepo = this.dataSource.getRepository(User)

		const user = userRepo.create(payload)

		await userRepo.save(user)

		return user
	}

	async delete(item: Partial<User> | string) {

	}

	async follow(followerId: string, followingId: string) {
		
	}
	
	async unfollow(followerId: string, followingId: string) {

	}

	async checkIsFollowing(followerId: string, followingId: string) {
		return true
	}
}