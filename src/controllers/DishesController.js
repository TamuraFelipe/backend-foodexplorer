const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/diskStorage");

class DishesController{
    async create(request, response){
        const { name, description, price, category_id, ingredients } = request.body;
        const user_id = request.user.id;
        const imageFileName = request.file.filename;
        const diskStorage = new DiskStorage();
        let dishes_id;
                        
        const dishe = await knex("dishes")
        
        const filename = await diskStorage.saveFile(imageFileName);
        dishe.image = filename;
        
        if(!category_id){
            throw new AppError("Adicione uma categoria para o prato!")
        } else {
            [dishes_id] = await knex("dishes").insert({
                name,
                description,
                price,
                image: dishe.image,
                user_id,
                category_id
            });
        }

        const oneIngredient = typeof(ingredients) === "string";
        let ingredientsInsert;

        if(oneIngredient){
            ingredientsInsert = {
                name: ingredients,
                dishes_id
            }
        } else {
            ingredientsInsert = ingredients.map( ingredient => {
                return {
                    name: ingredient,
                    dishes_id
                }
            });
        }
                
        await knex("ingredients").insert(ingredientsInsert);

        return response.json({
            message: "Prato adicionado com sucesso!"
        });
    }

    async update(request, response){
        const { name, description, category_id, price, ingredients, image } = request.body;
        const { dishes_id } = request.params;
        const imageFileName = request.file.filename;
        
        const diskStorage = new DiskStorage();

        const dishe = await knex("dishes")
        .where({ id: dishes_id }).first();
        
        if(!dishe) {
            throw new AppError("Prato solicitado não existe!");
        }

        if(dishe.image) {
            await diskStorage.deleteFile(dishe.image);
        }

        const filename = await diskStorage.saveFile(imageFileName);
        
        dishe.name = name,
        dishe.description = description,
        dishe.price = price,
        dishe.image = filename;
        dishe.category_id = category_id,

        await knex("dishes")
        .update({
            name: name,
            description: description,
            price: price,
            image: filename,
            category_id: category_id,

        })
        .where({ id: dishes_id })
        
        const onlyOneIngredient = typeof(ingredients) === "string";
        let ingredientsInsert;
        if (onlyOneIngredient) {
            ingredientsInsert = {
                dishes_id,
                name: ingredients,
            };
        } else if (ingredients.length > 1) {
            ingredientsInsert = ingredients.map( ingredient => {
                return {
                dishes_id,
                name : ingredient
                }
            });
        };
          
        await knex("ingredients").where({ dishes_id }).delete();
        await knex("ingredients").where({ dishes_id }).insert(ingredientsInsert);
                
        return response.json({dishe, ingredients});
    }

    async show(request, response){
        const { id } = request.params;

        const dishes = await knex("dishes").where({id}).first();
                        
        const categoryText = await knex("categories")
        .select("category")
        .where({ id: dishes.category_id });
                
        const ingredients = await knex("ingredients").where({ dishes_id: id });
        const ingredientsFilter = ingredients.map( ingredient => ingredient.name)

        return response.json({
            ...dishes,
            category: categoryText,
            ingredients: ingredientsFilter
        })
    }

    async index(request, response){
        const { name, ingredient } = request.query;
        //console.log(name)
        let dishes;
        
        if (ingredient) {
            
            dishes = await knex("ingredients")
                .select([
                    "dishes.id",
                    "dishes.name",
                    "dishes.description",
                    "dishes.price",
                    "dishes.image",
                    "dishes.category_id",
                ])
                .whereLike("dishes.name", `%${name}%`)
                .whereIn("name", [ingredient])
                .innerJoin("dishes", "dishes.id", "ingredients.dishes_id")
                .groupBy("dishes.id")
                .orderBy("dishes.name")
        } else {
            dishes = await knex("dishes")
                .whereLike("name", `%${name}%`)
                .orderBy("name");
        }
        
        
        const ingredients = await knex("ingredients").select("name", "dishes_id");
        const category = await knex("categories").select("id", "category");
        
        const dishesWithIngredients = await dishes.map( dishes => {
            const disheIngredients = ingredients.filter( ingredient => ingredient.dishes_id === dishes.id)
            .map( ({ name }) => name);
            const disheCategory = category.filter( category => category.id === dishes.category_id)
            .map( category => category.category);

            return {
                ...dishes,
                category: disheCategory,
                ingredients: disheIngredients
            }
        })               

        return response.json({dishes: dishesWithIngredients});
    }

    async delete(request, response){
        const { id } = request.params;

        await knex("dishes").where({ id }).delete();

        return response.json({
            message: "Prato deletado com sucesso!"
        });
    } 
}

module.exports = DishesController;