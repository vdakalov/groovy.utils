# groovy.utils
Реализация некоторых полезных функций из Groovy на Javascript

Установка в bower
`bower install groovy.utils`

Все функции имеют два первых необязательных аргемента.
Если:

1. передано два аргемента, то это `colletion` и `handler`, в качестве контекста используется контекст функции.
2. передан один аргемент, то это `handler`. Коллекция берется из контекста функции и она же используется как контекст

Таким образом можно привязать коллекцию к функции в виде контекста
```javascript
var myCollectionEach = each.bind([1, 2, 3]);
myCollectionEach(function(value, key, index){ /* ... */ });
```

## Collection
В документации под коллекцией подразумевается `Array`, `Object`, `FileList`, `HTMLCollection` или `NodeList`. С этими объектами функции работают правильно. Список будет дополняться.

## each
`Collection each([collection, context], handler)`

Вызывает принятый обработчик в заданном или глобальном контексте, для каждого элемента коллекции и возвращает исходный объект

```javascript
each([1,2,3], console, function(value, key, index){
  this.log(value, key, index);
});
```

## grep
`Array|Object collect([collection, context], handler)`

Отфильтрует коллекцию и вернет новую в виде массива или объекта, в зависимости от того что было указано в качестве коллекции.

```javascript
grep([1,2,3,4], function(value){ return value % 2 === 0; });
```

## collect
`Array|Object collect([collection, context], handler)`

Вызывает принятый обработчик в заданном или глобальном контексте, для каждого элемента коллекции и использует резутать вызова как новое значение для этого элемента коллекции. Вернет новую коллекцию, либо массив, либо объект. В зависимости от того что было указано в качестве коллекции.

```javascript
collect([1,2,3], function(value, key, index){ return value * index; }); // [0, 2, 6]
```

## collectEntries
`Array|Object collectEntries([collection, context], handler)`

Вызывает принятый обработчик в заданном или глобальном контексте, для каждого элемента коллекции и использует резутать вызова как новые ключ и значение для этого элемента коллекции. Если обработчик вернул `false`, элемент не попадет в новую коллекцию. Вернет новую коллекцию в виде массива или объекта, в зависимости от того что было указано в качестве коллекции.

```javascript
collectEntries({a: 10, b: 20}, function(value, key, index){ return [key.toUpperCase(), value * 10]; }); // {A: 100, B: 200}
```
