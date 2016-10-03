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
 * контексте и вернет исходный объект. Если обработчик вернет `false`,
 * перебор элементов прервется и функция вернет исходный объект.
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
function each(obj, context, handler) {
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
            if (obj.hasOwnProperty(name) && (
                    ['length', 'prevObject', 'context', 'selector'].indexOf(name) === -1 ||
                    !(  obj instanceof Array ||
                        obj instanceof HTMLCollection ||
                        obj instanceof NodeList ||
                        obj instanceof FileList ||
                        ("jQuery" in window && obj instanceof window.jQuery) ||
                        ("$" in window && obj instanceof window.$))
                )) { if (handler.call(context, obj[name], name, index++) === false) { return obj; } }
        }
    }
    return obj;
}

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
function  grep(obj, context, handler) {
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

    each(obj, context, function(value, key, index) {
        if (handler.call(context, value, key, index) !== false) {
            isArr ? list.push(value) : list[key] = value;
        }
    });

    return list;
}

/**
 * Вызовет обработчик для каждого элемента коллекции и присвоит
 * результат этого вызова в элемент
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
function  collect(obj, context, handler) {
    var isArr, list, result;

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

    each(obj, context, function(value, key, index) {
        result = handler.call(context, value, key, index);
        isArr ? (list.push(result)) : (list[key] = result);
    });

    return list;
}

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
function  collectEntries(obj, context, handler) {
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
    each(obj, context, function(value, key, index) {
        result = handler.call(context, value, key, index);
        if (result !== false) {
            list[result[0]] = result[1];
        }
    });
    return list;
}

/**
 * Выводит строку отформатированную в соответствии с указанным форматом
 * принцип работы похож на функцию printf в php или System.out.format в java, только
 * адаптированный под требования javascript.
 *
 * Синтаксис ключей
 *  %s - без аргументов
 *  ${su} - без агрументов
 *  ${sr:foo,bar} - с аргументами
 *
 * Строковые (интерпретируют аргумент как строку)
 *  s  - отобразить как есть
 *  sU - привести к верхнему регистру
 *  su - привести первый символ каждого слова к верхнему регистру
 *  sL - привести к нижнему регистру
 *  sl - привести первый символ каждого слова к нижнему регистру
 *  seu - кодировать функцией encodeURIComponent
 *  sdu - декодировать функцией decodeURIComponent
 *  sr:from,to - заменить подстроку указанную в первом параметре на подстроку указанную во втором
 *
 * Числовые (аргумент интерпретируется как число)
 *  d - отобразить как есть
 *  df:num - добавить дробную часть указанной длины (два, по умолчанию)
 *  de:num - научная нотация в нижнем регистре (в параметре кол-во знаков после запятой)
 *  dE:num - научная нотация в верхнем регистре (в параметре кол-во знаков после запятой)
 *  dh - как шестнадцатиричное число в нижнем регистре
 *  dH - как шестнадцатиричное число в верхнем регистре
 *  db - как бинарное число
 *  do - как восьмиричное число
 *  dn:from,to - переводит в из указанной системы в указанную систему счисления (по умлочанию 10)
 *
 * Массивы (аргумент будет привен к массиву, если не является таковым, и у него будет вызван метод join)
 *  a - элементы через запятую + побел ', '
 *  as:str - конкатенация элементов указаной подстрокой (по умолчанию запятая)
 *
 * JSON (аргумент будет прведен к массиву, если не является массивом или объктом)
 *  j - будет использована функция JSON.stringify
 *
 * @param {String} format
 * @param {*|Array<*>} args
 * @param {Object} [customMods]
 */
function  fs(format, args, customMods) {

    var mods = {
        "s":  function(i){ return String(i); },
        "sU": function(i){ return String(i).toUpperCase(); },
        "su": function(i){ return String(i).replace(/(?:^|\s)[a-zа-яё]/ig, function(a){ return a.toUpperCase(); }); },
        "sL": function(i){ return String(i).toLowerCase(); },
        "sl": function(i){ return String(i).replace(/(?:^|\s)[a-zа-яё]/ig, function(a, g){ return g.toLowerCase(); }); },
        "sr": function(i, f, t){ return String(i).replace(new RegExp(f, "ig"), t); },

        "d": function(i){ return Number(i); },
        "df": function(i, num){ return Number(i).toFixed(num ? num : 2); },
        "de": function(i, num){ return Number(i).toExponential(num ? num : 0) },
        "dE": function(i, num){ return Number(i).toExponential(num ? num : 0).toUpperCase(); },
        "dh": function(i){ return Number(i).toString(16); },
        "dH": function(i){ return Number(i).toString(16).toUpperCase(); },
        "db": function(i){ return Number(i).toString(2); },
        "do": function(i){ return Number(i).toString(8); },
        "dn": function(i, from, to){ return parseInt(i, from ? from : 10).toString(to ? to : 10); },

        "a": function(i){ return (i instanceof Array ? i : [i]).join(", "); },
        "as": function(i, str){ return (i instanceof Array ? i : [i]).join(str ? str : ","); },
        "j":  function(i){ return JSON.stringify(~["Object", "Array"].indexOf(i.constructor.name) ? i : [i]); }
    };

    args = args instanceof Array ? args : [args];

    each(customMods || {}, function(mod, key){ mods[key] = mod; });

    return format.replace(/%(\w+)|(?:\$\{(\w+):?(.*?)\})/gi, function(a, n1, n2, ag){
        return a = n1 || n2, a in mods ? mods[a].apply(scope, [args.shift()].concat(ag ? ag.split(/\s*,\s*/) : [])) : a;
    });
}

module.exports = {
    each: each,
    grep: grep,
    collect: collect,
    collectEntries: collectEntries,
    fs: fs
};
