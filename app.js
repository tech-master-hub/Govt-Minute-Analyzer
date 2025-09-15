// Government Minutes Explainer - Main Application Logic

class GovernmentMinutesApp {
    constructor() {
        this.currentPage = 'home';
        this.currentExtract = null;
        this.processingTimer = null;
        this.budgetChart = null;
        
        // Sample extract data for demo
        this.sampleData = {
            "shortId": "a7Kf3xQ2",
            "meta": {
                "municipality": "Keelapatti Panchayat",
                "meetingDate": "2025-07-14",
                "meetingType": "Monthly Panchayat Meeting",
                "sourceFileName": "minutes-july-2025.pdf",
                "uploadedAt": "2025-09-15T15:30:00Z"
            },
            "totals": {
                "budgetTotal": 4200000,
                "byDept": [
                    {"department": "Water Supply", "total": 1500000},
                    {"department": "Roads", "total": 1200000},
                    {"department": "Sanitation", "total": 800000},
                    {"department": "Education", "total": 500000},
                    {"department": "Health", "total": 200000}
                ]
            },
            "budgets": [
                {
                    "id": "b1",
                    "purpose": "Overhead tank repair and maintenance",
                    "department": "Water Supply",
                    "amount": {"amount": 1200000, "currency": "INR"},
                    "pages": [2],
                    "evidence": "Tank repair work to be completed by September end"
                },
                {
                    "id": "b2", 
                    "purpose": "Main road pothole filling",
                    "department": "Roads",
                    "amount": {"amount": 800000, "currency": "INR"},
                    "pages": [3],
                    "evidence": "Urgent repair of main road connecting to highway"
                },
                {
                    "id": "b3",
                    "purpose": "New drainage system installation",
                    "department": "Sanitation", 
                    "amount": {"amount": 600000, "currency": "INR"},
                    "pages": [4],
                    "evidence": "Installation of drainage pipes in ward 3 and 4"
                }
            ],
            "actions": [
                {
                    "id": "a1",
                    "title": "Repair village overhead water tank",
                    "department": "Water Supply",
                    "officer": {"name": "A. Kumar", "title": "Assistant Engineer", "dept": "PWD"},
                    "deadline": "2025-09-30",
                    "status": "proposed",
                    "pages": [2],
                    "priority": "high"
                },
                {
                    "id": "a2",
                    "title": "Complete road repair work on main street",
                    "department": "Roads", 
                    "officer": {"name": "S. Ravi", "title": "Village Development Officer"},
                    "deadline": "2025-08-30",
                    "status": "in-progress",
                    "pages": [3],
                    "priority": "medium"
                },
                {
                    "id": "a3",
                    "title": "Install new street lights in residential area",
                    "department": "Electricity",
                    "officer": {"name": "M. Priya", "title": "Electrical Supervisor"},
                    "deadline": "2025-10-15", 
                    "status": "proposed",
                    "pages": [5],
                    "priority": "low"
                }
            ],
            "contacts": [
                {"name": "Keelapatti Panchayat Office", "contact": "04362-245678"},
                {"name": "Village Development Officer", "contact": "9876543210"}
            ],
            "version": 1
        };

        this.departmentIcons = {
            "Water Supply": "💧",
            "Roads": "🛣️", 
            "Sanitation": "🗑️",
            "Education": "🏫",
            "Health": "🏥",
            "Electricity": "⚡",
            "Agriculture": "🌾",
            "Other": "📋"
        };

        this.init();
    }

    init() {
        console.log('Initializing Government Minutes App');
        this.setupEventListeners();
        
        // Check for shared view first
        if (!this.checkForSharedView()) {
            this.showPage('home');
        }
    }

