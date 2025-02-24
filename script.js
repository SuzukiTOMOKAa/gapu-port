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

document.addEventListener("DOMContentLoaded", () => {
  // オーバーレイ用の要素を作成
  const overlay = document.createElement("div");
  overlay.id = "imageOverlay";
  overlay.style.display = "none"; // 初期状態で非表示
  document.body.appendChild(overlay);

  // クリックで閉じる処理
  overlay.addEventListener("click", () => {
    overlay.style.display = "none";
    overlay.innerHTML = ""; // 画像を消去
  });

  function addExpandButtons() {
    document.querySelectorAll(".gallery-item").forEach(item => {
      if (!item.querySelector(".expand-btn")) { // すでにボタンがある場合は追加しない
        const img = item.querySelector("img");

        // 拡大ボタンを作成
        const expandBtn = document.createElement("button");
        expandBtn.textContent = "拡大";
        expandBtn.classList.add("expand-btn");

        // 画像の下にボタンを追加
        item.appendChild(expandBtn);

        // ボタンクリックで拡大
        expandBtn.addEventListener("click", () => {
          const enlargedImg = document.createElement("img");
          enlargedImg.src = img.src;
          enlargedImg.style.maxWidth = "90%";
          enlargedImg.style.maxHeight = "90%";
          enlargedImg.style.borderRadius = "10px";
          enlargedImg.style.boxShadow = "0 5px 15px rgba(255, 255, 255, 0.2)";

          overlay.innerHTML = ""; // 前の画像をクリア
          overlay.appendChild(enlargedImg);
          overlay.style.display = "flex"; // 表示
        });
      }
    });
  }

  // ページ読み込み時に拡大ボタンを追加
  addExpandButtons();

  // ギャラリーが動的に更新される場合に対応
  const observer = new MutationObserver(() => {
    addExpandButtons();
  });

  observer.observe(document.getElementById("gallery"), { childList: true });
});
