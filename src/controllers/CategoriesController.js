const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class CategoriesController{
    async create(request, response){
        const { category } = request.body;
        
        const [checkCategoryExists] = await knex("categories")
        .where("category", category)
        if(checkCategoryExists){
            throw new AppError("Categoria já existe!")
        };
        
        //Inserindo dados
        await knex("categories")
        .insert({
            category
        })

        return response.status(201).json({
            message: "Categoria criada com sucesso!"
        });
    };

    async index(request, response){
        //const { id } = request.params;
        
        const cats = await knex("categories")
        

        return response.json(cats)
    }
};

module.exports = CategoriesController;