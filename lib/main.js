const DOMNodeCollection = require("./dom_node_collection");

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
  return new Promise((resolve, reject) => {
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
        resolve(JSON.parse(xhr.response));
      } else {
        options.error(JSON.parse(xhr.response));
        reject(JSON.parse(xhr.response));
      }
    };

    xhr.send(JSON.stringify(options.data));
  });
};

window.$d = $d;
