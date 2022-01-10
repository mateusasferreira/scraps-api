import {MigrationInterface, QueryRunner, Table} from 'typeorm'

export class AddLikesTable1641854530358 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(new Table({
			name: 'likes',
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
					name: 'scrapId',
					type: 'varchar',
					isNullable: false
				},
				{
					name: 'userId',
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
					columnNames: ['scrapId'],
					referencedTableName: 'scraps',
					referencedColumnNames: ['id'],
					onDelete: 'CASCADE'
				},
				{
					columnNames: ['userId'],
					referencedTableName: 'user',
					referencedColumnNames: ['id'],
					onDelete: 'CASCADE'
				}
			],
			indices: [
				{
					columnNames: ['userId', 'scrapId'],
					name: 'user_scrap',
					isUnique: true,
				}
			]		
		}))
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table = await queryRunner.getTable('likes')
		
		const fk1 = table.foreignKeys.find(fk => fk.columnNames.indexOf('scrapId') !== -1)
		await queryRunner.dropForeignKey('likes', fk1)
        
		const fk2 = table.foreignKeys.find(fk => fk.columnNames.indexOf('userId') !== -1)
		await queryRunner.dropForeignKey('likes', fk2)

		const index = table.indices.find(idx => idx.name.indexOf('user_scrap') !== -1)
		await queryRunner.dropIndex('likes', index)

		await queryRunner.dropTable(table)
	}
}
