define([
  "dojo/dom",
  "dojo/dom-construct",
  "dojo/on",
  "dojo/_base/array"
], function(dom, domConstruct, on, array) {

  return {
    initDropdown: function(inputId, list) {
      const inputNode = dom.byId(inputId);
      const optionsNode = dom.byId("pdbOptions");
      const errorNode = dom.byId("pdbError");

      let page = 0;
      let filtered = list;

      function renderOptions() {
        optionsNode.innerHTML = "";

        // slice the current window of 20 items
        const start = page * 20;
        const end = start + 20;
        const chunk = filtered.slice(start, end);

        // previous nav
        if (page > 0) {
          const liPrev = domConstruct.create("li", {
            innerHTML: "⬆ Previous items",
            style: "cursor:pointer; background:#eee;"
          }, optionsNode);
          on(liPrev, "click", function() {
            page--;
            renderOptions();
          });
        }

        // actual options
        chunk.forEach(function(val) {
          const li = domConstruct.create("li", {
            innerHTML: val,
            style: "cursor:pointer; padding:2px 4px;"
          }, optionsNode);
          on(li, "click", function() {
            inputNode.value = val;
            optionsNode.style.display = "none";
            clearError();
          });
        });

        // next nav
        if (end < filtered.length) {
          const liNext = domConstruct.create("li", {
            innerHTML: "⬇ Next items",
            style: "cursor:pointer; background:#eee;"
          }, optionsNode);
          on(liNext, "click", function() {
            page++;
            renderOptions();
          });
        }

        optionsNode.style.display = "block";
      }

      function clearError() {
        inputNode.style.border = "";
        errorNode.style.display = "none";
        errorNode.innerHTML = "";
      }

      function showError(msg) {
        inputNode.style.border = "2px solid red";
        errorNode.innerHTML = msg;
        errorNode.style.display = "block";
      }

      // typing handler
      on(inputNode, "input", function() {
        const query = inputNode.value.trim().toUpperCase();
        clearError();

        if (query.length === 0) {
          filtered = list;
        } else {
          filtered = array.filter(list, function(item) {
            return item.toUpperCase().indexOf(query) !== -1;
          });
        }

        page = 0;
        renderOptions();
      });

      // blur validation
      on(inputNode, "blur", function() {
        const val = inputNode.value.trim().toUpperCase();
        if (val && list.indexOf(val) === -1) {
          showError("Invalid selection: " + val);
        }
      });

      return {
        renderOptions: renderOptions
      };
    }
  };
});
