// Landing Page JavaScript Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeComponents();
});

function initializeComponents() {
    initMobileMenu();
    initScrollAnimations();
    initTradingChart();
    loadReviews();
    initSmoothScrolling();
    initDownloadButton();
    initScrollEffects();
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add scroll animation to cards and sections
    document.querySelectorAll('.feature-card, .benefit-item, .config-card, .review-card').forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
}

// Trading Chart Animation
function initTradingChart() {
    const chartCanvas = document.getElementById('tradingChart');
    if (!chartCanvas) return;
    
    const ctx = chartCanvas.getContext('2d');
    chartCanvas.width = chartCanvas.offsetWidth;
    chartCanvas.height = chartCanvas.offsetHeight;
    
    // Simulate real-time trading data
    let dataPoints = generateTradingData();
    let currentIndex = 0;
    
    function drawChart() {
        ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
        
        // Draw grid
        drawGrid(ctx, chartCanvas.width, chartCanvas.height);
        
        // Draw price line
        drawPriceLine(ctx, dataPoints.slice(0, currentIndex), chartCanvas.width, chartCanvas.height);
        
        // Update metrics
        updateTradingMetrics(dataPoints[currentIndex - 1]);
        
        currentIndex++;
        if (currentIndex >= dataPoints.length) {
            currentIndex = Math.floor(dataPoints.length * 0.7); // Reset to 70%
        }
    }
    
    // Start animation
    drawChart();
    setInterval(drawChart, 2000);
}

function generateTradingData() {
    const data = [];
    let price = 1950; // Starting gold price
    
    for (let i = 0; i < 50; i++) {
        const change = (Math.random() - 0.5) * 10;
        price += change;
        price = Math.max(1900, Math.min(2000, price)); // Keep within range
        
        data.push({
            price: price,
            volume: Math.random() * 100 + 50,
            time: new Date(Date.now() - (50 - i) * 3600000) // Hours ago
        });
    }
    
    return data;
}

