const gallery = document.getElementById('gallery');
const searchBox = document.getElementById('searchBox');
const tagButtons = document.querySelectorAll('.tag-btn');
const sortOption = document.getElementById('sortOption');

let illustrations = [];
let selectedTags = new Set(); // 選択中のタグを管理

// JSONデータを取得
async function loadIllustrations() {
  const response = await fetch('illustrations.json');
  const data = await response.json();
  illustrations = data;
  displayIllustrations(illustrations);
}

// イラストを表示する関数
function displayIllustrations(data) {
  gallery.innerHTML = "";

  data.forEach(illust => {
    const item = document.createElement('div');
    item.classList.add('gallery-item');
    item.innerHTML = `
      <img src="${illust.image}" alt="${illust.title}">
      <h3>${illust.title}</h3>
      <p>タグ: ${illust.tags.join(', ')}</p>
      <p>追加日: ${illust.date}</p>
    `;
    gallery.appendChild(item);
  });
}

// ページ読み込み時にデータを取得して表示
loadIllustrations();

// 検索処理（タイトル & タグ）
searchBox.addEventListener('input', () => {
  filterIllustrations();
});

// タグ絞り込み処理（複数選択対応）
tagButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tag = button.dataset.tag;

    if (selectedTags.has(tag)) {
      selectedTags.delete(tag); // 既に選択されていたら解除
      button.classList.remove('active'); // 見た目の変更
    } else {
      selectedTags.add(tag); // 選択
      button.classList.add('active'); // 見た目の変更
    }

    filterIllustrations();
  });
});

// 並び替え処理
sortOption.addEventListener('change', () => {
  filterIllustrations();
});

// フィルタリング処理（検索 + タグ + 並び替え）
function filterIllustrations() {
  let filtered = [...illustrations];

  // 検索ワードで絞り込み
  const keyword = searchBox.value.toLowerCase();
  if (keyword) {
    filtered = filtered.filter(illust =>
      illust.title.toLowerCase().includes(keyword) ||
      illust.tags.some(tag => tag.toLowerCase().includes(keyword))
    );
  }

  // 選択されたタグでフィルタリング（すべてのタグを含むものだけ表示）
  if (selectedTags.size > 0) {
    filtered = filtered.filter(illust =>
      [...selectedTags].every(tag => illust.tags.includes(tag))
    );
  }

  // 並び替え
  switch (sortOption.value) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'oldest':
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case 'titleAsc':
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'titleDesc':
      filtered.sort((a, b) => b.title.localeCompare(a.title));
      break;
  }

  displayIllustrations(filtered);
}
