const { hash } = require("bcryptjs");
const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class UsersController{
    async create(request, response){
        const { name, email, password, isAdmin = false } = request.body;
        
        //Verificando se usuário já existe
        const [checkEmailExists] = await knex("users")
        .where("email", email)
        if(checkEmailExists){
            throw new AppError("Este e-mail já está em uso!")
        };

        //Criptografando a senha e cadastrando no banco
        const hashedPassword = await hash(password, 8)
        
        //Inserindo dados
        await knex("users")
        .insert({
            name,
            email,
            password: hashedPassword,
            isAdmin
        })

        return response.status(201).json({
            message: "Usuário criado com sucesso!"
        });
    };
};

module.exports = UsersController;