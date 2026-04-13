let currentResume = {
  id: null,
  title: 'My Resume',
  template: 'modern',
  content: {
    contact: {
      name: 'Jordan Smith',
      email: 'jordan.smith@email.com',
      phone: '(555) 123-4567',
      location: 'San Francisco, CA',
      linkedin: 'github.com/jsmith-dev'
    },
    summary: 'Innovative Software Engineer with 5+ years of experience...',
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'TechNova Solutions',
        period: '2021 — Present',
        bullets: [
          'Architected and led the migration of a legacy monolithic application to microservices',
          'Improved system throughput by 40% through implementing event-driven data pipeline'
        ]
      }
    ],
    education: [],
    skills: {
      languages: 'JavaScript, TypeScript, Python',
      frameworks: 'React, Node.js, Express',
      cloud: 'AWS, Docker, Kubernetes',
      tools: 'Git, CI/CD, Redis'
    },
    certifications: []
  },
  ats_score: 85
};

let aiSuggestions = [];

// Initialize editor
document.addEventListener('DOMContentLoaded', async () => {
  // Allow demo mode without login
  const urlParams = new URLSearchParams(window.location.search);
  const resumeId = urlParams.get('id');

  if (resumeId && api.token) {
    await loadResume(resumeId);
  }

  setupEventListeners();
  renderResume();
  
  // Show demo notice if not logged in
  if (!api.token) {
    showNotification('Demo Mode - Login to save your resume', 5000);
  }
});

// Add CSS for editable fields
const style = document.createElement('style');
style.textContent = `
  .editable-field {
    outline: none;
    transition: all 0.2s;
    border-radius: 2px;
    padding: 2px 4px;
    margin: -2px -4px;
  }
  .editable-field:hover {
    background-color: rgba(80, 72, 229, 0.05);
  }
  .editable-field:focus {
    background-color: rgba(80, 72, 229, 0.1);
    box-shadow: 0 0 0 2px rgba(80, 72, 229, 0.2);
  }
`;
document.head.appendChild(style);

async function loadResume(id) {
  try {
    const resume = await api.getResume(id);
    currentResume = resume;
    renderResume();
  } catch (error) {
    console.error('Failed to load resume:', error);
    alert('Failed to load resume');
  }
}

function setupEventListeners() {
  document.getElementById('saveBtn')?.addEventListener('click', saveResume);
  document.getElementById('downloadBtn')?.addEventListener('click', downloadPDF);
  document.getElementById('aiAuditBtn')?.addEventListener('click', runAIAudit);
  document.getElementById('userMenuBtn')?.addEventListener('click', toggleUserMenu);
  document.getElementById('logoutBtn')?.addEventListener('click', logout);
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('userDropdown');
    const menuBtn = document.getElementById('userMenuBtn');
    if (dropdown && !dropdown.contains(e.target) && !menuBtn.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });
}

function toggleUserMenu(e) {
  e.stopPropagation();
  const dropdown = document.getElementById('userDropdown');
  if (!api.token) {
    window.location.href = '/login';
  } else {
    dropdown?.classList.toggle('hidden');
  }
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    api.clearToken();
    window.location.href = '/logout';
  }
}

async function saveResume() {
  if (!api.token) {
    if (confirm('Please login to save your resume. Go to login page?')) {
      window.location.href = '/login';
    }
    return;
  }

  try {
    updateSaveStatus('saving');
    
    if (currentResume.id) {
      await api.updateResume(currentResume.id, currentResume);
    } else {
      const result = await api.createResume(currentResume.title, currentResume.template, currentResume.content);
      currentResume.id = result.id;
    }
    showNotification('Resume saved successfully');
    updateSaveStatus('saved');
  } catch (error) {
    console.error('Save failed:', error);
    showNotification('Failed to save resume', 3000, 'error');
    updateSaveStatus('unsaved');
  }
}

