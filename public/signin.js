document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('loginForm').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission

        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        const okMessage = document.querySelector('#ok-msg')
        try {
            console.log('Attempting to log in with email:', email); // Log email being used for login

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();

                okMessage.textContent = 'Invalid credentials';
                okMessage.style.color = "red"
                okMessage.classList.remove('hide');


                console.error('Error response data:', errorData); // Log error response data
                throw new Error(errorData.message || 'Network response was not ok');
            }

            const data = await response.json();
            console.log('Response data:', data); // Log entire response data

            // Ensure token is defined
            const token = data.user.token;
            if (!token) {
                throw new Error('Token not returned from server');
            }

            // Store token in local storage
            localStorage.setItem('token', token);
            console.log('Token stored in local storage:', token);

            // Redirect to home page
            location.href = '/home';
        } catch (error) {
            console.error('Login error:', error);
        }
    });
});
