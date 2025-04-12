document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('resumeForm');
    const fileInput = document.getElementById('resume');
    const jobRoleSelect = document.getElementById('jobRole');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Analyzing...';

        const formData = new FormData();
        formData.append('resume', fileInput.files[0]);
        formData.append('job_role', jobRoleSelect.value);

        try {
            const response = await fetch('/parse-resume', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            // Store results in sessionStorage for the results page
            sessionStorage.setItem('resumeAnalysis', JSON.stringify(data));
            
            // Redirect to results page
            window.location.href = '/results';
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while analyzing your resume. Please try again.');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });

    // File input validation
    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const fileType = file.type;
            const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            
            if (!validTypes.includes(fileType)) {
                alert('Please upload a PDF or DOCX file.');
                this.value = '';
            }
        }
    });
}); 