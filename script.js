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
    try {
        // 1. 현재 실행 중인 페이지를 판별하여 로드할 JSON 파일 선택
        const path = window.location.pathname.toLowerCase();
        const isMenu1 = path.includes('menu_1.html');
        const isMenu2 = path.endsWith('menu_2.html') || path.endsWith('menu_2');
        const isMenu2_1 = path.includes('menu_2_1.html');
        const isMenu2_2 = path.includes('menu_2_2.html');
        const isMenu2_3 = path.includes('menu_2_3.html');
        const isMenu3 = path.includes('menu_3.html');
        const isPersonal = path.includes('personal.html');
        
        let jsonFile = 'data.json';
        if (isMenu1) jsonFile = 'about.json';
        else if (isMenu2) jsonFile = 'business.json';
        else if (isMenu2_1) jsonFile = 'business_1.json';
        else if (isMenu2_2) jsonFile = 'business_2.json';
        else if (isMenu2_3) jsonFile = 'business_3.json';
        else if (isMenu3) jsonFile = 'research.json';
        else if (isPersonal) jsonFile = 'personal.json';

        fetch(jsonFile)
            .then(response => {
                if (!response.ok) {
                    throw new Error('네트워크 응답에 문제가 있습니다.');
                }
                return response.json();
            })
            .then(data => {
                console.log(`${jsonFile} 로드 성공. 동적 데이터 바인딩을 적용합니다.`);
                try {
                    if (isMenu1) {
                        renderAboutPage(data);
                    } else if (isMenu2) {
                        renderBusinessPage(data);
                    } else if (isMenu2_1) {
                        renderBusiness1Page(data);
                    } else if (isMenu2_2) {
                        renderBusiness2Page(data);
                    } else if (isMenu2_3) {
                        renderBusiness3Page(data);
                    } else if (isMenu3) {
                        renderResearchPage(data);
                    } else if (isPersonal) {
                        renderPersonalPage(data);
                    } else {
                        renderPage(data);
                    }
                } catch (renderError) {
                    console.error("데이터 렌더링 중 오류 발생:", renderError);
                    alert("데이터 렌더링 오류: " + renderError.message);
                }
            })
            .catch(error => {
                console.warn(`${jsonFile} fetch 실패 (CORS 또는 네트워크 에러). 기본 정적 HTML 콘텐츠를 사용합니다.`, error);
            })
            .finally(() => {
                // 데이터 로드 성공/실패 여부와 관계없이 UI 인터랙션 엔진은 반드시 가동
                try {
                    initUIEngine(isMenu1, isMenu2, isMenu2_1, isMenu2_2, isMenu2_3, isMenu3, isPersonal);
                } catch (uiError) {
                    console.error("UI 엔진 초기화 중 오류 발생:", uiError);
                    alert("UI 초기화 오류: " + uiError.message);
                }
            });
    } catch (globalError) {
        console.error("DOMContentLoaded 내부 치명적 오류:", globalError);
        alert("자바스크립트 준비 오류: " + globalError.message);
    }
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

    const path = window.location.pathname.toLowerCase();
    const isSubPage = path.includes('menu_2_1.html') || path.includes('menu_2_2.html') || path.includes('menu_2_3.html') || path.includes('menu_3.html');

    // PC 메뉴 렌더링
    const pcMenuContainer = document.querySelector('nav .hidden.md\\:flex');
    if (pcMenuContainer) {
        const links = pcMenuContainer.querySelectorAll('a');
        links.forEach(l => l.remove());

        const textClass = isSubPage 
            ? "nav-link text-slate-600 hover:text-navy text-sm font-medium transition-colors" 
            : "nav-link text-white/90 hover:text-white text-sm font-medium transition-colors drop-shadow-sm";

        const menuHtml = navData.menu.map(item => `
            <a href="${item.href}" class="${textClass}">${item.text}</a>
        `).join('');
        pcMenuContainer.insertAdjacentHTML('afterbegin', menuHtml);
    }

    // 모바일 드로어 메뉴 렌더링
    const mobileDrawerContent = document.getElementById('mobile-drawer-content');
    if (mobileDrawerContent) {
        const links = mobileDrawerContent.querySelectorAll('.mobile-link');
        links.forEach(l => l.remove());

        const mobileTextClass = isSubPage
            ? "mobile-link text-slate-600 hover:text-navy text-base font-medium transition-colors py-1"
            : "mobile-link text-white/80 hover:text-white text-base font-medium transition-colors py-1";

        const mobileMenuHtml = navData.menu.map(item => `
            <a href="${item.href}" onclick="toggleMobileMenu()" class="${mobileTextClass}">${item.text}</a>
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

function initUIEngine(isMenu1 = false, isMenu2 = false, isMenu2_1 = false, isMenu2_2 = false, isMenu2_3 = false, isMenu3 = false, isPersonal = false) {
    initLucide();
    initIntroAnimation(isMenu1, isMenu2);
    initNavbarSkinAndToggle();
    if (isMenu1) {
        initAboutAnimations();
        initAboutIntersectionObserver();
    } else if (isMenu2) {
        initBusinessAnimations();
        initBusinessIntersectionObserver();
    } else if (isMenu2_1) {
        initBusinessSub1();
    } else if (isMenu2_2) {
        initBusinessSub2();
    } else if (isMenu2_3) {
        initBusinessSub3();
    } else if (isMenu3) {
        initResearchPage();
    } else if (isPersonal) {
        initPersonalPage();
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

function initIntroAnimation(isMenu1 = false, isMenu2 = false) {
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
    if (isMenu2) {
        // Menu_2.html 히어로 애니메이션은 CSS로 구동되므로 별도 스크립트 모션 불필요
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
    const mobTriggerBtn = document.querySelector('#mobile-drawer button.modal-trigger');

    const path = window.location.pathname.toLowerCase();
    
    // 현재 활성화된 주 메뉴 파일명 판별
    let activeMainHref = 'index.html';
    if (path.includes('menu_1.html')) activeMainHref = 'Menu_1.html';
    else if (path.includes('menu_2.html') || path.includes('menu_2_1.html') || path.includes('menu_2_2.html') || path.includes('menu_2_3.html')) activeMainHref = 'Menu_2.html';
    else if (path.includes('menu_3.html') || path.includes('personal.html')) activeMainHref = 'Menu_3.html';

    // 상시 흰색 고정 스킨을 적용할 서브페이지 리스트 (Menu_3.html 및 personal.html 포함)
    const isSubPage = path.includes('menu_2_1.html') || path.includes('menu_2_2.html') || path.includes('menu_2_3.html') || path.includes('menu_3.html') || path.includes('personal.html');

    if (isSubPage) {
        navbar.className = "fixed w-full z-50 top-0 transition-all duration-300 bg-white shadow-sm py-1";
        if (navBrand) navBrand.className = "text-navy font-semibold tracking-tight text-lg transition-colors";
        
        // PC 네비게이션 링크들만
        document.querySelectorAll('nav .md\\:flex a:not(.bg-teal)').forEach(el => {
            const href = el.getAttribute('href');
            const isActive = href === activeMainHref || (activeMainHref === 'Menu_3.html' && href === '#hero');
            if (isActive) {
                el.className = "nav-link text-navy font-bold text-sm transition-colors border-b-2 border-navy pb-0.5";
            } else {
                el.className = "nav-link text-slate-600 hover:text-navy text-sm font-medium transition-colors";
            }
        });

        // 모바일 드로어 링크들만 (밑줄 범위 텍스트 크기 제어 보완)
        document.querySelectorAll('#mobile-drawer a:not(.bg-teal)').forEach(el => {
            const href = el.getAttribute('href');
            const isActive = href === activeMainHref || (activeMainHref === 'Menu_3.html' && href === '#hero');
            if (isActive) {
                el.className = "mobile-link text-navy font-bold text-base transition-colors py-1 border-b-2 border-navy w-fit pb-0.5";
            } else {
                el.className = "mobile-link text-slate-600 hover:text-navy text-base font-medium transition-colors py-1 w-fit";
            }
        });

        if (mobTriggerBtn) {
            mobTriggerBtn.className = "modal-trigger text-slate-600 hover:text-navy text-base font-medium transition-colors py-1 text-left w-full cursor-pointer";
        }

        if (navLogoBox) navLogoBox.src = 'images/logo.png';
        if (mobileBtn) mobileBtn.style.color = '#475569';
        return;
    }

    if (window.scrollY > 50) {
        if (isMenuOpen) {
            navbar.className = "fixed w-full z-40 top-0 transition-all duration-300 bg-white shadow-sm";
            drawer.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            drawerContent.style.borderColor = '#f1f5f9';
            
            // 모바일 드로어 활성/비활성 클래스 (흰색 배경)
            document.querySelectorAll('#mobile-drawer a:not(.bg-teal)').forEach(el => {
                const href = el.getAttribute('href');
                const isActive = href === activeMainHref || (activeMainHref === 'Menu_3.html' && href === '#hero');
                if (isActive) {
                    el.className = "mobile-link text-navy font-bold text-base transition-colors py-1 border-b-2 border-navy w-fit pb-0.5";
                } else {
                    el.className = "mobile-link text-slate-600 hover:text-navy text-base font-medium transition-colors py-1 w-fit";
                }
            });
            
            if (mobTriggerBtn) {
                mobTriggerBtn.className = "modal-trigger text-slate-600 hover:text-navy text-base font-medium transition-colors py-1 text-left w-full cursor-pointer";
            }
            
            if (mobileBtn) mobileBtn.style.color = '#0f172a';
        } else {
            navbar.className = "fixed w-full z-40 top-0 transition-all duration-300 bg-white shadow-sm";
            if (mobileBtn) mobileBtn.style.color = '#475569';
        }

        if (navBrand) navBrand.className = "text-navy font-semibold tracking-tight text-lg transition-colors";
        
        // PC 네비게이션 활성/비활성 클래스 (흰색 배경)
        document.querySelectorAll('nav .md\\:flex a:not(.bg-teal)').forEach(el => {
            const href = el.getAttribute('href');
            const isActive = href === activeMainHref || (activeMainHref === 'Menu_3.html' && href === '#hero');
            if (isActive) {
                el.className = "nav-link text-navy font-bold text-sm transition-colors border-b-2 border-navy pb-0.5";
            } else {
                el.className = "nav-link text-slate-600 hover:text-navy text-sm font-medium transition-colors";
            }
        });
        
        if (navLogoBox) navLogoBox.src = 'images/logo.png';

    } else {
        if (isMenuOpen) {
            navbar.className = "fixed w-full z-40 top-0 transition-all duration-300 bg-navy/95 backdrop-blur-md shadow-xl";
            drawer.style.backgroundColor = 'rgba(30, 58, 138, 0.75)';
            drawerContent.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            
            // 모바일 드로어 활성/비활성 클래스 (어두운 투명 배경)
            document.querySelectorAll('#mobile-drawer a:not(.bg-teal)').forEach(el => {
                const href = el.getAttribute('href');
                const isActive = href === activeMainHref || (activeMainHref === 'Menu_3.html' && href === '#hero');
                if (isActive) {
                    el.className = "mobile-link text-white font-bold text-base transition-colors py-1 border-b-2 border-white w-fit pb-0.5";
                } else {
                    el.className = "mobile-link text-white/80 hover:text-white text-base font-medium transition-colors py-1 w-fit";
                }
            });

            if (mobTriggerBtn) {
                mobTriggerBtn.className = "modal-trigger text-white/80 hover:text-white text-base font-medium transition-colors py-1 text-left w-full cursor-pointer";
            }
            
            if (mobileBtn) mobileBtn.style.color = '#ffffff';
            if (navBrand) navBrand.className = "text-white font-semibold tracking-tight text-lg drop-shadow-md transition-colors";
            if (navLogoBox) navLogoBox.src = 'images/logo_w.png';
        } else {
            navbar.className = "fixed w-full z-40 top-0 transition-all duration-300 bg-transparent";
            if (mobileBtn) mobileBtn.style.color = '#ffffff';
            if (navBrand) navBrand.className = "text-white font-semibold tracking-tight text-lg drop-shadow-md transition-colors";
            
            // PC 네비게이션 활성/비활성 클래스 (투명 배경)
            document.querySelectorAll('nav .md\\:flex a:not(.bg-teal)').forEach(el => {
                const href = el.getAttribute('href');
                const isActive = href === activeMainHref || (activeMainHref === 'Menu_3.html' && href === '#hero');
                if (isActive) {
                    el.className = "nav-link text-white font-bold text-sm transition-colors border-b-2 border-white pb-0.5";
                } else {
                    el.className = "nav-link text-white/90 hover:text-white text-sm font-medium transition-colors drop-shadow-sm";
                }
            });
            
            if (navLogoBox) navLogoBox.src = 'images/logo_w.png';
        }
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
                modal.style.display = 'flex';
                // 브라우저 리플로우를 강제해 트랜지션 모션 보증
                void modal.offsetWidth;
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
                setTimeout(() => {
                    if (!modal.classList.contains('show')) {
                        modal.style.display = 'none';
                    }
                }, 300); // 트랜지션 애니메이션 완료 대기 후 display none 처리
                document.body.style.overflow = '';
            }
            return;
        }

        const overlay = e.target;
        if (overlay && overlay.classList.contains('modal-overlay')) {
            overlay.classList.remove('show');
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            setTimeout(() => {
                if (!overlay.classList.contains('show')) {
                    overlay.style.display = 'none';
                }
            }, 300);
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

/* ==========================================================================
   4. Menu_2.html (비즈니스) 동적 렌더링 및 특화 모션 모듈
   ========================================================================== */

function renderBusinessPage(data) {
    if (data.nav) renderNav(data.nav);
    if (data.hero) renderBusinessHero(data.hero);
    if (data.runwaySection) renderBusinessRunway(data.runwaySection);
    if (data.portfolioSection) renderBusinessPortfolio(data.portfolioSection);
    if (data.footer) renderBusinessFooter(data.footer);
    if (data.contactModal) renderModal(data.contactModal);
}

function renderBusinessHero(heroData) {
    const heroImg = document.querySelector('section.relative img');
    if (heroImg) {
        heroImg.src = heroData.bgImg;
        heroImg.alt = heroData.bgAlt;
    }
    const heroTitle = document.querySelector('section.relative h2');
    if (heroTitle) {
        heroTitle.innerHTML = `${heroData.title} <br> ${heroData.subtitle}`;
    }
}

function renderBusinessRunway(runwayData) {
    const runwaySlogan = document.getElementById('runway-slogan');
    if (runwaySlogan) {
        const badge = runwaySlogan.querySelector('span');
        if (badge) badge.textContent = runwayData.badge;
        const title = runwaySlogan.querySelector('h2');
        if (title) title.innerHTML = runwayData.slogan;
    }
}

function renderBusinessPortfolio(portfolioData) {
    const section = document.getElementById('runway-section').nextElementSibling;
    if (section) {
        const badge = section.querySelector('span.text-teal');
        if (badge) badge.textContent = portfolioData.badge;
        const title = section.querySelector('h2');
        if (title) title.textContent = portfolioData.title;

        const cardsContainer = section.querySelector('.grid');
        if (cardsContainer && portfolioData.cards) {
            cardsContainer.innerHTML = portfolioData.cards.map(card => `
                <div class="reveal ${card.delay} relative h-[450px] overflow-hidden rounded-xl shadow-md group cursor-pointer transition-all duration-300 md:hover:-translate-y-2 md:hover:shadow-xl bg-white" onclick="location.href='${card.link}'">
                    <img src="${card.img}" alt="${card.imgAlt}" class="absolute inset-0 w-full h-full object-cover rounded-xl transition-transform duration-700 md:group-hover:scale-105">
                    
                    <div class="absolute top-6 right-6 w-11 h-11 bg-teal md:bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-lg z-20 text-white transition-all duration-300 md:group-hover:bg-teal md:group-hover:border-teal/30 md:group-hover:scale-110 pointer-events-none">
                        <i data-lucide="arrow-up-right" class="w-5 h-5 transition-transform duration-300 md:group-hover:translate-x-0.5 md:group-hover:-translate-y-0.5"></i>
                    </div>

                    <div class="absolute inset-0 bg-black/50 md:bg-black/40 md:group-hover:bg-black/60 rounded-xl transition-colors duration-500 flex flex-col justify-end p-8">
                        <div class="transform translate-y-0 md:translate-y-8 md:group-hover:translate-y-0 transition-transform duration-500 ease-out">
                            <div class="w-10 h-1 bg-teal mb-5 rounded-full transition-all duration-500 md:group-hover:w-16"></div>
                            <h3 class="text-white text-2xl md:text-3xl font-bold mb-4 break-keep tracking-tight shadow-black/50 drop-shadow-sm">
                                ${card.title}
                            </h3>
                            <p class="text-white/95 text-sm leading-relaxed break-keep opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                ${card.desc}
                            </p>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
}

function renderBusinessFooter(footerData) {
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
        if (infoList && footerData.info) {
            infoList.innerHTML = `
                <li class="flex gap-4"><span class="w-24 text-slate-500 font-medium shrink-0">대표자</span> <span>${footerData.info.representative}</span></li>
                <li class="flex gap-4"><span class="w-24 text-slate-500 font-medium shrink-0">사업자등록번호</span> <span class="font-mono">${footerData.info.businessNum}</span></li>
                <li class="flex gap-4"><span class="w-24 text-slate-500 font-medium shrink-0">민간자격등록</span> <span class="font-mono">${footerData.info.licenseNum}</span></li>
                <li class="flex gap-4"><span class="w-24 text-slate-500 font-medium shrink-0">소재지</span> <span class="break-keep">${footerData.info.address}</span></li>
            `;
        }

        const copyright = footer.querySelector('.border-t p');
        if (copyright) copyright.textContent = footerData.copyright;

        const links = footer.querySelectorAll('.border-t .flex a');
        if (links[0]) links[0].href = footerData.termsLink;
        if (links[1]) links[1].href = footerData.privacyLink;
    }
}

