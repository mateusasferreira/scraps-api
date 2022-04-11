import {MigrationInterface, QueryRunner, TableColumn} from 'typeorm'

export class DropUserConfirmedColumn1649686437340 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn('user', 'confirmed')
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn('user', new TableColumn({
			name: 'confirmed', 
			type: 'boolean',
			default: false
		}))
	}

}
