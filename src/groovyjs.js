
(function(context){

    /**
     * @callback each_handler
     * @param {*} value Value of each object element
     * @param {String} key Key of each object element
     * @param {Number} index Iteration index
     */

    /**
     * @callback grep_handler
     * @param {*} value Value of each object element
     * @param {String} key Key of each object element
     * @param {Number} index Iteration index
     * @return {Boolean}
     */

    /**
     * @callback collect_handler
     * @param {*} value Value of each object element
     * @param {String} key Key of each object element
     * @param {Number} index Iteration index
     * @return {*}
     */

    /**
     * @callback collectEntries_handler
     * @param {*} value Value of each object element
     * @param {String} key Key of each object element
     * @param {Number} index Iteration index
     * @return {Boolean|Array} where first item is key, and two is value. If false, then exclude value
     */

    /**
     * Call handler in context for each item in object or array
     * Return received object or array
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

    /**
     * Similar to the previous function except that it returns an object
     * containing the elements on which the handler returned truth.
     *
     * @example:
     * // returns: [2]
     * grep([1,2,3], function(n){ return (n%2) === 0 });
     *
     * @param {Object|Array|grep_handler} obj
     * @param {*} [context=this]
     * @param {grep_handler} handler
     * @returns {Object|Array}
     */
    context.grep = function (obj, context, handler) {
        var isArr, list;

        if (arguments.length === 1) {
            handler = obj;
            context = this;
            obj = this;
        }

        if (arguments.length === 2) {
            handler = context;
            context = this;
        }

        list = (isArr = obj instanceof Array) ? [] : {};

        this.each(obj, context, function(value, key, index) {
            if (handler.call(context, value, key, index) !== false) {
                isArr ? list.push(value) : list[key] = value;
            }
        });

        return list;
    };

    /**
     * Cause a handler for each element and assigns the result of a call
     * handler in the value of the item. Not only if the handler does
     * not return false, in this case, the element will be removed
     *
     * @example
     * // returns: [4]
     * Knee.collect([1,2,3], function(n){ return (n%2) === 0 ? n * 2 : false });
     *
     * @param {Object|Array|collect_handler} obj
     * @param {*} [context=this]
     * @param {collect_handler} handler
     * @returns {Object|Array}
     */
    context.collect = function (obj, context, handler) {
        var isArr, list;

        if (arguments.length === 1) {
            handler = obj;
            context = this;
            obj = this;
        }

        if (arguments.length === 2) {
            handler = context;
            context = this;
        }

        list = (isArr = obj instanceof Array) ? [] : {};

        this.each(obj, context, function(value, key, index) {
            if ((list[key] = handler.call(context, value, key, index)) === false) {
                isArr ? (list.splice(key, 1)) : (delete list[key]);
            }
        });

        return list;
    };

    /**
     * Similarly, the function collect, but will update not only
     * the value but the key object.
     *
     * @example:
     * // returns: {A: 1}
     * collectEntries({a:1}, function(value, key){ return [key.toUpperCase(), value]; });
     *
     * @param {Object|Array|collectEntries_handler} obj
     * @param {*} [context=this]
     * @param {collectEntries_handler} handler
     * @returns {Object}
     */
    context.collectEntries = function (obj, context, handler) {
        var list = {}, result;

        if (arguments.length === 1) {
            handler = obj;
            context = this;
            obj = this;
        }

        if (arguments.length === 2) {
            handler = context;
            context = this;
        }

        this.each(obj, context, function(value, key, index) {
            result = handler.call(context, value, key, index);
            if (result !== false) {
                list[result[0]] = result[1];
            }
        });
        return list;
    };

}(this));