function initBusinessAnimations() {
    const section = document.getElementById('runway-section');
    const shutterLeft = document.getElementById('shutter-left');
    const shutterRight = document.getElementById('shutter-right');
    const runwayLine = document.getElementById('runway-line');
    const slogan = document.getElementById('runway-slogan');
    const scrollHint = document.getElementById('scroll-hint');
    
    if (!section || !shutterLeft || !shutterRight || !runwayLine || !slogan || !scrollHint) return;
    
    const SHUTTER_CLOSE_END_PHASE = 0.4; 
    const SLOGAN_SHOW_START_PHASE = 0.7; 

    window.addEventListener('scroll', () => {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top > windowHeight) return;
        
        const scrollableDistance = rect.height - windowHeight;
        
        let progress = -rect.top / scrollableDistance;
        progress = Math.max(0, Math.min(1, progress));

        let shutterProgress = Math.min(progress / SHUTTER_CLOSE_END_PHASE, 1);
        let easeOutProgress = shutterProgress === 1 ? 1 : 1 - Math.pow(2, -10 * shutterProgress);
        
        const maxClosePercent = 80; 
        
        let translateLeft = -100 + (easeOutProgress * maxClosePercent);
        let translateRight = 100 - (easeOutProgress * maxClosePercent);
        
        shutterLeft.style.transform = `translateX(${translateLeft}%)`;
        shutterRight.style.transform = `translateX(${translateRight}%)`;

        if (progress > 0.05) {
            scrollHint.style.opacity = 0;
            
            let driveSpeed = progress * 4000; 
            runwayLine.style.backgroundPositionY = `${driveSpeed}px`;

            if (progress >= SLOGAN_SHOW_START_PHASE) {
                let lineFadeProgress = (progress - SLOGAN_SHOW_START_PHASE) / (1 - SLOGAN_SHOW_START_PHASE);
                runwayLine.style.opacity = Math.max(0, 1 - lineFadeProgress);
            } else {
                runwayLine.style.opacity = 1;
            }
        } else {
            runwayLine.style.opacity = 0;
            scrollHint.style.opacity = 1;
        }

        if (progress >= SLOGAN_SHOW_START_PHASE) {
            let textProgress = (progress - SLOGAN_SHOW_START_PHASE) / (1 - SLOGAN_SHOW_START_PHASE);
            let textEase = textProgress < 0.5 ? 2 * textProgress * textProgress : 1 - Math.pow(-2 * textProgress + 2, 2) / 2;
            
            slogan.style.opacity = textEase;
            slogan.style.transform = `translateY(${(1 - textEase) * 40}px)`;
        } else {
            slogan.style.opacity = 0;
            slogan.style.transform = `translateY(40px)`;
        }
    });
    
    window.dispatchEvent(new Event('scroll'));
}

function initBusinessIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

/* ==========================================================================
   5. Menu_2_1, 2_2, 2_3.html (비즈니스 서브페이지) 동적 렌더링 및 모션
   ========================================================================== */

function renderBusiness1Page(data) {
    if (data.nav) renderNav(data.nav);
    if (data.hero) {
        const titleLine1 = document.querySelector('.text-fill-anim.line-1');
        const titleLine2 = document.querySelector('.text-fill-anim.line-2');
        if (titleLine1) titleLine1.textContent = data.hero.title1;
        if (titleLine2) titleLine2.textContent = data.hero.title2;
        const subtext = document.getElementById('hero-subtext');
        if (subtext) subtext.textContent = data.hero.desc;
    }
    if (data.descriptionSection) {
        const heading = document.getElementById('blur-heading');
        if (heading) heading.textContent = data.descriptionSection.heading;
        const subHeading = document.querySelector('section.bg-slatebg h3');
        if (subHeading) subHeading.innerHTML = data.descriptionSection.subHeading;
        const text = document.querySelector('section.bg-slatebg p');
        if (text) text.textContent = data.descriptionSection.text;
    }
    if (data.programs) {
        const rows = document.querySelectorAll('.tw-row');
        data.programs.forEach((prog, index) => {
            const row = rows[index];
            if (row) {
                const img = row.querySelector('img');
                if (img) {
                    img.src = prog.img;
                    img.alt = prog.imgAlt;
                }
                const num = row.querySelector('.inline-block');
                if (num) num.textContent = prog.num;
                const title = row.querySelector('h3');
                if (title) title.textContent = prog.title;
                const desc = row.querySelector('p');
                if (desc) desc.textContent = prog.desc;
            }
        });
    }
    if (data.workflow) {
        const badge = document.querySelector('section.border-t.border-slate-200 h4');
        if (badge) badge.textContent = data.workflow.badge;
        const title = document.querySelector('section.border-t.border-slate-200 h3');
        if (title) title.innerHTML = data.workflow.title;

        data.workflow.steps.forEach(step => {
            const card = document.getElementById(step.id);
            if (card) {
                const num = card.querySelector('.w-12');
                if (num) num.textContent = step.num;
                const title = card.querySelector('h5');
                if (title) title.textContent = step.title;
                const desc = card.querySelector('p');
                if (desc) desc.textContent = step.desc;
            }
        });
    }
    if (data.faqSection) {
        renderSubFAQ(data.faqSection);
    }
    if (data.footer) {
        renderBusinessFooter(data.footer);
    }
}

