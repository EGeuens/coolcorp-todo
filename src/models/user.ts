/**
 * Copyright 2017 @ IceCode
 * @created 24/01/2017
 */

export interface IUser {
    name: string;
}

export interface IUserModelConfig {
    name: string;
}

export class UserModel implements IUser {
    public name: string;

    private _logger: any;

    private static validateConfig(conf: IUserModelConfig): Array<{message: string}> {
        const errors = [];

        if (!conf) {
            errors.push({message: "Supply a configuration for the User, please."});
        }

        if (!conf.name) {
            errors.push({message: "You can't have a user without a name!"});
        }

        return errors;
    }

    constructor(conf: IUserModelConfig, logger?: any) {
        this._logger = logger || console;

        const errors = UserModel.validateConfig(conf);

        if (errors.length) {
            this._logger.error(errors);
            return;
        }

        this.name = conf.name;
    }
}