    setupEventListeners() {
        // Upload functionality
        const uploadBox = document.getElementById('upload-box');
        const fileInput = document.getElementById('file-input');
        
        if (uploadBox && fileInput) {
            uploadBox.addEventListener('click', (e) => {
                e.preventDefault();
                fileInput.click();
            });
            uploadBox.addEventListener('dragover', this.handleDragOver.bind(this));
            uploadBox.addEventListener('dragleave', this.handleDragLeave.bind(this));
            uploadBox.addEventListener('drop', this.handleDrop.bind(this));
            fileInput.addEventListener('change', this.handleFileSelect.bind(this));
        }

        // Demo button - most important for testing
        const demoBtn = document.getElementById('demo-btn');
        if (demoBtn) {
            demoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Demo button clicked');
                this.showDemo();
            });
        }

        // Navigation buttons - setup with error handling
        setTimeout(() => {
            const backBtn = document.getElementById('back-btn');
            if (backBtn) {
                backBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showPage('home');
                });
            }

            // Action buttons
            const printBtn = document.getElementById('print-btn');
            const shareBtn = document.getElementById('share-btn');
            const printSharedBtn = document.getElementById('print-shared-btn');
            
            if (printBtn) printBtn.addEventListener('click', this.printCard.bind(this));
            if (shareBtn) shareBtn.addEventListener('click', this.showShareModal.bind(this));
            if (printSharedBtn) printSharedBtn.addEventListener('click', this.printCard.bind(this));

            // Modal functionality
            const modalClose = document.getElementById('modal-close');
            const shareModal = document.getElementById('share-modal');
            
            if (modalClose) modalClose.addEventListener('click', this.hideShareModal.bind(this));
            if (shareModal) {
                shareModal.addEventListener('click', (e) => {
                    if (e.target.classList.contains('modal-backdrop')) {
                        this.hideShareModal();
                    }
                });
            }

            // Copy functionality
            const copyBtn = document.getElementById('copy-btn');
            if (copyBtn) {
                copyBtn.addEventListener('click', this.copyShareLink.bind(this));
            }
        }, 100);
    }

    checkForSharedView() {
        const urlParams = new URLSearchParams(window.location.search);
        const shareId = urlParams.get('share');
        
        if (shareId) {
            console.log('Loading shared view for:', shareId);
            // Simulate loading shared data
            this.currentExtract = this.sampleData;
            setTimeout(() => {
                this.generateCitizenCard('shared-citizen-card');
                this.showPage('shared');
            }, 200);
            return true;
        }
        return false;
    }

    showPage(pageId) {
        console.log('Showing page:', pageId);
        
        try {
            // Hide all pages first
            const pages = document.querySelectorAll('.page');
            pages.forEach(page => {
                page.style.display = 'none';
                page.classList.remove('active');
            });

            // Show target page
            const targetPage = document.getElementById(`${pageId}-page`);
            if (targetPage) {
                targetPage.style.display = 'block';
                targetPage.classList.add('active');
                this.currentPage = pageId;
                console.log('Successfully showed page:', pageId);
            } else {
                console.error('Page not found:', `${pageId}-page`);
            }
        } catch (error) {
            console.error('Error showing page:', error);
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        const uploadBox = document.getElementById('upload-box');
        if (uploadBox) {
            uploadBox.classList.add('drag-over');
        }
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        const uploadBox = document.getElementById('upload-box');
        if (uploadBox) {
            uploadBox.classList.remove('drag-over');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        const uploadBox = document.getElementById('upload-box');
        if (uploadBox) {
            uploadBox.classList.remove('drag-over');
        }
        
        const files = Array.from(e.dataTransfer.files);
        this.processFiles(files);
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.processFiles(files);
    }

    processFiles(files) {
        const pdfFiles = files.filter(file => file.type === 'application/pdf');
        
        if (pdfFiles.length === 0) {
            alert('Please select PDF files only.');
            return;
        }

        if (pdfFiles[0].size > 50 * 1024 * 1024) { // 50MB limit
            alert('File size should be less than 50MB.');
            return;
        }

        this.startProcessing(pdfFiles[0]);
    }

    showDemo() {
        console.log('Starting demo with sample data');
        this.currentExtract = this.sampleData;
        this.startProcessing(null, true);
    }

    startProcessing(file, isDemo = false) {
        console.log('Starting processing, isDemo:', isDemo);
        
        try {
            // Show processing section
            const processingSection = document.getElementById('processing-section');
            if (processingSection) {
                processingSection.style.display = 'block';
            }
            
            // Start processing simulation
            this.simulateProcessing(isDemo);
        } catch (error) {
            console.error('Error in startProcessing:', error);
        }
    }

    simulateProcessing(isDemo) {
        const steps = [
            { step: 1, duration: isDemo ? 500 : 1000, message: 'File uploaded successfully' },
            { step: 2, duration: isDemo ? 800 : 2000, message: 'Extracting text from document' },
            { step: 3, duration: isDemo ? 1000 : 3000, message: 'Analyzing budget and action items' },
            { step: 4, duration: isDemo ? 600 : 1000, message: 'Generating citizen card' }
        ];

        let currentStep = 0;

        const processStep = () => {
            if (currentStep >= steps.length) {
                this.completeProcessing();
                return;
            }

            const step = steps[currentStep];
            console.log('Processing step:', step.step, step.message);
            
            const stepElement = document.querySelector(`[data-step="${step.step}"]`);
            const progressFill = document.getElementById('progress-fill');
            
            if (stepElement) {
                // Update step status
                stepElement.classList.add('active');
                const stepText = stepElement.querySelector('p');
                if (stepText) {
                    stepText.textContent = step.message;
                }
            }
            
            // Update progress bar
            if (progressFill) {
                const progress = ((currentStep + 1) / steps.length) * 100;
                progressFill.style.width = `${progress}%`;
            }

            setTimeout(() => {
                if (stepElement) {
                    stepElement.classList.remove('active');
                    stepElement.classList.add('completed');
                }
                currentStep++;
                processStep();
            }, step.duration);
        };

        processStep();
    }

    completeProcessing() {
        console.log('Processing complete, generating citizen card');
        
        try {
            // Generate the citizen card first
            this.generateCitizenCard('citizen-card');
            
            // Wait a bit then show results page
            setTimeout(() => {
                console.log('Showing results page');
                this.showPage('results');
                
                // Reset processing UI after showing results
                setTimeout(() => {
                    const processingSection = document.getElementById('processing-section');
                    if (processingSection) {
                        processingSection.style.display = 'none';
                    }
                    
                    document.querySelectorAll('.step').forEach(step => {
                        step.classList.remove('active', 'completed');
                    });
                    
                    const progressFill = document.getElementById('progress-fill');
                    if (progressFill) {
                        progressFill.style.width = '0%';
                    }
                }, 1000);
            }, 800);
        } catch (error) {
            console.error('Error in completeProcessing:', error);
        }
    }

    generateCitizenCard(containerId) {
        console.log('Generating citizen card for container:', containerId);
        
        const container = document.getElementById(containerId);
        const data = this.currentExtract;

        if (!container) {
            console.error('Container not found:', containerId);
            return;
        }

        if (!data) {
            console.error('No extract data available');
            return;
        }

        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
            }).format(amount);
        };

        const formatDate = (dateString) => {
            try {
                return new Date(dateString).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            } catch {
                return dateString;
            }
        };

        const getDepartmentIcon = (dept) => {
            return this.departmentIcons[dept] || this.departmentIcons["Other"];
        };

        const getStatusBadge = (status) => {
            return `<span class="status-badge status-${status}">${status}</span>`;
        };

        try {
            container.innerHTML = `
                <div class="card-header">
                    <h2>${data.meta.municipality || 'Local Government'}</h2>
                    <div class="card-meta">
                        <span>Meeting Date: ${formatDate(data.meta.meetingDate)}</span>
                        <span>Type: ${data.meta.meetingType || 'Meeting Minutes'}</span>
                    </div>
                </div>
                
                <div class="card-body">
                    <!-- Budget Summary Section -->
                    <div class="card-section">
                        <div class="section-header">
                            <span class="section-icon">💰</span>
                            <h3 class="section-title">Budget Summary / பட்ஜெட் சுருக்கம்</h3>
                        </div>
                        <div class="budget-summary">
                            <div class="budget-total">
                                <div class="budget-amount">${formatCurrency(data.totals.budgetTotal)}</div>
                                <div class="budget-label">Total Budget Allocation</div>
                            </div>
                            <div class="chart-container" style="position: relative; height: 200px;">
                                <canvas id="budget-chart-${containerId}"></canvas>
                            </div>
                        </div>
                        <div class="dept-breakdown">
                            ${data.totals.byDept.map(dept => `
                                <div class="dept-item">
                                    <span class="dept-name">${getDepartmentIcon(dept.department)} ${dept.department}</span>
                                    <span class="dept-amount">${formatCurrency(dept.total)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Action Items Section -->
                    <div class="card-section">
                        <div class="section-header">
                            <span class="section-icon">📋</span>
                            <h3 class="section-title">Action Items / செயல் திட்டங்கள்</h3>
                        </div>
                        <table class="actions-table">
                            <thead>
                                <tr>
                                    <th>Task / பணி</th>
                                    <th>Officer / अधिकारी</th>
                                    <th>Deadline / கால வரம்பு</th>
                                    <th>Status / स्थिति</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.actions.map(action => `
                                    <tr>
                                        <td>
                                            <div class="action-title">${action.title}</div>
                                            <div class="action-dept">${getDepartmentIcon(action.department)} ${action.department}</div>
                                        </td>
                                        <td>
                                            <div class="officer-info">
                                                <div class="officer-name">${action.officer?.name || 'Not assigned'}</div>
                                                <div class="officer-title">${action.officer?.title || ''}</div>
                                            </div>
                                        </td>
                                        <td>${formatDate(action.deadline)}</td>
                                        <td>${getStatusBadge(action.status)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    <!-- Timeline Section -->
                    <div class="card-section">
                        <div class="section-header">
                            <span class="section-icon">⏰</span>
                            <h3 class="section-title">Upcoming Deadlines / வரும் கால வரம்புகள்</h3>
                        </div>
                        <div class="timeline">
                            ${data.actions
                                .filter(action => action.deadline)
                                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                                .slice(0, 5)
                                .map(action => `
                                    <div class="timeline-item">
                                        <div class="timeline-date">${formatDate(action.deadline)}</div>
                                        <div class="timeline-task">${getDepartmentIcon(action.department)} ${action.title}</div>
                                    </div>
                                `).join('')}
                        </div>
                    </div>

                    <!-- Contacts Section -->
                    <div class="card-section">
                        <div class="section-header">
                            <span class="section-icon">📞</span>
                            <h3 class="section-title">Contact Information / संपर्क जानकारी</h3>
                        </div>
                        <div class="contacts-list">
                            ${data.contacts.map(contact => `
                                <div class="contact-item">
                                    <span class="contact-icon">🏛️</span>
                                    <div class="contact-info">
                                        <h5>${contact.name}</h5>
                                        <div class="contact-detail">${contact.contact}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;

            console.log('Citizen card HTML generated successfully');

            // Generate budget chart after DOM is updated
            setTimeout(() => {
                this.generateBudgetChart(data, containerId);
            }, 300);
        } catch (error) {
            console.error('Error generating citizen card:', error);
        }
    }

    generateBudgetChart(data, containerId) {
        console.log('Generating budget chart for:', containerId);
        
        const canvas = document.getElementById(`budget-chart-${containerId}`);
        if (!canvas) {
            console.error('Canvas not found for chart:', `budget-chart-${containerId}`);
            return;
        }

        try {
            const ctx = canvas.getContext('2d');
            
            // Destroy existing chart if it exists
            if (this.budgetChart) {
                this.budgetChart.destroy();
            }

            const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'];
            
            this.budgetChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: data.totals.byDept.map(dept => dept.department),
                    datasets: [{
                        data: data.totals.byDept.map(dept => dept.total),
                        backgroundColor: colors.slice(0, data.totals.byDept.length),
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const value = new Intl.NumberFormat('en-IN', {
                                        style: 'currency',
                                        currency: 'INR',
                                        maximumFractionDigits: 0
                                    }).format(context.raw);
                                    return `${context.label}: ${value}`;
                                }
                            }
                        }
                    }
                }
            });

            console.log('Budget chart generated successfully');
        } catch (error) {
            console.error('Error generating budget chart:', error);
        }
    }

    showShareModal() {
        const modal = document.getElementById('share-modal');
        const shortId = this.currentExtract?.shortId || 'demo123';
        const shareUrl = `${window.location.origin}${window.location.pathname}?share=${shortId}`;
        
        const shareUrlInput = document.getElementById('share-url');
        if (shareUrlInput) {
            shareUrlInput.value = shareUrl;
        }
        
        this.generateQRCode(shareUrl);
        
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    hideShareModal() {
        const modal = document.getElementById('share-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    generateQRCode(url) {
        const qrContainer = document.getElementById('qr-code');
        if (!qrContainer) return;
        
        qrContainer.innerHTML = '';
        
        try {
            if (typeof qrcode !== 'undefined') {
                const qr = qrcode(0, 'M');
                qr.addData(url);
                qr.make();
                
                const qrImg = qr.createImgTag(4, 8);
                qrContainer.innerHTML = qrImg;
            } else {
                // Fallback QR code placeholder
                qrContainer.innerHTML = '<div style="width: 150px; height: 150px; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #666; text-align: center;">QR Code<br>Preview</div>';
            }
        } catch (error) {
            console.error('Error generating QR code:', error);
            qrContainer.innerHTML = '<div style="width: 150px; height: 150px; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #666; text-align: center;">QR Code<br>Preview</div>';
        }
    }

    copyShareLink() {
        const shareUrl = document.getElementById('share-url');
        if (!shareUrl) return;
        
        shareUrl.select();
        shareUrl.setSelectionRange(0, 99999);
        
        try {
            document.execCommand('copy');
            const copyBtn = document.getElementById('copy-btn');
            if (copyBtn) {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                copyBtn.style.background = '#10b981';
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.background = '';
                }, 2000);
            }
        } catch (error) {
            alert('Please manually copy the link');
        }
    }

    printCard() {
        window.print();
    }

    showLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app');
    window.govMinutesApp = new GovernmentMinutesApp();
});

// Export for global access
window.GovernmentMinutesApp = GovernmentMinutesApp;