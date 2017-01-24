/**
 * Copyright 2017 @ IceCode
 * @created 24/01/2017
 */

import {TodoModel} from "../models/todo";

export interface ITodoApi {
    createTodo: (description: string) => TodoModel;
}

export class TodoApi implements ITodoApi {
    private static _instance: TodoApi;
    private static _logger: any;
    private _storage: any;

    public static get Instance() {
        if (!TodoApi._instance) {
            TodoApi._instance = new TodoApi();
        }

        return TodoApi._instance;
    }

    public static setLogger(logger: any) {
        TodoApi._logger = logger;
    }

    constructor() {
        if (!TodoApi._logger) {
            TodoApi._logger = console;
        }

        this._storage = {};

        return this;
    }

    public getTodo(description: string) {
        return this._storage.hasOwnProperty(description) ? this._storage[description] : null;
    }

    public createTodo(description: string): TodoModel {
        try {
            const todo = new TodoModel({
                description: description
            }, TodoApi._logger);

            this._storage[todo.description] = todo;

            return this._storage[todo.description];
        }
        catch (e) {
            TodoApi._logger.error(e.message);
            return null;
        }
    };

    public check(todo: TodoModel) {
        if (todo.done) {
            throw new Error("Can't check off something twice!");
        }

        todo.done = true;
        this._storage[todo.description] = todo;

        return this._storage[todo.description];
    }

    public uncheck(todo: TodoModel) {
        if (!todo.done) {
            throw new Error("Can't un-check something twice!");
        }

        todo.done = false;
        this._storage[todo.description] = todo;

        return this._storage[todo.description];
    }
}