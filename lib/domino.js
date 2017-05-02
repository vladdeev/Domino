/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const DOMNodeCollection = __webpack_require__(1);

const $d = arg => {
  switch (typeof(arg)) {
    case 'string':
      const nodes = document.querySelectorAll(arg);
      const nodesArray = Array.from(nodes);
      return new DOMNodeCollection(nodesArray);
    case 'object':
      if(arg instanceof HTMLElement){
        return new DOMNodeCollection([arg]);
      }
      return null;
    case "function":
      return triggerCallbackWhenReady(arg);
  }
};

let _functionQueue = [];

const triggerCallbackWhenReady = callback => {
  _functionQueue.push(callback);

  document.addEventListener('DOMContentLoaded', () => {
    _functionQueue.forEach(func => func());
  });
};

$d.extend = (base, ...objects) => {
  objects.forEach(object => {
    Object.keys(object).forEach(key => {
      base[key] = object[key];
    });
  });

  return base;
};

$d.ajax = options => {
  const defaults = {
    method: 'GET',
    url: window.location.href,
    data: {},
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    success: () => {},
    error: () => {}
  };
  options = $d.extend(defaults, options);

  const xhr = new XMLHttpRequest();
  xhr.open(options.method, options.url);

  xhr.onload = e => {
    if (xhr.status === 200) {
      options.success(JSON.parse(xhr.response));
    } else {
      options.error(JSON.parse(xhr.response));
    }
  };

  xhr.send(JSON.stringify(options.data));
};

window.$d = $d;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class DOMNodeCollection {
  constructor(nodes) {
    this.nodes = nodes;
  }

  each(callBack) {
    this.nodes.forEach(callBack);
  }

  html(html) {
    if (typeof html === 'string') {
      this.each(node => {
        node.innerHTML = html;
      });
    } else if (this.nodes.length > 0) {
      return this.nodes[0].innerHTML;
    }
  }

  empty() {
    this.html('');
  }

  append(children) {
    if (children instanceof HTMLElement) {
      this.each(node => node.appendChild(children));
    } else if (children instanceof DOMNodeCollection) {
      this.each(node => {
        children.each(childNode => {
          node.appendChild(childNode.cloneNode(true));
        });
      });
    } else if (typeof children === 'string') {
      this.each(node => (node.innerHTML += children));
    }

    if (this.nodes.length === 0) {
      return;
    }
  }

  attr(attributeName, value) {
    if (value) {
      this.each(node => node.setAttribute(attributeName, value));
      return this;
    } else {
      return this.nodes[0].getAttribute(attributeName);
    }
  }

  addClass(className) {
    this.each(node => node.classList.add(className));
    return this;
  }

  removeClass(className) {
    this.each(node => node.classList.remove(className));
    return this;
  }

  children() {
    let children = [];
    this.each(node => {
      const childreneList = node.children;
      children = children.concat(Array.from(childreneList));
    });
    return new DOMNodeCollection(children);
  }

  parent() {
    let parents = [];
    this.each(node => {
      let parent = node.parentNode;
      if (!parents.includes(parent)) {
        parents.push(parent);
      }
    });

    return new DOMNodeCollection(parents);
  }

  find(selectors) {
    let foundNodes = [];

    this.each(node => {
      let nodeList = Array.from(node.querySelectorAll(selectors));
      foundNodes = foundNodes.concat(nodeList);
    });

    return new DOMNodeCollection(foundNodes);
  }

  remove() {
    this.empty();

    this.each(node => {
      node.remove();
    });
  }

  on(e, callbackName) {
    this.each(node => {
      node.addEventListener(e, callbackName);
      node[e].push(callbackName);
    });
  }

  off(e) {
    this.each(node => {
      if (node[e]) {
        node[e].forEach(callbackName => {
          node.removeEventListener(e, callbackName);
        });
      }
      node[e] = [];
    });
  }
}

module.exports = DOMNodeCollection;


/***/ })
/******/ ]);