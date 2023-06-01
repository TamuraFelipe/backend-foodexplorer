const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class IngredientsController{

    async create(request, response){
        const { dishes_id } = request.params;
        const { ingredients } = request.body;

        const ingredientsInsert = ingredients.map( ingredient => {
            return {
                name: ingredient,
                dishes_id
            }
        });
        
        await knex("ingredients")
        .insert(ingredientsInsert)
        
        response.json({
            message: "Ingrediente adicionado com sucesso!"
        })
    }

    async delete(request, response){
        const { id } = request.params;

        await knex("ingredients")
        .delete()
        .where("id", id)
        
        response.json({
            message: "Ingrediente deletado com sucesso!"
        })
    }

    
}

module.exports = IngredientsController;