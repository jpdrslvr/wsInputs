Shiny.addCustomMessageHandler('append-to-table', function(message) {

  let newRow = message.row.replace(/\s/g, '____');
  let id = "#" + message.id;

  if (!$("#selection-table").length ) {
    $(id).append(
      `
      <div id="selection-table" class="col-sm-12 col-md-12 col-lg-12" style="padding: 0;">
      </div>
      `
    )
  }


  $("#selection-table").append(
    `
    <div id="selection-table-row-${newRow}" class="row" style="margin: 1px;">
      <div id="selection-label-${newRow}" class="selection-text col-sm-10 col-md-10 col-lg-10"  data-toggle="popover" style="display: inline;">
        ${newRow.replace(/____/g, ' ')}
      </div>

        <button type="button" class="btn-close" aria-label="Close"></button>
    </div>
    `
  );

  // adiciona popover
  $('#selection-label-' + newRow).popover({
    container: 'body',
    content: newRow.replace(/____/g, ' '),
    trigger: 'hover',
    delay: {'show': 500, 'hide': 100},
    placement: 'left'
  });

  $( '#selection-label-' + newRow ).on( 'click', function() {
    if ($( this ).hasClass('selection-text')) {

      // remaining back to normal
      $( '#selection-table .selection-text' ).css('background', '') ;
      $( '#selection-table .selection-text' ).css('color', 'white');
      $( '#selection-table .selection-text' ).css('font-weight', 'normal');
      $( '#selection-table .selection-text' ).removeClass('clicked');

      // highlight selected row
      $( this ).css('background', "#f4f4f4");
      $( this ).css('color', '#222d32');
      $( this ).css('font-weight', 'bold');
      $( this ).addClass('clicked');

      Shiny.setInputValue('selectedFile', $(this).attr('id').substring(16).replace(/____/g, ' '));
    }
  });

  // handlers for del- buttons

  $( '#del-' + newRow ).click(function() {
    Shiny.setInputValue('deletedRow', $(this).attr('id').substring(4).replace(/____/g, ' '));
    $( this ).parent().parent().hide("slow", function() {
      $( this ).remove();
       if (!$("#selection-table").find(".clicked").length) {
         $("#selection-table .selection-text:first").trigger("click");
        }
    });
  })

})

Shiny.addCustomMessageHandler('click', function(message) {
  $("#selection-table-row-" + message.replace(/\s/g, '____') +" .selection-text").trigger("click");
})
