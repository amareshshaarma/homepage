// Contact form handler

function handleSubmit() {
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const note    = document.getElementById('form-note');

  if (!name || !email || !message) {
    note.textContent = 'Please fill in all required fields.';
    note.style.color = '#ff4d4d';
    return;
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    note.textContent = 'Please enter a valid email address.';
    note.style.color = '#ff4d4d';
    return;
  }

  const to = 'amareshshaarma@gmail.com';
  const subject = `Portfolio Contact from ${name}`;
  const bodyText = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
  window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

  note.textContent = 'Message draft opened in your email app.';
  note.style.color = 'var(--yellow)';

  // Clear form
  ['name','email','message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

// Allow Enter to submit (except in textarea)
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') {
    handleSubmit();
  }
});

