import { User } from "@models/User";
import { Service } from "typedi";
import { DataSource, Repository } from "typeorm";
import { FindOptions } from "../../interfaces/IDao";
import { Profile } from "../../models/Profile";
import { UserDao } from "./interfaces/UserDao";
import { UserSearchOptions } from "./interfaces/IUserSearchOptions";

@Service()
export class TypeORMUserDao implements UserDao {
    
    constructor(private dataSource: DataSource) { }
    
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

    find(options: UserSearchOptions) {
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
			
		if(options.limit) {
			query.take(parseInt(options.limit))
		}
		
		if(options.page) {
			query.skip((parseInt(options.page) - 1) * parseInt(options.limit))
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

        return query.getMany()
    }

	count() {
		return this.dataSource.getRepository(User).count()
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
}