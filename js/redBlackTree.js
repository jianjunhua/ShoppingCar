class Node {
    constructor(value) {
      this.value = value;
      this.left = null;
      this.right = null;
      this.color = "RED";
      this.parent = null;
    }
  }
  
  class RedBlackTree {
    constructor() {
      this.root = null;
    }
  
    insert(value) {
      let newNode = new Node(value);
      if (!this.root) {
        this.root = newNode;
        this.root.color = "BLACK";
      } else {
        this.insertNode(this.root, newNode);
        this.fixViolation(newNode);
      }
      console.log(this.root);
    }
  
    insertNode(root, newNode) {
      if (newNode.value < root.value) {
        if (root.left === null) {
          root.left = newNode;
          newNode.parent = root;
        } else {
          this.insertNode(root.left, newNode);
        }
      } else {
        if (root.right === null) {
          root.right = newNode;
          newNode.parent = root;
        } else {
          this.insertNode(root.right, newNode);
        }
      }
    }
  
    fixViolation(node) {
      while (node !== this.root && node.parent.color === "RED") {
        if (node.parent === node.parent.parent.left) {
          let uncle = node.parent.parent.right;
          if (uncle !== null && uncle.color === "RED") {
            node.parent.color = "BLACK";
            uncle.color = "BLACK";
            node.parent.parent.color = "RED";
            node = node.parent.parent;
          } else {
            if (node === node.parent.right) {
              node = node.parent;
              this.rotateLeft(node);
            }
            node.parent.color = "BLACK";
            node.parent.parent.color = "RED";
            this.rotateRight(node.parent.parent);
          }
        } else {
          let uncle = node.parent.parent.left;
          if (uncle !== null && uncle.color === "RED") {
            node.parent.color = "BLACK";
            uncle.color = "BLACK";
            node.parent.parent.color = "RED";
            node = node.parent.parent;
          } else {
            if (node === node.parent.left) {
              node = node.parent;
              this.rotateRight(node);
            }
            node.parent.color = "BLACK";
            node.parent.parent.color = "RED";
            this.rotateLeft(node.parent.parent);
          }
        }
      }
      this.root.color = "BLACK";
    }
  
    rotateLeft(node) {
      let temp = node.right;
      node.right = temp.left;
      if (temp.left !== null) {
        temp.left.parent = node;
      }
      temp.parent = node.parent;
      if (node.parent === null) {
        this.root = temp;
      } else if (node === node.parent.left) {
        node.parent.left = temp;
      } else {
        node.parent.right = temp;
      }
      temp.left = node;
      node.parent = temp;
    }
  
    rotateRight(node) {
      let temp = node.left;
      node.left = temp.right;
      if (temp.right !== null) {
        temp.right.parent = node;
      }
      temp.parent = node.parent;
      if (node.parent === null) {
        this.root = temp;
      } else if (node === node.parent.right) {
        node.parent.right = temp;
      } else {
        node.parent.left = temp;
      }
      temp.right = node;
      node.parent = temp;
    }
  }
  
  // Usage
  let rbt = new RedBlackTree();
  
  rbt.insert(10);
  rbt.insert(20);
  rbt.insert(5);
  rbt.insert(8);
  rbt.insert(30);
  rbt.insert(15);
  // Add more insertions as needed
  
  console.log(rbt);