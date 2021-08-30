"use strict";

const SimpleAnchor = function (options) {
  this.options = options || {};
  this.elements = [];

  /**
   * Assigns options to the internal options object, and provides defaults.
   * @param {Object} opts - Options object
   */
  function _applyRemainingDefaultOptions(opts) {
    opts.icon = Object.prototype.hasOwnProperty.call(opts, "icon") ? opts.icon : "\uE9CB"; // Accepts characters (and also URLs?), like  '#', '¶', '❡', or '§'.
    opts.visible = Object.prototype.hasOwnProperty.call(opts, "visible") ? opts.visible : "hover"; // Also accepts 'always' & 'touch'
    opts.placement = Object.prototype.hasOwnProperty.call(opts, "placement") ? opts.placement : "right"; // Also accepts 'left'
    opts.ariaLabel = Object.prototype.hasOwnProperty.call(opts, "ariaLabel") ? opts.ariaLabel : "Anchor"; // Accepts any text.
    opts.class = Object.prototype.hasOwnProperty.call(opts, "class") ? opts.class : ""; // Accepts any class name.
    opts.base = Object.prototype.hasOwnProperty.call(opts, "base") ? opts.base : ""; // Accepts any base URI.
    opts.titleText = Object.prototype.hasOwnProperty.call(opts, "titleText") ? opts.titleText : ""; // Accepts any text.
  }

  _applyRemainingDefaultOptions(this.options);

  /**
   * Checks to see if this device supports touch. Uses criteria pulled from Modernizr:
   * https://github.com/Modernizr/Modernizr/blob/da22eb27631fc4957f67607fe6042e85c0a84656/feature-detects/touchevents.js#L40
   * @return {Boolean} - true if the current device supports touch.
   */
  this.isTouchDevice = function () {
    // eslint-disable-next-line no-undef, compat/compat
    return Boolean("ontouchstart" in window || window.TouchEvent || window.DocumentTouch && document instanceof DocumentTouch);
  };

  /**
   * Add anchor links to page elements.
   * @param  {String|Array|Nodelist} selector - A CSS selector for targeting the elements you wish to add anchor links
   *                                            to. Also accepts an array or nodeList containing the relavant elements.
   * @return {this}                           - The AnchorJS object
   */
  this.add = function (selector) {
    let elementID;
    let i;
    let anchor;
    let visibleOptionToUse;
    let hrefBase;
    const indexesToDrop = [];

    // We reapply options here because somebody may have overwritten the default options object when setting options.
    // For example, this overwrites all options but visible:
    //
    // anchors.options = { visible: 'always'; }
    _applyRemainingDefaultOptions(this.options);

    visibleOptionToUse = this.options.visible;
    if (visibleOptionToUse === "touch") {
      visibleOptionToUse = this.isTouchDevice() ? "always" : "hover";
    }

    // Provide a sensible default selector, if none is given.
    if (!selector) {
      selector = "h2, h3, h4, h5, h6";
    }

    const elements = _getElements(selector);

    if (elements.length === 0) {
      return this;
    }

    for (i = 0; i < elements.length; i++) {
      if (this.hasAnchorJSLink(elements[i])) {
        indexesToDrop.push(i);
        continue;
      }

      if (elements[i].hasAttribute("id")) {
        elementID = elements[i].getAttribute("id");
      } else {
        // Don't add anchor to elements without ID.
        indexesToDrop.push(i);
        continue;
      }

      // The following code efficiently builds this DOM structure:
      // `<a class="anchorjs-link ${this.options.class}"
      //     aria-label="${this.options.ariaLabel}"
      //     title="${this.options.titleText}"
      //     href="${this.options.base}#${elementID}">
      //   ${this.options.icon}
      // </a>`
      anchor = document.createElement("a");
      anchor.className = "anchorjs-link " + this.options.class;
      anchor.setAttribute("aria-label", this.options.ariaLabel);
      anchor.innerText = this.options.icon;
      if (this.options.titleText) {
        anchor.title = this.options.titleText;
      }

      // Adjust the href if there's a <base> tag. See https://github.com/bryanbraun/anchorjs/issues/98
      hrefBase = document.querySelector("base") ? window.location.pathname + window.location.search : "";
      hrefBase = this.options.base || hrefBase;
      anchor.href = hrefBase + "#" + elementID;

      if (visibleOptionToUse === "always") {
        anchor.style.opacity = "1";
      }

      if (this.options.placement === "left") {
        elements[i].insertBefore(anchor, elements[i].firstChild);
      } else { // if the option provided is `right` (or anything else).
        elements[i].appendChild(anchor);
      }
    }

    for (i = 0; i < indexesToDrop.length; i++) {
      elements.splice(indexesToDrop[i] - i, 1);
    }

    this.elements = this.elements.concat(elements);

    return this;
  };

  /**
   * Removes all anchorjs-links from elements targeted by the selector.
   * @param  {String|Array|Nodelist} selector - A CSS selector string targeting elements with anchor links,
   *                                            OR a nodeList / array containing the DOM elements.
   * @return {this}                           - The AnchorJS object
   */
  this.remove = function (selector) {
    let index;
    let domAnchor;
    const elements = _getElements(selector);

    for (let i = 0; i < elements.length; i++) {
      domAnchor = elements[i].querySelector(".anchorjs-link");
      if (domAnchor) {
        // Drop the element from our main list, if it's in there.
        index = this.elements.indexOf(elements[i]);
        if (index !== -1) {
          this.elements.splice(index, 1);
        }

        // Remove the anchor from the DOM.
        elements[i].removeChild(domAnchor);
      }
    }

    return this;
  };

  /**
   * Removes all anchorjs links. Mostly used for tests.
   */
  this.removeAll = function () {
    this.remove(this.elements);
  };

  /**
   * Determines if this element already has an AnchorJS link on it.
   * Uses this technique: https://stackoverflow.com/a/5898748/1154642
   * @param    {HTMLElement}  el - a DOM node
   * @return   {Boolean}     true/false
   */
  this.hasAnchorJSLink = function (el) {
    const hasLeftAnchor = el.firstChild && (" " + el.firstChild.className + " ").indexOf(" anchorjs-link ") > -1;
    const hasRightAnchor = el.lastChild && (" " + el.lastChild.className + " ").indexOf(" anchorjs-link ") > -1;

    return hasLeftAnchor || hasRightAnchor || false;
  };

  /**
   * Turns a selector, nodeList, or array of elements into an array of elements (so we can use array methods).
   * It also throws errors on any other inputs. Used to handle inputs to .add and .remove.
   * @param  {String|Array|Nodelist} input - A CSS selector string targeting elements with anchor links,
   *                                         OR a nodeList / array containing the DOM elements.
   * @return {Array} - An array containing the elements we want.
   */
  function _getElements(input) {
    let elements;
    if (typeof input === "string" || input instanceof String) {
      // See https://davidwalsh.name/nodelist-array for the technique transforming nodeList -> Array.
      elements = [].slice.call(document.querySelectorAll(input));
    // I checked the 'input instanceof NodeList' test in IE9 and modern browsers and it worked for me.
    } else if (Array.isArray(input) || input instanceof NodeList) {
      elements = [].slice.call(input);
    } else {
      throw new TypeError("The selector provided to AnchorJS was invalid.");
    }

    return elements;
  }
};

export default SimpleAnchor;
