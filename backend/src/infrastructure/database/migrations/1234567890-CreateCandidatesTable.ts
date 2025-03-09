import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCandidatesTable1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'candidates',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'lastName',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true
          },
          {
            name: 'phone',
            type: 'varchar',
            isNullable: true
          },
          {
            name: 'address',
            type: 'varchar',
            isNullable: true
          },
          {
            name: 'education',
            type: 'jsonb',
            isNullable: true,
            default: '[]'
          },
          {
            name: 'workExperience',
            type: 'jsonb',
            isNullable: true,
            default: '[]'
          },
          {
            name: 'cvUrl',
            type: 'varchar',
            isNullable: true
          }
        ]
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('candidates');
  }
} 