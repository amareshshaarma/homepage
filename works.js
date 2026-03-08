// Works page — slider init is handled by script.js
// Add any works-page specific interactions here

document.addEventListener('DOMContentLoaded', () => {
  // Filter buttons (can be wired to categories later)
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
});
