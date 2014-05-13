/* jshint unused:false */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('#login').click(login);
    $('#seed').click(seed);
    $('#getforest').click(getForest);
    $('#forest').on('click', '.tree', grow);
  }

  function grow(){
    var treeId = $(this).data('id');  //this - the div you clicked on with class of .tree

    $.ajax({
      url: `/tree/${treeId}/grow`,
      type: 'PUT',
      dataType: 'html',
      success: tree => {
        console.log(tree);  //t is all of your trees
      }
    });

  }

  function getForest(){
    var userId = $('#username').data('id');

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
        $('#login').prev().val('');  //walks the DOM and clears out your text box
        $('#username').attr('data-id', r._id);
        $('#username').text(r.username);
      }
    });

    e.preventDefault();
  }

})();
