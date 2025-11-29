"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Trophy, Medal, Award, User } from "lucide-react"
import { getRanking } from "@/app/actions"

interface RankingEntry {
  name: string
  age: number
}

export function RankingPanel() {
  const [ranking, setRanking] = useState<RankingEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadRanking = async () => {
    setIsLoading(true)
    try {
      const data = await getRanking()
      setRanking(data)
    } catch (error) {
      console.error("Error loading ranking:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRanking()

    // Listen for reload events
    const handleReload = () => loadRanking()
    window.addEventListener("reloadRanking", handleReload)
    return () => window.removeEventListener("reloadRanking", handleReload)
  }, [])

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-600" />
      case 1:
        return <Medal className="h-5 w-5 text-slate-400" />
      case 2:
        return <Award className="h-5 w-5 text-amber-700" />
      default:
        return <User className="h-5 w-5 text-slate-400" />
    }
  }

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">1º Lugar</Badge>
      case 1:
        return <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">2º Lugar</Badge>
      case 2:
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">3º Lugar</Badge>
      default:
        return (
          <Badge variant="outline" className="text-slate-600">
            {index + 1}º
          </Badge>
        )
    }
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50/50">
        <CardTitle>Ranking por Idade</CardTitle>
        <CardDescription>
          Ordenado da maior idade para a menor • Total: {ranking.length} {ranking.length === 1 ? "pessoa" : "pessoas"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : ranking.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <User className="mb-4 h-12 w-12 text-slate-300" />
            <p className="text-sm text-slate-500">Nenhuma pessoa cadastrada ainda.</p>
            <p className="text-xs text-slate-400">Adicione o primeiro cadastro ao lado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-24">Posição</TableHead>
                  <TableHead>Nome e Matrícula</TableHead>
                  <TableHead className="text-right">Idade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ranking.map((entry, index) => (
                  <TableRow key={`${entry.name}-${index}`} className="group">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRankIcon(index)}
                        {getRankBadge(index)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">{entry.name}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-900">
                        {entry.age} anos
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
