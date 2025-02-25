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
      <button class="expand-btn">拡大</button>
    `;
    gallery.appendChild(item);
  });

  // 拡大イベントを適用
  console.log("拡大イベント適用");
  addExpandEvent();
  console.log("拡大イベント適用");
}

// ページ読み込み時にデータを取得して表示
loadIllustrations();

// 検索処理（タイトル & タグ）
searchBox.addEventListener('input', filterIllustrations);

// タグ絞り込み処理（複数選択対応）
tagButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tag = button.dataset.tag;
    if (selectedTags.has(tag)) {
      selectedTags.delete(tag);
      button.classList.remove('active');
    } else {
      selectedTags.add(tag);
      button.classList.add('active');
    }
    filterIllustrations();
  });
});

// 並び替え処理
sortOption.addEventListener('change', filterIllustrations);

// フィルタリング処理
function filterIllustrations() {
  let filtered = [...illustrations];
  const keyword = searchBox.value.toLowerCase();
  if (keyword) {
    filtered = filtered.filter(illust =>
      illust.title.toLowerCase().includes(keyword) ||
      illust.tags.some(tag => tag.toLowerCase().includes(keyword))
    );
  }

  if (selectedTags.size > 0) {
    filtered = filtered.filter(illust =>
      [...selectedTags].every(tag => illust.tags.includes(tag))
    );
  }

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

// オーバーレイを作成する関数
function createOverlay() {
  let overlay = document.getElementById("imageOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "imageOverlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0, 0, 0, 0.8)";
    overlay.style.display = "none";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "1000";
    overlay.addEventListener("click", () => {
      overlay.style.display = "none";
      overlay.innerHTML = "";
    });
    document.body.appendChild(overlay);
  }
  return overlay;
}

// 拡大ボタンのイベントを追加
function addExpandEvent() {
  const expandButtons = document.querySelectorAll(".expand-btn");
  expandButtons.forEach(button => {
    button.addEventListener("click", (event) => {
      const img = event.target.parentElement.querySelector("img");
      const overlay = createOverlay();
      const enlargedImg = document.createElement("img");
      enlargedImg.src = img.src;
      enlargedImg.style.maxWidth = "90%";
      enlargedImg.style.maxHeight = "90%";
      enlargedImg.style.borderRadius = "10px";
      enlargedImg.style.boxShadow = "0 5px 15px rgba(255, 255, 255, 0.2)";
      overlay.innerHTML = "";
      overlay.appendChild(enlargedImg);
      overlay.style.display = "flex";
    });
  });
}
