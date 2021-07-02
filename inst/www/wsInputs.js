// SELECT TABLE INPUT
// cria evento onClick para cada tr da tabela
$(document).on("click", ".select-table-input tr:not(:first-child)", function(evt) {
  const target = evt.target;

  const tagName = $(target).prop("tagName");

  if (tagName !== "A") {
    const tr = tagName === "TD" ? $(target).parent() : $(target).parent().parent();

    const div = tr.parent().parent().parent();

    // radio btns
    if (!$(div).hasClass("multiple")) {
      $(div).find("tr.selected").each( function() {
        $(this).removeClass("selected");
        $(this).find("input[id^=chk_]").prop("checked", false);
      });
    }

    if (tagName !== "INPUT") {
      const check = tr.find("input[id^=chk_]");
      check.prop("checked", !check.prop("checked"));
    }

    if ($(div).hasClass("multiple")) {
      const checkall = div.find("#chk_all");
      if (div.find("td input:checkbox:not(:checked)").length > 0) {
        checkall.prop("checked", false);
        checkall.parent().removeClass("selected");
      } else if (div.find("td input:checkbox:not(:checked)").length === 0){
        checkall.prop("checked", true);
        checkall.parent().addClass("selected");
      }
    }

    // adiciona/remove classe
    tr.toggleClass("selected");

    div.trigger("classChange");
  }
});

$(document).on("click", ".select-table-input #chk_all", function(evt) {
  const target = evt.target;

  $(this).parent().toggleClass("selected");

  const isChecked = $(this).parent().hasClass("selected");

  $(this).parent().parent().parent().find("td input").each(
    function() {
      $(this).prop("checked", isChecked);
      $(this).parent().parent().toggleClass("selected", isChecked);
    }
  );

  $(this).closest("div").trigger("checkAll");
});

// cria evento onClick para cada link
$(document).on("click", ".select-table-input a", function(evt) {
  const target = evt.target;

  const id = $(target).attr("id").split("-")[0];

  const tr = $(target).parent().parent();

  Shiny.setInputValue(id + "Link", $(target).parent().parent().index());

});

var selectTableInputBinding = new Shiny.InputBinding();

// An input binding must implement these methods
$.extend(selectTableInputBinding, {

  // This returns a jQuery object with the DOM element
  find: function(scope) {
      return $(scope).find('.select-table-input');
  },

  initialize: function(el) {

    setTimeout(function() {
      const maxRows = $(el).data("max-rows");
      const thHeight = $(el).find("tr:first").height();
      const trHeight = $(el).find("tr:last").height();
      const maxHeight = thHeight + trHeight * maxRows;

      // altura da div baseado na quantidade de linhas (data-max-rows)
      $(el).css("height", maxHeight + 1);
    }, 200);


  },
  // return the ID of the DOM element
  getId: function(el) {
    return el.id;
  },

  // Given the DOM element for the input, return the value
  getValue: function(el) {
    var value = $(el).find("tr.selected").map( function() {
      return $(this).index();
    });

    return value.toArray();
  },

  // Given the DOM element for the input, set the value
  setValue: function(el, value) {
    el.value = value;
  },

  // Set up the event listeners so that interactions with the
  // input will result in data being sent to server.
  // callback is a function that queues data to be sent to
  // the server.
  subscribe: function(el, callback) {
    $(el).on('classChange.selectTableInputBinding', function(event) {
      callback(false);
    });

    $(el).on('checkAll.selectTableInputBinding', function(event) {
      callback(false);
    });
  },

  // Remove the event listeners
  unsubscribe: function(el) {
    $(el).off('.selectTableInputBinding');
  }

});

Shiny.inputBindings.register(selectTableInputBinding, 'shiny.selectTableInputBinding');

// SELECT FILE INPUT
// evento onClick para class .file-name
$(document).on("click", ".select-file-input .file-name", function(evt) {

  $(this).parent().parent().find(".selected").removeClass("selected");

  $(this).addClass("selected");

  $(this).parent().parent().trigger("classChange");

});

// evento onClick para botão X
$(document).on("click", ".select-file-input .close-button", function(evt) {

  const el = $(this).parent().parent();
  const value = $(this).siblings().data("value");

  Shiny.setInputValue(el.attr("id") + "Removed", value);

  $(this).parent().hide(400, function() {
      const parent = $(this).parent();

      const hasSelected = $( this ).find(".file-name").hasClass("selected");

      $( this ).remove();

      if (hasSelected) {
        parent.parent().find(".file-name:first").trigger("click");
      }

    });

});

// binding
var selectFileInputBinding = new Shiny.InputBinding();

// An input binding must implement these methods
$.extend(selectFileInputBinding, {

  // This returns a jQuery object with the DOM element
  find: function(scope) {
      return $(scope).find('.select-file-input');
  },

  initialize: function(el) {

    const first = $(el).find(".file-name:first");
    if (first.length) {
      $(el).find(".file-name:first").trigger("click");
    }
  },
  // return the ID of the DOM element
  getId: function(el) {
    return el.id;
  },

  // Given the DOM element for the input, return the value
  getValue: function(el) {
    return $(el).data("sel");
  },

  // Given the DOM element for the input, set the value
  setValue: function(el, value) {
    el.value = value;
  },

  // Set up the event listeners so that interactions with the
  // input will result in data being sent to server.
  // callback is a function that queues data to be sent to
  // the server.
  subscribe: function(el, callback) {
    $(el).on('classChange.selectFileInputBinding', function(event) {

      const val = $(this).find(".selected").data("value");
      $(this).data("sel", val);

      callback(false);
    });
  },

  // Remove the event listeners
  unsubscribe: function(el) {
    $(el).off('.selectFileInputBinding');
  },

  // update
  // data == message
  receiveMessage: function(el, data) {
    const choices = [].concat(data);

    choices.forEach(function(c) {
      $(el).append(
        `
        <div class="file-row">
          <div class="file-name" data-value = "${c}">${c}</div>
          <button type="button" class="close-button">
            <i class=\"fa fa-times\" role=\"presentation\" aria-label=\"times icon\"></i>
          </button>
        </div>
        `
      )
    })

    // confere se a div só tem 1 elemento
    if ($(el).children().length === 1)
      $(el).find(".file-name").trigger("click");
  },

  // input rate listening policy
  getRatePolicy: function() {
    return {
      policy: "debounce",
      delay: 500
    };
  }

});

Shiny.inputBindings.register(selectFileInputBinding, 'shiny.selectFileInputBinding');


// reset o selectFileInput
// message = id
Shiny.addCustomMessageHandler("resetSelectFileInput", function(message) {
  console.log(message);
  $("#" + message).empty();
});
