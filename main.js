// Mobile Menu Toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const nav = document.querySelector('.nav');

if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', () => {
        nav.classList.toggle('open');
    });
}

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const formResult = document.getElementById('form-result');

// Modal Handling
function setupAchieversModal() {
    console.log("Setting up achievers modal...");
    const openModalBtn = document.getElementById('openModalBtn');
    const modal = document.getElementById('achieversModal');
    const closeModalSpan = document.querySelector('.close-modal');

    if (openModalBtn && modal && closeModalSpan) {
        // Open Modal
        openModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Disable scroll
        });

        // Close Modal on X
        closeModalSpan.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Enable scroll
        });

        // Close Modal on clicking outside
        window.addEventListener('click', (e) => {
            if (e.target == modal) {
                modal.style.display = 'none';
                document.body.style.overflow = ''; // Enable scroll
            }
        });

        // Close Modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = ''; // Enable scroll
            }
        });

    } else {
        console.error("Modal elements not found:", { openModalBtn, modal, closeModalSpan });
    }
}

// Run setup immediately if DOM is ready, or wait for load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAchieversModal);
} else {
    setupAchieversModal();
}

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        formResult.innerHTML = "Sending...";
        formResult.style.display = "block";
        formResult.style.color = "#666";

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    formResult.innerHTML = "Success! Your inquiry has been sent.";
                    formResult.style.color = "green";
                    contactForm.reset();
                } else {
                    console.log(response);
                    formResult.innerHTML = json.message;
                    formResult.style.color = "red";
                }
            })
            .catch(error => {
                console.log(error);
                formResult.innerHTML = "Something went wrong!";
                formResult.style.color = "red";
            })
            .then(function () {
                setTimeout(() => {
                    formResult.style.display = "none";
                }, 5000);
            });
    });
}

// Attendance Section Logic
function setupAttendance() {
    const viewBtn = document.getElementById('viewAttendanceBtn');
    const msgElement = document.getElementById('attendanceMsg');

    // Attendance Modal Elements
    const attendanceModal = document.getElementById('attendanceModal');
    const closeAttendance = document.querySelector('.close-attendance');
    const attendanceImageContainer = document.getElementById('attendanceImageContainer');
    const attendanceTitle = document.getElementById('attendanceTitle');

    if (viewBtn && attendanceModal) {
        viewBtn.addEventListener('click', () => {
            const yearSelect = document.getElementById('att-year');
            const monthSelect = document.getElementById('att-month');

            const year = yearSelect.value;
            const month = monthSelect.value;
            const monthName = monthSelect.options[monthSelect.selectedIndex].text;

            // Simplified Logic: Allow opening any selection.
            // If the user wants to restrict future months, we can add logic here.
            // For now, let's assume if they select it, we try to show it.

            // Allow 2026 Jan-Present, and all 2025. 
            // Simple check: If 2026 and month is > current month (Jan=0), maybe warn?
            // Actually, let's just show it. If file missing, it shows broken image/pdf fallback which is fine for now or we can handle onerror to show "Not Uploaded".

            // Set Title
            attendanceTitle.innerText = `Attendance - ${monthName} ${year}`;
            msgElement.style.display = 'none';

            // Set Content
            // Try to load JPG first. If it fails (onerror), load PDF in iframe.
            const imagePath = `images/attendance/${year}/${month}.jpg`;
            const pdfPath = `images/attendance/${year}/${month}.pdf`;

            attendanceImageContainer.innerHTML = `
                 <div style="text-align: center;">
                     <img src="${imagePath}" 
                         alt="Attendance for ${monthName} ${year}" 
                         class="modal-image"
                         onerror="this.style.display='none'; document.getElementById('pdf-fallback-${month}-${year}').style.display='block';">
                     <iframe id="pdf-fallback-${month}-${year}" 
                             src="${pdfPath}" 
                             class="modal-pdf" 
                             style="display: none;">
                     </iframe>
                 </div>
             `;

            // Open Modal
            attendanceModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });

        // Close Modal Logic
        if (closeAttendance) {
            closeAttendance.addEventListener('click', () => {
                attendanceModal.style.display = 'none';
                document.body.style.overflow = '';
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target == attendanceModal) {
                attendanceModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && attendanceModal.style.display === 'block') {
                attendanceModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
}

// Initialize Attendance Logic
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAttendance);
} else {
    setupAttendance();
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu if open
            if (nav && nav.classList.contains('open')) {
                nav.classList.remove('open');
            }
        }
    });
});
