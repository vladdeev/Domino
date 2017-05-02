const DOMNodeCollection = require("./dom_node_collection");

window.$d = arg => {
  switch (typeof(arg)) {
    case 'string':
      const nodes = document.querySelectorAll(arg);
      const nodesArray = Array.from(nodes);
      return new DOMNodeCollection(nodesArray);
    case 'object':
      if(arg instanceof HTMLElement){
        return new DOMNodeCollection([arg]);
      }
  }
};
