
(function(context){

    /**
     *
     *
     * @param {Array|Object|Function} obj
     * @param {*} [context=this]
     * @param {Function} handler
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

