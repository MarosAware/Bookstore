//http://localhost/Bookstore/rest/rest.php/author/1

var authorEditSelect = $('#authorEditSelect');
var authorBookList = $('.authorBooksList');


//Function to add author with all his books
function addAuthor(data) {
    for (var i = 0; i < data.success.length; i++) {

        var newAuthor = `
                    <li class="list-group-item">
                        <div class="panel panel-default">
                            <div class="panel-heading"><span class="authorTitle">${data.success[i].name + ' ' + data.success[i].surname}</span>
                                <button data-id="${data.success[i].id}" class="btn btn-danger pull-right btn-xs btn-author-remove"><i
                                            class="fa fa-trash"></i></button>
                                <button data-id="${data.success[i].id}" class="btn btn-primary pull-right btn-xs btn-author-books"><i
                                            class="fa fa-book"></i></button>

                            </div>
                            <ul class="authorBooksList"></ul>
                        </div>
                    </li>`;


        $('#authorsList').append(newAuthor);

        //if not null, empty, false etc.
        //because if we add new author, he doesn't have any books
        if (data.success[i].books) {
            for (var j = 0; j < data.success[i].books.length; j++) {
                var newBook = `<li>${data.success[i].books[j].title}</li>`;

                $('#authorsList').find(`[data-id='${data.success[i].id}']`).parent().next().append(newBook);
            }
        }

    }
}

function addOption(data) {

    for (var i = 0; i < data.success.length; i++) {
        var newOption = $(`<option value="${data.success[i].id}">${data.success[i].name + ' ' + data.success[i].surname}</option>`);
        authorEditSelect.append(newOption);
    }
}


//Adding new author from form
var addForm = $('#authorAdd');

addForm.on('submit', function(event) {
    event.preventDefault();

    var name = addForm.find('#name').val();
    var surname = addForm.find('#surname').val();

    addForm.find('#name').val('');
    addForm.find('#surname').val('');

    if (name !== "" && surname !== "") {

        var authorObj = {
            name: name,
            surname: surname
        };

        $.ajax({
            url: 'http://localhost/Bookstore/rest/rest.php/author/',
            method: 'POST',
            data: authorObj,
            contentType: 'application/json',
            dataType: 'json'

        }).done(function(data) {
            addAuthor(data);
            addOption(data);

        }).fail(function() {
            showModal('Something goes wrong.');
        })

    } else {
        showModal('All fields need to be filled.')
    }
});


$(function() {

    //Get all authors and display it on page
    $.ajax({
        url: 'http://localhost/Bookstore/rest/rest.php/author/',
        method: 'GET',
        contentType: 'application/json'
    }).done(function(data) {
        addAuthor(data);
        addOption(data);
    }).fail(function() {
        showModal('Something goes wrong.');
    });


    //Delete author from list
    var authorList = $('.list-group');

    authorList.on('click', 'button.btn-author-remove', function() {
        var authorId = $(this).data('id');
        var itemAuthor = $(this).parent().parent().parent();
        var optionToRemove = authorEditSelect.find(`[value='${authorId}']`);

        if (confirm('Are you sure?')) {

            $.ajax({
                url: 'http://localhost/Bookstore/rest/rest.php/author/' + authorId,
                method: 'DELETE'
            }).done(function(data) {
                if (data.success === 'deleted') {
                    $(itemAuthor).remove();
                    optionToRemove.remove();
                }
            }).fail(function() {
                showModal('Delete author fail.');
            })
        }
    });

    //Show author books

    authorList.on('click', 'button.btn-author-books', function() {
       var elementToAppend = $(this).parent().next();
       elementToAppend.slideToggle();
    });



    //Edit author
    authorEditSelect.on('change', function() {
        var authorId = $(this).find(":selected").attr('value');
        var authorEdit = $('#authorEdit');

        //Only if author id is not empty
        if (authorId !== '') {

            //Get author by id and fill edit input
            $.ajax({
                url: 'http://localhost/Bookstore/rest/rest.php/author/' + authorId,
                method: 'GET',
                constentType: "application/json"
            }).done(function(data) {
                var dbIdAuthor = data.success[0].id;
                var dbName = data.success[0].name;
                var dbSurname = data.success[0].surname;

                authorEdit.find('#id').val(dbIdAuthor);
                authorEdit.find('#name').val(dbName);
                authorEdit.find('#surname').val(dbSurname);
            }).fail(function() {
                showModal('Sorry, you can\'t edit author right now, try again later');
            });

            //Show edit form
            authorEdit.slideDown();

            //Event for submit edit form
            authorEdit.on('submit', function(event) {
                event.preventDefault();

                var inpName = authorEdit.find('#name').val();
                var inpSurname = authorEdit.find('#surname').val();

                //Reset select input
                authorEditSelect.val('');

                authorEdit.slideUp();


                var data = {
                    name: inpName,
                    surname: inpSurname
                };

                $.ajax({
                    url: 'http://localhost/Bookstore/rest/rest.php/author/' + authorId,
                    method: 'PATCH',
                    data: data,
                    contentType: 'application/json',
                    dataType: 'json'
                }).done(function() {

                    //Clear input
                    authorEdit.find('#id').val('');
                    authorEdit.find('#name').val('');
                    authorEdit.find('#surname').val('');


                    //Changing existing author on the list after edit
                    var authorToEditDisplay = $('#authorsList').find(`button[data-id='${authorId}']`).prev().eq(0);
                    var selectOptionToEdit = authorEditSelect.find(`[value='${authorId}']`);

                    authorToEditDisplay.text(inpName + ' ' + inpSurname);
                    selectOptionToEdit.text(inpName + ' ' + inpSurname);

                }).fail(function() {
                    showModal('Sorry, you can\'t edit author right now, try again later.');
                })

            })
        } else {
            authorEdit.slideUp();
        }
    });


});


