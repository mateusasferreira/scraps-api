import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class NewTableRefreshTokens1634933715329 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'refresh_tokens',
				columns: [
					{
						name: 'token',
						type: 'varchar',
						isPrimary: true,
						isUnique: true,
						isNullable: false
					},
					{
						name: 'userId',
						type: 'varchar'
					}
				],
			})
		)

		await queryRunner.createForeignKey('refresh_tokens', new TableForeignKey({
			columnNames: ['userId'],
			referencedColumnNames: ['id'],
			referencedTableName: 'user',
			onDelete: 'CASCADE'
		}))
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table = await queryRunner.getTable('refresh_tokens')
		const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('userId') !== -1)
		await queryRunner.dropForeignKey('refresh_tokens', foreignKey)
		await queryRunner.dropColumn('refresh_tokens', 'userId')
		await queryRunner.dropTable('refresh_tokens')
	}
}