function renderBusiness2Page(data) {
    if (data.nav) renderNav(data.nav);
    if (data.hero) {
        const titleLine1 = document.querySelector('.text-fill-anim.line-1');
        const titleLine2 = document.querySelector('.text-fill-anim.line-2');
        if (titleLine1) titleLine1.textContent = data.hero.title1;
        if (titleLine2) titleLine2.textContent = data.hero.title2;
        const subtext = document.getElementById('hero-subtext');
        if (subtext) subtext.textContent = data.hero.desc;
    }
    if (data.coursesSection) {
        const badge = document.querySelector('section.bg-slatebg h2');
        if (badge) badge.textContent = data.coursesSection.badge;
        const desc = document.querySelector('section.bg-slatebg p');
        if (desc) desc.textContent = data.coursesSection.desc;

        const cards = document.querySelectorAll('section.bg-slatebg .unroll-card');
        data.coursesSection.courses.forEach((course, index) => {
            const card = cards[index];
            if (card) {
                const title = card.querySelector('h3');
                if (title) title.textContent = course.title;
                const desc = card.querySelector('p');
                if (desc) desc.textContent = course.desc;
                const img = card.querySelector('img');
                if (img) {
                    img.src = course.img;
                    img.alt = course.imgAlt;
                }
                const curriculum = card.querySelector('.course-expand p');
                if (curriculum) curriculum.textContent = course.curriculum;
            }
        });
    }
    if (data.licenseSection) {
        const badge = document.querySelector('section.bg-white h2');
        if (badge) badge.textContent = data.licenseSection.badge;
        const desc = document.querySelector('section.bg-white p');
        if (desc) desc.textContent = data.licenseSection.desc;

        const cards = document.querySelectorAll('section.bg-white .unroll-card');
        data.licenseSection.licenses.forEach((lic, index) => {
            const card = cards[index];
            if (card) {
                const title = card.querySelector('h3');
                if (title) title.textContent = lic.title;
                const desc = card.querySelector('p');
                if (desc) desc.textContent = lic.desc;
                const img = card.querySelector('img');
                if (img) {
                    img.src = lic.img;
                    img.alt = lic.imgAlt;
                }
                const detail = card.querySelector('.course-expand p');
                if (detail) detail.textContent = lic.detail;
            }
        });
    }
    if (data.faqSection) {
        renderSubFAQ(data.faqSection);
    }
    if (data.footer) {
        renderBusinessFooter(data.footer);
    }
}

function renderBusiness3Page(data) {
    if (data.nav) renderNav(data.nav);
    if (data.hero) {
        const titleLine1 = document.querySelector('.text-fill-anim.line-1');
        const titleLine2 = document.querySelector('.text-fill-anim.line-2');
        if (titleLine1) titleLine1.textContent = data.hero.title1;
        if (titleLine2) titleLine2.textContent = data.hero.title2;
        const subtext = document.getElementById('hero-subtext');
        if (subtext) subtext.textContent = data.hero.desc;
    }
    if (data.tabSection) {
        const titleEl = document.querySelector('#tab-section-header h2');
        const descEl = document.querySelector('#tab-section-header p');
        if (titleEl && data.tabSection.title) titleEl.textContent = data.tabSection.title;
        if (descEl && data.tabSection.desc) descEl.textContent = data.tabSection.desc;

        const tabContents = document.querySelectorAll('.tab-content');
        data.tabSection.tabs.forEach((tab, index) => {
            const content = tabContents[index];
            if (content) {
                const heading = content.querySelector('h3');
                if (heading) heading.textContent = tab.heading;
                const desc = content.querySelector('p');
                if (desc) desc.textContent = tab.desc;

                const gridItems = content.querySelectorAll('button');
                tab.items.forEach((item, itemIdx) => {
                    const gridItem = gridItems[itemIdx];
                    if (gridItem) {
                        const title = gridItem.querySelector('h4');
                        if (title) title.textContent = item.title;
                        const desc = gridItem.querySelector('p');
                        if (desc) desc.textContent = item.desc;

                        // 데이터 속성에 상세 이미지와 설명 바인딩
                        gridItem.setAttribute('data-detail-img', item.detailImg || "");
                        gridItem.setAttribute('data-detail-desc', item.detailDesc || "");
                    }
                });
            }
        });
    }
    if (data.gridSection) {
        const heading = document.querySelector('section.bg-slatebg h2');
        if (heading) heading.textContent = data.gridSection.title;
        const desc = document.querySelector('section.bg-slatebg p');
        if (desc) desc.textContent = data.gridSection.desc;

        const phases = document.querySelectorAll('.row-phase > div');
        data.gridSection.phases.forEach((phase, index) => {
            const div = phases[index];
            if (div) {
                const title = div.querySelector('h4');
                if (title) title.textContent = phase.title;
                const desc = div.querySelector('p');
                if (desc) desc.textContent = phase.desc;
            }
        });
    }
    if (data.faqSection) {
        renderSubFAQ(data.faqSection);
    }
    if (data.footer) {
        renderBusinessFooter(data.footer);
    }
}

function renderSubFAQ(faqSection) {
    const section = document.querySelector('section.border-t.border-slate-200');
    if (section) {
        const badge = section.querySelector('span.text-teal');
        if (badge) badge.textContent = faqSection.badge;
        const title = section.querySelector('h2');
        if (title) title.innerHTML = faqSection.title;
        const desc = section.querySelector('p.text-slate-500');
        if (desc) desc.textContent = faqSection.desc;

        const items = section.querySelectorAll('.faq-item');
        faqSection.items.forEach((item, index) => {
            const faq = items[index];
            if (faq) {
                const q = faq.querySelector('button span');
                if (q) q.textContent = item.q;
                const a = faq.querySelector('.faq-content div');
                if (a) a.textContent = item.a;
            }
        });
    }
}

// 서브페이지 인터랙션 초기화
function initBusinessSub1() {
    initDropdowns();
    initHeroAnimations();
    initFAQAccordions();
    initFormAndModals();

    // IntersectionObserver - blur text
    const blurElements = document.querySelectorAll('.scroll-blur-text');
    const targetSection = document.querySelector('section.bg-slatebg');
    if (targetSection) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        blurElements.forEach(el => {
                            el.classList.add('clear-blur');
                        });
                    }, 1500);
                    sectionObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        sectionObserver.observe(targetSection);
    }

    // IntersectionObserver - reveal-up
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
    document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));

    // IntersectionObserver - tw-row
    const twObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('tw-active');
            } else {
                entry.target.classList.remove('tw-active');
            }
        });
    }, { threshold: 0.25 });
    document.querySelectorAll('.tw-row').forEach(el => twObserver.observe(el));

    // IntersectionObserver - workflow cards
    const wfContainer = document.getElementById('workflow-container');
    const wfObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            const cards = [
                document.getElementById('wf-card-1'),
                document.getElementById('wf-card-2'),
                document.getElementById('wf-card-3'),
                document.getElementById('wf-card-4')
            ];
            let enterDelay = 0;
            cards.forEach((card) => {
                if (card) {
                    setTimeout(() => {
                        card.classList.add('wf-enter');
                    }, enterDelay);
                }
                enterDelay += 300;
            });
            setTimeout(() => {
                let paintDelay = 0;
                cards.forEach(card => {
                    if (card) {
                        setTimeout(() => {
                            card.classList.add('painted');
                        }, paintDelay);
                    }
                    paintDelay += 400;
                });
            }, enterDelay + 400);
            wfObserver.unobserve(entries[0].target);
        }
    }, { threshold: 0.2 });
    if (wfContainer) wfObserver.observe(wfContainer);
}

