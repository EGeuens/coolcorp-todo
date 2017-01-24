/**
 * Copyright 2017 @ IceCode
 * @created 24/01/2017
 */

import {IUser, UserModel} from "./user";

export interface ITodoModelConfig {
    description: string;
    done?: boolean;
    who?: IUser;
}

export class TodoModel {
    public description: string;
    public done: boolean;
    public who?: IUser;

    private _logger: any;

    private static validateConfig(conf: ITodoModelConfig): Array<{message: string}> {
        const errors = [];

        if (!conf) {
            errors.push({message: "Supply a configuration for the Todo, please."});
        }

        if (!conf.description) {
            errors.push({message: "You can't have a todo without anything to do!"});
        }

        return errors;
    }

    constructor(conf: ITodoModelConfig, logger?: any) {
        this._logger = logger || console;

        const errors = TodoModel.validateConfig(conf);

        if (errors.length) {
            throw errors.join(";\n");
        }

        this.description = conf.description;
        this.done = conf.done || false;
        this.who = conf.who || new UserModel({name: "me"});

        return this;
    }

    public isValid(): Array<{message: string}> {
        const errors = [];

        if (!this.description) {
            errors.push({message: "I don't have a description!"});
        }

        if (typeof this.done === "undefined") {
            errors.push({message: "I don't know if I'm done or not!"});
        }

        if (!this.who || this.who === null) {
            errors.push({message: "I don't have anyone assigned to me!"});
        }

        return errors;
    }
}
