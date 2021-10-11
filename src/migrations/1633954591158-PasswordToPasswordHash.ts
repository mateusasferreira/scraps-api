/* eslint-disable no-mixed-spaces-and-tabs */
import { MigrationInterface, QueryRunner } from 'typeorm'

export class PasswordToPasswordHash1633954591158 implements MigrationInterface {
  name = 'PasswordToPasswordHash1633954591158';

  public async up(queryRunner: QueryRunner): Promise<void> {
  	await queryRunner.query(
  		'ALTER TABLE `scraps-db`.`user` CHANGE `password` `password_hash` varchar(255) NOT NULL'
  	)
  	await queryRunner.query(
  		'ALTER TABLE `scraps-db`.`user` DROP COLUMN `password_hash`'
  	)
  	await queryRunner.query(
  		'ALTER TABLE `scraps-db`.`user` ADD `password_hash` varchar(255) NOT NULL'
  	)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  	await queryRunner.query(
  		'ALTER TABLE `scraps-db`.`user` DROP COLUMN `password_hash`'
  	)
  	await queryRunner.query(
  		'ALTER TABLE `scraps-db`.`user` ADD `password_hash` varchar(255) NOT NULL'
  	)
  	await queryRunner.query(
  		'ALTER TABLE `scraps-db`.`user` CHANGE `password_hash` `password` varchar(255) NOT NULL'
  	)
  }
}
