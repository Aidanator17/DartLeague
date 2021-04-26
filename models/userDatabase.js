let users = [
    {
        id: 1,
        name: "Aidan Christopher",
        email: "aidan.r.christopher@gmail.com",
        password: "A1dan123",
        method: "local",
        role: "admin",
        imageURL: "",
    }]

const userModel = {
    findOne: (email) => {
        console.log("users:", users)
        const user = users.find((user) => user.email === email);
        if (user) {
            return user;
        }
        throw new Error(`Couldn't find user with email: ${email}`);
    },
    findById: (id) => {

        const user = users.find((user) => user.id === id);
        if (user) {
            return user;
        }
        throw new Error(`Couldn't find user with id: ${id}`);
    },
    OUTSIDEfindById: (id) => {

        const user = users.find((user) => user.id === id);
        if (user) {
            return user;
        }
    },
    createUser: async (u_id, u_name, u_url, u_method, u_email, u_password) => {
        try {
            users.push({
                id: u_id,
                name: u_name,
                email: u_email,
                password: u_password,
                method: u_method,
                role: "user",
                imageURL: u_url,
            })
            res.redirect('/auth/login')
        } catch (err) {
            console.log('ERROR CODE:', err)

        }
    }
};

// const userModel = {
//     findOne: (email) => {
//       request(sites[0]+'/users/users', function (error, response, body) {
//     users[0] = JSON.parse(body)
//   })
//       console.log("users:",users)
//       const user = users[0].find((user) => user.email === email);
//       if (user) {
//         return user;
//       }
//       throw new Error(`Couldn't find user with email: ${email}`);
//     },
//     findById: (id) => {
//       request(sites[0]+'/users/users', function (error, response, body) {
//     users[0] = JSON.parse(body)
//   })
//       const user = users[0].find((user) => user.id === id);
//       if (user) {
//         return user;
//       }
//       throw new Error(`Couldn't find user with id: ${id}`);
//     },
//     OUTSIDEfindById: (id) => {
//       request(sites[0]+'/users/users', function (error, response, body) {
//     users[0] = JSON.parse(body)
//   })
//       const user = users[0].find((user) => user.id === id);
//       if (user) {
//         return user;
//       }
//     },
//     createUserWithOutsideId: async (u_id, u_name, u_url, u_method, u_email, u_password) => {
//       let name = u_name
//       let email = u_email
//       let password = u_password
//       let method = u_method
//       let imageURL = u_url
//       let id = u_id
//       try {
//       const user = await prisma.user.create({
//         data: { id,name, email, password, imageURL, method }
//       });
//       res.redirect('/auth/login')
//     } catch (err) { 
//       console.log('ERROR CODE:',err)

//     }
//     }
//   };
module.exports = {userModel, users}