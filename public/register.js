document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('registerForm').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission

        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        const name = document.querySelector('#name').value;
        // const errMessage = document.getElementById('err-msg');
        const okMessage = document.getElementById('ok-msg');

        // Clear previous messages
        
        okMessage.classList.add('hide');

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 409) { // Conflict status for existing email
                    okMessage.textContent = 'User with this email already exists.';
                } else {
                    okMessage.textContent = 'Network response was not ok.';
                }
                okMessage.classList.remove('hide');
                throw new Error(errorData.message || 'Network response was not ok');
            }

            const data = await response.json();
            okMessage.textContent = 'User registered successfully.';
            okMessage.style.color = "black"
            okMessage.classList.remove('hide');
            console.log(data);
        } catch (error) {
            console.error('Error:', error);
            if (okMessage !== 'Network response was not ok') {
                okMessage.textContent = 'User with this email already exists.';
                okMessage.style.color = "red"
                okMessage.classList.remove('hide');
            }
        }
    });
});
