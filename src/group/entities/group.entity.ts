import {PrimaryGeneratedColumn, Column, Entity, Index} from 'typeorm';


@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    @Index()
    id: number;

    @Column({nullable: false, unique: true})
    name: string;

    @Index()
    @Column({nullable: false})
    createdBy: string;

}
