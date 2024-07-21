import { Base } from 'src/core/models/base.model';
import { User } from 'src/users/entities/user.entity';
import {PrimaryGeneratedColumn, Column, Entity, Index, OneToOne, JoinColumn} from 'typeorm';


@Entity()
export class Group extends Base{
    @PrimaryGeneratedColumn('uuid')
    @Index('IDX_GROUP_ID')
    id: string;

    @Column({nullable: false, unique: true})
    name: string;


    @Index('IDX_GROUP_CREATEDBY')
    @OneToOne(() => User)
    @JoinColumn({ name: 'createdBy' })
    @Column({nullable: false})
    createdBy: string;

}
