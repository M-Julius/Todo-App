export class Todo {
  id: string;
  text: string;
  completed: boolean;

  constructor(id: string, text: string, completed: boolean = false) {
    this.id = id;
    this.text = text;
    this.completed = completed;
  }

  toggleCompletion(): void {
    this.completed = !this.completed;
  }
}
