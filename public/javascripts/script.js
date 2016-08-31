$( document ).ready(function() {
  $( '.checked').hide(0);
  var checked = false;
  $( '.check' ).click(function(event) {
    event.preventDefault();

    console.log(checked);
    if (checked === false){
      $( this ).children('.unchecked').hide('fast');
      $( this ).children('.checked').show('fast');
    }
    else{
      $( this ).children('.checked').hide('fast');
      $( this ).children('.unchecked').show('fast');
    }
    checked = !checked;
  });

});
