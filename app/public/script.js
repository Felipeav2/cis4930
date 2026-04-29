document.addEventListener('DOMContentLoaded', () => {
    const markdownInput = document.getElementById('markdown-input');
    const htmlPreview = document.getElementById('html-preview');

    // Debounce function to prevent too many API requests
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const updatePreview = async () => {
        const markdown = markdownInput.value;
        try {
            const response = await fetch('/api/convert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ markdown })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            htmlPreview.innerHTML = data.html;
        } catch (error) {
            console.error('Error converting markdown:', error);
            htmlPreview.innerHTML = `<p style="color: red;">Error: Could not convert markdown.</p>`;
        }
    };

    // Apply debounce so we don't spam the server on every keystroke
    const debouncedUpdate = debounce(updatePreview, 300);

    markdownInput.addEventListener('input', debouncedUpdate);
    
    // Initial content preview
    markdownInput.value = "# Hello World\n\nType some **Markdown** here!";
    updatePreview();
});
