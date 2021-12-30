import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from 'typeorm'

export class AlterScrapsForeignKeyName1640883737774 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		const table = await queryRunner.getTable('scraps')
		const fk1 = table.foreignKeys.find(fk => fk.columnNames.indexOf('sender') !== -1)
		await queryRunner.dropForeignKey('scraps', fk1)

		await queryRunner.changeColumn('scraps', 'sender', new TableColumn({
			name: 'senderId',
			type: 'varchar',
			isNullable: true
		}))

		await queryRunner.createForeignKey('scraps', new TableForeignKey({
			columnNames: ['senderId'],
			referencedColumnNames: ['id'],
			referencedTableName: 'user',
			onDelete: 'CASCADE'
		}))

		const fk2 = table.foreignKeys.find(fk => fk.columnNames.indexOf('receiver') !== -1)
		await queryRunner.dropForeignKey('scraps', fk2)

		await queryRunner.changeColumn('scraps', 'receiver', new TableColumn({
			name: 'receiverId',
			type: 'varchar',
			isNullable: true
		}))

		await queryRunner.createForeignKey('scraps', new TableForeignKey({
			columnNames: ['receiverId'],
			referencedColumnNames: ['id'],
			referencedTableName: 'user',
			onDelete: 'CASCADE'
		}))
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table = await queryRunner.getTable('scraps')
		const fk1 = table.foreignKeys.find(fk => fk.columnNames.indexOf('senderId') !== -1)
		await queryRunner.dropForeignKey('scraps', fk1)

		await queryRunner.changeColumn('scraps', 'senderId', new TableColumn({
			name: 'sender',
			type: 'varchar',
			isNullable: true
		}))

		await queryRunner.createForeignKey('scraps', new TableForeignKey({
			columnNames: ['sender'],
			referencedColumnNames: ['id'],
			referencedTableName: 'user',
			onDelete: 'CASCADE'
		}))

		const fk2 = table.foreignKeys.find(fk => fk.columnNames.indexOf('receiverId') !== -1)
		await queryRunner.dropForeignKey('scraps', fk2)

		await queryRunner.changeColumn('scraps', 'receiverId', new TableColumn({
			name: 'receiver',
			type: 'varchar',
			isNullable: true
		}))

		await queryRunner.createForeignKey('scraps', new TableForeignKey({
			columnNames: ['receiver'],
			referencedColumnNames: ['id'],
			referencedTableName: 'user',
			onDelete: 'CASCADE'
		}))
	}
}
