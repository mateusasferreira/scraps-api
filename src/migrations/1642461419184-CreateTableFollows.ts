import {MigrationInterface, QueryRunner, Table} from 'typeorm'

export class CreateTableFollows1642461419184 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(new Table({
			name: 'follows',
			columns: [
				{
					name: 'id',
					type: 'varchar',
					isPrimary: true,
					isUnique: true,
					generationStrategy: 'uuid',
					isNullable: false
				},
				{
					name: 'follower',
					type: 'varchar',
					isNullable: false
				},
				{
					name: 'following',
					type: 'varchar',
					isNullable: false
				},
				{
					name: 'created_at',
					type: 'timestamp',
					default: 'now()'
				},
			],
			foreignKeys: [
				{
					columnNames: ['follower'],
					referencedTableName: 'user',
					referencedColumnNames: ['id'],
					onDelete: 'CASCADE'
				},
				{
					columnNames: ['following'],
					referencedTableName: 'user',
					referencedColumnNames: ['id'],
					onDelete: 'CASCADE'
				}
			],
			indices: [
				{
					columnNames: ['follower', 'following'],
					name: 'follower_following',
					isUnique: true,
				}
			]

		}))
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table = await queryRunner.getTable('follows')
		
		const fk1 = table.foreignKeys.find(fk => fk.columnNames.indexOf('follower') !== -1)
		await queryRunner.dropForeignKey('follows', fk1)
        
		const fk2 = table.foreignKeys.find(fk => fk.columnNames.indexOf('following') !== -1)
		await queryRunner.dropForeignKey('follows', fk2)

		const index = table.indices.find(idx => idx.name.indexOf('follower_following') !== -1)
		await queryRunner.dropIndex('follows', index)

		await queryRunner.dropTable(table)
	}
}
