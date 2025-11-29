import { CensusForm } from "@/components/census-form"
import { RankingPanel } from "@/components/ranking-panel"
import { Users, TrendingUp } from "lucide-react"

export const dynamic = "force-dynamic"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Sistema de Censo e Ranking</h1>
              <p className="text-sm text-slate-600">Cadastro e análise demográfica por idade</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form Section */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-slate-700" />
              <h2 className="text-lg font-semibold text-slate-900">Cadastro de Pessoa</h2>
            </div>
            <CensusForm />
          </section>

          {/* Ranking Section */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-slate-700" />
              <h2 className="text-lg font-semibold text-slate-900">Ranking dos Mais Velhos</h2>
            </div>
            <RankingPanel />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t bg-white py-6">
        <div className="container mx-auto px-4 text-center text-sm text-slate-600">
          Sistema de Censo e Ranking de Idade • Desenvolvido com Next.js e Redis
        </div>
      </footer>
    </div>
  )
}
