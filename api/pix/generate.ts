import { createClient } from '@supabase/supabase-js';

const GOUPAY_API_KEY = "gou_live_39185fce840443e4ac267b5ccaa3a488";

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { amount, description, customer } = req.body;

    // GouPay expects amount in cents
    const amountInCents = Math.round(Number(amount));
    // Clean CPF (remove non-digits)
    const cleanCpf = (customer.cpf || "12345678900").replace(/\D/g, "");

    try {
        const response = await fetch("https://www.goupay.com.br/api/v1/pix", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": GOUPAY_API_KEY
            },
            body: JSON.stringify({
                amount: amountInCents,
                description: "Compra na Vitrino",
                customer: {
                    name: customer.name || "Cliente Vitrino",
                    email: customer.email,
                    cpf: cleanCpf,
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

        // Robust extraction from site gou
        const qrCodeText = data.data?.pix_qr_code || data.pix?.qr_code || data.pdu?.qr_code || data.pix_qr_code || data.pdu_qr_code;
        const transactionId = data.transaction_id || data.data?.transaction_id || data.id || data.ID || data.data?.id;

        return res.status(200).json({
            success: true,
            transaction_id: transactionId,
            pix: {
                qr_code: qrCodeText
            }
        });
    } catch (error) {
        console.error("Internal Payment Error:", error);
        return res.status(500).json({ success: false, message: "Erro interno ao processar pagamento" });
    }
}
