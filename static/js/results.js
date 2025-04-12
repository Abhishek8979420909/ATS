document.addEventListener('DOMContentLoaded', function() {
    const loadingDiv = document.getElementById('loading');
    const resultsDiv = document.getElementById('results');
    
    // Get stored analysis results
    const storedResults = sessionStorage.getItem('resumeAnalysis');
    
    if (!storedResults) {
        // If no results found, redirect to upload page
        window.location.href = '/upload';
        return;
    }

    const results = JSON.parse(storedResults);
    
    // Display results after a short delay to show loading state
    setTimeout(() => {
        loadingDiv.style.display = 'none';
        resultsDiv.style.display = 'block';
        
        // Display ATS Score
        document.getElementById('score').textContent = `${results.ats_score}/100`;
        
        // Display Personal Information
        const personalInfo = document.getElementById('personalInfo');
        personalInfo.innerHTML = `
            <p><strong>Name:</strong> ${results.name}</p>
            <p><strong>Email:</strong> ${results.email}</p>
            <p><strong>Phone:</strong> ${results.phone}</p>
        `;
        
        // Display Education
        const education = document.getElementById('education');
        education.innerHTML = results.education.map(edu => `
            <div class="mb-3">
                <h5>${edu.degree}</h5>
                <p>${edu.institution}</p>
                <p>${edu.duration}</p>
            </div>
        `).join('');
        
        // Display Skills
        const skills = document.getElementById('skills');
        skills.innerHTML = `
            <div class="d-flex flex-wrap gap-2">
                ${results.skills.map(skill => `
                    <span class="badge bg-primary">${skill}</span>
                `).join('')}
            </div>
        `;
        
        // Display Experience
        const experience = document.getElementById('experience');
        experience.innerHTML = results.experience.map(exp => `
            <div class="mb-3">
                <h5>${exp.title}</h5>
                <p><strong>${exp.company}</strong> | ${exp.duration}</p>
                <ul>
                    ${exp.responsibilities.map(resp => `
                        <li>${resp}</li>
                    `).join('')}
                </ul>
            </div>
        `).join('');
        
        // Display Projects
        const projects = document.getElementById('projects');
        projects.innerHTML = results.projects.map(project => `
            <div class="mb-3">
                <h5>${project.title}</h5>
                <p>${project.description}</p>
                <p><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
            </div>
        `).join('');
        
        // Display Suggestions
        const suggestions = document.getElementById('suggestions');
        suggestions.innerHTML = results.suggestions.map(suggestion => `
            <li>${suggestion}</li>
        `).join('');
    }, 1000);
}); 