"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save } from "lucide-react"
import { savePerson } from "@/app/actions"

export function CensusForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    matricula: "",
    nomeCompleto: "",
    endereco: "",
    telefone: "",
    idade: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await savePerson({
        matricula: formData.matricula,
        nomeCompleto: formData.nomeCompleto,
        endereco: formData.endereco,
        telefone: formData.telefone,
        idade: Number.parseInt(formData.idade),
      })

      if (result.success) {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: `${formData.nomeCompleto} foi adicionado ao sistema.`,
          duration: 4000,
        })

        // Reset form
        setFormData({
          matricula: "",
          nomeCompleto: "",
          endereco: "",
          telefone: "",
          idade: "",
        })

        // Reload ranking
        window.dispatchEvent(new Event("reloadRanking"))
      } else {
        toast({
          title: "Erro na validação",
          description: result.error,
          variant: "destructive",
          duration: 5000,
        })
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao processar seu cadastro.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50/50">
        <CardTitle>Novo Cadastro</CardTitle>
        <CardDescription>Preencha os dados abaixo para adicionar uma pessoa ao censo</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="matricula">Matrícula *</Label>
            <Input
              id="matricula"
              placeholder="Ex: 12345"
              value={formData.matricula}
              onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
              required
              disabled={isLoading}
              className="border-slate-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nomeCompleto">Nome Completo *</Label>
            <Input
              id="nomeCompleto"
              placeholder="Ex: João da Silva"
              value={formData.nomeCompleto}
              onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
              required
              disabled={isLoading}
              className="border-slate-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              placeholder="Ex: Rua das Flores, 123"
              value={formData.endereco}
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              disabled={isLoading}
              className="border-slate-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              placeholder="Ex: (11) 98765-4321"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              disabled={isLoading}
              className="border-slate-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="idade">Idade *</Label>
            <Input
              id="idade"
              type="number"
              placeholder="Ex: 25"
              value={formData.idade}
              onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
              required
              min="0"
              max="150"
              disabled={isLoading}
              className="border-slate-300"
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-slate-900 hover:bg-slate-800">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Cadastrar Pessoa
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
