import express, { Application } from "express";
import cors from "cors";
import { MovieRoutes } from "../router/movies.router";
import { connect } from "../database/mongoose";
import dotenv from 'dotenv';

dotenv.config();
class Express {
    app: Application;    

    constructor(){
        this.app = express();
        this.initMiddlewares();
        MovieRoutes(this.app);
    }

    private initMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
    }

    listen() {
        this.app.listen(3333, () => {
            connect();
            console.log("Server is running on port 3333");
        });        
    }
}

export default Express;