
(function(context){

    /**
     * @callback each_handler
     * @param {*} value Value of each object element
     * @param {String} key Key of each object element
     * @param {Number} index Iteration index
     */

    /**
     *
     * @example
     * // output: 1, "0", 0
     * // returns: [1]
     * each([1], function(value, key, index){ console.log(value, key, index); });
     *
     * // output: 10, "a", 0
     * //        20, "b", 1
     * // returns: {a: 10, b: 20}
     * var myEach = each.bind({a: 10, b: 20});
     * myEach(function(value, key, index){ console.log(value, key, index); });
     *
     * // output: 4, "0", 0
     * //         8, "1", 1
     * //         12, "2", 2
     * // returns: [1,2,3]
     * each([1,2,3], {multiply: 4}, function(value, key, index){ console.log(value * this.multiply, key, index); });
     *
     * @param {Array|Object|each_handler} obj
     * @param {*} [context=this]
     * @param {each_handler} handler
     * @return {Array|Object}
     */
    context.each = function(obj, context, handler) {
        var index = 0, name;

        if (arguments.length === 1) {
            handler = obj;
            context = this;
            obj = this
        }

        if (arguments.length === 2) {
            handler = context;
            context = this
        }

        if (typeof obj === 'object' && obj !== null && typeof handler === 'function') {
            for (name in obj) {
                if (obj.hasOwnProperty(name) && (name !== 'length' || !(
                        obj instanceof Array ||
                        obj instanceof HTMLCollection ||
                        obj instanceof NodeList ||
                        obj instanceof FileList
                    ))) { handler.call(context, obj[name], name, index++); }
            }
        }
        return obj;
    };



}(this));

