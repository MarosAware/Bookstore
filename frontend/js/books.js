//http://localhost/Bookstore/rest/rest.php/book/1

var bookEditSelect = $('#bookEditSelect');
var authorSelect = $('#author_id');
var authorEditSelect = $('#author_id_edit');

//Function for adding book
function addBook(data) {
    for (var i = 0; i < data.success.length; i++) {
        var newBook = `
                                        <li class="list-group-item">
                                            <div class="panel panel-default">
                                                <div class="panel-heading">
                                                    <span class="bookTitle">${data.success[i].title} (${data.success[i].author.name 
                                                    + " " + data.success[i].author.surname})</span>
                                                    <button data-id="${data.success[i].id}"
                                                            class="btn btn-danger pull-right btn-xs btn-book-remove"><i
                                                            class="fa fa-trash"></i>
                                                    </button>
                                                    <button data-id="${data.success[i].id}"
                                                            class="btn btn-primary pull-right btn-xs btn-book-show-description"><i
                                                            class="fa fa-info-circle"></i>
                                                    </button>
                                                </div>
                                                <div class="panel-body book-description">${data.success[i].description}</div>
                                            </div>
                                        </li>

        `;
        $('#booksList').append(newBook);
    }
}
//Function making option and append it to select
function addOptionBook(data) {

    for (var i = 0; i < data.success.length; i++) {
        var newOption = `<option value="${data.success[i].id}">${data.success[i].title}</option>`;

        bookEditSelect.append(newOption);
    }
}

function addOptionAuthor(data) {

    for (var i = 0; i < data.success.length; i++) {
        var newOption = `<option value="${data.success[i].id}">${data.success[i].name
        + ' ' + data.success[i].surname}</option>`;

        authorEditSelect.append(newOption);
        authorSelect.append(newOption);
    }
}

//If we use jQuery to create element, first append will work, second not (weird staff)
//So I decide to create element without jQuery (above)
// function addOptionAuthor(data) {
//
//     for (var i = 0; i < data.success.length; i++) {
//         var newOption = $(`<option value="${data.success[i].id}">${data.success[i].name
//         + ' ' + data.success[i].surname}</option>`);
//
//         authorEditSelect.append(newOption);
//         authorSelect.append(newOption);
//     }
// }

//Displaying all books
$.ajax({
    url: 'http://localhost/Bookstore/rest/rest.php/book/',
    method: 'GET'
}).done(function(data) {
    addBook(data);
    addOptionBook(data);
});


//Get all authors and fill select input
$.ajax({
    url: 'http://localhost/Bookstore/rest/rest.php/author/',
    method: 'GET'
}).done(function(data) {

    addOptionAuthor(data);

}).fail(function() {
   showModal('Can\'t get authors. Try again later.');
});


//Adding new Book from form
var form = $('#bookAdd');

form.on('submit', function (event) {
    event.preventDefault();

    var title = $('#title').val();
    var description = $('#description').val();
    var authorId = authorSelect.find(":selected").attr('value');


    //only if variable are not empty
    if (title !== "" && description !== "" && authorId !== "") {

        var objBook = {
            title : title,
            description: description,
            author_id: authorId
        };

        $.ajax({
            url: 'http://localhost/Bookstore/rest/rest.php/book/',
            method: 'POST',
            data: objBook,
            contentType: "application/json",
            dataType: "json"
        }).done(function(data) {
            addBook(data);
            addOptionBook(data);

            //Reset input on success
            $('#title').val('');
            $('#description').val('');
            authorSelect.val('');
            // console.log(data);
            // console.log('udalo sie wyslac');
            // window.location.reload(); // Really? Very funny... Negation of AJAX

        }).fail(function() {
            showModal('Something goes wrong.');
        })

    } else {
        showModal('All fields need to be filled.');
    }

});


$(function() {
    var list = $('.list-group');

    //Show Book description
    list.on('click', 'button.btn-book-show-description', function() {
        $(this).parent().next().slideToggle();
    });

    //Delete Book
    list.on('click', 'button.btn-book-remove', function() {
        var bookId = $(this).data('id');
        var itemBook = $(this).parent().parent().parent();
        var optionToRemove = bookEditSelect.find(`[value='${bookId}']`);

        if (confirm('Are you sure?')) {

            $.ajax({
                url: 'http://localhost/Bookstore/rest/rest.php/book/'+bookId,
                method: 'DELETE',
                contentType: "application/json",
                dataType: "json"
            }).done(function(data) {

                if (data.success === 'deleted') {
                    $(itemBook).remove();
                    optionToRemove.remove();
                }

            }).fail(function() {
                showModal('Something goes wrong. Sorry.');
            })
        }

    });



    //Editing book
    bookEditSelect.on('change', function() {
        var bookId = $(this).find(":selected").attr('value');
        var editBook = $('#bookEdit');
        //var authorId = $('#author_id_edit').find(":selected").attr('value');


        if (bookId !== '') {

            //This ajax request is unnecessary because we can get books from existing list on the page
            //I make this because of the instruction to this task

            $.ajax({
                url: 'http://localhost/Bookstore/rest/rest.php/book/'+bookId,
                method: 'GET',
                contentType: "application/json",
                dataType: "json"
            }).done(function(data) {

                var idBook = data.success[0].id;
                var titleBook = data.success[0].title;
                var descriptionBook = data.success[0].description;

                editBook.find('#id').val(idBook);
                editBook.find('#title').val(titleBook);
                editBook.find('#description').val(descriptionBook);
                authorEditSelect.find(`[value='${data.success[0].author_id}']`).prop('selected', true);

            }).fail(function() {
                showModal('Sorry, you can\'t edit book right now, try again later.');
            });

            editBook.slideDown();

            //Submit edit form
            editBook.on('submit', function(event) {
                event.preventDefault();

                var idBook = editBook.find('#id').val();
                var titleBook = editBook.find('#title').val();
                var descBook = editBook.find('#description').val();
                var authorId = authorEditSelect.val();

                //Only if input are not empty
                if (idBook && titleBook && descBook && authorId) {

                    var data = {
                        title: titleBook,
                        description: descBook,
                        author_id: authorId
                    };

                    $.ajax({
                        url: 'http://localhost/Bookstore/rest/rest.php/book/'+idBook,
                        method: 'PATCH',
                        data: data,
                        contentType: "application/json",
                        dataType: "json"
                    }).done(function(data) {

                        //Clear input after edit
                        editBook.find('#id').val('');
                        editBook.find('#title').val('');
                        editBook.find('#description').val('');

                        var authorNameSurname = '(' + data.success[0].author.name + ' ' + data.success[0].author.surname + ')';

                        //Reset select input into default position
                        bookEditSelect.val("");
                        //Hide edit form on success
                        editBook.slideUp();


                        //Catch proper book
                        var bookToEditDisplay = $('#booksList').find(`button[data-id='${idBook}']`).eq(0);
                        var selectOptionToEdit = bookEditSelect.find(`[value='${idBook}']`);

                        //Change existing book after edit
                        bookToEditDisplay.prev().text(titleBook + ' ' + authorNameSurname);
                        bookToEditDisplay.parent().parent().find('.book-description').text(descBook);

                        selectOptionToEdit.text(titleBook);

                    }).fail(function() {
                        showModal('Sorry, you can\'t edit book right now, try again later.');
                    });

                } else {
                    showModal('All fields need to be filled.');
                }

            });
        } else {
            editBook.slideUp();
        }

    });

});
