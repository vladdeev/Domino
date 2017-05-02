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

  }


  find() {

  }

  remove() {

  }
}

module.exports = DOMNodeCollection;
