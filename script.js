/**
 * KSUI Main JavaScript (script.js)
 * data.json에서 데이터를 fetch하여 페이지의 요소를 동적으로 업데이트하고,
 * 각 섹션의 모션 및 인터랙션을 제어합니다.
 * 
 * [로컬 파일 실행 지원 설계]
 * 로컬 파일 환경(file://)에서는 브라우저 보안 정책(CORS)으로 인해 fetch가 실패할 수 있습니다.
 * 이 경우, HTML 내에 작성된 기본 정적 콘텐츠를 그대로 노출하여 화면이 정상적으로 표시되도록 보장하며,
 * UI 모션 및 인터랙션 엔진은 동일하게 활성화됩니다.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 현재 실행 중인 페이지가 Menu_1.html인지 판별하여 로드할 JSON 파일 선택
    const path = window.location.pathname;
    const isMenu1 = path.includes('Menu_1.html');
    const jsonFile = isMenu1 ? 'about.json' : 'data.json';

    fetch(jsonFile)
        .then(response => {
            if (!response.ok) {
                throw new Error('네트워크 응답에 문제가 있습니다.');
            }
            return response.json();
        })
        .then(data => {
            console.log(`${jsonFile} 로드 성공. 동적 데이터 바인딩을 적용합니다.`);
            if (isMenu1) {
                renderAboutPage(data);
            } else {
                renderPage(data);
            }
        })
        .catch(error => {
            console.warn(`${jsonFile} fetch 실패 (CORS 또는 네트워크 에러). 기본 정적 HTML 콘텐츠를 사용합니다.`, error);
        })
        .finally(() => {
            // 데이터 로드 성공/실패 여부와 관계없이 UI 인터랙션 엔진은 반드시 가동
            initUIEngine(isMenu1);
        });
});

/* ==========================================================================
   1. 동적 DOM 렌더링 모듈 (JSON 데이터를 기반으로 DOM 덮어쓰기)
   ========================================================================== */

function renderPage(data) {
    if (data.intro) renderIntro(data.intro);
    if (data.nav) renderNav(data.nav);
    if (data.hero) renderHero(data.hero);
    if (data.proudSection) renderProud(data.proudSection);
    if (data.aboutSection) renderAbout(data.aboutSection);
    if (data.businessSection) renderBusiness(data.businessSection);
    if (data.partnersSection) renderPartners(data.partnersSection);
    if (data.visionSection) renderVision(data.visionSection);
    if (data.footer) renderFooter(data.footer);
    if (data.contactModal) renderModal(data.contactModal);
}

// 인트로 curtain 영역 렌더링
function renderIntro(introData) {
    const logoImg = document.querySelector('#intro-logo img');
    if (logoImg) {
        logoImg.src = introData.logoSrc;
        logoImg.alt = introData.logoAlt;
    }
    const introText = document.getElementById('intro-text');
    if (introText) introText.textContent = introData.text;
    const introSub = document.getElementById('intro-sub');
    if (introSub) introSub.textContent = introData.subText;
}

// 네비게이션바 영역 렌더링
function renderNav(navData) {
    const navLogo = document.getElementById('nav-logo-box');
    if (navLogo) {
        navLogo.src = navData.logoSrc;
        navLogo.alt = navData.logoAlt;
    }
    const navBrand = document.getElementById('nav-brand');
    if (navBrand) navBrand.textContent = navData.brand;

    // PC 메뉴 렌더링
    const pcMenuContainer = document.querySelector('nav .hidden.md\\:flex');
    if (pcMenuContainer) {
        const links = pcMenuContainer.querySelectorAll('a');
        links.forEach(l => l.remove());

        const menuHtml = navData.menu.map(item => `
            <a href="${item.href}" class="text-white/90 hover:text-white text-sm font-medium transition-colors drop-shadow-sm">${item.text}</a>
        `).join('');
        pcMenuContainer.insertAdjacentHTML('afterbegin', menuHtml);
    }

    // 모바일 드로어 메뉴 렌더링
    const mobileDrawerContent = document.getElementById('mobile-drawer-content');
    if (mobileDrawerContent) {
        const links = mobileDrawerContent.querySelectorAll('.mobile-link');
        links.forEach(l => l.remove());

        const mobileMenuHtml = navData.menu.map(item => `
            <a href="${item.href}" onclick="toggleMobileMenu()" class="mobile-link text-white/80 hover:text-white text-base font-medium transition-colors py-1">${item.text}</a>
        `).join('');
        mobileDrawerContent.insertAdjacentHTML('afterbegin', mobileMenuHtml);
    }
}

