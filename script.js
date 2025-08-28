async function loadResume() {
  const res = await fetch('resume.json');
  if (!res.ok) throw new Error('Failed to load resume.json');
  return res.json();
}

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

function renderHeader({ name, email }) {
  document.getElementById('name').textContent = name;
  const emailSpan = document.getElementById('email');
  emailSpan.textContent = email;
  document.getElementById('footer-name').textContent = name;
  document.getElementById('year').textContent = new Date().getFullYear();
}

function renderSection(list, containerId) {
  const wrap = document.getElementById(containerId);
  wrap.innerHTML = '';
  list.forEach(item => {
    const card = el('div', 'item');
    const title = el('div', 'title');
    title.innerHTML = item.url ? `<a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.title}</a>` : item.title;
    const period = el('div', 'period', item.period || '');
    card.appendChild(title);
    if (item.subtitle) card.appendChild(el('div', 'subtitle', item.subtitle));
    if (item.period) card.appendChild(period);
    if (item.points && item.points.length) {
      const ul = el('ul');
      item.points.forEach(p => {
        const li = el('li');
        if (typeof p === 'string') {
          li.textContent = p;
        } else if (p && p.text) {
          if (p.url) {
            const a = el('a');
            a.href = p.url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.textContent = p.text;
            li.appendChild(a);
          } else {
            li.textContent = p.text;
          }
        }
        ul.appendChild(li);
      });
      card.appendChild(ul);
    }
    wrap.appendChild(card);
  });
}

loadResume()
  .then(data => {
    renderHeader(data);
    renderSection(data.education, 'education-items');
    renderSection(data.experience, 'experience-items');
  })
  .catch(err => {
    console.error(err);
    document.getElementById('name').textContent = 'Resume';
  });
