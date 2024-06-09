import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'photo' })
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  link: string;
}
