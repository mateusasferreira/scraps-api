/* eslint-disable @typescript-eslint/no-empty-function */
import {MigrationInterface, QueryRunner, Table} from 'typeorm'

export class TestCreateUser1633959655441 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(new Table({
			name: 'user',
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
					name: 'username',
					type: 'varchar',
					isUnique: true,
					isNullable: false
				},
				{
					name: 'email',
					type: 'varchar',
					isUnique: true,
					isNullable: false,
				},
				{
					name: 'password_hash',
					type: 'varchar',
					isNullable: false,
				},
				{
					name: 'created_at',
					type: 'timestamp',
					default: 'now()'
				},
			],
		}))
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('user')
	}
}
