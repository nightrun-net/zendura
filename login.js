const SUPABASE_URL =
    'https://mivmlczohqcyffnjqckz.supabase.co';

const SUPABASE_KEY =
    'sb_publishable_GbR_jm4OlfY3gu5OgnpReA_IcU2FXYD';

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


const loginForm =
    document.getElementById('loginForm');

const emailInput =
    document.getElementById('email');

const passwordInput =
    document.getElementById('password');

const loginError =
    document.getElementById('loginError');

const togglePassword =
    document.getElementById('togglePassword');

const passwordEyeIcon =
    document.getElementById('passwordEyeIcon');

const loginButton =
    document.getElementById('loginButton');

const rememberMe =
    document.getElementById('rememberMe');


/* ==================================================
   CHECK EXISTING SESSION
================================================== */

async function checkExistingSession() {
    try {
        const {
            data: {
                session
            },
            error
        } = await supabaseClient
            .auth
            .getSession();

        if (error) {
            throw error;
        }

        /*
            If the user is already logged in,
            open new-record.html immediately.
        */

        if (
            session &&
            session.user
        ) {
            window.location.replace(
                'new-record.html'
            );

            return;
        }

    } catch (error) {
        console.error(
            'Session check error:',
            error
        );
    }
}


/* ==================================================
   PASSWORD VISIBILITY
================================================== */

if (
    togglePassword &&
    passwordInput &&
    passwordEyeIcon
) {
    togglePassword.addEventListener(
        'click',
        () => {
            const passwordIsHidden =
                passwordInput.type ===
                'password';

            passwordInput.type =
                passwordIsHidden
                    ? 'text'
                    : 'password';

            passwordEyeIcon.classList.toggle(
                'fa-eye',
                !passwordIsHidden
            );

            passwordEyeIcon.classList.toggle(
                'fa-eye-slash',
                passwordIsHidden
            );

            togglePassword.setAttribute(
                'aria-label',
                passwordIsHidden
                    ? 'Passwort ausblenden'
                    : 'Passwort anzeigen'
            );

            togglePassword.setAttribute(
                'aria-pressed',
                String(passwordIsHidden)
            );
        }
    );
}


/* ==================================================
   LOGIN ERROR
================================================== */

function showLoginError(message) {
    if (!loginError) {
        return;
    }

    loginError.textContent =
        message;

    loginError.classList.add(
        'show'
    );
}


function clearLoginError() {
    if (!loginError) {
        return;
    }

    loginError.textContent = '';

    loginError.classList.remove(
        'show'
    );
}


/* ==================================================
   LOGIN BUTTON LOADING
================================================== */

function setLoginLoading(isLoading) {
    if (!loginButton) {
        return;
    }

    loginButton.disabled =
        isLoading;

    if (isLoading) {
        loginButton.innerHTML = `
            <span>Anmeldung läuft...</span>

            <i
                class="fa-solid fa-spinner fa-spin"
                aria-hidden="true"
            ></i>
        `;
    } else {
        loginButton.innerHTML = `
            <span>Anmelden</span>

            <i
                class="fa-solid fa-arrow-right"
                aria-hidden="true"
            ></i>
        `;
    }
}


/* ==================================================
   LOGIN
================================================== */

if (
    loginForm &&
    emailInput &&
    passwordInput
) {
    loginForm.addEventListener(
        'submit',
        async (event) => {
            event.preventDefault();

            clearLoginError();

            if (!loginForm.checkValidity()) {
                loginForm.reportValidity();
                return;
            }

            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();

            const password =
                passwordInput.value;

            setLoginLoading(true);

            try {
                const {
                    data,
                    error
                } = await supabaseClient
                    .auth
                    .signInWithPassword({
                        email,
                        password
                    });

                if (error) {
                    throw error;
                }

                if (
                    !data.user ||
                    !data.session
                ) {
                    throw new Error(
                        'No authenticated session was returned.'
                    );
                }

                localStorage.setItem(
                    'zendura-admin-email',
                    data.user.email || email
                );

                localStorage.setItem(
                    'zendura-remember-login',
                    rememberMe?.checked
                        ? 'true'
                        : 'false'
                );

                /*
                    After successful login,
                    open new-record.html first.
                */

                window.location.replace(
                    'new-record.html'
                );

            } catch (error) {
                console.error(
                    'Supabase login error:',
                    error
                );

                showLoginError(
                    'E-Mail-Adresse oder Passwort ist nicht korrekt.'
                );

            } finally {
                setLoginLoading(false);
            }
        }
    );
}


/* ==================================================
   INITIALIZE
================================================== */

checkExistingSession();
