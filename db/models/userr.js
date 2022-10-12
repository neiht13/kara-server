class User  {
    constructor(user, pass) {
        this.user = user;
        this.pass = pass;
    }
    getUser() {
        return {
            user: this.user,
            pass: this.pass
        }
    }
    setUser(user, pass) {
        this.user = user;
        this.pass = pass;
    }
}