// 히어로 영역 렌더링
function renderHero(heroData) {
    const heroSec = document.querySelector('section.relative.h-screen');
    if (heroSec) {
        const bgImg = heroSec.querySelector('.absolute.inset-0.z-0 img');
        if (bgImg) bgImg.src = heroData.bgImg;

        const badge = heroSec.querySelector('.hero-item span');
        if (badge) badge.textContent = heroData.badge;

        const title = heroSec.querySelector('h1.hero-item');
        if (title) title.innerHTML = heroData.title;

        const subtitle = heroSec.querySelector('p.hero-item');
        if (subtitle) subtitle.innerHTML = heroData.subtitle;

        const scrollText = heroSec.querySelector('.absolute.bottom-12 span');
        if (scrollText) scrollText.textContent = heroData.scrollText;
    }
}

// 자랑스러운 이야기 Swiper 렌더링
function renderProud(proudData) {
    const proudSec = document.getElementById('proud-section');
    if (proudSec) {
        const proudTxt = proudSec.querySelector('.proud-txt');
        if (proudTxt) proudTxt.innerHTML = proudData.title;

        const wrapper = proudSec.querySelector('.swiper-wrapper');
        if (wrapper) {
            // Swiper loop가 안전하게 돌도록 2배 복제하여 렌더링
            const doubleSlides = [...proudData.slides, ...proudData.slides];
            const slidesHtml = doubleSlides.map(slide => `
                <div class="swiper-slide">
                    <div class="proud-logo-box">
                        <img src="${slide.logo}" alt="${slide.logoAlt}">
                    </div>
                    <div class="proud-con-box">
                        <p class="proud-title color-highlight">
                            ${slide.title}<br><span>${slide.highlight}</span>
                        </p>
                    </div>
                </div>
            `).join('');
            wrapper.innerHTML = slidesHtml;
        }
    }
}

// 소개 영역 렌더링
function renderAbout(aboutData) {
    const aboutSec = document.getElementById('about');
    if (aboutSec) {
        const badge = aboutSec.querySelector('span.text-teal');
        if (badge) badge.textContent = aboutData.badge;
        const title = aboutSec.querySelector('h2');
        if (title) title.innerHTML = aboutData.title;

        const paragraphsContainer = aboutSec.querySelector('.space-y-6');
        if (paragraphsContainer) {
            paragraphsContainer.innerHTML = aboutData.paragraphs.map(p => `<p>${p}</p>`).join('');
        }

        const statsContainer = aboutSec.querySelector('.mt-12.grid');
        if (statsContainer) {
            statsContainer.innerHTML = aboutData.stats.map(stat => {
                const val = stat.value;
                const match = val.match(/([0-9]+)(.*)/);
                const number = match ? match[1] : val;
                const suffix = match ? match[2] : '';
                return `
                    <div class="border-l-2 border-slate-200 pl-4">
                        <p class="text-3xl font-bold text-navy mb-1">${number}<span class="text-teal text-xl">${suffix}</span></p>
                        <p class="text-sm text-slate-500 font-medium">${stat.label}</p>
                    </div>
                `;
            }).join('');
        }

        const desktopImgWrapper = aboutSec.querySelector('.relative.h-\\[500px\\]');
        if (desktopImgWrapper) {
            const imgs = desktopImgWrapper.querySelectorAll('img');
            aboutData.images.forEach((imgData, idx) => {
                if (imgs[idx]) {
                    imgs[idx].src = imgData.src;
                    imgs[idx].alt = imgData.alt;
                }
            });
        }

        const mobileImgWrapper = aboutSec.querySelector('.block.md\\:hidden.grid');
        if (mobileImgWrapper) {
            mobileImgWrapper.innerHTML = aboutData.images.map(imgData => `
                <div class="aspect-[4/5] rounded-md overflow-hidden shadow-sm">
                    <img src="${imgData.src}" class="w-full h-full object-cover" alt="${imgData.alt}">
                </div>
            `).join('');
        }
    }
}

