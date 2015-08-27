(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactor = require('./reactor');

var _reactor2 = _interopRequireDefault(_reactor);

},{"./reactor":3}],2:[function(require,module,exports){
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["Nuclear"] = factory();
	else
		root["Nuclear"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var helpers = __webpack_require__(1)

	/**
	 * @return {Reactor}
	 */
	exports.Reactor = __webpack_require__(4)

	/**
	 * @return {Store}
	 */
	exports.Store = __webpack_require__(13)

	// export the immutable library
	exports.Immutable = __webpack_require__(2)

	/**
	 * @return {boolean}
	 */
	exports.isKeyPath = __webpack_require__(10).isKeyPath

	/**
	 * @return {boolean}
	 */
	exports.isGetter = __webpack_require__(9).isGetter

	// expose helper functions
	exports.toJS = helpers.toJS
	exports.toImmutable = helpers.toImmutable
	exports.isImmutable = helpers.isImmutable

	exports.createReactMixin = __webpack_require__(12)


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Immutable = __webpack_require__(2)
	var isObject = __webpack_require__(3).isObject

	/**
	 * A collection of helpers for the ImmutableJS library
	 */

	/**
	 * @param {*} obj
	 * @return {boolean}
	 */
	function isImmutable(obj) {
	  return Immutable.Iterable.isIterable(obj)
	}

	/**
	 * Returns true if the value is an ImmutableJS data structure
	 * or a JavaScript primitive that is immutable (string, number, etc)
	 * @param {*} obj
	 * @return {boolean}
	 */
	function isImmutableValue(obj) {
	  return (
	    isImmutable(obj) ||
	    !isObject(obj)
	  )
	}

	/**
	 * Converts an Immutable Sequence to JS object
	 * Can be called on any type
	 */
	function toJS(arg) {
	  // arg instanceof Immutable.Sequence is unreliable
	  return (isImmutable(arg))
	    ? arg.toJS()
	    : arg
	}

	/**
	 * Converts a JS object to an Immutable object, if it's
	 * already Immutable its a no-op
	 */
	function toImmutable(arg) {
	  return (isImmutable(arg))
	    ? arg
	    : Immutable.fromJS(arg)
	}

	exports.toJS = toJS
	exports.toImmutable = toImmutable
	exports.isImmutable = isImmutable
	exports.isImmutableValue = isImmutableValue


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 *  Copyright (c) 2014-2015, Facebook, Inc.
	 *  All rights reserved.
	 *
	 *  This source code is licensed under the BSD-style license found in the
	 *  LICENSE file in the root directory of this source tree. An additional grant
	 *  of patent rights can be found in the PATENTS file in the same directory.
	 */
	(function (global, factory) {
	  true ? module.exports = factory() :
	  typeof define === 'function' && define.amd ? define(factory) :
	  global.Immutable = factory()
	}(this, function () { 'use strict';var SLICE$0 = Array.prototype.slice;

	  function createClass(ctor, superClass) {
	    if (superClass) {
	      ctor.prototype = Object.create(superClass.prototype);
	    }
	    ctor.prototype.constructor = ctor;
	  }

	  // Used for setting prototype methods that IE8 chokes on.
	  var DELETE = 'delete';

	  // Constants describing the size of trie nodes.
	  var SHIFT = 5; // Resulted in best performance after ______?
	  var SIZE = 1 << SHIFT;
	  var MASK = SIZE - 1;

	  // A consistent shared value representing "not set" which equals nothing other
	  // than itself, and nothing that could be provided externally.
	  var NOT_SET = {};

	  // Boolean references, Rough equivalent of `bool &`.
	  var CHANGE_LENGTH = { value: false };
	  var DID_ALTER = { value: false };

	  function MakeRef(ref) {
	    ref.value = false;
	    return ref;
	  }

	  function SetRef(ref) {
	    ref && (ref.value = true);
	  }

	  // A function which returns a value representing an "owner" for transient writes
	  // to tries. The return value will only ever equal itself, and will not equal
	  // the return of any subsequent call of this function.
	  function OwnerID() {}

	  // http://jsperf.com/copy-array-inline
	  function arrCopy(arr, offset) {
	    offset = offset || 0;
	    var len = Math.max(0, arr.length - offset);
	    var newArr = new Array(len);
	    for (var ii = 0; ii < len; ii++) {
	      newArr[ii] = arr[ii + offset];
	    }
	    return newArr;
	  }

	  function ensureSize(iter) {
	    if (iter.size === undefined) {
	      iter.size = iter.__iterate(returnTrue);
	    }
	    return iter.size;
	  }

	  function wrapIndex(iter, index) {
	    return index >= 0 ? (+index) : ensureSize(iter) + (+index);
	  }

	  function returnTrue() {
	    return true;
	  }

	  function wholeSlice(begin, end, size) {
	    return (begin === 0 || (size !== undefined && begin <= -size)) &&
	      (end === undefined || (size !== undefined && end >= size));
	  }

	  function resolveBegin(begin, size) {
	    return resolveIndex(begin, size, 0);
	  }

	  function resolveEnd(end, size) {
	    return resolveIndex(end, size, size);
	  }

	  function resolveIndex(index, size, defaultIndex) {
	    return index === undefined ?
	      defaultIndex :
	      index < 0 ?
	        Math.max(0, size + index) :
	        size === undefined ?
	          index :
	          Math.min(size, index);
	  }

	  function Iterable(value) {
	      return isIterable(value) ? value : Seq(value);
	    }


	  createClass(KeyedIterable, Iterable);
	    function KeyedIterable(value) {
	      return isKeyed(value) ? value : KeyedSeq(value);
	    }


	  createClass(IndexedIterable, Iterable);
	    function IndexedIterable(value) {
	      return isIndexed(value) ? value : IndexedSeq(value);
	    }


	  createClass(SetIterable, Iterable);
	    function SetIterable(value) {
	      return isIterable(value) && !isAssociative(value) ? value : SetSeq(value);
	    }



	  function isIterable(maybeIterable) {
	    return !!(maybeIterable && maybeIterable[IS_ITERABLE_SENTINEL]);
	  }

	  function isKeyed(maybeKeyed) {
	    return !!(maybeKeyed && maybeKeyed[IS_KEYED_SENTINEL]);
	  }

	  function isIndexed(maybeIndexed) {
	    return !!(maybeIndexed && maybeIndexed[IS_INDEXED_SENTINEL]);
	  }

	  function isAssociative(maybeAssociative) {
	    return isKeyed(maybeAssociative) || isIndexed(maybeAssociative);
	  }

	  function isOrdered(maybeOrdered) {
	    return !!(maybeOrdered && maybeOrdered[IS_ORDERED_SENTINEL]);
	  }

	  Iterable.isIterable = isIterable;
	  Iterable.isKeyed = isKeyed;
	  Iterable.isIndexed = isIndexed;
	  Iterable.isAssociative = isAssociative;
	  Iterable.isOrdered = isOrdered;

	  Iterable.Keyed = KeyedIterable;
	  Iterable.Indexed = IndexedIterable;
	  Iterable.Set = SetIterable;


	  var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
	  var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
	  var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
	  var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';

	  /* global Symbol */

	  var ITERATE_KEYS = 0;
	  var ITERATE_VALUES = 1;
	  var ITERATE_ENTRIES = 2;

	  var REAL_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
	  var FAUX_ITERATOR_SYMBOL = '@@iterator';

	  var ITERATOR_SYMBOL = REAL_ITERATOR_SYMBOL || FAUX_ITERATOR_SYMBOL;


	  function src_Iterator__Iterator(next) {
	      this.next = next;
	    }

	    src_Iterator__Iterator.prototype.toString = function() {
	      return '[Iterator]';
	    };


	  src_Iterator__Iterator.KEYS = ITERATE_KEYS;
	  src_Iterator__Iterator.VALUES = ITERATE_VALUES;
	  src_Iterator__Iterator.ENTRIES = ITERATE_ENTRIES;

	  src_Iterator__Iterator.prototype.inspect =
	  src_Iterator__Iterator.prototype.toSource = function () { return this.toString(); }
	  src_Iterator__Iterator.prototype[ITERATOR_SYMBOL] = function () {
	    return this;
	  };


	  function iteratorValue(type, k, v, iteratorResult) {
	    var value = type === 0 ? k : type === 1 ? v : [k, v];
	    iteratorResult ? (iteratorResult.value = value) : (iteratorResult = {
	      value: value, done: false
	    });
	    return iteratorResult;
	  }

	  function iteratorDone() {
	    return { value: undefined, done: true };
	  }

	  function hasIterator(maybeIterable) {
	    return !!getIteratorFn(maybeIterable);
	  }

	  function isIterator(maybeIterator) {
	    return maybeIterator && typeof maybeIterator.next === 'function';
	  }

	  function getIterator(iterable) {
	    var iteratorFn = getIteratorFn(iterable);
	    return iteratorFn && iteratorFn.call(iterable);
	  }

	  function getIteratorFn(iterable) {
	    var iteratorFn = iterable && (
	      (REAL_ITERATOR_SYMBOL && iterable[REAL_ITERATOR_SYMBOL]) ||
	      iterable[FAUX_ITERATOR_SYMBOL]
	    );
	    if (typeof iteratorFn === 'function') {
	      return iteratorFn;
	    }
	  }

	  function isArrayLike(value) {
	    return value && typeof value.length === 'number';
	  }

	  createClass(Seq, Iterable);
	    function Seq(value) {
	      return value === null || value === undefined ? emptySequence() :
	        isIterable(value) ? value.toSeq() : seqFromValue(value);
	    }

	    Seq.of = function(/*...values*/) {
	      return Seq(arguments);
	    };

	    Seq.prototype.toSeq = function() {
	      return this;
	    };

	    Seq.prototype.toString = function() {
	      return this.__toString('Seq {', '}');
	    };

	    Seq.prototype.cacheResult = function() {
	      if (!this._cache && this.__iterateUncached) {
	        this._cache = this.entrySeq().toArray();
	        this.size = this._cache.length;
	      }
	      return this;
	    };

	    // abstract __iterateUncached(fn, reverse)

	    Seq.prototype.__iterate = function(fn, reverse) {
	      return seqIterate(this, fn, reverse, true);
	    };

	    // abstract __iteratorUncached(type, reverse)

	    Seq.prototype.__iterator = function(type, reverse) {
	      return seqIterator(this, type, reverse, true);
	    };



	  createClass(KeyedSeq, Seq);
	    function KeyedSeq(value) {
	      return value === null || value === undefined ?
	        emptySequence().toKeyedSeq() :
	        isIterable(value) ?
	          (isKeyed(value) ? value.toSeq() : value.fromEntrySeq()) :
	          keyedSeqFromValue(value);
	    }

	    KeyedSeq.prototype.toKeyedSeq = function() {
	      return this;
	    };



	  createClass(IndexedSeq, Seq);
	    function IndexedSeq(value) {
	      return value === null || value === undefined ? emptySequence() :
	        !isIterable(value) ? indexedSeqFromValue(value) :
	        isKeyed(value) ? value.entrySeq() : value.toIndexedSeq();
	    }

	    IndexedSeq.of = function(/*...values*/) {
	      return IndexedSeq(arguments);
	    };

	    IndexedSeq.prototype.toIndexedSeq = function() {
	      return this;
	    };

	    IndexedSeq.prototype.toString = function() {
	      return this.__toString('Seq [', ']');
	    };

	    IndexedSeq.prototype.__iterate = function(fn, reverse) {
	      return seqIterate(this, fn, reverse, false);
	    };

	    IndexedSeq.prototype.__iterator = function(type, reverse) {
	      return seqIterator(this, type, reverse, false);
	    };



	  createClass(SetSeq, Seq);
	    function SetSeq(value) {
	      return (
	        value === null || value === undefined ? emptySequence() :
	        !isIterable(value) ? indexedSeqFromValue(value) :
	        isKeyed(value) ? value.entrySeq() : value
	      ).toSetSeq();
	    }

	    SetSeq.of = function(/*...values*/) {
	      return SetSeq(arguments);
	    };

	    SetSeq.prototype.toSetSeq = function() {
	      return this;
	    };



	  Seq.isSeq = isSeq;
	  Seq.Keyed = KeyedSeq;
	  Seq.Set = SetSeq;
	  Seq.Indexed = IndexedSeq;

	  var IS_SEQ_SENTINEL = '@@__IMMUTABLE_SEQ__@@';

	  Seq.prototype[IS_SEQ_SENTINEL] = true;



	  // #pragma Root Sequences

	  createClass(ArraySeq, IndexedSeq);
	    function ArraySeq(array) {
	      this._array = array;
	      this.size = array.length;
	    }

	    ArraySeq.prototype.get = function(index, notSetValue) {
	      return this.has(index) ? this._array[wrapIndex(this, index)] : notSetValue;
	    };

	    ArraySeq.prototype.__iterate = function(fn, reverse) {
	      var array = this._array;
	      var maxIndex = array.length - 1;
	      for (var ii = 0; ii <= maxIndex; ii++) {
	        if (fn(array[reverse ? maxIndex - ii : ii], ii, this) === false) {
	          return ii + 1;
	        }
	      }
	      return ii;
	    };

	    ArraySeq.prototype.__iterator = function(type, reverse) {
	      var array = this._array;
	      var maxIndex = array.length - 1;
	      var ii = 0;
	      return new src_Iterator__Iterator(function() 
	        {return ii > maxIndex ?
	          iteratorDone() :
	          iteratorValue(type, ii, array[reverse ? maxIndex - ii++ : ii++])}
	      );
	    };



	  createClass(ObjectSeq, KeyedSeq);
	    function ObjectSeq(object) {
	      var keys = Object.keys(object);
	      this._object = object;
	      this._keys = keys;
	      this.size = keys.length;
	    }

	    ObjectSeq.prototype.get = function(key, notSetValue) {
	      if (notSetValue !== undefined && !this.has(key)) {
	        return notSetValue;
	      }
	      return this._object[key];
	    };

	    ObjectSeq.prototype.has = function(key) {
	      return this._object.hasOwnProperty(key);
	    };

	    ObjectSeq.prototype.__iterate = function(fn, reverse) {
	      var object = this._object;
	      var keys = this._keys;
	      var maxIndex = keys.length - 1;
	      for (var ii = 0; ii <= maxIndex; ii++) {
	        var key = keys[reverse ? maxIndex - ii : ii];
	        if (fn(object[key], key, this) === false) {
	          return ii + 1;
	        }
	      }
	      return ii;
	    };

	    ObjectSeq.prototype.__iterator = function(type, reverse) {
	      var object = this._object;
	      var keys = this._keys;
	      var maxIndex = keys.length - 1;
	      var ii = 0;
	      return new src_Iterator__Iterator(function()  {
	        var key = keys[reverse ? maxIndex - ii : ii];
	        return ii++ > maxIndex ?
	          iteratorDone() :
	          iteratorValue(type, key, object[key]);
	      });
	    };

	  ObjectSeq.prototype[IS_ORDERED_SENTINEL] = true;


	  createClass(IterableSeq, IndexedSeq);
	    function IterableSeq(iterable) {
	      this._iterable = iterable;
	      this.size = iterable.length || iterable.size;
	    }

	    IterableSeq.prototype.__iterateUncached = function(fn, reverse) {
	      if (reverse) {
	        return this.cacheResult().__iterate(fn, reverse);
	      }
	      var iterable = this._iterable;
	      var iterator = getIterator(iterable);
	      var iterations = 0;
	      if (isIterator(iterator)) {
	        var step;
	        while (!(step = iterator.next()).done) {
	          if (fn(step.value, iterations++, this) === false) {
	            break;
	          }
	        }
	      }
	      return iterations;
	    };

	    IterableSeq.prototype.__iteratorUncached = function(type, reverse) {
	      if (reverse) {
	        return this.cacheResult().__iterator(type, reverse);
	      }
	      var iterable = this._iterable;
	      var iterator = getIterator(iterable);
	      if (!isIterator(iterator)) {
	        return new src_Iterator__Iterator(iteratorDone);
	      }
	      var iterations = 0;
	      return new src_Iterator__Iterator(function()  {
	        var step = iterator.next();
	        return step.done ? step : iteratorValue(type, iterations++, step.value);
	      });
	    };



	  createClass(IteratorSeq, IndexedSeq);
	    function IteratorSeq(iterator) {
	      this._iterator = iterator;
	      this._iteratorCache = [];
	    }

	    IteratorSeq.prototype.__iterateUncached = function(fn, reverse) {
	      if (reverse) {
	        return this.cacheResult().__iterate(fn, reverse);
	      }
	      var iterator = this._iterator;
	      var cache = this._iteratorCache;
	      var iterations = 0;
	      while (iterations < cache.length) {
	        if (fn(cache[iterations], iterations++, this) === false) {
	          return iterations;
	        }
	      }
	      var step;
	      while (!(step = iterator.next()).done) {
	        var val = step.value;
	        cache[iterations] = val;
	        if (fn(val, iterations++, this) === false) {
	          break;
	        }
	      }
	      return iterations;
	    };

	    IteratorSeq.prototype.__iteratorUncached = function(type, reverse) {
	      if (reverse) {
	        return this.cacheResult().__iterator(type, reverse);
	      }
	      var iterator = this._iterator;
	      var cache = this._iteratorCache;
	      var iterations = 0;
	      return new src_Iterator__Iterator(function()  {
	        if (iterations >= cache.length) {
	          var step = iterator.next();
	          if (step.done) {
	            return step;
	          }
	          cache[iterations] = step.value;
	        }
	        return iteratorValue(type, iterations, cache[iterations++]);
	      });
	    };




	  // # pragma Helper functions

	  function isSeq(maybeSeq) {
	    return !!(maybeSeq && maybeSeq[IS_SEQ_SENTINEL]);
	  }

	  var EMPTY_SEQ;

	  function emptySequence() {
	    return EMPTY_SEQ || (EMPTY_SEQ = new ArraySeq([]));
	  }

	  function keyedSeqFromValue(value) {
	    var seq =
	      Array.isArray(value) ? new ArraySeq(value).fromEntrySeq() :
	      isIterator(value) ? new IteratorSeq(value).fromEntrySeq() :
	      hasIterator(value) ? new IterableSeq(value).fromEntrySeq() :
	      typeof value === 'object' ? new ObjectSeq(value) :
	      undefined;
	    if (!seq) {
	      throw new TypeError(
	        'Expected Array or iterable object of [k, v] entries, '+
	        'or keyed object: ' + value
	      );
	    }
	    return seq;
	  }

	  function indexedSeqFromValue(value) {
	    var seq = maybeIndexedSeqFromValue(value);
	    if (!seq) {
	      throw new TypeError(
	        'Expected Array or iterable object of values: ' + value
	      );
	    }
	    return seq;
	  }

	  function seqFromValue(value) {
	    var seq = maybeIndexedSeqFromValue(value) ||
	      (typeof value === 'object' && new ObjectSeq(value));
	    if (!seq) {
	      throw new TypeError(
	        'Expected Array or iterable object of values, or keyed object: ' + value
	      );
	    }
	    return seq;
	  }

	  function maybeIndexedSeqFromValue(value) {
	    return (
	      isArrayLike(value) ? new ArraySeq(value) :
	      isIterator(value) ? new IteratorSeq(value) :
	      hasIterator(value) ? new IterableSeq(value) :
	      undefined
	    );
	  }

	  function seqIterate(seq, fn, reverse, useKeys) {
	    var cache = seq._cache;
	    if (cache) {
	      var maxIndex = cache.length - 1;
	      for (var ii = 0; ii <= maxIndex; ii++) {
	        var entry = cache[reverse ? maxIndex - ii : ii];
	        if (fn(entry[1], useKeys ? entry[0] : ii, seq) === false) {
	          return ii + 1;
	        }
	      }
	      return ii;
	    }
	    return seq.__iterateUncached(fn, reverse);
	  }

	  function seqIterator(seq, type, reverse, useKeys) {
	    var cache = seq._cache;
	    if (cache) {
	      var maxIndex = cache.length - 1;
	      var ii = 0;
	      return new src_Iterator__Iterator(function()  {
	        var entry = cache[reverse ? maxIndex - ii : ii];
	        return ii++ > maxIndex ?
	          iteratorDone() :
	          iteratorValue(type, useKeys ? entry[0] : ii - 1, entry[1]);
	      });
	    }
	    return seq.__iteratorUncached(type, reverse);
	  }

	  createClass(Collection, Iterable);
	    function Collection() {
	      throw TypeError('Abstract');
	    }


	  createClass(KeyedCollection, Collection);function KeyedCollection() {}

	  createClass(IndexedCollection, Collection);function IndexedCollection() {}

	  createClass(SetCollection, Collection);function SetCollection() {}


	  Collection.Keyed = KeyedCollection;
	  Collection.Indexed = IndexedCollection;
	  Collection.Set = SetCollection;

	  /**
	   * An extension of the "same-value" algorithm as [described for use by ES6 Map
	   * and Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Key_equality)
	   *
	   * NaN is considered the same as NaN, however -0 and 0 are considered the same
	   * value, which is different from the algorithm described by
	   * [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
	   *
	   * This is extended further to allow Objects to describe the values they
	   * represent, by way of `valueOf` or `equals` (and `hashCode`).
	   *
	   * Note: because of this extension, the key equality of Immutable.Map and the
	   * value equality of Immutable.Set will differ from ES6 Map and Set.
	   *
	   * ### Defining custom values
	   *
	   * The easiest way to describe the value an object represents is by implementing
	   * `valueOf`. For example, `Date` represents a value by returning a unix
	   * timestamp for `valueOf`:
	   *
	   *     var date1 = new Date(1234567890000); // Fri Feb 13 2009 ...
	   *     var date2 = new Date(1234567890000);
	   *     date1.valueOf(); // 1234567890000
	   *     assert( date1 !== date2 );
	   *     assert( Immutable.is( date1, date2 ) );
	   *
	   * Note: overriding `valueOf` may have other implications if you use this object
	   * where JavaScript expects a primitive, such as implicit string coercion.
	   *
	   * For more complex types, especially collections, implementing `valueOf` may
	   * not be performant. An alternative is to implement `equals` and `hashCode`.
	   *
	   * `equals` takes another object, presumably of similar type, and returns true
	   * if the it is equal. Equality is symmetrical, so the same result should be
	   * returned if this and the argument are flipped.
	   *
	   *     assert( a.equals(b) === b.equals(a) );
	   *
	   * `hashCode` returns a 32bit integer number representing the object which will
	   * be used to determine how to store the value object in a Map or Set. You must
	   * provide both or neither methods, one must not exist without the other.
	   *
	   * Also, an important relationship between these methods must be upheld: if two
	   * values are equal, they *must* return the same hashCode. If the values are not
	   * equal, they might have the same hashCode; this is called a hash collision,
	   * and while undesirable for performance reasons, it is acceptable.
	   *
	   *     if (a.equals(b)) {
	   *       assert( a.hashCode() === b.hashCode() );
	   *     }
	   *
	   * All Immutable collections implement `equals` and `hashCode`.
	   *
	   */
	  function is(valueA, valueB) {
	    if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
	      return true;
	    }
	    if (!valueA || !valueB) {
	      return false;
	    }
	    if (typeof valueA.valueOf === 'function' &&
	        typeof valueB.valueOf === 'function') {
	      valueA = valueA.valueOf();
	      valueB = valueB.valueOf();
	      if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
	        return true;
	      }
	      if (!valueA || !valueB) {
	        return false;
	      }
	    }
	    if (typeof valueA.equals === 'function' &&
	        typeof valueB.equals === 'function' &&
	        valueA.equals(valueB)) {
	      return true;
	    }
	    return false;
	  }

	  function fromJS(json, converter) {
	    return converter ?
	      fromJSWith(converter, json, '', {'': json}) :
	      fromJSDefault(json);
	  }

	  function fromJSWith(converter, json, key, parentJSON) {
	    if (Array.isArray(json)) {
	      return converter.call(parentJSON, key, IndexedSeq(json).map(function(v, k)  {return fromJSWith(converter, v, k, json)}));
	    }
	    if (isPlainObj(json)) {
	      return converter.call(parentJSON, key, KeyedSeq(json).map(function(v, k)  {return fromJSWith(converter, v, k, json)}));
	    }
	    return json;
	  }

	  function fromJSDefault(json) {
	    if (Array.isArray(json)) {
	      return IndexedSeq(json).map(fromJSDefault).toList();
	    }
	    if (isPlainObj(json)) {
	      return KeyedSeq(json).map(fromJSDefault).toMap();
	    }
	    return json;
	  }

	  function isPlainObj(value) {
	    return value && (value.constructor === Object || value.constructor === undefined);
	  }

	  var src_Math__imul =
	    typeof Math.imul === 'function' && Math.imul(0xffffffff, 2) === -2 ?
	    Math.imul :
	    function src_Math__imul(a, b) {
	      a = a | 0; // int
	      b = b | 0; // int
	      var c = a & 0xffff;
	      var d = b & 0xffff;
	      // Shift by 0 fixes the sign on the high part.
	      return (c * d) + ((((a >>> 16) * d + c * (b >>> 16)) << 16) >>> 0) | 0; // int
	    };

	  // v8 has an optimization for storing 31-bit signed numbers.
	  // Values which have either 00 or 11 as the high order bits qualify.
	  // This function drops the highest order bit in a signed number, maintaining
	  // the sign bit.
	  function smi(i32) {
	    return ((i32 >>> 1) & 0x40000000) | (i32 & 0xBFFFFFFF);
	  }

	  function hash(o) {
	    if (o === false || o === null || o === undefined) {
	      return 0;
	    }
	    if (typeof o.valueOf === 'function') {
	      o = o.valueOf();
	      if (o === false || o === null || o === undefined) {
	        return 0;
	      }
	    }
	    if (o === true) {
	      return 1;
	    }
	    var type = typeof o;
	    if (type === 'number') {
	      var h = o | 0;
	      if (h !== o) {
	        h ^= o * 0xFFFFFFFF;
	      }
	      while (o > 0xFFFFFFFF) {
	        o /= 0xFFFFFFFF;
	        h ^= o;
	      }
	      return smi(h);
	    }
	    if (type === 'string') {
	      return o.length > STRING_HASH_CACHE_MIN_STRLEN ? cachedHashString(o) : hashString(o);
	    }
	    if (typeof o.hashCode === 'function') {
	      return o.hashCode();
	    }
	    return hashJSObj(o);
	  }

	  function cachedHashString(string) {
	    var hash = stringHashCache[string];
	    if (hash === undefined) {
	      hash = hashString(string);
	      if (STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE) {
	        STRING_HASH_CACHE_SIZE = 0;
	        stringHashCache = {};
	      }
	      STRING_HASH_CACHE_SIZE++;
	      stringHashCache[string] = hash;
	    }
	    return hash;
	  }

	  // http://jsperf.com/hashing-strings
	  function hashString(string) {
	    // This is the hash from JVM
	    // The hash code for a string is computed as
	    // s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
	    // where s[i] is the ith character of the string and n is the length of
	    // the string. We "mod" the result to make it between 0 (inclusive) and 2^31
	    // (exclusive) by dropping high bits.
	    var hash = 0;
	    for (var ii = 0; ii < string.length; ii++) {
	      hash = 31 * hash + string.charCodeAt(ii) | 0;
	    }
	    return smi(hash);
	  }

	  function hashJSObj(obj) {
	    var hash;
	    if (usingWeakMap) {
	      hash = weakMap.get(obj);
	      if (hash !== undefined) {
	        return hash;
	      }
	    }

	    hash = obj[UID_HASH_KEY];
	    if (hash !== undefined) {
	      return hash;
	    }

	    if (!canDefineProperty) {
	      hash = obj.propertyIsEnumerable && obj.propertyIsEnumerable[UID_HASH_KEY];
	      if (hash !== undefined) {
	        return hash;
	      }

	      hash = getIENodeHash(obj);
	      if (hash !== undefined) {
	        return hash;
	      }
	    }

	    hash = ++objHashUID;
	    if (objHashUID & 0x40000000) {
	      objHashUID = 0;
	    }

	    if (usingWeakMap) {
	      weakMap.set(obj, hash);
	    } else if (isExtensible !== undefined && isExtensible(obj) === false) {
	      throw new Error('Non-extensible objects are not allowed as keys.');
	    } else if (canDefineProperty) {
	      Object.defineProperty(obj, UID_HASH_KEY, {
	        'enumerable': false,
	        'configurable': false,
	        'writable': false,
	        'value': hash
	      });
	    } else if (obj.propertyIsEnumerable !== undefined &&
	               obj.propertyIsEnumerable === obj.constructor.prototype.propertyIsEnumerable) {
	      // Since we can't define a non-enumerable property on the object
	      // we'll hijack one of the less-used non-enumerable properties to
	      // save our hash on it. Since this is a function it will not show up in
	      // `JSON.stringify` which is what we want.
	      obj.propertyIsEnumerable = function() {
	        return this.constructor.prototype.propertyIsEnumerable.apply(this, arguments);
	      };
	      obj.propertyIsEnumerable[UID_HASH_KEY] = hash;
	    } else if (obj.nodeType !== undefined) {
	      // At this point we couldn't get the IE `uniqueID` to use as a hash
	      // and we couldn't use a non-enumerable property to exploit the
	      // dontEnum bug so we simply add the `UID_HASH_KEY` on the node
	      // itself.
	      obj[UID_HASH_KEY] = hash;
	    } else {
	      throw new Error('Unable to set a non-enumerable property on object.');
	    }

	    return hash;
	  }

	  // Get references to ES5 object methods.
	  var isExtensible = Object.isExtensible;

	  // True if Object.defineProperty works as expected. IE8 fails this test.
	  var canDefineProperty = (function() {
	    try {
	      Object.defineProperty({}, '@', {});
	      return true;
	    } catch (e) {
	      return false;
	    }
	  }());

	  // IE has a `uniqueID` property on DOM nodes. We can construct the hash from it
	  // and avoid memory leaks from the IE cloneNode bug.
	  function getIENodeHash(node) {
	    if (node && node.nodeType > 0) {
	      switch (node.nodeType) {
	        case 1: // Element
	          return node.uniqueID;
	        case 9: // Document
	          return node.documentElement && node.documentElement.uniqueID;
	      }
	    }
	  }

	  // If possible, use a WeakMap.
	  var usingWeakMap = typeof WeakMap === 'function';
	  var weakMap;
	  if (usingWeakMap) {
	    weakMap = new WeakMap();
	  }

	  var objHashUID = 0;

	  var UID_HASH_KEY = '__immutablehash__';
	  if (typeof Symbol === 'function') {
	    UID_HASH_KEY = Symbol(UID_HASH_KEY);
	  }

	  var STRING_HASH_CACHE_MIN_STRLEN = 16;
	  var STRING_HASH_CACHE_MAX_SIZE = 255;
	  var STRING_HASH_CACHE_SIZE = 0;
	  var stringHashCache = {};

	  function invariant(condition, error) {
	    if (!condition) throw new Error(error);
	  }

	  function assertNotInfinite(size) {
	    invariant(
	      size !== Infinity,
	      'Cannot perform this action with an infinite size.'
	    );
	  }

	  createClass(ToKeyedSequence, KeyedSeq);
	    function ToKeyedSequence(indexed, useKeys) {
	      this._iter = indexed;
	      this._useKeys = useKeys;
	      this.size = indexed.size;
	    }

	    ToKeyedSequence.prototype.get = function(key, notSetValue) {
	      return this._iter.get(key, notSetValue);
	    };

	    ToKeyedSequence.prototype.has = function(key) {
	      return this._iter.has(key);
	    };

	    ToKeyedSequence.prototype.valueSeq = function() {
	      return this._iter.valueSeq();
	    };

	    ToKeyedSequence.prototype.reverse = function() {var this$0 = this;
	      var reversedSequence = reverseFactory(this, true);
	      if (!this._useKeys) {
	        reversedSequence.valueSeq = function()  {return this$0._iter.toSeq().reverse()};
	      }
	      return reversedSequence;
	    };

	    ToKeyedSequence.prototype.map = function(mapper, context) {var this$0 = this;
	      var mappedSequence = mapFactory(this, mapper, context);
	      if (!this._useKeys) {
	        mappedSequence.valueSeq = function()  {return this$0._iter.toSeq().map(mapper, context)};
	      }
	      return mappedSequence;
	    };

	    ToKeyedSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      var ii;
	      return this._iter.__iterate(
	        this._useKeys ?
	          function(v, k)  {return fn(v, k, this$0)} :
	          ((ii = reverse ? resolveSize(this) : 0),
	            function(v ) {return fn(v, reverse ? --ii : ii++, this$0)}),
	        reverse
	      );
	    };

	    ToKeyedSequence.prototype.__iterator = function(type, reverse) {
	      if (this._useKeys) {
	        return this._iter.__iterator(type, reverse);
	      }
	      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
	      var ii = reverse ? resolveSize(this) : 0;
	      return new src_Iterator__Iterator(function()  {
	        var step = iterator.next();
	        return step.done ? step :
	          iteratorValue(type, reverse ? --ii : ii++, step.value, step);
	      });
	    };

	  ToKeyedSequence.prototype[IS_ORDERED_SENTINEL] = true;


	  createClass(ToIndexedSequence, IndexedSeq);
	    function ToIndexedSequence(iter) {
	      this._iter = iter;
	      this.size = iter.size;
	    }

	    ToIndexedSequence.prototype.includes = function(value) {
	      return this._iter.includes(value);
	    };

	    ToIndexedSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      var iterations = 0;
	      return this._iter.__iterate(function(v ) {return fn(v, iterations++, this$0)}, reverse);
	    };

	    ToIndexedSequence.prototype.__iterator = function(type, reverse) {
	      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
	      var iterations = 0;
	      return new src_Iterator__Iterator(function()  {
	        var step = iterator.next();
	        return step.done ? step :
	          iteratorValue(type, iterations++, step.value, step)
	      });
	    };



	  createClass(ToSetSequence, SetSeq);
	    function ToSetSequence(iter) {
	      this._iter = iter;
	      this.size = iter.size;
	    }

	    ToSetSequence.prototype.has = function(key) {
	      return this._iter.includes(key);
	    };

	    ToSetSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      return this._iter.__iterate(function(v ) {return fn(v, v, this$0)}, reverse);
	    };

	    ToSetSequence.prototype.__iterator = function(type, reverse) {
	      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
	      return new src_Iterator__Iterator(function()  {
	        var step = iterator.next();
	        return step.done ? step :
	          iteratorValue(type, step.value, step.value, step);
	      });
	    };



	  createClass(FromEntriesSequence, KeyedSeq);
	    function FromEntriesSequence(entries) {
	      this._iter = entries;
	      this.size = entries.size;
	    }

	    FromEntriesSequence.prototype.entrySeq = function() {
	      return this._iter.toSeq();
	    };

	    FromEntriesSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      return this._iter.__iterate(function(entry ) {
	        // Check if entry exists first so array access doesn't throw for holes
	        // in the parent iteration.
	        if (entry) {
	          validateEntry(entry);
	          var indexedIterable = isIterable(entry);
	          return fn(
	            indexedIterable ? entry.get(1) : entry[1],
	            indexedIterable ? entry.get(0) : entry[0],
	            this$0
	          );
	        }
	      }, reverse);
	    };

	    FromEntriesSequence.prototype.__iterator = function(type, reverse) {
	      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
	      return new src_Iterator__Iterator(function()  {
	        while (true) {
	          var step = iterator.next();
	          if (step.done) {
	            return step;
	          }
	          var entry = step.value;
	          // Check if entry exists first so array access doesn't throw for holes
	          // in the parent iteration.
	          if (entry) {
	            validateEntry(entry);
	            var indexedIterable = isIterable(entry);
	            return iteratorValue(
	              type,
	              indexedIterable ? entry.get(0) : entry[0],
	              indexedIterable ? entry.get(1) : entry[1],
	              step
	            );
	          }
	        }
	      });
	    };


	  ToIndexedSequence.prototype.cacheResult =
	  ToKeyedSequence.prototype.cacheResult =
	  ToSetSequence.prototype.cacheResult =
	  FromEntriesSequence.prototype.cacheResult =
	    cacheResultThrough;


	  function flipFactory(iterable) {
	    var flipSequence = makeSequence(iterable);
	    flipSequence._iter = iterable;
	    flipSequence.size = iterable.size;
	    flipSequence.flip = function()  {return iterable};
	    flipSequence.reverse = function () {
	      var reversedSequence = iterable.reverse.apply(this); // super.reverse()
	      reversedSequence.flip = function()  {return iterable.reverse()};
	      return reversedSequence;
	    };
	    flipSequence.has = function(key ) {return iterable.includes(key)};
	    flipSequence.includes = function(key ) {return iterable.has(key)};
	    flipSequence.cacheResult = cacheResultThrough;
	    flipSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
	      return iterable.__iterate(function(v, k)  {return fn(k, v, this$0) !== false}, reverse);
	    }
	    flipSequence.__iteratorUncached = function(type, reverse) {
	      if (type === ITERATE_ENTRIES) {
	        var iterator = iterable.__iterator(type, reverse);
	        return new src_Iterator__Iterator(function()  {
	          var step = iterator.next();
	          if (!step.done) {
	            var k = step.value[0];
	            step.value[0] = step.value[1];
	            step.value[1] = k;
	          }
	          return step;
	        });
	      }
	      return iterable.__iterator(
	        type === ITERATE_VALUES ? ITERATE_KEYS : ITERATE_VALUES,
	        reverse
	      );
	    }
	    return flipSequence;
	  }


	  function mapFactory(iterable, mapper, context) {
	    var mappedSequence = makeSequence(iterable);
	    mappedSequence.size = iterable.size;
	    mappedSequence.has = function(key ) {return iterable.has(key)};
	    mappedSequence.get = function(key, notSetValue)  {
	      var v = iterable.get(key, NOT_SET);
	      return v === NOT_SET ?
	        notSetValue :
	        mapper.call(context, v, key, iterable);
	    };
	    mappedSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
	      return iterable.__iterate(
	        function(v, k, c)  {return fn(mapper.call(context, v, k, c), k, this$0) !== false},
	        reverse
	      );
	    }
	    mappedSequence.__iteratorUncached = function (type, reverse) {
	      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
	      return new src_Iterator__Iterator(function()  {
	        var step = iterator.next();
	        if (step.done) {
	          return step;
	        }
	        var entry = step.value;
	        var key = entry[0];
	        return iteratorValue(
	          type,
	          key,
	          mapper.call(context, entry[1], key, iterable),
	          step
	        );
	      });
	    }
	    return mappedSequence;
	  }


	  function reverseFactory(iterable, useKeys) {
	    var reversedSequence = makeSequence(iterable);
	    reversedSequence._iter = iterable;
	    reversedSequence.size = iterable.size;
	    reversedSequence.reverse = function()  {return iterable};
	    if (iterable.flip) {
	      reversedSequence.flip = function () {
	        var flipSequence = flipFactory(iterable);
	        flipSequence.reverse = function()  {return iterable.flip()};
	        return flipSequence;
	      };
	    }
	    reversedSequence.get = function(key, notSetValue) 
	      {return iterable.get(useKeys ? key : -1 - key, notSetValue)};
	    reversedSequence.has = function(key )
	      {return iterable.has(useKeys ? key : -1 - key)};
	    reversedSequence.includes = function(value ) {return iterable.includes(value)};
	    reversedSequence.cacheResult = cacheResultThrough;
	    reversedSequence.__iterate = function (fn, reverse) {var this$0 = this;
	      return iterable.__iterate(function(v, k)  {return fn(v, k, this$0)}, !reverse);
	    };
	    reversedSequence.__iterator =
	      function(type, reverse)  {return iterable.__iterator(type, !reverse)};
	    return reversedSequence;
	  }


	  function filterFactory(iterable, predicate, context, useKeys) {
	    var filterSequence = makeSequence(iterable);
	    if (useKeys) {
	      filterSequence.has = function(key ) {
	        var v = iterable.get(key, NOT_SET);
	        return v !== NOT_SET && !!predicate.call(context, v, key, iterable);
	      };
	      filterSequence.get = function(key, notSetValue)  {
	        var v = iterable.get(key, NOT_SET);
	        return v !== NOT_SET && predicate.call(context, v, key, iterable) ?
	          v : notSetValue;
	      };
	    }
	    filterSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
	      var iterations = 0;
	      iterable.__iterate(function(v, k, c)  {
	        if (predicate.call(context, v, k, c)) {
	          iterations++;
	          return fn(v, useKeys ? k : iterations - 1, this$0);
	        }
	      }, reverse);
	      return iterations;
	    };
	    filterSequence.__iteratorUncached = function (type, reverse) {
	      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
	      var iterations = 0;
	      return new src_Iterator__Iterator(function()  {
	        while (true) {
	          var step = iterator.next();
	          if (step.done) {
	            return step;
	          }
	          var entry = step.value;
	          var key = entry[0];
	          var value = entry[1];
	          if (predicate.call(context, value, key, iterable)) {
	            return iteratorValue(type, useKeys ? key : iterations++, value, step);
	          }
	        }
	      });
	    }
	    return filterSequence;
	  }


	  function countByFactory(iterable, grouper, context) {
	    var groups = src_Map__Map().asMutable();
	    iterable.__iterate(function(v, k)  {
	      groups.update(
	        grouper.call(context, v, k, iterable),
	        0,
	        function(a ) {return a + 1}
	      );
	    });
	    return groups.asImmutable();
	  }


	  function groupByFactory(iterable, grouper, context) {
	    var isKeyedIter = isKeyed(iterable);
	    var groups = (isOrdered(iterable) ? OrderedMap() : src_Map__Map()).asMutable();
	    iterable.__iterate(function(v, k)  {
	      groups.update(
	        grouper.call(context, v, k, iterable),
	        function(a ) {return (a = a || [], a.push(isKeyedIter ? [k, v] : v), a)}
	      );
	    });
	    var coerce = iterableClass(iterable);
	    return groups.map(function(arr ) {return reify(iterable, coerce(arr))});
	  }


	  function sliceFactory(iterable, begin, end, useKeys) {
	    var originalSize = iterable.size;

	    if (wholeSlice(begin, end, originalSize)) {
	      return iterable;
	    }

	    var resolvedBegin = resolveBegin(begin, originalSize);
	    var resolvedEnd = resolveEnd(end, originalSize);

	    // begin or end will be NaN if they were provided as negative numbers and
	    // this iterable's size is unknown. In that case, cache first so there is
	    // a known size and these do not resolve to NaN.
	    if (resolvedBegin !== resolvedBegin || resolvedEnd !== resolvedEnd) {
	      return sliceFactory(iterable.toSeq().cacheResult(), begin, end, useKeys);
	    }

	    // Note: resolvedEnd is undefined when the original sequence's length is
	    // unknown and this slice did not supply an end and should contain all
	    // elements after resolvedBegin.
	    // In that case, resolvedSize will be NaN and sliceSize will remain undefined.
	    var resolvedSize = resolvedEnd - resolvedBegin;
	    var sliceSize;
	    if (resolvedSize === resolvedSize) {
	      sliceSize = resolvedSize < 0 ? 0 : resolvedSize;
	    }

	    var sliceSeq = makeSequence(iterable);

	    sliceSeq.size = sliceSize;

	    if (!useKeys && isSeq(iterable) && sliceSize >= 0) {
	      sliceSeq.get = function (index, notSetValue) {
	        index = wrapIndex(this, index);
	        return index >= 0 && index < sliceSize ?
	          iterable.get(index + resolvedBegin, notSetValue) :
	          notSetValue;
	      }
	    }

	    sliceSeq.__iterateUncached = function(fn, reverse) {var this$0 = this;
	      if (sliceSize === 0) {
	        return 0;
	      }
	      if (reverse) {
	        return this.cacheResult().__iterate(fn, reverse);
	      }
	      var skipped = 0;
	      var isSkipping = true;
	      var iterations = 0;
	      iterable.__iterate(function(v, k)  {
	        if (!(isSkipping && (isSkipping = skipped++ < resolvedBegin))) {
	          iterations++;
	          return fn(v, useKeys ? k : iterations - 1, this$0) !== false &&
	                 iterations !== sliceSize;
	        }
	      });
	      return iterations;
	    };

	    sliceSeq.__iteratorUncached = function(type, reverse) {
	      if (sliceSize !== 0 && reverse) {
	        return this.cacheResult().__iterator(type, reverse);
	      }
	      // Don't bother instantiating parent iterator if taking 0.
	      var iterator = sliceSize !== 0 && iterable.__iterator(type, reverse);
	      var skipped = 0;
	      var iterations = 0;
	      return new src_Iterator__Iterator(function()  {
	        while (skipped++ < resolvedBegin) {
	          iterator.next();
	        }
	        if (++iterations > sliceSize) {
	          return iteratorDone();
	        }
	        var step = iterator.next();
	        if (useKeys || type === ITERATE_VALUES) {
	          return step;
	        } else if (type === ITERATE_KEYS) {
	          return iteratorValue(type, iterations - 1, undefined, step);
	        } else {
	          return iteratorValue(type, iterations - 1, step.value[1], step);
	        }
	      });
	    }

	    return sliceSeq;
	  }


	  function takeWhileFactory(iterable, predicate, context) {
	    var takeSequence = makeSequence(iterable);
	    takeSequence.__iterateUncached = function(fn, reverse) {var this$0 = this;
	      if (reverse) {
	        return this.cacheResult().__iterate(fn, reverse);
	      }
	      var iterations = 0;
	      iterable.__iterate(function(v, k, c) 
	        {return predicate.call(context, v, k, c) && ++iterations && fn(v, k, this$0)}
	      );
	      return iterations;
	    };
	    takeSequence.__iteratorUncached = function(type, reverse) {var this$0 = this;
	      if (reverse) {
	        return this.cacheResult().__iterator(type, reverse);
	      }
	      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
	      var iterating = true;
	      return new src_Iterator__Iterator(function()  {
	        if (!iterating) {
	          return iteratorDone();
	        }
	        var step = iterator.next();
	        if (step.done) {
	          return step;
	        }
	        var entry = step.value;
	        var k = entry[0];
	        var v = entry[1];
	        if (!predicate.call(context, v, k, this$0)) {
	          iterating = false;
	          return iteratorDone();
	        }
	        return type === ITERATE_ENTRIES ? step :
	          iteratorValue(type, k, v, step);
	      });
	    };
	    return takeSequence;
	  }


	  function skipWhileFactory(iterable, predicate, context, useKeys) {
	    var skipSequence = makeSequence(iterable);
	    skipSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
	      if (reverse) {
	        return this.cacheResult().__iterate(fn, reverse);
	      }
	      var isSkipping = true;
	      var iterations = 0;
	      iterable.__iterate(function(v, k, c)  {
	        if (!(isSkipping && (isSkipping = predicate.call(context, v, k, c)))) {
	          iterations++;
	          return fn(v, useKeys ? k : iterations - 1, this$0);
	        }
	      });
	      return iterations;
	    };
	    skipSequence.__iteratorUncached = function(type, reverse) {var this$0 = this;
	      if (reverse) {
	        return this.cacheResult().__iterator(type, reverse);
	      }
	      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
	      var skipping = true;
	      var iterations = 0;
	      return new src_Iterator__Iterator(function()  {
	        var step, k, v;
	        do {
	          step = iterator.next();
	          if (step.done) {
	            if (useKeys || type === ITERATE_VALUES) {
	              return step;
	            } else if (type === ITERATE_KEYS) {
	              return iteratorValue(type, iterations++, undefined, step);
	            } else {
	              return iteratorValue(type, iterations++, step.value[1], step);
	            }
	          }
	          var entry = step.value;
	          k = entry[0];
	          v = entry[1];
	          skipping && (skipping = predicate.call(context, v, k, this$0));
	        } while (skipping);
	        return type === ITERATE_ENTRIES ? step :
	          iteratorValue(type, k, v, step);
	      });
	    };
	    return skipSequence;
	  }


	  function concatFactory(iterable, values) {
	    var isKeyedIterable = isKeyed(iterable);
	    var iters = [iterable].concat(values).map(function(v ) {
	      if (!isIterable(v)) {
	        v = isKeyedIterable ?
	          keyedSeqFromValue(v) :
	          indexedSeqFromValue(Array.isArray(v) ? v : [v]);
	      } else if (isKeyedIterable) {
	        v = KeyedIterable(v);
	      }
	      return v;
	    }).filter(function(v ) {return v.size !== 0});

	    if (iters.length === 0) {
	      return iterable;
	    }

	    if (iters.length === 1) {
	      var singleton = iters[0];
	      if (singleton === iterable ||
	          isKeyedIterable && isKeyed(singleton) ||
	          isIndexed(iterable) && isIndexed(singleton)) {
	        return singleton;
	      }
	    }

	    var concatSeq = new ArraySeq(iters);
	    if (isKeyedIterable) {
	      concatSeq = concatSeq.toKeyedSeq();
	    } else if (!isIndexed(iterable)) {
	      concatSeq = concatSeq.toSetSeq();
	    }
	    concatSeq = concatSeq.flatten(true);
	    concatSeq.size = iters.reduce(
	      function(sum, seq)  {
	        if (sum !== undefined) {
	          var size = seq.size;
	          if (size !== undefined) {
	            return sum + size;
	          }
	        }
	      },
	      0
	    );
	    return concatSeq;
	  }


	  function flattenFactory(iterable, depth, useKeys) {
	    var flatSequence = makeSequence(iterable);
	    flatSequence.__iterateUncached = function(fn, reverse) {
	      var iterations = 0;
	      var stopped = false;
	      function flatDeep(iter, currentDepth) {var this$0 = this;
	        iter.__iterate(function(v, k)  {
	          if ((!depth || currentDepth < depth) && isIterable(v)) {
	            flatDeep(v, currentDepth + 1);
	          } else if (fn(v, useKeys ? k : iterations++, this$0) === false) {
	            stopped = true;
	          }
	          return !stopped;
	        }, reverse);
	      }
	      flatDeep(iterable, 0);
	      return iterations;
	    }
	    flatSequence.__iteratorUncached = function(type, reverse) {
	      var iterator = iterable.__iterator(type, reverse);
	      var stack = [];
	      var iterations = 0;
	      return new src_Iterator__Iterator(function()  {
	        while (iterator) {
	          var step = iterator.next();
	          if (step.done !== false) {
	            iterator = stack.pop();
	            continue;
	          }
	          var v = step.value;
	          if (type === ITERATE_ENTRIES) {
	            v = v[1];
	          }
	          if ((!depth || stack.length < depth) && isIterable(v)) {
	            stack.push(iterator);
	            iterator = v.__iterator(type, reverse);
	          } else {
	            return useKeys ? step : iteratorValue(type, iterations++, v, step);
	          }
	        }
	        return iteratorDone();
	      });
	    }
	    return flatSequence;
	  }


	  function flatMapFactory(iterable, mapper, context) {
	    var coerce = iterableClass(iterable);
	    return iterable.toSeq().map(
	      function(v, k)  {return coerce(mapper.call(context, v, k, iterable))}
	    ).flatten(true);
	  }


	  function interposeFactory(iterable, separator) {
	    var interposedSequence = makeSequence(iterable);
	    interposedSequence.size = iterable.size && iterable.size * 2 -1;
	    interposedSequence.__iterateUncached = function(fn, reverse) {var this$0 = this;
	      var iterations = 0;
	      iterable.__iterate(function(v, k) 
	        {return (!iterations || fn(separator, iterations++, this$0) !== false) &&
	        fn(v, iterations++, this$0) !== false},
	        reverse
	      );
	      return iterations;
	    };
	    interposedSequence.__iteratorUncached = function(type, reverse) {
	      var iterator = iterable.__iterator(ITERATE_VALUES, reverse);
	      var iterations = 0;
	      var step;
	      return new src_Iterator__Iterator(function()  {
	        if (!step || iterations % 2) {
	          step = iterator.next();
	          if (step.done) {
	            return step;
	          }
	        }
	        return iterations % 2 ?
	          iteratorValue(type, iterations++, separator) :
	          iteratorValue(type, iterations++, step.value, step);
	      });
	    };
	    return interposedSequence;
	  }


	  function sortFactory(iterable, comparator, mapper) {
	    if (!comparator) {
	      comparator = defaultComparator;
	    }
	    var isKeyedIterable = isKeyed(iterable);
	    var index = 0;
	    var entries = iterable.toSeq().map(
	      function(v, k)  {return [k, v, index++, mapper ? mapper(v, k, iterable) : v]}
	    ).toArray();
	    entries.sort(function(a, b)  {return comparator(a[3], b[3]) || a[2] - b[2]}).forEach(
	      isKeyedIterable ?
	      function(v, i)  { entries[i].length = 2; } :
	      function(v, i)  { entries[i] = v[1]; }
	    );
	    return isKeyedIterable ? KeyedSeq(entries) :
	      isIndexed(iterable) ? IndexedSeq(entries) :
	      SetSeq(entries);
	  }


	  function maxFactory(iterable, comparator, mapper) {
	    if (!comparator) {
	      comparator = defaultComparator;
	    }
	    if (mapper) {
	      var entry = iterable.toSeq()
	        .map(function(v, k)  {return [v, mapper(v, k, iterable)]})
	        .reduce(function(a, b)  {return maxCompare(comparator, a[1], b[1]) ? b : a});
	      return entry && entry[0];
	    } else {
	      return iterable.reduce(function(a, b)  {return maxCompare(comparator, a, b) ? b : a});
	    }
	  }

	  function maxCompare(comparator, a, b) {
	    var comp = comparator(b, a);
	    // b is considered the new max if the comparator declares them equal, but
	    // they are not equal and b is in fact a nullish value.
	    return (comp === 0 && b !== a && (b === undefined || b === null || b !== b)) || comp > 0;
	  }


	  function zipWithFactory(keyIter, zipper, iters) {
	    var zipSequence = makeSequence(keyIter);
	    zipSequence.size = new ArraySeq(iters).map(function(i ) {return i.size}).min();
	    // Note: this a generic base implementation of __iterate in terms of
	    // __iterator which may be more generically useful in the future.
	    zipSequence.__iterate = function(fn, reverse) {
	      /* generic:
	      var iterator = this.__iterator(ITERATE_ENTRIES, reverse);
	      var step;
	      var iterations = 0;
	      while (!(step = iterator.next()).done) {
	        iterations++;
	        if (fn(step.value[1], step.value[0], this) === false) {
	          break;
	        }
	      }
	      return iterations;
	      */
	      // indexed:
	      var iterator = this.__iterator(ITERATE_VALUES, reverse);
	      var step;
	      var iterations = 0;
	      while (!(step = iterator.next()).done) {
	        if (fn(step.value, iterations++, this) === false) {
	          break;
	        }
	      }
	      return iterations;
	    };
	    zipSequence.__iteratorUncached = function(type, reverse) {
	      var iterators = iters.map(function(i )
	        {return (i = Iterable(i), getIterator(reverse ? i.reverse() : i))}
	      );
	      var iterations = 0;
	      var isDone = false;
	      return new src_Iterator__Iterator(function()  {
	        var steps;
	        if (!isDone) {
	          steps = iterators.map(function(i ) {return i.next()});
	          isDone = steps.some(function(s ) {return s.done});
	        }
	        if (isDone) {
	          return iteratorDone();
	        }
	        return iteratorValue(
	          type,
	          iterations++,
	          zipper.apply(null, steps.map(function(s ) {return s.value}))
	        );
	      });
	    };
	    return zipSequence
	  }


	  // #pragma Helper Functions

	  function reify(iter, seq) {
	    return isSeq(iter) ? seq : iter.constructor(seq);
	  }

	  function validateEntry(entry) {
	    if (entry !== Object(entry)) {
	      throw new TypeError('Expected [K, V] tuple: ' + entry);
	    }
	  }

	  function resolveSize(iter) {
	    assertNotInfinite(iter.size);
	    return ensureSize(iter);
	  }

	  function iterableClass(iterable) {
	    return isKeyed(iterable) ? KeyedIterable :
	      isIndexed(iterable) ? IndexedIterable :
	      SetIterable;
	  }

	  function makeSequence(iterable) {
	    return Object.create(
	      (
	        isKeyed(iterable) ? KeyedSeq :
	        isIndexed(iterable) ? IndexedSeq :
	        SetSeq
	      ).prototype
	    );
	  }

	  function cacheResultThrough() {
	    if (this._iter.cacheResult) {
	      this._iter.cacheResult();
	      this.size = this._iter.size;
	      return this;
	    } else {
	      return Seq.prototype.cacheResult.call(this);
	    }
	  }

	  function defaultComparator(a, b) {
	    return a > b ? 1 : a < b ? -1 : 0;
	  }

	  function forceIterator(keyPath) {
	    var iter = getIterator(keyPath);
	    if (!iter) {
	      // Array might not be iterable in this environment, so we need a fallback
	      // to our wrapped type.
	      if (!isArrayLike(keyPath)) {
	        throw new TypeError('Expected iterable or array-like: ' + keyPath);
	      }
	      iter = getIterator(Iterable(keyPath));
	    }
	    return iter;
	  }

	  createClass(src_Map__Map, KeyedCollection);

	    // @pragma Construction

	    function src_Map__Map(value) {
	      return value === null || value === undefined ? emptyMap() :
	        isMap(value) ? value :
	        emptyMap().withMutations(function(map ) {
	          var iter = KeyedIterable(value);
	          assertNotInfinite(iter.size);
	          iter.forEach(function(v, k)  {return map.set(k, v)});
	        });
	    }

	    src_Map__Map.prototype.toString = function() {
	      return this.__toString('Map {', '}');
	    };

	    // @pragma Access

	    src_Map__Map.prototype.get = function(k, notSetValue) {
	      return this._root ?
	        this._root.get(0, undefined, k, notSetValue) :
	        notSetValue;
	    };

	    // @pragma Modification

	    src_Map__Map.prototype.set = function(k, v) {
	      return updateMap(this, k, v);
	    };

	    src_Map__Map.prototype.setIn = function(keyPath, v) {
	      return this.updateIn(keyPath, NOT_SET, function()  {return v});
	    };

	    src_Map__Map.prototype.remove = function(k) {
	      return updateMap(this, k, NOT_SET);
	    };

	    src_Map__Map.prototype.deleteIn = function(keyPath) {
	      return this.updateIn(keyPath, function()  {return NOT_SET});
	    };

	    src_Map__Map.prototype.update = function(k, notSetValue, updater) {
	      return arguments.length === 1 ?
	        k(this) :
	        this.updateIn([k], notSetValue, updater);
	    };

	    src_Map__Map.prototype.updateIn = function(keyPath, notSetValue, updater) {
	      if (!updater) {
	        updater = notSetValue;
	        notSetValue = undefined;
	      }
	      var updatedValue = updateInDeepMap(
	        this,
	        forceIterator(keyPath),
	        notSetValue,
	        updater
	      );
	      return updatedValue === NOT_SET ? undefined : updatedValue;
	    };

	    src_Map__Map.prototype.clear = function() {
	      if (this.size === 0) {
	        return this;
	      }
	      if (this.__ownerID) {
	        this.size = 0;
	        this._root = null;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return emptyMap();
	    };

	    // @pragma Composition

	    src_Map__Map.prototype.merge = function(/*...iters*/) {
	      return mergeIntoMapWith(this, undefined, arguments);
	    };

	    src_Map__Map.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
	      return mergeIntoMapWith(this, merger, iters);
	    };

	    src_Map__Map.prototype.mergeIn = function(keyPath) {var iters = SLICE$0.call(arguments, 1);
	      return this.updateIn(
	        keyPath,
	        emptyMap(),
	        function(m ) {return typeof m.merge === 'function' ?
	          m.merge.apply(m, iters) :
	          iters[iters.length - 1]}
	      );
	    };

	    src_Map__Map.prototype.mergeDeep = function(/*...iters*/) {
	      return mergeIntoMapWith(this, deepMerger(undefined), arguments);
	    };

	    src_Map__Map.prototype.mergeDeepWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
	      return mergeIntoMapWith(this, deepMerger(merger), iters);
	    };

	    src_Map__Map.prototype.mergeDeepIn = function(keyPath) {var iters = SLICE$0.call(arguments, 1);
	      return this.updateIn(
	        keyPath,
	        emptyMap(),
	        function(m ) {return typeof m.mergeDeep === 'function' ?
	          m.mergeDeep.apply(m, iters) :
	          iters[iters.length - 1]}
	      );
	    };

	    src_Map__Map.prototype.sort = function(comparator) {
	      // Late binding
	      return OrderedMap(sortFactory(this, comparator));
	    };

	    src_Map__Map.prototype.sortBy = function(mapper, comparator) {
	      // Late binding
	      return OrderedMap(sortFactory(this, comparator, mapper));
	    };

	    // @pragma Mutability

	    src_Map__Map.prototype.withMutations = function(fn) {
	      var mutable = this.asMutable();
	      fn(mutable);
	      return mutable.wasAltered() ? mutable.__ensureOwner(this.__ownerID) : this;
	    };

	    src_Map__Map.prototype.asMutable = function() {
	      return this.__ownerID ? this : this.__ensureOwner(new OwnerID());
	    };

	    src_Map__Map.prototype.asImmutable = function() {
	      return this.__ensureOwner();
	    };

	    src_Map__Map.prototype.wasAltered = function() {
	      return this.__altered;
	    };

	    src_Map__Map.prototype.__iterator = function(type, reverse) {
	      return new MapIterator(this, type, reverse);
	    };

	    src_Map__Map.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      var iterations = 0;
	      this._root && this._root.iterate(function(entry ) {
	        iterations++;
	        return fn(entry[1], entry[0], this$0);
	      }, reverse);
	      return iterations;
	    };

	    src_Map__Map.prototype.__ensureOwner = function(ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      if (!ownerID) {
	        this.__ownerID = ownerID;
	        this.__altered = false;
	        return this;
	      }
	      return makeMap(this.size, this._root, ownerID, this.__hash);
	    };


	  function isMap(maybeMap) {
	    return !!(maybeMap && maybeMap[IS_MAP_SENTINEL]);
	  }

	  src_Map__Map.isMap = isMap;

	  var IS_MAP_SENTINEL = '@@__IMMUTABLE_MAP__@@';

	  var MapPrototype = src_Map__Map.prototype;
	  MapPrototype[IS_MAP_SENTINEL] = true;
	  MapPrototype[DELETE] = MapPrototype.remove;
	  MapPrototype.removeIn = MapPrototype.deleteIn;


	  // #pragma Trie Nodes



	    function ArrayMapNode(ownerID, entries) {
	      this.ownerID = ownerID;
	      this.entries = entries;
	    }

	    ArrayMapNode.prototype.get = function(shift, keyHash, key, notSetValue) {
	      var entries = this.entries;
	      for (var ii = 0, len = entries.length; ii < len; ii++) {
	        if (is(key, entries[ii][0])) {
	          return entries[ii][1];
	        }
	      }
	      return notSetValue;
	    };

	    ArrayMapNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	      var removed = value === NOT_SET;

	      var entries = this.entries;
	      var idx = 0;
	      for (var len = entries.length; idx < len; idx++) {
	        if (is(key, entries[idx][0])) {
	          break;
	        }
	      }
	      var exists = idx < len;

	      if (exists ? entries[idx][1] === value : removed) {
	        return this;
	      }

	      SetRef(didAlter);
	      (removed || !exists) && SetRef(didChangeSize);

	      if (removed && entries.length === 1) {
	        return; // undefined
	      }

	      if (!exists && !removed && entries.length >= MAX_ARRAY_MAP_SIZE) {
	        return createNodes(ownerID, entries, key, value);
	      }

	      var isEditable = ownerID && ownerID === this.ownerID;
	      var newEntries = isEditable ? entries : arrCopy(entries);

	      if (exists) {
	        if (removed) {
	          idx === len - 1 ? newEntries.pop() : (newEntries[idx] = newEntries.pop());
	        } else {
	          newEntries[idx] = [key, value];
	        }
	      } else {
	        newEntries.push([key, value]);
	      }

	      if (isEditable) {
	        this.entries = newEntries;
	        return this;
	      }

	      return new ArrayMapNode(ownerID, newEntries);
	    };




	    function BitmapIndexedNode(ownerID, bitmap, nodes) {
	      this.ownerID = ownerID;
	      this.bitmap = bitmap;
	      this.nodes = nodes;
	    }

	    BitmapIndexedNode.prototype.get = function(shift, keyHash, key, notSetValue) {
	      if (keyHash === undefined) {
	        keyHash = hash(key);
	      }
	      var bit = (1 << ((shift === 0 ? keyHash : keyHash >>> shift) & MASK));
	      var bitmap = this.bitmap;
	      return (bitmap & bit) === 0 ? notSetValue :
	        this.nodes[popCount(bitmap & (bit - 1))].get(shift + SHIFT, keyHash, key, notSetValue);
	    };

	    BitmapIndexedNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	      if (keyHash === undefined) {
	        keyHash = hash(key);
	      }
	      var keyHashFrag = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
	      var bit = 1 << keyHashFrag;
	      var bitmap = this.bitmap;
	      var exists = (bitmap & bit) !== 0;

	      if (!exists && value === NOT_SET) {
	        return this;
	      }

	      var idx = popCount(bitmap & (bit - 1));
	      var nodes = this.nodes;
	      var node = exists ? nodes[idx] : undefined;
	      var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);

	      if (newNode === node) {
	        return this;
	      }

	      if (!exists && newNode && nodes.length >= MAX_BITMAP_INDEXED_SIZE) {
	        return expandNodes(ownerID, nodes, bitmap, keyHashFrag, newNode);
	      }

	      if (exists && !newNode && nodes.length === 2 && isLeafNode(nodes[idx ^ 1])) {
	        return nodes[idx ^ 1];
	      }

	      if (exists && newNode && nodes.length === 1 && isLeafNode(newNode)) {
	        return newNode;
	      }

	      var isEditable = ownerID && ownerID === this.ownerID;
	      var newBitmap = exists ? newNode ? bitmap : bitmap ^ bit : bitmap | bit;
	      var newNodes = exists ? newNode ?
	        setIn(nodes, idx, newNode, isEditable) :
	        spliceOut(nodes, idx, isEditable) :
	        spliceIn(nodes, idx, newNode, isEditable);

	      if (isEditable) {
	        this.bitmap = newBitmap;
	        this.nodes = newNodes;
	        return this;
	      }

	      return new BitmapIndexedNode(ownerID, newBitmap, newNodes);
	    };




	    function HashArrayMapNode(ownerID, count, nodes) {
	      this.ownerID = ownerID;
	      this.count = count;
	      this.nodes = nodes;
	    }

	    HashArrayMapNode.prototype.get = function(shift, keyHash, key, notSetValue) {
	      if (keyHash === undefined) {
	        keyHash = hash(key);
	      }
	      var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
	      var node = this.nodes[idx];
	      return node ? node.get(shift + SHIFT, keyHash, key, notSetValue) : notSetValue;
	    };

	    HashArrayMapNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	      if (keyHash === undefined) {
	        keyHash = hash(key);
	      }
	      var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
	      var removed = value === NOT_SET;
	      var nodes = this.nodes;
	      var node = nodes[idx];

	      if (removed && !node) {
	        return this;
	      }

	      var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);
	      if (newNode === node) {
	        return this;
	      }

	      var newCount = this.count;
	      if (!node) {
	        newCount++;
	      } else if (!newNode) {
	        newCount--;
	        if (newCount < MIN_HASH_ARRAY_MAP_SIZE) {
	          return packNodes(ownerID, nodes, newCount, idx);
	        }
	      }

	      var isEditable = ownerID && ownerID === this.ownerID;
	      var newNodes = setIn(nodes, idx, newNode, isEditable);

	      if (isEditable) {
	        this.count = newCount;
	        this.nodes = newNodes;
	        return this;
	      }

	      return new HashArrayMapNode(ownerID, newCount, newNodes);
	    };




	    function HashCollisionNode(ownerID, keyHash, entries) {
	      this.ownerID = ownerID;
	      this.keyHash = keyHash;
	      this.entries = entries;
	    }

	    HashCollisionNode.prototype.get = function(shift, keyHash, key, notSetValue) {
	      var entries = this.entries;
	      for (var ii = 0, len = entries.length; ii < len; ii++) {
	        if (is(key, entries[ii][0])) {
	          return entries[ii][1];
	        }
	      }
	      return notSetValue;
	    };

	    HashCollisionNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	      if (keyHash === undefined) {
	        keyHash = hash(key);
	      }

	      var removed = value === NOT_SET;

	      if (keyHash !== this.keyHash) {
	        if (removed) {
	          return this;
	        }
	        SetRef(didAlter);
	        SetRef(didChangeSize);
	        return mergeIntoNode(this, ownerID, shift, keyHash, [key, value]);
	      }

	      var entries = this.entries;
	      var idx = 0;
	      for (var len = entries.length; idx < len; idx++) {
	        if (is(key, entries[idx][0])) {
	          break;
	        }
	      }
	      var exists = idx < len;

	      if (exists ? entries[idx][1] === value : removed) {
	        return this;
	      }

	      SetRef(didAlter);
	      (removed || !exists) && SetRef(didChangeSize);

	      if (removed && len === 2) {
	        return new ValueNode(ownerID, this.keyHash, entries[idx ^ 1]);
	      }

	      var isEditable = ownerID && ownerID === this.ownerID;
	      var newEntries = isEditable ? entries : arrCopy(entries);

	      if (exists) {
	        if (removed) {
	          idx === len - 1 ? newEntries.pop() : (newEntries[idx] = newEntries.pop());
	        } else {
	          newEntries[idx] = [key, value];
	        }
	      } else {
	        newEntries.push([key, value]);
	      }

	      if (isEditable) {
	        this.entries = newEntries;
	        return this;
	      }

	      return new HashCollisionNode(ownerID, this.keyHash, newEntries);
	    };




	    function ValueNode(ownerID, keyHash, entry) {
	      this.ownerID = ownerID;
	      this.keyHash = keyHash;
	      this.entry = entry;
	    }

	    ValueNode.prototype.get = function(shift, keyHash, key, notSetValue) {
	      return is(key, this.entry[0]) ? this.entry[1] : notSetValue;
	    };

	    ValueNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	      var removed = value === NOT_SET;
	      var keyMatch = is(key, this.entry[0]);
	      if (keyMatch ? value === this.entry[1] : removed) {
	        return this;
	      }

	      SetRef(didAlter);

	      if (removed) {
	        SetRef(didChangeSize);
	        return; // undefined
	      }

	      if (keyMatch) {
	        if (ownerID && ownerID === this.ownerID) {
	          this.entry[1] = value;
	          return this;
	        }
	        return new ValueNode(ownerID, this.keyHash, [key, value]);
	      }

	      SetRef(didChangeSize);
	      return mergeIntoNode(this, ownerID, shift, hash(key), [key, value]);
	    };



	  // #pragma Iterators

	  ArrayMapNode.prototype.iterate =
	  HashCollisionNode.prototype.iterate = function (fn, reverse) {
	    var entries = this.entries;
	    for (var ii = 0, maxIndex = entries.length - 1; ii <= maxIndex; ii++) {
	      if (fn(entries[reverse ? maxIndex - ii : ii]) === false) {
	        return false;
	      }
	    }
	  }

	  BitmapIndexedNode.prototype.iterate =
	  HashArrayMapNode.prototype.iterate = function (fn, reverse) {
	    var nodes = this.nodes;
	    for (var ii = 0, maxIndex = nodes.length - 1; ii <= maxIndex; ii++) {
	      var node = nodes[reverse ? maxIndex - ii : ii];
	      if (node && node.iterate(fn, reverse) === false) {
	        return false;
	      }
	    }
	  }

	  ValueNode.prototype.iterate = function (fn, reverse) {
	    return fn(this.entry);
	  }

	  createClass(MapIterator, src_Iterator__Iterator);

	    function MapIterator(map, type, reverse) {
	      this._type = type;
	      this._reverse = reverse;
	      this._stack = map._root && mapIteratorFrame(map._root);
	    }

	    MapIterator.prototype.next = function() {
	      var type = this._type;
	      var stack = this._stack;
	      while (stack) {
	        var node = stack.node;
	        var index = stack.index++;
	        var maxIndex;
	        if (node.entry) {
	          if (index === 0) {
	            return mapIteratorValue(type, node.entry);
	          }
	        } else if (node.entries) {
	          maxIndex = node.entries.length - 1;
	          if (index <= maxIndex) {
	            return mapIteratorValue(type, node.entries[this._reverse ? maxIndex - index : index]);
	          }
	        } else {
	          maxIndex = node.nodes.length - 1;
	          if (index <= maxIndex) {
	            var subNode = node.nodes[this._reverse ? maxIndex - index : index];
	            if (subNode) {
	              if (subNode.entry) {
	                return mapIteratorValue(type, subNode.entry);
	              }
	              stack = this._stack = mapIteratorFrame(subNode, stack);
	            }
	            continue;
	          }
	        }
	        stack = this._stack = this._stack.__prev;
	      }
	      return iteratorDone();
	    };


	  function mapIteratorValue(type, entry) {
	    return iteratorValue(type, entry[0], entry[1]);
	  }

	  function mapIteratorFrame(node, prev) {
	    return {
	      node: node,
	      index: 0,
	      __prev: prev
	    };
	  }

	  function makeMap(size, root, ownerID, hash) {
	    var map = Object.create(MapPrototype);
	    map.size = size;
	    map._root = root;
	    map.__ownerID = ownerID;
	    map.__hash = hash;
	    map.__altered = false;
	    return map;
	  }

	  var EMPTY_MAP;
	  function emptyMap() {
	    return EMPTY_MAP || (EMPTY_MAP = makeMap(0));
	  }

	  function updateMap(map, k, v) {
	    var newRoot;
	    var newSize;
	    if (!map._root) {
	      if (v === NOT_SET) {
	        return map;
	      }
	      newSize = 1;
	      newRoot = new ArrayMapNode(map.__ownerID, [[k, v]]);
	    } else {
	      var didChangeSize = MakeRef(CHANGE_LENGTH);
	      var didAlter = MakeRef(DID_ALTER);
	      newRoot = updateNode(map._root, map.__ownerID, 0, undefined, k, v, didChangeSize, didAlter);
	      if (!didAlter.value) {
	        return map;
	      }
	      newSize = map.size + (didChangeSize.value ? v === NOT_SET ? -1 : 1 : 0);
	    }
	    if (map.__ownerID) {
	      map.size = newSize;
	      map._root = newRoot;
	      map.__hash = undefined;
	      map.__altered = true;
	      return map;
	    }
	    return newRoot ? makeMap(newSize, newRoot) : emptyMap();
	  }

	  function updateNode(node, ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	    if (!node) {
	      if (value === NOT_SET) {
	        return node;
	      }
	      SetRef(didAlter);
	      SetRef(didChangeSize);
	      return new ValueNode(ownerID, keyHash, [key, value]);
	    }
	    return node.update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter);
	  }

	  function isLeafNode(node) {
	    return node.constructor === ValueNode || node.constructor === HashCollisionNode;
	  }

	  function mergeIntoNode(node, ownerID, shift, keyHash, entry) {
	    if (node.keyHash === keyHash) {
	      return new HashCollisionNode(ownerID, keyHash, [node.entry, entry]);
	    }

	    var idx1 = (shift === 0 ? node.keyHash : node.keyHash >>> shift) & MASK;
	    var idx2 = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;

	    var newNode;
	    var nodes = idx1 === idx2 ?
	      [mergeIntoNode(node, ownerID, shift + SHIFT, keyHash, entry)] :
	      ((newNode = new ValueNode(ownerID, keyHash, entry)), idx1 < idx2 ? [node, newNode] : [newNode, node]);

	    return new BitmapIndexedNode(ownerID, (1 << idx1) | (1 << idx2), nodes);
	  }

	  function createNodes(ownerID, entries, key, value) {
	    if (!ownerID) {
	      ownerID = new OwnerID();
	    }
	    var node = new ValueNode(ownerID, hash(key), [key, value]);
	    for (var ii = 0; ii < entries.length; ii++) {
	      var entry = entries[ii];
	      node = node.update(ownerID, 0, undefined, entry[0], entry[1]);
	    }
	    return node;
	  }

	  function packNodes(ownerID, nodes, count, excluding) {
	    var bitmap = 0;
	    var packedII = 0;
	    var packedNodes = new Array(count);
	    for (var ii = 0, bit = 1, len = nodes.length; ii < len; ii++, bit <<= 1) {
	      var node = nodes[ii];
	      if (node !== undefined && ii !== excluding) {
	        bitmap |= bit;
	        packedNodes[packedII++] = node;
	      }
	    }
	    return new BitmapIndexedNode(ownerID, bitmap, packedNodes);
	  }

	  function expandNodes(ownerID, nodes, bitmap, including, node) {
	    var count = 0;
	    var expandedNodes = new Array(SIZE);
	    for (var ii = 0; bitmap !== 0; ii++, bitmap >>>= 1) {
	      expandedNodes[ii] = bitmap & 1 ? nodes[count++] : undefined;
	    }
	    expandedNodes[including] = node;
	    return new HashArrayMapNode(ownerID, count + 1, expandedNodes);
	  }

	  function mergeIntoMapWith(map, merger, iterables) {
	    var iters = [];
	    for (var ii = 0; ii < iterables.length; ii++) {
	      var value = iterables[ii];
	      var iter = KeyedIterable(value);
	      if (!isIterable(value)) {
	        iter = iter.map(function(v ) {return fromJS(v)});
	      }
	      iters.push(iter);
	    }
	    return mergeIntoCollectionWith(map, merger, iters);
	  }

	  function deepMerger(merger) {
	    return function(existing, value, key) 
	      {return existing && existing.mergeDeepWith && isIterable(value) ?
	        existing.mergeDeepWith(merger, value) :
	        merger ? merger(existing, value, key) : value};
	  }

	  function mergeIntoCollectionWith(collection, merger, iters) {
	    iters = iters.filter(function(x ) {return x.size !== 0});
	    if (iters.length === 0) {
	      return collection;
	    }
	    if (collection.size === 0 && !collection.__ownerID && iters.length === 1) {
	      return collection.constructor(iters[0]);
	    }
	    return collection.withMutations(function(collection ) {
	      var mergeIntoMap = merger ?
	        function(value, key)  {
	          collection.update(key, NOT_SET, function(existing )
	            {return existing === NOT_SET ? value : merger(existing, value, key)}
	          );
	        } :
	        function(value, key)  {
	          collection.set(key, value);
	        }
	      for (var ii = 0; ii < iters.length; ii++) {
	        iters[ii].forEach(mergeIntoMap);
	      }
	    });
	  }

	  function updateInDeepMap(existing, keyPathIter, notSetValue, updater) {
	    var isNotSet = existing === NOT_SET;
	    var step = keyPathIter.next();
	    if (step.done) {
	      var existingValue = isNotSet ? notSetValue : existing;
	      var newValue = updater(existingValue);
	      return newValue === existingValue ? existing : newValue;
	    }
	    invariant(
	      isNotSet || (existing && existing.set),
	      'invalid keyPath'
	    );
	    var key = step.value;
	    var nextExisting = isNotSet ? NOT_SET : existing.get(key, NOT_SET);
	    var nextUpdated = updateInDeepMap(
	      nextExisting,
	      keyPathIter,
	      notSetValue,
	      updater
	    );
	    return nextUpdated === nextExisting ? existing :
	      nextUpdated === NOT_SET ? existing.remove(key) :
	      (isNotSet ? emptyMap() : existing).set(key, nextUpdated);
	  }

	  function popCount(x) {
	    x = x - ((x >> 1) & 0x55555555);
	    x = (x & 0x33333333) + ((x >> 2) & 0x33333333);
	    x = (x + (x >> 4)) & 0x0f0f0f0f;
	    x = x + (x >> 8);
	    x = x + (x >> 16);
	    return x & 0x7f;
	  }

	  function setIn(array, idx, val, canEdit) {
	    var newArray = canEdit ? array : arrCopy(array);
	    newArray[idx] = val;
	    return newArray;
	  }

	  function spliceIn(array, idx, val, canEdit) {
	    var newLen = array.length + 1;
	    if (canEdit && idx + 1 === newLen) {
	      array[idx] = val;
	      return array;
	    }
	    var newArray = new Array(newLen);
	    var after = 0;
	    for (var ii = 0; ii < newLen; ii++) {
	      if (ii === idx) {
	        newArray[ii] = val;
	        after = -1;
	      } else {
	        newArray[ii] = array[ii + after];
	      }
	    }
	    return newArray;
	  }

	  function spliceOut(array, idx, canEdit) {
	    var newLen = array.length - 1;
	    if (canEdit && idx === newLen) {
	      array.pop();
	      return array;
	    }
	    var newArray = new Array(newLen);
	    var after = 0;
	    for (var ii = 0; ii < newLen; ii++) {
	      if (ii === idx) {
	        after = 1;
	      }
	      newArray[ii] = array[ii + after];
	    }
	    return newArray;
	  }

	  var MAX_ARRAY_MAP_SIZE = SIZE / 4;
	  var MAX_BITMAP_INDEXED_SIZE = SIZE / 2;
	  var MIN_HASH_ARRAY_MAP_SIZE = SIZE / 4;

	  createClass(List, IndexedCollection);

	    // @pragma Construction

	    function List(value) {
	      var empty = emptyList();
	      if (value === null || value === undefined) {
	        return empty;
	      }
	      if (isList(value)) {
	        return value;
	      }
	      var iter = IndexedIterable(value);
	      var size = iter.size;
	      if (size === 0) {
	        return empty;
	      }
	      assertNotInfinite(size);
	      if (size > 0 && size < SIZE) {
	        return makeList(0, size, SHIFT, null, new VNode(iter.toArray()));
	      }
	      return empty.withMutations(function(list ) {
	        list.setSize(size);
	        iter.forEach(function(v, i)  {return list.set(i, v)});
	      });
	    }

	    List.of = function(/*...values*/) {
	      return this(arguments);
	    };

	    List.prototype.toString = function() {
	      return this.__toString('List [', ']');
	    };

	    // @pragma Access

	    List.prototype.get = function(index, notSetValue) {
	      index = wrapIndex(this, index);
	      if (index < 0 || index >= this.size) {
	        return notSetValue;
	      }
	      index += this._origin;
	      var node = listNodeFor(this, index);
	      return node && node.array[index & MASK];
	    };

	    // @pragma Modification

	    List.prototype.set = function(index, value) {
	      return updateList(this, index, value);
	    };

	    List.prototype.remove = function(index) {
	      return !this.has(index) ? this :
	        index === 0 ? this.shift() :
	        index === this.size - 1 ? this.pop() :
	        this.splice(index, 1);
	    };

	    List.prototype.clear = function() {
	      if (this.size === 0) {
	        return this;
	      }
	      if (this.__ownerID) {
	        this.size = this._origin = this._capacity = 0;
	        this._level = SHIFT;
	        this._root = this._tail = null;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return emptyList();
	    };

	    List.prototype.push = function(/*...values*/) {
	      var values = arguments;
	      var oldSize = this.size;
	      return this.withMutations(function(list ) {
	        setListBounds(list, 0, oldSize + values.length);
	        for (var ii = 0; ii < values.length; ii++) {
	          list.set(oldSize + ii, values[ii]);
	        }
	      });
	    };

	    List.prototype.pop = function() {
	      return setListBounds(this, 0, -1);
	    };

	    List.prototype.unshift = function(/*...values*/) {
	      var values = arguments;
	      return this.withMutations(function(list ) {
	        setListBounds(list, -values.length);
	        for (var ii = 0; ii < values.length; ii++) {
	          list.set(ii, values[ii]);
	        }
	      });
	    };

	    List.prototype.shift = function() {
	      return setListBounds(this, 1);
	    };

	    // @pragma Composition

	    List.prototype.merge = function(/*...iters*/) {
	      return mergeIntoListWith(this, undefined, arguments);
	    };

	    List.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
	      return mergeIntoListWith(this, merger, iters);
	    };

	    List.prototype.mergeDeep = function(/*...iters*/) {
	      return mergeIntoListWith(this, deepMerger(undefined), arguments);
	    };

	    List.prototype.mergeDeepWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
	      return mergeIntoListWith(this, deepMerger(merger), iters);
	    };

	    List.prototype.setSize = function(size) {
	      return setListBounds(this, 0, size);
	    };

	    // @pragma Iteration

	    List.prototype.slice = function(begin, end) {
	      var size = this.size;
	      if (wholeSlice(begin, end, size)) {
	        return this;
	      }
	      return setListBounds(
	        this,
	        resolveBegin(begin, size),
	        resolveEnd(end, size)
	      );
	    };

	    List.prototype.__iterator = function(type, reverse) {
	      var index = 0;
	      var values = iterateList(this, reverse);
	      return new src_Iterator__Iterator(function()  {
	        var value = values();
	        return value === DONE ?
	          iteratorDone() :
	          iteratorValue(type, index++, value);
	      });
	    };

	    List.prototype.__iterate = function(fn, reverse) {
	      var index = 0;
	      var values = iterateList(this, reverse);
	      var value;
	      while ((value = values()) !== DONE) {
	        if (fn(value, index++, this) === false) {
	          break;
	        }
	      }
	      return index;
	    };

	    List.prototype.__ensureOwner = function(ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      if (!ownerID) {
	        this.__ownerID = ownerID;
	        return this;
	      }
	      return makeList(this._origin, this._capacity, this._level, this._root, this._tail, ownerID, this.__hash);
	    };


	  function isList(maybeList) {
	    return !!(maybeList && maybeList[IS_LIST_SENTINEL]);
	  }

	  List.isList = isList;

	  var IS_LIST_SENTINEL = '@@__IMMUTABLE_LIST__@@';

	  var ListPrototype = List.prototype;
	  ListPrototype[IS_LIST_SENTINEL] = true;
	  ListPrototype[DELETE] = ListPrototype.remove;
	  ListPrototype.setIn = MapPrototype.setIn;
	  ListPrototype.deleteIn =
	  ListPrototype.removeIn = MapPrototype.removeIn;
	  ListPrototype.update = MapPrototype.update;
	  ListPrototype.updateIn = MapPrototype.updateIn;
	  ListPrototype.mergeIn = MapPrototype.mergeIn;
	  ListPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
	  ListPrototype.withMutations = MapPrototype.withMutations;
	  ListPrototype.asMutable = MapPrototype.asMutable;
	  ListPrototype.asImmutable = MapPrototype.asImmutable;
	  ListPrototype.wasAltered = MapPrototype.wasAltered;



	    function VNode(array, ownerID) {
	      this.array = array;
	      this.ownerID = ownerID;
	    }

	    // TODO: seems like these methods are very similar

	    VNode.prototype.removeBefore = function(ownerID, level, index) {
	      if (index === level ? 1 << level : 0 || this.array.length === 0) {
	        return this;
	      }
	      var originIndex = (index >>> level) & MASK;
	      if (originIndex >= this.array.length) {
	        return new VNode([], ownerID);
	      }
	      var removingFirst = originIndex === 0;
	      var newChild;
	      if (level > 0) {
	        var oldChild = this.array[originIndex];
	        newChild = oldChild && oldChild.removeBefore(ownerID, level - SHIFT, index);
	        if (newChild === oldChild && removingFirst) {
	          return this;
	        }
	      }
	      if (removingFirst && !newChild) {
	        return this;
	      }
	      var editable = editableVNode(this, ownerID);
	      if (!removingFirst) {
	        for (var ii = 0; ii < originIndex; ii++) {
	          editable.array[ii] = undefined;
	        }
	      }
	      if (newChild) {
	        editable.array[originIndex] = newChild;
	      }
	      return editable;
	    };

	    VNode.prototype.removeAfter = function(ownerID, level, index) {
	      if (index === level ? 1 << level : 0 || this.array.length === 0) {
	        return this;
	      }
	      var sizeIndex = ((index - 1) >>> level) & MASK;
	      if (sizeIndex >= this.array.length) {
	        return this;
	      }
	      var removingLast = sizeIndex === this.array.length - 1;
	      var newChild;
	      if (level > 0) {
	        var oldChild = this.array[sizeIndex];
	        newChild = oldChild && oldChild.removeAfter(ownerID, level - SHIFT, index);
	        if (newChild === oldChild && removingLast) {
	          return this;
	        }
	      }
	      if (removingLast && !newChild) {
	        return this;
	      }
	      var editable = editableVNode(this, ownerID);
	      if (!removingLast) {
	        editable.array.pop();
	      }
	      if (newChild) {
	        editable.array[sizeIndex] = newChild;
	      }
	      return editable;
	    };



	  var DONE = {};

	  function iterateList(list, reverse) {
	    var left = list._origin;
	    var right = list._capacity;
	    var tailPos = getTailOffset(right);
	    var tail = list._tail;

	    return iterateNodeOrLeaf(list._root, list._level, 0);

	    function iterateNodeOrLeaf(node, level, offset) {
	      return level === 0 ?
	        iterateLeaf(node, offset) :
	        iterateNode(node, level, offset);
	    }

	    function iterateLeaf(node, offset) {
	      var array = offset === tailPos ? tail && tail.array : node && node.array;
	      var from = offset > left ? 0 : left - offset;
	      var to = right - offset;
	      if (to > SIZE) {
	        to = SIZE;
	      }
	      return function()  {
	        if (from === to) {
	          return DONE;
	        }
	        var idx = reverse ? --to : from++;
	        return array && array[idx];
	      };
	    }

	    function iterateNode(node, level, offset) {
	      var values;
	      var array = node && node.array;
	      var from = offset > left ? 0 : (left - offset) >> level;
	      var to = ((right - offset) >> level) + 1;
	      if (to > SIZE) {
	        to = SIZE;
	      }
	      return function()  {
	        do {
	          if (values) {
	            var value = values();
	            if (value !== DONE) {
	              return value;
	            }
	            values = null;
	          }
	          if (from === to) {
	            return DONE;
	          }
	          var idx = reverse ? --to : from++;
	          values = iterateNodeOrLeaf(
	            array && array[idx], level - SHIFT, offset + (idx << level)
	          );
	        } while (true);
	      };
	    }
	  }

	  function makeList(origin, capacity, level, root, tail, ownerID, hash) {
	    var list = Object.create(ListPrototype);
	    list.size = capacity - origin;
	    list._origin = origin;
	    list._capacity = capacity;
	    list._level = level;
	    list._root = root;
	    list._tail = tail;
	    list.__ownerID = ownerID;
	    list.__hash = hash;
	    list.__altered = false;
	    return list;
	  }

	  var EMPTY_LIST;
	  function emptyList() {
	    return EMPTY_LIST || (EMPTY_LIST = makeList(0, 0, SHIFT));
	  }

	  function updateList(list, index, value) {
	    index = wrapIndex(list, index);

	    if (index >= list.size || index < 0) {
	      return list.withMutations(function(list ) {
	        index < 0 ?
	          setListBounds(list, index).set(0, value) :
	          setListBounds(list, 0, index + 1).set(index, value)
	      });
	    }

	    index += list._origin;

	    var newTail = list._tail;
	    var newRoot = list._root;
	    var didAlter = MakeRef(DID_ALTER);
	    if (index >= getTailOffset(list._capacity)) {
	      newTail = updateVNode(newTail, list.__ownerID, 0, index, value, didAlter);
	    } else {
	      newRoot = updateVNode(newRoot, list.__ownerID, list._level, index, value, didAlter);
	    }

	    if (!didAlter.value) {
	      return list;
	    }

	    if (list.__ownerID) {
	      list._root = newRoot;
	      list._tail = newTail;
	      list.__hash = undefined;
	      list.__altered = true;
	      return list;
	    }
	    return makeList(list._origin, list._capacity, list._level, newRoot, newTail);
	  }

	  function updateVNode(node, ownerID, level, index, value, didAlter) {
	    var idx = (index >>> level) & MASK;
	    var nodeHas = node && idx < node.array.length;
	    if (!nodeHas && value === undefined) {
	      return node;
	    }

	    var newNode;

	    if (level > 0) {
	      var lowerNode = node && node.array[idx];
	      var newLowerNode = updateVNode(lowerNode, ownerID, level - SHIFT, index, value, didAlter);
	      if (newLowerNode === lowerNode) {
	        return node;
	      }
	      newNode = editableVNode(node, ownerID);
	      newNode.array[idx] = newLowerNode;
	      return newNode;
	    }

	    if (nodeHas && node.array[idx] === value) {
	      return node;
	    }

	    SetRef(didAlter);

	    newNode = editableVNode(node, ownerID);
	    if (value === undefined && idx === newNode.array.length - 1) {
	      newNode.array.pop();
	    } else {
	      newNode.array[idx] = value;
	    }
	    return newNode;
	  }

	  function editableVNode(node, ownerID) {
	    if (ownerID && node && ownerID === node.ownerID) {
	      return node;
	    }
	    return new VNode(node ? node.array.slice() : [], ownerID);
	  }

	  function listNodeFor(list, rawIndex) {
	    if (rawIndex >= getTailOffset(list._capacity)) {
	      return list._tail;
	    }
	    if (rawIndex < 1 << (list._level + SHIFT)) {
	      var node = list._root;
	      var level = list._level;
	      while (node && level > 0) {
	        node = node.array[(rawIndex >>> level) & MASK];
	        level -= SHIFT;
	      }
	      return node;
	    }
	  }

	  function setListBounds(list, begin, end) {
	    var owner = list.__ownerID || new OwnerID();
	    var oldOrigin = list._origin;
	    var oldCapacity = list._capacity;
	    var newOrigin = oldOrigin + begin;
	    var newCapacity = end === undefined ? oldCapacity : end < 0 ? oldCapacity + end : oldOrigin + end;
	    if (newOrigin === oldOrigin && newCapacity === oldCapacity) {
	      return list;
	    }

	    // If it's going to end after it starts, it's empty.
	    if (newOrigin >= newCapacity) {
	      return list.clear();
	    }

	    var newLevel = list._level;
	    var newRoot = list._root;

	    // New origin might need creating a higher root.
	    var offsetShift = 0;
	    while (newOrigin + offsetShift < 0) {
	      newRoot = new VNode(newRoot && newRoot.array.length ? [undefined, newRoot] : [], owner);
	      newLevel += SHIFT;
	      offsetShift += 1 << newLevel;
	    }
	    if (offsetShift) {
	      newOrigin += offsetShift;
	      oldOrigin += offsetShift;
	      newCapacity += offsetShift;
	      oldCapacity += offsetShift;
	    }

	    var oldTailOffset = getTailOffset(oldCapacity);
	    var newTailOffset = getTailOffset(newCapacity);

	    // New size might need creating a higher root.
	    while (newTailOffset >= 1 << (newLevel + SHIFT)) {
	      newRoot = new VNode(newRoot && newRoot.array.length ? [newRoot] : [], owner);
	      newLevel += SHIFT;
	    }

	    // Locate or create the new tail.
	    var oldTail = list._tail;
	    var newTail = newTailOffset < oldTailOffset ?
	      listNodeFor(list, newCapacity - 1) :
	      newTailOffset > oldTailOffset ? new VNode([], owner) : oldTail;

	    // Merge Tail into tree.
	    if (oldTail && newTailOffset > oldTailOffset && newOrigin < oldCapacity && oldTail.array.length) {
	      newRoot = editableVNode(newRoot, owner);
	      var node = newRoot;
	      for (var level = newLevel; level > SHIFT; level -= SHIFT) {
	        var idx = (oldTailOffset >>> level) & MASK;
	        node = node.array[idx] = editableVNode(node.array[idx], owner);
	      }
	      node.array[(oldTailOffset >>> SHIFT) & MASK] = oldTail;
	    }

	    // If the size has been reduced, there's a chance the tail needs to be trimmed.
	    if (newCapacity < oldCapacity) {
	      newTail = newTail && newTail.removeAfter(owner, 0, newCapacity);
	    }

	    // If the new origin is within the tail, then we do not need a root.
	    if (newOrigin >= newTailOffset) {
	      newOrigin -= newTailOffset;
	      newCapacity -= newTailOffset;
	      newLevel = SHIFT;
	      newRoot = null;
	      newTail = newTail && newTail.removeBefore(owner, 0, newOrigin);

	    // Otherwise, if the root has been trimmed, garbage collect.
	    } else if (newOrigin > oldOrigin || newTailOffset < oldTailOffset) {
	      offsetShift = 0;

	      // Identify the new top root node of the subtree of the old root.
	      while (newRoot) {
	        var beginIndex = (newOrigin >>> newLevel) & MASK;
	        if (beginIndex !== (newTailOffset >>> newLevel) & MASK) {
	          break;
	        }
	        if (beginIndex) {
	          offsetShift += (1 << newLevel) * beginIndex;
	        }
	        newLevel -= SHIFT;
	        newRoot = newRoot.array[beginIndex];
	      }

	      // Trim the new sides of the new root.
	      if (newRoot && newOrigin > oldOrigin) {
	        newRoot = newRoot.removeBefore(owner, newLevel, newOrigin - offsetShift);
	      }
	      if (newRoot && newTailOffset < oldTailOffset) {
	        newRoot = newRoot.removeAfter(owner, newLevel, newTailOffset - offsetShift);
	      }
	      if (offsetShift) {
	        newOrigin -= offsetShift;
	        newCapacity -= offsetShift;
	      }
	    }

	    if (list.__ownerID) {
	      list.size = newCapacity - newOrigin;
	      list._origin = newOrigin;
	      list._capacity = newCapacity;
	      list._level = newLevel;
	      list._root = newRoot;
	      list._tail = newTail;
	      list.__hash = undefined;
	      list.__altered = true;
	      return list;
	    }
	    return makeList(newOrigin, newCapacity, newLevel, newRoot, newTail);
	  }

	  function mergeIntoListWith(list, merger, iterables) {
	    var iters = [];
	    var maxSize = 0;
	    for (var ii = 0; ii < iterables.length; ii++) {
	      var value = iterables[ii];
	      var iter = IndexedIterable(value);
	      if (iter.size > maxSize) {
	        maxSize = iter.size;
	      }
	      if (!isIterable(value)) {
	        iter = iter.map(function(v ) {return fromJS(v)});
	      }
	      iters.push(iter);
	    }
	    if (maxSize > list.size) {
	      list = list.setSize(maxSize);
	    }
	    return mergeIntoCollectionWith(list, merger, iters);
	  }

	  function getTailOffset(size) {
	    return size < SIZE ? 0 : (((size - 1) >>> SHIFT) << SHIFT);
	  }

	  createClass(OrderedMap, src_Map__Map);

	    // @pragma Construction

	    function OrderedMap(value) {
	      return value === null || value === undefined ? emptyOrderedMap() :
	        isOrderedMap(value) ? value :
	        emptyOrderedMap().withMutations(function(map ) {
	          var iter = KeyedIterable(value);
	          assertNotInfinite(iter.size);
	          iter.forEach(function(v, k)  {return map.set(k, v)});
	        });
	    }

	    OrderedMap.of = function(/*...values*/) {
	      return this(arguments);
	    };

	    OrderedMap.prototype.toString = function() {
	      return this.__toString('OrderedMap {', '}');
	    };

	    // @pragma Access

	    OrderedMap.prototype.get = function(k, notSetValue) {
	      var index = this._map.get(k);
	      return index !== undefined ? this._list.get(index)[1] : notSetValue;
	    };

	    // @pragma Modification

	    OrderedMap.prototype.clear = function() {
	      if (this.size === 0) {
	        return this;
	      }
	      if (this.__ownerID) {
	        this.size = 0;
	        this._map.clear();
	        this._list.clear();
	        return this;
	      }
	      return emptyOrderedMap();
	    };

	    OrderedMap.prototype.set = function(k, v) {
	      return updateOrderedMap(this, k, v);
	    };

	    OrderedMap.prototype.remove = function(k) {
	      return updateOrderedMap(this, k, NOT_SET);
	    };

	    OrderedMap.prototype.wasAltered = function() {
	      return this._map.wasAltered() || this._list.wasAltered();
	    };

	    OrderedMap.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      return this._list.__iterate(
	        function(entry ) {return entry && fn(entry[1], entry[0], this$0)},
	        reverse
	      );
	    };

	    OrderedMap.prototype.__iterator = function(type, reverse) {
	      return this._list.fromEntrySeq().__iterator(type, reverse);
	    };

	    OrderedMap.prototype.__ensureOwner = function(ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      var newMap = this._map.__ensureOwner(ownerID);
	      var newList = this._list.__ensureOwner(ownerID);
	      if (!ownerID) {
	        this.__ownerID = ownerID;
	        this._map = newMap;
	        this._list = newList;
	        return this;
	      }
	      return makeOrderedMap(newMap, newList, ownerID, this.__hash);
	    };


	  function isOrderedMap(maybeOrderedMap) {
	    return isMap(maybeOrderedMap) && isOrdered(maybeOrderedMap);
	  }

	  OrderedMap.isOrderedMap = isOrderedMap;

	  OrderedMap.prototype[IS_ORDERED_SENTINEL] = true;
	  OrderedMap.prototype[DELETE] = OrderedMap.prototype.remove;



	  function makeOrderedMap(map, list, ownerID, hash) {
	    var omap = Object.create(OrderedMap.prototype);
	    omap.size = map ? map.size : 0;
	    omap._map = map;
	    omap._list = list;
	    omap.__ownerID = ownerID;
	    omap.__hash = hash;
	    return omap;
	  }

	  var EMPTY_ORDERED_MAP;
	  function emptyOrderedMap() {
	    return EMPTY_ORDERED_MAP || (EMPTY_ORDERED_MAP = makeOrderedMap(emptyMap(), emptyList()));
	  }

	  function updateOrderedMap(omap, k, v) {
	    var map = omap._map;
	    var list = omap._list;
	    var i = map.get(k);
	    var has = i !== undefined;
	    var newMap;
	    var newList;
	    if (v === NOT_SET) { // removed
	      if (!has) {
	        return omap;
	      }
	      if (list.size >= SIZE && list.size >= map.size * 2) {
	        newList = list.filter(function(entry, idx)  {return entry !== undefined && i !== idx});
	        newMap = newList.toKeyedSeq().map(function(entry ) {return entry[0]}).flip().toMap();
	        if (omap.__ownerID) {
	          newMap.__ownerID = newList.__ownerID = omap.__ownerID;
	        }
	      } else {
	        newMap = map.remove(k);
	        newList = i === list.size - 1 ? list.pop() : list.set(i, undefined);
	      }
	    } else {
	      if (has) {
	        if (v === list.get(i)[1]) {
	          return omap;
	        }
	        newMap = map;
	        newList = list.set(i, [k, v]);
	      } else {
	        newMap = map.set(k, list.size);
	        newList = list.set(list.size, [k, v]);
	      }
	    }
	    if (omap.__ownerID) {
	      omap.size = newMap.size;
	      omap._map = newMap;
	      omap._list = newList;
	      omap.__hash = undefined;
	      return omap;
	    }
	    return makeOrderedMap(newMap, newList);
	  }

	  createClass(Stack, IndexedCollection);

	    // @pragma Construction

	    function Stack(value) {
	      return value === null || value === undefined ? emptyStack() :
	        isStack(value) ? value :
	        emptyStack().unshiftAll(value);
	    }

	    Stack.of = function(/*...values*/) {
	      return this(arguments);
	    };

	    Stack.prototype.toString = function() {
	      return this.__toString('Stack [', ']');
	    };

	    // @pragma Access

	    Stack.prototype.get = function(index, notSetValue) {
	      var head = this._head;
	      index = wrapIndex(this, index);
	      while (head && index--) {
	        head = head.next;
	      }
	      return head ? head.value : notSetValue;
	    };

	    Stack.prototype.peek = function() {
	      return this._head && this._head.value;
	    };

	    // @pragma Modification

	    Stack.prototype.push = function(/*...values*/) {
	      if (arguments.length === 0) {
	        return this;
	      }
	      var newSize = this.size + arguments.length;
	      var head = this._head;
	      for (var ii = arguments.length - 1; ii >= 0; ii--) {
	        head = {
	          value: arguments[ii],
	          next: head
	        };
	      }
	      if (this.__ownerID) {
	        this.size = newSize;
	        this._head = head;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return makeStack(newSize, head);
	    };

	    Stack.prototype.pushAll = function(iter) {
	      iter = IndexedIterable(iter);
	      if (iter.size === 0) {
	        return this;
	      }
	      assertNotInfinite(iter.size);
	      var newSize = this.size;
	      var head = this._head;
	      iter.reverse().forEach(function(value ) {
	        newSize++;
	        head = {
	          value: value,
	          next: head
	        };
	      });
	      if (this.__ownerID) {
	        this.size = newSize;
	        this._head = head;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return makeStack(newSize, head);
	    };

	    Stack.prototype.pop = function() {
	      return this.slice(1);
	    };

	    Stack.prototype.unshift = function(/*...values*/) {
	      return this.push.apply(this, arguments);
	    };

	    Stack.prototype.unshiftAll = function(iter) {
	      return this.pushAll(iter);
	    };

	    Stack.prototype.shift = function() {
	      return this.pop.apply(this, arguments);
	    };

	    Stack.prototype.clear = function() {
	      if (this.size === 0) {
	        return this;
	      }
	      if (this.__ownerID) {
	        this.size = 0;
	        this._head = undefined;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return emptyStack();
	    };

	    Stack.prototype.slice = function(begin, end) {
	      if (wholeSlice(begin, end, this.size)) {
	        return this;
	      }
	      var resolvedBegin = resolveBegin(begin, this.size);
	      var resolvedEnd = resolveEnd(end, this.size);
	      if (resolvedEnd !== this.size) {
	        // super.slice(begin, end);
	        return IndexedCollection.prototype.slice.call(this, begin, end);
	      }
	      var newSize = this.size - resolvedBegin;
	      var head = this._head;
	      while (resolvedBegin--) {
	        head = head.next;
	      }
	      if (this.__ownerID) {
	        this.size = newSize;
	        this._head = head;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return makeStack(newSize, head);
	    };

	    // @pragma Mutability

	    Stack.prototype.__ensureOwner = function(ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      if (!ownerID) {
	        this.__ownerID = ownerID;
	        this.__altered = false;
	        return this;
	      }
	      return makeStack(this.size, this._head, ownerID, this.__hash);
	    };

	    // @pragma Iteration

	    Stack.prototype.__iterate = function(fn, reverse) {
	      if (reverse) {
	        return this.reverse().__iterate(fn);
	      }
	      var iterations = 0;
	      var node = this._head;
	      while (node) {
	        if (fn(node.value, iterations++, this) === false) {
	          break;
	        }
	        node = node.next;
	      }
	      return iterations;
	    };

	    Stack.prototype.__iterator = function(type, reverse) {
	      if (reverse) {
	        return this.reverse().__iterator(type);
	      }
	      var iterations = 0;
	      var node = this._head;
	      return new src_Iterator__Iterator(function()  {
	        if (node) {
	          var value = node.value;
	          node = node.next;
	          return iteratorValue(type, iterations++, value);
	        }
	        return iteratorDone();
	      });
	    };


	  function isStack(maybeStack) {
	    return !!(maybeStack && maybeStack[IS_STACK_SENTINEL]);
	  }

	  Stack.isStack = isStack;

	  var IS_STACK_SENTINEL = '@@__IMMUTABLE_STACK__@@';

	  var StackPrototype = Stack.prototype;
	  StackPrototype[IS_STACK_SENTINEL] = true;
	  StackPrototype.withMutations = MapPrototype.withMutations;
	  StackPrototype.asMutable = MapPrototype.asMutable;
	  StackPrototype.asImmutable = MapPrototype.asImmutable;
	  StackPrototype.wasAltered = MapPrototype.wasAltered;


	  function makeStack(size, head, ownerID, hash) {
	    var map = Object.create(StackPrototype);
	    map.size = size;
	    map._head = head;
	    map.__ownerID = ownerID;
	    map.__hash = hash;
	    map.__altered = false;
	    return map;
	  }

	  var EMPTY_STACK;
	  function emptyStack() {
	    return EMPTY_STACK || (EMPTY_STACK = makeStack(0));
	  }

	  createClass(src_Set__Set, SetCollection);

	    // @pragma Construction

	    function src_Set__Set(value) {
	      return value === null || value === undefined ? emptySet() :
	        isSet(value) ? value :
	        emptySet().withMutations(function(set ) {
	          var iter = SetIterable(value);
	          assertNotInfinite(iter.size);
	          iter.forEach(function(v ) {return set.add(v)});
	        });
	    }

	    src_Set__Set.of = function(/*...values*/) {
	      return this(arguments);
	    };

	    src_Set__Set.fromKeys = function(value) {
	      return this(KeyedIterable(value).keySeq());
	    };

	    src_Set__Set.prototype.toString = function() {
	      return this.__toString('Set {', '}');
	    };

	    // @pragma Access

	    src_Set__Set.prototype.has = function(value) {
	      return this._map.has(value);
	    };

	    // @pragma Modification

	    src_Set__Set.prototype.add = function(value) {
	      return updateSet(this, this._map.set(value, true));
	    };

	    src_Set__Set.prototype.remove = function(value) {
	      return updateSet(this, this._map.remove(value));
	    };

	    src_Set__Set.prototype.clear = function() {
	      return updateSet(this, this._map.clear());
	    };

	    // @pragma Composition

	    src_Set__Set.prototype.union = function() {var iters = SLICE$0.call(arguments, 0);
	      iters = iters.filter(function(x ) {return x.size !== 0});
	      if (iters.length === 0) {
	        return this;
	      }
	      if (this.size === 0 && !this.__ownerID && iters.length === 1) {
	        return this.constructor(iters[0]);
	      }
	      return this.withMutations(function(set ) {
	        for (var ii = 0; ii < iters.length; ii++) {
	          SetIterable(iters[ii]).forEach(function(value ) {return set.add(value)});
	        }
	      });
	    };

	    src_Set__Set.prototype.intersect = function() {var iters = SLICE$0.call(arguments, 0);
	      if (iters.length === 0) {
	        return this;
	      }
	      iters = iters.map(function(iter ) {return SetIterable(iter)});
	      var originalSet = this;
	      return this.withMutations(function(set ) {
	        originalSet.forEach(function(value ) {
	          if (!iters.every(function(iter ) {return iter.includes(value)})) {
	            set.remove(value);
	          }
	        });
	      });
	    };

	    src_Set__Set.prototype.subtract = function() {var iters = SLICE$0.call(arguments, 0);
	      if (iters.length === 0) {
	        return this;
	      }
	      iters = iters.map(function(iter ) {return SetIterable(iter)});
	      var originalSet = this;
	      return this.withMutations(function(set ) {
	        originalSet.forEach(function(value ) {
	          if (iters.some(function(iter ) {return iter.includes(value)})) {
	            set.remove(value);
	          }
	        });
	      });
	    };

	    src_Set__Set.prototype.merge = function() {
	      return this.union.apply(this, arguments);
	    };

	    src_Set__Set.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
	      return this.union.apply(this, iters);
	    };

	    src_Set__Set.prototype.sort = function(comparator) {
	      // Late binding
	      return OrderedSet(sortFactory(this, comparator));
	    };

	    src_Set__Set.prototype.sortBy = function(mapper, comparator) {
	      // Late binding
	      return OrderedSet(sortFactory(this, comparator, mapper));
	    };

	    src_Set__Set.prototype.wasAltered = function() {
	      return this._map.wasAltered();
	    };

	    src_Set__Set.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      return this._map.__iterate(function(_, k)  {return fn(k, k, this$0)}, reverse);
	    };

	    src_Set__Set.prototype.__iterator = function(type, reverse) {
	      return this._map.map(function(_, k)  {return k}).__iterator(type, reverse);
	    };

	    src_Set__Set.prototype.__ensureOwner = function(ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      var newMap = this._map.__ensureOwner(ownerID);
	      if (!ownerID) {
	        this.__ownerID = ownerID;
	        this._map = newMap;
	        return this;
	      }
	      return this.__make(newMap, ownerID);
	    };


	  function isSet(maybeSet) {
	    return !!(maybeSet && maybeSet[IS_SET_SENTINEL]);
	  }

	  src_Set__Set.isSet = isSet;

	  var IS_SET_SENTINEL = '@@__IMMUTABLE_SET__@@';

	  var SetPrototype = src_Set__Set.prototype;
	  SetPrototype[IS_SET_SENTINEL] = true;
	  SetPrototype[DELETE] = SetPrototype.remove;
	  SetPrototype.mergeDeep = SetPrototype.merge;
	  SetPrototype.mergeDeepWith = SetPrototype.mergeWith;
	  SetPrototype.withMutations = MapPrototype.withMutations;
	  SetPrototype.asMutable = MapPrototype.asMutable;
	  SetPrototype.asImmutable = MapPrototype.asImmutable;

	  SetPrototype.__empty = emptySet;
	  SetPrototype.__make = makeSet;

	  function updateSet(set, newMap) {
	    if (set.__ownerID) {
	      set.size = newMap.size;
	      set._map = newMap;
	      return set;
	    }
	    return newMap === set._map ? set :
	      newMap.size === 0 ? set.__empty() :
	      set.__make(newMap);
	  }

	  function makeSet(map, ownerID) {
	    var set = Object.create(SetPrototype);
	    set.size = map ? map.size : 0;
	    set._map = map;
	    set.__ownerID = ownerID;
	    return set;
	  }

	  var EMPTY_SET;
	  function emptySet() {
	    return EMPTY_SET || (EMPTY_SET = makeSet(emptyMap()));
	  }

	  createClass(OrderedSet, src_Set__Set);

	    // @pragma Construction

	    function OrderedSet(value) {
	      return value === null || value === undefined ? emptyOrderedSet() :
	        isOrderedSet(value) ? value :
	        emptyOrderedSet().withMutations(function(set ) {
	          var iter = SetIterable(value);
	          assertNotInfinite(iter.size);
	          iter.forEach(function(v ) {return set.add(v)});
	        });
	    }

	    OrderedSet.of = function(/*...values*/) {
	      return this(arguments);
	    };

	    OrderedSet.fromKeys = function(value) {
	      return this(KeyedIterable(value).keySeq());
	    };

	    OrderedSet.prototype.toString = function() {
	      return this.__toString('OrderedSet {', '}');
	    };


	  function isOrderedSet(maybeOrderedSet) {
	    return isSet(maybeOrderedSet) && isOrdered(maybeOrderedSet);
	  }

	  OrderedSet.isOrderedSet = isOrderedSet;

	  var OrderedSetPrototype = OrderedSet.prototype;
	  OrderedSetPrototype[IS_ORDERED_SENTINEL] = true;

	  OrderedSetPrototype.__empty = emptyOrderedSet;
	  OrderedSetPrototype.__make = makeOrderedSet;

	  function makeOrderedSet(map, ownerID) {
	    var set = Object.create(OrderedSetPrototype);
	    set.size = map ? map.size : 0;
	    set._map = map;
	    set.__ownerID = ownerID;
	    return set;
	  }

	  var EMPTY_ORDERED_SET;
	  function emptyOrderedSet() {
	    return EMPTY_ORDERED_SET || (EMPTY_ORDERED_SET = makeOrderedSet(emptyOrderedMap()));
	  }

	  createClass(Record, KeyedCollection);

	    function Record(defaultValues, name) {
	      var hasInitialized;

	      var RecordType = function Record(values) {
	        if (values instanceof RecordType) {
	          return values;
	        }
	        if (!(this instanceof RecordType)) {
	          return new RecordType(values);
	        }
	        if (!hasInitialized) {
	          hasInitialized = true;
	          var keys = Object.keys(defaultValues);
	          setProps(RecordTypePrototype, keys);
	          RecordTypePrototype.size = keys.length;
	          RecordTypePrototype._name = name;
	          RecordTypePrototype._keys = keys;
	          RecordTypePrototype._defaultValues = defaultValues;
	        }
	        this._map = src_Map__Map(values);
	      };

	      var RecordTypePrototype = RecordType.prototype = Object.create(RecordPrototype);
	      RecordTypePrototype.constructor = RecordType;

	      return RecordType;
	    }

	    Record.prototype.toString = function() {
	      return this.__toString(recordName(this) + ' {', '}');
	    };

	    // @pragma Access

	    Record.prototype.has = function(k) {
	      return this._defaultValues.hasOwnProperty(k);
	    };

	    Record.prototype.get = function(k, notSetValue) {
	      if (!this.has(k)) {
	        return notSetValue;
	      }
	      var defaultVal = this._defaultValues[k];
	      return this._map ? this._map.get(k, defaultVal) : defaultVal;
	    };

	    // @pragma Modification

	    Record.prototype.clear = function() {
	      if (this.__ownerID) {
	        this._map && this._map.clear();
	        return this;
	      }
	      var RecordType = this.constructor;
	      return RecordType._empty || (RecordType._empty = makeRecord(this, emptyMap()));
	    };

	    Record.prototype.set = function(k, v) {
	      if (!this.has(k)) {
	        throw new Error('Cannot set unknown key "' + k + '" on ' + recordName(this));
	      }
	      var newMap = this._map && this._map.set(k, v);
	      if (this.__ownerID || newMap === this._map) {
	        return this;
	      }
	      return makeRecord(this, newMap);
	    };

	    Record.prototype.remove = function(k) {
	      if (!this.has(k)) {
	        return this;
	      }
	      var newMap = this._map && this._map.remove(k);
	      if (this.__ownerID || newMap === this._map) {
	        return this;
	      }
	      return makeRecord(this, newMap);
	    };

	    Record.prototype.wasAltered = function() {
	      return this._map.wasAltered();
	    };

	    Record.prototype.__iterator = function(type, reverse) {var this$0 = this;
	      return KeyedIterable(this._defaultValues).map(function(_, k)  {return this$0.get(k)}).__iterator(type, reverse);
	    };

	    Record.prototype.__iterate = function(fn, reverse) {var this$0 = this;
	      return KeyedIterable(this._defaultValues).map(function(_, k)  {return this$0.get(k)}).__iterate(fn, reverse);
	    };

	    Record.prototype.__ensureOwner = function(ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      var newMap = this._map && this._map.__ensureOwner(ownerID);
	      if (!ownerID) {
	        this.__ownerID = ownerID;
	        this._map = newMap;
	        return this;
	      }
	      return makeRecord(this, newMap, ownerID);
	    };


	  var RecordPrototype = Record.prototype;
	  RecordPrototype[DELETE] = RecordPrototype.remove;
	  RecordPrototype.deleteIn =
	  RecordPrototype.removeIn = MapPrototype.removeIn;
	  RecordPrototype.merge = MapPrototype.merge;
	  RecordPrototype.mergeWith = MapPrototype.mergeWith;
	  RecordPrototype.mergeIn = MapPrototype.mergeIn;
	  RecordPrototype.mergeDeep = MapPrototype.mergeDeep;
	  RecordPrototype.mergeDeepWith = MapPrototype.mergeDeepWith;
	  RecordPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
	  RecordPrototype.setIn = MapPrototype.setIn;
	  RecordPrototype.update = MapPrototype.update;
	  RecordPrototype.updateIn = MapPrototype.updateIn;
	  RecordPrototype.withMutations = MapPrototype.withMutations;
	  RecordPrototype.asMutable = MapPrototype.asMutable;
	  RecordPrototype.asImmutable = MapPrototype.asImmutable;


	  function makeRecord(likeRecord, map, ownerID) {
	    var record = Object.create(Object.getPrototypeOf(likeRecord));
	    record._map = map;
	    record.__ownerID = ownerID;
	    return record;
	  }

	  function recordName(record) {
	    return record._name || record.constructor.name || 'Record';
	  }

	  function setProps(prototype, names) {
	    try {
	      names.forEach(setProp.bind(undefined, prototype));
	    } catch (error) {
	      // Object.defineProperty failed. Probably IE8.
	    }
	  }

	  function setProp(prototype, name) {
	    Object.defineProperty(prototype, name, {
	      get: function() {
	        return this.get(name);
	      },
	      set: function(value) {
	        invariant(this.__ownerID, 'Cannot set on an immutable record.');
	        this.set(name, value);
	      }
	    });
	  }

	  function deepEqual(a, b) {
	    if (a === b) {
	      return true;
	    }

	    if (
	      !isIterable(b) ||
	      a.size !== undefined && b.size !== undefined && a.size !== b.size ||
	      a.__hash !== undefined && b.__hash !== undefined && a.__hash !== b.__hash ||
	      isKeyed(a) !== isKeyed(b) ||
	      isIndexed(a) !== isIndexed(b) ||
	      isOrdered(a) !== isOrdered(b)
	    ) {
	      return false;
	    }

	    if (a.size === 0 && b.size === 0) {
	      return true;
	    }

	    var notAssociative = !isAssociative(a);

	    if (isOrdered(a)) {
	      var entries = a.entries();
	      return b.every(function(v, k)  {
	        var entry = entries.next().value;
	        return entry && is(entry[1], v) && (notAssociative || is(entry[0], k));
	      }) && entries.next().done;
	    }

	    var flipped = false;

	    if (a.size === undefined) {
	      if (b.size === undefined) {
	        if (typeof a.cacheResult === 'function') {
	          a.cacheResult();
	        }
	      } else {
	        flipped = true;
	        var _ = a;
	        a = b;
	        b = _;
	      }
	    }

	    var allEqual = true;
	    var bSize = b.__iterate(function(v, k)  {
	      if (notAssociative ? !a.has(v) :
	          flipped ? !is(v, a.get(k, NOT_SET)) : !is(a.get(k, NOT_SET), v)) {
	        allEqual = false;
	        return false;
	      }
	    });

	    return allEqual && a.size === bSize;
	  }

	  createClass(Range, IndexedSeq);

	    function Range(start, end, step) {
	      if (!(this instanceof Range)) {
	        return new Range(start, end, step);
	      }
	      invariant(step !== 0, 'Cannot step a Range by 0');
	      start = start || 0;
	      if (end === undefined) {
	        end = Infinity;
	      }
	      step = step === undefined ? 1 : Math.abs(step);
	      if (end < start) {
	        step = -step;
	      }
	      this._start = start;
	      this._end = end;
	      this._step = step;
	      this.size = Math.max(0, Math.ceil((end - start) / step - 1) + 1);
	      if (this.size === 0) {
	        if (EMPTY_RANGE) {
	          return EMPTY_RANGE;
	        }
	        EMPTY_RANGE = this;
	      }
	    }

	    Range.prototype.toString = function() {
	      if (this.size === 0) {
	        return 'Range []';
	      }
	      return 'Range [ ' +
	        this._start + '...' + this._end +
	        (this._step > 1 ? ' by ' + this._step : '') +
	      ' ]';
	    };

	    Range.prototype.get = function(index, notSetValue) {
	      return this.has(index) ?
	        this._start + wrapIndex(this, index) * this._step :
	        notSetValue;
	    };

	    Range.prototype.includes = function(searchValue) {
	      var possibleIndex = (searchValue - this._start) / this._step;
	      return possibleIndex >= 0 &&
	        possibleIndex < this.size &&
	        possibleIndex === Math.floor(possibleIndex);
	    };

	    Range.prototype.slice = function(begin, end) {
	      if (wholeSlice(begin, end, this.size)) {
	        return this;
	      }
	      begin = resolveBegin(begin, this.size);
	      end = resolveEnd(end, this.size);
	      if (end <= begin) {
	        return new Range(0, 0);
	      }
	      return new Range(this.get(begin, this._end), this.get(end, this._end), this._step);
	    };

	    Range.prototype.indexOf = function(searchValue) {
	      var offsetValue = searchValue - this._start;
	      if (offsetValue % this._step === 0) {
	        var index = offsetValue / this._step;
	        if (index >= 0 && index < this.size) {
	          return index
	        }
	      }
	      return -1;
	    };

	    Range.prototype.lastIndexOf = function(searchValue) {
	      return this.indexOf(searchValue);
	    };

	    Range.prototype.__iterate = function(fn, reverse) {
	      var maxIndex = this.size - 1;
	      var step = this._step;
	      var value = reverse ? this._start + maxIndex * step : this._start;
	      for (var ii = 0; ii <= maxIndex; ii++) {
	        if (fn(value, ii, this) === false) {
	          return ii + 1;
	        }
	        value += reverse ? -step : step;
	      }
	      return ii;
	    };

	    Range.prototype.__iterator = function(type, reverse) {
	      var maxIndex = this.size - 1;
	      var step = this._step;
	      var value = reverse ? this._start + maxIndex * step : this._start;
	      var ii = 0;
	      return new src_Iterator__Iterator(function()  {
	        var v = value;
	        value += reverse ? -step : step;
	        return ii > maxIndex ? iteratorDone() : iteratorValue(type, ii++, v);
	      });
	    };

	    Range.prototype.equals = function(other) {
	      return other instanceof Range ?
	        this._start === other._start &&
	        this._end === other._end &&
	        this._step === other._step :
	        deepEqual(this, other);
	    };


	  var EMPTY_RANGE;

	  createClass(Repeat, IndexedSeq);

	    function Repeat(value, times) {
	      if (!(this instanceof Repeat)) {
	        return new Repeat(value, times);
	      }
	      this._value = value;
	      this.size = times === undefined ? Infinity : Math.max(0, times);
	      if (this.size === 0) {
	        if (EMPTY_REPEAT) {
	          return EMPTY_REPEAT;
	        }
	        EMPTY_REPEAT = this;
	      }
	    }

	    Repeat.prototype.toString = function() {
	      if (this.size === 0) {
	        return 'Repeat []';
	      }
	      return 'Repeat [ ' + this._value + ' ' + this.size + ' times ]';
	    };

	    Repeat.prototype.get = function(index, notSetValue) {
	      return this.has(index) ? this._value : notSetValue;
	    };

	    Repeat.prototype.includes = function(searchValue) {
	      return is(this._value, searchValue);
	    };

	    Repeat.prototype.slice = function(begin, end) {
	      var size = this.size;
	      return wholeSlice(begin, end, size) ? this :
	        new Repeat(this._value, resolveEnd(end, size) - resolveBegin(begin, size));
	    };

	    Repeat.prototype.reverse = function() {
	      return this;
	    };

	    Repeat.prototype.indexOf = function(searchValue) {
	      if (is(this._value, searchValue)) {
	        return 0;
	      }
	      return -1;
	    };

	    Repeat.prototype.lastIndexOf = function(searchValue) {
	      if (is(this._value, searchValue)) {
	        return this.size;
	      }
	      return -1;
	    };

	    Repeat.prototype.__iterate = function(fn, reverse) {
	      for (var ii = 0; ii < this.size; ii++) {
	        if (fn(this._value, ii, this) === false) {
	          return ii + 1;
	        }
	      }
	      return ii;
	    };

	    Repeat.prototype.__iterator = function(type, reverse) {var this$0 = this;
	      var ii = 0;
	      return new src_Iterator__Iterator(function() 
	        {return ii < this$0.size ? iteratorValue(type, ii++, this$0._value) : iteratorDone()}
	      );
	    };

	    Repeat.prototype.equals = function(other) {
	      return other instanceof Repeat ?
	        is(this._value, other._value) :
	        deepEqual(other);
	    };


	  var EMPTY_REPEAT;

	  /**
	   * Contributes additional methods to a constructor
	   */
	  function mixin(ctor, methods) {
	    var keyCopier = function(key ) { ctor.prototype[key] = methods[key]; };
	    Object.keys(methods).forEach(keyCopier);
	    Object.getOwnPropertySymbols &&
	      Object.getOwnPropertySymbols(methods).forEach(keyCopier);
	    return ctor;
	  }

	  Iterable.Iterator = src_Iterator__Iterator;

	  mixin(Iterable, {

	    // ### Conversion to other types

	    toArray: function() {
	      assertNotInfinite(this.size);
	      var array = new Array(this.size || 0);
	      this.valueSeq().__iterate(function(v, i)  { array[i] = v; });
	      return array;
	    },

	    toIndexedSeq: function() {
	      return new ToIndexedSequence(this);
	    },

	    toJS: function() {
	      return this.toSeq().map(
	        function(value ) {return value && typeof value.toJS === 'function' ? value.toJS() : value}
	      ).__toJS();
	    },

	    toJSON: function() {
	      return this.toSeq().map(
	        function(value ) {return value && typeof value.toJSON === 'function' ? value.toJSON() : value}
	      ).__toJS();
	    },

	    toKeyedSeq: function() {
	      return new ToKeyedSequence(this, true);
	    },

	    toMap: function() {
	      // Use Late Binding here to solve the circular dependency.
	      return src_Map__Map(this.toKeyedSeq());
	    },

	    toObject: function() {
	      assertNotInfinite(this.size);
	      var object = {};
	      this.__iterate(function(v, k)  { object[k] = v; });
	      return object;
	    },

	    toOrderedMap: function() {
	      // Use Late Binding here to solve the circular dependency.
	      return OrderedMap(this.toKeyedSeq());
	    },

	    toOrderedSet: function() {
	      // Use Late Binding here to solve the circular dependency.
	      return OrderedSet(isKeyed(this) ? this.valueSeq() : this);
	    },

	    toSet: function() {
	      // Use Late Binding here to solve the circular dependency.
	      return src_Set__Set(isKeyed(this) ? this.valueSeq() : this);
	    },

	    toSetSeq: function() {
	      return new ToSetSequence(this);
	    },

	    toSeq: function() {
	      return isIndexed(this) ? this.toIndexedSeq() :
	        isKeyed(this) ? this.toKeyedSeq() :
	        this.toSetSeq();
	    },

	    toStack: function() {
	      // Use Late Binding here to solve the circular dependency.
	      return Stack(isKeyed(this) ? this.valueSeq() : this);
	    },

	    toList: function() {
	      // Use Late Binding here to solve the circular dependency.
	      return List(isKeyed(this) ? this.valueSeq() : this);
	    },


	    // ### Common JavaScript methods and properties

	    toString: function() {
	      return '[Iterable]';
	    },

	    __toString: function(head, tail) {
	      if (this.size === 0) {
	        return head + tail;
	      }
	      return head + ' ' + this.toSeq().map(this.__toStringMapper).join(', ') + ' ' + tail;
	    },


	    // ### ES6 Collection methods (ES6 Array and Map)

	    concat: function() {var values = SLICE$0.call(arguments, 0);
	      return reify(this, concatFactory(this, values));
	    },

	    contains: function(searchValue) {
	      return this.includes(searchValue);
	    },

	    includes: function(searchValue) {
	      return this.some(function(value ) {return is(value, searchValue)});
	    },

	    entries: function() {
	      return this.__iterator(ITERATE_ENTRIES);
	    },

	    every: function(predicate, context) {
	      assertNotInfinite(this.size);
	      var returnValue = true;
	      this.__iterate(function(v, k, c)  {
	        if (!predicate.call(context, v, k, c)) {
	          returnValue = false;
	          return false;
	        }
	      });
	      return returnValue;
	    },

	    filter: function(predicate, context) {
	      return reify(this, filterFactory(this, predicate, context, true));
	    },

	    find: function(predicate, context, notSetValue) {
	      var entry = this.findEntry(predicate, context);
	      return entry ? entry[1] : notSetValue;
	    },

	    findEntry: function(predicate, context) {
	      var found;
	      this.__iterate(function(v, k, c)  {
	        if (predicate.call(context, v, k, c)) {
	          found = [k, v];
	          return false;
	        }
	      });
	      return found;
	    },

	    findLastEntry: function(predicate, context) {
	      return this.toSeq().reverse().findEntry(predicate, context);
	    },

	    forEach: function(sideEffect, context) {
	      assertNotInfinite(this.size);
	      return this.__iterate(context ? sideEffect.bind(context) : sideEffect);
	    },

	    join: function(separator) {
	      assertNotInfinite(this.size);
	      separator = separator !== undefined ? '' + separator : ',';
	      var joined = '';
	      var isFirst = true;
	      this.__iterate(function(v ) {
	        isFirst ? (isFirst = false) : (joined += separator);
	        joined += v !== null && v !== undefined ? v.toString() : '';
	      });
	      return joined;
	    },

	    keys: function() {
	      return this.__iterator(ITERATE_KEYS);
	    },

	    map: function(mapper, context) {
	      return reify(this, mapFactory(this, mapper, context));
	    },

	    reduce: function(reducer, initialReduction, context) {
	      assertNotInfinite(this.size);
	      var reduction;
	      var useFirst;
	      if (arguments.length < 2) {
	        useFirst = true;
	      } else {
	        reduction = initialReduction;
	      }
	      this.__iterate(function(v, k, c)  {
	        if (useFirst) {
	          useFirst = false;
	          reduction = v;
	        } else {
	          reduction = reducer.call(context, reduction, v, k, c);
	        }
	      });
	      return reduction;
	    },

	    reduceRight: function(reducer, initialReduction, context) {
	      var reversed = this.toKeyedSeq().reverse();
	      return reversed.reduce.apply(reversed, arguments);
	    },

	    reverse: function() {
	      return reify(this, reverseFactory(this, true));
	    },

	    slice: function(begin, end) {
	      return reify(this, sliceFactory(this, begin, end, true));
	    },

	    some: function(predicate, context) {
	      return !this.every(not(predicate), context);
	    },

	    sort: function(comparator) {
	      return reify(this, sortFactory(this, comparator));
	    },

	    values: function() {
	      return this.__iterator(ITERATE_VALUES);
	    },


	    // ### More sequential methods

	    butLast: function() {
	      return this.slice(0, -1);
	    },

	    isEmpty: function() {
	      return this.size !== undefined ? this.size === 0 : !this.some(function()  {return true});
	    },

	    count: function(predicate, context) {
	      return ensureSize(
	        predicate ? this.toSeq().filter(predicate, context) : this
	      );
	    },

	    countBy: function(grouper, context) {
	      return countByFactory(this, grouper, context);
	    },

	    equals: function(other) {
	      return deepEqual(this, other);
	    },

	    entrySeq: function() {
	      var iterable = this;
	      if (iterable._cache) {
	        // We cache as an entries array, so we can just return the cache!
	        return new ArraySeq(iterable._cache);
	      }
	      var entriesSequence = iterable.toSeq().map(entryMapper).toIndexedSeq();
	      entriesSequence.fromEntrySeq = function()  {return iterable.toSeq()};
	      return entriesSequence;
	    },

	    filterNot: function(predicate, context) {
	      return this.filter(not(predicate), context);
	    },

	    findLast: function(predicate, context, notSetValue) {
	      return this.toKeyedSeq().reverse().find(predicate, context, notSetValue);
	    },

	    first: function() {
	      return this.find(returnTrue);
	    },

	    flatMap: function(mapper, context) {
	      return reify(this, flatMapFactory(this, mapper, context));
	    },

	    flatten: function(depth) {
	      return reify(this, flattenFactory(this, depth, true));
	    },

	    fromEntrySeq: function() {
	      return new FromEntriesSequence(this);
	    },

	    get: function(searchKey, notSetValue) {
	      return this.find(function(_, key)  {return is(key, searchKey)}, undefined, notSetValue);
	    },

	    getIn: function(searchKeyPath, notSetValue) {
	      var nested = this;
	      // Note: in an ES6 environment, we would prefer:
	      // for (var key of searchKeyPath) {
	      var iter = forceIterator(searchKeyPath);
	      var step;
	      while (!(step = iter.next()).done) {
	        var key = step.value;
	        nested = nested && nested.get ? nested.get(key, NOT_SET) : NOT_SET;
	        if (nested === NOT_SET) {
	          return notSetValue;
	        }
	      }
	      return nested;
	    },

	    groupBy: function(grouper, context) {
	      return groupByFactory(this, grouper, context);
	    },

	    has: function(searchKey) {
	      return this.get(searchKey, NOT_SET) !== NOT_SET;
	    },

	    hasIn: function(searchKeyPath) {
	      return this.getIn(searchKeyPath, NOT_SET) !== NOT_SET;
	    },

	    isSubset: function(iter) {
	      iter = typeof iter.includes === 'function' ? iter : Iterable(iter);
	      return this.every(function(value ) {return iter.includes(value)});
	    },

	    isSuperset: function(iter) {
	      iter = typeof iter.isSubset === 'function' ? iter : Iterable(iter);
	      return iter.isSubset(this);
	    },

	    keySeq: function() {
	      return this.toSeq().map(keyMapper).toIndexedSeq();
	    },

	    last: function() {
	      return this.toSeq().reverse().first();
	    },

	    max: function(comparator) {
	      return maxFactory(this, comparator);
	    },

	    maxBy: function(mapper, comparator) {
	      return maxFactory(this, comparator, mapper);
	    },

	    min: function(comparator) {
	      return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator);
	    },

	    minBy: function(mapper, comparator) {
	      return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator, mapper);
	    },

	    rest: function() {
	      return this.slice(1);
	    },

	    skip: function(amount) {
	      return this.slice(Math.max(0, amount));
	    },

	    skipLast: function(amount) {
	      return reify(this, this.toSeq().reverse().skip(amount).reverse());
	    },

	    skipWhile: function(predicate, context) {
	      return reify(this, skipWhileFactory(this, predicate, context, true));
	    },

	    skipUntil: function(predicate, context) {
	      return this.skipWhile(not(predicate), context);
	    },

	    sortBy: function(mapper, comparator) {
	      return reify(this, sortFactory(this, comparator, mapper));
	    },

	    take: function(amount) {
	      return this.slice(0, Math.max(0, amount));
	    },

	    takeLast: function(amount) {
	      return reify(this, this.toSeq().reverse().take(amount).reverse());
	    },

	    takeWhile: function(predicate, context) {
	      return reify(this, takeWhileFactory(this, predicate, context));
	    },

	    takeUntil: function(predicate, context) {
	      return this.takeWhile(not(predicate), context);
	    },

	    valueSeq: function() {
	      return this.toIndexedSeq();
	    },


	    // ### Hashable Object

	    hashCode: function() {
	      return this.__hash || (this.__hash = hashIterable(this));
	    },


	    // ### Internal

	    // abstract __iterate(fn, reverse)

	    // abstract __iterator(type, reverse)
	  });

	  // var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
	  // var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
	  // var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
	  // var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';

	  var IterablePrototype = Iterable.prototype;
	  IterablePrototype[IS_ITERABLE_SENTINEL] = true;
	  IterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.values;
	  IterablePrototype.__toJS = IterablePrototype.toArray;
	  IterablePrototype.__toStringMapper = quoteString;
	  IterablePrototype.inspect =
	  IterablePrototype.toSource = function() { return this.toString(); };
	  IterablePrototype.chain = IterablePrototype.flatMap;

	  // Temporary warning about using length
	  (function () {
	    try {
	      Object.defineProperty(IterablePrototype, 'length', {
	        get: function () {
	          if (!Iterable.noLengthWarning) {
	            var stack;
	            try {
	              throw new Error();
	            } catch (error) {
	              stack = error.stack;
	            }
	            if (stack.indexOf('_wrapObject') === -1) {
	              console && console.warn && console.warn(
	                'iterable.length has been deprecated, '+
	                'use iterable.size or iterable.count(). '+
	                'This warning will become a silent error in a future version. ' +
	                stack
	              );
	              return this.size;
	            }
	          }
	        }
	      });
	    } catch (e) {}
	  })();



	  mixin(KeyedIterable, {

	    // ### More sequential methods

	    flip: function() {
	      return reify(this, flipFactory(this));
	    },

	    findKey: function(predicate, context) {
	      var entry = this.findEntry(predicate, context);
	      return entry && entry[0];
	    },

	    findLastKey: function(predicate, context) {
	      return this.toSeq().reverse().findKey(predicate, context);
	    },

	    keyOf: function(searchValue) {
	      return this.findKey(function(value ) {return is(value, searchValue)});
	    },

	    lastKeyOf: function(searchValue) {
	      return this.findLastKey(function(value ) {return is(value, searchValue)});
	    },

	    mapEntries: function(mapper, context) {var this$0 = this;
	      var iterations = 0;
	      return reify(this,
	        this.toSeq().map(
	          function(v, k)  {return mapper.call(context, [k, v], iterations++, this$0)}
	        ).fromEntrySeq()
	      );
	    },

	    mapKeys: function(mapper, context) {var this$0 = this;
	      return reify(this,
	        this.toSeq().flip().map(
	          function(k, v)  {return mapper.call(context, k, v, this$0)}
	        ).flip()
	      );
	    },

	  });

	  var KeyedIterablePrototype = KeyedIterable.prototype;
	  KeyedIterablePrototype[IS_KEYED_SENTINEL] = true;
	  KeyedIterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.entries;
	  KeyedIterablePrototype.__toJS = IterablePrototype.toObject;
	  KeyedIterablePrototype.__toStringMapper = function(v, k)  {return JSON.stringify(k) + ': ' + quoteString(v)};



	  mixin(IndexedIterable, {

	    // ### Conversion to other types

	    toKeyedSeq: function() {
	      return new ToKeyedSequence(this, false);
	    },


	    // ### ES6 Collection methods (ES6 Array and Map)

	    filter: function(predicate, context) {
	      return reify(this, filterFactory(this, predicate, context, false));
	    },

	    findIndex: function(predicate, context) {
	      var entry = this.findEntry(predicate, context);
	      return entry ? entry[0] : -1;
	    },

	    indexOf: function(searchValue) {
	      var key = this.toKeyedSeq().keyOf(searchValue);
	      return key === undefined ? -1 : key;
	    },

	    lastIndexOf: function(searchValue) {
	      return this.toSeq().reverse().indexOf(searchValue);
	    },

	    reverse: function() {
	      return reify(this, reverseFactory(this, false));
	    },

	    slice: function(begin, end) {
	      return reify(this, sliceFactory(this, begin, end, false));
	    },

	    splice: function(index, removeNum /*, ...values*/) {
	      var numArgs = arguments.length;
	      removeNum = Math.max(removeNum | 0, 0);
	      if (numArgs === 0 || (numArgs === 2 && !removeNum)) {
	        return this;
	      }
	      index = resolveBegin(index, this.size);
	      var spliced = this.slice(0, index);
	      return reify(
	        this,
	        numArgs === 1 ?
	          spliced :
	          spliced.concat(arrCopy(arguments, 2), this.slice(index + removeNum))
	      );
	    },


	    // ### More collection methods

	    findLastIndex: function(predicate, context) {
	      var key = this.toKeyedSeq().findLastKey(predicate, context);
	      return key === undefined ? -1 : key;
	    },

	    first: function() {
	      return this.get(0);
	    },

	    flatten: function(depth) {
	      return reify(this, flattenFactory(this, depth, false));
	    },

	    get: function(index, notSetValue) {
	      index = wrapIndex(this, index);
	      return (index < 0 || (this.size === Infinity ||
	          (this.size !== undefined && index > this.size))) ?
	        notSetValue :
	        this.find(function(_, key)  {return key === index}, undefined, notSetValue);
	    },

	    has: function(index) {
	      index = wrapIndex(this, index);
	      return index >= 0 && (this.size !== undefined ?
	        this.size === Infinity || index < this.size :
	        this.indexOf(index) !== -1
	      );
	    },

	    interpose: function(separator) {
	      return reify(this, interposeFactory(this, separator));
	    },

	    interleave: function(/*...iterables*/) {
	      var iterables = [this].concat(arrCopy(arguments));
	      var zipped = zipWithFactory(this.toSeq(), IndexedSeq.of, iterables);
	      var interleaved = zipped.flatten(true);
	      if (zipped.size) {
	        interleaved.size = zipped.size * iterables.length;
	      }
	      return reify(this, interleaved);
	    },

	    last: function() {
	      return this.get(-1);
	    },

	    skipWhile: function(predicate, context) {
	      return reify(this, skipWhileFactory(this, predicate, context, false));
	    },

	    zip: function(/*, ...iterables */) {
	      var iterables = [this].concat(arrCopy(arguments));
	      return reify(this, zipWithFactory(this, defaultZipper, iterables));
	    },

	    zipWith: function(zipper/*, ...iterables */) {
	      var iterables = arrCopy(arguments);
	      iterables[0] = this;
	      return reify(this, zipWithFactory(this, zipper, iterables));
	    },

	  });

	  IndexedIterable.prototype[IS_INDEXED_SENTINEL] = true;
	  IndexedIterable.prototype[IS_ORDERED_SENTINEL] = true;



	  mixin(SetIterable, {

	    // ### ES6 Collection methods (ES6 Array and Map)

	    get: function(value, notSetValue) {
	      return this.has(value) ? value : notSetValue;
	    },

	    includes: function(value) {
	      return this.has(value);
	    },


	    // ### More sequential methods

	    keySeq: function() {
	      return this.valueSeq();
	    },

	  });

	  SetIterable.prototype.has = IterablePrototype.includes;


	  // Mixin subclasses

	  mixin(KeyedSeq, KeyedIterable.prototype);
	  mixin(IndexedSeq, IndexedIterable.prototype);
	  mixin(SetSeq, SetIterable.prototype);

	  mixin(KeyedCollection, KeyedIterable.prototype);
	  mixin(IndexedCollection, IndexedIterable.prototype);
	  mixin(SetCollection, SetIterable.prototype);


	  // #pragma Helper functions

	  function keyMapper(v, k) {
	    return k;
	  }

	  function entryMapper(v, k) {
	    return [k, v];
	  }

	  function not(predicate) {
	    return function() {
	      return !predicate.apply(this, arguments);
	    }
	  }

	  function neg(predicate) {
	    return function() {
	      return -predicate.apply(this, arguments);
	    }
	  }

	  function quoteString(value) {
	    return typeof value === 'string' ? JSON.stringify(value) : value;
	  }

	  function defaultZipper() {
	    return arrCopy(arguments);
	  }

	  function defaultNegComparator(a, b) {
	    return a < b ? 1 : a > b ? -1 : 0;
	  }

	  function hashIterable(iterable) {
	    if (iterable.size === Infinity) {
	      return 0;
	    }
	    var ordered = isOrdered(iterable);
	    var keyed = isKeyed(iterable);
	    var h = ordered ? 1 : 0;
	    var size = iterable.__iterate(
	      keyed ?
	        ordered ?
	          function(v, k)  { h = 31 * h + hashMerge(hash(v), hash(k)) | 0; } :
	          function(v, k)  { h = h + hashMerge(hash(v), hash(k)) | 0; } :
	        ordered ?
	          function(v ) { h = 31 * h + hash(v) | 0; } :
	          function(v ) { h = h + hash(v) | 0; }
	    );
	    return murmurHashOfSize(size, h);
	  }

	  function murmurHashOfSize(size, h) {
	    h = src_Math__imul(h, 0xCC9E2D51);
	    h = src_Math__imul(h << 15 | h >>> -15, 0x1B873593);
	    h = src_Math__imul(h << 13 | h >>> -13, 5);
	    h = (h + 0xE6546B64 | 0) ^ size;
	    h = src_Math__imul(h ^ h >>> 16, 0x85EBCA6B);
	    h = src_Math__imul(h ^ h >>> 13, 0xC2B2AE35);
	    h = smi(h ^ h >>> 16);
	    return h;
	  }

	  function hashMerge(a, b) {
	    return a ^ b + 0x9E3779B9 + (a << 6) + (a >> 2) | 0; // int
	  }

	  var Immutable = {

	    Iterable: Iterable,

	    Seq: Seq,
	    Collection: Collection,
	    Map: src_Map__Map,
	    OrderedMap: OrderedMap,
	    List: List,
	    Stack: Stack,
	    Set: src_Set__Set,
	    OrderedSet: OrderedSet,

	    Record: Record,
	    Range: Range,
	    Repeat: Repeat,

	    is: is,
	    fromJS: fromJS,

	  };

	  return Immutable;

	}));

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * Checks if the passed in value is a string
	 * @param {*} val
	 * @return {boolean}
	 */
	exports.isString = function(val) {
	  return typeof val === 'string' || objectToString(val) === '[object String]'
	}

	/**
	 * Checks if the passed in value is an array
	 * @param {*} val
	 * @return {boolean}
	 */
	exports.isArray = Array.isArray /* istanbul ignore next */|| function(val) {
	  return objectToString(val) === '[object Array]'
	}

	// taken from underscore source to account for browser discrepancy
	/* istanbul ignore if  */
	if (typeof /./ !== 'function' && typeof Int8Array !== 'object') {
	  /**
	   * Checks if the passed in value is a function
	   * @param {*} val
	   * @return {boolean}
	   */
	  exports.isFunction = function(obj) {
	    return typeof obj === 'function' || false
	  }
	} else {
	  /**
	   * Checks if the passed in value is a function
	   * @param {*} val
	   * @return {boolean}
	   */
	  exports.isFunction = function(val) {
	    return toString.call(val) === '[object Function]'
	  }
	}

	/**
	 * Checks if the passed in value is of type Object
	 * @param {*} val
	 * @return {boolean}
	 */
	exports.isObject = function(obj) {
	  var type = typeof obj
	  return type === 'function' || type === 'object' && !!obj
	}

	/**
	 * Extends an object with the properties of additional objects
	 * @param {object} obj
	 * @param {object} objects
	 * @return {object}
	 */
	exports.extend = function(obj) {
	  var length = arguments.length

	  if (!obj || length < 2) {
	    return obj || {}
	  }

	  for (var index = 1; index < length; index++) {
	    var source = arguments[index]
	    var keys = Object.keys(source)
	    var l = keys.length

	    for (var i = 0; i < l; i++) {
	      var key = keys[i]
	      obj[key] = source[key]
	    }
	  }

	  return obj
	}

	/**
	 * Creates a shallow clone of an object
	 * @param {object} obj
	 * @return {object}
	 */
	exports.clone = function(obj) {
	  if (!exports.isObject(obj)) {
	    return obj
	  }
	  return exports.isArray(obj) ? obj.slice() : exports.extend({}, obj)
	}

	/**
	 * Iterates over a collection of elements yielding each iteration to an
	 * iteratee. The iteratee may be bound to the context argument and is invoked
	 * each time with three arguments (value, index|key, collection). Iteration may
	 * be exited early by explicitly returning false.
	 * @param {array|object|string} collection
	 * @param {function} iteratee
	 * @param {*} context
	 * @return {array|object|string}
	 */
	exports.each = function(collection, iteratee, context) {
	  var length = collection ? collection.length : 0
	  var i = -1
	  var keys
	  var origIteratee

	  if (context) {
	    origIteratee = iteratee
	    iteratee = function(value, index, innerCollection) {
	      return origIteratee.call(context, value, index, innerCollection)
	    }
	  }

	  if (isLength(length)) {
	    while (++i < length) {
	      if (iteratee(collection[i], i, collection) === false) {
	        break
	      }
	    }
	  } else {
	    keys = Object.keys(collection)
	    length = keys.length
	    while (++i < length) {
	      if (iteratee(collection[keys[i]], keys[i], collection) === false) {
	        break
	      }
	    }
	  }

	  return collection
	}

	/**
	 * Returns a new function the invokes `func` with `partialArgs` prepended to
	 * any passed into the new function. Acts like `Array.prototype.bind`, except
	 * it does not alter `this` context.
	 * @param {function} func
	 * @param {*} partialArgs
	 * @return {function}
	 */
	exports.partial = function(func) {
	  var slice = Array.prototype.slice
	  var partialArgs = slice.call(arguments, 1)

	  return function() {
	    return func.apply(this, partialArgs.concat(slice.call(arguments)))
	  }
	}

	/**
	 * Returns the text value representation of an object
	 * @private
	 * @param {*} obj
	 * @return {string}
	 */
	function objectToString(obj) {
	  return obj && typeof obj === 'object' && toString.call(obj)
	}

	/**
	 * Checks if the value is a valid array-like length.
	 * @private
	 * @param {*} val
	 * @return {bool}
	 */
	function isLength(val) {
	  return typeof val === 'number'
	    && val > -1
	    && val % 1 === 0
	    && val <= Number.MAX_VALUE
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Immutable = __webpack_require__(2)
	var logging = __webpack_require__(5)
	var ChangeObserver = __webpack_require__(6)
	var Getter = __webpack_require__(9)
	var KeyPath = __webpack_require__(10)
	var Evaluator = __webpack_require__(11)
	var createReactMixin = __webpack_require__(12)

	// helper fns
	var toJS = __webpack_require__(1).toJS
	var toImmutable = __webpack_require__(1).toImmutable
	var isImmutableValue = __webpack_require__(1).isImmutableValue
	var each = __webpack_require__(3).each


	/**
	 * State is stored in NuclearJS Reactors.  Reactors
	 * contain a 'state' object which is an Immutable.Map
	 *
	 * The only way Reactors can change state is by reacting to
	 * messages.  To update state, Reactor's dispatch messages to
	 * all registered cores, and the core returns it's new
	 * state based on the message
	 */

	  function Reactor(config) {"use strict";
	    if (!(this instanceof Reactor)) {
	      return new Reactor(config)
	    }
	    config = config || {}

	    this.debug = !!config.debug

	    this.ReactMixin = createReactMixin(this)
	    /**
	     * The state for the whole cluster
	     */
	    this.state = Immutable.Map({})
	    /**
	     * Holds a map of id => store instance
	     */
	    this.__stores = Immutable.Map({})

	    this.__evaluator = new Evaluator()
	    /**
	     * Change observer interface to observe certain keypaths
	     * Created after __initialize so it starts with initialState
	     */
	    this.__changeObserver = new ChangeObserver(this.state, this.__evaluator)

	    // keep track of the depth of batch nesting
	    this.__batchDepth = 0
	    // number of dispatches in the top most batch cycle
	    this.__batchDispatchCount = 0

	    // keep track if we are currently dispatching
	    this.__isDispatching = false
	  }

	  /**
	   * Evaluates a KeyPath or Getter in context of the reactor state
	   * @param {KeyPath|Getter} keyPathOrGetter
	   * @return {*}
	   */
	  Object.defineProperty(Reactor.prototype,"evaluate",{writable:true,configurable:true,value:function(keyPathOrGetter) {"use strict";
	    return this.__evaluator.evaluate(this.state, keyPathOrGetter)
	  }});

	  /**
	   * Gets the coerced state (to JS object) of the reactor.evaluate
	   * @param {KeyPath|Getter} keyPathOrGetter
	   * @return {*}
	   */
	  Object.defineProperty(Reactor.prototype,"evaluateToJS",{writable:true,configurable:true,value:function(keyPathOrGetter) {"use strict";
	    return toJS(this.evaluate(keyPathOrGetter))
	  }});

	  /**
	   * Adds a change observer whenever a certain part of the reactor state changes
	   *
	   * 1. observe(handlerFn) - 1 argument, called anytime reactor.state changes
	   * 2. observe(keyPath, handlerFn) same as above
	   * 3. observe(getter, handlerFn) called whenever any getter dependencies change with
	   *    the value of the getter
	   *
	   * Adds a change handler whenever certain deps change
	   * If only one argument is passed invoked the handler whenever
	   * the reactor state changes
	   *
	   * @param {KeyPath|Getter} getter
	   * @param {function} handler
	   * @return {function} unwatch function
	   */
	  Object.defineProperty(Reactor.prototype,"observe",{writable:true,configurable:true,value:function(getter, handler) {"use strict";
	    if (arguments.length === 1) {
	      handler = getter
	      getter = Getter.fromKeyPath([])
	    } else if (KeyPath.isKeyPath(getter)) {
	      getter = Getter.fromKeyPath(getter)
	    }
	    return this.__changeObserver.onChange(getter, handler)
	  }});


	  /**
	   * Dispatches a single message
	   * @param {string} actionType
	   * @param {object|undefined} payload
	   */
	  Object.defineProperty(Reactor.prototype,"dispatch",{writable:true,configurable:true,value:function(actionType, payload) {"use strict";
	    if (this.__batchDepth === 0) {
	      if (this.__isDispatching) {
	        this.__isDispatching = false
	        throw new Error('Dispatch may not be called while a dispatch is in progress')
	      }
	      this.__isDispatching = true
	    }

	    var prevState = this.state

	    try {
	      this.state = this.__handleAction(prevState, actionType, payload)
	    } catch (e) {
	      this.__isDispatching = false
	      throw e
	    }


	    if (this.__batchDepth > 0) {
	      this.__batchDispatchCount++
	    } else {
	      if (this.state !== prevState) {
	        try {
	          this.__notify()
	        } catch (e) {
	          this.__isDispatching = false
	          throw e
	        }
	      }
	      this.__isDispatching = false
	    }
	  }});

	  /**
	   * Allows batching of dispatches before notifying change observers
	   * @param {Function} fn
	   */
	  Object.defineProperty(Reactor.prototype,"batch",{writable:true,configurable:true,value:function(fn) {"use strict";
	    this.__batchStart()
	    fn()
	    this.__batchEnd()
	  }});

	  /**
	   * @deprecated
	   * @param {String} id
	   * @param {Store} store
	   */
	  Object.defineProperty(Reactor.prototype,"registerStore",{writable:true,configurable:true,value:function(id, store) {"use strict";
	    /* eslint-disable no-console */
	    console.warn('Deprecation warning: `registerStore` will no longer be supported in 1.1, use `registerStores` instead')
	    /* eslint-enable no-console */
	    var stores = {}
	    stores[id] = store
	    this.registerStores(stores)
	  }});

	  /**
	   * @param {Store[]} stores
	   */
	  Object.defineProperty(Reactor.prototype,"registerStores",{writable:true,configurable:true,value:function(stores) {"use strict";
	    each(stores, function(store, id)  {
	      if (this.__stores.get(id)) {
	        /* eslint-disable no-console */
	        console.warn('Store already defined for id = ' + id)
	        /* eslint-enable no-console */
	      }

	      var initialState = store.getInitialState()

	      if (this.debug && !isImmutableValue(initialState)) {
	        throw new Error('Store getInitialState() must return an immutable value, did you forget to call toImmutable')
	      }

	      this.__stores = this.__stores.set(id, store)
	      this.state = this.state.set(id, initialState)
	    }.bind(this))

	    this.__notify()
	  }});

	  /**
	   * Returns a plain object representing the application state
	   * @return {Object}
	   */
	  Object.defineProperty(Reactor.prototype,"serialize",{writable:true,configurable:true,value:function() {"use strict";
	    var serialized = {}
	    this.__stores.forEach(function(store, id)  {
	      var storeState = this.state.get(id)
	      var serializedState = store.serialize(storeState)
	      if (serializedState !== undefined) {
	        serialized[id] = serializedState
	      }
	    }.bind(this))
	    return serialized
	  }});

	  /**
	   * @param {Object} state
	   */
	  Object.defineProperty(Reactor.prototype,"loadState",{writable:true,configurable:true,value:function(state) {"use strict";
	    var stateToLoad = toImmutable({}).withMutations(function(stateToLoad)  {
	      each(state, function(serializedStoreState, storeId)  {
	        var store = this.__stores.get(storeId)
	        if (store) {
	          var storeState = store.deserialize(serializedStoreState)
	          if (storeState !== undefined) {
	            stateToLoad.set(storeId, storeState)
	          }
	        }
	      }.bind(this))
	    }.bind(this))

	    this.state = this.state.merge(stateToLoad)
	    this.__notify()
	  }});

	  /**
	   * Resets the state of a reactor and returns back to initial state
	   */
	  Object.defineProperty(Reactor.prototype,"reset",{writable:true,configurable:true,value:function() {"use strict";
	    var debug = this.debug
	    var prevState = this.state

	    this.state = Immutable.Map().withMutations(function(state)  {
	      this.__stores.forEach(function(store, id)  {
	        var storeState = prevState.get(id)
	        var resetStoreState = store.handleReset(storeState)
	        if (debug && resetStoreState === undefined) {
	          throw new Error('Store handleReset() must return a value, did you forget a return statement')
	        }
	        if (debug && !isImmutableValue(resetStoreState)) {
	          throw new Error('Store reset state must be an immutable value, did you forget to call toImmutable')
	        }
	        state.set(id, resetStoreState)
	      })
	    }.bind(this))

	    this.__evaluator.reset()
	    this.__changeObserver.reset(this.state)
	  }});

	  /**
	   * Notifies all change observers with the current state
	   * @private
	   */
	  Object.defineProperty(Reactor.prototype,"__notify",{writable:true,configurable:true,value:function() {"use strict";
	    this.__changeObserver.notifyObservers(this.state)
	  }});

	  /**
	   * Reduces the current state to the new state given actionType / message
	   * @param {string} actionType
	   * @param {object|undefined} payload
	   * @return {Immutable.Map}
	   */
	  Object.defineProperty(Reactor.prototype,"__handleAction",{writable:true,configurable:true,value:function(state, actionType, payload) {"use strict";
	    return state.withMutations(function(state)  {
	      if (this.debug) {
	        logging.dispatchStart(actionType, payload)
	      }

	      // let each store handle the message
	      this.__stores.forEach(function(store, id)  {
	        var currState = state.get(id)
	        var newState

	        try {
	          newState = store.handle(currState, actionType, payload)
	        } catch(e) {
	          // ensure console.group is properly closed
	          logging.dispatchError(e.message)
	          throw e
	        }

	        if (this.debug && newState === undefined) {
	          var errorMsg = 'Store handler must return a value, did you forget a return statement'
	          logging.dispatchError(errorMsg)
	          throw new Error(errorMsg)
	        }

	        state.set(id, newState)

	        if (this.debug) {
	          logging.storeHandled(id, currState, newState)
	        }
	      }.bind(this))

	      if (this.debug) {
	        logging.dispatchEnd(state)
	      }
	    }.bind(this))
	  }});

	  Object.defineProperty(Reactor.prototype,"__batchStart",{writable:true,configurable:true,value:function() {"use strict";
	    this.__batchDepth++
	  }});

	  Object.defineProperty(Reactor.prototype,"__batchEnd",{writable:true,configurable:true,value:function() {"use strict";
	    this.__batchDepth--

	    if (this.__batchDepth <= 0) {
	      if (this.__batchDispatchCount > 0) {
	        // set to true to catch if dispatch called from observer
	        this.__isDispatching = true
	        try {
	          this.__notify()
	        } catch (e) {
	          this.__isDispatching = false
	          throw e
	        }
	        this.__isDispatching = false
	      }
	      this.__batchDispatchCount = 0
	    }
	  }});


	module.exports = Reactor


/***/ },
/* 5 */
/***/ function(module, exports) {

	/* eslint-disable no-console */
	/**
	 * Wraps a Reactor.react invocation in a console.group
	*/
	exports.dispatchStart = function(type, payload) {
	  if (console.group) {
	    console.groupCollapsed('Dispatch: %s', type)
	    console.group('payload')
	    console.debug(payload)
	    console.groupEnd()
	  }
	}

	exports.dispatchError = function(error) {
	  if (console.group) {
	    console.debug('Dispatch error: ' + error)
	    console.groupEnd()
	  }
	}

	exports.storeHandled = function(id, before, after) {
	  if (console.group) {
	    if (before !== after) {
	      console.debug('Store ' + id + ' handled action')
	    }
	  }
	}

	exports.dispatchEnd = function(state) {
	  if (console.group) {
	    console.debug('Dispatch done, new state: ', state.toJS())
	    console.groupEnd()
	  }
	}
	/* eslint-enable no-console */


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Immutable = __webpack_require__(2)
	var hashCode = __webpack_require__(7)
	var isEqual = __webpack_require__(8)

	/**
	 * ChangeObserver is an object that contains a set of subscriptions
	 * to changes for keyPaths on a reactor
	 *
	 * Packaging the handlers together allows for easier cleanup
	 */

	  /**
	   * @param {Immutable.Map} initialState
	   * @param {Evaluator} evaluator
	   */
	  function ChangeObserver(initialState, evaluator) {"use strict";
	    this.__prevState = initialState
	    this.__evaluator = evaluator
	    this.__prevValues = Immutable.Map()
	    this.__observers = []
	  }

	  /**
	   * @param {Immutable.Map} newState
	   */
	  Object.defineProperty(ChangeObserver.prototype,"notifyObservers",{writable:true,configurable:true,value:function(newState) {"use strict";
	    if (this.__observers.length > 0) {
	      var currentValues = Immutable.Map()

	      this.__observers.forEach(function(entry)  {
	        var getter = entry.getter
	        var code = hashCode(getter)
	        var prevState = this.__prevState
	        var prevValue

	        if (this.__prevValues.has(code)) {
	          prevValue = this.__prevValues.get(code)
	        } else {
	          prevValue = this.__evaluator.evaluate(prevState, getter)
	          this.__prevValues = this.__prevValues.set(code, prevValue)
	        }

	        var currValue = this.__evaluator.evaluate(newState, getter)

	        if (!isEqual(prevValue, currValue)) {
	          entry.handler.call(null, currValue)
	          currentValues = currentValues.set(code, currValue)
	        }
	      }.bind(this))

	      this.__prevValues = currentValues
	    }
	    this.__prevState = newState
	  }});

	  /**
	   * Specify a getter and a change handler function
	   * Handler function is called whenever the value of the getter changes
	   * @param {Getter} getter
	   * @param {function} handler
	   * @return {function} unwatch function
	   */
	  Object.defineProperty(ChangeObserver.prototype,"onChange",{writable:true,configurable:true,value:function(getter, handler) {"use strict";
	    // TODO: make observers a map of <Getter> => { handlers }
	    var entry = {
	      getter: getter,
	      handler: handler,
	    }
	    this.__observers.push(entry)
	    // return unwatch function
	    return function()  {
	      // TODO: untrack from change emitter
	      var ind = this.__observers.indexOf(entry)
	      if (ind > -1) {
	        this.__observers.splice(ind, 1)
	      }
	    }.bind(this)
	  }});

	  /**
	   * Resets and clears all observers and reinitializes back to the supplied
	   * previous state
	   * @param {Immutable.Map} prevState
	   *
	   */
	  Object.defineProperty(ChangeObserver.prototype,"reset",{writable:true,configurable:true,value:function(prevState) {"use strict";
	    this.__prevState = prevState
	    this.__prevValues = Immutable.Map()
	    this.__observers = []
	  }});


	module.exports = ChangeObserver


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Immutable = __webpack_require__(2)

	/**
	 * Takes a getter and returns the hash code value
	 *
	 * If cache argument is true it will freeze the getter
	 * and cache the hashed value
	 *
	 * @param {Getter} getter
	 * @param {boolean} dontCache
	 * @return {number}
	 */
	module.exports = function(getter, dontCache) {
	  if (getter.hasOwnProperty('__hashCode')) {
	    return getter.__hashCode
	  }

	  var hashCode = Immutable.fromJS(getter).hashCode()

	  if (!dontCache) {
	    Object.defineProperty(getter, '__hashCode', {
	      enumerable: false,
	      configurable: false,
	      writable: false,
	      value: hashCode,
	    })

	    Object.freeze(getter)
	  }

	  return hashCode
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Immutable = __webpack_require__(2)
	/**
	 * Is equal by value check
	 */
	module.exports = function(a, b) {
	  return Immutable.is(a, b)
	}


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(3).isFunction
	var isArray = __webpack_require__(3).isArray
	var isKeyPath = __webpack_require__(10).isKeyPath

	/**
	 * Getter helper functions
	 * A getter is an array with the form:
	 * [<KeyPath>, ...<KeyPath>, <function>]
	 */
	var identity = function(x)  {return x;}

	/**
	 * Checks if something is a getter literal, ex: ['dep1', 'dep2', function(dep1, dep2) {...}]
	 * @param {*} toTest
	 * @return {boolean}
	 */
	function isGetter(toTest) {
	  return (isArray(toTest) && isFunction(toTest[toTest.length - 1]))
	}

	/**
	 * Returns the compute function from a getter
	 * @param {Getter} getter
	 * @return {function}
	 */
	function getComputeFn(getter) {
	  return getter[getter.length - 1]
	}

	/**
	 * Returns an array of deps from a getter
	 * @param {Getter} getter
	 * @return {function}
	 */
	function getDeps(getter) {
	  return getter.slice(0, getter.length - 1)
	}

	/**
	 * @param {KeyPath}
	 * @return {Getter}
	 */
	function fromKeyPath(keyPath) {
	  if (!isKeyPath(keyPath)) {
	    throw new Error('Cannot create Getter from KeyPath: ' + keyPath)
	  }

	  return [keyPath, identity]
	}


	module.exports = {
	  isGetter: isGetter,
	  getComputeFn: getComputeFn,
	  getDeps: getDeps,
	  fromKeyPath: fromKeyPath,
	}


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(3).isArray
	var isFunction = __webpack_require__(3).isFunction

	/**
	 * Checks if something is simply a keyPath and not a getter
	 * @param {*} toTest
	 * @return {boolean}
	 */
	exports.isKeyPath = function(toTest) {
	  return (
	    isArray(toTest) &&
	    !isFunction(toTest[toTest.length - 1])
	  )
	}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var Immutable = __webpack_require__(2)
	var toImmutable = __webpack_require__(1).toImmutable
	var hashCode = __webpack_require__(7)
	var isEqual = __webpack_require__(8)
	var getComputeFn = __webpack_require__(9).getComputeFn
	var getDeps = __webpack_require__(9).getDeps
	var isKeyPath = __webpack_require__(10).isKeyPath
	var isGetter = __webpack_require__(9).isGetter

	// Keep track of whether we are currently executing a Getter's computeFn
	var __applyingComputeFn = false


	  function Evaluator() {"use strict";
	    /**
	     * {
	     *   <hashCode>: {
	     *     stateHashCode: number,
	     *     args: Immutable.List,
	     *     value: any,
	     *   }
	     * }
	     */
	    this.__cachedGetters = Immutable.Map({})
	  }

	  /**
	   * Takes either a KeyPath or Getter and evaluates
	   *
	   * KeyPath form:
	   * ['foo', 'bar'] => state.getIn(['foo', 'bar'])
	   *
	   * Getter form:
	   * [<KeyPath>, <KeyPath>, ..., <function>]
	   *
	   * @param {Immutable.Map} state
	   * @param {string|array} getter
	   * @return {any}
	   */
	  Object.defineProperty(Evaluator.prototype,"evaluate",{writable:true,configurable:true,value:function(state, keyPathOrGetter) {"use strict";
	    if (isKeyPath(keyPathOrGetter)) {
	      // if its a keyPath simply return
	      return state.getIn(keyPathOrGetter)
	    } else if (!isGetter(keyPathOrGetter)) {
	      throw new Error('evaluate must be passed a keyPath or Getter')
	    }

	    // Must be a Getter
	    var code = hashCode(keyPathOrGetter)

	    // if the value is cached for this dispatch cycle, return the cached value
	    if (this.__isCached(state, keyPathOrGetter)) {
	      // Cache hit
	      return this.__cachedGetters.getIn([code, 'value'])

	    }

	    // evaluate dependencies
	    var args = getDeps(keyPathOrGetter).map(function(dep)  {return this.evaluate(state, dep);}.bind(this))

	    if (this.__hasStaleValue(state, keyPathOrGetter)) {
	      // getter deps could still be unchanged since we only looked at the unwrapped (keypath, bottom level) deps
	      var prevArgs = this.__cachedGetters.getIn([code, 'args'])

	      // since Getter is a pure functions if the args are the same its a cache hit
	      if (isEqual(prevArgs, toImmutable(args))) {
	        var prevValue = this.__cachedGetters.getIn([code, 'value'])
	        this.__cacheValue(state, keyPathOrGetter, prevArgs, prevValue)
	        return prevValue
	      }
	    }

	    // This indicates that we have called evaluate within the body of a computeFn.
	    // Throw an error as this will lead to inconsistent caching
	    if (__applyingComputeFn === true) {
	      __applyingComputeFn = false
	      throw new Error('Evaluate may not be called within a Getters computeFn')
	    }

	    var evaluatedValue
	    __applyingComputeFn = true
	    try {
	      evaluatedValue = getComputeFn(keyPathOrGetter).apply(null, args)
	      __applyingComputeFn = false
	    } catch (e) {
	      __applyingComputeFn = false
	      throw e
	    }

	    this.__cacheValue(state, keyPathOrGetter, args, evaluatedValue)

	    return evaluatedValue
	  }});

	  /**
	   * @param {Immutable.Map} state
	   * @param {Getter} getter
	   */
	  Object.defineProperty(Evaluator.prototype,"__hasStaleValue",{writable:true,configurable:true,value:function(state, getter) {"use strict";
	    var code = hashCode(getter)
	    var cache = this.__cachedGetters
	    return (
	      cache.has(code) &&
	      cache.getIn([code, 'stateHashCode']) !== state.hashCode()
	    )
	  }});

	  /**
	   * Caches the value of a getter given state, getter, args, value
	   * @param {Immutable.Map} state
	   * @param {Getter} getter
	   * @param {Array} args
	   * @param {any} value
	   */
	  Object.defineProperty(Evaluator.prototype,"__cacheValue",{writable:true,configurable:true,value:function(state, getter, args, value) {"use strict";
	    var code = hashCode(getter)
	    this.__cachedGetters = this.__cachedGetters.set(code, Immutable.Map({
	      value: value,
	      args: toImmutable(args),
	      stateHashCode: state.hashCode(),
	    }))
	  }});

	  /**
	   * Returns boolean whether the supplied getter is cached for a given state
	   * @param {Immutable.Map} state
	   * @param {Getter} getter
	   * @return {boolean}
	   */
	  Object.defineProperty(Evaluator.prototype,"__isCached",{writable:true,configurable:true,value:function(state, getter) {"use strict";
	    var code = hashCode(getter)
	    return (
	      this.__cachedGetters.hasIn([code, 'value']) &&
	      this.__cachedGetters.getIn([code, 'stateHashCode']) === state.hashCode()
	    )
	  }});

	  /**
	   * Removes all caching about a getter
	   * @param {Getter}
	   */
	  Object.defineProperty(Evaluator.prototype,"untrack",{writable:true,configurable:true,value:function(getter) {"use strict";
	    // TODO: untrack all dependencies
	  }});

	  Object.defineProperty(Evaluator.prototype,"reset",{writable:true,configurable:true,value:function() {"use strict";
	    this.__cachedGetters = Immutable.Map({})
	  }});


	module.exports = Evaluator


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var each = __webpack_require__(3).each
	/**
	 * @param {Reactor} reactor
	 */
	module.exports = function(reactor) {
	  return {
	    getInitialState: function() {
	      return getState(reactor, this.getDataBindings())
	    },

	    componentDidMount: function() {
	      var component = this
	      component.__unwatchFns = []
	      each(this.getDataBindings(), function(getter, key) {
	        var unwatchFn = reactor.observe(getter, function(val) {
	          var newState = {}
	          newState[key] = val
	          component.setState(newState)
	        })

	        component.__unwatchFns.push(unwatchFn)
	      })
	    },

	    componentWillUnmount: function() {
	      while (this.__unwatchFns.length) {
	        this.__unwatchFns.shift()()
	      }
	    },
	  }
	}

	/**
	 * Returns a mapping of the getDataBinding keys to
	 * the reactor values
	 */
	function getState(reactor, data) {
	  var state = {}
	  each(data, function(value, key) {
	    state[key] = reactor.evaluate(value)
	  })
	  return state
	}


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var Map = __webpack_require__(2).Map
	var extend = __webpack_require__(3).extend
	var toJS = __webpack_require__(1).toJS
	var toImmutable = __webpack_require__(1).toImmutable

	/**
	 * Stores define how a certain domain of the application should respond to actions
	 * taken on the whole system.  They manage their own section of the entire app state
	 * and have no knowledge about the other parts of the application state.
	 */

	  function Store(config) {"use strict";
	    if (!(this instanceof Store)) {
	      return new Store(config)
	    }

	    this.__handlers = Map({})

	    if (config) {
	      // allow `MyStore extends Store` syntax without throwing error
	      extend(this, config)
	    }

	    this.initialize()
	  }

	  /**
	   * This method is overridden by extending classes to setup message handlers
	   * via `this.on` and to set up the initial state
	   *
	   * Anything returned from this function will be coerced into an ImmutableJS value
	   * and set as the initial state for the part of the ReactorCore
	   */
	  Object.defineProperty(Store.prototype,"initialize",{writable:true,configurable:true,value:function() {"use strict";
	    // extending classes implement to setup action handlers
	  }});

	  /**
	   * Overridable method to get the initial state for this type of store
	   */
	  Object.defineProperty(Store.prototype,"getInitialState",{writable:true,configurable:true,value:function() {"use strict";
	    return Map()
	  }});

	  /**
	   * Takes a current reactor state, action type and payload
	   * does the reaction and returns the new state
	   */
	  Object.defineProperty(Store.prototype,"handle",{writable:true,configurable:true,value:function(state, type, payload) {"use strict";
	    var handler = this.__handlers.get(type)

	    if (typeof handler === 'function') {
	      return handler.call(this, state, payload, type)
	    }

	    return state
	  }});

	  /**
	   * Pure function taking the current state of store and returning
	   * the new state after a NuclearJS reactor has been reset
	   *
	   * Overridable
	   */
	  Object.defineProperty(Store.prototype,"handleReset",{writable:true,configurable:true,value:function(state) {"use strict";
	    return this.getInitialState()
	  }});

	  /**
	   * Binds an action type => handler
	   */
	  Object.defineProperty(Store.prototype,"on",{writable:true,configurable:true,value:function(actionType, handler) {"use strict";
	    this.__handlers = this.__handlers.set(actionType, handler)
	  }});

	  /**
	   * Serializes store state to plain JSON serializable JavaScript
	   * Overridable
	   * @param {*}
	   * @return {*}
	   */
	  Object.defineProperty(Store.prototype,"serialize",{writable:true,configurable:true,value:function(state) {"use strict";
	    return toJS(state)
	  }});

	  /**
	   * Deserializes plain JavaScript to store state
	   * Overridable
	   * @param {*}
	   * @return {*}
	   */
	  Object.defineProperty(Store.prototype,"deserialize",{writable:true,configurable:true,value:function(state) {"use strict";
	    return toImmutable(state)
	  }});


	function isStore(toTest) {
	  return (toTest instanceof Store)
	}

	module.exports = Store

	module.exports.isStore = isStore


/***/ }
/******/ ])
});
;
},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _nuclearJs = require('nuclear-js');

var reactor = new _nuclearJs.Reactor({
    debug: true
});

exports['default'] = reactor;
module.exports = exports['default'];

},{"nuclear-js":2}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvaGFvY2h1YW4vbXlQcm9qZWN0cy9yZWFjdC1zdGFydC9zcmMvanMvQXBwLmpzIiwibm9kZV9tb2R1bGVzL251Y2xlYXItanMvZGlzdC9udWNsZWFyLmpzIiwiL1VzZXJzL2hhb2NodWFuL215UHJvamVjdHMvcmVhY3Qtc3RhcnQvc3JjL2pzL3JlYWN0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O3VCQ0FvQixXQUFXOzs7OztBQ0EvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7eUJDdmlNd0IsWUFBWTs7QUFFcEMsSUFBTSxPQUFPLEdBQUcsZUFGUCxPQUFPLENBRVk7QUFDeEIsU0FBSyxFQUFFLElBQUk7Q0FDZCxDQUFDLENBQUM7O3FCQUVZLE9BQU8iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHJlYWN0b3IgZnJvbSAnLi9yZWFjdG9yJzsiLCIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIk51Y2xlYXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiTnVjbGVhclwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIC8qKioqKiovIChmdW5jdGlvbihtb2R1bGVzKSB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuLyoqKioqKi8gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuLyoqKioqKi8gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuLyoqKioqKi8gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbi8qKioqKiovIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuLyoqKioqKi8gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbi8qKioqKiovIFx0XHRcdGV4cG9ydHM6IHt9LFxuLyoqKioqKi8gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuLyoqKioqKi8gXHRcdFx0bG9hZGVkOiBmYWxzZVxuLyoqKioqKi8gXHRcdH07XG5cbi8qKioqKiovIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbi8qKioqKiovIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuLyoqKioqKi8gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbi8qKioqKiovIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuLyoqKioqKi8gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4vKioqKioqLyBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuLyoqKioqKi8gXHR9XG5cblxuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4vKioqKioqLyBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbi8qKioqKiovIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuLyoqKioqKi8gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG4vKioqKioqLyB9KVxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIChbXG4vKiAwICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgaGVscGVycyA9IF9fd2VicGFja19yZXF1aXJlX18oMSlcblxuXHQvKipcblx0ICogQHJldHVybiB7UmVhY3Rvcn1cblx0ICovXG5cdGV4cG9ydHMuUmVhY3RvciA9IF9fd2VicGFja19yZXF1aXJlX18oNClcblxuXHQvKipcblx0ICogQHJldHVybiB7U3RvcmV9XG5cdCAqL1xuXHRleHBvcnRzLlN0b3JlID0gX193ZWJwYWNrX3JlcXVpcmVfXygxMylcblxuXHQvLyBleHBvcnQgdGhlIGltbXV0YWJsZSBsaWJyYXJ5XG5cdGV4cG9ydHMuSW1tdXRhYmxlID0gX193ZWJwYWNrX3JlcXVpcmVfXygyKVxuXG5cdC8qKlxuXHQgKiBAcmV0dXJuIHtib29sZWFufVxuXHQgKi9cblx0ZXhwb3J0cy5pc0tleVBhdGggPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEwKS5pc0tleVBhdGhcblxuXHQvKipcblx0ICogQHJldHVybiB7Ym9vbGVhbn1cblx0ICovXG5cdGV4cG9ydHMuaXNHZXR0ZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDkpLmlzR2V0dGVyXG5cblx0Ly8gZXhwb3NlIGhlbHBlciBmdW5jdGlvbnNcblx0ZXhwb3J0cy50b0pTID0gaGVscGVycy50b0pTXG5cdGV4cG9ydHMudG9JbW11dGFibGUgPSBoZWxwZXJzLnRvSW1tdXRhYmxlXG5cdGV4cG9ydHMuaXNJbW11dGFibGUgPSBoZWxwZXJzLmlzSW1tdXRhYmxlXG5cblx0ZXhwb3J0cy5jcmVhdGVSZWFjdE1peGluID0gX193ZWJwYWNrX3JlcXVpcmVfXygxMilcblxuXG4vKioqLyB9LFxuLyogMSAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIEltbXV0YWJsZSA9IF9fd2VicGFja19yZXF1aXJlX18oMilcblx0dmFyIGlzT2JqZWN0ID0gX193ZWJwYWNrX3JlcXVpcmVfXygzKS5pc09iamVjdFxuXG5cdC8qKlxuXHQgKiBBIGNvbGxlY3Rpb24gb2YgaGVscGVycyBmb3IgdGhlIEltbXV0YWJsZUpTIGxpYnJhcnlcblx0ICovXG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7Kn0gb2JqXG5cdCAqIEByZXR1cm4ge2Jvb2xlYW59XG5cdCAqL1xuXHRmdW5jdGlvbiBpc0ltbXV0YWJsZShvYmopIHtcblx0ICByZXR1cm4gSW1tdXRhYmxlLkl0ZXJhYmxlLmlzSXRlcmFibGUob2JqKVxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgdmFsdWUgaXMgYW4gSW1tdXRhYmxlSlMgZGF0YSBzdHJ1Y3R1cmVcblx0ICogb3IgYSBKYXZhU2NyaXB0IHByaW1pdGl2ZSB0aGF0IGlzIGltbXV0YWJsZSAoc3RyaW5nLCBudW1iZXIsIGV0Yylcblx0ICogQHBhcmFtIHsqfSBvYmpcblx0ICogQHJldHVybiB7Ym9vbGVhbn1cblx0ICovXG5cdGZ1bmN0aW9uIGlzSW1tdXRhYmxlVmFsdWUob2JqKSB7XG5cdCAgcmV0dXJuIChcblx0ICAgIGlzSW1tdXRhYmxlKG9iaikgfHxcblx0ICAgICFpc09iamVjdChvYmopXG5cdCAgKVxuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGFuIEltbXV0YWJsZSBTZXF1ZW5jZSB0byBKUyBvYmplY3Rcblx0ICogQ2FuIGJlIGNhbGxlZCBvbiBhbnkgdHlwZVxuXHQgKi9cblx0ZnVuY3Rpb24gdG9KUyhhcmcpIHtcblx0ICAvLyBhcmcgaW5zdGFuY2VvZiBJbW11dGFibGUuU2VxdWVuY2UgaXMgdW5yZWxpYWJsZVxuXHQgIHJldHVybiAoaXNJbW11dGFibGUoYXJnKSlcblx0ICAgID8gYXJnLnRvSlMoKVxuXHQgICAgOiBhcmdcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIEpTIG9iamVjdCB0byBhbiBJbW11dGFibGUgb2JqZWN0LCBpZiBpdCdzXG5cdCAqIGFscmVhZHkgSW1tdXRhYmxlIGl0cyBhIG5vLW9wXG5cdCAqL1xuXHRmdW5jdGlvbiB0b0ltbXV0YWJsZShhcmcpIHtcblx0ICByZXR1cm4gKGlzSW1tdXRhYmxlKGFyZykpXG5cdCAgICA/IGFyZ1xuXHQgICAgOiBJbW11dGFibGUuZnJvbUpTKGFyZylcblx0fVxuXG5cdGV4cG9ydHMudG9KUyA9IHRvSlNcblx0ZXhwb3J0cy50b0ltbXV0YWJsZSA9IHRvSW1tdXRhYmxlXG5cdGV4cG9ydHMuaXNJbW11dGFibGUgPSBpc0ltbXV0YWJsZVxuXHRleHBvcnRzLmlzSW1tdXRhYmxlVmFsdWUgPSBpc0ltbXV0YWJsZVZhbHVlXG5cblxuLyoqKi8gfSxcbi8qIDIgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdC8qKlxuXHQgKiAgQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG5cdCAqICBBbGwgcmlnaHRzIHJlc2VydmVkLlxuXHQgKlxuXHQgKiAgVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG5cdCAqICBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcblx0ICogIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuXHQgKi9cblx0KGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcblx0ICB0cnVlID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuXHQgIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG5cdCAgZ2xvYmFsLkltbXV0YWJsZSA9IGZhY3RvcnkoKVxuXHR9KHRoaXMsIGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO3ZhciBTTElDRSQwID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5cdCAgZnVuY3Rpb24gY3JlYXRlQ2xhc3MoY3Rvciwgc3VwZXJDbGFzcykge1xuXHQgICAgaWYgKHN1cGVyQ2xhc3MpIHtcblx0ICAgICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MucHJvdG90eXBlKTtcblx0ICAgIH1cblx0ICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3Rvcjtcblx0ICB9XG5cblx0ICAvLyBVc2VkIGZvciBzZXR0aW5nIHByb3RvdHlwZSBtZXRob2RzIHRoYXQgSUU4IGNob2tlcyBvbi5cblx0ICB2YXIgREVMRVRFID0gJ2RlbGV0ZSc7XG5cblx0ICAvLyBDb25zdGFudHMgZGVzY3JpYmluZyB0aGUgc2l6ZSBvZiB0cmllIG5vZGVzLlxuXHQgIHZhciBTSElGVCA9IDU7IC8vIFJlc3VsdGVkIGluIGJlc3QgcGVyZm9ybWFuY2UgYWZ0ZXIgX19fX19fP1xuXHQgIHZhciBTSVpFID0gMSA8PCBTSElGVDtcblx0ICB2YXIgTUFTSyA9IFNJWkUgLSAxO1xuXG5cdCAgLy8gQSBjb25zaXN0ZW50IHNoYXJlZCB2YWx1ZSByZXByZXNlbnRpbmcgXCJub3Qgc2V0XCIgd2hpY2ggZXF1YWxzIG5vdGhpbmcgb3RoZXJcblx0ICAvLyB0aGFuIGl0c2VsZiwgYW5kIG5vdGhpbmcgdGhhdCBjb3VsZCBiZSBwcm92aWRlZCBleHRlcm5hbGx5LlxuXHQgIHZhciBOT1RfU0VUID0ge307XG5cblx0ICAvLyBCb29sZWFuIHJlZmVyZW5jZXMsIFJvdWdoIGVxdWl2YWxlbnQgb2YgYGJvb2wgJmAuXG5cdCAgdmFyIENIQU5HRV9MRU5HVEggPSB7IHZhbHVlOiBmYWxzZSB9O1xuXHQgIHZhciBESURfQUxURVIgPSB7IHZhbHVlOiBmYWxzZSB9O1xuXG5cdCAgZnVuY3Rpb24gTWFrZVJlZihyZWYpIHtcblx0ICAgIHJlZi52YWx1ZSA9IGZhbHNlO1xuXHQgICAgcmV0dXJuIHJlZjtcblx0ICB9XG5cblx0ICBmdW5jdGlvbiBTZXRSZWYocmVmKSB7XG5cdCAgICByZWYgJiYgKHJlZi52YWx1ZSA9IHRydWUpO1xuXHQgIH1cblxuXHQgIC8vIEEgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhIHZhbHVlIHJlcHJlc2VudGluZyBhbiBcIm93bmVyXCIgZm9yIHRyYW5zaWVudCB3cml0ZXNcblx0ICAvLyB0byB0cmllcy4gVGhlIHJldHVybiB2YWx1ZSB3aWxsIG9ubHkgZXZlciBlcXVhbCBpdHNlbGYsIGFuZCB3aWxsIG5vdCBlcXVhbFxuXHQgIC8vIHRoZSByZXR1cm4gb2YgYW55IHN1YnNlcXVlbnQgY2FsbCBvZiB0aGlzIGZ1bmN0aW9uLlxuXHQgIGZ1bmN0aW9uIE93bmVySUQoKSB7fVxuXG5cdCAgLy8gaHR0cDovL2pzcGVyZi5jb20vY29weS1hcnJheS1pbmxpbmVcblx0ICBmdW5jdGlvbiBhcnJDb3B5KGFyciwgb2Zmc2V0KSB7XG5cdCAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMDtcblx0ICAgIHZhciBsZW4gPSBNYXRoLm1heCgwLCBhcnIubGVuZ3RoIC0gb2Zmc2V0KTtcblx0ICAgIHZhciBuZXdBcnIgPSBuZXcgQXJyYXkobGVuKTtcblx0ICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBsZW47IGlpKyspIHtcblx0ICAgICAgbmV3QXJyW2lpXSA9IGFycltpaSArIG9mZnNldF07XG5cdCAgICB9XG5cdCAgICByZXR1cm4gbmV3QXJyO1xuXHQgIH1cblxuXHQgIGZ1bmN0aW9uIGVuc3VyZVNpemUoaXRlcikge1xuXHQgICAgaWYgKGl0ZXIuc2l6ZSA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgIGl0ZXIuc2l6ZSA9IGl0ZXIuX19pdGVyYXRlKHJldHVyblRydWUpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGl0ZXIuc2l6ZTtcblx0ICB9XG5cblx0ICBmdW5jdGlvbiB3cmFwSW5kZXgoaXRlciwgaW5kZXgpIHtcblx0ICAgIHJldHVybiBpbmRleCA+PSAwID8gKCtpbmRleCkgOiBlbnN1cmVTaXplKGl0ZXIpICsgKCtpbmRleCk7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gcmV0dXJuVHJ1ZSgpIHtcblx0ICAgIHJldHVybiB0cnVlO1xuXHQgIH1cblxuXHQgIGZ1bmN0aW9uIHdob2xlU2xpY2UoYmVnaW4sIGVuZCwgc2l6ZSkge1xuXHQgICAgcmV0dXJuIChiZWdpbiA9PT0gMCB8fCAoc2l6ZSAhPT0gdW5kZWZpbmVkICYmIGJlZ2luIDw9IC1zaXplKSkgJiZcblx0ICAgICAgKGVuZCA9PT0gdW5kZWZpbmVkIHx8IChzaXplICE9PSB1bmRlZmluZWQgJiYgZW5kID49IHNpemUpKTtcblx0ICB9XG5cblx0ICBmdW5jdGlvbiByZXNvbHZlQmVnaW4oYmVnaW4sIHNpemUpIHtcblx0ICAgIHJldHVybiByZXNvbHZlSW5kZXgoYmVnaW4sIHNpemUsIDApO1xuXHQgIH1cblxuXHQgIGZ1bmN0aW9uIHJlc29sdmVFbmQoZW5kLCBzaXplKSB7XG5cdCAgICByZXR1cm4gcmVzb2x2ZUluZGV4KGVuZCwgc2l6ZSwgc2l6ZSk7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gcmVzb2x2ZUluZGV4KGluZGV4LCBzaXplLCBkZWZhdWx0SW5kZXgpIHtcblx0ICAgIHJldHVybiBpbmRleCA9PT0gdW5kZWZpbmVkID9cblx0ICAgICAgZGVmYXVsdEluZGV4IDpcblx0ICAgICAgaW5kZXggPCAwID9cblx0ICAgICAgICBNYXRoLm1heCgwLCBzaXplICsgaW5kZXgpIDpcblx0ICAgICAgICBzaXplID09PSB1bmRlZmluZWQgP1xuXHQgICAgICAgICAgaW5kZXggOlxuXHQgICAgICAgICAgTWF0aC5taW4oc2l6ZSwgaW5kZXgpO1xuXHQgIH1cblxuXHQgIGZ1bmN0aW9uIEl0ZXJhYmxlKHZhbHVlKSB7XG5cdCAgICAgIHJldHVybiBpc0l0ZXJhYmxlKHZhbHVlKSA/IHZhbHVlIDogU2VxKHZhbHVlKTtcblx0ICAgIH1cblxuXG5cdCAgY3JlYXRlQ2xhc3MoS2V5ZWRJdGVyYWJsZSwgSXRlcmFibGUpO1xuXHQgICAgZnVuY3Rpb24gS2V5ZWRJdGVyYWJsZSh2YWx1ZSkge1xuXHQgICAgICByZXR1cm4gaXNLZXllZCh2YWx1ZSkgPyB2YWx1ZSA6IEtleWVkU2VxKHZhbHVlKTtcblx0ICAgIH1cblxuXG5cdCAgY3JlYXRlQ2xhc3MoSW5kZXhlZEl0ZXJhYmxlLCBJdGVyYWJsZSk7XG5cdCAgICBmdW5jdGlvbiBJbmRleGVkSXRlcmFibGUodmFsdWUpIHtcblx0ICAgICAgcmV0dXJuIGlzSW5kZXhlZCh2YWx1ZSkgPyB2YWx1ZSA6IEluZGV4ZWRTZXEodmFsdWUpO1xuXHQgICAgfVxuXG5cblx0ICBjcmVhdGVDbGFzcyhTZXRJdGVyYWJsZSwgSXRlcmFibGUpO1xuXHQgICAgZnVuY3Rpb24gU2V0SXRlcmFibGUodmFsdWUpIHtcblx0ICAgICAgcmV0dXJuIGlzSXRlcmFibGUodmFsdWUpICYmICFpc0Fzc29jaWF0aXZlKHZhbHVlKSA/IHZhbHVlIDogU2V0U2VxKHZhbHVlKTtcblx0ICAgIH1cblxuXG5cblx0ICBmdW5jdGlvbiBpc0l0ZXJhYmxlKG1heWJlSXRlcmFibGUpIHtcblx0ICAgIHJldHVybiAhIShtYXliZUl0ZXJhYmxlICYmIG1heWJlSXRlcmFibGVbSVNfSVRFUkFCTEVfU0VOVElORUxdKTtcblx0ICB9XG5cblx0ICBmdW5jdGlvbiBpc0tleWVkKG1heWJlS2V5ZWQpIHtcblx0ICAgIHJldHVybiAhIShtYXliZUtleWVkICYmIG1heWJlS2V5ZWRbSVNfS0VZRURfU0VOVElORUxdKTtcblx0ICB9XG5cblx0ICBmdW5jdGlvbiBpc0luZGV4ZWQobWF5YmVJbmRleGVkKSB7XG5cdCAgICByZXR1cm4gISEobWF5YmVJbmRleGVkICYmIG1heWJlSW5kZXhlZFtJU19JTkRFWEVEX1NFTlRJTkVMXSk7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gaXNBc3NvY2lhdGl2ZShtYXliZUFzc29jaWF0aXZlKSB7XG5cdCAgICByZXR1cm4gaXNLZXllZChtYXliZUFzc29jaWF0aXZlKSB8fCBpc0luZGV4ZWQobWF5YmVBc3NvY2lhdGl2ZSk7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gaXNPcmRlcmVkKG1heWJlT3JkZXJlZCkge1xuXHQgICAgcmV0dXJuICEhKG1heWJlT3JkZXJlZCAmJiBtYXliZU9yZGVyZWRbSVNfT1JERVJFRF9TRU5USU5FTF0pO1xuXHQgIH1cblxuXHQgIEl0ZXJhYmxlLmlzSXRlcmFibGUgPSBpc0l0ZXJhYmxlO1xuXHQgIEl0ZXJhYmxlLmlzS2V5ZWQgPSBpc0tleWVkO1xuXHQgIEl0ZXJhYmxlLmlzSW5kZXhlZCA9IGlzSW5kZXhlZDtcblx0ICBJdGVyYWJsZS5pc0Fzc29jaWF0aXZlID0gaXNBc3NvY2lhdGl2ZTtcblx0ICBJdGVyYWJsZS5pc09yZGVyZWQgPSBpc09yZGVyZWQ7XG5cblx0ICBJdGVyYWJsZS5LZXllZCA9IEtleWVkSXRlcmFibGU7XG5cdCAgSXRlcmFibGUuSW5kZXhlZCA9IEluZGV4ZWRJdGVyYWJsZTtcblx0ICBJdGVyYWJsZS5TZXQgPSBTZXRJdGVyYWJsZTtcblxuXG5cdCAgdmFyIElTX0lURVJBQkxFX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfSVRFUkFCTEVfX0BAJztcblx0ICB2YXIgSVNfS0VZRURfU0VOVElORUwgPSAnQEBfX0lNTVVUQUJMRV9LRVlFRF9fQEAnO1xuXHQgIHZhciBJU19JTkRFWEVEX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfSU5ERVhFRF9fQEAnO1xuXHQgIHZhciBJU19PUkRFUkVEX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfT1JERVJFRF9fQEAnO1xuXG5cdCAgLyogZ2xvYmFsIFN5bWJvbCAqL1xuXG5cdCAgdmFyIElURVJBVEVfS0VZUyA9IDA7XG5cdCAgdmFyIElURVJBVEVfVkFMVUVTID0gMTtcblx0ICB2YXIgSVRFUkFURV9FTlRSSUVTID0gMjtcblxuXHQgIHZhciBSRUFMX0lURVJBVE9SX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLml0ZXJhdG9yO1xuXHQgIHZhciBGQVVYX0lURVJBVE9SX1NZTUJPTCA9ICdAQGl0ZXJhdG9yJztcblxuXHQgIHZhciBJVEVSQVRPUl9TWU1CT0wgPSBSRUFMX0lURVJBVE9SX1NZTUJPTCB8fCBGQVVYX0lURVJBVE9SX1NZTUJPTDtcblxuXG5cdCAgZnVuY3Rpb24gc3JjX0l0ZXJhdG9yX19JdGVyYXRvcihuZXh0KSB7XG5cdCAgICAgIHRoaXMubmV4dCA9IG5leHQ7XG5cdCAgICB9XG5cblx0ICAgIHNyY19JdGVyYXRvcl9fSXRlcmF0b3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG5cdCAgICAgIHJldHVybiAnW0l0ZXJhdG9yXSc7XG5cdCAgICB9O1xuXG5cblx0ICBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yLktFWVMgPSBJVEVSQVRFX0tFWVM7XG5cdCAgc3JjX0l0ZXJhdG9yX19JdGVyYXRvci5WQUxVRVMgPSBJVEVSQVRFX1ZBTFVFUztcblx0ICBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yLkVOVFJJRVMgPSBJVEVSQVRFX0VOVFJJRVM7XG5cblx0ICBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yLnByb3RvdHlwZS5pbnNwZWN0ID1cblx0ICBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yLnByb3RvdHlwZS50b1NvdXJjZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTsgfVxuXHQgIHNyY19JdGVyYXRvcl9fSXRlcmF0b3IucHJvdG90eXBlW0lURVJBVE9SX1NZTUJPTF0gPSBmdW5jdGlvbiAoKSB7XG5cdCAgICByZXR1cm4gdGhpcztcblx0ICB9O1xuXG5cblx0ICBmdW5jdGlvbiBpdGVyYXRvclZhbHVlKHR5cGUsIGssIHYsIGl0ZXJhdG9yUmVzdWx0KSB7XG5cdCAgICB2YXIgdmFsdWUgPSB0eXBlID09PSAwID8gayA6IHR5cGUgPT09IDEgPyB2IDogW2ssIHZdO1xuXHQgICAgaXRlcmF0b3JSZXN1bHQgPyAoaXRlcmF0b3JSZXN1bHQudmFsdWUgPSB2YWx1ZSkgOiAoaXRlcmF0b3JSZXN1bHQgPSB7XG5cdCAgICAgIHZhbHVlOiB2YWx1ZSwgZG9uZTogZmFsc2Vcblx0ICAgIH0pO1xuXHQgICAgcmV0dXJuIGl0ZXJhdG9yUmVzdWx0O1xuXHQgIH1cblxuXHQgIGZ1bmN0aW9uIGl0ZXJhdG9yRG9uZSgpIHtcblx0ICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcblx0ICB9XG5cblx0ICBmdW5jdGlvbiBoYXNJdGVyYXRvcihtYXliZUl0ZXJhYmxlKSB7XG5cdCAgICByZXR1cm4gISFnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpO1xuXHQgIH1cblxuXHQgIGZ1bmN0aW9uIGlzSXRlcmF0b3IobWF5YmVJdGVyYXRvcikge1xuXHQgICAgcmV0dXJuIG1heWJlSXRlcmF0b3IgJiYgdHlwZW9mIG1heWJlSXRlcmF0b3IubmV4dCA9PT0gJ2Z1bmN0aW9uJztcblx0ICB9XG5cblx0ICBmdW5jdGlvbiBnZXRJdGVyYXRvcihpdGVyYWJsZSkge1xuXHQgICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKGl0ZXJhYmxlKTtcblx0ICAgIHJldHVybiBpdGVyYXRvckZuICYmIGl0ZXJhdG9yRm4uY2FsbChpdGVyYWJsZSk7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gZ2V0SXRlcmF0b3JGbihpdGVyYWJsZSkge1xuXHQgICAgdmFyIGl0ZXJhdG9yRm4gPSBpdGVyYWJsZSAmJiAoXG5cdCAgICAgIChSRUFMX0lURVJBVE9SX1NZTUJPTCAmJiBpdGVyYWJsZVtSRUFMX0lURVJBVE9SX1NZTUJPTF0pIHx8XG5cdCAgICAgIGl0ZXJhYmxlW0ZBVVhfSVRFUkFUT1JfU1lNQk9MXVxuXHQgICAgKTtcblx0ICAgIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICByZXR1cm4gaXRlcmF0b3JGbjtcblx0ICAgIH1cblx0ICB9XG5cblx0ICBmdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuXHQgICAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS5sZW5ndGggPT09ICdudW1iZXInO1xuXHQgIH1cblxuXHQgIGNyZWF0ZUNsYXNzKFNlcSwgSXRlcmFibGUpO1xuXHQgICAgZnVuY3Rpb24gU2VxKHZhbHVlKSB7XG5cdCAgICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gZW1wdHlTZXF1ZW5jZSgpIDpcblx0ICAgICAgICBpc0l0ZXJhYmxlKHZhbHVlKSA/IHZhbHVlLnRvU2VxKCkgOiBzZXFGcm9tVmFsdWUodmFsdWUpO1xuXHQgICAgfVxuXG5cdCAgICBTZXEub2YgPSBmdW5jdGlvbigvKi4uLnZhbHVlcyovKSB7XG5cdCAgICAgIHJldHVybiBTZXEoYXJndW1lbnRzKTtcblx0ICAgIH07XG5cblx0ICAgIFNlcS5wcm90b3R5cGUudG9TZXEgPSBmdW5jdGlvbigpIHtcblx0ICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICB9O1xuXG5cdCAgICBTZXEucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG5cdCAgICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcoJ1NlcSB7JywgJ30nKTtcblx0ICAgIH07XG5cblx0ICAgIFNlcS5wcm90b3R5cGUuY2FjaGVSZXN1bHQgPSBmdW5jdGlvbigpIHtcblx0ICAgICAgaWYgKCF0aGlzLl9jYWNoZSAmJiB0aGlzLl9faXRlcmF0ZVVuY2FjaGVkKSB7XG5cdCAgICAgICAgdGhpcy5fY2FjaGUgPSB0aGlzLmVudHJ5U2VxKCkudG9BcnJheSgpO1xuXHQgICAgICAgIHRoaXMuc2l6ZSA9IHRoaXMuX2NhY2hlLmxlbmd0aDtcblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gdGhpcztcblx0ICAgIH07XG5cblx0ICAgIC8vIGFic3RyYWN0IF9faXRlcmF0ZVVuY2FjaGVkKGZuLCByZXZlcnNlKVxuXG5cdCAgICBTZXEucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7XG5cdCAgICAgIHJldHVybiBzZXFJdGVyYXRlKHRoaXMsIGZuLCByZXZlcnNlLCB0cnVlKTtcblx0ICAgIH07XG5cblx0ICAgIC8vIGFic3RyYWN0IF9faXRlcmF0b3JVbmNhY2hlZCh0eXBlLCByZXZlcnNlKVxuXG5cdCAgICBTZXEucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG5cdCAgICAgIHJldHVybiBzZXFJdGVyYXRvcih0aGlzLCB0eXBlLCByZXZlcnNlLCB0cnVlKTtcblx0ICAgIH07XG5cblxuXG5cdCAgY3JlYXRlQ2xhc3MoS2V5ZWRTZXEsIFNlcSk7XG5cdCAgICBmdW5jdGlvbiBLZXllZFNlcSh2YWx1ZSkge1xuXHQgICAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCA/XG5cdCAgICAgICAgZW1wdHlTZXF1ZW5jZSgpLnRvS2V5ZWRTZXEoKSA6XG5cdCAgICAgICAgaXNJdGVyYWJsZSh2YWx1ZSkgP1xuXHQgICAgICAgICAgKGlzS2V5ZWQodmFsdWUpID8gdmFsdWUudG9TZXEoKSA6IHZhbHVlLmZyb21FbnRyeVNlcSgpKSA6XG5cdCAgICAgICAgICBrZXllZFNlcUZyb21WYWx1ZSh2YWx1ZSk7XG5cdCAgICB9XG5cblx0ICAgIEtleWVkU2VxLnByb3RvdHlwZS50b0tleWVkU2VxID0gZnVuY3Rpb24oKSB7XG5cdCAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgfTtcblxuXG5cblx0ICBjcmVhdGVDbGFzcyhJbmRleGVkU2VxLCBTZXEpO1xuXHQgICAgZnVuY3Rpb24gSW5kZXhlZFNlcSh2YWx1ZSkge1xuXHQgICAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCA/IGVtcHR5U2VxdWVuY2UoKSA6XG5cdCAgICAgICAgIWlzSXRlcmFibGUodmFsdWUpID8gaW5kZXhlZFNlcUZyb21WYWx1ZSh2YWx1ZSkgOlxuXHQgICAgICAgIGlzS2V5ZWQodmFsdWUpID8gdmFsdWUuZW50cnlTZXEoKSA6IHZhbHVlLnRvSW5kZXhlZFNlcSgpO1xuXHQgICAgfVxuXG5cdCAgICBJbmRleGVkU2VxLm9mID0gZnVuY3Rpb24oLyouLi52YWx1ZXMqLykge1xuXHQgICAgICByZXR1cm4gSW5kZXhlZFNlcShhcmd1bWVudHMpO1xuXHQgICAgfTtcblxuXHQgICAgSW5kZXhlZFNlcS5wcm90b3R5cGUudG9JbmRleGVkU2VxID0gZnVuY3Rpb24oKSB7XG5cdCAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgfTtcblxuXHQgICAgSW5kZXhlZFNlcS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZygnU2VxIFsnLCAnXScpO1xuXHQgICAgfTtcblxuXHQgICAgSW5kZXhlZFNlcS5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHtcblx0ICAgICAgcmV0dXJuIHNlcUl0ZXJhdGUodGhpcywgZm4sIHJldmVyc2UsIGZhbHNlKTtcblx0ICAgIH07XG5cblx0ICAgIEluZGV4ZWRTZXEucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG5cdCAgICAgIHJldHVybiBzZXFJdGVyYXRvcih0aGlzLCB0eXBlLCByZXZlcnNlLCBmYWxzZSk7XG5cdCAgICB9O1xuXG5cblxuXHQgIGNyZWF0ZUNsYXNzKFNldFNlcSwgU2VxKTtcblx0ICAgIGZ1bmN0aW9uIFNldFNlcSh2YWx1ZSkge1xuXHQgICAgICByZXR1cm4gKFxuXHQgICAgICAgIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgPyBlbXB0eVNlcXVlbmNlKCkgOlxuXHQgICAgICAgICFpc0l0ZXJhYmxlKHZhbHVlKSA/IGluZGV4ZWRTZXFGcm9tVmFsdWUodmFsdWUpIDpcblx0ICAgICAgICBpc0tleWVkKHZhbHVlKSA/IHZhbHVlLmVudHJ5U2VxKCkgOiB2YWx1ZVxuXHQgICAgICApLnRvU2V0U2VxKCk7XG5cdCAgICB9XG5cblx0ICAgIFNldFNlcS5vZiA9IGZ1bmN0aW9uKC8qLi4udmFsdWVzKi8pIHtcblx0ICAgICAgcmV0dXJuIFNldFNlcShhcmd1bWVudHMpO1xuXHQgICAgfTtcblxuXHQgICAgU2V0U2VxLnByb3RvdHlwZS50b1NldFNlcSA9IGZ1bmN0aW9uKCkge1xuXHQgICAgICByZXR1cm4gdGhpcztcblx0ICAgIH07XG5cblxuXG5cdCAgU2VxLmlzU2VxID0gaXNTZXE7XG5cdCAgU2VxLktleWVkID0gS2V5ZWRTZXE7XG5cdCAgU2VxLlNldCA9IFNldFNlcTtcblx0ICBTZXEuSW5kZXhlZCA9IEluZGV4ZWRTZXE7XG5cblx0ICB2YXIgSVNfU0VRX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfU0VRX19AQCc7XG5cblx0ICBTZXEucHJvdG90eXBlW0lTX1NFUV9TRU5USU5FTF0gPSB0cnVlO1xuXG5cblxuXHQgIC8vICNwcmFnbWEgUm9vdCBTZXF1ZW5jZXNcblxuXHQgIGNyZWF0ZUNsYXNzKEFycmF5U2VxLCBJbmRleGVkU2VxKTtcblx0ICAgIGZ1bmN0aW9uIEFycmF5U2VxKGFycmF5KSB7XG5cdCAgICAgIHRoaXMuX2FycmF5ID0gYXJyYXk7XG5cdCAgICAgIHRoaXMuc2l6ZSA9IGFycmF5Lmxlbmd0aDtcblx0ICAgIH1cblxuXHQgICAgQXJyYXlTZXEucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGluZGV4LCBub3RTZXRWYWx1ZSkge1xuXHQgICAgICByZXR1cm4gdGhpcy5oYXMoaW5kZXgpID8gdGhpcy5fYXJyYXlbd3JhcEluZGV4KHRoaXMsIGluZGV4KV0gOiBub3RTZXRWYWx1ZTtcblx0ICAgIH07XG5cblx0ICAgIEFycmF5U2VxLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge1xuXHQgICAgICB2YXIgYXJyYXkgPSB0aGlzLl9hcnJheTtcblx0ICAgICAgdmFyIG1heEluZGV4ID0gYXJyYXkubGVuZ3RoIC0gMTtcblx0ICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8PSBtYXhJbmRleDsgaWkrKykge1xuXHQgICAgICAgIGlmIChmbihhcnJheVtyZXZlcnNlID8gbWF4SW5kZXggLSBpaSA6IGlpXSwgaWksIHRoaXMpID09PSBmYWxzZSkge1xuXHQgICAgICAgICAgcmV0dXJuIGlpICsgMTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIGlpO1xuXHQgICAgfTtcblxuXHQgICAgQXJyYXlTZXEucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG5cdCAgICAgIHZhciBhcnJheSA9IHRoaXMuX2FycmF5O1xuXHQgICAgICB2YXIgbWF4SW5kZXggPSBhcnJheS5sZW5ndGggLSAxO1xuXHQgICAgICB2YXIgaWkgPSAwO1xuXHQgICAgICByZXR1cm4gbmV3IHNyY19JdGVyYXRvcl9fSXRlcmF0b3IoZnVuY3Rpb24oKSBcblx0ICAgICAgICB7cmV0dXJuIGlpID4gbWF4SW5kZXggP1xuXHQgICAgICAgICAgaXRlcmF0b3JEb25lKCkgOlxuXHQgICAgICAgICAgaXRlcmF0b3JWYWx1ZSh0eXBlLCBpaSwgYXJyYXlbcmV2ZXJzZSA/IG1heEluZGV4IC0gaWkrKyA6IGlpKytdKX1cblx0ICAgICAgKTtcblx0ICAgIH07XG5cblxuXG5cdCAgY3JlYXRlQ2xhc3MoT2JqZWN0U2VxLCBLZXllZFNlcSk7XG5cdCAgICBmdW5jdGlvbiBPYmplY3RTZXEob2JqZWN0KSB7XG5cdCAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTtcblx0ICAgICAgdGhpcy5fb2JqZWN0ID0gb2JqZWN0O1xuXHQgICAgICB0aGlzLl9rZXlzID0ga2V5cztcblx0ICAgICAgdGhpcy5zaXplID0ga2V5cy5sZW5ndGg7XG5cdCAgICB9XG5cblx0ICAgIE9iamVjdFNlcS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oa2V5LCBub3RTZXRWYWx1ZSkge1xuXHQgICAgICBpZiAobm90U2V0VmFsdWUgIT09IHVuZGVmaW5lZCAmJiAhdGhpcy5oYXMoa2V5KSkge1xuXHQgICAgICAgIHJldHVybiBub3RTZXRWYWx1ZTtcblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gdGhpcy5fb2JqZWN0W2tleV07XG5cdCAgICB9O1xuXG5cdCAgICBPYmplY3RTZXEucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uKGtleSkge1xuXHQgICAgICByZXR1cm4gdGhpcy5fb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSk7XG5cdCAgICB9O1xuXG5cdCAgICBPYmplY3RTZXEucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7XG5cdCAgICAgIHZhciBvYmplY3QgPSB0aGlzLl9vYmplY3Q7XG5cdCAgICAgIHZhciBrZXlzID0gdGhpcy5fa2V5cztcblx0ICAgICAgdmFyIG1heEluZGV4ID0ga2V5cy5sZW5ndGggLSAxO1xuXHQgICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDw9IG1heEluZGV4OyBpaSsrKSB7XG5cdCAgICAgICAgdmFyIGtleSA9IGtleXNbcmV2ZXJzZSA/IG1heEluZGV4IC0gaWkgOiBpaV07XG5cdCAgICAgICAgaWYgKGZuKG9iamVjdFtrZXldLCBrZXksIHRoaXMpID09PSBmYWxzZSkge1xuXHQgICAgICAgICAgcmV0dXJuIGlpICsgMTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIGlpO1xuXHQgICAgfTtcblxuXHQgICAgT2JqZWN0U2VxLnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuXHQgICAgICB2YXIgb2JqZWN0ID0gdGhpcy5fb2JqZWN0O1xuXHQgICAgICB2YXIga2V5cyA9IHRoaXMuX2tleXM7XG5cdCAgICAgIHZhciBtYXhJbmRleCA9IGtleXMubGVuZ3RoIC0gMTtcblx0ICAgICAgdmFyIGlpID0gMDtcblx0ICAgICAgcmV0dXJuIG5ldyBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcblx0ICAgICAgICB2YXIga2V5ID0ga2V5c1tyZXZlcnNlID8gbWF4SW5kZXggLSBpaSA6IGlpXTtcblx0ICAgICAgICByZXR1cm4gaWkrKyA+IG1heEluZGV4ID9cblx0ICAgICAgICAgIGl0ZXJhdG9yRG9uZSgpIDpcblx0ICAgICAgICAgIGl0ZXJhdG9yVmFsdWUodHlwZSwga2V5LCBvYmplY3Rba2V5XSk7XG5cdCAgICAgIH0pO1xuXHQgICAgfTtcblxuXHQgIE9iamVjdFNlcS5wcm90b3R5cGVbSVNfT1JERVJFRF9TRU5USU5FTF0gPSB0cnVlO1xuXG5cblx0ICBjcmVhdGVDbGFzcyhJdGVyYWJsZVNlcSwgSW5kZXhlZFNlcSk7XG5cdCAgICBmdW5jdGlvbiBJdGVyYWJsZVNlcShpdGVyYWJsZSkge1xuXHQgICAgICB0aGlzLl9pdGVyYWJsZSA9IGl0ZXJhYmxlO1xuXHQgICAgICB0aGlzLnNpemUgPSBpdGVyYWJsZS5sZW5ndGggfHwgaXRlcmFibGUuc2l6ZTtcblx0ICAgIH1cblxuXHQgICAgSXRlcmFibGVTZXEucHJvdG90eXBlLl9faXRlcmF0ZVVuY2FjaGVkID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHtcblx0ICAgICAgaWYgKHJldmVyc2UpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0ZShmbiwgcmV2ZXJzZSk7XG5cdCAgICAgIH1cblx0ICAgICAgdmFyIGl0ZXJhYmxlID0gdGhpcy5faXRlcmFibGU7XG5cdCAgICAgIHZhciBpdGVyYXRvciA9IGdldEl0ZXJhdG9yKGl0ZXJhYmxlKTtcblx0ICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuXHQgICAgICBpZiAoaXNJdGVyYXRvcihpdGVyYXRvcikpIHtcblx0ICAgICAgICB2YXIgc3RlcDtcblx0ICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG5cdCAgICAgICAgICBpZiAoZm4oc3RlcC52YWx1ZSwgaXRlcmF0aW9ucysrLCB0aGlzKSA9PT0gZmFsc2UpIHtcblx0ICAgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiBpdGVyYXRpb25zO1xuXHQgICAgfTtcblxuXHQgICAgSXRlcmFibGVTZXEucHJvdG90eXBlLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcblx0ICAgICAgaWYgKHJldmVyc2UpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG5cdCAgICAgIH1cblx0ICAgICAgdmFyIGl0ZXJhYmxlID0gdGhpcy5faXRlcmFibGU7XG5cdCAgICAgIHZhciBpdGVyYXRvciA9IGdldEl0ZXJhdG9yKGl0ZXJhYmxlKTtcblx0ICAgICAgaWYgKCFpc0l0ZXJhdG9yKGl0ZXJhdG9yKSkge1xuXHQgICAgICAgIHJldHVybiBuZXcgc3JjX0l0ZXJhdG9yX19JdGVyYXRvcihpdGVyYXRvckRvbmUpO1xuXHQgICAgICB9XG5cdCAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcblx0ICAgICAgcmV0dXJuIG5ldyBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcblx0ICAgICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcblx0ICAgICAgICByZXR1cm4gc3RlcC5kb25lID8gc3RlcCA6IGl0ZXJhdG9yVmFsdWUodHlwZSwgaXRlcmF0aW9ucysrLCBzdGVwLnZhbHVlKTtcblx0ICAgICAgfSk7XG5cdCAgICB9O1xuXG5cblxuXHQgIGNyZWF0ZUNsYXNzKEl0ZXJhdG9yU2VxLCBJbmRleGVkU2VxKTtcblx0ICAgIGZ1bmN0aW9uIEl0ZXJhdG9yU2VxKGl0ZXJhdG9yKSB7XG5cdCAgICAgIHRoaXMuX2l0ZXJhdG9yID0gaXRlcmF0b3I7XG5cdCAgICAgIHRoaXMuX2l0ZXJhdG9yQ2FjaGUgPSBbXTtcblx0ICAgIH1cblxuXHQgICAgSXRlcmF0b3JTZXEucHJvdG90eXBlLl9faXRlcmF0ZVVuY2FjaGVkID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHtcblx0ICAgICAgaWYgKHJldmVyc2UpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0ZShmbiwgcmV2ZXJzZSk7XG5cdCAgICAgIH1cblx0ICAgICAgdmFyIGl0ZXJhdG9yID0gdGhpcy5faXRlcmF0b3I7XG5cdCAgICAgIHZhciBjYWNoZSA9IHRoaXMuX2l0ZXJhdG9yQ2FjaGU7XG5cdCAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcblx0ICAgICAgd2hpbGUgKGl0ZXJhdGlvbnMgPCBjYWNoZS5sZW5ndGgpIHtcblx0ICAgICAgICBpZiAoZm4oY2FjaGVbaXRlcmF0aW9uc10sIGl0ZXJhdGlvbnMrKywgdGhpcykgPT09IGZhbHNlKSB7XG5cdCAgICAgICAgICByZXR1cm4gaXRlcmF0aW9ucztcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgICAgdmFyIHN0ZXA7XG5cdCAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcblx0ICAgICAgICB2YXIgdmFsID0gc3RlcC52YWx1ZTtcblx0ICAgICAgICBjYWNoZVtpdGVyYXRpb25zXSA9IHZhbDtcblx0ICAgICAgICBpZiAoZm4odmFsLCBpdGVyYXRpb25zKyssIHRoaXMpID09PSBmYWxzZSkge1xuXHQgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiBpdGVyYXRpb25zO1xuXHQgICAgfTtcblxuXHQgICAgSXRlcmF0b3JTZXEucHJvdG90eXBlLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcblx0ICAgICAgaWYgKHJldmVyc2UpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG5cdCAgICAgIH1cblx0ICAgICAgdmFyIGl0ZXJhdG9yID0gdGhpcy5faXRlcmF0b3I7XG5cdCAgICAgIHZhciBjYWNoZSA9IHRoaXMuX2l0ZXJhdG9yQ2FjaGU7XG5cdCAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcblx0ICAgICAgcmV0dXJuIG5ldyBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcblx0ICAgICAgICBpZiAoaXRlcmF0aW9ucyA+PSBjYWNoZS5sZW5ndGgpIHtcblx0ICAgICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuXHQgICAgICAgICAgaWYgKHN0ZXAuZG9uZSkge1xuXHQgICAgICAgICAgICByZXR1cm4gc3RlcDtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICAgIGNhY2hlW2l0ZXJhdGlvbnNdID0gc3RlcC52YWx1ZTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIGl0ZXJhdG9yVmFsdWUodHlwZSwgaXRlcmF0aW9ucywgY2FjaGVbaXRlcmF0aW9ucysrXSk7XG5cdCAgICAgIH0pO1xuXHQgICAgfTtcblxuXG5cblxuXHQgIC8vICMgcHJhZ21hIEhlbHBlciBmdW5jdGlvbnNcblxuXHQgIGZ1bmN0aW9uIGlzU2VxKG1heWJlU2VxKSB7XG5cdCAgICByZXR1cm4gISEobWF5YmVTZXEgJiYgbWF5YmVTZXFbSVNfU0VRX1NFTlRJTkVMXSk7XG5cdCAgfVxuXG5cdCAgdmFyIEVNUFRZX1NFUTtcblxuXHQgIGZ1bmN0aW9uIGVtcHR5U2VxdWVuY2UoKSB7XG5cdCAgICByZXR1cm4gRU1QVFlfU0VRIHx8IChFTVBUWV9TRVEgPSBuZXcgQXJyYXlTZXEoW10pKTtcblx0ICB9XG5cblx0ICBmdW5jdGlvbiBrZXllZFNlcUZyb21WYWx1ZSh2YWx1ZSkge1xuXHQgICAgdmFyIHNlcSA9XG5cdCAgICAgIEFycmF5LmlzQXJyYXkodmFsdWUpID8gbmV3IEFycmF5U2VxKHZhbHVlKS5mcm9tRW50cnlTZXEoKSA6XG5cdCAgICAgIGlzSXRlcmF0b3IodmFsdWUpID8gbmV3IEl0ZXJhdG9yU2VxKHZhbHVlKS5mcm9tRW50cnlTZXEoKSA6XG5cdCAgICAgIGhhc0l0ZXJhdG9yKHZhbHVlKSA/IG5ldyBJdGVyYWJsZVNlcSh2YWx1ZSkuZnJvbUVudHJ5U2VxKCkgOlxuXHQgICAgICB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnID8gbmV3IE9iamVjdFNlcSh2YWx1ZSkgOlxuXHQgICAgICB1bmRlZmluZWQ7XG5cdCAgICBpZiAoIXNlcSkge1xuXHQgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuXHQgICAgICAgICdFeHBlY3RlZCBBcnJheSBvciBpdGVyYWJsZSBvYmplY3Qgb2YgW2ssIHZdIGVudHJpZXMsICcrXG5cdCAgICAgICAgJ29yIGtleWVkIG9iamVjdDogJyArIHZhbHVlXG5cdCAgICAgICk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gc2VxO1xuXHQgIH1cblxuXHQgIGZ1bmN0aW9uIGluZGV4ZWRTZXFGcm9tVmFsdWUodmFsdWUpIHtcblx0ICAgIHZhciBzZXEgPSBtYXliZUluZGV4ZWRTZXFGcm9tVmFsdWUodmFsdWUpO1xuXHQgICAgaWYgKCFzZXEpIHtcblx0ICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcblx0ICAgICAgICAnRXhwZWN0ZWQgQXJyYXkgb3IgaXRlcmFibGUgb2JqZWN0IG9mIHZhbHVlczogJyArIHZhbHVlXG5cdCAgICAgICk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gc2VxO1xuXHQgIH1cblxuXHQgIGZ1bmN0aW9uIHNlcUZyb21WYWx1ZSh2YWx1ZSkge1xuXHQgICAgdmFyIHNlcSA9IG1heWJlSW5kZXhlZFNlcUZyb21WYWx1ZSh2YWx1ZSkgfHxcblx0ICAgICAgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgbmV3IE9iamVjdFNlcSh2YWx1ZSkpO1xuXHQgICAgaWYgKCFzZXEpIHtcblx0ICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcblx0ICAgICAgICAnRXhwZWN0ZWQgQXJyYXkgb3IgaXRlcmFibGUgb2JqZWN0IG9mIHZhbHVlcywgb3Iga2V5ZWQgb2JqZWN0OiAnICsgdmFsdWVcblx0ICAgICAgKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBzZXE7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gbWF5YmVJbmRleGVkU2VxRnJvbVZhbHVlKHZhbHVlKSB7XG5cdCAgICByZXR1cm4gKFxuXHQgICAgICBpc0FycmF5TGlrZSh2YWx1ZSkgPyBuZXcgQXJyYXlTZXEodmFsdWUpIDpcblx0ICAgICAgaXNJdGVyYXRvcih2YWx1ZSkgPyBuZXcgSXRlcmF0b3JTZXEodmFsdWUpIDpcblx0ICAgICAgaGFzSXRlcmF0b3IodmFsdWUpID8gbmV3IEl0ZXJhYmxlU2VxKHZhbHVlKSA6XG5cdCAgICAgIHVuZGVmaW5lZFxuXHQgICAgKTtcblx0ICB9XG5cblx0ICBmdW5jdGlvbiBzZXFJdGVyYXRlKHNlcSwgZm4sIHJldmVyc2UsIHVzZUtleXMpIHtcblx0ICAgIHZhciBjYWNoZSA9IHNlcS5fY2FjaGU7XG5cdCAgICBpZiAoY2FjaGUpIHtcblx0ICAgICAgdmFyIG1heEluZGV4ID0gY2FjaGUubGVuZ3RoIC0gMTtcblx0ICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8PSBtYXhJbmRleDsgaWkrKykge1xuXHQgICAgICAgIHZhciBlbnRyeSA9IGNhY2hlW3JldmVyc2UgPyBtYXhJbmRleCAtIGlpIDogaWldO1xuXHQgICAgICAgIGlmIChmbihlbnRyeVsxXSwgdXNlS2V5cyA/IGVudHJ5WzBdIDogaWksIHNlcSkgPT09IGZhbHNlKSB7XG5cdCAgICAgICAgICByZXR1cm4gaWkgKyAxO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gaWk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gc2VxLl9faXRlcmF0ZVVuY2FjaGVkKGZuLCByZXZlcnNlKTtcblx0ICB9XG5cblx0ICBmdW5jdGlvbiBzZXFJdGVyYXRvcihzZXEsIHR5cGUsIHJldmVyc2UsIHVzZUtleXMpIHtcblx0ICAgIHZhciBjYWNoZSA9IHNlcS5fY2FjaGU7XG5cdCAgICBpZiAoY2FjaGUpIHtcblx0ICAgICAgdmFyIG1heEluZGV4ID0gY2FjaGUubGVuZ3RoIC0gMTtcblx0ICAgICAgdmFyIGlpID0gMDtcblx0ICAgICAgcmV0dXJuIG5ldyBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcblx0ICAgICAgICB2YXIgZW50cnkgPSBjYWNoZVtyZXZlcnNlID8gbWF4SW5kZXggLSBpaSA6IGlpXTtcblx0ICAgICAgICByZXR1cm4gaWkrKyA+IG1heEluZGV4ID9cblx0ICAgICAgICAgIGl0ZXJhdG9yRG9uZSgpIDpcblx0ICAgICAgICAgIGl0ZXJhdG9yVmFsdWUodHlwZSwgdXNlS2V5cyA/IGVudHJ5WzBdIDogaWkgLSAxLCBlbnRyeVsxXSk7XG5cdCAgICAgIH0pO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIHNlcS5fX2l0ZXJhdG9yVW5jYWNoZWQodHlwZSwgcmV2ZXJzZSk7XG5cdCAgfVxuXG5cdCAgY3JlYXRlQ2xhc3MoQ29sbGVjdGlvbiwgSXRlcmFibGUpO1xuXHQgICAgZnVuY3Rpb24gQ29sbGVjdGlvbigpIHtcblx0ICAgICAgdGhyb3cgVHlwZUVycm9yKCdBYnN0cmFjdCcpO1xuXHQgICAgfVxuXG5cblx0ICBjcmVhdGVDbGFzcyhLZXllZENvbGxlY3Rpb24sIENvbGxlY3Rpb24pO2Z1bmN0aW9uIEtleWVkQ29sbGVjdGlvbigpIHt9XG5cblx0ICBjcmVhdGVDbGFzcyhJbmRleGVkQ29sbGVjdGlvbiwgQ29sbGVjdGlvbik7ZnVuY3Rpb24gSW5kZXhlZENvbGxlY3Rpb24oKSB7fVxuXG5cdCAgY3JlYXRlQ2xhc3MoU2V0Q29sbGVjdGlvbiwgQ29sbGVjdGlvbik7ZnVuY3Rpb24gU2V0Q29sbGVjdGlvbigpIHt9XG5cblxuXHQgIENvbGxlY3Rpb24uS2V5ZWQgPSBLZXllZENvbGxlY3Rpb247XG5cdCAgQ29sbGVjdGlvbi5JbmRleGVkID0gSW5kZXhlZENvbGxlY3Rpb247XG5cdCAgQ29sbGVjdGlvbi5TZXQgPSBTZXRDb2xsZWN0aW9uO1xuXG5cdCAgLyoqXG5cdCAgICogQW4gZXh0ZW5zaW9uIG9mIHRoZSBcInNhbWUtdmFsdWVcIiBhbGdvcml0aG0gYXMgW2Rlc2NyaWJlZCBmb3IgdXNlIGJ5IEVTNiBNYXBcblx0ICAgKiBhbmQgU2V0XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9NYXAjS2V5X2VxdWFsaXR5KVxuXHQgICAqXG5cdCAgICogTmFOIGlzIGNvbnNpZGVyZWQgdGhlIHNhbWUgYXMgTmFOLCBob3dldmVyIC0wIGFuZCAwIGFyZSBjb25zaWRlcmVkIHRoZSBzYW1lXG5cdCAgICogdmFsdWUsIHdoaWNoIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBhbGdvcml0aG0gZGVzY3JpYmVkIGJ5XG5cdCAgICogW2BPYmplY3QuaXNgXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvaXMpLlxuXHQgICAqXG5cdCAgICogVGhpcyBpcyBleHRlbmRlZCBmdXJ0aGVyIHRvIGFsbG93IE9iamVjdHMgdG8gZGVzY3JpYmUgdGhlIHZhbHVlcyB0aGV5XG5cdCAgICogcmVwcmVzZW50LCBieSB3YXkgb2YgYHZhbHVlT2ZgIG9yIGBlcXVhbHNgIChhbmQgYGhhc2hDb2RlYCkuXG5cdCAgICpcblx0ICAgKiBOb3RlOiBiZWNhdXNlIG9mIHRoaXMgZXh0ZW5zaW9uLCB0aGUga2V5IGVxdWFsaXR5IG9mIEltbXV0YWJsZS5NYXAgYW5kIHRoZVxuXHQgICAqIHZhbHVlIGVxdWFsaXR5IG9mIEltbXV0YWJsZS5TZXQgd2lsbCBkaWZmZXIgZnJvbSBFUzYgTWFwIGFuZCBTZXQuXG5cdCAgICpcblx0ICAgKiAjIyMgRGVmaW5pbmcgY3VzdG9tIHZhbHVlc1xuXHQgICAqXG5cdCAgICogVGhlIGVhc2llc3Qgd2F5IHRvIGRlc2NyaWJlIHRoZSB2YWx1ZSBhbiBvYmplY3QgcmVwcmVzZW50cyBpcyBieSBpbXBsZW1lbnRpbmdcblx0ICAgKiBgdmFsdWVPZmAuIEZvciBleGFtcGxlLCBgRGF0ZWAgcmVwcmVzZW50cyBhIHZhbHVlIGJ5IHJldHVybmluZyBhIHVuaXhcblx0ICAgKiB0aW1lc3RhbXAgZm9yIGB2YWx1ZU9mYDpcblx0ICAgKlxuXHQgICAqICAgICB2YXIgZGF0ZTEgPSBuZXcgRGF0ZSgxMjM0NTY3ODkwMDAwKTsgLy8gRnJpIEZlYiAxMyAyMDA5IC4uLlxuXHQgICAqICAgICB2YXIgZGF0ZTIgPSBuZXcgRGF0ZSgxMjM0NTY3ODkwMDAwKTtcblx0ICAgKiAgICAgZGF0ZTEudmFsdWVPZigpOyAvLyAxMjM0NTY3ODkwMDAwXG5cdCAgICogICAgIGFzc2VydCggZGF0ZTEgIT09IGRhdGUyICk7XG5cdCAgICogICAgIGFzc2VydCggSW1tdXRhYmxlLmlzKCBkYXRlMSwgZGF0ZTIgKSApO1xuXHQgICAqXG5cdCAgICogTm90ZTogb3ZlcnJpZGluZyBgdmFsdWVPZmAgbWF5IGhhdmUgb3RoZXIgaW1wbGljYXRpb25zIGlmIHlvdSB1c2UgdGhpcyBvYmplY3Rcblx0ICAgKiB3aGVyZSBKYXZhU2NyaXB0IGV4cGVjdHMgYSBwcmltaXRpdmUsIHN1Y2ggYXMgaW1wbGljaXQgc3RyaW5nIGNvZXJjaW9uLlxuXHQgICAqXG5cdCAgICogRm9yIG1vcmUgY29tcGxleCB0eXBlcywgZXNwZWNpYWxseSBjb2xsZWN0aW9ucywgaW1wbGVtZW50aW5nIGB2YWx1ZU9mYCBtYXlcblx0ICAgKiBub3QgYmUgcGVyZm9ybWFudC4gQW4gYWx0ZXJuYXRpdmUgaXMgdG8gaW1wbGVtZW50IGBlcXVhbHNgIGFuZCBgaGFzaENvZGVgLlxuXHQgICAqXG5cdCAgICogYGVxdWFsc2AgdGFrZXMgYW5vdGhlciBvYmplY3QsIHByZXN1bWFibHkgb2Ygc2ltaWxhciB0eXBlLCBhbmQgcmV0dXJucyB0cnVlXG5cdCAgICogaWYgdGhlIGl0IGlzIGVxdWFsLiBFcXVhbGl0eSBpcyBzeW1tZXRyaWNhbCwgc28gdGhlIHNhbWUgcmVzdWx0IHNob3VsZCBiZVxuXHQgICAqIHJldHVybmVkIGlmIHRoaXMgYW5kIHRoZSBhcmd1bWVudCBhcmUgZmxpcHBlZC5cblx0ICAgKlxuXHQgICAqICAgICBhc3NlcnQoIGEuZXF1YWxzKGIpID09PSBiLmVxdWFscyhhKSApO1xuXHQgICAqXG5cdCAgICogYGhhc2hDb2RlYCByZXR1cm5zIGEgMzJiaXQgaW50ZWdlciBudW1iZXIgcmVwcmVzZW50aW5nIHRoZSBvYmplY3Qgd2hpY2ggd2lsbFxuXHQgICAqIGJlIHVzZWQgdG8gZGV0ZXJtaW5lIGhvdyB0byBzdG9yZSB0aGUgdmFsdWUgb2JqZWN0IGluIGEgTWFwIG9yIFNldC4gWW91IG11c3Rcblx0ICAgKiBwcm92aWRlIGJvdGggb3IgbmVpdGhlciBtZXRob2RzLCBvbmUgbXVzdCBub3QgZXhpc3Qgd2l0aG91dCB0aGUgb3RoZXIuXG5cdCAgICpcblx0ICAgKiBBbHNvLCBhbiBpbXBvcnRhbnQgcmVsYXRpb25zaGlwIGJldHdlZW4gdGhlc2UgbWV0aG9kcyBtdXN0IGJlIHVwaGVsZDogaWYgdHdvXG5cdCAgICogdmFsdWVzIGFyZSBlcXVhbCwgdGhleSAqbXVzdCogcmV0dXJuIHRoZSBzYW1lIGhhc2hDb2RlLiBJZiB0aGUgdmFsdWVzIGFyZSBub3Rcblx0ICAgKiBlcXVhbCwgdGhleSBtaWdodCBoYXZlIHRoZSBzYW1lIGhhc2hDb2RlOyB0aGlzIGlzIGNhbGxlZCBhIGhhc2ggY29sbGlzaW9uLFxuXHQgICAqIGFuZCB3aGlsZSB1bmRlc2lyYWJsZSBmb3IgcGVyZm9ybWFuY2UgcmVhc29ucywgaXQgaXMgYWNjZXB0YWJsZS5cblx0ICAgKlxuXHQgICAqICAgICBpZiAoYS5lcXVhbHMoYikpIHtcblx0ICAgKiAgICAgICBhc3NlcnQoIGEuaGFzaENvZGUoKSA9PT0gYi5oYXNoQ29kZSgpICk7XG5cdCAgICogICAgIH1cblx0ICAgKlxuXHQgICAqIEFsbCBJbW11dGFibGUgY29sbGVjdGlvbnMgaW1wbGVtZW50IGBlcXVhbHNgIGFuZCBgaGFzaENvZGVgLlxuXHQgICAqXG5cdCAgICovXG5cdCAgZnVuY3Rpb24gaXModmFsdWVBLCB2YWx1ZUIpIHtcblx0ICAgIGlmICh2YWx1ZUEgPT09IHZhbHVlQiB8fCAodmFsdWVBICE9PSB2YWx1ZUEgJiYgdmFsdWVCICE9PSB2YWx1ZUIpKSB7XG5cdCAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgfVxuXHQgICAgaWYgKCF2YWx1ZUEgfHwgIXZhbHVlQikge1xuXHQgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICB9XG5cdCAgICBpZiAodHlwZW9mIHZhbHVlQS52YWx1ZU9mID09PSAnZnVuY3Rpb24nICYmXG5cdCAgICAgICAgdHlwZW9mIHZhbHVlQi52YWx1ZU9mID09PSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgIHZhbHVlQSA9IHZhbHVlQS52YWx1ZU9mKCk7XG5cdCAgICAgIHZhbHVlQiA9IHZhbHVlQi52YWx1ZU9mKCk7XG5cdCAgICAgIGlmICh2YWx1ZUEgPT09IHZhbHVlQiB8fCAodmFsdWVBICE9PSB2YWx1ZUEgJiYgdmFsdWVCICE9PSB2YWx1ZUIpKSB7XG5cdCAgICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICAgIH1cblx0ICAgICAgaWYgKCF2YWx1ZUEgfHwgIXZhbHVlQikge1xuXHQgICAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgICAgaWYgKHR5cGVvZiB2YWx1ZUEuZXF1YWxzID09PSAnZnVuY3Rpb24nICYmXG5cdCAgICAgICAgdHlwZW9mIHZhbHVlQi5lcXVhbHMgPT09ICdmdW5jdGlvbicgJiZcblx0ICAgICAgICB2YWx1ZUEuZXF1YWxzKHZhbHVlQikpIHtcblx0ICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gZnJvbUpTKGpzb24sIGNvbnZlcnRlcikge1xuXHQgICAgcmV0dXJuIGNvbnZlcnRlciA/XG5cdCAgICAgIGZyb21KU1dpdGgoY29udmVydGVyLCBqc29uLCAnJywgeycnOiBqc29ufSkgOlxuXHQgICAgICBmcm9tSlNEZWZhdWx0KGpzb24pO1xuXHQgIH1cblxuXHQgIGZ1bmN0aW9uIGZyb21KU1dpdGgoY29udmVydGVyLCBqc29uLCBrZXksIHBhcmVudEpTT04pIHtcblx0ICAgIGlmIChBcnJheS5pc0FycmF5KGpzb24pKSB7XG5cdCAgICAgIHJldHVybiBjb252ZXJ0ZXIuY2FsbChwYXJlbnRKU09OLCBrZXksIEluZGV4ZWRTZXEoanNvbikubWFwKGZ1bmN0aW9uKHYsIGspICB7cmV0dXJuIGZyb21KU1dpdGgoY29udmVydGVyLCB2LCBrLCBqc29uKX0pKTtcblx0ICAgIH1cblx0ICAgIGlmIChpc1BsYWluT2JqKGpzb24pKSB7XG5cdCAgICAgIHJldHVybiBjb252ZXJ0ZXIuY2FsbChwYXJlbnRKU09OLCBrZXksIEtleWVkU2VxKGpzb24pLm1hcChmdW5jdGlvbih2LCBrKSAge3JldHVybiBmcm9tSlNXaXRoKGNvbnZlcnRlciwgdiwgaywganNvbil9KSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4ganNvbjtcblx0ICB9XG5cblx0ICBmdW5jdGlvbiBmcm9tSlNEZWZhdWx0KGpzb24pIHtcblx0ICAgIGlmIChBcnJheS5pc0FycmF5KGpzb24pKSB7XG5cdCAgICAgIHJldHVybiBJbmRleGVkU2VxKGpzb24pLm1hcChmcm9tSlNEZWZhdWx0KS50b0xpc3QoKTtcblx0ICAgIH1cblx0ICAgIGlmIChpc1BsYWluT2JqKGpzb24pKSB7XG5cdCAgICAgIHJldHVybiBLZXllZFNlcShqc29uKS5tYXAoZnJvbUpTRGVmYXVsdCkudG9NYXAoKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBqc29uO1xuXHQgIH1cblxuXHQgIGZ1bmN0aW9uIGlzUGxhaW5PYmoodmFsdWUpIHtcblx0ICAgIHJldHVybiB2YWx1ZSAmJiAodmFsdWUuY29uc3RydWN0b3IgPT09IE9iamVjdCB8fCB2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gdW5kZWZpbmVkKTtcblx0ICB9XG5cblx0ICB2YXIgc3JjX01hdGhfX2ltdWwgPVxuXHQgICAgdHlwZW9mIE1hdGguaW11bCA9PT0gJ2Z1bmN0aW9uJyAmJiBNYXRoLmltdWwoMHhmZmZmZmZmZiwgMikgPT09IC0yID9cblx0ICAgIE1hdGguaW11bCA6XG5cdCAgICBmdW5jdGlvbiBzcmNfTWF0aF9faW11bChhLCBiKSB7XG5cdCAgICAgIGEgPSBhIHwgMDsgLy8gaW50XG5cdCAgICAgIGIgPSBiIHwgMDsgLy8gaW50XG5cdCAgICAgIHZhciBjID0gYSAmIDB4ZmZmZjtcblx0ICAgICAgdmFyIGQgPSBiICYgMHhmZmZmO1xuXHQgICAgICAvLyBTaGlmdCBieSAwIGZpeGVzIHRoZSBzaWduIG9uIHRoZSBoaWdoIHBhcnQuXG5cdCAgICAgIHJldHVybiAoYyAqIGQpICsgKCgoKGEgPj4+IDE2KSAqIGQgKyBjICogKGIgPj4+IDE2KSkgPDwgMTYpID4+PiAwKSB8IDA7IC8vIGludFxuXHQgICAgfTtcblxuXHQgIC8vIHY4IGhhcyBhbiBvcHRpbWl6YXRpb24gZm9yIHN0b3JpbmcgMzEtYml0IHNpZ25lZCBudW1iZXJzLlxuXHQgIC8vIFZhbHVlcyB3aGljaCBoYXZlIGVpdGhlciAwMCBvciAxMSBhcyB0aGUgaGlnaCBvcmRlciBiaXRzIHF1YWxpZnkuXG5cdCAgLy8gVGhpcyBmdW5jdGlvbiBkcm9wcyB0aGUgaGlnaGVzdCBvcmRlciBiaXQgaW4gYSBzaWduZWQgbnVtYmVyLCBtYWludGFpbmluZ1xuXHQgIC8vIHRoZSBzaWduIGJpdC5cblx0ICBmdW5jdGlvbiBzbWkoaTMyKSB7XG5cdCAgICByZXR1cm4gKChpMzIgPj4+IDEpICYgMHg0MDAwMDAwMCkgfCAoaTMyICYgMHhCRkZGRkZGRik7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gaGFzaChvKSB7XG5cdCAgICBpZiAobyA9PT0gZmFsc2UgfHwgbyA9PT0gbnVsbCB8fCBvID09PSB1bmRlZmluZWQpIHtcblx0ICAgICAgcmV0dXJuIDA7XG5cdCAgICB9XG5cdCAgICBpZiAodHlwZW9mIG8udmFsdWVPZiA9PT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICBvID0gby52YWx1ZU9mKCk7XG5cdCAgICAgIGlmIChvID09PSBmYWxzZSB8fCBvID09PSBudWxsIHx8IG8gPT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgIHJldHVybiAwO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgICBpZiAobyA9PT0gdHJ1ZSkge1xuXHQgICAgICByZXR1cm4gMTtcblx0ICAgIH1cblx0ICAgIHZhciB0eXBlID0gdHlwZW9mIG87XG5cdCAgICBpZiAodHlwZSA9PT0gJ251bWJlcicpIHtcblx0ICAgICAgdmFyIGggPSBvIHwgMDtcblx0ICAgICAgaWYgKGggIT09IG8pIHtcblx0ICAgICAgICBoIF49IG8gKiAweEZGRkZGRkZGO1xuXHQgICAgICB9XG5cdCAgICAgIHdoaWxlIChvID4gMHhGRkZGRkZGRikge1xuXHQgICAgICAgIG8gLz0gMHhGRkZGRkZGRjtcblx0ICAgICAgICBoIF49IG87XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIHNtaShoKTtcblx0ICAgIH1cblx0ICAgIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuXHQgICAgICByZXR1cm4gby5sZW5ndGggPiBTVFJJTkdfSEFTSF9DQUNIRV9NSU5fU1RSTEVOID8gY2FjaGVkSGFzaFN0cmluZyhvKSA6IGhhc2hTdHJpbmcobyk7XG5cdCAgICB9XG5cdCAgICBpZiAodHlwZW9mIG8uaGFzaENvZGUgPT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgcmV0dXJuIG8uaGFzaENvZGUoKTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBoYXNoSlNPYmoobyk7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gY2FjaGVkSGFzaFN0cmluZyhzdHJpbmcpIHtcblx0ICAgIHZhciBoYXNoID0gc3RyaW5nSGFzaENhY2hlW3N0cmluZ107XG5cdCAgICBpZiAoaGFzaCA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgIGhhc2ggPSBoYXNoU3RyaW5nKHN0cmluZyk7XG5cdCAgICAgIGlmIChTVFJJTkdfSEFTSF9DQUNIRV9TSVpFID09PSBTVFJJTkdfSEFTSF9DQUNIRV9NQVhfU0laRSkge1xuXHQgICAgICAgIFNUUklOR19IQVNIX0NBQ0hFX1NJWkUgPSAwO1xuXHQgICAgICAgIHN0cmluZ0hhc2hDYWNoZSA9IHt9O1xuXHQgICAgICB9XG5cdCAgICAgIFNUUklOR19IQVNIX0NBQ0hFX1NJWkUrKztcblx0ICAgICAgc3RyaW5nSGFzaENhY2hlW3N0cmluZ10gPSBoYXNoO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGhhc2g7XG5cdCAgfVxuXG5cdCAgLy8gaHR0cDovL2pzcGVyZi5jb20vaGFzaGluZy1zdHJpbmdzXG5cdCAgZnVuY3Rpb24gaGFzaFN0cmluZyhzdHJpbmcpIHtcblx0ICAgIC8vIFRoaXMgaXMgdGhlIGhhc2ggZnJvbSBKVk1cblx0ICAgIC8vIFRoZSBoYXNoIGNvZGUgZm9yIGEgc3RyaW5nIGlzIGNvbXB1dGVkIGFzXG5cdCAgICAvLyBzWzBdICogMzEgXiAobiAtIDEpICsgc1sxXSAqIDMxIF4gKG4gLSAyKSArIC4uLiArIHNbbiAtIDFdLFxuXHQgICAgLy8gd2hlcmUgc1tpXSBpcyB0aGUgaXRoIGNoYXJhY3RlciBvZiB0aGUgc3RyaW5nIGFuZCBuIGlzIHRoZSBsZW5ndGggb2Zcblx0ICAgIC8vIHRoZSBzdHJpbmcuIFdlIFwibW9kXCIgdGhlIHJlc3VsdCB0byBtYWtlIGl0IGJldHdlZW4gMCAoaW5jbHVzaXZlKSBhbmQgMl4zMVxuXHQgICAgLy8gKGV4Y2x1c2l2ZSkgYnkgZHJvcHBpbmcgaGlnaCBiaXRzLlxuXHQgICAgdmFyIGhhc2ggPSAwO1xuXHQgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IHN0cmluZy5sZW5ndGg7IGlpKyspIHtcblx0ICAgICAgaGFzaCA9IDMxICogaGFzaCArIHN0cmluZy5jaGFyQ29kZUF0KGlpKSB8IDA7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gc21pKGhhc2gpO1xuXHQgIH1cblxuXHQgIGZ1bmN0aW9uIGhhc2hKU09iaihvYmopIHtcblx0ICAgIHZhciBoYXNoO1xuXHQgICAgaWYgKHVzaW5nV2Vha01hcCkge1xuXHQgICAgICBoYXNoID0gd2Vha01hcC5nZXQob2JqKTtcblx0ICAgICAgaWYgKGhhc2ggIT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgIHJldHVybiBoYXNoO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIGhhc2ggPSBvYmpbVUlEX0hBU0hfS0VZXTtcblx0ICAgIGlmIChoYXNoICE9PSB1bmRlZmluZWQpIHtcblx0ICAgICAgcmV0dXJuIGhhc2g7XG5cdCAgICB9XG5cblx0ICAgIGlmICghY2FuRGVmaW5lUHJvcGVydHkpIHtcblx0ICAgICAgaGFzaCA9IG9iai5wcm9wZXJ0eUlzRW51bWVyYWJsZSAmJiBvYmoucHJvcGVydHlJc0VudW1lcmFibGVbVUlEX0hBU0hfS0VZXTtcblx0ICAgICAgaWYgKGhhc2ggIT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgIHJldHVybiBoYXNoO1xuXHQgICAgICB9XG5cblx0ICAgICAgaGFzaCA9IGdldElFTm9kZUhhc2gob2JqKTtcblx0ICAgICAgaWYgKGhhc2ggIT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgIHJldHVybiBoYXNoO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIGhhc2ggPSArK29iakhhc2hVSUQ7XG5cdCAgICBpZiAob2JqSGFzaFVJRCAmIDB4NDAwMDAwMDApIHtcblx0ICAgICAgb2JqSGFzaFVJRCA9IDA7XG5cdCAgICB9XG5cblx0ICAgIGlmICh1c2luZ1dlYWtNYXApIHtcblx0ICAgICAgd2Vha01hcC5zZXQob2JqLCBoYXNoKTtcblx0ICAgIH0gZWxzZSBpZiAoaXNFeHRlbnNpYmxlICE9PSB1bmRlZmluZWQgJiYgaXNFeHRlbnNpYmxlKG9iaikgPT09IGZhbHNlKSB7XG5cdCAgICAgIHRocm93IG5ldyBFcnJvcignTm9uLWV4dGVuc2libGUgb2JqZWN0cyBhcmUgbm90IGFsbG93ZWQgYXMga2V5cy4nKTtcblx0ICAgIH0gZWxzZSBpZiAoY2FuRGVmaW5lUHJvcGVydHkpIHtcblx0ICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgVUlEX0hBU0hfS0VZLCB7XG5cdCAgICAgICAgJ2VudW1lcmFibGUnOiBmYWxzZSxcblx0ICAgICAgICAnY29uZmlndXJhYmxlJzogZmFsc2UsXG5cdCAgICAgICAgJ3dyaXRhYmxlJzogZmFsc2UsXG5cdCAgICAgICAgJ3ZhbHVlJzogaGFzaFxuXHQgICAgICB9KTtcblx0ICAgIH0gZWxzZSBpZiAob2JqLnByb3BlcnR5SXNFbnVtZXJhYmxlICE9PSB1bmRlZmluZWQgJiZcblx0ICAgICAgICAgICAgICAgb2JqLnByb3BlcnR5SXNFbnVtZXJhYmxlID09PSBvYmouY29uc3RydWN0b3IucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlKSB7XG5cdCAgICAgIC8vIFNpbmNlIHdlIGNhbid0IGRlZmluZSBhIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5IG9uIHRoZSBvYmplY3Rcblx0ICAgICAgLy8gd2UnbGwgaGlqYWNrIG9uZSBvZiB0aGUgbGVzcy11c2VkIG5vbi1lbnVtZXJhYmxlIHByb3BlcnRpZXMgdG9cblx0ICAgICAgLy8gc2F2ZSBvdXIgaGFzaCBvbiBpdC4gU2luY2UgdGhpcyBpcyBhIGZ1bmN0aW9uIGl0IHdpbGwgbm90IHNob3cgdXAgaW5cblx0ICAgICAgLy8gYEpTT04uc3RyaW5naWZ5YCB3aGljaCBpcyB3aGF0IHdlIHdhbnQuXG5cdCAgICAgIG9iai5wcm9wZXJ0eUlzRW51bWVyYWJsZSA9IGZ1bmN0aW9uKCkge1xuXHQgICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHQgICAgICB9O1xuXHQgICAgICBvYmoucHJvcGVydHlJc0VudW1lcmFibGVbVUlEX0hBU0hfS0VZXSA9IGhhc2g7XG5cdCAgICB9IGVsc2UgaWYgKG9iai5ub2RlVHlwZSAhPT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgIC8vIEF0IHRoaXMgcG9pbnQgd2UgY291bGRuJ3QgZ2V0IHRoZSBJRSBgdW5pcXVlSURgIHRvIHVzZSBhcyBhIGhhc2hcblx0ICAgICAgLy8gYW5kIHdlIGNvdWxkbid0IHVzZSBhIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5IHRvIGV4cGxvaXQgdGhlXG5cdCAgICAgIC8vIGRvbnRFbnVtIGJ1ZyBzbyB3ZSBzaW1wbHkgYWRkIHRoZSBgVUlEX0hBU0hfS0VZYCBvbiB0aGUgbm9kZVxuXHQgICAgICAvLyBpdHNlbGYuXG5cdCAgICAgIG9ialtVSURfSEFTSF9LRVldID0gaGFzaDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIHNldCBhIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5IG9uIG9iamVjdC4nKTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIGhhc2g7XG5cdCAgfVxuXG5cdCAgLy8gR2V0IHJlZmVyZW5jZXMgdG8gRVM1IG9iamVjdCBtZXRob2RzLlxuXHQgIHZhciBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlO1xuXG5cdCAgLy8gVHJ1ZSBpZiBPYmplY3QuZGVmaW5lUHJvcGVydHkgd29ya3MgYXMgZXhwZWN0ZWQuIElFOCBmYWlscyB0aGlzIHRlc3QuXG5cdCAgdmFyIGNhbkRlZmluZVByb3BlcnR5ID0gKGZ1bmN0aW9uKCkge1xuXHQgICAgdHJ5IHtcblx0ICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnQCcsIHt9KTtcblx0ICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICB9IGNhdGNoIChlKSB7XG5cdCAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgIH1cblx0ICB9KCkpO1xuXG5cdCAgLy8gSUUgaGFzIGEgYHVuaXF1ZUlEYCBwcm9wZXJ0eSBvbiBET00gbm9kZXMuIFdlIGNhbiBjb25zdHJ1Y3QgdGhlIGhhc2ggZnJvbSBpdFxuXHQgIC8vIGFuZCBhdm9pZCBtZW1vcnkgbGVha3MgZnJvbSB0aGUgSUUgY2xvbmVOb2RlIGJ1Zy5cblx0ICBmdW5jdGlvbiBnZXRJRU5vZGVIYXNoKG5vZGUpIHtcblx0ICAgIGlmIChub2RlICYmIG5vZGUubm9kZVR5cGUgPiAwKSB7XG5cdCAgICAgIHN3aXRjaCAobm9kZS5ub2RlVHlwZSkge1xuXHQgICAgICAgIGNhc2UgMTogLy8gRWxlbWVudFxuXHQgICAgICAgICAgcmV0dXJuIG5vZGUudW5pcXVlSUQ7XG5cdCAgICAgICAgY2FzZSA5OiAvLyBEb2N1bWVudFxuXHQgICAgICAgICAgcmV0dXJuIG5vZGUuZG9jdW1lbnRFbGVtZW50ICYmIG5vZGUuZG9jdW1lbnRFbGVtZW50LnVuaXF1ZUlEO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgLy8gSWYgcG9zc2libGUsIHVzZSBhIFdlYWtNYXAuXG5cdCAgdmFyIHVzaW5nV2Vha01hcCA9IHR5cGVvZiBXZWFrTWFwID09PSAnZnVuY3Rpb24nO1xuXHQgIHZhciB3ZWFrTWFwO1xuXHQgIGlmICh1c2luZ1dlYWtNYXApIHtcblx0ICAgIHdlYWtNYXAgPSBuZXcgV2Vha01hcCgpO1xuXHQgIH1cblxuXHQgIHZhciBvYmpIYXNoVUlEID0gMDtcblxuXHQgIHZhciBVSURfSEFTSF9LRVkgPSAnX19pbW11dGFibGVoYXNoX18nO1xuXHQgIGlmICh0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nKSB7XG5cdCAgICBVSURfSEFTSF9LRVkgPSBTeW1ib2woVUlEX0hBU0hfS0VZKTtcblx0ICB9XG5cblx0ICB2YXIgU1RSSU5HX0hBU0hfQ0FDSEVfTUlOX1NUUkxFTiA9IDE2O1xuXHQgIHZhciBTVFJJTkdfSEFTSF9DQUNIRV9NQVhfU0laRSA9IDI1NTtcblx0ICB2YXIgU1RSSU5HX0hBU0hfQ0FDSEVfU0laRSA9IDA7XG5cdCAgdmFyIHN0cmluZ0hhc2hDYWNoZSA9IHt9O1xuXG5cdCAgZnVuY3Rpb24gaW52YXJpYW50KGNvbmRpdGlvbiwgZXJyb3IpIHtcblx0ICAgIGlmICghY29uZGl0aW9uKSB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuXHQgIH1cblxuXHQgIGZ1bmN0aW9uIGFzc2VydE5vdEluZmluaXRlKHNpemUpIHtcblx0ICAgIGludmFyaWFudChcblx0ICAgICAgc2l6ZSAhPT0gSW5maW5pdHksXG5cdCAgICAgICdDYW5ub3QgcGVyZm9ybSB0aGlzIGFjdGlvbiB3aXRoIGFuIGluZmluaXRlIHNpemUuJ1xuXHQgICAgKTtcblx0ICB9XG5cblx0ICBjcmVhdGVDbGFzcyhUb0tleWVkU2VxdWVuY2UsIEtleWVkU2VxKTtcblx0ICAgIGZ1bmN0aW9uIFRvS2V5ZWRTZXF1ZW5jZShpbmRleGVkLCB1c2VLZXlzKSB7XG5cdCAgICAgIHRoaXMuX2l0ZXIgPSBpbmRleGVkO1xuXHQgICAgICB0aGlzLl91c2VLZXlzID0gdXNlS2V5cztcblx0ICAgICAgdGhpcy5zaXplID0gaW5kZXhlZC5zaXplO1xuXHQgICAgfVxuXG5cdCAgICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGtleSwgbm90U2V0VmFsdWUpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuX2l0ZXIuZ2V0KGtleSwgbm90U2V0VmFsdWUpO1xuXHQgICAgfTtcblxuXHQgICAgVG9LZXllZFNlcXVlbmNlLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihrZXkpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuX2l0ZXIuaGFzKGtleSk7XG5cdCAgICB9O1xuXG5cdCAgICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLnZhbHVlU2VxID0gZnVuY3Rpb24oKSB7XG5cdCAgICAgIHJldHVybiB0aGlzLl9pdGVyLnZhbHVlU2VxKCk7XG5cdCAgICB9O1xuXG5cdCAgICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbigpIHt2YXIgdGhpcyQwID0gdGhpcztcblx0ICAgICAgdmFyIHJldmVyc2VkU2VxdWVuY2UgPSByZXZlcnNlRmFjdG9yeSh0aGlzLCB0cnVlKTtcblx0ICAgICAgaWYgKCF0aGlzLl91c2VLZXlzKSB7XG5cdCAgICAgICAgcmV2ZXJzZWRTZXF1ZW5jZS52YWx1ZVNlcSA9IGZ1bmN0aW9uKCkgIHtyZXR1cm4gdGhpcyQwLl9pdGVyLnRvU2VxKCkucmV2ZXJzZSgpfTtcblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gcmV2ZXJzZWRTZXF1ZW5jZTtcblx0ICAgIH07XG5cblx0ICAgIFRvS2V5ZWRTZXF1ZW5jZS5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24obWFwcGVyLCBjb250ZXh0KSB7dmFyIHRoaXMkMCA9IHRoaXM7XG5cdCAgICAgIHZhciBtYXBwZWRTZXF1ZW5jZSA9IG1hcEZhY3RvcnkodGhpcywgbWFwcGVyLCBjb250ZXh0KTtcblx0ICAgICAgaWYgKCF0aGlzLl91c2VLZXlzKSB7XG5cdCAgICAgICAgbWFwcGVkU2VxdWVuY2UudmFsdWVTZXEgPSBmdW5jdGlvbigpICB7cmV0dXJuIHRoaXMkMC5faXRlci50b1NlcSgpLm1hcChtYXBwZXIsIGNvbnRleHQpfTtcblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gbWFwcGVkU2VxdWVuY2U7XG5cdCAgICB9O1xuXG5cdCAgICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG5cdCAgICAgIHZhciBpaTtcblx0ICAgICAgcmV0dXJuIHRoaXMuX2l0ZXIuX19pdGVyYXRlKFxuXHQgICAgICAgIHRoaXMuX3VzZUtleXMgP1xuXHQgICAgICAgICAgZnVuY3Rpb24odiwgaykgIHtyZXR1cm4gZm4odiwgaywgdGhpcyQwKX0gOlxuXHQgICAgICAgICAgKChpaSA9IHJldmVyc2UgPyByZXNvbHZlU2l6ZSh0aGlzKSA6IDApLFxuXHQgICAgICAgICAgICBmdW5jdGlvbih2ICkge3JldHVybiBmbih2LCByZXZlcnNlID8gLS1paSA6IGlpKyssIHRoaXMkMCl9KSxcblx0ICAgICAgICByZXZlcnNlXG5cdCAgICAgICk7XG5cdCAgICB9O1xuXG5cdCAgICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG5cdCAgICAgIGlmICh0aGlzLl91c2VLZXlzKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMuX2l0ZXIuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcblx0ICAgICAgfVxuXHQgICAgICB2YXIgaXRlcmF0b3IgPSB0aGlzLl9pdGVyLl9faXRlcmF0b3IoSVRFUkFURV9WQUxVRVMsIHJldmVyc2UpO1xuXHQgICAgICB2YXIgaWkgPSByZXZlcnNlID8gcmVzb2x2ZVNpemUodGhpcykgOiAwO1xuXHQgICAgICByZXR1cm4gbmV3IHNyY19JdGVyYXRvcl9fSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuXHQgICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuXHQgICAgICAgIHJldHVybiBzdGVwLmRvbmUgPyBzdGVwIDpcblx0ICAgICAgICAgIGl0ZXJhdG9yVmFsdWUodHlwZSwgcmV2ZXJzZSA/IC0taWkgOiBpaSsrLCBzdGVwLnZhbHVlLCBzdGVwKTtcblx0ICAgICAgfSk7XG5cdCAgICB9O1xuXG5cdCAgVG9LZXllZFNlcXVlbmNlLnByb3RvdHlwZVtJU19PUkRFUkVEX1NFTlRJTkVMXSA9IHRydWU7XG5cblxuXHQgIGNyZWF0ZUNsYXNzKFRvSW5kZXhlZFNlcXVlbmNlLCBJbmRleGVkU2VxKTtcblx0ICAgIGZ1bmN0aW9uIFRvSW5kZXhlZFNlcXVlbmNlKGl0ZXIpIHtcblx0ICAgICAgdGhpcy5faXRlciA9IGl0ZXI7XG5cdCAgICAgIHRoaXMuc2l6ZSA9IGl0ZXIuc2l6ZTtcblx0ICAgIH1cblxuXHQgICAgVG9JbmRleGVkU2VxdWVuY2UucHJvdG90eXBlLmluY2x1ZGVzID0gZnVuY3Rpb24odmFsdWUpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuX2l0ZXIuaW5jbHVkZXModmFsdWUpO1xuXHQgICAgfTtcblxuXHQgICAgVG9JbmRleGVkU2VxdWVuY2UucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG5cdCAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcblx0ICAgICAgcmV0dXJuIHRoaXMuX2l0ZXIuX19pdGVyYXRlKGZ1bmN0aW9uKHYgKSB7cmV0dXJuIGZuKHYsIGl0ZXJhdGlvbnMrKywgdGhpcyQwKX0sIHJldmVyc2UpO1xuXHQgICAgfTtcblxuXHQgICAgVG9JbmRleGVkU2VxdWVuY2UucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG5cdCAgICAgIHZhciBpdGVyYXRvciA9IHRoaXMuX2l0ZXIuX19pdGVyYXRvcihJVEVSQVRFX1ZBTFVFUywgcmV2ZXJzZSk7XG5cdCAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcblx0ICAgICAgcmV0dXJuIG5ldyBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcblx0ICAgICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcblx0ICAgICAgICByZXR1cm4gc3RlcC5kb25lID8gc3RlcCA6XG5cdCAgICAgICAgICBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgc3RlcC52YWx1ZSwgc3RlcClcblx0ICAgICAgfSk7XG5cdCAgICB9O1xuXG5cblxuXHQgIGNyZWF0ZUNsYXNzKFRvU2V0U2VxdWVuY2UsIFNldFNlcSk7XG5cdCAgICBmdW5jdGlvbiBUb1NldFNlcXVlbmNlKGl0ZXIpIHtcblx0ICAgICAgdGhpcy5faXRlciA9IGl0ZXI7XG5cdCAgICAgIHRoaXMuc2l6ZSA9IGl0ZXIuc2l6ZTtcblx0ICAgIH1cblxuXHQgICAgVG9TZXRTZXF1ZW5jZS5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24oa2V5KSB7XG5cdCAgICAgIHJldHVybiB0aGlzLl9pdGVyLmluY2x1ZGVzKGtleSk7XG5cdCAgICB9O1xuXG5cdCAgICBUb1NldFNlcXVlbmNlLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuXHQgICAgICByZXR1cm4gdGhpcy5faXRlci5fX2l0ZXJhdGUoZnVuY3Rpb24odiApIHtyZXR1cm4gZm4odiwgdiwgdGhpcyQwKX0sIHJldmVyc2UpO1xuXHQgICAgfTtcblxuXHQgICAgVG9TZXRTZXF1ZW5jZS5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcblx0ICAgICAgdmFyIGl0ZXJhdG9yID0gdGhpcy5faXRlci5fX2l0ZXJhdG9yKElURVJBVEVfVkFMVUVTLCByZXZlcnNlKTtcblx0ICAgICAgcmV0dXJuIG5ldyBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcblx0ICAgICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcblx0ICAgICAgICByZXR1cm4gc3RlcC5kb25lID8gc3RlcCA6XG5cdCAgICAgICAgICBpdGVyYXRvclZhbHVlKHR5cGUsIHN0ZXAudmFsdWUsIHN0ZXAudmFsdWUsIHN0ZXApO1xuXHQgICAgICB9KTtcblx0ICAgIH07XG5cblxuXG5cdCAgY3JlYXRlQ2xhc3MoRnJvbUVudHJpZXNTZXF1ZW5jZSwgS2V5ZWRTZXEpO1xuXHQgICAgZnVuY3Rpb24gRnJvbUVudHJpZXNTZXF1ZW5jZShlbnRyaWVzKSB7XG5cdCAgICAgIHRoaXMuX2l0ZXIgPSBlbnRyaWVzO1xuXHQgICAgICB0aGlzLnNpemUgPSBlbnRyaWVzLnNpemU7XG5cdCAgICB9XG5cblx0ICAgIEZyb21FbnRyaWVzU2VxdWVuY2UucHJvdG90eXBlLmVudHJ5U2VxID0gZnVuY3Rpb24oKSB7XG5cdCAgICAgIHJldHVybiB0aGlzLl9pdGVyLnRvU2VxKCk7XG5cdCAgICB9O1xuXG5cdCAgICBGcm9tRW50cmllc1NlcXVlbmNlLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuXHQgICAgICByZXR1cm4gdGhpcy5faXRlci5fX2l0ZXJhdGUoZnVuY3Rpb24oZW50cnkgKSB7XG5cdCAgICAgICAgLy8gQ2hlY2sgaWYgZW50cnkgZXhpc3RzIGZpcnN0IHNvIGFycmF5IGFjY2VzcyBkb2Vzbid0IHRocm93IGZvciBob2xlc1xuXHQgICAgICAgIC8vIGluIHRoZSBwYXJlbnQgaXRlcmF0aW9uLlxuXHQgICAgICAgIGlmIChlbnRyeSkge1xuXHQgICAgICAgICAgdmFsaWRhdGVFbnRyeShlbnRyeSk7XG5cdCAgICAgICAgICB2YXIgaW5kZXhlZEl0ZXJhYmxlID0gaXNJdGVyYWJsZShlbnRyeSk7XG5cdCAgICAgICAgICByZXR1cm4gZm4oXG5cdCAgICAgICAgICAgIGluZGV4ZWRJdGVyYWJsZSA/IGVudHJ5LmdldCgxKSA6IGVudHJ5WzFdLFxuXHQgICAgICAgICAgICBpbmRleGVkSXRlcmFibGUgPyBlbnRyeS5nZXQoMCkgOiBlbnRyeVswXSxcblx0ICAgICAgICAgICAgdGhpcyQwXG5cdCAgICAgICAgICApO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSwgcmV2ZXJzZSk7XG5cdCAgICB9O1xuXG5cdCAgICBGcm9tRW50cmllc1NlcXVlbmNlLnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuXHQgICAgICB2YXIgaXRlcmF0b3IgPSB0aGlzLl9pdGVyLl9faXRlcmF0b3IoSVRFUkFURV9WQUxVRVMsIHJldmVyc2UpO1xuXHQgICAgICByZXR1cm4gbmV3IHNyY19JdGVyYXRvcl9fSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuXHQgICAgICAgIHdoaWxlICh0cnVlKSB7XG5cdCAgICAgICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcblx0ICAgICAgICAgIGlmIChzdGVwLmRvbmUpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIHN0ZXA7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgICB2YXIgZW50cnkgPSBzdGVwLnZhbHVlO1xuXHQgICAgICAgICAgLy8gQ2hlY2sgaWYgZW50cnkgZXhpc3RzIGZpcnN0IHNvIGFycmF5IGFjY2VzcyBkb2Vzbid0IHRocm93IGZvciBob2xlc1xuXHQgICAgICAgICAgLy8gaW4gdGhlIHBhcmVudCBpdGVyYXRpb24uXG5cdCAgICAgICAgICBpZiAoZW50cnkpIHtcblx0ICAgICAgICAgICAgdmFsaWRhdGVFbnRyeShlbnRyeSk7XG5cdCAgICAgICAgICAgIHZhciBpbmRleGVkSXRlcmFibGUgPSBpc0l0ZXJhYmxlKGVudHJ5KTtcblx0ICAgICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yVmFsdWUoXG5cdCAgICAgICAgICAgICAgdHlwZSxcblx0ICAgICAgICAgICAgICBpbmRleGVkSXRlcmFibGUgPyBlbnRyeS5nZXQoMCkgOiBlbnRyeVswXSxcblx0ICAgICAgICAgICAgICBpbmRleGVkSXRlcmFibGUgPyBlbnRyeS5nZXQoMSkgOiBlbnRyeVsxXSxcblx0ICAgICAgICAgICAgICBzdGVwXG5cdCAgICAgICAgICAgICk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICB9KTtcblx0ICAgIH07XG5cblxuXHQgIFRvSW5kZXhlZFNlcXVlbmNlLnByb3RvdHlwZS5jYWNoZVJlc3VsdCA9XG5cdCAgVG9LZXllZFNlcXVlbmNlLnByb3RvdHlwZS5jYWNoZVJlc3VsdCA9XG5cdCAgVG9TZXRTZXF1ZW5jZS5wcm90b3R5cGUuY2FjaGVSZXN1bHQgPVxuXHQgIEZyb21FbnRyaWVzU2VxdWVuY2UucHJvdG90eXBlLmNhY2hlUmVzdWx0ID1cblx0ICAgIGNhY2hlUmVzdWx0VGhyb3VnaDtcblxuXG5cdCAgZnVuY3Rpb24gZmxpcEZhY3RvcnkoaXRlcmFibGUpIHtcblx0ICAgIHZhciBmbGlwU2VxdWVuY2UgPSBtYWtlU2VxdWVuY2UoaXRlcmFibGUpO1xuXHQgICAgZmxpcFNlcXVlbmNlLl9pdGVyID0gaXRlcmFibGU7XG5cdCAgICBmbGlwU2VxdWVuY2Uuc2l6ZSA9IGl0ZXJhYmxlLnNpemU7XG5cdCAgICBmbGlwU2VxdWVuY2UuZmxpcCA9IGZ1bmN0aW9uKCkgIHtyZXR1cm4gaXRlcmFibGV9O1xuXHQgICAgZmxpcFNlcXVlbmNlLnJldmVyc2UgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgIHZhciByZXZlcnNlZFNlcXVlbmNlID0gaXRlcmFibGUucmV2ZXJzZS5hcHBseSh0aGlzKTsgLy8gc3VwZXIucmV2ZXJzZSgpXG5cdCAgICAgIHJldmVyc2VkU2VxdWVuY2UuZmxpcCA9IGZ1bmN0aW9uKCkgIHtyZXR1cm4gaXRlcmFibGUucmV2ZXJzZSgpfTtcblx0ICAgICAgcmV0dXJuIHJldmVyc2VkU2VxdWVuY2U7XG5cdCAgICB9O1xuXHQgICAgZmxpcFNlcXVlbmNlLmhhcyA9IGZ1bmN0aW9uKGtleSApIHtyZXR1cm4gaXRlcmFibGUuaW5jbHVkZXMoa2V5KX07XG5cdCAgICBmbGlwU2VxdWVuY2UuaW5jbHVkZXMgPSBmdW5jdGlvbihrZXkgKSB7cmV0dXJuIGl0ZXJhYmxlLmhhcyhrZXkpfTtcblx0ICAgIGZsaXBTZXF1ZW5jZS5jYWNoZVJlc3VsdCA9IGNhY2hlUmVzdWx0VGhyb3VnaDtcblx0ICAgIGZsaXBTZXF1ZW5jZS5fX2l0ZXJhdGVVbmNhY2hlZCA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuXHQgICAgICByZXR1cm4gaXRlcmFibGUuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGspICB7cmV0dXJuIGZuKGssIHYsIHRoaXMkMCkgIT09IGZhbHNlfSwgcmV2ZXJzZSk7XG5cdCAgICB9XG5cdCAgICBmbGlwU2VxdWVuY2UuX19pdGVyYXRvclVuY2FjaGVkID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuXHQgICAgICBpZiAodHlwZSA9PT0gSVRFUkFURV9FTlRSSUVTKSB7XG5cdCAgICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmFibGUuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcblx0ICAgICAgICByZXR1cm4gbmV3IHNyY19JdGVyYXRvcl9fSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuXHQgICAgICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG5cdCAgICAgICAgICBpZiAoIXN0ZXAuZG9uZSkge1xuXHQgICAgICAgICAgICB2YXIgayA9IHN0ZXAudmFsdWVbMF07XG5cdCAgICAgICAgICAgIHN0ZXAudmFsdWVbMF0gPSBzdGVwLnZhbHVlWzFdO1xuXHQgICAgICAgICAgICBzdGVwLnZhbHVlWzFdID0gaztcblx0ICAgICAgICAgIH1cblx0ICAgICAgICAgIHJldHVybiBzdGVwO1xuXHQgICAgICAgIH0pO1xuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiBpdGVyYWJsZS5fX2l0ZXJhdG9yKFxuXHQgICAgICAgIHR5cGUgPT09IElURVJBVEVfVkFMVUVTID8gSVRFUkFURV9LRVlTIDogSVRFUkFURV9WQUxVRVMsXG5cdCAgICAgICAgcmV2ZXJzZVxuXHQgICAgICApO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGZsaXBTZXF1ZW5jZTtcblx0ICB9XG5cblxuXHQgIGZ1bmN0aW9uIG1hcEZhY3RvcnkoaXRlcmFibGUsIG1hcHBlciwgY29udGV4dCkge1xuXHQgICAgdmFyIG1hcHBlZFNlcXVlbmNlID0gbWFrZVNlcXVlbmNlKGl0ZXJhYmxlKTtcblx0ICAgIG1hcHBlZFNlcXVlbmNlLnNpemUgPSBpdGVyYWJsZS5zaXplO1xuXHQgICAgbWFwcGVkU2VxdWVuY2UuaGFzID0gZnVuY3Rpb24oa2V5ICkge3JldHVybiBpdGVyYWJsZS5oYXMoa2V5KX07XG5cdCAgICBtYXBwZWRTZXF1ZW5jZS5nZXQgPSBmdW5jdGlvbihrZXksIG5vdFNldFZhbHVlKSAge1xuXHQgICAgICB2YXIgdiA9IGl0ZXJhYmxlLmdldChrZXksIE5PVF9TRVQpO1xuXHQgICAgICByZXR1cm4gdiA9PT0gTk9UX1NFVCA/XG5cdCAgICAgICAgbm90U2V0VmFsdWUgOlxuXHQgICAgICAgIG1hcHBlci5jYWxsKGNvbnRleHQsIHYsIGtleSwgaXRlcmFibGUpO1xuXHQgICAgfTtcblx0ICAgIG1hcHBlZFNlcXVlbmNlLl9faXRlcmF0ZVVuY2FjaGVkID0gZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG5cdCAgICAgIHJldHVybiBpdGVyYWJsZS5fX2l0ZXJhdGUoXG5cdCAgICAgICAgZnVuY3Rpb24odiwgaywgYykgIHtyZXR1cm4gZm4obWFwcGVyLmNhbGwoY29udGV4dCwgdiwgaywgYyksIGssIHRoaXMkMCkgIT09IGZhbHNlfSxcblx0ICAgICAgICByZXZlcnNlXG5cdCAgICAgICk7XG5cdCAgICB9XG5cdCAgICBtYXBwZWRTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbiAodHlwZSwgcmV2ZXJzZSkge1xuXHQgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYWJsZS5fX2l0ZXJhdG9yKElURVJBVEVfRU5UUklFUywgcmV2ZXJzZSk7XG5cdCAgICAgIHJldHVybiBuZXcgc3JjX0l0ZXJhdG9yX19JdGVyYXRvcihmdW5jdGlvbigpICB7XG5cdCAgICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG5cdCAgICAgICAgaWYgKHN0ZXAuZG9uZSkge1xuXHQgICAgICAgICAgcmV0dXJuIHN0ZXA7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG5cdCAgICAgICAgdmFyIGtleSA9IGVudHJ5WzBdO1xuXHQgICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKFxuXHQgICAgICAgICAgdHlwZSxcblx0ICAgICAgICAgIGtleSxcblx0ICAgICAgICAgIG1hcHBlci5jYWxsKGNvbnRleHQsIGVudHJ5WzFdLCBrZXksIGl0ZXJhYmxlKSxcblx0ICAgICAgICAgIHN0ZXBcblx0ICAgICAgICApO1xuXHQgICAgICB9KTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBtYXBwZWRTZXF1ZW5jZTtcblx0ICB9XG5cblxuXHQgIGZ1bmN0aW9uIHJldmVyc2VGYWN0b3J5KGl0ZXJhYmxlLCB1c2VLZXlzKSB7XG5cdCAgICB2YXIgcmV2ZXJzZWRTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShpdGVyYWJsZSk7XG5cdCAgICByZXZlcnNlZFNlcXVlbmNlLl9pdGVyID0gaXRlcmFibGU7XG5cdCAgICByZXZlcnNlZFNlcXVlbmNlLnNpemUgPSBpdGVyYWJsZS5zaXplO1xuXHQgICAgcmV2ZXJzZWRTZXF1ZW5jZS5yZXZlcnNlID0gZnVuY3Rpb24oKSAge3JldHVybiBpdGVyYWJsZX07XG5cdCAgICBpZiAoaXRlcmFibGUuZmxpcCkge1xuXHQgICAgICByZXZlcnNlZFNlcXVlbmNlLmZsaXAgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgdmFyIGZsaXBTZXF1ZW5jZSA9IGZsaXBGYWN0b3J5KGl0ZXJhYmxlKTtcblx0ICAgICAgICBmbGlwU2VxdWVuY2UucmV2ZXJzZSA9IGZ1bmN0aW9uKCkgIHtyZXR1cm4gaXRlcmFibGUuZmxpcCgpfTtcblx0ICAgICAgICByZXR1cm4gZmxpcFNlcXVlbmNlO1xuXHQgICAgICB9O1xuXHQgICAgfVxuXHQgICAgcmV2ZXJzZWRTZXF1ZW5jZS5nZXQgPSBmdW5jdGlvbihrZXksIG5vdFNldFZhbHVlKSBcblx0ICAgICAge3JldHVybiBpdGVyYWJsZS5nZXQodXNlS2V5cyA/IGtleSA6IC0xIC0ga2V5LCBub3RTZXRWYWx1ZSl9O1xuXHQgICAgcmV2ZXJzZWRTZXF1ZW5jZS5oYXMgPSBmdW5jdGlvbihrZXkgKVxuXHQgICAgICB7cmV0dXJuIGl0ZXJhYmxlLmhhcyh1c2VLZXlzID8ga2V5IDogLTEgLSBrZXkpfTtcblx0ICAgIHJldmVyc2VkU2VxdWVuY2UuaW5jbHVkZXMgPSBmdW5jdGlvbih2YWx1ZSApIHtyZXR1cm4gaXRlcmFibGUuaW5jbHVkZXModmFsdWUpfTtcblx0ICAgIHJldmVyc2VkU2VxdWVuY2UuY2FjaGVSZXN1bHQgPSBjYWNoZVJlc3VsdFRocm91Z2g7XG5cdCAgICByZXZlcnNlZFNlcXVlbmNlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuXHQgICAgICByZXR1cm4gaXRlcmFibGUuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGspICB7cmV0dXJuIGZuKHYsIGssIHRoaXMkMCl9LCAhcmV2ZXJzZSk7XG5cdCAgICB9O1xuXHQgICAgcmV2ZXJzZWRTZXF1ZW5jZS5fX2l0ZXJhdG9yID1cblx0ICAgICAgZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkgIHtyZXR1cm4gaXRlcmFibGUuX19pdGVyYXRvcih0eXBlLCAhcmV2ZXJzZSl9O1xuXHQgICAgcmV0dXJuIHJldmVyc2VkU2VxdWVuY2U7XG5cdCAgfVxuXG5cblx0ICBmdW5jdGlvbiBmaWx0ZXJGYWN0b3J5KGl0ZXJhYmxlLCBwcmVkaWNhdGUsIGNvbnRleHQsIHVzZUtleXMpIHtcblx0ICAgIHZhciBmaWx0ZXJTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShpdGVyYWJsZSk7XG5cdCAgICBpZiAodXNlS2V5cykge1xuXHQgICAgICBmaWx0ZXJTZXF1ZW5jZS5oYXMgPSBmdW5jdGlvbihrZXkgKSB7XG5cdCAgICAgICAgdmFyIHYgPSBpdGVyYWJsZS5nZXQoa2V5LCBOT1RfU0VUKTtcblx0ICAgICAgICByZXR1cm4gdiAhPT0gTk9UX1NFVCAmJiAhIXByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHYsIGtleSwgaXRlcmFibGUpO1xuXHQgICAgICB9O1xuXHQgICAgICBmaWx0ZXJTZXF1ZW5jZS5nZXQgPSBmdW5jdGlvbihrZXksIG5vdFNldFZhbHVlKSAge1xuXHQgICAgICAgIHZhciB2ID0gaXRlcmFibGUuZ2V0KGtleSwgTk9UX1NFVCk7XG5cdCAgICAgICAgcmV0dXJuIHYgIT09IE5PVF9TRVQgJiYgcHJlZGljYXRlLmNhbGwoY29udGV4dCwgdiwga2V5LCBpdGVyYWJsZSkgP1xuXHQgICAgICAgICAgdiA6IG5vdFNldFZhbHVlO1xuXHQgICAgICB9O1xuXHQgICAgfVxuXHQgICAgZmlsdGVyU2VxdWVuY2UuX19pdGVyYXRlVW5jYWNoZWQgPSBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcblx0ICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuXHQgICAgICBpdGVyYWJsZS5fX2l0ZXJhdGUoZnVuY3Rpb24odiwgaywgYykgIHtcblx0ICAgICAgICBpZiAocHJlZGljYXRlLmNhbGwoY29udGV4dCwgdiwgaywgYykpIHtcblx0ICAgICAgICAgIGl0ZXJhdGlvbnMrKztcblx0ICAgICAgICAgIHJldHVybiBmbih2LCB1c2VLZXlzID8gayA6IGl0ZXJhdGlvbnMgLSAxLCB0aGlzJDApO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSwgcmV2ZXJzZSk7XG5cdCAgICAgIHJldHVybiBpdGVyYXRpb25zO1xuXHQgICAgfTtcblx0ICAgIGZpbHRlclNlcXVlbmNlLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uICh0eXBlLCByZXZlcnNlKSB7XG5cdCAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhYmxlLl9faXRlcmF0b3IoSVRFUkFURV9FTlRSSUVTLCByZXZlcnNlKTtcblx0ICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuXHQgICAgICByZXR1cm4gbmV3IHNyY19JdGVyYXRvcl9fSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuXHQgICAgICAgIHdoaWxlICh0cnVlKSB7XG5cdCAgICAgICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcblx0ICAgICAgICAgIGlmIChzdGVwLmRvbmUpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIHN0ZXA7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgICB2YXIgZW50cnkgPSBzdGVwLnZhbHVlO1xuXHQgICAgICAgICAgdmFyIGtleSA9IGVudHJ5WzBdO1xuXHQgICAgICAgICAgdmFyIHZhbHVlID0gZW50cnlbMV07XG5cdCAgICAgICAgICBpZiAocHJlZGljYXRlLmNhbGwoY29udGV4dCwgdmFsdWUsIGtleSwgaXRlcmFibGUpKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIHVzZUtleXMgPyBrZXkgOiBpdGVyYXRpb25zKyssIHZhbHVlLCBzdGVwKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICAgIH0pO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGZpbHRlclNlcXVlbmNlO1xuXHQgIH1cblxuXG5cdCAgZnVuY3Rpb24gY291bnRCeUZhY3RvcnkoaXRlcmFibGUsIGdyb3VwZXIsIGNvbnRleHQpIHtcblx0ICAgIHZhciBncm91cHMgPSBzcmNfTWFwX19NYXAoKS5hc011dGFibGUoKTtcblx0ICAgIGl0ZXJhYmxlLl9faXRlcmF0ZShmdW5jdGlvbih2LCBrKSAge1xuXHQgICAgICBncm91cHMudXBkYXRlKFxuXHQgICAgICAgIGdyb3VwZXIuY2FsbChjb250ZXh0LCB2LCBrLCBpdGVyYWJsZSksXG5cdCAgICAgICAgMCxcblx0ICAgICAgICBmdW5jdGlvbihhICkge3JldHVybiBhICsgMX1cblx0ICAgICAgKTtcblx0ICAgIH0pO1xuXHQgICAgcmV0dXJuIGdyb3Vwcy5hc0ltbXV0YWJsZSgpO1xuXHQgIH1cblxuXG5cdCAgZnVuY3Rpb24gZ3JvdXBCeUZhY3RvcnkoaXRlcmFibGUsIGdyb3VwZXIsIGNvbnRleHQpIHtcblx0ICAgIHZhciBpc0tleWVkSXRlciA9IGlzS2V5ZWQoaXRlcmFibGUpO1xuXHQgICAgdmFyIGdyb3VwcyA9IChpc09yZGVyZWQoaXRlcmFibGUpID8gT3JkZXJlZE1hcCgpIDogc3JjX01hcF9fTWFwKCkpLmFzTXV0YWJsZSgpO1xuXHQgICAgaXRlcmFibGUuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGspICB7XG5cdCAgICAgIGdyb3Vwcy51cGRhdGUoXG5cdCAgICAgICAgZ3JvdXBlci5jYWxsKGNvbnRleHQsIHYsIGssIGl0ZXJhYmxlKSxcblx0ICAgICAgICBmdW5jdGlvbihhICkge3JldHVybiAoYSA9IGEgfHwgW10sIGEucHVzaChpc0tleWVkSXRlciA/IFtrLCB2XSA6IHYpLCBhKX1cblx0ICAgICAgKTtcblx0ICAgIH0pO1xuXHQgICAgdmFyIGNvZXJjZSA9IGl0ZXJhYmxlQ2xhc3MoaXRlcmFibGUpO1xuXHQgICAgcmV0dXJuIGdyb3Vwcy5tYXAoZnVuY3Rpb24oYXJyICkge3JldHVybiByZWlmeShpdGVyYWJsZSwgY29lcmNlKGFycikpfSk7XG5cdCAgfVxuXG5cblx0ICBmdW5jdGlvbiBzbGljZUZhY3RvcnkoaXRlcmFibGUsIGJlZ2luLCBlbmQsIHVzZUtleXMpIHtcblx0ICAgIHZhciBvcmlnaW5hbFNpemUgPSBpdGVyYWJsZS5zaXplO1xuXG5cdCAgICBpZiAod2hvbGVTbGljZShiZWdpbiwgZW5kLCBvcmlnaW5hbFNpemUpKSB7XG5cdCAgICAgIHJldHVybiBpdGVyYWJsZTtcblx0ICAgIH1cblxuXHQgICAgdmFyIHJlc29sdmVkQmVnaW4gPSByZXNvbHZlQmVnaW4oYmVnaW4sIG9yaWdpbmFsU2l6ZSk7XG5cdCAgICB2YXIgcmVzb2x2ZWRFbmQgPSByZXNvbHZlRW5kKGVuZCwgb3JpZ2luYWxTaXplKTtcblxuXHQgICAgLy8gYmVnaW4gb3IgZW5kIHdpbGwgYmUgTmFOIGlmIHRoZXkgd2VyZSBwcm92aWRlZCBhcyBuZWdhdGl2ZSBudW1iZXJzIGFuZFxuXHQgICAgLy8gdGhpcyBpdGVyYWJsZSdzIHNpemUgaXMgdW5rbm93bi4gSW4gdGhhdCBjYXNlLCBjYWNoZSBmaXJzdCBzbyB0aGVyZSBpc1xuXHQgICAgLy8gYSBrbm93biBzaXplIGFuZCB0aGVzZSBkbyBub3QgcmVzb2x2ZSB0byBOYU4uXG5cdCAgICBpZiAocmVzb2x2ZWRCZWdpbiAhPT0gcmVzb2x2ZWRCZWdpbiB8fCByZXNvbHZlZEVuZCAhPT0gcmVzb2x2ZWRFbmQpIHtcblx0ICAgICAgcmV0dXJuIHNsaWNlRmFjdG9yeShpdGVyYWJsZS50b1NlcSgpLmNhY2hlUmVzdWx0KCksIGJlZ2luLCBlbmQsIHVzZUtleXMpO1xuXHQgICAgfVxuXG5cdCAgICAvLyBOb3RlOiByZXNvbHZlZEVuZCBpcyB1bmRlZmluZWQgd2hlbiB0aGUgb3JpZ2luYWwgc2VxdWVuY2UncyBsZW5ndGggaXNcblx0ICAgIC8vIHVua25vd24gYW5kIHRoaXMgc2xpY2UgZGlkIG5vdCBzdXBwbHkgYW4gZW5kIGFuZCBzaG91bGQgY29udGFpbiBhbGxcblx0ICAgIC8vIGVsZW1lbnRzIGFmdGVyIHJlc29sdmVkQmVnaW4uXG5cdCAgICAvLyBJbiB0aGF0IGNhc2UsIHJlc29sdmVkU2l6ZSB3aWxsIGJlIE5hTiBhbmQgc2xpY2VTaXplIHdpbGwgcmVtYWluIHVuZGVmaW5lZC5cblx0ICAgIHZhciByZXNvbHZlZFNpemUgPSByZXNvbHZlZEVuZCAtIHJlc29sdmVkQmVnaW47XG5cdCAgICB2YXIgc2xpY2VTaXplO1xuXHQgICAgaWYgKHJlc29sdmVkU2l6ZSA9PT0gcmVzb2x2ZWRTaXplKSB7XG5cdCAgICAgIHNsaWNlU2l6ZSA9IHJlc29sdmVkU2l6ZSA8IDAgPyAwIDogcmVzb2x2ZWRTaXplO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgc2xpY2VTZXEgPSBtYWtlU2VxdWVuY2UoaXRlcmFibGUpO1xuXG5cdCAgICBzbGljZVNlcS5zaXplID0gc2xpY2VTaXplO1xuXG5cdCAgICBpZiAoIXVzZUtleXMgJiYgaXNTZXEoaXRlcmFibGUpICYmIHNsaWNlU2l6ZSA+PSAwKSB7XG5cdCAgICAgIHNsaWNlU2VxLmdldCA9IGZ1bmN0aW9uIChpbmRleCwgbm90U2V0VmFsdWUpIHtcblx0ICAgICAgICBpbmRleCA9IHdyYXBJbmRleCh0aGlzLCBpbmRleCk7XG5cdCAgICAgICAgcmV0dXJuIGluZGV4ID49IDAgJiYgaW5kZXggPCBzbGljZVNpemUgP1xuXHQgICAgICAgICAgaXRlcmFibGUuZ2V0KGluZGV4ICsgcmVzb2x2ZWRCZWdpbiwgbm90U2V0VmFsdWUpIDpcblx0ICAgICAgICAgIG5vdFNldFZhbHVlO1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIHNsaWNlU2VxLl9faXRlcmF0ZVVuY2FjaGVkID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcblx0ICAgICAgaWYgKHNsaWNlU2l6ZSA9PT0gMCkge1xuXHQgICAgICAgIHJldHVybiAwO1xuXHQgICAgICB9XG5cdCAgICAgIGlmIChyZXZlcnNlKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSZXN1bHQoKS5fX2l0ZXJhdGUoZm4sIHJldmVyc2UpO1xuXHQgICAgICB9XG5cdCAgICAgIHZhciBza2lwcGVkID0gMDtcblx0ICAgICAgdmFyIGlzU2tpcHBpbmcgPSB0cnVlO1xuXHQgICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG5cdCAgICAgIGl0ZXJhYmxlLl9faXRlcmF0ZShmdW5jdGlvbih2LCBrKSAge1xuXHQgICAgICAgIGlmICghKGlzU2tpcHBpbmcgJiYgKGlzU2tpcHBpbmcgPSBza2lwcGVkKysgPCByZXNvbHZlZEJlZ2luKSkpIHtcblx0ICAgICAgICAgIGl0ZXJhdGlvbnMrKztcblx0ICAgICAgICAgIHJldHVybiBmbih2LCB1c2VLZXlzID8gayA6IGl0ZXJhdGlvbnMgLSAxLCB0aGlzJDApICE9PSBmYWxzZSAmJlxuXHQgICAgICAgICAgICAgICAgIGl0ZXJhdGlvbnMgIT09IHNsaWNlU2l6ZTtcblx0ICAgICAgICB9XG5cdCAgICAgIH0pO1xuXHQgICAgICByZXR1cm4gaXRlcmF0aW9ucztcblx0ICAgIH07XG5cblx0ICAgIHNsaWNlU2VxLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcblx0ICAgICAgaWYgKHNsaWNlU2l6ZSAhPT0gMCAmJiByZXZlcnNlKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSZXN1bHQoKS5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuXHQgICAgICB9XG5cdCAgICAgIC8vIERvbid0IGJvdGhlciBpbnN0YW50aWF0aW5nIHBhcmVudCBpdGVyYXRvciBpZiB0YWtpbmcgMC5cblx0ICAgICAgdmFyIGl0ZXJhdG9yID0gc2xpY2VTaXplICE9PSAwICYmIGl0ZXJhYmxlLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG5cdCAgICAgIHZhciBza2lwcGVkID0gMDtcblx0ICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuXHQgICAgICByZXR1cm4gbmV3IHNyY19JdGVyYXRvcl9fSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuXHQgICAgICAgIHdoaWxlIChza2lwcGVkKysgPCByZXNvbHZlZEJlZ2luKSB7XG5cdCAgICAgICAgICBpdGVyYXRvci5uZXh0KCk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGlmICgrK2l0ZXJhdGlvbnMgPiBzbGljZVNpemUpIHtcblx0ICAgICAgICAgIHJldHVybiBpdGVyYXRvckRvbmUoKTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG5cdCAgICAgICAgaWYgKHVzZUtleXMgfHwgdHlwZSA9PT0gSVRFUkFURV9WQUxVRVMpIHtcblx0ICAgICAgICAgIHJldHVybiBzdGVwO1xuXHQgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gSVRFUkFURV9LRVlTKSB7XG5cdCAgICAgICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZSh0eXBlLCBpdGVyYXRpb25zIC0gMSwgdW5kZWZpbmVkLCBzdGVwKTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yVmFsdWUodHlwZSwgaXRlcmF0aW9ucyAtIDEsIHN0ZXAudmFsdWVbMV0sIHN0ZXApO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBzbGljZVNlcTtcblx0ICB9XG5cblxuXHQgIGZ1bmN0aW9uIHRha2VXaGlsZUZhY3RvcnkoaXRlcmFibGUsIHByZWRpY2F0ZSwgY29udGV4dCkge1xuXHQgICAgdmFyIHRha2VTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShpdGVyYWJsZSk7XG5cdCAgICB0YWtlU2VxdWVuY2UuX19pdGVyYXRlVW5jYWNoZWQgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuXHQgICAgICBpZiAocmV2ZXJzZSkge1xuXHQgICAgICAgIHJldHVybiB0aGlzLmNhY2hlUmVzdWx0KCkuX19pdGVyYXRlKGZuLCByZXZlcnNlKTtcblx0ICAgICAgfVxuXHQgICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG5cdCAgICAgIGl0ZXJhYmxlLl9faXRlcmF0ZShmdW5jdGlvbih2LCBrLCBjKSBcblx0ICAgICAgICB7cmV0dXJuIHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHYsIGssIGMpICYmICsraXRlcmF0aW9ucyAmJiBmbih2LCBrLCB0aGlzJDApfVxuXHQgICAgICApO1xuXHQgICAgICByZXR1cm4gaXRlcmF0aW9ucztcblx0ICAgIH07XG5cdCAgICB0YWtlU2VxdWVuY2UuX19pdGVyYXRvclVuY2FjaGVkID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuXHQgICAgICBpZiAocmV2ZXJzZSkge1xuXHQgICAgICAgIHJldHVybiB0aGlzLmNhY2hlUmVzdWx0KCkuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcblx0ICAgICAgfVxuXHQgICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYWJsZS5fX2l0ZXJhdG9yKElURVJBVEVfRU5UUklFUywgcmV2ZXJzZSk7XG5cdCAgICAgIHZhciBpdGVyYXRpbmcgPSB0cnVlO1xuXHQgICAgICByZXR1cm4gbmV3IHNyY19JdGVyYXRvcl9fSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuXHQgICAgICAgIGlmICghaXRlcmF0aW5nKSB7XG5cdCAgICAgICAgICByZXR1cm4gaXRlcmF0b3JEb25lKCk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuXHQgICAgICAgIGlmIChzdGVwLmRvbmUpIHtcblx0ICAgICAgICAgIHJldHVybiBzdGVwO1xuXHQgICAgICAgIH1cblx0ICAgICAgICB2YXIgZW50cnkgPSBzdGVwLnZhbHVlO1xuXHQgICAgICAgIHZhciBrID0gZW50cnlbMF07XG5cdCAgICAgICAgdmFyIHYgPSBlbnRyeVsxXTtcblx0ICAgICAgICBpZiAoIXByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHYsIGssIHRoaXMkMCkpIHtcblx0ICAgICAgICAgIGl0ZXJhdGluZyA9IGZhbHNlO1xuXHQgICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yRG9uZSgpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gdHlwZSA9PT0gSVRFUkFURV9FTlRSSUVTID8gc3RlcCA6XG5cdCAgICAgICAgICBpdGVyYXRvclZhbHVlKHR5cGUsIGssIHYsIHN0ZXApO1xuXHQgICAgICB9KTtcblx0ICAgIH07XG5cdCAgICByZXR1cm4gdGFrZVNlcXVlbmNlO1xuXHQgIH1cblxuXG5cdCAgZnVuY3Rpb24gc2tpcFdoaWxlRmFjdG9yeShpdGVyYWJsZSwgcHJlZGljYXRlLCBjb250ZXh0LCB1c2VLZXlzKSB7XG5cdCAgICB2YXIgc2tpcFNlcXVlbmNlID0gbWFrZVNlcXVlbmNlKGl0ZXJhYmxlKTtcblx0ICAgIHNraXBTZXF1ZW5jZS5fX2l0ZXJhdGVVbmNhY2hlZCA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuXHQgICAgICBpZiAocmV2ZXJzZSkge1xuXHQgICAgICAgIHJldHVybiB0aGlzLmNhY2hlUmVzdWx0KCkuX19pdGVyYXRlKGZuLCByZXZlcnNlKTtcblx0ICAgICAgfVxuXHQgICAgICB2YXIgaXNTa2lwcGluZyA9IHRydWU7XG5cdCAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcblx0ICAgICAgaXRlcmFibGUuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGssIGMpICB7XG5cdCAgICAgICAgaWYgKCEoaXNTa2lwcGluZyAmJiAoaXNTa2lwcGluZyA9IHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHYsIGssIGMpKSkpIHtcblx0ICAgICAgICAgIGl0ZXJhdGlvbnMrKztcblx0ICAgICAgICAgIHJldHVybiBmbih2LCB1c2VLZXlzID8gayA6IGl0ZXJhdGlvbnMgLSAxLCB0aGlzJDApO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSk7XG5cdCAgICAgIHJldHVybiBpdGVyYXRpb25zO1xuXHQgICAgfTtcblx0ICAgIHNraXBTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG5cdCAgICAgIGlmIChyZXZlcnNlKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSZXN1bHQoKS5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuXHQgICAgICB9XG5cdCAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhYmxlLl9faXRlcmF0b3IoSVRFUkFURV9FTlRSSUVTLCByZXZlcnNlKTtcblx0ICAgICAgdmFyIHNraXBwaW5nID0gdHJ1ZTtcblx0ICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuXHQgICAgICByZXR1cm4gbmV3IHNyY19JdGVyYXRvcl9fSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuXHQgICAgICAgIHZhciBzdGVwLCBrLCB2O1xuXHQgICAgICAgIGRvIHtcblx0ICAgICAgICAgIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG5cdCAgICAgICAgICBpZiAoc3RlcC5kb25lKSB7XG5cdCAgICAgICAgICAgIGlmICh1c2VLZXlzIHx8IHR5cGUgPT09IElURVJBVEVfVkFMVUVTKSB7XG5cdCAgICAgICAgICAgICAgcmV0dXJuIHN0ZXA7XG5cdCAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gSVRFUkFURV9LRVlTKSB7XG5cdCAgICAgICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yVmFsdWUodHlwZSwgaXRlcmF0aW9ucysrLCB1bmRlZmluZWQsIHN0ZXApO1xuXHQgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgc3RlcC52YWx1ZVsxXSwgc3RlcCk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgIH1cblx0ICAgICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG5cdCAgICAgICAgICBrID0gZW50cnlbMF07XG5cdCAgICAgICAgICB2ID0gZW50cnlbMV07XG5cdCAgICAgICAgICBza2lwcGluZyAmJiAoc2tpcHBpbmcgPSBwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrLCB0aGlzJDApKTtcblx0ICAgICAgICB9IHdoaWxlIChza2lwcGluZyk7XG5cdCAgICAgICAgcmV0dXJuIHR5cGUgPT09IElURVJBVEVfRU5UUklFUyA/IHN0ZXAgOlxuXHQgICAgICAgICAgaXRlcmF0b3JWYWx1ZSh0eXBlLCBrLCB2LCBzdGVwKTtcblx0ICAgICAgfSk7XG5cdCAgICB9O1xuXHQgICAgcmV0dXJuIHNraXBTZXF1ZW5jZTtcblx0ICB9XG5cblxuXHQgIGZ1bmN0aW9uIGNvbmNhdEZhY3RvcnkoaXRlcmFibGUsIHZhbHVlcykge1xuXHQgICAgdmFyIGlzS2V5ZWRJdGVyYWJsZSA9IGlzS2V5ZWQoaXRlcmFibGUpO1xuXHQgICAgdmFyIGl0ZXJzID0gW2l0ZXJhYmxlXS5jb25jYXQodmFsdWVzKS5tYXAoZnVuY3Rpb24odiApIHtcblx0ICAgICAgaWYgKCFpc0l0ZXJhYmxlKHYpKSB7XG5cdCAgICAgICAgdiA9IGlzS2V5ZWRJdGVyYWJsZSA/XG5cdCAgICAgICAgICBrZXllZFNlcUZyb21WYWx1ZSh2KSA6XG5cdCAgICAgICAgICBpbmRleGVkU2VxRnJvbVZhbHVlKEFycmF5LmlzQXJyYXkodikgPyB2IDogW3ZdKTtcblx0ICAgICAgfSBlbHNlIGlmIChpc0tleWVkSXRlcmFibGUpIHtcblx0ICAgICAgICB2ID0gS2V5ZWRJdGVyYWJsZSh2KTtcblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gdjtcblx0ICAgIH0pLmZpbHRlcihmdW5jdGlvbih2ICkge3JldHVybiB2LnNpemUgIT09IDB9KTtcblxuXHQgICAgaWYgKGl0ZXJzLmxlbmd0aCA9PT0gMCkge1xuXHQgICAgICByZXR1cm4gaXRlcmFibGU7XG5cdCAgICB9XG5cblx0ICAgIGlmIChpdGVycy5sZW5ndGggPT09IDEpIHtcblx0ICAgICAgdmFyIHNpbmdsZXRvbiA9IGl0ZXJzWzBdO1xuXHQgICAgICBpZiAoc2luZ2xldG9uID09PSBpdGVyYWJsZSB8fFxuXHQgICAgICAgICAgaXNLZXllZEl0ZXJhYmxlICYmIGlzS2V5ZWQoc2luZ2xldG9uKSB8fFxuXHQgICAgICAgICAgaXNJbmRleGVkKGl0ZXJhYmxlKSAmJiBpc0luZGV4ZWQoc2luZ2xldG9uKSkge1xuXHQgICAgICAgIHJldHVybiBzaW5nbGV0b247XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgdmFyIGNvbmNhdFNlcSA9IG5ldyBBcnJheVNlcShpdGVycyk7XG5cdCAgICBpZiAoaXNLZXllZEl0ZXJhYmxlKSB7XG5cdCAgICAgIGNvbmNhdFNlcSA9IGNvbmNhdFNlcS50b0tleWVkU2VxKCk7XG5cdCAgICB9IGVsc2UgaWYgKCFpc0luZGV4ZWQoaXRlcmFibGUpKSB7XG5cdCAgICAgIGNvbmNhdFNlcSA9IGNvbmNhdFNlcS50b1NldFNlcSgpO1xuXHQgICAgfVxuXHQgICAgY29uY2F0U2VxID0gY29uY2F0U2VxLmZsYXR0ZW4odHJ1ZSk7XG5cdCAgICBjb25jYXRTZXEuc2l6ZSA9IGl0ZXJzLnJlZHVjZShcblx0ICAgICAgZnVuY3Rpb24oc3VtLCBzZXEpICB7XG5cdCAgICAgICAgaWYgKHN1bSAhPT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgICB2YXIgc2l6ZSA9IHNlcS5zaXplO1xuXHQgICAgICAgICAgaWYgKHNpemUgIT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgICAgICByZXR1cm4gc3VtICsgc2l6ZTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICAgIH0sXG5cdCAgICAgIDBcblx0ICAgICk7XG5cdCAgICByZXR1cm4gY29uY2F0U2VxO1xuXHQgIH1cblxuXG5cdCAgZnVuY3Rpb24gZmxhdHRlbkZhY3RvcnkoaXRlcmFibGUsIGRlcHRoLCB1c2VLZXlzKSB7XG5cdCAgICB2YXIgZmxhdFNlcXVlbmNlID0gbWFrZVNlcXVlbmNlKGl0ZXJhYmxlKTtcblx0ICAgIGZsYXRTZXF1ZW5jZS5fX2l0ZXJhdGVVbmNhY2hlZCA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7XG5cdCAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcblx0ICAgICAgdmFyIHN0b3BwZWQgPSBmYWxzZTtcblx0ICAgICAgZnVuY3Rpb24gZmxhdERlZXAoaXRlciwgY3VycmVudERlcHRoKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG5cdCAgICAgICAgaXRlci5fX2l0ZXJhdGUoZnVuY3Rpb24odiwgaykgIHtcblx0ICAgICAgICAgIGlmICgoIWRlcHRoIHx8IGN1cnJlbnREZXB0aCA8IGRlcHRoKSAmJiBpc0l0ZXJhYmxlKHYpKSB7XG5cdCAgICAgICAgICAgIGZsYXREZWVwKHYsIGN1cnJlbnREZXB0aCArIDEpO1xuXHQgICAgICAgICAgfSBlbHNlIGlmIChmbih2LCB1c2VLZXlzID8gayA6IGl0ZXJhdGlvbnMrKywgdGhpcyQwKSA9PT0gZmFsc2UpIHtcblx0ICAgICAgICAgICAgc3RvcHBlZCA9IHRydWU7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgICByZXR1cm4gIXN0b3BwZWQ7XG5cdCAgICAgICAgfSwgcmV2ZXJzZSk7XG5cdCAgICAgIH1cblx0ICAgICAgZmxhdERlZXAoaXRlcmFibGUsIDApO1xuXHQgICAgICByZXR1cm4gaXRlcmF0aW9ucztcblx0ICAgIH1cblx0ICAgIGZsYXRTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG5cdCAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhYmxlLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG5cdCAgICAgIHZhciBzdGFjayA9IFtdO1xuXHQgICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG5cdCAgICAgIHJldHVybiBuZXcgc3JjX0l0ZXJhdG9yX19JdGVyYXRvcihmdW5jdGlvbigpICB7XG5cdCAgICAgICAgd2hpbGUgKGl0ZXJhdG9yKSB7XG5cdCAgICAgICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcblx0ICAgICAgICAgIGlmIChzdGVwLmRvbmUgIT09IGZhbHNlKSB7XG5cdCAgICAgICAgICAgIGl0ZXJhdG9yID0gc3RhY2sucG9wKCk7XG5cdCAgICAgICAgICAgIGNvbnRpbnVlO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgICAgdmFyIHYgPSBzdGVwLnZhbHVlO1xuXHQgICAgICAgICAgaWYgKHR5cGUgPT09IElURVJBVEVfRU5UUklFUykge1xuXHQgICAgICAgICAgICB2ID0gdlsxXTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICAgIGlmICgoIWRlcHRoIHx8IHN0YWNrLmxlbmd0aCA8IGRlcHRoKSAmJiBpc0l0ZXJhYmxlKHYpKSB7XG5cdCAgICAgICAgICAgIHN0YWNrLnB1c2goaXRlcmF0b3IpO1xuXHQgICAgICAgICAgICBpdGVyYXRvciA9IHYuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcblx0ICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgIHJldHVybiB1c2VLZXlzID8gc3RlcCA6IGl0ZXJhdG9yVmFsdWUodHlwZSwgaXRlcmF0aW9ucysrLCB2LCBzdGVwKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIGl0ZXJhdG9yRG9uZSgpO1xuXHQgICAgICB9KTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBmbGF0U2VxdWVuY2U7XG5cdCAgfVxuXG5cblx0ICBmdW5jdGlvbiBmbGF0TWFwRmFjdG9yeShpdGVyYWJsZSwgbWFwcGVyLCBjb250ZXh0KSB7XG5cdCAgICB2YXIgY29lcmNlID0gaXRlcmFibGVDbGFzcyhpdGVyYWJsZSk7XG5cdCAgICByZXR1cm4gaXRlcmFibGUudG9TZXEoKS5tYXAoXG5cdCAgICAgIGZ1bmN0aW9uKHYsIGspICB7cmV0dXJuIGNvZXJjZShtYXBwZXIuY2FsbChjb250ZXh0LCB2LCBrLCBpdGVyYWJsZSkpfVxuXHQgICAgKS5mbGF0dGVuKHRydWUpO1xuXHQgIH1cblxuXG5cdCAgZnVuY3Rpb24gaW50ZXJwb3NlRmFjdG9yeShpdGVyYWJsZSwgc2VwYXJhdG9yKSB7XG5cdCAgICB2YXIgaW50ZXJwb3NlZFNlcXVlbmNlID0gbWFrZVNlcXVlbmNlKGl0ZXJhYmxlKTtcblx0ICAgIGludGVycG9zZWRTZXF1ZW5jZS5zaXplID0gaXRlcmFibGUuc2l6ZSAmJiBpdGVyYWJsZS5zaXplICogMiAtMTtcblx0ICAgIGludGVycG9zZWRTZXF1ZW5jZS5fX2l0ZXJhdGVVbmNhY2hlZCA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG5cdCAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcblx0ICAgICAgaXRlcmFibGUuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGspIFxuXHQgICAgICAgIHtyZXR1cm4gKCFpdGVyYXRpb25zIHx8IGZuKHNlcGFyYXRvciwgaXRlcmF0aW9ucysrLCB0aGlzJDApICE9PSBmYWxzZSkgJiZcblx0ICAgICAgICBmbih2LCBpdGVyYXRpb25zKyssIHRoaXMkMCkgIT09IGZhbHNlfSxcblx0ICAgICAgICByZXZlcnNlXG5cdCAgICAgICk7XG5cdCAgICAgIHJldHVybiBpdGVyYXRpb25zO1xuXHQgICAgfTtcblx0ICAgIGludGVycG9zZWRTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG5cdCAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhYmxlLl9faXRlcmF0b3IoSVRFUkFURV9WQUxVRVMsIHJldmVyc2UpO1xuXHQgICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG5cdCAgICAgIHZhciBzdGVwO1xuXHQgICAgICByZXR1cm4gbmV3IHNyY19JdGVyYXRvcl9fSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuXHQgICAgICAgIGlmICghc3RlcCB8fCBpdGVyYXRpb25zICUgMikge1xuXHQgICAgICAgICAgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcblx0ICAgICAgICAgIGlmIChzdGVwLmRvbmUpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIHN0ZXA7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiBpdGVyYXRpb25zICUgMiA/XG5cdCAgICAgICAgICBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgc2VwYXJhdG9yKSA6XG5cdCAgICAgICAgICBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgc3RlcC52YWx1ZSwgc3RlcCk7XG5cdCAgICAgIH0pO1xuXHQgICAgfTtcblx0ICAgIHJldHVybiBpbnRlcnBvc2VkU2VxdWVuY2U7XG5cdCAgfVxuXG5cblx0ICBmdW5jdGlvbiBzb3J0RmFjdG9yeShpdGVyYWJsZSwgY29tcGFyYXRvciwgbWFwcGVyKSB7XG5cdCAgICBpZiAoIWNvbXBhcmF0b3IpIHtcblx0ICAgICAgY29tcGFyYXRvciA9IGRlZmF1bHRDb21wYXJhdG9yO1xuXHQgICAgfVxuXHQgICAgdmFyIGlzS2V5ZWRJdGVyYWJsZSA9IGlzS2V5ZWQoaXRlcmFibGUpO1xuXHQgICAgdmFyIGluZGV4ID0gMDtcblx0ICAgIHZhciBlbnRyaWVzID0gaXRlcmFibGUudG9TZXEoKS5tYXAoXG5cdCAgICAgIGZ1bmN0aW9uKHYsIGspICB7cmV0dXJuIFtrLCB2LCBpbmRleCsrLCBtYXBwZXIgPyBtYXBwZXIodiwgaywgaXRlcmFibGUpIDogdl19XG5cdCAgICApLnRvQXJyYXkoKTtcblx0ICAgIGVudHJpZXMuc29ydChmdW5jdGlvbihhLCBiKSAge3JldHVybiBjb21wYXJhdG9yKGFbM10sIGJbM10pIHx8IGFbMl0gLSBiWzJdfSkuZm9yRWFjaChcblx0ICAgICAgaXNLZXllZEl0ZXJhYmxlID9cblx0ICAgICAgZnVuY3Rpb24odiwgaSkgIHsgZW50cmllc1tpXS5sZW5ndGggPSAyOyB9IDpcblx0ICAgICAgZnVuY3Rpb24odiwgaSkgIHsgZW50cmllc1tpXSA9IHZbMV07IH1cblx0ICAgICk7XG5cdCAgICByZXR1cm4gaXNLZXllZEl0ZXJhYmxlID8gS2V5ZWRTZXEoZW50cmllcykgOlxuXHQgICAgICBpc0luZGV4ZWQoaXRlcmFibGUpID8gSW5kZXhlZFNlcShlbnRyaWVzKSA6XG5cdCAgICAgIFNldFNlcShlbnRyaWVzKTtcblx0ICB9XG5cblxuXHQgIGZ1bmN0aW9uIG1heEZhY3RvcnkoaXRlcmFibGUsIGNvbXBhcmF0b3IsIG1hcHBlcikge1xuXHQgICAgaWYgKCFjb21wYXJhdG9yKSB7XG5cdCAgICAgIGNvbXBhcmF0b3IgPSBkZWZhdWx0Q29tcGFyYXRvcjtcblx0ICAgIH1cblx0ICAgIGlmIChtYXBwZXIpIHtcblx0ICAgICAgdmFyIGVudHJ5ID0gaXRlcmFibGUudG9TZXEoKVxuXHQgICAgICAgIC5tYXAoZnVuY3Rpb24odiwgaykgIHtyZXR1cm4gW3YsIG1hcHBlcih2LCBrLCBpdGVyYWJsZSldfSlcblx0ICAgICAgICAucmVkdWNlKGZ1bmN0aW9uKGEsIGIpICB7cmV0dXJuIG1heENvbXBhcmUoY29tcGFyYXRvciwgYVsxXSwgYlsxXSkgPyBiIDogYX0pO1xuXHQgICAgICByZXR1cm4gZW50cnkgJiYgZW50cnlbMF07XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICByZXR1cm4gaXRlcmFibGUucmVkdWNlKGZ1bmN0aW9uKGEsIGIpICB7cmV0dXJuIG1heENvbXBhcmUoY29tcGFyYXRvciwgYSwgYikgPyBiIDogYX0pO1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIGZ1bmN0aW9uIG1heENvbXBhcmUoY29tcGFyYXRvciwgYSwgYikge1xuXHQgICAgdmFyIGNvbXAgPSBjb21wYXJhdG9yKGIsIGEpO1xuXHQgICAgLy8gYiBpcyBjb25zaWRlcmVkIHRoZSBuZXcgbWF4IGlmIHRoZSBjb21wYXJhdG9yIGRlY2xhcmVzIHRoZW0gZXF1YWwsIGJ1dFxuXHQgICAgLy8gdGhleSBhcmUgbm90IGVxdWFsIGFuZCBiIGlzIGluIGZhY3QgYSBudWxsaXNoIHZhbHVlLlxuXHQgICAgcmV0dXJuIChjb21wID09PSAwICYmIGIgIT09IGEgJiYgKGIgPT09IHVuZGVmaW5lZCB8fCBiID09PSBudWxsIHx8IGIgIT09IGIpKSB8fCBjb21wID4gMDtcblx0ICB9XG5cblxuXHQgIGZ1bmN0aW9uIHppcFdpdGhGYWN0b3J5KGtleUl0ZXIsIHppcHBlciwgaXRlcnMpIHtcblx0ICAgIHZhciB6aXBTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShrZXlJdGVyKTtcblx0ICAgIHppcFNlcXVlbmNlLnNpemUgPSBuZXcgQXJyYXlTZXEoaXRlcnMpLm1hcChmdW5jdGlvbihpICkge3JldHVybiBpLnNpemV9KS5taW4oKTtcblx0ICAgIC8vIE5vdGU6IHRoaXMgYSBnZW5lcmljIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgX19pdGVyYXRlIGluIHRlcm1zIG9mXG5cdCAgICAvLyBfX2l0ZXJhdG9yIHdoaWNoIG1heSBiZSBtb3JlIGdlbmVyaWNhbGx5IHVzZWZ1bCBpbiB0aGUgZnV0dXJlLlxuXHQgICAgemlwU2VxdWVuY2UuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHtcblx0ICAgICAgLyogZ2VuZXJpYzpcblx0ICAgICAgdmFyIGl0ZXJhdG9yID0gdGhpcy5fX2l0ZXJhdG9yKElURVJBVEVfRU5UUklFUywgcmV2ZXJzZSk7XG5cdCAgICAgIHZhciBzdGVwO1xuXHQgICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG5cdCAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcblx0ICAgICAgICBpdGVyYXRpb25zKys7XG5cdCAgICAgICAgaWYgKGZuKHN0ZXAudmFsdWVbMV0sIHN0ZXAudmFsdWVbMF0sIHRoaXMpID09PSBmYWxzZSkge1xuXHQgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiBpdGVyYXRpb25zO1xuXHQgICAgICAqL1xuXHQgICAgICAvLyBpbmRleGVkOlxuXHQgICAgICB2YXIgaXRlcmF0b3IgPSB0aGlzLl9faXRlcmF0b3IoSVRFUkFURV9WQUxVRVMsIHJldmVyc2UpO1xuXHQgICAgICB2YXIgc3RlcDtcblx0ICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuXHQgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG5cdCAgICAgICAgaWYgKGZuKHN0ZXAudmFsdWUsIGl0ZXJhdGlvbnMrKywgdGhpcykgPT09IGZhbHNlKSB7XG5cdCAgICAgICAgICBicmVhaztcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG5cdCAgICB9O1xuXHQgICAgemlwU2VxdWVuY2UuX19pdGVyYXRvclVuY2FjaGVkID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuXHQgICAgICB2YXIgaXRlcmF0b3JzID0gaXRlcnMubWFwKGZ1bmN0aW9uKGkgKVxuXHQgICAgICAgIHtyZXR1cm4gKGkgPSBJdGVyYWJsZShpKSwgZ2V0SXRlcmF0b3IocmV2ZXJzZSA/IGkucmV2ZXJzZSgpIDogaSkpfVxuXHQgICAgICApO1xuXHQgICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG5cdCAgICAgIHZhciBpc0RvbmUgPSBmYWxzZTtcblx0ICAgICAgcmV0dXJuIG5ldyBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcblx0ICAgICAgICB2YXIgc3RlcHM7XG5cdCAgICAgICAgaWYgKCFpc0RvbmUpIHtcblx0ICAgICAgICAgIHN0ZXBzID0gaXRlcmF0b3JzLm1hcChmdW5jdGlvbihpICkge3JldHVybiBpLm5leHQoKX0pO1xuXHQgICAgICAgICAgaXNEb25lID0gc3RlcHMuc29tZShmdW5jdGlvbihzICkge3JldHVybiBzLmRvbmV9KTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgaWYgKGlzRG9uZSkge1xuXHQgICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yRG9uZSgpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZShcblx0ICAgICAgICAgIHR5cGUsXG5cdCAgICAgICAgICBpdGVyYXRpb25zKyssXG5cdCAgICAgICAgICB6aXBwZXIuYXBwbHkobnVsbCwgc3RlcHMubWFwKGZ1bmN0aW9uKHMgKSB7cmV0dXJuIHMudmFsdWV9KSlcblx0ICAgICAgICApO1xuXHQgICAgICB9KTtcblx0ICAgIH07XG5cdCAgICByZXR1cm4gemlwU2VxdWVuY2Vcblx0ICB9XG5cblxuXHQgIC8vICNwcmFnbWEgSGVscGVyIEZ1bmN0aW9uc1xuXG5cdCAgZnVuY3Rpb24gcmVpZnkoaXRlciwgc2VxKSB7XG5cdCAgICByZXR1cm4gaXNTZXEoaXRlcikgPyBzZXEgOiBpdGVyLmNvbnN0cnVjdG9yKHNlcSk7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gdmFsaWRhdGVFbnRyeShlbnRyeSkge1xuXHQgICAgaWYgKGVudHJ5ICE9PSBPYmplY3QoZW50cnkpKSB7XG5cdCAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIFtLLCBWXSB0dXBsZTogJyArIGVudHJ5KTtcblx0ICAgIH1cblx0ICB9XG5cblx0ICBmdW5jdGlvbiByZXNvbHZlU2l6ZShpdGVyKSB7XG5cdCAgICBhc3NlcnROb3RJbmZpbml0ZShpdGVyLnNpemUpO1xuXHQgICAgcmV0dXJuIGVuc3VyZVNpemUoaXRlcik7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gaXRlcmFibGVDbGFzcyhpdGVyYWJsZSkge1xuXHQgICAgcmV0dXJuIGlzS2V5ZWQoaXRlcmFibGUpID8gS2V5ZWRJdGVyYWJsZSA6XG5cdCAgICAgIGlzSW5kZXhlZChpdGVyYWJsZSkgPyBJbmRleGVkSXRlcmFibGUgOlxuXHQgICAgICBTZXRJdGVyYWJsZTtcblx0ICB9XG5cblx0ICBmdW5jdGlvbiBtYWtlU2VxdWVuY2UoaXRlcmFibGUpIHtcblx0ICAgIHJldHVybiBPYmplY3QuY3JlYXRlKFxuXHQgICAgICAoXG5cdCAgICAgICAgaXNLZXllZChpdGVyYWJsZSkgPyBLZXllZFNlcSA6XG5cdCAgICAgICAgaXNJbmRleGVkKGl0ZXJhYmxlKSA/IEluZGV4ZWRTZXEgOlxuXHQgICAgICAgIFNldFNlcVxuXHQgICAgICApLnByb3RvdHlwZVxuXHQgICAgKTtcblx0ICB9XG5cblx0ICBmdW5jdGlvbiBjYWNoZVJlc3VsdFRocm91Z2goKSB7XG5cdCAgICBpZiAodGhpcy5faXRlci5jYWNoZVJlc3VsdCkge1xuXHQgICAgICB0aGlzLl9pdGVyLmNhY2hlUmVzdWx0KCk7XG5cdCAgICAgIHRoaXMuc2l6ZSA9IHRoaXMuX2l0ZXIuc2l6ZTtcblx0ICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICByZXR1cm4gU2VxLnByb3RvdHlwZS5jYWNoZVJlc3VsdC5jYWxsKHRoaXMpO1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIGZ1bmN0aW9uIGRlZmF1bHRDb21wYXJhdG9yKGEsIGIpIHtcblx0ICAgIHJldHVybiBhID4gYiA/IDEgOiBhIDwgYiA/IC0xIDogMDtcblx0ICB9XG5cblx0ICBmdW5jdGlvbiBmb3JjZUl0ZXJhdG9yKGtleVBhdGgpIHtcblx0ICAgIHZhciBpdGVyID0gZ2V0SXRlcmF0b3Ioa2V5UGF0aCk7XG5cdCAgICBpZiAoIWl0ZXIpIHtcblx0ICAgICAgLy8gQXJyYXkgbWlnaHQgbm90IGJlIGl0ZXJhYmxlIGluIHRoaXMgZW52aXJvbm1lbnQsIHNvIHdlIG5lZWQgYSBmYWxsYmFja1xuXHQgICAgICAvLyB0byBvdXIgd3JhcHBlZCB0eXBlLlxuXHQgICAgICBpZiAoIWlzQXJyYXlMaWtlKGtleVBhdGgpKSB7XG5cdCAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgaXRlcmFibGUgb3IgYXJyYXktbGlrZTogJyArIGtleVBhdGgpO1xuXHQgICAgICB9XG5cdCAgICAgIGl0ZXIgPSBnZXRJdGVyYXRvcihJdGVyYWJsZShrZXlQYXRoKSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gaXRlcjtcblx0ICB9XG5cblx0ICBjcmVhdGVDbGFzcyhzcmNfTWFwX19NYXAsIEtleWVkQ29sbGVjdGlvbik7XG5cblx0ICAgIC8vIEBwcmFnbWEgQ29uc3RydWN0aW9uXG5cblx0ICAgIGZ1bmN0aW9uIHNyY19NYXBfX01hcCh2YWx1ZSkge1xuXHQgICAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCA/IGVtcHR5TWFwKCkgOlxuXHQgICAgICAgIGlzTWFwKHZhbHVlKSA/IHZhbHVlIDpcblx0ICAgICAgICBlbXB0eU1hcCgpLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24obWFwICkge1xuXHQgICAgICAgICAgdmFyIGl0ZXIgPSBLZXllZEl0ZXJhYmxlKHZhbHVlKTtcblx0ICAgICAgICAgIGFzc2VydE5vdEluZmluaXRlKGl0ZXIuc2l6ZSk7XG5cdCAgICAgICAgICBpdGVyLmZvckVhY2goZnVuY3Rpb24odiwgaykgIHtyZXR1cm4gbWFwLnNldChrLCB2KX0pO1xuXHQgICAgICAgIH0pO1xuXHQgICAgfVxuXG5cdCAgICBzcmNfTWFwX19NYXAucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG5cdCAgICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcoJ01hcCB7JywgJ30nKTtcblx0ICAgIH07XG5cblx0ICAgIC8vIEBwcmFnbWEgQWNjZXNzXG5cblx0ICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oaywgbm90U2V0VmFsdWUpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuX3Jvb3QgP1xuXHQgICAgICAgIHRoaXMuX3Jvb3QuZ2V0KDAsIHVuZGVmaW5lZCwgaywgbm90U2V0VmFsdWUpIDpcblx0ICAgICAgICBub3RTZXRWYWx1ZTtcblx0ICAgIH07XG5cblx0ICAgIC8vIEBwcmFnbWEgTW9kaWZpY2F0aW9uXG5cblx0ICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oaywgdikge1xuXHQgICAgICByZXR1cm4gdXBkYXRlTWFwKHRoaXMsIGssIHYpO1xuXHQgICAgfTtcblxuXHQgICAgc3JjX01hcF9fTWFwLnByb3RvdHlwZS5zZXRJbiA9IGZ1bmN0aW9uKGtleVBhdGgsIHYpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMudXBkYXRlSW4oa2V5UGF0aCwgTk9UX1NFVCwgZnVuY3Rpb24oKSAge3JldHVybiB2fSk7XG5cdCAgICB9O1xuXG5cdCAgICBzcmNfTWFwX19NYXAucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKGspIHtcblx0ICAgICAgcmV0dXJuIHVwZGF0ZU1hcCh0aGlzLCBrLCBOT1RfU0VUKTtcblx0ICAgIH07XG5cblx0ICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUuZGVsZXRlSW4gPSBmdW5jdGlvbihrZXlQYXRoKSB7XG5cdCAgICAgIHJldHVybiB0aGlzLnVwZGF0ZUluKGtleVBhdGgsIGZ1bmN0aW9uKCkgIHtyZXR1cm4gTk9UX1NFVH0pO1xuXHQgICAgfTtcblxuXHQgICAgc3JjX01hcF9fTWFwLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihrLCBub3RTZXRWYWx1ZSwgdXBkYXRlcikge1xuXHQgICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA9PT0gMSA/XG5cdCAgICAgICAgayh0aGlzKSA6XG5cdCAgICAgICAgdGhpcy51cGRhdGVJbihba10sIG5vdFNldFZhbHVlLCB1cGRhdGVyKTtcblx0ICAgIH07XG5cblx0ICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUudXBkYXRlSW4gPSBmdW5jdGlvbihrZXlQYXRoLCBub3RTZXRWYWx1ZSwgdXBkYXRlcikge1xuXHQgICAgICBpZiAoIXVwZGF0ZXIpIHtcblx0ICAgICAgICB1cGRhdGVyID0gbm90U2V0VmFsdWU7XG5cdCAgICAgICAgbm90U2V0VmFsdWUgPSB1bmRlZmluZWQ7XG5cdCAgICAgIH1cblx0ICAgICAgdmFyIHVwZGF0ZWRWYWx1ZSA9IHVwZGF0ZUluRGVlcE1hcChcblx0ICAgICAgICB0aGlzLFxuXHQgICAgICAgIGZvcmNlSXRlcmF0b3Ioa2V5UGF0aCksXG5cdCAgICAgICAgbm90U2V0VmFsdWUsXG5cdCAgICAgICAgdXBkYXRlclxuXHQgICAgICApO1xuXHQgICAgICByZXR1cm4gdXBkYXRlZFZhbHVlID09PSBOT1RfU0VUID8gdW5kZWZpbmVkIDogdXBkYXRlZFZhbHVlO1xuXHQgICAgfTtcblxuXHQgICAgc3JjX01hcF9fTWFwLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuXHQgICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICAgIH1cblx0ICAgICAgaWYgKHRoaXMuX19vd25lcklEKSB7XG5cdCAgICAgICAgdGhpcy5zaXplID0gMDtcblx0ICAgICAgICB0aGlzLl9yb290ID0gbnVsbDtcblx0ICAgICAgICB0aGlzLl9faGFzaCA9IHVuZGVmaW5lZDtcblx0ICAgICAgICB0aGlzLl9fYWx0ZXJlZCA9IHRydWU7XG5cdCAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIGVtcHR5TWFwKCk7XG5cdCAgICB9O1xuXG5cdCAgICAvLyBAcHJhZ21hIENvbXBvc2l0aW9uXG5cblx0ICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUubWVyZ2UgPSBmdW5jdGlvbigvKi4uLml0ZXJzKi8pIHtcblx0ICAgICAgcmV0dXJuIG1lcmdlSW50b01hcFdpdGgodGhpcywgdW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuXHQgICAgfTtcblxuXHQgICAgc3JjX01hcF9fTWFwLnByb3RvdHlwZS5tZXJnZVdpdGggPSBmdW5jdGlvbihtZXJnZXIpIHt2YXIgaXRlcnMgPSBTTElDRSQwLmNhbGwoYXJndW1lbnRzLCAxKTtcblx0ICAgICAgcmV0dXJuIG1lcmdlSW50b01hcFdpdGgodGhpcywgbWVyZ2VyLCBpdGVycyk7XG5cdCAgICB9O1xuXG5cdCAgICBzcmNfTWFwX19NYXAucHJvdG90eXBlLm1lcmdlSW4gPSBmdW5jdGlvbihrZXlQYXRoKSB7dmFyIGl0ZXJzID0gU0xJQ0UkMC5jYWxsKGFyZ3VtZW50cywgMSk7XG5cdCAgICAgIHJldHVybiB0aGlzLnVwZGF0ZUluKFxuXHQgICAgICAgIGtleVBhdGgsXG5cdCAgICAgICAgZW1wdHlNYXAoKSxcblx0ICAgICAgICBmdW5jdGlvbihtICkge3JldHVybiB0eXBlb2YgbS5tZXJnZSA9PT0gJ2Z1bmN0aW9uJyA/XG5cdCAgICAgICAgICBtLm1lcmdlLmFwcGx5KG0sIGl0ZXJzKSA6XG5cdCAgICAgICAgICBpdGVyc1tpdGVycy5sZW5ndGggLSAxXX1cblx0ICAgICAgKTtcblx0ICAgIH07XG5cblx0ICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUubWVyZ2VEZWVwID0gZnVuY3Rpb24oLyouLi5pdGVycyovKSB7XG5cdCAgICAgIHJldHVybiBtZXJnZUludG9NYXBXaXRoKHRoaXMsIGRlZXBNZXJnZXIodW5kZWZpbmVkKSwgYXJndW1lbnRzKTtcblx0ICAgIH07XG5cblx0ICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUubWVyZ2VEZWVwV2l0aCA9IGZ1bmN0aW9uKG1lcmdlcikge3ZhciBpdGVycyA9IFNMSUNFJDAuY2FsbChhcmd1bWVudHMsIDEpO1xuXHQgICAgICByZXR1cm4gbWVyZ2VJbnRvTWFwV2l0aCh0aGlzLCBkZWVwTWVyZ2VyKG1lcmdlciksIGl0ZXJzKTtcblx0ICAgIH07XG5cblx0ICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUubWVyZ2VEZWVwSW4gPSBmdW5jdGlvbihrZXlQYXRoKSB7dmFyIGl0ZXJzID0gU0xJQ0UkMC5jYWxsKGFyZ3VtZW50cywgMSk7XG5cdCAgICAgIHJldHVybiB0aGlzLnVwZGF0ZUluKFxuXHQgICAgICAgIGtleVBhdGgsXG5cdCAgICAgICAgZW1wdHlNYXAoKSxcblx0ICAgICAgICBmdW5jdGlvbihtICkge3JldHVybiB0eXBlb2YgbS5tZXJnZURlZXAgPT09ICdmdW5jdGlvbicgP1xuXHQgICAgICAgICAgbS5tZXJnZURlZXAuYXBwbHkobSwgaXRlcnMpIDpcblx0ICAgICAgICAgIGl0ZXJzW2l0ZXJzLmxlbmd0aCAtIDFdfVxuXHQgICAgICApO1xuXHQgICAgfTtcblxuXHQgICAgc3JjX01hcF9fTWFwLnByb3RvdHlwZS5zb3J0ID0gZnVuY3Rpb24oY29tcGFyYXRvcikge1xuXHQgICAgICAvLyBMYXRlIGJpbmRpbmdcblx0ICAgICAgcmV0dXJuIE9yZGVyZWRNYXAoc29ydEZhY3RvcnkodGhpcywgY29tcGFyYXRvcikpO1xuXHQgICAgfTtcblxuXHQgICAgc3JjX01hcF9fTWFwLnByb3RvdHlwZS5zb3J0QnkgPSBmdW5jdGlvbihtYXBwZXIsIGNvbXBhcmF0b3IpIHtcblx0ICAgICAgLy8gTGF0ZSBiaW5kaW5nXG5cdCAgICAgIHJldHVybiBPcmRlcmVkTWFwKHNvcnRGYWN0b3J5KHRoaXMsIGNvbXBhcmF0b3IsIG1hcHBlcikpO1xuXHQgICAgfTtcblxuXHQgICAgLy8gQHByYWdtYSBNdXRhYmlsaXR5XG5cblx0ICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUud2l0aE11dGF0aW9ucyA9IGZ1bmN0aW9uKGZuKSB7XG5cdCAgICAgIHZhciBtdXRhYmxlID0gdGhpcy5hc011dGFibGUoKTtcblx0ICAgICAgZm4obXV0YWJsZSk7XG5cdCAgICAgIHJldHVybiBtdXRhYmxlLndhc0FsdGVyZWQoKSA/IG11dGFibGUuX19lbnN1cmVPd25lcih0aGlzLl9fb3duZXJJRCkgOiB0aGlzO1xuXHQgICAgfTtcblxuXHQgICAgc3JjX01hcF9fTWFwLnByb3RvdHlwZS5hc011dGFibGUgPSBmdW5jdGlvbigpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuX19vd25lcklEID8gdGhpcyA6IHRoaXMuX19lbnN1cmVPd25lcihuZXcgT3duZXJJRCgpKTtcblx0ICAgIH07XG5cblx0ICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUuYXNJbW11dGFibGUgPSBmdW5jdGlvbigpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuX19lbnN1cmVPd25lcigpO1xuXHQgICAgfTtcblxuXHQgICAgc3JjX01hcF9fTWFwLnByb3RvdHlwZS53YXNBbHRlcmVkID0gZnVuY3Rpb24oKSB7XG5cdCAgICAgIHJldHVybiB0aGlzLl9fYWx0ZXJlZDtcblx0ICAgIH07XG5cblx0ICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcblx0ICAgICAgcmV0dXJuIG5ldyBNYXBJdGVyYXRvcih0aGlzLCB0eXBlLCByZXZlcnNlKTtcblx0ICAgIH07XG5cblx0ICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcblx0ICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuXHQgICAgICB0aGlzLl9yb290ICYmIHRoaXMuX3Jvb3QuaXRlcmF0ZShmdW5jdGlvbihlbnRyeSApIHtcblx0ICAgICAgICBpdGVyYXRpb25zKys7XG5cdCAgICAgICAgcmV0dXJuIGZuKGVudHJ5WzFdLCBlbnRyeVswXSwgdGhpcyQwKTtcblx0ICAgICAgfSwgcmV2ZXJzZSk7XG5cdCAgICAgIHJldHVybiBpdGVyYXRpb25zO1xuXHQgICAgfTtcblxuXHQgICAgc3JjX01hcF9fTWFwLnByb3RvdHlwZS5fX2Vuc3VyZU93bmVyID0gZnVuY3Rpb24ob3duZXJJRCkge1xuXHQgICAgICBpZiAob3duZXJJRCA9PT0gdGhpcy5fX293bmVySUQpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgfVxuXHQgICAgICBpZiAoIW93bmVySUQpIHtcblx0ICAgICAgICB0aGlzLl9fb3duZXJJRCA9IG93bmVySUQ7XG5cdCAgICAgICAgdGhpcy5fX2FsdGVyZWQgPSBmYWxzZTtcblx0ICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gbWFrZU1hcCh0aGlzLnNpemUsIHRoaXMuX3Jvb3QsIG93bmVySUQsIHRoaXMuX19oYXNoKTtcblx0ICAgIH07XG5cblxuXHQgIGZ1bmN0aW9uIGlzTWFwKG1heWJlTWFwKSB7XG5cdCAgICByZXR1cm4gISEobWF5YmVNYXAgJiYgbWF5YmVNYXBbSVNfTUFQX1NFTlRJTkVMXSk7XG5cdCAgfVxuXG5cdCAgc3JjX01hcF9fTWFwLmlzTWFwID0gaXNNYXA7XG5cblx0ICB2YXIgSVNfTUFQX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfTUFQX19AQCc7XG5cblx0ICB2YXIgTWFwUHJvdG90eXBlID0gc3JjX01hcF9fTWFwLnByb3RvdHlwZTtcblx0ICBNYXBQcm90b3R5cGVbSVNfTUFQX1NFTlRJTkVMXSA9IHRydWU7XG5cdCAgTWFwUHJvdG90eXBlW0RFTEVURV0gPSBNYXBQcm90b3R5cGUucmVtb3ZlO1xuXHQgIE1hcFByb3RvdHlwZS5yZW1vdmVJbiA9IE1hcFByb3RvdHlwZS5kZWxldGVJbjtcblxuXG5cdCAgLy8gI3ByYWdtYSBUcmllIE5vZGVzXG5cblxuXG5cdCAgICBmdW5jdGlvbiBBcnJheU1hcE5vZGUob3duZXJJRCwgZW50cmllcykge1xuXHQgICAgICB0aGlzLm93bmVySUQgPSBvd25lcklEO1xuXHQgICAgICB0aGlzLmVudHJpZXMgPSBlbnRyaWVzO1xuXHQgICAgfVxuXG5cdCAgICBBcnJheU1hcE5vZGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKHNoaWZ0LCBrZXlIYXNoLCBrZXksIG5vdFNldFZhbHVlKSB7XG5cdCAgICAgIHZhciBlbnRyaWVzID0gdGhpcy5lbnRyaWVzO1xuXHQgICAgICBmb3IgKHZhciBpaSA9IDAsIGxlbiA9IGVudHJpZXMubGVuZ3RoOyBpaSA8IGxlbjsgaWkrKykge1xuXHQgICAgICAgIGlmIChpcyhrZXksIGVudHJpZXNbaWldWzBdKSkge1xuXHQgICAgICAgICAgcmV0dXJuIGVudHJpZXNbaWldWzFdO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gbm90U2V0VmFsdWU7XG5cdCAgICB9O1xuXG5cdCAgICBBcnJheU1hcE5vZGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKG93bmVySUQsIHNoaWZ0LCBrZXlIYXNoLCBrZXksIHZhbHVlLCBkaWRDaGFuZ2VTaXplLCBkaWRBbHRlcikge1xuXHQgICAgICB2YXIgcmVtb3ZlZCA9IHZhbHVlID09PSBOT1RfU0VUO1xuXG5cdCAgICAgIHZhciBlbnRyaWVzID0gdGhpcy5lbnRyaWVzO1xuXHQgICAgICB2YXIgaWR4ID0gMDtcblx0ICAgICAgZm9yICh2YXIgbGVuID0gZW50cmllcy5sZW5ndGg7IGlkeCA8IGxlbjsgaWR4KyspIHtcblx0ICAgICAgICBpZiAoaXMoa2V5LCBlbnRyaWVzW2lkeF1bMF0pKSB7XG5cdCAgICAgICAgICBicmVhaztcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgICAgdmFyIGV4aXN0cyA9IGlkeCA8IGxlbjtcblxuXHQgICAgICBpZiAoZXhpc3RzID8gZW50cmllc1tpZHhdWzFdID09PSB2YWx1ZSA6IHJlbW92ZWQpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgfVxuXG5cdCAgICAgIFNldFJlZihkaWRBbHRlcik7XG5cdCAgICAgIChyZW1vdmVkIHx8ICFleGlzdHMpICYmIFNldFJlZihkaWRDaGFuZ2VTaXplKTtcblxuXHQgICAgICBpZiAocmVtb3ZlZCAmJiBlbnRyaWVzLmxlbmd0aCA9PT0gMSkge1xuXHQgICAgICAgIHJldHVybjsgLy8gdW5kZWZpbmVkXG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAoIWV4aXN0cyAmJiAhcmVtb3ZlZCAmJiBlbnRyaWVzLmxlbmd0aCA+PSBNQVhfQVJSQVlfTUFQX1NJWkUpIHtcblx0ICAgICAgICByZXR1cm4gY3JlYXRlTm9kZXMob3duZXJJRCwgZW50cmllcywga2V5LCB2YWx1ZSk7XG5cdCAgICAgIH1cblxuXHQgICAgICB2YXIgaXNFZGl0YWJsZSA9IG93bmVySUQgJiYgb3duZXJJRCA9PT0gdGhpcy5vd25lcklEO1xuXHQgICAgICB2YXIgbmV3RW50cmllcyA9IGlzRWRpdGFibGUgPyBlbnRyaWVzIDogYXJyQ29weShlbnRyaWVzKTtcblxuXHQgICAgICBpZiAoZXhpc3RzKSB7XG5cdCAgICAgICAgaWYgKHJlbW92ZWQpIHtcblx0ICAgICAgICAgIGlkeCA9PT0gbGVuIC0gMSA/IG5ld0VudHJpZXMucG9wKCkgOiAobmV3RW50cmllc1tpZHhdID0gbmV3RW50cmllcy5wb3AoKSk7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIG5ld0VudHJpZXNbaWR4XSA9IFtrZXksIHZhbHVlXTtcblx0ICAgICAgICB9XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgbmV3RW50cmllcy5wdXNoKFtrZXksIHZhbHVlXSk7XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAoaXNFZGl0YWJsZSkge1xuXHQgICAgICAgIHRoaXMuZW50cmllcyA9IG5ld0VudHJpZXM7XG5cdCAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gbmV3IEFycmF5TWFwTm9kZShvd25lcklELCBuZXdFbnRyaWVzKTtcblx0ICAgIH07XG5cblxuXG5cblx0ICAgIGZ1bmN0aW9uIEJpdG1hcEluZGV4ZWROb2RlKG93bmVySUQsIGJpdG1hcCwgbm9kZXMpIHtcblx0ICAgICAgdGhpcy5vd25lcklEID0gb3duZXJJRDtcblx0ICAgICAgdGhpcy5iaXRtYXAgPSBiaXRtYXA7XG5cdCAgICAgIHRoaXMubm9kZXMgPSBub2Rlcztcblx0ICAgIH1cblxuXHQgICAgQml0bWFwSW5kZXhlZE5vZGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKHNoaWZ0LCBrZXlIYXNoLCBrZXksIG5vdFNldFZhbHVlKSB7XG5cdCAgICAgIGlmIChrZXlIYXNoID09PSB1bmRlZmluZWQpIHtcblx0ICAgICAgICBrZXlIYXNoID0gaGFzaChrZXkpO1xuXHQgICAgICB9XG5cdCAgICAgIHZhciBiaXQgPSAoMSA8PCAoKHNoaWZ0ID09PSAwID8ga2V5SGFzaCA6IGtleUhhc2ggPj4+IHNoaWZ0KSAmIE1BU0spKTtcblx0ICAgICAgdmFyIGJpdG1hcCA9IHRoaXMuYml0bWFwO1xuXHQgICAgICByZXR1cm4gKGJpdG1hcCAmIGJpdCkgPT09IDAgPyBub3RTZXRWYWx1ZSA6XG5cdCAgICAgICAgdGhpcy5ub2Rlc1twb3BDb3VudChiaXRtYXAgJiAoYml0IC0gMSkpXS5nZXQoc2hpZnQgKyBTSElGVCwga2V5SGFzaCwga2V5LCBub3RTZXRWYWx1ZSk7XG5cdCAgICB9O1xuXG5cdCAgICBCaXRtYXBJbmRleGVkTm9kZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24ob3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIGtleSwgdmFsdWUsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKSB7XG5cdCAgICAgIGlmIChrZXlIYXNoID09PSB1bmRlZmluZWQpIHtcblx0ICAgICAgICBrZXlIYXNoID0gaGFzaChrZXkpO1xuXHQgICAgICB9XG5cdCAgICAgIHZhciBrZXlIYXNoRnJhZyA9IChzaGlmdCA9PT0gMCA/IGtleUhhc2ggOiBrZXlIYXNoID4+PiBzaGlmdCkgJiBNQVNLO1xuXHQgICAgICB2YXIgYml0ID0gMSA8PCBrZXlIYXNoRnJhZztcblx0ICAgICAgdmFyIGJpdG1hcCA9IHRoaXMuYml0bWFwO1xuXHQgICAgICB2YXIgZXhpc3RzID0gKGJpdG1hcCAmIGJpdCkgIT09IDA7XG5cblx0ICAgICAgaWYgKCFleGlzdHMgJiYgdmFsdWUgPT09IE5PVF9TRVQpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgfVxuXG5cdCAgICAgIHZhciBpZHggPSBwb3BDb3VudChiaXRtYXAgJiAoYml0IC0gMSkpO1xuXHQgICAgICB2YXIgbm9kZXMgPSB0aGlzLm5vZGVzO1xuXHQgICAgICB2YXIgbm9kZSA9IGV4aXN0cyA/IG5vZGVzW2lkeF0gOiB1bmRlZmluZWQ7XG5cdCAgICAgIHZhciBuZXdOb2RlID0gdXBkYXRlTm9kZShub2RlLCBvd25lcklELCBzaGlmdCArIFNISUZULCBrZXlIYXNoLCBrZXksIHZhbHVlLCBkaWRDaGFuZ2VTaXplLCBkaWRBbHRlcik7XG5cblx0ICAgICAgaWYgKG5ld05vZGUgPT09IG5vZGUpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgfVxuXG5cdCAgICAgIGlmICghZXhpc3RzICYmIG5ld05vZGUgJiYgbm9kZXMubGVuZ3RoID49IE1BWF9CSVRNQVBfSU5ERVhFRF9TSVpFKSB7XG5cdCAgICAgICAgcmV0dXJuIGV4cGFuZE5vZGVzKG93bmVySUQsIG5vZGVzLCBiaXRtYXAsIGtleUhhc2hGcmFnLCBuZXdOb2RlKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIGlmIChleGlzdHMgJiYgIW5ld05vZGUgJiYgbm9kZXMubGVuZ3RoID09PSAyICYmIGlzTGVhZk5vZGUobm9kZXNbaWR4IF4gMV0pKSB7XG5cdCAgICAgICAgcmV0dXJuIG5vZGVzW2lkeCBeIDFdO1xuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKGV4aXN0cyAmJiBuZXdOb2RlICYmIG5vZGVzLmxlbmd0aCA9PT0gMSAmJiBpc0xlYWZOb2RlKG5ld05vZGUpKSB7XG5cdCAgICAgICAgcmV0dXJuIG5ld05vZGU7XG5cdCAgICAgIH1cblxuXHQgICAgICB2YXIgaXNFZGl0YWJsZSA9IG93bmVySUQgJiYgb3duZXJJRCA9PT0gdGhpcy5vd25lcklEO1xuXHQgICAgICB2YXIgbmV3Qml0bWFwID0gZXhpc3RzID8gbmV3Tm9kZSA/IGJpdG1hcCA6IGJpdG1hcCBeIGJpdCA6IGJpdG1hcCB8IGJpdDtcblx0ICAgICAgdmFyIG5ld05vZGVzID0gZXhpc3RzID8gbmV3Tm9kZSA/XG5cdCAgICAgICAgc2V0SW4obm9kZXMsIGlkeCwgbmV3Tm9kZSwgaXNFZGl0YWJsZSkgOlxuXHQgICAgICAgIHNwbGljZU91dChub2RlcywgaWR4LCBpc0VkaXRhYmxlKSA6XG5cdCAgICAgICAgc3BsaWNlSW4obm9kZXMsIGlkeCwgbmV3Tm9kZSwgaXNFZGl0YWJsZSk7XG5cblx0ICAgICAgaWYgKGlzRWRpdGFibGUpIHtcblx0ICAgICAgICB0aGlzLmJpdG1hcCA9IG5ld0JpdG1hcDtcblx0ICAgICAgICB0aGlzLm5vZGVzID0gbmV3Tm9kZXM7XG5cdCAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gbmV3IEJpdG1hcEluZGV4ZWROb2RlKG93bmVySUQsIG5ld0JpdG1hcCwgbmV3Tm9kZXMpO1xuXHQgICAgfTtcblxuXG5cblxuXHQgICAgZnVuY3Rpb24gSGFzaEFycmF5TWFwTm9kZShvd25lcklELCBjb3VudCwgbm9kZXMpIHtcblx0ICAgICAgdGhpcy5vd25lcklEID0gb3duZXJJRDtcblx0ICAgICAgdGhpcy5jb3VudCA9IGNvdW50O1xuXHQgICAgICB0aGlzLm5vZGVzID0gbm9kZXM7XG5cdCAgICB9XG5cblx0ICAgIEhhc2hBcnJheU1hcE5vZGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKHNoaWZ0LCBrZXlIYXNoLCBrZXksIG5vdFNldFZhbHVlKSB7XG5cdCAgICAgIGlmIChrZXlIYXNoID09PSB1bmRlZmluZWQpIHtcblx0ICAgICAgICBrZXlIYXNoID0gaGFzaChrZXkpO1xuXHQgICAgICB9XG5cdCAgICAgIHZhciBpZHggPSAoc2hpZnQgPT09IDAgPyBrZXlIYXNoIDoga2V5SGFzaCA+Pj4gc2hpZnQpICYgTUFTSztcblx0ICAgICAgdmFyIG5vZGUgPSB0aGlzLm5vZGVzW2lkeF07XG5cdCAgICAgIHJldHVybiBub2RlID8gbm9kZS5nZXQoc2hpZnQgKyBTSElGVCwga2V5SGFzaCwga2V5LCBub3RTZXRWYWx1ZSkgOiBub3RTZXRWYWx1ZTtcblx0ICAgIH07XG5cblx0ICAgIEhhc2hBcnJheU1hcE5vZGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKG93bmVySUQsIHNoaWZ0LCBrZXlIYXNoLCBrZXksIHZhbHVlLCBkaWRDaGFuZ2VTaXplLCBkaWRBbHRlcikge1xuXHQgICAgICBpZiAoa2V5SGFzaCA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAga2V5SGFzaCA9IGhhc2goa2V5KTtcblx0ICAgICAgfVxuXHQgICAgICB2YXIgaWR4ID0gKHNoaWZ0ID09PSAwID8ga2V5SGFzaCA6IGtleUhhc2ggPj4+IHNoaWZ0KSAmIE1BU0s7XG5cdCAgICAgIHZhciByZW1vdmVkID0gdmFsdWUgPT09IE5PVF9TRVQ7XG5cdCAgICAgIHZhciBub2RlcyA9IHRoaXMubm9kZXM7XG5cdCAgICAgIHZhciBub2RlID0gbm9kZXNbaWR4XTtcblxuXHQgICAgICBpZiAocmVtb3ZlZCAmJiAhbm9kZSkge1xuXHQgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICB9XG5cblx0ICAgICAgdmFyIG5ld05vZGUgPSB1cGRhdGVOb2RlKG5vZGUsIG93bmVySUQsIHNoaWZ0ICsgU0hJRlQsIGtleUhhc2gsIGtleSwgdmFsdWUsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKTtcblx0ICAgICAgaWYgKG5ld05vZGUgPT09IG5vZGUpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgfVxuXG5cdCAgICAgIHZhciBuZXdDb3VudCA9IHRoaXMuY291bnQ7XG5cdCAgICAgIGlmICghbm9kZSkge1xuXHQgICAgICAgIG5ld0NvdW50Kys7XG5cdCAgICAgIH0gZWxzZSBpZiAoIW5ld05vZGUpIHtcblx0ICAgICAgICBuZXdDb3VudC0tO1xuXHQgICAgICAgIGlmIChuZXdDb3VudCA8IE1JTl9IQVNIX0FSUkFZX01BUF9TSVpFKSB7XG5cdCAgICAgICAgICByZXR1cm4gcGFja05vZGVzKG93bmVySUQsIG5vZGVzLCBuZXdDb3VudCwgaWR4KTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblxuXHQgICAgICB2YXIgaXNFZGl0YWJsZSA9IG93bmVySUQgJiYgb3duZXJJRCA9PT0gdGhpcy5vd25lcklEO1xuXHQgICAgICB2YXIgbmV3Tm9kZXMgPSBzZXRJbihub2RlcywgaWR4LCBuZXdOb2RlLCBpc0VkaXRhYmxlKTtcblxuXHQgICAgICBpZiAoaXNFZGl0YWJsZSkge1xuXHQgICAgICAgIHRoaXMuY291bnQgPSBuZXdDb3VudDtcblx0ICAgICAgICB0aGlzLm5vZGVzID0gbmV3Tm9kZXM7XG5cdCAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gbmV3IEhhc2hBcnJheU1hcE5vZGUob3duZXJJRCwgbmV3Q291bnQsIG5ld05vZGVzKTtcblx0ICAgIH07XG5cblxuXG5cblx0ICAgIGZ1bmN0aW9uIEhhc2hDb2xsaXNpb25Ob2RlKG93bmVySUQsIGtleUhhc2gsIGVudHJpZXMpIHtcblx0ICAgICAgdGhpcy5vd25lcklEID0gb3duZXJJRDtcblx0ICAgICAgdGhpcy5rZXlIYXNoID0ga2V5SGFzaDtcblx0ICAgICAgdGhpcy5lbnRyaWVzID0gZW50cmllcztcblx0ICAgIH1cblxuXHQgICAgSGFzaENvbGxpc2lvbk5vZGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKHNoaWZ0LCBrZXlIYXNoLCBrZXksIG5vdFNldFZhbHVlKSB7XG5cdCAgICAgIHZhciBlbnRyaWVzID0gdGhpcy5lbnRyaWVzO1xuXHQgICAgICBmb3IgKHZhciBpaSA9IDAsIGxlbiA9IGVudHJpZXMubGVuZ3RoOyBpaSA8IGxlbjsgaWkrKykge1xuXHQgICAgICAgIGlmIChpcyhrZXksIGVudHJpZXNbaWldWzBdKSkge1xuXHQgICAgICAgICAgcmV0dXJuIGVudHJpZXNbaWldWzFdO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gbm90U2V0VmFsdWU7XG5cdCAgICB9O1xuXG5cdCAgICBIYXNoQ29sbGlzaW9uTm9kZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24ob3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIGtleSwgdmFsdWUsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKSB7XG5cdCAgICAgIGlmIChrZXlIYXNoID09PSB1bmRlZmluZWQpIHtcblx0ICAgICAgICBrZXlIYXNoID0gaGFzaChrZXkpO1xuXHQgICAgICB9XG5cblx0ICAgICAgdmFyIHJlbW92ZWQgPSB2YWx1ZSA9PT0gTk9UX1NFVDtcblxuXHQgICAgICBpZiAoa2V5SGFzaCAhPT0gdGhpcy5rZXlIYXNoKSB7XG5cdCAgICAgICAgaWYgKHJlbW92ZWQpIHtcblx0ICAgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBTZXRSZWYoZGlkQWx0ZXIpO1xuXHQgICAgICAgIFNldFJlZihkaWRDaGFuZ2VTaXplKTtcblx0ICAgICAgICByZXR1cm4gbWVyZ2VJbnRvTm9kZSh0aGlzLCBvd25lcklELCBzaGlmdCwga2V5SGFzaCwgW2tleSwgdmFsdWVdKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHZhciBlbnRyaWVzID0gdGhpcy5lbnRyaWVzO1xuXHQgICAgICB2YXIgaWR4ID0gMDtcblx0ICAgICAgZm9yICh2YXIgbGVuID0gZW50cmllcy5sZW5ndGg7IGlkeCA8IGxlbjsgaWR4KyspIHtcblx0ICAgICAgICBpZiAoaXMoa2V5LCBlbnRyaWVzW2lkeF1bMF0pKSB7XG5cdCAgICAgICAgICBicmVhaztcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgICAgdmFyIGV4aXN0cyA9IGlkeCA8IGxlbjtcblxuXHQgICAgICBpZiAoZXhpc3RzID8gZW50cmllc1tpZHhdWzFdID09PSB2YWx1ZSA6IHJlbW92ZWQpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgfVxuXG5cdCAgICAgIFNldFJlZihkaWRBbHRlcik7XG5cdCAgICAgIChyZW1vdmVkIHx8ICFleGlzdHMpICYmIFNldFJlZihkaWRDaGFuZ2VTaXplKTtcblxuXHQgICAgICBpZiAocmVtb3ZlZCAmJiBsZW4gPT09IDIpIHtcblx0ICAgICAgICByZXR1cm4gbmV3IFZhbHVlTm9kZShvd25lcklELCB0aGlzLmtleUhhc2gsIGVudHJpZXNbaWR4IF4gMV0pO1xuXHQgICAgICB9XG5cblx0ICAgICAgdmFyIGlzRWRpdGFibGUgPSBvd25lcklEICYmIG93bmVySUQgPT09IHRoaXMub3duZXJJRDtcblx0ICAgICAgdmFyIG5ld0VudHJpZXMgPSBpc0VkaXRhYmxlID8gZW50cmllcyA6IGFyckNvcHkoZW50cmllcyk7XG5cblx0ICAgICAgaWYgKGV4aXN0cykge1xuXHQgICAgICAgIGlmIChyZW1vdmVkKSB7XG5cdCAgICAgICAgICBpZHggPT09IGxlbiAtIDEgPyBuZXdFbnRyaWVzLnBvcCgpIDogKG5ld0VudHJpZXNbaWR4XSA9IG5ld0VudHJpZXMucG9wKCkpO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICBuZXdFbnRyaWVzW2lkeF0gPSBba2V5LCB2YWx1ZV07XG5cdCAgICAgICAgfVxuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIG5ld0VudHJpZXMucHVzaChba2V5LCB2YWx1ZV0pO1xuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKGlzRWRpdGFibGUpIHtcblx0ICAgICAgICB0aGlzLmVudHJpZXMgPSBuZXdFbnRyaWVzO1xuXHQgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuIG5ldyBIYXNoQ29sbGlzaW9uTm9kZShvd25lcklELCB0aGlzLmtleUhhc2gsIG5ld0VudHJpZXMpO1xuXHQgICAgfTtcblxuXG5cblxuXHQgICAgZnVuY3Rpb24gVmFsdWVOb2RlKG93bmVySUQsIGtleUhhc2gsIGVudHJ5KSB7XG5cdCAgICAgIHRoaXMub3duZXJJRCA9IG93bmVySUQ7XG5cdCAgICAgIHRoaXMua2V5SGFzaCA9IGtleUhhc2g7XG5cdCAgICAgIHRoaXMuZW50cnkgPSBlbnRyeTtcblx0ICAgIH1cblxuXHQgICAgVmFsdWVOb2RlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihzaGlmdCwga2V5SGFzaCwga2V5LCBub3RTZXRWYWx1ZSkge1xuXHQgICAgICByZXR1cm4gaXMoa2V5LCB0aGlzLmVudHJ5WzBdKSA/IHRoaXMuZW50cnlbMV0gOiBub3RTZXRWYWx1ZTtcblx0ICAgIH07XG5cblx0ICAgIFZhbHVlTm9kZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24ob3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIGtleSwgdmFsdWUsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKSB7XG5cdCAgICAgIHZhciByZW1vdmVkID0gdmFsdWUgPT09IE5PVF9TRVQ7XG5cdCAgICAgIHZhciBrZXlNYXRjaCA9IGlzKGtleSwgdGhpcy5lbnRyeVswXSk7XG5cdCAgICAgIGlmIChrZXlNYXRjaCA/IHZhbHVlID09PSB0aGlzLmVudHJ5WzFdIDogcmVtb3ZlZCkge1xuXHQgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICB9XG5cblx0ICAgICAgU2V0UmVmKGRpZEFsdGVyKTtcblxuXHQgICAgICBpZiAocmVtb3ZlZCkge1xuXHQgICAgICAgIFNldFJlZihkaWRDaGFuZ2VTaXplKTtcblx0ICAgICAgICByZXR1cm47IC8vIHVuZGVmaW5lZFxuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKGtleU1hdGNoKSB7XG5cdCAgICAgICAgaWYgKG93bmVySUQgJiYgb3duZXJJRCA9PT0gdGhpcy5vd25lcklEKSB7XG5cdCAgICAgICAgICB0aGlzLmVudHJ5WzFdID0gdmFsdWU7XG5cdCAgICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgICB9XG5cdCAgICAgICAgcmV0dXJuIG5ldyBWYWx1ZU5vZGUob3duZXJJRCwgdGhpcy5rZXlIYXNoLCBba2V5LCB2YWx1ZV0pO1xuXHQgICAgICB9XG5cblx0ICAgICAgU2V0UmVmKGRpZENoYW5nZVNpemUpO1xuXHQgICAgICByZXR1cm4gbWVyZ2VJbnRvTm9kZSh0aGlzLCBvd25lcklELCBzaGlmdCwgaGFzaChrZXkpLCBba2V5LCB2YWx1ZV0pO1xuXHQgICAgfTtcblxuXG5cblx0ICAvLyAjcHJhZ21hIEl0ZXJhdG9yc1xuXG5cdCAgQXJyYXlNYXBOb2RlLnByb3RvdHlwZS5pdGVyYXRlID1cblx0ICBIYXNoQ29sbGlzaW9uTm9kZS5wcm90b3R5cGUuaXRlcmF0ZSA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge1xuXHQgICAgdmFyIGVudHJpZXMgPSB0aGlzLmVudHJpZXM7XG5cdCAgICBmb3IgKHZhciBpaSA9IDAsIG1heEluZGV4ID0gZW50cmllcy5sZW5ndGggLSAxOyBpaSA8PSBtYXhJbmRleDsgaWkrKykge1xuXHQgICAgICBpZiAoZm4oZW50cmllc1tyZXZlcnNlID8gbWF4SW5kZXggLSBpaSA6IGlpXSkgPT09IGZhbHNlKSB7XG5cdCAgICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgQml0bWFwSW5kZXhlZE5vZGUucHJvdG90eXBlLml0ZXJhdGUgPVxuXHQgIEhhc2hBcnJheU1hcE5vZGUucHJvdG90eXBlLml0ZXJhdGUgPSBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHtcblx0ICAgIHZhciBub2RlcyA9IHRoaXMubm9kZXM7XG5cdCAgICBmb3IgKHZhciBpaSA9IDAsIG1heEluZGV4ID0gbm9kZXMubGVuZ3RoIC0gMTsgaWkgPD0gbWF4SW5kZXg7IGlpKyspIHtcblx0ICAgICAgdmFyIG5vZGUgPSBub2Rlc1tyZXZlcnNlID8gbWF4SW5kZXggLSBpaSA6IGlpXTtcblx0ICAgICAgaWYgKG5vZGUgJiYgbm9kZS5pdGVyYXRlKGZuLCByZXZlcnNlKSA9PT0gZmFsc2UpIHtcblx0ICAgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9XG5cblx0ICBWYWx1ZU5vZGUucHJvdG90eXBlLml0ZXJhdGUgPSBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHtcblx0ICAgIHJldHVybiBmbih0aGlzLmVudHJ5KTtcblx0ICB9XG5cblx0ICBjcmVhdGVDbGFzcyhNYXBJdGVyYXRvciwgc3JjX0l0ZXJhdG9yX19JdGVyYXRvcik7XG5cblx0ICAgIGZ1bmN0aW9uIE1hcEl0ZXJhdG9yKG1hcCwgdHlwZSwgcmV2ZXJzZSkge1xuXHQgICAgICB0aGlzLl90eXBlID0gdHlwZTtcblx0ICAgICAgdGhpcy5fcmV2ZXJzZSA9IHJldmVyc2U7XG5cdCAgICAgIHRoaXMuX3N0YWNrID0gbWFwLl9yb290ICYmIG1hcEl0ZXJhdG9yRnJhbWUobWFwLl9yb290KTtcblx0ICAgIH1cblxuXHQgICAgTWFwSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcblx0ICAgICAgdmFyIHR5cGUgPSB0aGlzLl90eXBlO1xuXHQgICAgICB2YXIgc3RhY2sgPSB0aGlzLl9zdGFjaztcblx0ICAgICAgd2hpbGUgKHN0YWNrKSB7XG5cdCAgICAgICAgdmFyIG5vZGUgPSBzdGFjay5ub2RlO1xuXHQgICAgICAgIHZhciBpbmRleCA9IHN0YWNrLmluZGV4Kys7XG5cdCAgICAgICAgdmFyIG1heEluZGV4O1xuXHQgICAgICAgIGlmIChub2RlLmVudHJ5KSB7XG5cdCAgICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcblx0ICAgICAgICAgICAgcmV0dXJuIG1hcEl0ZXJhdG9yVmFsdWUodHlwZSwgbm9kZS5lbnRyeSk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfSBlbHNlIGlmIChub2RlLmVudHJpZXMpIHtcblx0ICAgICAgICAgIG1heEluZGV4ID0gbm9kZS5lbnRyaWVzLmxlbmd0aCAtIDE7XG5cdCAgICAgICAgICBpZiAoaW5kZXggPD0gbWF4SW5kZXgpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIG1hcEl0ZXJhdG9yVmFsdWUodHlwZSwgbm9kZS5lbnRyaWVzW3RoaXMuX3JldmVyc2UgPyBtYXhJbmRleCAtIGluZGV4IDogaW5kZXhdKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgbWF4SW5kZXggPSBub2RlLm5vZGVzLmxlbmd0aCAtIDE7XG5cdCAgICAgICAgICBpZiAoaW5kZXggPD0gbWF4SW5kZXgpIHtcblx0ICAgICAgICAgICAgdmFyIHN1Yk5vZGUgPSBub2RlLm5vZGVzW3RoaXMuX3JldmVyc2UgPyBtYXhJbmRleCAtIGluZGV4IDogaW5kZXhdO1xuXHQgICAgICAgICAgICBpZiAoc3ViTm9kZSkge1xuXHQgICAgICAgICAgICAgIGlmIChzdWJOb2RlLmVudHJ5KSB7XG5cdCAgICAgICAgICAgICAgICByZXR1cm4gbWFwSXRlcmF0b3JWYWx1ZSh0eXBlLCBzdWJOb2RlLmVudHJ5KTtcblx0ICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgc3RhY2sgPSB0aGlzLl9zdGFjayA9IG1hcEl0ZXJhdG9yRnJhbWUoc3ViTm9kZSwgc3RhY2spO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIGNvbnRpbnVlO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgICBzdGFjayA9IHRoaXMuX3N0YWNrID0gdGhpcy5fc3RhY2suX19wcmV2O1xuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiBpdGVyYXRvckRvbmUoKTtcblx0ICAgIH07XG5cblxuXHQgIGZ1bmN0aW9uIG1hcEl0ZXJhdG9yVmFsdWUodHlwZSwgZW50cnkpIHtcblx0ICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGVudHJ5WzBdLCBlbnRyeVsxXSk7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gbWFwSXRlcmF0b3JGcmFtZShub2RlLCBwcmV2KSB7XG5cdCAgICByZXR1cm4ge1xuXHQgICAgICBub2RlOiBub2RlLFxuXHQgICAgICBpbmRleDogMCxcblx0ICAgICAgX19wcmV2OiBwcmV2XG5cdCAgICB9O1xuXHQgIH1cblxuXHQgIGZ1bmN0aW9uIG1ha2VNYXAoc2l6ZSwgcm9vdCwgb3duZXJJRCwgaGFzaCkge1xuXHQgICAgdmFyIG1hcCA9IE9iamVjdC5jcmVhdGUoTWFwUHJvdG90eXBlKTtcblx0ICAgIG1hcC5zaXplID0gc2l6ZTtcblx0ICAgIG1hcC5fcm9vdCA9IHJvb3Q7XG5cdCAgICBtYXAuX19vd25lcklEID0gb3duZXJJRDtcblx0ICAgIG1hcC5fX2hhc2ggPSBoYXNoO1xuXHQgICAgbWFwLl9fYWx0ZXJlZCA9IGZhbHNlO1xuXHQgICAgcmV0dXJuIG1hcDtcblx0ICB9XG5cblx0ICB2YXIgRU1QVFlfTUFQO1xuXHQgIGZ1bmN0aW9uIGVtcHR5TWFwKCkge1xuXHQgICAgcmV0dXJuIEVNUFRZX01BUCB8fCAoRU1QVFlfTUFQID0gbWFrZU1hcCgwKSk7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gdXBkYXRlTWFwKG1hcCwgaywgdikge1xuXHQgICAgdmFyIG5ld1Jvb3Q7XG5cdCAgICB2YXIgbmV3U2l6ZTtcblx0ICAgIGlmICghbWFwLl9yb290KSB7XG5cdCAgICAgIGlmICh2ID09PSBOT1RfU0VUKSB7XG5cdCAgICAgICAgcmV0dXJuIG1hcDtcblx0ICAgICAgfVxuXHQgICAgICBuZXdTaXplID0gMTtcblx0ICAgICAgbmV3Um9vdCA9IG5ldyBBcnJheU1hcE5vZGUobWFwLl9fb3duZXJJRCwgW1trLCB2XV0pO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgdmFyIGRpZENoYW5nZVNpemUgPSBNYWtlUmVmKENIQU5HRV9MRU5HVEgpO1xuXHQgICAgICB2YXIgZGlkQWx0ZXIgPSBNYWtlUmVmKERJRF9BTFRFUik7XG5cdCAgICAgIG5ld1Jvb3QgPSB1cGRhdGVOb2RlKG1hcC5fcm9vdCwgbWFwLl9fb3duZXJJRCwgMCwgdW5kZWZpbmVkLCBrLCB2LCBkaWRDaGFuZ2VTaXplLCBkaWRBbHRlcik7XG5cdCAgICAgIGlmICghZGlkQWx0ZXIudmFsdWUpIHtcblx0ICAgICAgICByZXR1cm4gbWFwO1xuXHQgICAgICB9XG5cdCAgICAgIG5ld1NpemUgPSBtYXAuc2l6ZSArIChkaWRDaGFuZ2VTaXplLnZhbHVlID8gdiA9PT0gTk9UX1NFVCA/IC0xIDogMSA6IDApO1xuXHQgICAgfVxuXHQgICAgaWYgKG1hcC5fX293bmVySUQpIHtcblx0ICAgICAgbWFwLnNpemUgPSBuZXdTaXplO1xuXHQgICAgICBtYXAuX3Jvb3QgPSBuZXdSb290O1xuXHQgICAgICBtYXAuX19oYXNoID0gdW5kZWZpbmVkO1xuXHQgICAgICBtYXAuX19hbHRlcmVkID0gdHJ1ZTtcblx0ICAgICAgcmV0dXJuIG1hcDtcblx0ICAgIH1cblx0ICAgIHJldHVybiBuZXdSb290ID8gbWFrZU1hcChuZXdTaXplLCBuZXdSb290KSA6IGVtcHR5TWFwKCk7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gdXBkYXRlTm9kZShub2RlLCBvd25lcklELCBzaGlmdCwga2V5SGFzaCwga2V5LCB2YWx1ZSwgZGlkQ2hhbmdlU2l6ZSwgZGlkQWx0ZXIpIHtcblx0ICAgIGlmICghbm9kZSkge1xuXHQgICAgICBpZiAodmFsdWUgPT09IE5PVF9TRVQpIHtcblx0ICAgICAgICByZXR1cm4gbm9kZTtcblx0ICAgICAgfVxuXHQgICAgICBTZXRSZWYoZGlkQWx0ZXIpO1xuXHQgICAgICBTZXRSZWYoZGlkQ2hhbmdlU2l6ZSk7XG5cdCAgICAgIHJldHVybiBuZXcgVmFsdWVOb2RlKG93bmVySUQsIGtleUhhc2gsIFtrZXksIHZhbHVlXSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gbm9kZS51cGRhdGUob3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIGtleSwgdmFsdWUsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKTtcblx0ICB9XG5cblx0ICBmdW5jdGlvbiBpc0xlYWZOb2RlKG5vZGUpIHtcblx0ICAgIHJldHVybiBub2RlLmNvbnN0cnVjdG9yID09PSBWYWx1ZU5vZGUgfHwgbm9kZS5jb25zdHJ1Y3RvciA9PT0gSGFzaENvbGxpc2lvbk5vZGU7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gbWVyZ2VJbnRvTm9kZShub2RlLCBvd25lcklELCBzaGlmdCwga2V5SGFzaCwgZW50cnkpIHtcblx0ICAgIGlmIChub2RlLmtleUhhc2ggPT09IGtleUhhc2gpIHtcblx0ICAgICAgcmV0dXJuIG5ldyBIYXNoQ29sbGlzaW9uTm9kZShvd25lcklELCBrZXlIYXNoLCBbbm9kZS5lbnRyeSwgZW50cnldKTtcblx0ICAgIH1cblxuXHQgICAgdmFyIGlkeDEgPSAoc2hpZnQgPT09IDAgPyBub2RlLmtleUhhc2ggOiBub2RlLmtleUhhc2ggPj4+IHNoaWZ0KSAmIE1BU0s7XG5cdCAgICB2YXIgaWR4MiA9IChzaGlmdCA9PT0gMCA/IGtleUhhc2ggOiBrZXlIYXNoID4+PiBzaGlmdCkgJiBNQVNLO1xuXG5cdCAgICB2YXIgbmV3Tm9kZTtcblx0ICAgIHZhciBub2RlcyA9IGlkeDEgPT09IGlkeDIgP1xuXHQgICAgICBbbWVyZ2VJbnRvTm9kZShub2RlLCBvd25lcklELCBzaGlmdCArIFNISUZULCBrZXlIYXNoLCBlbnRyeSldIDpcblx0ICAgICAgKChuZXdOb2RlID0gbmV3IFZhbHVlTm9kZShvd25lcklELCBrZXlIYXNoLCBlbnRyeSkpLCBpZHgxIDwgaWR4MiA/IFtub2RlLCBuZXdOb2RlXSA6IFtuZXdOb2RlLCBub2RlXSk7XG5cblx0ICAgIHJldHVybiBuZXcgQml0bWFwSW5kZXhlZE5vZGUob3duZXJJRCwgKDEgPDwgaWR4MSkgfCAoMSA8PCBpZHgyKSwgbm9kZXMpO1xuXHQgIH1cblxuXHQgIGZ1bmN0aW9uIGNyZWF0ZU5vZGVzKG93bmVySUQsIGVudHJpZXMsIGtleSwgdmFsdWUpIHtcblx0ICAgIGlmICghb3duZXJJRCkge1xuXHQgICAgICBvd25lcklEID0gbmV3IE93bmVySUQoKTtcblx0ICAgIH1cblx0ICAgIHZhciBub2RlID0gbmV3IFZhbHVlTm9kZShvd25lcklELCBoYXNoKGtleSksIFtrZXksIHZhbHVlXSk7XG5cdCAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgZW50cmllcy5sZW5ndGg7IGlpKyspIHtcblx0ICAgICAgdmFyIGVudHJ5ID0gZW50cmllc1tpaV07XG5cdCAgICAgIG5vZGUgPSBub2RlLnVwZGF0ZShvd25lcklELCAwLCB1bmRlZmluZWQsIGVudHJ5WzBdLCBlbnRyeVsxXSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gbm9kZTtcblx0ICB9XG5cblx0ICBmdW5jdGlvbiBwYWNrTm9kZXMob3duZXJJRCwgbm9kZXMsIGNvdW50LCBleGNsdWRpbmcpIHtcblx0ICAgIHZhciBiaXRtYXAgPSAwO1xuXHQgICAgdmFyIHBhY2tlZElJID0gMDtcblx0ICAgIHZhciBwYWNrZWROb2RlcyA9IG5ldyBBcnJheShjb3VudCk7XG5cdCAgICBmb3IgKHZhciBpaSA9IDAsIGJpdCA9IDEsIGxlbiA9IG5vZGVzLmxlbmd0aDsgaWkgPCBsZW47IGlpKyssIGJpdCA8PD0gMSkge1xuXHQgICAgICB2YXIgbm9kZSA9IG5vZGVzW2lpXTtcblx0ICAgICAgaWYgKG5vZGUgIT09IHVuZGVmaW5lZCAmJiBpaSAhPT0gZXhjbHVkaW5nKSB7XG5cdCAgICAgICAgYml0bWFwIHw9IGJpdDtcblx0ICAgICAgICBwYWNrZWROb2Rlc1twYWNrZWRJSSsrXSA9IG5vZGU7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICAgIHJldHVybiBuZXcgQml0bWFwSW5kZXhlZE5vZGUob3duZXJJRCwgYml0bWFwLCBwYWNrZWROb2Rlcyk7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gZXhwYW5kTm9kZXMob3duZXJJRCwgbm9kZXMsIGJpdG1hcCwgaW5jbHVkaW5nLCBub2RlKSB7XG5cdCAgICB2YXIgY291bnQgPSAwO1xuXHQgICAgdmFyIGV4cGFuZGVkTm9kZXMgPSBuZXcgQXJyYXkoU0laRSk7XG5cdCAgICBmb3IgKHZhciBpaSA9IDA7IGJpdG1hcCAhPT0gMDsgaWkrKywgYml0bWFwID4+Pj0gMSkge1xuXHQgICAgICBleHBhbmRlZE5vZGVzW2lpXSA9IGJpdG1hcCAmIDEgPyBub2Rlc1tjb3VudCsrXSA6IHVuZGVmaW5lZDtcblx0ICAgIH1cblx0ICAgIGV4cGFuZGVkTm9kZXNbaW5jbHVkaW5nXSA9IG5vZGU7XG5cdCAgICByZXR1cm4gbmV3IEhhc2hBcnJheU1hcE5vZGUob3duZXJJRCwgY291bnQgKyAxLCBleHBhbmRlZE5vZGVzKTtcblx0ICB9XG5cblx0ICBmdW5jdGlvbiBtZXJnZUludG9NYXBXaXRoKG1hcCwgbWVyZ2VyLCBpdGVyYWJsZXMpIHtcblx0ICAgIHZhciBpdGVycyA9IFtdO1xuXHQgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IGl0ZXJhYmxlcy5sZW5ndGg7IGlpKyspIHtcblx0ICAgICAgdmFyIHZhbHVlID0gaXRlcmFibGVzW2lpXTtcblx0ICAgICAgdmFyIGl0ZXIgPSBLZXllZEl0ZXJhYmxlKHZhbHVlKTtcblx0ICAgICAgaWYgKCFpc0l0ZXJhYmxlKHZhbHVlKSkge1xuXHQgICAgICAgIGl0ZXIgPSBpdGVyLm1hcChmdW5jdGlvbih2ICkge3JldHVybiBmcm9tSlModil9KTtcblx0ICAgICAgfVxuXHQgICAgICBpdGVycy5wdXNoKGl0ZXIpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIG1lcmdlSW50b0NvbGxlY3Rpb25XaXRoKG1hcCwgbWVyZ2VyLCBpdGVycyk7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gZGVlcE1lcmdlcihtZXJnZXIpIHtcblx0ICAgIHJldHVybiBmdW5jdGlvbihleGlzdGluZywgdmFsdWUsIGtleSkgXG5cdCAgICAgIHtyZXR1cm4gZXhpc3RpbmcgJiYgZXhpc3RpbmcubWVyZ2VEZWVwV2l0aCAmJiBpc0l0ZXJhYmxlKHZhbHVlKSA/XG5cdCAgICAgICAgZXhpc3RpbmcubWVyZ2VEZWVwV2l0aChtZXJnZXIsIHZhbHVlKSA6XG5cdCAgICAgICAgbWVyZ2VyID8gbWVyZ2VyKGV4aXN0aW5nLCB2YWx1ZSwga2V5KSA6IHZhbHVlfTtcblx0ICB9XG5cblx0ICBmdW5jdGlvbiBtZXJnZUludG9Db2xsZWN0aW9uV2l0aChjb2xsZWN0aW9uLCBtZXJnZXIsIGl0ZXJzKSB7XG5cdCAgICBpdGVycyA9IGl0ZXJzLmZpbHRlcihmdW5jdGlvbih4ICkge3JldHVybiB4LnNpemUgIT09IDB9KTtcblx0ICAgIGlmIChpdGVycy5sZW5ndGggPT09IDApIHtcblx0ICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XG5cdCAgICB9XG5cdCAgICBpZiAoY29sbGVjdGlvbi5zaXplID09PSAwICYmICFjb2xsZWN0aW9uLl9fb3duZXJJRCAmJiBpdGVycy5sZW5ndGggPT09IDEpIHtcblx0ICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uY29uc3RydWN0b3IoaXRlcnNbMF0pO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIGNvbGxlY3Rpb24ud2l0aE11dGF0aW9ucyhmdW5jdGlvbihjb2xsZWN0aW9uICkge1xuXHQgICAgICB2YXIgbWVyZ2VJbnRvTWFwID0gbWVyZ2VyID9cblx0ICAgICAgICBmdW5jdGlvbih2YWx1ZSwga2V5KSAge1xuXHQgICAgICAgICAgY29sbGVjdGlvbi51cGRhdGUoa2V5LCBOT1RfU0VULCBmdW5jdGlvbihleGlzdGluZyApXG5cdCAgICAgICAgICAgIHtyZXR1cm4gZXhpc3RpbmcgPT09IE5PVF9TRVQgPyB2YWx1ZSA6IG1lcmdlcihleGlzdGluZywgdmFsdWUsIGtleSl9XG5cdCAgICAgICAgICApO1xuXHQgICAgICAgIH0gOlxuXHQgICAgICAgIGZ1bmN0aW9uKHZhbHVlLCBrZXkpICB7XG5cdCAgICAgICAgICBjb2xsZWN0aW9uLnNldChrZXksIHZhbHVlKTtcblx0ICAgICAgICB9XG5cdCAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBpdGVycy5sZW5ndGg7IGlpKyspIHtcblx0ICAgICAgICBpdGVyc1tpaV0uZm9yRWFjaChtZXJnZUludG9NYXApO1xuXHQgICAgICB9XG5cdCAgICB9KTtcblx0ICB9XG5cblx0ICBmdW5jdGlvbiB1cGRhdGVJbkRlZXBNYXAoZXhpc3RpbmcsIGtleVBhdGhJdGVyLCBub3RTZXRWYWx1ZSwgdXBkYXRlcikge1xuXHQgICAgdmFyIGlzTm90U2V0ID0gZXhpc3RpbmcgPT09IE5PVF9TRVQ7XG5cdCAgICB2YXIgc3RlcCA9IGtleVBhdGhJdGVyLm5leHQoKTtcblx0ICAgIGlmIChzdGVwLmRvbmUpIHtcblx0ICAgICAgdmFyIGV4aXN0aW5nVmFsdWUgPSBpc05vdFNldCA/IG5vdFNldFZhbHVlIDogZXhpc3Rpbmc7XG5cdCAgICAgIHZhciBuZXdWYWx1ZSA9IHVwZGF0ZXIoZXhpc3RpbmdWYWx1ZSk7XG5cdCAgICAgIHJldHVybiBuZXdWYWx1ZSA9PT0gZXhpc3RpbmdWYWx1ZSA/IGV4aXN0aW5nIDogbmV3VmFsdWU7XG5cdCAgICB9XG5cdCAgICBpbnZhcmlhbnQoXG5cdCAgICAgIGlzTm90U2V0IHx8IChleGlzdGluZyAmJiBleGlzdGluZy5zZXQpLFxuXHQgICAgICAnaW52YWxpZCBrZXlQYXRoJ1xuXHQgICAgKTtcblx0ICAgIHZhciBrZXkgPSBzdGVwLnZhbHVlO1xuXHQgICAgdmFyIG5leHRFeGlzdGluZyA9IGlzTm90U2V0ID8gTk9UX1NFVCA6IGV4aXN0aW5nLmdldChrZXksIE5PVF9TRVQpO1xuXHQgICAgdmFyIG5leHRVcGRhdGVkID0gdXBkYXRlSW5EZWVwTWFwKFxuXHQgICAgICBuZXh0RXhpc3RpbmcsXG5cdCAgICAgIGtleVBhdGhJdGVyLFxuXHQgICAgICBub3RTZXRWYWx1ZSxcblx0ICAgICAgdXBkYXRlclxuXHQgICAgKTtcblx0ICAgIHJldHVybiBuZXh0VXBkYXRlZCA9PT0gbmV4dEV4aXN0aW5nID8gZXhpc3RpbmcgOlxuXHQgICAgICBuZXh0VXBkYXRlZCA9PT0gTk9UX1NFVCA/IGV4aXN0aW5nLnJlbW92ZShrZXkpIDpcblx0ICAgICAgKGlzTm90U2V0ID8gZW1wdHlNYXAoKSA6IGV4aXN0aW5nKS5zZXQoa2V5LCBuZXh0VXBkYXRlZCk7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gcG9wQ291bnQoeCkge1xuXHQgICAgeCA9IHggLSAoKHggPj4gMSkgJiAweDU1NTU1NTU1KTtcblx0ICAgIHggPSAoeCAmIDB4MzMzMzMzMzMpICsgKCh4ID4+IDIpICYgMHgzMzMzMzMzMyk7XG5cdCAgICB4ID0gKHggKyAoeCA+PiA0KSkgJiAweDBmMGYwZjBmO1xuXHQgICAgeCA9IHggKyAoeCA+PiA4KTtcblx0ICAgIHggPSB4ICsgKHggPj4gMTYpO1xuXHQgICAgcmV0dXJuIHggJiAweDdmO1xuXHQgIH1cblxuXHQgIGZ1bmN0aW9uIHNldEluKGFycmF5LCBpZHgsIHZhbCwgY2FuRWRpdCkge1xuXHQgICAgdmFyIG5ld0FycmF5ID0gY2FuRWRpdCA/IGFycmF5IDogYXJyQ29weShhcnJheSk7XG5cdCAgICBuZXdBcnJheVtpZHhdID0gdmFsO1xuXHQgICAgcmV0dXJuIG5ld0FycmF5O1xuXHQgIH1cblxuXHQgIGZ1bmN0aW9uIHNwbGljZUluKGFycmF5LCBpZHgsIHZhbCwgY2FuRWRpdCkge1xuXHQgICAgdmFyIG5ld0xlbiA9IGFycmF5Lmxlbmd0aCArIDE7XG5cdCAgICBpZiAoY2FuRWRpdCAmJiBpZHggKyAxID09PSBuZXdMZW4pIHtcblx0ICAgICAgYXJyYXlbaWR4XSA9IHZhbDtcblx0ICAgICAgcmV0dXJuIGFycmF5O1xuXHQgICAgfVxuXHQgICAgdmFyIG5ld0FycmF5ID0gbmV3IEFycmF5KG5ld0xlbik7XG5cdCAgICB2YXIgYWZ0ZXIgPSAwO1xuXHQgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IG5ld0xlbjsgaWkrKykge1xuXHQgICAgICBpZiAoaWkgPT09IGlkeCkge1xuXHQgICAgICAgIG5ld0FycmF5W2lpXSA9IHZhbDtcblx0ICAgICAgICBhZnRlciA9IC0xO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIG5ld0FycmF5W2lpXSA9IGFycmF5W2lpICsgYWZ0ZXJdO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgICByZXR1cm4gbmV3QXJyYXk7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gc3BsaWNlT3V0KGFycmF5LCBpZHgsIGNhbkVkaXQpIHtcblx0ICAgIHZhciBuZXdMZW4gPSBhcnJheS5sZW5ndGggLSAxO1xuXHQgICAgaWYgKGNhbkVkaXQgJiYgaWR4ID09PSBuZXdMZW4pIHtcblx0ICAgICAgYXJyYXkucG9wKCk7XG5cdCAgICAgIHJldHVybiBhcnJheTtcblx0ICAgIH1cblx0ICAgIHZhciBuZXdBcnJheSA9IG5ldyBBcnJheShuZXdMZW4pO1xuXHQgICAgdmFyIGFmdGVyID0gMDtcblx0ICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBuZXdMZW47IGlpKyspIHtcblx0ICAgICAgaWYgKGlpID09PSBpZHgpIHtcblx0ICAgICAgICBhZnRlciA9IDE7XG5cdCAgICAgIH1cblx0ICAgICAgbmV3QXJyYXlbaWldID0gYXJyYXlbaWkgKyBhZnRlcl07XG5cdCAgICB9XG5cdCAgICByZXR1cm4gbmV3QXJyYXk7XG5cdCAgfVxuXG5cdCAgdmFyIE1BWF9BUlJBWV9NQVBfU0laRSA9IFNJWkUgLyA0O1xuXHQgIHZhciBNQVhfQklUTUFQX0lOREVYRURfU0laRSA9IFNJWkUgLyAyO1xuXHQgIHZhciBNSU5fSEFTSF9BUlJBWV9NQVBfU0laRSA9IFNJWkUgLyA0O1xuXG5cdCAgY3JlYXRlQ2xhc3MoTGlzdCwgSW5kZXhlZENvbGxlY3Rpb24pO1xuXG5cdCAgICAvLyBAcHJhZ21hIENvbnN0cnVjdGlvblxuXG5cdCAgICBmdW5jdGlvbiBMaXN0KHZhbHVlKSB7XG5cdCAgICAgIHZhciBlbXB0eSA9IGVtcHR5TGlzdCgpO1xuXHQgICAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgIHJldHVybiBlbXB0eTtcblx0ICAgICAgfVxuXHQgICAgICBpZiAoaXNMaXN0KHZhbHVlKSkge1xuXHQgICAgICAgIHJldHVybiB2YWx1ZTtcblx0ICAgICAgfVxuXHQgICAgICB2YXIgaXRlciA9IEluZGV4ZWRJdGVyYWJsZSh2YWx1ZSk7XG5cdCAgICAgIHZhciBzaXplID0gaXRlci5zaXplO1xuXHQgICAgICBpZiAoc2l6ZSA9PT0gMCkge1xuXHQgICAgICAgIHJldHVybiBlbXB0eTtcblx0ICAgICAgfVxuXHQgICAgICBhc3NlcnROb3RJbmZpbml0ZShzaXplKTtcblx0ICAgICAgaWYgKHNpemUgPiAwICYmIHNpemUgPCBTSVpFKSB7XG5cdCAgICAgICAgcmV0dXJuIG1ha2VMaXN0KDAsIHNpemUsIFNISUZULCBudWxsLCBuZXcgVk5vZGUoaXRlci50b0FycmF5KCkpKTtcblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gZW1wdHkud2l0aE11dGF0aW9ucyhmdW5jdGlvbihsaXN0ICkge1xuXHQgICAgICAgIGxpc3Quc2V0U2l6ZShzaXplKTtcblx0ICAgICAgICBpdGVyLmZvckVhY2goZnVuY3Rpb24odiwgaSkgIHtyZXR1cm4gbGlzdC5zZXQoaSwgdil9KTtcblx0ICAgICAgfSk7XG5cdCAgICB9XG5cblx0ICAgIExpc3Qub2YgPSBmdW5jdGlvbigvKi4uLnZhbHVlcyovKSB7XG5cdCAgICAgIHJldHVybiB0aGlzKGFyZ3VtZW50cyk7XG5cdCAgICB9O1xuXG5cdCAgICBMaXN0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuXHQgICAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKCdMaXN0IFsnLCAnXScpO1xuXHQgICAgfTtcblxuXHQgICAgLy8gQHByYWdtYSBBY2Nlc3NcblxuXHQgICAgTGlzdC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oaW5kZXgsIG5vdFNldFZhbHVlKSB7XG5cdCAgICAgIGluZGV4ID0gd3JhcEluZGV4KHRoaXMsIGluZGV4KTtcblx0ICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLnNpemUpIHtcblx0ICAgICAgICByZXR1cm4gbm90U2V0VmFsdWU7XG5cdCAgICAgIH1cblx0ICAgICAgaW5kZXggKz0gdGhpcy5fb3JpZ2luO1xuXHQgICAgICB2YXIgbm9kZSA9IGxpc3ROb2RlRm9yKHRoaXMsIGluZGV4KTtcblx0ICAgICAgcmV0dXJuIG5vZGUgJiYgbm9kZS5hcnJheVtpbmRleCAmIE1BU0tdO1xuXHQgICAgfTtcblxuXHQgICAgLy8gQHByYWdtYSBNb2RpZmljYXRpb25cblxuXHQgICAgTGlzdC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oaW5kZXgsIHZhbHVlKSB7XG5cdCAgICAgIHJldHVybiB1cGRhdGVMaXN0KHRoaXMsIGluZGV4LCB2YWx1ZSk7XG5cdCAgICB9O1xuXG5cdCAgICBMaXN0LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihpbmRleCkge1xuXHQgICAgICByZXR1cm4gIXRoaXMuaGFzKGluZGV4KSA/IHRoaXMgOlxuXHQgICAgICAgIGluZGV4ID09PSAwID8gdGhpcy5zaGlmdCgpIDpcblx0ICAgICAgICBpbmRleCA9PT0gdGhpcy5zaXplIC0gMSA/IHRoaXMucG9wKCkgOlxuXHQgICAgICAgIHRoaXMuc3BsaWNlKGluZGV4LCAxKTtcblx0ICAgIH07XG5cblx0ICAgIExpc3QucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG5cdCAgICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcblx0ICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgfVxuXHQgICAgICBpZiAodGhpcy5fX293bmVySUQpIHtcblx0ICAgICAgICB0aGlzLnNpemUgPSB0aGlzLl9vcmlnaW4gPSB0aGlzLl9jYXBhY2l0eSA9IDA7XG5cdCAgICAgICAgdGhpcy5fbGV2ZWwgPSBTSElGVDtcblx0ICAgICAgICB0aGlzLl9yb290ID0gdGhpcy5fdGFpbCA9IG51bGw7XG5cdCAgICAgICAgdGhpcy5fX2hhc2ggPSB1bmRlZmluZWQ7XG5cdCAgICAgICAgdGhpcy5fX2FsdGVyZWQgPSB0cnVlO1xuXHQgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiBlbXB0eUxpc3QoKTtcblx0ICAgIH07XG5cblx0ICAgIExpc3QucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbigvKi4uLnZhbHVlcyovKSB7XG5cdCAgICAgIHZhciB2YWx1ZXMgPSBhcmd1bWVudHM7XG5cdCAgICAgIHZhciBvbGRTaXplID0gdGhpcy5zaXplO1xuXHQgICAgICByZXR1cm4gdGhpcy53aXRoTXV0YXRpb25zKGZ1bmN0aW9uKGxpc3QgKSB7XG5cdCAgICAgICAgc2V0TGlzdEJvdW5kcyhsaXN0LCAwLCBvbGRTaXplICsgdmFsdWVzLmxlbmd0aCk7XG5cdCAgICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IHZhbHVlcy5sZW5ndGg7IGlpKyspIHtcblx0ICAgICAgICAgIGxpc3Quc2V0KG9sZFNpemUgKyBpaSwgdmFsdWVzW2lpXSk7XG5cdCAgICAgICAgfVxuXHQgICAgICB9KTtcblx0ICAgIH07XG5cblx0ICAgIExpc3QucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCkge1xuXHQgICAgICByZXR1cm4gc2V0TGlzdEJvdW5kcyh0aGlzLCAwLCAtMSk7XG5cdCAgICB9O1xuXG5cdCAgICBMaXN0LnByb3RvdHlwZS51bnNoaWZ0ID0gZnVuY3Rpb24oLyouLi52YWx1ZXMqLykge1xuXHQgICAgICB2YXIgdmFsdWVzID0gYXJndW1lbnRzO1xuXHQgICAgICByZXR1cm4gdGhpcy53aXRoTXV0YXRpb25zKGZ1bmN0aW9uKGxpc3QgKSB7XG5cdCAgICAgICAgc2V0TGlzdEJvdW5kcyhsaXN0LCAtdmFsdWVzLmxlbmd0aCk7XG5cdCAgICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IHZhbHVlcy5sZW5ndGg7IGlpKyspIHtcblx0ICAgICAgICAgIGxpc3Quc2V0KGlpLCB2YWx1ZXNbaWldKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH0pO1xuXHQgICAgfTtcblxuXHQgICAgTGlzdC5wcm90b3R5cGUuc2hpZnQgPSBmdW5jdGlvbigpIHtcblx0ICAgICAgcmV0dXJuIHNldExpc3RCb3VuZHModGhpcywgMSk7XG5cdCAgICB9O1xuXG5cdCAgICAvLyBAcHJhZ21hIENvbXBvc2l0aW9uXG5cblx0ICAgIExpc3QucHJvdG90eXBlLm1lcmdlID0gZnVuY3Rpb24oLyouLi5pdGVycyovKSB7XG5cdCAgICAgIHJldHVybiBtZXJnZUludG9MaXN0V2l0aCh0aGlzLCB1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG5cdCAgICB9O1xuXG5cdCAgICBMaXN0LnByb3RvdHlwZS5tZXJnZVdpdGggPSBmdW5jdGlvbihtZXJnZXIpIHt2YXIgaXRlcnMgPSBTTElDRSQwLmNhbGwoYXJndW1lbnRzLCAxKTtcblx0ICAgICAgcmV0dXJuIG1lcmdlSW50b0xpc3RXaXRoKHRoaXMsIG1lcmdlciwgaXRlcnMpO1xuXHQgICAgfTtcblxuXHQgICAgTGlzdC5wcm90b3R5cGUubWVyZ2VEZWVwID0gZnVuY3Rpb24oLyouLi5pdGVycyovKSB7XG5cdCAgICAgIHJldHVybiBtZXJnZUludG9MaXN0V2l0aCh0aGlzLCBkZWVwTWVyZ2VyKHVuZGVmaW5lZCksIGFyZ3VtZW50cyk7XG5cdCAgICB9O1xuXG5cdCAgICBMaXN0LnByb3RvdHlwZS5tZXJnZURlZXBXaXRoID0gZnVuY3Rpb24obWVyZ2VyKSB7dmFyIGl0ZXJzID0gU0xJQ0UkMC5jYWxsKGFyZ3VtZW50cywgMSk7XG5cdCAgICAgIHJldHVybiBtZXJnZUludG9MaXN0V2l0aCh0aGlzLCBkZWVwTWVyZ2VyKG1lcmdlciksIGl0ZXJzKTtcblx0ICAgIH07XG5cblx0ICAgIExpc3QucHJvdG90eXBlLnNldFNpemUgPSBmdW5jdGlvbihzaXplKSB7XG5cdCAgICAgIHJldHVybiBzZXRMaXN0Qm91bmRzKHRoaXMsIDAsIHNpemUpO1xuXHQgICAgfTtcblxuXHQgICAgLy8gQHByYWdtYSBJdGVyYXRpb25cblxuXHQgICAgTGlzdC5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbihiZWdpbiwgZW5kKSB7XG5cdCAgICAgIHZhciBzaXplID0gdGhpcy5zaXplO1xuXHQgICAgICBpZiAod2hvbGVTbGljZShiZWdpbiwgZW5kLCBzaXplKSkge1xuXHQgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiBzZXRMaXN0Qm91bmRzKFxuXHQgICAgICAgIHRoaXMsXG5cdCAgICAgICAgcmVzb2x2ZUJlZ2luKGJlZ2luLCBzaXplKSxcblx0ICAgICAgICByZXNvbHZlRW5kKGVuZCwgc2l6ZSlcblx0ICAgICAgKTtcblx0ICAgIH07XG5cblx0ICAgIExpc3QucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG5cdCAgICAgIHZhciBpbmRleCA9IDA7XG5cdCAgICAgIHZhciB2YWx1ZXMgPSBpdGVyYXRlTGlzdCh0aGlzLCByZXZlcnNlKTtcblx0ICAgICAgcmV0dXJuIG5ldyBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcblx0ICAgICAgICB2YXIgdmFsdWUgPSB2YWx1ZXMoKTtcblx0ICAgICAgICByZXR1cm4gdmFsdWUgPT09IERPTkUgP1xuXHQgICAgICAgICAgaXRlcmF0b3JEb25lKCkgOlxuXHQgICAgICAgICAgaXRlcmF0b3JWYWx1ZSh0eXBlLCBpbmRleCsrLCB2YWx1ZSk7XG5cdCAgICAgIH0pO1xuXHQgICAgfTtcblxuXHQgICAgTGlzdC5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHtcblx0ICAgICAgdmFyIGluZGV4ID0gMDtcblx0ICAgICAgdmFyIHZhbHVlcyA9IGl0ZXJhdGVMaXN0KHRoaXMsIHJldmVyc2UpO1xuXHQgICAgICB2YXIgdmFsdWU7XG5cdCAgICAgIHdoaWxlICgodmFsdWUgPSB2YWx1ZXMoKSkgIT09IERPTkUpIHtcblx0ICAgICAgICBpZiAoZm4odmFsdWUsIGluZGV4KyssIHRoaXMpID09PSBmYWxzZSkge1xuXHQgICAgICAgICAgYnJlYWs7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiBpbmRleDtcblx0ICAgIH07XG5cblx0ICAgIExpc3QucHJvdG90eXBlLl9fZW5zdXJlT3duZXIgPSBmdW5jdGlvbihvd25lcklEKSB7XG5cdCAgICAgIGlmIChvd25lcklEID09PSB0aGlzLl9fb3duZXJJRCkge1xuXHQgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICB9XG5cdCAgICAgIGlmICghb3duZXJJRCkge1xuXHQgICAgICAgIHRoaXMuX19vd25lcklEID0gb3duZXJJRDtcblx0ICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gbWFrZUxpc3QodGhpcy5fb3JpZ2luLCB0aGlzLl9jYXBhY2l0eSwgdGhpcy5fbGV2ZWwsIHRoaXMuX3Jvb3QsIHRoaXMuX3RhaWwsIG93bmVySUQsIHRoaXMuX19oYXNoKTtcblx0ICAgIH07XG5cblxuXHQgIGZ1bmN0aW9uIGlzTGlzdChtYXliZUxpc3QpIHtcblx0ICAgIHJldHVybiAhIShtYXliZUxpc3QgJiYgbWF5YmVMaXN0W0lTX0xJU1RfU0VOVElORUxdKTtcblx0ICB9XG5cblx0ICBMaXN0LmlzTGlzdCA9IGlzTGlzdDtcblxuXHQgIHZhciBJU19MSVNUX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfTElTVF9fQEAnO1xuXG5cdCAgdmFyIExpc3RQcm90b3R5cGUgPSBMaXN0LnByb3RvdHlwZTtcblx0ICBMaXN0UHJvdG90eXBlW0lTX0xJU1RfU0VOVElORUxdID0gdHJ1ZTtcblx0ICBMaXN0UHJvdG90eXBlW0RFTEVURV0gPSBMaXN0UHJvdG90eXBlLnJlbW92ZTtcblx0ICBMaXN0UHJvdG90eXBlLnNldEluID0gTWFwUHJvdG90eXBlLnNldEluO1xuXHQgIExpc3RQcm90b3R5cGUuZGVsZXRlSW4gPVxuXHQgIExpc3RQcm90b3R5cGUucmVtb3ZlSW4gPSBNYXBQcm90b3R5cGUucmVtb3ZlSW47XG5cdCAgTGlzdFByb3RvdHlwZS51cGRhdGUgPSBNYXBQcm90b3R5cGUudXBkYXRlO1xuXHQgIExpc3RQcm90b3R5cGUudXBkYXRlSW4gPSBNYXBQcm90b3R5cGUudXBkYXRlSW47XG5cdCAgTGlzdFByb3RvdHlwZS5tZXJnZUluID0gTWFwUHJvdG90eXBlLm1lcmdlSW47XG5cdCAgTGlzdFByb3RvdHlwZS5tZXJnZURlZXBJbiA9IE1hcFByb3RvdHlwZS5tZXJnZURlZXBJbjtcblx0ICBMaXN0UHJvdG90eXBlLndpdGhNdXRhdGlvbnMgPSBNYXBQcm90b3R5cGUud2l0aE11dGF0aW9ucztcblx0ICBMaXN0UHJvdG90eXBlLmFzTXV0YWJsZSA9IE1hcFByb3RvdHlwZS5hc011dGFibGU7XG5cdCAgTGlzdFByb3RvdHlwZS5hc0ltbXV0YWJsZSA9IE1hcFByb3RvdHlwZS5hc0ltbXV0YWJsZTtcblx0ICBMaXN0UHJvdG90eXBlLndhc0FsdGVyZWQgPSBNYXBQcm90b3R5cGUud2FzQWx0ZXJlZDtcblxuXG5cblx0ICAgIGZ1bmN0aW9uIFZOb2RlKGFycmF5LCBvd25lcklEKSB7XG5cdCAgICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcblx0ICAgICAgdGhpcy5vd25lcklEID0gb3duZXJJRDtcblx0ICAgIH1cblxuXHQgICAgLy8gVE9ETzogc2VlbXMgbGlrZSB0aGVzZSBtZXRob2RzIGFyZSB2ZXJ5IHNpbWlsYXJcblxuXHQgICAgVk5vZGUucHJvdG90eXBlLnJlbW92ZUJlZm9yZSA9IGZ1bmN0aW9uKG93bmVySUQsIGxldmVsLCBpbmRleCkge1xuXHQgICAgICBpZiAoaW5kZXggPT09IGxldmVsID8gMSA8PCBsZXZlbCA6IDAgfHwgdGhpcy5hcnJheS5sZW5ndGggPT09IDApIHtcblx0ICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgfVxuXHQgICAgICB2YXIgb3JpZ2luSW5kZXggPSAoaW5kZXggPj4+IGxldmVsKSAmIE1BU0s7XG5cdCAgICAgIGlmIChvcmlnaW5JbmRleCA+PSB0aGlzLmFycmF5Lmxlbmd0aCkge1xuXHQgICAgICAgIHJldHVybiBuZXcgVk5vZGUoW10sIG93bmVySUQpO1xuXHQgICAgICB9XG5cdCAgICAgIHZhciByZW1vdmluZ0ZpcnN0ID0gb3JpZ2luSW5kZXggPT09IDA7XG5cdCAgICAgIHZhciBuZXdDaGlsZDtcblx0ICAgICAgaWYgKGxldmVsID4gMCkge1xuXHQgICAgICAgIHZhciBvbGRDaGlsZCA9IHRoaXMuYXJyYXlbb3JpZ2luSW5kZXhdO1xuXHQgICAgICAgIG5ld0NoaWxkID0gb2xkQ2hpbGQgJiYgb2xkQ2hpbGQucmVtb3ZlQmVmb3JlKG93bmVySUQsIGxldmVsIC0gU0hJRlQsIGluZGV4KTtcblx0ICAgICAgICBpZiAobmV3Q2hpbGQgPT09IG9sZENoaWxkICYmIHJlbW92aW5nRmlyc3QpIHtcblx0ICAgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgICBpZiAocmVtb3ZpbmdGaXJzdCAmJiAhbmV3Q2hpbGQpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgfVxuXHQgICAgICB2YXIgZWRpdGFibGUgPSBlZGl0YWJsZVZOb2RlKHRoaXMsIG93bmVySUQpO1xuXHQgICAgICBpZiAoIXJlbW92aW5nRmlyc3QpIHtcblx0ICAgICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgb3JpZ2luSW5kZXg7IGlpKyspIHtcblx0ICAgICAgICAgIGVkaXRhYmxlLmFycmF5W2lpXSA9IHVuZGVmaW5lZDtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblx0ICAgICAgaWYgKG5ld0NoaWxkKSB7XG5cdCAgICAgICAgZWRpdGFibGUuYXJyYXlbb3JpZ2luSW5kZXhdID0gbmV3Q2hpbGQ7XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIGVkaXRhYmxlO1xuXHQgICAgfTtcblxuXHQgICAgVk5vZGUucHJvdG90eXBlLnJlbW92ZUFmdGVyID0gZnVuY3Rpb24ob3duZXJJRCwgbGV2ZWwsIGluZGV4KSB7XG5cdCAgICAgIGlmIChpbmRleCA9PT0gbGV2ZWwgPyAxIDw8IGxldmVsIDogMCB8fCB0aGlzLmFycmF5Lmxlbmd0aCA9PT0gMCkge1xuXHQgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICB9XG5cdCAgICAgIHZhciBzaXplSW5kZXggPSAoKGluZGV4IC0gMSkgPj4+IGxldmVsKSAmIE1BU0s7XG5cdCAgICAgIGlmIChzaXplSW5kZXggPj0gdGhpcy5hcnJheS5sZW5ndGgpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgfVxuXHQgICAgICB2YXIgcmVtb3ZpbmdMYXN0ID0gc2l6ZUluZGV4ID09PSB0aGlzLmFycmF5Lmxlbmd0aCAtIDE7XG5cdCAgICAgIHZhciBuZXdDaGlsZDtcblx0ICAgICAgaWYgKGxldmVsID4gMCkge1xuXHQgICAgICAgIHZhciBvbGRDaGlsZCA9IHRoaXMuYXJyYXlbc2l6ZUluZGV4XTtcblx0ICAgICAgICBuZXdDaGlsZCA9IG9sZENoaWxkICYmIG9sZENoaWxkLnJlbW92ZUFmdGVyKG93bmVySUQsIGxldmVsIC0gU0hJRlQsIGluZGV4KTtcblx0ICAgICAgICBpZiAobmV3Q2hpbGQgPT09IG9sZENoaWxkICYmIHJlbW92aW5nTGFzdCkge1xuXHQgICAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICAgIGlmIChyZW1vdmluZ0xhc3QgJiYgIW5ld0NoaWxkKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICAgIH1cblx0ICAgICAgdmFyIGVkaXRhYmxlID0gZWRpdGFibGVWTm9kZSh0aGlzLCBvd25lcklEKTtcblx0ICAgICAgaWYgKCFyZW1vdmluZ0xhc3QpIHtcblx0ICAgICAgICBlZGl0YWJsZS5hcnJheS5wb3AoKTtcblx0ICAgICAgfVxuXHQgICAgICBpZiAobmV3Q2hpbGQpIHtcblx0ICAgICAgICBlZGl0YWJsZS5hcnJheVtzaXplSW5kZXhdID0gbmV3Q2hpbGQ7XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIGVkaXRhYmxlO1xuXHQgICAgfTtcblxuXG5cblx0ICB2YXIgRE9ORSA9IHt9O1xuXG5cdCAgZnVuY3Rpb24gaXRlcmF0ZUxpc3QobGlzdCwgcmV2ZXJzZSkge1xuXHQgICAgdmFyIGxlZnQgPSBsaXN0Ll9vcmlnaW47XG5cdCAgICB2YXIgcmlnaHQgPSBsaXN0Ll9jYXBhY2l0eTtcblx0ICAgIHZhciB0YWlsUG9zID0gZ2V0VGFpbE9mZnNldChyaWdodCk7XG5cdCAgICB2YXIgdGFpbCA9IGxpc3QuX3RhaWw7XG5cblx0ICAgIHJldHVybiBpdGVyYXRlTm9kZU9yTGVhZihsaXN0Ll9yb290LCBsaXN0Ll9sZXZlbCwgMCk7XG5cblx0ICAgIGZ1bmN0aW9uIGl0ZXJhdGVOb2RlT3JMZWFmKG5vZGUsIGxldmVsLCBvZmZzZXQpIHtcblx0ICAgICAgcmV0dXJuIGxldmVsID09PSAwID9cblx0ICAgICAgICBpdGVyYXRlTGVhZihub2RlLCBvZmZzZXQpIDpcblx0ICAgICAgICBpdGVyYXRlTm9kZShub2RlLCBsZXZlbCwgb2Zmc2V0KTtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gaXRlcmF0ZUxlYWYobm9kZSwgb2Zmc2V0KSB7XG5cdCAgICAgIHZhciBhcnJheSA9IG9mZnNldCA9PT0gdGFpbFBvcyA/IHRhaWwgJiYgdGFpbC5hcnJheSA6IG5vZGUgJiYgbm9kZS5hcnJheTtcblx0ICAgICAgdmFyIGZyb20gPSBvZmZzZXQgPiBsZWZ0ID8gMCA6IGxlZnQgLSBvZmZzZXQ7XG5cdCAgICAgIHZhciB0byA9IHJpZ2h0IC0gb2Zmc2V0O1xuXHQgICAgICBpZiAodG8gPiBTSVpFKSB7XG5cdCAgICAgICAgdG8gPSBTSVpFO1xuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiBmdW5jdGlvbigpICB7XG5cdCAgICAgICAgaWYgKGZyb20gPT09IHRvKSB7XG5cdCAgICAgICAgICByZXR1cm4gRE9ORTtcblx0ICAgICAgICB9XG5cdCAgICAgICAgdmFyIGlkeCA9IHJldmVyc2UgPyAtLXRvIDogZnJvbSsrO1xuXHQgICAgICAgIHJldHVybiBhcnJheSAmJiBhcnJheVtpZHhdO1xuXHQgICAgICB9O1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBpdGVyYXRlTm9kZShub2RlLCBsZXZlbCwgb2Zmc2V0KSB7XG5cdCAgICAgIHZhciB2YWx1ZXM7XG5cdCAgICAgIHZhciBhcnJheSA9IG5vZGUgJiYgbm9kZS5hcnJheTtcblx0ICAgICAgdmFyIGZyb20gPSBvZmZzZXQgPiBsZWZ0ID8gMCA6IChsZWZ0IC0gb2Zmc2V0KSA+PiBsZXZlbDtcblx0ICAgICAgdmFyIHRvID0gKChyaWdodCAtIG9mZnNldCkgPj4gbGV2ZWwpICsgMTtcblx0ICAgICAgaWYgKHRvID4gU0laRSkge1xuXHQgICAgICAgIHRvID0gU0laRTtcblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gZnVuY3Rpb24oKSAge1xuXHQgICAgICAgIGRvIHtcblx0ICAgICAgICAgIGlmICh2YWx1ZXMpIHtcblx0ICAgICAgICAgICAgdmFyIHZhbHVlID0gdmFsdWVzKCk7XG5cdCAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gRE9ORSkge1xuXHQgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB2YWx1ZXMgPSBudWxsO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgICAgaWYgKGZyb20gPT09IHRvKSB7XG5cdCAgICAgICAgICAgIHJldHVybiBET05FO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgICAgdmFyIGlkeCA9IHJldmVyc2UgPyAtLXRvIDogZnJvbSsrO1xuXHQgICAgICAgICAgdmFsdWVzID0gaXRlcmF0ZU5vZGVPckxlYWYoXG5cdCAgICAgICAgICAgIGFycmF5ICYmIGFycmF5W2lkeF0sIGxldmVsIC0gU0hJRlQsIG9mZnNldCArIChpZHggPDwgbGV2ZWwpXG5cdCAgICAgICAgICApO1xuXHQgICAgICAgIH0gd2hpbGUgKHRydWUpO1xuXHQgICAgICB9O1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIGZ1bmN0aW9uIG1ha2VMaXN0KG9yaWdpbiwgY2FwYWNpdHksIGxldmVsLCByb290LCB0YWlsLCBvd25lcklELCBoYXNoKSB7XG5cdCAgICB2YXIgbGlzdCA9IE9iamVjdC5jcmVhdGUoTGlzdFByb3RvdHlwZSk7XG5cdCAgICBsaXN0LnNpemUgPSBjYXBhY2l0eSAtIG9yaWdpbjtcblx0ICAgIGxpc3QuX29yaWdpbiA9IG9yaWdpbjtcblx0ICAgIGxpc3QuX2NhcGFjaXR5ID0gY2FwYWNpdHk7XG5cdCAgICBsaXN0Ll9sZXZlbCA9IGxldmVsO1xuXHQgICAgbGlzdC5fcm9vdCA9IHJvb3Q7XG5cdCAgICBsaXN0Ll90YWlsID0gdGFpbDtcblx0ICAgIGxpc3QuX19vd25lcklEID0gb3duZXJJRDtcblx0ICAgIGxpc3QuX19oYXNoID0gaGFzaDtcblx0ICAgIGxpc3QuX19hbHRlcmVkID0gZmFsc2U7XG5cdCAgICByZXR1cm4gbGlzdDtcblx0ICB9XG5cblx0ICB2YXIgRU1QVFlfTElTVDtcblx0ICBmdW5jdGlvbiBlbXB0eUxpc3QoKSB7XG5cdCAgICByZXR1cm4gRU1QVFlfTElTVCB8fCAoRU1QVFlfTElTVCA9IG1ha2VMaXN0KDAsIDAsIFNISUZUKSk7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gdXBkYXRlTGlzdChsaXN0LCBpbmRleCwgdmFsdWUpIHtcblx0ICAgIGluZGV4ID0gd3JhcEluZGV4KGxpc3QsIGluZGV4KTtcblxuXHQgICAgaWYgKGluZGV4ID49IGxpc3Quc2l6ZSB8fCBpbmRleCA8IDApIHtcblx0ICAgICAgcmV0dXJuIGxpc3Qud2l0aE11dGF0aW9ucyhmdW5jdGlvbihsaXN0ICkge1xuXHQgICAgICAgIGluZGV4IDwgMCA/XG5cdCAgICAgICAgICBzZXRMaXN0Qm91bmRzKGxpc3QsIGluZGV4KS5zZXQoMCwgdmFsdWUpIDpcblx0ICAgICAgICAgIHNldExpc3RCb3VuZHMobGlzdCwgMCwgaW5kZXggKyAxKS5zZXQoaW5kZXgsIHZhbHVlKVxuXHQgICAgICB9KTtcblx0ICAgIH1cblxuXHQgICAgaW5kZXggKz0gbGlzdC5fb3JpZ2luO1xuXG5cdCAgICB2YXIgbmV3VGFpbCA9IGxpc3QuX3RhaWw7XG5cdCAgICB2YXIgbmV3Um9vdCA9IGxpc3QuX3Jvb3Q7XG5cdCAgICB2YXIgZGlkQWx0ZXIgPSBNYWtlUmVmKERJRF9BTFRFUik7XG5cdCAgICBpZiAoaW5kZXggPj0gZ2V0VGFpbE9mZnNldChsaXN0Ll9jYXBhY2l0eSkpIHtcblx0ICAgICAgbmV3VGFpbCA9IHVwZGF0ZVZOb2RlKG5ld1RhaWwsIGxpc3QuX19vd25lcklELCAwLCBpbmRleCwgdmFsdWUsIGRpZEFsdGVyKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIG5ld1Jvb3QgPSB1cGRhdGVWTm9kZShuZXdSb290LCBsaXN0Ll9fb3duZXJJRCwgbGlzdC5fbGV2ZWwsIGluZGV4LCB2YWx1ZSwgZGlkQWx0ZXIpO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoIWRpZEFsdGVyLnZhbHVlKSB7XG5cdCAgICAgIHJldHVybiBsaXN0O1xuXHQgICAgfVxuXG5cdCAgICBpZiAobGlzdC5fX293bmVySUQpIHtcblx0ICAgICAgbGlzdC5fcm9vdCA9IG5ld1Jvb3Q7XG5cdCAgICAgIGxpc3QuX3RhaWwgPSBuZXdUYWlsO1xuXHQgICAgICBsaXN0Ll9faGFzaCA9IHVuZGVmaW5lZDtcblx0ICAgICAgbGlzdC5fX2FsdGVyZWQgPSB0cnVlO1xuXHQgICAgICByZXR1cm4gbGlzdDtcblx0ICAgIH1cblx0ICAgIHJldHVybiBtYWtlTGlzdChsaXN0Ll9vcmlnaW4sIGxpc3QuX2NhcGFjaXR5LCBsaXN0Ll9sZXZlbCwgbmV3Um9vdCwgbmV3VGFpbCk7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gdXBkYXRlVk5vZGUobm9kZSwgb3duZXJJRCwgbGV2ZWwsIGluZGV4LCB2YWx1ZSwgZGlkQWx0ZXIpIHtcblx0ICAgIHZhciBpZHggPSAoaW5kZXggPj4+IGxldmVsKSAmIE1BU0s7XG5cdCAgICB2YXIgbm9kZUhhcyA9IG5vZGUgJiYgaWR4IDwgbm9kZS5hcnJheS5sZW5ndGg7XG5cdCAgICBpZiAoIW5vZGVIYXMgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuXHQgICAgICByZXR1cm4gbm9kZTtcblx0ICAgIH1cblxuXHQgICAgdmFyIG5ld05vZGU7XG5cblx0ICAgIGlmIChsZXZlbCA+IDApIHtcblx0ICAgICAgdmFyIGxvd2VyTm9kZSA9IG5vZGUgJiYgbm9kZS5hcnJheVtpZHhdO1xuXHQgICAgICB2YXIgbmV3TG93ZXJOb2RlID0gdXBkYXRlVk5vZGUobG93ZXJOb2RlLCBvd25lcklELCBsZXZlbCAtIFNISUZULCBpbmRleCwgdmFsdWUsIGRpZEFsdGVyKTtcblx0ICAgICAgaWYgKG5ld0xvd2VyTm9kZSA9PT0gbG93ZXJOb2RlKSB7XG5cdCAgICAgICAgcmV0dXJuIG5vZGU7XG5cdCAgICAgIH1cblx0ICAgICAgbmV3Tm9kZSA9IGVkaXRhYmxlVk5vZGUobm9kZSwgb3duZXJJRCk7XG5cdCAgICAgIG5ld05vZGUuYXJyYXlbaWR4XSA9IG5ld0xvd2VyTm9kZTtcblx0ICAgICAgcmV0dXJuIG5ld05vZGU7XG5cdCAgICB9XG5cblx0ICAgIGlmIChub2RlSGFzICYmIG5vZGUuYXJyYXlbaWR4XSA9PT0gdmFsdWUpIHtcblx0ICAgICAgcmV0dXJuIG5vZGU7XG5cdCAgICB9XG5cblx0ICAgIFNldFJlZihkaWRBbHRlcik7XG5cblx0ICAgIG5ld05vZGUgPSBlZGl0YWJsZVZOb2RlKG5vZGUsIG93bmVySUQpO1xuXHQgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgaWR4ID09PSBuZXdOb2RlLmFycmF5Lmxlbmd0aCAtIDEpIHtcblx0ICAgICAgbmV3Tm9kZS5hcnJheS5wb3AoKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIG5ld05vZGUuYXJyYXlbaWR4XSA9IHZhbHVlO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIG5ld05vZGU7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gZWRpdGFibGVWTm9kZShub2RlLCBvd25lcklEKSB7XG5cdCAgICBpZiAob3duZXJJRCAmJiBub2RlICYmIG93bmVySUQgPT09IG5vZGUub3duZXJJRCkge1xuXHQgICAgICByZXR1cm4gbm9kZTtcblx0ICAgIH1cblx0ICAgIHJldHVybiBuZXcgVk5vZGUobm9kZSA/IG5vZGUuYXJyYXkuc2xpY2UoKSA6IFtdLCBvd25lcklEKTtcblx0ICB9XG5cblx0ICBmdW5jdGlvbiBsaXN0Tm9kZUZvcihsaXN0LCByYXdJbmRleCkge1xuXHQgICAgaWYgKHJhd0luZGV4ID49IGdldFRhaWxPZmZzZXQobGlzdC5fY2FwYWNpdHkpKSB7XG5cdCAgICAgIHJldHVybiBsaXN0Ll90YWlsO1xuXHQgICAgfVxuXHQgICAgaWYgKHJhd0luZGV4IDwgMSA8PCAobGlzdC5fbGV2ZWwgKyBTSElGVCkpIHtcblx0ICAgICAgdmFyIG5vZGUgPSBsaXN0Ll9yb290O1xuXHQgICAgICB2YXIgbGV2ZWwgPSBsaXN0Ll9sZXZlbDtcblx0ICAgICAgd2hpbGUgKG5vZGUgJiYgbGV2ZWwgPiAwKSB7XG5cdCAgICAgICAgbm9kZSA9IG5vZGUuYXJyYXlbKHJhd0luZGV4ID4+PiBsZXZlbCkgJiBNQVNLXTtcblx0ICAgICAgICBsZXZlbCAtPSBTSElGVDtcblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gbm9kZTtcblx0ICAgIH1cblx0ICB9XG5cblx0ICBmdW5jdGlvbiBzZXRMaXN0Qm91bmRzKGxpc3QsIGJlZ2luLCBlbmQpIHtcblx0ICAgIHZhciBvd25lciA9IGxpc3QuX19vd25lcklEIHx8IG5ldyBPd25lcklEKCk7XG5cdCAgICB2YXIgb2xkT3JpZ2luID0gbGlzdC5fb3JpZ2luO1xuXHQgICAgdmFyIG9sZENhcGFjaXR5ID0gbGlzdC5fY2FwYWNpdHk7XG5cdCAgICB2YXIgbmV3T3JpZ2luID0gb2xkT3JpZ2luICsgYmVnaW47XG5cdCAgICB2YXIgbmV3Q2FwYWNpdHkgPSBlbmQgPT09IHVuZGVmaW5lZCA/IG9sZENhcGFjaXR5IDogZW5kIDwgMCA/IG9sZENhcGFjaXR5ICsgZW5kIDogb2xkT3JpZ2luICsgZW5kO1xuXHQgICAgaWYgKG5ld09yaWdpbiA9PT0gb2xkT3JpZ2luICYmIG5ld0NhcGFjaXR5ID09PSBvbGRDYXBhY2l0eSkge1xuXHQgICAgICByZXR1cm4gbGlzdDtcblx0ICAgIH1cblxuXHQgICAgLy8gSWYgaXQncyBnb2luZyB0byBlbmQgYWZ0ZXIgaXQgc3RhcnRzLCBpdCdzIGVtcHR5LlxuXHQgICAgaWYgKG5ld09yaWdpbiA+PSBuZXdDYXBhY2l0eSkge1xuXHQgICAgICByZXR1cm4gbGlzdC5jbGVhcigpO1xuXHQgICAgfVxuXG5cdCAgICB2YXIgbmV3TGV2ZWwgPSBsaXN0Ll9sZXZlbDtcblx0ICAgIHZhciBuZXdSb290ID0gbGlzdC5fcm9vdDtcblxuXHQgICAgLy8gTmV3IG9yaWdpbiBtaWdodCBuZWVkIGNyZWF0aW5nIGEgaGlnaGVyIHJvb3QuXG5cdCAgICB2YXIgb2Zmc2V0U2hpZnQgPSAwO1xuXHQgICAgd2hpbGUgKG5ld09yaWdpbiArIG9mZnNldFNoaWZ0IDwgMCkge1xuXHQgICAgICBuZXdSb290ID0gbmV3IFZOb2RlKG5ld1Jvb3QgJiYgbmV3Um9vdC5hcnJheS5sZW5ndGggPyBbdW5kZWZpbmVkLCBuZXdSb290XSA6IFtdLCBvd25lcik7XG5cdCAgICAgIG5ld0xldmVsICs9IFNISUZUO1xuXHQgICAgICBvZmZzZXRTaGlmdCArPSAxIDw8IG5ld0xldmVsO1xuXHQgICAgfVxuXHQgICAgaWYgKG9mZnNldFNoaWZ0KSB7XG5cdCAgICAgIG5ld09yaWdpbiArPSBvZmZzZXRTaGlmdDtcblx0ICAgICAgb2xkT3JpZ2luICs9IG9mZnNldFNoaWZ0O1xuXHQgICAgICBuZXdDYXBhY2l0eSArPSBvZmZzZXRTaGlmdDtcblx0ICAgICAgb2xkQ2FwYWNpdHkgKz0gb2Zmc2V0U2hpZnQ7XG5cdCAgICB9XG5cblx0ICAgIHZhciBvbGRUYWlsT2Zmc2V0ID0gZ2V0VGFpbE9mZnNldChvbGRDYXBhY2l0eSk7XG5cdCAgICB2YXIgbmV3VGFpbE9mZnNldCA9IGdldFRhaWxPZmZzZXQobmV3Q2FwYWNpdHkpO1xuXG5cdCAgICAvLyBOZXcgc2l6ZSBtaWdodCBuZWVkIGNyZWF0aW5nIGEgaGlnaGVyIHJvb3QuXG5cdCAgICB3aGlsZSAobmV3VGFpbE9mZnNldCA+PSAxIDw8IChuZXdMZXZlbCArIFNISUZUKSkge1xuXHQgICAgICBuZXdSb290ID0gbmV3IFZOb2RlKG5ld1Jvb3QgJiYgbmV3Um9vdC5hcnJheS5sZW5ndGggPyBbbmV3Um9vdF0gOiBbXSwgb3duZXIpO1xuXHQgICAgICBuZXdMZXZlbCArPSBTSElGVDtcblx0ICAgIH1cblxuXHQgICAgLy8gTG9jYXRlIG9yIGNyZWF0ZSB0aGUgbmV3IHRhaWwuXG5cdCAgICB2YXIgb2xkVGFpbCA9IGxpc3QuX3RhaWw7XG5cdCAgICB2YXIgbmV3VGFpbCA9IG5ld1RhaWxPZmZzZXQgPCBvbGRUYWlsT2Zmc2V0ID9cblx0ICAgICAgbGlzdE5vZGVGb3IobGlzdCwgbmV3Q2FwYWNpdHkgLSAxKSA6XG5cdCAgICAgIG5ld1RhaWxPZmZzZXQgPiBvbGRUYWlsT2Zmc2V0ID8gbmV3IFZOb2RlKFtdLCBvd25lcikgOiBvbGRUYWlsO1xuXG5cdCAgICAvLyBNZXJnZSBUYWlsIGludG8gdHJlZS5cblx0ICAgIGlmIChvbGRUYWlsICYmIG5ld1RhaWxPZmZzZXQgPiBvbGRUYWlsT2Zmc2V0ICYmIG5ld09yaWdpbiA8IG9sZENhcGFjaXR5ICYmIG9sZFRhaWwuYXJyYXkubGVuZ3RoKSB7XG5cdCAgICAgIG5ld1Jvb3QgPSBlZGl0YWJsZVZOb2RlKG5ld1Jvb3QsIG93bmVyKTtcblx0ICAgICAgdmFyIG5vZGUgPSBuZXdSb290O1xuXHQgICAgICBmb3IgKHZhciBsZXZlbCA9IG5ld0xldmVsOyBsZXZlbCA+IFNISUZUOyBsZXZlbCAtPSBTSElGVCkge1xuXHQgICAgICAgIHZhciBpZHggPSAob2xkVGFpbE9mZnNldCA+Pj4gbGV2ZWwpICYgTUFTSztcblx0ICAgICAgICBub2RlID0gbm9kZS5hcnJheVtpZHhdID0gZWRpdGFibGVWTm9kZShub2RlLmFycmF5W2lkeF0sIG93bmVyKTtcblx0ICAgICAgfVxuXHQgICAgICBub2RlLmFycmF5WyhvbGRUYWlsT2Zmc2V0ID4+PiBTSElGVCkgJiBNQVNLXSA9IG9sZFRhaWw7XG5cdCAgICB9XG5cblx0ICAgIC8vIElmIHRoZSBzaXplIGhhcyBiZWVuIHJlZHVjZWQsIHRoZXJlJ3MgYSBjaGFuY2UgdGhlIHRhaWwgbmVlZHMgdG8gYmUgdHJpbW1lZC5cblx0ICAgIGlmIChuZXdDYXBhY2l0eSA8IG9sZENhcGFjaXR5KSB7XG5cdCAgICAgIG5ld1RhaWwgPSBuZXdUYWlsICYmIG5ld1RhaWwucmVtb3ZlQWZ0ZXIob3duZXIsIDAsIG5ld0NhcGFjaXR5KTtcblx0ICAgIH1cblxuXHQgICAgLy8gSWYgdGhlIG5ldyBvcmlnaW4gaXMgd2l0aGluIHRoZSB0YWlsLCB0aGVuIHdlIGRvIG5vdCBuZWVkIGEgcm9vdC5cblx0ICAgIGlmIChuZXdPcmlnaW4gPj0gbmV3VGFpbE9mZnNldCkge1xuXHQgICAgICBuZXdPcmlnaW4gLT0gbmV3VGFpbE9mZnNldDtcblx0ICAgICAgbmV3Q2FwYWNpdHkgLT0gbmV3VGFpbE9mZnNldDtcblx0ICAgICAgbmV3TGV2ZWwgPSBTSElGVDtcblx0ICAgICAgbmV3Um9vdCA9IG51bGw7XG5cdCAgICAgIG5ld1RhaWwgPSBuZXdUYWlsICYmIG5ld1RhaWwucmVtb3ZlQmVmb3JlKG93bmVyLCAwLCBuZXdPcmlnaW4pO1xuXG5cdCAgICAvLyBPdGhlcndpc2UsIGlmIHRoZSByb290IGhhcyBiZWVuIHRyaW1tZWQsIGdhcmJhZ2UgY29sbGVjdC5cblx0ICAgIH0gZWxzZSBpZiAobmV3T3JpZ2luID4gb2xkT3JpZ2luIHx8IG5ld1RhaWxPZmZzZXQgPCBvbGRUYWlsT2Zmc2V0KSB7XG5cdCAgICAgIG9mZnNldFNoaWZ0ID0gMDtcblxuXHQgICAgICAvLyBJZGVudGlmeSB0aGUgbmV3IHRvcCByb290IG5vZGUgb2YgdGhlIHN1YnRyZWUgb2YgdGhlIG9sZCByb290LlxuXHQgICAgICB3aGlsZSAobmV3Um9vdCkge1xuXHQgICAgICAgIHZhciBiZWdpbkluZGV4ID0gKG5ld09yaWdpbiA+Pj4gbmV3TGV2ZWwpICYgTUFTSztcblx0ICAgICAgICBpZiAoYmVnaW5JbmRleCAhPT0gKG5ld1RhaWxPZmZzZXQgPj4+IG5ld0xldmVsKSAmIE1BU0spIHtcblx0ICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBpZiAoYmVnaW5JbmRleCkge1xuXHQgICAgICAgICAgb2Zmc2V0U2hpZnQgKz0gKDEgPDwgbmV3TGV2ZWwpICogYmVnaW5JbmRleDtcblx0ICAgICAgICB9XG5cdCAgICAgICAgbmV3TGV2ZWwgLT0gU0hJRlQ7XG5cdCAgICAgICAgbmV3Um9vdCA9IG5ld1Jvb3QuYXJyYXlbYmVnaW5JbmRleF07XG5cdCAgICAgIH1cblxuXHQgICAgICAvLyBUcmltIHRoZSBuZXcgc2lkZXMgb2YgdGhlIG5ldyByb290LlxuXHQgICAgICBpZiAobmV3Um9vdCAmJiBuZXdPcmlnaW4gPiBvbGRPcmlnaW4pIHtcblx0ICAgICAgICBuZXdSb290ID0gbmV3Um9vdC5yZW1vdmVCZWZvcmUob3duZXIsIG5ld0xldmVsLCBuZXdPcmlnaW4gLSBvZmZzZXRTaGlmdCk7XG5cdCAgICAgIH1cblx0ICAgICAgaWYgKG5ld1Jvb3QgJiYgbmV3VGFpbE9mZnNldCA8IG9sZFRhaWxPZmZzZXQpIHtcblx0ICAgICAgICBuZXdSb290ID0gbmV3Um9vdC5yZW1vdmVBZnRlcihvd25lciwgbmV3TGV2ZWwsIG5ld1RhaWxPZmZzZXQgLSBvZmZzZXRTaGlmdCk7XG5cdCAgICAgIH1cblx0ICAgICAgaWYgKG9mZnNldFNoaWZ0KSB7XG5cdCAgICAgICAgbmV3T3JpZ2luIC09IG9mZnNldFNoaWZ0O1xuXHQgICAgICAgIG5ld0NhcGFjaXR5IC09IG9mZnNldFNoaWZ0O1xuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIGlmIChsaXN0Ll9fb3duZXJJRCkge1xuXHQgICAgICBsaXN0LnNpemUgPSBuZXdDYXBhY2l0eSAtIG5ld09yaWdpbjtcblx0ICAgICAgbGlzdC5fb3JpZ2luID0gbmV3T3JpZ2luO1xuXHQgICAgICBsaXN0Ll9jYXBhY2l0eSA9IG5ld0NhcGFjaXR5O1xuXHQgICAgICBsaXN0Ll9sZXZlbCA9IG5ld0xldmVsO1xuXHQgICAgICBsaXN0Ll9yb290ID0gbmV3Um9vdDtcblx0ICAgICAgbGlzdC5fdGFpbCA9IG5ld1RhaWw7XG5cdCAgICAgIGxpc3QuX19oYXNoID0gdW5kZWZpbmVkO1xuXHQgICAgICBsaXN0Ll9fYWx0ZXJlZCA9IHRydWU7XG5cdCAgICAgIHJldHVybiBsaXN0O1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIG1ha2VMaXN0KG5ld09yaWdpbiwgbmV3Q2FwYWNpdHksIG5ld0xldmVsLCBuZXdSb290LCBuZXdUYWlsKTtcblx0ICB9XG5cblx0ICBmdW5jdGlvbiBtZXJnZUludG9MaXN0V2l0aChsaXN0LCBtZXJnZXIsIGl0ZXJhYmxlcykge1xuXHQgICAgdmFyIGl0ZXJzID0gW107XG5cdCAgICB2YXIgbWF4U2l6ZSA9IDA7XG5cdCAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgaXRlcmFibGVzLmxlbmd0aDsgaWkrKykge1xuXHQgICAgICB2YXIgdmFsdWUgPSBpdGVyYWJsZXNbaWldO1xuXHQgICAgICB2YXIgaXRlciA9IEluZGV4ZWRJdGVyYWJsZSh2YWx1ZSk7XG5cdCAgICAgIGlmIChpdGVyLnNpemUgPiBtYXhTaXplKSB7XG5cdCAgICAgICAgbWF4U2l6ZSA9IGl0ZXIuc2l6ZTtcblx0ICAgICAgfVxuXHQgICAgICBpZiAoIWlzSXRlcmFibGUodmFsdWUpKSB7XG5cdCAgICAgICAgaXRlciA9IGl0ZXIubWFwKGZ1bmN0aW9uKHYgKSB7cmV0dXJuIGZyb21KUyh2KX0pO1xuXHQgICAgICB9XG5cdCAgICAgIGl0ZXJzLnB1c2goaXRlcik7XG5cdCAgICB9XG5cdCAgICBpZiAobWF4U2l6ZSA+IGxpc3Quc2l6ZSkge1xuXHQgICAgICBsaXN0ID0gbGlzdC5zZXRTaXplKG1heFNpemUpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIG1lcmdlSW50b0NvbGxlY3Rpb25XaXRoKGxpc3QsIG1lcmdlciwgaXRlcnMpO1xuXHQgIH1cblxuXHQgIGZ1bmN0aW9uIGdldFRhaWxPZmZzZXQoc2l6ZSkge1xuXHQgICAgcmV0dXJuIHNpemUgPCBTSVpFID8gMCA6ICgoKHNpemUgLSAxKSA+Pj4gU0hJRlQpIDw8IFNISUZUKTtcblx0ICB9XG5cblx0ICBjcmVhdGVDbGFzcyhPcmRlcmVkTWFwLCBzcmNfTWFwX19NYXApO1xuXG5cdCAgICAvLyBAcHJhZ21hIENvbnN0cnVjdGlvblxuXG5cdCAgICBmdW5jdGlvbiBPcmRlcmVkTWFwKHZhbHVlKSB7XG5cdCAgICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gZW1wdHlPcmRlcmVkTWFwKCkgOlxuXHQgICAgICAgIGlzT3JkZXJlZE1hcCh2YWx1ZSkgPyB2YWx1ZSA6XG5cdCAgICAgICAgZW1wdHlPcmRlcmVkTWFwKCkud2l0aE11dGF0aW9ucyhmdW5jdGlvbihtYXAgKSB7XG5cdCAgICAgICAgICB2YXIgaXRlciA9IEtleWVkSXRlcmFibGUodmFsdWUpO1xuXHQgICAgICAgICAgYXNzZXJ0Tm90SW5maW5pdGUoaXRlci5zaXplKTtcblx0ICAgICAgICAgIGl0ZXIuZm9yRWFjaChmdW5jdGlvbih2LCBrKSAge3JldHVybiBtYXAuc2V0KGssIHYpfSk7XG5cdCAgICAgICAgfSk7XG5cdCAgICB9XG5cblx0ICAgIE9yZGVyZWRNYXAub2YgPSBmdW5jdGlvbigvKi4uLnZhbHVlcyovKSB7XG5cdCAgICAgIHJldHVybiB0aGlzKGFyZ3VtZW50cyk7XG5cdCAgICB9O1xuXG5cdCAgICBPcmRlcmVkTWFwLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuXHQgICAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKCdPcmRlcmVkTWFwIHsnLCAnfScpO1xuXHQgICAgfTtcblxuXHQgICAgLy8gQHByYWdtYSBBY2Nlc3NcblxuXHQgICAgT3JkZXJlZE1hcC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oaywgbm90U2V0VmFsdWUpIHtcblx0ICAgICAgdmFyIGluZGV4ID0gdGhpcy5fbWFwLmdldChrKTtcblx0ICAgICAgcmV0dXJuIGluZGV4ICE9PSB1bmRlZmluZWQgPyB0aGlzLl9saXN0LmdldChpbmRleClbMV0gOiBub3RTZXRWYWx1ZTtcblx0ICAgIH07XG5cblx0ICAgIC8vIEBwcmFnbWEgTW9kaWZpY2F0aW9uXG5cblx0ICAgIE9yZGVyZWRNYXAucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG5cdCAgICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcblx0ICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgfVxuXHQgICAgICBpZiAodGhpcy5fX293bmVySUQpIHtcblx0ICAgICAgICB0aGlzLnNpemUgPSAwO1xuXHQgICAgICAgIHRoaXMuX21hcC5jbGVhcigpO1xuXHQgICAgICAgIHRoaXMuX2xpc3QuY2xlYXIoKTtcblx0ICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gZW1wdHlPcmRlcmVkTWFwKCk7XG5cdCAgICB9O1xuXG5cdCAgICBPcmRlcmVkTWFwLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihrLCB2KSB7XG5cdCAgICAgIHJldHVybiB1cGRhdGVPcmRlcmVkTWFwKHRoaXMsIGssIHYpO1xuXHQgICAgfTtcblxuXHQgICAgT3JkZXJlZE1hcC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oaykge1xuXHQgICAgICByZXR1cm4gdXBkYXRlT3JkZXJlZE1hcCh0aGlzLCBrLCBOT1RfU0VUKTtcblx0ICAgIH07XG5cblx0ICAgIE9yZGVyZWRNYXAucHJvdG90eXBlLndhc0FsdGVyZWQgPSBmdW5jdGlvbigpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuX21hcC53YXNBbHRlcmVkKCkgfHwgdGhpcy5fbGlzdC53YXNBbHRlcmVkKCk7XG5cdCAgICB9O1xuXG5cdCAgICBPcmRlcmVkTWFwLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuXHQgICAgICByZXR1cm4gdGhpcy5fbGlzdC5fX2l0ZXJhdGUoXG5cdCAgICAgICAgZnVuY3Rpb24oZW50cnkgKSB7cmV0dXJuIGVudHJ5ICYmIGZuKGVudHJ5WzFdLCBlbnRyeVswXSwgdGhpcyQwKX0sXG5cdCAgICAgICAgcmV2ZXJzZVxuXHQgICAgICApO1xuXHQgICAgfTtcblxuXHQgICAgT3JkZXJlZE1hcC5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuX2xpc3QuZnJvbUVudHJ5U2VxKCkuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcblx0ICAgIH07XG5cblx0ICAgIE9yZGVyZWRNYXAucHJvdG90eXBlLl9fZW5zdXJlT3duZXIgPSBmdW5jdGlvbihvd25lcklEKSB7XG5cdCAgICAgIGlmIChvd25lcklEID09PSB0aGlzLl9fb3duZXJJRCkge1xuXHQgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICB9XG5cdCAgICAgIHZhciBuZXdNYXAgPSB0aGlzLl9tYXAuX19lbnN1cmVPd25lcihvd25lcklEKTtcblx0ICAgICAgdmFyIG5ld0xpc3QgPSB0aGlzLl9saXN0Ll9fZW5zdXJlT3duZXIob3duZXJJRCk7XG5cdCAgICAgIGlmICghb3duZXJJRCkge1xuXHQgICAgICAgIHRoaXMuX19vd25lcklEID0gb3duZXJJRDtcblx0ICAgICAgICB0aGlzLl9tYXAgPSBuZXdNYXA7XG5cdCAgICAgICAgdGhpcy5fbGlzdCA9IG5ld0xpc3Q7XG5cdCAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIG1ha2VPcmRlcmVkTWFwKG5ld01hcCwgbmV3TGlzdCwgb3duZXJJRCwgdGhpcy5fX2hhc2gpO1xuXHQgICAgfTtcblxuXG5cdCAgZnVuY3Rpb24gaXNPcmRlcmVkTWFwKG1heWJlT3JkZXJlZE1hcCkge1xuXHQgICAgcmV0dXJuIGlzTWFwKG1heWJlT3JkZXJlZE1hcCkgJiYgaXNPcmRlcmVkKG1heWJlT3JkZXJlZE1hcCk7XG5cdCAgfVxuXG5cdCAgT3JkZXJlZE1hcC5pc09yZGVyZWRNYXAgPSBpc09yZGVyZWRNYXA7XG5cblx0ICBPcmRlcmVkTWFwLnByb3RvdHlwZVtJU19PUkRFUkVEX1NFTlRJTkVMXSA9IHRydWU7XG5cdCAgT3JkZXJlZE1hcC5wcm90b3R5cGVbREVMRVRFXSA9IE9yZGVyZWRNYXAucHJvdG90eXBlLnJlbW92ZTtcblxuXG5cblx0ICBmdW5jdGlvbiBtYWtlT3JkZXJlZE1hcChtYXAsIGxpc3QsIG93bmVySUQsIGhhc2gpIHtcblx0ICAgIHZhciBvbWFwID0gT2JqZWN0LmNyZWF0ZShPcmRlcmVkTWFwLnByb3RvdHlwZSk7XG5cdCAgICBvbWFwLnNpemUgPSBtYXAgPyBtYXAuc2l6ZSA6IDA7XG5cdCAgICBvbWFwLl9tYXAgPSBtYXA7XG5cdCAgICBvbWFwLl9saXN0ID0gbGlzdDtcblx0ICAgIG9tYXAuX19vd25lcklEID0gb3duZXJJRDtcblx0ICAgIG9tYXAuX19oYXNoID0gaGFzaDtcblx0ICAgIHJldHVybiBvbWFwO1xuXHQgIH1cblxuXHQgIHZhciBFTVBUWV9PUkRFUkVEX01BUDtcblx0ICBmdW5jdGlvbiBlbXB0eU9yZGVyZWRNYXAoKSB7XG5cdCAgICByZXR1cm4gRU1QVFlfT1JERVJFRF9NQVAgfHwgKEVNUFRZX09SREVSRURfTUFQID0gbWFrZU9yZGVyZWRNYXAoZW1wdHlNYXAoKSwgZW1wdHlMaXN0KCkpKTtcblx0ICB9XG5cblx0ICBmdW5jdGlvbiB1cGRhdGVPcmRlcmVkTWFwKG9tYXAsIGssIHYpIHtcblx0ICAgIHZhciBtYXAgPSBvbWFwLl9tYXA7XG5cdCAgICB2YXIgbGlzdCA9IG9tYXAuX2xpc3Q7XG5cdCAgICB2YXIgaSA9IG1hcC5nZXQoayk7XG5cdCAgICB2YXIgaGFzID0gaSAhPT0gdW5kZWZpbmVkO1xuXHQgICAgdmFyIG5ld01hcDtcblx0ICAgIHZhciBuZXdMaXN0O1xuXHQgICAgaWYgKHYgPT09IE5PVF9TRVQpIHsgLy8gcmVtb3ZlZFxuXHQgICAgICBpZiAoIWhhcykge1xuXHQgICAgICAgIHJldHVybiBvbWFwO1xuXHQgICAgICB9XG5cdCAgICAgIGlmIChsaXN0LnNpemUgPj0gU0laRSAmJiBsaXN0LnNpemUgPj0gbWFwLnNpemUgKiAyKSB7XG5cdCAgICAgICAgbmV3TGlzdCA9IGxpc3QuZmlsdGVyKGZ1bmN0aW9uKGVudHJ5LCBpZHgpICB7cmV0dXJuIGVudHJ5ICE9PSB1bmRlZmluZWQgJiYgaSAhPT0gaWR4fSk7XG5cdCAgICAgICAgbmV3TWFwID0gbmV3TGlzdC50b0tleWVkU2VxKCkubWFwKGZ1bmN0aW9uKGVudHJ5ICkge3JldHVybiBlbnRyeVswXX0pLmZsaXAoKS50b01hcCgpO1xuXHQgICAgICAgIGlmIChvbWFwLl9fb3duZXJJRCkge1xuXHQgICAgICAgICAgbmV3TWFwLl9fb3duZXJJRCA9IG5ld0xpc3QuX19vd25lcklEID0gb21hcC5fX293bmVySUQ7XG5cdCAgICAgICAgfVxuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIG5ld01hcCA9IG1hcC5yZW1vdmUoayk7XG5cdCAgICAgICAgbmV3TGlzdCA9IGkgPT09IGxpc3Quc2l6ZSAtIDEgPyBsaXN0LnBvcCgpIDogbGlzdC5zZXQoaSwgdW5kZWZpbmVkKTtcblx0ICAgICAgfVxuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgaWYgKGhhcykge1xuXHQgICAgICAgIGlmICh2ID09PSBsaXN0LmdldChpKVsxXSkge1xuXHQgICAgICAgICAgcmV0dXJuIG9tYXA7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIG5ld01hcCA9IG1hcDtcblx0ICAgICAgICBuZXdMaXN0ID0gbGlzdC5zZXQoaSwgW2ssIHZdKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBuZXdNYXAgPSBtYXAuc2V0KGssIGxpc3Quc2l6ZSk7XG5cdCAgICAgICAgbmV3TGlzdCA9IGxpc3Quc2V0KGxpc3Quc2l6ZSwgW2ssIHZdKTtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgICAgaWYgKG9tYXAuX19vd25lcklEKSB7XG5cdCAgICAgIG9tYXAuc2l6ZSA9IG5ld01hcC5zaXplO1xuXHQgICAgICBvbWFwLl9tYXAgPSBuZXdNYXA7XG5cdCAgICAgIG9tYXAuX2xpc3QgPSBuZXdMaXN0O1xuXHQgICAgICBvbWFwLl9faGFzaCA9IHVuZGVmaW5lZDtcblx0ICAgICAgcmV0dXJuIG9tYXA7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gbWFrZU9yZGVyZWRNYXAobmV3TWFwLCBuZXdMaXN0KTtcblx0ICB9XG5cblx0ICBjcmVhdGVDbGFzcyhTdGFjaywgSW5kZXhlZENvbGxlY3Rpb24pO1xuXG5cdCAgICAvLyBAcHJhZ21hIENvbnN0cnVjdGlvblxuXG5cdCAgICBmdW5jdGlvbiBTdGFjayh2YWx1ZSkge1xuXHQgICAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCA/IGVtcHR5U3RhY2soKSA6XG5cdCAgICAgICAgaXNTdGFjayh2YWx1ZSkgPyB2YWx1ZSA6XG5cdCAgICAgICAgZW1wdHlTdGFjaygpLnVuc2hpZnRBbGwodmFsdWUpO1xuXHQgICAgfVxuXG5cdCAgICBTdGFjay5vZiA9IGZ1bmN0aW9uKC8qLi4udmFsdWVzKi8pIHtcblx0ICAgICAgcmV0dXJuIHRoaXMoYXJndW1lbnRzKTtcblx0ICAgIH07XG5cblx0ICAgIFN0YWNrLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuXHQgICAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKCdTdGFjayBbJywgJ10nKTtcblx0ICAgIH07XG5cblx0ICAgIC8vIEBwcmFnbWEgQWNjZXNzXG5cblx0ICAgIFN0YWNrLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihpbmRleCwgbm90U2V0VmFsdWUpIHtcblx0ICAgICAgdmFyIGhlYWQgPSB0aGlzLl9oZWFkO1xuXHQgICAgICBpbmRleCA9IHdyYXBJbmRleCh0aGlzLCBpbmRleCk7XG5cdCAgICAgIHdoaWxlIChoZWFkICYmIGluZGV4LS0pIHtcblx0ICAgICAgICBoZWFkID0gaGVhZC5uZXh0O1xuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiBoZWFkID8gaGVhZC52YWx1ZSA6IG5vdFNldFZhbHVlO1xuXHQgICAgfTtcblxuXHQgICAgU3RhY2sucHJvdG90eXBlLnBlZWsgPSBmdW5jdGlvbigpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuX2hlYWQgJiYgdGhpcy5faGVhZC52YWx1ZTtcblx0ICAgIH07XG5cblx0ICAgIC8vIEBwcmFnbWEgTW9kaWZpY2F0aW9uXG5cblx0ICAgIFN0YWNrLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24oLyouLi52YWx1ZXMqLykge1xuXHQgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuXHQgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICB9XG5cdCAgICAgIHZhciBuZXdTaXplID0gdGhpcy5zaXplICsgYXJndW1lbnRzLmxlbmd0aDtcblx0ICAgICAgdmFyIGhlYWQgPSB0aGlzLl9oZWFkO1xuXHQgICAgICBmb3IgKHZhciBpaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpaSA+PSAwOyBpaS0tKSB7XG5cdCAgICAgICAgaGVhZCA9IHtcblx0ICAgICAgICAgIHZhbHVlOiBhcmd1bWVudHNbaWldLFxuXHQgICAgICAgICAgbmV4dDogaGVhZFxuXHQgICAgICAgIH07XG5cdCAgICAgIH1cblx0ICAgICAgaWYgKHRoaXMuX19vd25lcklEKSB7XG5cdCAgICAgICAgdGhpcy5zaXplID0gbmV3U2l6ZTtcblx0ICAgICAgICB0aGlzLl9oZWFkID0gaGVhZDtcblx0ICAgICAgICB0aGlzLl9faGFzaCA9IHVuZGVmaW5lZDtcblx0ICAgICAgICB0aGlzLl9fYWx0ZXJlZCA9IHRydWU7XG5cdCAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIG1ha2VTdGFjayhuZXdTaXplLCBoZWFkKTtcblx0ICAgIH07XG5cblx0ICAgIFN0YWNrLnByb3RvdHlwZS5wdXNoQWxsID0gZnVuY3Rpb24oaXRlcikge1xuXHQgICAgICBpdGVyID0gSW5kZXhlZEl0ZXJhYmxlKGl0ZXIpO1xuXHQgICAgICBpZiAoaXRlci5zaXplID09PSAwKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICAgIH1cblx0ICAgICAgYXNzZXJ0Tm90SW5maW5pdGUoaXRlci5zaXplKTtcblx0ICAgICAgdmFyIG5ld1NpemUgPSB0aGlzLnNpemU7XG5cdCAgICAgIHZhciBoZWFkID0gdGhpcy5faGVhZDtcblx0ICAgICAgaXRlci5yZXZlcnNlKCkuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSApIHtcblx0ICAgICAgICBuZXdTaXplKys7XG5cdCAgICAgICAgaGVhZCA9IHtcblx0ICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcblx0ICAgICAgICAgIG5leHQ6IGhlYWRcblx0ICAgICAgICB9O1xuXHQgICAgICB9KTtcblx0ICAgICAgaWYgKHRoaXMuX19vd25lcklEKSB7XG5cdCAgICAgICAgdGhpcy5zaXplID0gbmV3U2l6ZTtcblx0ICAgICAgICB0aGlzLl9oZWFkID0gaGVhZDtcblx0ICAgICAgICB0aGlzLl9faGFzaCA9IHVuZGVmaW5lZDtcblx0ICAgICAgICB0aGlzLl9fYWx0ZXJlZCA9IHRydWU7XG5cdCAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIG1ha2VTdGFjayhuZXdTaXplLCBoZWFkKTtcblx0ICAgIH07XG5cblx0ICAgIFN0YWNrLnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbigpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuc2xpY2UoMSk7XG5cdCAgICB9O1xuXG5cdCAgICBTdGFjay5wcm90b3R5cGUudW5zaGlmdCA9IGZ1bmN0aW9uKC8qLi4udmFsdWVzKi8pIHtcblx0ICAgICAgcmV0dXJuIHRoaXMucHVzaC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHQgICAgfTtcblxuXHQgICAgU3RhY2sucHJvdG90eXBlLnVuc2hpZnRBbGwgPSBmdW5jdGlvbihpdGVyKSB7XG5cdCAgICAgIHJldHVybiB0aGlzLnB1c2hBbGwoaXRlcik7XG5cdCAgICB9O1xuXG5cdCAgICBTdGFjay5wcm90b3R5cGUuc2hpZnQgPSBmdW5jdGlvbigpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMucG9wLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdCAgICB9O1xuXG5cdCAgICBTdGFjay5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcblx0ICAgICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCkge1xuXHQgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICB9XG5cdCAgICAgIGlmICh0aGlzLl9fb3duZXJJRCkge1xuXHQgICAgICAgIHRoaXMuc2l6ZSA9IDA7XG5cdCAgICAgICAgdGhpcy5faGVhZCA9IHVuZGVmaW5lZDtcblx0ICAgICAgICB0aGlzLl9faGFzaCA9IHVuZGVmaW5lZDtcblx0ICAgICAgICB0aGlzLl9fYWx0ZXJlZCA9IHRydWU7XG5cdCAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIGVtcHR5U3RhY2soKTtcblx0ICAgIH07XG5cblx0ICAgIFN0YWNrLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uKGJlZ2luLCBlbmQpIHtcblx0ICAgICAgaWYgKHdob2xlU2xpY2UoYmVnaW4sIGVuZCwgdGhpcy5zaXplKSkge1xuXHQgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICB9XG5cdCAgICAgIHZhciByZXNvbHZlZEJlZ2luID0gcmVzb2x2ZUJlZ2luKGJlZ2luLCB0aGlzLnNpemUpO1xuXHQgICAgICB2YXIgcmVzb2x2ZWRFbmQgPSByZXNvbHZlRW5kKGVuZCwgdGhpcy5zaXplKTtcblx0ICAgICAgaWYgKHJlc29sdmVkRW5kICE9PSB0aGlzLnNpemUpIHtcblx0ICAgICAgICAvLyBzdXBlci5zbGljZShiZWdpbiwgZW5kKTtcblx0ICAgICAgICByZXR1cm4gSW5kZXhlZENvbGxlY3Rpb24ucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcywgYmVnaW4sIGVuZCk7XG5cdCAgICAgIH1cblx0ICAgICAgdmFyIG5ld1NpemUgPSB0aGlzLnNpemUgLSByZXNvbHZlZEJlZ2luO1xuXHQgICAgICB2YXIgaGVhZCA9IHRoaXMuX2hlYWQ7XG5cdCAgICAgIHdoaWxlIChyZXNvbHZlZEJlZ2luLS0pIHtcblx0ICAgICAgICBoZWFkID0gaGVhZC5uZXh0O1xuXHQgICAgICB9XG5cdCAgICAgIGlmICh0aGlzLl9fb3duZXJJRCkge1xuXHQgICAgICAgIHRoaXMuc2l6ZSA9IG5ld1NpemU7XG5cdCAgICAgICAgdGhpcy5faGVhZCA9IGhlYWQ7XG5cdCAgICAgICAgdGhpcy5fX2hhc2ggPSB1bmRlZmluZWQ7XG5cdCAgICAgICAgdGhpcy5fX2FsdGVyZWQgPSB0cnVlO1xuXHQgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiBtYWtlU3RhY2sobmV3U2l6ZSwgaGVhZCk7XG5cdCAgICB9O1xuXG5cdCAgICAvLyBAcHJhZ21hIE11dGFiaWxpdHlcblxuXHQgICAgU3RhY2sucHJvdG90eXBlLl9fZW5zdXJlT3duZXIgPSBmdW5jdGlvbihvd25lcklEKSB7XG5cdCAgICAgIGlmIChvd25lcklEID09PSB0aGlzLl9fb3duZXJJRCkge1xuXHQgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICB9XG5cdCAgICAgIGlmICghb3duZXJJRCkge1xuXHQgICAgICAgIHRoaXMuX19vd25lcklEID0gb3duZXJJRDtcblx0ICAgICAgICB0aGlzLl9fYWx0ZXJlZCA9IGZhbHNlO1xuXHQgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiBtYWtlU3RhY2sodGhpcy5zaXplLCB0aGlzLl9oZWFkLCBvd25lcklELCB0aGlzLl9faGFzaCk7XG5cdCAgICB9O1xuXG5cdCAgICAvLyBAcHJhZ21hIEl0ZXJhdGlvblxuXG5cdCAgICBTdGFjay5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHtcblx0ICAgICAgaWYgKHJldmVyc2UpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcy5yZXZlcnNlKCkuX19pdGVyYXRlKGZuKTtcblx0ICAgICAgfVxuXHQgICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG5cdCAgICAgIHZhciBub2RlID0gdGhpcy5faGVhZDtcblx0ICAgICAgd2hpbGUgKG5vZGUpIHtcblx0ICAgICAgICBpZiAoZm4obm9kZS52YWx1ZSwgaXRlcmF0aW9ucysrLCB0aGlzKSA9PT0gZmFsc2UpIHtcblx0ICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiBpdGVyYXRpb25zO1xuXHQgICAgfTtcblxuXHQgICAgU3RhY2sucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG5cdCAgICAgIGlmIChyZXZlcnNlKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMucmV2ZXJzZSgpLl9faXRlcmF0b3IodHlwZSk7XG5cdCAgICAgIH1cblx0ICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuXHQgICAgICB2YXIgbm9kZSA9IHRoaXMuX2hlYWQ7XG5cdCAgICAgIHJldHVybiBuZXcgc3JjX0l0ZXJhdG9yX19JdGVyYXRvcihmdW5jdGlvbigpICB7XG5cdCAgICAgICAgaWYgKG5vZGUpIHtcblx0ICAgICAgICAgIHZhciB2YWx1ZSA9IG5vZGUudmFsdWU7XG5cdCAgICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xuXHQgICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yVmFsdWUodHlwZSwgaXRlcmF0aW9ucysrLCB2YWx1ZSk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHJldHVybiBpdGVyYXRvckRvbmUoKTtcblx0ICAgICAgfSk7XG5cdCAgICB9O1xuXG5cblx0ICBmdW5jdGlvbiBpc1N0YWNrKG1heWJlU3RhY2spIHtcblx0ICAgIHJldHVybiAhIShtYXliZVN0YWNrICYmIG1heWJlU3RhY2tbSVNfU1RBQ0tfU0VOVElORUxdKTtcblx0ICB9XG5cblx0ICBTdGFjay5pc1N0YWNrID0gaXNTdGFjaztcblxuXHQgIHZhciBJU19TVEFDS19TRU5USU5FTCA9ICdAQF9fSU1NVVRBQkxFX1NUQUNLX19AQCc7XG5cblx0ICB2YXIgU3RhY2tQcm90b3R5cGUgPSBTdGFjay5wcm90b3R5cGU7XG5cdCAgU3RhY2tQcm90b3R5cGVbSVNfU1RBQ0tfU0VOVElORUxdID0gdHJ1ZTtcblx0ICBTdGFja1Byb3RvdHlwZS53aXRoTXV0YXRpb25zID0gTWFwUHJvdG90eXBlLndpdGhNdXRhdGlvbnM7XG5cdCAgU3RhY2tQcm90b3R5cGUuYXNNdXRhYmxlID0gTWFwUHJvdG90eXBlLmFzTXV0YWJsZTtcblx0ICBTdGFja1Byb3RvdHlwZS5hc0ltbXV0YWJsZSA9IE1hcFByb3RvdHlwZS5hc0ltbXV0YWJsZTtcblx0ICBTdGFja1Byb3RvdHlwZS53YXNBbHRlcmVkID0gTWFwUHJvdG90eXBlLndhc0FsdGVyZWQ7XG5cblxuXHQgIGZ1bmN0aW9uIG1ha2VTdGFjayhzaXplLCBoZWFkLCBvd25lcklELCBoYXNoKSB7XG5cdCAgICB2YXIgbWFwID0gT2JqZWN0LmNyZWF0ZShTdGFja1Byb3RvdHlwZSk7XG5cdCAgICBtYXAuc2l6ZSA9IHNpemU7XG5cdCAgICBtYXAuX2hlYWQgPSBoZWFkO1xuXHQgICAgbWFwLl9fb3duZXJJRCA9IG93bmVySUQ7XG5cdCAgICBtYXAuX19oYXNoID0gaGFzaDtcblx0ICAgIG1hcC5fX2FsdGVyZWQgPSBmYWxzZTtcblx0ICAgIHJldHVybiBtYXA7XG5cdCAgfVxuXG5cdCAgdmFyIEVNUFRZX1NUQUNLO1xuXHQgIGZ1bmN0aW9uIGVtcHR5U3RhY2soKSB7XG5cdCAgICByZXR1cm4gRU1QVFlfU1RBQ0sgfHwgKEVNUFRZX1NUQUNLID0gbWFrZVN0YWNrKDApKTtcblx0ICB9XG5cblx0ICBjcmVhdGVDbGFzcyhzcmNfU2V0X19TZXQsIFNldENvbGxlY3Rpb24pO1xuXG5cdCAgICAvLyBAcHJhZ21hIENvbnN0cnVjdGlvblxuXG5cdCAgICBmdW5jdGlvbiBzcmNfU2V0X19TZXQodmFsdWUpIHtcblx0ICAgICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgPyBlbXB0eVNldCgpIDpcblx0ICAgICAgICBpc1NldCh2YWx1ZSkgPyB2YWx1ZSA6XG5cdCAgICAgICAgZW1wdHlTZXQoKS53aXRoTXV0YXRpb25zKGZ1bmN0aW9uKHNldCApIHtcblx0ICAgICAgICAgIHZhciBpdGVyID0gU2V0SXRlcmFibGUodmFsdWUpO1xuXHQgICAgICAgICAgYXNzZXJ0Tm90SW5maW5pdGUoaXRlci5zaXplKTtcblx0ICAgICAgICAgIGl0ZXIuZm9yRWFjaChmdW5jdGlvbih2ICkge3JldHVybiBzZXQuYWRkKHYpfSk7XG5cdCAgICAgICAgfSk7XG5cdCAgICB9XG5cblx0ICAgIHNyY19TZXRfX1NldC5vZiA9IGZ1bmN0aW9uKC8qLi4udmFsdWVzKi8pIHtcblx0ICAgICAgcmV0dXJuIHRoaXMoYXJndW1lbnRzKTtcblx0ICAgIH07XG5cblx0ICAgIHNyY19TZXRfX1NldC5mcm9tS2V5cyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdCAgICAgIHJldHVybiB0aGlzKEtleWVkSXRlcmFibGUodmFsdWUpLmtleVNlcSgpKTtcblx0ICAgIH07XG5cblx0ICAgIHNyY19TZXRfX1NldC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZygnU2V0IHsnLCAnfScpO1xuXHQgICAgfTtcblxuXHQgICAgLy8gQHByYWdtYSBBY2Nlc3NcblxuXHQgICAgc3JjX1NldF9fU2V0LnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHQgICAgICByZXR1cm4gdGhpcy5fbWFwLmhhcyh2YWx1ZSk7XG5cdCAgICB9O1xuXG5cdCAgICAvLyBAcHJhZ21hIE1vZGlmaWNhdGlvblxuXG5cdCAgICBzcmNfU2V0X19TZXQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdCAgICAgIHJldHVybiB1cGRhdGVTZXQodGhpcywgdGhpcy5fbWFwLnNldCh2YWx1ZSwgdHJ1ZSkpO1xuXHQgICAgfTtcblxuXHQgICAgc3JjX1NldF9fU2V0LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHQgICAgICByZXR1cm4gdXBkYXRlU2V0KHRoaXMsIHRoaXMuX21hcC5yZW1vdmUodmFsdWUpKTtcblx0ICAgIH07XG5cblx0ICAgIHNyY19TZXRfX1NldC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcblx0ICAgICAgcmV0dXJuIHVwZGF0ZVNldCh0aGlzLCB0aGlzLl9tYXAuY2xlYXIoKSk7XG5cdCAgICB9O1xuXG5cdCAgICAvLyBAcHJhZ21hIENvbXBvc2l0aW9uXG5cblx0ICAgIHNyY19TZXRfX1NldC5wcm90b3R5cGUudW5pb24gPSBmdW5jdGlvbigpIHt2YXIgaXRlcnMgPSBTTElDRSQwLmNhbGwoYXJndW1lbnRzLCAwKTtcblx0ICAgICAgaXRlcnMgPSBpdGVycy5maWx0ZXIoZnVuY3Rpb24oeCApIHtyZXR1cm4geC5zaXplICE9PSAwfSk7XG5cdCAgICAgIGlmIChpdGVycy5sZW5ndGggPT09IDApIHtcblx0ICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgfVxuXHQgICAgICBpZiAodGhpcy5zaXplID09PSAwICYmICF0aGlzLl9fb3duZXJJRCAmJiBpdGVycy5sZW5ndGggPT09IDEpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3RvcihpdGVyc1swXSk7XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIHRoaXMud2l0aE11dGF0aW9ucyhmdW5jdGlvbihzZXQgKSB7XG5cdCAgICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IGl0ZXJzLmxlbmd0aDsgaWkrKykge1xuXHQgICAgICAgICAgU2V0SXRlcmFibGUoaXRlcnNbaWldKS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlICkge3JldHVybiBzZXQuYWRkKHZhbHVlKX0pO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSk7XG5cdCAgICB9O1xuXG5cdCAgICBzcmNfU2V0X19TZXQucHJvdG90eXBlLmludGVyc2VjdCA9IGZ1bmN0aW9uKCkge3ZhciBpdGVycyA9IFNMSUNFJDAuY2FsbChhcmd1bWVudHMsIDApO1xuXHQgICAgICBpZiAoaXRlcnMubGVuZ3RoID09PSAwKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICAgIH1cblx0ICAgICAgaXRlcnMgPSBpdGVycy5tYXAoZnVuY3Rpb24oaXRlciApIHtyZXR1cm4gU2V0SXRlcmFibGUoaXRlcil9KTtcblx0ICAgICAgdmFyIG9yaWdpbmFsU2V0ID0gdGhpcztcblx0ICAgICAgcmV0dXJuIHRoaXMud2l0aE11dGF0aW9ucyhmdW5jdGlvbihzZXQgKSB7XG5cdCAgICAgICAgb3JpZ2luYWxTZXQuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSApIHtcblx0ICAgICAgICAgIGlmICghaXRlcnMuZXZlcnkoZnVuY3Rpb24oaXRlciApIHtyZXR1cm4gaXRlci5pbmNsdWRlcyh2YWx1ZSl9KSkge1xuXHQgICAgICAgICAgICBzZXQucmVtb3ZlKHZhbHVlKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblx0ICAgICAgfSk7XG5cdCAgICB9O1xuXG5cdCAgICBzcmNfU2V0X19TZXQucHJvdG90eXBlLnN1YnRyYWN0ID0gZnVuY3Rpb24oKSB7dmFyIGl0ZXJzID0gU0xJQ0UkMC5jYWxsKGFyZ3VtZW50cywgMCk7XG5cdCAgICAgIGlmIChpdGVycy5sZW5ndGggPT09IDApIHtcblx0ICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgfVxuXHQgICAgICBpdGVycyA9IGl0ZXJzLm1hcChmdW5jdGlvbihpdGVyICkge3JldHVybiBTZXRJdGVyYWJsZShpdGVyKX0pO1xuXHQgICAgICB2YXIgb3JpZ2luYWxTZXQgPSB0aGlzO1xuXHQgICAgICByZXR1cm4gdGhpcy53aXRoTXV0YXRpb25zKGZ1bmN0aW9uKHNldCApIHtcblx0ICAgICAgICBvcmlnaW5hbFNldC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlICkge1xuXHQgICAgICAgICAgaWYgKGl0ZXJzLnNvbWUoZnVuY3Rpb24oaXRlciApIHtyZXR1cm4gaXRlci5pbmNsdWRlcyh2YWx1ZSl9KSkge1xuXHQgICAgICAgICAgICBzZXQucmVtb3ZlKHZhbHVlKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9KTtcblx0ICAgICAgfSk7XG5cdCAgICB9O1xuXG5cdCAgICBzcmNfU2V0X19TZXQucHJvdG90eXBlLm1lcmdlID0gZnVuY3Rpb24oKSB7XG5cdCAgICAgIHJldHVybiB0aGlzLnVuaW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdCAgICB9O1xuXG5cdCAgICBzcmNfU2V0X19TZXQucHJvdG90eXBlLm1lcmdlV2l0aCA9IGZ1bmN0aW9uKG1lcmdlcikge3ZhciBpdGVycyA9IFNMSUNFJDAuY2FsbChhcmd1bWVudHMsIDEpO1xuXHQgICAgICByZXR1cm4gdGhpcy51bmlvbi5hcHBseSh0aGlzLCBpdGVycyk7XG5cdCAgICB9O1xuXG5cdCAgICBzcmNfU2V0X19TZXQucHJvdG90eXBlLnNvcnQgPSBmdW5jdGlvbihjb21wYXJhdG9yKSB7XG5cdCAgICAgIC8vIExhdGUgYmluZGluZ1xuXHQgICAgICByZXR1cm4gT3JkZXJlZFNldChzb3J0RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yKSk7XG5cdCAgICB9O1xuXG5cdCAgICBzcmNfU2V0X19TZXQucHJvdG90eXBlLnNvcnRCeSA9IGZ1bmN0aW9uKG1hcHBlciwgY29tcGFyYXRvcikge1xuXHQgICAgICAvLyBMYXRlIGJpbmRpbmdcblx0ICAgICAgcmV0dXJuIE9yZGVyZWRTZXQoc29ydEZhY3RvcnkodGhpcywgY29tcGFyYXRvciwgbWFwcGVyKSk7XG5cdCAgICB9O1xuXG5cdCAgICBzcmNfU2V0X19TZXQucHJvdG90eXBlLndhc0FsdGVyZWQgPSBmdW5jdGlvbigpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuX21hcC53YXNBbHRlcmVkKCk7XG5cdCAgICB9O1xuXG5cdCAgICBzcmNfU2V0X19TZXQucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG5cdCAgICAgIHJldHVybiB0aGlzLl9tYXAuX19pdGVyYXRlKGZ1bmN0aW9uKF8sIGspICB7cmV0dXJuIGZuKGssIGssIHRoaXMkMCl9LCByZXZlcnNlKTtcblx0ICAgIH07XG5cblx0ICAgIHNyY19TZXRfX1NldC5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuX21hcC5tYXAoZnVuY3Rpb24oXywgaykgIHtyZXR1cm4ga30pLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG5cdCAgICB9O1xuXG5cdCAgICBzcmNfU2V0X19TZXQucHJvdG90eXBlLl9fZW5zdXJlT3duZXIgPSBmdW5jdGlvbihvd25lcklEKSB7XG5cdCAgICAgIGlmIChvd25lcklEID09PSB0aGlzLl9fb3duZXJJRCkge1xuXHQgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICB9XG5cdCAgICAgIHZhciBuZXdNYXAgPSB0aGlzLl9tYXAuX19lbnN1cmVPd25lcihvd25lcklEKTtcblx0ICAgICAgaWYgKCFvd25lcklEKSB7XG5cdCAgICAgICAgdGhpcy5fX293bmVySUQgPSBvd25lcklEO1xuXHQgICAgICAgIHRoaXMuX21hcCA9IG5ld01hcDtcblx0ICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gdGhpcy5fX21ha2UobmV3TWFwLCBvd25lcklEKTtcblx0ICAgIH07XG5cblxuXHQgIGZ1bmN0aW9uIGlzU2V0KG1heWJlU2V0KSB7XG5cdCAgICByZXR1cm4gISEobWF5YmVTZXQgJiYgbWF5YmVTZXRbSVNfU0VUX1NFTlRJTkVMXSk7XG5cdCAgfVxuXG5cdCAgc3JjX1NldF9fU2V0LmlzU2V0ID0gaXNTZXQ7XG5cblx0ICB2YXIgSVNfU0VUX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfU0VUX19AQCc7XG5cblx0ICB2YXIgU2V0UHJvdG90eXBlID0gc3JjX1NldF9fU2V0LnByb3RvdHlwZTtcblx0ICBTZXRQcm90b3R5cGVbSVNfU0VUX1NFTlRJTkVMXSA9IHRydWU7XG5cdCAgU2V0UHJvdG90eXBlW0RFTEVURV0gPSBTZXRQcm90b3R5cGUucmVtb3ZlO1xuXHQgIFNldFByb3RvdHlwZS5tZXJnZURlZXAgPSBTZXRQcm90b3R5cGUubWVyZ2U7XG5cdCAgU2V0UHJvdG90eXBlLm1lcmdlRGVlcFdpdGggPSBTZXRQcm90b3R5cGUubWVyZ2VXaXRoO1xuXHQgIFNldFByb3RvdHlwZS53aXRoTXV0YXRpb25zID0gTWFwUHJvdG90eXBlLndpdGhNdXRhdGlvbnM7XG5cdCAgU2V0UHJvdG90eXBlLmFzTXV0YWJsZSA9IE1hcFByb3RvdHlwZS5hc011dGFibGU7XG5cdCAgU2V0UHJvdG90eXBlLmFzSW1tdXRhYmxlID0gTWFwUHJvdG90eXBlLmFzSW1tdXRhYmxlO1xuXG5cdCAgU2V0UHJvdG90eXBlLl9fZW1wdHkgPSBlbXB0eVNldDtcblx0ICBTZXRQcm90b3R5cGUuX19tYWtlID0gbWFrZVNldDtcblxuXHQgIGZ1bmN0aW9uIHVwZGF0ZVNldChzZXQsIG5ld01hcCkge1xuXHQgICAgaWYgKHNldC5fX293bmVySUQpIHtcblx0ICAgICAgc2V0LnNpemUgPSBuZXdNYXAuc2l6ZTtcblx0ICAgICAgc2V0Ll9tYXAgPSBuZXdNYXA7XG5cdCAgICAgIHJldHVybiBzZXQ7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gbmV3TWFwID09PSBzZXQuX21hcCA/IHNldCA6XG5cdCAgICAgIG5ld01hcC5zaXplID09PSAwID8gc2V0Ll9fZW1wdHkoKSA6XG5cdCAgICAgIHNldC5fX21ha2UobmV3TWFwKTtcblx0ICB9XG5cblx0ICBmdW5jdGlvbiBtYWtlU2V0KG1hcCwgb3duZXJJRCkge1xuXHQgICAgdmFyIHNldCA9IE9iamVjdC5jcmVhdGUoU2V0UHJvdG90eXBlKTtcblx0ICAgIHNldC5zaXplID0gbWFwID8gbWFwLnNpemUgOiAwO1xuXHQgICAgc2V0Ll9tYXAgPSBtYXA7XG5cdCAgICBzZXQuX19vd25lcklEID0gb3duZXJJRDtcblx0ICAgIHJldHVybiBzZXQ7XG5cdCAgfVxuXG5cdCAgdmFyIEVNUFRZX1NFVDtcblx0ICBmdW5jdGlvbiBlbXB0eVNldCgpIHtcblx0ICAgIHJldHVybiBFTVBUWV9TRVQgfHwgKEVNUFRZX1NFVCA9IG1ha2VTZXQoZW1wdHlNYXAoKSkpO1xuXHQgIH1cblxuXHQgIGNyZWF0ZUNsYXNzKE9yZGVyZWRTZXQsIHNyY19TZXRfX1NldCk7XG5cblx0ICAgIC8vIEBwcmFnbWEgQ29uc3RydWN0aW9uXG5cblx0ICAgIGZ1bmN0aW9uIE9yZGVyZWRTZXQodmFsdWUpIHtcblx0ICAgICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgPyBlbXB0eU9yZGVyZWRTZXQoKSA6XG5cdCAgICAgICAgaXNPcmRlcmVkU2V0KHZhbHVlKSA/IHZhbHVlIDpcblx0ICAgICAgICBlbXB0eU9yZGVyZWRTZXQoKS53aXRoTXV0YXRpb25zKGZ1bmN0aW9uKHNldCApIHtcblx0ICAgICAgICAgIHZhciBpdGVyID0gU2V0SXRlcmFibGUodmFsdWUpO1xuXHQgICAgICAgICAgYXNzZXJ0Tm90SW5maW5pdGUoaXRlci5zaXplKTtcblx0ICAgICAgICAgIGl0ZXIuZm9yRWFjaChmdW5jdGlvbih2ICkge3JldHVybiBzZXQuYWRkKHYpfSk7XG5cdCAgICAgICAgfSk7XG5cdCAgICB9XG5cblx0ICAgIE9yZGVyZWRTZXQub2YgPSBmdW5jdGlvbigvKi4uLnZhbHVlcyovKSB7XG5cdCAgICAgIHJldHVybiB0aGlzKGFyZ3VtZW50cyk7XG5cdCAgICB9O1xuXG5cdCAgICBPcmRlcmVkU2V0LmZyb21LZXlzID0gZnVuY3Rpb24odmFsdWUpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMoS2V5ZWRJdGVyYWJsZSh2YWx1ZSkua2V5U2VxKCkpO1xuXHQgICAgfTtcblxuXHQgICAgT3JkZXJlZFNldC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZygnT3JkZXJlZFNldCB7JywgJ30nKTtcblx0ICAgIH07XG5cblxuXHQgIGZ1bmN0aW9uIGlzT3JkZXJlZFNldChtYXliZU9yZGVyZWRTZXQpIHtcblx0ICAgIHJldHVybiBpc1NldChtYXliZU9yZGVyZWRTZXQpICYmIGlzT3JkZXJlZChtYXliZU9yZGVyZWRTZXQpO1xuXHQgIH1cblxuXHQgIE9yZGVyZWRTZXQuaXNPcmRlcmVkU2V0ID0gaXNPcmRlcmVkU2V0O1xuXG5cdCAgdmFyIE9yZGVyZWRTZXRQcm90b3R5cGUgPSBPcmRlcmVkU2V0LnByb3RvdHlwZTtcblx0ICBPcmRlcmVkU2V0UHJvdG90eXBlW0lTX09SREVSRURfU0VOVElORUxdID0gdHJ1ZTtcblxuXHQgIE9yZGVyZWRTZXRQcm90b3R5cGUuX19lbXB0eSA9IGVtcHR5T3JkZXJlZFNldDtcblx0ICBPcmRlcmVkU2V0UHJvdG90eXBlLl9fbWFrZSA9IG1ha2VPcmRlcmVkU2V0O1xuXG5cdCAgZnVuY3Rpb24gbWFrZU9yZGVyZWRTZXQobWFwLCBvd25lcklEKSB7XG5cdCAgICB2YXIgc2V0ID0gT2JqZWN0LmNyZWF0ZShPcmRlcmVkU2V0UHJvdG90eXBlKTtcblx0ICAgIHNldC5zaXplID0gbWFwID8gbWFwLnNpemUgOiAwO1xuXHQgICAgc2V0Ll9tYXAgPSBtYXA7XG5cdCAgICBzZXQuX19vd25lcklEID0gb3duZXJJRDtcblx0ICAgIHJldHVybiBzZXQ7XG5cdCAgfVxuXG5cdCAgdmFyIEVNUFRZX09SREVSRURfU0VUO1xuXHQgIGZ1bmN0aW9uIGVtcHR5T3JkZXJlZFNldCgpIHtcblx0ICAgIHJldHVybiBFTVBUWV9PUkRFUkVEX1NFVCB8fCAoRU1QVFlfT1JERVJFRF9TRVQgPSBtYWtlT3JkZXJlZFNldChlbXB0eU9yZGVyZWRNYXAoKSkpO1xuXHQgIH1cblxuXHQgIGNyZWF0ZUNsYXNzKFJlY29yZCwgS2V5ZWRDb2xsZWN0aW9uKTtcblxuXHQgICAgZnVuY3Rpb24gUmVjb3JkKGRlZmF1bHRWYWx1ZXMsIG5hbWUpIHtcblx0ICAgICAgdmFyIGhhc0luaXRpYWxpemVkO1xuXG5cdCAgICAgIHZhciBSZWNvcmRUeXBlID0gZnVuY3Rpb24gUmVjb3JkKHZhbHVlcykge1xuXHQgICAgICAgIGlmICh2YWx1ZXMgaW5zdGFuY2VvZiBSZWNvcmRUeXBlKSB7XG5cdCAgICAgICAgICByZXR1cm4gdmFsdWVzO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUmVjb3JkVHlwZSkpIHtcblx0ICAgICAgICAgIHJldHVybiBuZXcgUmVjb3JkVHlwZSh2YWx1ZXMpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBpZiAoIWhhc0luaXRpYWxpemVkKSB7XG5cdCAgICAgICAgICBoYXNJbml0aWFsaXplZCA9IHRydWU7XG5cdCAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGRlZmF1bHRWYWx1ZXMpO1xuXHQgICAgICAgICAgc2V0UHJvcHMoUmVjb3JkVHlwZVByb3RvdHlwZSwga2V5cyk7XG5cdCAgICAgICAgICBSZWNvcmRUeXBlUHJvdG90eXBlLnNpemUgPSBrZXlzLmxlbmd0aDtcblx0ICAgICAgICAgIFJlY29yZFR5cGVQcm90b3R5cGUuX25hbWUgPSBuYW1lO1xuXHQgICAgICAgICAgUmVjb3JkVHlwZVByb3RvdHlwZS5fa2V5cyA9IGtleXM7XG5cdCAgICAgICAgICBSZWNvcmRUeXBlUHJvdG90eXBlLl9kZWZhdWx0VmFsdWVzID0gZGVmYXVsdFZhbHVlcztcblx0ICAgICAgICB9XG5cdCAgICAgICAgdGhpcy5fbWFwID0gc3JjX01hcF9fTWFwKHZhbHVlcyk7XG5cdCAgICAgIH07XG5cblx0ICAgICAgdmFyIFJlY29yZFR5cGVQcm90b3R5cGUgPSBSZWNvcmRUeXBlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUmVjb3JkUHJvdG90eXBlKTtcblx0ICAgICAgUmVjb3JkVHlwZVByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFJlY29yZFR5cGU7XG5cblx0ICAgICAgcmV0dXJuIFJlY29yZFR5cGU7XG5cdCAgICB9XG5cblx0ICAgIFJlY29yZC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZyhyZWNvcmROYW1lKHRoaXMpICsgJyB7JywgJ30nKTtcblx0ICAgIH07XG5cblx0ICAgIC8vIEBwcmFnbWEgQWNjZXNzXG5cblx0ICAgIFJlY29yZC5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24oaykge1xuXHQgICAgICByZXR1cm4gdGhpcy5fZGVmYXVsdFZhbHVlcy5oYXNPd25Qcm9wZXJ0eShrKTtcblx0ICAgIH07XG5cblx0ICAgIFJlY29yZC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oaywgbm90U2V0VmFsdWUpIHtcblx0ICAgICAgaWYgKCF0aGlzLmhhcyhrKSkge1xuXHQgICAgICAgIHJldHVybiBub3RTZXRWYWx1ZTtcblx0ICAgICAgfVxuXHQgICAgICB2YXIgZGVmYXVsdFZhbCA9IHRoaXMuX2RlZmF1bHRWYWx1ZXNba107XG5cdCAgICAgIHJldHVybiB0aGlzLl9tYXAgPyB0aGlzLl9tYXAuZ2V0KGssIGRlZmF1bHRWYWwpIDogZGVmYXVsdFZhbDtcblx0ICAgIH07XG5cblx0ICAgIC8vIEBwcmFnbWEgTW9kaWZpY2F0aW9uXG5cblx0ICAgIFJlY29yZC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcblx0ICAgICAgaWYgKHRoaXMuX19vd25lcklEKSB7XG5cdCAgICAgICAgdGhpcy5fbWFwICYmIHRoaXMuX21hcC5jbGVhcigpO1xuXHQgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICB9XG5cdCAgICAgIHZhciBSZWNvcmRUeXBlID0gdGhpcy5jb25zdHJ1Y3Rvcjtcblx0ICAgICAgcmV0dXJuIFJlY29yZFR5cGUuX2VtcHR5IHx8IChSZWNvcmRUeXBlLl9lbXB0eSA9IG1ha2VSZWNvcmQodGhpcywgZW1wdHlNYXAoKSkpO1xuXHQgICAgfTtcblxuXHQgICAgUmVjb3JkLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihrLCB2KSB7XG5cdCAgICAgIGlmICghdGhpcy5oYXMoaykpIHtcblx0ICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBzZXQgdW5rbm93biBrZXkgXCInICsgayArICdcIiBvbiAnICsgcmVjb3JkTmFtZSh0aGlzKSk7XG5cdCAgICAgIH1cblx0ICAgICAgdmFyIG5ld01hcCA9IHRoaXMuX21hcCAmJiB0aGlzLl9tYXAuc2V0KGssIHYpO1xuXHQgICAgICBpZiAodGhpcy5fX293bmVySUQgfHwgbmV3TWFwID09PSB0aGlzLl9tYXApIHtcblx0ICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gbWFrZVJlY29yZCh0aGlzLCBuZXdNYXApO1xuXHQgICAgfTtcblxuXHQgICAgUmVjb3JkLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihrKSB7XG5cdCAgICAgIGlmICghdGhpcy5oYXMoaykpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgfVxuXHQgICAgICB2YXIgbmV3TWFwID0gdGhpcy5fbWFwICYmIHRoaXMuX21hcC5yZW1vdmUoayk7XG5cdCAgICAgIGlmICh0aGlzLl9fb3duZXJJRCB8fCBuZXdNYXAgPT09IHRoaXMuX21hcCkge1xuXHQgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiBtYWtlUmVjb3JkKHRoaXMsIG5ld01hcCk7XG5cdCAgICB9O1xuXG5cdCAgICBSZWNvcmQucHJvdG90eXBlLndhc0FsdGVyZWQgPSBmdW5jdGlvbigpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuX21hcC53YXNBbHRlcmVkKCk7XG5cdCAgICB9O1xuXG5cdCAgICBSZWNvcmQucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG5cdCAgICAgIHJldHVybiBLZXllZEl0ZXJhYmxlKHRoaXMuX2RlZmF1bHRWYWx1ZXMpLm1hcChmdW5jdGlvbihfLCBrKSAge3JldHVybiB0aGlzJDAuZ2V0KGspfSkuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcblx0ICAgIH07XG5cblx0ICAgIFJlY29yZC5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcblx0ICAgICAgcmV0dXJuIEtleWVkSXRlcmFibGUodGhpcy5fZGVmYXVsdFZhbHVlcykubWFwKGZ1bmN0aW9uKF8sIGspICB7cmV0dXJuIHRoaXMkMC5nZXQoayl9KS5fX2l0ZXJhdGUoZm4sIHJldmVyc2UpO1xuXHQgICAgfTtcblxuXHQgICAgUmVjb3JkLnByb3RvdHlwZS5fX2Vuc3VyZU93bmVyID0gZnVuY3Rpb24ob3duZXJJRCkge1xuXHQgICAgICBpZiAob3duZXJJRCA9PT0gdGhpcy5fX293bmVySUQpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgfVxuXHQgICAgICB2YXIgbmV3TWFwID0gdGhpcy5fbWFwICYmIHRoaXMuX21hcC5fX2Vuc3VyZU93bmVyKG93bmVySUQpO1xuXHQgICAgICBpZiAoIW93bmVySUQpIHtcblx0ICAgICAgICB0aGlzLl9fb3duZXJJRCA9IG93bmVySUQ7XG5cdCAgICAgICAgdGhpcy5fbWFwID0gbmV3TWFwO1xuXHQgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiBtYWtlUmVjb3JkKHRoaXMsIG5ld01hcCwgb3duZXJJRCk7XG5cdCAgICB9O1xuXG5cblx0ICB2YXIgUmVjb3JkUHJvdG90eXBlID0gUmVjb3JkLnByb3RvdHlwZTtcblx0ICBSZWNvcmRQcm90b3R5cGVbREVMRVRFXSA9IFJlY29yZFByb3RvdHlwZS5yZW1vdmU7XG5cdCAgUmVjb3JkUHJvdG90eXBlLmRlbGV0ZUluID1cblx0ICBSZWNvcmRQcm90b3R5cGUucmVtb3ZlSW4gPSBNYXBQcm90b3R5cGUucmVtb3ZlSW47XG5cdCAgUmVjb3JkUHJvdG90eXBlLm1lcmdlID0gTWFwUHJvdG90eXBlLm1lcmdlO1xuXHQgIFJlY29yZFByb3RvdHlwZS5tZXJnZVdpdGggPSBNYXBQcm90b3R5cGUubWVyZ2VXaXRoO1xuXHQgIFJlY29yZFByb3RvdHlwZS5tZXJnZUluID0gTWFwUHJvdG90eXBlLm1lcmdlSW47XG5cdCAgUmVjb3JkUHJvdG90eXBlLm1lcmdlRGVlcCA9IE1hcFByb3RvdHlwZS5tZXJnZURlZXA7XG5cdCAgUmVjb3JkUHJvdG90eXBlLm1lcmdlRGVlcFdpdGggPSBNYXBQcm90b3R5cGUubWVyZ2VEZWVwV2l0aDtcblx0ICBSZWNvcmRQcm90b3R5cGUubWVyZ2VEZWVwSW4gPSBNYXBQcm90b3R5cGUubWVyZ2VEZWVwSW47XG5cdCAgUmVjb3JkUHJvdG90eXBlLnNldEluID0gTWFwUHJvdG90eXBlLnNldEluO1xuXHQgIFJlY29yZFByb3RvdHlwZS51cGRhdGUgPSBNYXBQcm90b3R5cGUudXBkYXRlO1xuXHQgIFJlY29yZFByb3RvdHlwZS51cGRhdGVJbiA9IE1hcFByb3RvdHlwZS51cGRhdGVJbjtcblx0ICBSZWNvcmRQcm90b3R5cGUud2l0aE11dGF0aW9ucyA9IE1hcFByb3RvdHlwZS53aXRoTXV0YXRpb25zO1xuXHQgIFJlY29yZFByb3RvdHlwZS5hc011dGFibGUgPSBNYXBQcm90b3R5cGUuYXNNdXRhYmxlO1xuXHQgIFJlY29yZFByb3RvdHlwZS5hc0ltbXV0YWJsZSA9IE1hcFByb3RvdHlwZS5hc0ltbXV0YWJsZTtcblxuXG5cdCAgZnVuY3Rpb24gbWFrZVJlY29yZChsaWtlUmVjb3JkLCBtYXAsIG93bmVySUQpIHtcblx0ICAgIHZhciByZWNvcmQgPSBPYmplY3QuY3JlYXRlKE9iamVjdC5nZXRQcm90b3R5cGVPZihsaWtlUmVjb3JkKSk7XG5cdCAgICByZWNvcmQuX21hcCA9IG1hcDtcblx0ICAgIHJlY29yZC5fX293bmVySUQgPSBvd25lcklEO1xuXHQgICAgcmV0dXJuIHJlY29yZDtcblx0ICB9XG5cblx0ICBmdW5jdGlvbiByZWNvcmROYW1lKHJlY29yZCkge1xuXHQgICAgcmV0dXJuIHJlY29yZC5fbmFtZSB8fCByZWNvcmQuY29uc3RydWN0b3IubmFtZSB8fCAnUmVjb3JkJztcblx0ICB9XG5cblx0ICBmdW5jdGlvbiBzZXRQcm9wcyhwcm90b3R5cGUsIG5hbWVzKSB7XG5cdCAgICB0cnkge1xuXHQgICAgICBuYW1lcy5mb3JFYWNoKHNldFByb3AuYmluZCh1bmRlZmluZWQsIHByb3RvdHlwZSkpO1xuXHQgICAgfSBjYXRjaCAoZXJyb3IpIHtcblx0ICAgICAgLy8gT2JqZWN0LmRlZmluZVByb3BlcnR5IGZhaWxlZC4gUHJvYmFibHkgSUU4LlxuXHQgICAgfVxuXHQgIH1cblxuXHQgIGZ1bmN0aW9uIHNldFByb3AocHJvdG90eXBlLCBuYW1lKSB7XG5cdCAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG90eXBlLCBuYW1lLCB7XG5cdCAgICAgIGdldDogZnVuY3Rpb24oKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KG5hbWUpO1xuXHQgICAgICB9LFxuXHQgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdCAgICAgICAgaW52YXJpYW50KHRoaXMuX19vd25lcklELCAnQ2Fubm90IHNldCBvbiBhbiBpbW11dGFibGUgcmVjb3JkLicpO1xuXHQgICAgICAgIHRoaXMuc2V0KG5hbWUsIHZhbHVlKTtcblx0ICAgICAgfVxuXHQgICAgfSk7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gZGVlcEVxdWFsKGEsIGIpIHtcblx0ICAgIGlmIChhID09PSBiKSB7XG5cdCAgICAgIHJldHVybiB0cnVlO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoXG5cdCAgICAgICFpc0l0ZXJhYmxlKGIpIHx8XG5cdCAgICAgIGEuc2l6ZSAhPT0gdW5kZWZpbmVkICYmIGIuc2l6ZSAhPT0gdW5kZWZpbmVkICYmIGEuc2l6ZSAhPT0gYi5zaXplIHx8XG5cdCAgICAgIGEuX19oYXNoICE9PSB1bmRlZmluZWQgJiYgYi5fX2hhc2ggIT09IHVuZGVmaW5lZCAmJiBhLl9faGFzaCAhPT0gYi5fX2hhc2ggfHxcblx0ICAgICAgaXNLZXllZChhKSAhPT0gaXNLZXllZChiKSB8fFxuXHQgICAgICBpc0luZGV4ZWQoYSkgIT09IGlzSW5kZXhlZChiKSB8fFxuXHQgICAgICBpc09yZGVyZWQoYSkgIT09IGlzT3JkZXJlZChiKVxuXHQgICAgKSB7XG5cdCAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgIH1cblxuXHQgICAgaWYgKGEuc2l6ZSA9PT0gMCAmJiBiLnNpemUgPT09IDApIHtcblx0ICAgICAgcmV0dXJuIHRydWU7XG5cdCAgICB9XG5cblx0ICAgIHZhciBub3RBc3NvY2lhdGl2ZSA9ICFpc0Fzc29jaWF0aXZlKGEpO1xuXG5cdCAgICBpZiAoaXNPcmRlcmVkKGEpKSB7XG5cdCAgICAgIHZhciBlbnRyaWVzID0gYS5lbnRyaWVzKCk7XG5cdCAgICAgIHJldHVybiBiLmV2ZXJ5KGZ1bmN0aW9uKHYsIGspICB7XG5cdCAgICAgICAgdmFyIGVudHJ5ID0gZW50cmllcy5uZXh0KCkudmFsdWU7XG5cdCAgICAgICAgcmV0dXJuIGVudHJ5ICYmIGlzKGVudHJ5WzFdLCB2KSAmJiAobm90QXNzb2NpYXRpdmUgfHwgaXMoZW50cnlbMF0sIGspKTtcblx0ICAgICAgfSkgJiYgZW50cmllcy5uZXh0KCkuZG9uZTtcblx0ICAgIH1cblxuXHQgICAgdmFyIGZsaXBwZWQgPSBmYWxzZTtcblxuXHQgICAgaWYgKGEuc2l6ZSA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgIGlmIChiLnNpemUgPT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgIGlmICh0eXBlb2YgYS5jYWNoZVJlc3VsdCA9PT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICAgICAgYS5jYWNoZVJlc3VsdCgpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBmbGlwcGVkID0gdHJ1ZTtcblx0ICAgICAgICB2YXIgXyA9IGE7XG5cdCAgICAgICAgYSA9IGI7XG5cdCAgICAgICAgYiA9IF87XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgdmFyIGFsbEVxdWFsID0gdHJ1ZTtcblx0ICAgIHZhciBiU2l6ZSA9IGIuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGspICB7XG5cdCAgICAgIGlmIChub3RBc3NvY2lhdGl2ZSA/ICFhLmhhcyh2KSA6XG5cdCAgICAgICAgICBmbGlwcGVkID8gIWlzKHYsIGEuZ2V0KGssIE5PVF9TRVQpKSA6ICFpcyhhLmdldChrLCBOT1RfU0VUKSwgdikpIHtcblx0ICAgICAgICBhbGxFcXVhbCA9IGZhbHNlO1xuXHQgICAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgICAgfVxuXHQgICAgfSk7XG5cblx0ICAgIHJldHVybiBhbGxFcXVhbCAmJiBhLnNpemUgPT09IGJTaXplO1xuXHQgIH1cblxuXHQgIGNyZWF0ZUNsYXNzKFJhbmdlLCBJbmRleGVkU2VxKTtcblxuXHQgICAgZnVuY3Rpb24gUmFuZ2Uoc3RhcnQsIGVuZCwgc3RlcCkge1xuXHQgICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUmFuZ2UpKSB7XG5cdCAgICAgICAgcmV0dXJuIG5ldyBSYW5nZShzdGFydCwgZW5kLCBzdGVwKTtcblx0ICAgICAgfVxuXHQgICAgICBpbnZhcmlhbnQoc3RlcCAhPT0gMCwgJ0Nhbm5vdCBzdGVwIGEgUmFuZ2UgYnkgMCcpO1xuXHQgICAgICBzdGFydCA9IHN0YXJ0IHx8IDA7XG5cdCAgICAgIGlmIChlbmQgPT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgIGVuZCA9IEluZmluaXR5O1xuXHQgICAgICB9XG5cdCAgICAgIHN0ZXAgPSBzdGVwID09PSB1bmRlZmluZWQgPyAxIDogTWF0aC5hYnMoc3RlcCk7XG5cdCAgICAgIGlmIChlbmQgPCBzdGFydCkge1xuXHQgICAgICAgIHN0ZXAgPSAtc3RlcDtcblx0ICAgICAgfVxuXHQgICAgICB0aGlzLl9zdGFydCA9IHN0YXJ0O1xuXHQgICAgICB0aGlzLl9lbmQgPSBlbmQ7XG5cdCAgICAgIHRoaXMuX3N0ZXAgPSBzdGVwO1xuXHQgICAgICB0aGlzLnNpemUgPSBNYXRoLm1heCgwLCBNYXRoLmNlaWwoKGVuZCAtIHN0YXJ0KSAvIHN0ZXAgLSAxKSArIDEpO1xuXHQgICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG5cdCAgICAgICAgaWYgKEVNUFRZX1JBTkdFKSB7XG5cdCAgICAgICAgICByZXR1cm4gRU1QVFlfUkFOR0U7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIEVNUFRZX1JBTkdFID0gdGhpcztcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBSYW5nZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcblx0ICAgICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCkge1xuXHQgICAgICAgIHJldHVybiAnUmFuZ2UgW10nO1xuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiAnUmFuZ2UgWyAnICtcblx0ICAgICAgICB0aGlzLl9zdGFydCArICcuLi4nICsgdGhpcy5fZW5kICtcblx0ICAgICAgICAodGhpcy5fc3RlcCA+IDEgPyAnIGJ5ICcgKyB0aGlzLl9zdGVwIDogJycpICtcblx0ICAgICAgJyBdJztcblx0ICAgIH07XG5cblx0ICAgIFJhbmdlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihpbmRleCwgbm90U2V0VmFsdWUpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuaGFzKGluZGV4KSA/XG5cdCAgICAgICAgdGhpcy5fc3RhcnQgKyB3cmFwSW5kZXgodGhpcywgaW5kZXgpICogdGhpcy5fc3RlcCA6XG5cdCAgICAgICAgbm90U2V0VmFsdWU7XG5cdCAgICB9O1xuXG5cdCAgICBSYW5nZS5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbihzZWFyY2hWYWx1ZSkge1xuXHQgICAgICB2YXIgcG9zc2libGVJbmRleCA9IChzZWFyY2hWYWx1ZSAtIHRoaXMuX3N0YXJ0KSAvIHRoaXMuX3N0ZXA7XG5cdCAgICAgIHJldHVybiBwb3NzaWJsZUluZGV4ID49IDAgJiZcblx0ICAgICAgICBwb3NzaWJsZUluZGV4IDwgdGhpcy5zaXplICYmXG5cdCAgICAgICAgcG9zc2libGVJbmRleCA9PT0gTWF0aC5mbG9vcihwb3NzaWJsZUluZGV4KTtcblx0ICAgIH07XG5cblx0ICAgIFJhbmdlLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uKGJlZ2luLCBlbmQpIHtcblx0ICAgICAgaWYgKHdob2xlU2xpY2UoYmVnaW4sIGVuZCwgdGhpcy5zaXplKSkge1xuXHQgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICB9XG5cdCAgICAgIGJlZ2luID0gcmVzb2x2ZUJlZ2luKGJlZ2luLCB0aGlzLnNpemUpO1xuXHQgICAgICBlbmQgPSByZXNvbHZlRW5kKGVuZCwgdGhpcy5zaXplKTtcblx0ICAgICAgaWYgKGVuZCA8PSBiZWdpbikge1xuXHQgICAgICAgIHJldHVybiBuZXcgUmFuZ2UoMCwgMCk7XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIG5ldyBSYW5nZSh0aGlzLmdldChiZWdpbiwgdGhpcy5fZW5kKSwgdGhpcy5nZXQoZW5kLCB0aGlzLl9lbmQpLCB0aGlzLl9zdGVwKTtcblx0ICAgIH07XG5cblx0ICAgIFJhbmdlLnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24oc2VhcmNoVmFsdWUpIHtcblx0ICAgICAgdmFyIG9mZnNldFZhbHVlID0gc2VhcmNoVmFsdWUgLSB0aGlzLl9zdGFydDtcblx0ICAgICAgaWYgKG9mZnNldFZhbHVlICUgdGhpcy5fc3RlcCA9PT0gMCkge1xuXHQgICAgICAgIHZhciBpbmRleCA9IG9mZnNldFZhbHVlIC8gdGhpcy5fc3RlcDtcblx0ICAgICAgICBpZiAoaW5kZXggPj0gMCAmJiBpbmRleCA8IHRoaXMuc2l6ZSkge1xuXHQgICAgICAgICAgcmV0dXJuIGluZGV4XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiAtMTtcblx0ICAgIH07XG5cblx0ICAgIFJhbmdlLnByb3RvdHlwZS5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uKHNlYXJjaFZhbHVlKSB7XG5cdCAgICAgIHJldHVybiB0aGlzLmluZGV4T2Yoc2VhcmNoVmFsdWUpO1xuXHQgICAgfTtcblxuXHQgICAgUmFuZ2UucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7XG5cdCAgICAgIHZhciBtYXhJbmRleCA9IHRoaXMuc2l6ZSAtIDE7XG5cdCAgICAgIHZhciBzdGVwID0gdGhpcy5fc3RlcDtcblx0ICAgICAgdmFyIHZhbHVlID0gcmV2ZXJzZSA/IHRoaXMuX3N0YXJ0ICsgbWF4SW5kZXggKiBzdGVwIDogdGhpcy5fc3RhcnQ7XG5cdCAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPD0gbWF4SW5kZXg7IGlpKyspIHtcblx0ICAgICAgICBpZiAoZm4odmFsdWUsIGlpLCB0aGlzKSA9PT0gZmFsc2UpIHtcblx0ICAgICAgICAgIHJldHVybiBpaSArIDE7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIHZhbHVlICs9IHJldmVyc2UgPyAtc3RlcCA6IHN0ZXA7XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIGlpO1xuXHQgICAgfTtcblxuXHQgICAgUmFuZ2UucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG5cdCAgICAgIHZhciBtYXhJbmRleCA9IHRoaXMuc2l6ZSAtIDE7XG5cdCAgICAgIHZhciBzdGVwID0gdGhpcy5fc3RlcDtcblx0ICAgICAgdmFyIHZhbHVlID0gcmV2ZXJzZSA/IHRoaXMuX3N0YXJ0ICsgbWF4SW5kZXggKiBzdGVwIDogdGhpcy5fc3RhcnQ7XG5cdCAgICAgIHZhciBpaSA9IDA7XG5cdCAgICAgIHJldHVybiBuZXcgc3JjX0l0ZXJhdG9yX19JdGVyYXRvcihmdW5jdGlvbigpICB7XG5cdCAgICAgICAgdmFyIHYgPSB2YWx1ZTtcblx0ICAgICAgICB2YWx1ZSArPSByZXZlcnNlID8gLXN0ZXAgOiBzdGVwO1xuXHQgICAgICAgIHJldHVybiBpaSA+IG1heEluZGV4ID8gaXRlcmF0b3JEb25lKCkgOiBpdGVyYXRvclZhbHVlKHR5cGUsIGlpKyssIHYpO1xuXHQgICAgICB9KTtcblx0ICAgIH07XG5cblx0ICAgIFJhbmdlLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbihvdGhlcikge1xuXHQgICAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBSYW5nZSA/XG5cdCAgICAgICAgdGhpcy5fc3RhcnQgPT09IG90aGVyLl9zdGFydCAmJlxuXHQgICAgICAgIHRoaXMuX2VuZCA9PT0gb3RoZXIuX2VuZCAmJlxuXHQgICAgICAgIHRoaXMuX3N0ZXAgPT09IG90aGVyLl9zdGVwIDpcblx0ICAgICAgICBkZWVwRXF1YWwodGhpcywgb3RoZXIpO1xuXHQgICAgfTtcblxuXG5cdCAgdmFyIEVNUFRZX1JBTkdFO1xuXG5cdCAgY3JlYXRlQ2xhc3MoUmVwZWF0LCBJbmRleGVkU2VxKTtcblxuXHQgICAgZnVuY3Rpb24gUmVwZWF0KHZhbHVlLCB0aW1lcykge1xuXHQgICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUmVwZWF0KSkge1xuXHQgICAgICAgIHJldHVybiBuZXcgUmVwZWF0KHZhbHVlLCB0aW1lcyk7XG5cdCAgICAgIH1cblx0ICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcblx0ICAgICAgdGhpcy5zaXplID0gdGltZXMgPT09IHVuZGVmaW5lZCA/IEluZmluaXR5IDogTWF0aC5tYXgoMCwgdGltZXMpO1xuXHQgICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG5cdCAgICAgICAgaWYgKEVNUFRZX1JFUEVBVCkge1xuXHQgICAgICAgICAgcmV0dXJuIEVNUFRZX1JFUEVBVDtcblx0ICAgICAgICB9XG5cdCAgICAgICAgRU1QVFlfUkVQRUFUID0gdGhpcztcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBSZXBlYXQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG5cdCAgICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcblx0ICAgICAgICByZXR1cm4gJ1JlcGVhdCBbXSc7XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuICdSZXBlYXQgWyAnICsgdGhpcy5fdmFsdWUgKyAnICcgKyB0aGlzLnNpemUgKyAnIHRpbWVzIF0nO1xuXHQgICAgfTtcblxuXHQgICAgUmVwZWF0LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihpbmRleCwgbm90U2V0VmFsdWUpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuaGFzKGluZGV4KSA/IHRoaXMuX3ZhbHVlIDogbm90U2V0VmFsdWU7XG5cdCAgICB9O1xuXG5cdCAgICBSZXBlYXQucHJvdG90eXBlLmluY2x1ZGVzID0gZnVuY3Rpb24oc2VhcmNoVmFsdWUpIHtcblx0ICAgICAgcmV0dXJuIGlzKHRoaXMuX3ZhbHVlLCBzZWFyY2hWYWx1ZSk7XG5cdCAgICB9O1xuXG5cdCAgICBSZXBlYXQucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24oYmVnaW4sIGVuZCkge1xuXHQgICAgICB2YXIgc2l6ZSA9IHRoaXMuc2l6ZTtcblx0ICAgICAgcmV0dXJuIHdob2xlU2xpY2UoYmVnaW4sIGVuZCwgc2l6ZSkgPyB0aGlzIDpcblx0ICAgICAgICBuZXcgUmVwZWF0KHRoaXMuX3ZhbHVlLCByZXNvbHZlRW5kKGVuZCwgc2l6ZSkgLSByZXNvbHZlQmVnaW4oYmVnaW4sIHNpemUpKTtcblx0ICAgIH07XG5cblx0ICAgIFJlcGVhdC5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uKCkge1xuXHQgICAgICByZXR1cm4gdGhpcztcblx0ICAgIH07XG5cblx0ICAgIFJlcGVhdC5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uKHNlYXJjaFZhbHVlKSB7XG5cdCAgICAgIGlmIChpcyh0aGlzLl92YWx1ZSwgc2VhcmNoVmFsdWUpKSB7XG5cdCAgICAgICAgcmV0dXJuIDA7XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIC0xO1xuXHQgICAgfTtcblxuXHQgICAgUmVwZWF0LnByb3RvdHlwZS5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uKHNlYXJjaFZhbHVlKSB7XG5cdCAgICAgIGlmIChpcyh0aGlzLl92YWx1ZSwgc2VhcmNoVmFsdWUpKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMuc2l6ZTtcblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gLTE7XG5cdCAgICB9O1xuXG5cdCAgICBSZXBlYXQucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7XG5cdCAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCB0aGlzLnNpemU7IGlpKyspIHtcblx0ICAgICAgICBpZiAoZm4odGhpcy5fdmFsdWUsIGlpLCB0aGlzKSA9PT0gZmFsc2UpIHtcblx0ICAgICAgICAgIHJldHVybiBpaSArIDE7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICAgIHJldHVybiBpaTtcblx0ICAgIH07XG5cblx0ICAgIFJlcGVhdC5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcblx0ICAgICAgdmFyIGlpID0gMDtcblx0ICAgICAgcmV0dXJuIG5ldyBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yKGZ1bmN0aW9uKCkgXG5cdCAgICAgICAge3JldHVybiBpaSA8IHRoaXMkMC5zaXplID8gaXRlcmF0b3JWYWx1ZSh0eXBlLCBpaSsrLCB0aGlzJDAuX3ZhbHVlKSA6IGl0ZXJhdG9yRG9uZSgpfVxuXHQgICAgICApO1xuXHQgICAgfTtcblxuXHQgICAgUmVwZWF0LnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbihvdGhlcikge1xuXHQgICAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBSZXBlYXQgP1xuXHQgICAgICAgIGlzKHRoaXMuX3ZhbHVlLCBvdGhlci5fdmFsdWUpIDpcblx0ICAgICAgICBkZWVwRXF1YWwob3RoZXIpO1xuXHQgICAgfTtcblxuXG5cdCAgdmFyIEVNUFRZX1JFUEVBVDtcblxuXHQgIC8qKlxuXHQgICAqIENvbnRyaWJ1dGVzIGFkZGl0aW9uYWwgbWV0aG9kcyB0byBhIGNvbnN0cnVjdG9yXG5cdCAgICovXG5cdCAgZnVuY3Rpb24gbWl4aW4oY3RvciwgbWV0aG9kcykge1xuXHQgICAgdmFyIGtleUNvcGllciA9IGZ1bmN0aW9uKGtleSApIHsgY3Rvci5wcm90b3R5cGVba2V5XSA9IG1ldGhvZHNba2V5XTsgfTtcblx0ICAgIE9iamVjdC5rZXlzKG1ldGhvZHMpLmZvckVhY2goa2V5Q29waWVyKTtcblx0ICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgJiZcblx0ICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhtZXRob2RzKS5mb3JFYWNoKGtleUNvcGllcik7XG5cdCAgICByZXR1cm4gY3Rvcjtcblx0ICB9XG5cblx0ICBJdGVyYWJsZS5JdGVyYXRvciA9IHNyY19JdGVyYXRvcl9fSXRlcmF0b3I7XG5cblx0ICBtaXhpbihJdGVyYWJsZSwge1xuXG5cdCAgICAvLyAjIyMgQ29udmVyc2lvbiB0byBvdGhlciB0eXBlc1xuXG5cdCAgICB0b0FycmF5OiBmdW5jdGlvbigpIHtcblx0ICAgICAgYXNzZXJ0Tm90SW5maW5pdGUodGhpcy5zaXplKTtcblx0ICAgICAgdmFyIGFycmF5ID0gbmV3IEFycmF5KHRoaXMuc2l6ZSB8fCAwKTtcblx0ICAgICAgdGhpcy52YWx1ZVNlcSgpLl9faXRlcmF0ZShmdW5jdGlvbih2LCBpKSAgeyBhcnJheVtpXSA9IHY7IH0pO1xuXHQgICAgICByZXR1cm4gYXJyYXk7XG5cdCAgICB9LFxuXG5cdCAgICB0b0luZGV4ZWRTZXE6IGZ1bmN0aW9uKCkge1xuXHQgICAgICByZXR1cm4gbmV3IFRvSW5kZXhlZFNlcXVlbmNlKHRoaXMpO1xuXHQgICAgfSxcblxuXHQgICAgdG9KUzogZnVuY3Rpb24oKSB7XG5cdCAgICAgIHJldHVybiB0aGlzLnRvU2VxKCkubWFwKFxuXHQgICAgICAgIGZ1bmN0aW9uKHZhbHVlICkge3JldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudG9KUyA9PT0gJ2Z1bmN0aW9uJyA/IHZhbHVlLnRvSlMoKSA6IHZhbHVlfVxuXHQgICAgICApLl9fdG9KUygpO1xuXHQgICAgfSxcblxuXHQgICAgdG9KU09OOiBmdW5jdGlvbigpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMudG9TZXEoKS5tYXAoXG5cdCAgICAgICAgZnVuY3Rpb24odmFsdWUgKSB7cmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS50b0pTT04gPT09ICdmdW5jdGlvbicgPyB2YWx1ZS50b0pTT04oKSA6IHZhbHVlfVxuXHQgICAgICApLl9fdG9KUygpO1xuXHQgICAgfSxcblxuXHQgICAgdG9LZXllZFNlcTogZnVuY3Rpb24oKSB7XG5cdCAgICAgIHJldHVybiBuZXcgVG9LZXllZFNlcXVlbmNlKHRoaXMsIHRydWUpO1xuXHQgICAgfSxcblxuXHQgICAgdG9NYXA6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAvLyBVc2UgTGF0ZSBCaW5kaW5nIGhlcmUgdG8gc29sdmUgdGhlIGNpcmN1bGFyIGRlcGVuZGVuY3kuXG5cdCAgICAgIHJldHVybiBzcmNfTWFwX19NYXAodGhpcy50b0tleWVkU2VxKCkpO1xuXHQgICAgfSxcblxuXHQgICAgdG9PYmplY3Q6IGZ1bmN0aW9uKCkge1xuXHQgICAgICBhc3NlcnROb3RJbmZpbml0ZSh0aGlzLnNpemUpO1xuXHQgICAgICB2YXIgb2JqZWN0ID0ge307XG5cdCAgICAgIHRoaXMuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGspICB7IG9iamVjdFtrXSA9IHY7IH0pO1xuXHQgICAgICByZXR1cm4gb2JqZWN0O1xuXHQgICAgfSxcblxuXHQgICAgdG9PcmRlcmVkTWFwOiBmdW5jdGlvbigpIHtcblx0ICAgICAgLy8gVXNlIExhdGUgQmluZGluZyBoZXJlIHRvIHNvbHZlIHRoZSBjaXJjdWxhciBkZXBlbmRlbmN5LlxuXHQgICAgICByZXR1cm4gT3JkZXJlZE1hcCh0aGlzLnRvS2V5ZWRTZXEoKSk7XG5cdCAgICB9LFxuXG5cdCAgICB0b09yZGVyZWRTZXQ6IGZ1bmN0aW9uKCkge1xuXHQgICAgICAvLyBVc2UgTGF0ZSBCaW5kaW5nIGhlcmUgdG8gc29sdmUgdGhlIGNpcmN1bGFyIGRlcGVuZGVuY3kuXG5cdCAgICAgIHJldHVybiBPcmRlcmVkU2V0KGlzS2V5ZWQodGhpcykgPyB0aGlzLnZhbHVlU2VxKCkgOiB0aGlzKTtcblx0ICAgIH0sXG5cblx0ICAgIHRvU2V0OiBmdW5jdGlvbigpIHtcblx0ICAgICAgLy8gVXNlIExhdGUgQmluZGluZyBoZXJlIHRvIHNvbHZlIHRoZSBjaXJjdWxhciBkZXBlbmRlbmN5LlxuXHQgICAgICByZXR1cm4gc3JjX1NldF9fU2V0KGlzS2V5ZWQodGhpcykgPyB0aGlzLnZhbHVlU2VxKCkgOiB0aGlzKTtcblx0ICAgIH0sXG5cblx0ICAgIHRvU2V0U2VxOiBmdW5jdGlvbigpIHtcblx0ICAgICAgcmV0dXJuIG5ldyBUb1NldFNlcXVlbmNlKHRoaXMpO1xuXHQgICAgfSxcblxuXHQgICAgdG9TZXE6IGZ1bmN0aW9uKCkge1xuXHQgICAgICByZXR1cm4gaXNJbmRleGVkKHRoaXMpID8gdGhpcy50b0luZGV4ZWRTZXEoKSA6XG5cdCAgICAgICAgaXNLZXllZCh0aGlzKSA/IHRoaXMudG9LZXllZFNlcSgpIDpcblx0ICAgICAgICB0aGlzLnRvU2V0U2VxKCk7XG5cdCAgICB9LFxuXG5cdCAgICB0b1N0YWNrOiBmdW5jdGlvbigpIHtcblx0ICAgICAgLy8gVXNlIExhdGUgQmluZGluZyBoZXJlIHRvIHNvbHZlIHRoZSBjaXJjdWxhciBkZXBlbmRlbmN5LlxuXHQgICAgICByZXR1cm4gU3RhY2soaXNLZXllZCh0aGlzKSA/IHRoaXMudmFsdWVTZXEoKSA6IHRoaXMpO1xuXHQgICAgfSxcblxuXHQgICAgdG9MaXN0OiBmdW5jdGlvbigpIHtcblx0ICAgICAgLy8gVXNlIExhdGUgQmluZGluZyBoZXJlIHRvIHNvbHZlIHRoZSBjaXJjdWxhciBkZXBlbmRlbmN5LlxuXHQgICAgICByZXR1cm4gTGlzdChpc0tleWVkKHRoaXMpID8gdGhpcy52YWx1ZVNlcSgpIDogdGhpcyk7XG5cdCAgICB9LFxuXG5cblx0ICAgIC8vICMjIyBDb21tb24gSmF2YVNjcmlwdCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzXG5cblx0ICAgIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcblx0ICAgICAgcmV0dXJuICdbSXRlcmFibGVdJztcblx0ICAgIH0sXG5cblx0ICAgIF9fdG9TdHJpbmc6IGZ1bmN0aW9uKGhlYWQsIHRhaWwpIHtcblx0ICAgICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCkge1xuXHQgICAgICAgIHJldHVybiBoZWFkICsgdGFpbDtcblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gaGVhZCArICcgJyArIHRoaXMudG9TZXEoKS5tYXAodGhpcy5fX3RvU3RyaW5nTWFwcGVyKS5qb2luKCcsICcpICsgJyAnICsgdGFpbDtcblx0ICAgIH0sXG5cblxuXHQgICAgLy8gIyMjIEVTNiBDb2xsZWN0aW9uIG1ldGhvZHMgKEVTNiBBcnJheSBhbmQgTWFwKVxuXG5cdCAgICBjb25jYXQ6IGZ1bmN0aW9uKCkge3ZhciB2YWx1ZXMgPSBTTElDRSQwLmNhbGwoYXJndW1lbnRzLCAwKTtcblx0ICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIGNvbmNhdEZhY3RvcnkodGhpcywgdmFsdWVzKSk7XG5cdCAgICB9LFxuXG5cdCAgICBjb250YWluczogZnVuY3Rpb24oc2VhcmNoVmFsdWUpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuaW5jbHVkZXMoc2VhcmNoVmFsdWUpO1xuXHQgICAgfSxcblxuXHQgICAgaW5jbHVkZXM6IGZ1bmN0aW9uKHNlYXJjaFZhbHVlKSB7XG5cdCAgICAgIHJldHVybiB0aGlzLnNvbWUoZnVuY3Rpb24odmFsdWUgKSB7cmV0dXJuIGlzKHZhbHVlLCBzZWFyY2hWYWx1ZSl9KTtcblx0ICAgIH0sXG5cblx0ICAgIGVudHJpZXM6IGZ1bmN0aW9uKCkge1xuXHQgICAgICByZXR1cm4gdGhpcy5fX2l0ZXJhdG9yKElURVJBVEVfRU5UUklFUyk7XG5cdCAgICB9LFxuXG5cdCAgICBldmVyeTogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0KSB7XG5cdCAgICAgIGFzc2VydE5vdEluZmluaXRlKHRoaXMuc2l6ZSk7XG5cdCAgICAgIHZhciByZXR1cm5WYWx1ZSA9IHRydWU7XG5cdCAgICAgIHRoaXMuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGssIGMpICB7XG5cdCAgICAgICAgaWYgKCFwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrLCBjKSkge1xuXHQgICAgICAgICAgcmV0dXJuVmFsdWUgPSBmYWxzZTtcblx0ICAgICAgICAgIHJldHVybiBmYWxzZTtcblx0ICAgICAgICB9XG5cdCAgICAgIH0pO1xuXHQgICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG5cdCAgICB9LFxuXG5cdCAgICBmaWx0ZXI6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCkge1xuXHQgICAgICByZXR1cm4gcmVpZnkodGhpcywgZmlsdGVyRmFjdG9yeSh0aGlzLCBwcmVkaWNhdGUsIGNvbnRleHQsIHRydWUpKTtcblx0ICAgIH0sXG5cblx0ICAgIGZpbmQ6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCwgbm90U2V0VmFsdWUpIHtcblx0ICAgICAgdmFyIGVudHJ5ID0gdGhpcy5maW5kRW50cnkocHJlZGljYXRlLCBjb250ZXh0KTtcblx0ICAgICAgcmV0dXJuIGVudHJ5ID8gZW50cnlbMV0gOiBub3RTZXRWYWx1ZTtcblx0ICAgIH0sXG5cblx0ICAgIGZpbmRFbnRyeTogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0KSB7XG5cdCAgICAgIHZhciBmb3VuZDtcblx0ICAgICAgdGhpcy5fX2l0ZXJhdGUoZnVuY3Rpb24odiwgaywgYykgIHtcblx0ICAgICAgICBpZiAocHJlZGljYXRlLmNhbGwoY29udGV4dCwgdiwgaywgYykpIHtcblx0ICAgICAgICAgIGZvdW5kID0gW2ssIHZdO1xuXHQgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSk7XG5cdCAgICAgIHJldHVybiBmb3VuZDtcblx0ICAgIH0sXG5cblx0ICAgIGZpbmRMYXN0RW50cnk6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCkge1xuXHQgICAgICByZXR1cm4gdGhpcy50b1NlcSgpLnJldmVyc2UoKS5maW5kRW50cnkocHJlZGljYXRlLCBjb250ZXh0KTtcblx0ICAgIH0sXG5cblx0ICAgIGZvckVhY2g6IGZ1bmN0aW9uKHNpZGVFZmZlY3QsIGNvbnRleHQpIHtcblx0ICAgICAgYXNzZXJ0Tm90SW5maW5pdGUodGhpcy5zaXplKTtcblx0ICAgICAgcmV0dXJuIHRoaXMuX19pdGVyYXRlKGNvbnRleHQgPyBzaWRlRWZmZWN0LmJpbmQoY29udGV4dCkgOiBzaWRlRWZmZWN0KTtcblx0ICAgIH0sXG5cblx0ICAgIGpvaW46IGZ1bmN0aW9uKHNlcGFyYXRvcikge1xuXHQgICAgICBhc3NlcnROb3RJbmZpbml0ZSh0aGlzLnNpemUpO1xuXHQgICAgICBzZXBhcmF0b3IgPSBzZXBhcmF0b3IgIT09IHVuZGVmaW5lZCA/ICcnICsgc2VwYXJhdG9yIDogJywnO1xuXHQgICAgICB2YXIgam9pbmVkID0gJyc7XG5cdCAgICAgIHZhciBpc0ZpcnN0ID0gdHJ1ZTtcblx0ICAgICAgdGhpcy5fX2l0ZXJhdGUoZnVuY3Rpb24odiApIHtcblx0ICAgICAgICBpc0ZpcnN0ID8gKGlzRmlyc3QgPSBmYWxzZSkgOiAoam9pbmVkICs9IHNlcGFyYXRvcik7XG5cdCAgICAgICAgam9pbmVkICs9IHYgIT09IG51bGwgJiYgdiAhPT0gdW5kZWZpbmVkID8gdi50b1N0cmluZygpIDogJyc7XG5cdCAgICAgIH0pO1xuXHQgICAgICByZXR1cm4gam9pbmVkO1xuXHQgICAgfSxcblxuXHQgICAga2V5czogZnVuY3Rpb24oKSB7XG5cdCAgICAgIHJldHVybiB0aGlzLl9faXRlcmF0b3IoSVRFUkFURV9LRVlTKTtcblx0ICAgIH0sXG5cblx0ICAgIG1hcDogZnVuY3Rpb24obWFwcGVyLCBjb250ZXh0KSB7XG5cdCAgICAgIHJldHVybiByZWlmeSh0aGlzLCBtYXBGYWN0b3J5KHRoaXMsIG1hcHBlciwgY29udGV4dCkpO1xuXHQgICAgfSxcblxuXHQgICAgcmVkdWNlOiBmdW5jdGlvbihyZWR1Y2VyLCBpbml0aWFsUmVkdWN0aW9uLCBjb250ZXh0KSB7XG5cdCAgICAgIGFzc2VydE5vdEluZmluaXRlKHRoaXMuc2l6ZSk7XG5cdCAgICAgIHZhciByZWR1Y3Rpb247XG5cdCAgICAgIHZhciB1c2VGaXJzdDtcblx0ICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG5cdCAgICAgICAgdXNlRmlyc3QgPSB0cnVlO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHJlZHVjdGlvbiA9IGluaXRpYWxSZWR1Y3Rpb247XG5cdCAgICAgIH1cblx0ICAgICAgdGhpcy5fX2l0ZXJhdGUoZnVuY3Rpb24odiwgaywgYykgIHtcblx0ICAgICAgICBpZiAodXNlRmlyc3QpIHtcblx0ICAgICAgICAgIHVzZUZpcnN0ID0gZmFsc2U7XG5cdCAgICAgICAgICByZWR1Y3Rpb24gPSB2O1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICByZWR1Y3Rpb24gPSByZWR1Y2VyLmNhbGwoY29udGV4dCwgcmVkdWN0aW9uLCB2LCBrLCBjKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH0pO1xuXHQgICAgICByZXR1cm4gcmVkdWN0aW9uO1xuXHQgICAgfSxcblxuXHQgICAgcmVkdWNlUmlnaHQ6IGZ1bmN0aW9uKHJlZHVjZXIsIGluaXRpYWxSZWR1Y3Rpb24sIGNvbnRleHQpIHtcblx0ICAgICAgdmFyIHJldmVyc2VkID0gdGhpcy50b0tleWVkU2VxKCkucmV2ZXJzZSgpO1xuXHQgICAgICByZXR1cm4gcmV2ZXJzZWQucmVkdWNlLmFwcGx5KHJldmVyc2VkLCBhcmd1bWVudHMpO1xuXHQgICAgfSxcblxuXHQgICAgcmV2ZXJzZTogZnVuY3Rpb24oKSB7XG5cdCAgICAgIHJldHVybiByZWlmeSh0aGlzLCByZXZlcnNlRmFjdG9yeSh0aGlzLCB0cnVlKSk7XG5cdCAgICB9LFxuXG5cdCAgICBzbGljZTogZnVuY3Rpb24oYmVnaW4sIGVuZCkge1xuXHQgICAgICByZXR1cm4gcmVpZnkodGhpcywgc2xpY2VGYWN0b3J5KHRoaXMsIGJlZ2luLCBlbmQsIHRydWUpKTtcblx0ICAgIH0sXG5cblx0ICAgIHNvbWU6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCkge1xuXHQgICAgICByZXR1cm4gIXRoaXMuZXZlcnkobm90KHByZWRpY2F0ZSksIGNvbnRleHQpO1xuXHQgICAgfSxcblxuXHQgICAgc29ydDogZnVuY3Rpb24oY29tcGFyYXRvcikge1xuXHQgICAgICByZXR1cm4gcmVpZnkodGhpcywgc29ydEZhY3RvcnkodGhpcywgY29tcGFyYXRvcikpO1xuXHQgICAgfSxcblxuXHQgICAgdmFsdWVzOiBmdW5jdGlvbigpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuX19pdGVyYXRvcihJVEVSQVRFX1ZBTFVFUyk7XG5cdCAgICB9LFxuXG5cblx0ICAgIC8vICMjIyBNb3JlIHNlcXVlbnRpYWwgbWV0aG9kc1xuXG5cdCAgICBidXRMYXN0OiBmdW5jdGlvbigpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuc2xpY2UoMCwgLTEpO1xuXHQgICAgfSxcblxuXHQgICAgaXNFbXB0eTogZnVuY3Rpb24oKSB7XG5cdCAgICAgIHJldHVybiB0aGlzLnNpemUgIT09IHVuZGVmaW5lZCA/IHRoaXMuc2l6ZSA9PT0gMCA6ICF0aGlzLnNvbWUoZnVuY3Rpb24oKSAge3JldHVybiB0cnVlfSk7XG5cdCAgICB9LFxuXG5cdCAgICBjb3VudDogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0KSB7XG5cdCAgICAgIHJldHVybiBlbnN1cmVTaXplKFxuXHQgICAgICAgIHByZWRpY2F0ZSA/IHRoaXMudG9TZXEoKS5maWx0ZXIocHJlZGljYXRlLCBjb250ZXh0KSA6IHRoaXNcblx0ICAgICAgKTtcblx0ICAgIH0sXG5cblx0ICAgIGNvdW50Qnk6IGZ1bmN0aW9uKGdyb3VwZXIsIGNvbnRleHQpIHtcblx0ICAgICAgcmV0dXJuIGNvdW50QnlGYWN0b3J5KHRoaXMsIGdyb3VwZXIsIGNvbnRleHQpO1xuXHQgICAgfSxcblxuXHQgICAgZXF1YWxzOiBmdW5jdGlvbihvdGhlcikge1xuXHQgICAgICByZXR1cm4gZGVlcEVxdWFsKHRoaXMsIG90aGVyKTtcblx0ICAgIH0sXG5cblx0ICAgIGVudHJ5U2VxOiBmdW5jdGlvbigpIHtcblx0ICAgICAgdmFyIGl0ZXJhYmxlID0gdGhpcztcblx0ICAgICAgaWYgKGl0ZXJhYmxlLl9jYWNoZSkge1xuXHQgICAgICAgIC8vIFdlIGNhY2hlIGFzIGFuIGVudHJpZXMgYXJyYXksIHNvIHdlIGNhbiBqdXN0IHJldHVybiB0aGUgY2FjaGUhXG5cdCAgICAgICAgcmV0dXJuIG5ldyBBcnJheVNlcShpdGVyYWJsZS5fY2FjaGUpO1xuXHQgICAgICB9XG5cdCAgICAgIHZhciBlbnRyaWVzU2VxdWVuY2UgPSBpdGVyYWJsZS50b1NlcSgpLm1hcChlbnRyeU1hcHBlcikudG9JbmRleGVkU2VxKCk7XG5cdCAgICAgIGVudHJpZXNTZXF1ZW5jZS5mcm9tRW50cnlTZXEgPSBmdW5jdGlvbigpICB7cmV0dXJuIGl0ZXJhYmxlLnRvU2VxKCl9O1xuXHQgICAgICByZXR1cm4gZW50cmllc1NlcXVlbmNlO1xuXHQgICAgfSxcblxuXHQgICAgZmlsdGVyTm90OiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyKG5vdChwcmVkaWNhdGUpLCBjb250ZXh0KTtcblx0ICAgIH0sXG5cblx0ICAgIGZpbmRMYXN0OiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQsIG5vdFNldFZhbHVlKSB7XG5cdCAgICAgIHJldHVybiB0aGlzLnRvS2V5ZWRTZXEoKS5yZXZlcnNlKCkuZmluZChwcmVkaWNhdGUsIGNvbnRleHQsIG5vdFNldFZhbHVlKTtcblx0ICAgIH0sXG5cblx0ICAgIGZpcnN0OiBmdW5jdGlvbigpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuZmluZChyZXR1cm5UcnVlKTtcblx0ICAgIH0sXG5cblx0ICAgIGZsYXRNYXA6IGZ1bmN0aW9uKG1hcHBlciwgY29udGV4dCkge1xuXHQgICAgICByZXR1cm4gcmVpZnkodGhpcywgZmxhdE1hcEZhY3RvcnkodGhpcywgbWFwcGVyLCBjb250ZXh0KSk7XG5cdCAgICB9LFxuXG5cdCAgICBmbGF0dGVuOiBmdW5jdGlvbihkZXB0aCkge1xuXHQgICAgICByZXR1cm4gcmVpZnkodGhpcywgZmxhdHRlbkZhY3RvcnkodGhpcywgZGVwdGgsIHRydWUpKTtcblx0ICAgIH0sXG5cblx0ICAgIGZyb21FbnRyeVNlcTogZnVuY3Rpb24oKSB7XG5cdCAgICAgIHJldHVybiBuZXcgRnJvbUVudHJpZXNTZXF1ZW5jZSh0aGlzKTtcblx0ICAgIH0sXG5cblx0ICAgIGdldDogZnVuY3Rpb24oc2VhcmNoS2V5LCBub3RTZXRWYWx1ZSkge1xuXHQgICAgICByZXR1cm4gdGhpcy5maW5kKGZ1bmN0aW9uKF8sIGtleSkgIHtyZXR1cm4gaXMoa2V5LCBzZWFyY2hLZXkpfSwgdW5kZWZpbmVkLCBub3RTZXRWYWx1ZSk7XG5cdCAgICB9LFxuXG5cdCAgICBnZXRJbjogZnVuY3Rpb24oc2VhcmNoS2V5UGF0aCwgbm90U2V0VmFsdWUpIHtcblx0ICAgICAgdmFyIG5lc3RlZCA9IHRoaXM7XG5cdCAgICAgIC8vIE5vdGU6IGluIGFuIEVTNiBlbnZpcm9ubWVudCwgd2Ugd291bGQgcHJlZmVyOlxuXHQgICAgICAvLyBmb3IgKHZhciBrZXkgb2Ygc2VhcmNoS2V5UGF0aCkge1xuXHQgICAgICB2YXIgaXRlciA9IGZvcmNlSXRlcmF0b3Ioc2VhcmNoS2V5UGF0aCk7XG5cdCAgICAgIHZhciBzdGVwO1xuXHQgICAgICB3aGlsZSAoIShzdGVwID0gaXRlci5uZXh0KCkpLmRvbmUpIHtcblx0ICAgICAgICB2YXIga2V5ID0gc3RlcC52YWx1ZTtcblx0ICAgICAgICBuZXN0ZWQgPSBuZXN0ZWQgJiYgbmVzdGVkLmdldCA/IG5lc3RlZC5nZXQoa2V5LCBOT1RfU0VUKSA6IE5PVF9TRVQ7XG5cdCAgICAgICAgaWYgKG5lc3RlZCA9PT0gTk9UX1NFVCkge1xuXHQgICAgICAgICAgcmV0dXJuIG5vdFNldFZhbHVlO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgICByZXR1cm4gbmVzdGVkO1xuXHQgICAgfSxcblxuXHQgICAgZ3JvdXBCeTogZnVuY3Rpb24oZ3JvdXBlciwgY29udGV4dCkge1xuXHQgICAgICByZXR1cm4gZ3JvdXBCeUZhY3RvcnkodGhpcywgZ3JvdXBlciwgY29udGV4dCk7XG5cdCAgICB9LFxuXG5cdCAgICBoYXM6IGZ1bmN0aW9uKHNlYXJjaEtleSkge1xuXHQgICAgICByZXR1cm4gdGhpcy5nZXQoc2VhcmNoS2V5LCBOT1RfU0VUKSAhPT0gTk9UX1NFVDtcblx0ICAgIH0sXG5cblx0ICAgIGhhc0luOiBmdW5jdGlvbihzZWFyY2hLZXlQYXRoKSB7XG5cdCAgICAgIHJldHVybiB0aGlzLmdldEluKHNlYXJjaEtleVBhdGgsIE5PVF9TRVQpICE9PSBOT1RfU0VUO1xuXHQgICAgfSxcblxuXHQgICAgaXNTdWJzZXQ6IGZ1bmN0aW9uKGl0ZXIpIHtcblx0ICAgICAgaXRlciA9IHR5cGVvZiBpdGVyLmluY2x1ZGVzID09PSAnZnVuY3Rpb24nID8gaXRlciA6IEl0ZXJhYmxlKGl0ZXIpO1xuXHQgICAgICByZXR1cm4gdGhpcy5ldmVyeShmdW5jdGlvbih2YWx1ZSApIHtyZXR1cm4gaXRlci5pbmNsdWRlcyh2YWx1ZSl9KTtcblx0ICAgIH0sXG5cblx0ICAgIGlzU3VwZXJzZXQ6IGZ1bmN0aW9uKGl0ZXIpIHtcblx0ICAgICAgaXRlciA9IHR5cGVvZiBpdGVyLmlzU3Vic2V0ID09PSAnZnVuY3Rpb24nID8gaXRlciA6IEl0ZXJhYmxlKGl0ZXIpO1xuXHQgICAgICByZXR1cm4gaXRlci5pc1N1YnNldCh0aGlzKTtcblx0ICAgIH0sXG5cblx0ICAgIGtleVNlcTogZnVuY3Rpb24oKSB7XG5cdCAgICAgIHJldHVybiB0aGlzLnRvU2VxKCkubWFwKGtleU1hcHBlcikudG9JbmRleGVkU2VxKCk7XG5cdCAgICB9LFxuXG5cdCAgICBsYXN0OiBmdW5jdGlvbigpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMudG9TZXEoKS5yZXZlcnNlKCkuZmlyc3QoKTtcblx0ICAgIH0sXG5cblx0ICAgIG1heDogZnVuY3Rpb24oY29tcGFyYXRvcikge1xuXHQgICAgICByZXR1cm4gbWF4RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yKTtcblx0ICAgIH0sXG5cblx0ICAgIG1heEJ5OiBmdW5jdGlvbihtYXBwZXIsIGNvbXBhcmF0b3IpIHtcblx0ICAgICAgcmV0dXJuIG1heEZhY3RvcnkodGhpcywgY29tcGFyYXRvciwgbWFwcGVyKTtcblx0ICAgIH0sXG5cblx0ICAgIG1pbjogZnVuY3Rpb24oY29tcGFyYXRvcikge1xuXHQgICAgICByZXR1cm4gbWF4RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yID8gbmVnKGNvbXBhcmF0b3IpIDogZGVmYXVsdE5lZ0NvbXBhcmF0b3IpO1xuXHQgICAgfSxcblxuXHQgICAgbWluQnk6IGZ1bmN0aW9uKG1hcHBlciwgY29tcGFyYXRvcikge1xuXHQgICAgICByZXR1cm4gbWF4RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yID8gbmVnKGNvbXBhcmF0b3IpIDogZGVmYXVsdE5lZ0NvbXBhcmF0b3IsIG1hcHBlcik7XG5cdCAgICB9LFxuXG5cdCAgICByZXN0OiBmdW5jdGlvbigpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuc2xpY2UoMSk7XG5cdCAgICB9LFxuXG5cdCAgICBza2lwOiBmdW5jdGlvbihhbW91bnQpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuc2xpY2UoTWF0aC5tYXgoMCwgYW1vdW50KSk7XG5cdCAgICB9LFxuXG5cdCAgICBza2lwTGFzdDogZnVuY3Rpb24oYW1vdW50KSB7XG5cdCAgICAgIHJldHVybiByZWlmeSh0aGlzLCB0aGlzLnRvU2VxKCkucmV2ZXJzZSgpLnNraXAoYW1vdW50KS5yZXZlcnNlKCkpO1xuXHQgICAgfSxcblxuXHQgICAgc2tpcFdoaWxlOiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcblx0ICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHNraXBXaGlsZUZhY3RvcnkodGhpcywgcHJlZGljYXRlLCBjb250ZXh0LCB0cnVlKSk7XG5cdCAgICB9LFxuXG5cdCAgICBza2lwVW50aWw6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCkge1xuXHQgICAgICByZXR1cm4gdGhpcy5za2lwV2hpbGUobm90KHByZWRpY2F0ZSksIGNvbnRleHQpO1xuXHQgICAgfSxcblxuXHQgICAgc29ydEJ5OiBmdW5jdGlvbihtYXBwZXIsIGNvbXBhcmF0b3IpIHtcblx0ICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHNvcnRGYWN0b3J5KHRoaXMsIGNvbXBhcmF0b3IsIG1hcHBlcikpO1xuXHQgICAgfSxcblxuXHQgICAgdGFrZTogZnVuY3Rpb24oYW1vdW50KSB7XG5cdCAgICAgIHJldHVybiB0aGlzLnNsaWNlKDAsIE1hdGgubWF4KDAsIGFtb3VudCkpO1xuXHQgICAgfSxcblxuXHQgICAgdGFrZUxhc3Q6IGZ1bmN0aW9uKGFtb3VudCkge1xuXHQgICAgICByZXR1cm4gcmVpZnkodGhpcywgdGhpcy50b1NlcSgpLnJldmVyc2UoKS50YWtlKGFtb3VudCkucmV2ZXJzZSgpKTtcblx0ICAgIH0sXG5cblx0ICAgIHRha2VXaGlsZTogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0KSB7XG5cdCAgICAgIHJldHVybiByZWlmeSh0aGlzLCB0YWtlV2hpbGVGYWN0b3J5KHRoaXMsIHByZWRpY2F0ZSwgY29udGV4dCkpO1xuXHQgICAgfSxcblxuXHQgICAgdGFrZVVudGlsOiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMudGFrZVdoaWxlKG5vdChwcmVkaWNhdGUpLCBjb250ZXh0KTtcblx0ICAgIH0sXG5cblx0ICAgIHZhbHVlU2VxOiBmdW5jdGlvbigpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMudG9JbmRleGVkU2VxKCk7XG5cdCAgICB9LFxuXG5cblx0ICAgIC8vICMjIyBIYXNoYWJsZSBPYmplY3RcblxuXHQgICAgaGFzaENvZGU6IGZ1bmN0aW9uKCkge1xuXHQgICAgICByZXR1cm4gdGhpcy5fX2hhc2ggfHwgKHRoaXMuX19oYXNoID0gaGFzaEl0ZXJhYmxlKHRoaXMpKTtcblx0ICAgIH0sXG5cblxuXHQgICAgLy8gIyMjIEludGVybmFsXG5cblx0ICAgIC8vIGFic3RyYWN0IF9faXRlcmF0ZShmbiwgcmV2ZXJzZSlcblxuXHQgICAgLy8gYWJzdHJhY3QgX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKVxuXHQgIH0pO1xuXG5cdCAgLy8gdmFyIElTX0lURVJBQkxFX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfSVRFUkFCTEVfX0BAJztcblx0ICAvLyB2YXIgSVNfS0VZRURfU0VOVElORUwgPSAnQEBfX0lNTVVUQUJMRV9LRVlFRF9fQEAnO1xuXHQgIC8vIHZhciBJU19JTkRFWEVEX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfSU5ERVhFRF9fQEAnO1xuXHQgIC8vIHZhciBJU19PUkRFUkVEX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfT1JERVJFRF9fQEAnO1xuXG5cdCAgdmFyIEl0ZXJhYmxlUHJvdG90eXBlID0gSXRlcmFibGUucHJvdG90eXBlO1xuXHQgIEl0ZXJhYmxlUHJvdG90eXBlW0lTX0lURVJBQkxFX1NFTlRJTkVMXSA9IHRydWU7XG5cdCAgSXRlcmFibGVQcm90b3R5cGVbSVRFUkFUT1JfU1lNQk9MXSA9IEl0ZXJhYmxlUHJvdG90eXBlLnZhbHVlcztcblx0ICBJdGVyYWJsZVByb3RvdHlwZS5fX3RvSlMgPSBJdGVyYWJsZVByb3RvdHlwZS50b0FycmF5O1xuXHQgIEl0ZXJhYmxlUHJvdG90eXBlLl9fdG9TdHJpbmdNYXBwZXIgPSBxdW90ZVN0cmluZztcblx0ICBJdGVyYWJsZVByb3RvdHlwZS5pbnNwZWN0ID1cblx0ICBJdGVyYWJsZVByb3RvdHlwZS50b1NvdXJjZSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy50b1N0cmluZygpOyB9O1xuXHQgIEl0ZXJhYmxlUHJvdG90eXBlLmNoYWluID0gSXRlcmFibGVQcm90b3R5cGUuZmxhdE1hcDtcblxuXHQgIC8vIFRlbXBvcmFyeSB3YXJuaW5nIGFib3V0IHVzaW5nIGxlbmd0aFxuXHQgIChmdW5jdGlvbiAoKSB7XG5cdCAgICB0cnkge1xuXHQgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSXRlcmFibGVQcm90b3R5cGUsICdsZW5ndGgnLCB7XG5cdCAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICBpZiAoIUl0ZXJhYmxlLm5vTGVuZ3RoV2FybmluZykge1xuXHQgICAgICAgICAgICB2YXIgc3RhY2s7XG5cdCAgICAgICAgICAgIHRyeSB7XG5cdCAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG5cdCAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG5cdCAgICAgICAgICAgICAgc3RhY2sgPSBlcnJvci5zdGFjaztcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBpZiAoc3RhY2suaW5kZXhPZignX3dyYXBPYmplY3QnKSA9PT0gLTEpIHtcblx0ICAgICAgICAgICAgICBjb25zb2xlICYmIGNvbnNvbGUud2FybiAmJiBjb25zb2xlLndhcm4oXG5cdCAgICAgICAgICAgICAgICAnaXRlcmFibGUubGVuZ3RoIGhhcyBiZWVuIGRlcHJlY2F0ZWQsICcrXG5cdCAgICAgICAgICAgICAgICAndXNlIGl0ZXJhYmxlLnNpemUgb3IgaXRlcmFibGUuY291bnQoKS4gJytcblx0ICAgICAgICAgICAgICAgICdUaGlzIHdhcm5pbmcgd2lsbCBiZWNvbWUgYSBzaWxlbnQgZXJyb3IgaW4gYSBmdXR1cmUgdmVyc2lvbi4gJyArXG5cdCAgICAgICAgICAgICAgICBzdGFja1xuXHQgICAgICAgICAgICAgICk7XG5cdCAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2l6ZTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgfSk7XG5cdCAgICB9IGNhdGNoIChlKSB7fVxuXHQgIH0pKCk7XG5cblxuXG5cdCAgbWl4aW4oS2V5ZWRJdGVyYWJsZSwge1xuXG5cdCAgICAvLyAjIyMgTW9yZSBzZXF1ZW50aWFsIG1ldGhvZHNcblxuXHQgICAgZmxpcDogZnVuY3Rpb24oKSB7XG5cdCAgICAgIHJldHVybiByZWlmeSh0aGlzLCBmbGlwRmFjdG9yeSh0aGlzKSk7XG5cdCAgICB9LFxuXG5cdCAgICBmaW5kS2V5OiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcblx0ICAgICAgdmFyIGVudHJ5ID0gdGhpcy5maW5kRW50cnkocHJlZGljYXRlLCBjb250ZXh0KTtcblx0ICAgICAgcmV0dXJuIGVudHJ5ICYmIGVudHJ5WzBdO1xuXHQgICAgfSxcblxuXHQgICAgZmluZExhc3RLZXk6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCkge1xuXHQgICAgICByZXR1cm4gdGhpcy50b1NlcSgpLnJldmVyc2UoKS5maW5kS2V5KHByZWRpY2F0ZSwgY29udGV4dCk7XG5cdCAgICB9LFxuXG5cdCAgICBrZXlPZjogZnVuY3Rpb24oc2VhcmNoVmFsdWUpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuZmluZEtleShmdW5jdGlvbih2YWx1ZSApIHtyZXR1cm4gaXModmFsdWUsIHNlYXJjaFZhbHVlKX0pO1xuXHQgICAgfSxcblxuXHQgICAgbGFzdEtleU9mOiBmdW5jdGlvbihzZWFyY2hWYWx1ZSkge1xuXHQgICAgICByZXR1cm4gdGhpcy5maW5kTGFzdEtleShmdW5jdGlvbih2YWx1ZSApIHtyZXR1cm4gaXModmFsdWUsIHNlYXJjaFZhbHVlKX0pO1xuXHQgICAgfSxcblxuXHQgICAgbWFwRW50cmllczogZnVuY3Rpb24obWFwcGVyLCBjb250ZXh0KSB7dmFyIHRoaXMkMCA9IHRoaXM7XG5cdCAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcblx0ICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsXG5cdCAgICAgICAgdGhpcy50b1NlcSgpLm1hcChcblx0ICAgICAgICAgIGZ1bmN0aW9uKHYsIGspICB7cmV0dXJuIG1hcHBlci5jYWxsKGNvbnRleHQsIFtrLCB2XSwgaXRlcmF0aW9ucysrLCB0aGlzJDApfVxuXHQgICAgICAgICkuZnJvbUVudHJ5U2VxKClcblx0ICAgICAgKTtcblx0ICAgIH0sXG5cblx0ICAgIG1hcEtleXM6IGZ1bmN0aW9uKG1hcHBlciwgY29udGV4dCkge3ZhciB0aGlzJDAgPSB0aGlzO1xuXHQgICAgICByZXR1cm4gcmVpZnkodGhpcyxcblx0ICAgICAgICB0aGlzLnRvU2VxKCkuZmxpcCgpLm1hcChcblx0ICAgICAgICAgIGZ1bmN0aW9uKGssIHYpICB7cmV0dXJuIG1hcHBlci5jYWxsKGNvbnRleHQsIGssIHYsIHRoaXMkMCl9XG5cdCAgICAgICAgKS5mbGlwKClcblx0ICAgICAgKTtcblx0ICAgIH0sXG5cblx0ICB9KTtcblxuXHQgIHZhciBLZXllZEl0ZXJhYmxlUHJvdG90eXBlID0gS2V5ZWRJdGVyYWJsZS5wcm90b3R5cGU7XG5cdCAgS2V5ZWRJdGVyYWJsZVByb3RvdHlwZVtJU19LRVlFRF9TRU5USU5FTF0gPSB0cnVlO1xuXHQgIEtleWVkSXRlcmFibGVQcm90b3R5cGVbSVRFUkFUT1JfU1lNQk9MXSA9IEl0ZXJhYmxlUHJvdG90eXBlLmVudHJpZXM7XG5cdCAgS2V5ZWRJdGVyYWJsZVByb3RvdHlwZS5fX3RvSlMgPSBJdGVyYWJsZVByb3RvdHlwZS50b09iamVjdDtcblx0ICBLZXllZEl0ZXJhYmxlUHJvdG90eXBlLl9fdG9TdHJpbmdNYXBwZXIgPSBmdW5jdGlvbih2LCBrKSAge3JldHVybiBKU09OLnN0cmluZ2lmeShrKSArICc6ICcgKyBxdW90ZVN0cmluZyh2KX07XG5cblxuXG5cdCAgbWl4aW4oSW5kZXhlZEl0ZXJhYmxlLCB7XG5cblx0ICAgIC8vICMjIyBDb252ZXJzaW9uIHRvIG90aGVyIHR5cGVzXG5cblx0ICAgIHRvS2V5ZWRTZXE6IGZ1bmN0aW9uKCkge1xuXHQgICAgICByZXR1cm4gbmV3IFRvS2V5ZWRTZXF1ZW5jZSh0aGlzLCBmYWxzZSk7XG5cdCAgICB9LFxuXG5cblx0ICAgIC8vICMjIyBFUzYgQ29sbGVjdGlvbiBtZXRob2RzIChFUzYgQXJyYXkgYW5kIE1hcClcblxuXHQgICAgZmlsdGVyOiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcblx0ICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIGZpbHRlckZhY3RvcnkodGhpcywgcHJlZGljYXRlLCBjb250ZXh0LCBmYWxzZSkpO1xuXHQgICAgfSxcblxuXHQgICAgZmluZEluZGV4OiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcblx0ICAgICAgdmFyIGVudHJ5ID0gdGhpcy5maW5kRW50cnkocHJlZGljYXRlLCBjb250ZXh0KTtcblx0ICAgICAgcmV0dXJuIGVudHJ5ID8gZW50cnlbMF0gOiAtMTtcblx0ICAgIH0sXG5cblx0ICAgIGluZGV4T2Y6IGZ1bmN0aW9uKHNlYXJjaFZhbHVlKSB7XG5cdCAgICAgIHZhciBrZXkgPSB0aGlzLnRvS2V5ZWRTZXEoKS5rZXlPZihzZWFyY2hWYWx1ZSk7XG5cdCAgICAgIHJldHVybiBrZXkgPT09IHVuZGVmaW5lZCA/IC0xIDoga2V5O1xuXHQgICAgfSxcblxuXHQgICAgbGFzdEluZGV4T2Y6IGZ1bmN0aW9uKHNlYXJjaFZhbHVlKSB7XG5cdCAgICAgIHJldHVybiB0aGlzLnRvU2VxKCkucmV2ZXJzZSgpLmluZGV4T2Yoc2VhcmNoVmFsdWUpO1xuXHQgICAgfSxcblxuXHQgICAgcmV2ZXJzZTogZnVuY3Rpb24oKSB7XG5cdCAgICAgIHJldHVybiByZWlmeSh0aGlzLCByZXZlcnNlRmFjdG9yeSh0aGlzLCBmYWxzZSkpO1xuXHQgICAgfSxcblxuXHQgICAgc2xpY2U6IGZ1bmN0aW9uKGJlZ2luLCBlbmQpIHtcblx0ICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHNsaWNlRmFjdG9yeSh0aGlzLCBiZWdpbiwgZW5kLCBmYWxzZSkpO1xuXHQgICAgfSxcblxuXHQgICAgc3BsaWNlOiBmdW5jdGlvbihpbmRleCwgcmVtb3ZlTnVtIC8qLCAuLi52YWx1ZXMqLykge1xuXHQgICAgICB2YXIgbnVtQXJncyA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cdCAgICAgIHJlbW92ZU51bSA9IE1hdGgubWF4KHJlbW92ZU51bSB8IDAsIDApO1xuXHQgICAgICBpZiAobnVtQXJncyA9PT0gMCB8fCAobnVtQXJncyA9PT0gMiAmJiAhcmVtb3ZlTnVtKSkge1xuXHQgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICB9XG5cdCAgICAgIGluZGV4ID0gcmVzb2x2ZUJlZ2luKGluZGV4LCB0aGlzLnNpemUpO1xuXHQgICAgICB2YXIgc3BsaWNlZCA9IHRoaXMuc2xpY2UoMCwgaW5kZXgpO1xuXHQgICAgICByZXR1cm4gcmVpZnkoXG5cdCAgICAgICAgdGhpcyxcblx0ICAgICAgICBudW1BcmdzID09PSAxID9cblx0ICAgICAgICAgIHNwbGljZWQgOlxuXHQgICAgICAgICAgc3BsaWNlZC5jb25jYXQoYXJyQ29weShhcmd1bWVudHMsIDIpLCB0aGlzLnNsaWNlKGluZGV4ICsgcmVtb3ZlTnVtKSlcblx0ICAgICAgKTtcblx0ICAgIH0sXG5cblxuXHQgICAgLy8gIyMjIE1vcmUgY29sbGVjdGlvbiBtZXRob2RzXG5cblx0ICAgIGZpbmRMYXN0SW5kZXg6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCkge1xuXHQgICAgICB2YXIga2V5ID0gdGhpcy50b0tleWVkU2VxKCkuZmluZExhc3RLZXkocHJlZGljYXRlLCBjb250ZXh0KTtcblx0ICAgICAgcmV0dXJuIGtleSA9PT0gdW5kZWZpbmVkID8gLTEgOiBrZXk7XG5cdCAgICB9LFxuXG5cdCAgICBmaXJzdDogZnVuY3Rpb24oKSB7XG5cdCAgICAgIHJldHVybiB0aGlzLmdldCgwKTtcblx0ICAgIH0sXG5cblx0ICAgIGZsYXR0ZW46IGZ1bmN0aW9uKGRlcHRoKSB7XG5cdCAgICAgIHJldHVybiByZWlmeSh0aGlzLCBmbGF0dGVuRmFjdG9yeSh0aGlzLCBkZXB0aCwgZmFsc2UpKTtcblx0ICAgIH0sXG5cblx0ICAgIGdldDogZnVuY3Rpb24oaW5kZXgsIG5vdFNldFZhbHVlKSB7XG5cdCAgICAgIGluZGV4ID0gd3JhcEluZGV4KHRoaXMsIGluZGV4KTtcblx0ICAgICAgcmV0dXJuIChpbmRleCA8IDAgfHwgKHRoaXMuc2l6ZSA9PT0gSW5maW5pdHkgfHxcblx0ICAgICAgICAgICh0aGlzLnNpemUgIT09IHVuZGVmaW5lZCAmJiBpbmRleCA+IHRoaXMuc2l6ZSkpKSA/XG5cdCAgICAgICAgbm90U2V0VmFsdWUgOlxuXHQgICAgICAgIHRoaXMuZmluZChmdW5jdGlvbihfLCBrZXkpICB7cmV0dXJuIGtleSA9PT0gaW5kZXh9LCB1bmRlZmluZWQsIG5vdFNldFZhbHVlKTtcblx0ICAgIH0sXG5cblx0ICAgIGhhczogZnVuY3Rpb24oaW5kZXgpIHtcblx0ICAgICAgaW5kZXggPSB3cmFwSW5kZXgodGhpcywgaW5kZXgpO1xuXHQgICAgICByZXR1cm4gaW5kZXggPj0gMCAmJiAodGhpcy5zaXplICE9PSB1bmRlZmluZWQgP1xuXHQgICAgICAgIHRoaXMuc2l6ZSA9PT0gSW5maW5pdHkgfHwgaW5kZXggPCB0aGlzLnNpemUgOlxuXHQgICAgICAgIHRoaXMuaW5kZXhPZihpbmRleCkgIT09IC0xXG5cdCAgICAgICk7XG5cdCAgICB9LFxuXG5cdCAgICBpbnRlcnBvc2U6IGZ1bmN0aW9uKHNlcGFyYXRvcikge1xuXHQgICAgICByZXR1cm4gcmVpZnkodGhpcywgaW50ZXJwb3NlRmFjdG9yeSh0aGlzLCBzZXBhcmF0b3IpKTtcblx0ICAgIH0sXG5cblx0ICAgIGludGVybGVhdmU6IGZ1bmN0aW9uKC8qLi4uaXRlcmFibGVzKi8pIHtcblx0ICAgICAgdmFyIGl0ZXJhYmxlcyA9IFt0aGlzXS5jb25jYXQoYXJyQ29weShhcmd1bWVudHMpKTtcblx0ICAgICAgdmFyIHppcHBlZCA9IHppcFdpdGhGYWN0b3J5KHRoaXMudG9TZXEoKSwgSW5kZXhlZFNlcS5vZiwgaXRlcmFibGVzKTtcblx0ICAgICAgdmFyIGludGVybGVhdmVkID0gemlwcGVkLmZsYXR0ZW4odHJ1ZSk7XG5cdCAgICAgIGlmICh6aXBwZWQuc2l6ZSkge1xuXHQgICAgICAgIGludGVybGVhdmVkLnNpemUgPSB6aXBwZWQuc2l6ZSAqIGl0ZXJhYmxlcy5sZW5ndGg7XG5cdCAgICAgIH1cblx0ICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIGludGVybGVhdmVkKTtcblx0ICAgIH0sXG5cblx0ICAgIGxhc3Q6IGZ1bmN0aW9uKCkge1xuXHQgICAgICByZXR1cm4gdGhpcy5nZXQoLTEpO1xuXHQgICAgfSxcblxuXHQgICAgc2tpcFdoaWxlOiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcblx0ICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHNraXBXaGlsZUZhY3RvcnkodGhpcywgcHJlZGljYXRlLCBjb250ZXh0LCBmYWxzZSkpO1xuXHQgICAgfSxcblxuXHQgICAgemlwOiBmdW5jdGlvbigvKiwgLi4uaXRlcmFibGVzICovKSB7XG5cdCAgICAgIHZhciBpdGVyYWJsZXMgPSBbdGhpc10uY29uY2F0KGFyckNvcHkoYXJndW1lbnRzKSk7XG5cdCAgICAgIHJldHVybiByZWlmeSh0aGlzLCB6aXBXaXRoRmFjdG9yeSh0aGlzLCBkZWZhdWx0WmlwcGVyLCBpdGVyYWJsZXMpKTtcblx0ICAgIH0sXG5cblx0ICAgIHppcFdpdGg6IGZ1bmN0aW9uKHppcHBlci8qLCAuLi5pdGVyYWJsZXMgKi8pIHtcblx0ICAgICAgdmFyIGl0ZXJhYmxlcyA9IGFyckNvcHkoYXJndW1lbnRzKTtcblx0ICAgICAgaXRlcmFibGVzWzBdID0gdGhpcztcblx0ICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHppcFdpdGhGYWN0b3J5KHRoaXMsIHppcHBlciwgaXRlcmFibGVzKSk7XG5cdCAgICB9LFxuXG5cdCAgfSk7XG5cblx0ICBJbmRleGVkSXRlcmFibGUucHJvdG90eXBlW0lTX0lOREVYRURfU0VOVElORUxdID0gdHJ1ZTtcblx0ICBJbmRleGVkSXRlcmFibGUucHJvdG90eXBlW0lTX09SREVSRURfU0VOVElORUxdID0gdHJ1ZTtcblxuXG5cblx0ICBtaXhpbihTZXRJdGVyYWJsZSwge1xuXG5cdCAgICAvLyAjIyMgRVM2IENvbGxlY3Rpb24gbWV0aG9kcyAoRVM2IEFycmF5IGFuZCBNYXApXG5cblx0ICAgIGdldDogZnVuY3Rpb24odmFsdWUsIG5vdFNldFZhbHVlKSB7XG5cdCAgICAgIHJldHVybiB0aGlzLmhhcyh2YWx1ZSkgPyB2YWx1ZSA6IG5vdFNldFZhbHVlO1xuXHQgICAgfSxcblxuXHQgICAgaW5jbHVkZXM6IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdCAgICAgIHJldHVybiB0aGlzLmhhcyh2YWx1ZSk7XG5cdCAgICB9LFxuXG5cblx0ICAgIC8vICMjIyBNb3JlIHNlcXVlbnRpYWwgbWV0aG9kc1xuXG5cdCAgICBrZXlTZXE6IGZ1bmN0aW9uKCkge1xuXHQgICAgICByZXR1cm4gdGhpcy52YWx1ZVNlcSgpO1xuXHQgICAgfSxcblxuXHQgIH0pO1xuXG5cdCAgU2V0SXRlcmFibGUucHJvdG90eXBlLmhhcyA9IEl0ZXJhYmxlUHJvdG90eXBlLmluY2x1ZGVzO1xuXG5cblx0ICAvLyBNaXhpbiBzdWJjbGFzc2VzXG5cblx0ICBtaXhpbihLZXllZFNlcSwgS2V5ZWRJdGVyYWJsZS5wcm90b3R5cGUpO1xuXHQgIG1peGluKEluZGV4ZWRTZXEsIEluZGV4ZWRJdGVyYWJsZS5wcm90b3R5cGUpO1xuXHQgIG1peGluKFNldFNlcSwgU2V0SXRlcmFibGUucHJvdG90eXBlKTtcblxuXHQgIG1peGluKEtleWVkQ29sbGVjdGlvbiwgS2V5ZWRJdGVyYWJsZS5wcm90b3R5cGUpO1xuXHQgIG1peGluKEluZGV4ZWRDb2xsZWN0aW9uLCBJbmRleGVkSXRlcmFibGUucHJvdG90eXBlKTtcblx0ICBtaXhpbihTZXRDb2xsZWN0aW9uLCBTZXRJdGVyYWJsZS5wcm90b3R5cGUpO1xuXG5cblx0ICAvLyAjcHJhZ21hIEhlbHBlciBmdW5jdGlvbnNcblxuXHQgIGZ1bmN0aW9uIGtleU1hcHBlcih2LCBrKSB7XG5cdCAgICByZXR1cm4gaztcblx0ICB9XG5cblx0ICBmdW5jdGlvbiBlbnRyeU1hcHBlcih2LCBrKSB7XG5cdCAgICByZXR1cm4gW2ssIHZdO1xuXHQgIH1cblxuXHQgIGZ1bmN0aW9uIG5vdChwcmVkaWNhdGUpIHtcblx0ICAgIHJldHVybiBmdW5jdGlvbigpIHtcblx0ICAgICAgcmV0dXJuICFwcmVkaWNhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0ICAgIH1cblx0ICB9XG5cblx0ICBmdW5jdGlvbiBuZWcocHJlZGljYXRlKSB7XG5cdCAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG5cdCAgICAgIHJldHVybiAtcHJlZGljYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gcXVvdGVTdHJpbmcodmFsdWUpIHtcblx0ICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gSlNPTi5zdHJpbmdpZnkodmFsdWUpIDogdmFsdWU7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gZGVmYXVsdFppcHBlcigpIHtcblx0ICAgIHJldHVybiBhcnJDb3B5KGFyZ3VtZW50cyk7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gZGVmYXVsdE5lZ0NvbXBhcmF0b3IoYSwgYikge1xuXHQgICAgcmV0dXJuIGEgPCBiID8gMSA6IGEgPiBiID8gLTEgOiAwO1xuXHQgIH1cblxuXHQgIGZ1bmN0aW9uIGhhc2hJdGVyYWJsZShpdGVyYWJsZSkge1xuXHQgICAgaWYgKGl0ZXJhYmxlLnNpemUgPT09IEluZmluaXR5KSB7XG5cdCAgICAgIHJldHVybiAwO1xuXHQgICAgfVxuXHQgICAgdmFyIG9yZGVyZWQgPSBpc09yZGVyZWQoaXRlcmFibGUpO1xuXHQgICAgdmFyIGtleWVkID0gaXNLZXllZChpdGVyYWJsZSk7XG5cdCAgICB2YXIgaCA9IG9yZGVyZWQgPyAxIDogMDtcblx0ICAgIHZhciBzaXplID0gaXRlcmFibGUuX19pdGVyYXRlKFxuXHQgICAgICBrZXllZCA/XG5cdCAgICAgICAgb3JkZXJlZCA/XG5cdCAgICAgICAgICBmdW5jdGlvbih2LCBrKSAgeyBoID0gMzEgKiBoICsgaGFzaE1lcmdlKGhhc2godiksIGhhc2goaykpIHwgMDsgfSA6XG5cdCAgICAgICAgICBmdW5jdGlvbih2LCBrKSAgeyBoID0gaCArIGhhc2hNZXJnZShoYXNoKHYpLCBoYXNoKGspKSB8IDA7IH0gOlxuXHQgICAgICAgIG9yZGVyZWQgP1xuXHQgICAgICAgICAgZnVuY3Rpb24odiApIHsgaCA9IDMxICogaCArIGhhc2godikgfCAwOyB9IDpcblx0ICAgICAgICAgIGZ1bmN0aW9uKHYgKSB7IGggPSBoICsgaGFzaCh2KSB8IDA7IH1cblx0ICAgICk7XG5cdCAgICByZXR1cm4gbXVybXVySGFzaE9mU2l6ZShzaXplLCBoKTtcblx0ICB9XG5cblx0ICBmdW5jdGlvbiBtdXJtdXJIYXNoT2ZTaXplKHNpemUsIGgpIHtcblx0ICAgIGggPSBzcmNfTWF0aF9faW11bChoLCAweENDOUUyRDUxKTtcblx0ICAgIGggPSBzcmNfTWF0aF9faW11bChoIDw8IDE1IHwgaCA+Pj4gLTE1LCAweDFCODczNTkzKTtcblx0ICAgIGggPSBzcmNfTWF0aF9faW11bChoIDw8IDEzIHwgaCA+Pj4gLTEzLCA1KTtcblx0ICAgIGggPSAoaCArIDB4RTY1NDZCNjQgfCAwKSBeIHNpemU7XG5cdCAgICBoID0gc3JjX01hdGhfX2ltdWwoaCBeIGggPj4+IDE2LCAweDg1RUJDQTZCKTtcblx0ICAgIGggPSBzcmNfTWF0aF9faW11bChoIF4gaCA+Pj4gMTMsIDB4QzJCMkFFMzUpO1xuXHQgICAgaCA9IHNtaShoIF4gaCA+Pj4gMTYpO1xuXHQgICAgcmV0dXJuIGg7XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gaGFzaE1lcmdlKGEsIGIpIHtcblx0ICAgIHJldHVybiBhIF4gYiArIDB4OUUzNzc5QjkgKyAoYSA8PCA2KSArIChhID4+IDIpIHwgMDsgLy8gaW50XG5cdCAgfVxuXG5cdCAgdmFyIEltbXV0YWJsZSA9IHtcblxuXHQgICAgSXRlcmFibGU6IEl0ZXJhYmxlLFxuXG5cdCAgICBTZXE6IFNlcSxcblx0ICAgIENvbGxlY3Rpb246IENvbGxlY3Rpb24sXG5cdCAgICBNYXA6IHNyY19NYXBfX01hcCxcblx0ICAgIE9yZGVyZWRNYXA6IE9yZGVyZWRNYXAsXG5cdCAgICBMaXN0OiBMaXN0LFxuXHQgICAgU3RhY2s6IFN0YWNrLFxuXHQgICAgU2V0OiBzcmNfU2V0X19TZXQsXG5cdCAgICBPcmRlcmVkU2V0OiBPcmRlcmVkU2V0LFxuXG5cdCAgICBSZWNvcmQ6IFJlY29yZCxcblx0ICAgIFJhbmdlOiBSYW5nZSxcblx0ICAgIFJlcGVhdDogUmVwZWF0LFxuXG5cdCAgICBpczogaXMsXG5cdCAgICBmcm9tSlM6IGZyb21KUyxcblxuXHQgIH07XG5cblx0ICByZXR1cm4gSW1tdXRhYmxlO1xuXG5cdH0pKTtcblxuLyoqKi8gfSxcbi8qIDMgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cykge1xuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgdGhlIHBhc3NlZCBpbiB2YWx1ZSBpcyBhIHN0cmluZ1xuXHQgKiBAcGFyYW0geyp9IHZhbFxuXHQgKiBAcmV0dXJuIHtib29sZWFufVxuXHQgKi9cblx0ZXhwb3J0cy5pc1N0cmluZyA9IGZ1bmN0aW9uKHZhbCkge1xuXHQgIHJldHVybiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJyB8fCBvYmplY3RUb1N0cmluZyh2YWwpID09PSAnW29iamVjdCBTdHJpbmddJ1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgcGFzc2VkIGluIHZhbHVlIGlzIGFuIGFycmF5XG5cdCAqIEBwYXJhbSB7Kn0gdmFsXG5cdCAqIEByZXR1cm4ge2Jvb2xlYW59XG5cdCAqL1xuXHRleHBvcnRzLmlzQXJyYXkgPSBBcnJheS5pc0FycmF5IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovfHwgZnVuY3Rpb24odmFsKSB7XG5cdCAgcmV0dXJuIG9iamVjdFRvU3RyaW5nKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5XSdcblx0fVxuXG5cdC8vIHRha2VuIGZyb20gdW5kZXJzY29yZSBzb3VyY2UgdG8gYWNjb3VudCBmb3IgYnJvd3NlciBkaXNjcmVwYW5jeVxuXHQvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG5cdGlmICh0eXBlb2YgLy4vICE9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBJbnQ4QXJyYXkgIT09ICdvYmplY3QnKSB7XG5cdCAgLyoqXG5cdCAgICogQ2hlY2tzIGlmIHRoZSBwYXNzZWQgaW4gdmFsdWUgaXMgYSBmdW5jdGlvblxuXHQgICAqIEBwYXJhbSB7Kn0gdmFsXG5cdCAgICogQHJldHVybiB7Ym9vbGVhbn1cblx0ICAgKi9cblx0ICBleHBvcnRzLmlzRnVuY3Rpb24gPSBmdW5jdGlvbihvYmopIHtcblx0ICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nIHx8IGZhbHNlXG5cdCAgfVxuXHR9IGVsc2Uge1xuXHQgIC8qKlxuXHQgICAqIENoZWNrcyBpZiB0aGUgcGFzc2VkIGluIHZhbHVlIGlzIGEgZnVuY3Rpb25cblx0ICAgKiBAcGFyYW0geyp9IHZhbFxuXHQgICAqIEByZXR1cm4ge2Jvb2xlYW59XG5cdCAgICovXG5cdCAgZXhwb3J0cy5pc0Z1bmN0aW9uID0gZnVuY3Rpb24odmFsKSB7XG5cdCAgICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGdW5jdGlvbl0nXG5cdCAgfVxuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgcGFzc2VkIGluIHZhbHVlIGlzIG9mIHR5cGUgT2JqZWN0XG5cdCAqIEBwYXJhbSB7Kn0gdmFsXG5cdCAqIEByZXR1cm4ge2Jvb2xlYW59XG5cdCAqL1xuXHRleHBvcnRzLmlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG5cdCAgdmFyIHR5cGUgPSB0eXBlb2Ygb2JqXG5cdCAgcmV0dXJuIHR5cGUgPT09ICdmdW5jdGlvbicgfHwgdHlwZSA9PT0gJ29iamVjdCcgJiYgISFvYmpcblx0fVxuXG5cdC8qKlxuXHQgKiBFeHRlbmRzIGFuIG9iamVjdCB3aXRoIHRoZSBwcm9wZXJ0aWVzIG9mIGFkZGl0aW9uYWwgb2JqZWN0c1xuXHQgKiBAcGFyYW0ge29iamVjdH0gb2JqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBvYmplY3RzXG5cdCAqIEByZXR1cm4ge29iamVjdH1cblx0ICovXG5cdGV4cG9ydHMuZXh0ZW5kID0gZnVuY3Rpb24ob2JqKSB7XG5cdCAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGhcblxuXHQgIGlmICghb2JqIHx8IGxlbmd0aCA8IDIpIHtcblx0ICAgIHJldHVybiBvYmogfHwge31cblx0ICB9XG5cblx0ICBmb3IgKHZhciBpbmRleCA9IDE7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG5cdCAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2luZGV4XVxuXHQgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhzb3VyY2UpXG5cdCAgICB2YXIgbCA9IGtleXMubGVuZ3RoXG5cblx0ICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbDsgaSsrKSB7XG5cdCAgICAgIHZhciBrZXkgPSBrZXlzW2ldXG5cdCAgICAgIG9ialtrZXldID0gc291cmNlW2tleV1cblx0ICAgIH1cblx0ICB9XG5cblx0ICByZXR1cm4gb2JqXG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIHNoYWxsb3cgY2xvbmUgb2YgYW4gb2JqZWN0XG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBvYmpcblx0ICogQHJldHVybiB7b2JqZWN0fVxuXHQgKi9cblx0ZXhwb3J0cy5jbG9uZSA9IGZ1bmN0aW9uKG9iaikge1xuXHQgIGlmICghZXhwb3J0cy5pc09iamVjdChvYmopKSB7XG5cdCAgICByZXR1cm4gb2JqXG5cdCAgfVxuXHQgIHJldHVybiBleHBvcnRzLmlzQXJyYXkob2JqKSA/IG9iai5zbGljZSgpIDogZXhwb3J0cy5leHRlbmQoe30sIG9iailcblx0fVxuXG5cdC8qKlxuXHQgKiBJdGVyYXRlcyBvdmVyIGEgY29sbGVjdGlvbiBvZiBlbGVtZW50cyB5aWVsZGluZyBlYWNoIGl0ZXJhdGlvbiB0byBhblxuXHQgKiBpdGVyYXRlZS4gVGhlIGl0ZXJhdGVlIG1heSBiZSBib3VuZCB0byB0aGUgY29udGV4dCBhcmd1bWVudCBhbmQgaXMgaW52b2tlZFxuXHQgKiBlYWNoIHRpbWUgd2l0aCB0aHJlZSBhcmd1bWVudHMgKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLiBJdGVyYXRpb24gbWF5XG5cdCAqIGJlIGV4aXRlZCBlYXJseSBieSBleHBsaWNpdGx5IHJldHVybmluZyBmYWxzZS5cblx0ICogQHBhcmFtIHthcnJheXxvYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGl0ZXJhdGVlXG5cdCAqIEBwYXJhbSB7Kn0gY29udGV4dFxuXHQgKiBAcmV0dXJuIHthcnJheXxvYmplY3R8c3RyaW5nfVxuXHQgKi9cblx0ZXhwb3J0cy5lYWNoID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcblx0ICB2YXIgbGVuZ3RoID0gY29sbGVjdGlvbiA/IGNvbGxlY3Rpb24ubGVuZ3RoIDogMFxuXHQgIHZhciBpID0gLTFcblx0ICB2YXIga2V5c1xuXHQgIHZhciBvcmlnSXRlcmF0ZWVcblxuXHQgIGlmIChjb250ZXh0KSB7XG5cdCAgICBvcmlnSXRlcmF0ZWUgPSBpdGVyYXRlZVxuXHQgICAgaXRlcmF0ZWUgPSBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGlubmVyQ29sbGVjdGlvbikge1xuXHQgICAgICByZXR1cm4gb3JpZ0l0ZXJhdGVlLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBpbm5lckNvbGxlY3Rpb24pXG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgaWYgKGlzTGVuZ3RoKGxlbmd0aCkpIHtcblx0ICAgIHdoaWxlICgrK2kgPCBsZW5ndGgpIHtcblx0ICAgICAgaWYgKGl0ZXJhdGVlKGNvbGxlY3Rpb25baV0sIGksIGNvbGxlY3Rpb24pID09PSBmYWxzZSkge1xuXHQgICAgICAgIGJyZWFrXG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICB9IGVsc2Uge1xuXHQgICAga2V5cyA9IE9iamVjdC5rZXlzKGNvbGxlY3Rpb24pXG5cdCAgICBsZW5ndGggPSBrZXlzLmxlbmd0aFxuXHQgICAgd2hpbGUgKCsraSA8IGxlbmd0aCkge1xuXHQgICAgICBpZiAoaXRlcmF0ZWUoY29sbGVjdGlvbltrZXlzW2ldXSwga2V5c1tpXSwgY29sbGVjdGlvbikgPT09IGZhbHNlKSB7XG5cdCAgICAgICAgYnJlYWtcblx0ICAgICAgfVxuXHQgICAgfVxuXHQgIH1cblxuXHQgIHJldHVybiBjb2xsZWN0aW9uXG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyBhIG5ldyBmdW5jdGlvbiB0aGUgaW52b2tlcyBgZnVuY2Agd2l0aCBgcGFydGlhbEFyZ3NgIHByZXBlbmRlZCB0b1xuXHQgKiBhbnkgcGFzc2VkIGludG8gdGhlIG5ldyBmdW5jdGlvbi4gQWN0cyBsaWtlIGBBcnJheS5wcm90b3R5cGUuYmluZGAsIGV4Y2VwdFxuXHQgKiBpdCBkb2VzIG5vdCBhbHRlciBgdGhpc2AgY29udGV4dC5cblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gZnVuY1xuXHQgKiBAcGFyYW0geyp9IHBhcnRpYWxBcmdzXG5cdCAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuXHQgKi9cblx0ZXhwb3J0cy5wYXJ0aWFsID0gZnVuY3Rpb24oZnVuYykge1xuXHQgIHZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZVxuXHQgIHZhciBwYXJ0aWFsQXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuXG5cdCAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuXHQgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgcGFydGlhbEFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkpXG5cdCAgfVxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHRleHQgdmFsdWUgcmVwcmVzZW50YXRpb24gb2YgYW4gb2JqZWN0XG5cdCAqIEBwcml2YXRlXG5cdCAqIEBwYXJhbSB7Kn0gb2JqXG5cdCAqIEByZXR1cm4ge3N0cmluZ31cblx0ICovXG5cdGZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG9iaikge1xuXHQgIHJldHVybiBvYmogJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgdG9TdHJpbmcuY2FsbChvYmopXG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIHRoZSB2YWx1ZSBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAcGFyYW0geyp9IHZhbFxuXHQgKiBAcmV0dXJuIHtib29sfVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNMZW5ndGgodmFsKSB7XG5cdCAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdudW1iZXInXG5cdCAgICAmJiB2YWwgPiAtMVxuXHQgICAgJiYgdmFsICUgMSA9PT0gMFxuXHQgICAgJiYgdmFsIDw9IE51bWJlci5NQVhfVkFMVUVcblx0fVxuXG5cbi8qKiovIH0sXG4vKiA0ICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgSW1tdXRhYmxlID0gX193ZWJwYWNrX3JlcXVpcmVfXygyKVxuXHR2YXIgbG9nZ2luZyA9IF9fd2VicGFja19yZXF1aXJlX18oNSlcblx0dmFyIENoYW5nZU9ic2VydmVyID0gX193ZWJwYWNrX3JlcXVpcmVfXyg2KVxuXHR2YXIgR2V0dGVyID0gX193ZWJwYWNrX3JlcXVpcmVfXyg5KVxuXHR2YXIgS2V5UGF0aCA9IF9fd2VicGFja19yZXF1aXJlX18oMTApXG5cdHZhciBFdmFsdWF0b3IgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDExKVxuXHR2YXIgY3JlYXRlUmVhY3RNaXhpbiA9IF9fd2VicGFja19yZXF1aXJlX18oMTIpXG5cblx0Ly8gaGVscGVyIGZuc1xuXHR2YXIgdG9KUyA9IF9fd2VicGFja19yZXF1aXJlX18oMSkudG9KU1xuXHR2YXIgdG9JbW11dGFibGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpLnRvSW1tdXRhYmxlXG5cdHZhciBpc0ltbXV0YWJsZVZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXygxKS5pc0ltbXV0YWJsZVZhbHVlXG5cdHZhciBlYWNoID0gX193ZWJwYWNrX3JlcXVpcmVfXygzKS5lYWNoXG5cblxuXHQvKipcblx0ICogU3RhdGUgaXMgc3RvcmVkIGluIE51Y2xlYXJKUyBSZWFjdG9ycy4gIFJlYWN0b3JzXG5cdCAqIGNvbnRhaW4gYSAnc3RhdGUnIG9iamVjdCB3aGljaCBpcyBhbiBJbW11dGFibGUuTWFwXG5cdCAqXG5cdCAqIFRoZSBvbmx5IHdheSBSZWFjdG9ycyBjYW4gY2hhbmdlIHN0YXRlIGlzIGJ5IHJlYWN0aW5nIHRvXG5cdCAqIG1lc3NhZ2VzLiAgVG8gdXBkYXRlIHN0YXRlLCBSZWFjdG9yJ3MgZGlzcGF0Y2ggbWVzc2FnZXMgdG9cblx0ICogYWxsIHJlZ2lzdGVyZWQgY29yZXMsIGFuZCB0aGUgY29yZSByZXR1cm5zIGl0J3MgbmV3XG5cdCAqIHN0YXRlIGJhc2VkIG9uIHRoZSBtZXNzYWdlXG5cdCAqL1xuXG5cdCAgZnVuY3Rpb24gUmVhY3Rvcihjb25maWcpIHtcInVzZSBzdHJpY3RcIjtcblx0ICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBSZWFjdG9yKSkge1xuXHQgICAgICByZXR1cm4gbmV3IFJlYWN0b3IoY29uZmlnKVxuXHQgICAgfVxuXHQgICAgY29uZmlnID0gY29uZmlnIHx8IHt9XG5cblx0ICAgIHRoaXMuZGVidWcgPSAhIWNvbmZpZy5kZWJ1Z1xuXG5cdCAgICB0aGlzLlJlYWN0TWl4aW4gPSBjcmVhdGVSZWFjdE1peGluKHRoaXMpXG5cdCAgICAvKipcblx0ICAgICAqIFRoZSBzdGF0ZSBmb3IgdGhlIHdob2xlIGNsdXN0ZXJcblx0ICAgICAqL1xuXHQgICAgdGhpcy5zdGF0ZSA9IEltbXV0YWJsZS5NYXAoe30pXG5cdCAgICAvKipcblx0ICAgICAqIEhvbGRzIGEgbWFwIG9mIGlkID0+IHN0b3JlIGluc3RhbmNlXG5cdCAgICAgKi9cblx0ICAgIHRoaXMuX19zdG9yZXMgPSBJbW11dGFibGUuTWFwKHt9KVxuXG5cdCAgICB0aGlzLl9fZXZhbHVhdG9yID0gbmV3IEV2YWx1YXRvcigpXG5cdCAgICAvKipcblx0ICAgICAqIENoYW5nZSBvYnNlcnZlciBpbnRlcmZhY2UgdG8gb2JzZXJ2ZSBjZXJ0YWluIGtleXBhdGhzXG5cdCAgICAgKiBDcmVhdGVkIGFmdGVyIF9faW5pdGlhbGl6ZSBzbyBpdCBzdGFydHMgd2l0aCBpbml0aWFsU3RhdGVcblx0ICAgICAqL1xuXHQgICAgdGhpcy5fX2NoYW5nZU9ic2VydmVyID0gbmV3IENoYW5nZU9ic2VydmVyKHRoaXMuc3RhdGUsIHRoaXMuX19ldmFsdWF0b3IpXG5cblx0ICAgIC8vIGtlZXAgdHJhY2sgb2YgdGhlIGRlcHRoIG9mIGJhdGNoIG5lc3Rpbmdcblx0ICAgIHRoaXMuX19iYXRjaERlcHRoID0gMFxuXHQgICAgLy8gbnVtYmVyIG9mIGRpc3BhdGNoZXMgaW4gdGhlIHRvcCBtb3N0IGJhdGNoIGN5Y2xlXG5cdCAgICB0aGlzLl9fYmF0Y2hEaXNwYXRjaENvdW50ID0gMFxuXG5cdCAgICAvLyBrZWVwIHRyYWNrIGlmIHdlIGFyZSBjdXJyZW50bHkgZGlzcGF0Y2hpbmdcblx0ICAgIHRoaXMuX19pc0Rpc3BhdGNoaW5nID0gZmFsc2Vcblx0ICB9XG5cblx0ICAvKipcblx0ICAgKiBFdmFsdWF0ZXMgYSBLZXlQYXRoIG9yIEdldHRlciBpbiBjb250ZXh0IG9mIHRoZSByZWFjdG9yIHN0YXRlXG5cdCAgICogQHBhcmFtIHtLZXlQYXRofEdldHRlcn0ga2V5UGF0aE9yR2V0dGVyXG5cdCAgICogQHJldHVybiB7Kn1cblx0ICAgKi9cblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhY3Rvci5wcm90b3R5cGUsXCJldmFsdWF0ZVwiLHt3cml0YWJsZTp0cnVlLGNvbmZpZ3VyYWJsZTp0cnVlLHZhbHVlOmZ1bmN0aW9uKGtleVBhdGhPckdldHRlcikge1widXNlIHN0cmljdFwiO1xuXHQgICAgcmV0dXJuIHRoaXMuX19ldmFsdWF0b3IuZXZhbHVhdGUodGhpcy5zdGF0ZSwga2V5UGF0aE9yR2V0dGVyKVxuXHQgIH19KTtcblxuXHQgIC8qKlxuXHQgICAqIEdldHMgdGhlIGNvZXJjZWQgc3RhdGUgKHRvIEpTIG9iamVjdCkgb2YgdGhlIHJlYWN0b3IuZXZhbHVhdGVcblx0ICAgKiBAcGFyYW0ge0tleVBhdGh8R2V0dGVyfSBrZXlQYXRoT3JHZXR0ZXJcblx0ICAgKiBAcmV0dXJuIHsqfVxuXHQgICAqL1xuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWFjdG9yLnByb3RvdHlwZSxcImV2YWx1YXRlVG9KU1wiLHt3cml0YWJsZTp0cnVlLGNvbmZpZ3VyYWJsZTp0cnVlLHZhbHVlOmZ1bmN0aW9uKGtleVBhdGhPckdldHRlcikge1widXNlIHN0cmljdFwiO1xuXHQgICAgcmV0dXJuIHRvSlModGhpcy5ldmFsdWF0ZShrZXlQYXRoT3JHZXR0ZXIpKVxuXHQgIH19KTtcblxuXHQgIC8qKlxuXHQgICAqIEFkZHMgYSBjaGFuZ2Ugb2JzZXJ2ZXIgd2hlbmV2ZXIgYSBjZXJ0YWluIHBhcnQgb2YgdGhlIHJlYWN0b3Igc3RhdGUgY2hhbmdlc1xuXHQgICAqXG5cdCAgICogMS4gb2JzZXJ2ZShoYW5kbGVyRm4pIC0gMSBhcmd1bWVudCwgY2FsbGVkIGFueXRpbWUgcmVhY3Rvci5zdGF0ZSBjaGFuZ2VzXG5cdCAgICogMi4gb2JzZXJ2ZShrZXlQYXRoLCBoYW5kbGVyRm4pIHNhbWUgYXMgYWJvdmVcblx0ICAgKiAzLiBvYnNlcnZlKGdldHRlciwgaGFuZGxlckZuKSBjYWxsZWQgd2hlbmV2ZXIgYW55IGdldHRlciBkZXBlbmRlbmNpZXMgY2hhbmdlIHdpdGhcblx0ICAgKiAgICB0aGUgdmFsdWUgb2YgdGhlIGdldHRlclxuXHQgICAqXG5cdCAgICogQWRkcyBhIGNoYW5nZSBoYW5kbGVyIHdoZW5ldmVyIGNlcnRhaW4gZGVwcyBjaGFuZ2Vcblx0ICAgKiBJZiBvbmx5IG9uZSBhcmd1bWVudCBpcyBwYXNzZWQgaW52b2tlZCB0aGUgaGFuZGxlciB3aGVuZXZlclxuXHQgICAqIHRoZSByZWFjdG9yIHN0YXRlIGNoYW5nZXNcblx0ICAgKlxuXHQgICAqIEBwYXJhbSB7S2V5UGF0aHxHZXR0ZXJ9IGdldHRlclxuXHQgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGhhbmRsZXJcblx0ICAgKiBAcmV0dXJuIHtmdW5jdGlvbn0gdW53YXRjaCBmdW5jdGlvblxuXHQgICAqL1xuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWFjdG9yLnByb3RvdHlwZSxcIm9ic2VydmVcIix7d3JpdGFibGU6dHJ1ZSxjb25maWd1cmFibGU6dHJ1ZSx2YWx1ZTpmdW5jdGlvbihnZXR0ZXIsIGhhbmRsZXIpIHtcInVzZSBzdHJpY3RcIjtcblx0ICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG5cdCAgICAgIGhhbmRsZXIgPSBnZXR0ZXJcblx0ICAgICAgZ2V0dGVyID0gR2V0dGVyLmZyb21LZXlQYXRoKFtdKVxuXHQgICAgfSBlbHNlIGlmIChLZXlQYXRoLmlzS2V5UGF0aChnZXR0ZXIpKSB7XG5cdCAgICAgIGdldHRlciA9IEdldHRlci5mcm9tS2V5UGF0aChnZXR0ZXIpXG5cdCAgICB9XG5cdCAgICByZXR1cm4gdGhpcy5fX2NoYW5nZU9ic2VydmVyLm9uQ2hhbmdlKGdldHRlciwgaGFuZGxlcilcblx0ICB9fSk7XG5cblxuXHQgIC8qKlxuXHQgICAqIERpc3BhdGNoZXMgYSBzaW5nbGUgbWVzc2FnZVxuXHQgICAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb25UeXBlXG5cdCAgICogQHBhcmFtIHtvYmplY3R8dW5kZWZpbmVkfSBwYXlsb2FkXG5cdCAgICovXG5cdCAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWN0b3IucHJvdG90eXBlLFwiZGlzcGF0Y2hcIix7d3JpdGFibGU6dHJ1ZSxjb25maWd1cmFibGU6dHJ1ZSx2YWx1ZTpmdW5jdGlvbihhY3Rpb25UeXBlLCBwYXlsb2FkKSB7XCJ1c2Ugc3RyaWN0XCI7XG5cdCAgICBpZiAodGhpcy5fX2JhdGNoRGVwdGggPT09IDApIHtcblx0ICAgICAgaWYgKHRoaXMuX19pc0Rpc3BhdGNoaW5nKSB7XG5cdCAgICAgICAgdGhpcy5fX2lzRGlzcGF0Y2hpbmcgPSBmYWxzZVxuXHQgICAgICAgIHRocm93IG5ldyBFcnJvcignRGlzcGF0Y2ggbWF5IG5vdCBiZSBjYWxsZWQgd2hpbGUgYSBkaXNwYXRjaCBpcyBpbiBwcm9ncmVzcycpXG5cdCAgICAgIH1cblx0ICAgICAgdGhpcy5fX2lzRGlzcGF0Y2hpbmcgPSB0cnVlXG5cdCAgICB9XG5cblx0ICAgIHZhciBwcmV2U3RhdGUgPSB0aGlzLnN0YXRlXG5cblx0ICAgIHRyeSB7XG5cdCAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLl9faGFuZGxlQWN0aW9uKHByZXZTdGF0ZSwgYWN0aW9uVHlwZSwgcGF5bG9hZClcblx0ICAgIH0gY2F0Y2ggKGUpIHtcblx0ICAgICAgdGhpcy5fX2lzRGlzcGF0Y2hpbmcgPSBmYWxzZVxuXHQgICAgICB0aHJvdyBlXG5cdCAgICB9XG5cblxuXHQgICAgaWYgKHRoaXMuX19iYXRjaERlcHRoID4gMCkge1xuXHQgICAgICB0aGlzLl9fYmF0Y2hEaXNwYXRjaENvdW50Kytcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGlmICh0aGlzLnN0YXRlICE9PSBwcmV2U3RhdGUpIHtcblx0ICAgICAgICB0cnkge1xuXHQgICAgICAgICAgdGhpcy5fX25vdGlmeSgpXG5cdCAgICAgICAgfSBjYXRjaCAoZSkge1xuXHQgICAgICAgICAgdGhpcy5fX2lzRGlzcGF0Y2hpbmcgPSBmYWxzZVxuXHQgICAgICAgICAgdGhyb3cgZVxuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXHQgICAgICB0aGlzLl9faXNEaXNwYXRjaGluZyA9IGZhbHNlXG5cdCAgICB9XG5cdCAgfX0pO1xuXG5cdCAgLyoqXG5cdCAgICogQWxsb3dzIGJhdGNoaW5nIG9mIGRpc3BhdGNoZXMgYmVmb3JlIG5vdGlmeWluZyBjaGFuZ2Ugb2JzZXJ2ZXJzXG5cdCAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cblx0ICAgKi9cblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhY3Rvci5wcm90b3R5cGUsXCJiYXRjaFwiLHt3cml0YWJsZTp0cnVlLGNvbmZpZ3VyYWJsZTp0cnVlLHZhbHVlOmZ1bmN0aW9uKGZuKSB7XCJ1c2Ugc3RyaWN0XCI7XG5cdCAgICB0aGlzLl9fYmF0Y2hTdGFydCgpXG5cdCAgICBmbigpXG5cdCAgICB0aGlzLl9fYmF0Y2hFbmQoKVxuXHQgIH19KTtcblxuXHQgIC8qKlxuXHQgICAqIEBkZXByZWNhdGVkXG5cdCAgICogQHBhcmFtIHtTdHJpbmd9IGlkXG5cdCAgICogQHBhcmFtIHtTdG9yZX0gc3RvcmVcblx0ICAgKi9cblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhY3Rvci5wcm90b3R5cGUsXCJyZWdpc3RlclN0b3JlXCIse3dyaXRhYmxlOnRydWUsY29uZmlndXJhYmxlOnRydWUsdmFsdWU6ZnVuY3Rpb24oaWQsIHN0b3JlKSB7XCJ1c2Ugc3RyaWN0XCI7XG5cdCAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5cdCAgICBjb25zb2xlLndhcm4oJ0RlcHJlY2F0aW9uIHdhcm5pbmc6IGByZWdpc3RlclN0b3JlYCB3aWxsIG5vIGxvbmdlciBiZSBzdXBwb3J0ZWQgaW4gMS4xLCB1c2UgYHJlZ2lzdGVyU3RvcmVzYCBpbnN0ZWFkJylcblx0ICAgIC8qIGVzbGludC1lbmFibGUgbm8tY29uc29sZSAqL1xuXHQgICAgdmFyIHN0b3JlcyA9IHt9XG5cdCAgICBzdG9yZXNbaWRdID0gc3RvcmVcblx0ICAgIHRoaXMucmVnaXN0ZXJTdG9yZXMoc3RvcmVzKVxuXHQgIH19KTtcblxuXHQgIC8qKlxuXHQgICAqIEBwYXJhbSB7U3RvcmVbXX0gc3RvcmVzXG5cdCAgICovXG5cdCAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWN0b3IucHJvdG90eXBlLFwicmVnaXN0ZXJTdG9yZXNcIix7d3JpdGFibGU6dHJ1ZSxjb25maWd1cmFibGU6dHJ1ZSx2YWx1ZTpmdW5jdGlvbihzdG9yZXMpIHtcInVzZSBzdHJpY3RcIjtcblx0ICAgIGVhY2goc3RvcmVzLCBmdW5jdGlvbihzdG9yZSwgaWQpICB7XG5cdCAgICAgIGlmICh0aGlzLl9fc3RvcmVzLmdldChpZCkpIHtcblx0ICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5cdCAgICAgICAgY29uc29sZS53YXJuKCdTdG9yZSBhbHJlYWR5IGRlZmluZWQgZm9yIGlkID0gJyArIGlkKVxuXHQgICAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tY29uc29sZSAqL1xuXHQgICAgICB9XG5cblx0ICAgICAgdmFyIGluaXRpYWxTdGF0ZSA9IHN0b3JlLmdldEluaXRpYWxTdGF0ZSgpXG5cblx0ICAgICAgaWYgKHRoaXMuZGVidWcgJiYgIWlzSW1tdXRhYmxlVmFsdWUoaW5pdGlhbFN0YXRlKSkge1xuXHQgICAgICAgIHRocm93IG5ldyBFcnJvcignU3RvcmUgZ2V0SW5pdGlhbFN0YXRlKCkgbXVzdCByZXR1cm4gYW4gaW1tdXRhYmxlIHZhbHVlLCBkaWQgeW91IGZvcmdldCB0byBjYWxsIHRvSW1tdXRhYmxlJylcblx0ICAgICAgfVxuXG5cdCAgICAgIHRoaXMuX19zdG9yZXMgPSB0aGlzLl9fc3RvcmVzLnNldChpZCwgc3RvcmUpXG5cdCAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLnN0YXRlLnNldChpZCwgaW5pdGlhbFN0YXRlKVxuXHQgICAgfS5iaW5kKHRoaXMpKVxuXG5cdCAgICB0aGlzLl9fbm90aWZ5KClcblx0ICB9fSk7XG5cblx0ICAvKipcblx0ICAgKiBSZXR1cm5zIGEgcGxhaW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgYXBwbGljYXRpb24gc3RhdGVcblx0ICAgKiBAcmV0dXJuIHtPYmplY3R9XG5cdCAgICovXG5cdCAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWN0b3IucHJvdG90eXBlLFwic2VyaWFsaXplXCIse3dyaXRhYmxlOnRydWUsY29uZmlndXJhYmxlOnRydWUsdmFsdWU6ZnVuY3Rpb24oKSB7XCJ1c2Ugc3RyaWN0XCI7XG5cdCAgICB2YXIgc2VyaWFsaXplZCA9IHt9XG5cdCAgICB0aGlzLl9fc3RvcmVzLmZvckVhY2goZnVuY3Rpb24oc3RvcmUsIGlkKSAge1xuXHQgICAgICB2YXIgc3RvcmVTdGF0ZSA9IHRoaXMuc3RhdGUuZ2V0KGlkKVxuXHQgICAgICB2YXIgc2VyaWFsaXplZFN0YXRlID0gc3RvcmUuc2VyaWFsaXplKHN0b3JlU3RhdGUpXG5cdCAgICAgIGlmIChzZXJpYWxpemVkU3RhdGUgIT09IHVuZGVmaW5lZCkge1xuXHQgICAgICAgIHNlcmlhbGl6ZWRbaWRdID0gc2VyaWFsaXplZFN0YXRlXG5cdCAgICAgIH1cblx0ICAgIH0uYmluZCh0aGlzKSlcblx0ICAgIHJldHVybiBzZXJpYWxpemVkXG5cdCAgfX0pO1xuXG5cdCAgLyoqXG5cdCAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlXG5cdCAgICovXG5cdCAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWN0b3IucHJvdG90eXBlLFwibG9hZFN0YXRlXCIse3dyaXRhYmxlOnRydWUsY29uZmlndXJhYmxlOnRydWUsdmFsdWU6ZnVuY3Rpb24oc3RhdGUpIHtcInVzZSBzdHJpY3RcIjtcblx0ICAgIHZhciBzdGF0ZVRvTG9hZCA9IHRvSW1tdXRhYmxlKHt9KS53aXRoTXV0YXRpb25zKGZ1bmN0aW9uKHN0YXRlVG9Mb2FkKSAge1xuXHQgICAgICBlYWNoKHN0YXRlLCBmdW5jdGlvbihzZXJpYWxpemVkU3RvcmVTdGF0ZSwgc3RvcmVJZCkgIHtcblx0ICAgICAgICB2YXIgc3RvcmUgPSB0aGlzLl9fc3RvcmVzLmdldChzdG9yZUlkKVxuXHQgICAgICAgIGlmIChzdG9yZSkge1xuXHQgICAgICAgICAgdmFyIHN0b3JlU3RhdGUgPSBzdG9yZS5kZXNlcmlhbGl6ZShzZXJpYWxpemVkU3RvcmVTdGF0ZSlcblx0ICAgICAgICAgIGlmIChzdG9yZVN0YXRlICE9PSB1bmRlZmluZWQpIHtcblx0ICAgICAgICAgICAgc3RhdGVUb0xvYWQuc2V0KHN0b3JlSWQsIHN0b3JlU3RhdGUpXG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICB9LmJpbmQodGhpcykpXG5cdCAgICB9LmJpbmQodGhpcykpXG5cblx0ICAgIHRoaXMuc3RhdGUgPSB0aGlzLnN0YXRlLm1lcmdlKHN0YXRlVG9Mb2FkKVxuXHQgICAgdGhpcy5fX25vdGlmeSgpXG5cdCAgfX0pO1xuXG5cdCAgLyoqXG5cdCAgICogUmVzZXRzIHRoZSBzdGF0ZSBvZiBhIHJlYWN0b3IgYW5kIHJldHVybnMgYmFjayB0byBpbml0aWFsIHN0YXRlXG5cdCAgICovXG5cdCAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFJlYWN0b3IucHJvdG90eXBlLFwicmVzZXRcIix7d3JpdGFibGU6dHJ1ZSxjb25maWd1cmFibGU6dHJ1ZSx2YWx1ZTpmdW5jdGlvbigpIHtcInVzZSBzdHJpY3RcIjtcblx0ICAgIHZhciBkZWJ1ZyA9IHRoaXMuZGVidWdcblx0ICAgIHZhciBwcmV2U3RhdGUgPSB0aGlzLnN0YXRlXG5cblx0ICAgIHRoaXMuc3RhdGUgPSBJbW11dGFibGUuTWFwKCkud2l0aE11dGF0aW9ucyhmdW5jdGlvbihzdGF0ZSkgIHtcblx0ICAgICAgdGhpcy5fX3N0b3Jlcy5mb3JFYWNoKGZ1bmN0aW9uKHN0b3JlLCBpZCkgIHtcblx0ICAgICAgICB2YXIgc3RvcmVTdGF0ZSA9IHByZXZTdGF0ZS5nZXQoaWQpXG5cdCAgICAgICAgdmFyIHJlc2V0U3RvcmVTdGF0ZSA9IHN0b3JlLmhhbmRsZVJlc2V0KHN0b3JlU3RhdGUpXG5cdCAgICAgICAgaWYgKGRlYnVnICYmIHJlc2V0U3RvcmVTdGF0ZSA9PT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0b3JlIGhhbmRsZVJlc2V0KCkgbXVzdCByZXR1cm4gYSB2YWx1ZSwgZGlkIHlvdSBmb3JnZXQgYSByZXR1cm4gc3RhdGVtZW50Jylcblx0ICAgICAgICB9XG5cdCAgICAgICAgaWYgKGRlYnVnICYmICFpc0ltbXV0YWJsZVZhbHVlKHJlc2V0U3RvcmVTdGF0ZSkpIHtcblx0ICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU3RvcmUgcmVzZXQgc3RhdGUgbXVzdCBiZSBhbiBpbW11dGFibGUgdmFsdWUsIGRpZCB5b3UgZm9yZ2V0IHRvIGNhbGwgdG9JbW11dGFibGUnKVxuXHQgICAgICAgIH1cblx0ICAgICAgICBzdGF0ZS5zZXQoaWQsIHJlc2V0U3RvcmVTdGF0ZSlcblx0ICAgICAgfSlcblx0ICAgIH0uYmluZCh0aGlzKSlcblxuXHQgICAgdGhpcy5fX2V2YWx1YXRvci5yZXNldCgpXG5cdCAgICB0aGlzLl9fY2hhbmdlT2JzZXJ2ZXIucmVzZXQodGhpcy5zdGF0ZSlcblx0ICB9fSk7XG5cblx0ICAvKipcblx0ICAgKiBOb3RpZmllcyBhbGwgY2hhbmdlIG9ic2VydmVycyB3aXRoIHRoZSBjdXJyZW50IHN0YXRlXG5cdCAgICogQHByaXZhdGVcblx0ICAgKi9cblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhY3Rvci5wcm90b3R5cGUsXCJfX25vdGlmeVwiLHt3cml0YWJsZTp0cnVlLGNvbmZpZ3VyYWJsZTp0cnVlLHZhbHVlOmZ1bmN0aW9uKCkge1widXNlIHN0cmljdFwiO1xuXHQgICAgdGhpcy5fX2NoYW5nZU9ic2VydmVyLm5vdGlmeU9ic2VydmVycyh0aGlzLnN0YXRlKVxuXHQgIH19KTtcblxuXHQgIC8qKlxuXHQgICAqIFJlZHVjZXMgdGhlIGN1cnJlbnQgc3RhdGUgdG8gdGhlIG5ldyBzdGF0ZSBnaXZlbiBhY3Rpb25UeXBlIC8gbWVzc2FnZVxuXHQgICAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb25UeXBlXG5cdCAgICogQHBhcmFtIHtvYmplY3R8dW5kZWZpbmVkfSBwYXlsb2FkXG5cdCAgICogQHJldHVybiB7SW1tdXRhYmxlLk1hcH1cblx0ICAgKi9cblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmVhY3Rvci5wcm90b3R5cGUsXCJfX2hhbmRsZUFjdGlvblwiLHt3cml0YWJsZTp0cnVlLGNvbmZpZ3VyYWJsZTp0cnVlLHZhbHVlOmZ1bmN0aW9uKHN0YXRlLCBhY3Rpb25UeXBlLCBwYXlsb2FkKSB7XCJ1c2Ugc3RyaWN0XCI7XG5cdCAgICByZXR1cm4gc3RhdGUud2l0aE11dGF0aW9ucyhmdW5jdGlvbihzdGF0ZSkgIHtcblx0ICAgICAgaWYgKHRoaXMuZGVidWcpIHtcblx0ICAgICAgICBsb2dnaW5nLmRpc3BhdGNoU3RhcnQoYWN0aW9uVHlwZSwgcGF5bG9hZClcblx0ICAgICAgfVxuXG5cdCAgICAgIC8vIGxldCBlYWNoIHN0b3JlIGhhbmRsZSB0aGUgbWVzc2FnZVxuXHQgICAgICB0aGlzLl9fc3RvcmVzLmZvckVhY2goZnVuY3Rpb24oc3RvcmUsIGlkKSAge1xuXHQgICAgICAgIHZhciBjdXJyU3RhdGUgPSBzdGF0ZS5nZXQoaWQpXG5cdCAgICAgICAgdmFyIG5ld1N0YXRlXG5cblx0ICAgICAgICB0cnkge1xuXHQgICAgICAgICAgbmV3U3RhdGUgPSBzdG9yZS5oYW5kbGUoY3VyclN0YXRlLCBhY3Rpb25UeXBlLCBwYXlsb2FkKVxuXHQgICAgICAgIH0gY2F0Y2goZSkge1xuXHQgICAgICAgICAgLy8gZW5zdXJlIGNvbnNvbGUuZ3JvdXAgaXMgcHJvcGVybHkgY2xvc2VkXG5cdCAgICAgICAgICBsb2dnaW5nLmRpc3BhdGNoRXJyb3IoZS5tZXNzYWdlKVxuXHQgICAgICAgICAgdGhyb3cgZVxuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmICh0aGlzLmRlYnVnICYmIG5ld1N0YXRlID09PSB1bmRlZmluZWQpIHtcblx0ICAgICAgICAgIHZhciBlcnJvck1zZyA9ICdTdG9yZSBoYW5kbGVyIG11c3QgcmV0dXJuIGEgdmFsdWUsIGRpZCB5b3UgZm9yZ2V0IGEgcmV0dXJuIHN0YXRlbWVudCdcblx0ICAgICAgICAgIGxvZ2dpbmcuZGlzcGF0Y2hFcnJvcihlcnJvck1zZylcblx0ICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvck1zZylcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBzdGF0ZS5zZXQoaWQsIG5ld1N0YXRlKVxuXG5cdCAgICAgICAgaWYgKHRoaXMuZGVidWcpIHtcblx0ICAgICAgICAgIGxvZ2dpbmcuc3RvcmVIYW5kbGVkKGlkLCBjdXJyU3RhdGUsIG5ld1N0YXRlKVxuXHQgICAgICAgIH1cblx0ICAgICAgfS5iaW5kKHRoaXMpKVxuXG5cdCAgICAgIGlmICh0aGlzLmRlYnVnKSB7XG5cdCAgICAgICAgbG9nZ2luZy5kaXNwYXRjaEVuZChzdGF0ZSlcblx0ICAgICAgfVxuXHQgICAgfS5iaW5kKHRoaXMpKVxuXHQgIH19KTtcblxuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWFjdG9yLnByb3RvdHlwZSxcIl9fYmF0Y2hTdGFydFwiLHt3cml0YWJsZTp0cnVlLGNvbmZpZ3VyYWJsZTp0cnVlLHZhbHVlOmZ1bmN0aW9uKCkge1widXNlIHN0cmljdFwiO1xuXHQgICAgdGhpcy5fX2JhdGNoRGVwdGgrK1xuXHQgIH19KTtcblxuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWFjdG9yLnByb3RvdHlwZSxcIl9fYmF0Y2hFbmRcIix7d3JpdGFibGU6dHJ1ZSxjb25maWd1cmFibGU6dHJ1ZSx2YWx1ZTpmdW5jdGlvbigpIHtcInVzZSBzdHJpY3RcIjtcblx0ICAgIHRoaXMuX19iYXRjaERlcHRoLS1cblxuXHQgICAgaWYgKHRoaXMuX19iYXRjaERlcHRoIDw9IDApIHtcblx0ICAgICAgaWYgKHRoaXMuX19iYXRjaERpc3BhdGNoQ291bnQgPiAwKSB7XG5cdCAgICAgICAgLy8gc2V0IHRvIHRydWUgdG8gY2F0Y2ggaWYgZGlzcGF0Y2ggY2FsbGVkIGZyb20gb2JzZXJ2ZXJcblx0ICAgICAgICB0aGlzLl9faXNEaXNwYXRjaGluZyA9IHRydWVcblx0ICAgICAgICB0cnkge1xuXHQgICAgICAgICAgdGhpcy5fX25vdGlmeSgpXG5cdCAgICAgICAgfSBjYXRjaCAoZSkge1xuXHQgICAgICAgICAgdGhpcy5fX2lzRGlzcGF0Y2hpbmcgPSBmYWxzZVxuXHQgICAgICAgICAgdGhyb3cgZVxuXHQgICAgICAgIH1cblx0ICAgICAgICB0aGlzLl9faXNEaXNwYXRjaGluZyA9IGZhbHNlXG5cdCAgICAgIH1cblx0ICAgICAgdGhpcy5fX2JhdGNoRGlzcGF0Y2hDb3VudCA9IDBcblx0ICAgIH1cblx0ICB9fSk7XG5cblxuXHRtb2R1bGUuZXhwb3J0cyA9IFJlYWN0b3JcblxuXG4vKioqLyB9LFxuLyogNSAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuXHQvKipcblx0ICogV3JhcHMgYSBSZWFjdG9yLnJlYWN0IGludm9jYXRpb24gaW4gYSBjb25zb2xlLmdyb3VwXG5cdCovXG5cdGV4cG9ydHMuZGlzcGF0Y2hTdGFydCA9IGZ1bmN0aW9uKHR5cGUsIHBheWxvYWQpIHtcblx0ICBpZiAoY29uc29sZS5ncm91cCkge1xuXHQgICAgY29uc29sZS5ncm91cENvbGxhcHNlZCgnRGlzcGF0Y2g6ICVzJywgdHlwZSlcblx0ICAgIGNvbnNvbGUuZ3JvdXAoJ3BheWxvYWQnKVxuXHQgICAgY29uc29sZS5kZWJ1ZyhwYXlsb2FkKVxuXHQgICAgY29uc29sZS5ncm91cEVuZCgpXG5cdCAgfVxuXHR9XG5cblx0ZXhwb3J0cy5kaXNwYXRjaEVycm9yID0gZnVuY3Rpb24oZXJyb3IpIHtcblx0ICBpZiAoY29uc29sZS5ncm91cCkge1xuXHQgICAgY29uc29sZS5kZWJ1ZygnRGlzcGF0Y2ggZXJyb3I6ICcgKyBlcnJvcilcblx0ICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuXHQgIH1cblx0fVxuXG5cdGV4cG9ydHMuc3RvcmVIYW5kbGVkID0gZnVuY3Rpb24oaWQsIGJlZm9yZSwgYWZ0ZXIpIHtcblx0ICBpZiAoY29uc29sZS5ncm91cCkge1xuXHQgICAgaWYgKGJlZm9yZSAhPT0gYWZ0ZXIpIHtcblx0ICAgICAgY29uc29sZS5kZWJ1ZygnU3RvcmUgJyArIGlkICsgJyBoYW5kbGVkIGFjdGlvbicpXG5cdCAgICB9XG5cdCAgfVxuXHR9XG5cblx0ZXhwb3J0cy5kaXNwYXRjaEVuZCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG5cdCAgaWYgKGNvbnNvbGUuZ3JvdXApIHtcblx0ICAgIGNvbnNvbGUuZGVidWcoJ0Rpc3BhdGNoIGRvbmUsIG5ldyBzdGF0ZTogJywgc3RhdGUudG9KUygpKVxuXHQgICAgY29uc29sZS5ncm91cEVuZCgpXG5cdCAgfVxuXHR9XG5cdC8qIGVzbGludC1lbmFibGUgbm8tY29uc29sZSAqL1xuXG5cbi8qKiovIH0sXG4vKiA2ICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgSW1tdXRhYmxlID0gX193ZWJwYWNrX3JlcXVpcmVfXygyKVxuXHR2YXIgaGFzaENvZGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDcpXG5cdHZhciBpc0VxdWFsID0gX193ZWJwYWNrX3JlcXVpcmVfXyg4KVxuXG5cdC8qKlxuXHQgKiBDaGFuZ2VPYnNlcnZlciBpcyBhbiBvYmplY3QgdGhhdCBjb250YWlucyBhIHNldCBvZiBzdWJzY3JpcHRpb25zXG5cdCAqIHRvIGNoYW5nZXMgZm9yIGtleVBhdGhzIG9uIGEgcmVhY3RvclxuXHQgKlxuXHQgKiBQYWNrYWdpbmcgdGhlIGhhbmRsZXJzIHRvZ2V0aGVyIGFsbG93cyBmb3IgZWFzaWVyIGNsZWFudXBcblx0ICovXG5cblx0ICAvKipcblx0ICAgKiBAcGFyYW0ge0ltbXV0YWJsZS5NYXB9IGluaXRpYWxTdGF0ZVxuXHQgICAqIEBwYXJhbSB7RXZhbHVhdG9yfSBldmFsdWF0b3Jcblx0ICAgKi9cblx0ICBmdW5jdGlvbiBDaGFuZ2VPYnNlcnZlcihpbml0aWFsU3RhdGUsIGV2YWx1YXRvcikge1widXNlIHN0cmljdFwiO1xuXHQgICAgdGhpcy5fX3ByZXZTdGF0ZSA9IGluaXRpYWxTdGF0ZVxuXHQgICAgdGhpcy5fX2V2YWx1YXRvciA9IGV2YWx1YXRvclxuXHQgICAgdGhpcy5fX3ByZXZWYWx1ZXMgPSBJbW11dGFibGUuTWFwKClcblx0ICAgIHRoaXMuX19vYnNlcnZlcnMgPSBbXVxuXHQgIH1cblxuXHQgIC8qKlxuXHQgICAqIEBwYXJhbSB7SW1tdXRhYmxlLk1hcH0gbmV3U3RhdGVcblx0ICAgKi9cblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ2hhbmdlT2JzZXJ2ZXIucHJvdG90eXBlLFwibm90aWZ5T2JzZXJ2ZXJzXCIse3dyaXRhYmxlOnRydWUsY29uZmlndXJhYmxlOnRydWUsdmFsdWU6ZnVuY3Rpb24obmV3U3RhdGUpIHtcInVzZSBzdHJpY3RcIjtcblx0ICAgIGlmICh0aGlzLl9fb2JzZXJ2ZXJzLmxlbmd0aCA+IDApIHtcblx0ICAgICAgdmFyIGN1cnJlbnRWYWx1ZXMgPSBJbW11dGFibGUuTWFwKClcblxuXHQgICAgICB0aGlzLl9fb2JzZXJ2ZXJzLmZvckVhY2goZnVuY3Rpb24oZW50cnkpICB7XG5cdCAgICAgICAgdmFyIGdldHRlciA9IGVudHJ5LmdldHRlclxuXHQgICAgICAgIHZhciBjb2RlID0gaGFzaENvZGUoZ2V0dGVyKVxuXHQgICAgICAgIHZhciBwcmV2U3RhdGUgPSB0aGlzLl9fcHJldlN0YXRlXG5cdCAgICAgICAgdmFyIHByZXZWYWx1ZVxuXG5cdCAgICAgICAgaWYgKHRoaXMuX19wcmV2VmFsdWVzLmhhcyhjb2RlKSkge1xuXHQgICAgICAgICAgcHJldlZhbHVlID0gdGhpcy5fX3ByZXZWYWx1ZXMuZ2V0KGNvZGUpXG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIHByZXZWYWx1ZSA9IHRoaXMuX19ldmFsdWF0b3IuZXZhbHVhdGUocHJldlN0YXRlLCBnZXR0ZXIpXG5cdCAgICAgICAgICB0aGlzLl9fcHJldlZhbHVlcyA9IHRoaXMuX19wcmV2VmFsdWVzLnNldChjb2RlLCBwcmV2VmFsdWUpXG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdmFyIGN1cnJWYWx1ZSA9IHRoaXMuX19ldmFsdWF0b3IuZXZhbHVhdGUobmV3U3RhdGUsIGdldHRlcilcblxuXHQgICAgICAgIGlmICghaXNFcXVhbChwcmV2VmFsdWUsIGN1cnJWYWx1ZSkpIHtcblx0ICAgICAgICAgIGVudHJ5LmhhbmRsZXIuY2FsbChudWxsLCBjdXJyVmFsdWUpXG5cdCAgICAgICAgICBjdXJyZW50VmFsdWVzID0gY3VycmVudFZhbHVlcy5zZXQoY29kZSwgY3VyclZhbHVlKVxuXHQgICAgICAgIH1cblx0ICAgICAgfS5iaW5kKHRoaXMpKVxuXG5cdCAgICAgIHRoaXMuX19wcmV2VmFsdWVzID0gY3VycmVudFZhbHVlc1xuXHQgICAgfVxuXHQgICAgdGhpcy5fX3ByZXZTdGF0ZSA9IG5ld1N0YXRlXG5cdCAgfX0pO1xuXG5cdCAgLyoqXG5cdCAgICogU3BlY2lmeSBhIGdldHRlciBhbmQgYSBjaGFuZ2UgaGFuZGxlciBmdW5jdGlvblxuXHQgICAqIEhhbmRsZXIgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW5ldmVyIHRoZSB2YWx1ZSBvZiB0aGUgZ2V0dGVyIGNoYW5nZXNcblx0ICAgKiBAcGFyYW0ge0dldHRlcn0gZ2V0dGVyXG5cdCAgICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlclxuXHQgICAqIEByZXR1cm4ge2Z1bmN0aW9ufSB1bndhdGNoIGZ1bmN0aW9uXG5cdCAgICovXG5cdCAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENoYW5nZU9ic2VydmVyLnByb3RvdHlwZSxcIm9uQ2hhbmdlXCIse3dyaXRhYmxlOnRydWUsY29uZmlndXJhYmxlOnRydWUsdmFsdWU6ZnVuY3Rpb24oZ2V0dGVyLCBoYW5kbGVyKSB7XCJ1c2Ugc3RyaWN0XCI7XG5cdCAgICAvLyBUT0RPOiBtYWtlIG9ic2VydmVycyBhIG1hcCBvZiA8R2V0dGVyPiA9PiB7IGhhbmRsZXJzIH1cblx0ICAgIHZhciBlbnRyeSA9IHtcblx0ICAgICAgZ2V0dGVyOiBnZXR0ZXIsXG5cdCAgICAgIGhhbmRsZXI6IGhhbmRsZXIsXG5cdCAgICB9XG5cdCAgICB0aGlzLl9fb2JzZXJ2ZXJzLnB1c2goZW50cnkpXG5cdCAgICAvLyByZXR1cm4gdW53YXRjaCBmdW5jdGlvblxuXHQgICAgcmV0dXJuIGZ1bmN0aW9uKCkgIHtcblx0ICAgICAgLy8gVE9ETzogdW50cmFjayBmcm9tIGNoYW5nZSBlbWl0dGVyXG5cdCAgICAgIHZhciBpbmQgPSB0aGlzLl9fb2JzZXJ2ZXJzLmluZGV4T2YoZW50cnkpXG5cdCAgICAgIGlmIChpbmQgPiAtMSkge1xuXHQgICAgICAgIHRoaXMuX19vYnNlcnZlcnMuc3BsaWNlKGluZCwgMSlcblx0ICAgICAgfVxuXHQgICAgfS5iaW5kKHRoaXMpXG5cdCAgfX0pO1xuXG5cdCAgLyoqXG5cdCAgICogUmVzZXRzIGFuZCBjbGVhcnMgYWxsIG9ic2VydmVycyBhbmQgcmVpbml0aWFsaXplcyBiYWNrIHRvIHRoZSBzdXBwbGllZFxuXHQgICAqIHByZXZpb3VzIHN0YXRlXG5cdCAgICogQHBhcmFtIHtJbW11dGFibGUuTWFwfSBwcmV2U3RhdGVcblx0ICAgKlxuXHQgICAqL1xuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDaGFuZ2VPYnNlcnZlci5wcm90b3R5cGUsXCJyZXNldFwiLHt3cml0YWJsZTp0cnVlLGNvbmZpZ3VyYWJsZTp0cnVlLHZhbHVlOmZ1bmN0aW9uKHByZXZTdGF0ZSkge1widXNlIHN0cmljdFwiO1xuXHQgICAgdGhpcy5fX3ByZXZTdGF0ZSA9IHByZXZTdGF0ZVxuXHQgICAgdGhpcy5fX3ByZXZWYWx1ZXMgPSBJbW11dGFibGUuTWFwKClcblx0ICAgIHRoaXMuX19vYnNlcnZlcnMgPSBbXVxuXHQgIH19KTtcblxuXG5cdG1vZHVsZS5leHBvcnRzID0gQ2hhbmdlT2JzZXJ2ZXJcblxuXG4vKioqLyB9LFxuLyogNyAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIEltbXV0YWJsZSA9IF9fd2VicGFja19yZXF1aXJlX18oMilcblxuXHQvKipcblx0ICogVGFrZXMgYSBnZXR0ZXIgYW5kIHJldHVybnMgdGhlIGhhc2ggY29kZSB2YWx1ZVxuXHQgKlxuXHQgKiBJZiBjYWNoZSBhcmd1bWVudCBpcyB0cnVlIGl0IHdpbGwgZnJlZXplIHRoZSBnZXR0ZXJcblx0ICogYW5kIGNhY2hlIHRoZSBoYXNoZWQgdmFsdWVcblx0ICpcblx0ICogQHBhcmFtIHtHZXR0ZXJ9IGdldHRlclxuXHQgKiBAcGFyYW0ge2Jvb2xlYW59IGRvbnRDYWNoZVxuXHQgKiBAcmV0dXJuIHtudW1iZXJ9XG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGdldHRlciwgZG9udENhY2hlKSB7XG5cdCAgaWYgKGdldHRlci5oYXNPd25Qcm9wZXJ0eSgnX19oYXNoQ29kZScpKSB7XG5cdCAgICByZXR1cm4gZ2V0dGVyLl9faGFzaENvZGVcblx0ICB9XG5cblx0ICB2YXIgaGFzaENvZGUgPSBJbW11dGFibGUuZnJvbUpTKGdldHRlcikuaGFzaENvZGUoKVxuXG5cdCAgaWYgKCFkb250Q2FjaGUpIHtcblx0ICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShnZXR0ZXIsICdfX2hhc2hDb2RlJywge1xuXHQgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcblx0ICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcblx0ICAgICAgd3JpdGFibGU6IGZhbHNlLFxuXHQgICAgICB2YWx1ZTogaGFzaENvZGUsXG5cdCAgICB9KVxuXG5cdCAgICBPYmplY3QuZnJlZXplKGdldHRlcilcblx0ICB9XG5cblx0ICByZXR1cm4gaGFzaENvZGVcblx0fVxuXG5cbi8qKiovIH0sXG4vKiA4ICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgSW1tdXRhYmxlID0gX193ZWJwYWNrX3JlcXVpcmVfXygyKVxuXHQvKipcblx0ICogSXMgZXF1YWwgYnkgdmFsdWUgY2hlY2tcblx0ICovXG5cdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYSwgYikge1xuXHQgIHJldHVybiBJbW11dGFibGUuaXMoYSwgYilcblx0fVxuXG5cbi8qKiovIH0sXG4vKiA5ICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgaXNGdW5jdGlvbiA9IF9fd2VicGFja19yZXF1aXJlX18oMykuaXNGdW5jdGlvblxuXHR2YXIgaXNBcnJheSA9IF9fd2VicGFja19yZXF1aXJlX18oMykuaXNBcnJheVxuXHR2YXIgaXNLZXlQYXRoID0gX193ZWJwYWNrX3JlcXVpcmVfXygxMCkuaXNLZXlQYXRoXG5cblx0LyoqXG5cdCAqIEdldHRlciBoZWxwZXIgZnVuY3Rpb25zXG5cdCAqIEEgZ2V0dGVyIGlzIGFuIGFycmF5IHdpdGggdGhlIGZvcm06XG5cdCAqIFs8S2V5UGF0aD4sIC4uLjxLZXlQYXRoPiwgPGZ1bmN0aW9uPl1cblx0ICovXG5cdHZhciBpZGVudGl0eSA9IGZ1bmN0aW9uKHgpICB7cmV0dXJuIHg7fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgc29tZXRoaW5nIGlzIGEgZ2V0dGVyIGxpdGVyYWwsIGV4OiBbJ2RlcDEnLCAnZGVwMicsIGZ1bmN0aW9uKGRlcDEsIGRlcDIpIHsuLi59XVxuXHQgKiBAcGFyYW0geyp9IHRvVGVzdFxuXHQgKiBAcmV0dXJuIHtib29sZWFufVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNHZXR0ZXIodG9UZXN0KSB7XG5cdCAgcmV0dXJuIChpc0FycmF5KHRvVGVzdCkgJiYgaXNGdW5jdGlvbih0b1Rlc3RbdG9UZXN0Lmxlbmd0aCAtIDFdKSlcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBjb21wdXRlIGZ1bmN0aW9uIGZyb20gYSBnZXR0ZXJcblx0ICogQHBhcmFtIHtHZXR0ZXJ9IGdldHRlclxuXHQgKiBAcmV0dXJuIHtmdW5jdGlvbn1cblx0ICovXG5cdGZ1bmN0aW9uIGdldENvbXB1dGVGbihnZXR0ZXIpIHtcblx0ICByZXR1cm4gZ2V0dGVyW2dldHRlci5sZW5ndGggLSAxXVxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYW4gYXJyYXkgb2YgZGVwcyBmcm9tIGEgZ2V0dGVyXG5cdCAqIEBwYXJhbSB7R2V0dGVyfSBnZXR0ZXJcblx0ICogQHJldHVybiB7ZnVuY3Rpb259XG5cdCAqL1xuXHRmdW5jdGlvbiBnZXREZXBzKGdldHRlcikge1xuXHQgIHJldHVybiBnZXR0ZXIuc2xpY2UoMCwgZ2V0dGVyLmxlbmd0aCAtIDEpXG5cdH1cblxuXHQvKipcblx0ICogQHBhcmFtIHtLZXlQYXRofVxuXHQgKiBAcmV0dXJuIHtHZXR0ZXJ9XG5cdCAqL1xuXHRmdW5jdGlvbiBmcm9tS2V5UGF0aChrZXlQYXRoKSB7XG5cdCAgaWYgKCFpc0tleVBhdGgoa2V5UGF0aCkpIHtcblx0ICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNyZWF0ZSBHZXR0ZXIgZnJvbSBLZXlQYXRoOiAnICsga2V5UGF0aClcblx0ICB9XG5cblx0ICByZXR1cm4gW2tleVBhdGgsIGlkZW50aXR5XVxuXHR9XG5cblxuXHRtb2R1bGUuZXhwb3J0cyA9IHtcblx0ICBpc0dldHRlcjogaXNHZXR0ZXIsXG5cdCAgZ2V0Q29tcHV0ZUZuOiBnZXRDb21wdXRlRm4sXG5cdCAgZ2V0RGVwczogZ2V0RGVwcyxcblx0ICBmcm9tS2V5UGF0aDogZnJvbUtleVBhdGgsXG5cdH1cblxuXG4vKioqLyB9LFxuLyogMTAgKi9cbi8qKiovIGZ1bmN0aW9uKG1vZHVsZSwgZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG5cdHZhciBpc0FycmF5ID0gX193ZWJwYWNrX3JlcXVpcmVfXygzKS5pc0FycmF5XG5cdHZhciBpc0Z1bmN0aW9uID0gX193ZWJwYWNrX3JlcXVpcmVfXygzKS5pc0Z1bmN0aW9uXG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiBzb21ldGhpbmcgaXMgc2ltcGx5IGEga2V5UGF0aCBhbmQgbm90IGEgZ2V0dGVyXG5cdCAqIEBwYXJhbSB7Kn0gdG9UZXN0XG5cdCAqIEByZXR1cm4ge2Jvb2xlYW59XG5cdCAqL1xuXHRleHBvcnRzLmlzS2V5UGF0aCA9IGZ1bmN0aW9uKHRvVGVzdCkge1xuXHQgIHJldHVybiAoXG5cdCAgICBpc0FycmF5KHRvVGVzdCkgJiZcblx0ICAgICFpc0Z1bmN0aW9uKHRvVGVzdFt0b1Rlc3QubGVuZ3RoIC0gMV0pXG5cdCAgKVxuXHR9XG5cblxuLyoqKi8gfSxcbi8qIDExICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgSW1tdXRhYmxlID0gX193ZWJwYWNrX3JlcXVpcmVfXygyKVxuXHR2YXIgdG9JbW11dGFibGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpLnRvSW1tdXRhYmxlXG5cdHZhciBoYXNoQ29kZSA9IF9fd2VicGFja19yZXF1aXJlX18oNylcblx0dmFyIGlzRXF1YWwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDgpXG5cdHZhciBnZXRDb21wdXRlRm4gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDkpLmdldENvbXB1dGVGblxuXHR2YXIgZ2V0RGVwcyA9IF9fd2VicGFja19yZXF1aXJlX18oOSkuZ2V0RGVwc1xuXHR2YXIgaXNLZXlQYXRoID0gX193ZWJwYWNrX3JlcXVpcmVfXygxMCkuaXNLZXlQYXRoXG5cdHZhciBpc0dldHRlciA9IF9fd2VicGFja19yZXF1aXJlX18oOSkuaXNHZXR0ZXJcblxuXHQvLyBLZWVwIHRyYWNrIG9mIHdoZXRoZXIgd2UgYXJlIGN1cnJlbnRseSBleGVjdXRpbmcgYSBHZXR0ZXIncyBjb21wdXRlRm5cblx0dmFyIF9fYXBwbHlpbmdDb21wdXRlRm4gPSBmYWxzZVxuXG5cblx0ICBmdW5jdGlvbiBFdmFsdWF0b3IoKSB7XCJ1c2Ugc3RyaWN0XCI7XG5cdCAgICAvKipcblx0ICAgICAqIHtcblx0ICAgICAqICAgPGhhc2hDb2RlPjoge1xuXHQgICAgICogICAgIHN0YXRlSGFzaENvZGU6IG51bWJlcixcblx0ICAgICAqICAgICBhcmdzOiBJbW11dGFibGUuTGlzdCxcblx0ICAgICAqICAgICB2YWx1ZTogYW55LFxuXHQgICAgICogICB9XG5cdCAgICAgKiB9XG5cdCAgICAgKi9cblx0ICAgIHRoaXMuX19jYWNoZWRHZXR0ZXJzID0gSW1tdXRhYmxlLk1hcCh7fSlcblx0ICB9XG5cblx0ICAvKipcblx0ICAgKiBUYWtlcyBlaXRoZXIgYSBLZXlQYXRoIG9yIEdldHRlciBhbmQgZXZhbHVhdGVzXG5cdCAgICpcblx0ICAgKiBLZXlQYXRoIGZvcm06XG5cdCAgICogWydmb28nLCAnYmFyJ10gPT4gc3RhdGUuZ2V0SW4oWydmb28nLCAnYmFyJ10pXG5cdCAgICpcblx0ICAgKiBHZXR0ZXIgZm9ybTpcblx0ICAgKiBbPEtleVBhdGg+LCA8S2V5UGF0aD4sIC4uLiwgPGZ1bmN0aW9uPl1cblx0ICAgKlxuXHQgICAqIEBwYXJhbSB7SW1tdXRhYmxlLk1hcH0gc3RhdGVcblx0ICAgKiBAcGFyYW0ge3N0cmluZ3xhcnJheX0gZ2V0dGVyXG5cdCAgICogQHJldHVybiB7YW55fVxuXHQgICAqL1xuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFdmFsdWF0b3IucHJvdG90eXBlLFwiZXZhbHVhdGVcIix7d3JpdGFibGU6dHJ1ZSxjb25maWd1cmFibGU6dHJ1ZSx2YWx1ZTpmdW5jdGlvbihzdGF0ZSwga2V5UGF0aE9yR2V0dGVyKSB7XCJ1c2Ugc3RyaWN0XCI7XG5cdCAgICBpZiAoaXNLZXlQYXRoKGtleVBhdGhPckdldHRlcikpIHtcblx0ICAgICAgLy8gaWYgaXRzIGEga2V5UGF0aCBzaW1wbHkgcmV0dXJuXG5cdCAgICAgIHJldHVybiBzdGF0ZS5nZXRJbihrZXlQYXRoT3JHZXR0ZXIpXG5cdCAgICB9IGVsc2UgaWYgKCFpc0dldHRlcihrZXlQYXRoT3JHZXR0ZXIpKSB7XG5cdCAgICAgIHRocm93IG5ldyBFcnJvcignZXZhbHVhdGUgbXVzdCBiZSBwYXNzZWQgYSBrZXlQYXRoIG9yIEdldHRlcicpXG5cdCAgICB9XG5cblx0ICAgIC8vIE11c3QgYmUgYSBHZXR0ZXJcblx0ICAgIHZhciBjb2RlID0gaGFzaENvZGUoa2V5UGF0aE9yR2V0dGVyKVxuXG5cdCAgICAvLyBpZiB0aGUgdmFsdWUgaXMgY2FjaGVkIGZvciB0aGlzIGRpc3BhdGNoIGN5Y2xlLCByZXR1cm4gdGhlIGNhY2hlZCB2YWx1ZVxuXHQgICAgaWYgKHRoaXMuX19pc0NhY2hlZChzdGF0ZSwga2V5UGF0aE9yR2V0dGVyKSkge1xuXHQgICAgICAvLyBDYWNoZSBoaXRcblx0ICAgICAgcmV0dXJuIHRoaXMuX19jYWNoZWRHZXR0ZXJzLmdldEluKFtjb2RlLCAndmFsdWUnXSlcblxuXHQgICAgfVxuXG5cdCAgICAvLyBldmFsdWF0ZSBkZXBlbmRlbmNpZXNcblx0ICAgIHZhciBhcmdzID0gZ2V0RGVwcyhrZXlQYXRoT3JHZXR0ZXIpLm1hcChmdW5jdGlvbihkZXApICB7cmV0dXJuIHRoaXMuZXZhbHVhdGUoc3RhdGUsIGRlcCk7fS5iaW5kKHRoaXMpKVxuXG5cdCAgICBpZiAodGhpcy5fX2hhc1N0YWxlVmFsdWUoc3RhdGUsIGtleVBhdGhPckdldHRlcikpIHtcblx0ICAgICAgLy8gZ2V0dGVyIGRlcHMgY291bGQgc3RpbGwgYmUgdW5jaGFuZ2VkIHNpbmNlIHdlIG9ubHkgbG9va2VkIGF0IHRoZSB1bndyYXBwZWQgKGtleXBhdGgsIGJvdHRvbSBsZXZlbCkgZGVwc1xuXHQgICAgICB2YXIgcHJldkFyZ3MgPSB0aGlzLl9fY2FjaGVkR2V0dGVycy5nZXRJbihbY29kZSwgJ2FyZ3MnXSlcblxuXHQgICAgICAvLyBzaW5jZSBHZXR0ZXIgaXMgYSBwdXJlIGZ1bmN0aW9ucyBpZiB0aGUgYXJncyBhcmUgdGhlIHNhbWUgaXRzIGEgY2FjaGUgaGl0XG5cdCAgICAgIGlmIChpc0VxdWFsKHByZXZBcmdzLCB0b0ltbXV0YWJsZShhcmdzKSkpIHtcblx0ICAgICAgICB2YXIgcHJldlZhbHVlID0gdGhpcy5fX2NhY2hlZEdldHRlcnMuZ2V0SW4oW2NvZGUsICd2YWx1ZSddKVxuXHQgICAgICAgIHRoaXMuX19jYWNoZVZhbHVlKHN0YXRlLCBrZXlQYXRoT3JHZXR0ZXIsIHByZXZBcmdzLCBwcmV2VmFsdWUpXG5cdCAgICAgICAgcmV0dXJuIHByZXZWYWx1ZVxuXHQgICAgICB9XG5cdCAgICB9XG5cblx0ICAgIC8vIFRoaXMgaW5kaWNhdGVzIHRoYXQgd2UgaGF2ZSBjYWxsZWQgZXZhbHVhdGUgd2l0aGluIHRoZSBib2R5IG9mIGEgY29tcHV0ZUZuLlxuXHQgICAgLy8gVGhyb3cgYW4gZXJyb3IgYXMgdGhpcyB3aWxsIGxlYWQgdG8gaW5jb25zaXN0ZW50IGNhY2hpbmdcblx0ICAgIGlmIChfX2FwcGx5aW5nQ29tcHV0ZUZuID09PSB0cnVlKSB7XG5cdCAgICAgIF9fYXBwbHlpbmdDb21wdXRlRm4gPSBmYWxzZVxuXHQgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V2YWx1YXRlIG1heSBub3QgYmUgY2FsbGVkIHdpdGhpbiBhIEdldHRlcnMgY29tcHV0ZUZuJylcblx0ICAgIH1cblxuXHQgICAgdmFyIGV2YWx1YXRlZFZhbHVlXG5cdCAgICBfX2FwcGx5aW5nQ29tcHV0ZUZuID0gdHJ1ZVxuXHQgICAgdHJ5IHtcblx0ICAgICAgZXZhbHVhdGVkVmFsdWUgPSBnZXRDb21wdXRlRm4oa2V5UGF0aE9yR2V0dGVyKS5hcHBseShudWxsLCBhcmdzKVxuXHQgICAgICBfX2FwcGx5aW5nQ29tcHV0ZUZuID0gZmFsc2Vcblx0ICAgIH0gY2F0Y2ggKGUpIHtcblx0ICAgICAgX19hcHBseWluZ0NvbXB1dGVGbiA9IGZhbHNlXG5cdCAgICAgIHRocm93IGVcblx0ICAgIH1cblxuXHQgICAgdGhpcy5fX2NhY2hlVmFsdWUoc3RhdGUsIGtleVBhdGhPckdldHRlciwgYXJncywgZXZhbHVhdGVkVmFsdWUpXG5cblx0ICAgIHJldHVybiBldmFsdWF0ZWRWYWx1ZVxuXHQgIH19KTtcblxuXHQgIC8qKlxuXHQgICAqIEBwYXJhbSB7SW1tdXRhYmxlLk1hcH0gc3RhdGVcblx0ICAgKiBAcGFyYW0ge0dldHRlcn0gZ2V0dGVyXG5cdCAgICovXG5cdCAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEV2YWx1YXRvci5wcm90b3R5cGUsXCJfX2hhc1N0YWxlVmFsdWVcIix7d3JpdGFibGU6dHJ1ZSxjb25maWd1cmFibGU6dHJ1ZSx2YWx1ZTpmdW5jdGlvbihzdGF0ZSwgZ2V0dGVyKSB7XCJ1c2Ugc3RyaWN0XCI7XG5cdCAgICB2YXIgY29kZSA9IGhhc2hDb2RlKGdldHRlcilcblx0ICAgIHZhciBjYWNoZSA9IHRoaXMuX19jYWNoZWRHZXR0ZXJzXG5cdCAgICByZXR1cm4gKFxuXHQgICAgICBjYWNoZS5oYXMoY29kZSkgJiZcblx0ICAgICAgY2FjaGUuZ2V0SW4oW2NvZGUsICdzdGF0ZUhhc2hDb2RlJ10pICE9PSBzdGF0ZS5oYXNoQ29kZSgpXG5cdCAgICApXG5cdCAgfX0pO1xuXG5cdCAgLyoqXG5cdCAgICogQ2FjaGVzIHRoZSB2YWx1ZSBvZiBhIGdldHRlciBnaXZlbiBzdGF0ZSwgZ2V0dGVyLCBhcmdzLCB2YWx1ZVxuXHQgICAqIEBwYXJhbSB7SW1tdXRhYmxlLk1hcH0gc3RhdGVcblx0ICAgKiBAcGFyYW0ge0dldHRlcn0gZ2V0dGVyXG5cdCAgICogQHBhcmFtIHtBcnJheX0gYXJnc1xuXHQgICAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuXHQgICAqL1xuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFdmFsdWF0b3IucHJvdG90eXBlLFwiX19jYWNoZVZhbHVlXCIse3dyaXRhYmxlOnRydWUsY29uZmlndXJhYmxlOnRydWUsdmFsdWU6ZnVuY3Rpb24oc3RhdGUsIGdldHRlciwgYXJncywgdmFsdWUpIHtcInVzZSBzdHJpY3RcIjtcblx0ICAgIHZhciBjb2RlID0gaGFzaENvZGUoZ2V0dGVyKVxuXHQgICAgdGhpcy5fX2NhY2hlZEdldHRlcnMgPSB0aGlzLl9fY2FjaGVkR2V0dGVycy5zZXQoY29kZSwgSW1tdXRhYmxlLk1hcCh7XG5cdCAgICAgIHZhbHVlOiB2YWx1ZSxcblx0ICAgICAgYXJnczogdG9JbW11dGFibGUoYXJncyksXG5cdCAgICAgIHN0YXRlSGFzaENvZGU6IHN0YXRlLmhhc2hDb2RlKCksXG5cdCAgICB9KSlcblx0ICB9fSk7XG5cblx0ICAvKipcblx0ICAgKiBSZXR1cm5zIGJvb2xlYW4gd2hldGhlciB0aGUgc3VwcGxpZWQgZ2V0dGVyIGlzIGNhY2hlZCBmb3IgYSBnaXZlbiBzdGF0ZVxuXHQgICAqIEBwYXJhbSB7SW1tdXRhYmxlLk1hcH0gc3RhdGVcblx0ICAgKiBAcGFyYW0ge0dldHRlcn0gZ2V0dGVyXG5cdCAgICogQHJldHVybiB7Ym9vbGVhbn1cblx0ICAgKi9cblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRXZhbHVhdG9yLnByb3RvdHlwZSxcIl9faXNDYWNoZWRcIix7d3JpdGFibGU6dHJ1ZSxjb25maWd1cmFibGU6dHJ1ZSx2YWx1ZTpmdW5jdGlvbihzdGF0ZSwgZ2V0dGVyKSB7XCJ1c2Ugc3RyaWN0XCI7XG5cdCAgICB2YXIgY29kZSA9IGhhc2hDb2RlKGdldHRlcilcblx0ICAgIHJldHVybiAoXG5cdCAgICAgIHRoaXMuX19jYWNoZWRHZXR0ZXJzLmhhc0luKFtjb2RlLCAndmFsdWUnXSkgJiZcblx0ICAgICAgdGhpcy5fX2NhY2hlZEdldHRlcnMuZ2V0SW4oW2NvZGUsICdzdGF0ZUhhc2hDb2RlJ10pID09PSBzdGF0ZS5oYXNoQ29kZSgpXG5cdCAgICApXG5cdCAgfX0pO1xuXG5cdCAgLyoqXG5cdCAgICogUmVtb3ZlcyBhbGwgY2FjaGluZyBhYm91dCBhIGdldHRlclxuXHQgICAqIEBwYXJhbSB7R2V0dGVyfVxuXHQgICAqL1xuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFdmFsdWF0b3IucHJvdG90eXBlLFwidW50cmFja1wiLHt3cml0YWJsZTp0cnVlLGNvbmZpZ3VyYWJsZTp0cnVlLHZhbHVlOmZ1bmN0aW9uKGdldHRlcikge1widXNlIHN0cmljdFwiO1xuXHQgICAgLy8gVE9ETzogdW50cmFjayBhbGwgZGVwZW5kZW5jaWVzXG5cdCAgfX0pO1xuXG5cdCAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEV2YWx1YXRvci5wcm90b3R5cGUsXCJyZXNldFwiLHt3cml0YWJsZTp0cnVlLGNvbmZpZ3VyYWJsZTp0cnVlLHZhbHVlOmZ1bmN0aW9uKCkge1widXNlIHN0cmljdFwiO1xuXHQgICAgdGhpcy5fX2NhY2hlZEdldHRlcnMgPSBJbW11dGFibGUuTWFwKHt9KVxuXHQgIH19KTtcblxuXG5cdG1vZHVsZS5leHBvcnRzID0gRXZhbHVhdG9yXG5cblxuLyoqKi8gfSxcbi8qIDEyICovXG4vKioqLyBmdW5jdGlvbihtb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuXHR2YXIgZWFjaCA9IF9fd2VicGFja19yZXF1aXJlX18oMykuZWFjaFxuXHQvKipcblx0ICogQHBhcmFtIHtSZWFjdG9yfSByZWFjdG9yXG5cdCAqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHJlYWN0b3IpIHtcblx0ICByZXR1cm4ge1xuXHQgICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0ICAgICAgcmV0dXJuIGdldFN0YXRlKHJlYWN0b3IsIHRoaXMuZ2V0RGF0YUJpbmRpbmdzKCkpXG5cdCAgICB9LFxuXG5cdCAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG5cdCAgICAgIHZhciBjb21wb25lbnQgPSB0aGlzXG5cdCAgICAgIGNvbXBvbmVudC5fX3Vud2F0Y2hGbnMgPSBbXVxuXHQgICAgICBlYWNoKHRoaXMuZ2V0RGF0YUJpbmRpbmdzKCksIGZ1bmN0aW9uKGdldHRlciwga2V5KSB7XG5cdCAgICAgICAgdmFyIHVud2F0Y2hGbiA9IHJlYWN0b3Iub2JzZXJ2ZShnZXR0ZXIsIGZ1bmN0aW9uKHZhbCkge1xuXHQgICAgICAgICAgdmFyIG5ld1N0YXRlID0ge31cblx0ICAgICAgICAgIG5ld1N0YXRlW2tleV0gPSB2YWxcblx0ICAgICAgICAgIGNvbXBvbmVudC5zZXRTdGF0ZShuZXdTdGF0ZSlcblx0ICAgICAgICB9KVxuXG5cdCAgICAgICAgY29tcG9uZW50Ll9fdW53YXRjaEZucy5wdXNoKHVud2F0Y2hGbilcblx0ICAgICAgfSlcblx0ICAgIH0sXG5cblx0ICAgIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcblx0ICAgICAgd2hpbGUgKHRoaXMuX191bndhdGNoRm5zLmxlbmd0aCkge1xuXHQgICAgICAgIHRoaXMuX191bndhdGNoRm5zLnNoaWZ0KCkoKVxuXHQgICAgICB9XG5cdCAgICB9LFxuXHQgIH1cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGEgbWFwcGluZyBvZiB0aGUgZ2V0RGF0YUJpbmRpbmcga2V5cyB0b1xuXHQgKiB0aGUgcmVhY3RvciB2YWx1ZXNcblx0ICovXG5cdGZ1bmN0aW9uIGdldFN0YXRlKHJlYWN0b3IsIGRhdGEpIHtcblx0ICB2YXIgc3RhdGUgPSB7fVxuXHQgIGVhY2goZGF0YSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuXHQgICAgc3RhdGVba2V5XSA9IHJlYWN0b3IuZXZhbHVhdGUodmFsdWUpXG5cdCAgfSlcblx0ICByZXR1cm4gc3RhdGVcblx0fVxuXG5cbi8qKiovIH0sXG4vKiAxMyAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XG5cblx0dmFyIE1hcCA9IF9fd2VicGFja19yZXF1aXJlX18oMikuTWFwXG5cdHZhciBleHRlbmQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDMpLmV4dGVuZFxuXHR2YXIgdG9KUyA9IF9fd2VicGFja19yZXF1aXJlX18oMSkudG9KU1xuXHR2YXIgdG9JbW11dGFibGUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKDEpLnRvSW1tdXRhYmxlXG5cblx0LyoqXG5cdCAqIFN0b3JlcyBkZWZpbmUgaG93IGEgY2VydGFpbiBkb21haW4gb2YgdGhlIGFwcGxpY2F0aW9uIHNob3VsZCByZXNwb25kIHRvIGFjdGlvbnNcblx0ICogdGFrZW4gb24gdGhlIHdob2xlIHN5c3RlbS4gIFRoZXkgbWFuYWdlIHRoZWlyIG93biBzZWN0aW9uIG9mIHRoZSBlbnRpcmUgYXBwIHN0YXRlXG5cdCAqIGFuZCBoYXZlIG5vIGtub3dsZWRnZSBhYm91dCB0aGUgb3RoZXIgcGFydHMgb2YgdGhlIGFwcGxpY2F0aW9uIHN0YXRlLlxuXHQgKi9cblxuXHQgIGZ1bmN0aW9uIFN0b3JlKGNvbmZpZykge1widXNlIHN0cmljdFwiO1xuXHQgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFN0b3JlKSkge1xuXHQgICAgICByZXR1cm4gbmV3IFN0b3JlKGNvbmZpZylcblx0ICAgIH1cblxuXHQgICAgdGhpcy5fX2hhbmRsZXJzID0gTWFwKHt9KVxuXG5cdCAgICBpZiAoY29uZmlnKSB7XG5cdCAgICAgIC8vIGFsbG93IGBNeVN0b3JlIGV4dGVuZHMgU3RvcmVgIHN5bnRheCB3aXRob3V0IHRocm93aW5nIGVycm9yXG5cdCAgICAgIGV4dGVuZCh0aGlzLCBjb25maWcpXG5cdCAgICB9XG5cblx0ICAgIHRoaXMuaW5pdGlhbGl6ZSgpXG5cdCAgfVxuXG5cdCAgLyoqXG5cdCAgICogVGhpcyBtZXRob2QgaXMgb3ZlcnJpZGRlbiBieSBleHRlbmRpbmcgY2xhc3NlcyB0byBzZXR1cCBtZXNzYWdlIGhhbmRsZXJzXG5cdCAgICogdmlhIGB0aGlzLm9uYCBhbmQgdG8gc2V0IHVwIHRoZSBpbml0aWFsIHN0YXRlXG5cdCAgICpcblx0ICAgKiBBbnl0aGluZyByZXR1cm5lZCBmcm9tIHRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjb2VyY2VkIGludG8gYW4gSW1tdXRhYmxlSlMgdmFsdWVcblx0ICAgKiBhbmQgc2V0IGFzIHRoZSBpbml0aWFsIHN0YXRlIGZvciB0aGUgcGFydCBvZiB0aGUgUmVhY3RvckNvcmVcblx0ICAgKi9cblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RvcmUucHJvdG90eXBlLFwiaW5pdGlhbGl6ZVwiLHt3cml0YWJsZTp0cnVlLGNvbmZpZ3VyYWJsZTp0cnVlLHZhbHVlOmZ1bmN0aW9uKCkge1widXNlIHN0cmljdFwiO1xuXHQgICAgLy8gZXh0ZW5kaW5nIGNsYXNzZXMgaW1wbGVtZW50IHRvIHNldHVwIGFjdGlvbiBoYW5kbGVyc1xuXHQgIH19KTtcblxuXHQgIC8qKlxuXHQgICAqIE92ZXJyaWRhYmxlIG1ldGhvZCB0byBnZXQgdGhlIGluaXRpYWwgc3RhdGUgZm9yIHRoaXMgdHlwZSBvZiBzdG9yZVxuXHQgICAqL1xuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdG9yZS5wcm90b3R5cGUsXCJnZXRJbml0aWFsU3RhdGVcIix7d3JpdGFibGU6dHJ1ZSxjb25maWd1cmFibGU6dHJ1ZSx2YWx1ZTpmdW5jdGlvbigpIHtcInVzZSBzdHJpY3RcIjtcblx0ICAgIHJldHVybiBNYXAoKVxuXHQgIH19KTtcblxuXHQgIC8qKlxuXHQgICAqIFRha2VzIGEgY3VycmVudCByZWFjdG9yIHN0YXRlLCBhY3Rpb24gdHlwZSBhbmQgcGF5bG9hZFxuXHQgICAqIGRvZXMgdGhlIHJlYWN0aW9uIGFuZCByZXR1cm5zIHRoZSBuZXcgc3RhdGVcblx0ICAgKi9cblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RvcmUucHJvdG90eXBlLFwiaGFuZGxlXCIse3dyaXRhYmxlOnRydWUsY29uZmlndXJhYmxlOnRydWUsdmFsdWU6ZnVuY3Rpb24oc3RhdGUsIHR5cGUsIHBheWxvYWQpIHtcInVzZSBzdHJpY3RcIjtcblx0ICAgIHZhciBoYW5kbGVyID0gdGhpcy5fX2hhbmRsZXJzLmdldCh0eXBlKVxuXG5cdCAgICBpZiAodHlwZW9mIGhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgcmV0dXJuIGhhbmRsZXIuY2FsbCh0aGlzLCBzdGF0ZSwgcGF5bG9hZCwgdHlwZSlcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHN0YXRlXG5cdCAgfX0pO1xuXG5cdCAgLyoqXG5cdCAgICogUHVyZSBmdW5jdGlvbiB0YWtpbmcgdGhlIGN1cnJlbnQgc3RhdGUgb2Ygc3RvcmUgYW5kIHJldHVybmluZ1xuXHQgICAqIHRoZSBuZXcgc3RhdGUgYWZ0ZXIgYSBOdWNsZWFySlMgcmVhY3RvciBoYXMgYmVlbiByZXNldFxuXHQgICAqXG5cdCAgICogT3ZlcnJpZGFibGVcblx0ICAgKi9cblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RvcmUucHJvdG90eXBlLFwiaGFuZGxlUmVzZXRcIix7d3JpdGFibGU6dHJ1ZSxjb25maWd1cmFibGU6dHJ1ZSx2YWx1ZTpmdW5jdGlvbihzdGF0ZSkge1widXNlIHN0cmljdFwiO1xuXHQgICAgcmV0dXJuIHRoaXMuZ2V0SW5pdGlhbFN0YXRlKClcblx0ICB9fSk7XG5cblx0ICAvKipcblx0ICAgKiBCaW5kcyBhbiBhY3Rpb24gdHlwZSA9PiBoYW5kbGVyXG5cdCAgICovXG5cdCAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0b3JlLnByb3RvdHlwZSxcIm9uXCIse3dyaXRhYmxlOnRydWUsY29uZmlndXJhYmxlOnRydWUsdmFsdWU6ZnVuY3Rpb24oYWN0aW9uVHlwZSwgaGFuZGxlcikge1widXNlIHN0cmljdFwiO1xuXHQgICAgdGhpcy5fX2hhbmRsZXJzID0gdGhpcy5fX2hhbmRsZXJzLnNldChhY3Rpb25UeXBlLCBoYW5kbGVyKVxuXHQgIH19KTtcblxuXHQgIC8qKlxuXHQgICAqIFNlcmlhbGl6ZXMgc3RvcmUgc3RhdGUgdG8gcGxhaW4gSlNPTiBzZXJpYWxpemFibGUgSmF2YVNjcmlwdFxuXHQgICAqIE92ZXJyaWRhYmxlXG5cdCAgICogQHBhcmFtIHsqfVxuXHQgICAqIEByZXR1cm4geyp9XG5cdCAgICovXG5cdCAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0b3JlLnByb3RvdHlwZSxcInNlcmlhbGl6ZVwiLHt3cml0YWJsZTp0cnVlLGNvbmZpZ3VyYWJsZTp0cnVlLHZhbHVlOmZ1bmN0aW9uKHN0YXRlKSB7XCJ1c2Ugc3RyaWN0XCI7XG5cdCAgICByZXR1cm4gdG9KUyhzdGF0ZSlcblx0ICB9fSk7XG5cblx0ICAvKipcblx0ICAgKiBEZXNlcmlhbGl6ZXMgcGxhaW4gSmF2YVNjcmlwdCB0byBzdG9yZSBzdGF0ZVxuXHQgICAqIE92ZXJyaWRhYmxlXG5cdCAgICogQHBhcmFtIHsqfVxuXHQgICAqIEByZXR1cm4geyp9XG5cdCAgICovXG5cdCAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0b3JlLnByb3RvdHlwZSxcImRlc2VyaWFsaXplXCIse3dyaXRhYmxlOnRydWUsY29uZmlndXJhYmxlOnRydWUsdmFsdWU6ZnVuY3Rpb24oc3RhdGUpIHtcInVzZSBzdHJpY3RcIjtcblx0ICAgIHJldHVybiB0b0ltbXV0YWJsZShzdGF0ZSlcblx0ICB9fSk7XG5cblxuXHRmdW5jdGlvbiBpc1N0b3JlKHRvVGVzdCkge1xuXHQgIHJldHVybiAodG9UZXN0IGluc3RhbmNlb2YgU3RvcmUpXG5cdH1cblxuXHRtb2R1bGUuZXhwb3J0cyA9IFN0b3JlXG5cblx0bW9kdWxlLmV4cG9ydHMuaXNTdG9yZSA9IGlzU3RvcmVcblxuXG4vKioqLyB9XG4vKioqKioqLyBdKVxufSk7XG47IiwiaW1wb3J0IHsgUmVhY3RvciB9IGZyb20gJ251Y2xlYXItanMnO1xuXG5jb25zdCByZWFjdG9yID0gbmV3IFJlYWN0b3Ioe1xuICAgIGRlYnVnOiB0cnVlXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgcmVhY3RvcjsiXX0=
