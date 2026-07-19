const SUPABASE_URL = 'https://mivmlczohqcyffnjqckz.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_GbR_jm4OlfY3gu5OgnpReA_IcU2FXYD';

let supabaseClient = null;

const supabaseConfigured =
    SUPABASE_URL &&
    SUPABASE_PUBLISHABLE_KEY &&
    !SUPABASE_URL.includes('YOUR-PROJECT-ID') &&
    !SUPABASE_PUBLISHABLE_KEY.includes('YOUR-PUBLISHABLE') &&
    !SUPABASE_PUBLISHABLE_KEY.includes('YOUR-ANON');

if (
    supabaseConfigured &&
    window.supabase &&
    typeof window.supabase.createClient === 'function'
) {
    supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );
}



document.addEventListener('DOMContentLoaded', () => {

    document.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });


    const splashScreen = document.getElementById('splash-screen');

    if (splashScreen) {
        setTimeout(() => {
            splashScreen.classList.add('hidden');

            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 800);
        }, 2000);
    }



    const header = document.getElementById('mainHeader');
    let lastScrollTop = 0;

    if (header) {
        window.addEventListener(
            'scroll',
            () => {
                const scrollTop =
                    window.pageYOffset ||
                    document.documentElement.scrollTop;

                if (
                    scrollTop > lastScrollTop &&
                    scrollTop > 80
                ) {
                    header.classList.add('hide-header');
                } else {
                    header.classList.remove('hide-header');
                }

                lastScrollTop = Math.max(scrollTop, 0);
            },
            {
                passive: true
            }
        );
    }



    const hamburger =
        document.getElementById('hamburgerMenu');

    const mobileMenu =
        document.getElementById('mobileMenu');

    const closeMenu =
        document.getElementById('closeMenu');

    const setMobileMenu = (isOpen) => {
        if (!mobileMenu) return;

        mobileMenu.classList.toggle(
            'active',
            isOpen
        );

        mobileMenu.setAttribute(
            'aria-hidden',
            String(!isOpen)
        );

        document.body.style.overflow =
            isOpen ? 'hidden' : '';
    };

    window.openMobileMenu = function () {
        setMobileMenu(true);
    };

    window.closeMobileMenu = function () {
        setMobileMenu(false);
    };

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            setMobileMenu(true);
        });
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', () => {
            setMobileMenu(false);
        });
    }

    if (mobileMenu) {
        mobileMenu.addEventListener(
            'click',
            (event) => {
                if (event.target === mobileMenu) {
                    setMobileMenu(false);
                }
            }
        );
    }


 
    const langModal =
        document.getElementById('langModal');

    const languageOptions =
        document.querySelectorAll('.lang-option');


    let currentLanguage = 'de';



    window.openLangModal = function () {
        if (!langModal) return;

        langModal.classList.add('active');

        langModal.setAttribute(
            'aria-hidden',
            'false'
        );

        document.body.style.overflow = 'hidden';
    };



    window.closeLangModal = function () {
        if (!langModal) return;

        langModal.classList.remove('active');

        langModal.setAttribute(
            'aria-hidden',
            'true'
        );

        document.body.style.overflow = '';
    };



    function updateSelectedLanguageIcon(language) {
        languageOptions.forEach((option) => {
            const optionLanguage =
                option.getAttribute('data-language');

            const isSelected =
                optionLanguage === language;

            option.classList.toggle(
                'selected',
                isSelected
            );

            option.setAttribute(
                'aria-current',
                isSelected ? 'true' : 'false'
            );
        });
    }

        window.changeLang = function (langCode) {

        if (!window.changeLang.initialized) {
            const savedLanguage =
                localStorage.getItem('zendura-language') ||
                localStorage.getItem('zenduraLanguage');
    
            currentLanguage =
                savedLanguage === 'en' || savedLanguage === 'de'
                    ? savedLanguage
                    : langCode === 'en'
                        ? 'en'
                        : 'de';
    
            window.changeLang.initialized = true;
        } else {
            currentLanguage =
                langCode === 'en' ? 'en' : 'de';
        }
    
        document.documentElement.lang =
            currentLanguage;
    
        const langDesktop =
            document.getElementById(
                'currentLangDesktop'
            );
    
        if (langDesktop) {
            langDesktop.textContent =
                currentLanguage === 'de'
                    ? 'Deutsch'
                    : 'English';
        }
    
        localStorage.setItem(
            'zendura-language',
            currentLanguage
        );
    
        localStorage.setItem(
            'zenduraLanguage',
            currentLanguage
        );
    
        document
            .querySelectorAll('.i18n')
            .forEach((element) => {
                const translatedText =
                    element.getAttribute(
                        `data-${currentLanguage}`
                    );
    
                if (translatedText !== null) {
                    element.innerHTML =
                        translatedText;
                }
            });
    
        document
            .querySelectorAll('.i18n-ph')
            .forEach((element) => {
                const translatedPlaceholder =
                    element.getAttribute(
                        `data-${currentLanguage}`
                    );
    
                if (translatedPlaceholder !== null) {
                    element.setAttribute(
                        'placeholder',
                        translatedPlaceholder
                    );
                }
            });
    
        updateSelectedLanguageIcon(
            currentLanguage
        );
    
        window.closeLangModal();
    };
    

    languageOptions.forEach((option) => {
        option.addEventListener(
            'click',
            (event) => {
                event.preventDefault();

                const selectedLanguage =
                    option.getAttribute(
                        'data-language'
                    );

                if (selectedLanguage) {
                    window.changeLang(
                        selectedLanguage
                    );
                }
            }
        );
    });


    if (langModal) {
        langModal.addEventListener(
            'click',
            (event) => {
                if (event.target === langModal) {
                    window.closeLangModal();
                }
            }
        );
    }



    window.changeLang('de');


  
    document.addEventListener(
        'keydown',
        (event) => {
            if (event.key === 'Escape') {
                setMobileMenu(false);
                window.closeLangModal();
            }
        }
    );


    const bookingForm =
        document.getElementById('bookingForm');

    const formStatus =
        document.getElementById('formStatus');

    const submitBookingButton =
        document.getElementById('submitBookingBtn');


    /**
     * Display a translated form status message.
     *
     * @param {string} message
     * @param {'success'|'error'} type
     */
    function showFormStatus(message, type) {
        if (!formStatus) return;

        formStatus.textContent = message;

        formStatus.classList.remove(
            'success',
            'error',
            'show'
        );

        formStatus.classList.add(
            'show',
            type
        );
    }



    function clearFormStatus() {
        if (!formStatus) return;

        formStatus.textContent = '';

        formStatus.classList.remove(
            'success',
            'error',
            'show'
        );
    }


    /**
     * Change the button to loading mode.
     *
     * @param {boolean} loading
     */
    function setFormLoading(loading) {
        if (!submitBookingButton) return;

        submitBookingButton.disabled = loading;

        if (loading) {
            submitBookingButton.innerHTML =
                currentLanguage === 'de'
                    ? `
                        <span>Anfrage wird gesendet...</span>
                        <i class="fa-solid fa-spinner"></i>
                    `
                    : `
                        <span>Sending request...</span>
                        <i class="fa-solid fa-spinner"></i>
                    `;
        } else {
            submitBookingButton.innerHTML =
                currentLanguage === 'de'
                    ? `
                        <span
                            class="i18n"
                            data-en="Send Request"
                            data-de="Anfrage senden"
                        >
                            Anfrage senden
                        </span>
                        <i class="fa-solid fa-paper-plane"></i>
                    `
                    : `
                        <span
                            class="i18n"
                            data-en="Send Request"
                            data-de="Anfrage senden"
                        >
                            Send Request
                        </span>
                        <i class="fa-solid fa-paper-plane"></i>
                    `;
        }
    }


    /**
     * Safely read and trim an input value.
     *
     * @param {string} inputId
     * @returns {string}
     */
    function getInputValue(inputId) {
        const input =
            document.getElementById(inputId);

        if (!input) {
            return '';
        }

        return input.value.trim();
    }


    if (bookingForm) {
        bookingForm.addEventListener(
            'submit',
            async (event) => {
                event.preventDefault();

                clearFormStatus();


                if (!bookingForm.checkValidity()) {
                    bookingForm.reportValidity();
                    return;
                }


                if (!supabaseClient) {
                    showFormStatus(
                        currentLanguage === 'de'
                            ? 'Supabase ist noch nicht konfiguriert. Bitte tragen Sie Ihre Projekt-URL und Ihren öffentlichen Schlüssel in script.js ein.'
                            : 'Supabase is not configured. Add your project URL and public key to script.js.',
                        'error'
                    );

                    return;
                }

                const firstName =
                    getInputValue('firstName');

                const lastName =
                    getInputValue('lastName');

                const email =
                    getInputValue('email');

                const phone =
                    getInputValue('phone');

                const address =
                    getInputValue('address');

                const customerMessage =
                    getInputValue('message');


                const bookingRequest = {
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    phone: phone,
                    address: address,
                    message: customerMessage,
                    language: currentLanguage,
                    status: 'new'
                };


                setFormLoading(true);

                try {
                    const { error } =
                        await supabaseClient
                            .from('booking_requests')
                            .insert(bookingRequest);

                    if (error) {
                        throw error;
                    }


                    bookingForm.reset();

                    showFormStatus(
                        currentLanguage === 'de'
                            ? 'Vielen Dank! Ihre Anfrage wurde erfolgreich gesendet. Unser Team wird sich bald bei Ihnen melden.'
                            : 'Thank you! Your request was sent successfully. Our team will contact you soon.',
                        'success'
                    );

                    console.log(
                        'Booking request inserted successfully.'
                    );
                } catch (error) {
                    console.error(
                        'Supabase booking insert error:',
                        error
                    );

                    let errorMessage;

                    if (
                        error &&
                        error.message &&
                        error.message.includes(
                            'row-level security'
                        )
                    ) {
                        errorMessage =
                            currentLanguage === 'de'
                                ? 'Die Anfrage konnte aufgrund der Datenbankberechtigungen nicht gespeichert werden. Bitte überprüfen Sie die Supabase-RLS-Richtlinie.'
                                : 'The request could not be saved because of database permissions. Check the Supabase RLS policy.';
                    } else {
                        errorMessage =
                            currentLanguage === 'de'
                                ? 'Ihre Anfrage konnte nicht gesendet werden. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.'
                                : 'Your request could not be sent. Check your internet connection and try again.';
                    }

                    showFormStatus(
                        errorMessage,
                        'error'
                    );
                } finally {
                    setFormLoading(false);
                }
            }
        );
    }



    const timelineTrack =
        document.getElementById('timelineTrack');

    const progressBar =
        document.getElementById('progressBar');

    const timelineItems =
        document.querySelectorAll('.timeline-item');


    function handleScrollTimeline() {
        if (!timelineTrack) return;

        const trackRect =
            timelineTrack.getBoundingClientRect();

        const trackTop =
            trackRect.top;

        const triggerPointY =
            window.innerHeight * 0.65;

        let heightPx =
            triggerPointY - trackTop;

        if (heightPx < 0) {
            heightPx = 0;
        }

        if (heightPx > trackRect.height) {
            heightPx = trackRect.height;
        }

        if (progressBar) {
            progressBar.style.height =
                `${heightPx}px`;
        }

        const progressBottomY =
            trackTop + heightPx;

        timelineItems.forEach((item) => {
            const circle =
                item.querySelector(
                    '.timeline-circle'
                );

            if (circle) {
                const circleRect =
                    circle.getBoundingClientRect();

                const circleCenterY =
                    circleRect.top +
                    circleRect.height / 2;

                if (
                    progressBottomY >=
                    circleCenterY
                ) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            }

            const itemRect =
                item.getBoundingClientRect();

            if (
                itemRect.top <
                window.innerHeight * 0.85
            ) {
                item.classList.add('show');
            }
        });
    }


    if (timelineTrack) {
        window.addEventListener(
            'scroll',
            handleScrollTimeline,
            {
                passive: true
            }
        );

        window.addEventListener(
            'resize',
            handleScrollTimeline
        );

        handleScrollTimeline();
    }



    const revealItems =
        document.querySelectorAll('.reveal');

    if (
        revealItems.length > 0 &&
        'IntersectionObserver' in window
    ) {
        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (
                            entry.isIntersecting
                        ) {
                            entry.target.classList.add(
                                'show'
                            );

                            observer.unobserve(
                                entry.target
                            );
                        }
                    });
                },
                {
                    threshold: 0.12,
                    rootMargin:
                        '0px 0px -40px 0px'
                }
            );

        revealItems.forEach((item) => {
            revealObserver.observe(item);
        });
    } else {
        revealItems.forEach((item) => {
            item.classList.add('show');
        });
    }
});
