
describe("each", function(){

    it("result", function(){

        expect(each([1,2,3], function(){})).toEqual([1,2,3]);
        expect(each({a: 1, b: 2, c: 3}, function(){})).toEqual({a: 1, b: 2, c: 3});

    });

    it("handler_arguments", function(){

        each([1], function(value, key, index){
            expect([value, key, index]).toEqual([1, "0", 0]);
        });

        each({a: 1}, function(value, key, index){
            expect([value, key, index]).toEqual([1, "a", 0]);
        });

    });

});
