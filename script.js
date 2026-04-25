document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feedbackForm');
    const summary = document.getElementById('form-summary');
    
    // Елементи форми
    const fields = [
        {
            input: document.getElementById('name'),
            error: document.getElementById('name-error'),
            validate: (val) => val.trim().length >= 2,
            message: 'Будь ласка, введіть принаймні 2 символи вашого імені.'
        },
        {
            input: document.getElementById('email'),
            error: document.getElementById('email-error'),
            validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
            message: 'Введіть коректну електронну адресу (наприклад: name@domain.com).'
        },
        {
            input: document.getElementById('phone'),
            error: document.getElementById('phone-error'),
            validate: (val) => val === '' || /^\+380\d{9}$/.test(val),
            message: 'Номер телефону має бути у форматі +380XXXXXXXXX.'
        },
        {
            input: document.getElementById('password'),
            error: document.getElementById('password-error'),
            validate: (val) => val.length >= 8 && /\d/.test(val),
            message: 'Пароль повинен містити мінімум 8 символів та хоча б одну цифру.'
        },
        {
            input: document.getElementById('role'),
            error: document.getElementById('role-error'),
            validate: (val) => val !== '',
            message: 'Оберіть одну з ролей зі списку.'
        }
    ];

    // Додаємо валідацію на blur для негайного зворотного зв'язку
    fields.forEach(field => {
        field.input.addEventListener('blur', () => {
            validateField(field);
        });
        
        // Очищення помилки при введенні
        field.input.addEventListener('input', () => {
            if (field.input.getAttribute('aria-invalid') === 'true') {
                validateField(field);
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValidForm = true;
        let errorMessages = [];

        fields.forEach(field => {
            const isValid = validateField(field);
            if (!isValid) {
                isValidForm = false;
                // Знаходимо назву поля для резюме (з лейбла)
                const labelText = document.querySelector(`label[for="${field.input.id}"]`).textContent.replace('(обов\'язково)', '').trim();
                errorMessages.push(`${labelText}: ${field.message}`);
            }
        });

        if (!isValidForm) {
            summary.className = 'summary-container';
            summary.innerHTML = `<strong>Виправте помилки (${errorMessages.length}):</strong>
                                <ul>${errorMessages.map(msg => `<li>${msg}</li>`).join('')}</ul>`;
            
            // Переміщення фокусу на першу помилку
            const firstError = document.querySelector('[aria-invalid="true"]');
            if (firstError) firstError.focus();
        } else {
            summary.className = 'summary-container summary-success';
            summary.textContent = 'Форму успішно надіслано! Дякуємо за реєстрацію.';
            form.reset();
            
            // Очищення ARIA станів після скидання форми
            fields.forEach(field => {
                clearError(field.input, field.error);
            });
        }
    });

    function validateField(field) {
        const isValid = field.validate(field.input.value);
        if (!isValid) {
            showError(field.input, field.error, field.message);
            return false;
        } else {
            clearError(field.input, field.error);
            return true;
        }
    }

    function showError(input, errorEl, message) {
        input.setAttribute('aria-invalid', 'true');
        // Поєднуємо оригінальну підказку та повідомлення про помилку
        const hintId = `${input.id}-hint`;
        input.setAttribute('aria-describedby', `${hintId} ${errorEl.id}`);
        errorEl.textContent = message;
        errorEl.hidden = false;
    }

    function clearError(input, errorEl) {
        input.setAttribute('aria-invalid', 'false');
        // Повертаємо лише оригінальну підказку
        input.setAttribute('aria-describedby', `${input.id}-hint`);
        errorEl.hidden = true;
    }
});
