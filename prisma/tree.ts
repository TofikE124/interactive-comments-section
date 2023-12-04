export class TreeNode<T> {
  public children: TreeNode<T>[] = [];
  public path: string;

  constructor(
    public parent: TreeNode<T> | null,
    public value: T,
    public key: string
  ) {
    if (this.parent) this.parent.children.push(this);
    this.path = this.parent ? this.parent.path + "/" + key : this.key;
  }
}