function initBusinessSub2() {
    initDropdowns();
    initHeroAnimations();
    initFAQAccordions();
    initFormAndModals();

    // IntersectionObserver - reveal-up
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
    document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));

    // unroll-card accordion & list observer
    const lists = document.querySelectorAll('.unroll-list');
    lists.forEach(list => {
        const listObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                const cards = list.querySelectorAll('.unroll-card');
                let delay = 0;
                cards.forEach(card => {
                    setTimeout(() => {
                        card.classList.add('active');
                    }, delay);
                    delay += 150;
                });
                listObserver.unobserve(entries[0].target);
            }
        }, { threshold: 0.15 });
        listObserver.observe(list);
    });

    const unrollLists = document.querySelectorAll('.unroll-list');
    unrollLists.forEach(ul => {
        const cards = ul.querySelectorAll('.unroll-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const expand = card.querySelector('.course-expand');
                if (!expand) return;
                const isOpen = card.classList.contains('expanded');

                cards.forEach(c => {
                    c.classList.remove('expanded');
                    const exp = c.querySelector('.course-expand');
                    if (exp) {
                        exp.style.maxHeight = '0px';
                        exp.style.opacity = '0';
                    }
                });

                if (!isOpen) {
                    card.classList.add('expanded');
                    expand.style.maxHeight = expand.scrollHeight + 'px';
                    expand.style.opacity = '1';
                }
            });
        });
    });
}

function initBusinessSub3() {
    initDropdowns();
    initHeroAnimations();
    initFAQAccordions();
    initFormAndModals();

    // IntersectionObserver - reveal-up
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
    document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));

    // IntersectionObserver - row-phase
    const phaseObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                phaseObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.row-phase').forEach(el => phaseObserver.observe(el));

    // Tab Switching
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            tabs.forEach(t => {
                t.classList.remove('text-teal', 'border-teal', 'font-bold');
                t.classList.add('text-slate-500', 'border-transparent');
            });
            tab.classList.remove('text-slate-500', 'border-transparent');
            tab.classList.add('text-teal', 'border-teal', 'font-bold');

            contents.forEach(c => {
                c.classList.add('hidden', 'opacity-0');
                c.classList.remove('block', 'opacity-100');
            });
            const targetContent = document.getElementById(target);
            if (targetContent) {
                targetContent.classList.remove('hidden');
                setTimeout(() => {
                    targetContent.classList.add('block', 'opacity-100');
                }, 50);
            }
        });
    });

    // 카드 상세 팝업 모달 데이터 및 이벤트 연동
    const cardDetails = [
        {
            title: "전문가용 다면적 분석 검사지",
            image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1000&auto=format&fit=crop",
            desc: "전문가용 다면적 분석 검사지는 개인의 타고난 성격 기질과 후천적 성격 발달 상태를 입체적으로 분석합니다. 태도와 기질 유형 분류 및 사회 활동 방식, 갈등 대처 메커니즘을 과학적 척도를 기반으로 진단하여 1:1 심층 상담 및 소그룹 코칭을 위한 가이드라인을 제공합니다."
        },
        {
            title: "기업형 집단 진단 워크북",
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop",
            desc: "기업형 집단 진단 워크북은 부서 및 조직 단위의 소통 벽을 허물고 협업 시너지를 극대화하기 위한 그룹 진단 솔루션입니다. 구성원들의 업무 소통 스타일 분석, 리더십 스타일 분석 및 부서별 갈등 매핑을 통해 최적의 인적 배치와 팀워크 형성의 로드맵을 수립하도록 돕습니다."
        },
        {
            title: "청년 진로 정체성 탐색지",
            image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000&auto=format&fit=crop",
            desc: "청년 진로 정체성 탐색지는 급변하는 고용 환경 속에서 청년층이 자신만의 고유한 강점과 직업 가치관을 탐색할 수 있도록 설계된 자아 분석 도구입니다. 성향 맞춤형 진로 탐색 가이드와 현재 직무 매칭 정보를 제공하여 진로 결정 효능감을 한 단계 향상시킵니다."
        },
        {
            title: "감정 분류 카드덱 (EC-Deck)",
            image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop",
            desc: "감정 분류 카드덱은 말로 표현하기 어려운 미세한 내면의 감정을 시각적 일러스트와 텍스트를 통해 직관적으로 들여다보고 표현할 수 있게 돕는 정서 매개 도구입니다. 개인 상담뿐만 아니라 가정 상담, 대규모 집단 교육 프로그램 등에서 대화 촉진 및 공감대 형성에 널리 쓰입니다."
        },
        {
            title: "집단 역학 보드게임 키트",
            image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop",
            desc: "집단 역학 보드게임 키트는 게임 기반 학습(GBL) 방식을 도입하여, 팀 내에서 자연스럽게 발생하는 갈등 상황과 협업 구조를 직접 체험하고 이해하게 하는 게이미피케이션 교육 도구입니다. 게임 플레이 과정을 분석하여 상호 신뢰와 소통 방식을 주도적으로 피드백하고 깨닫게 도와줍니다."
        },
        {
            title: "오프라인 워크숍 실습 툴킷",
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000&auto=format&fit=crop",
            desc: "오프라인 워크숍 실습 툴킷은 교육 현장에서 몰입도를 극대화할 수 있는 다채로운 시각 보조 교구들의 패키지입니다. 대형 플립차트, 참여자 미션 카드, 스티커 키트 등으로 구성되어 강사 중심의 강의를 넘어 전원이 적극적으로 참여하고 발표하는 자기주도적 학습을 지원합니다."
        },
        {
            title: "수료증 디자인 시스템",
            image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1000&auto=format&fit=crop",
            desc: "수료증 디자인 시스템은 수료증의 신뢰도와 가치를 높이기 위해 제공하는 커스텀 브랜드 서비스입니다. 고품질 수입 지류와 특수 금박/형압 처리를 통해 완벽히 맞춤 디자인된 인쇄물 수료증과 모바일 및 이메일 전송이 가능한 디지털 수료증 파일을 함께 제공합니다."
        },
        {
            title: "디지털 자격 뱃지",
            image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1000&auto=format&fit=crop",
            desc: "디지털 자격 배지는 블록체인 기반의 위변조 불가능한 기술을 적용한 스마트 교육 인증 서비스입니다. 위조가 불가능한 개별 고유 ID와 QR코드가 부여되며, 수료자들은 자신의 개인 이력, 링크드인 프로필, 소셜 미디어 등에 직접 첨부하여 대외 공신력을 쉽고 빠르게 검증받을 수 있습니다."
        },
        {
            title: "우수 강사 인증 배지",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
            desc: "우수 강사 인증 배지는 최우수 교육 만족도를 달성하거나 강사 프로필에 지속적인 기여를 약속하는 파트너들을 위한 교육원의 연간 우수 등급 라이선스 공식 표식입니다. 이 인증 마크는 개인 비즈니스 마케팅 및 강의 위임 시 교육원이 공식 품질을 보증하는 징표 역할을 하여 신뢰를 공고히 합니다."
        }
    ];

    const cardDetailModal = document.getElementById('card-detail-modal');
    const cardDetailTitle = document.getElementById('card-detail-title');
    const cardDetailImage = document.getElementById('card-detail-image');
    const cardDetailDesc = document.getElementById('card-detail-desc');
    const closeCardDetailBtn = document.getElementById('close-card-detail-btn');
    const confirmCardDetailBtn = document.getElementById('confirm-card-detail-btn');

    const cardButtons = document.querySelectorAll('.tab-content button');

    cardButtons.forEach((btn, idx) => {
        if (cardDetails[idx]) {
            btn.addEventListener('click', () => {
                const data = cardDetails[idx];
                
                const dynamicTitle = btn.querySelector('h4') ? btn.querySelector('h4').textContent : null;
                const dynamicDesc = btn.querySelector('p') ? btn.querySelector('p').textContent : null;
                
                cardDetailTitle.textContent = dynamicTitle || data.title;
                cardDetailImage.src = btn.getAttribute('data-detail-img') || data.image;
                cardDetailImage.alt = dynamicTitle || data.title;
                cardDetailDesc.textContent = btn.getAttribute('data-detail-desc') || data.desc;
                
                if (cardDetailModal) {
                    cardDetailModal.classList.add('show');
                }
            });
        }
    });

    const hideCardDetail = () => {
        if (cardDetailModal) {
            cardDetailModal.classList.remove('show');
        }
    };

    if (closeCardDetailBtn) closeCardDetailBtn.addEventListener('click', hideCardDetail);
    if (confirmCardDetailBtn) confirmCardDetailBtn.addEventListener('click', hideCardDetail);

    if (cardDetailModal) {
        cardDetailModal.addEventListener('click', (e) => {
            if (e.target === cardDetailModal) {
                hideCardDetail();
            }
        });
    }
}