function updateSaveStatus(status) {
  const statusEl = document.getElementById('saveStatus');
  if (!statusEl) return;
  
  if (status === 'saved') {
    statusEl.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-500"></span><span class="text-xs font-medium text-slate-600 dark:text-slate-400">All changes saved</span>';
    statusEl.className = 'ml-6 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center gap-2';
  } else if (status === 'saving') {
    statusEl.innerHTML = '<span class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span><span class="text-xs font-medium text-slate-600 dark:text-slate-400">Saving...</span>';
    statusEl.className = 'ml-6 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center gap-2';
  } else if (status === 'unsaved') {
    statusEl.innerHTML = '<span class="w-2 h-2 rounded-full bg-orange-500"></span><span class="text-xs font-medium text-slate-600 dark:text-slate-400">Unsaved changes</span>';
    statusEl.className = 'ml-6 px-3 py-1 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center gap-2';
  }
}

function downloadPDF() {
  // Show download options
  const options = confirm('Download Options:\n\nOK = Download as PDF\nCancel = See more options');
  
  if (options) {
    // Simple PDF download via print
    window.print();
  } else {
    showDownloadModal();
  }
}

function showDownloadModal() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-bold text-slate-900 dark:text-white">Download Resume</h3>
        <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-slate-600">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      
      <div class="space-y-3">
        <button onclick="downloadAsPDF()" class="w-full flex items-center gap-4 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group">
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition">
            <span class="material-symbols-outlined text-red-600 text-2xl">picture_as_pdf</span>
          </div>
          <div class="text-left flex-1">
            <p class="font-bold text-slate-900 dark:text-white">PDF Document</p>
            <p class="text-xs text-slate-500">Best for applications</p>
          </div>
          <span class="material-symbols-outlined text-slate-400 group-hover:text-primary">arrow_forward</span>
        </button>
        
        <button onclick="downloadAsWord()" class="w-full flex items-center gap-4 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
            <span class="material-symbols-outlined text-blue-600 text-2xl">description</span>
          </div>
          <div class="text-left flex-1">
            <p class="font-bold text-slate-900 dark:text-white">Word Document</p>
            <p class="text-xs text-slate-500">Editable format</p>
          </div>
          <span class="material-symbols-outlined text-slate-400 group-hover:text-primary">arrow_forward</span>
        </button>
        
        <button onclick="downloadAsText()" class="w-full flex items-center gap-4 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition">
            <span class="material-symbols-outlined text-green-600 text-2xl">text_snippet</span>
          </div>
          <div class="text-left flex-1">
            <p class="font-bold text-slate-900 dark:text-white">Plain Text</p>
            <p class="text-xs text-slate-500">ATS-friendly</p>
          </div>
          <span class="material-symbols-outlined text-slate-400 group-hover:text-primary">arrow_forward</span>
        </button>
        
        <button onclick="copyToClipboard()" class="w-full flex items-center gap-4 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition">
            <span class="material-symbols-outlined text-purple-600 text-2xl">content_copy</span>
          </div>
          <div class="text-left flex-1">
            <p class="font-bold text-slate-900 dark:text-white">Copy to Clipboard</p>
            <p class="text-xs text-slate-500">Quick paste</p>
          </div>
          <span class="material-symbols-outlined text-slate-400 group-hover:text-primary">arrow_forward</span>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function downloadAsPDF() {
  document.querySelector('.fixed')?.remove();
  window.print();
}

