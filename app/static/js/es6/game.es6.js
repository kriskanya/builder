/* jshint unused:false */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('#login').click(login);
    $('#seed').click(seed);
    $('#getforest').click(getForest);
    $('#forest').on('click', '.tree.alive', grow);  //click will only work if it's a tree and it's alive
    $('#forest').on('click', '.chop', chop);
    $('#sellWood').click(sellWood);
  }

  function sellWood(){
    var userId = $('#username').attr('data-id');

    $.ajax({
      url: `/sell/${userId}/wood`,
      type: 'PUT',
      success: res => {
        $('#wood').text(`Wood: ${res.wood}`);
        $('#cash').text(`Cash: ${res.cash}`);
      }
    });
  }

  function chop(){
    var treeId = $(this).prev().data('id');
    var tree = $(this).parent();
    if($(this).prev().hasClass('alive') && $(this).prev().hasClass('adult')){
      $.ajax({
        url: `/tree/${treeId}/chop`,
        type: 'PUT',
        success: res => {
          tree.replaceWith(res.treeHTML);
          $('#playerName').text(`Player: ${res.user.username}`);
          $('#wood').text(`Wood: ${res.user.wood}`);
          $('#cash').text(`Cash: ${res.user.cash}`);
        }
      });
    }
  }

  function grow(){
    var tree = $(this).parent();
    var treeId = $(this).data('id');  //this - the div you clicked on with class of .tree

    $.ajax({
      url: `/tree/${treeId}/grow`,
      type: 'PUT',
      dataType: 'html',
      success: t => {
        tree.replaceWith(t);  //taking a div element and replacing it with what you just got from node
      }
    });

  }

  function getForest(){
    var userId = $('#username').attr('data-id');

    $.ajax({
      url: `/forest/${userId}`,  //userId is the id of the user who created the trees
      type: 'GET',
      dataType: 'html',
      success: t => {
        $('#forest').empty().append(t);  //t is all of your trees
      }
    });

  }

  function seed(){
    var userId = $('#username').data('id');

    $.ajax({
      url: '/seed',  //we are posting this to /login
      type: 'POST',
      dataType: 'html',
      data: {userId:userId},  //the data we are sending is 'data'
      success: t => {
        $('#forest').append(t);  //t is your single tree
      }
    });
  }

  function login(e){
    var data = $(this).closest('form').serialize();  //the 'this' is the button, so you're going up from there

    $.ajax({
      url: '/login',  //we are posting this to /login
      type: 'POST',
      data: data,  //the data we are sending is 'data'
      success: r => {  //success: what is the function that will get called when node calls me back
        $('#playerName').text(`Player: ${r.username}`);
        $('#wood').text(`Wood: ${r.wood}`);
        $('#cash').text(`Cash: ${r.cash}`);

        $('#login').prev().val('');  //walks the DOM and clears out your text box
        $('#username').attr('data-id', r._id);
        $('#username').text(r.username);
      }
    });

    e.preventDefault();
  }

})();