// 공통 도우미 함수들
function initDropdowns() {
    const d1Wrap = document.getElementById('dd1-wrap');
    const btn1 = document.getElementById('btn-dd1');
    const menu1 = document.getElementById('menu-dd1');
    const icon1 = document.getElementById('icon-dd1');

    const d2Wrap = document.getElementById('dd2-wrap');
    const btn2 = document.getElementById('btn-dd2');
    const menu2 = document.getElementById('menu-dd2');
    const icon2 = document.getElementById('icon-dd2');

    if (!btn1 || !menu1 || !icon1 || !btn2 || !menu2 || !icon2) return;

    let d1Open = false;
    let d2Open = false;

    const close1 = () => {
        d1Open = false;
        menu1.classList.remove('active');
        icon1.style.transform = 'rotate(0deg)';
    };
    const open1 = () => {
        d1Open = true;
        menu1.classList.add('active');
        icon1.style.transform = 'rotate(180deg)';
    };

    const close2 = () => {
        d2Open = false;
        menu2.classList.remove('active');
        icon2.style.transform = 'rotate(0deg)';
    };
    const open2 = () => {
        d2Open = true;
        menu2.classList.add('active');
        icon2.style.transform = 'rotate(180deg)';
    };

    btn1.addEventListener('click', (e) => {
        e.stopPropagation();
        if (d1Open) {
            close1();
        } else {
            open1();
            if (d2Open) close2();
        }
    });

    btn2.addEventListener('click', (e) => {
        e.stopPropagation();
        if (d2Open) {
            close2();
        } else {
            open2();
            if (d1Open) close1();
        }
    });

    document.addEventListener('click', (e) => {
        if (d1Open && !d1Wrap.contains(e.target)) close1();
        if (d2Open && !d2Wrap.contains(e.target)) close2();
    });
}

function initHeroAnimations() {
    setTimeout(() => {
        const l1 = document.querySelector('.text-fill-anim.line-1');
        if (l1) l1.classList.add('filled');
        setTimeout(() => {
            const l2 = document.querySelector('.text-fill-anim.line-2');
            if (l2) l2.classList.add('filled');
            setTimeout(() => {
                const subtext = document.getElementById('hero-subtext');
                if (subtext) {
                    subtext.classList.remove('opacity-0', 'translate-y-4');
                    subtext.classList.add('opacity-100', 'translate-y-0');
                    subtext.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
                }
            }, 1000);
        }, 1200);
    }, 300);
}

function initFAQAccordions() {
    const accordions = document.querySelectorAll('.faq-item');
    accordions.forEach(acc => {
        const btn = acc.querySelector('button');
        const content = acc.querySelector('.faq-content');

        if (btn && content) {
            btn.addEventListener('click', () => {
                const isOpen = acc.classList.contains('active');
                accordions.forEach(a => {
                    a.classList.remove('active');
                    const c = a.querySelector('.faq-content');
                    if (c) {
                        c.style.maxHeight = '0px';
                        c.style.opacity = '0';
                    }
                });
                if (!isOpen) {
                    acc.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                    content.style.opacity = '1';
                }
            });
        }
    });
}

function initFormAndModals() {
    const form = document.getElementById('consultation-form');
    const modal = document.getElementById('success-modal');
    const closeBtn = document.getElementById('close-modal-btn');

    if (form && modal && closeBtn) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); 
            modal.classList.add('show');
            form.reset();
        });

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }

    const privacyBtn = document.getElementById('btn-privacy-detail');
    const privacyModal = document.getElementById('privacy-modal');
    const closePrivacyBtn = document.getElementById('close-privacy-btn');
    const confirmPrivacyBtn = document.getElementById('confirm-privacy-btn');

    if (privacyBtn && privacyModal) {
        privacyBtn.addEventListener('click', () => {
            privacyModal.classList.add('show');
        });

        const hidePrivacy = () => {
            privacyModal.classList.remove('show');
        };

        if (closePrivacyBtn) closePrivacyBtn.addEventListener('click', hidePrivacy);
        if (confirmPrivacyBtn) confirmPrivacyBtn.addEventListener('click', hidePrivacy);

        privacyModal.addEventListener('click', (e) => {
            if (e.target === privacyModal) {
                hidePrivacy();
            }
        });
    }
}

// ==========================================================================
// 연구진 소개 페이지 (Menu_3.html) 렌더링 & 초기화 모듈
// ==========================================================================
function renderResearchPage(data) {
    if (data.nav) renderNav(data.nav);
    if (data.hero) {
        const title = document.getElementById('hero-title');
        if (title) title.textContent = data.hero.title;
        const subtitle = document.getElementById('hero-subtitle');
        if (subtitle) subtitle.textContent = data.hero.subtitle;
        const img = document.getElementById('parallax-img');
        if (img) {
            img.src = data.hero.img;
            img.alt = data.hero.imgAlt || data.hero.title;
        }
    }
    if (data.facultySection) {
        const title = document.querySelector('#faculty h2');
        if (title) title.textContent = data.facultySection.title;
        const desc = document.querySelector('#faculty p');
        if (desc) desc.textContent = data.facultySection.desc;

        if (data.facultySection.members) {
            const articles = document.querySelectorAll('#faculty article');
            data.facultySection.members.forEach((member, index) => {
                const art = articles[index];
                if (art) {
                    const img = art.querySelector('img');
                    if (img) img.src = member.img;
                    const name = art.querySelector('h3');
                    if (name) name.textContent = member.name;
                    const role = art.querySelector('p');
                    if (role) role.textContent = member.role;
                    
                    const spans = art.querySelectorAll('span');
                    if (spans[0]) spans[0].textContent = member.phone;
                    if (spans[1]) spans[1].textContent = member.email;
                }
                
                // 멤버 상세 정보 모달 데이터 연동
                const modal = document.getElementById(member.id);
                if (modal) {
                    const img = modal.querySelector('img');
                    if (img) img.src = member.img;
                    const name = modal.querySelector('h3');
                    if (name) name.textContent = member.name;
                    const role = modal.querySelector('p');
                    if (role) role.textContent = member.role;
                    
                    const infoParagraphs = modal.querySelectorAll('.space-y-6 p');
                    if (infoParagraphs[0]) infoParagraphs[0].textContent = member.career;
                    if (infoParagraphs[1]) infoParagraphs[1].textContent = member.license;
                    if (infoParagraphs[2]) infoParagraphs[2].textContent = member.intro;
                    if (infoParagraphs[3]) infoParagraphs[3].textContent = member.field;
                }
            });
        }
    }
    if (data.consultationSection) {
        const h2 = document.querySelector('#consultation h2');
        if (h2) h2.textContent = data.consultationSection.title;
        const btns = document.querySelectorAll('#consultation button');
        if (btns[0]) btns[0].innerHTML = `<i data-lucide="search" class="w-5 h-5"></i> ${data.consultationSection.searchBtn}`;
        if (btns[1]) btns[1].innerHTML = `<i data-lucide="mail" class="w-5 h-5"></i> ${data.consultationSection.contactBtn}`;
    }
    if (data.footer) {
        renderBusinessFooter(data.footer);
    }
}

