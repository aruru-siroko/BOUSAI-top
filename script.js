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
