(function() {
    'use strict';

    // =========================================================
    // 1. حقن الـ CSS في أسرع وقت (قبل ما الصفحة ترسم)
    // =========================================================
    const injectCSS = () => {
        if (document.getElementById('wand-clean-css')) return;
        
        const style = document.createElement('style');
        style.id = 'wand-clean-css';
        style.innerHTML = `
            /* إخفاء الخلفية الثقيلة فوراً */
            app-background, 
            .app-background--title, 
            .app-background--view { 
                display: none !important; 
            }
            body, .app-layout, .content-layout, .main-content, .view-background {
                background: #0d0f12 !important;
                background-image: none !important;
            }

            /* إخفاء الأجزاء السفلية في صفحة اللعبة فوراً (قبل ما تتحمل) */
            video-controls-list, 
            .game-info, 
            .trainer-meta, 
            .w_full.mt_8.mb_24 { 
                display: none !important; 
            }

            /* تحسينات الأداء */
            .category { content-visibility: auto; contain-intrinsic-size: 0 280px; }
            .cheat { contain: layout style paint; }

            /* إلغاء المؤثرات الثقيلة */
            *, *::before, *::after {
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
                filter: none !important;
                box-shadow: none !important;
                text-shadow: none !important;
                animation: none !important;
                transition: none !important;
            }
        `;
        // نحقن الـ CSS في الـ head أو في الـ documentElement لو الـ head لسه مبنى
        if (document.head) {
            document.head.appendChild(style);
        } else {
            document.documentElement.appendChild(style);
        }
    };

    // نحقن الـ CSS فوراً
    injectCSS();

    // =========================================================
    // 2. دالة مسح أقسام الصفحة الرئيسية (تحت Most Popular)
    // =========================================================
    const hideMainPageSections = () => {
        // بندور على أي عنصر فيه كلمة Most Popular
        const elements = document.querySelectorAll('h2, h3, h4, span, div');
        for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            
            if (el.textContent && el.textContent.trim() === 'Most Popular') {
                // نطلع للحاوية الكبيرة
                let row = el.closest('section') || el.closest('div[class*="row"]') || el.parentElement.parentElement;
                
                if (row && row.nextElementSibling) {
                    let next = row.nextElementSibling;
                    // نمسح كل حاجة تحتها
                    while (next) {
                        if (next.style.display !== 'none') {
                            next.style.display = 'none'; 
                        }
                        next = next.nextElementSibling;
                    }
                }
            }
        }
    };

    // =========================================================
    // 3. مراقب التغييرات (بيشتغل في أجزاء من الثانية)
    // =========================================================
    const observer = new MutationObserver((mutations) => {
        // بنشغل دالة المسح فوراً مع أي تغيير في الصفحة
        // requestAnimationFrame بيضمن إنها تشتغل قبل ما المتصفح يرسم الفريم الجديد
        window.requestAnimationFrame(hideMainPageSections);
    });

    // نبدأ المراقبة أول ما الـ body يكون موجود
    const startObserving = () => {
        if (document.body) {
            observer.observe(document.body, { 
                childList: true, 
                subtree: true 
            });
            hideMainPageSections(); // تشغيل مبدئي
        } else {
            setTimeout(startObserving, 10);
        }
    };
    startObserving();

    // احتياطي: نشغل الدالة كام مرة في أول ثانيتين عشان نضمن المسح
    setTimeout(hideMainPageSections, 100);
    setTimeout(hideMainPageSections, 500);
    setTimeout(hideMainPageSections, 1000);

})();