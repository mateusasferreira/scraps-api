import { Service } from "typedi";
import { EntityTarget, getRepository, Repository } from "typeorm";

@Service()
export class Dao {
  get<T>(model: EntityTarget<T>): Repository<T>{
    return getRepository(model)
  }
}