/* eslint-disable no-mixed-spaces-and-tabs */
import {MigrationInterface, QueryRunner} from 'typeorm'

export class CreateUsers1633723019567 implements MigrationInterface {
    name = 'CreateUsers1633723019567'

    public async up(queryRunner: QueryRunner): Promise<void> {
    	await queryRunner.query('CREATE TABLE `scraps-db`.`user` (`id` char(36) NOT NULL, `username` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    	await queryRunner.query('DROP TABLE `scraps-db`.`user`')
    }

}
