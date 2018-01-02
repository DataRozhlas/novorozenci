  $( function() {
    $( "#tags" ).autocomplete({
      source: availableTags,
      minLength: 3
    });

    $.ui.autocomplete.filter = function(array, term) {
      return $.grep(array, function (value) {
        return value.toLowerCase().startsWith(term.toLowerCase());
      });
    };

  } );