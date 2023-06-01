require("express-async-errors");
require("dotenv/config");

const database = require("./database/sqlite");

const AppError = require("./utils/AppError");

const express = require("express");
const uploadConfig = require("./configs/upload");
const cors = require("cors");


const routes = require("./routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

database();

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(( error, request, response, next ) => {
    if(error instanceof AppError){
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        })
    }
    console.error(error);
    return response.status(500).json({
        status: "error",
        message: "Internal Server Error"
    })
})

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));