function initResearchPage() {
    initDropdowns();
    initFAQAccordions();
    initFormAndModals();

    // 1. 히어로 텍스트 모션 효과
    setTimeout(() => {
        const title = document.getElementById('hero-title');
        const subtitle = document.getElementById('hero-subtitle');
        const windowImg = document.getElementById('hero-window');

        if (title) title.classList.add('show');
        setTimeout(() => { if (subtitle) subtitle.classList.add('show'); }, 200);
        setTimeout(() => { if (windowImg) windowImg.classList.add('show'); }, 400);
    }, 100);

    // 2. IntersectionObserver - reveal
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 3. 패럴랙스 스크롤 모션
    const parallaxImg = document.getElementById('parallax-img');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                if (scrolled < window.innerHeight && parallaxImg) {
                    parallaxImg.style.transform = `translateY(${-scrolled * 0.06}px) scale(1.25)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

window.searchAndRedirectExpert = function() {
    const codeInput = document.getElementById('expert-search-input').value.trim();

    if (!codeInput || codeInput.length !== 6) {
        alert('올바른 6자리 인증 코드를 입력해 주세요.');
        return;
    }

    if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
        const database = firebase.database();
        database.ref('approved_users/' + codeInput).once('value')
            .then((snapshot) => {
                const data = snapshot.val();
                if (data) {
                    location.href = 'personal.html?code=' + codeInput;
                } else {
                    alert('유효하지 않은 코드이거나 아직 관리자 승인이 완료되지 않은 상태입니다.');
                }
            })
            .catch((error) => {
                console.error("서버 연결 실패: ", error);
                alert("서버 통신에 실패했습니다. 잠시 후 다시 시도해 주세요.");
            });
    } else {
        // Firebase 로드되지 않았을 경우 (로컬 테스트용 폴백)
        console.warn("Firebase SDK가 로드되지 않았습니다. 폴백으로 인증을 가동합니다.");
        if (codeInput === "123456") {
            location.href = 'personal.html?code=' + codeInput;
        } else {
            alert('로컬 테스트 코드는 123456 입니다.');
        }
    }
};

// --------------------------------------------------------------------------
// 5. 전문가 상세 페이지 (personal.html) 데이터 바인딩 및 예약 프로세스 모듈
// --------------------------------------------------------------------------

let currentCode = '';

function renderPersonalPage(data) {
    if (data.nav) {
        renderNav(data.nav);
        const navBookingBtn = document.getElementById('nav-booking-btn');
        if (navBookingBtn) navBookingBtn.textContent = data.nav.bookingBtn || "예약하기";
        const mobileBookingBtn = document.getElementById('mobile-booking-btn');
        if (mobileBookingBtn) mobileBookingBtn.textContent = data.nav.bookingBtn || "예약하기";
    }
    if (data.hero) {
        const line1 = document.getElementById('hero-line1');
        if (line1) line1.textContent = data.hero.line1;
        const line2 = document.getElementById('hero-line2');
        if (line2) line2.textContent = data.hero.line2;
        const desc = document.querySelector('main p');
        if (desc) desc.textContent = data.hero.desc;
    }
    if (data.codeEntry) {
        const title = document.querySelector('#code-entry-section h2');
        if (title) title.textContent = data.codeEntry.title;
        const desc = document.querySelector('#code-entry-section p');
        if (desc) desc.textContent = data.codeEntry.desc;
        const input = document.getElementById('expert-code-input');
        if (input) input.placeholder = data.codeEntry.placeholder;
        const btn = document.querySelector('#code-entry-section button');
        if (btn) btn.textContent = data.codeEntry.btnText;
    }
}

// 구글 드라이브 이미지 공유 URL 최적화 헬퍼 함수
function optimizeImageUrl(url) {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
        let fileId = '';
        const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        
        if (fileDMatch && fileDMatch[1]) {
            fileId = fileDMatch[1];
        } else if (idParamMatch && idParamMatch[1]) {
            fileId = idParamMatch[1];
        }
        
        if (fileId) {
            return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
        }
    }
    return url;
}

function initPersonalPage() {
    initDropdowns();
    initFAQAccordions();

    // 1. 스플래시 화면 제어 및 상태 진행 표시
    const splash = document.getElementById('splash-screen');
    const progressBar = document.getElementById('splash-progress-bar');
    const progressText = document.getElementById('splash-percentage');
    const carouselItems = document.querySelectorAll('.splash-text-item');

    let startTime = Date.now();
    const totalDuration = 5000;
    let carouselIndex = 0;

    const splashInterval = setInterval(() => {
        if (carouselIndex < carouselItems.length - 1) {
            carouselItems[carouselIndex].classList.remove('active');
            carouselItems[carouselIndex].classList.add('exit');
            carouselIndex++;
            carouselItems[carouselIndex].classList.remove('exit');
            carouselItems[carouselIndex].classList.add('active');
        }
    }, 1250);

    function updateProgress() {
        const elapsed = Date.now() - startTime;
        if (elapsed >= totalDuration) {
            if (progressBar) progressBar.style.width = '100%';
            if (progressText) progressText.innerText = '100%';
            clearInterval(splashInterval);
            finishSplash();
            return;
        }

        const t = elapsed / totalDuration;
        let rawProgress = (1 - Math.pow(1 - t, 3)) * 100;
        let jitter = (Math.random() * 3 - 1.5);
        let displayProgress = Math.min(99, Math.max(0, rawProgress + jitter));

        if (progressBar) progressBar.style.width = displayProgress + '%';
        if (progressText) progressText.innerText = Math.floor(displayProgress) + '%';

        requestAnimationFrame(updateProgress);
    }

    requestAnimationFrame(updateProgress);

    function finishSplash() {
        setTimeout(() => {
            if (splash) {
                splash.classList.add('opacity-0', '-translate-y-4');
                setTimeout(() => {
                    splash.style.display = 'none';
                    document.body.classList.remove('overflow-hidden');

                    const h1 = document.getElementById('hero-line1');
                    const h2 = document.getElementById('hero-line2');
                    if (h1) h1.classList.add('animate-reveal');
                    if (h2) {
                        setTimeout(() => {
                            h2.classList.add('animate-reveal');
                        }, 1200);
                    }
                }, 600);
            }
        }, 200);
    }

    // 2. URL 파라미터에서 코드 분석하여 프로필 자동 로드
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('code');
    if (codeParam && codeParam.length === 6) {
        loadExpertProfile(codeParam);
    } else {
        const entrySec = document.getElementById('code-entry-section');
        if (entrySec) entrySec.classList.remove('hidden');
    }

    // 3. reveal 애니메이션 감지
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// 4. 전문가 코드 체크 및 상세 로드 실시간 비즈니스 함수 전역 바인딩
window.checkExpertCode = function() {
    const input = document.getElementById('expert-code-input');
    const code = input ? input.value.trim() : '';
    if (!code || code.length !== 6) {
        alert('올바른 6자리 코드를 입력해 주세요.');
        return;
    }
    loadExpertProfile(code);
};

window.loadExpertProfile = function(code) {
    if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
        const database = firebase.database();
        database.ref('approved_users/' + code).once('value')
            .then((snapshot) => {
                const data = snapshot.val();
                if (data) {
                    currentCode = code;
                    bindDynamicProfile(data, code);
                } else {
                    alert('유효하지 않은 코드이거나 존재하지 않는 전문가 페이지입니다.');
                    const entrySec = document.getElementById('code-entry-section');
                    if (entrySec) entrySec.classList.remove('hidden');
                }
            })
            .catch((err) => {
                console.error("Profile load fail: ", err);
                const entrySec = document.getElementById('code-entry-section');
                if (entrySec) entrySec.classList.remove('hidden');
            });
    } else {
        // 로컬 테스트 폴백
        console.warn("Firebase SDK 미로드. 폴백 프로필을 불러옵니다.");
        if (code === '123456') {
            currentCode = code;
            const mockData = {
                name: "홍길동 박사",
                role: "상임 연구위원",
                position: "상임 연구위원",
                imageUrl: "images/menu3/menu_3_1.jpg",
                experience: "서울대학교 교육심리학 박사\n前 한국청소년정책연구원 자문위원\n자기이해지도사 1급 마스터",
                specialty: "다면적 기질 특성론 연구, 대기업 HR 리더십 그룹 코칭 설계",
                introduce: "15년간 인간 기질 데이터 분석 알고리즘을 설계해 온 대한민국 교육 표준의 선두주자입니다."
            };
            bindDynamicProfile(mockData, code);
        } else {
            alert('로컬 테스트 코드는 123456 입니다.');
            const entrySec = document.getElementById('code-entry-section');
            if (entrySec) entrySec.classList.remove('hidden');
        }
    }
};

function bindDynamicProfile(data, code) {
    if (data.imageUrl && document.getElementById('dynamic-img')) {
        document.getElementById('dynamic-img').src = optimizeImageUrl(data.imageUrl);
        document.getElementById('dynamic-img').alt = data.name + ' 프로필';
    }
    if (data.name && document.getElementById('dynamic-name')) {
        document.getElementById('dynamic-name').innerText = data.name;
    }
    if (data.experience && document.getElementById('dynamic-experience')) {
        document.getElementById('dynamic-experience').innerText = data.experience;
    }
    if (data.specialty && document.getElementById('dynamic-specialty')) {
        document.getElementById('dynamic-specialty').innerText = data.specialty;
    }
    if (data.introduce && document.getElementById('dynamic-introduce')) {
        document.getElementById('dynamic-introduce').innerText = `"${data.introduce}"`;
    }
    if (document.getElementById('dynamic-position')) {
        document.getElementById('dynamic-position').innerText = "파트너 강사";
    }

    // 주소창에 파라미터 업데이트 (새로고침/복사 시 상태 유지)
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?code=' + code;
    window.history.replaceState({ path: newUrl }, '', newUrl);

    // 프로필 레이아웃 전면 노출 및 상단 '예약하기' 버튼들 활성화
    const entrySec = document.getElementById('code-entry-section');
    if (entrySec) entrySec.classList.add('hidden');
    const profileSec = document.getElementById('profile-display-section');
    if (profileSec) profileSec.classList.remove('hidden');
    const navBtn = document.getElementById('nav-booking-btn');
    if (navBtn) navBtn.classList.remove('hidden');
    const mobBtn = document.getElementById('mobile-booking-btn');
    if (mobBtn) mobBtn.classList.remove('hidden');

    document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
}

// 5. 단계별 예약 폼 처리 로직
window.goToStep = function(step) {
    const steps = [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3')
    ];

    const currentStepEl = steps.find(el => el && !el.classList.contains('hidden'));

    if (currentStepEl && currentStepEl.id !== `step-${step}`) {
        currentStepEl.style.transition = 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out';
        currentStepEl.style.opacity = '0';
        currentStepEl.style.transform = 'translateY(-10px)';

        setTimeout(() => {
            currentStepEl.classList.add('hidden');
            currentStepEl.style.opacity = '';
            currentStepEl.style.transform = '';

            const nextStepEl = document.getElementById(`step-${step}`);
            if (nextStepEl) {
                nextStepEl.classList.remove('hidden');
                nextStepEl.style.opacity = '0';
                nextStepEl.style.transform = 'translateY(10px)';
                nextStepEl.style.transition = 'opacity 0.25s ease-out, transform 0.25s ease-out';

                nextStepEl.offsetHeight;

                nextStepEl.style.opacity = '1';
                nextStepEl.style.transform = 'translateY(0)';

                setTimeout(() => {
                    nextStepEl.style.opacity = '';
                    nextStepEl.style.transform = '';
                    nextStepEl.style.transition = '';
                }, 250);
            }
        }, 200);
    } else {
        steps.forEach(el => {
            if (el) el.classList.add('hidden');
        });
        const nextStepEl = document.getElementById(`step-${step}`);
        if (nextStepEl) {
            nextStepEl.classList.remove('hidden');
        }
    }
};

window.nextStep = function(currentStep) {
    const form = document.getElementById('consultation-form');
    if (currentStep === 1) {
        if (form && !form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const days = Array.from(document.querySelectorAll('input[name="consDays"]:checked')).map(el => el.value);
        if (days.length === 0) {
            alert('최소 하나의 희망 요일을 선택해 주세요.');
            return;
        }

        const typeEl = document.querySelector('input[name="consType"]:checked');
        const timeEl = document.querySelector('input[name="consTime"]:checked');
        const nameEl = document.getElementById('userName');
        const ageEl = document.getElementById('userAge');
        const phoneEl = document.getElementById('userPhone');

        if (document.getElementById('summary-type')) document.getElementById('summary-type').textContent = typeEl ? typeEl.value : '';
        if (document.getElementById('summary-days')) document.getElementById('summary-days').textContent = days.join(', ') + '요일';
        if (document.getElementById('summary-time')) document.getElementById('summary-time').textContent = timeEl ? timeEl.value : '';
        if (document.getElementById('summary-name')) document.getElementById('summary-name').textContent = nameEl ? nameEl.value : '';
        if (document.getElementById('summary-contact')) document.getElementById('summary-contact').textContent = `${ageEl ? ageEl.value : ''}세 / ${phoneEl ? phoneEl.value : ''}`;

        goToStep(2);
    }
    else if (currentStep === 2) {
        const days = Array.from(document.querySelectorAll('input[name="consDays"]:checked')).map(el => el.value);
        const expertNameEl = document.getElementById('dynamic-name');
        const expertName = expertNameEl ? expertNameEl.innerText.trim() : '';

        const bookingData = {
            expertCode: currentCode || '',
            expertName: expertName,
            consType: document.querySelector('input[name="consType"]:checked').value,
            consDays: days,
            consTime: document.querySelector('input[name="consTime"]:checked').value,
            userName: document.getElementById('userName').value.trim(),
            userAge: parseInt(document.getElementById('userAge').value, 10),
            userPhone: document.getElementById('userPhone').value.trim(),
            submittedAt: new Date().toISOString()
        };

        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            const database = firebase.database();
            database.ref('bookings').push(bookingData)
                .then(() => {
                    goToStep(3);
                })
                .catch((error) => {
                    console.error("Booking reservation database push failed: ", error);
                    alert("예약 신청에 실패했습니다. 잠시 후 다시 시도해 주세요.");
                });
        } else {
            console.warn("Firebase SDK 미로드. 로컬 가상 예약 처리 완료.");
            goToStep(3);
        }
    }
};
