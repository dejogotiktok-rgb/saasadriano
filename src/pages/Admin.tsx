import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Users, DollarSign, Settings, Save } from "lucide-react";

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  has_lifetime_access: boolean;
  updated_at: string;
}

export default function Admin() {
  const { isAdmin } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState<number>(247.90);
  const [savingPrice, setSavingPrice] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchProfiles();
      fetchSettings();
    }
  }, [isAdmin]);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      toast.error("Erro ao carregar perfis. Verifique se a tabela profiles está correta.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("app_config")
        .select("value")
        .eq("key", "product_price")
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Key doesn't exist, use default
          return;
        }
        throw error;
      }
      if (data) setPrice(Number(data.value));
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Erro ao carregar configurações. Certifique-se que a tabela 'app_config' existe.");
    }
  };

  const updatePrice = async () => {
    setSavingPrice(true);
    try {
      const { error } = await supabase
        .from("app_config")
        .upsert({ key: "product_price", value: price.toString() }, { onConflict: "key" });

      if (error) throw error;
      toast.success("Preço atualizado com sucesso!");
    } catch (error) {
      console.error("Error updating price:", error);
      toast.error("Erro ao atualizar preço. Certifique-se que a tabela 'app_config' existe.");
    } finally {
      setSavingPrice(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="w-full max-w-md p-6 bg-card border rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-destructive text-center mb-2">Acesso Negado</h2>
          <p className="text-muted-foreground text-center">
            Você não tem permissão para acessar esta área.
          </p>
        </div>
      </div>
    );
  }

  const buyers = profiles.filter(p => p.has_lifetime_access);

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Painel Administrativo</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profiles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buyers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Estimada</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(buyers.length * price)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" /> Configurações do Sistema
          </CardTitle>
          <CardDescription>Gerencie valores e configurações globais</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2 max-w-sm">
            <label className="text-sm font-medium">Preço do Produto (R$)</label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
              <Button onClick={updatePrice} disabled={savingPrice}>
                {savingPrice ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Salvar
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground italic">
              * Nota: Requer tabela 'app_config' no Supabase com colunas 'key' (text, primary) e 'value' (text).
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuários que Adquiriram</CardTitle>
          <CardDescription>Lista de clientes com acesso vitalício</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buyers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground italic">
                        Nenhuma venda realizada ainda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    buyers.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell className="font-medium">{profile.email}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Ativo
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(profile.updated_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
