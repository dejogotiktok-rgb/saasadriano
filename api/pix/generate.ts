import { createClient } from '@supabase/supabase-js';

const GOUPAY_API_KEY = "gou_live_ce168d1dedfb46a5bc51c2b9e236bd26";

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { amount, description, customer } = req.body;

    try {
        const response = await fetch("https://www.goupay.com.br/api/v1/pix", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": GOUPAY_API_KEY
            },
            body: JSON.stringify({
                amount,
                description: "Acesso Vitalicio Vitrino",
                customer: {
                    name: customer.name || "Cliente Vitrino",
                    email: customer.email,
                    cpf: "12345678900",
                    phone: "11999999999"
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("GouPay API Error:", data);
            return res.status(response.status).json({
                success: false,
                message: data.message || "Erro na API da GouPay",
                details: data
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error("Internal Payment Error:", error);
        return res.status(500).json({ success: false, message: "Erro interno ao processar pagamento" });
    }
}
