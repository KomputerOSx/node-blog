document.addEventListener("DOMContentLoaded", () => {


    //SHOW BOOK IN MAIN FILE
    const bookList = document.getElementById("bookList");
    const form = document.getElementById('bookForm');


    // Fetch books after DOM is loaded
    fetch("/books")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            data.forEach(book => {
                const bookElement = document.createElement("li");
                bookElement.classList.add("box");
                bookElement.id = book.id;

                const isRead = !!book.is_read; // Converts 1 to true, 0 to false
                bookElement.setAttribute('data-is-read', isRead); // Set the attribute as boolean

                const readButton = document.createElement("button");
                readButton.type = "button";
                readButton.className = `markAsRead button ${isRead ? 'is-secondary' : 'is-warning'}`; // Set class based on is_read
                readButton.textContent = isRead ? 'Read' : 'Mark as Read';

                bookElement.innerHTML = `
                  <h2 class="title is-h2">${book.title}</h2>
                  <p><b>Author:</b> ${book.author}</p>
                  <p><b>Year:</b> ${book.year}</p>
                  <p><b>Pages:</b> ${book.pages}</p>
                  ${readButton.outerHTML}
                  <button type="button" class="deleteBook button is-danger">Delete</button>
                `;

                bookList.appendChild(bookElement);
            });
        })
        .catch(error => {
            console.error('Error fetching books:', error);
        });


    // Use event delegation to handle clicks on dynamically created buttons
    // bookList.addEventListener("click", (event) => {
    //     if (event.target.classList.contains("markAsRead")) {
    //         const readButton = event.target; // Get the clicked button
    //         const bookElement = readButton.closest('li'); // Get the parent <li> element
    //         const bookId = bookElement.id; // Get the book ID from the <li>
    //         const isRead = bookElement.getAttribute('data-is-read') === 'true'; // Check current read status
    //
    //         // Toggle read status
    //         const newIsReadStatus = !isRead;
    //
    //         // Update button text based on new status
    //         readButton.textContent = newIsReadStatus ? 'Read' : 'Mark as Read';
    //         readButton.className = `markAsRead button ${newIsReadStatus ? 'is-secondary' : 'is-warning'}`;
    //
    //         // Call the API to update the book's read status
    //         updateBook(bookId, "is_read", newIsReadStatus)
    //             .then(() => {
    //                 // Update the data attribute on success
    //                 bookElement.setAttribute('data-is-read', newIsReadStatus);
    //             })
    //             .catch(error => {
    //                 console.error('Error updating book:', error);
    //                 alert('Failed to update read status. Please try again.');
    //             });
    //     }
    // });

    bookList.addEventListener("click", (event) => {
        if (event.target.classList.contains("markAsRead")) {
            const readButton = event.target;
            const bookElement = readButton.closest('li');
            const bookId = bookElement.id;
            const isRead = bookElement.getAttribute('data-is-read') === 'true';

            const newIsReadStatus = !isRead;

            console.log('Updating book:', { bookId, newIsReadStatus });

            updateBook(bookId, "is_read", newIsReadStatus)
                .then((response) => {
                    console.log('Book updated successfully:', response);
                    readButton.textContent = newIsReadStatus ? 'Read' : 'Mark as Read';
                    readButton.className = `markAsRead button ${newIsReadStatus ? 'is-secondary' : 'is-warning'}`;
                    bookElement.setAttribute('data-is-read', newIsReadStatus);
                })
                .catch(error => {
                    console.error('Detailed error in updating book:', error);
                    alert('Failed to update read status. Please check console for details.');
                });
        }
    });


    bookList.addEventListener("click", (event) => {
        if (event.target.classList.contains("deleteBook")) {
            const deleteButton = event.target;
            const bookElement = deleteButton.closest('li');
            const bookId = bookElement.id;

            deleteBook(bookId)
                .then(() => {
                    console.log('Book deleted successfully');
                    bookElement.remove(); // Remove the book element from the DOM
                    // Alternatively, you can reload the page:
                    // window.location.reload();
                })
                .catch(error => {
                    console.error('Error deleting book:', error);
                    alert('Failed to delete book. Please try again.');
                });
        }
    });



    //FORM TO SUBMIT NEW BOOK
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value.trim();
        const author = document.getElementById('author').value.trim();
        const year = parseInt(document.getElementById('year').value.trim(), 10);
        const pages = parseInt(document.getElementById('pages').value.trim(), 10);

        if (!title || !author || isNaN(year) || isNaN(pages)) {
            alert('Please fill all fields correctly.');
            return;
        }

        createBook(title, author, year, pages)
            .then(() => {
                console.log('Book created successfully');
                window.location.reload();
            })
            .catch(error => {
                console.error('Error creating book:', error);
                alert('Failed to create book. Please try again.');
            });
    });

});




// Function to call the API endpoint for updating a book's read status
function updateBook(bookId, field, value) {
    return fetch(`/api/books/${bookId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ field, value }),
    }).then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.message || 'Failed to update');
            });
        }
        return response.json();
    });

}

function createBook(title, author, year, pages, is_read = false) {
    console.log('Attempting to create book:', { title, author, year, pages, is_read });
    return fetch('/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author, year, pages, is_read })
    }).then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
            });
        }
        return response.json();
    }).catch(error => {
        console.error('Error in createBook:', error);
        throw error;
    });

}

function deleteBook(bookId) {
    return fetch(`/books/${bookId}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    }).then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
            });
        }
        return response.json();
    }).catch(error => {
        console.error('Error in deleteBook:', error);
        throw error;
    });
}





