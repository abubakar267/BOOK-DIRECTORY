document.addEventListener('DOMContentLoaded', async function () {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found');
        }

        // Fetch user data
        const userResponse = await fetch('/api/auth/home', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!userResponse.ok) {
            throw new Error('Error fetching user data');
        }

        const { user } = await userResponse.json();
        

        // Display user information on the page
        const userInfoDiv = document.getElementById('userInfo');
        userInfoDiv.innerHTML = `
            <h2>Welcome, ${user.name}!</h2>
        `;

        // Fetch books for the user
        const booksResponse = await fetch(`/api/books`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!booksResponse.ok) {
            throw new Error('Error fetching books');
        }

        const { books } = await booksResponse.json();
        

        // Display books information on the page
        const booksListDiv = document.getElementById('booksList');
        booksListDiv.innerHTML = ''; // Clear existing content

        books.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.className = 'child-books';
            const bookBtn = document.createElement('button');
            bookBtn.className = 'getbook-btn';
            const updateBookBtn = document.createElement('button');
            updateBookBtn.className = 'updatebook-btn';
            const deleteBookBtn = document.createElement('button')
            deleteBookBtn.className = 'deletebook-btn';

            bookDiv.innerHTML = `
                <h3>Title: ${book.name}</h3>
                <p>Author: ${book.author}</p>
               
            `;

            bookBtn.innerHTML = `<p>Open Book</p>`;
            updateBookBtn.innerHTML = `<p>Update Book</p>`;
            deleteBookBtn.innerHTML = `<p>Delete Book</p>`;

            bookDiv.appendChild(bookBtn);
            bookDiv.appendChild(updateBookBtn);
            bookDiv.appendChild(deleteBookBtn);
            booksListDiv.appendChild(bookDiv);

            deleteBookBtn.addEventListener('click',async(event)=>{
                event.preventDefault();
                       
                try {
                    const deleteResponse = await fetch(`/api/books/${book._id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
    
                    if (!deleteResponse.ok) {
                        throw new Error('Error deleting book');
                    }
    
                    const deletedBook = await deleteResponse.json();
                    console.log('deleted book:', deletedBook);
                    location.reload();
    
                }catch(error){
                    console.log(error);
                }})

            bookBtn.addEventListener('click', async () => {
                try {
                    const popupBox = document.getElementById('popup-box');
                    const popupContent = document.querySelector('.content');

                    const bookDetailResponse = await fetch(`/api/books/${book._id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!bookDetailResponse.ok) {
                        throw new Error('Error fetching book details');
                    }

                    const { book: bookDetails } = await bookDetailResponse.json();
                    

                    // Update the popup content with book details
                    popupContent.innerHTML = `
                        <h1 style="color: green">Book Details</h1>
                        <p>Book ID: ${book._id}</p>
                        <p>Title: ${bookDetails.name}</p>
                        <p>Author: ${bookDetails.author}</p>
                        <p>ISSBN: ${bookDetails.ISSBN}</p>
                        
                        <button class="close-button">Close</button>
                    `;

                    // Show the popup
                    popupBox.classList.add('show');

                    // Close button event listener
                    const closeButton = popupContent.querySelector('.close-button');
                    closeButton.addEventListener('click', function () {
                        popupBox.classList.remove('show');
                    });

                    // Close popup when clicking outside the content
                    window.addEventListener('click', function (event) {
                        if (event.target === popupBox) {
                            popupBox.classList.remove('show');
                        }
                    });

                } catch (error) {
                    console.error('Error fetching book details:', error);
                }
            });

            updateBookBtn.addEventListener('click', async () => {
               
                try {
                    const updatePopupBox = document.getElementById('update-popup-box');
                    const updatePopupContent = document.querySelector('.update-content');

                    const bookDetailResponse = await fetch(`/api/books/${book._id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    });

                    if (!bookDetailResponse.ok) {
                        throw new Error('Error fetching book details');
                    }

                    const { book: bookDetails } = await bookDetailResponse.json();
                    

                    // Update the update popup content with book details
                    updatePopupContent.innerHTML = `
                        <h1 style="color: green">Update Book</h1>
                        <form id="update-book-form">
                            <label for="title">Title:</label>
                            <input type="text" id="title" name="title" value="${bookDetails.name}">
                            <label for="author">Author:</label>
                            <input type="text" id="author" name="author" value="${bookDetails.author}">
                            <label for="edition">Edition:</label>
                            <input type="text" id="edition" name="edition" value="${bookDetails.edition}">
                            <label for="ISSBN">ISSBN:</label>
                            <input type="text" id="ISSBN" name="ISSBN" value="${bookDetails.ISSBN}">
                            <button type="submit">Update</button>
                            <button type="button" class="close-update-button">Close</button>
                        </form>
                    `;

                    // Show the update popup
                    updatePopupBox.classList.add('show');

                    // Form submission event listener
                    const updateBookForm = document.getElementById('update-book-form');
                    updateBookForm.addEventListener('submit', async (event) => {
                        event.preventDefault();

                        const updatedTitle = updateBookForm.title.value;
                        const updatedAuthor = updateBookForm.author.value;
                        const updatedEdition = updateBookForm.edition.value;
                        const updatedISSBN = updateBookForm.ISSBN.value;

                        try {
                            const updateResponse = await fetch(`/api/books/${book._id}`, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({
                                    name: updatedTitle,
                                    author: updatedAuthor,
                                    edition: updatedEdition,
                                    ISSBN: updatedISSBN
                                })
                            });

                            if (!updateResponse.ok) {
                                throw new Error('Error updating book');
                            }

                            const updatedBook = await updateResponse.json();
                           

                            // Close the update popup
                            updatePopupBox.classList.remove('show');

                            // Optionally, refresh the book list or update the DOM to reflect the changes
                            location.reload();
                        } catch (error) {
                            console.error('Error updating book:', error);
                        }
                    });

                    // Close button event listener
                    const closeUpdateButton = updatePopupContent.querySelector('.close-update-button');
                    closeUpdateButton.addEventListener('click', function () {
                        updatePopupBox.classList.remove('show');
                    });

                    // Close popup when clicking outside the content
                    window.addEventListener('click', function (event) {
                        if (event.target === updatePopupBox) {
                            updatePopupBox.classList.remove('show');
                        }
                    });

                } catch (error) {
                    console.error('Error fetching book details:', error);
                }
            });
        });


        //adding book

        const addBookButton = document.getElementById('add-book');

        if (addBookButton) {
            

            addBookButton.addEventListener('click', () => {
                const addPopupContent = document.querySelector('.add-content');
                const addPopupBox = document.querySelector('#add-popup');

                addPopupContent.innerHTML = `
                    <h1 style="color: green">Add Book</h1>
                    <form id="add-book-form">
                        <label for="title">Title:</label>
                        <input type="text" id="title" name="title" placeholder="Enter Book Title" required>
                        <label for="author">Author:</label>
                        <input type="text" id="author" name="author" placeholder="Enter Book Author" required>
                        <label for="edition">Edition:</label>
                        <input type="text" id="edition" name="edition" placeholder="Enter Book Edition" required>
                        <label for="ISSBN">ISSBN:</label>
                        <input type="text" id="ISSBN" name="ISSBN" placeholder="Enter Book ISSBN" required>
                        <button id="add-btn" type="submit">Add</button>
                        <button type="button" class="close-add-button">Close</button>
                    </form>
                `;

                // Show the add popup
                addPopupBox.classList.add('show');

                const addBookForm = document.querySelector('#add-book-form');
                addBookForm.addEventListener('submit', async (event) => {
                    event.preventDefault();

                    const token = localStorage.getItem('token'); // Ensure token is retrieved here
                    if (!token) {
                        console.error('Token not found');
                        return; // Stop execution if token is not found
                    }

                    const addTitle = document.getElementById('title').value;
                    const addAuthor = document.getElementById('author').value;
                    const addEdition = document.getElementById('edition').value;
                    const addISSBN = document.getElementById('ISSBN').value;

                   
                    
                    try {
                        const bookDetailResponse = await fetch('/api/books', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                name: addTitle,
                                author: addAuthor,
                                edition: addEdition,
                                ISSBN: addISSBN,
                                user: user._id
                            })
                        });

           

                        if (!bookDetailResponse.ok) {
                            console.log('error adding');
                            throw new Error('Error adding book');
                        }

                        const newBook = await bookDetailResponse.json();
                       

                        // Optionally, close the add popup and refresh the book list
                        addPopupBox.classList.remove('show');
                        location.reload(); // Refresh the page to show the new book
                    } catch (error) {
                        console.error('Error adding book:', error);
                    }
                });

                const closeAddButton = addPopupContent.querySelector('.close-add-button');
                closeAddButton.addEventListener('click', () => {
                    addPopupBox.classList.remove('show');
                });
            });
        } else {
            console.error('Add book button not found');
        }

    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
