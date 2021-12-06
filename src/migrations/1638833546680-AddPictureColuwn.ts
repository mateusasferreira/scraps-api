import {MigrationInterface, QueryRunner, TableColumn} from 'typeorm'

export class AddPictureColuwn1638833546680 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn('profile', new TableColumn({
			name: 'picture',
			type: 'varchar',
			isNullable: false
		}))
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn('profile', 'picture')
	}

}
