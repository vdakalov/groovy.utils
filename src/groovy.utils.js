
(function(scope){

    /**
     * Коллекция
     * функции будут работать правильно, если в качестве коллеции передать этот тип
     *
     * @typedef {Array|FileList|HTMLCollection|NodeList|Object} Collection
     */

    /**
     * @callback each_handler
     * @param {*} value Значение элемента коллекции
     * @param {String} key Ключ элемента коллекции
     * @param {Number} index Интекс итерации
     */

    /**
     * @callback grep_handler
     * @param {*} value Значение элемента коллекции
     * @param {String} key Ключ элемента коллекции
     * @param {Number} index Интекс итерации
     * @return {Boolean}
     */

    /**
     * @callback collect_handler
     * @param {*} value Значение элемента коллекции
     * @param {String} key Ключ элемента коллекции
     * @param {Number} index Интекс итерации
     * @return {*}
     */

    /**
     * @callback collectEntries_handler
     * @param {*} value Значение элемента коллекции
     * @param {String} key Ключ элемента коллекции
     * @param {Number} index Интекс итерации
     * @return {Boolean|Array} массив как [КЛЮЧ, ЗНАЧЕНИЕ] или false для исключения элемента из новой коллекции
     */

    /**
     * Вызовет обработчик для каждого элемента коллекции в заданном
     * контексте и вернет исходный объект
     *
     * @example
     * // выведет: 1, "0", 0
     * // вернет: [1]
     * each([1], function(value, key, index){ console.log(value, key, index); });
     *
     * // выведет: 10, "a", 0
     * //        20, "b", 1
     * // вернет: {a: 10, b: 20}
     * var myEach = each.bind({a: 10, b: 20});
     * myEach(function(value, key, index){ console.log(value, key, index); });
     *
     * // выведет: 4, "0", 0
     * //         8, "1", 1
     * //         12, "2", 2
     * // вернет: [1,2,3]
     * each([1,2,3], {multiply: 4}, function(value, key, index){ console.log(value * this.multiply, key, index); });
     *
     * @param {Collection|each_handler} obj Коллекция элементов или обработчик (если коллекция в контексте функции)
     * @param {*} [context=this] Контекст, в котором обработчик будет вызываться
     * @param {each_handler} handler Обработчик
     * @return {Collection}
     */
    scope.each = function(obj, context, handler) {
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
     * Отфильтрует элементы коллекции
     *
     * @example:
     * // вернет: [2]
     * grep([1,2,3], function(n){ return (n%2) === 0 });
     *
     * @param {Collection|grep_handler} obj Коллекция или обработчик, если коллекция находится в контексте функции
     * @param {*} [context=this] Контекст, в котором обработчик будет вызываться
     * @param {grep_handler} handler Обработчик
     * @returns {Object|Array} Вернет элементы в новой коллекции являющейся либо массивом, либо объектом.
     */
    scope.grep = function (obj, context, handler) {
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

        scope.each(obj, context, function(value, key, index) {
            if (handler.call(context, value, key, index) !== false) {
                isArr ? list.push(value) : list[key] = value;
            }
        });

        return list;
    };

    /**
     * Вызовет обработчик для каждого элемента коллекции и присвоит
     * результат этого вызова в элемент
     *
     * Cause a handler for each element and assigns the result of a call
     * handler in the value of the item. Not only if the handler does
     * not return false, in this case, the element will be removed
     *
     * @example
     * // returns: [4]
     * Knee.collect([1,2,3], function(n){ return (n%2) === 0 ? n * 2 : false });
     *
     * @param {Collection|collect_handler} obj Коллекция или обработчик, если коллекция находится в контексте функции
     * @param {*} [context=this] Контекст, в котором обработчик будет вызываться
     * @param {collect_handler} handler Обработчик
     * @returns {Object|Array} Вернет новый массив или объект с новыми значениями
     */
    scope.collect = function (obj, context, handler) {
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

        scope.each(obj, context, function(value, key, index) {
            if ((list[key] = handler.call(context, value, key, index)) === false) {
                isArr ? (list.splice(key, 1)) : (delete list[key]);
            }
        });

        return list;
    };

    /**
     * Вызовет обработчик для каждого элемента коллекции. Результат каждого вызова,
     * если он не является false, будет интерпретироваться как [ключ, значение].
     * Если результатом вызова будет false, элемент не попадет в новую коллекцию
     *
     * @example:
     * // returns: {A: 1}
     * collectEntries({a:1}, function(value, key){ return [key.toUpperCase(), value]; });
     *
     * @param {Collection|collectEntries_handler} obj
     * @param {*} [context=this]
     * @param {collectEntries_handler} handler
     * @returns {Array|Object}
     */
    scope.collectEntries = function (obj, context, handler) {
        var list, result, isArr;

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
        scope.each(obj, context, function(value, key, index) {
            result = handler.call(context, value, key, index);
            if (result !== false) {
                list[result[0]] = result[1];
            }
        });
        return list;
    };

}(this));