function downloadAsWord() {
  const content = generateResumeHTML();
  const blob = new Blob([content], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${currentResume.content.contact.name.replace(/\s+/g, '_')}_Resume.doc`;
  a.click();
  URL.revokeObjectURL(url);
  document.querySelector('.fixed')?.remove();
  showNotification('Resume downloaded as Word document');
}

function downloadAsText() {
  const text = generateResumeText();
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${currentResume.content.contact.name.replace(/\s+/g, '_')}_Resume.txt`;
  a.click();
  URL.revokeObjectURL(url);
  document.querySelector('.fixed')?.remove();
  showNotification('Resume downloaded as text file');
}

function copyToClipboard() {
  const text = generateResumeText();
  navigator.clipboard.writeText(text).then(() => {
    document.querySelector('.fixed')?.remove();
    showNotification('Resume copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy:', err);
    showNotification('Failed to copy to clipboard', 3000, 'error');
  });
}

function generateResumeHTML() {
  const { contact, summary, experience, skills, education = [], certifications = [] } = currentResume.content;
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${contact.name} - Resume</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { font-size: 28px; margin-bottom: 10px; }
        h2 { font-size: 18px; border-bottom: 2px solid #5048e5; padding-bottom: 5px; margin-top: 20px; }
        .contact { margin-bottom: 20px; }
        ul { margin: 10px 0; }
    </style>
</head>
<body>
    <h1>${contact.name}</h1>
    <div class="contact">
        ${contact.email} | ${contact.phone} | ${contact.location} | ${contact.linkedin}
    </div>
    
    <h2>Professional Summary</h2>
    <p>${summary}</p>
    
    <h2>Experience</h2>
    ${experience.map(exp => `
        <div>
            <strong>${exp.title} | ${exp.company}</strong> <span style="float:right">${exp.period}</span>
            <ul>
                ${exp.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
            </ul>
        </div>
    `).join('')}
    
    ${education.length > 0 ? `
    <h2>Education</h2>
    ${education.map(edu => `
        <div>
            <strong>${edu.degree}</strong> <span style="float:right">${edu.year}</span><br>
            ${edu.school}
            ${edu.details ? `<br><em>${edu.details}</em>` : ''}
        </div>
    `).join('')}
    ` : ''}
    
    <h2>Skills</h2>
    <p>
        <strong>Languages:</strong> ${skills.languages}<br>
        <strong>Frameworks:</strong> ${skills.frameworks}<br>
        <strong>Cloud:</strong> ${skills.cloud}<br>
        <strong>Tools:</strong> ${skills.tools}
    </p>
    
    ${certifications.length > 0 ? `
    <h2>Certifications</h2>
    ${certifications.map(cert => `<div><strong>${cert.name}</strong> - ${cert.issuer}, ${cert.year}</div>`).join('')}
    ` : ''}
</body>
</html>
  `;
}

function generateResumeText() {
  const { contact, summary, experience, skills, education = [], certifications = [] } = currentResume.content;
  let text = `${contact.name}\n`;
  text += `${contact.email} | ${contact.phone} | ${contact.location} | ${contact.linkedin}\n\n`;
  text += `PROFESSIONAL SUMMARY\n${summary}\n\n`;
  text += `EXPERIENCE\n`;
  experience.forEach(exp => {
    text += `\n${exp.title} | ${exp.company}\n${exp.period}\n`;
    exp.bullets.forEach(bullet => text += `• ${bullet}\n`);
  });
  if (education.length > 0) {
    text += `\nEDUCATION\n`;
    education.forEach(edu => {
      text += `\n${edu.degree} - ${edu.year}\n${edu.school}\n`;
      if (edu.details) text += `${edu.details}\n`;
    });
  }
  text += `\nSKILLS\n`;
  text += `Languages: ${skills.languages}\n`;
  text += `Frameworks: ${skills.frameworks}\n`;
  text += `Cloud: ${skills.cloud}\n`;
  text += `Tools: ${skills.tools}\n`;
  if (certifications.length > 0) {
    text += `\nCERTIFICATIONS\n`;
    certifications.forEach(cert => text += `${cert.name} - ${cert.issuer}, ${cert.year}\n`);
  }
  return text;
}

async function runAIAudit() {
  if (!api.token) {
    if (confirm('Please login to use AI features. Go to login page?')) {
      window.location.href = '/login';
    }
    return;
  }

  const jobDescription = prompt('Paste the job description to analyze against:');
  if (!jobDescription) return;

  try {
    showNotification('Running AI analysis...');
    
    const analysis = await api.analyzeResume(currentResume.content, jobDescription);
    currentResume.ats_score = analysis.score;
    
    if (currentResume.id) {
      const suggestions = await api.getSuggestions(currentResume.id, jobDescription);
      aiSuggestions = suggestions;
      renderSuggestions(suggestions);
    }
    
    updateATSScore(analysis.score);
    showNotification(`Analysis complete! Score: ${analysis.score}%`);
  } catch (error) {
    console.error('AI audit failed:', error);
    showNotification('AI audit failed. Please try again.', 3000, 'error');
  }
}

function renderResume() {
  const preview = document.getElementById('resumePreview');
  if (!preview) return;

  const { contact, summary, experience, skills, education = [], certifications = [] } = currentResume.content;

  preview.innerHTML = `
    <div class="border-b-2 border-slate-900 dark:border-slate-100 pb-6 mb-8">
      <h1 class="text-4xl font-bold uppercase tracking-tight text-slate-900 dark:text-slate-100 mb-2" data-editable="contact" data-field="name">${contact.name}</h1>
      <div class="flex flex-wrap gap-4 text-sm font-medium text-slate-600 dark:text-slate-400">
        <span class="flex items-center gap-1.5">
          <span class="material-symbols-outlined text-base">email</span> 
          <span data-editable="contact" data-field="email">${contact.email}</span>
        </span>
        <span class="flex items-center gap-1.5">
          <span class="material-symbols-outlined text-base">phone</span> 
          <span data-editable="contact" data-field="phone">${contact.phone}</span>
        </span>
        <span class="flex items-center gap-1.5">
          <span class="material-symbols-outlined text-base">location_on</span> 
          <span data-editable="contact" data-field="location">${contact.location}</span>
        </span>
        <span class="flex items-center gap-1.5">
          <span class="material-symbols-outlined text-base">link</span> 
          <span data-editable="contact" data-field="linkedin">${contact.linkedin}</span>
        </span>
      </div>
    </div>
    
    <section class="mb-8" id="summary">
      <h3 class="text-lg font-bold uppercase text-primary mb-3 border-b border-slate-100 dark:border-slate-700 pb-1">Professional Summary</h3>
      <p class="text-slate-700 dark:text-slate-300 leading-relaxed text-sm" data-editable="summary">${summary}</p>
    </section>
    
    <section class="mb-8" id="experience">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold uppercase text-primary border-b border-slate-100 dark:border-slate-700 pb-1">Experience</h3>
        <button onclick="addExperience()" class="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">add_circle</span> Add
        </button>
      </div>
      ${experience.map((exp, idx) => `
        <div class="mb-6 relative group">
          <button onclick="deleteExperience(${idx})" class="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
            <span class="material-symbols-outlined text-sm">close</span>
          </button>
          <div class="flex justify-between items-baseline mb-1">
            <h4 class="font-bold text-slate-900 dark:text-slate-100" data-editable="experience">${exp.title} | ${exp.company}</h4>
            <span class="text-sm font-semibold text-slate-500" data-editable="experience">${exp.period}</span>
          </div>
          <ul class="list-disc list-outside ml-4 text-sm text-slate-700 dark:text-slate-300 flex flex-col gap-1.5">
            ${exp.bullets.map(bullet => `<li data-editable="experience">${bullet}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </section>
    
    ${education.length > 0 ? `
    <section class="mb-8" id="education">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold uppercase text-primary border-b border-slate-100 dark:border-slate-700 pb-1">Education</h3>
        <button onclick="addEducation()" class="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">add_circle</span> Add
        </button>
      </div>
      ${education.map((edu, idx) => `
        <div class="mb-4 relative group">
          <button onclick="deleteEducation(${idx})" class="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
            <span class="material-symbols-outlined text-sm">close</span>
          </button>
          <div class="flex justify-between items-baseline mb-1">
            <h4 class="font-bold text-slate-900 dark:text-slate-100" data-editable="education">${edu.degree}</h4>
            <span class="text-sm font-semibold text-slate-500" data-editable="education">${edu.year}</span>
          </div>
          <p class="text-sm text-slate-700 dark:text-slate-300" data-editable="education">${edu.school}</p>
          ${edu.details ? `<p class="text-xs text-slate-600 dark:text-slate-400 mt-1" data-editable="education">${edu.details}</p>` : ''}
        </div>
      `).join('')}
    </section>
    ` : `
    <section class="mb-8" id="education">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold uppercase text-primary border-b border-slate-100 dark:border-slate-700 pb-1">Education</h3>
        <button onclick="addEducation()" class="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">add_circle</span> Add
        </button>
      </div>
      <p class="text-sm text-slate-500 italic">Click "Add" to add your education</p>
    </section>
    `}
    
    <section class="mb-8" id="skills">
      <h3 class="text-lg font-bold uppercase text-primary mb-4 border-b border-slate-100 dark:border-slate-700 pb-1">Skills</h3>
      <div class="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
        <p class="text-slate-700 dark:text-slate-300">
          <span class="font-bold text-slate-900 dark:text-slate-100">Languages:</span> 
          <span data-editable="skills" data-field="languages">${skills.languages}</span>
        </p>
        <p class="text-slate-700 dark:text-slate-300">
          <span class="font-bold text-slate-900 dark:text-slate-100">Frameworks:</span> 
          <span data-editable="skills" data-field="frameworks">${skills.frameworks}</span>
        </p>
        <p class="text-slate-700 dark:text-slate-300">
          <span class="font-bold text-slate-900 dark:text-slate-100">Cloud:</span> 
          <span data-editable="skills" data-field="cloud">${skills.cloud}</span>
        </p>
        <p class="text-slate-700 dark:text-slate-300">
          <span class="font-bold text-slate-900 dark:text-slate-100">Tools:</span> 
          <span data-editable="skills" data-field="tools">${skills.tools}</span>
        </p>
      </div>
    </section>
    
    ${certifications.length > 0 ? `
    <section id="certifications">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold uppercase text-primary border-b border-slate-100 dark:border-slate-700 pb-1">Certifications</h3>
        <button onclick="addCertification()" class="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">add_circle</span> Add
        </button>
      </div>
      ${certifications.map((cert, idx) => `
        <div class="mb-3 relative group">
          <button onclick="deleteCertification(${idx})" class="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
            <span class="material-symbols-outlined text-sm">close</span>
          </button>
          <h4 class="font-bold text-slate-900 dark:text-slate-100 text-sm" data-editable="certification">${cert.name}</h4>
          <p class="text-xs text-slate-600 dark:text-slate-400" data-editable="certification">${cert.issuer} • ${cert.year}</p>
        </div>
      `).join('')}
    </section>
    ` : `
    <section id="certifications">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold uppercase text-primary border-b border-slate-100 dark:border-slate-700 pb-1">Certifications</h3>
        <button onclick="addCertification()" class="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">add_circle</span> Add
        </button>
      </div>
      <p class="text-sm text-slate-500 italic">Click "Add" to add certifications</p>
    </section>
    `}
  `;
  
  // Make fields editable
  makeEditable();
}

function renderSuggestions(suggestions) {
  const container = document.getElementById('suggestionsContainer');
  if (!container) return;

  container.innerHTML = suggestions.map(s => `
    <div class="p-4 bg-amber-50 border border-amber-100 rounded-xl">
      <div class="flex items-start gap-3">
        <span class="text-amber-500 text-lg">💡</span>
        <div class="flex-1">
          <p class="text-sm font-bold text-amber-900 mb-1">${s.suggestion_type}</p>
          <p class="text-xs text-amber-800 leading-relaxed">${s.reason}</p>
          ${s.suggested_text ? `<p class="text-xs mt-2 font-mono bg-white p-2 rounded">${s.suggested_text}</p>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function updateATSScore(score) {
  const scoreElement = document.getElementById('atsScore');
  if (scoreElement) {
    scoreElement.textContent = `${score}%`;
  }
}

function showNotification(message, duration = 3000, type = 'success') {
  const notification = document.createElement('div');
  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
  notification.className = `fixed top-20 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'all 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, duration);
}
