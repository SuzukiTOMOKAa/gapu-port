const searchBar = document.getElementById('search-bar');
searchBar.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = illustrations.filter(illust =>
    illust.title.toLowerCase().includes(query) ||
    illust.tags.some(tag => tag.toLowerCase().includes(query))
  );
  displayIllustrations(filtered);
});

const gallery = document.getElementById('gallery');

// JSONデータを読み込む関数
function loadIllustrations() {
  fetch('illustrations.json')
    .then(response => response.json()) // JSONデータを取得
    .then(data => {
      displayIllustrations(data); // イラストを表示
    })
    .catch(error => console.error('データの読み込みに失敗しました:', error));
}

// イラストを表示する関数
function displayIllustrations(items) {
  gallery.innerHTML = ''; // ギャラリーをクリア
  items.forEach(illust => {
    const div = document.createElement('div');
    div.className = 'illustration';
    div.innerHTML = `
      <img src="${illust.img}" alt="${illust.title}">
      <div class="info">
        <h3>${illust.title}</h3>
        <p>${illust.tags.join(', ')}</p>
      </div>
    `;
    gallery.appendChild(div);
  });
}

// ページ読み込み時に実行
loadIllustrations();
