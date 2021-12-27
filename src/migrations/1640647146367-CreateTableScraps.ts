import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
} from 'typeorm'

export class CreateTableScraps1640647146367 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'scraps',
				columns: [
					{
						name: 'id',
						type: 'varchar',
						isPrimary: true,
						isUnique: true,
						generationStrategy: 'uuid',
						isNullable: false,
					},
					{
						name: 'content',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'sender',
						type: 'varchar',
						isNullable: true,
					},
					{
						name: 'receiver',
						type: 'varchar',
						isNullable: true,
					},
					{
						name: 'created_at',
						type: 'timestamp',
						default: 'now()',
					},
				],
			})
		)

		await queryRunner.createForeignKeys('scraps', [
			new TableForeignKey({
				columnNames: ['sender'],
				referencedColumnNames: ['id'],
				referencedTableName: 'user',
				onDelete: 'SET NULL',
			}),
			new TableForeignKey({
				columnNames: ['receiver'],
				referencedColumnNames: ['id'],
				referencedTableName: 'user',
				onDelete: 'SET NULL',
			})
		])
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropForeignKey('scraps', 'sender')
		await queryRunner.dropForeignKey('scraps', 'receiver')

		await queryRunner.dropTable('scraps')
	}
}
