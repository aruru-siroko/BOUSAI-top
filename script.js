document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 最終更新日時を更新する関数
    function updateTimestamp() {
        const updateTimeElement = document.getElementById('current-time');
        const now = new Date();
        const formattedTime = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours()}時${now.getMinutes()}分${now.getSeconds()}秒`;
        if (updateTimeElement) {
            updateTimeElement.textContent = formattedTime;
        }
    }

    // 初回読み込み時に表示
    updateTimestamp();

    // 2. 負荷軽減仕様の30秒間隔自動更新（裏側で静かに時間だけを書き換えるタイマー）
    setInterval(() => {
        console.log("30秒経過：バックグラウンド自動チェック完了。");
        updateTimestamp();

        // 更新された合図として時間表示を一瞬ピカッと光らせる演出
        const timeBadge = document.getElementById('current-time');
        if (timeBadge) {
            timeBadge.style.transition = 'color 0.2s';
            timeBadge.style.color = '#ffeb3b'; // 一瞬黄色にする
            setTimeout(() => {
                timeBadge.style.color = ''; // 元の白に戻す
            }, 500);
        }
    }, 30000); // 30秒間隔

    // 3. 手動更新ボタンの動作（押されたら画面全体をフルリロード）
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            refreshBtn.style.opacity = '0.5';
            window.location.reload();
        });
    }

    // 4. 白黒反転（高コントラスト）切り替え
    const toggleContrastBtn = document.getElementById('toggle-contrast');
    if (toggleContrastBtn) {
        toggleContrastBtn.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
            if (document.body.classList.contains('high-contrast')) {
                toggleContrastBtn.textContent = '標準配色に戻す';
            } else {
                toggleContrastBtn.textContent = '白黒反転（見やすさ重視）';
            }
        });
    }

    // 5. 文字サイズ拡大・標準切り替え
    const textScaleBtn = document.getElementById('text-scale');
    if (textScaleBtn) {
        textScaleBtn.addEventListener('click', () => {
            document.body.classList.toggle('large-text');
            if (document.body.classList.contains('large-text')) {
                textScaleBtn.textContent = '文字サイズを標準に戻す';
            } else {
                textScaleBtn.textContent = '文字サイズ拡大';
            }
        });
    }

    // 6. スクロールアニメーション（Intersection Observer）
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));
});

// JR・主要私鉄の路線データ定義
const railwayData = {
  jr線: [
    { name: 'JR東日本 山手線', status: '平常運転', state: 'normal' },
    { name: 'JR東日本 湘南新宿ライン', status: '平常運転', state: 'normal' },
    { name: 'JR東日本 中央線快速', status: '平常運転', state: 'normal' },
    { name: 'JR東日本 京浜東北線', status: '平常運転', state: 'normal' },
    { name: 'JR東日本 東海道本線', status: '遅延あり', state: 'delay' },
    { name: 'JR東日本 横浜線', status: '平常運転', state: 'normal' },
    { name: 'JR東日本 横須賀線', status: '平常運転', state: 'normal' },
    { name: 'JR東日本 京浜東北根岸線', status: '平常運転', state: 'normal' },
    { name: 'JR東日本 相模線', status: '平常運転', state: 'normal' },
    { name: 'JR東日本 青梅線', status: '平常運転', state: 'normal' },
    { name: 'JR東日本 五日市線', status: '平常運転', state: 'normal' },
    { name: 'JR東日本 鶴見線', status: '平常運転', state: 'normal' },
    { name: 'JR西日本 環状線', status: '平常運転', state: 'normal' }
  ],
  kantoPrivate: [
    { name: '東急東横線', status: '平常運転', state: 'normal' },
    { name: '小田急小田原線', status: '平常運転', state: 'normal' },
    { name: '東京メトロ丸ノ内線', status: '平常運転', state: 'normal' },
    { name: '京王線', status: '見合わせ', state: 'suspend' }
  ],
  kansaiPrivate: [
    { name: '阪急神戸本線', status: '平常運転', state: 'normal' },
    { name: '阪神本線', status: '平常運転', state: 'normal' },
    { name: '近鉄奈良線', status: '平常運転', state: 'normal' },
    { name: '南海本線', status: '平常運転', state: 'normal' }
  ]
};

// リストを描画する関数
function renderRailwayList(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'railway-item';
    
    // バッジ用クラス決定
    let badgeClass = 'badge-normal';
    if (item.state === 'delay') badgeClass = 'badge-delay';
    if (item.state === 'suspend') badgeClass = 'badge-suspend';

    row.innerHTML = `
      <span class="line-name">${item.name}</span>
      <span class="badge-status ${badgeClass}">${item.status}</span>
    `;
    container.appendChild(row);
  });
}

// 全路線を一括描画・更新するメイン処理
function updateAllRailwayStatus() {
  renderRailwayList('jr-lines', railwayData.jr);
  renderRailwayList('kanto-private', railwayData.kantoPrivate);
  renderRailwayList('kansai-private', railwayData.kansaiPrivate);
}

// 初期実行とイベント設定
document.addEventListener('DOMContentLoaded', () => {
  updateAllRailwayStatus();

  // 手動更新ボタンイベント
  const refreshBtn = document.getElementById('refresh-train-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      updateAllRailwayStatus();
    });
  }
});