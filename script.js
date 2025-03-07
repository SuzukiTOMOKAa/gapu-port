const gallery = document.getElementById('gallery');
const searchBox = document.getElementById('searchBox');
const tagButtons = document.querySelectorAll('.tag-btn');
const sortOption = document.getElementById('sortOption');

let illustrations = [];
let selectedTags = new Set(); // 選択中のタグを管理

// JSONデータを取得
async function loadIllustrations() {
  try {
    const response = await fetch('illustrations.json');
    illustrations = await response.json();
    displayIllustrations(illustrations);
  } catch (error) {
    console.error("❌ イラストデータの読み込みに失敗:", error);
  }
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

  console.log("🖼 イラストを表示完了");
  addExpandEvent();
}

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

// オーバーレイ要素を作成
function createOverlay() {
  let overlay = document.getElementById("imageOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "imageOverlay";
    overlay.classList.add("overlay");
    overlay.innerHTML = `<img id="overlayImage" src="" alt="拡大画像"><span id="closeOverlay">&times;</span>`;
    
    document.body.appendChild(overlay);
    
    // 閉じる処理
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay || e.target.id === "closeOverlay") {
        overlay.classList.remove("active");
      }
    });
  }
  return overlay;
}

// 拡大ボタンのイベントを追加
function addExpandEvent() {
  const overlay = createOverlay();
  const overlayImage = overlay.querySelector("#overlayImage");

  document.querySelectorAll(".expand-btn").forEach(button => {
    button.addEventListener("click", (event) => {
      const img = event.target.parentElement.querySelector("img");
      if (img) {
        overlayImage.src = img.src;
        overlay.classList.add("active");
      } else {
        console.error("❌ 画像が見つかりません");
      }
    });
  });
}

// ページ読み込み時にデータを取得して表示
loadIllustrations();