// 핵심 목표 영역 렌더링
function renderBusiness(businessData) {
    const businessSec = document.getElementById('business');
    if (businessSec) {
        const badge = businessSec.querySelector('span.text-teal');
        if (badge) badge.textContent = businessData.badge;
        const title = businessSec.querySelector('h2');
        if (title) title.textContent = businessData.title;

        const tabList = businessSec.querySelector('[role="tablist"]');
        if (tabList) {
            tabList.innerHTML = businessData.tabs.map((tab, idx) => {
                const isActive = idx === 0;
                return `
                    <button class="tab-btn ${isActive ? 'active border-navy text-navy font-semibold' : 'border-transparent text-slate-500 hover:text-navy'} px-8 py-4 text-sm md:text-base font-medium whitespace-nowrap border-b-2 transition-colors" data-target="${tab.id}">
                        ${tab.tabTitle}
                    </button>
                `;
            }).join('');
        }

        const tabContentContainer = businessSec.querySelector('.relative.min-h-\\[400px\\]');
        if (tabContentContainer) {
            tabContentContainer.innerHTML = businessData.tabs.map((tab, idx) => {
                const isHidden = idx !== 0;
                const tagSpan = tab.tags.map((tag, tagIdx) => {
                    const isSpecial = tagIdx === 3;
                    const tagClass = isSpecial ? 'bg-teal/10 border-teal/20 text-teal-700' : 'bg-slate-50 border-slate-200 text-slate-600';
                    return `<span class="px-3 py-1.5 border text-xs font-medium rounded-md ${tagClass}">${tag}</span>`;
                }).join('');

                return `
                    <div id="${tab.id}" class="tab-content ${isHidden ? 'hidden' : 'grid animate-slide-up'} grid-cols-1 md:grid-cols-2 gap-12 items-start" vid="${tab.id}">
                        <div class="rounded-lg overflow-hidden bg-slate-100 aspect-video shadow-md border border-slate-100">
                            <img src="${tab.img}" class="w-full h-full object-cover" alt="${tab.imgAlt}">
                        </div>
                        <div class="flex flex-col justify-center h-full">
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold mb-4 w-fit ${tab.badgeClass}">
                                <i data-lucide="${tab.badgeIcon}" class="w-3.5 h-3.5"></i> ${tab.badge}
                            </div>
                            <h3 class="text-2xl font-bold text-navy mb-4">${tab.title}</h3>
                            <p class="text-slate-600 mb-8 leading-relaxed break-keep">${tab.desc}</p>
                            <div class="flex flex-wrap gap-2">
                                ${tagSpan}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}

// 전문 연구진 렌더링
function renderPartners(partnersData) {
    const partnersSec = document.getElementById('partners');
    if (partnersSec) {
        const badge = partnersSec.querySelector('span.text-teal');
        if (badge) badge.textContent = partnersData.badge;
        const title = partnersSec.querySelector('h2');
        if (title) title.textContent = partnersData.title;

        const carousel = document.getElementById('partner-carousel');
        if (carousel) {
            const cardsHtml = partnersData.partners.map(partner => {
                const historyList = partner.history.map(h => `
                    <li class="flex items-start gap-2">
                        <i data-lucide="${h.icon}" class="w-4 h-4 text-slate-400 mt-0.5 shrink-0"></i>
                        <span class="line-clamp-2">${h.text}</span>
                    </li>
                `).join('');

                return `
                    <article class="min-w-[280px] md:min-w-[320px] snap-center bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[440px] group transition-shadow hover:shadow-md">
                        <div class="h-[50%] relative overflow-hidden bg-slate-100">
                            <img src="${partner.img}" alt="${partner.name} Profile" class="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500">
                            <div class="absolute inset-0 bg-navy/10 group-hover:bg-transparent transition-colors"></div>
                        </div>
                        <div class="h-[50%] p-6 flex flex-col">
                            <span class="text-xs font-bold text-teal tracking-wider mb-2">${partner.role}</span>
                            <h3 class="text-xl font-bold text-navy mb-4">${partner.name}</h3>
                            <ul class="space-y-2 text-sm text-slate-600 flex-grow">
                                ${historyList}
                            </ul>
                        </div>
                    </article>
                `;
            }).join('');

            const invite = partnersData.partnerInvite;
            const inviteHtml = `
                <article class="min-w-[280px] md:min-w-[320px] snap-center bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[440px] group transition-shadow hover:shadow-md cursor-pointer" onclick="location.href='Menu_3.html'">
                    <div class="h-[50%] relative overflow-hidden bg-slate-100 flex items-center justify-center">
                        <i data-lucide="users" class="w-16 h-16 text-slate-300"></i>
                    </div>
                    <div class="h-[50%] p-6 flex flex-col items-center justify-center text-center">
                        <h3 class="text-lg font-bold text-navy mb-2">${invite.title}</h3>
                        <p class="text-sm text-slate-500 mb-6">${invite.desc}</p>
                        <button class="text-teal font-medium text-sm flex items-center gap-1 hover:text-navy transition-colors">
                            ${invite.linkText} <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </button>
                    </div>
                </article>
            `;

            carousel.innerHTML = cardsHtml + inviteHtml;
        }
    }
}

// 핵심 목표 영역 렌더링
function renderVision(visionData) {
    const visionSec = document.querySelector('section:has(#partner-carousel) + section');
    if (visionSec) {
        const badge = visionSec.querySelector('span.text-teal');
        if (badge) badge.textContent = visionData.badge;
        const title = visionSec.querySelector('h2');
        if (title) title.innerHTML = visionData.title;
        const subtitle = visionSec.querySelector('p');
        if (subtitle) subtitle.textContent = visionData.subtitle;

        const grid = visionSec.querySelector('.grid');
        if (grid) {
            const cardsHtml = visionData.cards.map(card => {
                const colSpanClass = card.span ? card.span : 'md:col-span-2';
                return `
                    <div class="${colSpanClass} bg-slatebg p-8 rounded-lg border-t-4 ${card.borderColor} hover:shadow-md card-reveal ${card.delay}">
                        <div class="flex justify-between items-start mb-4">
                            <div class="text-3xl font-bold text-slate-200 font-mono tracking-tighter">${card.num}</div>
                            <i data-lucide="${card.icon}" class="${card.borderColor === 'border-teal' ? 'text-teal' : 'text-navy'} w-6 h-6 opacity-50"></i>
                        </div>
                        <h3 class="text-xl font-bold text-navy mb-3 break-keep">${card.title}</h3>
                        <p class="text-slate-600 text-sm leading-relaxed">${card.desc}</p>
                    </div>
                `;
            }).join('');
            grid.innerHTML = cardsHtml;
        }
    }
}

// 푸터 영역 렌더링
function renderFooter(footerData) {
    const footer = document.querySelector('footer');
    if (footer) {
        const logo = footer.querySelector('img');
        if (logo) {
            logo.src = footerData.logoSrc;
            logo.alt = footerData.logoAlt;
        }
        const brand = footer.querySelector('.text-white.font-bold');
        if (brand) brand.textContent = footerData.brandName;

        const desc = footer.querySelector('.text-slate-400.text-sm');
        if (desc) desc.textContent = footerData.desc;

        const infoList = footer.querySelector('ul');
        if (infoList) {
            infoList.innerHTML = `
                <li class="flex gap-4"><span class="w-24 text-slate-500 font-medium shrink-0">대표자</span> <span>${footerData.info.representative}</span></li>
                <li class="flex gap-4"><span class="w-24 text-slate-500 font-medium shrink-0">사업자등록번호</span> <span class="font-mono">${footerData.info.businessNum}</span></li>
                <li class="flex gap-4"><span class="w-24 text-slate-500 font-medium shrink-0">민간자격등록</span> <span class="font-mono">${footerData.info.licenseNum}</span></li>
                <li class="flex gap-4"><span class="w-24 text-slate-500 font-medium shrink-0">소재지</span> <span class="break-keep">${footerData.info.address}</span></li>
                <li class="flex gap-4"><span class="w-24 text-slate-500 font-medium shrink-0">고객센터</span> <span class="text-white font-medium">${footerData.info.phone}</span> <span class="text-xs">(${footerData.info.workHours})</span></li>
            `;
        }

        const copyright = footer.querySelector('.border-t p');
        if (copyright) copyright.textContent = footerData.copyright;

        const links = footer.querySelectorAll('.border-t .flex a');
        if (links[0]) links[0].href = footerData.termsLink;
        if (links[1]) links[1].href = footerData.privacyLink;
    }
}

// 모달 영역 렌더링
function renderModal(modalData) {
    const modal = document.getElementById('modal-contact');
    if (modal) {
        const title = modal.querySelector('h3');
        if (title) title.textContent = modalData.title;

        const desc = modal.querySelector('p');
        if (desc) desc.textContent = modalData.desc;
    }
}


/* ==========================================================================
   2. UI 인터랙션 엔진 (GSAP, Swiper, Mobile Drawer, Modals)
   ========================================================================== */

let proudSwiper = null;

function initUIEngine(isMenu1 = false) {
    initLucide();
    initIntroAnimation(isMenu1);
    initNavbarSkinAndToggle();
    if (isMenu1) {
        initAboutAnimations();
        initAboutIntersectionObserver();
    } else {
        initProudSwiper();
        initIntersectionObserver();
        initTabSwitching();
    }
    initModalEvents();
}

function initLucide() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function initIntroAnimation(isMenu1 = false) {
    if (isMenu1) {
        // Menu_1.html 전용 Hero 애니메이션 바로 구동
        const heroImg = document.getElementById('hero-bg');
        const heroText = document.getElementById('hero-text');

        if (heroImg && heroText) {
            setTimeout(() => {
                heroImg.classList.remove('scale-110', 'opacity-0');
                heroImg.classList.add('scale-100', 'opacity-100');
            }, 100);

            setTimeout(() => {
                heroText.classList.remove('translate-y-12', 'opacity-0');
                heroText.classList.add('translate-y-0', 'opacity-100');
            }, 500);
        }
        return;
    }

    const curtain = document.getElementById('intro-curtain');
    const logo = document.getElementById('intro-logo');
    const line = document.getElementById('intro-line');
    const text = document.getElementById('intro-text');
    const sub = document.getElementById('intro-sub');

    if (curtain && logo && line && text && sub) {
        setTimeout(() => { logo.classList.remove('opacity-0'); }, 100);

        setTimeout(() => {
            line.style.transition = 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            line.style.width = '80px';
        }, 600);

        setTimeout(() => { text.classList.remove('opacity-0'); }, 900);
        setTimeout(() => { sub.classList.remove('opacity-0'); }, 1200);

        setTimeout(() => {
            curtain.classList.add('slide-up');

            setTimeout(() => {
                document.querySelectorAll('.hero-item').forEach(el => {
                    el.classList.remove('opacity-0', 'translate-y-8');
                });
            }, 500);
        }, 2500);

        setTimeout(() => {
            curtain.style.display = 'none';
        }, 3700);
    }
}

const navbar = document.getElementById('navbar');
const navBrand = document.getElementById('nav-brand');
const navLogoBox = document.getElementById('nav-logo-box');
const mobileBtn = document.getElementById('mobile-menu-btn');
const drawer = document.getElementById('mobile-drawer');
const drawerContent = document.getElementById('mobile-drawer-content');

function refreshNavSkin() {
    if (!drawer) return;
    const isMenuOpen = drawer.style.height !== '0px' && drawer.style.height !== '';
    const links = document.querySelectorAll('.mobile-link');

    if (window.scrollY > 50) {
        if (isMenuOpen) {
            navbar.className = "fixed w-full z-40 top-0 transition-all duration-300 bg-white shadow-sm";
            drawer.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            drawerContent.style.borderColor = '#f1f5f9';
            links.forEach(link => {
                link.className = "mobile-link text-slate-600 hover:text-navy text-base font-medium transition-colors py-1";
            });
            if (mobileBtn) mobileBtn.style.color = '#0f172a';
        } else {
            navbar.className = "fixed w-full z-40 top-0 transition-all duration-300 bg-white shadow-sm";
            if (mobileBtn) mobileBtn.style.color = '#475569';
        }

        if (navBrand) navBrand.className = "text-navy font-semibold tracking-tight text-lg transition-colors";
        document.querySelectorAll('nav a:not(.bg-teal)').forEach(el => {
            el.className = "text-slate-600 hover:text-navy text-sm font-medium transition-colors";
        });
        if (navLogoBox) navLogoBox.src = 'images/logo.png';

    } else {
        if (isMenuOpen) {
            navbar.className = "fixed w-full z-40 top-0 transition-all duration-300 bg-navy/80 backdrop-blur-md shadow-xl";
            drawer.style.backgroundColor = 'transparent';
            drawerContent.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            links.forEach(link => {
                link.className = "mobile-link text-white/80 hover:text-white text-base font-medium transition-colors py-1";
            });
            if (mobileBtn) mobileBtn.style.color = '#ffffff';
            if (navBrand) navBrand.className = "text-white font-semibold tracking-tight text-lg drop-shadow-md transition-colors";
            if (navLogoBox) navLogoBox.src = 'images/logo_w.png';
        } else {
            navbar.className = "fixed w-full z-40 top-0 transition-all duration-300 bg-transparent";
            if (mobileBtn) mobileBtn.style.color = '#ffffff';
            if (navBrand) navBrand.className = "text-white font-semibold tracking-tight text-lg drop-shadow-md transition-colors";
            if (navLogoBox) navLogoBox.src = 'images/logo_w.png';
        }

        document.querySelectorAll('nav a:not(.bg-teal)').forEach(el => {
            el.className = "text-white/90 hover:text-white text-sm font-medium transition-colors drop-shadow-sm";
        });
    }
}

window.toggleMobileMenu = function() {
    if (!drawer) return;
    const isMenuOpen = drawer.style.height !== '0px' && drawer.style.height !== '';

    if (isMenuOpen) {
        drawer.style.height = '0px';
        drawer.style.opacity = '0';
        if (mobileBtn) mobileBtn.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';

        setTimeout(() => {
            refreshNavSkin();
        }, 10);
    } else {
        drawer.style.height = 'auto';
        const autoHeight = drawer.scrollHeight + 'px';
        drawer.style.height = '0px';

        drawer.style.height = autoHeight;
        drawer.style.opacity = '1';
        if (mobileBtn) mobileBtn.innerHTML = '<i data-lucide="x" class="w-6 h-6"></i>';

        refreshNavSkin();
    }
    initLucide();
}

function initNavbarSkinAndToggle() {
    refreshNavSkin();
    window.addEventListener('scroll', refreshNavSkin);

    if (mobileBtn) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.toggleMobileMenu();
        });
    }
}

function initProudSwiper() {
    const swiperContainer = document.querySelector('.main-proud-swiper');
    if (swiperContainer && typeof Swiper !== 'undefined') {
        proudSwiper = new Swiper('.main-proud-swiper', {
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            slidesPerView: 'auto',
            spaceBetween: 0,
            centeredSlides: true,
            navigation: {
                nextEl: '.main-proud-next',
                prevEl: '.main-proud-prev',
            },
            pagination: {
                el: '.proud-pagination.bar',
                type: 'progressbar',
            },
            breakpoints: {
                768: { spaceBetween: 0, centeredSlides: true },
                1024: { spaceBetween: 0, centeredSlides: true }
            }
        });

        const playBtn = document.querySelector('.proud-autoplay .start');
        const pauseBtn = document.querySelector('.proud-autoplay .pause');

        if (playBtn && pauseBtn) {
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'flex';

            playBtn.addEventListener('click', () => {
                proudSwiper.autoplay.start();
                playBtn.style.display = 'none';
                pauseBtn.style.display = 'flex';
            });

            pauseBtn.addEventListener('click', () => {
                proudSwiper.autoplay.stop();
                pauseBtn.style.display = 'none';
                playBtn.style.display = 'flex';
            });
        }
    }

    const proudSection = document.getElementById('proud-section');
    if (proudSection && window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.config({ ignoreMobileResize: true });

        gsap.fromTo('#proud-section',
            { opacity: 0, y: 60 },
            {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '#proud-section',
                    start: 'top 82%',
                    toggleActions: 'play none none none'
                }
            }
        );
    } else if (proudSection) {
        proudSection.style.opacity = '1';
        proudSection.style.transform = 'none';
    }
}

function initIntersectionObserver() {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .card-reveal').forEach(el => {
        observer.observe(el);
    });
}

function initTabSwitching() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => {
                b.classList.remove('border-navy', 'text-navy', 'active', 'font-semibold');
                b.classList.add('border-transparent', 'text-slate-500');
            });
            document.querySelectorAll('.tab-content').forEach(c => {
                c.classList.add('hidden');
                c.classList.remove('animate-slide-up');
            });

            btn.classList.add('border-navy', 'text-navy', 'active', 'font-semibold');
            btn.classList.remove('border-transparent', 'text-slate-500');

            const targetId = btn.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.remove('hidden');
                void targetContent.offsetWidth;
                targetContent.classList.add('animate-slide-up');
            }
        });
    });
}

window.scrollCarousel = function(direction) {
    const carousel = document.getElementById('partner-carousel');
    if (carousel) {
        const scrollAmount = carousel.offsetWidth * 0.8;
        carousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
}

function initModalEvents() {
    document.addEventListener('click', (e) => {
        if (drawer && drawer.style.height !== '0px' && drawer.style.height !== '') {
            if (!e.target.closest('nav')) {
                window.toggleMobileMenu();
            }
        }

        const trigger = e.target.closest('.modal-trigger');
        if (trigger) {
            e.preventDefault();
            const targetId = trigger.getAttribute('data-target');
            const modal = document.getElementById(targetId);
            if (modal) {
                modal.classList.add('show');
                modal.style.opacity = '1';
                modal.style.visibility = 'visible';
                document.body.style.overflow = 'hidden';
            }
            return;
        }

        const closeBtn = e.target.closest('.modal-close, .modal-close-action');
        if (closeBtn) {
            e.preventDefault();
            const modal = closeBtn.closest('.modal-overlay');
            if (modal) {
                modal.classList.remove('show');
                modal.style.opacity = '0';
                modal.style.visibility = 'hidden';
                document.body.style.overflow = '';
            }
            return;
        }

        const overlay = e.target;
        if (overlay && overlay.classList.contains('modal-overlay')) {
            overlay.classList.remove('show');
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            document.body.style.overflow = '';
        }
    });
}

/* ==========================================================================
   3. Menu_1.html (기관소개) 동적 렌더링 및 특화 모션 모듈
   ========================================================================== */

function renderAboutPage(data) {
    if (data.nav) renderNav(data.nav);
    if (data.hero) renderAboutHero(data.hero);
    if (data.brandSection) renderAboutBrand(data.brandSection);
    if (data.introSection) renderAboutIntro(data.introSection);
    if (data.strengthsSection) renderAboutStrengths(data.strengthsSection);
    if (data.wayToComeSection) renderAboutWayToCome(data.wayToComeSection);
    if (data.footer) renderFooter(data.footer);
    if (data.contactModal) renderModal(data.contactModal);
}

function renderAboutHero(heroData) {
    const heroBg = document.getElementById('hero-bg');
    if (heroBg) {
        heroBg.src = heroData.bgImg;
        heroBg.alt = heroData.bgAlt;
    }
    const heroText = document.getElementById('hero-text');
    if (heroText) {
        heroText.innerHTML = `${heroData.title} <br> <span class="text-teal-400">${heroData.subtitle}</span>`;
    }
}

function renderAboutBrand(brandData) {
    const logoImg = document.querySelector('#brand-content img');
    if (logoImg) {
        logoImg.src = brandData.logoSrc;
        logoImg.alt = brandData.logoAlt;
    }
    const title = document.getElementById('brand-title');
    if (title) title.textContent = brandData.title;
    const sub = document.getElementById('brand-sub');
    if (sub) sub.textContent = brandData.sub;
    const desc = document.getElementById('brand-desc');
    if (desc) desc.innerHTML = brandData.desc;
}

function renderAboutIntro(introData) {
    const section = document.querySelector('section:has(#metrics-container)');
    if (section) {
        const title = section.querySelector('h2');
        if (title) title.innerHTML = introData.title;
        const desc = section.querySelector('p');
        if (desc) desc.textContent = introData.desc;
    }
    const metricsContainer = document.getElementById('metrics-container');
    if (metricsContainer && introData.metrics) {
        metricsContainer.innerHTML = introData.metrics.map(metric => `
            <div class="p-8 bg-slatebg rounded-2xl border border-slate-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                <div class="w-14 h-14 bg-teal/10 rounded-xl flex items-center justify-center mb-6 text-teal-600">
                    <i data-lucide="${metric.icon}" class="w-7 h-7"></i>
                </div>
                <p class="text-slate-500 font-medium text-sm tracking-widest mb-2">${metric.label}</p>
                <div class="text-5xl font-bold text-navy mb-4 font-mono tracking-tighter flex items-center justify-center">
                    <span class="counter-val" data-target="${metric.target}">0</span><span class="text-teal-500 ml-1">${metric.suffix}</span>
                </div>
                <p class="text-sm text-slate-400 font-light break-keep">${metric.desc}</p>
            </div>
        `).join('');
    }
}

function renderAboutStrengths(strengthsData) {
    const section = document.querySelector('section:has(.matrix-el)');
    if (section) {
        const badge = section.querySelector('span.text-teal');
        if (badge) badge.textContent = strengthsData.badge;
        const title = section.querySelector('h2');
        if (title) title.textContent = strengthsData.title;
        
        const container = section.querySelector('.space-y-24, .space-y-32');
        if (container && strengthsData.items) {
            container.innerHTML = strengthsData.items.map(item => {
                const isLeft = item.align === 'left';
                const orderClassImg = isLeft ? 'order-last lg:order-none' : '';
                const orderClassText = isLeft ? '' : 'order-first lg:order-none';
                const translateClassImg = isLeft ? '-translate-x-[50px]' : 'translate-x-[50px]';
                const translateClassText = isLeft ? 'translate-x-[50px]' : '-translate-x-[50px]';
                const bgClass = isLeft ? 'bg-navy/10' : 'bg-teal/10';

                const imgCol = `
                    <div class="matrix-el matrix-${isLeft ? 'left' : 'right'} opacity-0 ${translateClassImg} transition-all duration-1000 ease-out ${orderClassImg}">
                        <div class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-slate-200">
                            <img src="${item.img}" alt="${item.imgAlt}" class="w-full h-full object-cover">
                            <div class="absolute inset-0 ${bgClass} mix-blend-multiply"></div>
                        </div>
                    </div>
                `;
                const textCol = `
                    <div class="matrix-el matrix-${isLeft ? 'right' : 'left'} opacity-0 ${translateClassText} transition-all duration-1000 ease-out flex flex-col justify-center ${orderClassText}">
                        <div class="text-teal font-mono text-xl md:text-2xl font-bold mb-4 opacity-70">${item.num}</div>
                        <h3 class="text-2xl md:text-3xl font-bold text-navy mb-6 break-keep tracking-tight">${item.title}</h3>
                        <p class="text-slate-600 text-lg leading-relaxed font-light break-keep">${item.desc}</p>
                    </div>
                `;

                return `
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        ${isLeft ? imgCol + textCol : textCol + imgCol}
                    </div>
                `;
            }).join('');
        }
    }
}

function renderAboutWayToCome(wayToComeData) {
    const section = document.querySelector('section:has(iframe)');
    if (section) {
        const badge = section.querySelector('span.text-teal');
        if (badge) badge.textContent = wayToComeData.badge;
        const title = section.querySelector('h2');
        if (title) title.textContent = wayToComeData.title;

        const iframe = section.querySelector('iframe');
        if (iframe) iframe.src = wayToComeData.iframeSrc;

        const infoContainer = section.querySelector('.flex.flex-col.justify-center.space-y-10');
        if (infoContainer && wayToComeData.info) {
            const info = wayToComeData.info;
            
            const hoursList = info.hours.items.map((item, idx) => {
                if (idx === 0) {
                    return `<li>평일 <span class="font-medium text-slate-800">${item.replace('평일', '').trim()}</span></li>`;
                } else if (item.includes('휴무')) {
                    return `<li class="text-rose-500 font-medium pt-1">${item}</li>`;
                } else {
                    return `<li class="text-sm text-slate-500">${item}</li>`;
                }
            }).join('');

            infoContainer.innerHTML = `
                <div>
                    <div class="flex items-center gap-3 mb-3 text-navy font-bold text-lg">
                        <i data-lucide="${info.address.icon}" class="w-5 h-5 text-teal"></i>
                        <h4>${info.address.title}</h4>
                    </div>
                    <p class="text-slate-600 font-light leading-relaxed break-keep ml-8">
                        ${info.address.text}
                    </p>
                </div>

                <div>
                    <div class="flex items-center gap-3 mb-3 text-navy font-bold text-lg">
                        <i data-lucide="${info.hours.icon}" class="w-5 h-5 text-teal"></i>
                        <h4>${info.hours.title}</h4>
                    </div>
                    <ul class="text-slate-600 font-light space-y-2 ml-8">
                        ${hoursList}
                    </ul>
                </div>

                <div>
                    <div class="flex items-center gap-3 mb-3 text-navy font-bold text-lg">
                        <i data-lucide="${info.contact.icon}" class="w-5 h-5 text-teal"></i>
                        <h4>${info.contact.title}</h4>
                    </div>
                    <ul class="text-slate-600 font-light space-y-2 ml-8">
                        <li class="flex items-center gap-2">
                            <span class="text-slate-400 w-12 text-sm font-medium">Tel</span>
                            <span class="font-mono font-medium text-slate-800">${info.contact.tel}</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <span class="text-slate-400 w-12 text-sm font-medium">Email</span>
                            <a href="mailto:${info.contact.email}" class="text-teal-600 hover:underline">${info.contact.email}</a>
                        </li>
                    </ul>
                </div>
            `;
        }
    }
}

const animateCountUp = (el) => {
    if (el.dataset.counted) return;
    el.dataset.counted = true;

    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000;
    const start = performance.now();

    const updateCounter = (time) => {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);

        const ease = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(target * ease);

        el.innerText = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            el.innerText = target.toLocaleString();
        }
    };
    requestAnimationFrame(updateCounter);
};

function initAboutAnimations() {
    const brandSection = document.getElementById('brand-canvas-section');
    const brandBox = document.getElementById('brand-box');
    const brandContent = document.getElementById('brand-content');

    const brandTitle = document.getElementById('brand-title');
    const brandSub = document.getElementById('brand-sub');
    const brandDesc = document.getElementById('brand-desc');

    if (brandSection && brandBox && brandContent && brandTitle && brandSub && brandDesc) {
        window.addEventListener('scroll', () => {
            const rect = brandSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            const scrolledPastTop = -rect.top;
            const scrollableDistance = rect.height - windowHeight;

            let progress = scrollableDistance > 0 ? scrolledPastTop / scrollableDistance : 0;
            progress = Math.max(0, Math.min(1, progress));

            const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
            const easedProgress = easeOutCubic(progress);

            const isMobile = window.innerWidth < 768;
            const baseSize = isMobile ? 320 : 420;
            const edgeMargin = isMobile ? 16 : 32;

            const maxTargetWidth = window.innerWidth - (edgeMargin * 2);
            const maxTargetHeight = window.innerHeight - (edgeMargin * 2);

            const currentWidth = baseSize + (maxTargetWidth - baseSize) * easedProgress;
            const currentHeight = baseSize + (maxTargetHeight - baseSize) * easedProgress;

            const minRadius = isMobile ? 12 : 20;
            const currentRadius = minRadius + (24 - minRadius) * (1 - easedProgress);

            brandBox.style.width = `${currentWidth}px`;
            brandBox.style.height = `${currentHeight}px`;
            brandBox.style.borderRadius = `${currentRadius}px`;

            if (easedProgress > 0.8) {
                const scaleAmount = 1 + ((easedProgress - 0.8) * 0.4);
                brandContent.style.transform = `scale(${scaleAmount})`;
            } else {
                brandContent.style.transform = `scale(1)`;
            }

            let titleProg = Math.max(0, Math.min(1, (progress - 0.05) * 4));
            brandTitle.style.opacity = titleProg;
            brandTitle.style.transform = `translateY(${15 * (1 - titleProg)}px)`;

            let subProg = Math.max(0, Math.min(1, (progress - 0.1) * 4));
            brandSub.style.opacity = subProg;
            brandSub.style.transform = `translateY(${15 * (1 - subProg)}px)`;

            let descProg = Math.max(0, Math.min(1, (progress - 0.18) * 3));
            brandDesc.style.opacity = descProg;
            brandDesc.style.transform = `translateY(${15 * (1 - descProg)}px)`;
        });
    }
}

function initAboutIntersectionObserver() {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));

    const metricsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter-val');
                counters.forEach(counter => animateCountUp(counter));
                metricsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const metricsContainer = document.getElementById('metrics-container');
    if (metricsContainer) {
        metricsObserver.observe(metricsContainer);
    }

    const matrixElements = document.querySelectorAll('.matrix-el');
    const matrixObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('opacity-0', '-translate-x-[50px]', 'translate-x-[50px]');
                entry.target.classList.add('opacity-100', 'translate-x-0');
            } else {
                if (entry.boundingClientRect.top > 0) {
                    entry.target.classList.remove('opacity-100', 'translate-x-0');
                    if (entry.target.classList.contains('matrix-left')) {
                        entry.target.classList.add('opacity-0', '-translate-x-[50px]');
                    } else {
                        entry.target.classList.add('opacity-0', 'translate-x-[50px]');
                    }
                }
            }
        });
    }, { threshold: 0.15 });

    matrixElements.forEach(el => matrixObserver.observe(el));
}
