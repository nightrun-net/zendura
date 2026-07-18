const SUPABASE_URL = 'https://mivmlczohqcyffnjqckz.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_GbR_jm4OlfY3gu5OgnpReA_IcU2FXYD';

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


document.addEventListener('DOMContentLoaded', () => {

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
        window.addEventListener('scroll', () => {
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
        }, {
            passive: true
        });
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

    window.closeMobileMenu = function () {
        if (mobileMenu) {
            mobileMenu.classList.remove('active');

            mobileMenu.setAttribute(
                'aria-hidden',
                'true'
            );

            document.body.style.overflow = '';
        }
    };

    if (hamburger && closeMenu) {
        hamburger.addEventListener(
            'click',
            () => setMobileMenu(true)
        );

        closeMenu.addEventListener(
            'click',
            () => setMobileMenu(false)
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
        if (!langCode) return;

        currentLanguage =
            langCode === 'en' ? 'en' : 'de';

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

                if (
                    translatedPlaceholder !== null
                ) {
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

    const bookingForm =
        document.getElementById('bookingForm');

    const formStatus =
        document.getElementById('formStatus');

    const COMPANY_WHATSAPP = '0789642788';

    async function insertBookingRequest(bookingData) {
        const { error } = await supabaseClient
            .from('booking_requests')
            .insert({
                first_name: bookingData.firstName,
                last_name: bookingData.lastName,
                email: bookingData.email,
                phone: bookingData.phone,
                address: bookingData.address,
                message: bookingData.message,
                language: bookingData.language
            });

        if (error) {
            throw error;
        }
    }


    if (bookingForm) {
        bookingForm.addEventListener(
            'submit',
            async (event) => {
                event.preventDefault();

                if (!bookingForm.checkValidity()) {
                    bookingForm.reportValidity();
                    return;
                }

                const firstName =
                    document
                        .getElementById('firstName')
                        .value
                        .trim();

                const lastName =
                    document
                        .getElementById('lastName')
                        .value
                        .trim();

                const email =
                    document
                        .getElementById('email')
                        .value
                        .trim();

                const phone =
                    document
                        .getElementById('phone')
                        .value
                        .trim();

                const address =
                    document
                        .getElementById('address')
                        .value
                        .trim();

                const customerMessage =
                    document
                        .getElementById('message')
                        .value
                        .trim();

                const bookingData = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: phone,
                    address: address,
                    message: customerMessage,
                    language: currentLanguage
                };

                try {
                    // Insert request into Supabase
                    await insertBookingRequest(
                        bookingData
                    );

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

                    const whatsappUrl =
                        `https://wa.me/${COMPANY_WHATSAPP}` +
                        `?text=${encodeURIComponent(whatsappMessage)}`;

                    window.open(
                        whatsappUrl,
                        '_blank',
                        'noopener,noreferrer'
                    );

                    if (formStatus) {
                        formStatus.textContent =
                            currentLanguage === 'de'
                                ? 'Ihre Anfrage wurde erfolgreich gespeichert.'
                                : 'Your request was saved successfully.';

                        formStatus.classList.add('show');
                    }

                    bookingForm.reset();

                } catch (error) {
                    console.error(
                        'Supabase insert error:',
                        error
                    );

                    if (formStatus) {
                        formStatus.textContent =
                            currentLanguage === 'de'
                                ? 'Ihre Anfrage konnte nicht gespeichert werden.'
                                : 'Your request could not be saved.';

                        formStatus.classList.add('show');
                    }
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

            if (
                item.getBoundingClientRect().top <
                window.innerHeight * 0.85
            ) {
                item.classList.add('show');
            }
        });
    }

    if (timelineTrack) {
        window.addEventListener(
            'scroll',
            handleScrollTimeline
        );

        handleScrollTimeline();
    }

    const revealItems =
        document.querySelectorAll('.reveal');

    if (revealItems.length > 0) {
        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
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
    }
});