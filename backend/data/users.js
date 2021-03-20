const bcrypt=require("bcryptjs");

const users=[
	{
		name:"Admin User",
		email:"admin@example.com",
		password:bcrypt.hashSync("1234",10)
	},
	{
		name:"John Doe",
		email:"john@example.com",
		password:bcrypt.hashSync("1234",10)
	},
	{
		name:"Jane Doe",
		email:"jane@example.com",
		password:bcrypt.hashSync("1234",10)
	}
]

module.exports=users;