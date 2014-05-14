(function() {
  'use strict';
  $(document).ready(init);
  function init() {
    $('#login').click(login);
    $('#seed').click(seed);
    $('#getforest').click(getForest);
    $('#forest').on('click', '.tree.alive', grow);
    $('#forest').on('click', '.chop', chop);
    $('#sellWood').click(sellWood);
  }
  function sellWood() {
    var userId = $('#username').attr('data-id');
    $.ajax({
      url: ("/sell/" + userId + "/wood"),
      type: 'PUT',
      success: (function(res) {
        $('#wood').text(("Wood: " + res.wood));
        $('#cash').text(("Cash: " + res.cash));
      })
    });
  }
  function chop() {
    var treeId = $(this).prev().data('id');
    var tree = $(this).parent();
    if ($(this).prev().hasClass('alive') && $(this).prev().hasClass('adult')) {
      $.ajax({
        url: ("/tree/" + treeId + "/chop"),
        type: 'PUT',
        success: (function(res) {
          tree.replaceWith(res.treeHTML);
          $('#playerName').text(("Player: " + res.user.username));
          $('#wood').text(("Wood: " + res.user.wood));
          $('#cash').text(("Cash: " + res.user.cash));
        })
      });
    }
  }
  function grow() {
    var tree = $(this).parent();
    var treeId = $(this).data('id');
    $.ajax({
      url: ("/tree/" + treeId + "/grow"),
      type: 'PUT',
      dataType: 'html',
      success: (function(t) {
        tree.replaceWith(t);
      })
    });
  }
  function getForest() {
    var userId = $('#username').attr('data-id');
    $.ajax({
      url: ("/forest/" + userId),
      type: 'GET',
      dataType: 'html',
      success: (function(t) {
        $('#forest').empty().append(t);
      })
    });
  }
  function seed() {
    var userId = $('#username').data('id');
    $.ajax({
      url: '/seed',
      type: 'POST',
      dataType: 'html',
      data: {userId: userId},
      success: (function(t) {
        $('#forest').append(t);
      })
    });
  }
  function login(e) {
    var data = $(this).closest('form').serialize();
    $.ajax({
      url: '/login',
      type: 'POST',
      data: data,
      success: (function(r) {
        $('#playerName').text(("Player: " + r.username));
        $('#wood').text(("Wood: " + r.wood));
        $('#cash').text(("Cash: " + r.cash));
        $('#login').prev().val('');
        $('#username').attr('data-id', r._id);
        $('#username').text(r.username);
      })
    });
    e.preventDefault();
  }
})();

//# sourceMappingURL=game.map
