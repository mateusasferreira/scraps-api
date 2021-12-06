import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class CreateProfileTable1638830853680 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'profile',
				columns: [
					{
						name: 'id',
						type: 'varchar',
						isPrimary: true,
						isUnique: true,
						isNullable: false
					},
					{
						name: 'name',
						type: 'varchar',
						isNullable: false
					},
					{
						name: 'bio',
						type: 'varchar',
						isNullable: false
					},
					{
						name: 'birth_date',
						type: 'date',
						isNullable: false
					},{
						name: 'location',
						type: 'varchar',
						isNullable: true
					},
				],
			})
		)

		await queryRunner.createForeignKey('profile', new TableForeignKey({
			columnNames: ['id'],
			referencedColumnNames: ['id'],
			referencedTableName: 'user',
			onDelete: 'CASCADE'
		}))
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropForeignKey('profile', 'id')
		await queryRunner.dropTable('profile')
	}
}
