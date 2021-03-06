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
