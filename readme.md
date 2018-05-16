# Bookstore

Project of bookstore application (REST API and AJAX). 

* **URL ENDPOINTS**

  Bookstore/rest/rest.php/book/1
  
  Bookstore/rest/rest.php/author/1
  
* **Method:**
    
  The request type:
  
  `GET` | `POST` | `DELETE` | `PATCH`
    
* **Success Response:**

    * **Code:** 200 <br />
      **Content:** `{success: Array()}`
      
* **Error Response:**
      **Content:** `{error: 'Wrong request method'}`
       
* **Sample Call:**
*Displaying all books*

$.ajax({
    url: 'your_url/Bookstore/rest/rest.php/book/',
    method: 'GET'
}).done(function(data) {
    //Your code on success
});

## Built With

- PHP OOP
- AJAX
- jQuery
- Bootstrap

## Purpose

This project was created as a workshop in a programming school that I'm a participant in.
