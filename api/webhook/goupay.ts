import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Using Service Role for server-side updates

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { status, transaction_id, customer } = req.body;

    console.log(`Webhook GouPay: Transação ${transaction_id} | Status: ${status} | Cliente: ${customer?.email}`);

    if (status === 'paid' && customer?.email) {
        try {
            // Check for required env vars
            if (!supabaseUrl || !supabaseServiceKey) {
                console.error("Missing Supabase Environment Variables");
                return res.status(500).json({ error: "Configuração do servidor incompleta" });
            }

            // Find profile by email
            const { data: userData, error: userError } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', customer.email)
                .single();

            if (userError || !userData) {
                console.error(`User profile not found for email: ${customer.email}`, userError);
                // Return 200 to acknowledge webhook but log the error
                return res.status(200).json({ success: false, message: "Perfil não encontrado" });
            }

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ has_lifetime_access: true })
                .eq('id', userData.id);

            if (updateError) {
                console.error('Error updating access in Supabase:', updateError);
                return res.status(500).json({ success: false, error: "Falha ao atualizar acesso" });
            }

            console.log(`Sucesso: Acesso Vitalício liberado para ${customer.email}`);
            return res.status(200).json({ success: true, message: "Acesso liberado" });
        } catch (err) {
            console.error('Crash no processamento do Webhook:', err);
            return res.status(500).json({ success: false, error: "Erro interno no servidor" });
        }
    }

    return res.status(200).json({ success: true, message: 'Status ignorado ou dados incompletos' });
}
