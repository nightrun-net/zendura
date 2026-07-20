if (localStorage.getItem('zendura-session') !== 'active') {
  window.location.replace('login.html');
}

const logoutButton = document.getElementById('logoutButton');
const sidebarEmail = document.getElementById('sidebarEmail');
const currentDate = document.getElementById('currentDate');

sidebarEmail.textContent = localStorage.getItem('zendura-admin-email') || 'admin@zendura.com';

const formattedDate = new Intl.DateTimeFormat('de-DE', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric'
}).format(new Date());

currentDate.textContent = `${formattedDate} · Hier ist Ihre heutige Übersicht.`;

logoutButton.addEventListener('click', () => {
  localStorage.removeItem('zendura-session');
  localStorage.removeItem('zendura-admin-email');
  window.location.replace('login.html');
});

document.querySelectorAll('.nav-item').forEach((item) => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach((navItem) => {
      navItem.classList.remove('active');
    });

    item.classList.add('active');
  });
});
