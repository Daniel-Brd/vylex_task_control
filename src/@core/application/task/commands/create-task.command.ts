export class CreateTaskCommand {
  public readonly userId!: string;
  public readonly title!: string;
  public readonly description!: string;
  public readonly dueDate!: Date;
}
