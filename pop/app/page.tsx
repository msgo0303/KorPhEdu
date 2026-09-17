import { Announcement } from "@/components/announcement/Announcement"
import { exampleAnnouncement } from "@/lib/announcement-data"

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <span className="text-[17px] font-bold tracking-tight text-slate-900">한빛 교육기관</span>
          <nav className="hidden items-center gap-6 text-[14px] font-medium text-slate-600 sm:flex">
            <a href="#" className="transition-colors hover:text-slate-900">
              소개
            </a>
            <a href="#" className="transition-colors hover:text-slate-900">
              프로그램
            </a>
            <a href="#" className="transition-colors hover:text-slate-900">
              공지사항
            </a>
            <a href="#" className="transition-colors hover:text-slate-900">
              문의
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 pt-10 sm:pt-16">
        <div className="overflow-hidden rounded-3xl bg-slate-900">
          <img
            src="/images/hero-campus.png"
            alt="한빛 교육기관 캠퍼스 전경"
            crossOrigin="anonymous"
            className="h-56 w-full object-cover opacity-90 sm:h-80"
          />
        </div>
        <div className="mt-6">
          <p className="text-[13px] font-semibold text-blue-600">HANBIT INSTITUTE</p>
          <h1 className="mt-2 text-[26px] font-bold leading-tight text-slate-900 sm:text-[32px]">
            함께 배우고, 함께 성장하는
            <br />
            교육의 공간입니다
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-slate-500">
            학생 한 명 한 명의 가능성을 존중하며, 실질적인 배움과 성장을 지원하는 프로그램을 운영하고 있습니다.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-12">
        <h2 className="text-[18px] font-bold text-slate-900">주요 프로그램</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            { title: "정규 교육과정", desc: "체계적인 커리큘럼으로 기초부터 심화까지 학습합니다." },
            { title: "방과 후 활동", desc: "다양한 특별활동으로 폭넓은 경험을 쌓습니다." },
            { title: "진로 상담", desc: "전문 상담사와 함께 진로를 설계합니다." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-[15px] font-bold text-slate-900">{item.title}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-8 text-[13px] text-slate-400">
          <p>© 2026 한빛 교육기관. All rights reserved.</p>
        </div>
      </footer>

      <Announcement announcement={exampleAnnouncement} />
    </main>
  )
}
