export interface StatusChanger<T> {
  change(
    oldStatus: T,
    newStatus: T,
  ): void | Promise<void> | boolean | Promise<boolean>;
}

export interface StatusGraph {
  [key: string]: { [key: string]: boolean };
}
