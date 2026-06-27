export class ApiError {
  constructor(
    public status: number,
    public message: string,
    public errors?: Record<string, string[]>,
  ) {}

  toToastMessage(): string {
    if (this.errors) {
      const all = Object.values(this.errors).flat();
      return all.join('. ');
    }
    return this.message;
  }
}
