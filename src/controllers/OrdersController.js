const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class OrdersController{
    async create(request, response) {
        const { cart, status, total, paymentMethod } = request.body;
        const user_id = request.user.id;
        
        const [orders_id] = await knex("orders").insert({
            user_id,
            status,
            total,
            paymentMethod,
        });

        const itemsInsert = cart.map(cart => {
            return {
                dishes_id: cart.id,
                orders_id,
                title: cart.name,
                quantity: cart.quantity,
            }
        });
        
        await knex("orderItems").insert(itemsInsert);

        return response.status(201).json(orders_id);
    }

    async index(request, response){
        const user_id = request.user.id;
        const user = await knex("users").where({id: user_id}).first()

        if (!user.isAdmin) {

            const orders = await knex("orderItems").where({ user_id })
                .select([
                    "orders.id",
                    "orders.user_id",
                    "orders.status",
                    "orders.total",
                    "orders.paymentMethod",
                    "orders.created_at",
                ])

                .innerJoin("orders", "orders.id", "orderItems.orders_id")
                .groupBy("orders.id")
            
            const orderItems = await knex("orderItems") 
            const orderWithItems = orders.map(order => {
                const orderItem = orderItems.filter(item => item.orders_id === order.id);

                return {
                    ...order,
                    dishes: orderItem
                }
            })
            
            return response.status(200).json(orderWithItems);

        // Listing Orders and OrdersItems at the same time (innerJoin) to Admin
        } else {
            const orders = await knex("orderItems")
                .select([
                    "orders.id",
                    "orders.user_id",
                    "orders.status",
                    "orders.total",
                    "orders.paymentMethod",
                    "orders.created_at",
                ])

                .innerJoin("orders", "orders.id", "orderItems.orders_id")
                .groupBy("orders.id")
        
            const orderItems = await knex("orderItems") 
            const orderWithItems = orders.map(order => {
                const orderItem = orderItems.filter(item => item.orders_id === order.id);

                return {
                    ...order,
                    dishes: orderItem
                }
            })
        
            return response.status(200).json(orderWithItems);
        }
    }

    async update(request, response){
        const { id, status } = request.body;

        await knex("orders").update({ status }).where({ id });

        return response.status(200).json({
            message: "Status modificado com sucesso!"
        })
    }
}

module.exports = OrdersController;