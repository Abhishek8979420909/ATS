document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('compareForm');
    const resume1Input = document.getElementById('resume1');
    const resume2Input = document.getElementById('resume2');
    const jobRoleSelect = document.getElementById('jobRole');
    const comparisonResults = document.getElementById('comparisonResults');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Comparing...';

        const formData = new FormData();
        formData.append('resume1', resume1Input.files[0]);
        formData.append('resume2', resume2Input.files[0]);
        formData.append('job_role', jobRoleSelect.value);

        try {
            const response = await fetch('/compare-resumes', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            // Display comparison results
            comparisonResults.style.display = 'flex';
            
            // Display Resume 1 Results
            const resume1Results = document.getElementById('resume1Results');
            resume1Results.innerHTML = `
                <div class="ats-score">
                    <h4>ATS Score</h4>
                    <div class="display-4">${data.resume1.ats_score}/100</div>
                </div>
                <div class="mt-3">
                    <h5>Key Strengths</h5>
                    <ul>
                        ${data.resume1.strengths.map(strength => `
                            <li>${strength}</li>
                        `).join('')}
                    </ul>
                </div>
                <div class="mt-3">
                    <h5>Areas for Improvement</h5>
                    <ul>
                        ${data.resume1.improvements.map(improvement => `
                            <li>${improvement}</li>
                        `).join('')}
                    </ul>
                </div>
            `;
            
            // Display Resume 2 Results
            const resume2Results = document.getElementById('resume2Results');
            resume2Results.innerHTML = `
                <div class="ats-score">
                    <h4>ATS Score</h4>
                    <div class="display-4">${data.resume2.ats_score}/100</div>
                </div>
                <div class="mt-3">
                    <h5>Key Strengths</h5>
                    <ul>
                        ${data.resume2.strengths.map(strength => `
                            <li>${strength}</li>
                        `).join('')}
                    </ul>
                </div>
                <div class="mt-3">
                    <h5>Areas for Improvement</h5>
                    <ul>
                        ${data.resume2.improvements.map(improvement => `
                            <li>${improvement}</li>
                        `).join('')}
                    </ul>
                </div>
            `;
            
            // Scroll to results
            comparisonResults.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while comparing resumes. Please try again.');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });

    // File input validation
    [resume1Input, resume2Input].forEach(input => {
        input.addEventListener('change', function() {
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
}); 