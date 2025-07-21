export class UpdateTaskDetailsCommand {
  public readonly userId!: string;
  public readonly taskId!: string;
  public readonly title?: string;
  public readonly description?: string;
  public readonly dueDate?: Date;
}
