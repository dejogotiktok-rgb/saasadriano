import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Using Service Role for server-side updates

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    try {
        const body = req.body;
        console.log("[Webhook GouPay] Payload Processado:", JSON.stringify(body, null, 2));

        // Deep search for event, ID and status as in site gou
        const event = body.event || body.type || body.data?.event || body.request?.event;
        const txid = body.data?.ID || body.ID || body.data?.id || body.id || body.transaction_id || body.request?.id || body.pix?.id || body.pdu?.id;
        const status = body.data?.status || body.status || body.payload?.status || body.pix?.status || body.pdu?.status;
        const customer = body.customer || body.payload?.customer || body.data?.customer;

        console.log(`[Webhook GouPay] Evento: ${event}, ID: ${txid}, Status: ${status}`);

        const isPaid = event?.includes("paid") ||
            event?.includes("success") ||
            ['paid', 'completed', 'success', 'approved', 'pago', 'concluido'].includes(String(status).toLowerCase());

        if (isPaid && customer?.email) {
            const url = process.env.VITE_SUPABASE_URL;
            const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

            if (!url || !serviceKey) {
                console.error("Supabase environment variables missing");
                return res.status(500).json({ error: "Configuração do servidor incompleta" });
            }

            const supabase = createClient(url, serviceKey);

            // Find profile by email
            const { data: userData, error: userError } = await supabase
                .from('profiles')
                .select('id, has_lifetime_access')
                .eq('email', customer.email)
                .maybeSingle();

            if (userError) {
                console.error("Error searching user:", userError);
                return res.status(500).json({ error: "Erro ao buscar usuário" });
            }

            if (!userData) {
                // IMPORTANT: If user doesn't exist in profiles yet, create it!
                // This handles cases where user pays before ever logging into the dashboard
                console.log(`User ${customer.email} not found, creating new profile...`);
                const { error: insertError } = await supabase
                    .from('profiles')
                    .insert([{
                        email: customer.email,
                        has_lifetime_access: true,
                        updated_at: new Date().toISOString()
                    }]);
                
                if (insertError) {
                    console.error("Error creating profile in webhook:", insertError);
                    return res.status(500).json({ error: "Erro ao criar perfil" });
                }
            } else {
                // User exists, just update access
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({
                        has_lifetime_access: true,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', userData.id);

                if (updateError) {
                    console.error("Error updating profile:", updateError);
                    return res.status(500).json({ error: "Erro ao atualizar acesso" });
                }
            }

            console.log(`SUCCESS: Access granted to ${customer.email}`);
            return res.status(200).json({ success: true, message: "Acesso vitalício concedido!" });
        }

        return res.status(200).json({ success: true, message: "Webhook recebido (não processado)" });
    } catch (error) {
        console.error("Webhook Internal Error:", error);
        return res.status(500).json({ error: "Erro interno" });
    }
}
