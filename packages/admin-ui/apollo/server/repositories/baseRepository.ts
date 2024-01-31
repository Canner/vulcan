import { Knex } from 'knex';
import { camelCase, isPlainObject, mapKeys, snakeCase } from 'lodash';

export interface IQueryOptions {
  tx?: Knex.Transaction;
  order?: string;
  limit?: number;
}

export interface IBasicRepository<T> {
  findOneBy: (filter: Partial<T>, queryOptions?: IQueryOptions) => Promise<T>;
  findAllBy: (filter: Partial<T>, queryOptions?: IQueryOptions) => Promise<T[]>;
  createOne: (data: Partial<T>, queryOptions?: IQueryOptions) => Promise<T>;
  updateOne: (
    id: string,
    data: Partial<T>,
    queryOptions?: IQueryOptions
  ) => Promise<T>;
  deleteOne: (id: string, queryOptions?: IQueryOptions) => Promise<T>;
}

export class BaseRepository<T> implements IBasicRepository<T> {
  protected knex: Knex;
  protected tableName: string;

  constructor({ knexPg, tableName }: { knexPg: Knex; tableName: string }) {
    this.knex = knexPg;
    this.tableName = tableName;
  }

  public async findOneBy(filter: Partial<T>, queryOptions?: IQueryOptions) {
    const executer = queryOptions?.tx ? queryOptions.tx : this.knex;
    const query = executer(this.tableName).where(filter);
    if (queryOptions?.limit) {
      query.limit(queryOptions.limit);
    }
    const [result] = await query;
    return this.transformFromDBData(result);
  }

  public async findAllBy(filter: Partial<T>, queryOptions?: IQueryOptions) {
    const executer = queryOptions?.tx ? queryOptions.tx : this.knex;
    const query = executer(this.tableName).where(filter);
    if (queryOptions?.order) {
      query.orderBy(queryOptions.order);
    }
    const result = await query;
    return result.map(this.transformFromDBData);
  }

  public async createOne(data: Partial<T>, queryOptions?: IQueryOptions) {
    const executer = queryOptions?.tx ? queryOptions.tx : this.knex;
    const [result] = await executer(this.tableName)
      .insert(this.transformToDBData(data))
      .returning('*');
    return this.transformFromDBData(result);
  }

  public async updateOne(
    id: string,
    data: Partial<T>,
    queryOptions?: IQueryOptions
  ) {
    const executer = queryOptions?.tx ? queryOptions.tx : this.knex;
    const [result] = await executer(this.tableName)
      .where({ id })
      .update(this.transformToDBData(data))
      .returning('*');
    return this.transformFromDBData(result);
  }

  public async deleteOne(id: string, queryOptions?: IQueryOptions) {
    const executer = queryOptions?.tx ? queryOptions.tx : this.knex;
    const [result] = await executer(this.tableName)
      .where({ id })
      .del()
      .returning('*');
    return this.transformFromDBData(result);
  }

  protected transformToDBData = (data: Partial<T>) => {
    if (!isPlainObject(data)) {
      throw new Error('Unexpected dbdata');
    }
    return mapKeys(data, (_value, key) => snakeCase(key));
  };

  protected transformFromDBData = (data: any): T => {
    if (!isPlainObject(data)) {
      throw new Error('Unexpected dbdata');
    }
    const camelCaseData = mapKeys(data, (_value, key) => camelCase(key));
    return camelCaseData as T;
  };
}
