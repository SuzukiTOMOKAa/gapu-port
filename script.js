const searchBar = document.getElementById('search-bar');
searchBar.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = illustrations.filter(illust =>
    illust.title.toLowerCase().includes(query) ||
    illust.tags.some(tag => tag.toLowerCase().includes(query))
  );
  displayIllustrations(filtered);
});
