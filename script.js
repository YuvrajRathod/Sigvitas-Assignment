// script.js
document.addEventListener('DOMContentLoaded', function () {
    const inputView = document.getElementById('input-view');
    const outputView = document.getElementById('output-view');
    const textInput = document.getElementById('text-input');
    const fileUpload = document.getElementById('file-upload');
    const processButton = document.getElementById('process-button');
    const inputTextDisplay = document.getElementById('input-text-display');
    const pdfTextDisplay = document.getElementById('pdf-text-display');

    // Navigation handler
    document.querySelectorAll('.sidebar ul li a').forEach(link => {
        link.addEventListener('click', function () {
            document.querySelectorAll('.view').forEach(view => {
                view.classList.remove('active');
            });
            const target = document.querySelector(link.getAttribute('href'));
            target.classList.add('active');
        });
    });

    // Function to extract text from PDF
    async function extractTextFromPDF(file) {
        const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            text += textContent.items.map(item => item.str).join(' ') + ' ';
        }
        return text;
    }

    // Function to highlight matching text
    function highlightText(baseText, searchText) {
        const regex = new RegExp(`(${searchText})`, 'gi');
        return baseText.replace(regex, '<mark>$1</mark>');
    }

    // Process button click handler
    processButton.addEventListener('click', async function () {
        const inputText = textInput.value;
        inputTextDisplay.innerHTML = highlightText(inputText, inputText);

        if (fileUpload.files.length > 0) {
            const pdfText = await extractTextFromPDF(fileUpload.files[0]);
            pdfTextDisplay.innerHTML = highlightText(pdfText, inputText);
        } else {
            alert('Please upload a PDF file.');
        }
    });
});
