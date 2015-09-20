
describe("each", function(){

    var handler,
        object,
        sourceArray,
        sourceArrayLength,
        sourceObject,
        sourceObjectLength;

    beforeEach(function(){
        handler = jasmine.createSpy("handler");
        object = {};
        sourceArray = [1, 2, 3];
        sourceArrayLength = sourceArray.length;
        sourceObject = {a: 1, b: 2, c: 3};
        sourceObjectLength = 3;
    });

    describe("array", function(){

        it("Returns source array", function(){

            expect(each(sourceArray, handler)).toBe(sourceArray);

        });

        it("Number of calls with not empty array", function(){

            each(sourceArray, handler);
            expect(handler.calls.count()).toEqual(sourceArrayLength);

        });

        it("Number of calls with empty array", function(){

            each([], handler);
            expect(handler.calls.count()).toEqual(0);

        });

        it("Break calls of handler", function(){

            object.handler = function(){};
            spyOn(object, "handler").and.returnValue(false);

            each(sourceArray, object.handler);
            expect(object.handler.calls.count()).toEqual(1);

        });

        it("Passing arguments to a handler", function(){

            each(sourceArray, handler);

            expect(handler.calls.argsFor(0)).toEqual([1, "0", 0]);
            expect(handler.calls.argsFor(1)).toEqual([2, "1", 1]);
            expect(handler.calls.argsFor(2)).toEqual([3, "2", 2]);

        });

        it("Passing context to handler", function(){

            var context = {};

            each(sourceArray, context, handler);
            expect(handler.calls.first().object).toBe(context);

        });

        it("Bind each function", function(){

            var myEach = each.bind(sourceArray);

            myEach(handler);
            expect(handler.calls.count()).toEqual(sourceArrayLength);

        });

        it("Bind each function with context", function(){

            var myEach = each.bind(sourceArray),
                context = {};

            myEach(context, handler);
            expect(handler.calls.count()).toBe(0);

            myEach(handler);
            expect(handler.calls.count()).toBe(sourceArrayLength);

        });

    });

    describe("object", function(){

        it("Returns source object", function(){

            expect(each(sourceObject, handler)).toEqual(sourceObject);

        });

        it("Number of calls with not empty object", function(){

            each(sourceObject, handler);
            expect(handler.calls.count()).toEqual(sourceObjectLength);

        });

        it("Number of calls width empty object", function(){

            each({}, handler);
            expect(handler.calls.count()).toEqual(0);

        });

        it("Break calls of handler", function(){

            object.handler = function(){};
            spyOn(object, "handler").and.callFake(function(){ return arguments[2] !== 1; });

            each(sourceObject, object.handler);
            expect(object.handler.calls.count()).toEqual(2);

        });

        it("Passing arguments to a handler", function(){

            each(sourceObject, handler);

            expect(handler.calls.argsFor(0)).toEqual([1, "a", 0]);
            expect(handler.calls.argsFor(1)).toEqual([2, "b", 1]);
            expect(handler.calls.argsFor(2)).toEqual([3, "c", 2]);

        });

        it("Passing context to handler", function(){

            var context = {};

            each(sourceObject, context, handler);
            expect(handler.calls.first().object).toBe(context);

        });

        it("Bind each function", function(){

            var myEach = each.bind(sourceObject);

            myEach(handler);
            expect(handler.calls.count()).toEqual(sourceObjectLength);

        });

        it("Bind each function with context", function(){

            var myEach = each.bind(sourceObject),
                context = {};

            myEach(context, handler);
            expect(handler.calls.count()).toBe(0);

            myEach(handler);
            expect(handler.calls.count()).toBe(sourceObjectLength);

        });

    });

    describe("jQuery", function(){

        it("Number of iterations", function(){

            var elements = $([
                document.createElement("a"),
                document.createElement("b"),
                document.createElement("p")
            ]);

            each(elements, handler);

            expect(handler.calls.count()).toEqual(elements.length);

            expect(handler.calls.argsFor(0)).toEqual([elements.get(0), "0", 0]);
            expect(handler.calls.argsFor(1)).toEqual([elements.get(1), "1", 1]);
            expect(handler.calls.argsFor(2)).toEqual([elements.get(2), "2", 2]);

        });

    });

    describe("not collection", function(){

        it("undefined", function(){
            expect(each(undefined, handler)).toBe(undefined);
            expect(handler.calls.count()).toEqual(0);
        });

        it("null", function(){
            expect(each(null, handler)).toBe(null);
            expect(handler.calls.count()).toEqual(0);
        });

        it("number", function(){
            expect(each(0, handler)).toBe(0);
            expect(each(123, handler)).toBe(123);
            expect(handler.calls.count()).toEqual(0);
        });

        it("string", function(){
            expect(each("", handler)).toBe("");
            expect(each("123", handler)).toBe("123");
            expect(handler.calls.count()).toEqual(0);
        });

        it("NaN", function(){
            each(NaN, handler);
            expect(handler.calls.count()).toEqual(0);
        });

        it("function", function(){
            var func = function(){};
            expect(each(func, handler)).toBe(func);
            expect(handler.calls.count()).toEqual(0);
        });

    });

});
