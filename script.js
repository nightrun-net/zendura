document.addEventListener('DOMContentLoaded', () => {

    // ================= SPLASH SCREEN LOGIC =================
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        setTimeout(() => {
            splashScreen.classList.add('hidden');
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 800);
        }, 2000); 
    }
            
    // ================= HEADER SCROLL LOGIC =================
    const header = document.getElementById('mainHeader');
    let lastScrollTop = 0;

    if (header) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop && scrollTop > 80) {
                header.classList.add('hide-header');
            } else {
                header.classList.remove('hide-header');
            }
            lastScrollTop = Math.max(scrollTop, 0);
        }, { passive: true });
    }

    // ================= MOBILE MENU LOGIC (FIXED) =================
    const hamburger = document.getElementById('hamburgerMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');

    const setMobileMenu = (isOpen) => {
        if (!mobileMenu) return;
        mobileMenu.classList.toggle("active", isOpen);
        mobileMenu.setAttribute("aria-hidden", String(!isOpen));
        document.body.style.overflow = isOpen ? "hidden" : "";
    };

    // Fonksiyona Global ji bo ku di HTML de kar bike û shasha necemide
    window.closeMobileMenu = function() {
        if (mobileMenu) {
            mobileMenu.classList.remove("active");
            mobileMenu.setAttribute("aria-hidden", "true");
            document.body.style.overflow = ""; // VÊ YEKÊ PIRSGIRÊKA CEMIDANDINA SHASHAYÊ ÇARESER KIR
        }
    };

    if (hamburger && closeMenu) {
        hamburger.addEventListener('click', () => setMobileMenu(true));
        closeMenu.addEventListener('click', () => setMobileMenu(false));
    }

    // ================= LANGUAGE MODAL & TRANSLATION =================
    const langModal = document.getElementById('langModal');
    const languageOptions = document.querySelectorAll(".lang-option");
    
    let currentLanguage = localStorage.getItem("zendura-language");
    if (currentLanguage !== 'en') {
        currentLanguage = 'de'; 
    }

    window.openLangModal = function() { 
        if (!langModal) return;
        langModal.classList.add('active'); 
        langModal.setAttribute("aria-hidden", "false");
    }
    
    window.closeLangModal = function() { 
        if (!langModal) return;
        langModal.classList.remove('active'); 
        langModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = ""; // Garantiya zêde ji bo nesekinîna rûpelê
    }

    window.changeLang = function(langCode) {
        if (!langCode) return;
        currentLanguage = langCode === 'de' ? 'de' : 'en';
        document.documentElement.lang = currentLanguage;
        
        const langDesktop = document.getElementById('currentLangDesktop');
        if (langDesktop) {
            langDesktop.innerText = currentLanguage === 'de' ? 'Deutsch' : 'English';
        }
        
        localStorage.setItem("zendura-language", currentLanguage);
        
        document.querySelectorAll('.i18n').forEach(el => {
            const translatedText = el.getAttribute(`data-${currentLanguage}`);
            if(translatedText) {
                el.innerHTML = translatedText;
            }
        });

        document.querySelectorAll('.i18n-ph').forEach(el => {
            const translatedPlaceholder = el.getAttribute(`data-${currentLanguage}`);
            if(translatedPlaceholder) {
                el.setAttribute('placeholder', translatedPlaceholder);
            }
        });

        window.closeLangModal();
    };

    languageOptions.forEach((option) => {
        option.addEventListener("click", (event) => {
            event.preventDefault();
            const selectedLang = option.getAttribute('data-language');
            if (selectedLang) {
                window.changeLang(selectedLang); 
            }
        });
    });

    if (langModal) {
        langModal.addEventListener('click', (e) => {
            if(e.target === langModal) window.closeLangModal();
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMobileMenu(false);
            window.closeLangModal();
        }
    });

    window.changeLang(currentLanguage);

    // ================= BOOKING FORM (WHATSAPP) =================
    const bookingForm = document.getElementById('bookingForm');
    const formStatus = document.getElementById('formStatus');
    const COMPANY_WHATSAPP = '1234567890'; 

    if (bookingForm) {
        bookingForm.addEventListener('submit', (event) => {
            event.preventDefault();

            if (!bookingForm.checkValidity()) {
                bookingForm.reportValidity();
                return;
            }

            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const address = document.getElementById('address').value.trim();
            const customerMessage = document.getElementById('message').value.trim();

            const whatsappMessage = [
                '✨ *New Peaceful Cleaning Request*',
                '',
                `👤 Name: ${firstName} ${lastName}`,
                `✉️ Email: ${email}`,
                `📞 Phone: ${phone}`,
                `📍 Address: ${address}`,
                '',
                `📝 Message: ${customerMessage}`
            ].join('\n');

            const whatsappUrl = `https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

            if (formStatus) {
                formStatus.textContent = currentLanguage === 'de'
                    ? 'WhatsApp wurde mit Ihrer Anfrage geöffnet. Drücken Sie dort auf Senden.'
                    : 'WhatsApp opened with your request. Press Send there to gracefully contact our team.';
                formStatus.classList.add('show');
            }
        });
    }

    // ================= TIMELINE SCROLL LOGIC =================
    const timelineTrack = document.getElementById('timelineTrack');
    const progressBar = document.getElementById('progressBar');
    const timelineItems = document.querySelectorAll('.timeline-item');

    function handleScrollTimeline() {
        if (!timelineTrack) return;

        const trackRect = timelineTrack.getBoundingClientRect();
        const trackTop = trackRect.top;
        
        const triggerPointY = window.innerHeight * 0.65; 
        let heightPx = triggerPointY - trackTop;
        
        if (heightPx < 0) heightPx = 0;
        if (heightPx > trackRect.height) heightPx = trackRect.height;
        
        if (progressBar) {
            progressBar.style.height = `${heightPx}px`;
        }

        const progressBottomY = trackTop + heightPx;

        timelineItems.forEach(item => {
            const circle = item.querySelector('.timeline-circle');
            if (circle) {
                const circleRect = circle.getBoundingClientRect();
                const circleCenterY = circleRect.top + (circleRect.height / 2);

                if (progressBottomY >= circleCenterY) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            }
            
            if (item.getBoundingClientRect().top < window.innerHeight * 0.85) {
                item.classList.add('show');
            }
        });
    }

    if (timelineTrack) {
        window.addEventListener('scroll', handleScrollTimeline);
        handleScrollTimeline(); 
    }

    // ================= REVEAL ANIMATION =================
    const revealItems = document.querySelectorAll(".reveal");
    
    if (revealItems.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        });

        revealItems.forEach((item) => revealObserver.observe(item));
    }
});