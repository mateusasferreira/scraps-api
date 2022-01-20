import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableIndex} from 'typeorm'

export class ChangeFollowFk1642634646705 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		const table = await queryRunner.getTable('follows')
		
		const fk1 = table.foreignKeys.find(fk => fk.columnNames.indexOf('follower') !== -1)
		await queryRunner.dropForeignKey('follows', fk1)
        
		const fk2 = table.foreignKeys.find(fk => fk.columnNames.indexOf('following') !== -1)
		await queryRunner.dropForeignKey('follows', fk2)

		const index = table.indices.find(idx => idx.name.indexOf('follower_following') !== -1)
		await queryRunner.dropIndex('follows', index)

		await queryRunner.changeColumn('follows', 'follower', new TableColumn({
			name: 'followerId',
			type: 'varchar',
			isNullable: false,
		}))

		await queryRunner.changeColumn('follows', 'following', new TableColumn({
			name: 'followingId',
			type: 'varchar',
			isNullable: false,
		}))

		await queryRunner.createForeignKey('follows', new TableForeignKey({
			columnNames: ['followerId'],
			referencedTableName: 'user', 
			referencedColumnNames: ['id'],
			onDelete: 'CASCADE'
		}))
		
		await queryRunner.createForeignKey('follows', new TableForeignKey({
			columnNames: ['followingId'],
			referencedTableName: 'user', 
			referencedColumnNames: ['id'],
			onDelete: 'CASCADE'
		}))

		await queryRunner.createIndex('follows', new TableIndex({
			columnNames: ['followerId', 'followingId'],
			name: 'follower_following',
			isUnique: true
		}))
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table = await queryRunner.getTable('follows')
		
		const fk1 = table.foreignKeys.find(fk => fk.columnNames.indexOf('followerId') !== -1)
		await queryRunner.dropForeignKey('follows', fk1)
        
		const fk2 = table.foreignKeys.find(fk => fk.columnNames.indexOf('followingId') !== -1)
		await queryRunner.dropForeignKey('follows', fk2)

		const index = table.indices.find(idx => idx.name.indexOf('follower_following') !== -1)
		await queryRunner.dropIndex('follows', index)

		await queryRunner.changeColumn('follows', 'followerId', new TableColumn({
			name: 'follower',
			type: 'varchar',
			isNullable: false,
		}))

		await queryRunner.changeColumn('follows', 'followingId', new TableColumn({
			name: 'following',
			type: 'varchar',
			isNullable: false,
		}))

		await queryRunner.createForeignKey('follows', new TableForeignKey({
			columnNames: ['follower'],
			referencedTableName: 'user', 
			referencedColumnNames: ['id'],
			onDelete: 'CASCADE'
		}))
		
		await queryRunner.createForeignKey('follows', new TableForeignKey({
			columnNames: ['following'],
			referencedTableName: 'user', 
			referencedColumnNames: ['id'],
			onDelete: 'CASCADE'
		}))

		await queryRunner.createIndex('follows', new TableIndex({
			columnNames: ['follower', 'following'],
			name: 'follower_following',
			isUnique: true
		}))
	}

}
