const path = require("path");
const fs = require("fs");

const usersFilePath = path.resolve(__dirname, "./data/users.json");

class UsersDb {
  getAll() {
    return JSON.parse(fs.readFileSync(usersFilePath));
  }

  saveAll(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users));
  }

  findOne(query) {
    return this.getAll().find(u => {
      for (const key in query)
        if (query.hasOwnProperty(key) && u[key] !== query[key]) {
          return false;
        }
      return true;
    });
  }

  saveOne(user) {
    const users = this.getAll();
    const i = users.findIndex(u => u.username === user.username);

    if (i !== -1) {
      users[i] = user;
      this.saveAll(users);
    }
  }
}

module.exports = new UsersDb();
