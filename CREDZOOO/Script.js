// Navigation Toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const body = document.body;

menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
    body.classList.toggle('menu-open');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        body.classList.remove('menu-open');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && 
        !menuToggle.contains(e.target)) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        body.classList.remove('menu-open');
    }
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        nav.style.boxShadow = 'none';
    }
});

// FAQ Toggle
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Tab Switching
function switchTab(tabName) {
    document.querySelectorAll('.calc-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.calc-content').forEach(content => {
        content.classList.remove('active');
    });
    
    event.target.classList.add('active');
    document.getElementById(tabName + 'Calc').classList.add('active');
    
    if (tabName === 'emi') {
        updateEMICalculator();
    } else if (tabName === 'savings') {
        updateSavingsCalculator();
    }
}

// Utility Functions
function formatMoney(amount) {
    if (isNaN(amount) || amount < 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

function formatNumber(num) {
    if (isNaN(num) || num < 0) return '0';
    return new Intl.NumberFormat('en-IN').format(num);
}

// EMI Calculator
const loanAmount = document.getElementById('loanAmount');
const interestRate = document.getElementById('interestRate');
const loanTenure = document.getElementById('loanTenure');

const loanAmtVal = document.getElementById('loanAmtVal');
const rateVal = document.getElementById('rateVal');
const tenureVal = document.getElementById('tenureVal');

const emiDisplay = document.getElementById('emiDisplay');
const principalDisplay = document.getElementById('principalDisplay');
const interestDisplay = document.getElementById('interestDisplay');
const totalDisplay = document.getElementById('totalDisplay');

let loanChart = null;

function updateEMICalculator() {
    const P = parseFloat(loanAmount.value);
    const R = parseFloat(interestRate.value) / 12 / 100;
    const N = parseFloat(loanTenure.value) * 12;
    
    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalPayable = emi * N;
    const totalInterest = totalPayable - P;
    
    loanAmtVal.textContent = formatNumber(P);
    rateVal.textContent = interestRate.value;
    tenureVal.textContent = loanTenure.value;
    
    emiDisplay.textContent = formatMoney(emi);
    principalDisplay.textContent = formatMoney(P);
    interestDisplay.textContent = formatMoney(totalInterest);
    totalDisplay.textContent = formatMoney(totalPayable);
    
    updateLoanChart(P, totalInterest);
}

function updateLoanChart(principal, interest) {
    const ctx = document.getElementById('loanChart');
    
    if (loanChart) {
        loanChart.destroy();
    }
    
    loanChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Principal', 'Interest'],
            datasets: [{
                data: [principal, interest],
                backgroundColor: ['#0056B3', '#007BFF'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        font: { size: 12 }
                    }
                }
            }
        }
    });
}

loanAmount.addEventListener('input', updateEMICalculator);
interestRate.addEventListener('input', updateEMICalculator);
loanTenure.addEventListener('input', updateEMICalculator);

