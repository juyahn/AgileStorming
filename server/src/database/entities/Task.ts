import { Entity, Column, OneToOne, ManyToMany, JoinColumn, JoinTable, ManyToOne } from 'typeorm';
import { Mindmap } from './Mindmap';
import { Label } from './Label';
import { Sprint } from './Sprint';
import { User } from './User';

@Entity()
export class Task {
  @OneToOne(() => Mindmap, { primary: true })
  @JoinColumn({ name: 'nodeId' })
  nodeId: Mindmap;

  @Column({ nullable: true })
  priority: string;

  @ManyToOne(() => User, (assignee) => assignee.tasks, { cascade: true })
  assignee: User;

  @Column({ type: 'datetime', nullable: true })
  dueDate: Date;

  @Column({ nullable: true })
  estimatedTime: string;

  @Column({ nullable: true })
  finishedTime: string;

  @ManyToOne(() => Sprint, (sprints) => sprints.id, { cascade: true })
  sprint: Sprint;

  @ManyToMany(() => Label, (labels) => labels.id, { cascade: true })
  @JoinTable()
  labels: Label[];
}
