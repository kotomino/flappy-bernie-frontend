class User {
  /** Instance Methods **/

  save() {
    User.all.push(this)
  }

  /** Static methods **/

  static all = []

  constructor(attr) {
    this.id = attr.id;
    this.name = attr.name
  }

  static create(attr) {
    // creates and saves an object
    let user = new User(attr);
    user.save();
    return user;
  } 

  static createFromCollection(collection) {
    collection.forEach(data => User.create(data.user))
  }
}