// Eligibility Calculator
function checkEligibility() {
    const incomeInput = document.getElementById('monthlyIncome');
    const ageInput = document.getElementById('age');
    const creditScoreSelect = document.getElementById('creditScore');
    const currentEMIInput = document.getElementById('currentEMI');
    const errorDiv = document.getElementById('eligibilityError');
    const resultDiv = document.getElementById('eligibilityResult');
    const resultText = document.getElementById('eligibilityText');
    
    errorDiv.classList.remove('show');
    errorDiv.textContent = '';
    resultDiv.style.display = 'none';
    [incomeInput, ageInput, creditScoreSelect, currentEMIInput].forEach(el => el.classList.remove('error'));
    
    const income = parseFloat(incomeInput.value);
    const age = parseFloat(ageInput.value);
    const currentEMI = parseFloat(currentEMIInput.value) || 0;
    const creditScore = creditScoreSelect.value;
    
    let errors = [];
    
    if (!income || income <= 0) {
        errors.push('Please enter a valid monthly income');
        incomeInput.classList.add('error');
    }
    
    if (!age || age < 21 || age > 65) {
        errors.push('Age must be between 21 and 65 years');
        ageInput.classList.add('error');
    }
    
    if (!creditScore) {
        errors.push('Please select your credit score');
        creditScoreSelect.classList.add('error');
    }
    
    if (currentEMI < 0) {
        errors.push('Current EMI cannot be negative');
        currentEMIInput.classList.add('error');
    }
    
    if (errors.length > 0) {
        errorDiv.textContent = errors.join('. ');
        errorDiv.classList.add('show');
        return;
    }
    
    const maxEMI = income * 0.5;
    const availableEMI = maxEMI - currentEMI;
    
    if (availableEMI <= 0) {
        errorDiv.textContent = 'Your current EMI obligations exceed 50% of your income. Please reduce existing EMIs before applying.';
        errorDiv.classList.add('show');
        return;
    }
    
    const maxLoan = availableEMI * 200;
    
    let message = `Based on your monthly income of ${formatMoney(income)} and current EMI of ${formatMoney(currentEMI)}, you may be eligible for a loan up to ${formatMoney(maxLoan)}. `;
    
    if (creditScore === '750+') {
        message += 'With your excellent credit score, you qualify for the best interest rates starting from 8.5%!';
    } else if (creditScore === '700-749') {
        message += 'Your good credit score qualifies you for competitive rates starting from 9.0%.';
    } else if (creditScore === '650-699') {
        message += 'Your credit score qualifies you for reasonable rates starting from 9.5%. Consider improving your score for even better rates.';
    }
    
    resultText.textContent = message;
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Savings Calculator
const currentBalance = document.getElementById('currentBalance');
const currentRate = document.getElementById('currentRate');
const newRate = document.getElementById('newRate');
const remainingTenure = document.getElementById('remainingTenure');

const currentBalanceVal = document.getElementById('currentBalanceVal');
const currentRateVal = document.getElementById('currentRateVal');
const newRateVal = document.getElementById('newRateVal');
const remainingTenureVal = document.getElementById('remainingTenureVal');

const savingsDisplay = document.getElementById('savingsDisplay');
const currentEMIDisplay = document.getElementById('currentEMIDisplay');
const newEMIDisplay = document.getElementById('newEMIDisplay');
const monthlySavingsDisplay = document.getElementById('monthlySavingsDisplay');

let savingsChart = null;

function updateSavingsCalculator() {
    const P = parseFloat(currentBalance.value);
    const R1 = parseFloat(currentRate.value) / 12 / 100;
    const R2 = parseFloat(newRate.value) / 12 / 100;
    const N = parseFloat(remainingTenure.value) * 12;
    
    const currentEMI = (P * R1 * Math.pow(1 + R1, N)) / (Math.pow(1 + R1, N) - 1);
    const newEMI = (P * R2 * Math.pow(1 + R2, N)) / (Math.pow(1 + R2, N) - 1);
    const monthlySavings = currentEMI - newEMI;
    const totalSavings = monthlySavings * N;
    
    currentBalanceVal.textContent = formatNumber(P);
    currentRateVal.textContent = currentRate.value;
    newRateVal.textContent = newRate.value;
    remainingTenureVal.textContent = remainingTenure.value;
    
    savingsDisplay.textContent = formatMoney(totalSavings);
    currentEMIDisplay.textContent = formatMoney(currentEMI);
    newEMIDisplay.textContent = formatMoney(newEMI);
    monthlySavingsDisplay.textContent = formatMoney(monthlySavings);
    
    updateSavingsChart(currentEMI * N, newEMI * N);
}

function updateSavingsChart(currentTotal, newTotal) {
    const ctx = document.getElementById('savingsChart');
    
    if (savingsChart) {
        savingsChart.destroy();
    }
    
    savingsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Current Loan', 'New Loan'],
            datasets: [{
                label: 'Total Amount',
                data: [currentTotal, newTotal],
                backgroundColor: ['#dc3545', '#28a745'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return formatMoney(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        color: '#ffffff',
                        callback: function(value) {
                            return '₹' + (value / 100000).toFixed(0) + 'L';
                        }
                    },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                },
                x: {
                    ticks: { color: '#ffffff' },
                    grid: { display: false }
                }
            }
        }
    });
}

currentBalance.addEventListener('input', updateSavingsCalculator);
currentRate.addEventListener('input', updateSavingsCalculator);
newRate.addEventListener('input', updateSavingsCalculator);
remainingTenure.addEventListener('input', updateSavingsCalculator);

// Form Submission
document.getElementById('quoteForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    let isValid = true;
    
    this.querySelectorAll('input[required], select[required]').forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });
    
    if (isValid) {
        const name = formData.get('fullName');
        const phone = formData.get('phone');
        const email = formData.get('email');
        const loanAmount = formData.get('loanAmount');
        const requirements = formData.get('requirements') || 'None';
        
        const message = `*New Home Loan Inquiry*%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${phone}%0A*Email:* ${email}%0A*Loan Amount:* ${encodeURIComponent(loanAmount)}%0A*Requirements:* ${encodeURIComponent(requirements)}`;
        
        window.open(`https://wa.me/919879879870?text=${message}`, '_blank');
        
        this.reset();
        alert('Thank you! You will be redirected to WhatsApp to send your inquiry.');
    } else {
        alert('Please fill in all required fields.');
    }
});

// Initialize Calculators
updateEMICalculator();
updateSavingsCalculator();

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Prevent negative values
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', function() {
        if (this.value < 0) {
            this.value = 0;
        }
    });
});