import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from 'typeorm'

export class AlterProfilePk1640819103368 implements MigrationInterface {
    
	public async up(queryRunner: QueryRunner): Promise<void> {
		const table = await queryRunner.getTable('profile')
		const fk = table.foreignKeys.find(fk => fk.columnNames.indexOf('id') !== -1)
		await queryRunner.dropForeignKey('profile', fk)

		await queryRunner.changeColumn('profile', 'id', new TableColumn({
			name: 'id',
			type: 'varchar',
			isPrimary: true,
			isUnique: true,
			generationStrategy: 'uuid',
			isNullable: false
		}))
        
		await queryRunner.addColumn('profile', new TableColumn({
			name: 'userId',
			type: 'varchar',
			isUnique: true,
			isNullable: false
		}))

		await queryRunner.createForeignKey('profile', new TableForeignKey({
			columnNames: ['userId'],
			referencedColumnNames: ['id'],
			referencedTableName: 'user',
			onDelete: 'CASCADE'
		}))
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table = queryRunner.getTable('profile')
		const fk = (await table).foreignKeys.find(fk => fk.columnNames.indexOf('userId') !== -1)
		await queryRunner.dropForeignKey('profile', fk)

		await queryRunner.dropColumn('profile', 'userId')

		await queryRunner.changeColumn('profile', 'id', new TableColumn({
			name: 'id',
			type: 'varchar',
			isPrimary: true,
			isUnique: true,
			isNullable: false
		}))

		await queryRunner.createForeignKey('profile', new TableForeignKey({
			columnNames: ['id'],
			referencedColumnNames: ['id'],
			referencedTableName: 'user',
			onDelete: 'CASCADE'
		}))
	}

}

