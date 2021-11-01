import {MigrationInterface, QueryRunner, TableColumn} from 'typeorm'

export class RefreshTokenUuid1635772459984 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn('refresh_tokens', new TableColumn({
			name: 'token',
			type: 'varchar',
			isPrimary: true,
			isUnique: true,
			generationStrategy: 'uuid',
			isNullable: false
		}))

	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn('refresh_tokens', new TableColumn({
			name: 'token',
			type: 'varchar',
			isPrimary: true,
			isUnique: true,
			isNullable: false
		}))
	}

}

