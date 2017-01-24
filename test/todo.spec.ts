/**
 * Copyright 2017 @ IceCode
 * @created 24/01/2017
 */

import {TodoApi} from "../src/lib/todo";

describe("TodoLib", () => {
    const testLogger = { log: () => {}, error: () => {}};
    const descriptions = ["test1", "test2", "test3"];

    let errorLogMessages = [];
    let logLogMessages = [];
    let testTodos = [];

    //Setup
    TodoApi.setLogger(testLogger);

    //Setup before each test
    beforeEach(() => {
       spyOn(testLogger, "log").and.callFake((...args) => {
           logLogMessages = logLogMessages.concat(args);
       });
       spyOn(testLogger, "error").and.callFake((...args) => {
           errorLogMessages = errorLogMessages.concat(args);
       });

       //Create some test data
        testTodos = [];

        let i, description;
        for (i = 0; i < descriptions.length; i++) {
            description = descriptions[i];
            testTodos.push(TodoApi.Instance.createTodo(description));
        }
    });

    describe("I can create a todo", () => {
        it("with valid properties", () => {
            const description = "test";
            const myTodo = TodoApi.Instance.createTodo(description);

            expect(myTodo).toBeDefined();
            expect(myTodo).not.toBeNull();
            expect(myTodo.description).toEqual(description);
            expect(myTodo.done).toBe(false);
            expect(myTodo.who).toBeDefined();
            expect(myTodo.who.name).toEqual("me");

            expect(logLogMessages.length).toBe(0);
            expect(errorLogMessages.length).toBe(0);
        });

        it("needs a description", () => {
            const description = "";
            const myTodo = TodoApi.Instance.createTodo(description);

            expect(myTodo).toBeDefined();
            expect(myTodo).toBeNull();

            expect(logLogMessages.length).toBe(0);
            expect(errorLogMessages.length).toBe(1);
        });
    });

    describe("I can check a created todo", () => {
        let todoUnderTest;

        beforeEach(() => {
            todoUnderTest = TodoApi.Instance.getTodo(descriptions[0]);
        });

        it("off, when it's not done", () => {
            TodoApi.Instance.check(todoUnderTest);

            const persistedTodoUnderTest = TodoApi.Instance.getTodo(todoUnderTest.description);

            expect(todoUnderTest.done).toBe(true);
            expect(persistedTodoUnderTest.done).toBe(true);
        });
        it("on, when it is done", () => {
            TodoApi.Instance.check(todoUnderTest);
            TodoApi.Instance.uncheck(todoUnderTest);

            const persistedTodoUnderTest = TodoApi.Instance.getTodo(todoUnderTest.description);

            expect(todoUnderTest.done).toBe(false);
            expect(persistedTodoUnderTest.done).toBe(false);
        });
    });

    describe("I can't check a created todo", () => {
        let todoUnderTest;

        beforeEach(() => {
            todoUnderTest = TodoApi.Instance.getTodo(descriptions[0]);
        });

        it("off, when it's already done", () => {
            TodoApi.Instance.check(todoUnderTest);
            expect(() => {
                TodoApi.Instance.check(todoUnderTest)
            }).toThrow(new Error("Can't check off something twice!"));
        });

        it("on, when it is not done", () => {
            TodoApi.Instance.check(todoUnderTest);
            TodoApi.Instance.uncheck(todoUnderTest);
            expect(() => {
                TodoApi.Instance.uncheck(todoUnderTest)
            }).toThrow(new Error("Can't un-check something twice!"));
        });
    });
});