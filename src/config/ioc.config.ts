import Container from "typedi";
import { DataSource } from "typeorm";
import dataSource from "./database.config";

Container.set(DataSource, dataSource)