function drawGrid(ctx, width, height) {
    ctx.strokeStyle = '#e8eaed';
    ctx.lineWidth = 1;
    
    // Horizontal lines
    for (let i = 0; i <= 5; i++) {
        const y = (height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // Vertical lines
    for (let i = 0; i <= 10; i++) {
        const x = (width / 10) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
}

function drawPriceLine(ctx, data, width, height) {
    if (data.length < 2) return;
    
    const minPrice = Math.min(...data.map(d => d.price));
    const maxPrice = Math.max(...data.map(d => d.price));
    const priceRange = maxPrice - minPrice;
    
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((point, index) => {
        const x = (width / (data.length - 1)) * index;
        const y = height - ((point.price - minPrice) / priceRange) * height;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Add gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(37, 99, 235, 0.3)');
    gradient.addColorStop(1, 'rgba(37, 99, 235, 0.05)');
    
    ctx.fillStyle = gradient;
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
}

function updateTradingMetrics(currentData) {
    if (!currentData) return;
    
    // Simulate changing metrics
    const winRate = 94.7 + (Math.random() - 0.5) * 0.6;
    const profitFactor = 2.34 + (Math.random() - 0.5) * 0.1;
    const maxDD = 8.2 + (Math.random() - 0.5) * 0.8;
    
    // Update display with animation
    animateValue('.metric-value:nth-child(1)', winRate, '%', 1);
    animateValue('.metric-value:nth-child(2)', profitFactor, '', 2);
    animateValue('.metric-value:nth-child(3)', maxDD, '%', 1);
}

function animateValue(selector, endValue, suffix = '', decimals = 0) {
    const element = document.querySelector(selector);
    if (!element) return;
    
    const startValue = parseFloat(element.textContent) || 0;
    const duration = 1000;
    const startTime = Date.now();
    
    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = startValue + (endValue - startValue) * progress;
        element.textContent = currentValue.toFixed(decimals) + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    update();
}

// Reviews System
let currentReviewIndex = 0;
let reviewsData = [];
let reviewsPerView = 3;

async function loadReviews() {
    const reviewsTrack = document.getElementById('reviewsTrack');
    const reviewsLoading = document.querySelector('.reviews-loading');
    
    if (!reviewsTrack || !reviewsLoading) return;
    
    try {
        // Simulate loading delay for realism
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const response = await fetch('/api/reviews');
        reviewsData = await response.json();
        
        // Hide loading
        reviewsLoading.style.display = 'none';
        
        // Render reviews
        reviewsTrack.innerHTML = reviewsData.map(review => createReviewCard(review)).join('');
        
        // Initialize carousel
        updateCarousel();
        
        // Auto-scroll every 5 seconds
        setInterval(() => {
            moveCarousel(1);
        }, 5000);
        
    } catch (error) {
        console.error('Error loading reviews:', error);
        reviewsLoading.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>Error cargando reseñas. Intenta recargar la página.</span>
        `;
    }
}

function moveCarousel(direction) {
    if (reviewsData.length === 0) return;
    
    const totalReviews = reviewsData.length;
    const maxIndex = totalReviews - reviewsPerView;
    
    currentReviewIndex += direction;
    
    if (currentReviewIndex < 0) {
        currentReviewIndex = maxIndex;
    } else if (currentReviewIndex > maxIndex) {
        currentReviewIndex = 0;
    }
    
    updateCarousel();
}

function updateCarousel() {
    const reviewsTrack = document.getElementById('reviewsTrack');
    if (!reviewsTrack) return;
    
    const cardWidth = 320; // 300px + 20px gap
    const translateX = -currentReviewIndex * cardWidth;
    reviewsTrack.style.transform = `translateX(${translateX}px)`;
}

// Make functions globally available
window.moveCarousel = moveCarousel;

function createReviewCard(review) {
    const stars = createStarRating(review.rating);
    
    return `
        <div class="review-card">
            <div class="review-header">
                <div class="review-author">${escapeHtml(review.name)}</div>
                <div class="review-rating">${stars}</div>
            </div>
            <div class="review-comment">"${escapeHtml(review.comment)}"</div>
            <div class="review-date">${review.date}</div>
        </div>
    `;
}

function createStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star star"></i>';
        } else {
            stars += '<i class="far fa-star star empty"></i>';
        }
    }
    return stars;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll to specific sections
function scrollToDownload() {
    const downloadSection = document.getElementById('download');
    if (downloadSection) {
        downloadSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function scrollToFeatures() {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
        featuresSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Download Button Functionality
function initDownloadButton() {
    const downloadButtons = document.querySelectorAll('.btn-download');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Directly open payment modal
            showPaymentModal();
        });
    });
}


// Scroll Effects
function initScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const navbar = document.querySelector('.navbar');
        
        // Navbar background opacity based on scroll
        if (navbar) {
            if (scrolled > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });
}

// Performance Metrics Animation
function startMetricsAnimation() {
    const metrics = document.querySelectorAll('.metric-value, .perf-number');
    
    metrics.forEach(metric => {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(metric);
    });
}

function animateCounter(element) {
    const text = element.textContent;
    const number = parseFloat(text.replace(/[^\d.]/g, ''));
    const suffix = text.replace(/[\d.]/g, '');
    const duration = 2000;
    const increment = number / (duration / 16);
    
    let current = 0;
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        
        if (suffix.includes('%')) {
            element.textContent = current.toFixed(1) + '%';
        } else if (number < 10) {
            element.textContent = current.toFixed(2) + suffix.replace(/[\d.]/g, '');
        } else {
            element.textContent = Math.floor(current) + suffix.replace(/[\d.]/g, '');
        }
    }, 16);
}

// Initialize metrics animation when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(startMetricsAnimation, 1000);
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Payment Functions
function openStripePayment() {
    // URL de Stripe proporcionada por el usuario
    const stripeUrl = 'https://buy.stripe.com/9B65kw7DOfQRbfQ7O37bW02';
    
    // Abrir Stripe en nueva ventana
    window.open(stripeUrl, '_blank');
    
    // Log de la acción
    console.log('Redirigiendo a Stripe para pago con tarjeta');
    
    // Mostrar mensaje de confirmación
    showPaymentModal('stripe');
}

function showBankDetails() {
    const bankDetails = {
        bank: 'Santander',
        holder: 'MARCO ANTONIO DORANTES MANRRIQUEZ',
        clabe: '014225606189254476',
        amount: '$400 USD (equivalente en MXN)'
    };
    
    const bankContent = `
        <div class="modal-header">
            <h3><i class="fas fa-university"></i> Transferencia Bancaria</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <p>Realiza una transferencia bancaria con los siguientes datos:</p>
            <div class="bank-details-modal">
                <div class="bank-detail-modal">
                    <strong>Banco:</strong> ${bankDetails.bank}
                </div>
                <div class="bank-detail-modal">
                    <strong>Titular:</strong> ${bankDetails.holder}
                </div>
                <div class="bank-detail-modal">
                    <strong>CLABE:</strong> ${bankDetails.clabe}
                </div>
                <div class="bank-detail-modal">
                    <strong>Monto:</strong> ${bankDetails.amount}
                </div>
            </div>
            <div class="modal-note">
                <i class="fas fa-info-circle"></i>
                <span>Envía el comprobante de transferencia para activar tu descarga</span>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary modal-cancel">Cerrar</button>
            <button class="btn btn-primary" onclick="copyToClipboard('${bankDetails.clabe}')">
                <i class="fas fa-copy"></i> Copiar CLABE
            </button>
        </div>
    `;
    
    showModal('Transferencia Bancaria', bankContent);
}

function showCryptoDetails() {
    const cryptoDetails = {
        btc: 'bc1qkxz6drkwzurzwgl78sxj29usr5hnjhlmyavpc9pty34n0jurnr9segxak8',
        eth: '0x54E7eBa36E80016a4eB951825376bb202062a397',
        usdt: 'TBYK6YZ29h92SAsp4fwK12B19xRL8ceg9o',
        amount: '$400 USD'
    };
    
    showPaymentModal('crypto', cryptoDetails);
}

function copyToClipboard(text, buttonElement = null) {
    // Fallback para navegadores que no soportan clipboard API
    if (!navigator.clipboard) {
        fallbackCopyToClipboard(text, buttonElement);
        return;
    }
    
    navigator.clipboard.writeText(text).then(function() {
        // Mostrar notificación de éxito
        showNotification('✅ ¡Copiado al portapapeles!', 'success');
        
        // Cambiar temporalmente el botón
        const button = buttonElement || (event && event.target.closest('.btn-copy'));
        if (button) {
        const originalIcon = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.background = 'var(--success-color)';
            button.style.boxShadow = '0 4px 15px rgba(46, 204, 113, 0.3)';
        
        setTimeout(() => {
            button.innerHTML = originalIcon;
                button.style.background = '';
                button.style.boxShadow = '';
        }, 2000);
        }
        
    }).catch(function(err) {
        console.error('Error al copiar: ', err);
        fallbackCopyToClipboard(text, buttonElement);
    });
}

function fallbackCopyToClipboard(text, buttonElement = null) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('✅ ¡Copiado al portapapeles!', 'success');
        
        // Cambiar temporalmente el botón
        const button = buttonElement || (event && event.target.closest('.btn-copy'));
        if (button) {
            const originalIcon = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.style.background = 'var(--success-color)';
            button.style.boxShadow = '0 4px 15px rgba(46, 204, 113, 0.3)';
            
            setTimeout(() => {
                button.innerHTML = originalIcon;
                button.style.background = '';
                button.style.boxShadow = '';
            }, 2000);
        }
    } catch (err) {
        console.error('Error al copiar: ', err);
        showNotification('❌ Error al copiar. Intenta manualmente.', 'error');
    }
    
    document.body.removeChild(textArea);
}

function showPaymentModal(type, details = null) {
    let modalContent = '';
    
    switch(type) {
        case 'stripe':
            modalContent = `
                <div class="modal-header">
                    <h3><i class="fab fa-stripe"></i> Pago con Stripe</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Serás redirigido a la página segura de Stripe para completar tu pago de <strong>$400 USD</strong>.</p>
                    <div class="stripe-features">
                        <div class="stripe-feature">
                            <i class="fas fa-shield-alt"></i>
                            <span>Pago 100% seguro y encriptado</span>
                        </div>
                        <div class="stripe-feature">
                            <i class="fas fa-credit-card"></i>
                            <span>Acepta todas las tarjetas principales</span>
                        </div>
                        <div class="stripe-feature">
                            <i class="fas fa-clock"></i>
                            <span>Entrega después de confirmar pago</span>
                        </div>
                    </div>
                    <div class="modal-note">
                        <i class="fas fa-info-circle"></i>
                        <span>Después del pago, confirma con nuestro equipo para recibir el algoritmo</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary modal-cancel">Cancelar</button>
                    <button class="btn btn-primary" onclick="window.open('https://buy.stripe.com/9B65kw7DOfQRbfQ7O37bW02', '_blank'); closeModal();">
                        <i class="fab fa-stripe"></i> Ir a Stripe
                    </button>
                </div>
            `;
            break;
            
        case 'bank':
            modalContent = `
                <div class="modal-header">
                    <h3><i class="fas fa-university"></i> Transferencia Bancaria</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Realiza una transferencia bancaria con los siguientes datos:</p>
                    <div class="bank-details-modal">
                        <div class="bank-detail-modal">
                            <strong>Banco:</strong> ${details.bank}
                        </div>
                        <div class="bank-detail-modal">
                            <strong>Titular:</strong> ${details.holder}
                        </div>
                        <div class="bank-detail-modal">
                            <strong>CLABE:</strong> ${details.clabe}
                        </div>
                        <div class="bank-detail-modal">
                            <strong>Monto:</strong> ${details.amount}
                        </div>
                    </div>
                    <div class="modal-note">
                        <i class="fas fa-info-circle"></i>
                        <span>Envía el comprobante de transferencia para activar tu descarga</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary modal-cancel">Cerrar</button>
                    <button class="btn btn-primary" onclick="copyToClipboard('${details.clabe}');">
                        <i class="fas fa-copy"></i> Copiar CLABE
                    </button>
                </div>
            `;
            break;
            
        case 'crypto':
            modalContent = `
                <div class="modal-header">
                    <h3><i class="fab fa-bitcoin"></i> Pago con Criptomonedas</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Envía el equivalente a <strong>${details.amount}</strong> a una de estas direcciones:</p>
                    <div class="crypto-details-modal">
                        <div class="crypto-detail-modal">
                            <div class="crypto-header">
                                <i class="fab fa-bitcoin"></i>
                                <strong>Bitcoin (BTC)</strong>
                            </div>
                            <div class="crypto-address-modal">${details.btc}</div>
                            <button class="btn-copy-modal" onclick="copyToClipboard('${details.btc}')">
                                <i class="fas fa-copy"></i> Copiar
                            </button>
                        </div>
                        <div class="crypto-detail-modal">
                            <div class="crypto-header">
                                <i class="fab fa-ethereum"></i>
                                <strong>Ethereum (ETH)</strong>
                            </div>
                            <div class="crypto-address-modal">${details.eth}</div>
                            <button class="btn-copy-modal" onclick="copyToClipboard('${details.eth}')">
                                <i class="fas fa-copy"></i> Copiar
                            </button>
                        </div>
                        <div class="crypto-detail-modal">
                            <div class="crypto-header">
                                <i class="fas fa-coins"></i>
                                <strong>USDT (TRC20)</strong>
                            </div>
                            <div class="crypto-address-modal">${details.usdt}</div>
                            <button class="btn-copy-modal" onclick="copyToClipboard('${details.usdt}')">
                                <i class="fas fa-copy"></i> Copiar
                            </button>
                        </div>
                    </div>
                    <div class="modal-note">
                        <i class="fas fa-info-circle"></i>
                        <span>Envía el comprobante de transacción para activar tu descarga</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary modal-cancel">Cerrar</button>
                </div>
            `;
            break;
            
        case 'wallet':
            modalContent = `
                <div class="modal-header">
                    <h3><i class="fas fa-wallet"></i> Billeteras Digitales</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Envía el equivalente a <strong>${details.neteller.amount}</strong> a una de estas billeteras digitales:</p>
                    <div class="wallet-details-modal">
                        <div class="wallet-detail-modal">
                            <div class="wallet-header">
                                <i class="fas fa-credit-card"></i>
                                <strong>${details.neteller.name}</strong>
                            </div>
                            <div class="wallet-email-modal">${details.neteller.email}</div>
                            <button class="btn-copy-modal" onclick="copyToClipboard('${details.neteller.email}')">
                                <i class="fas fa-copy"></i> Copiar Email
                            </button>
                        </div>
                        <div class="wallet-detail-modal">
                            <div class="wallet-header">
                                <i class="fas fa-credit-card"></i>
                                <strong>${details.skrill.name}</strong>
                            </div>
                            <div class="wallet-email-modal">${details.skrill.email}</div>
                            <button class="btn-copy-modal" onclick="copyToClipboard('${details.skrill.email}')">
                                <i class="fas fa-copy"></i> Copiar Email
                            </button>
                        </div>
                    </div>
                    <div class="modal-note">
                        <i class="fas fa-info-circle"></i>
                        <span>Envía el comprobante de pago para activar tu descarga</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary modal-cancel">Cerrar</button>
                </div>
            `;
            break;
    }
    
    // Crear modal
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay payment-modal';
    modalOverlay.innerHTML = `
        <div class="modal-content payment-modal-content">
            ${modalContent}
        </div>
    `;
    
    // Agregar estilos específicos para el modal de pago
    const paymentModalStyles = `
        <style>
        .payment-modal-content {
            max-width: 600px;
        }
        .stripe-features {
            margin: 1.5rem 0;
        }
        .stripe-feature {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
            color: #5f6368;
        }
        .stripe-feature i {
            color: #2563eb;
        }
        .bank-details-modal {
            background-color: #f8f9fa;
            border-radius: 0.5rem;
            padding: 1.5rem;
            margin: 1.5rem 0;
        }
        .bank-detail-modal {
            margin-bottom: 0.75rem;
            font-size: 0.9rem;
            line-height: 1.5;
        }
        .crypto-details-modal {
            margin: 1.5rem 0;
        }
        .crypto-detail-modal {
            background-color: #f8f9fa;
            border-radius: 0.5rem;
            padding: 1rem;
            margin-bottom: 1rem;
            border-left: 4px solid #2563eb;
        }
        .crypto-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
            font-weight: 600;
        }
        .crypto-address-modal {
            font-family: monospace;
            font-size: 0.8rem;
            color: #5f6368;
            word-break: break-all;
            margin-bottom: 0.75rem;
            background-color: white;
            padding: 0.5rem;
            border-radius: 0.25rem;
            border: 1px solid #e8eaed;
        }
        .btn-copy-modal {
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 0.25rem;
            padding: 0.5rem 1rem;
            cursor: pointer;
            font-size: 0.8rem;
            transition: background-color 0.2s;
        }
        .btn-copy-modal:hover {
            background: #1d4ed8;
        }
        .wallet-details-modal {
            margin: 1.5rem 0;
        }
        .wallet-detail-modal {
            background-color: #f8f9fa;
            border-radius: 0.5rem;
            padding: 1rem;
            margin-bottom: 1rem;
            border-left: 4px solid #2563eb;
        }
        .wallet-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
            font-weight: 600;
        }
        .wallet-email-modal {
            font-family: monospace;
            font-size: 0.9rem;
            color: #5f6368;
            word-break: break-all;
            margin-bottom: 0.75rem;
            background-color: white;
            padding: 0.5rem;
            border-radius: 0.25rem;
            border: 1px solid #e8eaed;
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', paymentModalStyles);
    document.body.appendChild(modalOverlay);
    
    // Funcionalidad de cierre
    function closeModal() {
        modalOverlay.remove();
    }
    
    modalOverlay.querySelector('.modal-close').addEventListener('click', closeModal);
    modalOverlay.querySelector('.modal-cancel').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Cerrar con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Estilos para la notificación
    const notificationStyles = `
        <style>
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10001;
            padding: 1rem 1.5rem;
            border-radius: 1rem;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .notification-success {
            background: linear-gradient(135deg, rgba(46, 204, 113, 0.9), rgba(39, 174, 96, 0.9));
            color: white;
        }
        .notification-error {
            background: linear-gradient(135deg, rgba(231, 76, 60, 0.9), rgba(192, 57, 43, 0.9));
            color: white;
        }
        .notification-info {
            background: linear-gradient(135deg, rgba(52, 152, 219, 0.9), rgba(41, 128, 185, 0.9));
            color: white;
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 500;
        }
        .notification-content i {
            font-size: 1.3rem;
        }
        @keyframes slideInRight {
            from {
                transform: translateX(100%) scale(0.8);
                opacity: 0;
            }
            to {
                transform: translateX(0) scale(1);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0) scale(1);
                opacity: 1;
            }
            to {
                transform: translateX(100%) scale(0.8);
                opacity: 0;
            }
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', notificationStyles);
    document.body.appendChild(notification);
    
    // Auto-remover después de 4 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

function showWalletDetails() {
    const walletDetails = {
        neteller: {
            name: 'Neteller',
            email: 'marckos.12101@gmail.com',
            amount: '$400 USD'
        },
        skrill: {
            name: 'Skrill',
            email: 'fernanda.escobar.2808@gmail.com',
            amount: '$400 USD'
        }
    };
    
    showPaymentModal('wallet', walletDetails);
}

function showPaymentOptions() {
    // Scroll a la sección de métodos de pago
    const paymentSection = document.querySelector('.payment-methods');
    if (paymentSection) {
        paymentSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Show Guide Modal Function
function showGuideModal() {
    const guideContent = `
        <div class="modal-header">
            <h3><i class="fas fa-download"></i> Guía de Instalación - EA Golden Engel</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body guide-modal-compact">
            <div class="guide-overview">
                <div class="guide-summary">
                    <h4><i class="fas fa-info-circle"></i> Resumen del Proceso</h4>
                    <p>Instalación completa en 8 pasos: Cuenta Broker → VPS → MT4 → EA</p>
                </div>
                <div class="guide-time">
                    <h4><i class="fas fa-clock"></i> Tiempo Estimado</h4>
                    <p>30-45 minutos</p>
                </div>
            </div>
            
            <div class="guide-steps-compact">
                <div class="step-row">
                    <div class="step-compact">
                        <div class="step-number-small">1</div>
                        <div class="step-info">
                            <h5>Crear Cuenta ICMarkets</h5>
                            <p>Visita <a href="https://icmarkets.com/?camp=16385" target="_blank">icmarkets.com</a> y abre cuenta real</p>
                        </div>
                    </div>
                    <div class="step-compact">
                        <div class="step-number-small">2</div>
                        <div class="step-info">
                            <h5>Comprar VPS</h5>
                            <p>Contrata VPS Windows (2GB RAM mínimo) para operación 24/7</p>
                        </div>
                    </div>
                </div>
                
                <div class="step-row">
                    <div class="step-compact">
                        <div class="step-number-small">3</div>
                        <div class="step-info">
                            <h5>Descargar MT4</h5>
                            <p>Instala MetaTrader 4 en el VPS desde tu cuenta ICMarkets</p>
                        </div>
                    </div>
                    <div class="step-compact">
                        <div class="step-number-small">4</div>
                        <div class="step-info">
                            <h5>Iniciar Sesión</h5>
                            <p>Conecta MT4 con tus credenciales ICMarkets</p>
                        </div>
                    </div>
                </div>
                
                <div class="step-row">
                    <div class="step-compact">
                        <div class="step-number-small">5</div>
                        <div class="step-info">
                            <h5>Configurar MT4</h5>
                            <p>Habilita trading automático y configura XAUUSD H1</p>
                        </div>
                    </div>
                    <div class="step-compact">
                        <div class="step-number-small">6</div>
                        <div class="step-info">
                            <h5>Instalar EA</h5>
                            <p>Copia EA_Golden_Engel.ex4 en carpeta MQL4/Experts</p>
                        </div>
                    </div>
                </div>
                
                <div class="step-row">
                    <div class="step-compact">
                        <div class="step-number-small">7</div>
                        <div class="step-info">
                            <h5>Activar EA</h5>
                            <p>Arrastra EA al gráfico XAUUSD y configura parámetros</p>
                        </div>
                    </div>
                    <div class="step-compact">
                        <div class="step-number-small">8</div>
                        <div class="step-info">
                            <h5>Verificar</h5>
                            <p>Confirma "cara sonriente" y monitorea operaciones</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="guide-details">
                <div class="detail-section">
                    <h5><i class="fas fa-cog"></i> Configuración</h5>
                    <div class="detail-grid">
                        <span><strong>Símbolo:</strong> XAUUSD</span>
                        <span><strong>Timeframe:</strong> H1</span>
                        <span><strong>Apalancamiento:</strong> 1:500</span>
                        <span><strong>VPS:</strong> Requerido</span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h5><i class="fas fa-exclamation-triangle"></i> Importante</h5>
                    <p>El trading conlleva riesgos. El EA está listo para cuenta real desde el primer día.</p>
                </div>
                
                <div class="detail-section">
                    <h5><i class="fas fa-headset"></i> Soporte</h5>
                    <p><strong>Telegram:</strong> @METAQUANTstudio | <strong>Email:</strong> metaquantstudio01@gmail.com</p>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" onclick="downloadGuideFile()">
                <i class="fas fa-download"></i> Descargar Guía Completa
            </button>
            <button class="btn btn-secondary modal-cancel">Cerrar</button>
        </div>
    `;
    
    showModal('Guía de Instalación', guideContent);
}

// Download Guide Function (Direct Download)
function downloadGuide() {
    downloadGuideFile();
}

// Download Guide File Function
function downloadGuideFile() {
    const guideContent = `GUÍA COMPLETA DE INSTALACIÓN - EA GOLDEN ENGEL
====================================================
Desarrollado por MetaQuant Studio

PASO 1: CREAR CUENTA EN ICMARKETS
==================================

1.1 Acceder al sitio web de ICMarkets:
    - Visita: https://icmarkets.com/?camp=16385
    - Haz clic en "Abrir Cuenta" o "Open Account"

1.2 Completar el formulario de registro:
    - Selecciona "Cuenta Real"
    - Completa todos los datos personales requeridos
    - Verifica tu email y teléfono
    - Sube los documentos de identificación necesarios

1.3 Configurar la cuenta:
    - Selecciona "MetaTrader 4" como plataforma
    - Elige el tipo de cuenta "Raw Spread"
    - Configura la moneda base (USD recomendado)
    - Establece el apalancamiento (1:500 recomendado)

1.4 Descargar las credenciales:
    - Anota tu número de cuenta
    - Anota la contraseña del trader
    - Anota el servidor (ej: ICMarketsLive26)
    - Guarda esta información en un lugar seguro

1.5 Si ya tienes cuenta con ICMarkets:
    - Ve directamente al PASO 2
    - Asegúrate de tener los datos de acceso a tu cuenta

PASO 2: COMPRAR Y CONFIGURAR VPS (SERVIDOR VIRTUAL)
===================================================

2.1 ¿Por qué necesitas un VPS?
    - El EA debe funcionar 24/7 para no perder oportunidades de trading
    - Tu computadora personal puede apagarse o perder conexión a internet
    - Un VPS garantiza operación continua sin interrupciones
    - Mejor latencia y estabilidad de conexión

2.2 Opciones de VPS recomendadas:
    - VPS con Windows Server (recomendado)
    - Mínimo 2GB RAM y 2 CPU cores
    - Conexión estable a internet
    - Ubicación cercana a los servidores del broker

2.3 Compra y configuración del VPS:
    - Contrata un servicio de VPS con Windows
    - Recibe las credenciales de acceso (IP, usuario, contraseña)
    - Conecta al VPS usando Escritorio Remoto (RDP)
    - Configura acceso remoto (RDP)
    - Instala antivirus y firewall
    - Configura respaldo automático de datos

PASO 3: DESCARGAR METATRADER 4 EN EL VPS
========================================

3.1 Descargar MetaTrader 4:
    - Desde el VPS, ve a la sección "Plataformas de Trading" en tu cuenta ICMarkets
    - Descarga MetaTrader 4 para Windows
    - Guarda el archivo de instalación en el VPS

3.2 Instalar MetaTrader 4 en el VPS:
    - Ejecuta el archivo de instalación como administrador
    - Sigue el asistente de instalación
    - Acepta los términos y condiciones
    - Selecciona la carpeta de instalación (por defecto: C:\\Program Files\\MetaTrader 4)
    - Completa la instalación

PASO 4: INICIAR SESIÓN EN METATRADER 4
======================================

4.1 Configurar la conexión:
    - Abre MetaTrader 4 en el VPS
    - Ve a "Archivo" > "Abrir cuenta"
    - Selecciona "Nueva cuenta"
    - Ingresa los datos de tu cuenta ICMarkets:
      * Servidor: [Tu servidor ICMarkets]
      * Login: [Tu número de cuenta]
      * Contraseña: [Tu contraseña de trader]
    - Marca "Guardar información de la cuenta"
    - Haz clic en "Iniciar sesión"

4.2 Verificar la conexión:
    - Asegúrate de que la conexión sea exitosa
    - Verifica que aparezcan los símbolos en Market Watch
    - Confirma que el precio se actualice en tiempo real

PASO 5: CONFIGURAR METATRADER 4 PARA EL EA
==========================================

5.1 Habilitar trading automático:
    - Ve a "Herramientas" > "Opciones"
    - Pestaña "Expert Advisors"
    - Marca "Permitir trading automático"
    - Marca "Permitir DLL imports"
    - Marca "Permitir importar archivos"
    - Marca "Confirmar antes de trading"
    - Haz clic en "Aceptar"

5.2 Configurar el gráfico de XAUUSD:
    - En la ventana "Market Watch", busca "XAUUSD"
    - Si no aparece, haz clic derecho en "Market Watch" > "Símbolos"
    - Busca "XAUUSD" y haz doble clic para agregarlo
    - Arrastra "XAUUSD" al área de gráficos
    - Cambia el timeframe a H1 (Hora 1) usando los botones de la barra superior

5.3 Verificar la conexión:
    - Asegúrate de que el gráfico muestre datos en tiempo real
    - Verifica que el precio se actualice constantemente
    - Confirma que no hay mensajes de error en la pestaña "Expert Advisors"

PASO 6: INSTALAR EL EA GOLDEN ENGEL
===================================

6.1 Localizar la carpeta de Expert Advisors:
    - Ve a "Archivo" > "Abrir carpeta de datos"
    - Navega a la carpeta "MQL4" > "Experts"
    - Esta es la carpeta donde debes colocar el archivo del EA

6.2 Instalar el archivo del EA:
    - Copia el archivo "EA_Golden_Engel.ex4" en la carpeta MQL4/Experts
    - Reinicia MetaTrader 4 completamente
    - Cierra y vuelve a abrir la plataforma

6.3 Verificar la instalación:
    - Ve a la pestaña "Navigator" (lado izquierdo)
    - Expande "Expert Advisors"
    - Deberías ver "EA_Golden_Engel" en la lista
    - Si no aparece, verifica que el archivo esté en la carpeta correcta

PASO 7: CONFIGURAR Y ACTIVAR EL EA
==================================

7.1 Arrastrar el EA al gráfico:
    - Desde la pestaña "Navigator", arrastra "EA_Golden_Engel" al gráfico de XAUUSD
    - Aparecerá una ventana de configuración

7.2 Configurar los parámetros del EA:
    - Pestaña "General":
      * Marca "Permitir trading automático"
      * Marca "Permitir DLL imports"
      * Marca "Permitir importar archivos"
      * Marca "Mostrar confirmaciones de trading"
    - Pestaña "Common":
      * Marca "Permitir trading automático"
      * Marca "Permitir DLL imports"
      * Marca "Permitir importar archivos"
    - Pestaña "Inputs":
      * Lot Size: 0.01 (o según tu gestión de riesgo)
      * Risk Percent: 2.0 (2% de la cuenta por operación)
      * Max Spread: 3.0 (máximo spread permitido)
      * Trailing Stop: true (activar trailing stop)
      * Magic Number: 12345 (número único para identificar operaciones)

7.3 Activar el EA:
    - Haz clic en "Aceptar" para cerrar la ventana de configuración
    - Verifica que aparezca una "cara sonriente" en la esquina superior derecha del gráfico
    - Si aparece una "cara triste", revisa la configuración y los permisos

PASO 8: VERIFICAR EL FUNCIONAMIENTO
===================================

8.1 Verificar la conexión:
    - Asegúrate de que el EA esté conectado (cara sonriente verde)
    - Verifica que no haya errores en la pestaña "Expert Advisors"
    - Confirma que el gráfico muestre datos en tiempo real

8.2 Monitorear las primeras operaciones:
    - El EA comenzará a analizar el mercado automáticamente
    - Las operaciones aparecerán en la pestaña "Trade"
    - Puedes ver el historial en la pestaña "Historia"

8.3 Configuraciones adicionales:
    - Ajusta el tamaño del lote según tu capital
    - Modifica el porcentaje de riesgo según tu perfil
    - Configura el trailing stop según tus preferencias

CONFIGURACIÓN RECOMENDADA FINAL
===============================

- Símbolo: XAUUSD únicamente
- Timeframe: H1 (Hora 1)
- Broker: ICMarkets (https://icmarkets.com/?camp=16385)
- Lote inicial: 0.01 (para cuentas pequeñas) o 2% de la cuenta
- Apalancamiento: 1:500 (recomendado)
- Spread máximo: 3.0 pips
- Trailing Stop: Activado
- Trading automático: Activado
- VPS: Requerido para operación 24/7

IMPORTANTE - LECTURA OBLIGATORIA
================================

⚠️  ADVERTENCIAS IMPORTANTES:
- El trading conlleva riesgos, nunca inviertas dinero que no puedas permitirte perder
- Los resultados pasados no garantizan rendimientos futuros
- Monitorea regularmente el rendimiento del EA
- Ajusta los parámetros según las condiciones del mercado
- El EA está listo para operar en cuenta real desde el primer día

🔧 SOPORTE TÉCNICO:
- Telegram: @METAQUANTstudio
- Email: metaquantstudio01@gmail.com
- Para dudas técnicas o configuraciones personalizadas

📊 MONITOREO RECOMENDADO:
- Revisa el rendimiento diariamente
- Ajusta los parámetros según sea necesario
- Mantén un registro de las operaciones
- Evalúa el rendimiento semanalmente

© 2024 MetaQuant Studio - Todos los derechos reservados
Desarrollado por MetaQuant Studio para traders profesionales`;

    const blob = new Blob([guideContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Guia_Instalacion_EA_Golden_Engel.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('📥 Guía descargada correctamente', 'success');
}

// FAQ Modal Function
function showFAQ() {
    const faqContent = `
        <div class="modal-header">
            <h3><i class="fas fa-question-circle"></i> Preguntas Frecuentes</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <div class="faq-item">
                <h4>¿Qué es un algoritmo de trading?</h4>
                <p>Es un programa que opera automáticamente en los mercados financieros siguiendo reglas predefinidas, como un trader profesional que nunca duerme.</p>
            </div>
            <div class="faq-item">
                <h4>¿Es seguro usar este algoritmo?</h4>
                <p>Sí, está diseñado con gestión de riesgo conservadora y sin estrategias peligrosas como martingala.</p>
            </div>
            <div class="faq-item">
                <h4>¿Necesito experiencia en trading?</h4>
                <p>No, el algoritmo funciona de forma automática. Solo necesitas instalarlo y configurarlo según nuestras indicaciones.</p>
            </div>
            <div class="faq-item">
                <h4>¿Cuánto dinero necesito para empezar?</h4>
                <p>Recomendamos mínimo $500 USD.</p>
            </div>
            <div class="faq-item">
                <h4>¿Cómo recibo el algoritmo después del pago?</h4>
                <p>Después de confirmar tu pago con nuestro equipo, te enviaremos el algoritmo por email o Telegram.</p>
            </div>
            <div class="faq-item">
                <h4>¿Ofrecen soporte técnico?</h4>
                <p>Sí, contamos con soporte técnico vía Telegram @METAQUANTstudio y estamos abiertos a modi personalizadas con un costo extra.</p>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary modal-cancel">Cerrar</button>
        </div>
    `;
    
    showModal('FAQ', faqContent);
}

// Terms Modal Function
function showTerms() {
    const termsContent = `
        <div class="modal-header">
            <h3><i class="fas fa-file-contract"></i> Términos de Uso</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <p><strong>Términos de Uso - EA Golden Engel</strong></p>
            <ol>
                <li>Sigue las indicaciones de instalación puntualmente para obtener los mejores resultados.</li>
                <li>El algoritmo está optimizado para XAUUSD en timeframe H1 únicamente.</li>
                <li>Recomendamos usar ICMarkets como broker para mejores resultados.</li>
                <li>El trading conlleva riesgos, nunca inviertas dinero que no puedas permitirte perder.</li>
                <li>MetaQuant Studio no se hace responsable por pérdidas en trading.</li>
                <li>El soporte técnico está disponible vía Telegram @METAQUANTstudio.</li>
                <li>Configuraciones personalizadas están disponibles como servicio adicional.</li>
            </ol>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary modal-cancel">Cerrar</button>
        </div>
    `;
    
    showModal('Términos de Uso', termsContent);
}

// Disclaimer Modal Function
function showDisclaimer() {
    const disclaimerContent = `
        <div class="modal-header">
            <h3><i class="fas fa-exclamation-triangle"></i> Descargo de Responsabilidad</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <p><strong>Descargo de Responsabilidad:</strong> El trading de divisas conlleva un alto nivel de riesgo y puede no ser adecuado para todos los inversores. El alto grado de apalancamiento puede funcionar tanto en su favor como en su contra. Antes de decidir invertir en divisas, debe considerar cuidadosamente sus objetivos de inversión, nivel de experiencia y apetito por el riesgo. Existe la posibilidad de que pueda sostener una pérdida de parte o la totalidad de su inversión inicial y, por lo tanto, no debe invertir dinero que no pueda permitirse perder. Los resultados pasados no garantizan rendimientos futuros.</p>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary modal-cancel">Cerrar</button>
        </div>
    `;
    
    showModal('Descargo de Responsabilidad', disclaimerContent);
}

// About Us Modal Function
function showAboutUs() {
    console.log('showAboutUs function called'); // Debug log
    const aboutContent = `
        <div class="modal-header about-header">
            <h3><i class="fas fa-building"></i> Quiénes Somos - MetaQuant Studio</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body about-body">
            <div class="about-intro">
                <div class="about-logo">
                    <div class="logo-placeholder">
                        <i class="fas fa-chart-line"></i>
                    </div>
                </div>
                <div class="about-text">
                    <h4>MetaQuant Studio</h4>
                    <p class="about-tagline">Especialistas en Algoritmos de Trading para Oro</p>
                </div>
            </div>
            
            <div class="about-story">
                <h5><i class="fas fa-lightbulb"></i> Nuestra Historia</h5>
                <p>MetaQuant Studio nació de la pasión por la tecnología financiera y el trading algorítmico. Nuestro equipo de desarrolladores y traders profesionales se unió con un objetivo común: crear algoritmos de trading que democratizaran el acceso a estrategias profesionales de inversión.</p>
            </div>
            
            <div class="about-expertise">
                <h5><i class="fas fa-cogs"></i> Nuestra Experiencia</h5>
                <div class="expertise-grid">
                    <div class="expertise-item">
                        <i class="fas fa-chart-bar"></i>
                        <span>+5 años desarrollando EAs</span>
                    </div>
                    <div class="expertise-item">
                        <i class="fas fa-coins"></i>
                        <span>Especialización en Oro (XAUUSD)</span>
                    </div>
                    <div class="expertise-item">
                        <i class="fas fa-users"></i>
                        <span>+500 traders satisfechos</span>
                    </div>
                    <div class="expertise-item">
                        <i class="fas fa-trophy"></i>
                        <span>94.7% de tasa de acierto</span>
                    </div>
                </div>
            </div>
            
            <div class="about-mission">
                <h5><i class="fas fa-target"></i> Nuestra Misión</h5>
                <p>Democratizar el trading profesional mediante algoritmos avanzados que permitan a cualquier persona acceder a estrategias de inversión sofisticadas, sin necesidad de conocimientos técnicos profundos.</p>
            </div>
            
            <div class="about-values">
                <h5><i class="fas fa-heart"></i> Nuestros Valores</h5>
                <div class="values-list">
                    <div class="value-item">
                        <i class="fas fa-shield-alt"></i>
                        <div>
                            <strong>Transparencia</strong>
                            <p>Estrategias claras y resultados verificables</p>
                        </div>
                    </div>
                    <div class="value-item">
                        <i class="fas fa-handshake"></i>
                        <div>
                            <strong>Confianza</strong>
                            <p>Relaciones duraderas con nuestros clientes</p>
                        </div>
                    </div>
                    <div class="value-item">
                        <i class="fas fa-rocket"></i>
                        <div>
                            <strong>Innovación</strong>
                            <p>Constante mejora de nuestros algoritmos</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="about-contact">
                <h5><i class="fas fa-envelope"></i> Contáctanos</h5>
                <div class="contact-info">
                    <div class="contact-item">
                        <i class="fab fa-telegram"></i>
                        <div class="contact-details">
                            <span class="contact-label">@METAQUANTstudio</span>
                            <button class="btn btn-telegram" onclick="openTelegram()">
                                <i class="fab fa-telegram-plane"></i>
                                Abrir Telegram
                            </button>
                        </div>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <div class="contact-details">
                            <span class="contact-label">metaquantstudio01@gmail.com</span>
                            <button class="btn btn-email" onclick="openEmail()">
                                <i class="fas fa-envelope"></i>
                                Escribir Email
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" onclick="showPaymentModal()">
                <i class="fas fa-shopping-cart"></i> Comprar EA Golden Engel
            </button>
            <button class="btn btn-secondary modal-cancel">Cerrar</button>
        </div>
    `;
    
    showModal('Quiénes Somos', aboutContent);
}

// Generic Modal Function
function showModal(title, content) {
    console.log('showModal called with title:', title); // Debug log
    
    // Remove any existing modals
    const existingModals = document.querySelectorAll('.modal-overlay');
    existingModals.forEach(modal => modal.remove());
    
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.style.display = 'flex';
    modalOverlay.innerHTML = `
        <div class="modal-content">
            ${content}
        </div>
    `;
    
    // Add modal styles if not already present
    if (!document.getElementById('modal-styles')) {
        const modalStyles = document.createElement('style');
        modalStyles.id = 'modal-styles';
        modalStyles.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                backdrop-filter: blur(5px);
            }
            .modal-content {
                background: white;
                border-radius: 1rem;
                max-width: 90%;
                max-height: 90%;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: modalSlideIn 0.3s ease-out;
            }
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.8) translateY(-50px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            .modal-header {
                padding: 1.5rem 2rem 1rem;
                border-bottom: 1px solid #e8eaed;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .modal-header h3 {
                margin: 0;
                color: #1a1a1a;
                font-size: 1.5rem;
                font-weight: 600;
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
                padding: 0.5rem;
                border-radius: 50%;
                transition: all 0.2s;
            }
            .modal-close:hover {
                background: #f5f5f5;
                color: #333;
            }
            .modal-body {
                padding: 2rem;
            }
            .modal-footer {
                padding: 1rem 2rem 2rem;
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
            }
            .about-header {
                background: linear-gradient(135deg, #2563eb, #1d4ed8);
                color: white;
                border-radius: 1rem 1rem 0 0;
            }
            .about-header h3 {
                color: white;
            }
            .about-header .modal-close {
                color: white;
            }
            .about-header .modal-close:hover {
                background: rgba(255, 255, 255, 0.2);
                color: white;
            }
            .about-intro {
                display: flex;
                align-items: center;
                gap: 1.5rem;
                margin-bottom: 2rem;
                padding: 1.5rem;
                background: #f8f9fa;
                border-radius: 0.75rem;
            }
            .about-logo .logo-placeholder {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #2563eb, #1d4ed8);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 2rem;
            }
            .about-text h4 {
                margin: 0 0 0.5rem 0;
                color: #1a1a1a;
                font-size: 1.5rem;
                font-weight: 600;
            }
            .about-tagline {
                color: #666;
                font-size: 1rem;
                margin: 0;
            }
            .about-story, .about-expertise, .about-mission, .about-values, .about-contact {
                margin-bottom: 2rem;
            }
            .about-story h5, .about-expertise h5, .about-mission h5, .about-values h5, .about-contact h5 {
                color: #1a1a1a;
                font-size: 1.2rem;
                font-weight: 600;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .about-story h5 i, .about-expertise h5 i, .about-mission h5 i, .about-values h5 i, .about-contact h5 i {
                color: #2563eb;
            }
            .expertise-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }
            .expertise-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 1rem;
                background: #f8f9fa;
                border-radius: 0.5rem;
                border-left: 4px solid #2563eb;
            }
            .expertise-item i {
                color: #2563eb;
                font-size: 1.2rem;
            }
            .values-list {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            .value-item {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                padding: 1rem;
                background: #f8f9fa;
                border-radius: 0.5rem;
            }
            .value-item i {
                color: #2563eb;
                font-size: 1.2rem;
                margin-top: 0.25rem;
            }
            .value-item strong {
                display: block;
                color: #1a1a1a;
                font-weight: 600;
                margin-bottom: 0.25rem;
            }
            .value-item p {
                margin: 0;
                color: #666;
                font-size: 0.9rem;
            }
            .contact-info {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            .contact-item {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                padding: 1.5rem;
                background: #f8f9fa;
                border-radius: 0.75rem;
                border-left: 4px solid #2563eb;
            }
            .contact-item i {
                color: #2563eb;
                font-size: 1.5rem;
                margin-top: 0.25rem;
            }
            .contact-details {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                flex: 1;
            }
            .contact-label {
                color: #1a1a1a;
                font-weight: 600;
                font-size: 1rem;
                display: block;
            }
            .btn-telegram {
                background: linear-gradient(135deg, #0088cc, #0066aa);
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 0.5rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.9rem;
                max-width: 200px;
            }
            .btn-telegram:hover {
                background: linear-gradient(135deg, #0066aa, #004488);
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0, 136, 204, 0.3);
            }
            .btn-email {
                background: linear-gradient(135deg, #ea4335, #d33b2c);
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 0.5rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.9rem;
                max-width: 200px;
            }
            .btn-email:hover {
                background: linear-gradient(135deg, #d33b2c, #b52d20);
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(234, 67, 53, 0.3);
            }
            .email-options {
                display: flex;
                flex-direction: column;
                gap: 2rem;
            }
            .email-option {
                padding: 1.5rem;
                background: #f8f9fa;
                border-radius: 0.75rem;
                border-left: 4px solid #2563eb;
            }
            .email-option h4 {
                color: #1a1a1a;
                font-size: 1.1rem;
                font-weight: 600;
                margin: 0 0 0.75rem 0;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .email-option h4 i {
                color: #2563eb;
            }
            .email-option p {
                color: #666;
                margin: 0 0 1rem 0;
                line-height: 1.5;
            }
            .email-copy-section {
                display: flex;
                align-items: center;
                gap: 1rem;
                flex-wrap: wrap;
            }
            .email-display {
                background: white;
                padding: 0.75rem 1rem;
                border-radius: 0.5rem;
                border: 1px solid #e8eaed;
                font-family: monospace;
                font-weight: 600;
                color: #1a1a1a;
                flex: 1;
                min-width: 200px;
            }
        `;
        document.head.appendChild(modalStyles);
    }
    
    document.body.appendChild(modalOverlay);
    console.log('Modal added to DOM'); // Debug log
    
    function closeModal() {
        modalOverlay.style.animation = 'modalSlideOut 0.3s ease-in forwards';
        setTimeout(() => {
            modalOverlay.remove();
        }, 300);
    }
    
    // Add slide out animation
    const slideOutStyle = document.createElement('style');
    slideOutStyle.textContent = `
        @keyframes modalSlideOut {
            from {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
            to {
                opacity: 0;
                transform: scale(0.8) translateY(-50px);
            }
        }
    `;
    document.head.appendChild(slideOutStyle);
    
    // Event listeners
    const closeBtn = modalOverlay.querySelector('.modal-close');
    const cancelBtn = modalOverlay.querySelector('.modal-cancel');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Close with Escape key
    const escapeHandler = function(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

// Payment Method Selection
let selectedPaymentMethod = 'stripe'; // Default selection

function selectPaymentMethod(method) {
    console.log('selectPaymentMethod called with:', method); // Debug log
    selectedPaymentMethod = method;
    
    // Remove primary class from all cards
    document.querySelectorAll('.payment-option-card').forEach(card => {
        card.classList.remove('primary');
    });
    
    // Add primary class to selected card
    const selectedCard = event.currentTarget;
    if (selectedCard) {
        selectedCard.classList.add('primary');
        console.log('Card selected:', selectedCard); // Debug log
    }
    
    // Update continue button
    updateContinueButton();
}

function updateContinueButton() {
    const continueBtn = document.getElementById('continuePaymentBtn');
    if (continueBtn) {
        continueBtn.disabled = false;
        continueBtn.style.opacity = '1';
    }
}

function continuePayment() {
    if (!selectedPaymentMethod) {
        showNotification('❌ Por favor selecciona un método de pago', 'error');
        return;
    }
    
    // Close the current modal first
    const currentModal = document.querySelector('.modal-overlay');
    if (currentModal) {
        currentModal.remove();
        document.body.classList.remove('modal-open');
    }
    
    switch(selectedPaymentMethod) {
        case 'stripe':
            openStripePayment();
            break;
        case 'bank':
            showBankDetails();
            break;
        case 'crypto':
            showCryptoDetails();
            break;
        case 'wallet':
            showWalletDetails();
            break;
    }
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function showPaymentModal() {
    console.log('showPaymentModal called'); // Debug log
    
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
        <div class="modal-content">
            <div class="modal-header payment-header">
                <h3><i class="fas fa-credit-card"></i> Métodos de Pago - EA Golden Engel</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body payment-modal-large">
                <div class="payment-summary">
                    <div class="product-info">
                        <h4>EA Golden Engel - Expert Advisor</h4>
                        <p>Algoritmo especializado en trading de oro XAUUSD</p>
                    </div>
                    <div class="price-info">
                        <div class="price">$400 USD</div>
                        <div class="price-note">Pago único</div>
                    </div>
                </div>
                
                <div class="payment-methods-all">
                    <!-- STRIPE -->
                    <div class="payment-method-card stripe-method">
                        <div class="method-header">
                            <div class="method-logo">
                                <div class="stripe-logo">stripe</div>
                            </div>
                            <div class="method-title">
                                <h4>Tarjeta de Crédito/Débito</h4>
                                <p>Pago seguro con Stripe</p>
                            </div>
                            <div class="recommended-badge">RECOMENDADO</div>
                        </div>
                        <div class="method-content">
                            <p>Pago instantáneo y seguro con tarjetas Visa, Mastercard, American Express</p>
                            <button class="btn btn-primary stripe-btn" onclick="window.open('https://buy.stripe.com/9B65kw7DOfQRbfQ7O37bW02', '_blank');">
                                <i class="fab fa-stripe"></i> Pagar con Stripe
                            </button>
                        </div>
                    </div>
                    
                    <!-- TRANSFERENCIA BANCARIA -->
                    <div class="payment-method-card bank-method">
                        <div class="method-header">
                            <div class="method-logo">
                                <i class="fas fa-university"></i>
                            </div>
                            <div class="method-title">
                                <h4>Transferencia Bancaria</h4>
                                <p>México - Santander</p>
                            </div>
                        </div>
                        <div class="method-content">
                            <div class="bank-details">
                                <div class="detail-row">
                                    <strong>Banco:</strong> Santander
                                </div>
                                <div class="detail-row">
                                    <strong>Titular:</strong> MARCO ANTONIO DORANTES MANRRIQUEZ
                                </div>
                                <div class="detail-row">
                                    <strong>CLABE:</strong> 014225606189254476
                                </div>
                                <div class="detail-row">
                                    <strong>Monto:</strong> $400 USD (equivalente en MXN)
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- CRIPTOMONEDAS -->
                    <div class="payment-method-card crypto-method">
                        <div class="method-header">
                            <div class="method-logo">
                                <i class="fab fa-bitcoin"></i>
                            </div>
                            <div class="method-title">
                                <h4>Criptomonedas</h4>
                                <p>Bitcoin, Ethereum, USDT</p>
                            </div>
                        </div>
                        <div class="method-content">
                            <div class="crypto-details">
                                <div class="crypto-option">
                                    <strong>Bitcoin (BTC):</strong>
                                    <div class="crypto-address">bc1qkxz6drkwzurzwgl78sxj29usr5hnjhlmyavpc9pty34n0jurnr9segxak8</div>
                                </div>
                                <div class="crypto-option">
                                    <strong>Ethereum (ETH):</strong>
                                    <div class="crypto-address">0x54E7eBa36E80016a4eB951825376bb202062a397</div>
                                </div>
                                <div class="crypto-option">
                                    <strong>USDT (TRC20):</strong>
                                    <div class="crypto-address">TU5wsbVmBWR2RLfN64BeTNyJzewCshn3Wy</div>
                                </div>
                                <div class="crypto-amount">
                                    <strong>Monto:</strong> $400 USD
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- BINANCE PAY -->
                    <div class="payment-method-card binance-method">
                        <div class="method-header">
                            <div class="method-logo">
                                <i class="fab fa-bitcoin"></i>
                            </div>
                            <div class="method-title">
                                <h4>Binance Pay</h4>
                                <p>Pago con criptomonedas</p>
                            </div>
                            <div class="recommended-badge">RECOMENDADO</div>
                        </div>
                        <div class="method-content">
                            <p>Pago instantáneo y seguro con Binance Pay usando múltiples criptomonedas</p>
                            <button class="btn btn-primary binance-btn" onclick="window.open('https://s.binance.com/ePTT5zeb', '_blank');">
                                <i class="fab fa-bitcoin"></i> Pagar con Binance
                            </button>
                        </div>
                    </div>
                    
                    <!-- BILLETERAS DIGITALES -->
                    <div class="payment-method-card wallet-method">
                        <div class="method-header">
                            <div class="method-logo">
                                <i class="fas fa-wallet"></i>
                            </div>
                            <div class="method-title">
                                <h4>Billeteras Digitales</h4>
                                <p>Neteller, Skrill</p>
                            </div>
                        </div>
                        <div class="method-content">
                            <div class="wallet-details">
                                <div class="wallet-option">
                                    <strong>Neteller:</strong> marckos.12101@gmail.com
                                </div>
                                <div class="wallet-option">
                                    <strong>Skrill:</strong> fernanda.escobar.2808@gmail.com
                                </div>
                                <div class="wallet-amount">
                                    <strong>Monto:</strong> $400 USD
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="payment-confirmation">
                    <div class="confirmation-info">
                        <i class="fas fa-info-circle"></i>
                        <div class="confirmation-text">
                            <strong>Para confirmar tu pago:</strong><br>
                            Envía el comprobante a nuestro Telegram
                        </div>
                    </div>
                    <div class="confirmation-actions">
                        <a href="https://t.me/METAQUANTstudio" target="_blank" class="btn btn-telegram">
                            <i class="fab fa-telegram-plane"></i>
                            Contactar por Telegram
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(modalOverlay);
    
    // Show modal by adding active class
    setTimeout(() => {
        modalOverlay.classList.add('active');
        document.body.classList.add('modal-open'); // Prevent body scroll
    }, 10);
    
    // Add event listeners
    function closeModal() {
        modalOverlay.remove();
        document.body.classList.remove('modal-open'); // Restore body scroll
    }
    
    modalOverlay.querySelector('.modal-close').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    console.log('Modal created successfully'); // Debug log
}

// Floating Buy Bubble Functions
function initFloatingBubble() {
    const bubble = document.getElementById('floatingBuyBubble');
    if (!bubble) return;
    
    // Click to open payment modal
    bubble.addEventListener('click', function(e) {
        // Don't trigger if clicking the close button
        if (e.target.closest('.bubble-close')) return;
        showPaymentModal();
    });
    
    // Show bubble after 3 seconds
    setTimeout(() => {
        bubble.style.opacity = '1';
        bubble.style.transform = 'translateY(0)';
    }, 3000);
}

function toggleFloatingBubble() {
    const bubble = document.getElementById('floatingBuyBubble');
    if (!bubble) return;
    
    bubble.style.opacity = '0';
    bubble.style.transform = 'translateY(100px)';
    
    // Show again after 10 seconds
    setTimeout(() => {
        bubble.style.opacity = '1';
        bubble.style.transform = 'translateY(0)';
    }, 10000);
}

// Initialize floating bubble when page loads
document.addEventListener('DOMContentLoaded', function() {
    initFloatingBubble();
});

// Contact Functions
function openTelegram() {
    const telegramUrl = 'https://t.me/METAQUANTstudio';
    window.open(telegramUrl, '_blank');
    console.log('Opening Telegram:', telegramUrl);
}

function openEmail() {
    const email = 'metaquantstudio01@gmail.com';
    const subject = 'Consulta sobre EA Golden Engel';
    const body = 'Hola, me interesa obtener más información sobre el EA Golden Engel.';
    
    // Mostrar modal con opciones de contacto
    const emailModalContent = `
        <div class="modal-header">
            <h3><i class="fas fa-envelope"></i> Contactar por Email</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <div class="email-options">
                <div class="email-option">
                    <h4><i class="fas fa-envelope"></i> Opción 1: Abrir Cliente de Correo</h4>
                    <p>Haz clic en el botón para abrir tu cliente de correo predeterminado:</p>
                    <button class="btn btn-primary" onclick="openEmailClient()">
                        <i class="fas fa-envelope"></i> Abrir Cliente de Correo
                    </button>
                </div>
                
                <div class="email-option">
                    <h4><i class="fas fa-copy"></i> Opción 2: Copiar Email</h4>
                    <p>Si no tienes cliente de correo configurado, copia nuestro email:</p>
                    <div class="email-copy-section">
                        <div class="email-display">${email}</div>
                        <button class="btn btn-secondary" onclick="copyEmailAddress()">
                            <i class="fas fa-copy"></i> Copiar Email
                        </button>
                    </div>
                </div>
                
                <div class="email-option">
                    <h4><i class="fab fa-telegram"></i> Opción 3: Contactar por Telegram</h4>
                    <p>También puedes contactarnos directamente por Telegram:</p>
                    <button class="btn btn-telegram" onclick="openTelegramFromEmail()">
                        <i class="fab fa-telegram-plane"></i> Abrir Telegram
                    </button>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary modal-cancel">Cerrar</button>
        </div>
    `;
    
    showModal('Contactar por Email', emailModalContent);
}

function openEmailClient() {
    const email = 'metaquantstudio01@gmail.com';
    const subject = 'Consulta sobre EA Golden Engel';
    const body = 'Hola, me interesa obtener más información sobre el EA Golden Engel.';
    
    try {
        const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Método 1: Usar window.location
        window.location.href = mailtoUrl;
        
        console.log('Opening email client:', mailtoUrl);
        showNotification('📧 Abriendo cliente de correo...', 'info');
        
    } catch (error) {
        console.error('Error opening email:', error);
        
        // Método 2: Crear enlace temporal
        try {
            const link = document.createElement('a');
            link.href = mailtoUrl;
            link.target = '_blank';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showNotification('📧 Abriendo cliente de correo...', 'info');
        } catch (error2) {
            console.error('Error with fallback method:', error2);
            copyEmailAddress();
        }
    }
}

function copyEmailAddress() {
    const email = 'metaquantstudio01@gmail.com';
    copyToClipboard(email);
    showNotification('📧 Email copiado al portapapeles: ' + email, 'success');
}

function openTelegramFromEmail() {
    // Cerrar el modal de email primero
    const emailModal = document.querySelector('.modal-overlay');
    if (emailModal) {
        emailModal.remove();
    }
    
    // Abrir Telegram
    openTelegram();
}

// Channel Functions
function openTelegramChannel() {
    const telegramChannelUrl = 'https://t.me/MetaquantGoldenEngel';
    window.open(telegramChannelUrl, '_blank');
    console.log('Opening Telegram channel:', telegramChannelUrl);
    showNotification('📱 Abriendo canal de Telegram...', 'info');
}

function openWhatsAppChannel() {
    const whatsappChannelUrl = 'https://whatsapp.com/channel/0029Vb5yE9AJZg46YIIkU20K';
    window.open(whatsappChannelUrl, '_blank');
    console.log('Opening WhatsApp channel:', whatsappChannelUrl);
    showNotification('💬 Abriendo canal de WhatsApp...', 'info');
}

// Make functions globally available
window.scrollToDownload = scrollToDownload;
window.scrollToFeatures = scrollToFeatures;
window.openStripePayment = openStripePayment;
window.showBankDetails = showBankDetails;
window.showCryptoDetails = showCryptoDetails;
window.showWalletDetails = showWalletDetails;
window.copyToClipboard = copyToClipboard;
window.showPaymentOptions = showPaymentOptions;
window.downloadGuide = downloadGuide;
window.showFAQ = showFAQ;
window.showTerms = showTerms;
window.showDisclaimer = showDisclaimer;
window.showAboutUs = showAboutUs;
window.selectPaymentMethod = selectPaymentMethod;
window.continuePayment = continuePayment;
window.closePaymentModal = closePaymentModal;
window.showPaymentModal = showPaymentModal;
window.showModal = showModal;
window.updateContinueButton = updateContinueButton;
window.toggleFloatingBubble = toggleFloatingBubble;
window.openTelegram = openTelegram;
window.openEmail = openEmail;
window.openEmailClient = openEmailClient;
window.copyEmailAddress = copyEmailAddress;
window.openTelegramFromEmail = openTelegramFromEmail;
window.openTelegramChannel = openTelegramChannel;
window.openWhatsAppChannel = openWhatsAppChannel;
