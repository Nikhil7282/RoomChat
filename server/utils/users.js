class Users{
    constructor() {
        this.users=[]
    }
    addUser(id,name,room){
        let user={id,name,room}
        this.users.push(user)
        return user
    }
    getUserList(room){
        let users=this.users.filter(user=>{
           return user.room===room
        })
        // console.log(users);
        let nameArrays=users.map((user)=>user.name)
        return nameArrays
    }
    getUser(id){
        return this.users.filter(user=>user.id===id)[0];
    }
    removeUser(id){
        let user=this.getUser(id)
        if(user){
            this.users=this.users.filter(user=>user.id!==id)
        }
        return user
    }
}

module.exports={Users}
