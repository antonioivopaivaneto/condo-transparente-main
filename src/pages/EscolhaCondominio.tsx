"use client";

import { useNavigate } from "react-router-dom";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Home } from "lucide-react";

const EscolherUnidade = () => {
  const navigate = useNavigate();

  const [selectedCondo, setSelectedCondo] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  const condominios = [
    {
      id: "cond1",
      nome: "Condomínio Jardim das Palmeiras",
      unidades: ["Bloco A - 101", "Bloco A - 202", "Bloco B - 305"],
    },
    {
      id: "cond2",
      nome: "Residencial Bela Vista",
      unidades: ["Torre 1 - 12", "Torre 2 - 34"],
    },
  ];

  const handleSelectCondo = (id: string) => {
    if (selectedCondo === id) {
      setSelectedCondo(null);
      setSelectedUnit(null);
    } else {
      setSelectedCondo(id);
      setSelectedUnit(null);
    }
  };

  const handleSelectUnit = (unit: string) => {
    setSelectedUnit(unit);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-2xl border-border shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">
            Escolha seu Condomínio e Unidade
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Selecione em qual condomínio e unidade deseja acessar
          </p>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {condominios.map((cond) => (
              <div
                key={cond.id}
                className={`p-4 border rounded-lg cursor-pointer transition ${
                  selectedCondo === cond.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-secondary/30"
                }`}
                onClick={() => handleSelectCondo(cond.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">
                      {cond.nome}
                    </span>
                  </div>
                </div>

                {/* Se expandido, mostra as unidades */}
                {selectedCondo === cond.id && (
                  <div className="mt-3 space-y-2 pl-7">
                    {cond.unidades.map((unit) => (
                      <div
                        key={unit}
                        className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition ${
                          selectedUnit === unit
                            ? "bg-primary text-white"
                            : "bg-secondary hover:bg-secondary/50 text-foreground"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectUnit(unit);
                        }}
                      >
                        <Home className="h-4 w-4" />
                        <span className="text-sm font-medium">{unit}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Botão Avançar */}
          <div className="mt-6 text-center">
            <Button
              disabled={!selectedCondo || !selectedUnit}
              className="w-full"
              onClick={() =>
                 navigate(
                  `/morador?condominio=${selectedCondo}&unidade=${selectedUnit}`
                )
              }
            >
              Avançar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EscolherUnidade;
